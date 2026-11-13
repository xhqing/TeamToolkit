# 分支保护（main 锁定）现状与操作

> 2026-10-04 立。回答一个反复踩到的问题：**「remote main 已锁定」是按仓库实际设置定的，不是全局默认。**
>
> 背景：政策文档早先写了「remote main 恢复分支保护、锁定直推、一切经 PR + CI 合并」，但 2026-10-04 实测发现：全机 42 个远程仓库里只有 **4 个**真开了保护——当天一次正常的直推 main 被当成异常去追查，白花排查时间。口径长期与现实不符，本身就是下一个坑，所以把「哪些仓库是哪种状态」写成事实来源。

## 2026-11-03：新建仓库一律必须 strict 模式的 PR CI（用户立规）

用户原话：「规定以后新建立的项目仓库全部必须使用 strict 模式的 pr-ci」。

**规矩本身**（已同步写入 `~/.pi/agent/AGENTS.md`「开发流程：worktree + PR」第 3 条）：新建的团队项目仓库上线时必须同时具备三件套，缺一不可。

1. **至少一个在 PR 上会真实跑的 CI 检查**。确实没有测试可跑的项目（纯文档、纯脚本）也要补一个最轻量的检查——markdown lint、`bash -n` 语法检查、`python3 -m compileall`、构建可编译即可。**不存在「没 CI 就豁免 strict」的例外**：没有检查时 strict 参数根本无从谈起，所谓「strict 模式」就是空话。
2. **该检查挂成 required status check**。CI 跑了但不拦合并，等于没有门禁——这是比 strict 更容易漏的一层。
3. **`required_status_checks.strict = true`**。要求 PR 分支必须与目标分支最新同步后才能合并。

**为什么 strict 是必须的**：非 strict 时，PR B 可以拿「旧 main」上通过的 CI 直接合并——PR A 刚合进 main 的新测试从未在 B 上跑过，回归防护网漏掉的就是这一块。strict 保证每个 PR 的 CI 都跑在「最新 main + 该 PR」的合并结果上（`pull_request` 事件检查的是 `refs/pull/N/merge` 合并预览），因此此前所有已合并 PR 的测试都会自动成为后来者的防护网，不需要任何串行排队。

**注意「CI 检查 name」的时序**：新仓库第一次配置时，required check 的 context 名字必须**真实存在**（GF 允许填入不存在的 context，但那个 PR 会永远等不到该检查、永久卡死）。正确顺序是：推代码（含 workflow）→ 让 CI 在 main 或第一个 PR 上真跑一次 → `gh api repos/<o>/<r>/commits/main/check-runs --jq '[.check_runs[].name]|unique'` 拿到真实名字 → 再 PUT 保护。**定时任务（`schedule` 触发）的检查名绝不能挂成 required**——它在 PR 上不跑，会永久卡住合并。

**一键配置与全量审计脚本**：`~/.pi/agent/patch/branch-protection/branch-protection.sh`（`audit` 审计、`apply` 配置，默认 dry-run）。

---

## 2026-11-03 实测与补齐：全团队 37 个仓库 100% 合规

**方法**：对 `agents-registry.md` 的 18 个 Agent 项目 + 19 个子项目，逐个查 `repos/xhqing/<repo>/branches/<default>/protection`（classic）与 `repos/xhqing/<repo>/rules/branches/<default>`（rulesets），取 `required_status_checks.strict`；并查仓库是否实存 `.github/workflows`。审计命令：`branch-protection.sh audit --owner xhqing <仓库列表>`。

### 补齐前（2026-11-03 上午实测）

37 个仓库里只有 **9 个** strict 合格（agents-infra、assistant、cmux、codef、ghostty-launcher、ghostty、mp4-player、pi-harness、XPilot），其余 **28 个** 的保护里 `required_status_checks` 为 `null`——**根本没挂 required check**，所以 strict 参数不存在（不是 strict=false，是无从谈起）。

28 个的细分：

- **有 CI 却没挂成门禁（2 个）**：`TradingProofs`（`ci.yml` → check 名 `build`）、`vscode-copy-anywhere`（`ci.yml` → check 名 `validate`）。
- **`xhqing`（1 个）**：只有 `traffic.yml`，那是定时采集任务、不是 PR CI（定时任务的检查名绝不能挂 required，会永久卡住合并）。（2026-11-04 补充：该定时采集任务已随「停用流量采集」一并删除，现在本仓库的 PR 检查是 `validate`。）
- **既无 CI 也无门禁（25 个）**：16 个 Agent 项目（ProductStrategistAgent、ProductProducerAgent、SiteBuilderAgent、GrowthMarketerAgent、DigiVendAgent、DataAnalystAgent、trading-agent、quant-agent、BackendEngineerAgent、dev-agent、NeuralCoreAgent、apply-agent、LegalAgent、social-agent、TestEngineerAgent、cuAgent；**本段为 2026-11-03 的审计快照**，其中 TestEngineerAgent 已于 2026-11-13 从团队除名、不再是 Agent 项目，实际数量已变为 15）+ 9 个子项目（CC-Bridge、ark-key-pool、macmini-tmux、dotfiles、AgentCortex、ToolCallingRules、Intraday、Swing、gridtrader）。

