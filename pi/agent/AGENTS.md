# User Preferences

## Language

- 默认使用**中文（简体中文）**输出，覆盖两类出口：**输出到会话的回复**与**写入磁盘的落盘文件**（文档、CHANGELOG、README、复盘、注释等凡 AI 生成的文字内容一律默认中文；文件名按「文件命名规范」另用英文命名）。除非用户明确要求使用其他语言（如用英语提问、明确要求用英语），或上下文明显需要用其他语言（如代码注释、英文原文引用），否则一律使用中文；用户用英语提问时视为陪练场景，按「用户英语陪练」规则用英语回答。本文件中「中文」二字默认即指**标准普通话 + 简体中文文字**。以下几条（普通话行文、排版、中文标点）约束中文输出——默认输出中文，故常态适用；用其他语言输出时按该语言的习惯表达。
- **用户英语陪练**：用户英语不算好，但正在努力学习、提升，会尽量用英语提问和交流。处理方式：① **意图不确定就先问**——用户用词或语法偏差导致看不清意图时，直接询问确认，不要凭猜测动手；② **及时纠正语言问题**——发现用户英语的用词、搭配、语法问题时，当场指出并给出更地道的说法（原句 → 建议写法，必要时简短说明原因）；纠错保持简短友好，不喧宾夺主，不让用户因英语不好而不敢用英语。
- 行文使用**标准、地道的普通话**，选用通用的规范词汇，避免生僻、生硬或带翻译腔的措辞，不使用少见词。
- **翻译场景的译法**：从其它语言**译入中文**（「中文」默认即指标准普通话和简体中文文字）时，必须采用**非直译的意译**——按中国人的阅读习惯和文化背景重新组织句子，不逐词逐句硬译，消除翻译腔；**译入英文**时，默认使用**标准且地道的美式英语**表达，同样不逐字硬译。用户明确指定其它目标变体或译法（如英式英语、明确要求直译）时，从其指定。
- 回复**排版工整**：标题层级清晰，列表规整，段落之间空行分隔，代码块与表格格式正确，便于阅读。
- 标点符号一律使用**简体中文标点**：逗号用「，」、句号用「。」、冒号用「：」、顿号用「、」、问号用「？」、感叹号用「！」，不要用英文标点（如 `,` `.` `:` `?` `!`）。中英文混排时，英文单词或数字与中文之间可留一个空格，但中文语句内部一律用中文标点。
- **币种符号：美元一律写 `US$` 或 `USD`，港币一律写 `HK$` 或 `HKD`，禁止用裸 `$`（2026-11-04 用户立）**：裸 `$` 既没表明是哪种货币、又容易被误读成港币，凡涉及金额就写完整符号——`US$1,234.56` / `USD 1,234.56` / `HK$9,876.54` / `HKD 9,876.54`。**适用范围**：所有对话回复、所有落盘文件（文档 / 复盘 / CHANGELOG / TODO / 脚本输出与注释）、所有金额与费率数字。**边界**：① 用户原文引用、外部原文（网页 / 报告 / 新闻 / 第三方文档）里的 `$` 不改，那是别人写的；② 代码里作为字符串内容的 `$`（shell 变量、正则、模板语法）不受限，本条管的是「展示给人看的金额」；③ 纯数学式子里的货币无关符号照旧。**工具强制**：脚本输出侧——`trading-agent` 的停盯总结 `CUR` 已改成 `US$`（金额前缀由常量统一控制，禁止在脚本里裸写 `$` 拼金额）。
- **缩写约定**：用户输入「**VSC**」即指 VSCode，输入「**VSCE**」即指 VSCode 扩展，输入「**GH**」即指 GitHub，输入「**QSAgent**」即指 quant-agent（Mark 的量化策略项目体系：主仓库 quant-agent + 子项目 Intraday、Swing、gridtrader，仓库结构详见子项目映射表），输入「**DTAgent**」即指 trading-agent（Victor 的日内交易盯盘项目）。缩写**大小写不敏感**——大小写同义（如「gh」= GitHub、命令位置的「vsc」= VSCode）。遇到这些缩写直接按此解读，无需确认；若某缩写在上下文中明显指别的含义（如命令位置的 `gh` 指 GitHub CLI、编译器语境的 `cc` 指 C 编译器），按上下文实际含义辨别。

## 输出风格

**总原则**：用规范的通用术语表达，不为了短而自创简写；语义清晰始终是底线（不为短牺牲语义，也不为凑字数啰嗦）。**默认用大白话把逻辑、前因后果解释清楚**（写入文件、复盘、一般对话都走这条）；**唯独「盯盘的对话输出」是特例**——要精简、高信息密度（盘面秒变，长篇解释会让用户收到时情况已变、结论失配）。

- **最终结论前先输出「==============」框线，与执行过程内容分隔**：回复里既有执行过程内容（读文件、跑命令、中间分析、逐项检测结果等）又有最终结论时，先把过程内容输出完，然后单独一行输出框线「==============」（14 个等号），紧接着输出最终结论内容——结论不混在过程里，让用户一眼定位结论在哪。回复本身只有结论、没有过程内容时不硬加框线。框线行单独成行、上下留空行（紧跟文字行会被 Markdown 渲染成标题线）。
- **汇报内容以当前用户给出的任务为主，其它事件一两句话带过（2026-10-17 用户立）**：汇报（含最终汇报与阶段性汇报）的主体必须是「用户当轮给出的任务」的进展与结果；其它程序触发的事件——自动巡检提醒（如 settle-repo-check）、文件变更通知、后台任务完成通知、跨会话（intercom / agent_call）消息、系统注入事件等——如需提及，一两句话带过、或完全不提，不得占用汇报主体、不得喧宾夺主。拿不准时先问「用户这轮让我干什么」——答不上来的内容不展开写。
- **写入文件（skill / rules / 文档）**：不考虑信息密度，用最标准的普通话大白话把逻辑解释清楚，宁可多用文字也要让人一遍读懂。
- **复盘、一般对话**：不追求精简，用大白话把事情说清楚，可以详细展开。
- **盯盘的对话输出（特例，唯一要精简的场景）**：结论直接给、信号直接发、不展开解释，但仍然要语义清晰、容易理解。
- **不要自创简写**（所有场景通用）：通用术语正常使用，但不为了短而自造缩略说法（例如把「买盘较多」压成「偏正」、把「继续上涨」压成「续涨」）。
- **逐条检测 / 核对类结果用 ✅ / ❌ 列表展示**（所有场景通用）：回复中凡是「多条检测项逐条判断是否通过 / 就绪」的结果（/commit 标配检测、敏感扫描、改完文件后的验证清单等）一律用列表逐条展示，**通过打 ✅、没通过打 ❌**（形如 `- ✅ License：已存在`），不要用表格、不要用整段文字罗列。不适用于盯盘实时信号输出和纯叙述性回复。
- **已授权事项不问第二遍（2026-10-29 用户立）**：凡是规则里已经写明「无需询问 / 不用问 / 直接做」的事，**执行时直接做**，不要用「要不要我……」「需要我……吗」「要我把……做好吗」这类问句结尾征求确认。用户原话：「这个能不能工具强制掉，不要总是给多余的询问」。清单（与 `~/.pi/agent/extensions/redundant-ask-guard.ts` 的 `AUTHORIZED_BRIEF` 保持一致）：① 全局能力层改动后发布 **agents-infra** 开源镜像 → `pi/agent` 在 macmini 上跑 `python3 ~/.pi/agent/patch/agents-infra-publish/publish.py`（本机会话用 `ssh mac-mini` 或 `macmini_run` 调用；脚本按 hostname 拒绝在 MacBook 上发布）；`dsh/` 在本机跑 `python3 ~/.pi/agent/patch/agents-infra-publish/publish_dsh.py`（权威源 `~/.dsh`，只在 MacBook 上跑）。不要问；macmini 不可用时先把本机改完，等它上线由脚本补发 pi 侧；② 工作区 / 暂存区有待提交内容 → 直接按 `/add` 或 `/commit` 流程处理（**被 add-mode / commit-mode 暂停的项目例外**，见「Git 写操作必须先征得同意」节的两个开关条目）；③ 其它 agent 项目仓库有待提交内容 → 直接 `agent_call` 对方按其 `/add` → `/commit` 处理；④ `/add` 预检完全干净 → 自动衔接 `/commit`，`/commit` 第 10 步命中发版条件 → 自动 bump / 发版；⑤ 新建项目 `git init`、向 `agents-registry` 追加新 agent 行 → 免确认。**仍应询问的**：方案分叉大、返工成本高、规则未覆盖、涉及不可逆破坏性操作。**工具强制**：`redundant-ask-guard.ts` 每轮把这份清单追加进系统提示（预防），并在回复里命中「询问句式 + 已授权关键词」时，把一条**只给 AI 看**的回执（`display: false`，用户界面不显示）注入下一轮上下文，内容指出问了哪一类、正确做法是什么（检测 + 自纠）。**不向用户弹任何提示**——用户 2026-10-29 补充：「不要让我看警告，这种事情定了规矩我就不想插手了，警告应该让当前会话看见」。

## 文件命名规范

凡新建文件（代码、文档、脚本、配置、缓存等一律适用），**文件名必须用英文命名**（ASCII 字符），**且必须用尽可能简单的名字**——简短、直接、不带冗余修饰词。

- **怎么用**：命名时先写出全名，再逐词检查每个词是否必要——纯修饰性、与上下文重复的词一律删掉，直到删无可删；**底线是不牺牲语义清晰**（压到看不出用途（如 `README.md` → `R.md`）就是过度简化，不允许）。
- **存量文件**：简化改名按同样规则处理，改名时同步更新所有引用处。

## 表述的逻辑严谨性（重中之重）

**逻辑严谨的优先级高于本文件所有「怎么说」的规则（精简、大白话、信息密度等）——冲突时先保逻辑严谨。** 结论以偏概全、外推不留边界、数学关系含糊、自相矛盾，说得再精简漂亮也是错的、会误导决策。具体要求：

- **经验教训总结的目的是泛化（提炼可复用规律），但泛化必须严谨、保证逻辑完备**：由特例外推普遍规律时，要理清特例与规律的关系和异同、明确适用条件与边界（什么情况成立、什么情况不成立），并多考虑一些情况验证完备性。错误不在「泛化」本身，而在「不加限定地全称外推」——比如从「这组止损参数下 SOXL 赔率低于 MU」直接跳到「杠杆让赔率降低」，既没说明适用条件、也没覆盖其他参数；正确做法是提炼「杠杆同时推大止盈和止损空间、赔率升降取决于两者放大倍数」，同时把「常见止损宽度下谁赔率高」标注为「取决于具体参数、需实算」。
- **数值结论必须实算，不许凭直觉断言**：涉及比较、比例、倍数、大小关系的结论，把具体数字代进去算一遍再下结论；算不清就改用不确定语气（「印象中……待核实」），不要硬给定律式断言。
- **数学关系要表述精确**：比如「分子分母同时放大」不等于「比值降低」——比值升降取决于两者放大倍数孰大（同倍不变 / 分子大则升 / 分母大则降）。含糊表述比不说更糟。
- **查证外部系统行为先找官方文档，本地实验只做补充验证**：要回答「某系统 / 服务 / 工具的行为规则是什么」（API 参数语义、档位映射、配置默认值、协议字段含义等），第一步查官方文档（权威承诺）；本地实验只是 n=1 单点观察（有噪声、可能随版本变化），文档查不到才做实验且结论要标注「本地实测、可能与未公开行为有出入」；文档与实验冲突以文档为准。边界：用户自己的代码 / 项目行为（无官方文档可言）靠读源码与实测，不受此限。

## 不主动进入 Plan 模式

接到任务（包括复杂、多文件、涉及架构的实现类任务）直接读代码、动手做，**不主动调用 `EnterPlanMode`**、不走「探索 → 给方案 → 等审批」流程。确实需要先对齐方向（方案分叉大、返工成本高）时，在**普通回复里用文字**说清楚「我打算这么做，理由是……」等用户回应，不切 plan 模式；用户主动说「先规划一下」时用文字给方案即可。边界：只约束主动行为，用户手动切换 plan 模式不受影响。

## Git 写操作必须先征得同意

- **未经用户明确同意，禁止执行任何会改动仓库的 git 命令**：`git add`、`git commit`、`git push`、`git rm`、`git mv`、`git reset`、`git revert`、`git rebase`、`git merge`、`git cherry-pick`、`git tag` 等。**每次执行前必须先列出：具体命令 + 影响的仓库 + 改动摘要，等用户点头再执行**——即便用户给了「开源到 GitHub」「提交一下」之类大方向指令也不能据此直接动手；授权不跨次复用，每次都重新确认。
- **不受限**：只读操作（`git status` / `git diff` / `git log` / `git show` / `git branch` / `git remote -v` 等）无需询问。
- **例外：用户主动触发的 `/commit`、`/bump`、`/release`、以及 `/add` 预检完全干净后的自动衔接即明确授权**，直接执行完整流程、无需再列命令确认（再问是多余的反 confirm）——`/commit` = 当次 `git commit` + `git push`（不执行 `git add`，只提交用户已自行 git add 暂存的内容；在非 main 分支上 push 后顺手建 PR——**remote main 的直推可用性视仓库实际保护状态而定、不全局默认锁定**：已开保护的仓库走 PR + CI 合并、未开的可直推 main（技能自动分流），现状与操作见 `~/.pi/agent/docs/repo-branch-protection.md`，详见 commit skill）；`/add` = 预检两段扫描（可疑内容块留工作区）+ 干净文件入暂存区（2026-09-22 起，见 add skill；触发来源含用户输入与 bump skill 改完版本号文件后的自动衔接——2026-10-02 起），**预检完全干净时授权自动延伸**：预检结果「至少 1 个文件加入暂存区 + 需人工过目 0 个 + 不建议入库 0 个」→ 直接衔接 commit skill 完整流程（`git commit` + `git push`，2026-10-01 用户立，减少二次介入；其第 10 步检测到未 bump 时会自动走 `/bump` → `/add` → `/commit` → `/release` 发版链，2026-10-02 起（2026-10-13 起：仅自最新 tag 含 fix / feat 类改动时触发；纯文档 / 杂事类不发版）；有需人工过目 / 不建议入库的文件时停在 add 阶段、不衔接）；`/bump` = 当次版本号 bump 改动 + **自动衔接 `/add` → `/commit` → `/release` 整条发版链**（2026-10-02 起；用户主动输入 `/bump` 或 commit skill 第 10 步自动衔接即预授权整条链，链条各环节安全阀——add 的人工过目清单、commit 的敏感扫描 / cache 检测、release 的异常暂停——照常生效）；`/release` = 当次 `git tag -a` + 推 tag + `gh release create` + **构建并上传构建产物**（**产物按项目声明为准**：项目规则 / 技能 / cache 明确声明要产物才构建上传，未声明则默认不带产物、不询问，也不因历史 assets 暂停——2026-10-04 立；构建需绕过工具限制时直接用打包工艺解决——临时中转 README、补 `--baseContentUrl` 等，不因「要不要产物」打断流程；tag 已存在、Release 已存在、工作区脏、CHANGELOG 缺条目等异常安全阀仍暂停询问）；**触发来源两种**（2026-10-02 修订；2026-10-13 修订自动来源门禁）：用户主动输入，或 **commit skill 流程末尾（第 10 步）的自动衔接**——`/commit` 完整成功且满足「在 main 与远端同步 + 工作区 / 暂存区干净 + 自最新 tag 有新提交**且含 fix / feat 类改动（核心功能修复 / 新增；2026-10-13 用户立：「只有 fix 和 feat 核心功能的修复和新增核心功能才触发发版」——纯文档 / 杂事类不发版、不 bump）**」时：版本就绪 → 自动进入发版流程；未就绪 → 自动先走 `/bump` → `/add` → `/commit` 链条补齐版本（不提示、不询问——用户 2026-10-02「不要提示我 bump」），就绪后自动发版；该自动衔接属用户立规时的预授权链路、无需二次确认，详见 commit skill 第 10 步。逐次确认规则针对的是 AI 自主发起的 git 写操作，不适用于用户主动触发的这些 skill。
- **常设授权：其它 agent 仓库有待提交内容 → 自动委派，不必询问用户（2026-10-04 用户立）**：凡「检查到或得知」某个 agent 项目的仓库有该提交却未提交的内容，**直接 `agent_call` 那个 agent、让它用自己的 `/add` → `/commit` 流程处理**，不要拿这个问题去问用户。详见「工作规则 · 会话间协作」节。
- **常设授权：工作区 / 暂存区有待提交内容 → 直接提交，不必再问（2026-10-04 用户立；2026-11-03 加分支限制）**：用户明确「**下次工作区或暂存区有待提交的内容就直接触发 /add 或者 /commit 提交，不用问我**」。即：凡发现有待提交内容（工作区有改动、或暂存区有未提交内容），**直接按 add skill / commit skill 流程执行**，不再逐次征得同意；**授权的是流程、不是跳过检查**——skill 自身的全部安全阀（gitleaks + AI 语义预检、敏感内容扫描、cache 检测、需人工过目即停在 add 阶段、发版异常暂停等）照常生效。
  - **⚠️ 仅限非 main 分支（2026-11-03 用户立；2026-11-05 改为「自动搬运」）**：**local main 只剩两个职责——① 生成 worktree、② 被 remote main 快进同步**，它不承载任何写操作。所以在 main 分支上**不直接触发 add / commit**（工具强制：`git-main-guard.ts` 已拦截 main 上的 `git add` / `git commit`）。
    - **main 工作区一出现改动就自动搬运（2026-11-05 用户立，所有 Agent 遵循）**：直接跑 `python3 ~/.pi/agent/patch/worktree-adopt/worktree-adopt.py --repo <主工作区>`——脚本自动建 worktree + 功能分支、逐路径把改动复制过去、**校验一致后才清理主工作区**（任何一步失败回滚，主工作区不动），然后把 `WORKTREE=` / `BRANCH=` 交给 add / commit skill，在那边走完预检 → 提交 → PR。**不询问、不汇报**，效果等于「原来在 main 上自动触发 /add 与 /commit」。工具强制：`main-wip-guard.ts` 在 `agent_settled` 发现「main + 有改动 + 暂存区空 + 两个模式开关都 auto」时自动给会话下发指令并触发新一轮。
    - 脚本拒绝执行时（暂存区有内容 / 冲突未解决 / add-mode 或 commit-mode 为 manual）就停下，不要绕过（暂存区红线、模式开关由用户控制）。
    - 唯一例外是用户当轮明确授权在 main 上直接操作（命令末尾加 `# AI_AUTHORIZED_ADD_MAIN` / `# AI_AUTHORIZED_COMMIT_MAIN`）。
