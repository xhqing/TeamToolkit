#!/usr/bin/env python3
"""把权威 `~/.dsh` 的核心基础设施发布到 agents-infra 的 `dsh/`（MacBook 单 pusher）。

为什么是 MacBook
----------------
`~/.dsh` 是 dsh-team 的权威源，只存在于 MacBook；macmini 不装 DSH。
所以 `dsh/` 子树由 MacBook 发布，`pi/agent/` 子树仍由 macmini 的
`publish.py` 发布——两个子树、两个单 pusher，路径不相交。

发布范围（secret-free 核心）
----------------------------
- `AGENTS.md`、`README.md`、`bootstrap.sh`
- `profiles/dsh-tui/`：`cordis.yml`、`cordis.patch.yml`、`package.json`、
  `pnpm-lock.yaml`、`pnpm-workspace.yaml`、`plugins/`
- 排除：`.env`、`.credentials.yaml`、`.anonymous-user-id`、`sessions/`、
  `storages/`、`attachments/`、`node_modules/`、`.plugin-manager/`、
  `settings.yaml.imported`、`*.log`、`__pycache__`

用法
----
  publish_dsh.py            # 发布（无变化则直接退出）
  publish_dsh.py --check    # 只检查是否一致，不写任何东西
  publish_dsh.py --dry-run  # 显示会同步哪些文件，不提交
  publish_dsh.py --dir <agents-infra 仓库路径>
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
import tempfile
from pathlib import Path

HOME = Path.home()
DSH = HOME / ".dsh"
REPO_DEFAULT = HOME / "Developer" / "agents-infra"
MIRROR_SUB = Path("dsh")

EXCLUDES = [
    ".env", ".credentials.yaml", ".anonymous-user-id",
    "sessions/", "storages/", "attachments/",
    "node_modules/", ".plugin-manager/",
    "settings.yaml.imported",
    "profiles/web/", "profiles/headless/", "profiles/desktop/",  # 只镜像 dsh-tui 核心
    "*.log", "__pycache__/", "*.pyc", ".DS_Store", "*.sync-conflict-*",
    "CHANGELOG.md",  # 生成物，保留在镜像里，不让 rsync --delete 删掉
]

PRIVATE_FILE_PATTERNS = [
    re.compile(r"(^|/)\.env(\.|$)"),
    re.compile(r"(^|/)[^/]*\.local\.(md|json|ya?ml|txt|csv)$"),
    re.compile(r"(^|/)(endpoints|credentials|secrets)\.json$"),
]


def sh(cmd, cwd=None, check=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise SystemExit(f"[ERR] {' '.join(cmd)}\n{r.stdout}\n{r.stderr}")
    return r


def is_macmini() -> bool:
    h = platform.node().lower()
    return "mac-mini" in h or "macmini" in h


def rsync_cmd(mirror: Path, dry: bool) -> list[str]:
    excludes: list[str] = []
    for pat in EXCLUDES:
        excludes += ["--exclude", pat]
    cmd = ["rsync", "-a", "-c", "--delete", *excludes, f"{DSH}/", f"{mirror}/"]
    if dry:
        cmd[1:1] = ["--dry-run", "--itemize-changes"]
    return cmd


def itemized(out: str) -> list[str]:
    keep = []
    for ln in out.splitlines():
        if not ln or ln.startswith("sending"):
            continue
        # 只有 mtime 变化不算内容变化
        if re.match(r"^[.>][fd]\.\.[t.]", ln):
            continue
        keep.append(ln)
    return keep


def changed_files(repo: Path) -> list[str]:
    # -uall：展开新目录，避免新目录在 CHANGELOG 里只显示成 `dsh/`
    out = sh(["git", "-C", str(repo), "status", "--porcelain", "-uall"], check=False).stdout
    files = []
    for line in out.splitlines():
        if len(line) > 3:
            files.append(line[3:].strip().strip('"'))
    return files


def scan_mirror(mirror: Path) -> list[str]:
    problems: list[str] = []
    if shutil.which("gitleaks") is None:
        problems.append("gitleaks 未安装：发布闸门要求先装（brew install gitleaks）")
    else:
        cfg = HOME / ".gitleaks.toml"
        fd, report_name = tempfile.mkstemp(suffix=".json")
        os.close(fd)
        report = Path(report_name)
        try:
            cmd = ["gitleaks", "dir", str(mirror), "--no-banner",
                   "--report-format", "json", "--report-path", str(report)]
            if cfg.exists():
                cmd += ["--config", str(cfg)]
            subprocess.run(cmd, capture_output=True, text=True)
            try:
                hits = json.loads(report.read_text(encoding="utf-8") or "[]")
            except (json.JSONDecodeError, OSError, UnicodeDecodeError):
                hits = [{"RuleID": "report-unreadable", "File": str(report), "StartLine": 0}]
            for h in hits:
                rel = str(h.get("File", "")).replace(str(mirror) + "/", "")
                problems.append(
                    f"gitleaks 命中 {h.get('RuleID')} @ dsh/{rel}:{h.get('StartLine', '?')}"
                )
        finally:
            report.unlink(missing_ok=True)

    for path in mirror.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(mirror).as_posix()
        if any(pat.search(rel) for pat in PRIVATE_FILE_PATTERNS):
            problems.append(f"疑似本机私有文件：dsh/{rel}")
    return problems


def append_changelog(repo: Path, files: list[str]) -> None:
    cl = repo / MIRROR_SUB / "CHANGELOG.md"
    today = dt.date.today().isoformat()
    listing = "\n".join(f"  - `{f}`" for f in files[:40])
    if len(files) > 40:
        listing += f"\n  - ……（共 {len(files)} 个文件）"
    entry = (
        f"- **DSH 核心同步（{today}）**：从权威 `~/.dsh` 单向发布。\n"
        f"  **为什么改**：`~/.dsh` 是 dsh-team 的权威源，本仓库的 `dsh/` 是它的公开镜像。\n"
        f"  **改了什么**：{len(files)} 个文件——\n{listing}\n"
        f"  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。\n"
    )
    if not cl.exists():
        cl.parent.mkdir(parents=True, exist_ok=True)
        cl.write_text(f"# DSH CHANGELOG\n\n## {today}\n\n{entry}", encoding="utf-8")
        return
    text = cl.read_text(encoding="utf-8")
    heading = f"## {today}"
    if heading in text:
        idx = text.index(heading) + len(heading)
        nl = text.index("\n", idx) + 1
        text = text[:nl] + "\n" + entry + text[nl:]
    else:
        m = re.search(r"^## ", text, re.M)
        block = f"## {today}\n\n{entry}\n"
        text = (text[: m.start()] + block + text[m.start():]) if m else (text + "\n" + block)
    cl.write_text(text, encoding="utf-8")


def commit_and_pr(repo: Path, files: list[str]) -> None:
    branch = "chore/dsh-sync-" + dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    sh(["git", "-C", str(repo), "checkout", "-q", "-b", branch])
    sh(["git", "-C", str(repo), "add", "-A"])
    sh(["git", "-C", str(repo), "commit", "-q", "-m",
        f"chore: sync dsh core infrastructure ({len(files)} files)"])
    sh(["git", "-C", str(repo), "push", "-q", "-u", "origin", branch])
    title = f"chore: DSH 核心基础设施同步 {dt.date.today().isoformat()}（{len(files)} 个文件）"
    body = "从权威 `~/.dsh` 单向发布，由 `patch/agents-infra-publish/publish_dsh.py` 生成。\n\n" + \
           "\n".join(f"- `{f}`" for f in files[:40])
    out = sh(["gh", "pr", "create", "--title", title, "--body", body, "--base", "main",
              "--head", branch], cwd=repo, check=False)
    print(out.stdout.strip() or out.stderr.strip())
    sh(["gh", "pr", "merge", "--squash", "--auto", "--delete-branch"], cwd=repo, check=False)
    print("[DONE] 已开 PR 并设置自动合并（CI 通过后自动合入 main）")


def main() -> int:
    ap = argparse.ArgumentParser(description="发布权威 ~/.dsh 核心基础设施到 agents-infra/dsh")
    ap.add_argument("--dir", default=str(REPO_DEFAULT), help="agents-infra 仓库路径")
    ap.add_argument("--check", action="store_true", help="只检查是否一致，不写任何东西")
    ap.add_argument("--dry-run", action="store_true", help="显示会同步哪些文件，不提交")
    args = ap.parse_args()

    if is_macmini():
        print("[ERR] 这个脚本只在 MacBook 上跑：`~/.dsh` 是权威源，macmini 上没有它。\n"
              "      pi/agent 的发布用 macmini 上的 publish.py；dsh/ 的发布用本脚本。")
        return 2
    if not DSH.exists():
        print(f"[ERR] 找不到权威源：{DSH}")
        return 2

    repo = Path(args.dir).expanduser()
    if not (repo / ".git").exists():
        print(f"[ERR] 找不到仓库：{repo}（先 clone github.com/xhqing/agents-infra）")
        return 2

    mirror = repo / MIRROR_SUB
    mirror.mkdir(parents=True, exist_ok=True)

    sh(["git", "-C", str(repo), "fetch", "-q", "origin"])
    head_branch = sh(["git", "-C", str(repo), "rev-parse", "--abbrev-ref", "HEAD"]).stdout.strip()
    if head_branch != "main":
        dirty = sh(["git", "-C", str(repo), "status", "--porcelain"]).stdout.strip()
        if dirty:
            print(f"[ERR] 当前在 {head_branch} 且工作区不干净，先处理干净再发布")
            return 2
        sh(["git", "-C", str(repo), "checkout", "-q", "main"])
        print(f"[INFO] 已从 {head_branch} 切回 main")
    sh(["git", "-C", str(repo), "merge", "--ff-only", "-q", "origin/main"], check=False)

    if args.check or args.dry_run:
        out = sh(rsync_cmd(mirror, dry=True), check=False).stdout
        items = itemized(out)
        if args.check:
            if items:
                print(f"[DIFF] 有 {len(items)} 处内容未同步（只读检查，未改动任何文件）：")
                for it in items[:60]:
                    print("  ", it)
                return 1
            print("[OK] 权威 ~/.dsh 与镜像一致")
            return 0
        print(f"[DRY] 将变更 {len(items)} 个文件：")
        for it in items[:60]:
            print("  ", it)
        return 0

    sh(rsync_cmd(mirror, dry=False))
    problems = scan_mirror(mirror)
    if problems:
        print("[ERR] 发布闸门未通过，已拒绝提交：")
        for p in problems[:40]:
            print("  -", p)
        print("  处理：把敏感内容从 ~/.dsh 移除，或在 EXCLUDES 里登记；确认可公开的再发布。")
        return 5

    files = changed_files(repo)
    if not files:
        print("[OK] 权威 ~/.dsh 与镜像已一致，无需发布")
        return 0

    append_changelog(repo, files)
    files = changed_files(repo)
    commit_and_pr(repo, files)
    return 0


if __name__ == "__main__":
    sys.exit(main())