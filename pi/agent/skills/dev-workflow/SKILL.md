---
name: dev-workflow
description: 软件开发项目的核心功能开发循环（远端 main 分支保护 + 功能分支 + PR + CI 门禁；2026-09-21 三次修订定稿：GitHub Issue 作需求端（fixes #N 合并自动关闭）、测试开发分离 + 测试先行（2026-11-13 起只对 dev-agent 子项目强制：Leader 在实现开工前出测试、先红后绿，Worker 对测试文件全量只读可运行、hook 强制禁止增删改）、CI 绿即 auto-merge 合并（合并由 CI 独裁）、用户验收是过程（装上正式版实际使用，体验即验收）、发版自动衔接（修复合并进 main 后由 bump → add → commit → release 链自动发正式版，不等人工试用）。当用户在软件开发项目上要开发新功能、修 bug、修改核心功能代码，或提到开发工作流、dev-workflow、开分支、建分支、worktree、全量测试、测试用例、测试先行、TDD、PR、CI、Issue、合并回 main、预发布时必须使用——即便项目本身是软件项目，也要先判断这次需求是不是核心开发（判断标准见第 0 步）；项目尚无 Issue 需求记录或尚无测试不是绕过本流程的理由——此时同样必须使用，相应门禁会阻塞并引导补齐。杂事（文档、README、版本号 bump（/bump）、配置调整等不触碰核心功能代码运行行为的改动）不走本流程的测试门禁，但 main 已锁定直推，杂事同样经轻量分支 + PR + CI 进 main。（PR / Issue 文本公开前走敏感自检、public-text-guard 工具强制，2026-10-03 增）
---

# 开发工作流：远端 main 保护 + 测试先行 + PR + CI 门禁（核心开发专用）

核心逻辑：**main 必须永远绿，正式发布的版本必须是用户使用验收过的**。remote main 分支锁定（分支保护：禁止直推，一切经 PR）；**需求端是 GitHub Issue**——遇到问题 / 想要功能随手开 Issue（复现步骤 / 预期行为，就是测试的雏形），有空再解决；**测试开发分离 + 测试先行（2026-11-13 起只对 dev-agent 名下的子项目强制）**——测试（用例）由该项目的 Leader（dev-agent 会话）基于 Issue 在功能分支上、实现开工前先写出、自跑确认红（验证断言有效），Worker 才开工实现到绿；Worker 对测试文件全量只读 + 可运行（hook 强制禁止增删改——防「改测试迁就实现」，也防写完实现补「快照式测试」把当前行为连 bug 固化进断言）；**回归防护网放远端 CI**——项目全量测试（含新测试）+ 类型检查，每次 PR、每次 main push 都跑，**CI 绿即 auto-merge 合并进 main**（合并的唯一门禁是机器门禁，不等人工）；**发版自动衔接**：修复 / 功能合并进 main 后由发版链自动完成正式发版（bump → /add → /commit → /release 全链自动；2026-10-09 用户明确：「修复合并进 main 之后就应该自动发布正式版」——发版不以事先试用为前提）；**验收发生在发版之后**：用户装上正式版实际使用（体验即验收），发现问题走修复循环（新 Issue → Leader 先写失败测试 → 修复 → CI 合并 → 补丁版自动发版）；需要提前试用时仍可用预发布通道（配 auto-rc workflow 的项目预发布随合并自动发，未配则手动打），但预发布不是正式发版的前置。

沿革：2026-09-07 本地裁决版（无 PR 无 CI、main 可直推、本地快进合并）→ 2026-09-21 恢复远端主流模式（锁定 remote main、CI 门禁、回归防护网进 CI），同日二次修订（合并去人工门禁、验收过程化、人工门禁落点移到正式发版），同日三次修订（Issue 替代 test-cases 目录作需求端与状态机、测试 Agent 主通道出题、测试统一先行、开发对测试文件全量只读）→ 2026-09-22 预发布供料自动化（auto-rc workflow：main CI 绿自动发 rc，验收对象随合并自动就位；正式发版权仍在用户）→ 2026-09-29 测试任务下发改为写入 Hopper 项目 `TODO.md` 并报编号（不再让用户人工转达）→ 2026-09-30 测试产物不单独提交、不单独开 PR（用户立：测试写在功能分支工作区放着，等开发完成、本地全量测试绿后与实现一次性提交、同一个 PR——此前「测试先交付即提交」在非 main 分支上必然 push + 建 PR + auto-merge，实测导致测试 PR 合并 1 秒后 Issue 被 `fixes #N` 提前关成 completed、main 留下「测试已进、实现未进」的半程状态）→ **2026-11-13 测试定义权随 Hopper 除名并入 dev-agent**（用户立：开发工作流已是「Leader 给 Worker 出题」，由 Leader 在子项目 worktree 上、实现开工前写测试、Worker 全程不改，即可达成同样的分离效果；**该严格范式只覆盖 dev-agent 名下的子项目**，其它 agent 的项目不涉及复杂软件开发、不套用这套范式）。角色分立：**用例定义权归项目 Leader**（dev-agent 会话读 Issue 出测试、先红后绿，Worker 碰不了）；**代码实现权归 Worker**（只写实现，对测试只读可运行）；**合并裁决权归机器门禁**（分支保护 + CI，客观回归独裁）；**发布裁决权归用户**（试用满意才发版，主观满意把关）。

