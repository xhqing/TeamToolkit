#!/usr/bin/env python3
"""名册一致性检查（registry ↔ xhqing 主页 README 名册表格）。

为什么存在
----------
2026-10-26 用户立规：`~/.pi/agent/docs/agents-registry.md` 的任何改动（新增 / 删除
项目或 Agent、子项目归属变更）必须**第一时间**同步更新 `xhqing` 仓库 README 里的
名册表格（就是那张「Subprojects (🌐 public · 🔒 private)」），不是「下次顺手改」，
而是和 registry 改动在同一批里做完。本脚本就是这条规矩的「机器校验」——纯文本规矩
容易衰减，靠人肉比对必然漂移（2026-10-26 实测：registry 已有 diff-view /
ark-key-pool / NewsScoreStudy 三项，README 全无）。

它做什么
--------
除了两份 README 的集合比对，还会校验注册表里每个 Agent 项目的 `README.md`
是否真的挂着 `Type-AI Agent` 徽章——2026-11-09 用户立：**项目是不是 Agent 项目看
README 的 Type 徽章，不看项目名是否以 `Agent` 结尾**，所以徽章缺失 = 数据错误。

读三份文件做集合比对：

1. registry 的「智能体命名注册表」表（名称 / 项目）→ Agent 项目全集
2. registry 的「子项目映射」表（Agent 项目 / 子项目）→ 每个 Agent 的子项目全集
   （带删除线的「已移交」痕迹行自动跳过，如 `~~xxx~~ 已于 ... 移交`）
3. xhqing 仓库的两份 README（英文 README.md + 中文 README_cn.md）名册表格
   → 每个 Agent 行里的仓库链接集合

比对两个维度（每个 README 单独比，因为两个版本必须内容对齐）：

- **Agent 维度**：registry 有而 README 无（新 Agent 没进主页）/ README 有而 registry 无
- **子项目维度**：按 Agent 分组比子项目名，缺（registry 有、README 无）与
  多（README 有、registry 无）都报

豁免
----
`allowlist.json`（与本脚本同目录）登记**有意**暂不同步的条目 + 理由 + 日期——
例如「公开描述措辞待用户确认、确认前先不写进公开 README」。豁免命中时不计为漂移，
但在 `--json` 输出的 `allowlisted` 里列出来，仍然看得到。

用法
----
    python3 roster-sync-check.py              # 人读输出；有漂移 → 退出码 1
    python3 roster-sync-check.py --json       # 机器读（给 pi 扩展调用）
    python3 roster-sync-check.py --quiet      # 只在有漂移时输出

路径可用环境变量覆盖（默认值见下）：PI_AGENTS_REGISTRY / PI_ROSTER_README /
PI_ROSTER_README_CN / PI_ROSTER_ALLOWLIST。

注意：本脚本只查「名字集合」，不查**描述文字**、也不查 Host machine 列——那两样
靠人（Host 变更如 Mark 迁回本机，属 registry 宿主机段落，需手工同步）。
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

HOME = Path.home()
DEFAULT_REGISTRY = HOME / ".pi" / "agent" / "docs" / "agents-registry.md"
DEFAULT_README = HOME / "Developer" / "xhqing" / "README.md"
DEFAULT_README_CN = HOME / "Developer" / "xhqing" / "README_cn.md"
DEFAULT_ALLOWLIST = Path(__file__).resolve().parent / "allowlist.json"


# --------------------------------------------------------------------------- #
# registry 解析
# --------------------------------------------------------------------------- #
def parse_registry(text: str) -> dict:
    """返回 {"agents": {project: persona}, "subprojects": {project: set(repo)}}。"""
    agents: dict[str, str] = {}
    subprojects: dict[str, set[str]] = {}
    header: list[str] | None = None

    for raw in text.splitlines():
        line = raw.strip()
        if not line.startswith("|"):
            if header is not None and not line:
                header = None  # 表格结束
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
            continue  # 分隔行
        if header is None:
            header = cells
            continue
        if len(cells) != len(header):
            continue

        if "名称" in header[0] and any("项目" in h for h in header):
            # 智能体命名注册表：| 名称 | 项目（仓库） | 职称 | 职责 |
            project = cells[1].strip().strip("`")
            if project:
                agents[project] = cells[0].strip().strip("*`")
        elif any("子项目" in h for h in header):
            # 子项目映射：| Agent 项目 | 子项目（仓库） | 说明 |
            # 第一列形如 `assistant-agent（Kit）`：取括号前的项目名（不再要求以 Agent 结尾）
            repo_cell = cells[1].strip()
            agent_cell = cells[0].strip().strip("`* ")
            m = re.fullmatch(r"([A-Za-z0-9][A-Za-z0-9._-]*)", re.split(r"[（(]", agent_cell)[0].strip())
            if not m:
                continue
            if "~~" in line:
                # 「已移交」痕迹行（repo 名或说明带删除线，如 ~~xxx~~ 已于 ... 移交 Mark），不作数
                continue
            repo = repo_cell.strip("`* ")
            if repo:
                subprojects.setdefault(m.group(1), set()).add(repo)

    return {"agents": agents, "subprojects": subprojects}


# --------------------------------------------------------------------------- #
# README 名册解析
# --------------------------------------------------------------------------- #
def parse_readme(text: str) -> dict:
    """返回 {"agents": {project: {"host": str|None, "subs": set(repo)}}, "order": [...]}。"""
    agents: dict[str, dict] = {}
    order: list[str] = []
    for row in re.findall(r"<tr>(.*?)</tr>", text, re.S):
        cells = re.findall(r"<td>(.*?)</td>", row, re.S)
        if len(cells) < 4:
            continue
        first = cells[0]
        m = re.search(r"https://github\.com/xhqing/([A-Za-z0-9_.-]+)", first)
        if not m:
            continue
        project = m.group(1)
        host = re.sub(r"<[^>]+>", "", cells[2]).strip() or None
        subs = set(re.findall(r"https://github\.com/xhqing/([A-Za-z0-9_.-]+)", cells[-1]))
        subs.discard(project)
        agents[project] = {"host": host, "subs": subs}
        order.append(project)
    return {"agents": agents, "order": order}


# --------------------------------------------------------------------------- #
# 比对
# --------------------------------------------------------------------------- #
def lower_map(mapping: dict[str, set[str]]) -> dict[str, set[str]]:
    return {k.lower(): v for k, v in mapping.items()}


# --------------------------------------------------------------------------- #
# Agent 项目的判据：README 必须挂 Type-AI Agent 徽章（2026-11-09 用户立）
# --------------------------------------------------------------------------- #
AI_AGENT_BADGE = re.compile(r"badge/Type-AI(?:%20| )Agent")


def check_agent_badges(agents: dict[str, str]) -> list[dict]:
    """注册表里的 Agent 项目逐个查 README：缺文件或缺 `Type-AI Agent` 徽章都算错。"""
    issues = []
    for project in sorted(agents, key=str.lower):
        readme = HOME / "Developer" / project / "README.md"
        try:
            text = readme.read_text(encoding="utf-8")
        except OSError:
            issues.append({"project": project, "reason": "README.md 不存在"})
            continue
        if not AI_AGENT_BADGE.search(text):
            issues.append({"project": project, "reason": "README.md 缺 Type-AI Agent 徽章"})
    return issues


def compare(registry: dict, readme: dict, label: str, allowlist: dict) -> dict:
    allow_missing = {e.get("repo", "").lower(): e for e in allowlist.get("missing_in_readme", [])}
    allow_extra = {e.get("repo", "").lower(): e for e in allowlist.get("extra_in_readme", [])}
    allow_agents = {e.get("project", "").lower(): e for e in allowlist.get("agents", [])}

    reg_agents = {k: v for k, v in registry["agents"].items()}
    reg_subs = lower_map(registry["subprojects"])
    rd_agents = {k: v for k, v in readme["agents"].items()}
    rd_agents_ci = {k.lower(): k for k in rd_agents}

    missing_agents, extra_agents, allowlisted = [], [], []

    # Agent 维度（registry 表 vs README 行）
    for project in reg_agents:
        if project.lower() not in rd_agents_ci:
            entry = allow_agents.get(project.lower())
            if entry:
                allowlisted.append({"agent": label, "kind": "missing_agent", "project": project, "reason": entry.get("reason", "")})
            else:
                missing_agents.append({"project": project, "persona": reg_agents[project]})
    for project in rd_agents:
        if project.lower() not in {k.lower() for k in reg_agents}:
            entry = allow_agents.get(project.lower())
            if entry:
                allowlisted.append({"agent": label, "kind": "extra_agent", "project": project, "reason": entry.get("reason", "")})
            else:
                extra_agents.append({"project": project})

    # 子项目维度
    missing_subs, extra_subs = [], []
    all_agents = set(reg_subs) | {k.lower() for k in rd_agents}
    for agent_key in sorted(all_agents):
        reg_set = reg_subs.get(agent_key, set())
        rd_key = rd_agents_ci.get(agent_key)
        rd_set = rd_agents[rd_key]["subs"] if rd_key else set()
        rd_set_lower = {s.lower() for s in rd_set}
        reg_set_lower = {s.lower() for s in reg_set}

        for repo in sorted(reg_set, key=str.lower):
            if repo.lower() in rd_set_lower:
                continue
            entry = allow_missing.get(repo.lower())
            if entry:
                allowlisted.append({"agent": label, "kind": "missing_sub", "project": agent_key, "repo": repo, "reason": entry.get("reason", "")})
            else:
                missing_subs.append({"agent": agent_key, "repo": repo})
        for repo in sorted(rd_set, key=str.lower):
            if repo.lower() in reg_set_lower:
                continue
            entry = allow_extra.get(repo.lower())
            if entry:
                allowlisted.append({"agent": label, "kind": "extra_sub", "project": agent_key, "repo": repo, "reason": entry.get("reason", "")})
            else:
                extra_subs.append({"agent": agent_key, "repo": repo})

    return {
        "readme": label,
        "missing_agents": missing_agents,
        "extra_agents": extra_agents,
        "missing_subprojects": missing_subs,
        "extra_subprojects": extra_subs,
        "allowlisted": allowlisted,
    }


# --------------------------------------------------------------------------- #
# 主流程
# --------------------------------------------------------------------------- #
def load(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    quiet = "--quiet" in argv

    registry_path = Path(os.environ.get("PI_AGENTS_REGISTRY", DEFAULT_REGISTRY)).expanduser()
    readme_path = Path(os.environ.get("PI_ROSTER_README", DEFAULT_README)).expanduser()
    readme_cn_path = Path(os.environ.get("PI_ROSTER_README_CN", DEFAULT_README_CN)).expanduser()
    allowlist_path = Path(os.environ.get("PI_ROSTER_ALLOWLIST", DEFAULT_ALLOWLIST)).expanduser()

    reg_text = load(registry_path)
    if reg_text is None:
        print(f"[roster-sync] registry 不存在：{registry_path}", file=sys.stderr)
        return 2  # 不算漂移，但也不是「通过」——调用方应视为跳过

    registry = parse_registry(reg_text)
    if not registry["agents"] or not registry["subprojects"]:
        print(f"[roster-sync] registry 解析失败（表格未识别）：{registry_path}", file=sys.stderr)
        return 2

    allowlist: dict = {}
    al_text = load(allowlist_path)
    if al_text:
        try:
            allowlist = json.loads(al_text)
        except json.JSONDecodeError as exc:
            print(f"[roster-sync] allowlist 解析失败：{allowlist_path}（{exc}）", file=sys.stderr)

    readmes = [(readme_path, "README.md"), (readme_cn_path, "README_cn.md")]
    reports = []
    skipped = []
    for path, label in readmes:
        text = load(path)
        if text is None:
            skipped.append(str(path))
            continue
        reports.append(compare(registry, parse_readme(text), label, allowlist))

    drift = any(
        r["missing_agents"] or r["extra_agents"] or r["missing_subprojects"] or r["extra_subprojects"]
        for r in reports
    )
    badge_issues = check_agent_badges(registry["agents"])
    drift = drift or bool(badge_issues)

    if as_json:
        print(
            json.dumps(
                {
                    "ok": not drift,
                    "registry": str(registry_path),
                    "reports": reports,
                    "badge_issues": badge_issues,
                    "skipped_readmes": skipped,
                },
                ensure_ascii=False,
                indent=2,
            )
        )
    elif not quiet or drift:
        print(f"[roster-sync] registry：{registry_path}")
        for r in reports:
            print(f"\n== {r['readme']} ==")
            if not (r["missing_agents"] or r["extra_agents"] or r["missing_subprojects"] or r["extra_subprojects"]):
                print("  ✅ 名册与 registry 一致")
            for a in r["missing_agents"]:
                print(f"  ❌ 缺 Agent 行：{a['project']}（{a['persona']}）")
            for a in r["extra_agents"]:
                print(f"  ❌ 多出 Agent 行：{a['project']}（registry 里没有）")
            for s in r["missing_subprojects"]:
                print(f"  ❌ 缺子项目：{s['agent']} → {s['repo']}（registry 有、README 无）")
            for s in r["extra_subprojects"]:
                print(f"  ❌ 多出子项目：{s['agent']} → {s['repo']}（README 有、registry 无）")
            for e in r["allowlisted"]:
                target = e.get("repo") or e.get("project")
                print(f"  ⏸️  已豁免：{e['kind']} {e['agent']} → {target}（{e['reason']}）")
        if skipped:
            print("\n跳过（文件不存在）：" + "、".join(skipped))
        for b in badge_issues:
            print(f"  ❌ Agent 项目徽章：{b['project']} — {b['reason']}")
        if drift:
            print("\n[roster-sync] 漂移未修复：按 2026-10-26 用户规则，registry 改动必须与 xhqing README" " 名册在同一批里更新（英文 + 中文两份都要改）。")

    return 1 if drift else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
