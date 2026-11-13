---
name: macmini-use
description: 把重活分流到 macmini 常驻算力机（12 核 x64 / 32GB，与本机共享 ~/.pi/agent 与 ~/.dev/private；项目代码走 GitHub、各自 clone），给用户正在用的 8 核 / 8GB MacBook 减负。MUST USE 当任务里包含预计占用本机 CPU / 内存十几秒以上的编译、构建、测试套件、音视频转码、批量渲染、数据回测、大文件扫描或大下载时；当用户说「放 macmini 跑」「别卡本机」「用 macmini 的资源」「本机太卡」时；当需要在 x64 / 大内存 / 长时间常驻的环境里跑东西时。当你不确定某个任务该不该分流、或需要远端工具链 / 路径映射 / 结果回传的具体跑法时，也读本 skill。NOT for：几秒内结束的短命令、需要本机 GUI / cmux / osascript / 焦点 / 剪贴板 / Keychain、需要 arm64 产物或本机 node_modules、需要操作本机专属路径（~/Downloads、~/Library、~/.ssh）。
---

# macmini-use：把重活分流到 macmini

本机是用户**此刻正在用**的 MacBook Air（8 核 / 8GB），macmini 是 12 核 x64 / 32GB 的常驻算力机。
两机只共享 `~/.pi/agent` 与 `~/.dev/private`（Syncthing，约 3 秒同步）；`~/Developer` **不再同步**（2026-11-05 起项目代码走 GitHub，两边各自 clone）。见
`~/.pi/agent/docs/macmini-mirror.md`）。这个 skill 解决一件事：**把会拖慢用户的活，挪到
macmini 上跑，再把结果带回来。**

判断准则是「**用户的本机要流畅**」，不是「尽量多用远端」。几秒能跑完的命令在本机跑更快
（SSH 往返、远端装依赖都要时间）；真正值得挪的是**会让风扇转起来、让用户打字卡顿的那种活**。

## 一、先判断：这活该不该分流

| 任务形态 | 去向 | 说明 |
|---|---|---|
| 编译 / 构建（swift build、cargo、go、cmake --build、ninja、make -j、gradle / maven） | macmini | 见下方「工具链实况」，没装的一次性装好 |
| 测试套件（pytest 大套、cargo test、go test） | 看成本 | 远端没依赖时先 `npm ci` / 建 venv；安装比重跑还贵就留本机 |
| 音视频转码、批量截图 / 缩放、OCR、语音转写 | macmini | ffmpeg / tesseract 远端还没装，第一次先装 |
| 数据回测、批量抓取、大文件哈希 / 扫描、ML 训练 | macmini | 32GB 内存是主要收益 |
| 大下载（模型、数据集、大安装包） | macmini | 只要结果文件别忘回传 |
| 批量 PDF / HTML 渲染（Chrome headless） | macmini（批量时） | 单份几秒的留本机 |
| 单条命令、读文件、grep、git status、跑一个测试文件 | **本机** | 十几秒内结束的分流是净亏 |
| 需要 GUI / cmux / osascript / 焦点 / 剪贴板 / Keychain | **本机** | 远端没有用户眼前的那个界面 |
| 需要 arm64 产物、本机原生模块、本机 node_modules | **本机** | 远端是 x64，编出来在本机跑不了 |
| 提交 / 推送 / PR / Release / CI | 两台都行 | macmini 已恢复正常 git 读写（HTTPS + gh token，remote 已改 https）；同样受 remote main 锁定，改动走分支 + PR + CI |
| 操作 `~/Downloads`、`/Volumes`、`~/Library`、`~/Key`、`~/.ssh` 等本机专属路径 | **本机** | macmini 上没有这些数据 |

**判断要落到行动**：决定分流就一句话说明（「这个放 macmini 跑」），然后直接执行，不要问用户。
反过来，决定留本机也不必解释一大堆，一句「这个几秒就完了，本机跑」即可。