**流程总览**（各步细节见正文与 references）：

1. 第 0 步：定性——这次需求是不是核心开发
2. 第 1 步：开工门禁——Issue 与远端门禁就位
3. 第 2 步：建 worktree + 功能分支
4. 第 3 步：测试先行——Leader 出测试（先红，只对 dev-agent 子项目强制）
5. 第 4 步：开发（测试文件只读、问题终止上报、不 bump 版本）
6. 第 5 步：对齐 origin/main + 检查 Issue 与测试变更
7. 第 6 步：本地全量测试（机器门禁·预检）
8. 第 7 步：开发完成且本地全量测试绿之后，push + 建 PR（fixes #N，测试与实现同一 PR）+ enable auto-merge
9. 第 8 步：合并后收尾（删分支、清 worktree、同步）
10. 第 9 步：使用验收（预发布试用一段时间，配 auto-rc 时随合并自动发；发现问题 → 修复循环）
11. 第 10 步：正式发版（`/bump` → 自动衔接 `/add` → `/commit` → `/release` 全链自动；入口两种：用户主动 `/bump`，或 commit 流程检测到未 bump 自动触发，2026-10-02 起）

## 第 0 步：定性——这次需求是不是核心开发

项目是软件项目 ≠ 这次需求就是核心开发。每次触发先判断：**改动会不会触碰核心源代码的运行行为**——是则走本流程（行为改动必须有测试锁定，这是回归防护网完备性的底线）；纯文档、README、版本号、格式调整是杂事，走杂事通道：**建 `chore/<事项>` 分支 → 改 → 用户自行 `git add` + `/commit`（push + 建 PR + enable auto-merge）→ CI 绿自动合并**。main 已锁定直推（2026-09-21 起），杂事不再有「main 直改直推」通道，同样经 PR + CI——杂事改动也过回归防护网（防止文档改动意外碰坏东西）。配置类改动按影响判断：改变运行行为的（构建配置、依赖版本）从严走本流程；不改变的当杂事。拿不准时**从严走本流程或直接问用户**，宁重勿漏。

混合需求（核心功能 + 顺带文档）正常走本流程：琐碎文件修改不作为分支的开发目标，但功能开发必须同步的文档（README、CHANGELOG）在分支上顺带改是允许的，不算违规。

## 第 1 步：开工门禁——Issue 与远端门禁就位

两项都检查（Issue 以远端为准：`gh issue view <N>`）：