- **自动 add 开关：add-mode（2026-10-31 用户立，工具强制）**：用户想先看**工作区相对暂存区**的改动（`git diff`）时，需要按项目暂停自动 add——否则 AI 一看到改动就放进暂存区、`git diff` 就空了。命令：`add-mode manual [路径]`（暂停自动 add）、`add-mode auto [路径]`（恢复）、`add-mode toggle`、`add-mode status [路径]`、`add-mode list`；用户可以在会话里直接说「把这个项目的 add 切成手动」，由 AI 执行（路径可显式指定，如 `add-mode manual ~/Developer/xxx`）。**暂停期间**：① AI 不主动走 `/add`、不执行 `git add`，改动原样留在工作区；② 只有用户当轮消息明确要求 add / 提交时才执行，且照常走 add skill 全流程与安全阀；③ 收尾巡检跳过该仓库。**粒度**：登记的是目录，该目录及其所有子目录（含子项目仓库）都生效；省略路径时默认取当前 git 仓库根。**main 分支恒为关闭、只能关闭（2026-11-04 用户立）**：目标目录停在 `main` / `master` 时，`add-mode status` 恒显示「已关闭（main 分支强制关闭）」，`add-mode auto` 在 main 上不生效（条目可被移除，但状态仍是关闭）——与 `git-main-guard` 在 main 上硬拦 `git add` 同一套口径；**只有非 main 分支 / worktree** 上才可能处于开启状态（新建 worktree 默认开启，除非其目录被某条 manual 条目覆盖）。**边界**：开关由用户决定，AI 不得自行切换。**工具强制**：`~/.pi/agent/extensions/add-mode-guard.ts`（系统提示注入 + 用户无要求时硬拦 `git add`），`redundant-ask-guard.ts` / `settle-repo-check.ts` 读状态联动；命令与说明在 `~/.pi/agent/patch/add-mode/`，状态文件 `~/.pi/agent/state/add-mode.json`。**输入框斜杠命令（用户入口）**：用户可直接在 pi 输入框敲 `/manual-add` / `/auto-add` / `/add-mode`（扩展注册的真命令，直接执行、不经模型）；这三个只是用户入口，**AI 不调用斜杠命令**（工具列表里没有），AI 侧改开关一律走 shell 命令 `add-mode ...`，且只有用户明确要求时才切。
- **自动 commit 开关：commit-mode（2026-10-31 用户立，工具强制）**：用户想先看**暂存区相对 HEAD** 的改动（`git diff --cached`）或不想让 AI 自己提交时，按项目暂停自动 commit。命令：`commit-mode manual [路径]`（暂停自动 commit）、`commit-mode auto [路径]`（恢复）、`commit-mode toggle`、`commit-mode status [路径]`、`commit-mode list`；会话里说「把这个项目的 commit 切成手动」也可。**暂停期间**：① AI 不主动走 `/commit`、`/bump`、`/release`，不执行 `git commit`；② 即使 add skill 预检完全干净、准备自动衔接提交，也停下（只 add、不提交）；③ 只有用户当轮消息明确要求提交时才执行，且照常走 commit skill 全流程与安全阀；④ 收尾巡检跳过该仓库。**main 分支恒为关闭、只能关闭（2026-11-04 用户立）**：目标目录停在 `main` / `master` 时，`commit-mode status` 恒显示「已关闭（main 分支强制关闭）」，`commit-mode auto` 在 main 上不生效（条目可被移除，但状态仍是关闭）——与 `git-main-guard` 在 main 上硬拦 `git commit` 同一套口径；**只有非 main 分支 / worktree** 上才可能处于开启状态（新建 worktree 默认开启，除非其目录被某条 manual 条目覆盖）。粒度、边界同上。**工具强制**：`~/.pi/agent/extensions/commit-mode-guard.ts`（系统提示注入 + 用户无要求时硬拦 `git commit`），`redundant-ask-guard.ts` / `settle-repo-check.ts` 读状态联动；命令与说明在 `~/.pi/agent/patch/commit-mode/`，状态文件 `~/.pi/agent/state/commit-mode.json`。**输入框斜杠命令（用户入口）**：用户可直接在 pi 输入框敲 `/manual-commit` / `/auto-commit` / `/commit-mode`（扩展注册的真命令，直接执行、不经模型）；这三个只是用户入口，**AI 不调用斜杠命令**（工具列表里没有），AI 侧改开关一律走 shell 命令 `commit-mode ...`，且只有用户明确要求时才切。
- **两个开关完全独立，是两个功能**：不同命令（`add-mode` / `commit-mode`）、不同状态文件（`state/add-mode.json` / `state/commit-mode.json`）、不同扩展文件（`add-mode-guard.ts` / `commit-mode-guard.ts`），互不引用对方的代码与状态——改一个不影响另一个，两者可以按任意组合开关。两个都关时最彻底（AI 完全不动暂存区与提交）。两个状态文件都在 macmini 镜像排除的 `state/` 里，两机各管各的。
- **新建项目 `git init` 免确认**：新建项目默认直接 `git init` 本地初始化（不建远程仓库、不 push）；其后的 add / commit / push / 建远程 / 打 tag 仍需先确认或由 `/commit`、`/release` 触发。

## 开发流程：worktree + PR（团队项目锁死 remote main，2026-11-02 用户立）

**适用范围**：所有**智能体团队项目**——每个 Agent 项目本身 + 其名下全部子项目仓库（清单以 `~/.pi/agent/docs/agents-registry.md` 的「子项目映射」表为权威）。这些仓库的 remote main 一律锁死，**不允许从本地 main 直接 push 到 remote main**。

**铁律（按顺序执行）**：

1. **开工先建 worktree（2026-11-03 强化：任何项目里的任何写操作，第一步就是生成 worktree）**：任何任务（含文档、杂事）动代码前，先在主仓库同级建独立 worktree + 功能分支（`git worktree add ../<仓库名>-<事项> -b <分支名>`），**改动只在 worktree 的分支上做**；不在主工作区里改、不在 main 上改。目的：避免同一工作区被多个会话同时写而互相污染（2026-11-02 用户立规的直接起因）。
   - **worktree 目录名必须「本仓库名 + 事项」（2026-11-09 用户立，工具强制）**：格式 `<仓库名>-<事项>`，例如 `~/Developer/turn-diff-fix-empty-diff`、`~/Developer/cmux-double-paste`、`~/Developer/dev-agent-rename-subproject`。**禁止用「其它项目名 / Agent 项目名 + 子项目名」拼**——像 `~/Developer/dev-agent-turn-diff` 这种名字，用户一眼看不出它到底是 turn-diff 子项目的 worktree、还是 dev-agent 主仓库的分支（它是后者），在文件系统里失去归属感。两条硬判据：① 名字里的**第一个项目名必须是本仓库名**；② **事项 slug 不许恰好等于另一个项目 / 子项目的名字**（`dev-agent-turn-diff` 这种「事项撞上子项目名」的形态同样禁止，改成 `dev-agent-rename-subproject` 这类能看出在做什么的写法）。**子项目的工作就在子项目仓库的 worktree 里做**：`git -C ~/Developer/<子项目> worktree add ~/Developer/<子项目>-<事项> -b <分支>`，不要跑到 Agent 项目仓库里给子项目建 worktree。工具强制：`worktree-name-guard.ts` 拦截违规的 `git worktree add` / `git worktree move`。
   - **漏了这一步也不留尾巴（2026-11-05 用户立）**：main 工作区上已经冒出改动时，不用问、不用汇报——直接 `worktree-adopt.py` 把改动搬进新 worktree（见「Git 写操作」节的自动搬运条），再走 add / commit。
   - **local main 只剩两个职责（2026-11-03 用户立）**：① **生成 worktree**；② **被 remote main 快进同步**（`git merge --ff-only origin/main`）。除此之外 main 上**不做任何写操作**——不改文件、不 `git add`、不 `git commit`。工具强制：`git-main-guard.ts` 对 main 分支上的 `git add` / `git commit` 一律拦截；add / commit skill 的**自动触发在 main 上被禁用**（只在非 main 分支自动触发）。
   - **⚠️ worktree 内跑 git 一律用 `git -C <worktree 绝对路径> <子命令>`，不要写 `cd <worktree> && git ...`（2026-11-03 立）**：`git-main-guard.ts` 判断「在哪个仓库 / 哪个分支」时只认两种来源——命令里显式的 `-C` 参数、进程的当前工作目录（pi 会话 cwd）；**它不跟踪命令里的 `cd`**。而会话 cwd 通常停在主仓库（main 分支），所以 `cd ../xxx-worktree && git commit` 会被误判成「在 main 上提交」而拦截。写成 `git -C /abs/path/to/worktree commit ...` 即可正确识别分支。**被误拦时不要加 `# AI_AUTHORIZED_COMMIT_MAIN` 绕过**——那个标记只用于用户当轮明确授权、不能用来自行为误判开逃生门；正确动作是改用 `-C` 指定 worktree 路径。
   - **⚠️ worktree 是任务的正常战场，不是被限制对象（2026-11-04 用户立）**：用户的常规工作流是「在 main 分支的主工作区开 pi 会话 → 会话里让 AI 建 worktree → 任务全程在 worktree 里完成并提交」——他本人不会去 worktree 里操作。所以 add / commit skill 的「自动触发限制」**只针对主工作区的 main 分支**，worktree 的功能分支（`feat/` / `fix/` / `chore/`）**照常自动触发、自动衔接**。判断「有没有待提交内容」必须用 `git -C <worktree> status --porcelain`——worktree 与主工作区的工作区 / 暂存区互相独立，只看主工作区的 status 会得出「无改动」的错误结论。本地 main 的对齐与发版在主工作区执行（worktree 里 `git switch main` / `git fetch origin main:main` / `git branch -f main` 全部 fatal）；`gh` 命令不受 `-C` 限制，用 `cd <worktree> && gh ...` 或 `-R <owner/repo>`。
2. **一切改动走 PR**：worktree 分支 → push → 开 PR（目标 main）→ CI 门禁 → auto-merge（squash）→ remote main → 本地 main 用 `--ff-only` 同步。**本地 main 只用于同步，不产生提交、不直接推送**。
3. **main 保护是仓库层的硬约束**：PR 必过、required check、分支最新（strict）、线性历史、只允许 squash、禁 force push、禁删除、管理员同样受限。
   - **新建仓库一律必须 strict 模式的 PR CI（2026-11-03 用户立，适用范围为新建立的项目仓库）**：新仓库（新建 Agent 项目、新建子项目、任何新入队的团队仓库）上线时必须同时具备三件套——① 至少一个**在 PR 上会真实跑的** CI 检查（确实没有测试可跑的项目也要补一个最轻量的检查，如 lint / 语法检查 / 构建；**不存在「没 CI 就豁免」的例外**）；② 该检查**挂成 required status check**（CI 跑了但不拦合并等于没门禁）；③ `required_status_checks.strict = true`（要求分支最新）。一键配置与全量审计脚本见 `~/.pi/agent/patch/branch-protection/`。
   - **为什么 strict 是必须的**：非 strict 时，PR B 可以拿「旧 main」上通过的 CI 直接合并——PR A 刚合进 main 的新测试从未在 B 上跑过，回归防护网就漏了。strict 保证每个 PR 的 CI 都跑在「最新 main + 该 PR」的合并结果上，此前所有已合并 PR 的测试自动成为后来者的防护网。
   - **存量已全部补齐（2026-11-03 同日，用户追加要求「28 个不合规的仓库也统一执行最新标准」）**：全团队 37 个仓库（18 个 Agent 项目 + 19 个子项目）已 100% 合规——其中 26 个仓库补了统一的 `validate` 检查（仓库卫生 + 语法检查，加一份 `.github/workflows/validate.yml` + `.github/scripts/validate.py`），2 个已有 CI 的直接挂上现有检查。新建仓库照本条执行；随时可用 `~/.pi/agent/patch/branch-protection/branch-protection.sh audit` 核对。
4. **分支命名**：`feat/<功能>`、`fix/<缺陷>`、`chore/<事项>`，一个分支只做一件事。
5. **pi-team 仓库必须是 public（2026-11-02 用户立；2026-11-11 明确只管辖 pi-team）**：**pi-team（开源团队）**的项目（Agent 项目 + 子项目）一律用公开仓库；**私有仓库不得作为 pi-team 项目**。**闭源 / 私有项目归 dsh-team**（2026-11-11 用户立的独立团队，规则在 `~/.dsh/AGENTS.md`），**不在本文件管辖**——遇到 dsh-team 的私有仓库不要探测、不要登记、不要改可见性、不要试图转为 public。pi-team 范围内发现私有仓库时：先做敏感信息检查（gitleaks 全历史 + AI 语义扫描——密钥 / 凭证 / 个人隐私 / 第三方个人信息 / 财务状况），**干净就直接改为 public 并补 main 保护**；含敏感信息的不入队（移出团队名册，或个人留存，不上服务端锁——GitHub 免费版对私有仓库也不提供分支保护，服务端只能靠本地 `git-main-guard.ts` 兑现）。

**边界与例外**：

- 用户当轮明确要求直推 main（极少见，如仓库保护尚未就绪的一次性初始化）时，命令末尾加 `# AI_AUTHORIZED_PUSH_MAIN`，并在汇报里写明原因；**授权不跨次复用**，不得自行添加标记。
- 非团队仓库（临时脚本目录、一次性试验仓库、无远程仓库）不受本条限制，但仍受「Git 写操作必须先征得同意」约束。
- 新建项目的 `git init` 与首次建远程不受本条限制（那时还没有 remote main 可锁）。