### 补齐后（2026-11-03 当晚，用户追加要求全部执行最新标准）

用户追加口径：「28 个不合规的仓库也统一执行最新标准」。当日已全部补齐，**审计结果 37/37 合规**。

| 处理方式 | 仓库数 | 做法 |
|---|---|---|
| 原本已合规，未动 | 9 | — |
| 已有 CI，直接挂门禁 | 2 | `TradingProofs` 挂 `build`、`vscode-copy-anywhere` 挂 `validate`，均设 strict=true |
| 补 `validate` 检查 | 26 | 25 个无 CI 的仓库 + `xhqing`（只有定时任务），各自加一份 `validate` workflow + 校验脚本 |

### 统一 `validate` 检查的内容

每个补齐的仓库新增两个文件（内容一致，随仓库自包含、单独 clone 也能跑）：

- `.github/workflows/validate.yml`：`pull_request` + 默认分支 `push` + `workflow_dispatch` 触发，单 job（检查名 `validate`），`runs-on: ubuntu-latest`。
- `.github/scripts/validate.py`：零依赖 Python 脚本，查五类——
  1. **必备文件**：`README.md`、`CHANGELOG.md`（团队统一标配）
  2. **敏感文件未被跟踪**：`.env`、`*.pem` / `*.key` / `*.p12` / `*.kdbx`、`id_rsa*`、`.npmrc`、`.netrc`、`credentials.json`（`.example` / `.sample` / `.template` / `.dist` / `.defaults` 后缀豁免）
  3. **被跟踪文件不超过 10 MB**
  4. **README 相对链接有效**：`README.md` / `README_cn.md` 里指向本地文件的链接，目标必须存在（跳过外链、锚点、绝对路径、模板占位符）
  5. **语法检查**：Python `compileall`、Shell `bash -n`（含无 `.sh` 后缀但带 sh shebang 的脚本）

**设计原则**：这个检查是 required status check，**一旦误报就会卡住所有正常 PR**，所以只查确定性、低误报的项目——宁可少查，不可瞎查。补齐前先在全部 28 个仓库本地跑过一遍、全部通过，才推到线上，避免上线即红。

### 口径

- **新建仓库**：一律按三件套执行，无例外。
- **存量仓库**：已于 2026-11-03 全部补齐，当前 37/37 合规；后续新增仓库或新增检查类型时，用审计脚本随时核对。

## 现状（2026-10-04 实测）

- **已开保护（7 个）**
  - 试点（2026-10-04）：`xhqing/agents-infra`（当时名为 CapabilityManagerAgent，后改名 TeamToolkit、2026-11-11 再改名 agents-infra）、`xhqing/assistant-agent`、`xhqing/zcode-cli`
  - 更早：`xhqing/codef`、`xhqing/ghostty`、`xhqing/ghostty-launcher`、`xhqing/pi`
- **未开保护**：其余 public 仓库（直推 main 可用；技能里「已开保护 → push 被拒 → 走 PR 兜底」的分支不触发）
- **无法开保护**：private 仓库（GitHub 免费版不支持分支保护 / rulesets，API 直接报「Upgrade to GitHub Pro」）

### 试点参数（可作模板）

