---
name: "release"
description: "打 tag 发布版本：读取版本号与 CHANGELOG，打带注释的 git tag、推送到远程、创建 GitHub Release（含 Release notes；构建产物按项目声明、未声明默认不带；notes / tag message 发布前走敏感信息自检，命中即暂停）。触发来源两种：① 用户输入 release / 打tag发布 / 发版；② commit skill 第 10 步自动衔接（2026-10-02 用户立；2026-10-13 修订：仅自最新 tag 含 fix / feat 类改动时自动发版，纯文档 / 杂事类不发版：/commit 完整成功且工作区 / 暂存区干净、在 main 与远端同步、自最新 tag 有新提交且含 fix / feat 类改动时——版本就绪直接进入本流程；未就绪则先自动走 /bump → /add → /commit 链条补齐版本、就绪后进入本流程完成发版）。两种来源均授权完整流程（git tag -a + git push tag + gh release create）、标准情况无需逐次确认；遇 tag 已存在等异常暂停询问；发布成功后删除本次构建的本地产物。正式发布（默认）只从 main 打 tag——正式版必须在功能合并进 main 之后（remote main 锁定、经 PR + CI 合并，2026-09-21 起）；另支持预发布通道（用户明确要求 prerelease / 预发布 / 发 rc / beta 时）：从功能分支打带 -rc.N / -beta.N 后缀的 tag 发 --prerelease 标记的 Release，不 bump 版本文件，供合并 main 前的验收与早期尝鲜。"
---

# Auto Tag & GitHub Release

当用户输入 `release`（或「打 tag 发布」「发版」）时，**或由 commit skill 第 10 步自动衔接时**（2026-10-02 用户立，见下方「授权语义」），读取当前项目版本号与 CHANGELOG，**依次执行 `git tag -a` → `git push origin <tag>` → `gh release create`**，打带注释的 git tag、推送到远程、创建 GitHub Release（含 Release notes；构建产物按项目声明——声明要产物的项目构建上传，未声明默认不带）。

## 授权语义（对应「下次不问」）

- **触发来源两种（2026-10-02 修订）**：
  1. **用户主动输入** `/release`（或「打 tag 发布」「发版」）——即**明确授权**当次的 `git tag -a` + `git push origin <tag>` + `gh release create`，**直接执行完整流程，无需逐次列命令等确认**。
  2. **commit skill 流程末尾（第 10 步）的自动衔接**——`/commit` 完整成功且满足「在 main 与远端同步 + 工作区 / 暂存区干净 + 自最新 tag 有新提交**且含 fix / feat 类改动（2026-10-13 用户立：仅核心功能修复 / 新增触发自动发版；纯文档 / 杂事类不发版）**」时：版本就绪（`VERSION` 未发布 + CHANGELOG 顶部一致）→ commit skill 直接进入本流程；版本未就绪 → commit skill 先自动走 `/bump` → `/add` → `/commit` 链条补齐版本（2026-10-02 同日修订，不提示、不询问），就绪后再进入本流程。该来源的授权依据：用户立「commit 成功后自动衔接触发发版、未就绪自动 bump → add 补齐后继续」规则时的预授权（详见 commit skill 第 10 步与全局 `~/.pi/agent/AGENTS.md`「Git 写操作必须先征得同意」段）——与来源 1 等效，**直接执行完整流程、无需二次确认**。**门禁边界（2026-10-13 用户立）**：fix / feat 门禁只约束来源 2 的自动衔接；用户主动输入 `/release`（来源 1）与手动 `/bump` 不受限——显式发版意图即授权（纯文档版本确需发版时，手动触发照常执行）。
