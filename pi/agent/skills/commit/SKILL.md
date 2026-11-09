---
name: "commit"
description: 提交当前暂存区已有内容并推送远程（git commit → git push；不执行 git add；无远程则先 gh repo create --public 再推送）。MUST USE 当用户输入 /commit、说「提交一下」「commit 吧」「推到远程」时，或由 /add 预检完全干净（至少 1 个文件入库、需人工过目 / 不建议入库均为 0）后自动衔接（main 上有改动自动建 worktree 搬过去再衔接，不询问不汇报；**worktree 分支属正常自动衔接范围**）。**worktree 场景**：会话 cwd 常在 main 主工作区、任务在 AI 建的 worktree 里做——全部 git 命令带 `git -C <worktree 绝对路径>`（禁止 cd），0a / 9z 的本地 main 对齐改在主工作区执行，第 10 步按「HEAD 已进 origin/main」判定。最前置做远端 main 对齐检测（纯落后拉取对齐、分叉暂停询问）；main 上一律先建分支再走 PR 通道（建分支 → commit → push → 建 PR → auto-merge，不直推 remote main）；功能 / 杂事 / bump 分支 push 后建 PR + enable auto-merge，CI 绿自动合并，合并后对齐本地 main、清理分支。commit 前做敏感扫描 + cache 检测（命中即终止、须重新触发；cache 命中自动加 .gitignore），commit message / PR / Issue 等公开文本另过敏感自检。push 后补齐项目标配（README 双语 + LOGO + 徽章、LICENSE / CHANGELOG / VERSION、About、Sponsors）并做版本号一致性检测。第 10 步自动衔接发版：完整成功且干净、在 main 与远端同步、自最新 tag 有 fix / feat 类新提交时，版本就绪直接进 /release，未就绪先走 /bump → /add → /commit → /release 整条链（不提示、不询问）；纯文档 / 杂事类不发版。NOT for：git add 预检（add）、打 tag 发 Release（release）、改版本号（bump）。
---

# Auto Git Commit & Push

当用户输入 `commit` 时，或由 add skill 预检完全干净后自动衔接时，先做远端 main 对齐（remote main 领先本地 main 且本地不领先则拉取对齐，分叉或有矛盾则暂停询问，见第 0a 步），再把**当前暂存区已有的内容**提交到本地仓库并推送到远程（**依次执行 `git commit` → `git push`**，不执行 `git add`，只提交暂存区已有内容——来源两种：经 `/add` 预检加入（2026-09-22 起授权例外）或用户手动 `git add`），**推送完成后再补齐项目标配**（README/LICENSE/CHANGELOG/VERSION/About/Sponsors，含版权人/署名引用名字统一为 `xhqing and contributors` 格式）。敏感内容扫描、cache 文件/目录检测是 `git commit` 之前的两项检测（均针对暂存区已有内容，任一命中即终止）；版本号一致性检测（项目根有 `VERSION` 文件才查）及其余项目标配检测全部放在 `git push` 之后，不阻塞提交流程。**流程末尾（第 10 步）做自动发版衔接**：本次流程完整成功且工作区 / 暂存区干净、在 main 与远端同步、自最新 tag 有新提交**且含功能类改动（fix / feat——核心功能的修复 / 新增）**时——版本就绪 → 自动进入 `/release` 完成发版；未就绪 → 自动走 `/bump` → `/add` → `/commit` → `/release` 整条链补齐版本并发版（不提示、不询问）（2026-10-02 用户立，见「核心定位」与第 10 步）。**仅文档 / 杂事等非功能类改动 → 不发版、不 bump**（第 10 步检测后跳过、汇报说明；确需发版可手动 `/bump` / `/release`）（2026-10-13 用户立：「只有 fix 和 feat 核心功能的修复和新增核心功能才触发发版」）。

## 核心定位：先提交推送，再补标配

- **触发与终止规则（2026-07-15 用户立，最高优先级；2026-09-06 增补 main 分支感知，2026-09-07 修订为 main 直推，2026-09-21 修订为 PR 通道）**：
  - **触发判定（来源两种，2026-10-01 修订）**：① **用户当前这条消息**含 `/commit` 且**意图确为「现在执行提交」**——**不看历史消息**（历史里有 `/commit` 不触发、不续跑）；**当前消息即便字面含 `/commit` 也要先理解意图**，若是在讨论 / 举例 / 引用 `/commit` 或意图非提交（如「这条含 /commit 但不是要 commit」），**不触发**。② **add skill 预检完全干净后的自动衔接**（2026-10-01 用户立）：`/add` 流程结束时预检结果「至少 1 个文件入暂存区 + 需人工过目 0 个 + 不建议入库 0 个」→ 由 add skill 直接进入本流程（全局 AGENTS.md 授权形式③）。**⚠️ ② 主工作区的 main 分支上不直接衔接，而是自动搬运后再衔接（2026-11-03 用户立；2026-11-05 用户改为全自动）**：local main 只剩「生成 worktree」「被 remote main 快进同步」两个职责，主工作区停在 main 时不直接衔接 commit（也不停在原地等用户）——发现 main 有改动直接跑 `python3 ~/.pi/agent/patch/worktree-adopt/worktree-adopt.py --repo <主工作区>`，把改动搬进新 worktree 功能分支，然后就在那个 worktree 上自动衔接本 skill，**不询问、不汇报**（`main-wip-guard.ts` 在 `agent_settled` 时自动兜底）（工具强制：`git-main-guard.ts` 拦 main 上的 `git commit`；逃生门 `# AI_AUTHORIZED_COMMIT_MAIN` 仅限用户当轮授权）。**worktree 的功能分支不属这条限制**——用户的常规工作流是「在 main 开会话 → AI 建 worktree → 任务全程在 worktree 完成并提交」，worktree 分支是 `feat/xxx` / `fix/xxx` / `chore/xxx`，自动衔接照常生效。除这两种来源外**不自发、不续跑、不自动进入**。
  - **分支感知三通道（2026-09-21 用户修订：remote main 恢复分支保护、锁定直推，一切经 PR + CI 合并——2026-09-07 的「main 不设保护直推」模式废止）**：① 当前在 `main`（或 `master`）分支 → 走正常完整流程：commit 前两项检测（敏感扫描 + cache 检测）与 `git commit` 照常执行，`git push` 远程 main——**仅当远端 main 无分支保护时这条直推通道可用**（保护已开的仓库 push 会被拒，第 8 步分流：自动走 PR 兜底通道——建分支 + push 分支 + 建 PR + enable auto-merge，CI 绿自动合并，2026-09-21 起）；② 当前在功能 / 杂事 / bump 分支 → commit → push 分支 → **顺手建 PR**（若该分支尚无 open PR）并 **enable auto-merge**（CI 绿自动 squash 合并）——远端 PR + CI 是 2026-09-21 起一切进 main 内容的合并通道，合并由 CI 独裁、不等人工验收（dev-workflow：用户验收移到预发布试用 + 正式发版环节）。详见执行流程第 0 / 8 步。
  - **命中即彻底终止**：流程中一旦命中敏感内容扫描或 cache 检测，**立即终止本次 `/commit`**（不 `commit` / `push`），**不存在「暂停 → 等用户处理 → 从断点继续」**；要再次提交，用户须**重新输入 `/commit`** 从头走完整流程。（版本号一致性检测不阻塞提交，已移至 push 后第 9k 步处理。）
- **流程最前置：远端 main 对齐检测（2026-09-21 用户立，第 0a 步；worktree 变体 2026-11-04 增）**：一切步骤（含分支感知）之前先 `git -C <目标工作区> fetch origin` 比较 remote main 与本地 main——远端领先、本地不领先（纯落后，典型如 PR 被 CI squash 合并后本地没跟上）→ 直接拉取对齐（主工作区场景：当前在 main 用 `git pull --ff-only origin main`；**worktree 场景：在主工作区用 `git -C <主工作区> merge --ff-only origin/main`**——worktree 里 `git fetch origin main:main` 会 fatal，见「worktree 场景」节）；两边分叉（各有领先提交）或拉取失败等矛盾 → 暂停询问用户，不自行改写历史；远端不领先或无 origin remote → 无需对齐直接继续。为什么放最前面：本地 main 落后远端时走到第 8 步 push 必撞 non-fast-forward，先把对齐做在一切之前。0a 与流程末尾的 9z 步（等待 PR 合并后对齐本地 main，2026-09-22 立）互补：9z 管当次 `/commit` 的闭环（PR 合并后当次对齐、不留尾巴），0a 兜底 9z 覆盖不到的场景（跨会话产生的落后、9z 超时未合并、9z 异常即停后的处理）。
- 本 skill **依次执行 `git commit`、`git push`**：提交暂存区已有的内容到本地仓库，再推送到远程（**不执行 `git add`**，提交内容以暂存区已有内容为准（来源：`/add` 预检加入或用户手动 add）。
- **两步用 `&&` 串联成一条命令一次性跑完（2026-07-17 用户立；2026-08-01 修订：去除 git add，改为只提交暂存区；2026-10-01 增补 /add 自动衔接来源）**：`git commit` + `git push` 两步**优先用 `&&` 组合成一个 Bash 命令**一次执行，不拆成多次 Bash 调用、不中途停下来向用户列命令确认——用户输入 `/commit`（或 `/add` 预检完全干净后的自动衔接，2026-10-01 立）即明确授权当次 commit+push（全局 `~/.pi/agent/AGENTS.md`「Git 写操作必须先征得同意」段的例外已写明），再列命令确认是多余的反 confirm。commit 信息基于 `git diff --cached` + `git status`（暂存区已有内容）生成，随后直接 `git commit -m "<msg>" && git push # AI_AUTHORIZED_COMMIT` 一条命令跑完两步。命令末尾的 `# AI_AUTHORIZED_COMMIT` 是 git-commit-guard（pi 端 `~/.pi/agent/extensions/git-commit-guard.ts`，2026-09-21 立）的授权标记：hook 对无标记的 `git commit` 一律 deny（commit 不论分支 / worktree / 流程须用户明确授权），用户输入 `/commit`（或 `/add` 预检完全干净自动衔接，2026-10-01 立）即明确授权当次 commit，故本 skill 的串联命令带标记放行；非 `/commit`、非 `/add` 自动衔接、非用户当轮明确授权、非跨会话委派（其它 agent 依用户 2026-10-04 立的常设授权发起）、非常设授权（工作区 / 暂存区有待提交内容即直接提交，2026-10-04 用户立「不用问我」）的场景，AI 不得擅自加此标记。**若 auto mode 权限分类器拦下其中某一条 git 写命令，不要退缩去问用户**——改用 `&&` 串联的组合命令继续执行（组合命令作为整体更易被识别为 commit 流程、不易被单点拦截）；commit 前的两项硬性检测（敏感内容扫描 + cache 检测，均针对暂存区已有内容）照常先做完、通过后才进入串联执行。main 推送（远端无分支保护时）与功能 / 杂事 / bump 分支推送场景同样是 `git commit && git push` 一条命令跑完（见第 0/8 步；建 PR 在 push 成功后进行）。本条同样适用 `/release` 等其它用户主动触发即授权的 skill。
- **commit 前检测有两项：敏感内容扫描 + cache 文件/目录检测**（均针对暂存区已有内容）；版本号一致性检测（项目根有 `VERSION` 文件才查）与 README/LOGO/徽章/版权署名/版权人与署名引用名字归一/LICENSE.md/CHANGELOG.md 与 VERSION 文件/About/仓库 Sponsors 按钮 等「项目标配」检测**全部放在 `git push` 之后**（第 9 步）——先提交推送代码，再补标配，补的内容作为新工作区改动，本次未提交；本 skill 不执行 `git add`，需用户自行 `git add` 后下次 `/commit` 提交。
- 标配检测：缺则自动补上；齐全则在项目根 `.commit-cache.md` 标记，下次跳过重复检测。
- **流程末尾自动衔接发版（2026-10-02 用户立，第 10 步；同日修订：未就绪自动 bump；2026-10-13 修订：仅 fix / feat 类改动触发发版）**：本次 `/commit` 完整成功且工作区 / 暂存区干净、在 main 与远端同步、自最新 tag 有新提交**且含 fix / feat 类（核心功能修复 / 新增）**时——**版本已就绪 → 直接自动进入 `/release` 完成正式发版；版本未就绪（未 bump / 滞后）→ 自动走 `/bump` → `/add` → `/commit` → `/release` 整条链完成发版**（用户原话「不要提示我 bump」——不提示、不询问，自动补齐版本后继续）。用户立此规则即预授权整条链，不二次确认；各环节安全阀（bump 的对齐 / 分叉暂停、add 的人工过目清单、commit 的敏感扫描 / cache 检测、release 的异常暂停）照常生效。为什么不「未就绪也直接触发 release」：未 bump 时 release 会撞上其第 3 步「tag 已存在」的误导性暂停（报 tag 冲突），正确顺序是先补齐版本（bump 链条）再发版。**2026-10-13 门禁**：纯文档 / 杂事等非功能类改动的提交**不发版、不 bump**——判定口径（前缀机械扫描 + 语义判读）、发版链内部豁免与跳过汇报见第 10 步；本门禁同步写进全局 AGENTS.md 与 release / bump / dev-workflow / add skill。详见第 10 步。
- **严禁**执行 `git push --force`、`git reset --hard` 等破坏性操作。
- **严禁**编辑、删除、格式化项目文件（例外仅九类：① README/LICENSE/CONTRIBUTING 标配补全——可编辑 `README.md`/`README_cn.md`（顶部 LOGO/徽章居中块 + 移除 Forks/Stars/Last Commit 等动态徽章（第 9l 步；访问量徽章已于 2026-11-04 取消，遗留的按违规删除） + persona 说明块 + 底部版权署名段 + 版权人/署名引用名字统一为 `xhqing and contributors` 格式（第 9g 步）+ 语言基调修正：把 `README.md` 里「本该用英文却写成中文」的正文改为英文（特殊场景的中文保留不动）+ 英文版跳中文版链接文字统一为「简体中文」（第 9h 步））、创建 `assets/logo.svg`、创建 `LICENSE.md`、**删除冗余的其它格式 license 文件**（只保留 `LICENSE.md`）；② 项目根 `.commit-cache.md` 写入缓存标记或「敏感扫描白名单」条目（不存在则新建；白名单条目仅按用户明确确认追加，见第 2 步）；③ 全局 `~/.pi/agent/docs/agents-registry.md` 的「智能体命名注册表」**追加**新 agent 行（仅 9d 起名时，不改已有行）；④ cache 检测——第 3 步检测到的 cache 文件/目录可新增进 `.gitignore`；⑤ 版本滞后提示（第 9j 步）——检测到 VERSION 滞后时只报告（第 10 步会据此自动衔接 bump 链条完成发版，2026-10-02 起），本 skill 不就地修改任何文件（版本号的实际修改归 bump skill 在 bump 分支上执行）；⑥ 版本号一致性同步（第 9k 步）——检测到 VERSION 与各文件版本号不一致时，以 VERSION 为唯一权威，更新 `package.json`、`package-lock.json`、`CHANGELOG.md`、主 manifest、README 的版本号到与 VERSION 一致（不动 VERSION 自身）；⑦ 新建 `CHANGELOG.md` 与 `VERSION` 文件（第 9m 步）——检测到项目缺这两个文件时按 9m 规则创建，不改动 `.gitignore` 的其它部分；⑧ **第 10 步自动衔接的 bump 链条**（2026-10-02 起）——版本号载体文件的改动由 `/bump` 环节按其 skill 职责执行（VERSION / package.json / CHANGELOG 版本条目 / manifest / README 版本声明与徽章等），本 skill 自身仍不直接改这些文件。
- 敏感内容扫描、cache 检测**均在 `git commit` 之前执行一次**（针对暂存区已有内容）；`git commit` 之后不再重复。（版本号一致性检测已移至 push 后第 9k 步，不阻塞提交。）

