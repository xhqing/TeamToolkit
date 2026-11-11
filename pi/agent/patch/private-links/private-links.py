#!/usr/bin/env python3
"""私有内容接线管理：~/.dev/private（本体）↔ 各项目（同名软链接）

背景（为什么这样设计）
--------------------
不同步整套项目目录之后，项目里那些被 .gitignore 忽略、但跨机器需要保持一致的
私密内容（隐私待办、备份目录、本地文档、凭证等）就没有传输通道了。做法是：
本体统一放在 ~/.dev/private/<仓库名>/<相对路径>（这个目录用 Syncthing 在两台
机器之间双向同步），项目里同名的位置放一个软链接指过去。这样「项目目录克隆下来
就是干净的公开仓库」和「私密内容跨机一致」两件事同时成立。

清单在 manifest.tsv（仓库名 <TAB> 相对路径，支持 * 通配），本工具负责四件事：

  adopt        把项目里的实体文件/目录搬进 private，原地建软链接
  materialize  按清单把软链接建回来（新机器、新建 worktree 后必须跑）
  check        巡检：断链 / 软链接被替换成实体 / 私有侧孤儿 / 未登记的忽略文件
  restore      把某条内容从 private 搬回项目（取消接线）

软链接用本机绝对路径（$HOME 展开）。链接本身不进 git、不跨机，所以两台机器的
home 不同（/Users/xhq vs /Users/mac）不构成问题：各自 materialize 即可。

.git/info/exclude 由本工具自动维护：软链接在 git 眼里是文件，而项目 .gitignore
里常见的是带尾斜杠的目录规则（docs/、backup/），匹配不到软链接，会让它变成
未跟踪文件、被 /add 误收。所以本工具会把这些路径写进仓库本地的 exclude
（不带尾斜杠），**不修改仓库里的 .gitignore**，避免为了一点本地接线而改动公开仓库。
"""

from __future__ import annotations

import argparse
import glob
import os
import subprocess
import sys
from pathlib import Path

HOME = Path.home()
PRIVATE = HOME / ".dev" / "private"
DEV = HOME / "Developer"
MANIFEST = Path(__file__).resolve().parent / "manifest.tsv"

EXCLUDE_BEGIN = "# >>> private-links（自动维护，勿手改） >>>"
EXCLUDE_END = "# <<< private-links <<<"

# 巡检时视为「正常忽略、无需登记」的模式（缓存 / 构建产物 / 依赖 / 机器本地配置）
KNOWN_IGNORES = [
    r"(^|/)node_modules(/|$)",
    r"(^|/)\.venv(/|$)",
    r"(^|/)venv(/|$)",
    r"(^|/)__pycache__(/|$)",
    r"(^|/)\.lake(/|$)",
    r"(^|/)\.ruff_cache(/|$)",
    r"(^|/)\.pytest_cache(/|$)",
    r"(^|/)\.husky/_",
    r"\.egg-info(/|$)",
    r"\.pyc$",
    r"(^|/)dist(/|$)",
    r"(^|/)build(/|$)",
    r"(^|/)out(/|$)",
    r"\.vsix$",
    r"(^|/)tmp(/|$)",
    r"(^|/)\.DS_Store$",
    r"(^|/)\.ignore$",
    r"(^|/)DATA-LOCATION\.local\.md$",
    r"(^|/)vscode-copy-anywhere$",
    r"(^|/)verify/work(/|$)",
    r"\.backup-tags\.json$",
    r"\.pending-tasks\.json$",
    r"(^|/)state(/|$)",
    r"(^|/)data_cache(/|$)",
    r"(^|/)models(/|$)",
    r"(^|/)output(/|$)",
    r"packages/ai/src/providers/data(/|$)",
    r"(^|/)\.zig-cache(/|$)",
    r"(^|/)zig-cache(/|$)",
    r"(^|/)zig-out(/|$)",
]


# ---------------------------------------------------------------- 基础工具


def git(repo_dir: Path, *args: str) -> str:
    out = subprocess.run(
        ["git", "-C", str(repo_dir), *args], capture_output=True, text=True
    )
    return out.stdout.strip()


def repo_name_of(path: Path) -> str | None:
    """从仓库目录或 worktree 目录反推仓库名（worktree 取主仓库名）。"""
    common = git(path, "rev-parse", "--path-format=absolute", "--git-common-dir")
    if not common:
        return None
    common_path = Path(common)
    return common_path.parent.name