- 本 skill 与 `/commit` 同属「触发即授权的 git 写操作类 skill」，不适用全局「git 写操作逐次确认」规则——发布就是要一键完成，再问一遍是多余的反 confirm。**自动衔接来源下执行流程一步不省**（第 0 步起的全部校验与下方安全阀照常生效）。
- **例外**：下列异常情况**必须暂停询问**用户后再继续（这不属于「标准流程的确认」，而是异常安全阀）：
  - 该 tag **本地或远程已存在**（尤其指向非 HEAD 的错误 commit 时——需用户确认是否 force push 修正，绝不自行 force push）；
  - 工作区有**未提交改动**（需用户确认先 commit 还是中止）；
  - CHANGELOG 中**找不到该版本条目**（需用户确认 notes 来源）；
  - GitHub **已有同名 Release**（需用户确认编辑还是保持不动）；
  - 版本号异常（如低于当前最新 tag）；
  - **公开文本敏感自检命中**（notes / tag message 含疑似敏感内容——需用户改写文本或明确确认可公开，详见第 4 步；全部发布路径均适用）。

## 核心定位：一次完成「打 tag + 推送 + 发 Release」

- 本 skill **依次执行 `git tag -a`、`git push origin <tag>`、`gh release create`**：先打 annotated tag，再推送，最后创建 Release。
- tag 必为 **annotated**（`-a`，带注释），message 取自 CHANGELOG；**不用 lightweight tag**。
- Release notes 取自 CHANGELOG 对应版本条目。
- **不 commit、不改动工作区文件**：假定版本号、CHANGELOG、构建产物已就绪。工作区脏则暂停（commit 是 `/commit` 的职责）。
- **严禁** `git push --force`、`git tag -d` 删除远程 tag、删除已发布 Release，**除非**用户在异常分支明确同意。
- **严禁**编辑、删除、格式化项目文件，不改动 `.gitignore`。

## 发布语言：GitHub Release 内容统一全英文

- 发布到 GitHub Release 的**对外可见内容**一律使用**全英文**，不用中文或中英混排。具体包括：Release **title**、Release **notes**、annotated **tag 的 message**。
- **理由**：Release 是面向全球开发者的公开产物，全英文保证最广可读性，也与英文项目 description、topics 的风格一致。
- **CHANGELOG 是中文时需翻译**：CHANGELOG 该版本条目若含中文（或中英混排），先**逐条翻译成地道英文**，再用于 tag message 与 Release title / notes。
  - **翻译后即用、不回写 CHANGELOG 源文件**——本 skill 严禁编辑项目文件，CHANGELOG 保持项目原有语言不动。
- **翻译要求**：用规范、地道的通用英文技术表述；版本号、文件名、命令、代码片段等专有 token 原样保留；逐条对照不漏条目、不自造缩写。标题用简洁概述（如 `Add resource cleanup whitelist`），正文用条目列表。
- **异常分支的手写 notes 同样用英文**：若 CHANGELOG 找不到条目而由用户手写或给简短描述，仍以英文写入 Release；`--generate-notes` 自动生成的 notes 本身即英文，可直接使用。
- **构建产物文件名不强制改**：文件名一般已是英文 / 版本号（如 `xxx-0.2.2.vsix`），无需为语言要求重命名。

## Release 标题：统一「项目名 + 版本号」格式（2026-09-06 用户立）

- GitHub Release 的 **title 一律用「`<项目名> <版本号>`」格式**（如 `zcode-cli 3.8.1-27`），**不用长描述句**。项目名取仓库目录名（`basename`，与 package.json `name` 不一致时以目录名为准）。
- **为什么**：Release 列表页只显示 title，「项目名 + 版本号」能一眼对出版本；描述句作 title 会在列表里被截断成冗长的省略行，既难扫读也不像版本（2026-09-06 用户纠偏：zcode-cli 的 v3.8.1-22 ~ -27 曾用描述句当 title，属偏离，早期 v3.8.1-21 及以前才是「项目名 + 版本号」的正确格式）。
- CHANGELOG 该版本条目的**概述句（第一行标题 / 概述）翻译成英文后，只作为 Release notes 与 annotated tag message 的正文首行**，不作 Release title——信息不丢，列表显示归格式。
- **历史 Release 已是描述句标题的**：发现时列出清单，提示用户是否统一回改为「项目名 + 版本号」（`gh release edit <tag> --title "<项目名> <版本号>"`），经用户同意后执行，不擅自批量改。

