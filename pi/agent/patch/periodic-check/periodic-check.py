#!/usr/bin/env python3
"""定时巡检（launchd，每 60 分钟；2026-11-09 用户立）。

用户原话：「可以有定时机制，但是要做到用户无感，遇到问题通知 AI，直接让 AI 解决。」

做什么
------
1. **会话记录保留**：删掉 90 天前的 `~/.pi/agent/sessions/*.jsonl`，权限收紧到 700/600
   （这些文件是全对话明文，1GB+；用户要求「只保留最近 90 天、只要本机 AI 能访问」）。
2. **全队仓库巡检**：复用 settle-repo-check 的判断——不干净 / 漏发版 / 残留 worktree。
3. **有问题就派给 AI 解决**：不在终端弹任何东西；按 Agent 找到对应项目目录，
   起一个 `pi --approve -p "<任务>"` 一次性会话让它自己处理（跑完即退，不常驻）。
   同一问题 24 小时内只派一次（状态文件去重），避免反复烧 token。

为什么不在会话里做：settle-repo-check 只在 `agent_settled` 触发——连续开发时
会话从不停下来，巡检就等于不存在（turn-diff 当天静默积压 7 个版本就是这么来的）。

日志：~/.pi/agent/state/periodic-check.log
状态：~/.pi/agent/state/periodic-check.json（通知去重 + 上次运行时间）
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

HOME = Path.home()
AGENT_DIR = HOME / ".pi" / "agent"

# launchd 的 PATH 只有 /usr/bin:/bin:/usr/sbin:/sbin——brew 的 gh（unpublished 检测要用）
# 和 git 都不在里面，不补就会 FileNotFoundError: 'gh'（2026-11-09 实测）。
# 这段必须在任何 subprocess 调用之前执行。
os.environ["PATH"] = ":".join([
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
    "/usr/sbin",
    "/sbin",
    str(HOME / ".local" / "bin"),
    os.environ.get("PATH", ""),
])

SESSIONS = AGENT_DIR / "sessions"
STATE_DIR = AGENT_DIR / "state"
STATE_FILE = STATE_DIR / "periodic-check.json"
LOG_FILE = STATE_DIR / "periodic-check.log"
CHECKER = AGENT_DIR / "patch" / "settle-repo-check" / "settle-repo-check.py"

RETENTION_DAYS = 90
NOTIFY_COOLDOWN_H = 24
PI_BIN = "/opt/homebrew/bin/pi"


def log(msg: str) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{stamp}] {msg}\n")


def load_state() -> dict:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(state: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------------- 1. 会话记录保留 ----------------


def prune_sessions() -> str:
    """删 90 天前的会话记录 + 收紧权限。"""
    if not SESSIONS.is_dir():
        return "sessions 目录不存在，跳过"
    now = time.time()
    cutoff = now - RETENTION_DAYS * 86400
    removed, freed = 0, 0
    for path in SESSIONS.rglob("*.jsonl"):
        try:
            st = path.stat()
        except OSError:
            continue
        if st.st_mtime < cutoff:
            freed += st.st_size
            try:
                path.unlink()
                removed += 1
            except OSError:
                pass
    # 清空目录（只删空的会话目录，不动 sessions 根）
    for d in sorted(SESSIONS.glob("*"), key=lambda p: len(str(p)), reverse=True):
        if d.is_dir() and not any(d.iterdir()):
            try:
                d.rmdir()
            except OSError:
                pass
    # 权限：只让本机 AI 这个用户能读
    for p in [SESSIONS, *SESSIONS.rglob("*")]:
        try:
            os.chmod(p, 0o700 if p.is_dir() else 0o600)
        except OSError:
            pass
    return f"会话保留：清理 {removed} 个（{freed / 1024 / 1024:.0f} MB），权限已收紧"


# ---------------- 2. 全队巡检 ----------------


def load_checker():
    spec = importlib.util.spec_from_file_location("settle_check", CHECKER)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    return mod


def scan_all() -> dict[str, dict]:
    """按 Agent 汇总问题：{agent: {dirty, unpublished, worktrees, dir}}。"""
    mod = load_checker()
    rows = mod.registry_rows()
    agents: dict[str, dict] = {}
    for agent, _ in rows:
        if agent in agents:
            continue
        agents[agent] = {
            "dir": str(Path.home() / "Developer" / agent),
            "dirty": mod.dirty_repos(agent, rows),
            "unpublished": mod.unpublished_repos(agent, rows),
            "worktrees": mod.stale_worktrees(agent, rows),
        }
    return {a: v for a, v in agents.items() if v["dirty"] or v["unpublished"] or v["worktrees"]}


def build_message(agent: str, info: dict) -> str:
    lines = [f"[定时巡检] {agent} 名下发现需要处理的事项（来自 periodic-check，每 60 分钟一次）："]
    if info["dirty"]:
        lines.append("\n1) 有仓库不干净（有待提交内容）：")
        for r in info["dirty"]:
            lines.append(f"   - {r['repo']}：{r['changes']} 处改动")
        lines.append("   → 按项目规则走 /add → /commit（预检干净会自动衔接提交；该 bump / 发版就照常走）。")
    if info["unpublished"]:
        lines.append("\n2) 有功能类改动但版本未发布：")
        for r in info["unpublished"]:
            lines.append(f"   - {r['repo']}：v{r['version']} 未发布，自最新 tag 起 {r['commits']} 个提交")
        lines.append("   → 版本已就绪就 /release；未就绪先 /bump → /add → /commit → /release。")
    if info["worktrees"]:
        lines.append("\n3) 已合并且干净的残留 worktree：")
        for r in info["worktrees"]:
            lines.append(f"   - {r['repo']}: {r['branch']} → {r['path']}")
        lines.append("   → 确认后 `git worktree remove <路径>` 并删掉已合并分支。")
    lines.append(
        "\n处理原则：先核实、再动手；不确定的（比如看起来像在途 WIP）就留一条 TODO 说明，不要硬提交。"
        "处理完不需要回复用户，这是后台巡检。"
    )
    return "\n".join(lines)


def dispatch(agent: str, info: dict, state: dict) -> None:
    """起一次性 AI 会话处理（不常驻、不打扰用户）。"""
    sig = json.dumps(
        {
            "dirty": sorted((r["repo"], r["changes"]) for r in info["dirty"]),
            "unpublished": sorted((r["repo"], r["version"]) for r in info["unpublished"]),
            "worktrees": sorted((r["repo"], r["branch"]) for r in info["worktrees"]),
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    import hashlib

    sig_hash = hashlib.sha256(sig.encode()).hexdigest()[:16]
    sent = state.setdefault("notified", {})
    last = sent.get(agent)
    if last and last.get("sig") == sig_hash and time.time() - last.get("at", 0) < NOTIFY_COOLDOWN_H * 3600:
        return  # 同一问题 24 小时内派过了
    project_dir = Path(info["dir"])
    if not project_dir.is_dir():
        log(f"[SKIP] {agent}: 项目目录不存在 {project_dir}")
        return
    pi_bin = PI_BIN if os.path.exists(PI_BIN) else shutil.which("pi")
    if not pi_bin:
        log(f"[ERR] 找不到 pi 可执行文件，无法通知 {agent}")
        return
    message = build_message(agent, info)
    log(f"[NOTIFY] {agent} → 起一次性会话处理（sig={sig_hash}）")
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as logf:
            subprocess.Popen(
                [pi_bin, "--approve", "-p", message],
                cwd=str(project_dir),
                stdout=logf,
                stderr=logf,
                start_new_session=True,
                env={**os.environ, "PATH": f"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:{HOME}/.local/bin"},
            )
        sent[agent] = {"sig": sig_hash, "at": time.time()}
    except OSError as exc:
        log(f"[ERR] {agent}: 派发失败 {exc}")


def main() -> int:
    if "--dry-run" in sys.argv:
        mod = load_checker()
        rows = mod.registry_rows()
        agents = {}
        for agent, _ in rows:
            agents.setdefault(agent, None)
        for agent in agents:
            info = {
                "dir": str(HOME / "Developer" / agent),
                "dirty": mod.dirty_repos(agent, rows),
                "unpublished": mod.unpublished_repos(agent, rows),
                "worktrees": mod.stale_worktrees(agent, rows),
            }
            if info["dirty"] or info["unpublished"] or info["worktrees"]:
                print(build_message(agent, info))
                print("-" * 60)
        print("[DRY] 只演示，不派发")
        return 0

    state = load_state()
    log("巡检开始")
    log(prune_sessions())

    problems = scan_all()
    if not problems:
        log("全队仓库干净、无漏发版、无残留 worktree")
        save_state(state)
        return 0

    for agent, info in problems.items():
        dispatch(agent, info, state)
    save_state(state)
    log(f"巡检结束：{len(problems)} 个 Agent 有待处理事项")
    return 0


if __name__ == "__main__":
    sys.exit(main())