def all_repo_dirs() -> list[tuple[str, Path]]:
    """~/Developer 下所有仓库（含 worktree 目录），按仓库名去重保留主工作区优先。"""
    seen: dict[str, Path] = {}
    if not DEV.exists():
        return []
    for entry in sorted(DEV.iterdir()):
        if not entry.is_dir():
            continue
        if not (entry / ".git").exists():
            continue
        name = repo_name_of(entry)
        if not name:
            continue
        # 主工作区（.git 是目录）优先于 worktree（.git 是文件）
        if name not in seen or (entry / ".git").is_dir():
            seen[name] = entry
    return sorted(seen.items())


def worktrees_of(repo_dir: Path) -> list[Path]:
    out = git(repo_dir, "worktree", "list", "--porcelain")
    paths = []
    for line in out.splitlines():
        if line.startswith("worktree "):
            paths.append(Path(line[len("worktree ") :]))
    return paths


def load_manifest() -> list[tuple[str, str]]:
    entries: list[tuple[str, str]] = []
    for raw in MANIFEST.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip("\n")
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if "\t" not in line:
            print(f"[WARN] 清单行缺少 TAB，已跳过：{line}")
            continue
        repo, rel = line.split("\t", 1)
        entries.append((repo.strip(), rel.strip()))
    return entries


def manifest_by_repo() -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for repo, rel in load_manifest():
        grouped.setdefault(repo, []).append(rel)
    return grouped


def expand_private(repo: str, pattern: str) -> list[str]:
    """按私有侧的实际情况展开某条清单（返回仓库内相对路径列表）。"""
    base = PRIVATE / repo
    if "*" not in pattern and "?" not in pattern:
        return [pattern] if (base / pattern).exists() else []
    found = glob.glob(str(base / pattern), recursive=True)
    return sorted(str(Path(p).relative_to(base)) for p in found)


def link_one(repo_dir: Path, rel: str, dry: bool) -> str:
    """在仓库里建立指向私有本体的软链接。返回状态字符串。"""
    repo = repo_name_of(repo_dir)
    if not repo:
        return "SKIP(非仓库)"
    target = PRIVATE / repo / rel
    if not target.exists() and not target.is_symlink():
        return f"SKIP(私有侧不存在: {rel})"
    link = repo_dir / rel
    if link.is_symlink():
        if Path(os.readlink(link)) == target:
            return f"OK(已接线) {rel}"
        return f"WARN(指向别处，未改动) {rel} -> {os.readlink(link)}"
    if link.exists():
        return f"WARN(存在实体文件，需先 adopt) {rel}"
    if dry:
        return f"DRY(将建链接) {rel}"
    link.parent.mkdir(parents=True, exist_ok=True)
    os.symlink(target, link)
    return f"LINK {rel}"


def ensure_excludes(repo_dir: Path, rels: list[str], dry: bool) -> list[str]:
    """把「软链接在 git 眼里仍是未跟踪文件」的路径写进 .git/info/exclude。"""
    common = git(repo_dir, "rev-parse", "--path-format=absolute", "--git-common-dir")
    if not common:
        return []
    exclude_file = Path(common) / "info" / "exclude"
    needed: list[str] = []
    for rel in rels:
        cur = repo_dir / rel
        if not cur.exists() and not cur.is_symlink():
            continue
        rc = subprocess.run(
            ["git", "-C", str(repo_dir), "check-ignore", "-q", rel]
        ).returncode
        if rc != 0:  # 0 = 已被忽略；1 = 未被忽略
            needed.append("/" + rel)
    if not needed or dry:
        return needed

    existing = exclude_file.read_text(encoding="utf-8") if exclude_file.exists() else ""
    kept: list[str] = []
    inside = False
    for line in existing.splitlines():
        if line.strip() == EXCLUDE_BEGIN:
            inside = True
            continue
        if line.strip() == EXCLUDE_END:
            inside = False
            continue
        if not inside:
            kept.append(line)

    # 合并旧块里已有的条目，避免每轮覆盖丢失
    old_block = [
        ln for ln in existing.splitlines() if ln.startswith("/") and ln not in kept
    ]
    entries = sorted(set(old_block) | set(needed))
    block = [EXCLUDE_BEGIN, *entries, EXCLUDE_END]
    text = "\n".join(kept).rstrip("\n")
    text = (text + "\n\n" if text else "") + "\n".join(block) + "\n"
    exclude_file.parent.mkdir(parents=True, exist_ok=True)
    exclude_file.write_text(text, encoding="utf-8")
    return needed


# ---------------------------------------------------------------- 子命令


