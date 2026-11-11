# agents-infra · 项目专属硬规则

本文件由 pi 在 cwd 位于本仓库（或其 worktree / 临时 clone）时自动追加进系统提示。**只写本项目特有的约定**；全局规则与 Kit 的身份来自仓库根的 `AGENTS.md` 软链接，这里不复述、也不覆盖。

## 这是什么

全团队通用能力的开源出口：`pi/agent/` 是全局 `~/.pi/agent/` 的**逐字节镜像**（`AGENTS.md` / `skills/` / `docs/` / `patch/` / `extensions/` 五部分 + npm 清单）。仓库其余部分（根 `AGENTS.md`、README、CHANGELOG、`VERSION`、`.pi/`、`.claude/`）是项目自身的内容，不参与镜像同步。

## 硬规则

1. **`pi/agent/` 是生成物，不要手工改。** 改了会被下一次发布覆盖，等于白做。要改内容先改全局 `~/.pi/agent`（那是唯一权威源），再走发布流程。
2. **改全局目录前必须先做飞书快照**（`extensions/snapshot-guard.ts` 会拦）：`python3 ~/.pi/agent/patch/dev-snapshots/dev-snapshots.py snapshot pi-agent`。普通写入要求 30 分钟内的新鲜快照，删除 / 移动要求快照与当前内容完全一致；快照失败就不许改。
3. **发布是单 pusher，只在 macmini 上跑**：`python3 ~/.pi/agent/patch/agents-infra-publish/publish.py`（`--check` 只比对、`--dry-run` 只列变更）。本机（MacBook）跑会被脚本按 hostname 拒绝——不要绕过：两台机器同时发布只会造出重复 PR、并可能把对端的本机私有配置推上公网。
4. **本机不保留本项目本地 clone**（用户 2026-11-05 决定）：查内容直接读 `~/.pi/agent`；确需改本仓库自身文件（README / CHANGELOG / `.pi/` 等）时用临时 clone，改完提交 → push 分支 → PR → 合并后删掉临时目录，不要长期常驻。
5. **镜像边界**：`sessions/`、`state/`、`logs/`、`tmp/`、`intercom/`、`bin/`、`npm/` 与本机私有配置（`trust.json`、`mcp-project-approvals.json`、anysearch 的 `.env` / `runtime.conf`、backup 的 `endpoints/`、session-link 的三个本机配置文件）**不进镜像**；`*.log` / `*.lock` / `__pycache__/` / `*.sync-conflict-*` 同理。
6. **敏感信息**：镜像会被公开发布（本仓库公开），全局目录里任何凭证、token、真实服务端点、个人隐私都不该进镜像——往 `~/.pi/agent` 新增文件前先判断它是否属于「clone 者能看懂且无害」的内容。
7. **`.claude/` 不属镜像**：它是已注销的 CapabilityManagerAgent 时期留下的项目专属目录（`capability-manager` skill 等），不参与同步、不作为做事依据；不要把它当模板往其它项目复制。

## 校验

- 发布前后都可跑 `publish.py --check` 确认全局与镜像已一致（无差异时脚本直接退出、不产生提交）。
- 不要为了省事直推 main：remote main 受保护，一切变更走分支 + PR + CI（required check `validate`，strict 模式要求分支最新）。
- `.pi/` 只放 pi 会读的条目（`settings.json` / 资源目录 / `APPEND_SYSTEM.md`），不放脚本、钩子或临时产物。

## 易踩的坑

- **不要把镜像当权威源**：`pi/agent/` 里看到的内容是「从全局同步过来的快照」，修它等于修改一份即将被覆盖的副本；修改一律从 `~/.pi/agent` 出发。
- **仓库根 `.pi/skills` 是指向 `.claude/skills` 的历史软链**，属旧架构遗留，不参与镜像；不要据此认为 `.pi/` 里该放技能。
- **发布脚本会自己写一条 CHANGELOG**，手工改动单开一条，别把两类记录混在一起、也别删别人的发布记录。
- **`/docs/` 的 .gitignore 规则只限根目录**（镜像里的 `pi/agent/docs/` 必须能入库）；改 `.gitignore` 时不要把这条写成裸 `docs/`。

## 发布渠道

GitHub Release，**不带产物**（只含 tag 与 Release notes）。版本号单一权威是 `VERSION`；镜像同步本身也会写一条 CHANGELOG 记录，手工改动另记一条、写清为什么改。
