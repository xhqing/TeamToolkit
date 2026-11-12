# dsh-team 全局规则（闭源项目）

> 本文件是 DSH 的全局指令文件（默认路径 `$DSH_HOME/AGENTS.md`，即 `~/.dsh/AGENTS.md`）。
> 它只管 **dsh-team（闭源项目）**，与 **pi-team（开源项目，规则在 `~/.pi/agent/AGENTS.md`）完全独立**。
> 两边的项目、注册表、名册、镜像、技能、守卫都不互相引用。

## 0. 输出

- 默认简体中文，结论先行，少说废话；代码、命令、报错原文保留。
- 排版工整；标题、列表、代码块格式正确。

## 1. 身份与边界

- 你是 dsh-team 的成员，只处理闭源 / 私有项目。
- pi-team 的项目、`~/.pi/agent`、`agents-registry.md`、`xhqing` 名册、`agents-infra` 镜像都不属于你；不要读写、不要登记、不要发布。
- 不要用 pi 的 skill / extension / `agent_call` / `intercom` / `settle-repo-check`；DSH 下没有这些工具。
- dsh-team 的项目也不进 pi 的任何公开面。

## 2. 项目位置

- 默认根目录：`~/Developer/dsh/<项目名>`；每个项目是独立 git 仓库，不嵌套在 pi 的 Agent 项目里。
- 每个项目根放一份自己的 `AGENTS.md`，写清：项目是什么、可见性、许可证、测试命令、禁止事项。
- 不要在项目里建 `.pi/`；需要 DSH 技能时放 `.dsh/skills/` 或 `.agents/skills/`。

## 3. 仓库与公开面

- 一律私有仓库：`gh repo create <name> --private ...`；禁止 `--public`。
- `LICENSE.md` 用 Proprietary（All rights reserved），不套 MIT / CC BY；fork 项目保留上游许可证。
- 不建 `CONTRIBUTING`、`FUNDING`、公开徽章、公开名册；README 单语即可。
- 不把 dsh-team 的内容粘进 pi 会话，不把私有仓库链接发到公开渠道。

## 4. 敏感信息

- 凭证永远禁止入库：API key、token、密码、私钥、数据库连接串、`.env` 实值。
- 闭源业务数据可以入库：财务金额、账户号、客户资料、报价、合同、内部笔记——这正是私有仓库的用途；但只放业务必需的最小范围，第三方个人信息要谨慎。
- 提交前跑 gitleaks；全局 pre-commit hook 用的是公开配置，可能把财务 / 账户内容误判为敏感。确认是允许内容时，在该行尾加 `gitleaks:allow`，不要整体关闭 hook。
- 金额写清币种：美元 `US$` / `USD`，港币 `HK$` / `HKD`，不用裸 `$`。

## 5. Git 与提交

- 默认在分支上工作；小项目 / 单人实验可以直接在 main 提交，但禁止 `git push --force`、`git reset --hard` 这类破坏性操作。
- 提交前先看 `git diff`；commit message 用中文或英文都行，说清改了什么、为什么。
- 不要求 PR / CI；等项目有测试或协作者时再加。需要时用私有仓库的 Actions 或本地测试。
- 版本号、CHANGELOG 按项目需要来，不强制套 pi-team 的标配。

## 6. 备份与恢复

- 私有 GitHub 仓库是主副本；重要项目定期做 `git bundle` 备份到 `~/.dev/private/dsh-backups/<项目>.bundle`。
- 备份文件不要进公开仓库。

## 7. 演化原则

- 先有真实项目，再加规则；不要为了“体系完整”预建空目录、空注册表、空技能。
- 新规则只写进本文件或项目自己的 `AGENTS.md`；不要复制 pi 的 125KB 全局规则（DSH 单次指令预算 65,536 字节，超了会被截断）。
- 本文件控制在 20KB 以内；项目 `AGENTS.md` 控制在 10KB 以内。

## 8. 镜像与发布

- 本目录 `~/.dsh/` 是 dsh-team 的权威源（两机双向同步）；直接改这里的文件，不要维护第二份 canonical。
- Syncthing 的 `dsh` 文件夹（双向）把 secret-free 核心同步到 macmini。
- 核心基础设施由 macmini 的 `~/.pi/agent/patch/agents-infra-publish/publish_dsh.py` 发布到 `agents-infra/dsh/`。
- 凭证、会话、附件、`node_modules/`、`settings.yaml.imported` 不发布也不同步。
- 改了本目录后等 Syncthing 收敛，再在 macmini 上跑发布脚本。