## 二、怎么跑：优先用 `macmini_run` 工具

扩展 `~/.pi/agent/extensions/macmini-use/` 提供了两个工具，比手写 ssh 可靠（自动 PATH、
自动路径映射、超时与后台管理）：

```
macmini_run(command, cwd?, timeout_ms?, background?, label?)
macmini_status()          # 看两机实时负载，判断该不该分流时用
```

- `cwd` 传**本机路径**即可：`/Users/xhq/Developer/x` → 自动映射成 `/Users/mac/Developer/x`。
  不在 `~/Developer` / `~/.pi/agent` 下的路径会照原样用（远端没有同一份数据，工具会提示）。
- 长任务用 `background: true`：立即返回 `/tmp/macmini-jobs/job-xxx.log`，之后用
  `macmini_run` 执行 `tail -n 60 <日志>` 取进度 / 结果。
- 用户手动触发：`/macmini status`、`/macmini <命令>`、`/macmini bg <命令>`。

**输入框下方会亮一行状态提示（2026-11-04 用户立）**：只要真的在用 macmini——调 `macmini_run`
/ `macmini_status`、敲 `/macmini …`、或直接 `ssh mac-mini …`——pi 输入框正下方就显示
`🖥  当前使用的是 macmini（算力机）`；后台任务（`background: true`）会一直亮到远端进程跑完，
其余情况工具调用结束即撤。所以这一行的含义是确定的：**亮着 = macmini 此刻确实被占用，
撤掉 = 没在用了**。它是事实反映、不是装饰：不要为了让它亮着而动 macmini，也不要在回复里
再解释一遍这个提示。已知覆盖边界：`background_run` 里直接嵌 `ssh mac-mini …` 的写法只跟到
工具调用返回为止（那条通道派出去的后台进程不在跟踪范围内），有长任务请走 `macmini_run` 的
`background: true`。

**不要为了省事在 macmini 上再开一个 pi 会话跑一条命令**——模型费用翻倍、任务还要多绕一层。
只有「需要在远端多轮交互、反复看日志改代码」时才开一个**临时 tmux 会话**（2026-11-12 起不再有常驻会话）：

```bash
# 开（模型必须走 allowlist.json 里的清单）
ssh mac-mini 'tmux new-session -d -s pi-<名字> -c <cwd> "pi -n <名字> --model magpie/auto/hy4free"'
# 派活
ssh mac-mini '~/.pi/agent/npm/node_modules/.bin/pi-intercom ask --to <名字> --text "任务与背景"'
# 干完立即清掉
ssh mac-mini 'tmux kill-session -t pi-<名字>'
```

**gh / git 在 macmini 上已恢复正常（2026-11-05 用户立）**：git 只读层已撤除（`git-readonly-guard.ts` 已删、`core.hooksPath` 只读 hook 已清），macmini 可以正常 `fetch` / `pull` / 提交 / 推送，`gh` 的全部子命令也都可用。**唯一保留的约束是团队通用的那几条**：remote main 锁定（改动走分支 + PR + CI，由 `git-main-guard.ts` 两机一致拦住）、同一仓库同一时间只在一台机器上做写操作（避免本地 main 各自分叉）、公开动作（PR / Issue / Release）须先做公开文本敏感自检并在命令末尾带 `# AI_SENSITIVE_CHECKED`。
**凭证**：macmini 上的 `gh` 已认证（2026-11-04：本机 OAuth token 副本写在 macmini 本机的 `~/.config/gh/hosts.yml`，该目录不在镜像范围）；token 轮换后需要重新写入。

## 三、硬约束（不知道就会出事）

1. **远端删除只影响两个共享目录**。2026-11-05 起只有 `~/.pi/agent` 与 `~/.dev/private` 在同步：
   在这两个目录里 `rm -rf`，本机同一份也会消失（改前必须做飞书快照，见第 2 条）。
   `~/Developer` 是各自独立的 clone，删了可以用 GitHub 重建。其余路径的递归删除仍默认拒绝，
   确需删时带 `# AI_REMOTE_RM_OK` 并说清删什么、为什么；临时文件一律放 `/tmp`。
