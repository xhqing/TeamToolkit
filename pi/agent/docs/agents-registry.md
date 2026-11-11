# 智能体命名注册表与团队结构

> 本文件由全局 `~/.pi/agent/AGENTS.md`「团队结构参考」指针节指向。**何时读**：新建 Agent 项目前（名称查重）、判断某子任务该移交给哪个 agent 时、新增 / 变更 Agent 或子项目的注册信息时。权威源在全局 `~/.pi/agent/docs/`，开源镜像在 TeamToolkit 仓库 `pi/agent/docs/`。

## 智能体命名注册表（避免重名 + 跨 agent 推荐）

下列是已存在的智能体。**新起名称前先查此表，全局不可重复**（项目名规则：**Agent 项目一律 `<职责>-agent`**——全小写、连字符、前缀尽可能简单且一眼看得出职责，如 `assistant-agent` / `quant-agent`；2026-11-09 用户立。非 Agent 项目仍按「尽可能简单、能体现职责」起名，如 `vscode-copy-anywhere`）。名称（人格名）另行登记，与项目名是两回事。执行任务时，若发现某子任务更适合另一个 agent，应主动推荐 / 移交给它。

| 名称 | 项目（仓库） | 职称 Title | 主要职责 |
|---|---|---|---|
| **Scout** | ProductStrategistAgent | 选品策略师 | 研判：热点 + 市场 + 竞品 + 盈利 + 渠道 →《机会研判报告》 |
| **Wright** | ProductProducerAgent | 数字产品制作人 | 生产：做出成品数字产品（prompt 包 / 模板 / ebook / 素材） |
| **Mason** | SiteBuilderAgent | 建站工程师 | 建设：搭成交基础设施——独立站建设 + 落地页技术与部署 + 支付渠道与接口配置；建设期（Wright 之后、Buzz 之前），建好把购买链接交 Buzz |
| **Buzz** | GrowthMarketerAgent | 增长营销 | 引流：各渠道引流内容 + 链接（X / IG / YouTube / 小红书 / 知乎 / B 站） |
| **Vendy** | DigiVendAgent | 电商运营 | 成交：上架 / 定价执行 / 履约 / 售后纠纷 / 多平台铺货 / 对账 |
| **Echo** | DataAnalystAgent | 数据分析师 | 复盘：归因（决策→业绩）+ 分发建议 + 累积 playbook |
| **Kit** | assistant-agent | 总经理助理 | 通用助手：用户的第一助理、团队多面手，几乎任何事务都接得住（不分组、直属用户；找单找岗接活归 Hopkins）。**2026-10-31 起接管原电脑管家（Alfred / DeviceStewardAgent）的职责**：本地电脑 / 远程服务器 / 云电脑的资源监控与管理建议（进程 / 内存 / 存储治理） |
| **Victor** | trading-agent | 日内交易员 | 信号：港股 / 美股盘中盯盘 → 分析标的 + 计算仓位与止损 → 发出交易信号（信号模式，不下单，人工执行） |
| **Mark** | quant-agent | 量化策略师 | 量化策略：设计可回测的交易策略代码 → 历史回测标定可信度（离线开发，不盯盘不下单）；2026-10-17 由 Markowitz 更名为 Mark（取自现代投资组合理论之父 Harry Markowitz 的常用名） |
| **Anvil** | BackendEngineerAgent | 后端开发工程师 | 后端：负责所有后端开发工作（服务端逻辑 / API / 数据库 / 系统架构 / 桥接服务），目前在手 CC-BRIDGE（Claude Code 上游桥接框架），独立于销售流水线 |
| **Atlas** | dev-agent | 全栈开发工程师 | 全栈：负责横跨前后端的完整开发（前端界面 / 后端服务 / 构建发布工程化），目前在手 ghostty-launcher、codef、pi-harness、ghostty、mp4-player、XPilot 等项目（详见下方映射表），独立于销售流水线 |
| **Ada** | NeuralCoreAgent | AI 算法工程师 | 算法：设计 / 迭代 / 评测深度推理引擎（目前在手 AgentCortex——Infinite / Rapid / Incisive 三套推理引擎规则 + 评测体系），独立于销售流水线 |
| **Hopkins** | apply-agent | 投递转化率优化师 | 工作接单全链路（专门负责：找单找岗、投递、转化一条龙，原由 Kit 承接）——任务池投标与招聘平台求职（电鸭、BOSS直聘等）同为并行接单策略、同属一条投递漏斗：投递材料工程（接单的标书 + 求职的简历与打招呼话术，模板库 + 单变量 A/B 测试）、漏斗追踪（投递 → 回应 → 沟通 / 面试 → 成单 / offer）、转化率归因、报价与薪资策略测试、渠道淘汰（多渠道数据触发不凭感觉）；名字取自「科学广告之父」Claude Hopkins（简历即自我广告、话术即文案、漏斗归因即本行），直属用户、不属任何小组（工作接单，单人）；项目原名 BidOptimizerAgent |
| **Justin** | LegalAgent | 法务Agent | 法务：负责整个团队所有跟合同和收款相关的事项——合同起草审查、收款结构设计（分期付款）、交易对手尽调、证据链留存、纠纷应对、合规备忘；名字取自编纂《民法大全》的查士丁尼大帝，直属用户、不属任何小组（纯法务，跨组服务全部小组；财务职能暂时空缺） |
| **Gatsby** | social-agent | 社媒运营官 | 社媒矩阵：运营群主本人的社媒账号矩阵——YouTube（横向长视频 + 纵向中短视频）/ 小红书（图文 + 纵向中短视频）/ 公众号 / 小绿书（公众号贴图）/ 视频号（纵向中短视频）/ 微信社群 / 个人微信朋友圈；社群的运营理念与方法（群规迭代、新人欢迎流程、话题日历、内容整理、运营复盘）由 Gatsby 主导产出，群主为辅助、引导和执行角色（微信内一切操作由群主落地）；名字取自《了不起的盖茨比》的传奇派对主人 Jay Gatsby，不分组、直属用户（2026-10-14 由「社群运营官」升级为「社媒运营官」；项目名 2026-10-15 由 CommunityManagerAgent 更名为 social-agent） |
| **Hopper** | TestEngineerAgent | 软件测试工程师 | 测试：全团队软件项目的功能测试与回归防护网——需求转验收用例（用例先行）、存量项目从事故补回归用例（先红后绿）、用例库与 CI（GitHub Actions）维护、交付验收判定；持用例定义权，与开发 agent 的实现权、CI 的裁决权三权分立（开发 agent 禁改用例迁就实现）；名字取自史上第一个计算机 bug 的发现者、「debug」一词推广者 Grace Hopper，隶属基础设施小组 |
| **cuAgent** | cuAgent | 电脑操作员 | 计算机操作用户代理：用 computer-use 能力（GUI 自动化——看屏幕 / 点击 / 输入 / 拖拽）代替用户操作本机电脑界面；独立工具型 agent、不分组、直属用户，独立于销售流水线；能力仅限本项目内启用（2026-10-09 建立，远程仓库待建） |

