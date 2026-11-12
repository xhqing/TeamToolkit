# 全局通用能力的开源出口：agents-infra（2026-11-05 起单 pusher；2026-11-11 更名）

> 本文件由全局 `~/.pi/agent/AGENTS.md`「团队结构参考」指针节指向。**何时读**：维护全局 `~/.pi/agent/`
> 的通用能力（skills / AGENTS.md / docs / patch / pi 扩展）时、装 / 删 / 升级 pi 第三方包后刷新清单时、
> 需要发布 / 排查镜像分叉时。

## 一、它是什么、归谁

`agents-infra`（2026-11-11 定现名；本项目的沿革是 `CapabilityManagerAgent` → 2026-11-05 降级更名 `TeamToolkit` → 2026-11-11 更名 `agents-infra`，原因是「TeamToolkit」读起来像某个 agent 的专属工具箱、看不出它是全队共用的基础设施）是**智能体团队通用能力底座的唯一开源出口**。
它已经从「Agent 项目」降级为**普通项目**，归 **Kit**（assistant）负责；原来的 Prometheus
会话不再维护它，发布动作由脚本完成。

- 仓库：`github.com/xhqing/agents-infra`（旧地址 `TeamToolkit` / `CapabilityManagerAgent` 由 GitHub 自动重定向）
- 权威源：全局 `~/.pi/agent/`（两机之间用 Syncthing 双向同步，逐字节一致）
- 镜像位置：仓库里的 `pi/agent/`，路径与全局一一对应
- 该项目**只做镜像发布**：任何改动的源头都在全局，不要去镜像里改内容（改了也会被下一次发布覆盖）

## 二、为什么是「单 pusher」

镜像内容是**从全局确定性生成**的。如果两台机器都能生成并推送，同一份内容会造出两个提交、两个 PR，
互相 rebase，纯属浪费；更糟的是 macbook 与 macmini 的 `~/.pi/agent` 有若干「各机自维护」的配置，
两边同时生成还可能把对端的本机配置推上公网。

所以约定：**只有 macmini 持有这个仓库并推送**。

- macmini：`~/Developer/agents-infra`（唯一 git clone，唯一 pusher）
- macbook：**不保留**这个仓库（要看内容 `gh repo view` / 网页即可；本机的 `~/.pi/agent` 就是同一份内容）
- 需要在新机器上重建发布能力：macmini 上 `git clone` + 配好 `gh` 认证即可，脚本不需要改

## 三、发不发布、怎么发

**发布 = 单向镜像全局 → 仓库 → 提交 → 推送 → PR → 自动合并。**

```bash
# pi/agent：在 macmini 上（本机会话里用 ssh 或 macmini_run 调用都行）
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py            # 发布（无变化则什么都不做）
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py --check    # 只检查是否已一致
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py --dry-run  # 看会改哪些文件

# dsh/：也在 macmini 上（~/.dsh 由 Syncthing 双机双向同步）
python3 ~/.pi/agent/patch/agents-infra-publish/publish_dsh.py
python3 ~/.pi/agent/patch/agents-infra-publish/publish_dsh.py --check
```

脚本做的事（顺序固定）：

1. **等 Syncthing 收敛**：查 `/rest/db/status?folder=pi-agent`，两边都 `idle` 才继续——否则会把
   「只同步到一半的全局目录」发布出去（最坑的形态是 `AGENTS.md` 引用了还没到的 skill）。
2. **拒绝发布冲突副本**：发现 `*.sync-conflict-*` 直接报错退出（说明能力层本身要人管了）。
3. **单向 rsync** 五部分 + npm 清单到仓库的 `pi/agent/`；`dsh/` 由 `publish_dsh.py` 单独发布（排除本机产物与本机私有配置）。
4. **生成 CHANGELOG 条目**（列出本次变更文件）+ 按需 bump 版本号。
5. **提交 → 推分支 → 开 PR → `gh pr merge --auto`**（remote main 锁定，不允许直推）。
6. 合并后快进本地 main。

## 四、范围与排除（哪些进镜像、哪些不进）

**进镜像（五部分 + 生成式清单）**：