## 安装链接：固定 tag 形式，禁用 latest/download（2026-09-08 用户立）

- Release notes、README 等处给出的**安装链接（npm/bun install 指向 Release asset 的 URL 等）一律用固定 tag 形式**：`https://github.com/<owner>/<repo>/releases/download/<tag>/<asset>`（如 `.../releases/download/v3.8.1-32/zcode-cli-3.8.1-32.tgz`）。
- **禁止** `https://github.com/<owner>/<repo>/releases/latest/download/<asset>` 形式（含翻译 / 改写 notes 时顺手带出的存量链接——遇到即改为固定 tag 形式）。
- **为什么**：`latest/download` 永远指向**当前最新** Release 的同名 asset，而 asset 文件名通常带版本号——下一个版本发布后，历史文档里的该链接必然 404（zcode-cli 曾以「发版前预对齐版本号」勉强维持，历史上两轮忘记执行导致 README 链接长期 404；2026-09-08 用户裁定弃用）。固定 tag URL 永指该版本 asset，历史链接永不失效。
- **README 里的存量 latest 链接**：发布涉及的项目 README 若仍用 latest/download 形式，**发现即在汇报中列出、建议随下次 bump / commit 改为固定 tag 形式**——本 skill 仍不编辑项目文件（发布要求工作区干净，中途改文件破坏发布原子性）。

## 预发布通道：合并 main 之前的功能分支 Release（2026-09-21 立）

- **触发**：用户明确说「预发布 / prerelease / 发个 rc / beta 版」；或 dev-workflow 第 9 步使用验收选择手动预发布安装来源（配 auto-rc workflow 的项目：合并进 main 后的 rc 由 workflow 自动发，手动预发布主要用于合并前提前试用与未配 workflow 的项目——用户要 rc 而项目有 auto-rc 时先报告最近的自动 rc，避免重复手发）。正式发布（默认路径）不涉及本节。
- **与正式发布的分界**：正式版 tag 只打在 main 上（第 0 步强校验 HEAD === origin/main）——**正式发布必须在功能合并进 main 之后、且以用户试用满意为前提**（dev-workflow 2026-09-21：合并由 CI 独裁、验收是过程——用户体验预发布版本就是在验收，试用满意才正式发版）；预发布 tag 打在当前分支 HEAD 上——**合并前从功能分支打**（前瞻快照，CI 慢的窗口期就开始试用）、**合并后从 main 打**（带修复的持续试用，正式发版前的最后确认），两个阶段都服务「体验即验收」。
- **版本号**：目标版本 + 预发布后缀——`v<目标版本>-rc.N`（接近定稿）或 `v<目标版本>-beta.N`（功能成型）。目标版本 = CHANGELOG 顶部待发布条目版本（若有），否则从当前 VERSION 按待发布改动性质 +1（新增功能 → minor；修复 / 文档 → patch）；N 从 1 起，`git tag -l 'v<目标版本>-rc.*'` 与 `gh release list` 查已有序号后递增。**不 bump 版本文件**：VERSION / package.json / CHANGELOG 都不动（正式发版时经 `/bump` 统一改），预发布只存在于 tag 与 Release 层面——与「功能分支不碰版本号」纪律一致。
- **流程差异**（相对正式发布各步）：第 0 步按分流处理（不要求对齐 main，改为确认当前分支与 HEAD 即预发布目标）；第 2 步工作区干净检查照常；第 3 步 tag 存在检查照常；第 4 步 CHANGELOG 无对应条目 → notes 用 `--generate-notes` 或与用户确认的简短英文描述（不强求 CHANGELOG 条目，预发布内容未定稿属正常）；**无论 notes 来源为何，均须过第 4 步的公开文本敏感自检**；第 5-6 步打 annotated tag（message 用 notes 首行）+ 推送照常；第 7 步 `gh release create <tag> --prerelease --title "<项目名> <版本号>" ...`（必带 `--prerelease` 标记）；产物从当前分支构建上传，产物核查（以项目声明为准）照旧适用。
- **试用后处置**：试用中发现问题 → 修复合并（fix 分支 + PR + CI auto-merge）后递增 N 发新预发布（rc.1 → rc.2），旧的保留不动；试用满意 → 用户触发 `/bump`（改齐版本号后自动衔接 `/add` → `/commit` → `/release` 完成正式发版，2026-10-02 起），预发布 Release 保留即可（正式版发布后自然被取代），不删除。
- **版本一致性交互**：预发布 tag 的后缀版本号与 VERSION 不一致属「有意区分」（全局版本一致性规则允许判断后缀），commit skill 9k 不据此改文件；9j 版本滞后检测查的是正式版 tag（`gh release view v<VERSION>`），预发布 tag 不同名、不误报。