**配套工具强制**：`~/.pi/agent/extensions/git-main-guard.ts`——拦截两类操作：① `git push` 的 refspec 指向 `main` / `master`（含裸 `git push`、`git push origin`、`HEAD:main` 等形态）；② 在 `main` / `master` 分支上的 `git commit`（含 `git -C <path>` 形态）。仅对带 GitHub remote 的仓库生效，逃生标记分别为 `# AI_AUTHORIZED_PUSH_MAIN` / `# AI_AUTHORIZED_COMMIT_MAIN`，仅限用户当轮授权。`~/.pi/agent/extensions/worktree-name-guard.ts`——拦截违反 worktree 命名规则的 `git worktree add` / `git worktree move`（前缀不是本仓库名、或事项名撞上另一个项目名），逃生标记 `# AI_AUTHORIZED_WORKTREE_NAME`（仅限用户当轮授权）。

**详细开发循环**（Issue 先行、测试先行、CI 门禁、发版链）见 `~/.pi/agent/skills/dev-workflow/SKILL.md`；团队仓库保护现状与批量配置方法见 `~/.pi/agent/docs/repo-branch-protection.md`。

## Git 暂存区禁止 AI 自主增删改（硬性规定）

AI 对 git 暂存区（staging area / index）**自主能做的只有只读查询**（`git status`、`git diff --cached`、`git log`、`git ls-files`、`git stash list` 等）。此外两层铁律：

1. **commit 需用户明确授权（2026-09-21 修订：不论哪个分支、哪个 worktree、哪条流程，commit 动作一律须用户明确授权）**，明确授权仅五种形式：① 用户主动发起 `/commit`；② 用户当轮消息明确授权 commit（如明确说「授权 commit」「这个 commit 可以提交」——AI 主动列命令后用户点头不算明确授权）；③ `/add` 预检完全干净后的自动衔接（2026-10-01 用户立：预检结果「至少 1 个文件加入暂存区 + 需人工过目 0 个 + 不建议入库 0 个」时，当次 `/add` 的授权自动延伸到 `git commit` + `git push`，由 add skill 直接进入 commit skill 完整流程——含其第 10 步的自动发版链（未 bump 时自动 `/bump` → `/add` → `/commit` → `/release`），2026-10-02 起（2026-10-13 起：仅自最新 tag 含 fix / feat 类改动时触发；纯文档 / 杂事类不发版）；`/add` 的来源含用户输入与 bump skill 自动衔接）；④ **跨会话委派**（2026-10-04 用户立）：其它 agent 发现本仓库有待提交内容时，可 `agent_call` 本会话、由本会话按自身 skill 流程（`/add` → `/commit`）提交——用户原话「每次检查到或者得知其它 Agent 的仓库有需要 commit 的内容就自动 call 这个 agent 使用 /add skill 或 /commit skill 处理一下，不要每次都问我」）。口头泛指令「提交一下」「commit 吧」不算**单次**明确授权（但仍受下条常设授权约束）；⑤ **常设授权（2026-10-04 用户立）**：工作区 / 暂存区有待提交内容即**直接按 skill 流程提交**，无需逐次询问（用户原话「下次工作区或暂存区有待提交的内容就直接触发 /add 或者 /commit 提交，不用问我」——授权的是流程，敏感扫描 / 人工过目等安全阀照常生效）。，不得执行。已配套工具强制：git-commit-guard（pi 端 `~/.pi/agent/extensions/git-commit-guard.ts`）对无 `# AI_AUTHORIZED_COMMIT` 标记的 `git commit` 一律 deny；标记只在上述五种明确授权场景使用（`/commit` skill 的串联命令、用户当轮明确授权后、`/add` 预检完全干净后的自动衔接命令、跨会话委派命令、常设授权下的自动提交），其余场景一律不带。commit 后暂存区清空是固有行为，不算对暂存区的增删改。
2. **对暂存区的删、改（含移动）一律禁止，无论是否授权**：删 = `git rm --cached` / `git reset HEAD <file>` / `git restore --staged <file>` / 影响暂存区的 reset（`--hard` / `--mixed` / 默认）；改 / 移动 = `git mv` 及任何会改变暂存区现有内容的命令。即便用户授权了某次 git 操作，只要它改动暂存区已有内容仍禁止——暂存区已有内容完全由用户把关。
3. **git add（暂存区「增」）经 add skill 授权例外放行（2026-09-22 修订，原为「无论是否授权一律禁止」）**：用户触发 `/add`（或当轮明确要求 add）= 授权当次执行 add skill 的预检分流——gitleaks 工具扫描 + AI 语义扫描双层预检，干净的文件由 AI 执行 `git add` 加入暂存区，可疑 / 高风险文件留在工作区输出人工过目清单；bump skill 改完版本号文件后的自动衔接同此授权（2026-10-02 起）；用户口头确认「没问题，add」= 当轮授权 add 对应文件。授权范围仅限「预检通过的干净文件 + 用户确认过的文件」，且 add skill 对暂存区已有内容**只增不改**（不动第 2 条红线）。背景：原「暂存区完全由用户亲自 git add 把关」升级为「工具确定性扫描 + AI 语义扫描双引擎预检 + 可疑项人工确认」，把关方式升级而非取消。

边界：工作区普通文件操作（`mv`、`rm`、编辑文件，不经 git）不受本条限制；`git reset --soft` 不动暂存区，但仍属改历史类、受「Git 写操作先征得同意」约束。

## 敏感信息禁止写入未被 .gitignore 忽略的文件（硬性规定）

任何敏感信息——券商 / 银行账户号、API key、token、密码、私钥、数据库连接串、个人隐私标识、**个人 / 公司 / 组织的财务状况**（收入目标与实际收入、本金、资产、负债、存款、财务紧迫程度、职业投入状态等描述性信息）等——**一律不得写入任何未被 `.gitignore` 忽略的文件**（即会被 git 跟踪、可能进仓库的文件），无论文件类型（代码、文档、CHANGELOG、TODO、skill 正文、README、复盘等）、无论是否已提交。

- **怎么用**：写任何文件前先判断「会被 git 跟踪吗」→ 会则敏感信息一律用占位符（`<HK_PAPER_ACCOUNT>`、`<API_KEY>`）或「真实值见本机配置」代替，真实值只写进被忽略的本机文件（配置、环境变量、secrets）。记录类文档描述敏感过程只写「17 位模拟账户号」这类表述，不带数字本身。拿不准是否敏感 → 按敏感处理。
- **财务状况类没有占位符可用，处理方式是整体不写**：文档里写「为什么做某事」只陈述业务目标与方法论，不写收入目标、本金状况、财务紧迫性、投入状态等财务背景；确需记录写入被忽略的本机文档。
- **`/commit` 的敏感内容扫描只是最后一道防线，不是第一道**——正确姿势是写的时候就不写。敏感信息一旦进 git 历史就是永久明文，曾有两次真实事故：账户号明文写进公开仓库文档靠扫描才发现；财务状况描述进开源仓库被迫 `git filter-repo` 重写全部历史 + force push 才清除。
- 边界：已被 `.gitignore` 忽略的本机文件（密钥、配置、env 等）不受限。

## 「发布」「最新版」默认指 GitHub Release

用户提到「发布」「发版」「最新版」「升级到最新版」等且**未指明渠道**时，**默认指 GitHub Release**（tag + Release 及其 vsix / 二进制等产物），不是 VSCode Marketplace、也不是 Open VSX。**适用范围只限用户自己的项目**（目前只发 GitHub Release）；别人的项目按其实际发布渠道（Marketplace / Open VSX / 官网）判断，不默认往 GitHub Release 靠。用户明确指定渠道时按指定的来。升级已安装扩展：`gh release view -R <owner>/<repo>` 看最新 tag 与 assets → 下载 vsix → `code --install-extension <vsix> --force`。**注（2026-11-09）：VSCode 已退役，这条升级路径只在用户明确要求维护 VSCode 扩展时走；团队日常环境是 cmux，见「工作环境：cmux 优先，VSCode 退役」节。**

## 提交必须走 commit skill（禁止裸 git commit，2026-11-11 用户立）

**`git commit` 只能由 `/commit` 流程发出，禁止在 bash 里手写裸 commit。** 原因不是形式主义：commit skill 在提交前要做两门检测——**敏感内容扫描**（gitleaks 确定性扫描 + AI 语义扫描：财务状况、个人隐私标识、敏感叙述）与 **cache 检测**；手写裸 commit 直接跳过这两门，等于把安全阀绕开。2026-11-11 当天就绕过三轮（拆文章、登记子项目、补规则各一次），其中一轮因此漏了发版、靠 `settle-repo-check` 事后兜底才发现——漏发版只是可见的后果，**漏掉敏感扫描的后果是永久的**（一旦进 git 历史就只能重写全部历史 + force push）。

- **正确姿势**：`/commit`（用户主动触发，或 `/add` 预检完全干净后的自动衔接）。流程内 commit 与 push 用 `&&` 串成一条，带 `# AI_AUTHORIZED_COMMIT` 标记。
- **授权不免检**：用户当轮说「提交吧」也不构成跳过 skill 的理由——授权解决的是「能不能提交」，skill 解决的是「该不该提交」（扫描结果可能让这次提交不该发生）。两者都要过。
- **工具强制**：`extensions/git-commit-guard.ts` 放行前查 `state/commit-gate.json` 这张闸门。闸门只由 `/commit` 流程用 `python3 ~/.pi/agent/patch/commit-gate/gate.py begin` 打开（默认 30 分钟），流程结束 / 失败 / 命中检测终止 / 用户中断都要 `gate.py end` 关上；裸 commit 会被直接拒，报错信息里给出开闸与关闸命令。
- **边界**：本条只管「用什么流程提交」，不改变下方授权与暂存区规则；`~/.pi/agent` 这类不是 git 仓库的目录、以及脚本自己内部执行的 git 操作（如 agents-infra 发布脚本、`worktree-adopt.py`）不受影响。

## commit skill 的触发与终止

- **触发来源两种（2026-10-01 修订）**：① 用户当前 `/commit` 指令——只看当前消息、不看历史（历史消息里的 `/commit` 不触发续跑或重跑）；当前消息字面含 `/commit` 仍要先理解意图——讨论 / 举例 / 引用不算，只有「用户当下明确要执行提交」才走流程；② add skill 预检完全干净后的自动衔接（2026-10-01 用户立）——本次 `/add` 预检结果「至少 1 个文件加入暂存区 + 需人工过目 0 个 + 不建议入库 0 个」时，由 add skill 直接进入本流程。除这两种来源外不得触发（不自发、不续跑、不自动进入）。
- **命中即彻底终止，不暂停续跑**：流程中一旦命中敏感内容扫描或 cache 检测，立即终止（不 commit / push），不存在「暂停 → 续跑」；要再次提交须重新触发（用户重新输入 `/commit`，或重新 `/add` 并预检完全干净）从头走完整流程。

## 项目许可证与版权声明（2026-11-08 用户立，全队强制）

**许可证按项目性质二选一，没有第三种，也不允许「无法确定就随便挑一个」**：

| 项目性质 | 许可证 |
|---|---|
| **软件项目**（含全部 agent 项目） | **MIT** |
| **非软件项目** | **CC BY 4.0** |

### 判据是「谁消费它」，不是文件后缀

这条口径是 2026-11-08 讨论后确立的，看的是产物的**功能性**而不是它的格式：

- 一段内容被**程序**消费、直接改变程序行为 —— 是软件。典型例子：源码、脚本、配置、扩展，以及 **agent 规则文件**（`AGENTS.md`、`.pi/` 下的 skills / prompts / extensions）。判断方法：删掉它或改写它，程序行为会不会变？会 → 软件。`AGENTS.md` 虽然也是 `.md`，但它是加载进 LLM 上下文、约束 agent 行为的指令，与源码等价——**同类的 `tsconfig.json`、`Dockerfile`、`Makefile` 全是纯文本，从来没有人说它们不是软件**。
- 一段内容被**人**消费、以阅读为目的 —— 不是软件。典型例子：书籍、文章、教程、手记、随笔。
- **拿不准 → 暂停新建、直接问用户**，不得自行推断后动手。许可证一旦写进 git 历史就长期存在，选错的返工成本远高于问一句。

**为什么软件不用 CC、文档不用 MIT**（两个方向都有硬理由）：

- Creative Commons 官方**不建议**将 CC 许可证用于软件：CC 许可不含专利授权条款、无源码分发要求、与现有软件许可证组合时兼容性复杂。拿 CC 覆盖软件项目是违背许可方自己的指引。
- MIT 原文授权对象是 `this software and associated documentation files`，对纯文字作品是「用语错位」；而且 MIT 只强制「保留声明」、不强制「以指定方式署名」，拿不到文字作品最在意的「转载注明出处」。

### 版权声明行格式（两种许可证一致）

```
Copyright (c) <起始年份>[-<最新年份>] xhqing and contributors
```

四条规则，每条都有理由，不要自行改写：

1. **主体写 `xhqing`（GitHub 用户名），不写真名**。笔名在法律上与真名效力相同（《著作权法》第十条署名权允许署笔名），而 handle 唯一性更强、可通过账号控制权自证、且写进公开历史后不暴露真实身份。真名只在「作品自愿登记」与「诉讼」这两个场景下于官方系统内使用，**不进仓库**——真名一旦提交进 git 历史就是永久明文，清除只能重写全部历史 + force push。
2. **必须带 `and contributors`**（2026-11-09 用户立，取代 2026-11-08 的「不写 `and contributors`」）。用户明确希望项目尽可能多地吸引外部贡献，这个写法向潜在贡献者释放一个明确信号：项目欢迎贡献、且承认贡献者的权利。它**不构成著作权转让**——只是对「存在多元权利主体」的承认，与下方 CONTRIBUTING 约定（贡献者保留著作权）一致；先把主体 `xhqing` 写在前，则即使 future 贡献者身份未定，声明仍能落到一个具体的法律主体上。
3. **不写个人主页链接**（2026-11-09 用户立，取代 2026-11-08 的「尖括号内放主页 URI」）。版权行保持简洁；可追溯信息由仓库 URL 与 git 提交历史承担（提交记录带时间戳、不可伪造，取证能力不依赖这行链接）。
4. **禁止再用 `All Contributors`**（2026-11-08 起废弃，现行仍有效）。它与 `xhqing and contributors` 的区别在于**有没有可以落地的法律主体**：`xhqing and contributors` 以真实个人为先导主体，能落进《最高人民法院关于审理著作权民事纠纷案件适用法律若干问题的解释》（法释〔2002〕31 号）第七条所称「署名的自然人」，拿到「署名即视为权利人」的举证推定；而 `All Contributors` 是纯集合、无主体，落不进上述主体范围，且不含任何可追溯标识。两者看着像，法律效果差很多，**不要混淆、不要图省事用旧的**。

### 贡献者版权与许可（CONTRIBUTING 文件，2026-11-09 用户立）

每个项目**必须有两个文件**：`CONTRIBUTING.md`（英文）与 `CONTRIBUTING_cn.md`（中文），写清两件事：

1. **贡献者的版权归贡献者本人**——提交 PR 不会把著作权转让给项目或维护者（《著作权法》第二十七条：转让著作权须订立书面合同，提交 PR 不构成转让；署名权作为人身权本就不可转让）。
2. **贡献默认按项目许可证授权**——提交 PR 即视为同意以项目自身许可证（软件项目 MIT / 非软件项目 CC BY 4.0）授权本项目使用、修改、再分发其贡献。

两条缺一不可：只写第 1 条，项目拿不到合法的分发许可（版权行声称 `and contributors`，但你没被授权用他的代码）；只写第 2 条，贡献者会担心权利被拿走，反而降低贡献意愿。

**为什么必须有**：版权行改成 `xhqing and contributors` 之后，如果不把「贡献者保留著作权 + 贡献按 MIT/CC BY 授权」写清楚，就会出现「声明说有多元权利主体、但没人知道各自是什么权利」的空档——这既是对贡献者不诚实，也给项目埋下权利瑕疵。这两份文件就是把话说清楚的地方。

**模板位置**：`~/.pi/agent/patch/contributing-template/`（`CONTRIBUTING.md` / `CONTRIBUTING_cn.md`）。模板正文含占位符 `{{LICENSE_NAME}}`，**拷过去后必须按项目根 `LICENSE.md` 的实际许可证名称替换**（映射表见该目录的 `README.md`）——**不要假设项目是 MIT**（2026-11-09 踩过：一个批量脚本硬编码 MIT，把 `cmux` 的 GPL-3.0-or-later 和 `ToolCallingRules` 的 PolyForm Noncommercial 都写成了 MIT）。认不出的许可证**暂停问用户**，不得猜。新建项目直接拷模板（不要重新编），存量项目在迁移版权行时一并补上。

