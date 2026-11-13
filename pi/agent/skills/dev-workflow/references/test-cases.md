# 测试体系：测试先行、权限与 CI（只覆盖 dev-agent 子项目）

本文件是 dev-workflow 第 1 / 3 步的支撑细节，回答五个问题：需求从哪来（Issue）、测试谁来写（该项目的 Leader）、什么时序写（先红后绿）、Worker 有什么权限（只读可运行 + hook 强制）、CI 怎么集成。

## 适用范围（2026-11-13 用户立，先读这段）

**这套严格范式只覆盖 dev-agent（Atlas）名下的子项目**——ghostty-launcher、pi-harness、ghostty、cmux、turn-diff、codef、mp4-player、XPilot（清单以 `~/.pi/agent/docs/agents-registry.md` 的「子项目映射」表为准）。判据：仓库在该表里归属 `dev-agent（Atlas）`。

其它 agent 的项目**不套用这套范式**：它们不涉及复杂软件开发，测试由开发者按需自行编写，不受测试文件写保护限制（`test-cases-guard` 按此范围放行）。它们的核心开发仍走 dev-workflow 的 Issue / 分支 / PR / CI 部分，只是没有「测试先行 + 定义权分离」这一层门禁。

## Issue 作为需求端与状态机（2026-09-21 三次修订立，取代 test-cases 目录体系）

- **遇到问题 / 想要功能随手开 Issue**：正文写清**复现步骤 / 预期行为**——bug 给复现，功能给预期。它同时是需求文档、验收标准、测试的雏形（复现步骤天然就是测试脚本的骨架：构造场景 → 断言预期）。有空再解决，Issue 池就是 backlog（标签排优先级、milestone 分组、跨设备随手记）。
- **状态机由 Issue open / closed 承担**：开发 → 测试 → PR 描述带 `fixes #<N>` → CI 绿合并 → GitHub 自动关闭 Issue。`pending/ → passed/` 目录状态机与「归档挪动」动作已于 2026-09-21 整体取消——需求做完没有（open / closed）、测试守着没有（在正式测试位置常跑），两个问题各归其位。
- **需求变更 = 更新 Issue**：编辑正文或评论补充新验收标准 → Leader 按新 Issue 重出 / 改测试 → 迭代走新一轮分支循环。讨论与澄清沉淀在 Issue 评论里，随时可翻。

## 角色分工与测试先行（谁写测试、什么时序）

**测试开发分离在 2026-11-13 之后指的是「写断言的手与写实现的手分开」，不再是「两个 agent」**：Hopper（TestEngineerAgent）已于该日从团队除名，测试定义权并入 Atlas（dev-agent）。现在由 Leader（dev-agent 会话）出题、Worker（子项目会话）实现。

**这道分离由两层墙撑着**：

- **时机墙（信息隔离）**：测试在**实现开工之前**写，worktree 从最新 main 开出、分支上还没有任何实现。此时想「照实现现状写断言」也没有实现可照——这正是测试先行唯一不可替代的价值，也是取消独立测试 agent 后仍然必须守住的一条。
- **权限墙（工具强制）**：Worker 对测试文件的写入被 `test-cases-guard` 直接拦（见下方「测试文件的位置与权限」）。

**诚实说明这条方案的弱点**：Leader 出题时脑子里可能有自己拟定的技术方案，容易把断言写成「锁定我打算怎么实现」。对策是把断言限制在**对外可观察行为**这一层（CLI 输出 / 退出码 / 文件产物 / UI 状态 / 错误信息），禁止断言私有函数、内部数据结构、调用次数与顺序——这样即便心里有方案，写出来的也只能是用户看得见的契约。写测试前先重读 Issue、不要先读自己的实现草案。

**先红后绿的时序（分支内先行）**：