## 执行流程

0. **路径分流 + 对齐 remote main（最前置）**：先分正式发布 or 预发布——
   - **预发布**（用户明确要求 prerelease / 预发布 / 发 rc / beta 版，或 dev-workflow 第 9 步使用验收选择手动预发布安装来源——配 auto-rc 的项目优先用自动 rc，见「预发布通道」触发条）→ 走「预发布通道」一节：不从 main 校验（合并前从功能分支、合并后从 main 均可），不适用本步其余校验（版本就绪校验跳过），确认当前分支与 HEAD 即预发布目标后，按预发布变体进入第 2 步起的流程；
   - **正式发布**（默认路径）：正式版只从 main 发布——**功能必须已合并进 main**（remote main 锁定、经 PR + CI 合并，2026-09-21 起）：
     - **在主工作区对齐 main**（worktree 里 `git switch main` 会 fatal——`already used by worktree`）：`git -C <主工作区> fetch origin && git -C <主工作区> merge --ff-only origin/main`；
     - 校验 `HEAD === origin/main`（`git -C <主工作区> rev-parse HEAD` 与 `git -C <主工作区> rev-parse origin/main` 相同）：落后（bump PR 还没合并 / 功能 PR 还没合并）→ **暂停**，提示先完成对应合并（`gh pr list` 查看未合并 PR；bump PR 等 CI 绿 auto-merge）后再 `/release`；本地与远端分叉 → **暂停**报告，等用户确认对齐方式；
     - 校验版本就绪：`VERSION`（或版本源文件）与 CHANGELOG 顶部条目版本号一致——不一致说明尚未 bump → **暂停**，提示先执行 `/bump`（三段式发版：/bump → /commit（push + 建 PR）→ CI 绿 auto-merge → /release）；
     - 本 skill **不 push main 分支**：tag 推送（`git -C <主工作区> push origin <tag>`）只推 tag 引用、不碰分支更新，不携带本地 main 的未推送提交。
     - **worktree 场景**（会话 cwd 在主工作区、提交发生在另一个 worktree）：本 skill 的第 2–7 步全部针对**主工作区**，每条 git 命令带 `-C <主工作区>`（tag 必须打在 main 的 HEAD 上，不能打在任务 worktree 的分支上）；任务工作区只用于核验「它的提交已进 origin/main」。
1. **确定版本号与 tag 名**
   - 依次探测版本来源（取第一个命中的）：`package.json` 的 `version` 字段 → `VERSION` 文件 → `pyproject.toml` 的 `version` → `Cargo.toml` 的 `version`。
   - 规范化 tag 名：若版本号不以 `v` 开头则加 `v` 前缀（如 `0.2.2` → `v0.2.2`）；若已是 `v0.2.2` 则保留。下文记为 `<tag>`。
   - 目标 commit 默认为 `HEAD`。