## 公开文本敏感自检（commit message / PR / Issue，2026-10-03 增补）

commit message、PR title / body、Issue 文本都是**公开文本**——commit message 进 `git log` 与 GitHub commits 页、squash 合并后还会沉淀进 main 历史；PR / Issue 文本在公开仓库立即可见。它们与暂存区文件内容不同，是**现场生成的新文字**，不在第 2 步暂存区扫描的覆盖内，需要单独自检：

- **时机**：commit message 在第 6 步生成后、`git commit` 前；PR title / body 在第 8 步 `gh pr create` 前；Issue 文本在 `gh issue create` 前（dev-workflow 场景）。命中敏感内容 → **改写文本**（不把敏感内容发出去），改写后重新自检。
- **方式**（与 release skill 第 4 步口径一致）：把定稿文本写入 `tmp/` 临时文件（用后清理）跑 `gitleaks dir <文件> --config ~/.gitleaks.toml --no-banner -v`（缺失 / 失败降级 AI 正则扫描）；再做 AI 三类语义检查——财务状况（收入目标、本金、资产、负债、存款等）、个人隐私标识（账户号、证件、真实联系方式、真实 IP / SSH 连接串、密钥实值）、敏感叙述（身份 + 网络出口 + 绕行手段的故事线、合规拒单报文原文、服务商节点代号）；拿不准按可疑处理。`.commit-cache.md` 的「敏感扫描白名单」按范围联动。
- **工具强制**：`gh pr create` / `gh pr edit` / `gh issue create` / `gh issue edit` 由 public-text-guard（pi 端 `public-text-guard.ts`）拦截——自检通过后命令带 `# AI_SENSITIVE_CHECKED` 标记放行；commit message 的敏感性无法从命令行文本自动判定，由本节的纪律约束。

## worktree 场景（2026-11-04 用户立：会话在 main 开、任务在 worktree 做）

用户**不会自己去 worktree 里操作**——他在 main 分支的主工作区开 pi 会话，worktree 是会话里让 AI 建的，任务也在 AI 手里完成。所以本 skill 必须能在「**会话 cwd 停在 main 主工作区、提交对象是另一个 worktree**」的上下文里跑完全程：

- **两个工作区要分清**：主工作区（会话 cwd，通常在 main，只负责生成 worktree 与被快进同步）／ 任务工作区（worktree，分支是 feat / fix / chore 类）。**提交、扫描、检测全部针对任务工作区；本地 main 的对齐与发版全部针对主工作区。**
- **全部 git 命令带 `-C <目标工作区绝对路径>`，禁止 `cd`**：`git-main-guard.ts` 不跟踪 `cd`（只认 `-C` 与进程 cwd），`cd <worktree> && git commit` 会被误判成「在 main 上提交」而拦下；反过来，漏写 `-C` 的 `git status` / `git diff --cached` 读的是主工作区——worktree 的工作区与 index 与主仓库完全独立（实测互不可见），会得出「暂存区无内容」的错误结论并静默结束流程。
- **worktree 里不能操作本地 main**（实测三条命令全部 fatal）：`git switch main` → `already used by worktree at <主工作区>`；`git fetch origin main:main` → `refusing to fetch into branch`；`git branch -f main origin/main` → `cannot force update the branch used by worktree`。所以本地 main 的一切对齐动作都改到主工作区执行（0a / 9z 的 worktree 变体）。
- **`gh` 命令不受此限**：gh 没有 `-C` 选项，用 `cd <任务工作区> && gh ...` 或带 `-R <owner/repo>` 即可（`git-main-guard` 只匹配 `git` 命令段）。

## 执行流程

0. **远端对齐 + 分支感知（最前置的硬性检查，先于一切其它步骤）**：
   - **0a. 远端 main 对齐检测（2026-09-21 用户立）**：先 `git -C <目标工作区> fetch origin`（无 `origin` remote 或 fetch 失败 → 无从对齐，直接进 0b），再比较本地 main 与远端 main 的领先关系——本地 main 不存在（`git -C <目标工作区> rev-parse --verify -q main` 无输出，全新仓库首次提交前）→ 无从对齐，直接进 0b；否则取 `git -C <目标工作区> rev-list --count main..origin/main`（远端领先本地 main 的提交数）与 `git -C <目标工作区> rev-list --count origin/main..main`（本地 main 领先远端的提交数）：
     - **远端领先、本地不领先**（纯落后，典型如 PR 被 CI squash 合并后本地没跟上）→ **直接拉取对齐**：
       - **当前在 main（或 master，且就是主工作区）** → `git pull --ff-only origin main`；
       - **worktree 场景**（提交发生在另一个 worktree、会话 cwd 在主工作区）→ 只要目标是任务工作区，本地 main 一律在主工作区对齐：`git -C <主工作区> merge --ff-only origin/main`（主工作区就在 main 且工作区干净时等价于快进，同时更新主工作区工作区与 main 引用）。主工作区不在 main、或被未提交改动挡住 → **跳过这次本地 main 对齐、如实记一笔**，继续 0b（worktree 分支的提交不依赖本地 main 引用，收尾对齐由 9z 在主工作区完成）。
       对齐成功 → 继续 0b。
     - **两边都有领先提交（分叉），或拉取 / 比较出现其它矛盾**（如 `--ff-only` 报 Not possible to fast-forward、fetch 报 non-fast-forward、工作区改动与拉取内容冲突）→ **暂停本次流程、询问用户**怎么处理（典型选项：把本地领先提交带到分支走 PR 通道、rebase 到远端、或用户自定），**不自行选择任何改写历史或破坏性方案**；用户答复后按其指示继续（这属流程内决策点，与敏感扫描 / cache 检测的「命中即彻底终止」不同——答复后可继续，不用重新 `/commit`；若答复「走 PR」，本地 main 保持现状直接进 0b，后续第 8 步 push 被拒时由 PR 兜底通道接管）。
     - **远端不领先（领先数为 0）** → 无需对齐，直接进 0b。
   - **0b. 分支感知（2026-09-21 用户修订：remote main 恢复分支保护、锁定直推，一切经 PR + CI 合并——2026-09-07 的「main 直推」模式废止）**：运行 `git -C <目标工作区> rev-parse --abbrev-ref HEAD` 获取当前分支名（**必须是任务工作区的分支，不能读会话 cwd 的**）。
   - **当前在 `main`（或 `master`）**（无论仓库有无提交历史）→ **先在 main 上建分支**：`git switch -c chore/<事项>`（事项名取本次 commit message 主题，kebab-case 短词；main 上的暂存内容与工作区改动会一并带到新分支），再继续第 1 步走完整流程（敏感扫描、cache 检测、`git commit`），第 8 步只 push 分支 + 建 PR + auto-merge。**禁止直推 remote main**（2026-11-02 用户立规：团队项目锁死 main；`git-main-guard.ts` 会硬拦 `git push` 到 main 与在 main 上的 `git commit`，逃生标记 `# AI_AUTHORIZED_PUSH_MAIN` / `# AI_AUTHORIZED_COMMIT_MAIN` 仅限用户当轮授权）。
   - **当前在功能 / 杂事 / bump 分支**（dev-workflow 开发分支、杂事分支、bump 分支的常态）→ 放行，继续第 1 步（第 8 步 push 分支后顺手建 PR + enable auto-merge——CI 绿自动合并，远端 PR + CI 是 2026-09-21 起一切进 main 内容的合并通道）。
1. 运行 `git -C <目标工作区> status`（**worktree 场景必带 `-C`**：会话 cwd 在 main 主工作区时，裸 `git status` 看到的是主工作区，worktree 的改动完全不可见），确认当前处于 git 仓库中。判断**暂存区是否已有内容**（本 skill 只提交暂存区已有的内容，**不执行 `git add`**）。
   - 暂存区为空（无任何已暂存的改动）→ 告知用户「暂存区无内容可提交（本 skill 不执行 git add，请先 `/add` 预检加入或自行 git add 要提交的内容）」并结束流程（无提交则不推送）。
   - 暂存区有内容 → 继续下一步。
   - **测试文件独占暂存区的暂停询问（2026-09-30 立，与 dev-workflow 的「测试产物不单独提交、不单独开 PR」配套）**：取暂存区文件清单（`git diff --cached --name-only`），若**全部**是测试文件（测试目录 `test/` `tests/` `__tests__/` `spec/` `e2e/`、`*.test.*` / `*.spec.*` / `test_*.py` / `*_test.go`、`conftest.py`、fixtures / helpers 等）而没有任何功能代码或配置改动，**先停下别提交**，向用户说明三件事：① 暂存区只有测试文件（列清单）；② 风险：功能分支上的 `/commit` 会 push 分支 + 建 PR + enable auto-merge，PR 描述若带 `fixes #N`，一合并就把 Issue 提前关成 completed（2026-09-29 实测事故：ghostty-launcher 测试 PR 合并 1 秒后 Issue 被自动关，实现还没写；main 也因此出现「测试已进、实现未进」的半程状态、CI 全量必红）；③ 建议：先等实现写完、本地全量转绿，把测试与实现一次性提交（按 dev-workflow 第 3 步）。若用户看过之后**明确**回应这确实是有意的纯测试提交（如修一个既有的坏测试、测试收尾清理），按原流程继续；用户未明确确认前不 `git commit`、不 `git push`。本项是**暂停询问型决策点**（同第 0a 步分叉处理的语义：用户答复后可继续，不用重新 `/commit`），不是敏感扫描 / cache 检测那种「命中即彻底终止」。