1. 功能分支建好后，Leader 读 Issue → 用项目现有测试框架写测试 → **自跑确认红**（实现还不存在，断言必红——这一跑验证「断言真的在测东西」，防永真断言；碰巧绿了说明断言无效或 Issue 没写清，回头查，不硬交）→ 交付自检（类型检查 + 目标范围全量测试：预期红仅限本次新用例，任何非预期红修完再交）。
2. **测试写完在功能分支上本地 commit 一次，不 push、不开 PR**（2026-11-13 修订，取代原来的「留在工作区不提交」）。原因：Leader 与 Worker 共用同一个 worktree，工作区里未提交的测试没有任何保护——Worker 改了一改，diff 里看不出来；本地 commit 之后，Worker 一改测试就立刻在 `git diff` 里显形。不 push 这条照旧保留（见下），所以「测试单独一个 PR 把 Issue 提前关掉」的事故不会重现。
3. Worker 在这个 commit 之上写实现 → 本地全量绿 → `/add` → `/commit`（push + 建 PR + enable auto-merge）→ **测试与实现在同一次 push、同一个 PR** 里进 main（PR 描述带 `fixes #<N>`，CI 绿 auto-merge 时 Issue 正常闭环）。
4. **测试先行是分支内的先行，不是 main 上的先行，也不是「先 push、先开 PR」的先行**：实现不存在时测试单独进 main 会让 CI 全量必红、auto-merge 体系崩掉；测试单独成 PR 还会让 `fixes #<N>` 把 Issue 提前关掉、main 留下半程状态（ghostty-launcher 测试 PR #2 的实测事故）。main 永远只见「红绿闭环过」的完整状态。

**为什么必须先写而不是后补**：后补测试最大的风险是「快照式测试」——跑一遍当前行为、断言当前行为，连 bug 一起固化进断言，测试永远绿、防护等于零（LLM 写完实现后补测试尤其容易这样）。先写时实现不存在，只能按 Issue 预期出题；先红验证过断言会咬人。

**测试规模与需求体量匹配**：小 bug 一条聚焦断言（Issue 的复现步骤直接翻译），大功能成组用例——两头失衡都不行（五分钟改动配半小时用例是失衡，大功能配三条浅断言同样是失衡）。

### 谁可以写测试

- **Leader（dev-agent 会话，唯一常规通道）**：在子项目 worktree 里写测试（带 `# TEST_CASES_WRITE_OK` 标记）、自跑见红、本地 commit。
- **用户手写**：同样带 `# TEST_CASES_WRITE_OK` 标记写入。
- **Worker（子项目会话）不写测试**：只能读 + 运行；碰到问题终止开发、上报 Leader / 用户。

## 测试文件的位置与权限

- **位置：项目正式测试位置**——按项目测试框架的惯例放（`tests/`、`test/`、`__tests__/`、`packages/*/test/`、`spec/` 等），CI 的全量测试命令天然含它们，合并后常驻回归防护网。不再有专门的 `test-cases/` 目录与 pending/passed 结构。
- **Worker 对测试文件全量只读 + 可运行，禁止增删改**：包括新建（补测试归 Leader——防「写完实现补快照式测试」）、修改、删除、移动，覆盖测试目录、测试文件名、测试基础设施（conftest、test helpers、fixtures——运行测试需要的伴生文件缺了不自己补，阻塞上报）。唯一豁免是测试运行自产的缓存（`__pycache__`、`.pytest_cache`、coverage 输出等——配合 .gitignore 兜底；知情清理走授权标记）。
- **hook 工具强制（2026-09-21 扩展为测试文件全量保护；2026-11-13 收窄到 dev-agent 子项目）**：按「规矩必须配套工具强制」元规则，本条已落工具强制——pi 端 TS extension `~/.pi/agent/extensions/test-cases-guard.ts`（2026-10-17 起为唯一实现）：
  - **保护对象**：存量 `test-cases/` 目录 + 测试目录独立段（`test` / `tests` / `__tests__` / `__snapshots__` / `spec` / `e2e`）+ 测试文件名（`*.test.*` / `*.spec.*` / `test_*.py` / `*_test.py` / `*_test.go` / `conftest.py` / `*.snap`）——整段 / 全名匹配，不误伤 `latest`、`contest`、`testcase` 等含 test 字样的普通路径；
  - **作用范围**：只对 `agents-registry.md` 里归属 `dev-agent（Atlas）` 的子项目生效（按仓库根目录名与该表比对）；其它仓库不拦；
  - **拦截语义**：Write / Edit 写入上述目标、Bash 命令中显式指向上述目标的写类操作（rm / mv / touch / mkdir / tee / cp 目标 / sed -i / 重定向 / find -delete / git rm|mv|clean|restore|checkout|stash）一律 deny；一切读操作与跑测试命令天然放行；
  - **授权标记 `# TEST_CASES_WRITE_OK`**：命令末尾带此标记则整条放行——Leader 出题写入、用户授权的例外操作（缓存清理等）走此通道（与杀 VSC 进程 hook 的 `# AI_AUTHORIZED_KILL_VSC` 同模式）。合法写入被 deny 时，应把写入内容先落到项目 `tmp/`、再用带标记的 Bash 命令拷入，或交用户手动操作——不做无标记的绕过。
