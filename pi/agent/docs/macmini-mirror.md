# 本机 ↔ macmini 协作与同步（2026-11-05 架构改造版）

> **2026-11-05 起了根本变化**：项目代码不再走 Syncthing，改走 GitHub；Syncthing 只负责两个
> 目录——`~/.dev/private`（各项目私有内容本体）与 `~/.pi/agent`（全局能力层）。
> 旧版本文档（「全量镜像 `~/Developer` + `~/.pi/agent`」）描述的拓扑已作废，历史见 git 历史。
>
> 本文是这套协作的权威说明：拓扑、同步范围、macmini 的 GitHub 访问、日常操作、边界与风险。

## 一、为什么改（旧拓扑的问题）

旧拓扑把 `~/Developer`（全部项目，含 `.git`）双向同步。代价是：

1. **冲突副本**：两边同时改同一文件就产生 `.sync-conflict-*`，只能人工合并——用一套比 git 弱的机制替代 git。
2. **被迫加硬规矩**：「同一个 git 仓库同一时间只在一台机器上做写操作」，以及 macmini 的「严格 git 只读」
   （pi 扩展 + 全局 git hook）。这不是设计出来的，是同步 `.git` 逼出来的补丁。
3. **worktree 在另一台机器上是死的**：目录同步过去了，但 `.git` 指针写的是对端绝对路径
   （`gitdir: /Users/xhq/...`），`git status` 直接 fatal，`git worktree list` 显示 `prunable`。
4. **远端递归删除会删到本机**：`macmini_run` 上最危险的一个 footgun。
5. **逐字节校验**要扫 7.7 GB，而项目代码本来就能用 git 校验。

改成「代码走 GitHub」后，上面五条全部消失：单一权威源、线性历史、PR 门禁、SSH 加密传输，
不需要任何自建规则来维持一致性。

## 二、现在的拓扑

```
                    ┌──────────── GitHub（代码唯一中转）────────────┐
                    │  clone / fetch / push / PR / CI / merge      │
                    └───────▲──────────────────────────▲───────────┘
                            │                          │
                  MacBook Air（arm64）        Mac mini（x64 / 32GB）
                  ~/Developer（各自 clone）    ~/Developer（各自 clone）
                            │                          │
                     Syncthing 双向（只有两个目录）
                            │                          │
        ~/.dev/private  ◄────┤                          ├────►  ~/.dev/private
        ~/.pi/agent     ◄────┘                          └────►  ~/.pi/agent
```

- 两台机器各自 clone、各自建 worktree、各自跑 add → commit → push → PR → CI → merge，
  然后本地 main 快进同步。`~/Developer` 之间**没有任何同步**。
- macmini 恢复 GitHub 访问（用**独立凭证**，不与本机共用，见第四节）。
- 全局能力层 `~/.pi/agent` 两边仍逐字节一致（双向），所以任何一台机器都能改规则 / 技能；
  **开源镜像只在 macmini 上生成并推送**（单 pusher，见 `docs/capability-sync.md`）。

## 三、同步范围（三个目录）

| folder id | 本机 | macmini | 模式 | 内容 | 排除项 |
|---|---|---|---|---|---|
| `private` | `~/.dev/private` | `~/.dev/private` | 双向 | 各项目私有内容**本体**（`private-links` 的软链接指过来） | `.DS_Store`、`._*` |
| `pi-agent` | `~/.pi/agent` | `~/.pi/agent` | 双向 | 全局能力层（`AGENTS.md` / `skills/` / `docs/` / `patch/` / `extensions/` / `prompts/` / `themes/` / 配置） | `sessions/`、`state/`、`logs/`、`tmp/`、`intercom/`、`npm/`、`bin/`、运行时缓存、`trust.json`、`skills/anysearch/runtime.conf`、`patch/session-link/*.json`、`__pycache__`、`*.log`、`*.lock` |
| `dsh` | `~/.dsh` | `~/.dsh` | sendonly → receiveonly | DSH 权威源（MacBook）的 secret-free 核心：`AGENTS.md`、`README.md`、`bootstrap.sh`、`profiles/dsh-tui/`（配置 + 插件） | `.env`、`.credentials.yaml`、`sessions/`、`storages/`、`attachments/`、`settings.yaml.imported`、`node_modules/`、`.plugin-manager/`、`web/headless/desktop` profile |

**明确不同步**：`~/Developer` 下所有项目仓库（含 `.git`、worktree、`node_modules`、构建产物）、
`~/.dev/snapshots/`（本地快照，各机各留 5 份）、机器本地配置（`settings.local.json`、
`DATA-LOCATION.local.md` 等）。