## Agent 项目的判定与命名标准（2026-11-09 用户立，同日两次修订定稿）

**判定与命名是两件事，各有一套规矩：**

**① 判定——一个项目是不是 Agent 项目，只看 `README.md` 的 `Type` 徽章**：值是 `AI Agent`（shields.io 形如 `![](https://img.shields.io/badge/Type-AI%20Agent-FF1493)`；带 `.svg`、`?style=…`、包在 `<img>` 或 Markdown 链接里都算同一枚）就是 Agent 项目；值是 `Project` / `Cli` / `pi extension` / `VSCode Extension` 等任何其它值的，都**不是**。

**② 命名——Agent 项目的名字一律 `<职责>-agent`**：全小写、连字符、前缀尽可能简单且一眼看得出职责（如 `assistant-agent` / `quant-agent` / `social-agent` / `trading-agent` / `apply-agent`）。非 Agent 项目不受此约束，仍按「尽可能简单、体现职责」起名（如 `vscode-copy-anywhere`、`ark-key-pool`）；不为凑后缀加字，也不为求短而丢语义（`README.md` 压成 `R.md` 这种是过度简化）。

- **为什么这么定**（两次修订的经过）：2026-11-09 用户先把总经理助理项目从 `ExecutiveAssistantAgent` 改名为 `assistant`（理由是项目名只求简单、性质由 README 声明）；随即改口定稿——**名字里要带 agent**，于是正式规定 `<职责>-agent`、全小写。结论：名字既要不啰嗦（`<职责>-agent` 够短），又要一眼分类（后缀标出这是 Agent 项目）；性质仍由徽章声明，不拿名字当判据。
- **存量项目**：仍叫 `XxxAgent`（大驼峰）的 Agent 项目，**由用户逐个项目指定新名后再改**；不要自作主张批量改名——GitHub 仓库名、本地目录、跨仓库引用、私有目录、名册、会话 cwd、launchd 路径都是连锁改动，成本高、必须用户点头。
- **Agent 项目必须挂徽章**：注册表里登记为 Agent 的项目，`README.md` 一律要有 `Type-AI Agent` 徽章（新建时按 `docs/new-agent-scaffold.md` 的徽章规范挂上；缺的算数据错误）。
- **工具读哪里**：`agent_call` / `agent_wake` 的目录校验在启动时读**本文件的两张表**（为一次校验去读 17 个仓库的 README 太重），因此「改名 / 改性质」= 同时改 README、本文件登记、`xhqing` 名册三处，必须一致。`patch/roster-sync/roster-sync-check.py` 会逐个校验注册表里的 Agent 项目是否真有 `Type-AI Agent` 徽章，缺则报错。

