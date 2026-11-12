#!/usr/bin/env python3
"""把「主工作区 main 上的未提交改动」搬到新的 worktree 功能分支上。

2026-11-05 用户立规：local main 只剩两个职责——生成 worktree、被 remote main 快进同步；
它不承载任何写操作。所以主工作区 main 上一旦出现改动，正确动作不是「在 main 上直接
add / commit」（已被 git-main-guard 拦死），而是先把改动搬到一个功能分支的 worktree 里，
再在那边走 /add → /commit。

本脚本就是那个「搬」的动作，要求**确定性、可失败**：
  1. 只在 main / master 上干活（在功能分支上调用直接退出，什么都不做）；
  2. 暂存区有内容 → 拒绝（暂存区归用户把关，AI 不得删改）；
  3. 有冲突未解决 → 拒绝；
  4. 先建 worktree、把改动逐路径复制过去，**校验复制结果与原状态逐路径一致**，
     只有校验通过才清理主工作区——任何一步失败都回滚新建的 worktree，主工作区原样不动；
  5. 输出 `WORKTREE=` / `BRANCH=` / `MOVED=` 三行，供调用方（pi 会话）接着在 worktree
     里跑 /add → /commit。

用法：
  worktree-adopt.py                     # 当前目录
  worktree-adopt.py --repo <路径>
  worktree-adopt.py --type fix --slug aipay-timeout
  worktree-adopt.py --dry-run           # 只打印计划，不动任何文件
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

HOME = Path.home()
ADD_STATE = HOME / ".pi" / "agent" / "state" / "add-mode.json"
COMMIT_STATE = HOME / ".pi" / "agent" / "state" / "commit-mode.json"
# worktree 所有权日志（与 worktree-name-guard.ts 共用）：settle-repo-check 按 path 反查
# 「建它的会话」，把「已合并、可清理」的提示发给那个会话，而不是无差别发给当前会话。
WORKTREE_LOG = HOME / ".pi" / "agent" / "state" / "worktrees.jsonl"
MAIN_BRANCHES = ("main", "master")


def sh(args: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(
        args, cwd=str(cwd) if cwd else None, capture_output=True, text=True
    )


def git(repo: Path, *args: str) -> subprocess.CompletedProcess:
    return sh(["git", "-C", str(repo), *args])


def die(msg: str, code: int = 1) -> int:
    print(f"[ABORT] {msg}")
    return code


def norm(p: str) -> str:
    p = p.strip()
    if p == "~":
        p = str(HOME)
    elif p.startswith("~/"):
        p = str(HOME / p[2:])
    try:
        return str(Path(p).resolve())
    except Exception:
        return p


def mode_entries(path: Path) -> list[str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []
    entries = data.get("manual") if isinstance(data, dict) else None
    if not isinstance(entries, list):
        return []
    return [norm(x) for x in entries if isinstance(x, str) and x.strip()]


def paused_by_mode(repo: Path) -> str | None:
    """add-mode / commit-mode 任一被切成 manual 且覆盖本仓库 → 返回原因。"""
    repo_s = str(repo.resolve())
    for label, state in (("add-mode", ADD_STATE), ("commit-mode", COMMIT_STATE)):
        for entry in mode_entries(state):
            if repo_s == entry or repo_s.startswith(entry.rstrip("/") + "/"):
                return f"{label} 已按项目暂停（{entry}）：用户可能正在看 diff，不再自动搬运 / 提交"
    return None


def record_owner(repo: str, path: Path, branch: str) -> None:
    """记下「谁建了这个 worktree」（2026-11-12 加）。

    settle-repo-check 发现「已合并、工作区干净」的残留 worktree 时，靠这条记录把提示
    发给建它的会话；没有记录就只能靠「本轮新出现 / 静默」兜底。写失败静默——不因为
    记不了账就中断搬运。
    """
    try:
        WORKTREE_LOG.parent.mkdir(parents=True, exist_ok=True)
        rec = {
            "ts": datetime.now().astimezone().isoformat(timespec="seconds"),
            "sessionId": os.environ.get("PI_SESSION_ID", ""),
            "cwd": os.getcwd(),
            "repo": repo,
            "path": str(path),
            "branch": branch,
            "source": "worktree-adopt",
        }
        with open(WORKTREE_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    except OSError:
        pass


def parse_status(repo: Path) -> list[dict]:
    """解析 `git status --porcelain -z`：返回 [{xy, path, orig}]。"""
    out = git(repo, "status", "--porcelain", "-z").stdout
    items: list[dict] = []
    parts = out.split("\0")
    i = 0
    while i < len(parts):
        entry = parts[i]
        i += 1
        if not entry or len(entry) < 4:
            continue
        xy = entry[:2]
        path = entry[3:]
        orig = None
        if "R" in xy or "C" in xy:
            if i < len(parts):
                orig = parts[i]
                i += 1
        items.append({"xy": xy, "path": path, "orig": orig})
    return items


def kebab(text: str) -> str:
    text = re.sub(r"[^0-9A-Za-z._-]+", "-", text).strip("-.")
    return text.lower()[:48] or "wip"


def guess_slug(items: list[dict], root: Path) -> str:
    """用改动路径的公共部分猜一个能看出主题的 slug。"""
    tops: list[str] = []
    for it in items:
        rel = it["path"]
        head = rel.split("/")[0]
        if head not in tops:
            tops.append(head)
        if len(tops) > 3:
            break
    if len(tops) == 1 and tops[0] not in ("", "."):
        name = tops[0]
        if name.endswith((".md", ".json", ".txt", ".yml", ".yaml", ".ts", ".py", ".js")):
            name = Path(name).stem
        return kebab(name)
    if not tops:
        return kebab(root.name)
    return kebab("-".join(Path(t).stem for t in tops[:2]))


def copy_path(src_root: Path, dst_root: Path, rel: str) -> None:
    src = src_root / rel
    dst = dst_root / rel
    if dst.exists() or dst.is_symlink():
        if dst.is_dir() and not dst.is_symlink():
            shutil.rmtree(dst)
        else:
            dst.unlink()
    if not (src.exists() or src.is_symlink()):
        return  # 工作区里已删除：目标保持不存在即可
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.is_symlink():
        dst.symlink_to(os.readlink(src))
    elif src.is_dir():
        shutil.copytree(src, dst, symlinks=True)
    else:
        shutil.copy2(src, dst, follow_symlinks=False)


def remove_path(root: Path, rel: str) -> None:
    target = root / rel
    if target.is_symlink() or target.is_file():
        target.unlink()
    elif target.is_dir():
        shutil.rmtree(target)


def main() -> int:
    ap = argparse.ArgumentParser(description="把主工作区 main 上的改动搬到新的 worktree")
    ap.add_argument("--repo", default=".", help="仓库路径（默认当前目录）")
    ap.add_argument("--type", default="chore", choices=["feat", "fix", "chore", "docs", "refactor"],
                    help="分支前缀（默认 chore）")
    ap.add_argument("--slug", default="", help="分支名主体（默认按改动路径猜）")
    ap.add_argument("--base", default="", help="从哪个提交开 worktree（默认 HEAD）")
    ap.add_argument("--dry-run", action="store_true", help="只打印计划，不动任何文件")
    args = ap.parse_args()

    probe = Path(args.repo).expanduser()
    top = git(probe, "rev-parse", "--show-toplevel")
    if top.returncode != 0:
        return die(f"{probe} 不是 git 仓库：{top.stderr.strip()}", 2)
    root = Path(top.stdout.strip()).resolve()

    branch = git(root, "branch", "--show-current").stdout.strip()
    if branch not in MAIN_BRANCHES:
        print(f"[SKIP] 当前在 {branch or '(detached HEAD)'}，不是 main / master：无需搬运")
        return 0

    paused = paused_by_mode(root)
    if paused:
        print(f"[SKIP] {paused}")
        return 0

    staged = git(root, "diff", "--cached", "--quiet")
    if staged.returncode != 0:
        return die("暂存区已有内容——暂存区归用户把关，脚本不动它。请先由用户决定暂存区怎么处理", 3)

    items = parse_status(root)
    if not items:
        print("[SKIP] 工作区干净，无需搬运")
        return 0

    conflicts = [it for it in items if "U" in it["xy"] or it["xy"] in ("AA", "DD")]
    if conflicts:
        return die(
            "存在未解决的冲突，先处理冲突再搬运：" + ", ".join(it["path"] for it in conflicts[:5]),
            4,
        )

    slug = args.slug or guess_slug(items, root)
    if args.slug:
        branch_name = f"{args.type}/{kebab(slug)}"
    else:
        stamp = datetime.now().strftime("%Y%m%d-%H%M")
        branch_name = f"{args.type}/{slug}-{stamp}"

    worktree = root.parent / f"{root.name}-{slug}"
    if worktree.exists():
        return die(f"目标目录已存在：{worktree}（换个 --slug 或先清理）", 5)

    moved = [it["path"] for it in items]

    print(f"[PLAN] 仓库：{root}")
    print(f"[PLAN] 分支：{branch_name}")
    print(f"[PLAN] worktree：{worktree}")
    print("[PLAN] 待搬动的路径：")
    for it in items:
        print(f"  {it['xy']} {it['path']}" + (f"  (来自 {it['orig']})" if it.get("orig") else ""))

    if args.dry_run:
        print("[DRY-RUN] 未做任何改动")
        return 0

    base = args.base or git(root, "rev-parse", "HEAD").stdout.strip()
    created = git(root, "worktree", "add", "-b", branch_name, str(worktree), base)
    if created.returncode != 0:
        return die(f"建 worktree 失败：{created.stderr.strip()}", 6)
    record_owner(root.name, worktree, branch_name)

    def rollback(why: str) -> int:
        git(root, "worktree", "remove", "--force", str(worktree))
        git(root, "branch", "-D", branch_name)
        return die(f"{why}（已回滚 worktree `{branch_name}`，主工作区未改动）", 7)

    try:
        for it in items:
            copy_path(root, worktree, it["path"])
            if it.get("orig"):
                remove_path(worktree, it["orig"])
    except Exception as exc:  # noqa: BLE001
        return rollback(f"复制改动失败：{exc}")

    # 校验：worktree 的改动路径集合必须与原状态一致（不多不少）
    after = {it["path"] for it in parse_status(worktree)}
    before = {it["path"] for it in items}
    if after != before:
        missing = sorted(before - after)
        extra = sorted(after - before)
        return rollback(f"复制校验失败（缺 {missing[:5]} / 多 {extra[:5]}）")

    # 校验通过才清理主工作区
    restored = git(root, "restore", "--worktree", "--", ".")
    if restored.returncode != 0:
        return rollback(f"主工作区还原失败：{restored.stderr.strip()}")
    for it in items:
        if it["xy"].startswith("??") or it["xy"].endswith("?"):
            remove_path(root, it["path"])
    leftover = parse_status(root)
    if leftover:
        print("[WARN] 主工作区仍有改动（可能来自 .gitignore 未覆盖的路径），请人工确认：")
        for it in leftover:
            print(f"  {it['xy']} {it['path']}")

    print(f"WORKTREE={worktree}")
    print(f"BRANCH={branch_name}")
    print(f"MOVED={len(moved)}")
    print(f"[DONE] 改动已搬到 worktree；接着在那里执行 /add → /commit（git -C {worktree} …）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
