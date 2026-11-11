# 新建 Agent 项目脚手架与开源约定

> 本文件由全局 `~/.pi/agent/AGENTS.md`「团队结构参考」指针节指向。**何时读**：新建 Agent 项目（含团队 agent 与独立工具型 agent）前必读，保证团队一致、开源安全。权威源在全局 `~/.pi/agent/docs/`，开源镜像在 agents-infra 仓库 `pi/agent/docs/`。

**为什么**：agent 越来越多，统一脚手架避免重造轮子、避免泄露密钥。**怎么用**：复制已有 agent 项目（如 dev-agent）再按角色改写。

## 通用能力开源单一出口

**新建 Agent 项目一律不放与全局通用能力重复的内容**——`~/.pi/agent/skills/` 里的通用 skill（如 anysearch）不再复制进各 agent 项目的 `.claude/`。通用能力的开源分发统一经 **agents-infra（原 TeamToolkit / CapabilityManagerAgent，原由 Prometheus 维护）的 `pi/agent/` 镜像**（`skills/`、`AGENTS.md`、`docs/`、`patch/`、`extensions/` 五部分 + npm 清单）一次性完成——clone 该项目即得全部通用能力；各 agent 项目只放自己独有的内容（新建项目一律不建 `.claude/` 目录，见下）。

- **为什么**：全局 `~/.pi/agent/` 是运行时实际加载的「活」源头；每个项目放一份副本意味着通用能力一改动就要同步到所有项目，副本容易过期分叉（新建 NetOpsAgent 时即发现 anysearch `runtime.conf` 副本与全局不一致、find-skill 副本多出 `.env.example`）。统一单一出口后，全局改一处、镜像同步一处，各项目零维护。
- **边界**：单一出口模式已全量落地——各 agent 项目的 anysearch 等通用 skill 副本已全部清除（2026-09-13 核验，`~/Developer/*/.claude/skills/` 下无任何 anysearch 副本），「既有项目副本」这层维护已终结，不再存在项目间分发。

## 脚手架清单