1. **Issue 就位**：本次需求有 open 的 GitHub Issue，正文写清**复现步骤 / 预期行为**（bug 给复现，功能给预期）——它同时是需求文档、验收标准、测试的雏形。没有 Issue → 阻塞，请用户开 Issue（`gh issue create`，可由会话代为执行、内容以用户口径为准——需求端的话语权在用户，开发不代定验收标准；Issue 文本公开前先过公开文本自检、命令带 `# AI_SENSITIVE_CHECKED` 标记，2026-10-03 增补）。Issue 含糊（复现缺失、预期不明）→ 先在 Issue 评论里与用户澄清补全，再继续。**测试规模与需求体量匹配**：小 bug 一条聚焦断言，大功能成组用例——Leader 出题时把握。
2. **远端门禁就位**（一次性基础设施，就位后后续开发不再检查）：
   - **main 分支保护已开启**：禁止直推（含管理员，不开 bypass）、必须经 PR、CI 状态检查设为 required、合并前要求分支最新（up-to-date）、只允许 squash 合并。未开启 → 列配置清单请用户开启，或经用户同意用 `gh api` 配置（rulesets / branch protection API）；**首次启用顺序：先让 ci.yml 经 PR 进 main，再开保护并把 checks 设 required**——反序会死锁（required check 从无成功记录，任何 PR 永远不满足）。完整配置与顺序论证见 `references/merge-discipline.md`。
   - **CI workflow 就位**：`.github/workflows/ci.yml` 触发器含 `pull_request`（目标 main）与 `push`（main），执行内容覆盖「项目全量测试 + 类型检查」（测试在项目正式测试位置，全量测试天然含它们）。缺失或不达标 → 阻塞，按 `references/test-cases.md` 的「CI 集成」一节补齐。项目没有 CI 不是绕过的理由，正如没有 Issue 不是绕过的理由。
   - **自动预发布 workflow（可选增强，推荐）**：`.github/workflows/auto-rc.yml`——main 的 CI 全绿后自动打 `v<目标版本>-rc.N` tag 发 `--prerelease` Release，把 CI 测过的内容自动交到用户手里试用（第 9 步验收的预发布版本随每次合并自动就位，修复循环的 rc.N+1 也随之自动来）。模板与两个定制点（workflow 名与 ci.yml 一致、构建命令按项目改）见 `assets/auto-rc.yml`；机制与规矩见 `references/acceptance.md` 预发布一节。未配它时预发布走手动通道（第 9 步），不是阻塞项。

## 第 2 步：建 worktree + 功能分支

```bash
cd <主仓库目录> && git switch main && git pull --ff-only
git worktree add ../<仓库名>-<功能名> -b <分支名>    # 并行开发（推荐）
# 或不并行时：
git switch -c <分支名>
```

分支必须从最新 main 开出。分支命名收敛为 `feat/<功能>` / `fix/<缺陷>` / `chore/<事项>`（杂事）+ 小写短横线描述（如 `feat/model-picker`）。一个分支只做一件事、只对应一个 Issue。**用户说「切分支 / 新建分支」但未说明用途时，默认创建名为 `Test` 的分支**（用户 2026-09-06 立——快速试验场景不想每次起名，不追问用途；已存在未合并的 Test 分支时报告并让用户选择复用还是换名）。

**worktree 的价值**：多个功能（多个开发会话）并行时，同一目录里的改动、`git status`、测试运行会互相污染，分不清哪份改动属于哪个功能。每个功能独占一个 worktree 目录 + 分支，天然隔离。要点：

- worktree 目录放主仓库**同级**（`~/Developer/<仓库名>-<功能名>`），不要嵌套在主仓库内（会被视为未跟踪内容，容易误提交）；
- **目录名的第一个项目名必须是本仓库名（2026-11-09 用户立，工具强制）**：`<仓库名>-<事项>`，事项 slug 也不许恰好等于另一个项目 / 子项目的名字——`dev-agent-turn-diff` 这种名字会让人误以为是 turn-diff 子项目的 worktree，实际上它是 dev-agent 主仓库的分支，用户在文件系统里看不出归属。子项目的活就在子项目的 worktree 里干（`git -C <子项目> worktree add ../<子项目>-<事项>`），不要给子项目在 Agent 项目仓库里建 worktree。守卫：`~/.pi/agent/extensions/worktree-name-guard.ts`；
- 每个 worktree 首次进入装依赖（`bun install --frozen-lockfile` / `npm ci`），node_modules 不共享；
- 写全局共享目标的命令（如安装到系统位置的 sync 类脚本）不要在多个 worktree 并行跑；
- 一个分支同一时刻只能存在于一个 worktree。

## 第 3 步：测试先行——Leader 出测试（先红）

**适用范围（2026-11-13 用户立）**：测试先行 + 测试开发分离 + 测试文件写保护这套严格范式，**只对 dev-agent（Atlas）名下的子项目强制**。判据：仓库在 `~/.pi/agent/docs/agents-registry.md` 的「子项目映射」表里归属 `dev-agent（Atlas）`。其它 agent 的项目不涉及复杂软件开发，不套用这套范式——它们的核心开发照走本 skill 的 Issue / 分支 / PR / CI 部分，测试由开发者按需自行编写、不受写保护限制（`test-cases-guard` 按此范围放行）。

分支建好后，**开发的开工条件是「分支上已有测试、且自跑见过红」**——没有测试不开工。角色与流程见 `references/test-cases.md`（本步前读一次）：