**已完成（2026-11-05 收尾）**：`developer` 共享已移除（`setup.py --drop-developer`，只动配置、磁盘文件保留）；macmini 上 38 个仓库**原地转正**为正经 clone（`fetch --prune` + `reset --hard origin/<分支>`，依赖目录全部保留、没重下 7.7 GB）；10 个坏掉的 worktree 残留目录已删除；git 只读层（扩展 + `core.hooksPath` hook）已撤除。
`setup.py` 现在默认**不**再重建 `developer`，确需恢复代码同步时显式加 `--with-developer`。

## 四、macmini 的 GitHub 访问与 git 权限

- **凭证（最终采用 HTTPS + gh token）**：`gh auth setup-git` 给 HTTPS 配好 credential helper，34 个 SSH remote 已改写为 `https://github.com/xhqing/<repo>.git`。**没有给 macmini 放 SSH 私钥**（本机私钥不该拷过去），因此也**不需要** GitHub 上的 SSH key。
- **git 权限（2026-11-05 起）**：从「严格 git 只读」改为「正常读写」——旧约束前提（`.git` 被双向同步）
  已消失。撤除时机：`~/Developer` 共享正式移除之后（在那之前保持只读，否则两台机器会重新同时写同一份 `.git`）。
  撤除动作：删 `extensions/git-readonly-guard.ts`、撤 macmini 的 `core.hooksPath` 只读 hook。
- **仍然生效**：remote main 锁定（`git-main-guard.ts`，两机一致）、一个分支只做一件事、改动走 PR + CI。
- **macmini 上仍连不上 GitHub 的历史配置**（需在恢复时清理）：`~/.ssh/config` 的
  `BEGIN/END macmini-github-cut` 段、`git config --global` 里的 `url.https://github.invalid/.insteadOf`、
  以及移到 `~/.ssh/disabled-github-20261028/` 的旧密钥（不再使用，建议删掉，换新 key）。

## 五、两个共享目录的改删与「改前快照」

`~/.pi/agent` 与 `~/.dev/private` 允许任何会话（含 macmini）改删**里面的内容**，但必须满足前置条件：

- 改前先跑 `python3 ~/.pi/agent/patch/dev-snapshots/dev-snapshots.py snapshot <pi-agent|private>`
  （打包 + 上传飞书云盘 `dev-snapshots/<target>/` + 本地各留最近 5 份）；
- `extensions/snapshot-guard.ts` 会拦下没有新鲜快照的写入 / 删除（删除类要求指纹完全一致）；
- **两个目录的根本身永远不许删**；
- 说明见 `patch/dev-snapshots/README.md`，私有内容登记与接线见 `patch/private-links/README.md`。

## 六、日常操作

```bash
# 状态（链路、是否同步完、错误、冲突数）
python3 ~/.pi/agent/patch/macmini-mirror/status.py

# 逐字节校验（只覆盖 private / pi-agent 两个目录，快；初始化或大改后跑一次）
python3 ~/.pi/agent/patch/macmini-mirror/verify.py

# 重建 / 补齐 Syncthing 配置（幂等）
python3 ~/.pi/agent/patch/macmini-mirror/setup.py

# 移除 developer 共享（macmini 重新 clone 完成后再跑）
python3 ~/.pi/agent/patch/macmini-mirror/setup.py --drop-developer

# macmini 的 Syncthing 面板（本机转发端口，不抢焦点）
ssh -L 8385:127.0.0.1:8384 mac-mini    # 浏览器打开 http://127.0.0.1:8385
```

- **冲突处理**：`status.py` 报冲突后，`find ~/.pi/agent ~/.dev/private -name '*.sync-conflict-*'` 找副本，
  人工比较保留正确版本。
- **误删恢复**：`~/.syncthing-versions/<folder>/`（保留 30 天）可取回；共享目录另有飞书快照兜底。
- **macmini 上没有 node_modules**：clone 完进项目目录 `npm ci` 一次即可（依赖不参与同步）。
- **重活分流**：哪些活该放 macmini、怎么跑，见 skill `macmini-use`；执行通道是 `macmini_run` /
  `macmini_status` 工具，不要手写 ssh 引号。

## 七、首次迁移记录

### 2026-10-28（旧拓扑建立）
- macmini 原有内容归档在 `~/Archive-Migrated/mirror-seed-20261028-202611/`（约 910MB），未删除。
- 旧的单向同步（`patch/sync-to-macmini/watcher.js`、launchd `com.xhq.pi-sync-macmini`）已停用。