## 销售流水线与三小组

销售流水线顺序：① Scout → ② Wright → ③ Mason → ④ Buzz → ⑤ Vendy → ⑥ Echo。整个团队按涉及领域分为三个小组：**数字产品销售小组**（六段流水线 Scout → Wright → Mason → Buzz → Vendy → Echo）、**投资与交易小组**（Mark 量化策略研发与回测标定，Victor 日内盯盘发信号）、**基础设施小组**（Anvil 纯服务端项目；Atlas 横跨前后端的完整项目及偏前端 / TUI / 客户端侧的工作——两者分工协作；Ada 负责全团队推理引擎的设计与评测，为所有 agent 的思考能力供底；Hopper 负责全团队软件项目的功能测试与回归防护网——用例先行 + CI 红灯门禁，把「改 A 坏 B」拦在合并进 main 之前）。**Kit（总经理助理）不分组、不属于任何小组**——用户的第一助理、团队多面手，几乎任何事务都接得住（工作接单整体归 Hopkins、合同收款归 Justin）。**Gatsby（社媒运营官，2026-10-14 由「社群运营官」升级）同样不分组、直属用户**——运营群主本人的社媒账号矩阵（YouTube / 小红书 / 公众号 / 小绿书 / 视频号 / 微信社群 / 个人微信朋友圈），理念方法由 Gatsby 出、执行由群主落地（微信内一切操作）；与 Buzz 的分工：Buzz 负责数字产品销售的渠道引流内容（X / IG / YouTube / 小红书 / 知乎 / B 站），Gatsby 负责群主本人账号的长期运营与私域阵地——平台有重叠、任务不同。**cuAgent（电脑操作员）不分组、直属用户**——computer-use 专用 agent：用 GUI 自动化代替用户操作本机电脑界面（看屏幕 / 点击 / 输入 / 拖拽），独立于销售流水线，能力仅限自己项目内启用。其中 Mason（建设期：建成交阵地 + 接支付）必须在 Buzz 之前就位，Buzz 的带货链接才有处可指；Vendy 在 Buzz 之后做运营期（接单 / 履约 / 售后 / 对账）——Mason 建、Vendy 营，接力同一阵地。每个 agent 的名称同时写在其项目 README 里。

## 新建 Agent 时自动维护注册表（免确认）

凡是新建一个 **Agent 项目**（即属于上方注册表范畴的团队 agent），**无需每次征得同意**，直接做两件事：

1. 把「名称 + 项目（仓库）+ 职称 Title + 主要职责」加进上方「智能体命名注册表」表格（名称先查重，全局不可重复；项目名按命名规则起名——**Agent 项目一律 `<职责>-agent`**，全小写、连字符，前缀尽可能简单且体现职责）；
2. 在上方「销售流水线与三小组」段补上该 agent 的位置（在流水线内，还是独立于流水线）。

**为什么免确认**：新建一个 agent 项目本身就已明确要把它纳入团队；注册表是团队的元数据，追加新成员是建立该 agent 的固有一步，每次都问一遍是多余的反 confirm。

**授权边界（重要，防过度泛化）**：本条的免确认授权**仅限「向注册表追加新 agent 行 + 补一句位置说明」这一类编辑**，**不扩展**到全局 `~/.pi/agent/AGENTS.md` 或本文件的其它任何修改——例如改语言偏好、git 规则、输出风格、脚手架约定，或对**已有** agent 行的重命名 / 调整职责 / 删除等，仍一律按「先征得同意」处理，不因本条规定而自动授权。改全局元规范默认要谨慎，只有「新建 agent 时追加注册表行」这一个窄口子放开。

## 智能体专属文件归属与子项目映射（2026-11-08 修订）

**智能体专属文件**指「会话启动时按工作目录加载、用于表征智能体身份 / 给智能体下指令」的项目级文件与目录：`AGENTS.md`（**规则本体，统一用这个名字**；`CLAUDE.md` 已弃用，2026-11-05 用户立）、`AGENTS.override.md`（需要整体替换同目录 `AGENTS.md` 时用）、`.claude/`（Claude Code 项目级配置，按 2026-10-17 决定不再维护）、项目级 `.pi/`（pi 项目级配置：skills / extensions / prompts / SYSTEM.md / settings 等）。

**归属规则（2026-11-08 用户立，取代 2026-10-30 的「身份层软链接 + 能力层路径引用」）**：