2. **检查工作区**
   - `git -C <主工作区> status --porcelain`：若有任何未提交改动 → **暂停**，列出改动清单，提示用户先 `/commit` 或明确指示后再继续。
   - 工作区干净 → 继续。

3. **检查 tag 是否已存在（本地 + 远程）**
   - `git -C <主工作区> tag -l '<tag>'`（本地）、`git -C <主工作区> ls-remote --tags origin '<tag>'`（远程）。
   - **都不存在** → 进入标准流程（第 4 步起）。
   - **已存在**（本地或远程）→ **暂停**，报告：
     - 该 tag 本地 / 远程分别指向的 commit；
     - 与 HEAD 的关系（一致 / 落后 / 领先几个 commit）；
     - tag 类型（annotated / lightweight，远程用 `gh api repos/<owner>/<repo>/git/refs/tags/<tag>` 与 `git/tags/<sha>` 确认解引用到的 commit）；
     - GitHub 是否已有对应 Release（`gh release view <tag>`）。
     并给出处理选项（force push 修正指向 / 补发或更新 Release / 保持现状），等用户选择。**不自行 force push 或删除。**

4. **读取 CHANGELOG 该版本条目、翻译并自检公开文本**
   - 在 `CHANGELOG.md`（或 `CHANGES.md` / `HISTORY.md` 等）中定位 `## [<version>]` 或 `## [<tag>]` 段落，提取到下一个 `## [` 之前的内容。
   - 第一行（标题 / 概述）与其余内容分别用作 **notes 正文首行**与 **body / notes**——概述句不作 Release title，title 按「Release 标题」一节取「`<项目名> <版本号>`」格式。
   - **语言**：条目若含中文（或中英混排），按上方「发布语言：GitHub Release 内容统一全英文」一节**翻译成地道英文**后再用于 notes（翻译后即用、不回写源文件）；后续 tag message、Release notes 均以此英文版本为准。
   - 找不到 CHANGELOG 或该版本条目 → **暂停**，问用户 notes 来源（手写 / `--generate-notes` 自动生成 / 简短描述）。
   - **公开文本敏感自检（打 tag 前必做，2026-10-03 增补）**：notes 与 tag message 定稿后、**任何公开动作（打 tag / 推 tag / 建 Release）之前**，对最终对外文本做一次敏感信息检测——这是 Release 内容的最后一道防线。理由：Release 一旦发布即面向全球公开（Release 页面、通知、RSS 均会分发），曝光面大于仓库文件本身；而手写 notes、`--generate-notes` 文本、翻译现场生成的新文字都不在 `/add` / `/commit` 的扫描链覆盖内，必须在这里兜住。
     - **检测对象**：Release notes 文本与 tag message 文本；两者同源（tag message = notes 首行 + body）时合并为一份自检，有差异时分别扫。title 由项目名 + 版本号构成、无独立风险，不专门检测。
     - **检测方式**（工具 + 语义两层，口径与 `/add` 预检一致）：
       1. 把待发布文本写入临时文件（如 `tmp/release-notes-check.txt`，用后清理），跑 `gitleaks dir <文件> --config ~/.gitleaks.toml --no-banner -v`——命中即列出 RuleID 与行号；gitleaks 缺失或执行失败 → 降级为 AI 正则扫描（私钥头、token 特征串、公网 IPv4 等）并在汇报中标注「工具层未生效」。
       2. AI 语义自检：逐段检查三类无固定格式的敏感内容——财务状况（收入目标、本金、资产、负债、存款等）、个人隐私标识（账户号、证件号、真实联系方式、真实 IP / SSH 连接串、密钥实值）、敏感叙述（身份 + 网络出口 + 绕行手段的故事线、合规拒单报文原文、服务商节点代号）；**拿不准的按可疑处理**。
       3. 先读项目根 `.commit-cache.md` 的「敏感扫描白名单」段（不存在则跳过）：用户此前明确确认可公开的条目按描述范围跳过，汇报里列一行「白名单跳过」（不静默省略）；范围外照常扫；凭证类实值命中不适用白名单。
     - **`--generate-notes` 来源**：其文本由 GitHub 在创建 Release 时才现场生成——为保持「自检早于公开」的不变量，改用 `gh api repos/<owner>/<repo>/releases/generate-notes -X POST -f tag_name=<tag> -f target_commitish=<sha> --jq .body > tmp/release-notes-check.txt` 先预生成文本 → 自检 → 创建时用 `--notes-file` 传入同一文本（不用 `--generate-notes`）。
     - **命中处理**：**暂停本次发布**（不 tag、不推、不建 Release），报告命中文本、位置（RuleID / 行号 / 片段）与处理建议（改写为中性表述；确认可公开的按白名单格式追加进 `.commit-cache.md`）；用户处理后**重新触发 `/release`** 走完整流程——白名单条目当次追加、下次流程起效（与 `/commit` 的机制一致）。自检通过（含白名单跳过）的，在最终汇报中注明。
     - **完成后的放行标记（工具强制）**：自检通过后，后续公开命令必须在命令末尾加注释标记 `# AI_SENSITIVE_CHECKED`（第 5-7 步及异常分支的 `git tag -a`、`git push origin <tag>`、`gh release create`、`gh release edit` 都适用）——public-text-guard（pi 端 `~/.pi/agent/extensions/public-text-guard.ts`）对未带此标记的「打 annotated tag / 推送 tag / 创建或编辑 Release」一律 deny（该守卫同时覆盖 PR / Issue 创建，见 commit skill「公开文本敏感自检」节）。标记语义 = 「将公开的文本已检查」，只能在自检通过（或确认文本无敏感）后添加，不得为绕过拦截擅自添加。