2. **敏感内容扫描（`git commit` 前一次性硬性检查，针对暂存区已有内容，本次操作仅此一次）**：检查暂存区即将被提交（commit）的所有文件，是否含敏感或不宜入库内容。这些文件 = 暂存区已有内容（来源不限：`/add` 预检加入或用户手动 `git add`；本 skill 不执行 `git add`，故不扫工作区未暂存改动）。常见类别包括：
   - 凭证与密钥：`.env`、`.env.*`、`*.pem`、`*.key`、`id_rsa` 等私钥、API key、token、密码、数据库连接串；
   - 凭证目录：`.ssh/`、`.aws/`、`.gcloud/`、`secrets/`、`credentials/` 等；
   - 本地私有配置：`.claude/` 中含个人设置/记忆的文件、`.idea/`、`.vscode/` 中含个人配置的文件；
   - **敏感行为记录（2026-08-23 扩充，防「网络出口相关行为记录」类泄漏——不只拦「值」、也拦把「身份 + 绕行手段」串成故事的行为叙述；本节规则描述一律用中性释义，不写字面词）**：
     - **公网 IP 字面量**：暂存内容中出现公网 IPv4 字面量（含 IP 串、`;` 分隔的 IP 清单）即告警——本地回环（127.x / 192.168.x / 10.x / 172.16-31.x / ::1）与已知公共服务 IP（如 8.8.8.8、1.1.1.1）除外；技术文档确需引用 IP 时逐个判断（测试网段 192.0.2.x / 198.51.100.x / 203.0.113.x 属文档示例地址、放行）；
     - **特定网络服务商标识**：订阅制网络服务商的名称（语义识别，字面词不入本文档）、其入口域名体系、节点代号（字母数字组合的代号系列）；
     - **交易服务方合规拒单报文**：交易服务方（券商等）因合规原因拒绝指令的错误码 + 报文原文引用（错误码 + 含合规要求说明的整段报文）；
     - **地域规避叙述**：把「身份 + 网络出口地域 + 绕行手段」串成完整故事线的叙述（典型如：同一账户在不同地域出口被区别对待的实测对比、通过特定网络通道绕开属地限制的描述）。合规要求本身的中性表述不拦——「网络环境须满足服务方合规要求」可写，实测对比与绕行手段的具体描述不写。
     命中上述任一类 → 与其它敏感内容同等处理（终止 + 列出 + 提示改写为中性表述——技术结论保留、节点 / 出口 / 报文实值移入本机 gitignore 配置）。
   - 其他不宜入库内容：大文件、二进制、本地数据库文件等。

   **先读白名单（用户已确认可公开的内容不再拦）**：项目根 `.commit-cache.md` 若含「敏感扫描白名单」段（格式见本文档「`.commit-cache.md` 检测缓存」节），扫描前先读入其中条目——用户此前明确确认「可公开」的内容，本次跳过、不再报命中，但在汇报里列一行「白名单跳过：<条目摘要>」（不静默省略，白名单保持可见、可随时撤销）。白名单**只覆盖条目描述的范围**（哪个文件 + 哪类内容）：范围外的新内容、同文件里新出现的同类信息照常扫、照常终止；某条命中是否落在白名单范围内拿不准时，按「不在白名单」处理（宁可多问一次）。白名单不豁免凭证类实值命中（私钥、token、密码等格式明确的密钥——这类内容是硬底线，不进白名单）；白名单段自身的条目文字也不重复报命中（它是用户确认结果的记录；其中若出现凭证类实值，仍照常拦截）。

   扫描对象（**仅暂存区已有内容**，本 skill 不 `git add`，故不扫工作区未暂存改动）：
   - 暂存区已有内容：`git -C <目标工作区> diff --cached --name-only`（`/add` 预检加入或用户手动 add 的文件）。

   扫描方式（2026-11-08 升级：与 add skill 第 3 步同强度，不再只做正则 + 抽样）：
   - **工具层**：对全部暂存文件跑 `gitleaks protect --staged --config ~/.gitleaks.toml`（全局 pre-commit hook 也会跑一次，这里是流程内的显式确认）。**gitleaks 缺失 = 不提交**（fail-closed）：提示 `brew install gitleaks`，不得降级成「只做 AI 正则」就放行——密钥类唯一的确定性防线不能静默消失。
   - **正则层**：对全部暂存文件跑内容正则（私钥头 / token 特征 / 公网 IPv4 / 服务商标识词 / 合规拒单报文 / 地域规避叙述特征词）。
   - **语义层（关键升级）**：对**每一个文件的每一个 change block** 逐块读内容（不是抽样、不是只看文件名），判断三类无格式敏感内容——财务状况、个人隐私标识、敏感叙述。拿不准的块按可疑处理（视为命中）。为什么：add skill 有逐块语义扫描，commit 层以前只有正则 + 抽样；用户手动 `git add`（不经 /add）时，语义层就等于没有。
   - **审计**：把本次扫描结论（时间 / 文件数 / 工具层结果 / 语义层结果）追加一行到项目根 `.commit-cache.md` 的 `<!-- commit-skill: scan-audit -->` 段，格式见 add skill 第 6b 步；工具层降级必须如实写「降级」，不许只写「通过」。

   结果处理：
   - **未发现敏感内容（或命中项全部落在白名单范围内）** → 继续后续流程（白名单跳过项在汇报里列一行）；
   - **发现敏感内容且不落在白名单范围内** → **立即终止本次 `/commit`，不执行 `git commit`、不执行 `git push`**，向用户列出：
     1. 每个涉及敏感内容的文件路径；
     2. 文件中具体的敏感内容片段（可截断，标出敏感字段）；
     3. 处理建议（从暂存区移除 `git restore --staged <file>`、加入 `.gitignore`、删除敏感内容等）。本 skill 自身不从暂存区移除文件、不修改 `.gitignore`、不改动工作区，处理由用户自行完成。
     **本次 `/commit` 就此终止、不续跑**（不「等用户处理后从第 1 步继续」）。用户处理完敏感内容后，须**重新输入 `/commit`** 才会从头走完整流程。若用户看过命中项后**明确**说「这些可公开 / 加入白名单」，把对应条目按白名单格式追加进 `.commit-cache.md`（例外②）——**本次 `/commit` 仍终止、不续跑**，白名单从下一次 `/commit` 起效；用户没有明确确认的不加白名单。

3. **cache 文件/目录检测**（与敏感扫描并列的 `git commit` 前硬性检测，针对暂存区已有内容）：扫描暂存区文件清单（`git -C <目标工作区> diff --cached --name-only`）中，**名字含 cache 的**——常见如 `cache/` 目录、`__pycache__/`、`.cache/`、`*.cache`、`<skill>/cache/` 等运行时缓存（本地生成、不应入库）。**例外：项目根 `.commit-cache.md` 是本 skill 自己的状态文件（本就应入库、不是运行时缓存），不算 cache、不拦。**
   - 结果处理：
     - **未发现 cache** → 继续后续流程（第 4 步取暂存区清单）；
     - **发现 cache 文件/目录** → **自动在 `.gitignore` 追加对应忽略规则**（例外④允许：仅新增忽略本次检测到的 cache 路径，不改 `.gitignore` 其它部分），**然后立即终止本次 `/commit`，不执行 `git commit`、不执行 `git push`**，向用户汇报：发现的 cache 文件/目录清单 + 已写入 `.gitignore` 的忽略规则 + 提示用户自行从暂存区移除 cache（`git restore --staged <cache路径>` 或 `git rm --cached -r <cache目录>`）后重新 `/commit`。**本次 `/commit` 就此终止、不续跑**（不「等用户确认后从第 1 步继续」）；用户须**重新输入 `/commit`** 走完整流程。

4. 运行 `git -C <目标工作区> status` / `git -C <目标工作区> diff --cached --name-only`，获取本次暂存区已有的文件清单（按类别分组：新增、修改、删除）。
5. 获取当前分支名与远程仓库地址（`git -C <目标工作区> remote -v`）。
6. 根据 `git -C <目标工作区> diff --cached --stat` / `git -C <目标工作区> diff --cached` 生成简洁英文提交信息（1-2 句话，说明本次改动的性质）。**生成后先过「公开文本敏感自检」**（见上节）——commit message 会公开（进 git log / commits 页 / 合并后沉淀进 main 历史），命中敏感内容则改写 message。
7. 运行 `git -C <目标工作区> commit -m "<生成的提交信息>"` 提交暂存区内容。**本步与第 8 步 push 用 `&&` 串联成一条命令执行**（不拆开、不中途停下确认，分类器拦单条也不退缩——详见「核心定位」段「两步用 && 串联一条命令跑完」；main 直推与功能分支推送场景均如此串联；命令末尾带 `# AI_AUTHORIZED_COMMIT` 授权标记，见「核心定位」段说明）。
8. 执行推送（2026-09-21 用户修订：**恢复 PR 链**——remote main 分支保护、锁定直推，一切进 main 的内容经 PR + CI 合并（dev-workflow 2026-09-21 版：功能 PR 由用户验收后合并，杂事 / bump PR 由各自流程 enable auto-merge）；本 skill 对分支做「commit + push 分支 + 建 PR（若无）」，不 merge）。先检查远程仓库（`git -C <目标工作区> remote -v`），按情形处理：
   - **无 `origin`（remote 为空）** → 主动创建 GitHub 远程仓库再推送：
     - 仓库名取项目目录名（`basename "$PWD"`），可见性 `--public`（本 skill 服务于开源项目）；
     - `gh repo create <仓库名> --public --source=<目标工作区路径> --remote=origin --push`（一条命令完成：创建公开仓库 + 设置 `origin` + 推送当前分支；worktree 场景必须用 `--source=<任务工作区绝对路径>`，不能用 `.`——`.` 会落到主工作区）；
     - **前置**：`gh` 已认证（`gh auth status`）。未认证 → 如实报告、跳过创建与推送，继续第 9 步；
     - 创建失败（重名冲突 / 网络等）→ 如实报告错误，不自行重试或破坏性解决；
     - 创建并推送成功后，第 9c 步的前置条件（有 `origin` + push 成功）即满足。
   - **有 `origin`，当前在 main**（正常流程下不应走到这里——0b 已在 main 上切好分支；若确实仍在 main，说明是用户当轮明确授权直推 `# AI_AUTHORIZED_PUSH_MAIN`，或仓库属非团队 / 无保护的临时仓库）。**默认仍不直推 main**（2026-11-02 起一律 PR：先 `git switch -c chore/<事项>` 把 main 上已有提交带到分支，再按下面「功能 / 杂事 / bump 分支」处理）。仅当用户当轮明确授权直推时，才执行 `git push -u origin main`（已有上游时 `git push`）；**push 被分支保护拒绝**（错误信息含 protected branch / required status checks / GH006 类字样），**或被 non-fast-forward 拒绝**（0a 对齐之后又出现竞态分叉等推不上去的情形）→ **自动走 PR 兜底通道（2026-09-21 用户立）**，依次执行：
     1. `git switch -c chore/<事项>`（事项名取本次 commit message 主题，kebab-case 短词）把本地 main 领先的全部提交带到新分支；
     2. `git push -u origin <分支名>` 推送分支；
     3. `gh pr create --base main --title "<本次 commit message>" --body "<摘要>" # AI_SENSITIVE_CHECKED` 建 PR（涉及 Issue 时带 `fixes #<N>`，中英不限但优先英文；建前先过「公开文本敏感自检」、命令带标记——public-text-guard 硬拦截）；
     4. `gh pr merge <分支名> --squash --auto --delete-branch` 启用 auto-merge——CI 全绿后 GitHub 自动 squash 合并进 main（合并由 CI 独裁，不手动 merge、不等 CI）。**远端分支删除说明**：`--auto` 是异步合并，`gh` 退出时删除尚未发生、`--delete-branch` 的远端删除不生效——远端源分支由 9z 收尾核验清理（仓库开了 `delete_branch_on_merge` 时 GitHub 在合并时自动删，9z 兜底；2026-10-04 增补）。
     执行中任何一步失败 → 如实报告错误，不重试直推、不用管理员权限绕过（禁止 `--force`）。走完（或失败如实报告）后在汇报中报告：拦截原因、所建分支名、PR URL、auto-merge 状态；**本地 main 仍指向带提交的旧位置，PR squash 合并后由第 9z 步自动对齐**（`git branch -f main origin/main` + 清理兜底分支，非破坏性、不改写历史）；仅 9z 异常即停（switch 被挡 / fetch 失败等）或超时未合并的场景才交用户决定（下次 `/commit` 的 0a 会检测并兜底；AI 不执行 reset / force 类操作）。
   - **有 `origin`，当前在功能 / 杂事 / bump 分支**（dev-workflow 开发、杂事、bump 场景）→ 推送分支：无上游 `git -C <目标工作区> push -u origin <分支名>`，有上游 `git -C <目标工作区> push`；然后 `gh pr list --head <分支名> --state open` 检查——**尚无 open PR 则顺手建一个**（`gh pr create --base main --title "<标题>" --body "<摘要>" # AI_SENSITIVE_CHECKED`；标题用本次 commit message，body 概述改动，涉及 Issue 时带 `fixes #<N>`，中英不限但优先英文；建前先过「公开文本敏感自检」、命令带标记），建完（或已有 open PR 且未启用）则 **enable auto-merge**（`gh pr merge <分支名> --squash --auto --delete-branch`）——CI 绿后 GitHub 自动 squash 合并（Issue 随 fixes #N 自动关闭）。**远端分支删除说明**：`--auto` 异步合并下 `--delete-branch` 不生效（`gh` 退出时合并尚未发生），远端源分支由 9z 核验清理兜底（2026-10-04 增补）。**不手动 merge**（合并由 CI 独裁——dev-workflow 2026-09-21：CI 过就合，不等人工验收，用户验收移到预发布试用 + 正式发版）；CI 的等待与合并后对齐本地 main 由第 9z 步统一处理；CI 门禁与 ci.yml 的维护归 dev-workflow 第 1 步（远端门禁就位）。
   - 推送过程中如遇冲突或其他错误，将错误信息如实报告给用户，不自行尝试破坏性解决（禁止 `--force`）。
