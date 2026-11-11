#!/usr/bin/env python3
"""提交闸门：/commit 流程开始时打开、流程结束（或失败）时关闭。

为什么有这个东西（2026-11-11 用户立）：
裸 `git commit` 会跳过 commit skill 的两门检测——**敏感内容扫描**（gitleaks 确定性扫描 +
AI 语义扫描：财务状况、个人隐私标识、敏感叙述）与 **cache 检测**——等于把安全阀绕开。
当天就绕过三轮（拆文章、登记子项目、补规则），事后再靠 `settle-repo-check` 兜底才发现
漏发版；敏感扫描漏掉的后果比漏发版严重得多，所以这条不能只靠纪律记。

机制：`extensions/git-commit-guard.ts` 在放行 `git commit` 前要求闸门开着，
而闸门只由 `/commit` 流程打开——裸 commit 会直接被拒，并提示去走 skill。

用法：
    python3 ~/.pi/agent/patch/commit-gate/gate.py begin    # 开闸（默认 30 分钟）
    python3 ~/.pi/agent/patch/commit-gate/gate.py end      # 关闸（流程结束/失败/中断都要关）
    python3 ~/.pi/agent/patch/commit-gate/gate.py status   # 看当前状态
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

GATE = Path.home() / ".pi" / "agent" / "state" / "commit-gate.json"
DEFAULT_TTL_MIN = 30


def begin(ttl_min: int, repo: str | None) -> int:
    GATE.parent.mkdir(parents=True, exist_ok=True)
    now = time.time()
    payload = {
        "started_at": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now)),
        "expires_at": int(now + ttl_min * 60),
        "repo": repo or os.getcwd(),
        "reason": "/commit skill 进行中",
    }
    GATE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"闸门已开（{ttl_min} 分钟）：{payload['repo']}")
    return 0


def end() -> int:
    if GATE.exists():
        GATE.unlink()
        print("闸门已关")
    else:
        print("闸门本来就是关的")
    return 0


def status() -> int:
    if not GATE.exists():
        print("闸门：关闭（现在任何 git commit 都会被拦下）")
        return 0
    try:
        data = json.loads(GATE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        print("闸门：文件损坏，按关闭处理")
        return 0
    left = int(data.get("expires_at", 0) - time.time())
    state = "开启" if left > 0 else "已过期（按关闭处理）"
    print(f"闸门：{state}，剩余 {max(left, 0) // 60} 分 {max(left, 0) % 60} 秒 | 仓库 {data.get('repo')}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="commit 闸门")
    parser.add_argument("action", choices=["begin", "end", "status"])
    parser.add_argument("--ttl-min", type=int, default=DEFAULT_TTL_MIN, help="开闸时长（分钟，默认 30）")
    parser.add_argument("--repo", help="本次提交的目标仓库路径（默认当前目录）")
    args = parser.parse_args()
    if args.action == "begin":
        return begin(args.ttl_min, args.repo)
    if args.action == "end":
        return end()
    return status()


if __name__ == "__main__":
    sys.exit(main())