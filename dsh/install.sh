#!/usr/bin/env bash
# 把 DSH 核心基础设施从 ~/.pi/agent/dsh 部署到 ~/.dsh。
# 只覆盖核心配置与插件，不碰 sessions / storages / credentials 等运行时数据。
set -euo pipefail

SRC="$HOME/.pi/agent/dsh"
DST="$HOME/.dsh"
PLUGIN="$HOME/.pi/agent/patch/dsh/project-append-system.mjs"

[ -f "$SRC/AGENTS.md" ] || { echo "找不到 $SRC/AGENTS.md" >&2; exit 1; }
[ -f "$PLUGIN" ] || { echo "找不到插件源：$PLUGIN" >&2; exit 1; }

mkdir -p "$DST/profiles/dsh-tui/plugins"
cp "$SRC/AGENTS.md" "$DST/AGENTS.md"
for f in cordis.yml cordis.patch.yml package.json pnpm-lock.yaml pnpm-workspace.yaml; do
  cp "$SRC/profiles/dsh-tui/$f" "$DST/profiles/dsh-tui/$f"
done
cp "$PLUGIN" "$DST/profiles/dsh-tui/plugins/project-append-system.mjs"

echo "已部署到 $DST/profiles/dsh-tui"
echo "首次在新机器上还需在 $DST/profiles/dsh-tui 跑一次 pnpm install（或让 dsh 初始化），然后重启 dsh。"