def cmd_adopt(args) -> int:
    grouped = manifest_by_repo()
    targets = args.repos or sorted(grouped.keys())
    moved = 0
    problems: list[str] = []
    for repo in targets:
        repo_dir = DEV / repo
        if not repo_dir.exists():
            print(f"[SKIP] {repo}：目录不存在")
            continue
        for pattern in grouped.get(repo, []):
            matches = glob.glob(str(repo_dir / pattern))
            for src_str in sorted(matches):
                src = Path(src_str)
                if src.is_symlink():
                    continue
                if not src.exists():
                    continue
                rel = str(src.relative_to(repo_dir))
                dst = PRIVATE / repo / rel
                if dst.exists() or dst.is_symlink():
                    problems.append(f"{repo}/{rel}：私有侧已存在同名内容，未搬迁")
                    continue
                print(f"ADOPT {repo}/{rel} -> {dst}")
                if not args.dry_run:
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    src.rename(dst)  # 同一文件系统内原子操作
                    os.symlink(dst, src)
                moved += 1
        if not args.dry_run:
            rels: list[str] = []
            for pattern in grouped.get(repo, []):
                rels += expand_private(repo, pattern)
            ensure_excludes(repo_dir, rels, args.dry_run)
    print(f"\n共处理 {moved} 项" + ("（dry-run，未落盘）" if args.dry_run else ""))
    for p in problems:
        print(f"[CONFLICT] {p}")
    return 0


def cmd_materialize(args) -> int:
    grouped = manifest_by_repo()
    if args.paths:
        repo_dirs: list[tuple[str, Path]] = []
        for raw in args.paths:
            p = Path(raw).expanduser().resolve()
            name = repo_name_of(p)
            if not name:
                print(f"[SKIP] {p}：不是 git 仓库")
                continue
            repo_dirs.append((name, p))
    else:
        repo_dirs = []
        for name, main_dir in all_repo_dirs():
            repo_dirs.append((name, main_dir))
            for wt in worktrees_of(main_dir)[1:]:
                if wt.exists():
                    repo_dirs.append((name, wt))

    total = 0
    for name, path in repo_dirs:
        rels: list[str] = []
        for pattern in grouped.get(name, []):
            rels += expand_private(name, pattern)
        if not rels:
            continue
        results = [link_one(path, rel, args.dry_run) for rel in rels]
        changed = [r for r in results if r.startswith(("LINK", "DRY"))]
        if changed or args.verbose:
            print(f"## {name}  ({path})")
            for r in results:
                if args.verbose or r.startswith(("LINK", "DRY", "WARN")):
                    print("  " + r)
        total += len(changed)
        if not args.dry_run:
            ensure_excludes(path, rels, args.dry_run)
    print(f"\n共建立 {total} 个软链接（共 {len(repo_dirs)} 个仓库/工作区）")
    return 0


