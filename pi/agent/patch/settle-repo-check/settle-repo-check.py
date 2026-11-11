#!/usr/bin/env python3
"""子项目仓库收尾巡检（2026-10-09 用户立规的配套工具强制）。

用户规则：所有 Agent 会话结束任务之前，都要检查自己负责的子项目仓库是否干净，
不干净的全部要处理干净（规则正文见全局 ~/.pi/agent/AGENTS.md「会话收尾检查」节）。

用法：
  settle-repo-check.py --cwd <dir> [--json]   # pi 端扩展 settle-repo-check.ts 调用
  settle-repo-check.py --cc-stop              # CC 端 Stop hook：stdin 读 hook JSON，
                                              # 未干净时 exit 2 阻断收尾（stderr 给 Claude 理由）；
                                              # stop_hook_active 时直接放行（防循环）

逻辑：
  - 由 cwd（Agent 项目目录，或某个子项目目录）在 ~/.claude/docs/agents-registry.md 的
    「子项目映射」表里定位所属 Agent 与它的全部子项目；
  - 逐个 `git status --porcelain`（目录不存在 / 非 git 的跳过）；
  - cwd 不属于任何 Agent / 子项目 → 无此项、静默通过（exit 0）。
"""

import json
import os
import re
import subprocess
import sys

# 权威源是 ~/.pi/agent/docs/agents-registry.md。历史上这里还回退读过
# ~/.claude/ 下的副本，那份早就停更；2026-11-11 起其它 harness 一律不维护，
# 回退项一并删掉——找不到 registry 就让巡检报错，不猜第二份。
REG_CANDIDATES = [os.path.expanduser("~/.pi/agent/docs/agents-registry.md")]
DEV = os.path.expanduser("~/Developer")


def _sh(args, cwd=None):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


def registry_rows():
    """从注册表「子项目映射」表取 [(Agent 项目名, 子项目目录名)]。"""
    text = None
    for path in REG_CANDIDATES:
        try:
            text = open(path, encoding="utf-8").read()
            break
        except OSError:
            continue
    if text is None:
        return []
    m = re.search(r"\*\*子项目映射.*?\n\n(\|.*?)\n\n", text, re.S)
    if not m:
        return []
    rows = []
    for line in m.group(1).splitlines():
        if not line.startswith("|") or line.startswith("|---") or ("Agent 项目" in line and "子项目" in line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) >= 3:
            rows.append((cells[0].split("（")[0].strip(), re.split(r"[（(]", cells[1])[0].strip()))
    return rows


def find_agent(cwd, rows):
    """cwd 是 Agent 项目 → 它自己；cwd 是某个子项目 → 归其 Agent；都不匹配 → None。

    大小写不敏感匹配：目录名与注册表写法可能不一致（如 dir `CC-Bridge` vs 表 `CC-BRIDGE`）。
    """
    name = os.path.basename(os.path.normpath(cwd))
    for a, _ in rows:
        if a.lower() == name.lower():
            return a
    for agent, proj in rows:
        if proj.lower() == name.lower():
            return agent
    return None


def dirty_repos(agent, rows):
    out = []
    for a, proj in rows:
        if a != agent:
            continue
        d = os.path.join(DEV, proj)
        if not os.path.isdir(os.path.join(d, ".git")):
            continue
        r = subprocess.run(
            ["git", "-C", d, "status", "--porcelain"], capture_output=True, text=True
        )
        if r.returncode == 0 and r.stdout.strip():
            out.append({"repo": proj, "changes": len(r.stdout.strip().splitlines()), "path": d})
    return out


def unpublished_repos(agent, rows):
    """自最新 tag 有 fix/feat 提交、但 VERSION 对应的 GitHub Release 不存在 → 漏发版。

    为什么加（2026-11-08）：发版自动衔接只挂在 /commit 流程末尾；走 PR + auto-merge
    的链路没有任何环节回头做这个检查——turn-diff 当天 23 个提交、7 个版本静默积压。
    这里**只提示、不自动发版**：发版必须走 /release 完整流程（打 tag 不易撤销）。
    """
    out = []
    for a, proj in rows:
        if a != agent:
            continue
        d = os.path.join(DEV, proj)
        if not os.path.isdir(os.path.join(d, ".git")):
            continue
        ver_file = os.path.join(d, "VERSION")
        if not os.path.isfile(ver_file):
            continue
        code, tag, _ = _sh(["git", "-C", d, "describe", "--tags", "--abbrev=0"])
        if code != 0 or not tag or not re.match(r"^v?\d+\.\d+", tag):
            continue  # 从未发版过：不判定（首次发版另说）
        code, log, _ = _sh(["git", "-C", d, "log", "--no-merges", "--format=%s", f"{tag}..HEAD"])
        if code != 0:
            continue
        subjects = [s for s in log.splitlines() if s.strip()]
        if not subjects or not any(re.match(r"^(fix|feat)(\(|!|:)", s, re.I) for s in subjects):
            continue  # 自上个版本起没有功能类改动 → 按 2026-10-13 门禁不触发发版
        try:
            version = open(ver_file, encoding="utf-8").read().strip().lstrip("vV")
        except OSError:
            continue
        if not version:
            continue
        code, _, err = _sh(["gh", "release", "view", f"v{version}", "--json", "tagName"], cwd=d)
        if code == 0:
            continue  # 该版本已发布
        if "not found" not in err.lower():
            continue  # 查询失败 / 未认证 → 不误报
        out.append({"repo": proj, "version": version, "commits": len(subjects), "path": d})
    return out