### 两种许可证的文件怎么写

- **MIT 项目**：`LICENSE.md` 放标准 MIT 全文（版权行换用上面格式），不手写、不改条款正文。
- **CC BY 4.0 项目**：`LICENSE.md` **只放官方 `https://creativecommons.org/licenses/by/4.0/legalcode.txt` 全文，原样照收、一字不加**——GitHub 的许可证识别（licensee）只在文件是**零追加的纯官方文本**时才认得出 CC BY 4.0；加了版权行或说明段落就变成「Other / NOASSERTION」（2026-11-11 实测三版对照：版权行放顶部 → Other；版权行改到全文末尾 → 仍 Other；纯全文 → `cc-by-4.0` ✅；对照 `microsoft/autogen` 与 `EbookFoundation/free-programming-books` 两个仓库，也都是纯全文）。**所以版权声明行与许可要点、署名要求写进 `README.md` / `README_cn.md` 的版权段**（那里本来就要求有版权与署名段，由 commit skill 第 9a 步保证），不在 `LICENSE.md` 里重复。**放全文而不是只放链接**——只写一句「详见链接」同样识别失败。

### fork / copy 项目的版权与许可（2026-11-09 用户立）

**分两层处理，两层的版权与许可证各自独立**：

| 代码来源 | 版权 | 许可证 |
|---|---|---|
| **原仓库的代码**（fork 基线、copy 进来的片段） | 保留原仓库的版权声明与作者署名 | **按原仓库的许可证执行**，不得替换或弱化 |
| **我们自己后续写的代码** | `xhqing and contributors` | 见下方「许可证继承」——宽松上游用 MIT / CC BY 4.0，不兼容的上游则随上游 |

**许可证继承（2026-11-09 用户明确：不兼容的上游许可按上游执行，不需要逐次确认）**：

| 原仓库许可证 | 我们新代码怎么授权 |
|---|---|
| MIT / BSD / Apache-2.0（宽松，与 MIT / CC BY 4.0 兼容） | 用 MIT（非软件项目用 CC BY 4.0）；Apache-2.0 记得保留其 `NOTICE` 与修改声明 |
| GPL-2.0 / GPL-3.0 / AGPL | **整体按 GPL 系授权**——衍生作品就是 GPL，我们的新代码一并 GPL |
| LGPL | **按 LGPL 执行**——修改过的 LGPL 代码部分继续 LGPL，其余部分按 LGPL 允许的方式处理 |
| MPL-2.0 | **按 MPL 执行**——被修改的文件保持 MPL，新增文件按 MPL 允许的方式授权 |
| 无许可证 / 保留所有权利 | **不能复制、不能公开分发**——没有许可就是没有授权，这条不是「按上游执行」能解决的 |

**一句话原则**：上游许可证与 MIT / CC BY 4.0 兼容就用 MIT / CC BY 4.0；不兼容就**原样继承上游许可证**，不降级、不替换、不额外询问。**「全队软件项目一律 MIT」这条只适用于自研项目——fork 项目的许可证由上游决定，这是那条规则的例外。**

**具体做法**：

1. **LICENSE 文件保留原许可证，在下面追加我们的版权行**——不是替换。以 ghostty / pi-harness 为例：

```
Copyright (c) 2024 Mitchell Hashimoto, Ghostty contributors (original Ghostty project)
Copyright (c) 2026 xhqing and contributors (xhqing/ghostty fork)
```

原版权行一字不改——MIT 的 `The above copyright notice … shall be included in all copies` 就是这个义务，删了或改成自己的名字就直接违约。

2. **兼容性判断后直接执行，不再暂停询问**——按上方「许可证继承」表定该用什么许可证，定完就写、不必回头问用户。只有一种情况要停：**上游根本没有许可证**（没有授权就无法分发，这不是选择问题）。

3. **README 里说明分层**——让读者清楚哪部分是谁的：

```markdown
## 关于本仓库
本项目是 <原项目名> 的 fork。上游代码保留原版权与许可（见 `LICENSE.md`）；
本仓库在此基础上的修改与新增代码由 xhqing and contributors 维护，
同样以 <项目许可证> 授权。
```

4. **`COPYING` / `NOTICE` / 上游版权文件**（若原仓库有）原样保留，不删不改不合并。

5. **贡献者的代码同样分两层**：外部贡献者提交的新代码，按 CONTRIBUTING 约定（版权归贡献者、按项目许可证授权）；若他修改的是上游代码，仍受上游许可证约束。

**为什么这条重要**：fork 项目最常见的两类法律事故——① 把自己的许可证覆盖到上游代码上（直接违反上游许可、同时让自己失去合法使用权）；② 上游的著佐权传染了自己新写的代码却不自知（GPL 场景下公开分发却标成 MIT，即违约）。两类都靠「先看上游许可证、该继承就继承」避免。

### 存量项目

存量项目的**版权行写法**不强制一次性全改，按批次迁移——每个仓库走自己的 worktree + PR + CI 流程，不要用脚本跨仓库直推 main。

**但许可证类型必须按性质核，不因「建得早」而豁免（2026-11-11 修订，起因 blog 事故）**：2026-11-08 之前建的项目**不是**「本就都是 MIT、正确」——当时那条表述把「存量」误当成了「都是软件」，于是文章型项目 blog（2021 年建、主体是博客文章）一直挂着 MIT 无人发现，直到 2026-11-11 被用户当场指出。正确口径：**性质决定类型，建得早不改变性质**——内容型存量项目（文章、书籍、博客、教程）就该改成 CC BY 4.0，改动面与新建时一致（`LICENSE.md` 换全文 + 徽章 + 版权段 + 两份 CONTRIBUTING + CHANGELOG + patch 版本发版）。

**工具强制（2026-11-11 立）**：
- `python3 ~/.pi/agent/patch/license-check/license-check.py` —— 扫 `~/Developer` 下全部仓库，输出「仓库 / 许可证 / 性质 / 结论（OK / MISMATCH / REVIEW）」，`MISMATCH` 即类型与性质不对应；`--repo <路径>` 只查一个。粗筛，`REVIEW` 交人判（判据看内容被谁消费）。
- `commit` skill 第 9b 步每次 `/commit` 都会对当前仓库跑一次这个脚本：`MISMATCH` 时在汇报里单列一条（不静默改、不静默放过），`REVIEW` 自查或问用户，结果写进 `.commit-cache.md` 的 `license` 标记（`ok` / `mismatch`）。

## 版本信息一致性（VERSION 文件为唯一权威）

项目根 `VERSION` 文件是整个项目版本号的**唯一权威来源**，所有涉及版本信息的文件（`package.json` 的 `version`、CHANGELOG、README 徽章与正文、`package.nls.json`、构建产物命名等）必须与它**核心数字一致**（major.minor.patch 逐一相同）。前缀差异允许（`v1.2.3`、`Version 1.2.3`、`"version": "1.2.3"` 与 `1.2.3` 一致）；后缀（`-beta`、`-rc.1` 等）不自动豁免，需判断是否有意区分。手动改版本号先改 `VERSION` 再同步其它引用处，避免基线漂移。`VERSION` 与 `CHANGELOG.md` 是项目标配（任何项目都必须有，缺失由 commit skill 第 9m 步自动新建）。/commit 流程做一致性检测，不一致即彻底终止。

**项目若还有自带版本号的对外发布物**（如群公告 `docs/community/announcement.txt`），其版本号必须与 `VERSION` **完全一致**——同一套编号，bump 一个必须同步 bump 另一个（2026-10-02 立）。这条由工具强制：全局 git pre-commit hook + pi 端 `version-guard.ts` 两层拦截 commit / tag（仅当仓库同时存在 `VERSION` 与 `docs/community/announcement.txt` 时生效，其它项目零影响）；逃生门与详细判定见守卫说明。

## 版本发布状态必须实测 GitHub Release

判断「某版本是否已发布」必须实测：`gh release view vX.Y.Z -R <owner>/<repo>`（返回 Release 详情即已发布、`not found` 即未发布）或 `gh release list`；`git tag -l` 作旁证。**不得凭 VERSION / package.json 版本号、CHANGELOG 条目、commit 历史（「bump to X」只说明版本号改了、不等于已发布）、工作区状态推断**——这些在发版前就会就位，是必要不充分条件（曾因轻信 git log 快照把改动塞进已发布条目被纠正）。口径：**版本号取值看 VERSION，发布状态看 GitHub Release**。

## CHANGELOG 记录纪律（每次增删改必记 + 防回归）

项目根有 `CHANGELOG.md` 时，**每一次文件增删改操作**（新建、编辑、重命名、删除，含 skill / rules / 配置 / 文档变更）都必须记录，且写清**为什么改**（触发原因 / 要解决的问题）+ **改了什么**（具体变更内容），按「新增 / 变更 / 移除」分类。**记录不用问**——改完直接顺手记入，问「要不要记」是多余的反 confirm。`CHANGELOG.md` 为项目标配（缺失由 commit skill 第 9m 步自动新建）。边界：只读查看不产生变更的不记；盯盘高频信号写 `signals/` 属运行时数据流不逐条记，但信号**机制**变更必须记。

### 溯源与防回归（核心要求）

新改动涉及 CHANGELOG 已有记录的文件 / 功能 / 规则时，必须：① **回溯历史条目**，理解当初为什么改；② **评估回归风险**——新改动是否删除 / 弱化了当初的修复逻辑、恢复了被移除的问题行为、改变了当初设定的参数 / 条件 / 边界；③ 有回归风险**必须立即、明确告知用户**（原来解决什么问题、新改动哪部分会破坏它、不处理的后果、建议的处理方式：保留修复 / 兼容调整 / 接受回归并记录）；④ 无回归则照常执行。

## 待办（TODO）管理：项目根 TODO.md 与 TODO-archive.md + 备忘录 MEMO.md

凡「待办 / 下一步 / 代码现状（待办）」类内容（还没做、打算以后做）一律写入项目根的 **`TODO.md`**（活跃待办，只放 `[ ]` 未完成条目）+ **`TODO-archive.md`**（归档已处理条目）+ **`MEMO.md`**（超低频备忘，见下），**禁止写到其它任何地方**（skill 正文、references、CHANGELOG、代码注释 `# TODO` 等，遇到就并入 TODO.md）。核心规矩：**TODO.md 只留未完成、已处理全部归档**，清单要尽快处理、及时清空，不设「长期备忘」分类。**待办无「可选项」**：进 TODO.md 的条目都是强烈建议及时处理的内容；可做可不做的自由动作不记录（记录本身稀释清单行动性），已记录的此类条目移入归档标 `✅**已放弃**` + 理由。

- **文件结构**：TODO.md 内按紧急度分节（`##` 二级标题），同一紧急度内可按主题再分节（`###`），节下条目按记录时间先后排。
- **四级紧急度**：🔴 红色（不修会直接亏钱、下错单、安全事故、数据 / 统计结论错误、核心功能不可用）> 🟠 橙色（边界情况出错、防护缺口、口径不一致可能演化为实际损失）> 🟡 黄色（文档措辞、格式漂移、卫生问题、不影响正确性的优化）> 🟢 绿色（计划类新功能实现，改期无实际损失）。**颜色只标 `##` 分节标题，条目本身不标颜色 emoji**；判断拿不准往高靠（宁高勿低）。
- **每条必有唯一编号**：格式 `**T11**`（前缀 T 直接连序号、整体加粗、无连字符），写在 `[ ]` 之后、正文之前；活跃与归档同此。编号**项目内全局递增、永不复用**——新编号 = `TODO.md` 与 `TODO-archive.md`（项目若有 local 版则加扫 `TODO.local.md` / `TODO-archive.local.md`，四文件共用一套编号空间）中出现过的最大编号 + 1；归档后编号保留。沟通直接用编号指代（「T11 处理了吗」「放弃 T7」）。既有无编号条目接触一条补一条。
- **每条必有记录时间戳（精确到分钟）**：`（记录：YYYY-MM-DD HH:MM）`，记这条待办**当前内容的写下 / 更新时间**，事后改写正文同步更新。**前后矛盾的待办以最新时间戳为准**：旧条目打 `✅**已更新**` 进归档不删，另起新条目写最新决定。
- **做完改动要闭环**：查 TODO.md → 该改动若已在待办中，把条目移入 TODO-archive.md（「已完成」：`✅**已完成**` + `（完成：YYYY-MM-DD HH:MM）`；「已更新」：原条目一字不动、标 `✅**已更新**` + 更新时间，并在 TODO.md 另起新 `[ ]` 条目）→ 记 CHANGELOG。**凡移出 TODO.md 的条目一律进归档、不裸删**；用户说「放弃 / 不处理」同样归档，标 `✅**已放弃**` + 放弃理由，正文保留可回溯。
- **TODO 与 GitHub Issue 不得重复（同一事项单一在途源）**：项目 GitHub 仓库的 Issue 和项目根 `TODO.md` 追踪的是同一类「还没做、打算以后做」的事项，同一事项只允许在一个地方在途——要么是 TODO 条目、要么是 Issue，两边同时挂着同一件事即为重复。**TODO 条目转移到 Issue 后必须归档**：为某条待办建了对应 Issue（或决定改由 Issue 追踪）后，把该条目移入 TODO-archive.md、标 `✅**已转移**` + 指向 Issue（如 `（已转移至 Issue #42）`），不留在 TODO.md——否则同一事项两处追踪，一边状态更新了另一边还挂着旧状态，两边都会失真。反向同理：已在项目 Issue 里追踪的事项不再写进 TODO.md；建 Issue 前先查 TODO.md 是否已有同事项、记 TODO 前先查项目 Issue 列表，避免重复。
- **个人隐私类待办分流 local 版**：个人隐私类内容不得写入公开版 TODO / 归档（会随开源仓库公开），改写项目根 `TODO.local.md` + `TODO-archive.local.md`（两文件须入 `.gitignore`），条目格式、紧急度分节、编号规则与公开版完全一致。公开版 TODO 头部加一行分流指引，指引与条文**一律用中性表述（如「个人隐私类待办」）、不点明具体隐私类别**——类别名本身即敏感信息，公开仓库读者看到类别词即可推断仓库主的私人情况。非隐私的普通技术待办照常写公开版。
- **MEMO.md 备忘录**：放比绿色紧急度还低的超低频备忘（周期性如「每 3~6 个月轮换密钥」、条件触发如「样本 ≥30 笔后重新标定」，无排期压力）。条目格式同 TODO（`[ ]` + `**M11**` 编号前缀 + 时间戳），建议写明下次触发的时间锚点或条件；取最大编号时 `MEMO.md` 与 `MEMO-archive.md` 都要扫。做完移入专属归档 `MEMO-archive.md`（与 TODO-archive 平行、不混放）。不设自动提醒，相关场景出现时主动翻对照。新项目不强制预建，第一次有备忘需求时创建。
- **边界**：本条管「待办 / 未决 / 计划以后做」；已完成变更的记录（CHANGELOG）、当前规范的描述（SKILL.md）、陈述性代码注释不受限。敏感信息禁入 TODO 文件（占位符表述）；个人隐私类整体分流 local 版。

## 团队结构参考（按需读取，指针节）

**两个团队完全独立（2026-11-11 用户立）**：**pi-team** 负责开源项目，规则在本文件；**dsh-team** 负责闭源项目，规则在 `~/.dsh/AGENTS.md`。两边不共用注册表、名册、镜像、技能、守卫；dsh-team 的项目不登记进 `docs/agents-registry.md`，也不进 `xhqing` 名册与 `agents-infra` 镜像；反过来，pi-team 的项目也不进 dsh-team。**同一个 Agent 是“一个人”，只有一套版本 / CHANGELOG；两顶帽子（`.pi` / `.dsh`）与 Leader / Worker 工作流的布局见 `~/.pi/agent/docs/dsh-team.md`。**

团队共有 17 个 agent（三个小组 + 直属岗位；2026-10-26 注销 Hermes、2026-10-31 除名 Alfred 与 Tinker、2026-11-05 注销 Prometheus（项目降级为普通项目、归 Kit，2026-11-11 该项目更名为 agents-infra）后从 21 减到 17，口径与 `docs/agents-registry.md` 智能体命名注册表的行数一致）。涉及以下场景时**先读对应文档再动手**（权威源在全局 `~/.pi/agent/docs/`，agents-infra 仓库的 `pi/agent/`（docs / skills / patch / AGENTS.md / extensions）为逐字节一致的开源镜像）：