- **AutoMemory 已全局弃用**：新建项目**不配 AutoMemory**（不建 memory 目录、不填 `autoMemoryDirectory`、`.gitignore` 不挂 memory 条目）。知识沉淀走 rules/skills（强约束规范）+ AGENTS.md，不依赖 AutoMemory 自动记。
- **目录名 / 名称** = **Agent 项目一律 `<职责>-agent`**（2026-11-09 用户定稿，如 `assistant-agent` / `quant-agent`）——全小写、连字符，前缀尽可能简单且一眼看得出职责；**非 Agent 项目**不受此约束，仍按「尽可能简单、体现职责」起名（如 `vscode-copy-anywhere`）；两类都不为凑后缀加字、不为求短丢语义。**项目是不是 Agent 项目看项目根 `README.md` 的 `Type` 徽章是不是 `AI Agent`**（见下「README 徽章」条与 `docs/agents-registry.md`「Agent 项目的判定与命名标准」节）。新建 agent 不强制拟人名。
- **不建 `.claude/` 目录**：新建项目**一律不建 `.claude/` 目录**，旧规定要求照建的 `.claude/` 下文件（`settings.json`、`settings.local.json`、`settings.local.example.json`，以及角色专属 skills / rules 等）**一律都不要**；通用能力经 agents-infra `pi/agent/` 镜像统一开源（见上「通用能力开源单一出口」节），项目内不留任何副本。项目根只建脚手架清单内的根目录文件（如 `LICENSE.md`（MIT））。
- **子项目：与 Agent 项目完全独立（2026-11-08 用户立，取代 2026-10-30 的「身份层软链接 + 能力层路径引用」）**：新建子项目时，`AGENTS.md` 与 `.pi/` **只为这个子项目自己的需要而建**——不挂指向 Agent 项目的软链接，也不在 `.pi/settings.json` 里写 Agent 项目的资源路径。`AGENTS.md` 是**本仓库的实体文件**，写四件事：① 本项目是什么（一两句）；② 归哪个 Agent 负责；③ Worker 的角色边界（干完向谁汇报、不碰 local main、不建删 worktree）；④ 规则索引（`.pi/APPEND_SYSTEM.md` / `DEVELOPMENT.md` / `CHANGELOG.md` / `TODO.md` 各放什么）。`.pi/` 里通常只放一份 `.pi/APPEND_SYSTEM.md`（本项目硬约束，会话自动加载）；真的需要技能 / 扩展就放进子项目自己的 `.pi/{extensions,skills,prompts,themes}`（这四个目录本来就会被自动发现，不必写进 settings）。两项都随仓库提交。`.claude/` 也不建（Claude Code 侧不再维护）。**为什么**：跨仓库路径引用是隐式依赖（Agent 项目改名、子项目单独 clone、换机器都会静默失效，pi 不报错只是少加载东西）；而「只允许追加、不许重述」那套纪律本身就说明两层绑在一起有事。安全网全在全局 `~/.pi/agent/`、任何目录都会加载。后台开启会话（`agent_call` / `agent_wake`）允许 Agent 项目根 / 已登记子项目根 / 子项目 worktree 三类目录，启动带 `-a`。细则见 `~/.pi/agent/docs/agents-registry.md`「智能体专属文件归属与子项目映射」节。
- **角色化 `AGENTS.md` 直接放项目根目录**（你是谁 / 产物契约 / 工具 / 约束 / 流水线位置，不放 `.claude/` 下）——**2026-11-05 起它就是规则文件本体，不再建 `CLAUDE.md`、也不再挂 `AGENTS.md → CLAUDE.md` 软链接**（pi 的上下文文件候选顺序 `AGENTS.override.md` > `AGENTS.md` > `CLAUDE.md`，本体在 `AGENTS.md` 时 `CLAUDE.md` 不参与加载，留着只会双份漂移）+ **中英双语 `README.md`**（含名称 + topics）。README 顶部必须有 **logo**（`assets/logo.svg`，统一模板：640×200 渐变色卡 + 角色 emoji + 名字 + 职称，配色按角色区分）+ **标准徽章**（shields.io：**License / Version / Type** 三枚是必须含有的底线——License 标开源许可证（如 MIT）、Version 标项目版本号（取自 VERSION 文件）、Type 标项目类型（如 AI Agent，**它就是「这个项目是不是 Agent 项目」的唯一判据**：值写 `AI Agent` 即 Agent 项目，写 `Project` / `Cli` / `pi extension` 等就不是；**名字另有规矩：Agent 项目一律 `<职责>-agent` 全小写**））；**不含** Forks，也不含 Stars / Last Commit 等 GitHub 动态数值 / 时间徽章；另**不含**点明 LLM / 厂商的徽章，如 "Built with Claude Code"）。logo 的视觉规范（英文文字、agent 门面模板 vs 子项目象征）见 icon-design skill。
- **访问量徽章已取消（2026-11-04 用户决定）**：团队各仓库 README 里那枚指向 `xhqing/xhqing` 仓库 `traffic/badges/<repo>.json` 的 shields.io endpoint 访问量徽章（Visitors / Visits/day）**不再使用**——用户 2026-11-04 决定停用集中式流量采集，采集工作流、脚本与 `traffic/` 数据目录已一并删除，全团队 24 个仓库的徽章也在同一批 PR 里移除。**新建仓库只挂 License / Version / Type 三枚**；存量仓库里若还看到这枚徽章，按遗留处理、删除整行。
  **为什么取消**（供理解，不必照抄进文档）：徽章数据必须由采集任务每天刷新，采集停掉后徽章会冻结在旧值、而徽章文案仍写「Visits/day (14d)」，等于长期展示不实数据——留着比删掉更糟。恢复的话需要同时恢复采集链路与数据目录，不是单挂一枚徽章的事。