1. **两边完全独立**：Agent 项目与它名下子项目，**各自的 `AGENTS.md` 与 `.pi/` 之间没有任何链接、没有任何路径引用**，每个项目只放本项目真实需要的内容。用户原话：「二者的 AGENTS.md 和 .pi 目录之间应该完全无关才比较合适，只需要放本项目真实需要的项目规则和 .pi 目录下的工具文档或配置等，这样才能同时满足二者的特异性规则需求和 .pi 目录下内容的特异性需求。」归属关系仍然存在（记在本文件的映射表里、写在各自 `AGENTS.md` 里），只是规则与配置**物理上各管各的**。
2. **子项目 `AGENTS.md` 是本仓库的实体文件**，写四件事：① 本项目是什么（一两句）；② 归哪个 Agent 负责；③ Worker 的角色边界（干完向谁汇报、不碰 local main、不建删 worktree）；④ 规则索引（`.pi/APPEND_SYSTEM.md` / `DEVELOPMENT.md` / `CHANGELOG.md` / `TODO.md` 各放什么）。**不写** Agent 项目的规则副本——那份规则本来就不属于这个仓库。
3. **子项目 `.pi/` 只放自己的东西**：不再写跨仓库的资源路径（旧的 `settings.json` 四键模板已全部删除）。需要技能 / 扩展就放进自己的 `.pi/{extensions,skills,prompts,themes}`（这四个目录自动发现、不必写进 settings），或者只留 `.pi/APPEND_SYSTEM.md` 一份硬约束。
4. **为什么这样定**：① 跨仓库路径引用是**隐式依赖**——Agent 项目改名、子项目单独 clone、换机器，都会静默失效（pi 不报错，只是少加载东西）；② 两层压在同一个符号上只能靠「只允许追加、不许重述」的纪律压着，而那条纪律本身就说明两层混在一起有事；③ **安全网不受影响**——全局 `~/.pi/agent/`（全部团队规则、`add` / `commit` / `bump` / `release` 技能、各类守卫扩展）在**任何目录**都会加载，而项目级交叉引用真的带过来的东西远少于直觉（实测九成是空引用：Atlas 名下 8 个子项目引用的目录根本不存在）。
5. **后台会话分 Leader / Worker 两级（2026-11-07 用户决定）**：
   - **Leader**：以 Agent 项目根目录为工作目录的会话，是该 agent 的**项目负责人**——负责名下子项目 local main 的同步、按任务建 worktree、收尾时清理 worktree 并把 local main 对齐远端；跨项目协调与向用户汇报也在这里做。
   - **Worker**：以「已登记子项目根目录」或「该子项目的 git worktree 目录」为工作目录的会话，是**临时工**——只干某一个 worktree 里的具体任务（开发、调试、测试、提交），干完向 Leader 汇报。
   - **为什么要分**：子项目之所以独立成仓库，正是因为它有**专属规则与工具**；这些内容不能上提到 Agent 项目（一上提就污染所有兄弟子项目），而 pi 只加载 cwd 那一层的 `.pi/`（不向上继承）——Leader 站在 Agent 项目里干活，天然看不到子项目的专属配置。**这套分工与上面「两边完全独立」不矛盾**：独立性说的是配置与规则各管各的，分工说的是「谁来干、干完向谁汇报」。
   - **工具校验**：`agent_call` / `agent_wake` 的 `dir` 接受三类目录（Agent 项目根 / 已登记子项目根 / 子项目的 git worktree），其它目录拒绝。worktree 通过 `.git` 文件里的 `gitdir:` 反查主仓库，主仓库必须是已登记子项目（因此 `~/Developer/<子项目>-<事项>` 这种平级 worktree 能被正确识别）。
   - **启动必带 `-a`**：子项目 `.pi/` 下有 `APPEND_SYSTEM.md` 等资源，会触发 pi 的「信任本项目」判定（判据：`.pi/` 下存在 `settings.json` / `extensions` / `skills` / `prompts` / `themes` / `SYSTEM.md` / `APPEND_SYSTEM.md` 任一项）；tmux 后台会话没有人能应答那个提示，不带 `-a` 会卡死在提示上、永远不注册（2026-11-07 实测确认）。
   - **命名约定**：Worker 会话用 `<Agent 名>-<子项目>`（如 `Atlas-cmux`、`Atlas-pi-harness`），与 Leader 会话名区分；同一子项目允许同时存在多个 Worker（各自在不同 worktree 上），用 session-id 区分。
   - **生命周期**：Worker 用完即清（使命完成主动 `tmux kill-session -t pi-<名字>`），不长期挂着——用户看不到 tmux 后台会话，挂着等于隐形进程。
6. **`.claude/` 不纳入本网络（2026-10-17 用户决定）**：Claude Code 侧不再维护——子项目不挂 `.claude` 链接；各 Agent 项目里现有的 `.claude/` 内容暂留不动（不新增、不维护、不迁移）。
7. **迁移口径（2026-11-08 已执行完毕）**：17 个子项目仓库全部改为「实体 `AGENTS.md` + 删掉 `.pi/settings.json` 里的四条跨仓库路径 + `.pi/APPEND_SYSTEM.md` 改为指向本仓库 `AGENTS.md` 与全局规则、角色段移入 `AGENTS.md`」。新增子项目照此从零建，**不要再挂软链接、不要再写 `settings.json` 跨仓库路径**。

