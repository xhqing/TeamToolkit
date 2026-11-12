#!/bin/bash
# disable.sh —— 停用 macmini 上的常驻会话（2026-11-12 用户决定）
#
# 用户原话：「不要用常驻会话了，需要的时候直接用 tmux 在 macmini 上面开新的会话。」
#
# 本脚本做四件事：
#   1. 卸载 launchd 守护 com.xhq.pi-duty（每 120 秒会按 duty.conf 拉起/重启 SCREEN 会话）；
#   2. 把它的 plist 改名为 .disabled（否则重启后 launchd 又会加载）；
#   3. 停掉当前所有 pi-* SCREEN 会话（macmini 值班会话 + Mark 系）；
#   4. 清空 duty.conf（保留 duty.conf.bak-20261112 备份）。
#
# 在 macmini 上执行：ssh mac-mini 'bash ~/.pi/agent/patch/duty-macmini/disable.sh'
set -uo pipefail
UID_N=$(id -u)

echo "=== 1. 卸载 launchd 守护 ==="
if launchctl print "gui/$UID_N/com.xhq.pi-duty" >/dev/null 2>&1; then
  launchctl bootout "gui/$UID_N/com.xhq.pi-duty" 2>/dev/null && echo "✅ 已卸载 com.xhq.pi-duty"
else
  echo "ℹ️ com.xhq.pi-duty 未加载"
fi

echo "=== 2. plist 改名 ==="
P="$HOME/Library/LaunchAgents/com.xhq.pi-duty.plist"
if [ -f "$P" ]; then
  mv "$P" "$P.disabled" && echo "✅ plist 已改名为 com.xhq.pi-duty.plist.disabled"
else
  echo "ℹ️ 没有 com.xhq.pi-duty.plist（或已改过名）"
fi

echo "=== 3. 停 SCREEN 会话 ==="
# duty.sh / session-link 用的是自定义 SCREENDIR，默认的 screen -ls 看不到
export SCREENDIR="$HOME/.pi-duty-screens"
[ -d "$SCREENDIR" ] || export SCREENDIR="$HOME/Library/Screens"
sessions=$(screen -ls 2>/dev/null | grep -oE '[0-9]+\.pi-[A-Za-z0-9_-]+' | sed 's/^[0-9]*\.//' | sort -u)
if [ -z "$sessions" ]; then
  echo "ℹ️ 没有 SCREEN 会话在跑"
else
  for s in $sessions; do
    if screen -S "$s" -X quit 2>/dev/null; then
      echo "✅ 已停止 $s"
    else
      echo "⚠️ 停止 $s 失败（可能已自行退出）"
    fi
  done
fi

echo "=== 4. 清空 duty.conf ==="
C="$HOME/.pi/agent/patch/duty-macmini/duty.conf"
if [ -f "$C" ]; then
  cp "$C" "$C.bak-20261112"
  cat > "$C" <<'EOF'
# macmini 常驻会话清单 —— 2026-11-12 用户决定停用（不再保留常驻会话）
# 需要时用 tmux 临时开会话、用完即清，不再由 duty.sh 守护。
# 恢复办法：看 duty.conf.bak-20261112；需要的话手工把
# ~/Library/LaunchAgents/com.xhq.pi-duty.plist.disabled 改回 .plist 并 bootstrap。
EOF
  echo "✅ duty.conf 已清空（原文件备份为 duty.conf.bak-20261112）"
else
  echo "ℹ️ duty.conf 不存在"
fi

sleep 1
echo
echo "=== 复核 ==="
if ps axww -o pid,command | grep -E "/Users/mac/.local/node/bin/pi " | grep -v grep; then
  echo "⚠️ 仍有 pi 进程在跑（见上）"
else
  echo "✅ 没有常驻 pi 进程"
fi
if screen -ls 2>/dev/null | grep -E "pi-[A-Za-z]"; then
  echo "⚠️ 仍有 SCREEN 会话"
else
  echo "✅ 没有 SCREEN 会话"
fi