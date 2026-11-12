#!/bin/bash
# install.sh —— 安装 / 重装 macmini 的 magpie 反向隧道（launchd 常驻，断线自动重连）
#
# 用途：macmini 上默认使用 magpie 的免费模型。magpie.app 只跑在本机（arm64，
# macmini 是 x64 装不了），所以由本机向 macmini 建 SSH 反向隧道，把 macmini 的
# 127.0.0.1:3425 映射回本机的 magpie 代理。
#
# 用法：
#   bash ~/.pi/agent/patch/magpie-tunnel/install.sh          # 安装并启动
#   bash ~/.pi/agent/patch/magpie-tunnel/install.sh --status # 只看状态
#   bash ~/.pi/agent/patch/magpie-tunnel/install.sh --remove # 卸载
set -uo pipefail

LABEL="com.xhq.magpie-tunnel"
SRC="$HOME/.pi/agent/patch/magpie-tunnel/$LABEL.plist"
DST="$HOME/Library/LaunchAgents/$LABEL.plist"
UID_N=$(id -u)

status() {
  echo "== launchd =="
  launchctl print "gui/$UID_N/$LABEL" 2>/dev/null | grep -E "state|pid|last exit" | head -5 || echo "未加载"
  echo "== 本机 magpie =="
  curl -s -m 5 -H "Authorization: Bearer magpie" http://127.0.0.1:3425/v1/models >/dev/null \
    && echo "OK（本机 3425 有响应）" || echo "FAIL（本机 magpie 未运行）"
  echo "== macmini 侧 =="
  ssh mac-mini 'curl -s -m 8 -H "Authorization: Bearer magpie" http://127.0.0.1:3425/v1/models >/dev/null && echo "OK（隧道通）" || echo "FAIL（隧道不通）"' 2>&1
}

case "${1:-install}" in
  --status|status) status; exit 0 ;;
  --remove|remove)
    launchctl bootout "gui/$UID_N/$LABEL" 2>/dev/null
    rm -f "$DST"
    echo "已卸载 $LABEL"
    exit 0 ;;
esac

mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
cp "$SRC" "$DST"
launchctl bootout "gui/$UID_N/$LABEL" 2>/dev/null
launchctl bootstrap "gui/$UID_N" "$DST" || { echo "bootstrap 失败"; exit 1; }
sleep 2
status