9. **项目标配检测（`git push` 之后，最后一步）**：提交推送已完成，这里补齐项目标配。**worktree 场景下本步的全部文件检测与补全都以任务工作区的路径为根**（`<目标工作区>/README.md`、`<目标工作区>/LICENSE.md`、`<目标工作区>/VERSION` 等）——worktree 是独立 checkout，写到主工作区就等于改错对象。push 失败时仍进入本步（9a/9b/9d/9g/9h/9k/9l/9m 是本地检测；9e 永久跳过，见第 9e 步），但 9c 需 push 成功。先读项目根 `.commit-cache.md`（不存在则视为无缓存、稍后新建），按缓存标记跳过已确认的项（见「`.commit-cache.md` 检测缓存」）；对未跳过的项逐一检测，**缺则补、齐则记标记，不再停下阻塞**。补的内容作为新工作区改动，本次未提交；本 skill 不执行 `git add`，需用户自行 `git add` 后下次 `/commit` 提交。

   **例外（跳过整个第 9 步）**：若当前仓库根目录名（`basename "$(git -C <目标工作区> rev-parse --show-toplevel)"`）为 `xhqing`——这是 GitHub 账号同名 Profile 仓库，仅含一个 `README.md` 用于在 GitHub 个人主页展示，非常规项目——**直接跳过本步全部检测（9a/9b/9c/9d/9e/9f/9g/9h/9i/9j/9k/9l/9m）与 `.commit-cache.md` 缓存读写**，不做任何 README/LICENSE/About 补全，直接进入第 10 步（自动衔接发版检测；无 `VERSION` 体系、不满足条件即跳过）与第 11 步汇报。

   **9a. README 标配**（标记 `readme-standard`）：`README.md` 英文版 + `README_cn.md` 中文版，两版顶部 LOGO/徽章块一致并互链（英文版 `[简体中文](README_cn.md)`、中文版 `[English](README.md)`），底部有版权与许可证 + 署名方式 + 项目地址引用段。
   - **双语**：无 `README.md` → 创建英文版最小 README；无 `README_cn.md` → 基于 `README.md` 翻译创建中文版。
   - **语言基调**（2026-08-01 修订，替代原「语言纯度」）：`README.md` 以**美式英文为主**（特殊场景可用任何语言），`README_cn.md` 以**简体中文为主**（特殊场景可用任何语言）。默认英文版写英文、中文版写中文，但**不追求「逐字纯净」**——正文里需要保留的中文专有名词、人名、机构名、产品名、引用原文、代码示例、注音等属「特殊场景」，可按需混入主语言之外的字词，不视为违规。
     - 扫描 `README.md` 发现中文时**逐处语义判断**（不再机械地「见中文即违规」）：**属特殊场景（如上列举）→ 保留不动**；**属「本该用英文却写成了中文」**（典型如整段中文叙述塞进英文版、或正文随手用了中文词而非通用英文术语）**→ 改为英文**。
     - **LOGO（`assets/logo.svg` 里 `<text>`/嵌入文字）与徽章（URL 参数、alt 文本）**：默认用英文（项目名、`AI Agent` 等 Type 标签是面向全球读者的视觉元素）；仅当项目名本身就是中文、或有意做双语 LOGO 时保留中文（属特殊场景）。
     - `README_cn.md` 反向同理：以简体中文为主，必要的英文术语、代码、引用原文保留，不追求逐字纯净。
   - **LOGO**：`README.md` 无图片引用或图片不存在 → 按 LOGO 生成规则创建 `assets/logo.svg`，并在两版顶部插入 `<div align="center"><img ...></div>`（已有居中 div 则在其中插入）。
   - **徽章**：`README.md` 无 `img.shields.io` → 在 LOGO 下方插入徽章行并同步两版。
   - **版权与署名**：两版底部缺「版权与许可证说明 + 署名方式 + 项目地址引用方式」→ 追加完整段（英文版 `## License & Attribution`，中文版 `## 版权与署名`）：① 版权 `Copyright (c) <年份> xhqing and contributors` + 许可证（链 `LICENSE.md`）；② 署名方式（致谢 + 保留版权声明 + 注明来源）；③ 项目地址引用（`origin` 的 GitHub URL，无 remote 则用 `https://github.com/<git user>/<目录名>`）。**版权人统一为 `xhqing and contributors` 格式；历史写法 `All Contributors` 由 9g 改为新格式，本步不重复扫描。**
   - **项目类型推断**（定 Type 徽章 + LOGO 配色/emoji）：`package.json` 有 `engines.vscode` → VSCode Extension（`Type-VSCode%20Extension-0078D4`，蓝）；**项目自述为 agent（`AGENTS.md` 写明人格 / 职责，或 README 已挂 `Type-AI Agent` 徽章）→ AI Agent（`Type-AI%20Agent-FF1493`，按角色）**——**2026-11-09 用户立：性质看 `AGENTS.md` 自述 / README 徽章，不靠名字后缀推断；Agent 项目名一律 `<职责>-agent`（全小写）**；`package.json` 有 `main`/`exports` 且无上述特征 → Library（`Type-Library-9CF`，青）；否则 → Project（`Type-Project-lightgrey`，紫）。
   - **LOGO 生成**（`assets/logo.svg`）：640×200、圆角 `rx=28`、线性渐变、左侧大 emoji（按主题选，无把握用 `⚙️`）+ 项目名 + 副标题（`<类型> · <一句话描述>`）；结构对齐 DigiVendAgent logo.svg 模板。
   - **徽章组合**（标准三枚，固定为 **License / Version / Type**，不按 remote 区分数量、不依赖 remote）：① **License**——从 `LICENSE.md`/`package.json.license` 推断（MIT→`License-MIT-yellow`、Apache-2.0→`License-Apache_2.0-blue`、GPL-3.0→`License-GPL_v3-blue`，无则跳过本枚）；② **Version**——版本号取 `VERSION` 文件（VERSION 尚不存在时，按 9m「版本号取值顺序」兜底：`package.json` 顶层 `version` → 主 manifest 版本字段 → 已有 `CHANGELOG.md` 顶部最新实际版本标题 → `1.0.0`），徽章 URL 形如 `https://img.shields.io/badge/Version-<v>x.x.x-blue`（`<v>` 为可选前缀，版本号纯数字如 `1.2.3`）；③ **Type**——由上方「项目类型推断」定。三枚统一用静态 `badge` 端点（`img.shields.io/badge/...`），**不使用** `github/stars/`、`github/forks/`、`github/last-commit/` 等 GitHub 动态数值 / 时间徽章——这些随仓库变动的徽章不展示在 README，已存在的由第 9l 步负责清理。Version 徽章里的版本号后续由 9j（版本滞后 bump）/ 9k（版本号一致性同步）随 VERSION 一起更新。
   - **访问量徽章已取消（2026-11-04 用户决定，取代 2026-08-16 的 Visitors 例外）**：团队仓库 README 里那枚指向 `xhqing/xhqing` 的 `traffic/badges/<repo>.json` 的 shields.io endpoint 访问量徽章**不再使用，9a 不补挂**。用户 2026-11-04 停用了集中式流量采集，采集工作流、脚本、`traffic/` 数据目录与全部 24 个仓库的徽章同批删除；数据源没了之后徽章只会显示冻结的旧值、文案却仍写「Visits/day (14d)」，属于展示不实数据。**存量里发现这枚徽章的由 9l 删除整行**（详见 9l）。标准徽章仍固定 License / Version / Type 三枚。
   - **只补不删**：不改动用户已有的 LOGO/徽章/正文（**语言基调修正除外**：把 `README.md` 里「本该用英文却写成中文」的正文改为英文是允许的，特殊场景的中文保留不动）。README 双语 + LOGO + 徽章 + 版权署名段全齐 → 写 `<!-- commit-skill: readme-standard = ok -->` + 日期行。

   **9b. LICENSE.md**（标记 `license`）：根目录**只保留 `LICENSE.md`**，不与其它格式 license 文件重复。
   - 无 `LICENSE.md` → 创建。**先按全局 `~/.pi/agent/AGENTS.md`「项目许可证与版权声明」节判定**：① **fork / copy 项目**（有上游仓库来历）→ 按「许可证继承」表定——上游与 MIT / CC BY 4.0 兼容则用 MIT / CC BY 4.0，**不兼容则原样继承上游许可证**（GPL 系就整份 GPL 全文，不降级、不替换、不询问）；② 自研项目 → 软件项目（含 agent 项目）用标准 MIT 全文，非软件项目（书籍 / 文章等以阅读为目的的文字）用 CC BY 4.0（正文取官方 `https://creativecommons.org/licenses/by/4.0/legalcode.txt`，不手写）；③ 既不是 fork、又无法判断软件 / 非软件时，暂停并向用户确认。版权声明行一律写 `Copyright (c) <年份> xhqing and contributors`；**fork 项目必须保留上游版权行，我们的行追加在它下面**（不替换）。已存在 `LICENSE.md` 的版权人写法统一由 9g 处理。
   - 创建后、或 `LICENSE.md` 已存在时，若根目录还有其它格式 license 文件（`LICENSE`、`LICENSE.txt` 等）→ **删除冗余**，只留 `LICENSE.md`。
   - `LICENSE.md` 存在且无冗余 → 写 `<!-- commit-skill: license = ok -->` + 日期行。

   **9c. GitHub About**（标记 `github-about`）：确保 GitHub repo About 有中英双语 description 与 topics。
   - **前置**：`origin` 指向 `github.com` 且 `gh` 已认证、且第 8 步 push 成功。任一不满足 → 跳过、不记录、如实报告（如「无 GitHub remote / push 未成功，跳过 About 检测」）。
   - `gh repo view <user/repo> --json description,repositoryTopics` 取当前 About。
     - description 中英双语判定：description 须同时含英文与中文（结构形如「English summary | 简体中文摘要」，**英文部分以美式英文为主（特殊场景可用任何语言）、中文部分以简体中文为主（特殊场景可用任何语言）**）。
       - 已是中英双语（既含英文也含中文）→ 视为合规，保留不动。
       - 仅含英文或为空 → 缺中文，用 `gh repo edit --description "<English summary> | <简体中文摘要>"` 补成双语（中文部分从 README 中文段提取或由英文翻译为简体中文，英文部分以美式英文为主，总长 < 350 字符）。
       - 仅含中文 → 缺英文，用同样命令补上英文部分（从 README/package.json description 提取或翻译为英文，拼成「English | 中文」双语，总长 < 350 字符）。
     - topics 判定：为空 → 按项目类型 + 关键词推断，`gh repo edit --add-topic a --add-topic b ...` 补全（**多个 `--add-topic` 写字面量，勿用 shell 变量拼接**）；非空 → 保留不动。
     - topics 推断：VSCode 扩展 → `vscode`/`vscode-extension`；性能监控 → `performance`/`monitoring`；macOS 依赖 → `macos`；TypeScript → `typescript`；Claude Code 构建 → `claude-code`；Agent → `ai-agent`。按实际命中选取，不强加。
   - 补全（或检测发现已配）后 → 写 `<!-- commit-skill: github-about = ok -->` + 日期行。

   **9d. Agent 名称**（标记 `agent-persona`）：**项目是 Agent 项目时**（判据：`README.md` 的 `Type` 徽章是 `AI Agent`，或 `AGENTS.md` 自述为 agent），必须有一个**名称**并写进 README（项目核心内容为代表 Agent 能力的 skills / rules / memory / mcp 等，名字即 Agent 的身份）。历史惯例是**蕴含主要能力含义的拟人名**（如 Tinker / Hopper）；项目名与名称是两回事，**Agent 项目名一律 `<职责>-agent`（全小写、连字符、前缀简洁，2026-11-09 用户立）**。
   - **触发**：`README.md` 有 `Type-AI Agent` 徽章或 `AGENTS.md` 自述为 agent。都不是 → 跳过本项、不记录。
   - **检测已有**：① 查全局 `~/.pi/agent/docs/agents-registry.md` 的「智能体命名注册表」，该仓库已在表中 → 名字即定，README 引用之；② 否则看 README（中英任一）是否已有 persona 说明块（如 `> **<Name>** — <一句话能力说明>` 形式）。两者皆无 → 视为缺名。
   - **缺名则定名**：
     - **查重**：新名不得与注册表已有名称（拟人名与项目名都查）重复，首字母尽量错开以利辨识；
     - **定名**：**优先用简洁名**——项目名本身（前缀尽可能简单、能体现主要职责，如 `assistant`、`cuAgent`）即名称；用户要求起拟人名时按历史惯例（蕴含主要能力含义、双关优先，如 Tinker「修补匠」、Wright「制造匠」）；
     - **写入**：在两版 README 标题正下方加 persona 说明块（emoji + **名字** + 一句话能力说明），中英一致；
     - 定名后**把新名称追加进全局 `~/.pi/agent/docs/agents-registry.md` 的「智能体命名注册表」**（新起一行 `| **<名称>** | <仓库目录名> | <职称> | <主要职责> |`，不改已有行；若该 agent 不属销售流水线，在同文件「销售流水线与三小组」段补注其独立）；
   - 已有名字（注册表命中或 README persona 块已存在）或新起并写入后 → 写 `<!-- commit-skill: agent-persona = ok -->` + 日期行（注明名字）。

   **9e. AutoMemory 目录**（标记 `automemory`）：**永久跳过——不检测、不补全、不写标记**。
   - **原因**：AutoMemory 已全局弃用（2026-07-20 用户立）。按全局 `~/.pi/agent/AGENTS.md` 约定，新建项目一律不配 AutoMemory——不建 `.claude/memory/`、不填 `autoMemoryDirectory`、`.gitignore` 不挂 memory 条目。
   - **因此本步不做任何检测与补全**：不创建/编辑 `.claude/settings.local.json`、不创建 `.claude/settings.local.example.json`、不向 `.gitignore` 写 memory 相关内容（`settings.local.json` 的忽略与 `.claude/memory/` 的入库由项目脚手架阶段处理，非本 skill 职责）。
   - `.commit-cache.md`**不写 `automemory` 标记**（该标记在本约定下永久不出现）。
   - **边界**：若日后重新启用 AutoMemory，恢复本步检测逻辑即可（届时需同步恢复「例外④ AutoMemory 配置」与缓存段 `automemory` 标记示例）。

   **9g. 版权人/署名引用名字统一**（标记 `attribution-name`）：README.md（英文版）、README_cn.md（中文版）、LICENSE.md 三份文件里，代表「本项目版权人 / 作者」身份的位置，统一写 `xhqing and contributors` 格式（口径见全局 `~/.pi/agent/AGENTS.md`「项目许可证与版权声明」节）。与 9a/9b 互补——9a 只在「缺段则补」、9b 只在「创建 LICENSE」时写入该格式，**已存在文件里的历史写法由本步主动改写**。
   - **触发**：所有项目（凡有 README/LICENSE 的都扫，与 9a/9b 一致）。`xhqing` Profile 仓库仍走第 9 步开头的例外、整个跳过，9g 不例外。
   - **扫描对象**（三份文件，不存在的跳过）：`README.md`、`README_cn.md`、`LICENSE.md`。
   - **扫描位置**（仅两类，避免误伤正文）：
     1. **版权声明行**：`Copyright (c) <年份> <持有人>` / `Copyright <年份> <持有人>` / `© <年份> <持有人>` 等中英文变体——持有人位置 ≠ `xhqing and contributors` → 改为 `Copyright (c) <年份> xhqing and contributors`（保留原年份）。
     2. **署名说明段**：README 的 `## License & Attribution` / `## 版权与署名` 段落内（LICENSE.md 一般无此段，只看版权声明行）——凡「作为本项目作者/版权人被引用」的位置 → 统一为 `xhqing`。
   - **历史写法 `All Contributors` 一律改为新格式**（2026-11-08 用户立，旧口径废止）：它是集合概念，不构成《最高人民法院关于审理著作权民事纠纷案件适用法律若干问题的解释》（法释〔2002〕31 号）第七条所称「署名的自然人、法人或者非法人组织」，拿不到「署名即视为权利人」的推定，也不含任何可追溯标识。存量项目「按批次迁移」正是靠本步在每次 `/commit` 时顺带完成。
   - **不改（排除清单）**：
     - **GitHub 仓库地址里的 user**（如 `github.com/xhqing/repo` 中的 `xhqing`）——仓库归属事实、非版权人；改了会让链接指向不存在的仓库、失效；
     - **Agent 名称**（9d 写入的 Scout / Wright / cuAgent 等，含拟人名与简洁名）——角色身份、非版权人，与 9d 冲突；
     - **第三方依赖/工具署名**（依赖库自带的版权声明，如上游 fork 保留的原作者）——非本项目版权人；
     - **项目名本身**。
   - **判定方式**：由 CC 语义判断「该位置是否代表本项目版权人/作者」（非纯正则）；**拿不准的保留不动并在汇报里列出**，不擅自改。
   - **不写 `and contributors`**：项目当前不接受外部贡献（2026-11-08 用户明确）；日后接收他人实质贡献再补，或另立 CLA。
   - 三份文件均为新格式（版权人/署名引用位置已是 `xhqing and contributors` 或无可改位置）→ 写 `<!-- commit-skill: attribution-name = ok -->` + 日期行。

   **9h. 英文版 README 跳转中文版链接文字**（标记 `readme-link-text`）：英文版 `README.md` 里指向中文版（`README_cn.md`）的跳转链接，其呈现文字统一为「简体中文」，不允许只写「中文」两个字。与 9a 互补——9a 管「两版是否互链」，本步专门校正「英文版里跳转中文版的链接文字是否符合规范」。
   - **触发/前置**：`README.md` 与 `README_cn.md` 均存在。缺任一 → 跳过、不记录（由 9a 先补齐双语，下次 `/commit` 再检测本步）。
   - **检测**：扫描 `README.md` 里所有指向 `README_cn.md` 的 markdown 链接（形如 `[<文字>](README_cn.md)`，含 `./README_cn.md` 等路径变体）。
   - **修正**：链接文字 ≠「简体中文」（常见为只有「中文」二字，或「Chinese」「繁体中文」等其它写法）→ 改为 `[简体中文](<原链接目标>)`，只改呈现文字、不动链接目标。
   - 英文版当前没有指向中文版的链接 → 本步不负责补链接（互链由 9a 补，9a 补时直接用「简体中文」），跳过、不记录。
   - 链接文字已是「简体中文」→ 写 `<!-- commit-skill: readme-link-text = ok -->` + 日期行。

   **9i. 仓库 Sponsors 按钮**（标记 `repo-sponsors`）：确保 GitHub 仓库页会显示 Sponsor 按钮（仓库主页右侧「Sponsor this project」按钮，由 `FUNDING.yml` 驱动，区别于 README 里自定义的赞助块 / 收款码）。
   - **机制**：Sponsor 按钮由 `FUNDING.yml` 驱动，文件可放在仓库根目录或 `.github/` 子目录。`<username>/.github` 仓库的 `FUNDING.yml` 会作为该用户**所有仓库的默认 sponsor 配置**（除非某仓库自己有 `FUNDING.yml` 覆盖）。按全局 `~/.pi/agent/AGENTS.md` 约定，**统一只在 `xhqing/.github` 仓库放一份 `github: xhqing`**，不在每个项目里单独放 `.github/FUNDING.yml`——赞助配置不是项目主体内容。
   - **前置**：`gh` 已认证（`gh auth status`）。未认证 → 跳过、不记录、如实报告（如「gh 未认证，跳过 Sponsors 检测」）。
   - **检测**（判断当前仓库在 GitHub 上是否会显示 Sponsor 按钮，二者任一满足即「就绪」）：
     1. 当前仓库有自己的 `FUNDING.yml`（`.github/FUNDING.yml` 或根目录 `FUNDING.yml`）且含有效 sponsor 键（`github:` / `patreon:` / `ko_fi:` / `buy_me_a_coffee:` / `open_collective:` / `custom:` 任一）→ 已就绪（尊重现状，不主动移除；按全局约定 agent 项目不应有，但本步不负责清理）；
     2. 否则查全局 `xhqing/.github` 仓库的 `FUNDING.yml`（根目录或 `.github/` 子目录）是否存在且含有效 sponsor 键（约定为 `github: xhqing`）→ 存在则已就绪（默认配置对该用户所有 GitHub 仓库生效）。
   - **未就绪则修复**（两者皆无）：按全局约定，**通过 `gh api` 在 `xhqing/.github` 仓库创建 / 更新 `FUNDING.yml`**，内容为 `github: xhqing` + 注释模板（赞助平台说明 + 文档链接 + 其它平台注释行）。用 `gh api -X PUT repos/xhqing/.github/contents/FUNDING.yml -f message="Add FUNDING.yml for GitHub Sponsors" -f content="<base64 编码的内容>"`（若该文件已存在但内容不含有效 sponsor 键，先 GET 取 `sha`，再带上 `-f sha=<sha>` 更新）。这是**跨仓库远程写操作**（写的是 `xhqing/.github` 而非当前项目，区别于本 skill 其它只动当前项目的步骤），但内容确定、是全局默认配置、符合用户「让所有仓库都显示 Sponsor 按钮」的意图，直接执行；创建 / 更新失败（网络 / 权限等）→ 如实报告，不强行重试、不动当前项目文件。
   - 已就绪（检测通过）或修复成功后 → 写 `<!-- commit-skill: repo-sponsors = ok -->` + 日期行（注明「全局默认 `xhqing/.github/FUNDING.yml` 就绪」或「当前仓库自有 FUNDING.yml」）。

   **9j. 版本滞后检测（提示制，2026-09-06 改）**（不写缓存标记、每次 `/commit` 必查）：检测 `VERSION` 标注的当前版本是否已落后于代码实际进度——若该版本**已经在 GitHub Release 发布**（该版本号对应的 Release / tag 已存在），且仓库里**该版本之后又有新的提交**，说明代码已往前走但版本号没跟上。**检测到滞后时不就地修改任何文件**（版本号修改归 bump skill 在 main 上统一执行——功能分支禁止碰版本号，就地 bump 会写进功能分支违反并行纪律），改为**在汇报中按新提交内容性质分流报告并指引**（2026-10-13 修订）——先判定该版本之后的新提交里是否含 fix / feat 类改动（判定口径同第 10 步）：**含** → 报告「版本滞后 N 个待发布提交」，说明满足条件时由本流程第 10 步自动衔接 `/bump` → `/add` → `/commit` → `/release` 完成发版（2026-10-02 起，「不要提示我 bump」；本项因前置不满足未被自动处理时，手动执行 `/bump`）；**不含（纯文档 / 杂事等非功能类）** → **不算需要处理的滞后**：说明「自上一版本以来 N 个新提交均为非功能类改动，按 2026-10-13 用户规则不触发发版、无需处理；确需发版可手动 `/bump` / `/release`」——不列滞后问题、不指引自动发版。与第 9k 步互补：9k 管横向（各文件版本号与 `VERSION` 对齐），本步管纵向（`VERSION` 是否落后于已发布进度，提示发版路径）。
   - **触发 / 前置**：项目根有 `VERSION` 文件 + 有 `origin` 指向 `github.com` + `gh` 已认证（`gh auth status`）+ 第 8 步 push 成功。任一不满足 → 跳过、不记录（如「无 `VERSION` / 无 GitHub remote / push 未成功，跳过版本滞后检测」）。
   - **检测逻辑**：
     1. 读 `VERSION` 取基准版本号（trim 首尾空白 / 换行），如 `2.1.0`。
     2. 查该版本**是否已在 GitHub Release 发布**：先 `gh release view "v<版本>"`（仓库惯用 `v` 前缀 tag）；提示 not found 则再试不带 `v` 的 `gh release view "<版本>"`。任一能查到 → 该版本已发布；都查不到 → **未发布，版本未滞后**（`VERSION` 指向尚未发布的下一版），正常通过。
     3. 该版本已发布 → 查仓库里**该版本 tag 之后是否有新提交**：先确保本地有该 tag（`git -C <目标工作区> fetch --tags`，浅克隆 / 未 fetch 标签时必要），再 `git -C <目标工作区> rev-list --count <实际tag>..HEAD`，结果 > 0 → 有新提交；结果 = 0 → 该版本发布后无改动，正常通过。
     4. 两者同时满足 → **代码有前进**：按上条分流报告——含 fix / feat 类改动 → 报「版本滞后 N 个待发布提交」（当前 VERSION / 最新已发布版本 / 待发布提交数），由第 10 步自动衔接发版链（2026-10-02 起）；均为非功能类 → 报「非功能类新提交 N 个，不发版、无需处理」（2026-10-13 起）。**本步不改文件、不就地 bump。**
   - **不写缓存标记**：版本滞后状态随每次提交 / 每次发版动态变化，**每次 `/commit` 都要重新查**，故 `.commit-cache.md`**不写 `version-staleness` 标记**、永不跳过本步。
   - **例外**：当前仓库根目录名为 `xhqing`（Profile 仓库）→ 随第 9 步开头例外整个跳过，9j 不例外。

   **9k. 版本号一致性检测与同步**（不写缓存标记、每次 `/commit` 必查）：检测 `VERSION` 与项目里各处版本号是否**横向一致**——`VERSION` 是唯一权威源（对齐全局 `~/.pi/agent/AGENTS.md`「版本信息一致性」规则），其余涉及版本号的文件若与 `VERSION` 不一致，则**以 `VERSION` 为准自动同步**（不动 `VERSION` 自身）。与 9j 互补：9j 管纵向（`VERSION` 是否落后于已发布进度、必要时向上 bump 并同步各文件），本步管横向（`VERSION` 与各文件版本号是否对齐、以 `VERSION` 为准补齐）；两者都在 push 之后、都不阻塞、都不写缓存标记、都每次必查。**本步排在 9j 之后**：若 9j 已 bump `VERSION` 并同步各文件，则本步复查时各处应已一致、无需再改；若 9j 未触发（`VERSION` 未滞后），但某文件版本号偏离了 `VERSION`（典型如手动改了 `VERSION` 但 `package.json` / `CHANGELOG` 未跟上），则由本步补齐。
   - **触发 / 前置**：项目根有 `VERSION` 文件（本步只比对本地文件，**不要求** `origin` / `gh` / push 成功——push 失败也照常检测）。无 `VERSION` → 跳过、不记录、不同步。`xhqing` Profile 仓库随第 9 步开头例外整个跳过。
   - **检测逻辑**：
     1. 读 `VERSION` 取**基准版本号**（trim 首尾空白/换行），如 `2.1.1`。
     2. **允许前缀差异**：剥离前导的 `v` / `Version` / `"version":` 等修饰性前缀与引号、标点后，比较核心的 major.minor.patch 三段数字逐一相同即视为一致（如 `v2.1.1`、`Version 2.1.1`、`"version": "2.1.1"` 与 `2.1.1` 均算一致）；后缀（`-beta`、`-rc.1`、`+build` 等 pre-release / build metadata）不属于前缀、不自动豁免，需判断是否为有意区分。
     3. 逐一比对**须比对的位置**（存在的才查，各自提取版本号字串并 trim 后与基准比核心三段数字）：
        1. `package.json` 顶层 `version` 字段；
        2. `package-lock.json` **顶层** `version` 字段（仅顶层，不查 `packages` 内各依赖版本）；
        3. `CHANGELOG.md` 里**最新一条实际版本标题**（跳过 `## [Unreleased]` 占位符，取其下第一条形如 `## [2.1.0]` / `## 2.1.0` 的版本标题）；
        4. 项目主 manifest 的版本字段：`manifest.json`、`pyproject.toml`（`version = "x"`）、`Cargo.toml`（`version = "x"`）、`*.csproj`（`<Version>x</Version>`）——存在才查；
        5. README（`README.md` / `README_cn.md`）里**显式声明当前版本**的文字（如「Current version: x」「当前版本：x」、版本徽章），仅取「声明当前发布版本」的位置，不抓 changelog 历史版本、不抓依赖版本、不抓安装命令示例里的版本号。
   - **结果处理**（不阻塞——push 已完成，同步后的版本号作为新工作区改动，本次未提交；本 skill 不执行 `git add`，需用户自行 `git add` 后下次 `/commit` 提交）：
     - **无 `VERSION` 文件** → 跳过；
     - **各位置版本号均与基准一致** → 无事可做，正常通过；
     - **发现不一致** → **以 `VERSION` 为唯一权威，把偏离的文件同步到基准版本号**（不动 `VERSION`）：
       1. **`package.json`**：顶层 `version` 字段改为基准版本号；
       2. **`package-lock.json`**：**顶层** `version` 字段改为基准版本号（仅顶层，不动 `packages` 内各依赖版本）；
       3. **`CHANGELOG.md`**：若顶部有 `## [Unreleased]` 段且其下第一条实际版本标题 < 基准版本号 → 把 `## [Unreleased]` 改为 `## [基准版本号] - <今天日期 YYYY-MM-DD>`（其下的 Added / Changed 等内容即归入该版本；**不要改已发布版本的历史条目**）；若顶部无 `Unreleased` 段、最新实际版本标题就低于基准 → 在最顶部新增 `## [基准版本号] - <今天日期>`（依据近期提交补简要改动说明）；
       4. **主 manifest**：`manifest.json` / `pyproject.toml`（`version = "x"`）/ `Cargo.toml`（`version = "x"`）/ `*.csproj`（`<Version>x</Version>`）——存在才改为基准版本号；
       5. **README**（`README.md` / `README_cn.md`）：**显式声明当前版本**的位置（「Current version: x」「当前版本：x」、版本徽章里的版本号）——存在才改为基准版本号；不抓 changelog 历史版本、不抓依赖版本、不抓安装命令示例。
   - **不写缓存标记**：版本号一致性状态随每次改动动态变化，**每次 `/commit` 都要重新查**，故 `.commit-cache.md`**不写 `version-consistency` 标记**、永不跳过本步。

      **9l. README 徽章组合合规**（标记 `readme-badges`）：`README.md`（英文版）、`README_cn.md`（中文版）的徽章行必须符合新规矩——**标准徽章固定为 License / Version / Type 三枚**（静态 `img.shields.io/badge/...` 端点），**不得包含 Forks / Stars / Last Commit 等 GitHub 动态数值 / 时间徽章**（即 URL 路径含 `github/forks/`、`github/stars/`、`github/last-commit/` 的徽章，含 `?style=social` 等参数变体）。**遗留的访问量徽章按违规处理（2026-11-04 起）**：URL 为 shields.io endpoint 且指向 `raw.githubusercontent.com/xhqing/xhqing/main/traffic/badges/` 下 JSON 的那一枚（旧版的 Visitors 访问量徽章，详见 9a）——采集已停用、数据目录已删，留着等于展示失效数据，**删除整行**。与 9a 互补——9a 管「该有的徽章是否齐全」（其「徽章组合」用静态三枚、不添加动态徽章），本步专门清理「已存在的动态徽章」。
   - **触发**：所有项目（凡有 README 的都扫，与 9a 一致）。`xhqing` Profile 仓库仍走第 9 步开头的例外、整个跳过，9l 不例外。
   - **扫描对象**（两份文件，不存在的跳过）：`README.md`、`README_cn.md`。
   - **检测**：扫描徽章行里所有 `img.shields.io` 徽章，命中 URL 路径含 `github/forks/`、`github/stars/`、`github/last-commit/` 之一的 → 视为违规徽章；**URL 含 `xhqing/xhqing/main/traffic/badges/` 的 endpoint 徽章（遗留访问量徽章）同样视为违规**——彩色 endpoint 徽章指向的 JSON 已随采集停用而删除，属失效展示。
   - **修正**：删除该违规徽章所在的整行 markdown（形如 `![...](https://img.shields.io/github/stars/...)`），其余徽章（License / Version / Type 及其它合规徽章）/ LOGO / 正文一律保留。**本步突破 9a「只补不删」原则，仅针对上述动态徽章与遗留访问量徽章删除**——不删其它徽章、不删 LOGO、不动正文。
   - 两份文件均无上述三类违规徽章（或某份文件不存在）→ 写 `<!-- commit-skill: readme-badges = ok -->` + 日期行。

   **9m. CHANGELOG.md 与 VERSION 文件**（标记 `changelog-version`）：**任何项目都必须有 `CHANGELOG.md` 与 `VERSION` 两个文件**（2026-08-03 用户立）——它们是「CHANGELOG 记录纪律」「版本信息一致性」规则的落地载体（这两条规则现无条件生效、无缺省豁免），也是 9j 版本滞后检测、9k 版本号一致性检测的检测对象。
   - **触发**：所有项目（除 `xhqing` Profile 仓库随第 9 步开头例外整个跳过外，9m 不例外）。
   - **本步与 9j/9k 的关系**：本步排在 9j/9k 之后。首次 `/commit` 若项目缺 `VERSION`，9j/9k 按「无 VERSION」跳过、由本步创建；自下次 `/commit` 起 9j/9k 正常执行。
   - **版本号取值顺序**（新建时共用）：① `package.json` 顶层 `version`；② 主 manifest 的版本字段（`manifest.json` / `pyproject.toml`（`version = "x"`）/ `Cargo.toml`（`version = "x"`）/ `*.csproj`（`<Version>x</Version>`））；③ 已有的 `CHANGELOG.md` 顶部最新实际版本标题（仅建 `VERSION` 时可用，`CHANGELOG.md` 尚不存在则跳过）；④ 以上皆无 → `1.0.0`。
   - **无 `VERSION` → 新建**：文件内容为纯数字版本号（无 `v` 前缀）+ 换行（如 `1.0.0\n`）。
   - **无 `CHANGELOG.md` → 新建**：顶部写 `## [<当前版本号>] - <今天日期 YYYY-MM-DD>`（当前版本号 = 已有 / 本次新建的 `VERSION`；`VERSION` 尚无则按上方取值顺序），其下写该版本摘要（新项目写「初始版本」说明 + 按当前已知内容简要记录）；**不写 `[Unreleased]` 占位**——新建即用具体版本号标题，与 9k「最新实际版本标题须与 VERSION 一致」天然对齐，避免下次 `/commit` 被 9k 再改。
   - 两者均存在 → 无事可做。
   - 新建 / 确认存在后 → 写 `<!-- commit-skill: changelog-version = ok -->` + 日期行。

   **9n. CONTRIBUTING 文件**（标记 `contributing`）：每个项目必须有 `CONTRIBUTING.md`（英文）与 `CONTRIBUTING_cn.md`（中文），写清两件事——① 贡献者的版权归贡献者本人（提交 PR 不构成著作权转让）；② 提交 PR 即视为按项目许可证授权本项目使用、修改、再分发其贡献。口径见全局 `~/.pi/agent/AGENTS.md`「贡献者版权与许可」节（2026-11-09 用户立）。
   - **触发**：所有项目（与 9a/9b 一致）。`xhqing` Profile 仓库随第 9 步开头例外整个跳过。
   - **⚠️ 第一步永远是「读 `LICENSE.md` 判定项目实际许可证」，不是假设 MIT**（2026-11-09 用户立，起因：一个批量脚本硬编码 MIT，把 `cmux` 的 GPL-3.0-or-later 和 `ToolCallingRules` 的 PolyForm Noncommercial 都写成了 MIT——前者误导贡献者以为可商用，后者与项目「禁止商用」直接矛盾）。按 `~/.pi/agent/patch/contributing-template/README.md` 的映射表确定许可证名称；**认不出的许可证 → 暂停问用户，不得猜**。
   - **检测**：两个文件是否都存在、是否含上述两个关键要素、是否还有未替换的 `{{LICENSE_NAME}}`、声明的许可证是否与 `LICENSE.md` 一致。
     - **缺任一文件** → 从 `~/.pi/agent/patch/contributing-template/` 拷对应文件，**并把 `{{LICENSE_NAME}}` 替换成上一步判定出的实际许可证名称**（不替换就是错的）。**不要重新编写模板正文**——「著作权转让须订立书面合同，而提交 PR 不构成合同」这类措辞是刻意写死的，自由发挥容易把法律含义写歪。
     - **文件存在但缺关键要素** → 按模板补齐缺的那段，用实际许可证名称。**补之前先确认它真的缺**：`ToolCallingRules` 原本已有完整许可条款（只是措辞与模板不同），被误判「缺要素」后塞进一段矛盾的 MIT，事后又得回滚。
     - **存在 `{{LICENSE_NAME}}` 残留** → 拷贝后忘了替换，按实际许可证名称补上。
     - **声明的许可证与 `LICENSE.md` 不符** → **以 `LICENSE.md` 为准改正**。这是真正的错误，会让贡献者按错误的条款授权自己的代码。
   - 两文件齐备、含两个关键要素、无占位符残留、许可证名称与 `LICENSE.md` 一致 → 写 `<!-- commit-skill: contributing = ok -->` + 日期行。

   **9z. 等待 PR 合并并对齐本地 main（2026-09-22 用户立；仅第 8 步走了 PR 通道——main 兜底通道或功能 / 杂事 / bump 分支建 PR——的场景执行）**：等待 CI 全绿 + GitHub auto-merge 自动 squash 合并进 remote main，然后自动把本地 main 对齐到远端、清理已合并的本地与远端源分支。目标是每次 `/commit` 结束时仓库就是干净终态（本地 main = origin/main、旧分支已清），不留「PR 合并了但本地 main 悬在旧位置、下次 `/commit` 才由 0a 兜底对齐」的尾巴。为什么放在第 9 步之后：标配检测（9a~9m）全是本地操作、不依赖远端状态，先做完；等待 CI 期间无事可做；对齐完成后再走第 11 步 `git status`，收尾的 status 正好反映对齐后的最终状态（发版衔接见第 10 步）。
   - **只对本次流程 enable 了 auto-merge 的 PR 等待**：本流程建的 PR 均已 enable auto-merge（第 8 步）。若因故没 enable 成（PR 创建失败、auto-merge 开启失败、仓库 / 组织禁用 auto-merge 等）→ 跳过等待，如实报告原因后直接进第 10 步（commit/push 已完成，不受影响）。
   - **等待方式与上限**：轮询 `gh pr view <PR号> --json state,mergedAt`（间隔约 30 秒；也可用 `gh pr checks <PR号> --watch` 等待命令），**上限 15 分钟**。结果分支：
     - `merged: true` → 进入下面的对齐动作；
     - **CI 失败**（`gh pr checks` 出现 failure，auto-merge 不会触发）→ 停止等待，如实报告失败的 check 与原因（提交已在远端分支与 PR 里，不丢；修复后 push 到同分支，PR 重跑 CI、auto-merge 重新生效），进第 10 步；
     - **PR 被关闭而未合并**（state 为 CLOSED 且 mergedAt 为空）→ 停止，如实报告，进第 10 步；
     - **超时（15 分钟仍未合并）→ 不算失败**：报告「auto-merge 已启用、CI 还在跑，本次不再等待」，并说明下次 `/commit` 的 0a 步会检测到纯落后并自动拉取对齐，进第 10 步。上限设 15 分钟而非无限等：CI 偶发排队 / runner 慢时把会话无限挂住不值得，0a 已有兜底。
   - **合并后对齐（全部用非破坏性命令，`reset --hard` / `rebase` / `stash` / `push --force` 禁令不变；任何一步失败 → 停下如实报告、交人工，绝不自动改写历史）**：先 `git -C <目标工作区> fetch origin`（失败 → 停、报告）。再按第 8 步走的是哪条通道分两种场景：
     - **场景 A（功能 / 杂事 / bump 分支：提交本来就在分支上，本地 main 干净）**：
       - **主工作区场景**（提交在主工作区的分支上）：`git switch main` → `git merge --ff-only origin/main`（纯快进、零冲突）→ `git branch -D <该分支>`。`switch` 被工作区未提交改动挡住（典型如第 9 步刚补的 README 与两分支间有差异），或 `--ff-only` 报 non-fast-forward（说明本地 main 意外领先）→ 停、如实报告交人工——**绝不自动 rebase**：自动改写历史的风险远大于留一个分叉给用户处理。
       - **worktree 场景**（提交在任务工作区、会话 cwd 在主工作区）：worktree 里 `switch main` 必然失败（`already used by worktree at <主工作区>`），两步分开做：① 在主工作区对齐本地 main —— `git -C <主工作区> merge --ff-only origin/main`（主工作区在 main 且干净时有效；被未提交改动挡住、或主工作区不在 main → 停、如实报告交人工）；② **本地源分支与 worktree 先不删** —— worktree 的 HEAD 就在该分支上，`git branch -D` 会报「used by worktree」，且用户还要在里面核验收尾，留给 dev-workflow 第 8 步（`git worktree remove` 后 `git -C <主工作区> branch -D <分支>`），并在汇报里写明这句。**远端源分支照常清理**（见下）。
     - **场景 B（main 兜底通道：提交原落在本地 main、被带到 chore 分支走 PR）**（**worktree 场景不适用**——worktree 里 `git branch -f main` 会 fatal，且这条通道本身已随「main 上禁止提交」而基本不出现）：`git branch -f main origin/main`（HEAD 还在 chore 分支上，把本地 main 引用指到远端已公开的位置；旧提交此刻仍被 chore 分支引用着，零丢失，且不改写历史、不碰工作区）→ `git switch main`（切到已对齐的 main；被工作区改动挡住 → 停、报告交人工）→ `git branch -D <chore分支>`（此时 HEAD 已不在该分支上，可删）。
     - 两场景删本地分支都用 `-D` 而非 `-d`：squash 合并后本地分支与 main 无祖先关系，`-d` 会以「未合并」拒绝；内容已完整进入 main 的 squash commit，`-D` 丢掉的只是旧哈希、不丢信息。
     - **远端源分支清理（2026-10-04 增补）**：核验本次分支的 PR 已 MERGED 后，检查远端源分支是否还在（`git -C <目标工作区> ls-remote --heads origin <该分支>`）；仍在则 `git -C <目标工作区> push origin --delete <该分支>`（实测：`--auto` 异步合并下第 8 步 `--delete-branch` 的远端删除不生效，旧分支会长期挂着）。仓库侧可另开 `delete_branch_on_merge=true` 兜底（`gh api -X PATCH repos/<o>/<r> -f delete_branch_on_merge=true`，合并时自动删）——两者并存不冲突；删除失败不阻断对齐、如实报告即可。
   - **对齐完成后**直接进第 10 步（自动衔接发版检测——满足条件则先进入 `/release` 完成发版，不满足则跳过）→ 第 11 步（`git status` 显示 On branch main、与 origin/main 同步——这正是本步要交付的终态）。

   第 9 步是收尾，补全/标记后进入 9z（仅第 8 步走了 PR 通道的场景；直推成功、无 PR 的场景直接进第 10 步）→ 第 10 步自动衔接发版检测（不满足条件则跳过），不再阻塞提交。

