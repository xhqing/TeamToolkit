# 两团队架构：一个 Agent，两顶帽子（pi-team / dsh-team）

> 2026-11-11 用户立。**pi-team** 负责开源项目；**dsh-team** 负责闭源项目。两团队的全局规则不共用，但同一个 Agent 项目是“一个人”，只有一套版本 / CHANGELOG。本文是目录布局、运行时帽子与 Leader / Worker 工作流的权威说明。

## 一句话

**一个人、一个版本、两顶帽子；Agent 项目是“人的家”，私有子项目是“工地”，Worker 是工地上的工人。**

## 1. Agent 项目（开源，pi-team 管）

一个 Agent 项目就是一个人，只有一套 `VERSION` / `CHANGELOG.md`。DSH 支持、`.dsh` 规则、插件、共享技能都是这个开源产品的一部分，走 pi-team 的正常发版链。

```text
agent-project/                    # 开源，pi-team 管
├── AGENTS.md                     # 人：身份、通用经验、运行时分支
├── .pi/
│   ├── APPEND_SYSTEM.md          # pi 帽子（pi 原生自动加载）
│   ├── skills/                   # pi 专属技能
│   └── extensions/               # pi 专属工具 / 守卫
├── .dsh/
│   ├── APPEND_SYSTEM.md          # dsh 帽子（由 dsh 插件注入）
│   ├── skills/                   # dsh 专属技能
│   └── plugins/                  # DSH 桥接插件源码（可选）
└── .agents/
    └── skills/                   # 人的通用技能（pi、DSH 都读）
```

- 根 `AGENTS.md` 只写**共享**内容：身份、职责、通用经验、运行时分支。**不写** `/commit`、`agent_call`、`private-links`、某个团队的发布流程。
- `.pi/APPEND_SYSTEM.md` 与 `.dsh/APPEND_SYSTEM.md` 各自写团队专属规则，开头带运行时横幅：
  - pi：`Runtime: pi-team; ignore .dsh/.`
  - dsh：`Runtime: dsh-team; ignore .pi/.`
- `.agents/skills/` 只放**工具无关**的共享技能（纯 bash / git / python / 标准 CLI）；依赖 pi 或 DSH 专属工具的技能放各自目录。

## 2. 私有子项目（闭源，dsh-team）

私有子项目是**工地**，是独立仓库，有自己的 `AGENTS.md`、`.dsh/`、`VERSION`、`CHANGELOG.md`。**没有 `.pi/`**。

```text
private-subproject/               # 私有，dsh-team
├── AGENTS.md                     # 工地：项目是什么、Worker 角色 / 汇报线、测试命令
└── .dsh/
    ├── APPEND_SYSTEM.md          # 工地硬规则（dsh 插件注入）
    └── skills/                   # 项目专属技能
```

- 子项目的 `AGENTS.md` 由负责的 Agent 写，内容是项目事实与 Worker 边界，**不复制** Agent 项目的完整规则。
- 子项目不登记进公开 `docs/agents-registry.md`、不写 `xhqing` 名册、不进 agents-infra 镜像。
- 若需要 Agent 知道有哪些私有子项目，用本机私有登记（如 `~/.dev/private/<agent>/private-subprojects.md`），只在 Leader 侧读取。

## 3. 运行时帽子

同一个 Agent 项目里有两顶帽子，模型确实可能读到对方文件——这是“人有两本手册”的正常状态。用两道标识防止误用：

1. 根 `AGENTS.md` 的 `## 运行时` 段写清：pi 读 `.pi/APPEND_SYSTEM.md`，DSH 读 `.dsh/APPEND_SYSTEM.md`，不要应用对方的规则。
2. 两个 `APPEND_SYSTEM.md` 开头写运行时横幅（见上）。

Worker 的 worktree 里**只有 `.dsh/`，没有 `.pi/`**，所以 Worker 天然读不到 pi-team 的手册；这是最强的隔离。

## 4. Leader / Worker

- **Leader = 人**：在 Agent 项目里，戴对应帽子；负责私有子项目 main 的同步、建 worktree、派任务、收尾。
- **Worker = 工地工人**：在私有子项目的 worktree 里跑 DSH，载入 worktree 的 `AGENTS.md` + `.dsh/APPEND_SYSTEM.md`，执行任务，向 Leader 汇报；不碰 local main、不建删 worktree。
- Leader 若在 pi 下：不能用 pi 的 `agent_call` 拉起 DSH Worker（registry / 启动命令是 pi 专用），用 `tmux` / shell 启动 `dsh`。
- Leader 若在 DSH 下：用 DSH 的 teams / tmux 启动 Worker，工具链更一致。
- 建议闭源链路整个用 DSH（Leader + Worker），开源 Agent 项目维护用 pi——同一个人，换帽子，不换项目、不换版本。

## 5. DSH `APPEND_SYSTEM` 注入

DSH 原生不读 `.dsh/APPEND_SYSTEM.md`。用插件实现，等价于 pi 的 `.pi/APPEND_SYSTEM.md`：

