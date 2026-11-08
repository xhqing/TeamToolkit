#!/usr/bin/env python3
"""把全局 `~/.pi/agent` 单向发布到 TeamToolkit 开源仓库（单 pusher：只在 macmini 上跑）。

为什么需要
----------
`TeamToolkit`（原 CapabilityManagerAgent）是团队通用能力的唯一开源出口。镜像内容是从全局
`~/.pi/agent` **确定性生成**的，所以只能有一个机器生成并推送——两台机器都推就会造出两个
提交、两个 PR，互相 rebase 纯属浪费；更麻烦的是全局目录里有若干「各机自维护」的配置，
两边同时生成可能把对端的本机配置推上公网。

它做什么（顺序固定）
--------------------
1. **等 Syncthing 收敛**：查本机 Syncthing 的 `pi-agent` 目录状态，不是 `idle` 就等；
   否则会把「只同步到一半的全局目录」发布出去（最坑的是 AGENTS.md 引用了还没到的 skill）。
2. **拒绝发布冲突副本**：发现 `*.sync-conflict-*` 直接退出（能力层本身需要人管）。
3. **单向 rsync** 五部分 + npm 清单到仓库 `pi/agent/`（排除本机产物与本机私有配置）。
4. **写 CHANGELOG**：自动生成本次变更的文件清单（生成物不靠手写，否则必飘）。
5. **提交 → 推分支 → 开 PR → `gh pr merge --auto`**（remote main 锁定，不直推）。
6. 合并完成后快进本地 main（异步，脚本只提示）。

用法
----
  publish.py            # 正常发布（无变化则直接退出）
  publish.py --check    # 只检查是否已一致，不写任何东西
  publish.py --dry-run  # 显示会同步哪些文件，不提交
  publish.py --dir <仓库路径>   # 指定 TeamToolkit 仓库位置
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

HOME = Path.home()
GLOBAL = HOME / ".pi" / "agent"
REPO_DEFAULT = HOME / "Developer" / "TeamToolkit"
MIRROR_SUB = Path("pi") / "agent"

# 进镜像的五部分（顺序固定，便于 diff 阅读）
PARTS = ["AGENTS.md", "skills", "docs", "patch", "extensions"]

# 镜像里允许存在、但不归 rsync 管的顶层条目：npm 清单（由本机 note_npm 维护 / 发布机不生成）
MIRROR_KEEP = {"npm"}

# 不进镜像：本机私有配置 + 本机产物 + 运行时目录
EXCLUDES = [
    # 运行时 / 架构相关
    "sessions/", "state/", "logs/", "tmp/", "intercom/", "npm/", "bin/",
    # 本机私有配置
    "trust.json", "mcp-project-approvals.json",
    "skills/anysearch/.env", "skills/anysearch/runtime.conf",
    "skills/backup/endpoints/",
    "patch/session-link/config.json", "patch/session-link/local-links.json",
    "patch/session-link/chain-registry.json",
    # 本机产物
    "*.log", "*.lock", "__pycache__/", "*.pyc", ".DS_Store", "*.sync-conflict-*",
]


def sh(cmd, cwd=None, check=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise SystemExit(f"[ERR] {' '.join(cmd)}\n{r.stdout}\n{r.stderr}")
    return r


def is_macmini() -> bool:
    h = platform.node().lower()
    return "mac-mini" in h or "macmini" in h


def syncthing_key() -> tuple[str, str] | None:
    cfg = HOME / "Library" / "Application Support" / "Syncthing" / "config.xml"
    if not cfg.exists():
        return None
    try:
        tree = ET.parse(cfg)
    except ET.ParseError:
        return None
    gui = tree.getroot().find("gui")
    if gui is None:
        return None
    apikey = gui.findtext("apikey") or ""
    node = gui.find("address")
    addr = node.text if node is not None and node.text else "127.0.0.1:8384"
    return apikey, f"http://{addr}"


def wait_idle(timeout_s: int = 180) -> bool:
    """等 Syncthing 的 pi-agent 目录收敛到 idle。"""
    info = syncthing_key()
    if not info:
        print("[WARN] 读不到 Syncthing 配置，跳过收敛检查")
        return True
    key, base = info
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            req = urllib.request.Request(f"{base}/rest/db/status?folder=pi-agent",
                                         headers={"X-API-Key": key})
            st = json.loads(urllib.request.urlopen(req, timeout=10).read())
        except Exception as e:  # noqa: BLE001
            print(f"[WARN] 查询 Syncthing 状态失败（{e}），跳过收敛检查")
            return True
        if st.get("state") == "idle" and not st.get("needTotalItems"):
            return True
        print(f"[WAIT] Syncthing 仍在同步（state={st.get('state')} 待传={st.get('needTotalItems')}）…")
        time.sleep(5)
    print("[ERR] 等待 Syncthing 收敛超时；稍后重跑（或先查 status.py）")
    return False


def find_conflicts() -> list[str]:
    hits = []
    for part in PARTS:
        root = GLOBAL / part
        if not root.exists():
            continue
        for p in root.rglob("*sync-conflict-*"):
            hits.append(str(p.relative_to(GLOBAL)))
    return hits


def sync_part(part: str, mirror: Path, dry: bool) -> None:
    src = GLOBAL / part
    dst = mirror / part
    if not src.exists():
        return
    excludes = []
    for pat in EXCLUDES:
        excludes += ["--exclude", pat]
    cmd = ["rsync", "-a", "-c", "--delete", *excludes, f"{src}", f"{dst.parent}/"]
    if dry:
        cmd.insert(1, "--dry-run")
        cmd.insert(1, "-v")
    sh(cmd)


def dry_run_diff(part: str, mirror: Path) -> list[str]:
    """rsync --dry-run 比对某一部分（不落盘），返回变更条目。"""
    src = GLOBAL / part
    dst = mirror / part
    if not src.exists():
        return []
    excludes = []
    for pat in EXCLUDES:
        excludes += ["--exclude", pat]
    cmd = ["rsync", "-a", "-c", "--delete", "--dry-run", "--itemize-changes",
           *excludes, f"{src}", f"{dst.parent}/"]
    out = sh(cmd, check=False).stdout
    keep = []
    for ln in out.splitlines():
        if not ln or ln.startswith("sending"):
            continue
        # itemize 格式（11 列）：YXcstpoguax。只有「时间」这一位不同（`.f..t` / `.d..t`）不算内容变更，
        # 否则每台机器 mtime 不同就会造出空提交；内容/大小变化是 `>f.st....` 这类，必须保留。
        if re.match(r"^[.>][fd]\.\.[t.]", ln):
            continue
        keep.append(ln)
    return keep


def prune_orphans(mirror: Path, dry: bool) -> list[str]:
    """删掉镜像里的「孤儿顶层条目」（已不属于 PARTS、也不在 MIRROR_KEEP 里）。

    为什么需要：rsync 只同步 PARTS 内部、负责不了「整个条目从清单里消失」的情况。
    2026-11-05 全局规则文件由 CLAUDE.md 改名为 AGENTS.md 时就碰上了：新文件能同步过去，
    旧文件却永远留在镜像里，读者会以为仍有两份规则。
    """
    removed = []
    for entry in sorted(mirror.iterdir()):
        if entry.name in PARTS or entry.name in MIRROR_KEEP:
            continue
        removed.append(entry.name)
        if dry:
            continue
        if entry.is_dir() and not entry.is_symlink():
            shutil.rmtree(entry)
        else:
            entry.unlink()
    return removed


def note_npm() -> None:
    """npm 清单不由发布机生成。

    `~/.pi/agent/npm/` 是**架构相关**目录、不参与两机同步，发布机（macmini）装的包版本
    可能与本机（真正装包的那台）不同——在这里跑 refresh.py 会把版本号写回去（2026-11-05
    实测：macmini 上是 pi-mcp-adapter 7.0.0，本机是 7.0.1）。
    所以清单只在「装了包的那台机器」上生成，再随内容一起提交：见 README「npm 清单怎么更新」。
    """
    print("[INFO] 跳过 npm 清单（该清单只在装了 pi 包的机器上生成，见 README）")


def changed_files(repo: Path) -> list[str]:
    out = sh(["git", "-C", str(repo), "status", "--porcelain"], check=False).stdout
    files = []
    for line in out.splitlines():
        if len(line) > 3:
            files.append(line[3:].strip().strip('"'))
    return files


def append_changelog(repo: Path, files: list[str]) -> None:
    """在 CHANGELOG 当前日期节里插一条「镜像同步」记录（生成式，不手写）。"""
    cl = repo / "CHANGELOG.md"
    today = dt.date.today().isoformat()
    listing = "\n".join(f"  - `{f}`" for f in files[:40])
    if len(files) > 40:
        listing += f"\n  - ……（共 {len(files)} 个文件）"
    entry = (
        f"- **镜像同步（{today}）**：从全局 `~/.pi/agent` 单向发布。\n"
        f"  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。\n"
        f"  **改了什么**：{len(files)} 个文件——\n{listing}\n"
        f"  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。\n"
    )
    if not cl.exists():
        cl.write_text(f"# CHANGELOG\n\n## {today}\n\n{entry}", encoding="utf-8")
        return
    text = cl.read_text(encoding="utf-8")
    heading = f"## {today}"
    if heading in text:
        idx = text.index(heading) + len(heading)
        nl = text.index("\n", idx) + 1
        text = text[:nl] + "\n" + entry + text[nl:]
    else:
        # 插在第一个 `## ` 之前（新日期在上）
        m = re.search(r"^## ", text, re.M)
        block = f"## {today}\n\n{entry}\n"
        text = (text[: m.start()] + block + text[m.start():]) if m else (text + "\n" + block)
    cl.write_text(text, encoding="utf-8")


def commit_and_pr(repo: Path, files: list[str], branch: str) -> None:
    sh(["git", "-C", str(repo), "checkout", "-q", "-b", branch])
    sh(["git", "-C", str(repo), "add", "-A"])
    msg = f"chore: sync global capability layer ({len(files)} files)"
    sh(["git", "-C", str(repo), "commit", "-q", "-m", msg])
    sh(["git", "-C", str(repo), "push", "-q", "-u", "origin", branch])
    title = f"chore: 镜像同步 {dt.date.today().isoformat()}（{len(files)} 个文件）"
    body = "从全局 `~/.pi/agent` 单向发布，由 `patch/team-toolkit-publish/publish.py` 生成。\n\n" + \
           "\n".join(f"- `{f}`" for f in files[:40])
    out = sh(["gh", "pr", "create", "--title", title, "--body", body, "--base", "main",
              "--head", branch], cwd=repo, check=False)
    print(out.stdout.strip() or out.stderr.strip())
    sh(["gh", "pr", "merge", "--squash", "--auto", "--delete-branch"], cwd=repo, check=False)
    print("[DONE] 已开 PR 并设置自动合并（CI 通过后自动合入 main）")


def main() -> int:
    ap = argparse.ArgumentParser(description="发布全局能力层镜像到 TeamToolkit")
    ap.add_argument("--dir", default=str(REPO_DEFAULT), help="TeamToolkit 仓库路径")
    ap.add_argument("--check", action="store_true", help="只检查是否一致")
    ap.add_argument("--dry-run", action="store_true", help="演示同步内容，不提交")
    ap.add_argument("--allow-non-macmini", action="store_true",
                    help="允许在非 macmini 上发布（默认禁止，避免双 pusher）")
    args = ap.parse_args()

    if not is_macmini() and not args.allow_non_macmini:
        print("[ERR] 这个脚本只允许在 macmini 上跑（单 pusher 约定，防止两台机器同时 PR）。\n"
              "      确实要从这里发布时加 --allow-non-macmini。")
        return 2

    repo = Path(args.dir).expanduser()
    if not (repo / ".git").exists():
        print(f"[ERR] 找不到仓库：{repo}（macmini 上应先 git clone github.com/xhqing/TeamToolkit）")
        return 2

    mirror = repo / MIRROR_SUB
    mirror.mkdir(parents=True, exist_ok=True)

    conflicts = find_conflicts()
    if conflicts and not args.check:
        print("[ERR] 全局能力层里有 Syncthing 冲突副本，先人工合并再发布：")
        for c in conflicts:
            print("  -", c)
        return 3

    if not args.check and not args.dry_run and not wait_idle():
        return 4

    sh(["git", "-C", str(repo), "fetch", "-q", "origin"])
    head_branch = sh(["git", "-C", str(repo), "rev-parse", "--abbrev-ref", "HEAD"]).stdout.strip()
    if head_branch != "main":
        # 上一轮发布留下的 chore/sync-* 分支是常态：工作区干净就自动切回 main
        dirty = sh(["git", "-C", str(repo), "status", "--porcelain"]).stdout.strip()
        if dirty:
            print(f"[ERR] 当前在 {head_branch} 且工作区不干净，先处理干净再发布")
            return 2
        sh(["git", "-C", str(repo), "checkout", "-q", "main"])
        print(f"[INFO] 已从 {head_branch} 切回 main")
    sh(["git", "-C", str(repo), "merge", "--ff-only", "-q", "origin/main"], check=False)

    if args.check:
        items: list[str] = []
        for part in PARTS:
            items += dry_run_diff(part, mirror)
        if items:
            print(f"[DIFF] 有 {len(items)} 处内容未同步（只读检查，未改动任何文件）：")
            for it in items[:60]:
                print("  ", it)
            return 1
        print("[OK] 全局与镜像内容一致")
        orphans = prune_orphans(mirror, dry=True)
        if orphans:
            print(f"[DIFF] 镜像里有 {len(orphans)} 个孤儿条目待清理：{'、'.join(orphans)}")
            return 1
        dirty = changed_files(repo)
        if dirty:
            print(f"[NOTE] 仓库工作区另有 {len(dirty)} 处改动（非镜像内容，未纳入比对）")
        return 0

    if args.dry_run:
        # dry 模式下 rsync 不落盘，git 看不到任何改动——必须用 rsync 自己的 dry-run 比对
        # 来统计变更（2026-11-08 修：原先用 changed_files() 统计，永远报 0 个文件，误导使用者）
        items: list[str] = []
        for part in PARTS:
            items += dry_run_diff(part, mirror)
        orphans = prune_orphans(mirror, dry=True)
        if orphans:
            print(f"[PRUNE] 将清理镜像孤儿条目：{'、'.join(orphans)}")
        print(f"[DRY] 将变更 {len(items)} 个文件：")
        for it in items[:60]:
            print("  ", it)
        return 0

    for part in PARTS:
        sync_part(part, mirror, False)
    orphans = prune_orphans(mirror, dry=False)
    if orphans:
        print(f"[PRUNE] 清理镜像孤儿条目：{'、'.join(orphans)}")
    note_npm()

    files = changed_files(repo)
    if not files:
        print("[OK] 全局与镜像已一致，无需发布")
        return 0

    append_changelog(repo, files)
    branch = "chore/sync-" + dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    commit_and_pr(repo, files, branch)
    return 0


if __name__ == "__main__":
    sys.exit(main())