1. **谁出题**：该子项目的 **Leader（dev-agent 会话）自己出题**。独立的测试 agent（Hopper）已于 2026-11-13 从团队除名，测试定义权并入 Atlas；不再有「把出题任务写进另一个项目 `TODO.md`、再叫人去做」的转交环节，也不需要独立会话代行。**Worker（子项目会话）不写测试**，它只按 Issue 实现。
2. **怎么出题**：读 Issue → 用项目现有测试框架在**项目正式测试位置**写测试（带 `# TEST_CASES_WRITE_OK` 标记写入，hook 对无标记的写操作照拦）→ **自跑确认红**（实现还不存在，断言必红——这一跑验证的是「断言真的在测东西」，防永真断言；碰巧绿了说明断言无效或 Issue 没写清，回头查，不硬交）→ 交付自检（类型检查 + 目标范围全量测试：预期红仅限本次新用例，任何非预期红修完再交）。**只写对外可观察行为**（CLI 输出 / 退出码 / 文件产物 / UI 状态 / 错误信息），禁止断言实现细节（私有函数、内部数据结构、调用顺序）——那会把方案锁死成需求，也让测试在合理重构时误红。
3. **测试落盘方式（2026-11-13 修订，取代「留在工作区」）**：测试写完在功能分支上**本地 commit 一次，不 push、不开 PR**。原因：Leader 与 Worker 共用同一个 worktree，工作区里未提交的测试没有任何保护——Worker 改了也无痕迹；本地 commit 后 Worker 一改测试就立刻在 `git diff` 里显形（可审计）。「不 push」这条照旧保留（原因见下），所以「测试单独一个 PR 把 Issue 提前关掉」的事故不会重现。
4. 测试就位后 Worker 接手同一分支。**测试文件从这一刻起对 Worker 只读 + 可运行**（见第 4 步纪律 1）。

**测试不单独 push、不单独开 PR（2026-09-30 用户定的硬规矩，实质不变）**：测试与实现最终在**同一次 push、同一个 PR** 里进 main。功能分支上的 `/commit` 必然 push 分支 + 建 PR + auto-merge，所以「测试先交付 → 提交」实际等于「测试单独开一个 PR」；PR 描述又带 `fixes #<N>`，合并那一刻 GitHub 会把 Issue 关成 completed——ghostty-launcher 的测试 PR #2 合并 1 秒后 Issue #1 就被自动关掉，而实现还只在分支上。连带还会让 main 出现「测试已进、实现未进」的半程状态、CI 全量必红，破了 main 永远绿的底线。

**为什么测试先于实现**：写测试时实现不存在，只能按 Issue 的预期行为出题（防「照实现现状写断言」）；先红后绿验证断言有效性；需求被迫前置澄清（测试写不下去 = Issue 没写清，回第 1 步澄清而不是硬写）。

## 第 4 步：开发中的纪律

1. **测试文件全量只读 + 可运行，禁止增删改**：一切测试文件（测试目录 `test/` `tests/` `__tests__/` `spec/` `e2e/`、`*.test.*` `*.spec.*` `test_*.py` `*_test.go` `conftest.py` 等，含存量 `test-cases/`）只能读和执行，不能新建、修改、删除、移动——包括补测试也不行（测试归 Leader，防「写完实现补快照式测试把当前行为连 bug 固化进断言」）。本条已配套工具强制：pi 端 `~/.pi/agent/extensions/test-cases-guard.ts` 直接拦截指向测试目标的**写操作**（bash 写动词 / Write、Edit 工具 / `git` 的 `rm`、`mv`、`clean`、`restore`、`checkout`、`stash`——被 deny 时按提示走合规通道，不要绕过；守卫只对 dev-agent 名下的子项目生效）；**`git add` 入暂存区不拦**（2026-10-09 用户收窄：暂存不改变文件内容），见 `references/test-cases.md`。
2. **碰到测试或需求有问题 → 终止开发，向 Leader / 用户汇报**：具体问题（测试跑不起来、断言疑似与 Issue 预期不符、Issue 含糊不清）+ 建议，请 Leader / 用户对齐：改 Issue（编辑 / 评论澄清）→ Leader 按新 Issue 改测试 → Worker 继续。绝不通过改测试来绕过问题——这是 LLM 的著名失败模式（改不动代码就放宽断言），本流程从结构上禁掉它。
3. **版本号不在功能分支 bump**：多个并行分支各自 bump 必然冲突，正式版本号递增由发版流程统一处理（`/bump` 经 bump 分支 + PR 改齐后进 main）。预发布 tag 的后缀版本号（`-rc.N` / `-beta.N`）只存在于 tag 与 Release 层面，不写进版本文件——同样不违反本条。
4. **CHANGELOG 条目写在自己的段落**：记录「为什么改 + 改了什么」；不同分支写的条目落在不同位置，git 能自动合并。避免和别的分支同时新建同一个版本标题。

