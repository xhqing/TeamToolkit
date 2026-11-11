#!/usr/bin/env python3
"""pi 第三方 npm 包清单的备份同步器（2026-10-11 用户立，备份与迁移用）。

背景：本机 pi 装的第三方包（`~/.pi/agent/npm/`）是「智能体系统在用能力」的一部分，
换新笔记本时要能方便找回。第三方包的源码不适合直接入库镜像——体积大（本机实测
96MB，内含平台二进制）、与平台/Node 版本耦合、每次更新都要复制一堆文件；正确的
备份方式是「声明 + 精确锁 + 人读清单」：新机器按清单即可精确重建同样的包。

权威源：`~/.pi/agent/npm/`（其中 `package.json` / `package-lock.json` 由 pi 自动维护）
镜像：  `<agents-infra>/pi/agent/npm/`（agents-infra 仓库，即本机制的唯一出口；2026-11-05 起由 macmini 单 pusher 发布）
产物三件套：
  - package.json        （直接依赖声明，副本）
  - package-lock.json   （精确版本 + 下载地址 + 完整性哈希，副本；可复现安装）
  - PACKAGES.md         （本脚本生成：包名 / 精确版本 / 来源 / License / 用途）

更新时机：装 / 删 / 升级 pi 包后跑一次本脚本刷新，然后按规矩记 agents-infra
的 CHANGELOG 并提交。范围说明：目前只覆盖 npm 源安装的包（`~/.pi/agent/npm/`）；
若将来出现 git: 或本地路径安装的包，需要另行扩展（git 源记录「仓库 + pinned ref」）。

用法：
    refresh.py            # 同步（把三件套写入镜像目录）
    refresh.py --check    # 只校验镜像与当前本机是否一致（不写文件），不一致退出码 1
    refresh.py --dst DIR  # 指定镜像目录（默认 ~/Developer/agents-infra/pi/agent/npm）
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

# 权威源：pi 的 npm 包目录（pi 自动维护 package.json / package-lock.json）
SRC_NPM = Path.home() / ".pi" / "agent" / "npm"

# 镜像默认位置：agents-infra 仓库的 pi/agent/npm/
DEFAULT_DST = Path(os.environ.get("AGENTS_INFRA_DIR", Path.home() / "Developer" / "agents-infra")) / "pi" / "agent" / "npm"

# 人读「用途」列：脚本无法从包元数据自动提炼，在这里手工维护（按包名）。
# 新包未收录时回退到包的 description 字段（若也没有则留空，提示补充）。
PURPOSES = {
    "pi-intercom": "会话间通信：多 pi 会话消息互通（agent_call / intercom 工具；作者 nicobailon）",
    "pi-mcp-adapter": "MCP 服务器接入：把 MCP 工具接入 pi（MCP 网关）",
    "pi-provider-volcengine-agent-plan": "火山引擎（Volcengine）模型 provider：Agent Plan 套餐接入",
    "pi-workspace-history": "工作区历史：每轮快照、/undo /redo、/diff 查看、/tree 恢复",
}


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def clean_repo_url(repo) -> str | None:
    """把 package.json 的 repository 字段规范成可读 URL。"""
    if not repo:
        return None
    url = repo if isinstance(repo, str) else repo.get("url") or ""
    url = url.strip()
    if not url:
        return None
    for prefix in ("git+", "git://"):
        if url.startswith(prefix):
            url = url[len(prefix):]
    if url.endswith(".git"):
        url = url[:-4]
    return url


def build_packages_md() -> str:
    """生成 PACKAGES.md 内容（纯文本，未写入）。"""
    manifest = load_json(SRC_NPM / "package.json") or {}
    lock = load_json(SRC_NPM / "package-lock.json") or {}
    deps: dict = manifest.get("dependencies") or {}
    lock_pkgs: dict = (lock.get("packages") or {})

    lines = [
        "# pi 第三方包清单（自动生成，勿手改）",
        "",
        "> 本文件由 `~/.pi/agent/patch/npm-manifest/refresh.py` 生成，用于「本机 pi 在用第三方包」",
        "> 的备份与迁移（换新机器按本清单即可精确重建）。精确的可复现信息见同目录",
        "> `package.json` 与 `package-lock.json`；变更记录见仓库 CHANGELOG。",
        "",
        "| 包 | 精确版本 | 来源 | License | 用途 |",
        "|---|---|---|---|---|",
    ]

    for name in sorted(deps):
        vers = (lock_pkgs.get(f"node_modules/{name}") or {}).get("version", "")
        pkg = load_json(SRC_NPM / "node_modules" / name / "package.json") or {}
        version = vers or pkg.get("version") or "（未安装）"
        source = clean_repo_url(pkg.get("repository")) or f"https://www.npmjs.com/package/{name}"
        license_ = pkg.get("license") or "?"
        purpose = PURPOSES.get(name) or pkg.get("description") or ""
        lines.append(f"| `{name}` | {version} | {source} | {license_} | {purpose} |")

    lines.append("")
    return "\n".join(lines)


def read_source_files() -> dict[str, str]:
    """读取权威源三件套的文本内容（两个 json 原文 + 生成的 md）。"""
    out = {}
    for fname in ("package.json", "package-lock.json"):
        p = SRC_NPM / fname
        if not p.exists():
            print(f"[npm-manifest] 缺少权威源文件：{p}", file=sys.stderr)
            sys.exit(2)
        out[fname] = p.read_text(encoding="utf-8")
    out["PACKAGES.md"] = build_packages_md()
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="同步 pi 第三方包清单到 agents-infra 镜像")
    parser.add_argument("--check", action="store_true", help="只校验镜像与当前本机是否一致，不写文件")
    parser.add_argument("--dst", type=Path, default=DEFAULT_DST, help=f"镜像目录（默认 {DEFAULT_DST}）")
    args = parser.parse_args()

    if not SRC_NPM.exists():
        print(f"[npm-manifest] 权威源目录不存在：{SRC_NPM}", file=sys.stderr)
        return 2

    source = read_source_files()
    dst: Path = args.dst

    if args.check:
        diffs = []
        for fname, content in source.items():
            target = dst / fname
            if not target.exists():
                diffs.append(f"缺失：{target}")
            elif target.read_text(encoding="utf-8") != content:
                diffs.append(f"内容不一致：{target}")
        if diffs:
            print("[npm-manifest] 检查未通过：")
            for d in diffs:
                print("  -", d)
            print("  运行 refresh.py（不带 --check）以刷新镜像。")
            return 1
        print("[npm-manifest] 检查通过：镜像与当前本机一致。")
        return 0

    dst.mkdir(parents=True, exist_ok=True)
    changed, unchanged = [], []
    for fname, content in source.items():
        target = dst / fname
        if target.exists() and target.read_text(encoding="utf-8") == content:
            unchanged.append(fname)
            continue
        target.write_text(content, encoding="utf-8")
        changed.append(fname)

    print(f"[npm-manifest] 同步完成 → {dst}")
    print(f"  已更新：{', '.join(changed) if changed else '（无）'}")
    print(f"  未变化：{', '.join(unchanged) if unchanged else '（无）'}")
    if changed:
        print("  提醒：按规矩记 agents-infra 的 CHANGELOG 并提交。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