2. **两个共享目录改前必须快照 + 目录根本身禁止删除**。改它们的内容前先跑
   `python3 ~/.pi/agent/patch/dev-snapshots/dev-snapshots.py snapshot <pi-agent|private>`
   （`snapshot-guard` 会拦下没有快照的写入 / 删除），`rm -rf ~/.pi/agent` / `~/.dev/private` 一律拒绝。
3. **x64 ≠ arm64**。远端编出来的原生二进制、`.node` 模块、Electron / Swift 产物在本机
   跑不了。要交付给本机或用户用的产物，必须本机编或走 CI（GitHub Actions）。
4. **依赖目录不同步**：`node_modules`、`.venv`、`.lake`、`__pycache__` 都在 `.stignore` 里。
   远端第一次跑某个仓库要先装依赖；装完也**不会**回到本机（这是对的，架构不同）。
5. **构建缓存落 /tmp**：`~/Developer` 已不再同步，但为了让远端磁盘干净、也避免把大件产物误提交，缓存仍统一指到 `/tmp`：
   `CARGO_TARGET_DIR=/tmp/<项目>-target`、`swift build --scratch-path /tmp/<项目>-build`、
   `GOCACHE` 默认就在 `~/Library/Caches`（不同步，可不动）。
6. **GitHub 已恢复（2026-11-05）**：走 HTTPS + gh token；github.com 在 macmini 上被限速，clone / fetch 会慢（已用 HTTP/1.1 + 关低速阈值缓解），大仓库优先本机拉。macmini 上 `~/Developer` 是独立 clone，**不再与本机同步**。

## 四、macmini 工具链实况（2026-11-03 实测）

| 有 | 版本 / 说明 |
|---|---|
| 硬件 | 12 核 Intel x86_64，32GB 内存，466GB 盘（约 86GB 可用） |
| Node | v22.22.3 / npm 10.9.8（`macmini_run` 已钉住 PATH；手写 ssh 时别用 `bash -lc`，那会拿到旧的 Node 16） |
| Python | 系统 3.9.6（Command Line Tools）；登录 shell 里还有个 anaconda 3.10.6，不要依赖它 |
| 编译 | clang 14、cmake 3.24、Swift 5.7.2（只有 CLT、**没有完整 Xcode → `xcodebuild` 不可用**） |
| 其他 | git 2.37.1、pandoc 2.19、tmux、xxd、rsync 2.6.9、zip、Chrome（headless 打印 PDF 可用）、brew 3.5.9（x64，装到 /usr/local） |
| 缺 | ffmpeg / ffprobe / ImageMagick / ghostscript / yt-dlp / jq / rg / fd / rustc / cargo / go / uv |
| pi 会话的模型 | macmini 上**只用可用模型清单里的 magpie 模型**（2026-11-12 用户立）：清单 = `~/.pi/agent/patch/macmini-models/allowlist.json`，**当前三项**：`magpie/auto/hy4free`、`magpie/codearts/deepseek-v4.1-flash-1017`（均免费，2026-11-12 用户指定）与 `magpie/auto/hy4std`（标准计费通道，2026-11-13 用户明确授权加入，会消耗 WorkBuddy Free plan 的 credits 额度）。清单由用户动态维护。本机 launchd 常驻 SSH 反向隧道（`patch/magpie-tunnel/`，`com.xhq.magpie-tunnel`）把 macmini 的 `127.0.0.1:3425` 映射回本机 magpie。**清单外模型一律不准用**；**用不了就停下来向用户汇报原因**，不得自行换清单外模型。校验：`python3 ~/.pi/agent/patch/macmini-models/check.py --ping` |

**Docker 不可用**：CLI 在，但 daemon 启动即 panic（2026-11-03 实测）。要跑容器就回本机或换别的方案。