- **历史沿革（别重复踩已踩过的坑）**：2026-08-10 立「子项目 `.claude/` 超集」→ 2026-10-12 改为「子项目一律不得存在智能体专属文件」→ 2026-10-17 改为「`.pi` 也挂软链接」→ 2026-10-30 改为「身份层软链接 + 能力层目录引用 + 只允许追加」→ **2026-11-08 改为本版（两边完全独立）**。前几版都栽在同一个取舍上：想让子项目既「继承」又「扩展」，就只能靠软链接或路径引用把两层绑在同一个符号上——绑上以后，继承来的东西不可控地失效（改名 / 换机 / 单独 clone），要扩展的部分又被纪律捆住。实测下来继承过来的内容九成是空引用，所以 2026-11-08 直接把继承这一层砍掉，各管各的。
- **工具强制**：pi 端扩展 `~/.pi/agent/extensions/agent-call.ts` 在自动唤醒前按本文件「子项目映射」表校验目标目录必须属于三类之一——**Agent 项目根**（Leader）/ **已登记子项目根**（Worker）/ **该子项目的 git worktree**（Worker），其它目录拒绝；启动命令固定带 `-a`。`~/.pi/agent/patch/settle-repo-check/settle-repo-check.py`（收尾巡检，由 pi 扩展调用）同样按下方「子项目映射」表定位子项目（cwd 为子项目目录时也能正确归属）。

**子项目映射（完整清单，权威）**：当前全部 Agent → 子项目对应关系如下表，新增 / 变更子项目时以此表为准，并同步更新对应 Agent 项目 `AGENTS.md` 的「子项目清单」节，保持一致。表中每个子项目根目录都应带**本仓库实体** `AGENTS.md`（项目定位 / 负责 Agent / Worker 边界 / 规则索引）与 `.pi/APPEND_SYSTEM.md`（本项目硬约束，Worker 会话靠它加载），**不挂软链接、不写跨仓库 `settings.json` 路径**，随仓库提交，见上方规则第 1、2、3 条。

**宿主机归属（2026-10-17 用户立，2026-10-31 修订）**：字面口径是「每个 Agent 只允许存在于一个宿主机」，但**自 2026-10-28 两机建立全量双向镜像后，所有项目在两台机器上都有副本**，因此 2026-10-31 起 `xhqing` 名册的 Host machine 列统一写 **`macmini&macbook`**。该原则现在的实际含义是「**活跃写操作只在一台机器上做**」（避免同一 git 仓库两边同时写导致 `.git` 冲突），不再是「另一台没有副本」。历史：默认全部在本机（MacBook Air）；**已迁移到 macmini 的**：**Mark**（quant-agent 及当时的三个子项目仓库 Intraday / Swing / gridtrader，2026-10-17 整体迁移；本机已归档 `~/Archive-Migrated/`、不再保留活跃副本）。跨机呼叫已迁移 Agent 的方式见全局 `AGENTS.md`「跨机协作」节。

**Mark 已迁回本机（2026-10-26 用户决定）**：Mark 全部项目（quant-agent 及当时的三个子项目仓库）已由用户从 macmini **拷回本机**，`~/Developer/` 下的本机目录即**权威源**（已逐个核实与本机之外副本同一提交）。**macmini 上的同名目录与 4 个 Mark 常驻会话（`Mark` / `Mark-Intraday` / `Mark-Swing` / `Mark-gridtrader`，`duty.conf` 未改）暂时保留、不再权威**——用户 2026-10-26 明确选择「两边都不动、只改本机口径」。

- **2026-10-28 起两机已建立全量双向镜像**（`~/Developer` + `~/.pi/agent` 逐字节同步，见 `docs/macmini-mirror.md`）：macmini 上的改动**会同步回流本机**，原「不会回流本机」的说法失效。为避免 `.git` 冲突，**同一个仓库同一时间只在一台机器上做 git 写操作**；macmini 的 GitHub 访问已于 2026-11-05 恢复，提交 / 发版仍建议统一在本机做。非「必须用 macmini 环境（32GB / x64）」的任务，仍建议在本机会话里做。
- macmini 仍作远程算力 / 环境使用（值班会话 `macmini`），只是不再承载 Mark 的身份与项目。