def cmd_check(args) -> int:
    import re

    grouped = manifest_by_repo()
    issues = 0

    print("== 1. 清单条目在项目侧是否接线正常 ==")
    for repo, patterns in sorted(grouped.items()):
        rels: list[str] = []
        for pattern in patterns:
            expanded = expand_private(repo, pattern)
            if not expanded:
                print(f"  [MISS] {repo}/{pattern}：私有侧不存在（清单过期？）")
                issues += 1
            rels += expanded
        repo_dir = DEV / repo
        if not repo_dir.exists():
            continue
        for rel in rels:
            link = repo_dir / rel
            target = PRIVATE / repo / rel
            if link.is_symlink():
                if Path(os.readlink(link)) != target:
                    print(f"  [WRONG] {repo}/{rel}：软链接指向别处")
                    issues += 1
            elif link.exists():
                print(f"  [ENTITY] {repo}/{rel}：被替换成实体文件（同步会失效）")
                issues += 1
            else:
                print(f"  [BROKEN] {repo}/{rel}：软链接缺失")
                issues += 1

    print("\n== 2. 私有侧孤儿（本体在，项目侧没有登记） ==")
    if PRIVATE.exists():
        for repo_path in sorted(PRIVATE.iterdir()):
            if not repo_path.is_dir() or repo_path.name.startswith("."):
                continue
            repo = repo_path.name
            if repo not in grouped:
                print(f"  [ORPHAN] 整个仓库目录未登记：{repo}/")
                issues += 1
                continue
            for root, dirs, files in os.walk(repo_path):
                dirs[:] = [d for d in dirs if not d.startswith(".")]
                for name in files:
                    rel = str((Path(root) / name).relative_to(repo_path))
                    covered = False
                    for pattern in grouped[repo]:
                        if "*" in pattern or "?" in pattern:
                            if re.fullmatch(
                                pattern.replace(".", r"\.").replace("*", ".*"),
                                rel,
                            ):
                                covered = True
                                break
                        elif pattern == rel:
                            covered = True
                            break
                        elif rel.startswith(pattern.rstrip("/") + "/"):
                            covered = True
                            break
                    if not covered:
                        print(f"  [ORPHAN] {repo}/{rel}：不在清单里")
                        issues += 1

    print("\n== 3. 仓库里新出现的忽略文件（可能是漏登记的私密内容） ==")
    known = [re.compile(p) for p in KNOWN_IGNORES]
    for name, main_dir in all_repo_dirs():
        for wt in [main_dir] + worktrees_of(main_dir)[1:]:
            if not wt.exists():
                continue
            out = subprocess.run(
                [
                    "git",
                    "-C",
                    str(wt),
                    "-c",
                    "core.quotePath=false",
                    "status",
                    "--porcelain",
                    "--ignored=matching",
                    "-uall",
                ],
                capture_output=True,
                text=True,
            ).stdout
            for line in out.splitlines():
                if not line.startswith("!! "):
                    continue
                rel = line[3:].strip().strip('"')
                if any(k.search(rel) for k in known):
                    continue
                covered = False
                for pattern in grouped.get(name, []):
                    if rel == pattern or rel.startswith(pattern.rstrip("/") + "/"):
                        covered = True
                        break
                    if ("*" in pattern) and re.fullmatch(
                        pattern.replace(".", r"\.").replace("*", ".*"), rel
                    ):
                        covered = True
                        break
                if not covered:
                    print(f"  [CANDIDATE] {name}/{rel}")
                    issues += 1

    print("\n== 4. .git/info/exclude 是否覆盖软链接 ==")
    for name, main_dir in all_repo_dirs():
        rels: list[str] = []
        for pattern in grouped.get(name, []):
            rels += expand_private(name, pattern)
        if not rels:
            continue
        missing = ensure_excludes(main_dir, rels, dry=True)
        if missing:
            print(f"  [EXCLUDE-MISS] {name}：{missing}")
            issues += 1

    print(f"\n合计问题：{issues}")
    return 0 if issues == 0 else 1


def cmd_restore(args) -> int:
    repo, rel = args.repo, args.rel
    src = PRIVATE / repo / rel
    dst = DEV / repo / rel
    if not src.exists():
        print(f"[ERR] 私有侧不存在：{src}")
        return 1
    if dst.exists() and not dst.is_symlink():
        print(f"[ERR] 项目侧已有实体文件，先处理：{dst}")
        return 1
    if not args.dry_run:
        if dst.is_symlink():
            dst.unlink()
        dst.parent.mkdir(parents=True, exist_ok=True)
        src.rename(dst)
        print(f"RESTORE {dst}\n提示：清单里仍保留这条登记，记得同步删掉否则 check 会报 MISS。")
    else:
        print(f"DRY 将搬回：{src} -> {dst}")
    return 0


def cmd_list(args) -> int:
    grouped = manifest_by_repo()
    for repo, patterns in sorted(grouped.items()):
        rels: list[str] = []
        for pattern in patterns:
            rels += expand_private(repo, pattern)
        total = 0
        for rel in rels:
            p = PRIVATE / repo / rel
            try:
                total += p.stat().st_size if p.is_file() else sum(
                    f.stat().st_size for f in p.rglob("*") if f.is_file()
                )
            except OSError:
                pass
        print(f"{repo:<30} {len(rels):>3} 项  {total / 1048576:>8.1f} MB")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="~/.dev/private 私有内容接线管理")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("adopt", help="把项目里的实体搬进 private 并建软链接")
    p.add_argument("repos", nargs="*", help="只处理这些仓库（默认全部）")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_adopt)

    p = sub.add_parser("materialize", help="按清单建软链接（新机器 / 新 worktree）")
    p.add_argument("paths", nargs="*", help="仓库或 worktree 路径（默认全部）")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("-v", "--verbose", action="store_true")
    p.set_defaults(func=cmd_materialize)

    p = sub.add_parser("check", help="巡检接线状态")
    p.set_defaults(func=cmd_check)

    p = sub.add_parser("restore", help="把某条内容搬回项目（取消接线）")
    p.add_argument("repo")
    p.add_argument("rel")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_restore)

    p = sub.add_parser("list", help="按仓库汇总登记项与体积")
    p.set_defaults(func=cmd_list)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