需要但缺的工具，一次性装上即可（x64 版、装一次长期有效）；如果只是为了跑一个小任务，
装工具比任务本身还贵，就留本机跑（命令末尾加 `# AI_LOCAL_OK: <理由>`）：

```bash
macmini_run: command -v ffmpeg || brew install ffmpeg   # 首次装依赖多，x64 上要等一会
macmini_run: brew install go            # 或 rustup（Rust）
```

## 五、常见重活的跑法

**Node / TypeScript 项目**（仓库已在远端镜像里）：

```bash
macmini_run: npm ci --no-audit --no-fund
macmini_run: npm run build
macmini_run: npm test
```

注意：远端 `node_modules` 是独立的。第一次 1~3 分钟的安装成本要算进判断——只跑一个 5 秒的
测试文件时，本机更快；要跑整套测试 / 全量构建时才值得。

**Python / 回测 / 数据处理**（venv 放 `/tmp`，别放仓库）：

```bash
macmini_run: python3 -m venv /tmp/<项目>-venv
macmini_run: /tmp/<项目>-venv/bin/pip install -r requirements.txt
macmini_run: /tmp/<项目>-venv/bin/python -m pytest tests -q
```

**Rust / Go / C++**（先确认工具链，缓存指到 /tmp）：

```bash
macmini_run: CARGO_TARGET_DIR=/tmp/<项目>-target cargo build --release
macmini_run: go build ./... && go test ./...
macmini_run: cmake -S . -B /tmp/<项目>-build && cmake --build /tmp/<项目>-build -j12
```

**Swift**：`swift build -c release --scratch-path /tmp/<项目>-build` 可用，但远端 Swift 是
5.7.2（2022 年的版本）。工程需要更新的 Swift 特性时会编译失败——那种情况留本机跑（加标记）。

**音视频 / OCR**（第一次先装）：

```bash
macmini_run: command -v ffmpeg >/dev/null || brew install ffmpeg
macmini_run: ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac /tmp/out.mp4
macmini_run: tesseract shot.png /tmp/out
```

**批量 PDF / 截图**（Chrome headless，注意路径要写远端路径）：

```bash
macmini_run: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=/tmp/out.pdf file:///Users/mac/Developer/<项目>/tmp/page.html
```

**长任务 / 批量循环**：用 `background: true`，不要占着一个同步调用：

```
macmini_run(command: "for i in $(seq 1 200); do ./run_case.sh $i; done > /tmp/run-all.log 2>&1", background: true)
# 稍后
macmini_run: tail -n 40 /tmp/macmini-jobs/job-xxxx.log
macmini_run: pgrep -f /tmp/macmini-jobs/job-xxxx.sh >/dev/null && echo running || echo done
```

## 六、结果怎么拿回来

- **写进 `~/Developer` 或 `~/.pi/agent` 的产物**：等 3 秒左右 Syncthing 自动同步回本机，
  本机直接读就行；不放心就跑 `python3 ~/.pi/agent/patch/macmini-mirror/status.py` 看是否同步完。
- **写在 `/tmp` 的产物**：`scp mac-mini:/tmp/x ./` 或
  `rsync -av mac-mini:/tmp/out/ ~/Developer/<项目>/tmp/out/` 直接拉回来。
  超过几百 MB 的东西优先 rsync，不要塞进镜像目录（会双份占盘 + 徒增同步流量）。
- 只验性质的产物（测试报告、截图给用户看一眼）可以留在远端，把关键结论贴回来即可。

## 七、收尾卫生

远端是你借用的算力，用完别留垃圾：

```bash
macmini_run: ps -Ao pid,etime,command | grep -E '<你的任务特征>' | grep -v grep
macmini_run: kill <pid>                                    # 停掉跑飞的进程
macmini_run: rm -rf /tmp/macmini-jobs/<job>.sh /tmp/macmini-jobs/<job>.log
```