| Agent 项目 | 子项目（仓库） | 说明 |
|---|---|---|
| BackendEngineerAgent（Anvil） | CC-BRIDGE | Claude Code 上游桥接框架（Node.js） |
| dev-agent（Atlas） | ghostty-launcher | VSCode 状态栏一键唤起外部 Ghostty 终端的扩展（在跑激活已有窗口 / 未跑带工作区目录启动，零依赖、仅 macOS） |
| dev-agent（Atlas） | codef | 全屏打开 VSCode 的 CLI 小工具（code + 自动全屏 + 目标窗口置顶，bash + osascript、仅 macOS；开发目录 ~/Developer/codef，生产副本部署在 ~/.local/bin/，发版后安装、禁止软链） |
| dev-agent（Atlas） | pi-harness | Pi agent harness 独立分叉仓库（TypeScript monorepo：coding agent CLI / agent 运行时 / 统一多供应商 LLM API / TUI 组件库），2026-09-19 起与原上游 earendil-works/pi 断开 fork 关系，自主维护演进；GitHub 仓库与本地目录均为 `pi-harness`（2026-10-18 改名、2026-10-23 本地目录同步改名） |
| dev-agent（Atlas） | ghostty | Ghostty 终端的独立分叉仓库（2026-09-20 起与原上游 ghostty-org/ghostty 断开 fork 关系、自主演进；当前为 v1.3.1 基线 + 「Cmd+V 粘贴剪贴板图片为临时文件路径」补丁，GitHub Actions 云构建） |
| dev-agent（Atlas） | cmux | cmux 终端（基于 Ghostty 内核的 macOS 终端，面向 AI coding agents）的**自建分叉仓库**（`github.com/xhqing/cmux`，fork 自 manaflow-ai/cmux，2026-10-31 建立、由 Atlas 负责）：不等上游把关闭确认类改动合并，按我们自己的偏好改（关闭带运行进程的工作区 / 标签页不再强制确认），以「上游 release tag 为基线 + 最小补丁」的方式持续同步上游 |
| dev-agent（Atlas） | turn-diff | 看「这一轮 AI 改了什么」的 pi 扩展 + 命令行：每轮记 git 基线、轮次结束算增量并落盘，`/turn-diff` 与 `turn-diff` 随时读（项目 `~/Developer/turn-diff`；2026-11-07 由 diff-view 更名并把范围收敛为「只做本轮 diff」，cmux 面板能力已移除） |
| dev-agent（Atlas） | mp4-player | VSCode 视频播放扩展（上游 Brodazz/mp4-player 的独立仓库：编辑器标签页内带音频播放视频，内置 ffmpeg WebAssembly 做音频解码与格式转码；2026-10-09 移交 Atlas，开发目录 ~/Developer/mp4-player） |
| assistant-agent（Kit） | xhqing | 用户 GitHub 个人主页仓库 |
| assistant-agent（Kit） | vscode-copy-anywhere | 让 VSCode 资源管理器里复制的文件能粘到任意 App 的 macOS 后台小工具（Finder / 微信 / 浏览器上传框等；后台把 VSCode 私有剪贴板格式转成系统格式；2026-10-08 建立、2026-10-09 登记；2026-10-30 由 `copybridge` 改名为现名——原名看不出用途） |
| assistant-agent（Kit） | ark-key-pool | pi 的火山方舟 Agent Plan 多 Key 自动切换扩展（不同账号的 Key 组成池，额度耗尽 / Key 失效自动切下一个，冷却跨进程共享；项目 `~/Developer/ark-key-pool`，2026-10-22 建立；已开源 github.com/xhqing/ark-key-pool（2026-10-22，v0.1.0）） |
| assistant-agent（Kit） | macmini-tmux | 在 Mac mini 上方便使用 tmux 的 CLI 封装（`macmini tmux` 不带参数时每次新开会话、名字自动递增 `session#N`；`-s` 按名字接上 / 新建、`-a` 接回最近会话、`-l` 列表；另可透传任意命令到 macmini；项目 `~/Developer/macmini-tmux`，2026-10-29 建立；已开源 github.com/xhqing/macmini-tmux（2026-10-29，v0.1.0）） |
| assistant-agent（Kit） | TeamToolkit | 全团队通用能力底座的开源镜像（原 CapabilityManagerAgent，2026-11-05 更名并降级为普通项目；仓库内 `pi/agent/` 逐字节镜像全局 `~/.pi/agent/`；发布改为 macmini 单 pusher，见 `docs/capability-sync.md`） |
| assistant-agent（Kit） | dotfiles | 按 App 分类的个人配置文件仓库（项目 `~/Developer/dotfiles`，2026-10-31 建立，远程 `github.com/xhqing/dotfiles`；2026-11-02 按「团队项目一律 public」改公开并锁 main）：配置文件在仓库里只存一份，安装时软链到系统位置，新机器 clone + `./install.sh` 一键恢复；目前收录 ghostty / cmux 两个 App，**`ghostty/config` 被 Ghostty 与 cmux 共用**（cmux 基于 libghostty 读同一份配置），共用关系在仓库根 README 的「共用配置文件」表与各 App 目录 README 里注明 |
| dev-agent（Atlas） | XPilot | Xray-core 节点管理 CLI（Python）：代理节点真实流量测速与连通性检测 → 自动选路（纯延迟 / 纯带宽 / 混合）→ 故障转移 → 订阅刷新（2026-10-26 由 NetOpsAgent / Hermes 移交 Atlas，原负责 Agent 已注销） |
| NeuralCoreAgent（Ada） | AgentCortex | 深度推理引擎规则集（三套推理引擎：Infinite / Rapid / Incisive） |
| NeuralCoreAgent（Ada） | ToolCallingRules | LLM 工具调用规则集（2026-11-02 按「团队项目一律 public」由私有改公开并锁 main；22 条规则 / 7 类，注入 system prompt 以减少 function calling 的参数格式错误与不安全重试、提升调用准确率；PolyForm-Noncommercial；2026-10-31 用户决定由 Ada 接手负责，此前是未登记的历史独立项目） |
| trading-agent（Victor） | TradingProofs | 交易数学的 Lean 4 + Mathlib 机器可验证证明（从固定比例下注的累计收益率推导开始，覆盖强数定律指数增长率 / 凯利最优 f\* /「两倍凯利」边界；与实盘执行完全隔离，2026-10-11 立项） |
| social-agent（Gatsby） | blog | 个人博客「藏经阁」（docsify 站点，<https://xhqing.github.io/blog>；GitHub Pages 直接从 `main` 的 `docs/` 发布）。**2026-11-11 由 Kit（assistant-agent）移交 Gatsby**，同日从「已退役子项目」名单里恢复为活跃。内容双通道：手写，加上从 social-agent 的 `docs/articles/` 每 10 分钟自动同步——**不看写完没写完**，源仓库什么状态博客就什么状态；同步产物带 `<!-- source: … -->` 标记，机器人跑完自检后直推 `main`（用过 `GITHUB_TOKEN` 建 PR 触发不了别的 workflow，所以不走 PR） |