5. **打 annotated tag**
   - `git -C <主工作区> tag -a <tag> -m "<notes 首行>" -m "<body>" # AI_SENSITIVE_CHECKED`（notes 首行 = 概述句英译，与 body 分两个 `-m`；body 多行直接用换行；标记见第 4 步「完成后的放行标记」）。
   - message 末尾**不加** `Co-Authored-By`（tag 非提交，无需署名）。

6. **推送 tag**
   - `git -C <主工作区> push origin <tag> # AI_SENSITIVE_CHECKED`。
   - 若被拒（远程已存在）→ 回到第 3 步异常处理（**不自行 `--force`**）。

7. **创建 GitHub Release**
   - 先 `gh release view <tag>` 确认是否已有 Release：
     - 无 → `gh release create <tag> --title "<项目名> <版本号>" --notes "<notes>" # AI_SENSITIVE_CHECKED`（title 格式见「Release 标题」一节；标记见第 4 步「完成后的放行标记」）。
     - 已有 → **暂停**，问用户是否编辑（`gh release edit <tag> # AI_SENSITIVE_CHECKED`）或保持不动。
   - **构建产物上传**：探测常见产物路径（`*.vsix`、`*.tgz`、`dist/*`、`build/*`、`target/*.zip` 等）。若有，作为 asset 附加：`gh release create <tag> ... <asset-paths>` 或 `gh release upload <tag> <asset-paths>`。
     - 若产物需先构建（如 `npm run package` 生成 vsix），**暂停**提示用户先构建，或征得同意后执行构建命令再上传。
   - **产物核查（本地探测为空时必做，2026-09-19 立；2026-10-04 修订：以项目声明为准，取消历史 assets 信号）**：本地未检出产物 ≠ 可以无产物发布；但**不再检查「本仓库历史 Release 挂过 assets」**——历史挂载可能是借用 Release 作备份等非惯例用途，属假信号（2026-10-04 用户立）。判定**以项目自身声明为准**，以下任一命中即视为「已声明要产物」：
     1. 项目规则 / 文档 / 项目 skill / `.commit-cache.md` 等明确写「发版需附产物」（典型如 VSCE 类项目要 `.vsix`、二进制 / CLI 项目要打包产物——它们的安装 / 分发链路以 Release 产物为载体）；
     2. 仓库自身声明了产物构建：存在 tag 触发的产物构建 workflow（`.github/workflows/*.yml` 中有 `on: push: tags` 且工作内容为构建并上传 Release assets），或 README / 安装文档的下载链接从 Release 取产物（如固定 tag 的 `releases/download/<tag>/<asset>`）；
     3. fork 场景：`upstream` remote 同名 tag 的 Release 挂有 assets（上游项目自身发布的产物内容）。
     **已声明 → 照常构建并上传**：构建方式优先用仓库自带的构建 / 打包脚本（CI 中心化项目通常配有本地镜像 CI 的脚本，如 `build-binaries.sh`，常带 `--platform` 参数可只构所需平台），征得同意后执行构建 → 冒烟验证产物（解包后可执行、`--version` / 基本功能正确）→ 随 `gh release create <asset-paths>` 附带或 `gh release upload` 补挂。**未声明 → 默认不带产物，直接发布、不再询问**（不暂停、也不因历史 assets 停）。
     - 为什么：产物探测模式偏 VSCode 扩展（vsix / dist / build），对「产物由 CI 或专用脚本构建、发布前本地不存在」的项目（如 monorepo 的各平台二进制包）零命中；探测为空就安静发布，会让这类项目发出无任何 assets 的裸 Release、事后人工补救。而「历史挂过 assets」并不等于「本版应有产物」（可能是一次性的借 Release 作备份），该信号误伤过，故 2026-10-04 起改以项目声明为锚。CI 中心化项目（上游靠 CI 从 draft 转正并挂 assets）在 fork 里 CI 链通常不可用——GitHub 对 fork 默认抑制 workflow 运行、发布类 secrets 缺失，产物只能本地构建，本地核查必须补位。另注意：本地直接 `gh release create` 正式 Release 与这类 CI 的「draft → 校验 → 转正」编排互斥（CI 拒绝碰已发布的正式 Release），fork 场景以本地构建 + `gh release upload` 手动补挂为准。
   - Release notes 优先用 CHANGELOG 内容（`--notes "<notes>"`）；若内容很长，写入临时文件用 `--notes-file <file>`（临时文件放项目 `tmp/` 目录，用后清理；确保 `tmp/` 已在 `.gitignore`）。