- **新建 Agent 项目**：先读 `~/.pi/agent/docs/agents-registry.md`（名称查重 + 流水线位置）与 `~/.pi/agent/docs/new-agent-scaffold.md`（命名规则（**Agent 项目一律 `<职责>-agent` 全小写、连字符**，Non-agent 项目按「尽可能简单、体现职责」；项目是不是 Agent 项目看 README 的 `Type` 徽章是否为 `AI Agent`）、脚手架清单、README / logo / 徽章规范、`.gitignore` 必含项、开源到 GitHub 流程、双语 README 同步细则）。新建时向注册表追加新 agent 行**免确认**（仅限追加，不改已有行）。
- **跨 agent 移交 / 推荐子任务**：读 `~/.pi/agent/docs/agents-registry.md`（注册表：名称、项目、职责、销售流水线、三小组分组）。
- **维护全局通用能力（skills / AGENTS.md / docs / hooks / patch / pi 扩展）、发布 agents-infra 镜像**：读 `~/.pi/agent/docs/capability-sync.md`。**pi-team** 的权威源是 `~/.pi/agent/`，由 macmini 的 `patch/agents-infra-publish/publish.py` 镜像到 `agents-infra/pi/agent/`；**dsh-team** 的权威源是 `~/.dsh/`，由 MacBook 的 `patch/agents-infra-publish/publish_dsh.py` 镜像到 `agents-infra/dsh/`。两个子树、两个单 pusher，路径不相交；不要用一台机器的脚本去推另一个子树；发现全局与镜像分叉时自动对齐（全局权威优先）、无需询问；同步动作只记 agents-infra 的 CHANGELOG。
- **智能体专属文件：Agent 项目与子项目完全独立（2026-11-08 用户立，取代 2026-10-30「身份层软链接 + 能力层路径引用」）**：`AGENTS.md`、`AGENTS.override.md`、项目级 `.pi/` 这类「按工作目录加载、表征智能体身份」的文件，**每个项目只放本项目真实需要的内容**——Agent 项目放 Agent 自己的规则与工具，子项目放子项目自己的规则与工具，**两边之间不留链接、不留路径引用**。
  - **规则文件本体统一为 `AGENTS.md`、`CLAUDE.md` 弃用（2026-11-05 用户立）**：全局规则文件是 `~/.pi/agent/AGENTS.md`，各 Agent 项目的项目级规则文件本体一律是项目根的 `AGENTS.md`；**不再新建 / 保留 `CLAUDE.md` 实体副本，也不再挂 `AGENTS.md → CLAUDE.md` 软链接**（存量已全部改名）。依据：pi 的上下文文件候选顺序是 `AGENTS.override.md` > `AGENTS.md` > `CLAUDE.md`（`dist/core/resource-loader.js` 的 `loadContextFileFromDir()`），同一目录只加载第一个存在的文件——本体放在 `AGENTS.md` 后 `CLAUDE.md` 根本不参与加载，留着只是双份内容漂移的隐患。`.claude/` 目录本身仍按原口径「不新增、不维护」（2026-10-17 决定），其中的 `CLAUDE.md` 已迁出、不再是 agent 规则本体。
  - **子项目 `AGENTS.md` 是本仓库的实体文件**，写四件事：① 本项目是什么（一两句）；② 归哪个 Agent 负责；③ Worker 的角色边界（干完向谁汇报、不碰 local main、不建删 worktree）；④ 各类规则在哪（`.pi/APPEND_SYSTEM.md`、`DEVELOPMENT.md`、`CHANGELOG.md`、`TODO.md` 的索引）。**不写** Agent 项目的身份与规则副本——那些本来就不属于这个仓库。
  - **子项目 `.pi/` 也不引用 Agent 项目**：不写 `settings.json` 里的跨仓库资源路径。本项目需要什么就放进自己的 `.pi/{extensions,skills,prompts,themes}`（这四个目录本来就会被自动发现，不必写进 settings），或者干脆只留 `.pi/APPEND_SYSTEM.md` 一份硬约束。
  - **为什么拆**（2026-11-08 用户原话：「二者的 AGENTS.md 和 .pi 目录之间应该完全无关才比较合适，只需要放本项目真实需要的项目规则和 .pi 目录下的工具文档或配置」）：① 跨仓库路径引用是**隐式依赖**——Agent 项目改名、子项目单独 clone、换机器，都会静默失效（pi 不报错，只是少加载东西）；② 两层压在同一个符号上只能靠「只允许追加、不许重述」的纪律压着，而那条纪律本身就说明两层混在一起有事；③ 实测下来那份引用九成是空的（Atlas 名下 8 个子项目引用的目录根本不存在），真带过来的少数几个还常常不搭（Chat 类技能出现在配置文件仓库里），属于噪声而非资产。
  - **安全网不受影响**：全局 `~/.pi/agent/`（全部团队规则、`add` / `commit` / `bump` / `release` 技能、各类守卫扩展）在**任何目录**都会加载，与项目级配置无关——所以拆掉项目级交叉引用不会丢任何一条保护。
  - **边界**：子项目依然是「某 Agent 负责的项目」（归属记在 `docs/agents-registry.md`、写在各自 `AGENTS.md` 里），只是规则与配置**物理上各管各的**。历史沿革见 `docs/agents-registry.md` 同名节。
  - **子项目任务由 Worker 会话执行，Leader 只建 worktree 与收尾（2026-11-07 用户立，取代 2026-10-17「只允许 Agent 项目根目录」）**：Agent 项目根目录的会话是 **Leader**（项目负责人），子项目根目录 / 子项目 worktree 目录的会话是 **Worker**（临时工）。`agent_call` / `agent_wake` 的 `dir` 允许三类目录：Agent 项目根 / 已登记子项目根 / 该子项目的 git worktree（worktree 通过 `.git` 里的 `gitdir:` 反查主仓库校验），其它目录拒绝；启动命令固定带 `-a`（子项目 `.pi/` 下有 `APPEND_SYSTEM.md` 等资源，会触发 pi 的项目信任提示；判据是 `.pi/` 下存在 `settings.json` / `extensions` / `skills` / `prompts` / `themes` / `SYSTEM.md` / `APPEND_SYSTEM.md` 任一项，后台会话无人应答会卡死）。**为什么**：子项目的专属规则与工具只能靠「cwd 落在子项目上」才被 pi 加载（pi 只读 cwd 这一层 `.pi/`，不向上继承），放在 Agent 会话里按路径做等于永远读不到。子项目映射表与细则见 `~/.pi/agent/docs/agents-registry.md`，分工流程见下节「Leader / Worker 分工」。
  - **子项目必须有 `.pi/APPEND_SYSTEM.md`（2026-11-07 起要求）**：子项目专属**硬规则**写进它（Worker 启动即加载），详细说明留在 `DEVELOPMENT.md` / `ARCHITECTURE.md` 等普通文档按需查阅。存量子项目尚未补齐的，处理到那个子项目时顺手补上。

## Skill 编写纪律

- **写 skill 必先依据 skill-creator**：新建 skill 或做内容性修改（SKILL.md 正文、description、references 组织等）前，先读 `~/.pi/agent/skills/skill-creator/`，按它的方法论写——Progressive Disclosure（description 常驻上下文、正文触发时加载且理想 <500 行、详情拆 references 按需加载）、description 要 pushy（明确列出触发场景、避免欠触发）。只改一两个错别字不必重走全流程；结构调整、新增章节、重写 description 必须以 skill-creator 为准。**description 长度 1024 是硬上限**（见下条，已工具强制）。
- **description 硬上限 1024 字符（工具强制，2026-11-03 用户立）**：skill 的 `description` 是 Agent Skills spec 的**硬上限**——**1024 字符封顶**，按 JS `string.length` 计数（一个汉字算 1、一个 emoji 算 2）。超了 pi 每次启动都会打 `[Skill conflicts] description exceeds 1024 characters` 警告、skill 的触发描述被截断。**为什么工具强制**：这条规则早就写在 `skills/skill-creator/SKILL.md`（「hard gate——量它，别凭感觉」），但同一个错反复犯（2026-11-03 实测 `add` 1069、`commit` 1111 双双超限），用户原话「下次改 skill 的时候记住不要超过 1024 characters，记不住就工具强制」。**做法**：① 改 description 前后都跑 `python3 ~/.pi/agent/skills/skill-creator/scripts/check_description.py <SKILL.md>`（与加载器同口径，pass 才算交付）；② 超了就**把流程机制细节搬进正文**（分步动作、参数、边界分支都属于正文，这是 Progressive Disclosure 的正解），description 只留「干什么 + 什么场景必须触发 + NOT for 边界」，**不要为了压长度删触发词**；③ 留余量，别贴着 1024 写（正文式长 description 极易被下一次小改动推过线）。**工具强制**：`~/.pi/agent/extensions/skill-desc-guard.ts`——`write` / `edit` 目标为 `SKILL.md` 时先算出写入后的 description 长度，超限直接 block（放行两种例外：本次没动 description 的历史欠账、以及本次让它变短的修复过程）；shell 写入由 `tool_result` 后置实测提醒兜底。**无逃生门**（超了就是错的，pi 会一直告警）。
- **Skill 内容纯净性（核心可开源 + 私人信息用户级存放）**：所有 skill 的核心功能文件（SKILL.md / references / scripts / README / description）保持可开源标准，不含对 clone 者莫名其妙或无用的内容；本机私人信息（token / folder 标识、个人云盘结构与命名、本机环境细节、带「用户 X 日立」署名的规则出处、个人事件叙述）一律像凭证一样放 skill 目录下**被忽略的本机数据子目录**（如 backup 的 `endpoints/`），功能文件用占位符表达机器差异（如 `<folder-token>`）。通用坑与通用流程（对 clone 者有价值的）留在功能文件。新建 skill 按此设计；既有 skill 接触到时顺手清理。

## 规矩必须配套工具强制（元规则）

任何规矩立下后，都要尽可能用工具强制辅助防遗忘——代码 / hook / settings deny 等硬约束落地，仅靠文本记录在 rules / skills / AGENTS.md 里不够（规矩刚立几分钟就被违反的实证：「远程禁复用窗口」立规后转头就用了 `open vscode://` URI）。能映射为可检测命令模式的规矩写进 pi 扩展（`~/.pi/agent/extensions/` 下的守卫，命中即拦截）；不能映射的（输出风格类）才只靠文本。改规矩时同步改对应的强制工具，两边不能脱节。工具强制是下限防线，文本管「判断与边界」。

**本团队只用 pi，其它 harness 一律不维护**（用户 2026-11-11 立，两次加码后定稿：先是不修 Claude Code 侧，随后明确「除了 pi 以外的其它 harness 都不用维护，专注维护 pi，其它 harness 在本团队全局规则 / 工具以及所有项目的规则 / 工具中清理干净」）：

- **范围**：Claude Code（`~/.claude/`、`CLAUDE.md`、`.claude/` 目录、CC 钩子）、CodeBuddy、Codex、DeepSeek Harness 以及将来任何非 pi 的 harness，一律不在维护范围内。
- **规则只落 pi 端**：新规矩写进 `~/.pi/agent/`（`AGENTS.md` / `docs/` / `skills/` / `extensions/` / `patch/`），**不为其它 harness 写或改任何钩子、配置、规则副本**；评估一条规矩能不能落地，只看 pi 端有没有对应实现。
- **项目级同样如此**：各 Agent 项目与子项目**不建 `.claude/` 目录、不存其它 harness 的配置文件**；发现的当场清掉（技能与规则迁到项目自己的 `.pi/` 下，`.pi/skills` 之类不再做成指向 `.claude/skills` 的软链接）。
- **文档里「CC 钩子已硬拦截」「两端同步」这类表述是历史记录**：看到不要照着做，也不要为了「保持一致」去改那边的文件；新写的文档不再出现这类表述。
- **工具一律以 pi 为准**：`pi` 扩展、`skills/`、`patch/` 是唯一实现；历史上为其它 harness 写的脚本（如 `skill-creator` 里依赖 `claude -p` 的评测脚本）走「归档 / 删除」，不修不维护。

## 工作规则

以下规则始终在场、所有 agent 必须遵守（这里只留红线）。

### 文件操作优先级（增改查优先，慎用删除）

- 面对文件任务优先「**增、改、查**」；**删除是最后手段**，优先用注释化、标弃用、迁移归档等「改」的方式替代。
- **读取优先**：先 Read 目标文件，禁止凭猜测或上下文推断文件状态。
- **编辑优先于重写**：能用 Edit 修改就不用 Write 重写整个文件；Write 仅用于新建或整体重构。
- **精确匹配**：Edit 的 `old_string` 必须与文件实际内容完全一致（含缩进换行），不一致宁可重读再改。
- **最小改动**：只改必要部分，不连带修改无关内容。

### 临时产物放 tmp/

- 不属于项目本身、不应被 git 跟踪的临时产物（生成的图片 / LOGO / 预览页 / 演示 HTML / 一次性脚本及输出 / 调试快照 / 给用户看一眼或临时验证的文件）一律放**项目根 `tmp/`** 下（可按用途分子目录），不放项目正式目录（`src/`、`docs/`、`assets/` 等）。
- **新建 `tmp/` 时必须确认 `tmp/` 已写入项目 `.gitignore`**（已有则检查、没有则追加，没有 `.gitignore` 则新建），绝不让临时产物被 git 跟踪。
- 汇报时给 `tmp/...` 的**项目相对路径**（cmux / 终端里可直接点开）；用户要求保留为正式文件时再迁移到正式目录。

### 私有内容目录 `~/.dev/private`（2026-11-05 用户立，工具强制）

项目里那些被 `.gitignore` 忽略、但**跨机需要保持一致**的私密内容——隐私待办（`TODO.local.md` / `TODO-archive.local.md` / `CHANGELOG.local.md` / `AGENTS.local.md`）、`backup/` 备份目录、本机文档（`docs/`）、交易凭证、素材图片等——**本体统一放 `~/.dev/private/<仓库名>/<相对路径>`**，项目里同名的位置放一个**软链接**指过来。这样「项目目录 clone 下来就是干净的公开仓库」和「私密内容跨机一致」同时成立：项目代码走 GitHub，`~/.dev/private` 走 Syncthing。

- **工具**：`~/.pi/agent/patch/private-links/private-links.py`，清单 `manifest.tsv`（`仓库名<TAB>相对路径`，支持 `*` 通配）。四个子命令：`adopt`（把实体搬进 private 并原地建链接）、`materialize`（按清单建链接）、`check`（巡检：断链 / 被替换成实体 / 私有侧孤儿 / 未登记的忽略文件）、`restore`（取消接线，把本体搬回项目）。
- **不要手建软链接**：编辑器「写临时文件再 rename」的原子保存会把链接换成实体文件（之后就不再同步了），`git clean -fdx` 也会删掉被忽略的链接。一律用脚本重建。
- **`local` 文件一律这样接线，不用询问（2026-11-05 用户立）**：`*.local.md` / `*.local.json` 这类本机私有文件，新建或迁移时直接照本节做——本体放 `~/.dev/private/<仓库名>/<相对路径>`、项目里放软链、清单登记一行、仓库 `.gitignore` 加一行忽略（如 `AGENTS.local.md` / `*.local.md`），**不用先问用户**（用户原话：「以后 local 文件都这样做，不用询问」）。其中 `AGENTS.local.md` 会被 `extensions/local-context.ts` 自动加载进系统提示（见下节）。
- **新建 worktree 后必须跑** `private-links.py materialize <worktree 路径>`（工作区是新目录，链接不会自动出现），否则 worktree 里读不到 `.env` / `TODO.local.md` 这类内容。
- **不进 private 的东西**：缓存与构建产物（`node_modules` / `.venv` / `data_cache` / `dist` / `*.vsix`）、以及**机器本地配置**（`settings.local.json`、`DATA-LOCATION.local.md` 等）——后者本来就该两台机器各自不同，塞进去等于把差异强行同步成互坑。
- **`.git/info/exclude` 由工具维护**：软链接在 git 眼里是**文件**，而仓库 `.gitignore` 里常见的是带尾斜杠的目录规则（`docs/`、`backup/`），匹配不到软链接，会让它变成未跟踪文件被 `/add` 误收。工具会自动把这些路径写进仓库本地的 `.git/info/exclude`（**不改仓库里的 .gitignore**，避免为了一点本地接线去改公开仓库）。
- **收尾巡检**：会话结束前的仓库自检里顺带跑一次 `private-links.py check`（0 问题才算干净）。

