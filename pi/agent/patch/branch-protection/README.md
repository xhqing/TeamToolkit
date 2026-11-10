# strict 模式 PR CI 的配置与审计

> 规矩来源：全局 `~/.pi/agent/AGENTS.md`「开发流程：worktree + PR」第 3 条
> （2026-11-03 用户立规：「规定以后新建立的项目仓库全部必须使用 strict 模式的 pr-ci」）。
> 说明与现状：`~/.pi/agent/docs/repo-branch-protection.md`。

## 一、strict 到底解决什么问题

先厘清一个容易搞混的点：**GitHub 默认是并行跑 CI 的，不是串行**。多个 PR 各自触发独立的
workflow run，只要并发配额够就同时跑。

那么「PR 之间不互相验证」这件事靠什么补？靠的不是串行，而是 **strict**。

- `pull_request` 事件的 CI 检出的不是 PR 分支的头，而是 `refs/pull/<编号>/merge`——一个由
  「PR 分支 + **目标分支最新提交**」现场合成的合并提交。
- 所以只要某个 PR 的 CI 是在别人合并**之后**跑的，别人带来的新测试文件就自动在它的运行
  环境里了。
- **strict（"Require branches to be up to date before merging"）的作用就是强制这个「之后」**：
  别人合并进 main 后，你的 PR 立刻变成 out-of-date，必须与最新 main 同步（update branch /
  rebase / 推新提交）才能合并，而这次同步会触发一轮新的 CI——这一轮才包含对方的新测试。

没有 strict 时（GitHub 的 non-strict / loose 模式），PR 可以拿「旧 main」上通过的 CI 直接
合并，前面刚合进去的测试从没在它身上跑过——**这就是回归防护网那个漏洞**。

### 为什么不能靠「串行跑 CI」代替

串行只保证「同一时刻只有一个 PR 在跑」，跑的顺序由调度决定，与谁先合并无关。完全可能：

```
09:00  PR A 跑 CI（串行，独占）
09:05  PR A 通过，但还没合并
09:05  PR B 跑 CI（串行，接着跑）
09:10  PR B 通过 → 合并进 main
09:11  PR A 才合并进 main
```

串行成立，但 B 依然是在没有 A 的测试的 main 上验证的。要的东西是「B 的检查发生在 A 合并
之后」，这只能靠合并时刻的强制约束，即 strict（或 merge queue）。

串行真正该用的场景是**共享资源竞争**：多个 PR 同时部署到同一台测试环境、同时独占同一个
数据库、同时消耗同一个测试账号配额——那属于资源隔离，不是回归防护。

## 二、三件套（缺一不可）

新建仓库上线时必须同时具备：

| # | 要件 | 为什么必须有 |
|---|---|---|
| 1 | 至少一个**在 PR 上会真实跑的** CI 检查 | 没有检查时 `strict` 参数无从谈起，「strict 模式」是空话 |
| 2 | 该检查**挂成 required status check** | CI 跑了但不拦合并，等于没有门禁（这层比 strict 更容易漏） |
| 3 | `required_status_checks.strict = true` | 保证 CI 跑在「最新 main + 该 PR」上，让已合并 PR 的测试成为后来者的防护网 |

确实没有测试可跑的项目（纯文档、纯脚本）也要补一个最轻量的检查：markdown lint、`bash -n`
语法检查、`python3 -m compileall`、或者能构建通过即可。**不存在「没 CI 就豁免 strict」的例外。**

另外三项加分项（建议一起配）：

- `enforce_admins: true`——否则同一个账号直推照样绕过，保护形同虚设。
- `required_linear_history: true` + 只允许 squash merge——历史线性，`git bisect` 可用。
- `allow_auto_merge: true`——否则「建 PR → 等 CI → 自动合并」的链路会卡在最后一步。

## 三、配置顺序（顺序错了会把 PR 永久卡死）

GitHub 允许你填一个**当前不存在**的 required check 名字，但那个 PR 会永远等不到该检查、
无法合并。所以正确顺序是：