8. **验证**
   - `git ls-remote --tags origin '<tag>'` 确认远程 tag 已就位；若需确认 annotated tag 解引用到 HEAD，用 `gh api repos/<owner>/<repo>/git/refs/tags/<tag>` 查 `object.type` 为 `tag` 且解引用 commit = HEAD。
   - `gh release view <tag>` 确认 Release 已发布、asset 已上传、notes 正确。

9. **清理本地构建产物**
   - 发布**成功并验证通过**（第 8 步）后，删除本次为发布构建的可分发产物文件——即作为 Release asset 上传的那些（如 `*.vsix`、打包的 zip / tar、可执行包等）。产物已归档到 Release，本地无需保留，删除以保持工作区整洁、避免版本堆积。
   - **只删本次构建产生的可分发产物文件**；不删开发期编译中间输出（`dist/`、`out/`、`build/` 等中间目录——下次开发还要用，且通常已在 `.gitignore`），不删源码、不删正式 `assets/` 里的图标 / logo 源文件。
   - 构建产物属发布流程产生的临时文件，删除不违反「严禁删除项目文件」（该禁令针对源码、配置等项目主体）。
   - **仅发布成功后才删**：若中途异常暂停（tag 已存在、Release 已存在、上传失败等），**保留产物**不删（可能还需重试上传）。
   - 历史遗留的旧版本产物（如之前版本残存的 `*.vsix`）一并提示用户是否清理。

## 注意