def _sweep_projects(agent, rows):
    """巡检要看的仓库清单：Agent 名下全部子项目 + Agent 项目自身仓库。

    为什么加自身仓库（2026-11-09）：旧版只扫注册表里的「子项目映射」行，Agent 项目
    自己的 worktree 从来不在扫描范围内——turn-diff 那轮把 worktree 建在
    dev-agent 上（分支 chore/subproject-turn-diff），PR 早已合并、
    目录却一直留着，巡检报不出来。用户当天追问「任务都做完了为什么 worktree 还在」。
    """
    projs = [proj for a, proj in rows if a == agent]
    if agent not in projs:
        projs.insert(0, agent)
    return projs


def stale_worktrees(agent, rows):
    """已合并、且工作区干净的残留 worktree（可清理）。

    为什么加（2026-11-08）：规则要求 Leader 收尾时 `git worktree remove`，但这是
    「靠人/AI 记得做」的步骤，没有工具提醒——turn-diff 当天堆了 13 个 worktree，
    没人发现。这里只**报告**（不自动删）：能判断「已合并 + 干净」就够了，删不删
    交给主人决定，避免误删在途 worktree。

    扫描范围见 `_sweep_projects()`（含 Agent 项目自身仓库，2026-11-09 补齐）。
    """
    out = []
    for proj in _sweep_projects(agent, rows):
        d = os.path.join(DEV, proj)
        if not os.path.isdir(os.path.join(d, ".git")):
            continue
        code, wt, _ = _sh(["git", "-C", d, "worktree", "list", "--porcelain"])
        if code != 0:
            continue
        entries, cur = [], {}
        for line in wt.splitlines():
            if line.startswith("worktree "):
                if cur:
                    entries.append(cur)
                cur = {"path": line[len("worktree "):]}
            elif line.startswith("branch "):
                cur["branch"] = line[len("branch "):].replace("refs/heads/", "")
        if cur:
            entries.append(cur)
        if len(entries) <= 1:
            continue  # 只有主工作区：没事可报（也避免白跑 gh）
        # 一次拿回已合并分支名（squash 合并后原提交与 main 无祖先关系，不能本地判断）
        code, br, _ = _sh(
            ["gh", "pr", "list", "--state", "merged", "--limit", "100",
             "--json", "headRefName", "--jq", ".[].headRefName"],
            cwd=d,
        )
        merged = set(br.splitlines()) if code == 0 else set()
        if not merged:
            continue
        for e in entries[1:]:
            branch = e.get("branch", "")
            path = e.get("path", "")
            if not branch or branch not in merged:
                continue
            c2, st, _ = _sh(["git", "-C", path, "status", "--porcelain"])
            if c2 != 0 or st.strip():
                continue  # 不干净 / 读不到：不是「用完的」worktree
            out.append({"repo": proj, "path": path, "branch": branch})
    return out


def main():
    args = sys.argv[1:]
    cc = "--cc-stop" in args
    cwd = None
    if "--cwd" in args:
        idx = args.index("--cwd")
        if idx + 1 < len(args):
            cwd = args[idx + 1]

    if cc:
        try:
            payload = json.load(sys.stdin)
        except Exception:
            payload = {}
        if payload.get("stop_hook_active"):
            sys.exit(0)  # 防循环：第二次收尾不再阻断
        cwd = payload.get("cwd") or os.getcwd()

    cwd = cwd or os.getcwd()
    rows = registry_rows()
    agent = find_agent(cwd, rows)
    if not agent:
        sys.exit(0)  # 非 Agent / 子项目会话 → 无此项

    dirty = dirty_repos(agent, rows)
    stale = unpublished_repos(agent, rows)
    leftover = stale_worktrees(agent, rows)

    if cc:
        if leftover:
            names = "、".join(f"{r['repo']}:{r['branch']}" for r in leftover)
            print(
                f"[settle-repo-check] 这些 worktree 已合并且干净，可以清理：{names}"
                "（`git worktree remove <路径>`）。",
                file=sys.stderr,
            )
        if stale:
            names = "、".join(f"{r['repo']}（v{r['version']}，{r['commits']} 个待发布提交）" for r in stale)
            print(
                f"[settle-repo-check] 这些子项目有功能类改动但版本未发布：{names}。"
                "按用户规则该发版的走 /release 发版（版本未就绪先 /bump）。",
                file=sys.stderr,
            )
        if dirty:
            names = "、".join(f"{r['repo']}（{r['changes']} 处改动）" for r in dirty)
            print(
                f"[settle-repo-check] 你名下还有 {len(dirty)} 个子项目仓库不干净：{names}。"
                "按用户 2026-10-09 立的规则，收尾前必须全部处理干净：各仓库按自己的流程 "
                "/add → /commit（该发版就照常发版）；在途 WIP（如 dev-workflow 先行的测试产物）"
                "向用户说明即可、不要硬提交。",
                file=sys.stderr,
            )
            sys.exit(2)
        sys.exit(0)

    result = {"agent": agent, "dirty": dirty, "unpublished": stale, "worktrees": leftover}
    if "--json" in args:
        print(json.dumps(result, ensure_ascii=False))
    else:
        if dirty:
            print(f"[settle-repo-check] {agent} 名下不干净的子项目仓库：")
            for r in dirty:
                print(f"  - {r['repo']}（{r['changes']} 处改动）")
        else:
            print(f"[settle-repo-check] {agent} 名下子项目仓库全部干净 ✅")
        if stale:
            print(f"[settle-repo-check] 有功能类改动但版本未发布（该走 /release）：")
            for r in stale:
                print(f"  - {r['repo']}：v{r['version']} 未发布，自最新 tag 起 {r['commits']} 个提交")
        if leftover:
            print(f"[settle-repo-check] 已合并且干净的残留 worktree（可清理）：")
            for r in leftover:
                print(f"  - {r['repo']}: {r['branch']} → {r['path']}")
    sys.exit(0)


if __name__ == "__main__":
    main()