### 2026-11-05（本次改造）
- 新建 `~/.dev/private`，把 13 个仓库共 99 项被忽略的私密内容（约 168 MB）从项目里搬成本体，
  项目侧改为软链接；清单在 `patch/private-links/manifest.tsv`，巡检 `check` 0 问题。
- 新增 Syncthing 共享 `private`（两机已配置并开始同步）。
- 新增 `auth` 相关机制：`patch/dev-snapshots/`（快照）、`extensions/snapshot-guard.ts`（改前快照守卫）、
  `macmini-use` 的删除守卫放行两个共享目录（仍拦删根）。
- 首次快照：`pi-agent` 0.5 MB、`private` 95.3 MB，均已上传飞书 `dev-snapshots/`。

## 八、已知边界与风险

1. **双机同时改同一个私有文件** → 仍会产生 `.sync-conflict-*`（与旧拓扑一样，范围缩小到两个目录内）。
2. **绝对路径差异**：`~/.dev/private` 的软链接用本机 `$HOME` 绝对路径，各自 `materialize`，不跨机传递。
3. **`/Users/xhq` 与 `/Users/mac`**：被排除的配置（trust / approvals / anysearch runtime / session-link）
   两机各自维护；同步过去的内容里如果写了 `/Users/xhq/...`，在 macmini 上不成立。
4. **架构差异**：macmini 是 Intel x64，本机 arm64；依赖、原生二进制、构建缓存各装各的。
5. **macmini 的 GitHub 访问已于 2026-11-05 恢复**（独立凭证、HTTPS + gh token；github.com 在那边被限速，大仓库拉取较慢）：可以正常 `fetch` / `pull` / 提交 / 推送，同样受 remote main 锁定（改动走分支 + PR + CI）。

## 九、文件清单

| 文件 | 作用 |
|---|---|
| `patch/macmini-mirror/setup.py` | 幂等配置两机 Syncthing（设备、folder、版本库；`--drop-developer` 移除代码共享） |
| `patch/macmini-mirror/status.py` | 状态检查；`--check` 供 launchd 做异常通知 |
| `patch/macmini-mirror/verify.py` | 逐字节 SHA-256 校验（覆盖两个共享目录） |
| `patch/macmini-mirror/stignore-private` / `stignore-pi-agent` | 两个共享目录的 `.stignore` 模板 |
| `patch/macmini-mirror/stignore-developer` | 旧 `~/Developer` 共享的模板（过渡期仍用，移除共享后可删） |
| `patch/private-links/` | 私有内容本体 ↔ 项目软链接（manifest + 工具 + README） |
| `patch/dev-snapshots/` | 改前快照（飞书 + 本地各 5 份 + 令牌） |
| `extensions/snapshot-guard.ts` | 改前快照的强制点（没有新鲜快照就拦写入 / 删除） |
| `~/Library/LaunchAgents/com.xhq.mirror-check.plist` | 本机每 10 分钟健康检查 |
| macmini `~/Library/LaunchAgents/com.local.syncthing.plist` | macmini Syncthing 守护 |

## 网络前提：macmini 的 git 必须走本地代理（2026-11-09 排查确认）

**现象**：macmini 到 GitHub 间歇性失败，`git push` 报 `Empty reply from server`、`brew update` 卡死过 70 多分钟。

**实测**（2026-11-09）：

- 直连 `https://github.com`：5/5 失败（HTTP 000）
- 经本地 xpilot 代理 `http://127.0.0.1:1087`：5/5 成功（HTTP 200）
- 结论：**macmini 的 git 没配代理，直连 GitHub 被干扰**——不是 Syncthing、不是磁盘、不是 DNS。

**修复**（已执行，写在 macmini 的 `~/.gitconfig`）：

```bash
git config --global http.proxy  http://127.0.0.1:1087
git config --global https.proxy http://127.0.0.1:1087
```

**配套注意**：

- `gh` 命令不受影响（实测不带代理也能用）。
- `brew` 不读 git 配置，直连 GitHub 一样会卡——需要时手动带上代理：
  `HTTPS_PROXY=http://127.0.0.1:1087 HTTP_PROXY=http://127.0.0.1:1087 brew upgrade <pkg>`。
  2026-11-09 升级 gitleaks 时就撞上过：brew 说已是最新（元数据拉不下来），最后改为手动下载二进制装到 `~/.local/bin/`。
- 代理由 macmini 上的 xpilot 提供（HTTP 1087 / SOCKS 1080），节点异常先看 `xpilot status`（只读，不要重启）。
- **新 clone 的机器也要配这两条**，否则 publish / PR 会随机失败。