- 插件源码：`~/.dsh/profiles/dsh-tui/plugins/project-append-system.mjs`（权威源）
- 挂载：`~/.dsh/profiles/dsh-tui/cordis.patch.yml`
- 镜像：`agents-infra/dsh/`，由 macmini 的 `~/.pi/agent/patch/agents-infra-publish/publish_dsh.py` 发布
- 部署/恢复：新机器用 `agents-infra/dsh/bootstrap.sh`；日常直接改 `~/.dsh`

```yaml
- insert:
    - id: project-append-system
      name: ./plugins/project-append-system.mjs
```

插件在 `agent/created` 时从 cwd 向上找最近的 `.git`，读 `<root>/.dsh/APPEND_SYSTEM.md`，加运行时横幅后注册为系统提示 section（order 10300）。

- Leader 在 Agent 项目 → 读 Agent 项目的 `.dsh/APPEND_SYSTEM.md`。
- Worker 在子项目 worktree → 读 worktree 的 `.dsh/APPEND_SYSTEM.md`。
- **`liangshen` preset 的 `complete: true` 会压制系统段**：用 standard preset，或把注入改成持久用户消息（`agent/pre-step` / inbox）。
- 文件在会话开始时读一次，中途修改不热更新。
- 系统提示每次请求都计费：`APPEND_SYSTEM.md` 保持短小，只放硬规则。

## 5b. DSH 核心基础设施的镜像

- **权威源：`~/.dsh/`**（双机；DSH agent 可在任一机器上改，双向同步）。
- 同步：Syncthing `dsh` 文件夹（双向），只同步 secret-free 核心。
- 镜像：`agents-infra/dsh/`，由 macmini 的 `~/.pi/agent/patch/agents-infra-publish/publish_dsh.py` 发布。
- `pi/agent/` 也由 macmini 的 `publish.py` 发布；两个子树都在 macmini 发布，路径不相交。
- 镜像只含 secret-free 核心：`AGENTS.md`、`README.md`、`bootstrap.sh`、`profiles/dsh-tui/`（配置 + 插件）。
- 排除：`.env`、`.credentials.yaml`、`.anonymous-user-id`、`sessions/`、`storages/`、`attachments/`、`node_modules/`、`.plugin-manager/`、`settings.yaml.imported`。
- 修改后等 Syncthing 收敛，再在 macmini 跑 `publish_dsh.py`；不要维护第二份 canonical，也不要手工复制到 `~/.pi/agent`。

## 6. 版本与 CHANGELOG

| 位置 | 内容 | 读者 |
|---|---|---|
| Agent 项目 `CHANGELOG.md` | 开源 Agent 能力变化（含 DSH 支持） | pi-team、所有人 |
| 私有子项目 `CHANGELOG.md` | 该项目的私有业务变更 | 该项目的 Leader / Worker |

- Agent 项目只有一套 `VERSION` / `CHANGELOG.md`；不因为两顶帽子拆成两个版本。
- 私有子项目有自己的 `VERSION` / `CHANGELOG.md`；不进 Agent 项目的版本号。
- Agent 项目 CHANGELOG **不写**私有项目名、客户、金额、业务细节；私有子项目 CHANGELOG **不写** pi-team 流程。
- 私有项目里学到的通用经验：先脱敏、泛化，再通过 pi-team 的开源流程写进 Agent 项目的 `AGENTS.md` / skills / CHANGELOG；私有细节留在子项目。

## 7. 污染控制

- 共享文件（根 `AGENTS.md`、`CHANGELOG.md`、README、TODO）写**团队中立 / 产品化**的内容；团队专属内容只进各自的 `APPEND_SYSTEM.md`。
- Worker 的 worktree 不含 `.pi`，天然隔离 pi-team 规则。
- Agent 项目里两顶帽子共存，靠运行时分支 + 横幅区分；不要为了隔离去 sparse-checkout 掉 `.pi` / `.dsh`——Agent 项目是“人的家”，本来就需要两顶帽子。
- 私有子项目的 `AGENTS.md` 不写 Agent 项目的完整规则；只写项目事实、Worker 边界、汇报线。

## 8. 首次落地清单

1. DSH 插件已安装并挂载（`project-append-system`）。
2. 第一个私有子项目：建私有仓库，写 `AGENTS.md` + `.dsh/APPEND_SYSTEM.md`，在 Leader 侧登记本机私有清单。
3. Agent 项目按需补 `.dsh/APPEND_SYSTEM.md`（Leader 的 dsh 帽子规则）。
4. 分别用 DSH 在 Agent 项目根、私有子项目 worktree 根开会话，确认：
   - Agent 项目：读到 `.dsh/APPEND_SYSTEM.md`，且横幅提示忽略 `.pi/`；
   - 子项目 worktree：读到工地规则，且没有 pi 规则。
5. 验证通过后再推广到更多 Agent 项目；不要一次性改 17 个项目。