## 第 5 步：对齐 origin/main + 检查 Issue 与测试变更

功能开发完成后，把远端 main 合进当前分支：

```bash
git fetch origin && git merge origin/main
```

注意基准是 `origin/main` 而非本地 main——远端是权威（本地 main 可能落后，且合并动作发生在远端 PR）。merge 后**必查两件事**：

1. **Issue 有没有变**：`gh issue view <N>` 对比开发期间 Issue 有没有编辑 / 评论补充（需求变了实现要跟上——开发期间需求悄悄变了而实现还照旧，是隐性返工的最大来源）；
2. **测试有没有变**：Leader 先行写好的测试此时已在分支上（本地 commit、未 push），用 `git log -p` / `git diff` 核对测试有没有被改过——变了先重新对齐理解，再进下一步。

有冲突照常解决，解决结果会被本地全量测试 + 远端 CI 双重覆盖验证。

## 第 6 步：本地全量测试（机器门禁·预检）

在分支上本地跑项目全量测试：**项目全部测试（含 Leader 先行写的测试）+ 类型检查**（如 `bun test` / `npm test` + `tsc --noEmit`，按项目技术栈）。口径就一条：**全绿**——新测试从红转绿（本次目标）+ 既有测试保持绿（回归防护）。

本地预检的价值是**快速反馈**：红灯本地修，省「push → CI 红 → 拉日志 → 修复 → 再 push」的往返。**权威裁决在第 7 步的远端 CI**——本地绿不豁免 CI（同一口径双跑，环境差异由 CI 的干净环境兜底）。红灯是分支上的正常工作状态（不是事故——main 红才是事故），修到绿再 push。注意：红灯若是**测试本身的问题**（断言与 Issue 预期不符），走第 4 步纪律 2 的终止上报通道，不是改实现迁就测试、更不是改测试。

## 第 7 步：开发完成 + 本地全量绿 → push + 建 PR（fixes #N，测试与实现同一 PR）+ enable auto-merge

本地全绿后：

```bash
git push -u origin <分支名>
gh pr create --base main --title "<标题>" --body "fixes #<N>

<摘要>" # AI_SENSITIVE_CHECKED
gh pr merge <分支名> --squash --auto --delete-branch    # enable auto-merge
```

- PR 描述带 `fixes #<N>`——**合并时 GitHub 自动关闭对应 Issue**（测试与实现同 PR 进 main，Issue 状态机随之闭环，无需任何归档动作）。**PR 只在开发完成、本地全量测试全绿之后创建一次，内容 = 测试 + 实现**；**禁止为测试单独开 PR**（测试先上 PR 会让 `fixes #<N>` 把 Issue 提前关掉、main 出现半程状态——原因与事故实证见第 3 步「测试产物不单独提交、不单独开 PR」）。
- **建 PR 前先过公开文本自检**（2026-10-03 增补）：title / body 定稿后按 commit skill「公开文本敏感自检」节检测（gitleaks + AI 三类语义检查），命中改写后重新自检；`gh pr create` 须带 `# AI_SENSITIVE_CHECKED` 标记——public-text-guard 硬拦截，未带标记一律 deny。
- PR 建立即触发远端 CI（`pull_request` 触发），在 GitHub 干净环境跑第 6 步同一套全量；**CI 绿后 GitHub 自动 squash 合并进 main、删除远端分支**——合并的唯一门禁是 CI（不等人工验收）。复杂项目 CI 可能较慢，这个等待窗口正好先走第 9 步的预发布（rc.1），让用户开始试用。
- CI 红 → 拉日志定位（`gh pr checks --watch` / `gh run view --log-failed`）→ 本地修复 → 走 `/add` → `/commit`（预检完全干净则自动衔接 commit + push；2026-10-01 / 2026-10-04 规则；被 add-mode / commit-mode 暂停的项目按开关边界停在对应阶段）→ CI 对新 head 自动重跑（auto-merge 在最终绿掉的那次 head 上执行）。
- squash 合并后 main 新 commit 的树 == PR head 的树（squash 只压缩提交历史、不改文件内容）——「合并进 main 的内容 == CI 测过的内容」的物理基础（完整论证见 `references/merge-discipline.md`）。
- 合并后 main 上的 CI（`push` 触发）再跑一遍全量——最终确认 + 回归防护网持续生效（新测试从此常驻防护网）。
- 开发过程的 push 属本 skill 流程内授权；**提交与推送走 add / commit skill 的既有授权**（`/add` 预检完全干净 → 自动衔接 `/commit`；工作区 / 暂存区有待提交内容 → 常设授权直接按流程提交；2026-10-01 / 2026-10-04 用户立；2026-09-22「commit 一律由用户亲自执行」的旧口径已废止；被 add-mode / commit-mode 暂停的项目按开关边界处理）；**所有 git 命令带 `git -C <worktree 绝对路径>`**（worktree 是任务的正常战场，2026-11-04 用户立）；杂事 / bump 分支同样走 `/add` → `/commit`（push 后顺手建 PR + enable auto-merge）。

