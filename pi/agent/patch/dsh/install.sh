#!/usr/bin/env bash
# 把 project-append-system 插件复制到 dsh-tui profile。
# 只复制文件；cordis.patch.yml 的挂载行需要人工确认（避免脚本改坏用户 YAML）。
set -euo pipefail

SRC="${1:-$HOME/.pi/agent/patch/dsh/project-append-system.mjs}"
DST="$HOME/.dsh/profiles/dsh-tui/plugins/project-append-system.mjs"

[ -f "$SRC" ] || { echo "找不到插件源：$SRC" >&2; exit 1; }
mkdir -p "$(dirname "$DST")"
cp "$SRC" "$DST"
echo "已复制：$DST"
echo
echo "确认 ~/.dsh/profiles/dsh-tui/cordis.patch.yml 含以下条目："
echo
echo "  - id: project-append-system"
echo "    name: ./plugins/project-append-system.mjs"
echo
echo "然后用 dsh --profile dsh-tui --dump-config | grep project-append-system 验证。"