> **Mark（quant-agent）名下已无子项目仓库（2026-11-08）**：原 Intraday / Swing / gridtrader 三个子项目仓库已并入 Mark 仓库，成为 `Intraday/`、`Swing/`、`gridtrader/` 三个目录（各自带自己的 `AGENTS.md`；并入按 squash 落地成单个提交，**原仓库的完整提交历史保留在三个 GitHub 存档仓库里**）。

- **已注销 / 已退役的 Agent**：**Hermes**（NetOpsAgent，2026-10-26 用户决定）——原网络运维管理员，唯一子项目 XPilot 已移交 Atlas（dev-agent），项目本体退役、不再作为活跃 Agent 维护（GitHub 仓库 `xhqing/NetOpsAgent` 保留为存档；本地目录已于 2026-10-31 按用户要求删除）。
- **已除名的 Agent（2026-10-31 用户决定，第二批）**：**Tinker**（PatchClaudeAgent，补丁维护匠）——用户要求「Tinker 这个 Agent 也除名，不需要了」；原职责是把自定义补丁重新应用到升级后的 VSCode Claude Code 扩展（自愈引擎），本次未指定接替者；项目本体退役、不再作为活跃 Agent 维护；**本地目录已按用户 2026-10-31 要求删除**（`~/Developer/PatchClaudeAgent` 不再存在），GitHub 仓库 `xhqing/PatchClaudeAgent` 保留最新版为唯一源。
- **已除名的 Agent（2026-11-05 用户决定）**：**Prometheus**（CapabilityManagerAgent，通用能力管家）——项目**降级为普通项目并更名 TeamToolkit**，归 **Kit**（assistant）负责；不再作为 Agent 维护（公告 / 维护逻辑改为 macmini 单向发布脚本，见 `docs/capability-sync.md`）。GitHub 仓库已由 `xhqing/CapabilityManagerAgent` 改名为 `xhqing/TeamToolkit`（旧 URL 自动重定向）。
- **已除名的 Agent（2026-10-31 用户决定）**：**Alfred**（DeviceStewardAgent，电脑管家）——用户要求「可以从名册中除名了，以后他的工作由 Kit 处理」；职责已并入 **Kit**（assistant），项目本体退役、不再作为活跃 Agent 维护；**本地目录已按用户 2026-10-31 要求删除**（`~/Developer/DeviceStewardAgent` 不再存在），GitHub 仓库 `xhqing/DeviceStewardAgent` 保留最新版为唯一源；原有子项目 ResourceMonitor 早已退役。
- **已移出名册的子项目（2026-11-02 用户决定）**：**xhs-mentor-scam**（原属 Gatsby / social-agent）——仓库含第三方个人信息（合同、私信截图、真实姓名、举报材料），按 2026-11-02 立的「团队项目必须 public、私有仓库不得入队」规则不能留在团队；保持 private 作为用户个人项目，`autosave.sh` 自动备份照常。GitHub 仓库 `xhqing/xhs-mentor-scam` 与本地目录 `~/Developer/xhs-mentor-scam` 均保留。要恢复为团队项目，须先拆分 / 脱敏敏感材料并转为 public。
- **已移出名册的子项目（2026-10-31 用户决定）**：**NewsScoreStudy**（Mark 负责的面试实操题研究仓库，私有远程 `github.com/xhqing/NewsScoreStudy` 保留；本地目录已于 2026-10-31 按用户要求删除）——用户要求「先从名册中移除」；因名册与子项目映射表必须内容一致，本表同步删除其登记（原属 Mark，2026-10-26 由 Victor 移交）。要恢复时在这两处同时加回并同步名册。
- **除名 agent 的本地副本处理口径（2026-10-31 用户立）**：除名的 agent 项目**本地目录一律删除、不在本地保留备份**——只要 GitHub 仓库是最新版即可（删除前先确认工作区干净、与 `origin/main` 同步，避免丢本地改动）。需要查阅时从 GitHub 取。
- **已取消 / 已退役的子项目（不再维护）**：GitComic、agent-team-playbook-src（Wright）；zcode-cli、zcode-vsce、cmux-launcher（Atlas）；channels-watch（Atlas，2026-10-17 退役）；ResourceMonitor（Alfred）；CyberRipple——本地项目资料删除，GitHub 远端仓库保留为存档（CyberRipple 原未建远端仓库，其组织总览内容已并入 `xhqing` 主页 README）。**blog 已于 2026-11-11 由 Kit 移交 social-agent（Gatsby）、恢复为活跃子项目**，见上方映射表。