### 本机私有规则文件 `AGENTS.local.md`（2026-11-05 用户立，工具强制）

pi 只认 `AGENTS.override.md` / `AGENTS.md` / `AGENTS.MD` / `CLAUDE.md` / `CLAUDE.MD` 这 5 个上下文文件名，**没有 `.local.md` 变体**；`extensions/local-context.ts` 补上了 `AGENTS.local.md`。

- **语义**：追加进系统提示（section `local_context`），**不替代**同目录的 `AGENTS.md` / `CLAUDE.md`；功能等价于 `.pi/APPEND_SYSTEM.md`，但文件名自带「私有不公开」语义。
- **搜索范围**：`~/.pi/agent/AGENTS.local.md` 优先，然后从 cwd 逐级向上到根，每级最多一个，远的在前。`-nc` / `--no-context-files` 时一并跳过。
- **强制（核心）**：加载前做 git 安全校验——**已被跟踪**或**未被 `.gitignore` 忽略**的文件一律不加载，只注入「为什么没加载 + 去补 .gitignore」的提示。不在 git 仓库里的目录放行。
- **用法**：项目根放一个**被忽略的** `AGENTS.local.md`（推荐本体放 `~/.dev/private/<仓库名>/AGENTS.local.md`、项目里放软链接，用 `private-links.py adopt` 维护，别手建链接）。
- **边界**：只认 `AGENTS.local.md` 一个名字，**不认 `CLAUDE.local.md`**；要迁移就改名或加一个指向同内容的软链。细则见 `docs/local-context.md`。

### 两个共享目录的「改前快照」（2026-11-05 用户立，工具强制）

`~/.pi/agent` 与 `~/.dev/private` 是**允许任何会话（含 macmini）改删内容**的，但代价是必须先有一次新鲜快照——它们是全队最不可重建的东西，而现在又没有「整套项目目录同步」兜底了。

- **怎么做**：`python3 ~/.pi/agent/patch/dev-snapshots/dev-snapshots.py snapshot <pi-agent|private|both>`。快照 = `tar.gz`（`~/.dev/snapshots/`）+ 上传飞书云盘 `dev-snapshots/<target>/`，**本地与云端各只保留最近 5 份**（命名 `<target>-<YYYYMMDD-HHMMSS>.tar.gz`）。
- **强制点**：`extensions/snapshot-guard.ts` 在写入 / 删除这两个目录前检查令牌——普通写入要求 **30 分钟内的快照**、删除 / 移动类要求**快照与当前内容完全一致**；不满足就拦下并给出命令。令牌在 `~/.dev/private/.state/snapshot-token.json`（随 Syncthing 同步，所以任一侧做的快照另一侧也认）。
- **快照失败 = 不许改**：上传失败不写令牌，后续操作继续被挡（宁可不改，也不要「以为备份了其实没有」）。
- **恢复**：`dev-snapshots.py restore <target> [--name <文件名>]`——恢复前会自动先给现状留一份，避免恢复动作把当前状态冲掉。
- **两个目录的根本身永远不许删**（删共享根会让 Syncthing 对端状态难以收拾）；`snapshot-guard` 无条件拦截 `rm -rf ~/.pi/agent` / `rm -rf ~/.dev/private` 这类命令。

### `.pi/` 目录只放 pi 自己要读的东西（2026-10-28 用户立；工具已硬拦截）

`.pi/`（项目级）是 **pi 的配置目录**，不是「项目里的一个隐藏文件夹」。判断标准只有一条：**pi 自己会不会去读它？** 不会——就禁止放进去，哪怕只是想躲开某个检查、或者图省事。

- **项目级 `.pi/` 允许的内容（pi 明确会读，已按官方文档核实）**：`settings.json`、`extensions/`、`skills/`、`prompts/`、`themes/`、`npm/`、`git/`、`sessions/`，以及根目录下的 `APPEND_SYSTEM.md`（追加系统提示）与 `SYSTEM.md`（整体替换系统提示）——这两个 2026-10-30 按 `docs/usage.md`「System Prompt Files」补进白名单，此前漏列。除此之外一律不许新建。
- **别的东西该放哪**：
  - **git 钩子** → 仓库 / worktree 的 gitdir（`.git/hooks/`；多 worktree 场景放该 worktree 自己的 `.git/worktrees/<名字>/hooks/` 并用 `core.hooksPath` 指过去），**绝不放 `.pi`**；
  - **临时产物** → 项目 `tmp/`（见上一节）；
  - **项目自己的脚本 / 配置** → 项目正式目录（`scripts/`、`tools/` 等，该提交就提交）；
  - **只对本机生效、又不想进仓库** → `.git` 内部（如该 worktree 的 gitdir）或项目外的本机配置目录。
- **为什么**（三条，按严重程度排）：
  1. **会静默失效**：`.pi` 是 pi 自己的配置目录，形态由 pi 决定、也会随模板重建而整体重置（历史上这里挂过 `../<Agent 项目>/.pi` 软链接）。把 git 钩子这类东西放进去，一旦该目录被替换成软链接、或按模板重建，`core.hooksPath` 指向的位置就不存在了——而 git 遇到不存在的 hooks 目录**不报错、不提示、直接跳过所有钩子**，保护无声消失，直到出事才发现。
  2. **会被 pi 自己的逻辑误判或清走**：pi 启动会扫 `.pi/` 下的固定名字做迁移检查（实测：`.pi/hooks/` 被当成「已废弃的旧版钩子目录」，每次启动弹警告并要求按任意键），将来的清理逻辑同样会动这些路径。
  3. **语义混淆、容易被整体重置**：重建项目配置、切换 `.pi` 的软链指向、换 worktree，都会顺手把混进去的东西带走。
- **存量**：发现 `.pi/` 下有非 pi 内容，当场迁走并修好引用（如 `core.hooksPath`），不留在原地。
- **全局 `~/.pi/agent/`**：同理——非 pi 资源的内容按团队既有约定放 `patch/`（自建脚本 / 补丁）、`docs/`（说明文档），不散放在 agent 根目录。
- **工具强制**：`~/.pi/agent/extensions/pi-dir-guard.ts`——写 / 编辑类工具的目标路径落在 `.pi/` 下非白名单条目、shell 命令里「写动作 + `.pi/` 下非白名单条目」同时命中、或任何把 `core.hooksPath` 指向 `.pi` 的命令，一律拦截；只读命令（`ls` / `cat` / `grep`）与全局 `~/.pi/agent/` 不受影响。逃生门：命令末尾加 `# AI_ALLOW_PI_DIR`（须用户当次授权，不得擅自加）。
- **已知局限（诚实声明）**：守卫按命令文本里出现 `.pi/` 判断，`cd .pi && mkdir hooks` 这类「先切目录再用相对路径写」绕得过去；也可能误报（命令里同时有写动词和一个只读的 `.pi` 路径）。它是下限防线，判断靠本条规则。

### 汇报前验证

- 任何文件写操作后、向用户汇报前，**必须重新读取文件确认修改真正生效**——不能仅凭工具调用的成功返回值或上下文推断；逐行核对关键修改点，发现未生效或不完整就重新执行修改。
- 汇报必须基于**实际读取到的文件内容**（正确示例：「验证完成，config.ts 第 45 行现在是 `const threshold = newValue;`」），而不是工具返回状态或修改计划。

### 扩展代码写入必须先过语法检查（2026-11-05 用户立，工具强制）

pi 加载扩展时**只要有一个文件解析失败就 `exit(1)`**——打印 `Error: Failed to load extension "…": ParserError: …` 和 `Hint: Start without extensions using "pi -ne"` 之后直接退出，整个 agent 变成不可用状态，只能人工修好再启动。所以「扩展代码里的一个字符写错」不是小失误，而是**把所有会话一起搞停**。

- **适用范围**：pi 启动时会加载的扩展代码——`~/.pi/agent/extensions/**` 与 `<当前项目>/.pi/extensions/**` 下的 `.ts` / `.mts` / `.cts` / `.js` / `.mjs` / `.cjs`（`.tsx` / `.jsx` 除外：Node 类型擦除不支持 JSX）。技能脚本、项目源码、第三方 npm 包不在此列——它们写坏了不会让 pi 起不来。
- **最常见的成因**：模板字符串里写了**未转义的反引号**。`` `只有 `~/.pi/agent` 与 …` `` 这种写法会把模板字符串提前闭合，正确写法是内部反引号加反斜杠：`\``。2026-11-04 的 `macmini-use/index.ts` 就是栽在这一处，导致 2026-11-05 一整天 `pi` 起不来。
- **工具强制（`extensions/ts-syntax-guard.ts`）**：① `write` / `edit` 写入扩展目录时，先按「写入后的完整内容」用**pi 加载器同一个解析器**（Node `stripTypeScriptTypes`）校验，有语法错直接 block 并给出出错行与代码片段——坏内容根本落不了盘；② `bash` 执行后对比扩展文件 mtime，被改动的逐个复检，坏了就在工具结果里追加醒目告警（覆盖 `cat >` / `tee` / `sed -i` / `cp` / `mv` 这类旁路写入）。
- **随时可手工复核**：`node ~/.pi/agent/patch/ts-syntax-check/check.mjs [目录…]`（无参数时查全局扩展目录 + 当前项目 `.pi/extensions`）。**成批同步 / 复制扩展代码之后（例如对齐 agents-infra 开源镜像）必跑一次**——手工复制不过守卫，只有事后核对能兜住。
- **逃生门**：建 `~/.pi/agent/state/ts-syntax-guard-off` 可临时停用守卫，仅用于「解析器本身误报」这种极端情况；正常改代码永远不需要——解析器错了就该改代码，因为 pi 用的就是同一个解析器。

### 运行版本与开发版本隔离（禁止 npm link / 本地直跑开发源码）

- 「实际在用的运行版本」与「开发中的版本」严格隔离：开发中的代码必须走完整发布流程（打 tag + GitHub Release）后才可在实际环境使用；实际使用的版本必须从 Release 产物重新安装，**禁止 `npm link`（及 pip editable、软链接等一切等价手段）把开发目录挂为全局命令，禁止常驻服务直跑开发目录源码**。
- 自检：`npm list -g <pkg>` 出现 `-> .../Projects/...` 箭头即违规，立即按发布 + 重装纠正；`ps` 查常驻进程脚本路径指向开发目录即违规。
- 某修复尚未发版时正式环境就是用不上它——这是隔离的固有代价，不构成跳过发布流程的理由。边界：开发目录内部自测（不起全局命令、不做常驻指向）不受限。

### 工作环境：cmux 优先，VSCode 退役（2026-11-09 用户立，工具强制）

用户 2026-11-09 立规：「团队整体工作流在任何时候以后都不使用 VSCode，逐渐实现从 VSCode 到 cmux 的过渡，只要碰到需要 VSCode 的时候就考虑能不能在 cmux 里面实现同样的功能。」立规的直接起因：AI 让用户「在 VSCode 里确认 README 渲染效果」，而他的工作环境早已是 **cmux**（自建终端 / 面板，`~/Developer/cmux`，日常跑着多个 pi 会话）——**别再让用户去开 VSCode 窗口**。

- **一律先想 cmux**：需要看渲染效果（Markdown / 图片 / diff）、跑命令、开面板、看输出，都先在 **cmux** 里完成。cmux 缺的能力，优先推动在 cmux 里实现（提需求、自己写补丁——cmux 是 Atlas 名下的子项目），而不是退回去用 VSCode。
- **禁止主动启动或驱动 VSCode**：不执行 `code .` / `code <文件>` / `code --install-extension` / `code --folder-uri` / `codef`（全屏打开 VSCode 的 CLI），不用 `open` 开 VSCode 窗口。要用户「自己看一眼」时，给的是 **cmux 里的操作路径**；说「你在 VSCode 里确认一下」属违规。
- **验证渲染效果以 cmux 为准**：某个 README / Markdown / 图片显示是否正常，验的是 **cmux 里**的效果——那才是用户真实会看到的界面。
- **存量 VSCode 扩展项目照常维护**：`ghostty-launcher`、`mp4-player` 这两个 VSCode 扩展仍是名下产品，构建 / 发版 / 修 bug 不受影响；只是不再把它们（或别的项目）当成**日常验证工具**。装 VSCode 扩展的 `vsce-install` skill 已于 2026-11-09 按用户要求删除（VSCode 退役，不再需要它）。
- **过渡期保护条款（仍然有效，别删）**：
  - **杀 VSC 进程前必须先问**：任何会让 VSCode 退出 / 重启的手段（`pkill`、`kill`、`killall`、osascript 强制结束等）先向用户说明范围与原因，授权后命令加 `# AI_AUTHORIZED_KILL_VSC` 标记放行。查询类（`ps`）不受限——用户可能还有 VSCode 窗口开着，误杀同样会打断他。
  - **远程连接强制新窗口**：若用户当轮明确要求用 VSCode Remote-SSH / Remote Tunnel，用 `code --folder-uri "vscode-remote://ssh-remote+<host>/<远端路径>" --new-window`，禁止 `open vscode://vscode-remote` URI（会复用用户当前窗口、顶替工作现场）。
- **工具强制**：`~/.pi/agent/extensions/vscode-retire-guard.ts` 拦两类——① **启动 / 驱动 VSCode**：`code`（VSCode CLI）/ `open -a "Visual Studio Code"` / `open vscode://` / 直接跑 VSCode 可执行文件，逃生门 `# AI_AUTHORIZED_VSCODE`；② **杀 VSCode 进程**：`pkill` / `killall` 目标含 `Visual Studio Code` / `Code Helper`，逃生门 `# AI_AUTHORIZED_KILL_VSC`。两个标记均仅限用户当轮明确授权。`codef`（全屏打开 VSCode 的 CLI）仍归 `focus-guard.ts` 管（主要问题是抢焦点）。

### 本机屏幕焦点禁止抢夺（未经授权禁止；取得当次授权可执行；钩子已硬拦截）

用户的工作 Mac 就是他此刻正在用的机器——**未经授权抢走屏幕焦点的操作会直接打断用户**（窗口置顶 / 激活、菜单展开与点击、模拟按键 / 鼠标、AX 操控窗口位置与尺寸等）。2026-10-14 用户立规，原话：「本机焦点禁止抢夺」「以后也是一样」；立规起因是 AI 为排查 codef 故障在本机反复置顶窗口、开菜单、点平铺项，连续打断用户操作。**2026-10-14 深夜用户澄清口径**：「你可以跑抢焦点的程序，**前提是拿到我的授权**」——本机执行不是被绝对禁止，而是**必须先取得用户当次授权**；cuAgent 是「**需要使用 computer-use 能力**」（看屏幕 / 真实点击拖拽）时的专门通道，跑普通脚本测试用不上它。