10. **自动衔接发版检测（2026-10-02 用户立；同日修订：未就绪自动走 bump 链条；2026-10-13 修订：发版门禁收紧——仅 fix / feat 类改动（核心功能修复 / 新增）触发发版，纯文档 / 杂事类不发版、不 bump；流程末尾的收尾检测，排在 9z 之后）**：检测「自最新 tag 以来是否有功能类改动（fix / feat——核心功能的修复 / 新增）需要发版」（用户 2026-10-13：「以后这种文件改动不应该触发发版流程，只有 fix 和 feat 核心功能的修复和新增核心功能才触发发版」）并按结果**自动跑完发版链条**——有功能类改动且版本已就绪 → 直接进入 `/release` 完成发版；有功能类改动但版本未就绪 → 自动走 `/bump` → `/add` → `/commit` → `/release` 整条链完成发版（不提示、不询问）；**无功能类改动（纯文档 / 杂事 / 配置 / 版本号等）→ 不发版、不触发 bump**，或前置不满足则跳过，均在汇报中说明原因。本步只在本次流程完整成功走到这里时才有意义（敏感扫描 / cache 检测命中终止、暂存区为空未进入流程的场景不存在发版衔接）。

   - **前置条件（任一不满足 → 跳过本步、进第 11 步并如实说明）**：
     1. 本次 commit + push 成功；走 PR 通道的场景须 9z 已确认 PR 合并、本地 main 已对齐；
     2. **待发布内容已全在远端 main**：`git -C <目标工作区> fetch origin` 后校验——主工作区场景：当前分支为 `main`（或 `master`）且 `git rev-list --count origin/main..HEAD` 与 `git rev-list --count HEAD..origin/main` 均为 0；**worktree 场景**：`git -C <主工作区> rev-parse HEAD` 与 `git -C <主工作区> rev-parse origin/main` 相同（主工作区就在 main，这同时证明 9z 已成功对齐；**不能用 `merge-base --is-ancestor HEAD origin/main` 判定**——PR 是 squash 合并，worktree 上的原提交与 main 无祖先关系，会误判成「未合并」）；
     3. **工作区与暂存区干净**——`git -C <目标工作区> status --porcelain` 无输出（第 9 步标配补全 / 版本号同步若产生新改动，本条件即不满足：先提交这些改动，下次 `/commit` 会再走本步）；
     4. 项目根存在 `VERSION` 文件；`origin` 指向 `github.com` 且 `gh` 已认证（发版必需）。
   - **判定与动作（三步）**：
     1. **有新内容待发布**：`git -C <目标工作区> fetch --tags` 后取最新 tag（`git -C <目标工作区> describe --tags --abbrev=0`）——有 tag → `git rev-list --count <tag>..HEAD` > 0 即有新提交；无任何 tag（从未发版）→ 仓库有提交（首次发版）即视为有新内容；新提交数为 0 → 无内容可发，跳过（汇报「自上一版本以来无新提交，未自动发版」）。
     2. **内容性质判定（2026-10-13 用户立；本步核心门禁——仅 fix / feat 类改动触发发版）**：判定新提交里是否含**功能类改动（fix / feat——核心功能的修复 / 新增）**——含 → 继续第 3 步；不含 → **本步直接结束**：不发版、不触发 bump，进第 11 步并汇报「自上一版本以来的 N 个新提交均为非功能类改动（文档 / 杂事等），按 2026-10-13 用户规则不触发发版；确需发版可手动 `/bump` 或 `/release`」。判定分两层：
        - **机械层（先执行，以命令实际输出为准）**：`git -C <目标工作区> log --no-merges --format='%s' <tag>..HEAD | grep -iE '^(fix|feat)(\([^)]+\))?!?:'`（无 tag 的首次发版场景去掉 `<tag>..HEAD`、扫全部提交）——有输出即命中（Conventional Commits 的 fix / feat 类型，含 `fix(scope):` / `feat!:` 等；`--no-merges` 排除合并提交）。
        - **语义层（机械层无命中时才做）**：读新提交的 message 与改动范围（`git -C <目标工作区> log --no-merges --format='%s%n%b' <tag>..HEAD`，必要时 `git -C <目标工作区> diff <tag>..HEAD --stat`），判读是否属「核心功能的修复 / 新增」——明确是 → 命中；纯文档 / 杂事 / 配置 / 版本号 / 缓存 / 格式化 / 规则梳理类 → 不命中；**拿不准 → 按不命中处理**（宁可少发；需要时手动 `/bump` / `/release`）。设语义层的原因：部分仓库（如 blog / vscode-copy-anywhere）的提交信息不带 conventional 前缀，只靠机械层会漏掉真实的修复 / 新增。
        - **豁免（发版链内部延续，防死锁）**：若本次 `/commit` 本身就是发版链的产物（用户手动 `/bump` 或本步自动触发的 bump 链条走到 `/add` → `/commit`），发版意图已由用户 / 链条确立——跳过本判定、直接继续第 3 步（否则 bump 提交本身不含 fix / feat，链条无法收尾）。
        - **范围口径「自最新 tag 以来」**：发版打包的就是自上一 tag 以来的全部提交——其中只要有一条功能类改动，本次发版就有实质内容；全是非功能类就没有发版理由；纯文档推进期间版本号停在已发布值属正常，不是「滞后」问题（9j 同口径）。
     3. **版本就绪检查**（决定走哪条自动路径）：① `VERSION` **尚未发布**——`gh release view "v<版本>"` / `gh release view "<版本>"` 均查不到（版本取值同 9j：读 `VERSION` 文件 trim）；② **CHANGELOG 最新实际版本标题与 `VERSION` 一致**（口径同 9k：剥离前缀后核心 major.minor.patch 相同）。
        - ①②都满足 → **就绪** → 走「就绪路径」（直接 `/release`）；
        - `VERSION` **已发布**（即 9j 的「版本滞后」）或 CHANGELOG 与 `VERSION` 不一致 → **未就绪** → 走「未就绪路径」（自动 bump 链条）。
   - **就绪路径（直接发版）**：直接进入 `/release` skill 完整流程（正式发布通道：在主工作区对齐 main → 版本就绪校验 → tag 已存在检查 → CHANGELOG notes → annotated tag → push tag → `gh release create` → 校验 → 清理本地产物，worktree 场景的对齐与打 tag 都在主工作区用 `-C` 执行，见 release skill 第 0 步），一步不省；release 内安全阀照常暂停询问。发版完成后继续第 11 步收尾（`git status` 反映发版后的最终状态）；发版未完成（用户取消 / 安全阀暂停未决）→ 如实报告后进第 11 步。
   - **未就绪路径（自动 bump 链条，2026-10-02 用户立，「不要提示我 bump」）**：未就绪时**不提示、不询问**，直接进入 `/bump` skill 完整流程（读 `~/.pi/agent/skills/bump/SKILL.md` 按其执行：对齐 main → 建 bump 分支 → 判定新版本号 → 改齐版本号文件）；bump 改完后按其第 5 步**自动衔接 `/add`**（以 bump 改动文件为候选、双层预检 + git add）；add 预检**完全干净**时继续自动衔接 `/commit`（bump 提交 → push bump 分支 + 建 PR + enable auto-merge → 9z 等待 CI 合并、对齐本地 main）——该 commit 流程完成后再次到本步、此时版本已就绪 → 走「就绪路径」自动 `/release` 完成发版。链条中任一环节的既有安全阀（bump 的对齐 / 分叉暂停、add 的人工过目清单、commit 的敏感扫描 / cache 检测、release 的异常暂停）照常生效——任一环节停下即如实报告、交用户处理（不算本步失败）。
     - **防循环**：若本次 `/commit` 本身就是 bump 链条的产物（bump → `/add` → `/commit`）而本步仍判未就绪（异常情况——正常 bump 后版本必然就绪），**停止并如实报告异常，不再触发第二次 `/bump`**；绝不无限循环。
   - **为什么先补齐版本再发版**：未 bump 时直接触发 `/release`，它会在第 3 步撞上「tag 已存在」的异常暂停——报的是 tag 冲突（要用户从「force push 修正 / 补发 / 保持现状」里选），而真正待办是 `/bump`（release 第 0 步的版本就绪校验只管「VERSION 与 CHANGELOG 是否一致」，拦不住「一致地停在已发布版本上」的情形）。正确顺序是先补齐版本（bump 链条）再发版——本步自动完成这个顺序（用户 2026-10-02：「不要提示我 bump」）。
   - **授权**：用户立「commit 成功后自动衔接触发发版、未就绪则自动 bump → add 补齐后继续」规则即预授权整条自动链——`/release` 环节与「用户主动输入 `/release` 即授权」等效（见 release skill「授权语义」）；`/bump`、`/add` 环节按其 skill 的自动衔接条款执行；全程直接执行、不向用户二次确认。2026-10-13 修订的门禁只收窄自动链的**触发范围**（仅 fix / feat 类改动触发），不改变授权的性质——用户主动 `/bump` / `/release` 不受限。

