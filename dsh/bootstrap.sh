#!/usr/bin/env bash
# 从 agents-infra 的 dsh/ 目录部署 DSH 核心基础设施到 ~/.dsh。
# 用法：在 clone 的 agents-infra 里运行 `bash dsh/bootstrap.sh`。
# 只复制核心配置与插件；不碰 sessions / storages / credentials。
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DST="${HOME}/.dsh"

if [ "$SRC" = "$DST" ]; then
  echo "当前就在 ~/.dsh，无需 bootstrap。"
  exit 0
fi

[ -f "$SRC/AGENTS.md" ] || { echo "找不到 $SRC/AGENTS.md" >&2; exit 1; }

mkdir -p "$DST/profiles/dsh-tui/plugins"
cp "$SRC/AGENTS.md" "$DST/AGENTS.md"
[ -f "$SRC/README.md" ] && cp "$SRC/README.md" "$DST/README.md"
for f in cordis.yml cordis.patch.yml package.json pnpm-lock.yaml pnpm-workspace.yaml; do
  [ -f "$SRC/profiles/dsh-tui/$f" ] && cp "$SRC/profiles/dsh-tui/$f" "$DST/profiles/dsh-tui/$f"
done
[ -f "$SRC/profiles/dsh-tui/plugins/project-append-system.mjs" ] && \
  cp "$SRC/profiles/dsh-tui/plugins/project-append-system.mjs" \
     "$DST/profiles/dsh-tui/plugins/project-append-system.mjs"

echo "已部署到 $DST/profiles/dsh-tui"
echo "下一步：在 $DST/profiles/dsh-tui 跑 pnpm install（或让 dsh 初始化），并配置本机模型/凭证。"