- **未授权时被硬拦截**（工具层）：`osascript` 的焦点 / UI 操控（`keystroke`、`key code`、`pick menu`、`click menu item`、`frontmost`、`AXRaise`、`perform action`、设置窗口位置 / 尺寸、`activate`）、**直接调用 `codef`**（它按设计就是置顶窗口 / 开菜单 / 发按键的工具），以及**用 `open` 代开网页页面**（`open http(s)://…`、`open` 本地 `.html` 文件——浏览器 / 预览窗口会被带到前台抢走焦点）。只读查询（读窗口列表、系统日志等）不抢焦点、不受限。
- **要给用户看的网页，一律把链接原文发给他、让他自己点开，不要用 `open` 代开**（2026-10-14 当晚用户追加立规：AI 在用户正看别的东西时打开了 tokenplus 页面抢走焦点，原话「下次不要帮我打开网页页面，给我链接就行」）。
- **执行方式（按优先级）**：① **本机执行**——先向用户说明理由与影响、取得**当次**明确授权，命令加标记 `# AI_AUTHORIZED_LOCAL_FOCUS` 后运行（授权不跨次复用）；② 想不打扰用户时——登录 **macmini** 执行（`ssh mac-mini`，GUI 会话已登录，可在其屏幕上自由测试）；③ **需要 computer-use 类 GUI 能力**（看屏幕 / 真实点击拖拽 / 输入）时——找 **cuAgent**（其专属能力，见下节）。
- 未获授权不得执行本机抢焦点操作、不得擅自加标记；授权由用户当次明确给出。
- **授权焦点用完必须归还（2026-11-06 用户立）**：拿到当次授权、执行完抢焦点的操作后，**必须把焦点交还给授权时用户所在的窗口**（通常就是发起授权的那条 pi 会话窗口）——用户要靠「焦点回来了」判断 AI 已经用完；不要停在被操作的应用上。做法：执行前记录当前前台 app（`lsappinfo front` 或等价查询），操作结束（含失败）后用 `osascript -e 'tell application id "<bundle id>" to activate'` 或等价方式切回；切回失败要如实说明「焦点可能仍留在 <app>，请手动切回」。这条只约束「归还」动作，**不构成新的抢焦点授权**——下一次抢焦点仍需重新取得当次授权。
- 由 pi 端 `~/.pi/agent/extensions/focus-guard.ts` 硬拦截兜底（命令里含 `ssh` 时放行——那是 macmini 等远端机、不是用户本机）。

### 电脑操作（computer-use）：仅限 cuAgent 项目内使用（2026-10-09 修订）

- 沿革：2026-10-08 用户曾决定彻底弃用 computer-use（原话：「我不想用computer-use能力了，以后也不想用了」），相关组件全部移除（pi 全局 MCP 条目、全局 npm 包、缓存、配套补丁；同日早些时候试点的「用前授权 + 用毕弹窗」机制随之作废）。2026-10-09 用户确认**恢复 computer-use 能力、且限定只有 cuAgent 能用**。
- **当前口径**：computer-use 只以 cuAgent 项目的**项目级 MCP** 形式存在（cuAgent 仓库根 `.mcp.json`，由 npx 拉起固定版本、不装全局）。**其它任何会话 / 项目不得启用、使用或全局安装 computer-use 类工具**，全局 `~/.pi/agent/mcp-adapter.json` 保持无该条目；确需在 cuAgent 之外使用时，仍须先经用户明确同意。
- 本机还留有其它 harness（Codex）与 cmux 各自自带的 computer-use 组件——非本团队安装、不在维护范围内，处置待用户决定。

### X / Twitter 查询必须带账号隔离（钩子已硬拦截）

本机 Chrome 里，**查询专用号**与**运营号**分在不同的 profile。而 `twitter-cli` 默认会遍历所有 Chrome profile、取第一个有 x.com cookie 的——不隔离时，查询专用号的 cookie 一旦失效，工具会**静默**切到运营号，让运营号承担自动化访问风险（`opencli twitter` 走浏览器会话，无隔离机制，同样拦）。

- **跑任何 `twitter` / `opencli twitter` 命令前先加载隔离环境**：`. ~/.x-isolation.env && twitter status`（先确认账号是查询专用号再继续）。
- 隔离环境把工具钉在查询专用号上（指定 profile + 显式注入 cookie），**查询号失效时直接报错、不静默切号**；内容与原因见 `~/.x-isolation.env` 注释。
- 确需不带隔离（如显式指定另一账号）时，命令加标记 `# AI_AUTHORIZED_X_UNSAFE`。
- 由 pi 端 `~/.pi/agent/extensions/twitter-guard.ts` 硬拦截兜底。

### 禁止 Agent 自行关闭 xpilot（必须用户授权；已硬拦截并向用户汇报）

**xpilot 是本机全局出口，不是某个项目的私有进程。** 关掉它 = 本机所有走代理的流量一起断：AI 自己的老虎 API / 外部请求断、`system_proxy.enabled=true` 下用户浏览器等程序也断（stop 会摘掉系统代理设置）。**禁止任何 Agent 自己关闭 xpilot；确实需要关闭 / 重开时，必须先经用户授权。**（2026-10-27 用户立规。立规起因：AI 为「逐节点验证老虎白名单」用 `xpilot stop` + `xpilot start` 把 6 个节点挨个切了一遍、共停起 7 次，等于把本机出口掐断若干分钟——用户原话「你关了 xpilot 你自己也断了知道吗！」）

- **禁止的动作**（无授权一律不得执行）：`xpilot stop`、`xpilot restart`、`xpilot uninstall-launchd`、`pkill` / `killall` / `kill` 指向 xpilot、`launchctl unload|bootout` xpilot 的守护项。
- **放行的只读 / 非破坏动作**：`xpilot status`、`xpilot node list`、`xpilot test`（含 `--node <id>`，它另起临时实例、不动主代理）、`xpilot config show`、`xpilot switch`（只改配置、不影响运行实例，需 restart 才生效）。**验证节点 / 白名单优先用这些**，不要动主代理。
- **确需停 / 重开时的授权流程**：先说明理由与影响（会断本机全部代理流量、包括用户自己的）→ 取得**当次**明确授权（建议 `AskUserQuestion`）→ 命令加标记 `# AI_AUTHORIZED_XPILOT_STOP` 再执行。授权不跨次复用，**未获授权不得擅自加标记**。
- **工具强制**：pi 端 `~/.pi/agent/extensions/xpilot-guard.ts`——命中禁止动作时**暂停执行**（block）并**用 `ctx.ui.notify` 直接向用户汇报**（说明「AI 想自主关闭 xpilot、已被拦下」+ 被拦命令摘要 + 如何授权），bash 与 `background_run` 两条路径都盖。局限（诚实）：`kill -9 <pid>` 这种**不出现 xpilot 字样**的精确 PID 杀法拦不住；本守卫只提高绕过成本、不是银弹。

### 密码库与密钥文件不得删除 / 移动（钩子已硬拦截）

KeePass 数据库（`*.kdbx`）与密钥文件（`~/Key/` 下）是**丢了就回不来的东西**：内容无法重建，而文件同步会把本机删除**传到对端**（本地删一下 = 手机和 Mac 同时失去数据，只剩对端 `.stversions` 里的归档可救）。用户对此明确提过担心，所以定了硬规矩。

- **禁止**对 `*.kdbx`、`~/Key/` 下的 keyfile、含 `KeePass` 的同步目录、`~/Sync` 根目录执行删除 / 移动 / 覆盖类操作（`rm` / `mv` / `unlink` / `shred` / `trash` / `truncate`、`find -delete`、用 `>` 重定向覆盖）。
- **禁止**用写 / 编辑类工具（Write / Edit / MultiEdit）直接改写这些路径（无逃生门）——密码库只应由 KeePassXC / KeePassDX 自己读写。
- **正常使用不触发本规则**：打开、解锁、保存、同步都由密码管理器程序完成，不需要 AI 碰这些文件；连查看记录、比较 sha256、目录列举都不受限。
- **确需操作**（用户明确要求清理旧备份 / 迁移文件等）时，Shell 命令里加标记 `# AI_AUTHORIZED_KDBX_OP`，仅限当次授权范围，不得擅自加。
- 由 pi 端 `~/.pi/agent/extensions/kdbx-guard.ts` 硬拦截兜底（2026-10-04 立）。

### 项目级 rules 的 @ 引用纪律

- 项目级规则文件没有按文件名自动加载的机制，文件进入上下文的唯一途径是进入项目根的 `AGENTS.md`：**项目新增 rule 文件 → 同步在项目 `AGENTS.md` 加 `@` 引用**（路径 + 一句话摘要）；**删除 rule 文件 → 同步去掉引用**；定期核对两边一致（目录有文件没引用 = 漏加载白写；引用了但没文件 = dangling 引用）。
- 全局规则只存在于全局 `~/.pi/agent/AGENTS.md`（rules/ 目录已废弃删除）；**新增全局规则直接写入全局 `AGENTS.md` 对应章节**。`CLAUDE.md` 是其它 harness 的规则文件，已弃用（2026-11-05；2026-11-11 起全面不维护）——任何地方都不要再新建，存量见上方「本团队只用 pi」条。

### 中英双语 README 内容自动同步

项目同时存在中英双版 README（英文 `README.md` + 中文 `README_cn.md`）时，改动任何一版的**内容**（措辞、列举项、口径、数字、结构）必须在**同一轮改动里同步另一版**，不问「要不要同步」（同步是内容改动的固有部分）。中文版为权威方向；英文按英文习惯表达、不必逐字直译，但语义内容必须对齐（信息点、列举项、口径、数字不能少、不能多、不能变）。细则见 `~/.pi/agent/docs/new-agent-scaffold.md`。

### 会话间协作（agent-call：跨会话联系其他 agent）

需要其他 agent（另一条 pi 会话）配合时，用 `agent_call` 工具直接联系对方，不要人工传话、不要让用户中转。要点：

- **Leader / Worker 分工（2026-11-07 用户立，**全队所有 Agent 的默认跑法——不是某一个 Agent 的约定**，适用于全部 17 个 Agent 及其名下全部子项目）**：
  - **Leader** = 以 Agent 项目根目录为 cwd 的本会话。只做四件事：① 名下所有子项目 local main 的同步（`git merge --ff-only origin/main`）；② 按任务建 worktree（`git -C <子项目> worktree add ~/Developer/<子项目>-<事项> -b <分支名>`）；③ 用 `agent_call` 把任务交给 Worker（消息写完整：背景、目标、验收标准、涉及文件）；④ 收尾：把 Worker 的 PR 合入后对齐 local main、`git worktree remove` 清掉 worktree，再向用户汇报。
  - **Worker** = 以子项目根 / worktree 为 cwd 的临时会话。只做 worktree 里的具体活：读代码、改代码、跑测试、走自己的 `/add` → `/commit` → PR 流程，干完向 Leader 汇报（改了什么、验证结果、PR 号 / 遗留问题）。**Worker 不碰 local main、不建 / 删 worktree**（那是 Leader 的活）。
  - **命名**：Worker 统一叫 `<Agent 名>-<子项目>`（如 `Atlas-cmux`）；同一子项目多个任务就多个 Worker，各自 worktree 不同、名字可相同（用 session-id 区分），也可以带上任务后缀。
  - **生命周期**：Worker 干完即清（Leader 主动 `tmux kill-session -t pi-<名字>`）——它是临时的，不常驻。
  - **汇报链路**：Worker → Leader → 用户。Leader 不能把 Worker 的原始输出直接转给用户（要自己消化、核对后再汇报）；反过来也不能把用户的需求原文甩给 Worker 不管（要自己把它翻译成明确的任务单）。
  - **简单任务不分发**：跨项目琐事（如统一改个徽章）、一次性查询、Leader 自己就能看完的小修——Leader 直接做，不为了形式而绕一圈。
  - **各 Agent 项目的 AGENTS.md 不得与本节冲突**：项目级若有「后台会话只能以本项目根目录开启」「子项目按路径操作」之类旧口径（2026-10-17 定、2026-11-07 已废止），一律以本节为准；发现就改掉，不要留两套说法。
- **自动唤醒**：`agent_call` 会先检查目标会话是否在线；**不在线时用 `dir` 参数自动启动对方会话**，等它注册后再发消息。因此调用时尽量带上 `dir`。`dir` 允许三类：Agent 项目根（如 `~/Developer/dev-agent`，Leader）/ 已登记子项目根（Worker）/ 该子项目的 git worktree（Worker）——按 `~/.pi/agent/docs/agents-registry.md` 校验，其它目录会被拒绝。
- **两种模式**：只需要对方知晓用 `mode: "send"`（以本会话身份发送、立即返回）；需要对方答复才能继续干活用 `mode: "ask"`（阻塞等待回复，默认超时 2 分钟，可用 `timeout_ms` 调整）。只想提前把对方会话拉起来，用 `agent_wake`。
- **消息自带背景**：对方看不到本会话的上下文与对话历史，消息里要把背景、目标、期望对方做什么写完整。
- **联系不上不硬等**：`ask` 超时或唤醒失败时，如实向用户报告「暂时联系不上 XX」，不无限重试、不静默卡住；可改用 `send` 留言、或等对方上线后再联系。
- **会话命名约定**：启动 pi 会话统一用 `pi -n <agent名字>`（名字与 `~/.pi/agent/docs/agents-registry.md` 的注册表一致，即人格名）；**同一个 Agent 允许同时开多个会话、共用同一个名字**（一个人同时办几件事是合理的：Agent 项目根开会话、子项目目录也可以各开一个）——此时「**人格名 + session-id**」才能唯一确定一个会话：`intercom list` 会列出每个会话的 session-id（短前缀即可唯一定位），`intercom` 与 `agent_call` 都支持按名字（全名）或 session-id（或其短前缀）指定目标。已在运行的会话可用 `/alias <名字>` 补设。**子项目的 Worker 会话用 `<Agent 名>-<子项目>` 命名**（如 `Atlas-cmux`），避免与 Leader 同名混淆。
- **常设授权：其它 agent 仓库有待提交内容 → 自动委派（2026-10-04 用户立）**：检查到或得知任何 agent 项目的仓库有该提交却未提交的内容（工作区脏、暂存区有未提交内容等），**直接 `agent_call` 对方、由它用自己的 `/add` → `/commit` 流程处理**，不要拿这个问题去问用户——用户原话「每次检查到或者得知其它 Agent 的仓库有需要 commit 的内容就自动 call 这个 agent 使用 /add skill 或 /commit skill 处理一下，不要每次都问我」。授权边界：只允许「委派对方按它自己的 skill 流程提交」，**不得由本会话替对方仓库执行 git 写操作**；对方的 `/add` 预检、敏感扫描、cache 检测、发版链等安全阀照常生效；对方 /add 预检出现「需人工过目 / 不建议入库」时照旧停在 add 阶段、由对方报告用户。
- **后台会话用完即清、不活跃即清（2026-10-04 用户立）**：用户**看不到 tmux 后台会话**，「后台会话对他而言等于不存在」——所以不要让它长期挂着。
  - **用完就清**：`agent_call` / `agent_wake` 拉起的会话，使命完成后**主动关闭**（`tmux kill-session -t <会话名>`），不留常驻隐形进程；下次需要时 `agent_call` 会自动重新唤醒（代价只是一次启动）。
  - **不活跃就清**：空闲 ≥ 30 分钟、且无人在看的后台会话直接清掉。「无人在看」= `tmux list-panes -a -F "#{session_attached}"` 为 0、且 `tmux list-clients` 为空；「空闲」= 该会话的记录文件 `~/.pi/agent/sessions/<cwd-slug>/<时间戳>_<会话ID>.jsonl` 的 mtime 距今 ≥ 30 分钟（记录文件的 slug = cwd 去掉首尾斜杠后 `/` 换 `-`、首尾各加 `--`）。
  - **不能自作主张清的**：用户自己终端里的 pi 进程（`ps -o tty=` 显示真实 tty、不在 tmux 里）；记录文件 30 分钟内有更新（正在干活）；处于活跃工作流里等反馈（先问用户一句再动）。
  - **用户终端里的会话（前台）一律不许用命令关闭（2026-10-04 用户立）**：用户终端窗口里的 pi 会话他能看见、由他本人操作——禁止用 `kill` / `pkill` / `killall` 直接杀 pi 进程，也禁止 `tmux kill-server`（会把用户的 tmux 会话一起端掉）与 `tmux kill-session` 指向非 `pi-` 名字的会话；关闭后台会话只能用 `tmux kill-session -t <pi-名字>`。已配套工具强制：pi 端 `session-guard.ts`（无标记一律 deny）。
    - **说明（2026-10-29 用户澄清）**：「只允许杀 `pi-` 前缀的会话」是**实现判据**（当时为了把这条写成代码判断而加的工具层概括），**不是用户原话**；用户的本意是「别动我在终端里开着的会话」。
    - **配套源头规范（2026-10-29 立）**：既然判据靠前缀，**agent 自己创建的 tmux 会话一律用 `pi-` 前缀命名**（如 `pi-build`、`pi-test-et`）。这样「`pi-` 前缀 = agent 建的、其它 = 用户建的」才成立：agent 能清理自己建的东西，又不会误伤用户。反过来，agent 若忘了加前缀（如 2026-10-29 建了 `mmt-et4`），该会话就会被当作「用户的」保护起来、自己也清不掉。
  - **清扫方式（2026-10-04 用户定：不挂系统定时器）**：改成「**agent 干完活收尾时顺手跑一次**」——已工具化为 pi 端扩展 `session-sweep.ts`（`agent_settled` 钩子自动巡视）：空闲 **≥ 6 小时**的明显僵尸自动清掉；**30 分钟 – 6 小时**的只列清单提示、**不自动杀**（很可能是刚用完或在等工作流反馈，误杀代价大）。要停就删/禁该扩展。
  - **脚本安全阀（2026-10-04 用鲜血换来）**：`session-sweep.py --kill` 在「`--idle-min < 10`」或「候选 > 3 个」时**拒绝执行**，除非显式 `--force`。背景：当日为测 kill 路径跑了 `--idle-min 0 --kill --kill-unknown`，把无客户端附着的会话（含正在跑提交流程的、在等工作流反馈的）一并清掉——要批量清先干跑看清单，再带 `--force`。
  - **工具化**：`~/.pi/agent/patch/session-sweep/session-sweep.py`（默认干跑、`--kill` 才真删）可做定期巡视；查列表 `tmux list-sessions -F "#{session_name}" | grep '^pi-'`。