```json
{
  "required_status_checks": {"strict": false, "contexts": ["validate"]},
  "enforce_admins": true,
  "required_pull_request_reviews": {"required_approving_review_count": 0},
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

要点：`enforce_admins: true` 是关键——**否则 agent 用同一个账号直推照样能绕过**（保护形同虚设）；`required_approving_review_count: 0` 表示「要 PR、但不要人工批准」；`strict: false` 不要求分支最新，减少无谓重跑。

## 铺开前必须先开 auto-merge（重要）

技能链路在 main 受保护时走「建分支 → push → 建 PR → enable auto-merge → CI 绿自动合并」。仓库若 `allow_auto_merge=false`，这一步会失败 → **PR 悬空等人手动合**（commit skill 的 9z 只等 15 分钟就放弃），比直推更糟。铺开顺序：

1. 先查/开 auto-merge：`gh api -X PATCH repos/<o>/<r> -f allow_auto_merge=true`
2. 确认 PR 上真正会跑的检查名：`gh api repos/<o>/<r>/commits/<sha>/check-runs --jq '[.check_runs[].name]|unique'`
   - **不要把定时任务（`schedule` 触发）的检查名挂成必需**——那种检查在 PR 上不跑，会永远卡住合并（`zcode-cli` 的 `prepare`、`keepalive` 就是例子，只挂 `validate`）
3. 再挂保护：`gh api -X PUT repos/<o>/<r>/branches/<branch>/protection --input - <<< '<上面那份 JSON>'`
4. 挂完确认 CI 本身是绿的——CI 红了又没有逃生门时，PR 会一直合不进去

## 2026-11-02：全团队锁死 remote main（用户立规，已铺开）

用户原话：「任何任务都先单独建立 worktree……所有智能体团队项目（包括 Agent 项目和各个 Agent 的子项目）都锁死 remote-main，不能从本地直接 Push-local-main 到 remote-main，只能从 worktree 走 PR 流程」。规则正文见 `~/.pi/agent/AGENTS.md`「开发流程：worktree + PR」节。

**已铺开范围**（2026-11-02 实测，脚本逐仓 `PUT …/branches/<default>/protection`）：

- **public 仓库（全部已锁）**：18 个 Agent 项目 + 19 个子项目。参数统一为：PR 必过（0 approvals）、`enforce_admins=true`、禁 force / 禁删除、线性历史、`allow_squash_merge=true` + `allow_merge_commit/rebase_merge=false` + `allow_auto_merge=true` + `delete_branch_on_merge=true`；原有 required check 的仓库保留其 context 并补 `strict=true`（`agents-infra` / `assistant` = `validate`，`ghostty-launcher` = `Test & Check`，`codef` = `test`，`ghostty` = `build-macos`，`mp4-player` = `build`，`pi-harness` = `build-check-test`，`XPilot` = `test`）。
- **cmux**：保护已开（PR 必过 + 线性 + 禁 force/删除 + admins 受限），但 required check 暂为空——fork 的 Actions 还没启用，加了会冻死 main；启用后再补 `checks`（见 cmux `DEVELOPMENT.md` §9.6）。
- **private 仓库（GitHub 免费版无法开保护，API 直接 403）**：`dotfiles`、`ToolCallingRules`、`xhs-mentor-scam`。这些仓库靠本地 `git-main-guard.ts` 硬拦 + 流程约束。要真正上服务端保护需升级 GitHub Pro 或改 public（用户决定）。
- **暂未锁的例外**：`xhs-mentor-scam` —— 该仓有一个 launchd 每 5 分钟执行的 `autosave.sh` **直接 push main**（备份用途，单写者、无 CI）。锁了会让自动备份静默失败，待决定：改造 autosave 推 `autosave` 分支，或保留豁免。
- **已退役/改名归档仓库不在范围**：`BidOptimizerAgent`、`CommunityManagerAgent`、`DeviceStewardAgent`、`NetOpsAgent`、`PatchClaudeAgent`。

**注意**：`gridtrader` 默认分支是 `master`（其余为 `main`），保护挂在 `master` 上。

**工具强制**：`~/.pi/agent/extensions/git-main-guard.ts`（2026-11-02 新增）拦截两类操作——① `git push` 的 refspec 指向 `main`/`master`（含裸 `git push`、`HEAD:main`、`--delete main`、`--all`/`--mirror`）；② 当前在 `main`/`master` 上的 `git commit`。仅对带 GitHub remote 的仓库生效；逃生标记 `# AI_AUTHORIZED_PUSH_MAIN` / `# AI_AUTHORIZED_COMMIT_MAIN`（仅限用户当轮授权）。**新装的扩展只对新会话生效**，已在跑的会话要重启才会加载。

## 常用命令

| 目的 | 命令 |
|---|---|
| 查保护状态 | `gh api repos/<o>/<r>/branches/<branch>/protection`（404 = 未保护；注意 `gh api` 的 404 响应体是合法 JSON，**判定要看退出码**，别看输出能不能解析） |
| 查 rulesets 规则 | `gh api repos/<o>/<r>/rules/branches/<branch>`（classic 与 rulesets 可能叠加，**两者都要查**——只看 classic 会漏掉 ruleset 里的 required check） |
| 全量审计 strict | `~/.pi/agent/patch/branch-protection/branch-protection.sh audit --owner <owner> <仓库列表文件>` |
| 给单个仓库上 strict 三件套 | `~/.pi/agent/patch/branch-protection/branch-protection.sh apply <owner/repo> --branch main --checks "validate" --apply`（不写 `--apply` 即 dry-run） |
| 查 auto-merge | `gh api repos/<o>/<r> --jq .allow_auto_merge` |
| 查 PR 检查名 | `gh api repos/<o>/<r>/commits/main/check-runs --jq '[.check_runs[].name]\|unique'` |
| 全机扫描 | 遍历 `~/Developer/*/`：`git -C <dir> remote get-url origin` 提取 `owner/repo`，再逐个查保护 |
| 紧急关闭（管理员逃生门） | `gh api -X DELETE repos/<o>/<r>/branches/<branch>/protection` |

## 与技能的关系

commit skill 已按 2026-11-02 的新规矩改为「main 上一律先建分支再走 PR 通道」，不再存在「远端无保护就直推 main」的分支；本文件补的是「哪些仓库处于哪种状态」这个事实来源。