## 第 8 步：合并后收尾

CI 绿、auto-merge 完成后（Issue 已由 `fixes #N` 自动关闭；配了 auto-rc 的项目：合并后的 main push CI 再跑一遍全量、绿后自动发新 rc 供试用，见第 9 步）：

1. **清理 worktree**：`git -C <主工作区> worktree remove ../<仓库名>-<功能名>`（测试包产物放 worktree 的 tmp/ 下，随 worktree 一起清）；远端分支已随 `--delete-branch` 删除，本地分支确认已合并后 `git -C <主工作区> branch -d <分支名>`。
2. **同步其它活着的 worktree**：本次功能合并进 main 后，在各 worktree 目录 `git -C <各 worktree> fetch origin && git -C <各 worktree> merge origin/main`——早对齐，冲突小；分支活得越短，冲突窗口越小。

## 第 9 步：使用验收（过程，不是瞬时门禁）

用户以**实际使用**验收：装上**正式版**用一段时间（小时到天级），按 Issue 正文（复现步骤 / 预期行为）逐条核对 + 体验界面、手感、文案这些难以用例化的维度。**验收是过程、且发生在发版之后**：合并不等它、发版也不等它——修复 / 功能合并进 main 后由发版链自动发正式版（2026-10-09 用户明确：「修复合并进 main 之后就应该自动发布正式版」），用户装上正式版实际使用即为验收。开发 Agent 在此阶段待命接反馈、执行修复循环（发现问题 → 新 Issue + 测试先行 → 修复合并 → 补丁版自动发版）。

- **预发布（主通道）**：走真实发布链路验收（`--prerelease` 标记的 GitHub Release，用户从 Release 页安装），兼供早期尝鲜；预发布一律不 bump 版本文件。两条供料通道：
  - **自动（配了 auto-rc workflow 的项目，推荐）**：合并进 main 的 CI 全绿后自动打 `v<目标版本>-rc.N` tag 发 Release——验收对象随每次合并自动就位，修复循环的递增预发布号（rc.2、rc.3…）也自动随之而来，AI 与用户都无需手动发。合并前想更早开始试用（CI 慢的窗口期）可手动从功能分支发（见下条）。
  - **手动（未配 auto-rc，或合并前提前试用）**：从功能分支（合并前）或 main（合并后、带修复）打 `v<目标版本>-rc.N` / `-beta.N` 的 prerelease tag，产物从对应分支构建；操作规范见 release skill 预发布通道。
  - 完整规矩（版本号推导、notes、试用处置）见 `references/acceptance.md`（进本步前读一次）。
- **发现问题 → 修复循环**：开新 Issue（或复用原 Issue 评论跟进）→ Leader 先写复现问题的失败测试（先红）→ fix 分支实现到绿 → push + PR + enable auto-merge（CI 绿合并）→ 递增预发布号（rc.2）再试用。修复期间 main 持续前进是正常的——CI 保证每一步都绿，用户验收的对象是「试用中的预发布版本 + 持续演进的现实」，不是某个冻结时点。
- **本地测试包（轻量选项）**：快速冒烟（构建验证 + 即时装）用本地构建的测试包装 worktree 的 tmp/ 即可，规矩见 `references/acceptance.md`；完整验收以预发布为主。
- **需求本身要变**（用户用完想改主意）→ 更新 Issue（编辑 / 评论写清新需求与新验收标准）→ Leader 按新 Issue 重出 / 改测试（出题时不能见过实现——在实现开工前写、或另开一个只看 Issue 的会话出题，信息隔离必须自己守住）→ 迭代走新一轮分支循环。需求变更不经这条通道、开发 Agent 自己揣摩着改，会做成「没人定义过的需求」。