- 本 skill 一次性完成「打 tag + 推送 + 发 Release」；不负责 commit 工作区改动（那是 `/commit` 的职责）。
- tag 必为 annotated（`-a`），message 取自 CHANGELOG；不用 lightweight tag。
- GitHub Release 对外内容（Release title / notes、tag message）统一全英文；CHANGELOG 是中文时翻译后使用，不回写源文件。
- Release title 统一「`<项目名> <版本号>`」格式（如 `zcode-cli 3.8.1-27`）；概述句只作 notes / tag message 正文首行，不作 title。
- 遇 tag 已存在、工作区脏、CHANGELOG 缺条目、Release 已存在等异常，**暂停询问**，不自行 force push / 删除 / 覆盖。
- **公开文本发布前必过敏感自检**（第 4 步）：notes / tag message 定稿后先检测再发布，命中即暂停本次发布、处理后重新走完整流程；手写 notes 与 `--generate-notes` 来源不在 `/add` / `/commit` 扫描链内，尤其不能跳过。**由 public-text-guard 工具强制**（pi 端 `public-text-guard.ts`，2026-10-03 立）：未带 `# AI_SENSITIVE_CHECKED` 标记的打 tag / 推 tag / `gh release create|edit` 一律被 deny（该守卫同时覆盖 PR / Issue 创建，见 commit skill「公开文本敏感自检」节）。
- 预发布必带 `--prerelease` 标记（不带标记会把功能分支版本当作正式版暴露给 latest 指针）；预发布不 bump 版本文件，正式发版时统一 `/bump`。
- 构建产物上传前确认产物存在；**本地探测为空时按第 7 步做产物核查（以项目声明为准，2026-10-04 修订）**——项目已声明要产物（规则 / 文档 / workflow / 下载链接 / fork upstream 等，见第 7 步）则照常构建上传（需构建时先暂停征得同意）；未声明则默认不带产物、直接发布、不再询问，不以本仓库历史 assets 推断。
- 临时 notes 文件放 `tmp/` 并清理，不污染项目。
- 发布成功后删除本次构建的可分发产物（vsix / 压缩包 / 可执行包等），不删中间编译输出（`dist/`、`out/`、`build/`）与正式 `assets/`；异常暂停时保留产物。
- 推送或 Release 创建失败如实报告，不自行破坏性重试。

## 构建失败怎么办（2026-11-12 用户立）

发版后由 CI 构建（如 cmux 的 `build-macos`）失败时，**不怪仓库，不改历史**：

1. **不要**删 tag、删 Release、移动 tag（`git tag -f` + force push）、同版本重试——失败的 tag 与 Release **原样保留**。
2. 先修掉导致构建失败的问题，走正常 fix 分支 + PR + CI 合并。
3. **递进一个版本**：`/bump` 到下一个修订号（r19 失败 → r20 → r21 …），CHANGELOG 写清上一版失败原因与本次补救。
4. 新版本照常 `/release`。可给失败版本的 Release **追加**一句说明（「构建失败，由 rN 取代」）——只追加，不删改原文。
5. **发版前尽量先验证构建**：能用 `workflow_dispatch` 从 main 跑一次完整构建就先跑（如 `gh workflow run build-macos --ref main`），避免带着未验证的代码打 tag——2026-11-12 连续两版（r19 / r20）都因未验证就发版而失败。

用户原话：「以后发版失败都是递进一个版本，保留失败历史记录原样不动。」工具强制：`release-history-guard.ts` 拦截删除 / 改写已发布 tag 与 Release 的命令（逃生门 `# AI_AUTHORIZED_RELEASE_HISTORY` 仅限用户当轮明确要求）。

## 汇报

报告发布结果：版本号、tag 名、tag 指向的 commit（= HEAD）、推送是否成功、GitHub Release URL、Release title、上传的 asset 清单（若有）、已清理的本地构建产物（若有）、公开文本敏感自检结果（通过 / 白名单跳过条目摘要，若有）；若因异常暂停（含敏感自检命中），则列出异常详情与可选项。