11. **执行 `git status`（汇报收尾动作，整个流程的最后一步，2026-09-05 用户立；同日修订：代码块首行加 `>> git status` 命令标记；2026-09-21 增补工具强制）**：进入汇报时，作为**汇报的最后一件事**执行一次 `git status`（**worktree 场景执行 `git -C <目标工作区> status`**），并把该命令的输出**原样**以代码块方式直接输出——不加工、不总结、不截断、不做额外解读。代码块内容**必须来自真实执行**，不得凭推断拼造（2026-09-21 事故：未执行命令手拼假输出，既猜错工作区状态、还拼出真实 git 不会输出的提示语）。代码块**首行固定加一行 `>> git status` 命令标记**（提示符样式，让用户一眼看出这段是 `git status` 的执行输出；该标记行是呈现格式、不算命令输出的一部分，其余各行才是原样输出）。**无论流程是完整走完（commit + push + 第 9 步标配检测与补全）还是中途终止（敏感内容扫描 / cache 检测命中），汇报都以这个 `git status` 代码块收尾**——让用户直接看到本次 `/commit` 结束时工作区与暂存区的真实状态。格式示例：

   - **工具强制（2026-09-21 立，pi 端 git-status-guard）**：本步由 pi 端扩展 `~/.pi/agent/extensions/git-status-guard.ts` 强制兜底——授权 commit（带 `# AI_AUTHORIZED_COMMIT` 标记的 `git commit`）发生后：① commit 的工具结果被追加提醒（收尾必须实际执行 `git status` 并原样贴出）；② 最终回复里的 `>> git status` 代码块将与扩展实测输出逐字比对（规范化换行与行尾空白后），不符即被替换为真实输出并加警示行——编造、贴过期输出、贴 `--short` 等变体都会被纠正；③ run 结束仍无 status 代码块时，扩展实测 `git status` 直接 notify 用户曝光。锚点是授权 commit：敏感扫描 / cache 检测命中即终止的场景无 commit、无锚点，仍靠文本纪律。

    ```
    >> git status
    On branch main
    Your branch is up to date with 'origin/main'.

    nothing to commit, working tree clean
    ```