## 第 10 步：正式发版（人工门禁的落点）

修复 / 功能合并进 main 后自动发版：**`/bump`**（建 bump 分支改齐版本号）→ **自动衔接 `/add`**（预检 + git add）→ 预检完全干净时继续自动衔接 **`/commit`**（push + 建 PR + auto-merge）→ CI 绿合并进 main → **commit skill 第 10 步自动衔接 `/release`** 打正式 tag + 发 Release——2026-10-02 起整条链全自动。**入口两种**：① 用户主动 `/bump`；② 功能 / 修复合并后的 `/commit` 流程（含 `/add` 自动衔接）走到第 10 步、检测到「有新提交（含 fix / feat 类改动）但未 bump」时**自动触发 bump 链条**（用户 2026-10-02：「不要提示我 bump」）——即合并进 main 的功能 / 修复内容会被链条自动发成正式版（**纯文档 / 杂事类不发版**——2026-10-13 用户立）。**门禁分工**：CI 管客观回归、独裁合并（2026-09-21）；**发版不再等人工试用**（2026-10-09 用户明确：「修复合并进 main 之后就应该自动发布正式版」）——验收在发版之后进行（装上正式版实际使用），发现问题走修复循环 + 补丁版；需要提前试用时用预发布通道，但预发布不是正式发版的前置。

## git / gh 授权边界（与全局纪律衔接）

**触发本 skill（用户要求开发核心功能）= 授权流程内的本地与远端编排操作**：`git worktree add` / `git switch -c` / `git merge origin/main`（对齐）/ `git push`（功能分支）/ `gh pr create`（建前过公开文本自检、带 `# AI_SENSITIVE_CHECKED` 标记）/ `gh pr merge --squash --auto --delete-branch`（enable auto-merge 是标准动作——合并由 CI 门禁独裁，无需用户逐次点头）/ `gh issue create`（代为执行，内容以用户口径为准；同为公开文本，建前自检、带标记）/ `git worktree remove`，以及本地测试与构建、预发布 tag + `gh release create --prerelease`（第 9 步验收来源）。**`git commit` 的授权按 add / commit skill 的现行规则执行**（2026-10-01 起 `/add` 预检完全干净即自动衔接 commit；2026-10-04 起常设授权「工作区 / 暂存区有待提交内容就直接按 /add 或 /commit 流程处理」；**2026-09-22「commit 一律由用户亲自执行」的旧口径已废止**）：AI 在开发完成后直接走 `/add`（预检 + git add）→ 预检完全干净则自动 `/commit`（commit + push + PR + auto-merge 一条龙），被 add-mode / commit-mode 暂停的项目按开关边界停在对应阶段。**全部 git 命令带 `git -C <worktree 绝对路径>`**——worktree 是任务的正常战场，会话 cwd 常停在 main 主工作区（2026-11-04 用户立）。**不改写 main 历史、不 force push、不触碰暂存区已有内容**（暂存区只增不改）。杂事 / bump 分支的提交 + push 同样走 `/add` → `/commit`；正式发版走全自动链：`/bump` → `/add` → `/commit` → `/release`（`/bump` 用户主动触发、或 commit 流程检测需要 bump 时自动触发，均预授权整条链；2026-10-02 起）。

## references（按需加载）

- `references/test-cases.md` — 测试体系全貌：Leader 出题（只覆盖 dev-agent 子项目）、为什么需要信息隔离、测试先行时序、测试文件位置与权限（hook 强制）、Issue 作为需求端、CI 集成规范。**第 3 步测试先行前读。**
- `references/acceptance.md` — 预发布试用与发版验收的完整规矩（验收作为过程、修复循环、本地测试包选项）。**第 9 步进验收前读。**
- `references/merge-discipline.md` — PR 合并纪律：角色与门禁分工、分支保护配置与首次启用顺序、并行 PR、squash 树等价、修复循环。**第 7 步遇 CI 红 / 合并被挡、第 9 步修复循环时读。**