- **徽章英文首字母必须大写**：README 里所有徽章上的英文文字——静态 badge 的 label（如 `License`、`Version`、`Type`）与 message、endpoint 徽章 JSON 里的 `label` 字段、以及徽章 `<img>` 的 `alt` 文本——凡英文，**首字母一律大写**（如 `License-MIT`、`Mode-Signal`、`Type-AI Agent`）。**为什么**：小写首字母在徽章墙上观感不一致、显得随意，与团队统一的专业视觉风格不符；首字母大写是英文标识词的标准书写规范。**怎么用**：新写徽章时直接按首字母大写书写；既有小写存量，接触一处改一处（顺手改，不必专门一次性返工）。**边界**：本条管「徽章上显示的英文文字」；URL 路径、仓库目录名等非显示内容不管；单词内部字母（如 `AI Agent` 的 `AI`、`iOS`）按该词本身的规范书写，不因本条改动。
- **`.gitignore` 必含**：`.env`/`.env.*`（留 `.env.example`）、`settings.local.json`、`tmp/`、`docs/`（运行时数据）、`artifacts/`（**可售卖成品，绝不公开**）、`node_modules/`、`.DS_Store`、`__pycache__/`。
- **开源到 GitHub**：`gh repo create XxxAgent --public --source=. --remote=origin --push` → 设 About + topics（`gh repo edit --description "<English summary> | <简体中文摘要>" --add-topic a --add-topic b ...`——description 用**中英双语**，英文部分以美式英文为主（特殊场景可用任何语言）、中文部分以简体中文为主（特殊场景可用任何语言）；**多个 `--add-topic` 写字面量、勿用 shell 变量拼接**，否则报 `accepts at most 1 arg(s)`）→ FUNDING.yml **只放一份在 `xhqing/.github` 仓库**（`github: xhqing`），作为所有仓库的默认 Sponsor 配置；**不要在每个 agent 项目里放 `.github/`**——赞助配置不是项目主体内容。别用 `repos/.../funding` API 验证（不公开返回）。
- **配置 main 保护：必须 strict 模式的 PR CI（2026-11-03 用户立，新建仓库无例外）**：仓库上线时必须同时具备三件套——① 至少一个**在 PR 上会真实跑的** CI 检查（没测试可跑的项目也要补最轻量的，如 lint / 语法检查 / 构建）；② 把它**挂成 required status check**；③ `required_status_checks.strict = true`。另外 `enforce_admins=true`（否则同账号直推照样绕过）、禁 force push / 禁删除、线性历史、只允许 squash、`allow_auto_merge=true`。**正确顺序**（顺序错了会把 PR 永久卡死）：推代码（含 workflow）→ 让 CI 在主分支或第一个 PR 上真跑一次 → 用 `gh api repos/<o>/<r>/commits/main/check-runs --jq '[.check_runs[].name]|unique'` 拿真实 check 名 → 再 PUT 保护。**定时任务（`schedule` 触发）的检查名绝不能挂成 required**——它在 PR 上不跑，会永久卡住合并。一键命令：先装检查 `~/.pi/agent/patch/branch-protection/validate-template/install.sh`（模板：`validate.yml` + `validate.py`，零依赖查必备文件 / 敏感文件 / 大文件 / README 链接 / 语法），跑绿后走 PR 合并；再用 `~/.pi/agent/patch/branch-protection/branch-protection.sh apply <owner/repo> --branch main --checks "<check名>" --apply` 挂门禁。规则背景、团队现状与检查的设计取舍见 `~/.pi/agent/docs/repo-branch-protection.md`。

## 中英双语 README 内容自动同步

凡项目同时存在中英双版 README（常见形态：英文 `README.md` + 中文 `README_cn.md`，以项目实际双版文件名为准），**两版内容必须时刻保持同步**：每次改动其中任何一版的**内容**（措辞、信息、列举项、口径、数字、结构），都必须在**同一轮改动里自动同步另一版**，**不需要问用户「要不要同步」**。

- **中文版为权威方向**：用户用中文打磨措辞，英文版跟随同步；用户直接改英文版的情况同理反向同步中文版。
- **为什么**：双语 README 是同一内容的两种语言表达，只改一版会让两版信息不一致，读者看到过期或矛盾的另一半；每次询问「要不要同步」是多余的反 confirm——同步是内容改动的固有部分，不是可选步骤。
- **怎么用**：改中文版某句 → 同一轮顺带改英文版对应句；改英文版 → 同步中文版。英文按英文习惯表达，**不必逐字直译**，但**语义内容必须对齐**——信息点、列举项、口径、数字一处不能少、不能多、不能变。语言固有差异允许：语序、地道表达按各自语言规范来（如中文「如……等」的非穷尽语义，英文 "such as" 一词已含，不必再叠 "etc."）。
- **边界**：本条管「内容」同步；两版**语言特有**的内容（如各自的语言切换链接——英文版跳中文版的链接文字统一为「简体中文」）不算内容差异，不受影响。仓库只有单语 README 的，本条不适用。