`/tmp` 的清理不受删除守卫限制；两个共享目录里的删除要带 `# AI_REMOTE_RM_OK`，且改前必须快照。
不要留长期挂着的 `tmux` 会话——用户看不到它们。

## 八、故障排查

| 现象 | 原因 / 处理 |
|---|---|
| `ssh: connect ... timed out` / 退出码 255 | 网络或 Tailscale 没通：`ssh mac-mini 'echo ok'` 先测；不通就说明情况，重活可先在本机做 |
| 退出码 97 + 「远端目录不存在」 | 目录刚在本机建、还没同步过去；等几秒重试，或在远端 `mkdir -p` |
| 同一个命令远端 Node 版本不对 | 手写 ssh 用了 `bash -lc`（拿到 Node 16）；改用 `macmini_run` 或 `ssh mac-mini '命令'` |
| `xcrun: error ... requires Xcode` | macmini 只有 Command Line Tools；`xcodebuild` 类任务回本机 / 走 CI |
| 编译通过但本机跑不起来 | 产物是 x64；本机 arm64 需要重新编，或改用 CI 出 arm64 产物 |
| pi 会话反复报 `Connection error.` 不动 | macmini 上的 magpie 是经本机反向隧道过去的（`patch/magpie-tunnel/`）。按顺序查：① 本机 magpie 是否在跑（`lsof -nP -iTCP:3425 -sTCP:LISTEN`）；② launchd 是否活着（`launchctl print gui/$(id -u)/com.xhq.magpie-tunnel`、日志 `~/Library/Logs/magpie-tunnel.err.log`）；③ macmini 侧 `lsof -nP -iTCP:3425` 与 `curl` 错误原文。**仍不通就向用户汇报原因，不得自行改用清单外模型顶替。** 连通可以用 `python3 ~/.pi/agent/patch/macmini-models/check.py --ping` 验证 |
| `git ...` 在远端失败 | 已经不再是「只读」问题：多半是 github.com 被限速（已配 `http.version=HTTP/1.1` + 关低速阈值）或凭据过期（`gh auth status` 查） |
| 删除命令被拒 | 远端递归删除会删到本机；临时文件放 /tmp，确需删除加 `AI_REMOTE_RM_OK` |

## 九、不要这样做

- ❌ 把一条 `grep` / `cat` / `git status` 也发到 macmini——SSH 往返比命令本身还慢。
- ❌ 同一个仓库在两台机器上同时提交（各自 clone 会分叉）——同一仓库同一时间只在一处做 git 写；macmini 上的正常读写（fetch / pull / 分支 + PR）已经放开。
- ❌ 在 `~/.pi/agent` / `~/.dev/private` 里随手 `rm -rf`——本机同一份也消失，这两个目录没有「重建」这条路。
- ❌ 把 `node_modules` / `.venv` / 编译缓存 rsync 回本机——架构不通用、还占盘。
- ❌ 在 macmini 上再开一个 pi 会话只为了跑一条命令——费用翻倍，不值得。
- ❌ 在 macmini 上起 pi 会话却不先验证模型连通——先跑 `python3 ~/.pi/agent/patch/macmini-models/check.py --ping`；不通就查隧道并向用户汇报，不要换个模型硬顶。
- ❌ 在 macmini 上使用清单外的模型（包括 magpie 的其它模型，以及 deepseek 官方 / coding-plan / dashscope / zai-coding-cn / tokenplus 等）——2026-11-12 用户立：只认 `allowlist.json` 清单；守卫 `extensions/macmini-model-guard.ts` 会拦，确需清单外模型必须先经用户当次同意。
- ❌ 在 macmini 上留常驻会话——2026-11-12 用户决定停用常驻（duty 守护已卸载）；临时会话用完必须 `tmux kill-session -t pi-<名字>`。
- ❌ 分流完就忘了收尾——远端留一堆跑飞的进程和几 GB 的 /tmp 日志。