- **等待回复 / 后台任务运行期间的大红提醒（2026-10-09 立；2026-10-11 修订）**：凡是委派了其它智能体、还在等回复的时候（`agent_call` / `intercom` 发出后、回复尚未到齐前），或者后台任务（如 pi 的 `background_run`）还在运行的时候，用户容易误以为任务已全部完成而关掉会话。**pi 端由扩展 `~/.pi/agent/extensions/agent-wait-banner.ts` 自动在 footer 状态行显示大红提醒，agent 无需在消息里手写横幅**：

  `🟥🟥🟥 还有后台进程在运行中，请稍等 🟥🟥🟥`

  显示时机：还有未完活动（send 待回信 / ask 阻塞中 / 项目扩展上报的后台任务运行中）且会话静止（不在输出 / 执行工具）时显示；agent 干活期间隐藏、活动全部结束即撤；**主动判断**——send 类委派的消息里写明「无需回复」即视为 fire-and-forget、不点亮提醒（见下条写法），另有 **send 窗口 15 分钟上限**兜底（超时自动撤销；`PI_WAIT_BANNER_TTL_MS` 可调）——2026-10-12 用户定调「没有真实待办，提醒就不应该存在，要主动判断出来、主动撤销」。**没有该自动机制的场景**：仍由 agent 在等待期间的阶段性汇报消息首行手写上述横幅（用 ANSI 大红加粗包裹 `\x1b[1;31m…\x1b[0m`；🟥 本身即红色，作为 ANSI 失效时的兜底），确认为「全部回复都已到齐、任务真正收尾」的汇报才不带——拿不准就带。
  - **发出 send 类委派时的写法**：需要对方回信的正常发（提醒自动点亮、收到回信即撤）；**不需要回信的（fire-and-forget，如「处理后无需汇报」）在消息里写明「无需回复」**——扩展据此主动判定「没有要等的东西」、不点亮提醒。
  - **为什么要这一条**：阶段性汇报（已委派 / 已清尾 N 个 / 还剩几个）写得太像「总结报告」，用户不细看会以为任务全部完成——2026-10-09 实测：用户在等 Atlas / Hermes 回执期间差点关掉会话。大红提醒让「还有事在跑、别关窗口」一眼可见。
  - **工具强制**：pi 端扩展 `agent-wait-banner.ts`——活动窗口判定（send 类委派未收到回信 / ask 阻塞中 / 其它扩展经 `agent-wait-banner:activity` 事件上报的后台任务活动）→ footer 状态行显示；用户输入、intercom 回信到达、活动结束即清除。（2026-10-09 立；2026-10-11 重做：位置从「消息首行横幅 + 编辑器 widget」改为 footer 状态行、文案更新、修掉旧版「回信到达后 send 窗口永不关闭」与「输出完提醒残留」的缺陷；2026-10-12：① 「无需回复」标记的 send 不点亮提醒（主动判断没有要等的）；② send 窗口加 15 分钟超时上限——修掉「无人回信时提醒一直挂着、误导用户等后台进程」的形态。）

### 跨机协作：macmini 值班会话（2026-10-17 用户立）

- **重活默认分流到 macmini（2026-11-03 用户立，工具强制）**：本机是用户**此刻正在用**的 MacBook Air（8 核 / 8GB），macmini 是 12 核 x64 / 32GB 的常驻算力机，与本机共享 `~/.pi/agent` 与 `~/.dev/private` 两个目录（项目代码走 GitHub、各自 clone，2026-11-05 起 `~/Developer` 不再同步）。**每条指令先判断一次「里面的重活要不要放 macmini」**：预计占本机 CPU / 内存十几秒以上的编译、构建、测试套件、音视频转码、批量渲染、数据回测、大文件扫描 / 大下载，一律用 `macmini_run` 工具在远端跑（长任务传 `background:true`、之后 tail 日志取结果），不要在本机硬扛；几秒内结束的短命令、需要 GUI / cmux / osascript / 焦点 / 剪贴板、需要 arm64 产物或本机 `node_modules`、git 写与 gh 发版、操作未镜像路径（`~/Downloads`、`/Volumes`、`~/Library` 等）的留本机。判断标准是**用户的本机要流畅**，不是「尽量多用远端」。判定细则、远端工具链实况与常见重活跑法见 skill `macmini-use`；配套工具强制见 `~/.pi/agent/extensions/macmini-use/`（每轮注入分流判断 + 拦重型本机命令，逃生门 `# AI_LOCAL_OK: <理由>`；macmini 上不生效）。**用 macmini 时 pi 输入框下方会亮一行「🖥  当前使用的是 macmini」（前台调用 / `/macmini …` / `ssh mac-mini …` / `background:true` 的后台任务），用完自动撤——亮着就代表那个时刻确实在占用远端算力（2026-11-04 用户立）。**
- **删除红线（2026-11-05 架构改造后）**：macmini 上的项目目录只是普通 clone（可从 GitHub 重建），删它无害；真正要护住的是两个共享目录 `~/.pi/agent` 与 `~/.dev/private`——它们**允许改删里面的内容**（2026-11-05 用户明示），但改前必须有一次新鲜飞书快照（`~/.pi/agent/patch/dev-snapshots/dev-snapshots.py`，由 `extensions/snapshot-guard.ts` 强制），并且**两个目录根本身永远不许删**（删同步根会让对端状态难以收拾）；其它路径的远端递归删除仍默认拒绝（`macmini_run` 需带 `# AI_REMOTE_RM_OK`）。

macmini 上配有一个**常驻值班会话**（intercom 名：`macmini`，由 launchd 守护、掉线自动重拉）。本机各 agent 需要借用 macmini 的资源/环境时，用以下标准命令呼叫（**本机 → macmini**）：

```bash
# ask：发消息并等待回复（阻塞；适合需要结果的活）
ssh mac-mini '~/.pi/agent/npm/node_modules/.bin/pi-intercom ask --to macmini --text "任务内容"'

# send：只通知不等回复（fire-and-forget）
ssh mac-mini '~/.pi/agent/npm/node_modules/.bin/pi-intercom send --to macmini --text "通知内容"'

# list：查看 macmini 上有哪些会话
ssh mac-mini '~/.pi/agent/npm/node_modules/.bin/pi-intercom list'
```

- **用途**：把「重计算 / 长耗时 / 需要 macmini 环境（32GB、x64）」的任务转过去执行，结果由值班会话回传（如跑脚本、构建、下载、批量处理）。
- **能力边界**：值班会话具备通用能力（跑命令/脚本/网络任务），**暂不具备「某个具体 agent 的身份与项目环境」**——「唤醒具体 agent 会话」的场景另待扩展（依赖 macmini 上的 tmux 与项目环境部署）。
- **超时**：ask 默认 120 秒；长任务可在命令里加 `--timeout-ms <毫秒>`，或先用 send 派活、稍后再发 ask 询问进度。
- **注意**：值班会话的 cwd 是 macmini 的 `~`（无项目上下文）；在 macmini 上产出的文件留在 macmini（本机如需取回需显式回传，如 `scp mac-mini:<路径> <本机路径>`）。
- **同步范围（2026-11-05 架构改造：代码走 GitHub，只有两个目录用 Syncthing）**：`~/Developer` **不再同步**——每台机器各自 `clone`、各自开 worktree，靠 GitHub（push → PR → CI → merge → 本地 main 快进）交换代码；Syncthing 只同步两个目录：`~/.dev/private`（各项目私有内容**本体**，项目里放同名软链接，见「私有内容目录」节）与 `~/.pi/agent`（全局能力层）。macmini 为此恢复 GitHub 访问（用**独立凭证**，不与本机共用）。开工前先让 local main 与 `origin/main` 对齐、任务结束走完整提交 / PR / 合并链路，细节见 `docs/macmini-mirror.md` 与 commit / bump / release skill。
- **macmini 的 git 权限（2026-11-05 起：从「严格只读」改为「正常读写」）**：旧的「严格 git 只读」（`extensions/git-readonly-guard.ts` + macmini 的 `core.hooksPath` 只读钩子）**前提已消失**——它当初是为了防「`.git` 被双向同步、两台机器同时写而互相损坏」；项目目录不再同步后，每台机器的 `.git` 各自独立。**已撤除（2026-11-05）**：`~/Developer` 共享关闭、macmini 的 38 个仓库已原地转正（`fetch` + `reset --hard origin/main`，不改目录、不重下依赖）之后，删掉了 `extensions/git-readonly-guard.ts` 并清掉 macmini 的 `core.hooksPath` 只读 hook。macmini 现在可以正常 `fetch` / 提交 / 推送，但**同样受 remote main 锁定约束**（改动走分支 + PR + CI）。**仍然生效**：remote main 锁定（`git-main-guard.ts`，两机一致）、一个分支只做一件事、改动走 PR + CI。
- **已迁回的 Agent（2026-10-26 用户决定：Mark 全体系拷回本机，本机为权威源）**：**Mark**（quant-agent 及子项目 Intraday / Swing / gridtrader，另有同日移交的 NewsScoreStudy）原于 2026-10-17 整体迁至 macmini；**2026-10-26 已由用户拷回本机**——`~/Developer/` 下的目录即权威源。macmini 上的同名目录与 4 个 Mark 常驻会话**保留但不再权威**（用户当日明确选择「两边都不动、只改本机口径」，属对单宿主规则的已知例外）；5 个会话仍列在 `duty.conf` 里（值班会话每 6h 重启、Mark 系不重启），但**非必须用 macmini 环境的任务一律不在那边做**：

| 呼叫名（intercom） | 进驻项目（cwd） | 现行口径 |
|---|---|---|
| `macmini` | 值班会话（`~`，通用任务） | 正常使用（远程算力 / 环境） |
| `Mark` | 主项目 quant-agent | 保留但不权威；优先在本机会话做 |
| `Mark-Intraday` | 子项目 Intraday | 同上 |
| `Mark-Swing` | 子项目 Swing | 同上 |
| `Mark-gridtrader` | 子项目 gridtrader | 同上 |

⚠️ **2026-10-28 起镜像为双向**：给 macmini 上的 Mark-\* 会话派活，改动**会同步回流本机**（原「不会回流本机」的说法自镜像建立起失效）。为避免 `.git` 冲突，同一仓库同一时间只在一台机器上做 git 写操作；macmini 的 GitHub 访问已于 2026-11-05 恢复（独立凭证），提交 / 发版仍建议统一在本机做，非本机时同样走分支 + PR + CI。

标准呼叫：`ssh mac-mini '~/.pi/agent/npm/node_modules/.bin/pi-intercom ask --to <呼叫名> --text "..."'`（send 为不等回复）。

- **会话生命周期联动（session-link 机制，2026-10-17 用户方案）**：**后端会话的清零时机绑定在「本机派活会话的关闭」上**——任务没完成用户不会关本机会话，关了 = 用户判定完成、后端会话自动清上下文重启（继续常驻）。用户零操作，只管开关自己的会话。
  - **机制**：一次派活 = 一条**链**。本机（source）生成链 ID 并注入派活消息（`<!-- pi-chain:xxx -->`）；macmini（replica）会话从收件继承链、继续向下透传；每个环节（含只收指令的末端会话）自动登记进链注册表。
  - **联动**：本机会话关闭（Ctrl+C / 关窗口 / 退出，不含扩展重载）→ 自动 ssh 通知 macmini → 把该链上全部会话 kill + 立刻重拉（清上下文、保持常驻）——含 macmini 上派生的子会话（级联）。
  - **方向守卫**：macmini（replica）**禁止跨机出站派活**（目标限 macmini 本地会话清单，从 duty.conf 读）——远端设备不得利用本机资源跑后端进程（2026-10-17 用户立）。本机的互通派活不受限。
  - **配置**：角色按 hostname 自动判定（Mac-mini → replica，其余 → source），`patch/session-link/` 下的 config / 注册表 / 日志**不参与两机同步**（两端内容不同）。

### 会话收尾检查：负责的子项目仓库必须干净（2026-10-09 用户立）

每个 Agent 会话**结束任务之前**（向用户交付 / 收尾汇报之前），必须检查**自己负责的全部子项目仓库**是否干净；**不干净的全部要处理干净**才能收尾——不是只报告，也不是留给「下次自然提交」。

- **干净口径**：`git status --porcelain` 无输出（无未提交 / 未暂存改动、无未跟踪文件）；与远端无落后的未拉取分叉；本地领先的提交该推就推（经各仓库自己的 PR + CI 流程）。
- **检查范围**：该 Agent 负责的子项目清单——各 Agent 项目 `AGENTS.md` 的「子项目清单」节与全局 `~/.pi/agent/docs/agents-registry.md` 的「子项目映射」表（两者須一致）；**以及本次会话在项目里创建的 worktree**（`git -C <主工作区> worktree list` 查，用 `git -C <worktree 绝对路径> status --porcelain` 逐个核验——worktree 的工作区与暂存区跟主工作区完全独立，只看主工作区的 status 会漏掉未提交内容）。
- **worktree 怎么提交（2026-11-04 用户立）**：任务在 worktree 里做的，按仓库流程走 `/add` → `/commit`，**全部 git 命令带 `git -C <worktree 绝对路径>`**（不能 `cd`，也不看主工作区的 status / 暂存区）；本地 main 的对齐与发版在主工作区执行（详见 add / commit skill 的「worktree 场景」节）。worktree 分支属「非 main 分支」，自动触发照常生效。
- **处理方式**：按该仓库自己的流程处理——`/add` 预检 → `/commit`（该链条该 bump / 发版就照常走）；多仓库逐个处理；查不到、拿不准是不是在途 WIP 的，向用户说明后再动。**被 add-mode 或 commit-mode 暂停的仓库不适用本条**（任一暂停即跳过）：用户特意暂停了自动提交（多半在看 diff），保持原样、不催不提交，收尾时如实说明「这几个仓库被 add-mode / commit-mode 暂停，改动保留未提交」即可。
- **为什么**：子项目随附版同步、文档补记这类零散改动会长期烂在各个工作区里（2026-10-09 实测：全队 22 个子项目仓库有 16 个不干净，其中 Atlas 名下 8 个只挂着上一轮同步改动未提交）。收尾自检让每个 Agent 交付时，名下所有仓库都处于「干净 + 与远端同步」的终态。
- **顺带跑一次私有内容巡检**：`python3 ~/.pi/agent/patch/private-links/private-links.py check`（0 问题才算收尾干净；软链接断了 / 被替换成实体 / 新增了没登记的忽略文件都会报）。
- **工具强制**：pi 端扩展 `~/.pi/agent/extensions/settle-repo-check.ts`（`agent_settled` 钩子自动巡检本会话所在 Agent 项目的子项目仓库：发现不干净时通知用户，并就同一批不干净仓库向会话注入一次提醒促其处理；底层调用 `~/.pi/agent/patch/settle-repo-check/settle-repo-check.py`）。
- **边界**：只查「自己负责的」子项目仓库，不越界去动别人的仓库；临时产物仍放各自项目 `tmp/`（已忽略、不算不干净）；**开发流程中刻意留在工作区的在途改动**（如 dev-workflow 先行的测试产物）不适用本条——本条管的是「任务结束时点」的收尾状态，不是干活过程中的中间态。
