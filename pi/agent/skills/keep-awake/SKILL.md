---
name: keep-awake
description: Mac 合盖防睡眠（clamshell prevent-sleep）。启用后合上笔记本盖子系统不睡眠、进程不暂停。当用户说「合盖防睡眠」「合盖不睡眠」「合上盖子继续跑」「防止 Mac 睡眠」「别让它睡了」「keep awake」「防止电脑休眠」「挂机下载/训练/编译期间别睡」等任何要防止 Mac（尤其合盖）睡眠的场景时使用本 skill。启用后必须提示已启用 + 重点提醒接入电源（合盖防睡眠仅在接电源时有效，电池下合盖是硬件强制睡眠）。
---

# Keep-Awake（Mac 合盖防睡眠）

一键启用 Mac「合盖防睡眠」：后台启动 `caffeinate -s`，创建 `PreventSystemSleep` assertion，防止合盖（Clamshell）与维护（Maintenance）两类系统级睡眠——合上盖子后进程继续跑、网络连接不断。

## 机制与前提（先读懂再用）

- **`caffeinate -s` 的 `PreventSystemSleep` assertion 只在接电源（AC）时有效**（`man caffeinate` 明确写明）。这是 macOS 的硬性前提，不是本脚本的限制。
- **电池供电时合盖是硬件强制睡眠，软件防不住**。电池下 `caffeinate -s` 只能防空闲 / 维护类睡眠（开盖状态下部分有效），合盖必睡。
- 因此启用后的回复里必须**重点提醒用户接入电源**——这是防睡眠能否生效的决定性条件。

## 启用

```bash
bash ~/.pi/agent/skills/keep-awake/scripts/on.sh
```

脚本行为（幂等，重复执行安全）：

1. `pgrep` 检查 `caffeinate -s` 是否已在跑，在跑则直接返回「已在跑」；
2. `pmset -g batt` 检测当前电源（AC / 电池）；
3. `nohup caffeinate -s` 后台启动并 `disown`，脱离当前 shell 存活；
4. 启动后再次 `pgrep` 确认进程在，失败则报错退出码 1。

**启用成功后，回复用户时必须包含两点：**

1. **已启用提示**：合盖防睡眠已开启，合上盖子进程继续跑；
2. **电源重点提醒**（不可省略）：⚠️ 合盖防睡眠只在接入电源时有效——请确认 Mac 已接电源；若当前是电池供电，合盖后仍会睡眠（硬件强制、软件防不住）。

## 停用

```bash
bash ~/.pi/agent/skills/keep-awake/scripts/off.sh
```

`pkill -f "caffeinate -s"` 解除防睡眠。用户说「停用防睡眠」「恢复睡眠」「不需要防睡眠了」等时执行；无进程在跑时输出「无需停用」、不会报错。

## 状态查询

```bash
pgrep -f "caffeinate -s" && pmset -g assertions | grep -i PreventSystemSleep
``

用户问「防睡眠还开着吗」时执行。

## 根因背景（为什么是 caffeinate -s）

2026-07-24 trading-agent 盯盘复盘：盯盘期间系统睡眠（合盖 / 维护）会暂停所有进程——富途 OpenD 的市场快照接口无 timeout、卡到 TCP 超时约 15 分钟才返回、整段采样空窗，代理、网络 CLI 同断。`caffeinate -s` 创建的 `PreventSystemSleep` assertion 能防住这两类系统级睡眠，是 macOS 上软件层面防合盖睡眠的标准做法；实现逻辑源自 trading-agent 的 keep-awake skill（2026-08-17 提炼为全局通用能力）。trading-agent 侧的盯盘场景已把防睡眠并入 trade 盯盘流程（preflight 无条件启用、停盯自动解除），不与本 skill 冲突——那边是盯盘专用链路，本 skill 是任意场景手动启用/停用的全局通用版。