```bash
# 1. 推代码（含 .github/workflows/*.yml）到仓库
# 2. 让 CI 在主分支或第一个 PR 上真跑一次
gh run list -R <owner>/<repo> --limit 5

# 3. 拿到真实存在的 check 名
gh api repos/<owner>/<repo>/commits/main/check-runs \
  --jq '[.check_runs[].name]|unique'

# 4. 再上保护
~/.pi/agent/patch/branch-protection/branch-protection.sh apply <owner>/<repo> \
  --branch main --checks "<上一步的检查名>"        # 先 dry-run 看 JSON
~/.pi/agent/patch/branch-protection/branch-protection.sh apply <owner>/<repo> \
  --branch main --checks "<上一步的检查名>" --apply  # 确认无误再执行
```

**定时任务（`schedule` 触发）的检查名绝不能挂成 required**——它在 PR 上根本不跑，会永久
卡住合并。历史教训：`zcode-cli` 的 `prepare` / `keepalive` 就是定时任务，只能挂 `validate`。

## 四、审计

```bash
# 审计一个 owner 名下全部未归档仓库（自动取默认分支）
branch-protection.sh audit --owner xhqing

# 审计一份列表（文件每行：仓库名 [分支]，省略分支默认 main）
branch-protection.sh audit --owner xhqing ~/Developer/dev-agent/tmp/team-repos.txt

# 机器可读
branch-protection.sh audit --owner xhqing --json
```

输出把仓库分成四类，只有第一类合规：

- `strict（合格）`
- `有 required check 但 strict=false`——漏洞：能拿旧 main 的 CI 合并
- `有 CI 但没挂成 required check`——CI 只是看着绿、拦不住合并
- `既无 CI 也无 required check`——完全没有门禁

退出码：0 = 全部合规，1 = 有不合规（可用于巡检脚本 / CI）。

**判定口径**：classic branch protection 与 rulesets 是**叠加生效**的，多个规则取并集，
所以脚本两个都查、只要任一来源要求 strict 就算 strict 生效。只看 `branches/<br>/protection`
会漏掉规则写在 rulesets 里的仓库。

## 五、给仓库装检查：`validate-template/`

三件套的第一件（「在 PR 上会真实跑的 CI 检查」）有现成模板，直接装：

```bash
cd <目标仓库根目录>
~/.pi/agent/patch/branch-protection/validate-template/install.sh [默认分支名]
```

省略分支名时自动取当前分支（空仓库回落 `main`）。装完只写了文件、不提交，随后自己走
PR 流程；PR 合并后再用 `branch-protection.sh apply` 把 `validate` 挂成 required 并设 strict。

模板内容：

| 文件 | 作用 |
|---|---|
| `validate.yml` | workflow：`pull_request` + 默认分支 push + 手动触发，单 job，检查名 `validate` |
| `validate.py` | 零依赖 Python 校验脚本（详见下） |

`validate.py` 查五类，全部是确定性、低误报的项目：

1. **必备文件**：`README.md`、`CHANGELOG.md`
2. **敏感文件未被跟踪**：`.env`、`*.pem` / `*.key` / `*.p12` / `*.kdbx`、`id_rsa*`、`.npmrc`、
   `.netrc`、`credentials.json`（`.example` / `.sample` / `.template` / `.dist` / `.defaults` 豁免）
3. **被跟踪文件不超过 10 MB**
4. **README 相对链接有效**（跳过外链、锚点、绝对路径、模板占位符）
5. **语法检查**：Python `compileall`、Shell `bash -n`（含带 sh shebang 的无后缀脚本）

**为什么只查这些**：这个检查是 required status check，**一旦误报就会卡住所有正常 PR**。
所以宁可少查、不可瞎查。2026-11-03 给 26 个仓库铺开前，先在全部仓库本地跑过一遍、
全部通过才推到线上——否则上线即红，所有 PR 都合不进去。

## 六、边界

- 本脚本只管**配置与审计**，不改代码、不动 git 历史。
- `apply` 默认 dry-run，必须显式 `--apply` 才改 GitHub 上的仓库设置。
- 存量仓库不因本工具自动变更——2026-11-03 用户的口径是「以后**新建立**的」。