### `.commit-cache.md` 检测缓存

项目根 `.commit-cache.md` 是「commit skill 检测缓存」的**专用载体文件**：不存在 → 新建（只含缓存内容，**不碰项目的 `AGENTS.md`**）；存在 → 末尾追加（不破坏已有内容）。commit skill **不再在项目 `AGENTS.md` 里写缓存**——`AGENTS.md` 由项目脚手架维护、只承载项目说明，缓存独立到这个文件。文件统一格式，九类标记各自写入、互不依赖：

```
# commit skill 检测缓存

本文件由 commit skill（`/commit`）自动维护，记录项目标配检测的就绪状态，供后续 `/commit` 跳过重复检测。请勿手动编辑——commit skill 会按检测结果增补标记。

<!-- commit-skill: readme-standard = ok -->
- README 中英双语 + LOGO + 徽章 + 版权署名：已就绪（YYYY-MM-DD 确认）

<!-- commit-skill: license = ok -->
- LICENSE.md：已存在（YYYY-MM-DD 确认）

<!-- commit-skill: github-about = ok -->
- GitHub About：已配置（中英双语 description + topics，YYYY-MM-DD）

<!-- commit-skill: agent-persona = ok -->
- Agent 名称：已写入 README（<名字>，YYYY-MM-DD）

<!-- commit-skill: attribution-name = ok -->
- 版权人/署名引用名字：已统一为 `xhqing and contributors`（YYYY-MM-DD 确认）

<!-- commit-skill: contributing = ok -->
- CONTRIBUTING.md / CONTRIBUTING_cn.md：已存在且含「贡献者保留著作权」+「按项目许可证授权」两要素（YYYY-MM-DD 确认）

<!-- commit-skill: readme-link-text = ok -->
- 英文版 README 跳转中文版链接文字：已统一为「简体中文」（YYYY-MM-DD 确认）

<!-- commit-skill: repo-sponsors = ok -->
- 仓库 Sponsors 按钮：已就绪（xhqing/.github 全局默认 FUNDING.yml，YYYY-MM-DD 确认）

<!-- commit-skill: readme-badges = ok -->
- README 徽章：徽章组合合规（License/Version/Type 三枚，不含 Forks/Stars/Last Commit，也不含已取消的访问量徽章）（YYYY-MM-DD 确认）

<!-- commit-skill: changelog-version = ok -->
- CHANGELOG.md 与 VERSION 文件：已存在（YYYY-MM-DD 确认）

## 敏感扫描白名单

<!-- commit-skill: sensitive-whitelist -->
- **[YYYY-MM-DD]** <范围描述：哪个文件 + 哪类内容 / 关键标记>——用户确认可公开
```