- **测试命令配置的边界**：跑测试的命令配置（如 package.json 的 `test` script、CI 里的测试命令）Worker 不动——要改走 Leader / 用户（这些配置决定「跑什么测试」，属测试体系的一部分）。
- **强度边界（知情）**：hook 拦「显式路径的写命令」，拦不住命令内部代码的文件操作（python -c 里 open('w')）；**`git add` 把测试文件入暂存区不拦**（2026-10-09 用户收窄：暂存不改变文件内容，而测试与实现要同一次提交、需要 Worker 能把测试文件入暂存区）。拦测试写入防的是「改测试迁就实现」与「补快照式测试」，防不了「改实现 hack 骗测试」（在源码里 hack 让断言恰好通过）——这层靠用户实物验收（预发布产物是真实现的产物，hack 骗得过测试骗不过人手实测）+ 重要功能由 Leader 复核兜底。

## CI 集成：回归防护网进 CI（2026-09-21 立）

远端 CI 是机器门禁的权威载体（本地全量测试是预检，CI 是合并前置）。`.github/workflows/ci.yml` 最小规范：

- **触发器**：`on: pull_request`（目标 main，机器门禁主通道）+ `on: push: branches: [main]`（合并后最终确认 + 回归网持续生效）。
- **执行内容**：与本地第 6 步同一口径——项目全量测试（正式测试位置的测试天然全含，含 Leader 先行写的新测试）+ 类型检查（如 `npm test` + `tsc --noEmit`）。
- **required status checks**：ci.yml 的 job 须在分支保护里设为 required（配置清单与首次启用顺序见 `merge-discipline.md`——先 ci.yml 进 main、再开保护设 required，反序死锁）。**没设为 required 的测试等于没写**：它跑了但不拦合并，红灯也就只是装饰。
- **新项目**：首次走 dev-workflow 时由第 1 步开工门禁引导建立（同样先 CI 进 main、后开保护）。
- **CI 红的处置**：`gh pr checks --watch` 盯状态，`gh run view --log-failed` 拉失败日志，本地修复后 push，CI 自动重跑；本地与 CI 结果不一致时以 CI 为准（干净环境为权威）。红灯若是测试本身的问题（断言与 Issue 预期不符），走「终止上报」通道而不是改实现迁就或改测试。

## 存量 test-cases/ 目录

- hook 保留对 `test-cases/` 的保护（存量项目不迁移也安全：旧用例留在原地继续被 CI 全量跑，等效于 passed 用例的回归防护）。
- **2026-11-13 实测**：dev-agent 名下 8 个子项目**都已没有 `test-cases/` 目录**，不需要迁移。原 Hopper 项目里的 `cases/` 存量（zcode-cli 两组未完成需求）随其除名一并清理，见 dev-agent `TODO.md` 的 T3。