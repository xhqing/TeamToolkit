#!/usr/bin/env python3
"""许可证类型与项目性质匹配检查（团队许可证规则的工具层粗筛）。

规则出处：全局 AGENTS.md「项目许可证与版权声明」节（2026-11-08 用户立）——
**软件项目用 MIT，非软件项目用 CC BY 4.0，二选一、没有第三种**。判据是「谁消费它」：
内容被程序 / LLM 消费、改动会改变程序行为 → 软件；以阅读为目的的文字 → 非软件。

为什么需要这个脚本：规矩只有文本、没有工具层检查时就会漏。2026-11-11 blog
（内容型项目）挂着 MIT 一直没人发现，原因是 commit skill 第 9b 步只校验
「LICENSE.md 是否存在」，**从不校验已有许可证的类型是否与项目性质匹配**。

本脚本做**粗筛**，输出候选清单，不做最终裁决：
- 能确定的（明确软件 / 明确内容）直接给 OK 或 MISMATCH；
- 拿不准的（规则集、混合仓库）标 REVIEW，交给 AI 语义判断或用户裁定。

用法：
    python3 license-check.py                    # 扫 ~/Developer 下全部 git 仓库
    python3 license-check.py --root <目录>       # 换扫描根
    python3 license-check.py --repo <仓库路径>   # 只查一个仓库

退出码：0 = 无 MISMATCH；1 = 存在 MISMATCH（便于 CI / 巡检脚本判断）。
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

COPY_SUFFIXES = {".md", ".markdown", ".txt", ".rst", ".adoc"}
CODE_SUFFIXES = {
    ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".go", ".rs", ".lean", ".c", ".h", ".cpp", ".hpp", ".cc",
    ".java", ".kt", ".swift", ".m", ".mm", ".rb", ".php", ".sh", ".bash",
    ".vue", ".svelte", ".sql",
}
BUILD_MARKERS = (
    "package.json", "pyproject.toml", "setup.py", "Cargo.toml", "go.mod",
    "lakefile.lean", "lake-manifest.json", "Makefile", "CMakeLists.txt",
    "build.gradle", "pom.xml", "Gemfile",
)
# 这些目录 / 文件说明内容被程序（或 LLM）消费、会改变程序行为 → 按规则属「软件」
# 注意：`AGENTS.md` 单独出现**不算**软件判据——团队里几乎每个仓库（含内容型项目）都有它，
# 它在这里只是「项目定位 / Worker 边界」文档。真正的规则 / 技能证据看目录与规则文件名。
RULE_DIRS = (".pi/skills", ".pi/extensions", "skills", "prompts", "rules")
RULE_FILE_PATTERNS = ("*Rules*.md", "*rules*.md", "*prompt*.md", "*Prompt*.md", "*rule-*.md")
# 典型内容目录：以阅读为目的的文字集中在这里
CONTENT_DIRS = ("docs/post", "docs/articles", "posts", "articles", "content", "chapters", "book")
SKIP_DIRS = {"node_modules", ".git", ".venv", "venv", "dist", "build", "target", "tmp"}


def detect_license(repo: Path) -> tuple[str, str]:
    """返回 (许可证类型标识, 原始首行)。"""
    for name in ("LICENSE.md", "LICENSE", "LICENSE.txt", "COPYING"):
        p = repo / name
        if not p.is_file():
            continue
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            return ("unknown", "")
        head = text[:4000]
        if "Attribution 4.0 International" in head or re.search(r"CC BY 4\.0", head, re.I):
            return ("CC BY 4.0", "CC BY 4.0")
        if re.search(r"^\s*#?\s*MIT License", head, re.M) or "Permission is hereby granted, free of charge" in head:
            return ("MIT", "MIT")
        if "GNU LESSER GENERAL PUBLIC LICENSE" in head:
            return ("LGPL", "LGPL")
        if "GNU GENERAL PUBLIC LICENSE" in head:
            ver = "3" if "Version 3" in head else ("2" if "Version 2" in head else "?")
            return (f"GPL-{ver}", f"GPL-{ver}")
        if "Apache License" in head and "Version 2.0" in head:
            return ("Apache-2.0", "Apache-2.0")
        if "Mozilla Public License" in head:
            return ("MPL-2.0", "MPL-2.0")
        if "PolyForm Noncommercial" in head:
            return ("PolyForm-Noncommercial", "PolyForm Noncommercial")
        if "BSD 3-Clause" in head:
            return ("BSD-3-Clause", "BSD-3-Clause")
        if "BSD 2-Clause" in head:
            return ("BSD-2-Clause", "BSD-2-Clause")
        return ("unknown", head.splitlines()[0][:60] if head else "")
    return ("none", "")


def is_fork(repo: Path) -> bool:
    """上游 fork（含远端 upstream，或 LICENSE 里保留原项目版权行）→ 许可证由上游决定，不做性质校验。"""
    try:
        remotes = subprocess.run(
            ["git", "-C", str(repo), "remote", "-v"],
            capture_output=True, text=True, timeout=10,
        ).stdout
    except (OSError, subprocess.SubprocessError):
        remotes = ""
    if re.search(r"^upstream\b", remotes, re.M):
        return True
    # 上游版权行：里写「original <project>」之类
    for name in ("LICENSE.md", "LICENSE"):
        p = repo / name
        if p.is_file():
            head = p.read_text(encoding="utf-8", errors="ignore")[:2000]
            if re.search(r"original .*project", head, re.I):
                return True
            if len(re.findall(r"^Copyright \(c\)", head, re.M)) > 1:
                return True
    return False


def count_files(repo: Path) -> tuple[int, int]:
    copy_n = code_n = 0
    for root, dirs, files in os.walk(repo):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            suffix = Path(f).suffix.lower()
            if suffix in COPY_SUFFIXES:
                copy_n += 1
            elif suffix in CODE_SUFFIXES:
                code_n += 1
    return copy_n, code_n


def classify(repo: Path) -> tuple[str, str]:
    """返回 (性质, 依据说明)：software / content / review。"""
    copy_n, code_n = count_files(repo)
    builds = [m for m in BUILD_MARKERS if (repo / m).exists()]
    rule_dirs = [d for d in RULE_DIRS if (repo / d).is_dir()]
    rule_files = []
    for pat in RULE_FILE_PATTERNS:
        rule_files += [str(p.relative_to(repo)) for p in list(repo.glob(pat)) + list((repo / "docs").glob(pat)) if p.is_file()]
    content_dirs = [d for d in CONTENT_DIRS if (repo / d).is_dir()]

    if builds and code_n >= 3:
        return ("software", f"构建配置 {builds[0]} + {code_n} 个源码文件")
    if code_n >= 20:
        return ("software", f"{code_n} 个源码文件")
    if rule_dirs:
        return ("software", f"规则 / 技能目录 {rule_dirs[0]}（内容被 LLM 消费）")
    if rule_files:
        return ("software", f"规则 / 提示词文件 {rule_files[0]}（被 LLM 注入消费）+ {code_n} 个源码文件")
    if builds:
        return ("software", f"构建配置 {builds[0]}")
    if content_dirs and copy_n >= 10:
        return ("content", f"内容目录 {content_dirs[0]} + {copy_n} 个文档、{code_n} 个源码文件")
    if copy_n >= 10 and code_n <= 2:
        return ("review", f"{copy_n} 个文档、{code_n} 个源码文件，无内容目录也无规则特征——需人工判")
    return ("review", f"文档 {copy_n} / 源码 {code_n}，特征不足以自动判定")


def expected(kind: str) -> str:
    return "MIT" if kind == "software" else "CC BY 4.0"


def ccby_purity(repo: Path) -> str:
    """CC BY 4.0 要求 LICENSE 文件是零追加的纯官方文本，否则 GitHub 识别成 Other（2026-11-11 实测）。"""
    for name in ("LICENSE.md", "LICENSE", "LICENSE.txt"):
        p = repo / name
        if not p.is_file():
            continue
        first = p.read_text(encoding="utf-8", errors="ignore").lstrip("\ufeff").splitlines()[0].strip()
        size = p.stat().st_size
        if first != "Attribution 4.0 International":
            return f"首行为「{first[:30]}」，不是官方 legalcode 开头——GitHub 会识别成 Other"
        if size > 19000:
            return f"{size} 字节，超过官方文本（约 18657）——像是有追加内容，GitHub 会识别成 Other"
        return ""
    return ""


def check_repo(repo: Path) -> dict:
    lic, lic_raw = detect_license(repo)
    res = {"repo": repo.name, "license": lic, "license_raw": lic_raw}
    if lic == "none":
        res.update(kind="—", verdict="NO LICENSE", detail="无许可证文件")
        return res
    if is_fork(repo):
        res.update(kind="—", verdict="SKIP (fork)", detail="fork 项目，许可证随上游")
        return res
    kind, why = classify(repo)
    res.update(kind=kind, detail=why)
    purity = ccby_purity(repo) if lic == "CC BY 4.0" else ""
    pure_check = bool(purity)
    if kind == "software":
        verdict = "OK" if lic == "MIT" else ("MISMATCH" if lic == "CC BY 4.0" else f"CHECK ({lic})")
    elif kind == "content":
        verdict = "OK" if lic == "CC BY 4.0" else ("MISMATCH" if lic == "MIT" else f"CHECK ({lic})")
    else:
        verdict = "REVIEW"
    if pure_check and verdict in ("OK", "REVIEW"):
        verdict = "WARN (CC BY 文件不纯)"
        res["detail"] = purity
    res["verdict"] = verdict
    return res


def collect_repos(root: Path) -> list[Path]:
    return sorted(
        p for p in root.iterdir()
        if p.is_dir() and (p / ".git").exists()
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="许可证类型与项目性质匹配检查")
    ap.add_argument("--root", default=str(Path.home() / "Developer"), help="扫描根目录（默认 ~/Developer）")
    ap.add_argument("--repo", action="append", default=None, help="只检查指定仓库（可多次）")
    args = ap.parse_args()

    repos = [Path(r).expanduser().resolve() for r in args.repo] if args.repo else collect_repos(Path(args.root).expanduser())

    rows = [check_repo(p) for p in repos]
    width = max((len(r["repo"]) for r in rows), default=10)

    print(f"{'仓库'.ljust(width)}  {'许可证'.ljust(20)} {'性质'.ljust(9)} 结论")
    print("-" * (width + 42))
    for r in rows:
        print(f"{r['repo'].ljust(width)}  {r['license'].ljust(20)} {r['kind'].ljust(9)} {r['verdict']}  —  {r['detail']}")
    mismatches = [r for r in rows if r["verdict"].startswith("MISMATCH")]
    warns = [r for r in rows if r["verdict"].startswith("WARN")]
    reviews = [r for r in rows if r["verdict"] == "REVIEW"]
    print()
    print(f"共 {len(rows)} 个仓库：OK {sum(1 for r in rows if r['verdict'] == 'OK')}，"
          f"MISMATCH {len(mismatches)}，WARN {len(warns)}，REVIEW {len(reviews)}，"
          f"其余为 fork / 无许可证 / 其它许可需人工判断")
    if mismatches:
        print("\n需要处理（类型与性质不匹配）：")
        for r in mismatches:
            print(f"  - {r['repo']}：现为 {r['license']}，按性质（{r['kind']}）应为 {expected(r['kind'])}")
    if warns:
        print("\n需要处理（CC BY 4.0 文件不是纯官方全文，GitHub 会显示 Other）：")
        for r in warns:
            print(f"  - {r['repo']}：{r['detail']}")
    return 1 if (mismatches or warns) else 0


if __name__ == "__main__":
    sys.exit(main())