| 全局 | 镜像 | 说明 |
|---|---|---|
| `AGENTS.md` | `pi/agent/AGENTS.md` | 全局规则（含「工作规则」各节；`CLAUDE.md` 已弃用，镜像里不再有该文件） |
| `skills/` | `pi/agent/skills/` | 所有**通用** skill |
| `docs/` | `pi/agent/docs/` | 参考文档（agents-registry、capability-sync、macmini-mirror 等） |
| `patch/` | `pi/agent/patch/` | 自研补丁 / 辅助脚本 |
| `extensions/` | `pi/agent/extensions/` | 工具强制类扩展 |
| `npm/`（清单） | `pi/agent/npm/` | `package.json` / `package-lock.json` + `PACKAGES.md`（`patch/npm-manifest/refresh.py` 生成） |

**`dsh/` 是独立子树**：源是 `~/.dsh/`（双机双向同步），由 Syncthing `dsh` 文件夹（双向）同步到 macmini，再由 macmini 的 `patch/agents-infra-publish/publish_dsh.py` 发布到 `agents-infra/dsh/`。`pi/agent/` 与 `dsh/` 都在 macmini 发布，路径不相交。

**不进镜像**：

- `~/.dsh/` 的凭证、会话、附件、storages、node_modules、settings import；`dsh/` 只镜像 secret-free 核心（由 `publish_dsh.py` 发布）
- 运行时与架构相关：`sessions/`、`state/`、`logs/`、`tmp/`、`intercom/`、`npm/`（包本体）、`bin/`
- 本机私有配置：`trust.json`、`mcp-project-approvals.json`、`skills/anysearch/runtime.conf`、
  `skills/anysearch/.env`、`skills/backup/endpoints/*`、`patch/session-link/*.json`
- 项目专用扩展（含具体项目硬编码路径、clone 者用不上的）
- 本机产物：`*.log`、`*.lock`、`__pycache__/`、`*.pyc`、`*.sync-conflict-*`

## 四之二、npm 清单怎么更新（不走发布机）

`~/.pi/agent/npm/` 是**架构相关**目录（arm64 / x64 各装各的），不参与两机同步，所以：

- **不要**在 macmini 上生成这份清单——它装的包版本可能与本机不同（2026-11-05 实测：
  macmini 上是 `pi-mcp-adapter` 7.0.0、本机是 7.0.1），在那边跑 `refresh.py` 会把版本号写回去。
- 正确做法：在**装了 pi 包的那台机器**（本机）上生成到临时目录，再把结果随发布提交：

```bash
# 本机：生成清单到临时目录
python3 ~/.pi/agent/patch/npm-manifest/refresh.py --dst /tmp/agents-infra-npm
# 拷到发布机的仓库里（发布机仍是唯一 pusher）
scp /tmp/agents-infra-npm/* mac-mini:~/Developer/agents-infra/pi/agent/npm/
# macmini：正常发布
ssh mac-mini 'python3 ~/.pi/agent/patch/agents-infra-publish/publish.py'
```

`publish.py` 默认**不碰** `pi/agent/npm/`，只打印一行提示。

## 五、核对与排查

```bash
# 全局 vs 镜像 逐字节比对（排除本机私有文件与本机产物）
diff -r ~/.pi/agent/skills      ~/Developer/agents-infra/pi/agent/skills
diff    ~/.pi/agent/AGENTS.md   ~/Developer/agents-infra/pi/agent/AGENTS.md
# 确认镜像内容真的被 git 跟踪（2026-10-04 事故：.gitignore 里一条裸 docs/ 把镜像静默吞掉）
git -C ~/Developer/agents-infra ls-files pi/agent/docs | wc -l
```

常见问题：

| 现象 | 原因 / 处理 |
|---|---|
| 发布脚本报「Syncthing 未收敛」 | 另一台机器正在写，等几秒重跑；一直不收敛就去 `status.py` 看是不是断链 |
| 报「发现 sync-conflict 副本」 | 能力层出现冲突副本，人工对比合并后删掉副本，再发布 |
| 发布成功但内容不对 | 先看 `--check`；再看是不是改了镜像而不是全局（改镜像会被下次发布覆盖） |
| macmini 不在线 | 先在本机正常改全局；等它上线跑一次发布即可（脚本幂等，不丢改动） |

## 六、历史（改名前的口径）

2026-11-05 之前，这层由 Agent 项目 `CapabilityManagerAgent`（角色名 Prometheus）维护，发布方式是
「改完全局能力层 → `agent_call` Prometheus 让它同步镜像并提交」，两台机器都可能成为 pusher。
改成单 pusher 是为了消除重复 PR 与双机器生成带来的分叉风险。历史规则见该仓库 git 历史。
