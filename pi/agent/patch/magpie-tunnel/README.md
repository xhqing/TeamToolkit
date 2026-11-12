# magpie-tunnel —— 让 macmini 用上 magpie 的免费模型

## 为什么要这条隧道

2026-11-11 用户立规：

> macmini 上不管是什么 harness，默认使用 magpie 的免费模型；如需使用其它付费模型或
> 订阅模型必须经过用户同意；如果 magpie 的免费模型使用不了，需要汇报原因。

现实障碍：**magpie.app 只跑在本机（MacBook），监听 `127.0.0.1:3425`，而且它的二进制是
arm64**——macmini 是 x64，装不了同一个 app。于是 macmini 上的 pi 默认 provider
（`magpie`）永远连不上，会话会静默空转或报 `Connection error.`。

2026-11-11 就出过事故：Atlas 为了「让 Worker 跑起来」，自己测了一轮 provider，最后给
7 个 cmux Worker 指定了 `deepseek/deepseek-flash` / `deepseek-v4-pro`，走了用户的
**DeepSeek 官方付费 Key**（约 1,284 次请求、输入约 137 万 + 缓存读约 2.7 亿 token），
还把这套做法写进了 `macmini-use` skill。这条隧道就是为了从根上消除「macmini 上没有
免费模型可用」这个借口。

## 方案

本机向 macmini 建一条 **SSH 反向隧道**：

```
macmini 的 127.0.0.1:3425  →  本机的 127.0.0.1:3425（magpie）
```

由 launchd（`com.xhq.magpie-tunnel`）常驻守护，`KeepAlive` 断线自动重连（本机睡眠、
网络切换后恢复）。macmini 上任何 harness 只要把 base URL 配成 `http://127.0.0.1:3425/v1`、
模型名用 `magpie/<model>`，就会走本机 magpie，不消耗任何官方付费额度。

隧道的 ssh 显式带了 `-o ControlMaster=no -o ControlPath=none`：`~/.ssh/config` 对
`mac-mini` 开了 `ControlMaster auto` + `ControlPersist 10m`，如果隧道 ssh 复用了用户
平常用的 master 连接，`-R` 请求就落到那个 master 上——端口已被占用时直接失败退出，
或者注册成功但隧道随 master 在 10 分钟空闲后被回收，结果是 launchd 反复
「running → spawn scheduled」、macmini 侧 3425 时通时断（2026-11-12 实测踩到）。隧道进程
必须独占一条自己的 SSH 连接。

## 安装 / 检查 / 卸载

```bash
bash ~/.pi/agent/patch/magpie-tunnel/install.sh            # 安装并启动
bash ~/.pi/agent/patch/magpie-tunnel/install.sh --status   # 看状态
bash ~/.pi/agent/patch/magpie-tunnel/install.sh --remove   # 卸载
```

手动验证（macmini 上）：

```bash
ssh mac-mini 'curl -s -m 8 -H "Authorization: Bearer magpie" \
  http://127.0.0.1:3425/v1/models | head -c 120'
ssh mac-mini 'cd /tmp && pi -p "Reply with exactly: PING-OK" \
  --model magpie/codearts/deepseek-v4.1-flash-1017'
```

## 用不了时怎么办（2026-11-11 用户立的第二条）

**停下来向用户汇报原因，不得自行改用付费 / 订阅模型。** 汇报要带具体证据：

1. 本机 magpie 是否在跑：`lsof -nP -iTCP:3425 -sTCP:LISTEN`、`ps aux | grep -i magpie`；
2. launchd 状态：`launchctl print gui/$(id -u)/com.xhq.magpie-tunnel | grep -E "state|pid"`；
3. 本机日志：`~/Library/Logs/magpie-tunnel.err.log`；
4. macmini 侧：`lsof -nP -iTCP:3425 -sTCP:LISTEN`、实际 `curl` 的错误文本；
5. 具体失败面：隧道不通 / magpie 未启动 / 模型报错（把错误原文带回）。

## 已知边界

- 本机关机或睡眠时隧道断，macmini 上 magpie 不可用——这是**设计如此**（magpie 只在本机）；
  按上面第 2 条汇报，不要拿别的 provider 顶上。
- 隧道把本机 magpie 暴露给 macmini 的本地端口；不在本机监听 `0.0.0.0`，局域网其它机器
  访问不到。
- 如果 macmini 上的 3425 已被别的进程占用，`ExitOnForwardFailure` 会让 ssh 退出、
  launchd 反复重试——先在 macmini 上 `lsof -nP -iTCP:3425` 查清是谁占用。
- **判断「隧道是不是真活着」不能只 `curl` 一次**（2026-11-12 教训）：连接被复用或处在
  回收边缘时，单次 `curl` 可能刚好返回 200，实际几秒后就断。正确做法是同时看
  ① `launchctl print gui/$(id -u)/com.xhq.magpie-tunnel | grep -E 'pid|state'` 有**稳定 pid**
  （`pid =` 为空、只有 `state = spawn scheduled` 就是没跑起来）；② 用
  `ssh -o ControlMaster=no -o ControlPath=none mac-mini 'curl …'` 复核 macmini 侧（绕开
  master 连接，避免测到的是 master 上的复用转发）。