- `readme-standard` 标记：第 9a 步检测到 README 中英双语（`README.md` 以美式英文为主、`README_cn.md` 以简体中文为主） + LOGO + 徽章 + 版权署名段全齐时写入。
- `license` 标记：第 9b 步检测到 `LICENSE.md` 存在（且无冗余）时写入。
- `github-about` 标记：第 9c 步补全 About（或检测发现已配）后写入。
- `agent-persona` 标记：第 9d 步检测到 README 已有名称（拟人名 / 简洁名，或新起并写入）后写入；仅 `README.md` 带 `Type-AI Agent` 徽章（或 `AGENTS.md` 自述为 agent）的项目适用。
- `automemory` 标记：**永久不写入**——9e 已随全局 AutoMemory 禁用而永久跳过（详见第 9e 步），缓存段不再出现该标记。
- `attribution-name` 标记：第 9g 步检测到 README（中英两版）与 LICENSE.md 的版权人/署名引用名字均已统一为 `xhqing and contributors` 格式（或无可改位置）后写入。
- `readme-link-text` 标记：第 9h 步检测到英文版 `README.md` 里指向 `README_cn.md` 的跳转链接文字已是「简体中文」（或英文版暂无该链接、留待 9a 补）后写入。
- `repo-sponsors` 标记：第 9i 步检测到 Sponsor 按钮配置就绪（当前仓库自有 `FUNDING.yml`，或全局 `xhqing/.github/FUNDING.yml` 默认配置生效）或修复成功后写入。
- `readme-badges` 标记：第 9l 步检测到 README（中英两版）徽章组合合规——标准三枚（License / Version / Type）齐全且不含 Forks / Stars / Last Commit 等动态徽章（访问量徽章已于 2026-11-04 取消，遗留的按违规处理；或某份文件不存在）后写入。
- `changelog-version` 标记：第 9m 步检测到项目根已有 `CHANGELOG.md` 与 `VERSION` 两个文件（或缺失时新建完成）后写入。
- `version-staleness` 标记：**永不写入**——9j 版本滞后检测反映 `VERSION` 当前是否落后于代码进度，状态随每次提交 / 每次发版动态变化，每次 `/commit` 都要重新查 GitHub Release + git log，**不缓存、不跳过**。
- `version-consistency` 标记：**永不写入**——9k 版本号一致性检测反映 `VERSION` 与各文件版本号当前是否对齐，状态随每次改动动态变化，每次 `/commit` 都要重新比对本地文件，**不缓存、不跳过**。
- 后续 /commit 第 9 步读此文件，按标记跳过对应检测；缺哪个标记就做哪项检测，只补缺的标记（9j 版本滞后检测、9k 版本号一致性检测均无标记、每次必查，不受此缓存机制影响）。
- 该 `.commit-cache.md` 与本次补全的 README/LICENSE 等都是 push 之后产生的工作区改动，本次未提交；本 skill 不执行 `git add`，需用户自行 `git add` 后下次 `/commit` 一并提交（本地存在即足以跳过检测）。

**敏感扫描白名单（与标配检测缓存并列的第二个用途）**：本文件除九类标配标记外，还可含一个「敏感扫描白名单」段——登记**用户明确确认「可公开」**的已报敏感命中项，`/commit` 第 2 步与 `/add` 第 3 步的敏感扫描读到后跳过对应范围的命中（汇报里仍列一行「白名单跳过」，不静默省略）。条目写法见上方的完整模板。写入门槛与边界：① 只有用户**明确**说「可公开 / 加入白名单」才追加对应条目，AI 不自行推断、不扩大范围——「某一条确认」不得外推成「整文件 / 整类信息永久豁免」；② 条目只覆盖描述范围，范围外（含同文件新出现的同类内容）照常扫、照常终止；③ 覆盖判定拿不准时按「不在白名单」处理（宁可多问一次）；④ 凭证类实值（私钥、token、密码等格式明确的密钥）命中不进白名单；⑤ 用户可随时删条目撤销，删后该内容从下次 `/commit` 起恢复拦截。

## 注意

- 本 skill 先完成「`git commit` + `git push`」（**不执行 `git add`**，只提交暂存区已有内容；main 直推与功能分支推送均如此，见第 0/8 步），**再**在第 9 步补齐项目标配（README/LICENSE/CHANGELOG/VERSION/About/Sponsors，含版权人/署名引用名字归一）；标配检测不阻塞提交推送。
- **commit + push 用 `&&` 串联成一条命令一次跑完**（2026-07-17 用户立；2026-08-01 修订：去除 git add，只提交暂存区）：不拆成多次 Bash 调用、不中途停下来向用户列命令确认（`/commit` 触发即授权当次完整流程）；auto mode 权限分类器拦下其中某条 git 写命令也不退缩去问用户——改用 `&&` 组合命令继续执行。详见「核心定位」段「两步用 && 串联一条命令跑完」。
- 敏感内容扫描、cache 检测**均在 `git commit` 之前执行一次**（针对暂存区已有内容），是 commit 前的两项硬性检测；`git commit` 之后不再重复。（版本号一致性检测已移至 push 后第 9k 步，不阻塞提交。）
- 禁止 `git push --force`、`git reset --hard` 等破坏性操作。
- **无远程仓库时**：第 8 步检测到 `git remote -v` 为空，会用 `gh repo create <目录名> --public --source=. --remote=origin --push` 主动创建公开 GitHub 仓库并推送（需 `gh` 已认证；未认证或创建失败则如实报告、跳过）。
- 不随意删除文件；处理敏感内容由用户自行完成。编辑/删除项目文件的**例外仅九类**：① README/LICENSE/CONTRIBUTING 标配补全（可编辑 `README.md`/`README_cn.md` 顶部 LOGO/徽章居中块 + 移除 Forks/Stars/Last Commit 等动态徽章（第 9l 步；访问量徽章已于 2026-11-04 取消，遗留的按违规删除） + persona 说明块 + 底部版权署名段 + 版权人/署名引用名字统一为 `xhqing and contributors` 格式（第 9g 步）+ 语言基调修正（把 `README.md` 里「本该用英文却写成中文」的正文改为英文，特殊场景的中文保留不动）+ 英文版跳中文版链接文字统一为「简体中文」（第 9h 步）、创建 `assets/logo.svg`、创建 `LICENSE.md`、**删除冗余的其它格式 license 文件**只保留 `LICENSE.md`）；② 项目根 `.commit-cache.md` 写入缓存标记或「敏感扫描白名单」条目（不存在则新建；白名单条目仅按用户明确确认追加，见第 2 步）；③ 全局 `~/.pi/agent/docs/agents-registry.md` 的「智能体命名注册表」追加新 agent 行（仅 9d 起名时，不改已有行）；④ cache 检测（第 3 步检测到的 cache 文件/目录可新增进 `.gitignore`）；⑤ 版本滞后提示（第 9j 步）——检测到 VERSION 滞后时只报告（新提交含 fix / feat 类改动时第 10 步会据此自动衔接 bump 链条完成发版；纯文档 / 杂事类不发版、不算问题——2026-10-13 修订），不就地修改文件；⑥ 版本号一致性同步（第 9k 步）——检测到 VERSION 与各文件版本号不一致时，以 VERSION 为唯一权威，更新 `package.json`/`package-lock.json`/`CHANGELOG.md`/主 manifest/README 的版本号到与 VERSION 一致（不动 VERSION 自身）；⑦ 新建 `CHANGELOG.md` 与 `VERSION` 文件（第 9m 步）——检测到项目缺这两个文件时按 9m 规则创建；⑧ **第 10 步自动衔接的 bump 链条**（2026-10-02 起）——版本号载体文件的改动由 `/bump` 环节按其 skill 职责执行。其余文件及 `.gitignore` 其它部分严禁改动/删除。
- **remote main 禁止直接 push（分支保护）或 push 被 non-fast-forward 拒绝时**：不再只作指引，自动走 PR 兜底通道（建分支 → push 分支 → 建 PR → enable auto-merge，CI 绿后自动 squash 合并，见第 8 步）；PR squash 合并后本地 main 由第 9z 步自动对齐并清理已合并分支（非破坏性命令，异常即停交人工），仅 9z 异常 / 超时的场景才由用户决定。
- 推送冲突或错误如实报告，不自行破坏性解决。
- **第 11 步 `git status` 收尾由工具强制**（pi 端 `~/.pi/agent/extensions/git-status-guard.ts`，2026-09-21 立）：授权 commit 后最终回复的 `>> git status` 代码块与扩展实测输出比对，不符即替换；漏贴则 run 结束时 notify 用户真实输出。AI 不得依赖「会被替换」而跳过实际执行——先执行再贴是纪律，替换与 notify 是失守后的兑底曝光。

## 汇报

报告提交与推送结果：**工作区（主工作区 / worktree 绝对路径）与分支名**、本次提交的暂存区文件清单（按新增、修改、删除分组）、commit hash、分支名、远程仓库地址、推送是否成功、推送的提交范围（如适用）；**功能 / 杂事 / bump 分支场景加报**：分支推送结果（分支名、推送范围）、建 PR 结果（新建 PR 的 URL，或已有 open PR 的链接）与 auto-merge 状态（已启用，CI 绿自动合并）、9z 等待与对齐结果（PR 是否已合并 / 等待时长或超时、本地 main 对齐结果、已清理的本地与远端分支；CI 失败或异常即停的如实报告原因与后续指引），并提示——**修复 / 功能合并进 main 后由发版链自动发正式版**（2026-10-09 用户明确：「修复合并进 main 之后就应该自动发布正式版」——**不要拿「要不要发版」问用户**）：`/commit` 走到第 10 步会自动触发 bump 链条完成发版（**纯文档 / 杂事类改动不发版**——2026-10-13 用户立）；验收在发版之后进行（用户装上正式版实际使用），发现问题走修复循环 + 补丁版；**main 直推被拒、自动走 PR 兜底通道的场景加报**：拦截原因（分支保护 / non-fast-forward）、所建分支名、PR URL、auto-merge 状态、9z 等待与对齐结果（PR 是否已合并 / 等待时长或超时、本地 main 对齐结果、已清理的本地与远端分支；异常即停的如实报告原因，交用户处理）；若因发现敏感内容而终止，则列出对应文件清单、敏感片段与处理建议；若本次扫描有白名单跳过项，加报一行「白名单跳过：<条目摘要>」（不展开）；若因发现 cache 文件/目录而终止，则列出 cache 清单、已写入 `.gitignore` 的忽略规则，并提示用户从暂存区移除 cache（`git restore --staged` / `git rm --cached`）。（版本号不一致不再终止提交——已移至 push 后第 9k 步处理。）并提示「本次提交流程已终止，处理 / 确认后需重新触发（重新输入 `/commit`，或重新 `/add` 且预检完全干净自动衔接）走完整流程」。随后报告第 9 步项目标配检测的结果：补了哪些内容（logo.svg、README/README_cn 改动或新建、徽章清单（License / Version / Type 三枚补全情况，含移除 Forks / Stars / Last Commit 等动态徽章，如有；若发现遗留的访问量徽章则报告已删除）、版权署名段、persona 名称、LICENSE.md 新建/冗余删除、About 的 description/topics、版权人/署名引用名字统一为 `xhqing and contributors` 的改动、CONTRIBUTING.md / CONTRIBUTING_cn.md 的存在与要素检查结果（缺则新建、缺要素则补齐）、英文版 README 跳中文版链接文字统一为「简体中文」的改动、仓库 Sponsors 按钮（检测 / 修复 `xhqing/.github` 全局 FUNDING.yml）的改动、CHANGELOG.md 与 VERSION 文件（第 9m 步）的新建结果（缺哪个建哪个 + 版本号取值来源）或已存在确认、版本滞后检测的结果（VERSION 是否滞后；若滞后则报告：当前 VERSION / 最新已发布版本 / 待发布提交数 + 指引「发版时统一 bump，执行 /bump」——不就地修改文件）、版本号一致性检测的结果（VERSION 与各文件是否一致；若不一致则报告：以 VERSION 为准同步了哪些文件 + 各自旧值→新值））以及写入了哪些缓存标记；**报告第 10 步自动发版检测与衔接结果**（走了发版链则报告全程——版本未就绪时含 bump 的新版本号与改动文件、add 预检结果与暂存情况、bump 提交的 PR / CI 合并 / 对齐，以及最终的版本号 / tag / GitHub Release URL / 产物与清理，转述各环节汇报要点；未触发或链条中途停下则说明原因——工作区或暂存区不干净 / PR 未合并 / 无新提交 / 新提交均为非功能类（纯文档 / 杂事，2026-10-13 规则下不发版，含判定依据摘要）/ 无 VERSION / gh 未就绪 / 链条停在某环节待人工）；提醒「本次补全的标配内容是新工作区改动，本 skill 不执行 git add，需用户自行 `git add` 后再 `/commit` 才会提交（功能分支上，下次 `/commit` 继续推送到同一分支）；有这类未提交改动时第 10 步不会自动发版，提交后的下次 `/commit` 会再走发版检测」。**汇报的最后一件事（2026-09-05 用户立；同日修订：代码块首行加 `>> git status` 命令标记）**：执行 `git status`（worktree 场景 `git -C <目标工作区> status`），把该命令的输出**原样**以代码块方式直接输出——不加工、不总结、不截断、不做额外解读，代码块**首行固定加一行 `>> git status` 命令标记**（让用户一眼看出这是 `git status` 的执行输出；标记行是呈现格式、不算命令输出的一部分）；无论流程走完还是中途终止（敏感内容扫描 / cache 检测命中），汇报都以这个 `git status` 代码块收尾（对应执行流程第 11 步）。