**名册同步（2026-10-26 用户立，硬性规定 + 工具强制）**：本文件任何改动——新增 / 删除 Agent 项目、子项目新增 / 删除 / 归属变更、Agent 迁机（宿主机归属变化）——必须**在同一批改动里**同步更新 `xhqing` 仓库（`~/Developer/xhqing`）README 的名册表格，也就是「Subprojects (🌐 public · 🔒 private)」那张表（**英文 `README.md` 与中文 `README_cn.md` 两份都要改**，双语文档同步）。不是「下次顺手改」，而是和 registry 改动一起做完。

- **谁做**：名册归 Kit（assistant）负责，但**改动 registry 的那个会话有责任同批补齐**（或当场交给 Kit 处理），不得留到下一次。
- **名册实时同步、不再逐次询问（2026-10-31 用户立，修订）**：名册就是本文件两张表的公开镜像——registry 改了什么，名册就同批改成什么，**不用问用户、不用等确认**。描述语由 Kit 按仓库实际情况直接撰写：一句话说清「它是什么 / 解决什么问题」，不夸大、不写与仓库无关的内容、不泄露个人信息与凭证。
  - **例外**：用户对**某个具体仓库**有过专项指示的，从其指示。**目前没有例外**——`NewsScoreStudy` 已于 2026-10-31 按用户要求从名册与子项目映射表中同时移除（见下方「已移出名册的子项目」），因此不再需要 allowlist 豁免。
  - **修订说明**：本条取代 2026-10-26 的两条旧规矩——①「描述语要先问用户」；②「私有仓库默认放空不写」。用户原话（2026-10-31）：「xhqing公开名册必须实时同步全局注册表，这个不用问，下次自动同步。」所以**私有仓库现在也照常列名册**，不再默认豁免。
- **工具强制**：pi 端扩展 `~/.pi/agent/extensions/roster-sync-guard.ts`——某次工具调用写到本文件后立即比对，发现名册没跟上就当场插话促其同批补齐；每轮收尾（`agent_settled`）再兜底比一次（Kit 会话注入提醒，其它会话只弹通知）。判定逻辑在 `~/.pi/agent/patch/roster-sync/roster-sync-check.py`（registry 两张表 ↔ 两份 README 名册的集合比对，缺 / 多都报；也可手工随时跑：`python3 ~/.pi/agent/patch/roster-sync/roster-sync-check.py`）。
- **脚本查不到的部分靠人**：脚本只比「名字集合」，不查描述文字，也不查名册的 **Host machine 列**——迁机改宿主机归属时，README 里对应 Agent 的 Host 列要手工同步。

- **子项目清单**：由各 Agent 项目在自己的 `AGENTS.md`（项目根、规则本体）中维护（须与上方「子项目映射」表保持一致）。新增 / 变更子项目时，同步更新映射表与对应 Agent 项目的「子项目清单」节。
- **边界**：本规则适用于「Agent 项目负责子项目」的情形；当前全部映射见上方「子项目映射」表。
