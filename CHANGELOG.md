# Changelog

本项目（agents-infra，原名 TeamToolkit / CapabilityManagerAgent）是智能体舰队通用能力底座的**开源镜像仓库**：`claude/`（2026-08-03 起从 `.claude/` 迁入）下的 `skills` / `CLAUDE.md` / `docs` 三部分（全局规则随 CLAUDE.md 走；原 `~/.claude/rules/` 目录已废弃删除，2026-09-14 起文档口径统一）与全局权威源 `~/.claude/` 逐字节一致（2026-08-04 起权威方向反转：全局为权威、本项目 `claude/` 为镜像）。本 CHANGELOG 记录**通用能力底座的变更**——即 `claude/`、`pi/agent/extensions/`、`pi/agent/npm/` 镜像范围的增删改，以及全局 ↔ 本项目镜像的同步动作。

> 按全局 CLAUDE.md「同步动作只记权威源的 CHANGELOG」规矩：通用能力的同步只记本文件，**不记到各业务 agent 项目**（如 DayTradingAgent 等）的 CHANGELOG，避免污染那些项目自己的变更记录。

## 2026-11-11

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/patch/private-links/README.md`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/skill-creator/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/skills/skill-creator/scripts/improve_description.py`
  - `pi/agent/skills/skill-creator/scripts/run_eval.py`
  - `pi/agent/skills/skill-creator/scripts/run_loop.py`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：9 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/macmini-mirror.md`
  - `pi/agent/extensions/git-commit-guard.ts`
  - `pi/agent/extensions/public-text-guard.ts`
  - `pi/agent/patch/private-links/private-links.py`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/backup/SKILL.md`
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：13 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/capability-sync.md`
  - `pi/agent/docs/new-agent-scaffold.md`
  - `pi/agent/docs/repo-branch-protection.md`
  - `pi/agent/extensions/git-commit-guard.ts`
  - `pi/agent/extensions/redundant-ask-guard.ts`
  - `pi/agent/patch/npm-manifest/refresh.py`
  - `pi/agent/patch/skill-custom/README.md`
  - `pi/agent/patch/team-toolkit-publish/README.md`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  - `pi/agent/skills/backup/SKILL.md`
  - `pi/agent/patch/agents-infra-publish/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **更名（2026-11-11）：`TeamToolkit` → `agents-infra`**。
  **为什么改**：用户指出「TeamToolkit」这个名字不合适——它读起来像某个 agent 的专属工具箱，看不出这是全队 17 个 agent 共用的基础设施。新名字 `agents-infra` 直接把「agent 们的基础设施」写进名字，也符合团队「非 agent 项目命名要尽可能简单、体现职责」的规范。
  **改了什么**：① GitHub 仓库 `xhqing/TeamToolkit` 改名为 `xhqing/agents-infra`（旧 URL 由 GitHub 自动重定向）；② 发布机（macmini）上的 clone 目录 `~/Developer/TeamToolkit` 改名为 `~/Developer/agents-infra`，remote 指向新地址；③ 仓库根 `README.md` / `README_cn.md` 的标题、类型徽章（`Type-Team Toolkit` → `Type-Agents Infra`）、示意图路径、clone 指令与正文自称全部换新，沿革说明补成三段名字的历史（CapabilityManagerAgent → TeamToolkit → agents-infra）；④ 版本号 `2.0.0` → `2.1.0`（对外更名属新增级变更）；⑤ 全局权威源 `~/.pi/agent` 内的引用同批更新：`docs/capability-sync.md`、`docs/agents-registry.md`、`docs/new-agent-scaffold.md`、`docs/repo-branch-protection.md`、`AGENTS.md`、发布脚本目录 `patch/team-toolkit-publish/` → `patch/agents-infra-publish/`、`patch/npm-manifest/refresh.py`（环境变量 `TEAM_TOOLKIT_DIR` → `AGENTS_INFRA_DIR`）、`extensions/redundant-ask-guard.ts`、`skills/backup/` 文档说明；⑥ 团队其它仓库的引用（assistant-agent、xhqing 名册）同批更新。
  **回归风险**：无代码逻辑变更，只是改名与文档同步。可能影响外部调用者的只有两处——旧 URL（已由 GitHub 重定向）与 `refresh.py` 的环境变量名（本机工具，无外部使用者）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：4 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/extensions/git-commit-guard.ts`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/patch/commit-gate/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-11）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/extensions/git-status-guard.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## 2026-11-10

- **镜像同步（2026-11-10）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/patch/private-links/manifest.tsv`
  - `pi/agent/patch/private-links/private-links.py`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-10）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：9 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/new-agent-scaffold.md`
  - `pi/agent/docs/repo-branch-protection.md`
  - `pi/agent/extensions/worktree-name-guard.ts`
  - `pi/agent/patch/branch-protection/README.md`
  - `pi/agent/patch/macmini-use/test-remote.ts`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/dev-workflow/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-10）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/skills/vsce-install/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-10）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/AGENTS.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## 2026-11-09

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：4 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/skills/macmini-use/SKILL.md`
  - `pi/agent/skills/vsce-install/SKILL.md`
  - `pi/agent/extensions/vscode-retire-guard.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/extensions/git-status-guard.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：4 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/dev-workflow/SKILL.md`
  - `pi/agent/extensions/worktree-name-guard.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/extensions/git-status-guard.ts`
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：18 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/capability-sync.md`
  - `pi/agent/docs/new-agent-scaffold.md`
  - `pi/agent/docs/repo-branch-protection.md`
  - `pi/agent/extensions/agent-call.ts`
  - `pi/agent/extensions/agent-wait-banner.ts`
  - `pi/agent/extensions/background-tasks.ts`
  - `pi/agent/extensions/roster-sync-guard.ts`
  - `pi/agent/extensions/version-guard.ts`
  - `pi/agent/patch/duty-macmini/duty.conf`
  - `pi/agent/patch/private-links/README.md`
  - `pi/agent/patch/private-links/manifest.tsv`
  - `pi/agent/patch/roster-sync/roster-sync-check.py`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/skills/keep-awake/SKILL.md`
  - `pi/agent/skills/md2pdf/references/pitfalls.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/docs/macmini-mirror.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/patch/dev-snapshots/dev-snapshots.py`
  - `pi/agent/patch/periodic-check/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：5 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/patch/contributing-template/CONTRIBUTING.md`
  - `pi/agent/patch/contributing-template/CONTRIBUTING_cn.md`
  - `pi/agent/patch/contributing-template/README.md`
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：6 个文件——
  - `pi/agent/extensions/public-text-guard.ts`
  - `pi/agent/extensions/settle-repo-check.ts`
  - `pi/agent/patch/contributing-template/CONTRIBUTING.md`
  - `pi/agent/patch/contributing-template/CONTRIBUTING_cn.md`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/patch/contributing-template/README.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-09）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/patch/contributing-template/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## 2026-11-08

- **镜像同步（2026-11-08）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/docs/new-agent-scaffold.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-08）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：8 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/extensions/public-text-guard.ts`
  - `pi/agent/extensions/settle-repo-check.ts`
  - `pi/agent/patch/private-links/manifest.tsv`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/skills/add/SKILL.md`
  - `pi/agent/skills/commit/SKILL.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-08）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  - `pi/agent/extensions/verify-guard.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-08）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：6 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/extensions/diff-view.ts`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/extensions/turn-diff.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## 2026-11-07

### 新增（子项目专属规则文件 `.pi/APPEND_SYSTEM.md`）

- **为什么改**：用户 2026-11-07 定下全局 Leader / Worker 分工——子项目的具体活由「以子项目根目录 / 子项目 worktree 为工作目录」的 Worker 会话干，而 pi 只加载 cwd 那一层的 `.pi/`（不向上继承）。子项目专属的硬规则没有别的地方可放：写进 Agent 项目的 `AGENTS.md` 既不会被 Worker 加载，也会污染其它兄弟子项目。
- **改了什么**：新增 `.pi/APPEND_SYSTEM.md`（34 行），只写本项目特有的硬约束——`pi/agent/` 是生成物不得手工改、改全局目录前先做飞书快照、发布只允许 macmini 单 pusher（本机跑被拒且不得绕过）、本机不保留本地 clone（要改本项目自身文件就用临时 clone）、镜像边界清单、公开发布前的敏感信息自判、`.claude/` 不属镜像，以及 `publish.py --check` 校验与「不带产物」的发版口径。全局规则与 Kit 身份仍来自仓库根 `AGENTS.md` 软链接，文件里不重述、不覆盖。
- **影响**：纯新增规则文件，不触 `pi/agent/` 镜像内容（发布脚本只 rsync 镜像子树），不涉版本号。


- **镜像同步（2026-11-07）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/extensions/diff-view.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-07）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：4 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/extensions/agent-call.ts`
  - `pi/agent/extensions/magpie.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## 2026-11-06

- **镜像同步（2026-11-06）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/extensions/diff-view.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-06）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/extensions/diff-view.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-06）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/extensions/diff-view.ts`
  - `pi/agent/extensions/magpie.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

## [Unreleased]

### 2026-11-05 项目规则文件本体改为 AGENTS.md（CLAUDE.md 弃用）

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/extensions/diff-view.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：2 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/extensions/main-wip-guard.ts`
  - `pi/agent/skills/macmini-use/SKILL.md`
  - `pi/agent/patch/worktree-adopt/README.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：9 个文件——
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/macmini-mirror.md`
  - `pi/agent/extensions/macmini-use/index.ts`
  - `pi/agent/skills/add/SKILL.md`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/skills/macmini-use/SKILL.md`
  - `pi/agent/extensions/main-wip-guard.ts`
  - `pi/agent/patch/worktree-adopt/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **为什么改**：用户 2026-11-05 立规「所有注册表项目与全局的规则文件本体统一用 `AGENTS.md`，`CLAUDE.md` 弃用」。本仓库虽以 `pi/agent/` 镜像为主，但仓库根的这份项目说明同样是一份项目级规则文件，应与其他注册表项目保持一致；pi 的上下文文件候选顺序是 `AGENTS.override.md` > `AGENTS.md` > `CLAUDE.md`（同目录只加载第一个存在的），两份并存只会漂移。
- **改了什么**：① 仓库根 `CLAUDE.md` 改名为实体 `AGENTS.md`（原 `AGENTS.md → CLAUDE.md` 软链接删除），标题由旧名 `CapabilityManagerAgent` 更新为 `TeamToolkit`；② 文中「`skills` / `CLAUDE.md` / …」「本文件（`.claude/CLAUDE.md`）」「`pi/agent/CLAUDE.md`」等引用同步改为 `AGENTS.md`；③ `README.md` / `README_cn.md` 三处 `pi/agent/CLAUDE.md` 与「全局规则（CLAUDE.md）」同步改为 `AGENTS.md`。
- **回归检查**：`pi/agent/` 镜像内容未动（镜像由全局发布脚本生成，`pi/agent/AGENTS.md` 已随 PR #179 / #180 同步）；本次只改仓库根的说明文件与 README 引用，不影响镜像逐字节一致性核对。

## [1.14.0] - 2026-11-05

### 2026-11-05 macmini 迁接收尾：git 只读守卫退役、共享目录收敛（镜像同步，7 个文件）

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/CLAUDE.md`
  - `pi/agent/patch/team-toolkit-publish/README.md`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：40 个文件——
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/capability-sync.md`
  - `pi/agent/docs/macmini-mirror.md`
  - `pi/agent/docs/new-agent-scaffold.md`
  - `pi/agent/docs/repo-branch-protection.md`
  - `pi/agent/extensions/agent-call.ts`
  - `pi/agent/extensions/agent-wait-banner.ts`
  - `pi/agent/extensions/focus-guard.ts`
  - `pi/agent/extensions/git-commit-guard.ts`
  - `pi/agent/extensions/git-main-guard.ts`
  - `pi/agent/extensions/kdbx-guard.ts`
  - `pi/agent/extensions/macmini-use/index.ts`
  - `pi/agent/extensions/pi-dir-guard.ts`
  - `pi/agent/extensions/redundant-ask-guard.ts`
  - `pi/agent/extensions/settle-repo-check.ts`
  - `pi/agent/extensions/skill-desc-guard.ts`
  - `pi/agent/extensions/snapshot-guard.ts`
  - `pi/agent/extensions/ts-syntax-guard.ts`
  - `pi/agent/extensions/twitter-guard.ts`
  - `pi/agent/extensions/xpilot-guard.ts`
  - `pi/agent/patch/branch-protection/README.md`
  - `pi/agent/patch/branch-protection/branch-protection.sh`
  - `pi/agent/patch/dev-snapshots/README.md`
  - `pi/agent/patch/dev-snapshots/dev-snapshots.py`
  - `pi/agent/patch/macmini-git-readonly/README.md`
  - `pi/agent/patch/macmini-git-readonly/hooks/deny.sh`
  - `pi/agent/patch/private-links/README.md`
  - `pi/agent/patch/private-links/manifest.tsv`
  - `pi/agent/patch/settle-repo-check/settle-repo-check.py`
  - `pi/agent/patch/team-toolkit-publish/README.md`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  - `pi/agent/skills/add/SKILL.md`
  - `pi/agent/skills/backup/SKILL.md`
  - `pi/agent/skills/backup/scripts/backup.sh`
  - `pi/agent/skills/commit/SKILL.md`
  - `pi/agent/skills/release/SKILL.md`
  - `pi/agent/skills/skill-creator/scripts/run_eval_pi.py`
  - `pi/agent/AGENTS.md`
  - `pi/agent/docs/local-context.md`
  - `pi/agent/extensions/local-context.ts`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：3 个文件——
  - `pi/agent/CLAUDE.md`
  - `pi/agent/extensions/redundant-ask-guard.ts`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：1 个文件——
  - `pi/agent/CLAUDE.md`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：4 个文件——
  - `pi/agent/docs/capability-sync.md`
  - `pi/agent/patch/private-links/manifest.tsv`
  - `pi/agent/patch/team-toolkit-publish/README.md`
  - `pi/agent/patch/team-toolkit-publish/publish.py`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **镜像同步（2026-11-05）**：从全局 `~/.pi/agent` 单向发布。
  **为什么改**：全局能力层有改动，本仓库是它的开源镜像，必须保持一致。
  **改了什么**：14 个文件——
  - `CHANGELOG.md`
  - `README.md`
  - `README_cn.md`
  - `VERSION`
  - `pi/agent/CLAUDE.md`
  - `pi/agent/docs/agents-registry.md`
  - `pi/agent/docs/capability-sync.md`
  - `pi/agent/docs/new-agent-scaffold.md`
  - `pi/agent/docs/repo-branch-protection.md`
  - `pi/agent/extensions/redundant-ask-guard.ts`
  - `pi/agent/patch/npm-manifest/refresh.py`
  - `pi/agent/patch/skill-custom/README.md`
  - `pi/agent/skills/backup/SKILL.md`
  - `pi/agent/patch/team-toolkit-publish/`
  **回归风险**：无（只同步内容，不改本仓库自身逻辑）。

- **更名 + 降级为普通项目（2026-11-05）**：`CapabilityManagerAgent` → **`TeamToolkit`**，GitHub 仓库已改名（旧 URL 自动重定向）。
  **为什么改**：这个项目的实际职责就是「把全局能力层镜像出去」，而不是一个需要人设与独立会话的智能体；维持一个专职 agent 只为跑同步，成本高于收益。用户要求把它退化成普通项目、归 Kit 负责。
  **改了什么**：① 仓库名与目录名改为 `TeamToolkit`；② README 双语重写（去掉 Prometheus 人设，改成「团队共享工具箱 + 单 pusher 发布」的说明，类型徽章改 `Team Toolkit`）；③ 发布方式从「改完全局 → agent_call Prometheus 同步」改为 `patch/team-toolkit-publish/publish.py` 单点发布（只在 macmini 跑，避免两台机器同时 PR 造出重复提交）；④ 版本号 1.14.0 → 2.0.0（身份变化）；⑤ 全局 `docs/capability-sync.md` 整篇重写、`docs/agents-registry.md` 里 Prometheus 从 Agent 表移出并记为「已除名」、本项目作为 Kit 的子项目登记；⑥ 全局 `extensions/redundant-ask-guard.ts` 的授权清单改为「直接跑发布脚本」。
  **验证**：镜像五部分 `diff` 与全局逐字节一致；`publish.py --check` 通过；README 双语内容一致。
  **回归风险**：低——只改名与换发布通道，镜像内容不动。唯一注意点：今后**不要**再在镜像里直接改内容（会被下一次发布覆盖），也不要从两台机器同时发布（脚本已按 hostname 拒绝）。


同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：2026-11-05 的跨机架构改造把「项目代码走 GitHub、只有两个目录用 Syncthing」定下来，但当时 `~/Developer` 共享还在过渡、macmini 仍是严格 git 只读。本次收尾完成：`developer` 共享已从 Syncthing 配置移除；macmini 上 38 个仓库原地转正为正经 clone（`fetch --prune` + `reset --hard origin/<分支>`，依赖目录全部保留）；10 个坏掉的 worktree 残留目录清掉；GitHub 访问用 HTTPS + gh token 恢复（34 个 SSH remote 改写为 https，没有给 macmini 放 SSH 私钥）。只读层的前提（`.git` 被双向同步）已经不存在，守卫必须退役——留着会把 macmini 上正常的提交 / 推送误拦。

**改了什么**（7 个文件，与全局逐字节一致）：

1. **删除** `pi/agent/extensions/git-readonly-guard.ts`：macmini 只读守卫退役，镜像里同步删除（`pi/agent/extensions/` 下不再有这个文件）。
2. `pi/agent/CLAUDE.md`：「macmini 的 git 权限」条由「撤除时机」改为「已撤除（2026-11-05）」，写明 38 个仓库已原地转正、守卫与 `core.hooksPath` hook 已撤、macmini 现在同样受 remote main 锁定。
3. `pi/agent/docs/macmini-mirror.md`：「过渡状态」段改为「已完成（2026-11-05 收尾）」；「凭证」条目改为最终方案（HTTPS + gh token、remote 改写、不放 SSH 私钥）；补充 `setup.py` 默认不再重建 `developer`。
4. `pi/agent/skills/macmini-use/SKILL.md`：分发表「提交 / 推送 / PR / Release / CI」由「过渡期仍本机」改为「两台都行」；第 6 条「GitHub 断连（过渡状态）」改为「已恢复（受限速影响）」；故障表「git 在远端被拒」改为「限速 / 凭据过期」。
5. `pi/agent/patch/macmini-use/README.md`：补一条「2026-11-05 起 macmini 是独立 clone、git 读写正常，只有两个共享目录」。
6. `pi/agent/patch/macmini-git-readonly/README.md`：顶部加「⚠️ 已退役（2026-11-05）」横幅，保留作历史说明。
7. `pi/agent/patch/macmini-mirror/setup.py`：`developer` 共享改为显式 `--with-developer` 才建；`drop_folder()` 改用 `DELETE /rest/config/folders/<id>` 并复用 `api()`（`remote=True` 必须经 ssh + curl 打到对端，否则带对端 API key 打本机端点会 403）。

**验证**：六个改动文件与全局逐字节一致，删除项已确认 `pi/agent/extensions/` 下无残留；`diff -rq` 对五部分复核只剩 `.gitignore` 覆盖的本机私有文件。

**回归风险**：**有意的行为变化**——macmini 不再被本地守卫拦截 git 写操作，改为与其它机器一样受「remote main 锁定 + 分支 + PR + CI」约束。macmini 上仍在运行的旧会话要重启才会卸下旧扩展；`core.hooksPath` 只读 hook 已在 macmini 侧清掉。文档里保留的守卫说明都已标注「已退役」，不会被误当成现行机制。

## [1.13.2] - 2026-11-05

### 2026-11-05 dev-snapshots 补齐本机配置排除 + 两机准备说明（镜像同步，2 个文件）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：上一条把 `.stignore` / `.stfolder` / `node_modules` 排除出指纹后，实测还有两类路径会让两台机器算出不同指纹、并把本机路径写进公开备份：`skills/anysearch/runtime.conf`、`patch/session-link/{config,local-links,chain-registry}.json`、`trust.json`、`mcp-project-approvals.json`——它们都由各机各自维护、Syncthing 本就不同步。另外在 macmini 上实测到两个环境坑：非交互 shell（`ssh mac-mini '…'`）的 PATH 里没有 `~/.local/bin`，直接调 `lark-cli` 会 `FileNotFoundError`。

**改了什么**：

1. `pi/agent/patch/dev-snapshots/dev-snapshots.py`：`PI_AGENT_EXCLUDES` 补上 `mcp-project-approvals.json`、`skills/anysearch/runtime.conf`、`patch/session-link/{config,local-links,chain-registry}.json`；新增 `_lark_bin()` 定位 `lark-cli`（`shutil.which` → `~/.local/bin` → `~/bin` → homebrew 两个路径），所有调用点改用 `LARK` 常量。
2. `pi/agent/patch/dev-snapshots/README.md`：新增「两台机器各自的准备」表（lark-cli 位置、两台机器的 app 差异、同一个备份根文件夹）与「指纹必须两端一致」段（必须排除的两类东西 + 两端校验命令），并记录 macmini 上 github.com 限速的处理办法（在本机下载后 scp 过去）。

**验证**：与全局 `diff` 一致；90 秒观察窗口内全局文件无进一步变化；脚本为纯排除逻辑 + 二进制定位兜底，不改变打包 / 上传 / 令牌语义。

**回归风险**：无。新增排除只影响指纹口径（更保守），`lark-cli` 定位顺序为先 PATH、再本机常见目录，路径不变时行为不变。

## [1.13.1] - 2026-11-05

### 2026-11-05 dev-snapshots 快照指纹排除 Syncthing 本机元数据（镜像同步，1 个文件）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：两个共享目录的「改前快照」机制依赖「内容指纹」判断快照是否新鲜、以及删除前是否与现状完全一致。`~/.dev/private` 里的 `.stignore` / `.stfolder` 是 Syncthing 的**本机**配置（本身不被同步，两台机器的 mtime 与存在性天然不同），`node_modules` 是各机自己安装的产物。这些路径被算进指纹后，同一份逻辑内容在两台机器上会得出不同指纹，导致「任一侧做的快照另一侧也认」失效——另一侧明明是同样内容，却被判成「快照过期 / 与现状不一致」而被拦下。

**改了什么**：`pi/agent/patch/dev-snapshots/dev-snapshots.py` 的 `_private_excluded()` 新增四类排除——`.stignore`（含 `.stignore*` 前缀）、`.stfolder`、任意层级的 `node_modules/`；并在函数上补了说明注释（为什么这些路径不能进指纹）。计算 `private` 目标的内容指纹时，这些路径不再参与。

**验证**：与全局 `diff` 一致；函数为纯过滤逻辑，不影响快照打包 / 上传 / 令牌签发路径；改动后本机快照仍能正常打包与上传。

**回归风险**：无。只是让指纹更保守地排除「机器本地差异」，不改变快照内容本身的完整性（`.stignore` / `.stfolder` / `node_modules` 本来就不属于要保护的私有内容）。

## [1.13.0] - 2026-11-05

### 2026-11-05 跨机架构改造：代码走 GitHub，只有两个共享目录用 Syncthing（镜像同步，20 个文件）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：2026-11-05 用户做了一次跨机架构改造——原先「整套 `~/Developer` 用 Syncthing 双向同步」的做法被彻底放弃，因为它会让两台机器同时写同一个 `.git` 而互相损坏，还逼出了 macmini 上那套严格 git 只读的限制。新架构是：**项目代码走 GitHub**（每台机器各自 `clone`、各自开 worktree，靠 push → PR → CI → merge → 本地 main 快进交换代码），**Syncthing 只同步两个目录**——`~/.dev/private`（各项目私有内容的本体，项目里放同名软链接）与 `~/.pi/agent`（全局能力层）。这两件事带来三个必须写进能力层的配套机制：

1. **私有内容目录 `~/.dev/private`**：项目里那些被 `.gitignore` 忽略、但跨机要保持一致的私密内容（隐私待办、`backup/` 目录、本机文档、交易凭证等），本体统一放 `~/.dev/private/<仓库名>/<相对路径>`，项目里同位置放软链接。工具 `patch/private-links/` 负责 `adopt`（搬进私有目录并建链接）/ `materialize`（按清单重建链接）/ `check`（巡检断链、被替换成实体、未登记文件）/ `restore`（搬回项目）。同时明确「不要手建软链接」——编辑器原子保存会把链接换成实体文件、`git clean -fdx` 也会删掉被忽略的链接。
2. **两个共享目录的改前快照**：`~/.pi/agent` 与 `~/.dev/private` 允许任何会话（含 macmini）改删内容，但改前必须有新鲜快照（本地 + 飞书各留最近 5 份，令牌随 Syncthing 同步）。`patch/dev-snapshots/` 是工具，`extensions/snapshot-guard.ts` 是强制点——普通写入要求 30 分钟内快照，删除 / 移动要求快照与当前内容完全一致，两个目录的根本身无条件禁止删除。
3. **macmini 的使用口径重写**：删除红线改为「项目目录随便删（可从 GitHub 重建），真正要保护的是两个共享目录」；git 权限从「严格只读」回归正常读写（旧的只读前提随 `.git` 不再同步而消失）。

**改了什么**（20 个文件，与全局逐字节一致）：

- **新增 `pi/agent/patch/private-links/`**（`manifest.tsv` 清单、`private-links.py` 工具、`README.md`）：上面第 1 条的完整实现与说明。
- **新增 `pi/agent/patch/dev-snapshots/`**（`dev-snapshots.py`、`README.md`）：打包 `tar.gz` + 上传飞书云盘 + 本地 / 云端各保留 5 份 + 令牌签发与恢复。
- **新增 `pi/agent/extensions/snapshot-guard.ts`**：改前快照的强制点（写入 / 删除两个共享目录时检查令牌，不满足即拦下并给出命令；快照失败不写令牌）。
- **新增 `pi/agent/extensions/ts-syntax-guard.ts` + `pi/agent/patch/ts-syntax-check/check.mjs`**（同日新增的配套守卫，一并纳入镜像）：pi 遇到任一扩展解析失败会直接 `exit(1)` 导致整个 agent 起不来（2026-11-04 的真实事故：模板字符串里一个未转义的反引号让 2026-11-05 全天 `pi` 无法启动）。守卫在 `write` / `edit` 写入扩展目录前用 pi 加载器同一个解析器（Node `stripTypeScriptTypes`）校验，坏内容落不了盘；`bash` 旁路写入后按 mtime 复检并告警。`check.mjs` 是可随时手工复核的脚本。
- **修改 `pi/agent/extensions/macmini-use/{classify.ts,index.ts,remote.ts}`**：删除守卫放行两个共享目录、仍拦删根；文案改为新架构口径。
- **修改 `pi/agent/skills/macmini-use/SKILL.md`**（description 与硬约束按新架构改写）与 `pi/agent/patch/macmini-use/README.md`。
- **修改 `pi/agent/docs/macmini-mirror.md`**（整篇重写：代码走 GitHub + 只有两个共享目录用 Syncthing，含新架构下的 macmini git 权限、快照前置、私有内容接线）。
- **修改 `pi/agent/patch/macmini-mirror/{setup.py,status.py,verify.py}` + 新增 `stignore-private`**：Syncthing 配置新增 private 共享、`--drop-developer` 移除旧的 `~/Developer` 共享、校验范围收敛到两个共享目录。
- **修改 `pi/agent/CLAUDE.md`**：新增「私有内容目录 `~/.dev/private`」「两个共享目录的改前快照」两节；重写「删除红线 / 同步范围 / macmini 的 git 权限」三条；「扩展代码写入必须先过语法检查」节同步纳入。
- **刷新 `pi/agent/npm/`**（`package.json` / `package-lock.json` / `PACKAGES.md`）：pi 第三方包清单跟随本机现状，`pi-mcp-adapter` 由 7.0.0 升到 7.0.1。

**验证**：`diff -rq` 对 `skills` / `docs` / `patch` / `extensions` 四部分与 `CLAUDE.md` 逐一复核，全局与镜像**无内容差异**（仅剩合法差异：`.gitignore` 覆盖的 `anysearch/.env`、`backup/endpoints/endpoints.json`、`session-link` 运行时文件、`__pycache__`）；`npm-manifest/refresh.py --check` 通过；`ts-syntax-check/check.mjs` 对镜像 `pi/agent/extensions` 的 33 个扩展文件全部通过语法校验；新同步文件已做公开文本敏感自检（无凭证、无本机私有数据，`dev-snapshots.py` 只引用端点注册表路径与字段名）。

**回归风险**：低。改动均为镜像同步与机制新增，没有删除镜像里已有的任何内容；`CLAUDE.md` 的三条重写是口径演进（旧规则的前提——`~/Developer` 双向同步——已经消失），新条文内部一致。需要注意的是：`snapshot-guard.ts` 生效后会拦「对两个共享目录的写入 / 删除」，这是有意的收紧，改动方须先做快照再改。

### 2026-11-04 补录：xhqing 仓库的 `traffic.yml` 已删除（镜像同步，`docs/repo-branch-protection.md`）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。上一批同步漏了这份文档——它里面有一句话已成事实错误。

**为什么改**：`docs/repo-branch-protection.md`「补齐前」的盘点里有一行历史记录：「`xhqing`（1 个）：只有 `traffic.yml`，那是定时采集任务、不是 PR CI」。这次停用流量采集时，`xhqing` 仓库的 `traffic.yml` 已连着采集工作流、脚本、`traffic/` 数据目录一起删除，现在它的 PR 检查就是 `validate`。文件名字叫「参考快照 / 历史记录」，所以**不改原结论**（那句话在当时成立，改掉就抹掉历史了），只在后面补一句日期注。

**改了什么**（1 个文件，与全局逐字节一致）：`pi/agent/docs/repo-branch-protection.md` 第 36 行末尾补一句「（2026-11-04 补充：该定时采集任务已随『停用流量采集』一并删除，现在本仓库的 PR 检查是 `validate`。）」。全文其余内容零改动。

**验证**：`diff -r` 对 `skills` / `docs` / `patch` / `extensions` 与 `CLAUDE.md` 逐部分复核，全局与镜像无内容差异（仅剩 `.gitignore` 覆盖的本机私有文件）。

**回归风险**：无。只加一句注、不动任何结论与命令，文档性质为历史盘点参考，不参与任何自动判定。

### 2026-11-04 访问量徽章正式取消 + macmini 上 gh 已认证（镜像同步，4 个文件）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。本批合并了两批互不相关的文案更新，一起提交。

**为什么改**：

1. **访问量徽章取消**：用户 2026-11-04 停用了 xhqing 仓库那套集中式访问量采集（采集工作流、脚本、`traffic/` 数据目录全删），全团队 24 个仓库 README 里的访问量徽章也在同一批 PR 里移除。规矩文件必须跟着改——否则下次 `/commit` 还会按旧规矩把这枚徽章当成「团队仓库允许的例外」保留甚至补挂，而它的数据源已经不存在了，只会长期展示冻结的旧值。
2. **macmini 上 gh 已认证**：macmini 上 `brew install gh`（2.14.4）已完成，凭据按方案 A 落地——把本机 keyring 里的 OAuth token 复制到 macmini 本机的 `~/.config/gh/hosts.yml`（该目录不在 Syncthing 镜像范围内），实测 `gh auth status` 显示已登录、`gh api rate_limit` 返回 4990/5000、`gh issue list` 退出码 0、仓库权限 admin/push/triage。原先文档里写的「尚未认证、要用得先放凭据」已成事实错误，需改成「已认证」并补上 token 轮换后需重写的注意事项。

**改了什么**（4 个文件，与全局逐字节一致）：

1. `pi/agent/docs/new-agent-scaffold.md`：原「访问量徽章（Visitors，团队仓库专用例外）」整条重写为「访问量徽章已取消（2026-11-04 用户决定）」——新建仓库只挂 License / Version / Type 三枚，存量看到按遗留删除整行，并写明为什么取消（采集停掉后徽章冻结旧值、文案仍写「Visits/day (14d)」，等于长期展示不实数据；要恢复得连同采集链路与数据目录一起恢复）。顺带把首字母大写那条里的示例 `Visits/day` 换成 `Type-AI Agent`（`Visits/day` 已不再是本团队徽章）。
2. `pi/agent/skills/commit/SKILL.md`：① 第 9a 步「Visitors 访问量徽章（团队仓库允许的例外，2026-08-16 立）」改为「访问量徽章已取消（2026-11-04 用户决定，取代 2026-08-16 的 Visitors 例外）」，明确 9a 不补挂；② 第 9l 步由「Visitors 属允许例外、不删」改为「遗留的访问量徽章按违规处理、删除整行」，检测句与修正句同步改写；③ 「严禁编辑 / 删除文件」例外清单、「写标记」「汇报」「边界」几处提到「Visitors 属允许例外」的表述一并改为「访问量徽章已于 2026-11-04 取消，遗留的按违规删除」；④ `.commit-cache.md` 的 `readme-badges` 标记示例文案同步改写。description 未改（989/1024，PASS）。
3. `pi/agent/docs/macmini-mirror.md`：第四节「macmini 上的 `gh`」由「尚未认证」改写为「已认证（2026-11-04，方案 A）」——凭据位置与权限位（`~/.config/gh/hosts.yml`，user `xhqing`，mode 600，不在镜像范围）、scope 说明（repo / workflow / gist / read:org / admin:public_key，对 Issue 偏大但零维护，日后可换只含 Issues 的细粒度 PAT）、token 轮换后需重新写入、以及实测结果（认证状态、rate limit、`gh issue list`、仓库权限）。
4. `pi/agent/skills/macmini-use/SKILL.md`：第二节末第 ④ 点由「macmini 上的 gh 需要认证」改为「已认证（2026-11-04）+ 凭据位置 + token 轮换后需重新写」。description 未改（442/1024，PASS）。

**验证**：`diff -r` 对 `skills` / `docs` / `patch` / `extensions` 四部分与 `CLAUDE.md` 逐一复核，全局与镜像**无内容差异**（仅剩合法差异：本机私有不入库的 `anysearch/.env`、`backup/endpoints/endpoints.json`、`session-link` 运行时文件、`__pycache__`，均已在 `.gitignore` 覆盖范围内）。`check_description.py` 对 `commit` 与 `macmini-use` 两个 SKILL.md 均 PASS。

**回归风险**：低，但有一处**规矩收紧**需备案——commit skill 第 9l 步以前对访问量徽章「豁免不删」，现在改成「视为违规、删除整行」。若某个仓库的 README 仍挂着这枚徽章（数据源已删、徽章显示失效），下次在该仓库跑 `/commit` 会把它删掉；这正是本次要的效果，但如果某处还想保留这枚徽章做历史记录，需要在跑 `/commit` 前先说明。其余改动均为文案事实更新（认证状态），不影响任何判定逻辑。

### 变更（移除访问量徽章，配合停用集中式流量采集）

- **为什么改**：用户 2026-11-04 决定停用 xhqing 仓库的集中式访问量采集，同时不再在各仓库 README 展示访问量徽章。徽章的数据源必须由采集任务每天刷新，采集停掉之后徽章会冻结在旧值，而徽章文案写的是「Visits/day (14d)」——数字不再更新却仍显示成实时数据，留着反而误导读者。
- **改了什么**：`README.md` / `README_cn.md` 顶部徽章区删除那一枚 shields.io 访问量徽章（整行删除，数据源 `https://raw.githubusercontent.com/xhqing/xhqing/main/traffic/badges/<仓库名>.json`）；License / Version / Type 等其它徽章与正文一个字未动。
- **回归检查**：只删这一整行，徽章区所在的 `<p align="center">` / `<div>` 结构与相邻徽章不受影响；README 其余内容零改动。

### 2026-11-04 macmini 放开 `gh issue`（Issue 不碰本地 `.git`）+ 补拦 `gh workflow run`

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：macmini 自 2026-10-31 起严格 git 只读（`.git` 双向镜像，两边同时写会互相覆盖），扩展里的 `isGhReadonly()` 把「所有 gh 写操作」一并拦了，连 `gh issue` 也在内。但用户 2026-11-04 核定：**Issue 是 GitHub 侧对象、走 REST API，根本不碰本地 `.git`**，不该被归进 git 写操作——远端常驻会话（值班会话、Mark 系会话）需要自己开 Issue 记待办。实测也证实「macmini 上不了 GitHub」其实指**只断 ssh / git 层**（git url 被改成 `github.invalid`、ssh 走 127.0.0.1:9），HTTPS API 本来就通（`api.github.com` 返回 200）。同时顺手补了一个**既有缺口**：`GH_WRITE_VERBS` 里没有 `run`，`gh workflow run`（触发工作流）之前根本没被拦。

**改了什么**（4 个文件，与全局逐字节一致）：

1. `pi/agent/extensions/git-readonly-guard.ts`：① `isGhReadonly()` 新增 `issue` 分支——`area === "issue"` 直接放行，**只保留 `develop` 拦截**（新增常量 `GH_ISSUE_BLOCKED`：`gh issue develop` 会建本地分支 + checkout，是真 git 写）；② `GH_WRITE_VERBS` 加 `run`（`gh workflow run` 补拦；`gh run view` 这类只读 action 是 `view`，不受影响）；③ 文件头注释与 `DENY_REASON` 同步改写——禁写范围从「PR / Release / Issue / repo 变更」改为「PR / Release / repo / workflow 变更、`api` 非 GET」，并写明 `gh issue` 例外与 `develop` 的例外里的例外。
2. `pi/agent/docs/macmini-mirror.md` 第四节：新增「断的只是 ssh / git 层，HTTPS API 没断（2026-11-04 实测）」段与「macmini 上的 `gh`（2026-11-04 起可用，仅 Issue）」小节——为什么 `gh issue` 不算 git 写、已安装情况（`brew install gh`，2.14.4，`/usr/local/bin/gh`）、**尚未认证**与推荐认证方式（细粒度 PAT、只给目标仓库 Issues 读写，写 `~/.config/gh/hosts.yml` 或 `GH_TOKEN`，这两个位置不在镜像范围内、不会回流本机也不进仓库）、仍禁什么、以及敏感文本仍需 `# AI_SENSITIVE_CHECKED`。
3. `pi/agent/CLAUDE.md`：「macmini 严格 git 只读」条——禁写清单末项改为「PR / Release / repo / workflow 变更、`api` 非 GET」，新增 `gh issue` 例外说明（可在 macmini 建 / 查看 / 评论 / 改 / 关 Issue，`gh issue develop` 仍拦）与 gh 已装待认证的提示。
4. `pi/agent/skills/macmini-use/SKILL.md`：分流表「git add / commit / push / PR / Release / CI」行补 Issue 例外括注；第二节末新增「gh 在 macmini 上只有 Issue 能用」段与四项边界（`develop` 仍禁、其余 gh 写仍回本机、`gh issue create` 需带 `# AI_SENSITIVE_CHECKED`、未认证会提示 `gh auth login`）。

**验证**：4 个文件与全局 `diff` 逐一无差异；`esbuild --loader:.ts=ts` 对 `git-readonly-guard.ts` 通过；`check_description.py skills/macmini-use/SKILL.md` → PASS 442/1024。全局侧已由改动方验证：`checkCommand` 单测 17 条全过（issue 六种操作放行；`gh issue develop` / git 写 / `gh pr` / `gh release` / `gh repo` / `gh api` 写 / `gh workflow run` 全部仍拦；`git status` / `gh pr list` / `gh api` GET 放行）；macmini 上 `gh` 已装 2.14.4（匿名调用提示 `gh auth login`，确认已装未认证）、`api.github.com` HTTP 200 可达。

**回归风险**：低，但有一处**行为放宽**需备案——macmini 上 `gh issue …` 从「一律拒绝」变成「放行」，意味着远端会话现在能改动 GitHub 侧的 Issue 状态；防线靠三点：① `gh issue develop` 仍拦（唯一会碰本地 `.git` 的 issue 子命令）；② `gh api` 非 GET 仍拦，绕不过去改仓库其它状态；③ `public-text-guard` 仍要求 `gh issue create` 带 `# AI_SENSITIVE_CHECKED`。另一处是**收紧**：`gh workflow run` 现在会被拦（之前是漏网），若 macmini 上有脚本依赖它触发工作流，需改回本机执行。扩展按 hostname 判定，本机零影响。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-11-04 macmini 使用状态指示器（新增 extensions/macmini-use/status.ts）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：macmini 的活是在另一台机器上跑的，本机这边只看得到一条工具调用结果——用户在界面上根本看不出「此刻有东西正在那台机器上跑」，容易误以为本机空闲而随手关机 / 断网。用户因此立规（原话）：「触发 macmini-use 并使用 macmini 的时候，需要在 pi-tui 输入框下方显示当前使用的是 macmini，使用完之后需要撤销掉这个状态」。目标是把「这台机器此刻在借 macmini 的算力」变成一眼可见的事实。

**改了什么**（3 处改动 + 1 个新文件 + 1 处权限对齐，与全局逐字节一致）：

1. **新增** `pi/agent/extensions/macmini-use/status.ts`：状态指示器。用 `ctx.ui.setWidget(key, [text], { placement: "belowEditor" })` 在**输入框正下方**挂一行 `🖥  当前使用的是 macmini（算力机）`（计数 > 1 时补「· N 个任务」），归零时传 `undefined` 清除。两类「正在使用」都计入：**前台调用**（`macmini_run` / `macmini_status` / `/macmini …` / `ssh mac-mini …` 执行期间，由 index.ts 在 `tool_call` 登记、`tool_result` 销号）与**后台任务**（`macmini_run` 的 `background: true`——工具早已返回但远端进程还在跑，于是每 20 秒 `pgrep -f <脚本路径>` 探一次，全部跑完再撑）。两道防永挂：前台登记 30 分钟、后台任务跟踪 6 小时到期自动撤。
2. `pi/agent/extensions/macmini-use/index.ts`：接线——`session_start` 挂载指示器（并补 macmini 主机上不启用），四条使用入口（`macmini_run` / `macmini_status` / `/macmini` / `ssh mac-mini …`）均登记前台使用，后台任务调 `trackJob` 跟踪；`tool_result` 销号。
3. `pi/agent/skills/macmini-use/SKILL.md`：第二节补「输入框下方会亮一行状态提示」段——含义（亮着 = 确实在占用远端算力）、不要为点亮而动 macmini、不要在回复里再解释一遍，以及**已知覆盖边界**（`background_run` 里嵌 `ssh mac-mini …` 只跟到工具调用返回，长任务请走 `macmini_run` 的 `background: true`）。
4. `pi/agent/CLAUDE.md`：「重活默认分流到 macmini」条末尾补一句状态提示说明（四种触发入口 + 用完自动撤 + 亮着的含义）。
5. `pi/agent/patch/duty-macmini/duty.sh`：仅**权限位对齐**（644 → 755）——全局早就是可执行、镜像这边一直缺执行位，顺手按「逐字节一致」补上（内容零改动）。

**验证**：`diff -r` 逐目录复核 `extensions` / `skills` / `docs` / `patch` 与 `CLAUDE.md` 全部无差异（排除本机私有不入库文件：`anysearch/.env`、`backup/endpoints/endpoints.json`、`session-link/config.json`、`local-links.json`）；`esbuild --loader:.ts=ts` 对 `status.ts` 与 `index.ts` 均通过；`check_description.py skills/macmini-use/SKILL.md` → PASS 442/1024。全局侧已由改动方验证：`tsc` 类型检查通过、harness 模拟事件流转通过、真实 pi TUI 会话中后台执行 macmini 命令时输入框下方确实显示该行、执行结束自动消失。

**回归风险**：低。指示器是纯显示层，不参与任何判定——`before_agent_start` 的分流注入、重型本机命令拦截、`macmini_run` / `macmini_status` 的既有行为都没改；widget 用独立 key（`macmini-use`）不会与其它扩展的 widget 冲突；30 分钟 / 6 小时两道 TTL 防止 `tool_result` 或远端失联时残留；macmini 主机上整个扩展按 hostname 不启用，远端不会自己给自己挂提示。已知局限已在 SKILL.md 写明：`background_run` 通道里嵌 `ssh mac-mini …` 的后台进程不在跟踪范围内。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-11-04 add-mode / commit-mode：main 分支恒为「已关闭且只能关闭」

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-04 指出一个语义矛盾——新规已经确定「main 主工作区上不自动 add / commit（`git-main-guard` 硬拦）」，但两个开关查状态时仍把 main 主工作区报成「开启（auto）」，等于声称一件不会发生的事；他的口径是：**main 上默认状态就应该是关闭，而且只能是关闭，只有在非 main 分支 / worktree 上才能开启**。

**改了什么**（2 个脚本 + 2 份 README + 2 个守卫 + 全局规则）：

1. `pi/agent/patch/add-mode/add-mode`、`pi/agent/patch/commit-mode/commit-mode`：
   - 新增 `current_branch()`；`status` 输出带上「当前分支」，并分三态：**main / master → 「已关闭（main 分支强制关闭）」**（说明不能用 auto 开启、建 worktree 后才可开启）；非 main 且无 manual 条目 → 「开启」；有 manual 条目 → 「已关闭（手动）」并在 main 上加一句「main 上恒为关闭」。
   - `auto` 在 main 上把实际状态说清楚：「main 分支恒为关闭，auto 在这里不生效（条目已移除，main 仍不自动）；建 worktree 后在功能分支上才自动」——条目照常移除（否则无法清理登记），但不再谎称「已恢复开启」。
   - `manual` 在 main 上提示「main 恒为关闭；此登记对同级 worktree 无效，只覆盖登记目录及其子目录」。
   - `list` 补注「main 恒为关闭（只能关闭），auto 只在 worktree / 非 main 分支上可开启」。
2. `pi/agent/patch/add-mode/README.md`、`pi/agent/patch/commit-mode/README.md`：在「粒度」之后新增「main 分支恒为关闭」条，写法与全局规则一致。
3. `pi/agent/extensions/add-mode-guard.ts`、`commit-mode-guard.ts`：**撤销同日早些时候加的 `commonRoot()` 覆盖**——它让「主仓库登记的 manual」连带覆盖名下 worktree，与用户新口径（worktree 才可开启）直接冲突。改回纯目录判定：worktree 是独立目录，登记主仓库路径不影响同级 worktree；要关就单独对 worktree 目录执行 `manual`。
4. `pi/agent/CLAUDE.md`：「自动 add 开关：add-mode」与「自动 commit 开关：commit-mode」两段各补一条「**main 分支恒为关闭、只能关闭（2026-11-04 用户立）**」：目标目录停在 main / master 时 status 恒显示「已关闭（main 分支强制关闭）」，`auto` 在 main 上不生效（条目可被移除但状态仍关闭）——与 `git-main-guard` 在 main 上硬拦 add / commit 同一套口径；只有非 main 分支 / worktree 上才可能处于开启状态（新建 worktree 默认开启）。
5. `~/.local/bin/add-mode`、`~/.local/bin/commit-mode`：已重跑两个 `install.sh` 更新副本（脚本是复制安装、不是软链）。

**验证**（`/tmp` 临时仓库实测，用完清理；状态文件里的测试条目已移除）：
- main 上 `add-mode status` → 「已关闭（main 分支强制关闭）」；`commit-mode status` 同理。
- main 上 `add-mode auto` → 「当前本来就是自动 add」+「main 分支恒为关闭，auto 在这里不生效」；条目移除、状态仍为关闭。
- main 上 `manual` → 登记成功但明确告知「main 恒为关闭；对同级 worktree 无效」。
- 同级 worktree（`feat/x`）在 main 登记 manual 后仍为「开启」（验证 `commonRoot` 撤销后 worktree 不被连带关闭）。
- worktree 上 `manual` → 「已关闭（手动）」；`auto` → 「开启」。
- 两个守卫扩展 `esbuild --loader:.ts=ts` 语法检查通过；两份 README 与全局口径逐字对齐。

### 2026-11-04 worktree 场景修复：add / commit 在 AI 建的 worktree 上正常自动触发

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户澄清了他的真实工作流——**他本人在 main 分支的主工作区开 pi 会话，会话里让 AI 建 worktree，任务全程由 AI 在 worktree 里完成**；他本人不会进 worktree 操作。此前的条文只写了「非 main 分支才自动触发」，没说清「主工作区的 main」与「worktree 的功能分支」是两回事，导致两层歧义：
1. 看起来「在 main 开会话」就永远不触发 add / commit，两个 skill 等于作废；
2. 更要紧的是**实际执行层面根本跑不通**：add / commit skill 的全部检测与 git 命令都依赖会话 cwd（裸 `git status` / `git diff --cached` / `git commit`），而会话 cwd 停在 main 主工作区——实测 worktree 的工作区与 index 与主仓库**完全独立、互不可见**，裸命令会得出「工作区无改动 / 暂存区无内容」的结论并静默结束流程；反之若漏写 `-C` 撞上 main 上的写操作，会被 `git-main-guard` 拦下。

另外实测发现 worktree 里**不能操作本地 main**（三条命令全部 fatal）：`git switch main` → `already used by worktree at <主工作区>`；`git fetch origin main:main` → `refusing to fetch into branch`；`git branch -f main origin/main` → `cannot force update the branch used by worktree`。而 commit skill 的 0a（快进本地 main 引用）、9z（对齐本地 main + 删本地分支）、第 10 步（前置条件「当前分支为 main」）恰好全都依赖这些动作——worktree 里提交完、PR 合并后这三步必然断，发版链永远不触发。

**改了什么**（1 份全局规则 + 5 份 skill + 3 个扩展）：

1. `pi/agent/CLAUDE.md`：①「开发流程：worktree + PR」节在 `-C` 纪律之后新增「worktree 是任务的正常战场，不是被限制对象」——自动触发限制**只针对主工作区的 main**，worktree 的 feat / fix / chore 分支照常自动触发与自动衔接；检测入口用 `git -C <worktree> status --porcelain`；本地 main 的对齐与发版在主工作区执行；`gh` 不受 `-C` 限制。②「会话收尾检查」节的检查范围加入「本会话创建的 worktree」（`worktree list` + 逐个 `git -C <worktree> status --porcelain`），并新增「worktree 怎么提交」条（全命令带 `-C`、分支属非 main 照常自动触发）。
2. `pi/agent/skills/add/SKILL.md`：description 补 worktree 场景一句；授权边界第 1 条改写为「主工作区的 main 上不自动发起，worktree 的功能分支属正常自动触发范围」，并新增独立条目讲清两种工作区；新增「worktree 场景」节（目标工作区解析、全部命令带 `-C`、禁止 `cd`（守卫不跟踪 cd 会误拦）、检测入口读 worktree、闸门看 worktree 分支）；第 0 步候选集改为 `git -C <目标工作区> status --porcelain`；第 5 步 `git add` 与新增的 `diff --cached` 验证都带 `-C`；第 7 步自动衔接把目标工作区路径传给 commit skill。
3. `pi/agent/skills/commit/SKILL.md`：description 补 worktree 场景（并压缩其余文字保住 1024 上限，1009 → 定稿 989）；触发判定②改为「主工作区 main 上不自动衔接，worktree 功能分支照常」；新增「worktree 场景」节（两个工作区的分工、全部命令带 `-C`、worktree 里那三条 fatal、`gh` 例外）；0a 远端对齐在主工作区执行 `git -C <主工作区> merge --ff-only origin/main`（主工作区不在 main 或被未提交改动挡住 → 跳过并记录，不阻塞提交）；0b / 第 1 步 / 敏感扫描 / cache 检测 / 第 4–8 步全部改 `git -C <目标工作区>`；第 8 步 `gh repo create` 用 `--source=<目标工作区>`；9z 场景 A 拆成主工作区 / worktree 两种（worktree 里不 `switch main`，本地分支与 worktree 留给 dev-workflow 第 8 步收尾，远端源分支照常清理）；第 10 步前置条件 2 改为主工作区 `HEAD == origin/main`（**弃用 `merge-base --is-ancestor`**：PR 是 squash 合并，原提交与 main 无祖先关系，会误判成未合并），前置条件 3 与各步的 `fetch` / `log` / `rev-list` 全部带 `-C`；第 9 步明确「标配检测与补全以任务工作区为根」；第 11 步与汇报的 `git status` 改为 `git -C <目标工作区> status`。
4. `pi/agent/skills/bump/SKILL.md`：第 1 步对齐 main 改为主工作区 `git -C <主工作区> fetch && merge --ff-only origin/main`（不在 worktree 里 `switch main`）；第 2 步 worktree 场景改为新建专用 bump worktree（`git -C <主工作区> worktree add ../<仓库名>-bump-v<版本> -b chore/bump-v<版本>`），不动主工作区；第 5 步把 bump 工作区路径传给 add skill。
5. `pi/agent/skills/release/SKILL.md`：第 0 步正式发布对齐 main 改为主工作区 `-C` 执行并校验 `HEAD == origin/main`；新增「worktree 场景」说明（第 2–7 步全部针对主工作区，tag 必须打在 main 的 HEAD 上）；第 2 步 `status --porcelain`、第 3 步 `tag -l` / `ls-remote --tags`、第 5 步 `tag -a`、第 6 步 `push origin <tag>` 全部带 `-C <主工作区>`。
6. `pi/agent/skills/dev-workflow/SKILL.md`：**修掉与现行授权规则的三处冲突**——2026-09-22 立的两处「commit 一律由用户亲自执行、AI 不代行」已被 2026-10-01（`/add` 预检干净自动衔接 commit）与 2026-10-04（常设授权：有待提交内容就直接按流程提交）覆盖，dev-workflow 却一直没同步：① CI 红修复循环的「用户自行 add + /commit」改为走 `/add` → `/commit`；② 开发过程提交条改为按 add / commit skill 授权；③「git / gh 授权边界」整段重写（明确旧口径已废止、全部 git 命令带 `-C`、暂存区只增不改）。第 8 步收尾的 `cd <主仓库> && git worktree remove` 改为 `git -C <主工作区> worktree remove`，同步其它 worktree 也带 `-C`。
7. `pi/agent/extensions/git-status-guard.ts`：第 11 步的 status 比对此前只按会话 cwd 实测，worktree 场景会把正确的 worktree 输出误判成「编造」并替换成主工作区的 status。新增 `commandTarget()`：从每条 bash 命令里解析最近的 `git -C <path>` / `cd <path>` 目标，作为候选之一；比对时**贴出的内容匹配任一候选（worktree 或 cwd）即放行**，都不匹配才替换为优先的 worktree 输出。
8. `pi/agent/extensions/add-mode-guard.ts` / `commit-mode-guard.ts`：两个开关的粒度是「登记的目录及子目录」，而 worktree 在主仓库同级、toplevel 是它自己——**在主仓库登记 manual 原本覆盖不到它名下的 worktree**（用户暂停了自动提交，AI 在 worktree 里却照常提交）。新增 `commonRoot()`：用 `git rev-parse --path-format=absolute --git-common-dir` 取共享 gitdir 的上级目录（主仓库根），`isManualPath` 判不到时再拿它判一次。

**验证**（全部在 `/tmp` 临时仓库实测，用完清理）：
- `git -C <worktree> add` → 放行；`cd <worktree> && git add` → 被 `git-main-guard` 拦（确认必须用 `-C`）；`git -C <worktree> commit # AI_AUTHORIZED_COMMIT` → 放行且 gitleaks pre-commit hook 正常执行。
- worktree 与主工作区 index 隔离：worktree `add` 后主工作区 `diff --cached` 为空。
- 0a worktree 变体：worktree 里 `fetch` → 主工作区 `merge --ff-only origin/main` 成功，HEAD 与 origin/main 相同。
- 9z worktree 变体：push 分支 → squash 式前进 main → worktree fetch → 主工作区对齐 → 远端源分支 `push origin --delete` 成功；worktree 本地分支 `branch -D` 报 `cannot delete branch ... used by worktree`（符合设计，留给 dev-workflow 第 8 步）。
- 第 10 步新前置条件（主工作区 `HEAD == origin/main`）在 squash 合并后成立。
- `check_description.py`：add 752/1024、commit 989/1024、bump 481/1024、release 737/1024，全部通过。
- 三个扩展 `esbuild --loader:.ts=ts` 语法检查通过。

### 2026-11-04 币种符号新规（美元写 `US$` / 港币写 `HK$`，禁止裸 `$`）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-04 立了一条全局表述规则——金额一律写完整币种符号（`US$` / `USD` / `HK$` / `HKD`），不许用裸 `$`。原因有两层：一是裸 `$` **没说清是哪种货币**，读者得靠上下文猜；二是本团队的语境里港币用得不少，裸 `$` 很容易被误读成港币（或反过来），一旦出现在复盘、订单记录、脚本输出里就是实打实的口径错误。规则同时划了三条边界，避免误伤：用户原文与外部原文（网页 / 报告 / 新闻 / 第三方文档）里的 `$` 不改（那是别人写的）、代码里作为字符串内容的 `$`（shell 变量 / 正则 / 模板语法）不受限、纯数学式子里与货币无关的符号照旧。

**改了什么**（1 处改动 + 一轮排查）：

1. `pi/agent/CLAUDE.md`：「## Language」节紧跟「标点符号一律使用简体中文标点」之后**原样新增**「币种符号：美元一律写 `US$` 或 `USD`，港币一律写 `HK$` 或 `HKD`，禁止用裸 `$`（2026-11-04 用户立）」条目——写法示例、适用范围（所有对话回复、所有落盘文件含文档 / 复盘 / CHANGELOG / TODO / 脚本输出与注释、所有金额与费率数字）、三条边界、以及工具强制说明（`DayTradingAgent` 的停盯总结 `CUR` 已改成 `US$`，金额前缀由常量统一控制、禁止在脚本里裸写 `$` 拼金额）。位置与全局一致，`diff` 逐字节无差异。
2. **排查结论：镜像侧 skills / docs 无需跟进改动**。按规则扫了 `pi/agent/` 下全部 `*.md` / `*.txt` / `*.json` 里的 `$`——命中项全部落在豁免范围：`patch/branch-protection/branch-protection.sh`、`patch/subsync/*`、`skills/md2pdf/scripts/md2pdf.sh` 等是 shell 变量（`$1`、`$PWD`、`$(id -u)`）；`skills/macmini-use/SKILL.md`、`skills/skill-creator/SKILL.md`、`skills/agent-reach/references/video.md` 里的 `$i` / `$VIEWER_PID` / `$UA` 同为变量；`skills/image-ocr/SKILL.md` 的 `\$\s?\d+` 是「识别金额」的正则（代码，不是给人看的金额）；`skills/md2pdf/references/pitfalls.md` 的 `$header-includes$` 是 pandoc 模板占位符；`docs/capability-sync.md` 的 `grep -c '^## 2026-10-12$'` 是正则锚点。**没有任何一处是「金额写成裸 `$`」**，故本次不动 skills / docs 正文（LaTeX 数学公式里的 `$` 亦未触碰）。

**验证**：`diff ~/.pi/agent/CLAUDE.md pi/agent/CLAUDE.md` 无输出（逐字节一致）；`grep -rn --include='*.md' -E '\$[0-9]' pi/agent/` 命中 0 条，确认没有「`$` 紧跟数字」的金额写法残留。

**回归风险**：无。纯新增一条表述规则 + 一次只读排查，未改动任何既有规则文字、脚本逻辑或扩展行为；新条目与既有「标点符号」条并列，不覆盖任何旧要求。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

## [1.12.0] - 2026-11-03

### 2026-11-03 存量 37 个仓库全部补齐 strict PR CI（新增 validate-template/）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-03 上午立规「新建项目仓库一律必须 strict 模式的 PR CI」时，团队现状是 37 个仓库（18 个 Agent 项目 + 19 个子项目）只有 9 个合格、28 个没有 required check。当晚用户追加口径：「28 个不合规的仓库也统一执行最新标准」。于是把 28 个全部补齐（现 37/37 合规），并把「存量按现状保留」的子条改成「存量已全部补齐」——否则规则文档与仓库实况对不上，下一个人看到旧文字会以为剩下 28 个仍可放着不管。同时把「在 PR 上真实跑的 CI 检查」这一件（三件套的第一件）做成零依赖模板，后续新建仓库不用再从零写。

**改了什么**（5 处，与全局逐字节一致）：

1. `pi/agent/CLAUDE.md`：「开发流程」第 3 条下原子条「存量按现状保留、不追溯变更」**整条替换**为「存量已全部补齐（2026-11-03 同日）」——37 个仓库 100% 合规，其中 26 个补了统一的 `validate` 检查（`.github/workflows/validate.yml` + `.github/scripts/validate.py`），2 个已有 CI 的直接挂上现有检查，9 个原本合格未动；随时可用 `branch-protection.sh audit` 核对。
2. `pi/agent/docs/repo-branch-protection.md`：「2026-11-03 实测」整节重写为「实测与补齐：全团队 37 个仓库 100% 合规」——补齐前 9/37 的实测细分（有 CI 没挂门禁 2 个、只有定时任务 1 个、既无 CI 也无门禁 25 个）、补齐后的处理方式表（9 未动 + 2 直接挂 + 26 补 validate）、统一 `validate` 检查的五类内容与「为什么只查这些」的设计取舍、口径（新建按三件套、存量已全部补齐）。
3. `pi/agent/docs/new-agent-scaffold.md`：「配置 main 保护」条尾部的「一键命令」改为两段式——先 `validate-template/install.sh` 装检查、走 PR 合并，再用 `branch-protection.sh apply` 挂门禁（顺序反了会把 PR 永久卡死）。
4. **新增** `pi/agent/patch/branch-protection/validate-template/`：`validate.py`（零依赖仓库卫生校验：必备文件 / 敏感文件未被跟踪 / 被跟踪文件 ≤ 10MB / README 相对链接有效 / Python·Shell 语法）、`validate.yml`（workflow 模板，含 `%BRANCH%` 占位符，check 名 `validate`）、`install.sh`（在目标仓库根目录装好这两个文件并本地跑一遍，空仓库自动回落 `main`）。
5. `pi/agent/patch/branch-protection/README.md`：新增「五、给仓库装检查：`validate-template/`」（用法、模板内容表、五类检查说明、为什么只查确定性低误报项），原「五、边界」顺延为「六」。

**验证**：三条镜像校验干净——`diff ~/.pi/agent/CLAUDE.md`、`diff -r ~/.pi/agent/docs`、`diff -r ~/.pi/agent/patch`（排除 `*.log` / `.lock` / `conflicts` / `__pycache__` 与 session-link 的 gitignored 本机状态文件）均无差异；`bash -n install.sh`、`python3 -m py_compile validate.py` 通过；在镜像仓库根目录跑 `validate.py` 本体，必备文件 / 敏感文件 / 大文件 / README 相对链接（6 个）四类全绿。

**回归风险**：无（纯新增模板 + 文档改写，未改动任何既有脚本的判定逻辑）。**已知局限**（已在 README 写明）：模板只做确定性低误报的检查，不做格式 lint / 单元测试——那些要么噪声大、要么依赖项目自身工具链，不宜统一。**发现一处待确认的局限**：`validate.py` 判断「无 `.sh` 后缀但带 shebang 的脚本」时按子串匹配 `sh`，`#!/usr/bin/env pwsh` 也会被当成 shell 脚本、送进 `bash -n` 报语法错（PowerShell 语法）；本次镜像仓库自身因 `pi/agent/skills/anysearch/scripts/anysearch_cli.ps1` 命中该误报。当前 24 个已装该脚本的仓库里只有本仓库与 pi-harness 含 `.ps1`（pi-harness 用的是自己的 `ci.yml`），所以暂未造成实际红牌；已向用户报告，是否修正并重新铺到 24 个仓库待定（本次按「全局为准」原样镜像，未擅自改权威源）。

### 2026-11-03 新增 macmini-use：重活默认分流到 macmini

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-03 立规，给全团队加一个「macmini-use」能力——用户给 pi 下指令时，先判断这条指令里的重活要不要放到 macmini 上跑。起因是本机是用户**此刻正在用**的 MacBook Air（8 核 / 8GB），而 macmini 是 12 核 x64 / 32GB 的常驻算力机、与本机 `~/Developer` / `~/.pi/agent` 双向镜像；用户的痛点不是「算力不够」，而是「AI 在本机跑长任务时，用户自己也卡」。分流准则因此定成「**用户的本机要流畅**」，不是「尽量多用远端」：几秒内结束的命令留本机更快，真正该挪的是会让风扇转起来、让打字卡顿的活。

**改了什么**（5 处，与全局逐字节一致）：

1. **新增** `pi/agent/extensions/macmini-use/`（目录 + `index.ts` 形态，三个文件）：`index.ts` 每轮 `before_agent_start` 往系统提示追加「分流判断」；指令命中重型特征时再注入一条 `display:false` 的定向提醒；注册 `macmini_run` / `macmini_status` 两个工具与 `/macmini` 命令；`tool_call` 拦重型本机命令（逃生门 `# AI_LOCAL_OK: <理由>`）；macmini 主机上按 hostname 整个不启用。`classify.ts` 纯判定（重型命令清单、镜像目录递归删除、指令重型特征）。`remote.ts` 路径映射（`/Users/xhq` → `/Users/mac`）、`ssh mac-mini bash -s` 执行、后台任务（`/tmp/macmini-jobs`）、负载脚本。
2. **新增** `pi/agent/skills/macmini-use/SKILL.md`：判断表、远端工具链实况（2026-11-03 实测）、常见重活跑法（Node / Python / Rust / Go / Swift / ffmpeg / Chrome headless）、硬约束（镜像删除会删到本机、git 只读、x64 差异、缓存别回流）、故障排查。
3. **新增** `pi/agent/patch/macmini-use/`：`README.md`（设计 / 行为 / 局限）、`test-classify.ts`（判定逻辑回归测试，49 个用例）、`test-remote.ts`（远端冒烟测试）。
4. `pi/agent/CLAUDE.md`：「跨机协作：macmini 值班会话」节开头新增两条 bullet——「重活默认分流到 macmini（工具强制）」与「镜像删除与远端 git 的红线」。
5. `pi/agent/docs/macmini-mirror.md`：第五节「日常操作」新增一条「重活分流（2026-11-03 起）」，指向 skill 与两个工具。

**验证**：`bun pi/agent/patch/macmini-use/test-classify.ts` → 49 个用例全过（含 `xcodebuild` / `docker build` 明确不拦、`echo` / `git commit -m` 不误伤）；`bun build pi/agent/extensions/macmini-use/index.ts --target node --external '@earendil-works/pi-coding-agent' --external 'typebox'` 编译通过（与全局侧构建产物仅差路径注释）；`check_description.py pi/agent/skills/macmini-use/SKILL.md` → PASS 442/1024；三条镜像校验干净——`diff ~/.pi/agent/CLAUDE.md`、`diff -r ~/.pi/agent/docs`、`diff -r ~/.pi/agent/extensions`、`diff -r ~/.pi/agent/skills`、`diff -r ~/.pi/agent/patch`（排除 `*.log` / `.lock` / `conflicts` / `__pycache__` 与 session-link 的 gitignored 本机状态文件）均无差异。

**回归风险**：有，已评估——新增的 `tool_call` 闸门会让部分重型本机命令（`swift build`、`cargo build`、`ffmpeg` 等）从「直接跑」变成「被拦下、须改走 `macmini_run` 或加 `# AI_LOCAL_OK: <理由>`」，这正是本次规则要达成的效果；为避免误伤，闸门只锚定命令段开头（`echo xcodebuild`、`git commit -m` 里的同名文字不会被拦），`npm run build` / 单文件 `pytest` / 普通 `make` / `xcodebuild` / `docker build` 明确不拦，判定回归测试 49 例固化在 `patch/macmini-use/test-classify.ts`。扩展在 macmini 上按 hostname 判定不启用，不会把活分流给自己；`macmini_run` 复用 `git-readonly-guard.ts` 的判定拒绝远端 git 写，非 `/tmp` 递归删除默认拒绝（须 `# AI_REMOTE_RM_OK`），避免经镜像删到本机。本次为纯新增能力，未改动任何既有 skill / 扩展的行为。

## [1.11.0] - 2026-11-03

### 2026-11-03 新建仓库一律必须 strict 模式的 PR CI（新增 patch/branch-protection/）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-03 立规，原话「规定以后新建立的项目仓库全部必须使用 strict 模式的 pr-ci」。起因是当天排查全团队仓库的保护状态时发现：分支保护里「挂了 required check」和「开了 strict」是两件独立的事，很多仓库只做了前者（或都没做），于是 PR 可以拿「旧 main」上通过的 CI 直接合并——别人刚合并进来的新测试从没在它身上跑过，回归防护网存在系统性漏洞。因此把要求固化成「三件套缺一不可」，并配套一个可审计、可误操作防护的脚本。

**改了什么**（4 处，与全局逐字节一致）：

1. **新增** `pi/agent/patch/branch-protection/`：`branch-protection.sh`（755）+ `README.md`。脚本三个子命令——`audit`（批量审计，输出四类：strict 合格 / 有 required 但非 strict / 有 CI 没挂门禁 / 完全没门禁，退出码可直接用于巡检）、`show`（单仓库详情 + 列出真实 check 名）、`apply`（配 strict 三件套，默认 dry-run、须显式 `--apply`）。判定口径同时查 classic branch protection 与 rulesets（两者叠加生效，只看 classic 会漏判）。README 讲清 strict 与「串行跑 CI」的区别（含串行 ≠ 因果顺序的反例）、三件套含义、配置时序与边界。
2. `pi/agent/CLAUDE.md`：「开发流程：worktree + PR」第 3 条「main 保护是仓库层的硬约束」下新增三条子条目——新建仓库必须 strict 模式 PR CI（三件套：PR 上真实跑的 CI 检查 + 挂成 required status check + `required_status_checks.strict=true`，无「没 CI 就豁免」例外）、为什么 strict 是必须的、存量按现状保留不追溯变更。
3. `pi/agent/docs/repo-branch-protection.md`：开头新增两节——「2026-11-03：新建仓库一律必须 strict 模式的 PR CI」（规矩、为什么、check 名时序陷阱、脚本位置）与「2026-11-03 实测：全团队 37 个仓库的 strict 现状」（9 个合格 / 28 个未挂 required check，含细分名单与口径）；「常用命令」表新增查 rulesets、全量审计、单仓库上 strict 三件套三行。同时修正旧描述里「`cmux` required check 暂为空」的说法——实测 `cmux` 已挂 `checks` 且 strict=true。
4. `pi/agent/docs/new-agent-scaffold.md`：「开源到 GitHub」条之后新增「配置 main 保护：必须 strict 模式的 PR CI（新建仓库无例外）」，含三件套、正确配置顺序（先让 CI 真跑一次拿到真实 check 名再挂保护，否则 PR 永久卡死）、定时任务检查名不能挂 required、一键命令。

**验证**：三条镜像校验均干净——`diff ~/.pi/agent/CLAUDE.md pi/agent/CLAUDE.md`、`diff -r ~/.pi/agent/docs pi/agent/docs`、`diff -r ~/.pi/agent/patch pi/agent/patch`（排除 `*.log` / `.lock` / `conflicts` / `__pycache__` 与 session-link 的 gitignored 本机状态文件）全部无差异；`branch-protection.sh` 权限 755 保留。

**回归风险**：有，已评估——CLAUDE.md 第 3 条原表述为「required check（有 CI 的仓库）……没有 CI 的仓库至少保留『必须 PR + 禁直推』」，等于给无 CI 仓库开了豁免口子；新条目明确「不存在『没 CI 就豁免』的例外」。为避免追溯冲击，同一处已写明**只约束新建仓库、存量按现状保留**，因此现有 37 个仓库的保护状态不受影响（其中 28 个不因本条自动变更）。脚本 `apply` 默认 dry-run，并对「填了从未出现过的 check 名」打印警告，降低误配导致 PR 永久卡死的风险。

### 2026-11-03 skill description 硬上限 1024 改为工具强制（新增 skill-desc-guard）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：skill 的 `description` 是 Agent Skills spec 的硬上限——1024 字符封顶（按 JS `string.length` 计，一个汉字算 1），超了 pi 每次启动都会打 `[Skill conflicts] description exceeds 1024 characters` 警告、触发描述被截断。这条规则早就写在 `skill-creator` 的「hard gate——量它，别凭感觉」里，却反复犯规：2026-11-03 实测 `add` 1069、`commit` 1111 双双超限，当天早些时候刚因同样问题修过 `commit`（1069 → 967）又反弹。用户因此定调：「记不住就工具强制」。

**改了什么**（5 处，与全局逐字节一致）：

1. **新增** `pi/agent/extensions/skill-desc-guard.ts`：`write` / `edit` 目标为 `SKILL.md` 时，先按编辑内容模拟出写入后的 description、算出长度，超 1024 直接 block。放行两种有意例外：本次编辑没动 description（历史欠账不归这次编辑管）、本次编辑让 description 变短（修短的过程不能被自己拦）。shell 写入（`sed -i` / heredoc）走不到 `write` / `edit` 钩子，由 `tool_result` 后置实测提醒兜底。**无逃生门**（超了就是错的）。核心纯函数（descLength / extractDescription / simulateEdits / measure / measureFile / isSkillFile / judge / skillPathsFromCommand）已导出可单独测路。
2. `pi/agent/CLAUDE.md`：「Skill 编写纪律」节新增一条「description 硬上限 1024 字符（工具强制，2026-11-03 用户立）」——写清计数口径、违规后果、正确压法（流程机制细节搬进正文，不删触发词，留余量）与守卫位置；上一条末尾补一句交叉引用。
3. `pi/agent/skills/add/SKILL.md`：frontmatter description 从 1069 压到 592——把分步机制留在正文，description 只留「干什么 + 什么场景必须触发 + NOT for 边界」。
4. `pi/agent/skills/commit/SKILL.md`：description 从 1111 压到 889（同上，并去掉冗余括号解释）。
5. `pi/agent/skills/skill-creator/SKILL.md`：description hard gate 段补一条 "Tool enforcement (since 2026-11-03)"，说明拦截规则、两种有意例外、shell 写入的后置兜底与「留 ≥ 50 字符余量」建议。

**验证**：`python3 ~/.pi/agent/skills/skill-creator/scripts/check_description.py pi/agent/skills/*/SKILL.md` → 13 个 skill 全部 PASS（最小余量 118，add 592/1024、commit 889/1024）；三条镜像校验均干净（extensions 无差异、skills 只剩 `.env` / `endpoints.json` 两个 gitignored 本机文件、CLAUDE.md 无差异）。

**回归风险**：有，已评估——description 是常驻上下文、直接驱动触发判断：① 压缩后若漏掉某个触发场面，add / commit skill 会欠触发，因此两者都保留了全部触发词与原「MUST USE / NOT for」结构，只删解释性铺陈；② 新守卫会拦下「顺手把 description 写长」的编辑，合法但需知悉：要加长只能先腾出等量空间或另走工具外手段（工具外手段仍有后置提醒兜底）。

### 2026-11-03 local main 只剩两个职责：自动 add / commit 在 main 上禁用

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-03 定调（原话要点）：「add-skill 和 commit-skill 的自动触发功能必须在 main 分支上面禁止掉，只能在非 main 分支上面自动触发。并且本地 main 分支只剩下两个任务：一个是生成 worktree，另一个是被 remote-main 同步。以后任何项目里面的任何写操作第一步是生成 worktree，任务后续一切写操作在 worktree 里面执行。」

原因是实践里所有误踏主工作区的情形都跟「在 main 上直接把改动 add / commit 掉」有关：一旦自动触发在 main 上生效，AI 就绕过了 worktree，回到「多人多会话轮流写同一个工作区」的老毛病（2026-11-02 立 worktree 规则的直接起因）。把 main 降为纯基础设施（只生成 worktree、只接远端快进）后，「先建 worktree」从口号变成唯一可行路径。

**改了什么**（4 个文件，与全局逐字节一致）：

1. `pi/agent/extensions/git-main-guard.ts`：拦截范围新增第 3 项——当前分支为 main / master 时的 `git add`（新增 `ADD_MARK = "AI_AUTHORIZED_ADD_MAIN"` 与 `ADD_DENY` 文案；子命令识别从 `push|commit` 扩到 `push|commit|add`；新增 add 分支拦截逻辑，仍只对带 GitHub remote 的仓库生效；文件头注释的拦截范围与逃生门两段同步更新）。
2. `pi/agent/CLAUDE.md` 两处：① 「Git 写操作必须先征得同意」节的「常设授权：工作区 / 暂存区有待提交内容 → 直接提交」条下新增子条目——**仅限非 main 分支**；② 「开发流程：worktree + PR」节铁律第 1 条标题改为「开工先建 worktree（2026-11-03 强化：任何项目里的任何写操作，第一步就是生成 worktree）」，并新增子条目「local main 只剩两个职责」。
3. `pi/agent/skills/add/SKILL.md`：description 与正文授权边界第 1 条都补「仅限非 main 分支」限制（含工具强制与逃生门指向）。
4. `pi/agent/skills/commit/SKILL.md`：description 与正文「触发判定（来源两种）」第 ② 项都补「仅限非 main 分支」限制。

**验证**：全局侧 `bun build extensions/git-main-guard.ts --target node --external '@earendil-works/pi-coding-agent'` 编译通过；镜像侧 4 个文件 `diff -q` 均无差异（IDENTICAL）。

**回归风险**：有，已评估——guard 新增的 `git add` 拦截会让 main 上的 `git add` 从「可执行」变成「被拦」，若有流程（含人工习惯）靠在 main 上 add 后建分支，需改成先建 worktree 再 add；这正是本次规则要达成的效果，不属意外破坏。两个自动触发的限制与既有 add-mode / commit-mode 开关互不冲突（那两个是「按项目暂停」，本项是「按分支禁用」，可叠加生效）。

### 2026-11-03 worktree 内跑 git 必须用 `git -C`（防 git-main-guard 误拦）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：2026-11-03 在 DayTradingAgent 里用 worktree 提交时，`git-main-guard.ts` 连续两次误拦——因为它判断「在哪个仓库 / 哪个分支」只认命令里显式的 `-C` 参数与进程当前工作目录（pi 会话 cwd），**不跟踪命令里的 `cd`**；会话 cwd 通常停在主仓库（main 分支），于是 `cd ../xxx-worktree && git commit` 被当成「在 main 上提交」而拦下。改用 `git -C <worktree 绝对路径> commit` 立即通过。这条规则把踩坑结论固化下来，让后续会话不再重复试错。

**改了什么**（`pi/agent/CLAUDE.md` 一处，插在「开发流程：worktree + PR」节铁律第 1 条下作为子条目）：要求 worktree 内跑 git 一律写成 `git -C <worktree 绝对路径> <子命令>`；并明确**被误拦时不得加 `# AI_AUTHORIZED_COMMIT_MAIN` 绕过**——该标记只用于用户当轮明确授权，不能用来自行为误判开逃生门，正确动作是改用 `-C`。

**回归风险**：无（纯新增文字，未改动既有条目；与「Git 写操作必须先征得同意」节里关于逃生标记的口径一致，两处不冲突）。

### 2026-11-02 commit skill description 超出 1024 上限（1069 → 967）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：pi 启动时报 `[Skill conflicts] auto (user) ~/.pi/agent/skills/commit/SKILL.md description exceeds 1024 characters (1069)`。起因是 2026-11-02「worktree + PR / 团队项目锁死 remote main」那批改动把 commit skill 的 description 从约 967 字撑到 1069（按 UTF-16 code units 计数），超出 1024 上限——规则一条没少，只是 description 塞得太满。

**改了什么**（只动 frontmatter 的 `description` 一行，正文一行未改）：压缩措辞（去掉重复解释与可省的限定语）、补 `NOT for` 指引（git add 预检归 add skill、打 tag 发 Release 归 release skill、改版本号归 bump skill）；触发来源、远端 main 对齐检测、分支感知走 PR + auto-merge、敏感扫描 + cache 检测、push 后补标配、第 10 步自动发版链这些语义全部保留。

**验证**：`skill-creator/scripts/check_description.py pi/agent/skills/commit/SKILL.md` → `PASS 967/1024 (57 headroom)`，exit 0。

**回归风险**：有，已评估——description 是常驻上下文、直接驱动触发判断：压缩后若漏掉某个触发场景，commit skill 会欠触发（用户说「提交一下」却不走流程）。本次把触发词补得更明确（`/commit`、「提交一下」「commit 吧」「推到远程」），并保留「`/add` 预检完全干净后自动衔接」这条自动触发路径；正文与其它文件零改动，流程逻辑不变。

### 2026-11-02 xhs-mentor-scam 移出团队名册（用户选方案 A：移出团队、保持私有）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：`xhs-mentor-scam` 含第三方个人信息的敏感材料，按 2026-11-02 立的「团队项目必须 public、私有仓库不得入队」规则不能继续留在团队名册。用户在同一批决策里选了方案 A——移出团队、仓库保持 private 作为个人项目（方案 B「拆分 / 脱敏后转 public」未采纳）。

**改了什么**（`pi/agent/docs/agents-registry.md` 两处）：

1. 子项目映射表删除 `SocialMediaManagerAgent（Gatsby） | xhs-mentor-scam` 整行；
2. 「已移出名册的子项目」新增 2026-11-02 条目——写明原属 Gatsby、移出原因（第三方个人信息）、保持 private 作个人项目、`autosave.sh` 自动备份照常、GitHub 仓库与本地目录均保留、恢复条件为先拆分 / 脱敏并转 public。

**验证**：`diff` 五部分与全局逐字节一致（本批只有 `docs/agents-registry.md` 一处变化）；Gatsby 名下的 xhqing 名册已同批更新（对方 PR #5），两边口径一致。

**回归风险**：无（纯登记变更，不动任何仓库、不动 `autosave.sh`）。唯一要留意的是：名册里 `xhs-mentor-scam` 从「在队」变成「已移出」，但它的本地目录与私有远程都还在、自动备份继续跑——日后若误以为它已下线而去删目录或停 launchd，会把仍在使用的个人项目一起处理掉，故条目里明确写了「均保留」。

### 2026-11-02 团队仓库一律 public（用户立规 + 两个仓库转公开）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-02 立规——团队项目（Agent 项目 + 其名下子项目）一律使用公开仓库，私有仓库不得作为团队项目。根因是 main 保护的现实约束：GitHub 免费版对私有仓库不提供分支保护，私有仓库的 main 只能靠本地 `git-main-guard.ts` 兑现，服务端没有硬约束；公开仓库才能开 PR 必过 / 禁 force / 线性历史这套真锁。

**改了什么**（2 项，均已在全局定稿，本次只同步镜像）：

1. **`CLAUDE.md`**：「开发流程：worktree + PR」节新增第 5 条「团队仓库必须是 public」——团队项目一律公开；发现私有仓库时先做敏感信息检查（gitleaks 全历史 + AI 语义扫描：密钥 / 凭证 / 个人隐私 / 第三方个人信息 / 财务状况），干净就直接改 public 并补 main 保护；含敏感信息的不入队。
2. **`docs/agents-registry.md`**：`dotfiles` 条目去掉「私有仓库」、改为「2026-11-02 按『团队项目一律 public』改公开并锁 main」；`ToolCallingRules` 条目补充「2026-11-02 按『团队项目一律 public』由私有改公开并锁 main」。

**事实背景（执行结果，记录备查）**：`dotfiles`、`ToolCallingRules` 已完成 gitleaks 全历史扫描 + 语义复查（零命中）后由 private 改为 public，并已开 main 保护（PR 必过、禁 force、线性历史、只允许 squash）。`xhs-mentor-scam` 因含第三方个人信息的敏感材料保持 private，是否继续留在团队名册待用户决定。

**验证**：`diff` 五部分与全局逐字节一致（`CLAUDE.md` / `docs` / `skills` / `patch` / `extensions`；仅 `.env`、`endpoints.json`、`session-link` 本机配置按规矩隔离）。

**回归风险**：无代码逻辑改动（纯规则与登记描述）。两条边界值得留意：① 私有仓库转公开是**不可逆的暴露面扩大**，规则把全历史扫描放在转公开之前正是因此——跳过这步等于把历史里的敏感信息一次性公开；② `xhs-mentor-scam` 的归属尚未定，名册里暂时保留，等用户决定后另记条目。

### 2026-11-02 全团队锁死 remote main（用户立规 + 新增 git-main-guard）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-11-02 立规——所有智能体团队项目（各 Agent 项目 + 各 Agent 名下的子项目仓库）的 remote main 一律锁死，不允许从本地 main 直接 push 到 remote main；任何任务都先在独立 worktree 的功能分支上做，只能走「分支 → PR → CI → auto-merge → remote main → 本地 main 用 `--ff-only` 同步」。起因是同一个工作区被多个会话同时写、互相污染。

**改了什么**（4 项，均已在全局定稿，本次只同步镜像）：

1. **`CLAUDE.md`**：在「Git 写操作必须先征得同意」之后、「Git 暂存区禁止 AI 自主增删改」之前新增「## 开发流程：worktree + PR（团队项目锁死 remote main，2026-11-02 用户立）」一节——适用范围、四条铁律（先建 worktree、一切走 PR、main 保护参数、分支命名）、边界与例外（用户当轮授权才可直推 / 非团队仓库不受限 / 新建项目 `git init` 不受限）、配套工具强制与详细开发循环的指针。
2. **新增 `extensions/git-main-guard.ts`**：拦截两类操作——① `git push` 的 refspec 指向 `main` / `master`（裸 push、`git push origin`、`HEAD:main`、`refs/heads/main`、`--delete main`、`--all` / `--mirror` 等可能覆盖 main 的形态）；② 当前分支为 `main` / `master` 时的 `git commit`（含 `git -C <path>` 形态）。**仅对带 GitHub remote 的仓库生效**（临时 / 本地实验仓库不误伤），判定失败 fail-open；逃生标记 `AI_AUTHORIZED_PUSH_MAIN` / `AI_AUTHORIZED_COMMIT_MAIN`，仅限用户当轮授权。
3. **`skills/commit/SKILL.md`**：0b 与第 8 步改为「main 上一律先 `git switch -c chore/<事项>`，把暂存内容与工作区改动一并带到分支再走 PR」，删掉「远端无保护可直推 main」的通道；description 同步改写。
4. **`docs/repo-branch-protection.md`**：新增「2026-11-02：全团队锁死 remote main」节——已铺开范围（public 18 个 Agent 项目 + 19 个子项目逐仓 `PUT …/branches/<default>/protection`，参数统一；cmux 的 required check 暂空；private 仓库免费版开不了保护、只能靠本地守卫；`xhs-mentor-scam` 的 autosave 例外待定）、`gridtrader` 默认分支是 `master`、新装扩展要重启会话才加载；「与技能的关系」一节同步改为新口径。

**验证**：`diff` 五部分与全局逐字节一致（`CLAUDE.md` / `docs` / `skills` / `patch` / `extensions`；仅 `.env`、`endpoints.json`、`session-link` 本机配置按规矩隔离）；`node --experimental-strip-types --check extensions/git-main-guard.ts` 通过；`git ls-files pi/agent/extensions` 现为 25 个文件、新文件无 `.gitignore` 命中。

**回归风险**：有，已评估——commit skill 原「远端 main 无保护则直推」的通道被删除，对**未开保护**的仓库（private 的 `dotfiles` / `ToolCallingRules` / `xhs-mentor-scam`）意味着从此也一律走分支 + PR。这是本次立规的预期效果（与「一律锁死」一致），不是误伤；代价是这些小仓库首次建 PR 时多一步，属可接受成本。另：已在运行的会话不会立刻加载新扩展，需重启才生效（重启前两条守卫不拦，文本流程约束照常）。

### 2026-11-02 pi 第三方包清单刷新（pi-intercom 0.18.1 / pi-mcp-adapter 7.0.0）

**为什么改**：本机 pi 的第三方包在 2026-10-26 升级过（`pi-intercom` 0.17.1 → 0.18.1、`pi-mcp-adapter` 5.3.1 → 7.0.0，后者连带 `@modelcontextprotocol/ext-tasks` 升到 0.2.2、移除 `@typesafe-ai/sdk` 依赖），但仓库里的生成式清单（第六类：`package.json` / `package-lock.json` / `PACKAGES.md`）还停在 10-17 的快照，`refresh.py --check` 报三件套全部不一致。

**改了什么**：跑 `patch/npm-manifest/refresh.py --dst pi/agent/npm` 刷新三件套——`package.json` / `package-lock.json` 与 `~/.pi/agent/npm/` 逐字节一致，`PACKAGES.md` 按新版本重新生成。

**验证**：`refresh.py --check --dst pi/agent/npm` 通过（镜像与当前本机一致）。

**回归风险**：无（生成式内容，按本机实际安装状态重算；不含第三方包本体，只放声明、精确锁与人读清单）。

### 2026-10-31 登记 Atlas 的新子项目 cmux（自建分叉）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 fork 了 cmux（`github.com/xhqing/cmux`，fork 自 manaflow-ai/cmux）并决定做**自建分叉**、交给 Atlas 负责，不再等上游合并关闭确认类的改动。

**改了什么**（`pi/agent/docs/agents-registry.md` 一处）：子项目映射表在 `Atlas | ghostty` 行之后、`mp4-player` 之前新增一行 `FullStackEngineerAgent（Atlas） | cmux`——写明它是基于 Ghostty 内核的 macOS 终端（面向 AI coding agents）的自建分叉、2026-10-31 建立、由 Atlas 负责；改的内容是「关闭带运行进程的工作区 / 标签页不再强制确认」这类偏好改动；维护方式是「以**上游 release tag 为基线 + 最小补丁**」持续同步上游。

**验证**：`~/Developer/cmux` 目录存在、remote 指向 `github.com/xhqing/cmux`；`roster-sync-check.py` 两份名册均报「名册与 registry 一致」（该会话已同批更新 `xhqing` 中英名册）。

**回归风险**：无（纯登记新增）。只加一行、不改动任何既有 Agent 行的职责与分组；cmux 与 ghostty 是两个独立子项目（前者是终端应用、后者是 Ghostty 本身的分叉），表里并列而不互相替位。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 新增 macmini 严格 git 只读（用户立规 + 两层工具强制）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 立规「禁止 macmini 这台设备进行 git 写操作，git add / git commit / git push 等等写操作全部禁止」。根因：两机 `~/Developer` 与 `~/.pi/agent` 是逐字节双向镜像（Syncthing），**`.git` 也一起同步**，两边同时写 ref / index 会互相覆盖、产生游离提交甚至损坏索引；而且 macmini 已断 GitHub，在那边写出来的东西仍要回本机重做。

**改了什么**（4 项，均已在全局定稿，本次只同步镜像）：

1. **新增 `extensions/git-readonly-guard.ts`**：macmini git 只读守卫——**按 hostname 判定** macmini（本机直接放行、零影响）；白名单放行只读子命令（`status` / `log` / `diff` / `show` / `branch -a` 类查询等），其余 **git 写子命令与 `gh` 写操作全拦**；覆盖 `bash` 与 `background_run` 两条执行路径；**无逃生门**（设计如此：要改只能改守卫本身）。
2. **新增 `patch/macmini-git-readonly/`**：`README.md`（立规背景、两层强制、判定规则、安装 / 卸载、生效时机与验证、已知边界）、`install.sh`（仅在 macmini 上运行——把 `core.hooksPath` 指向本目录 hooks，在本机会拒绝执行）、`uninstall.sh`，以及 `hooks/` 下的 `deny.sh` + 六个钩子（`pre-commit` / `pre-push` / `pre-rebase` / `pre-merge-commit` / `pre-applypatch` / `pre-auto-gc`，每个都 `exec deny.sh`、打印拒绝理由并 `exit 1`）。
3. **`CLAUDE.md`**：「跨机协作：macmini 值班会话」节新增一条「**macmini 严格 git 只读（2026-10-31 用户立，工具强制，无逃生门）**」（禁写清单、两层强制、边界），并在紧邻的「全量镜像」条末句补了指向该条的括注。
4. **`docs/macmini-mirror.md`**：「七、已知边界与风险」第 2 条从「**建议**同一时间只在一台机器上写」改写为「macmini 侧已由**工具强制**只读 + 两层机制位置 + 若没拦住应修复守卫」；「八、文件清单」表新增 `patch/macmini-git-readonly/` 一行。

**同批顺手对齐的两处镜像分叉**（本次核对时发现，不属上面交代的范围，但必须一并处理才能逐字节一致）：

5. **`patch/subsync/subsync.py`**：全局在 20:54 后加了一个**上游不可用时的兑底**——新增 `_last_good` 缓存，拉取失败时改用「最近一次成功生成的订阅」并在日志与总结里标明「沿用 N 分钟前的结果」，避免客户端拿到 502 后白白断开。镜像已跟上。
6. **删除 `extensions/diff-view.ts`**（1369 行）：diff-view 已于同日注销（全局卸载了该扩展、文件不存在），镜像里这份是残留，按「镜像与全局逐字节一致」清掉；注销事实已记在上一条 CHANGELOG 条目里，本次只是物理对齐。

**验证**：`diff -rq` 逐目录核过，除运行时私有数据（`patch/session-link/*` 的 config / 日志、`patch/skill-custom/*` 的日志与锁、`__pycache__`）外全绿；`hooks/*` 与 `install.sh` / `uninstall.sh` 的 755 可执行位保留（`cp -R` 保留模式）；`install.sh` / `uninstall.sh` / `hooks/deny.sh` 过 `bash -n`，`subsync.py` 过 `py_compile`；新增 / 修改文件逐个跑 gitleaks 均 `no leaks found`。

**回归风险**：无。① 本机零影响——守卫按 hostname 判定，非 macmini 直接放行；② macmini 无逃生门是**有意设计**（防止“临时绕一下”变成习惯），要变更只能改守卫代码并重新部署；③ 删 `diff-view.ts` 不影响现有功能（该扩展已在全局卸载、项目已注销）；④ `subsync.py` 的兑底只在**上游拉取失败时**生效，正常路径行为不变。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 ToolCallingRules 登记到 Ada 名下；Hermes / NewsScoreStudy 补「本地目录已删」

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 把 `~/Developer/ToolCallingRules`（LLM 工具调用规则集）交给 **Ada / NeuralCoreAgent** 负责，并同期注销 / 删除了几个不再用的本地项目目录。

**改了什么**（`pi/agent/docs/agents-registry.md` 三处）：

1. **子项目映射表新增一行** `NeuralCoreAgent（Ada） | ToolCallingRules`：LLM 工具调用规则集（22 条规则 / 7 类，注入 system prompt 以减少 function calling 的参数格式错误与不安全重试、提升调用准确率；PolyForm-Noncommercial 许可；2026-10-31 用户决定由 Ada 接手，此前是未登记的历史独立项目）。
2. **Hermes（NetOpsAgent）条**：结尾由「GitHub 仓库与本地目录保留为存档」改为「GitHub 仓库 `xhqing/NetOpsAgent` 保留为存档；**本地目录已于 2026-10-31 按用户要求删除**」。
3. **NewsScoreStudy 条**：补入「本地目录已于 2026-10-31 按用户要求删除」，仓库本体与私有远程保留不动。

无 Agent 行增减——注册表仍是 18 行，这次是子项目归属变更，不是 Agent 增减。

**一个口径提醒（顺手标明，免得后人当规则已覆盖）**：v1.10.0 里立的「除名 agent 的本地副本一律删除」只管**除名 agent**；本次删的 NewsScoreStudy 是**子项目**，严格说不在那条通则的覆盖范围内，这次是按用户当次指示单独处理的（仓库本体与私有远程都保留，只删本地目录）。若以后也要把「报废子项目删本地」变成通则，需另行立规矩。

**验证**（不只信描述）：`~/Developer/ToolCallingRules` 存在、是 git 仓库（remote `github.com:xhqing/ToolCallingRules`）；`~/Developer/NetOpsAgent` 与 `~/Developer/NewsScoreStudy` 两个目录确认均不存在；`roster-sync-check.py` 两份名册均报「名册与 registry 一致」。

**回归风险**：无（纯登记变更）。新增行只描述 Ada 接手事实与项目用途，不影响其它子项目归属；两条退役备注只补「本地已删」这一事实，原有职责与仓库位置信息保留。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

## [1.10.0] - 2026-10-31

### 2026-10-31 新增订阅地址改写服务 subsync（解决机场换 IP 后手机订阅失效）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么加**：手机代理客户端（v2rayNG）一直有个顽疾——机场下发的订阅里节点地址是**裸 IP**，机场一换 IP，手机上存的旧 IP 全部失效、只能重新扫码导入；而「更新订阅」又常因请求被塞进已死的节点而返回「0 个成功」。Kit 写了一个自建小工具解决它：拉上游订阅 → 把节点 IP 用 DNS 校验后换成域名 → 返回改写后的订阅，IP 怎么换客户端都能靠 DNS 自动跟上。

**改了什么**（新增 3 个文件）：

1. **`patch/subsync/subsync.py`**：单文件 Python3 服务，只用标准库。核心逻辑：拉上游订阅 → 逐条节点链接（ss / vmess / vless / trojan / hysteria2 / tuic）解析出地址 → 从节点备注里挑候选域名并用 DNS 校验它确实解析到同一个 IP（不匹配则原样保留、记日志）→ 换 host 后重新拼回 → 输出 base64 订阅。两道鉴权（随机令牌路径 + 自定义请求头密钥）、只绑配置里列出的网卡（默认只对 Tailscale 可见）、结果缓存 5 分钟、`/healthz` 健康检查、日志不记令牌与节点凭据。
2. **`patch/subsync/install.sh`**：部署脚本（macOS launchd 永驻、开机自启 / 崩溃自拉；支持逗号分隔的多地址监听；首次运行生成随机令牌与请求头密钥写入 `~/.config/subsync/config.json`，权限 600、已存在则不覆盖）。
3. **`patch/subsync/README.md`**：原理、安装、客户端配置（v2rayNG）、监听地址怎么选（含 Android 同一时间只允许一个 VPN 应用的官方约束）、安全模型、接口与运维命令。

**同批做的敏感信息清理（重点，不是重命名、是必要剥离）**：按 add skill 的双层预检扫出两处**不进得公开仓库**的内容，已在全局源改写后同步镜像：

- **服务商名称**共 3 处（`subsync.py` 头注 1 处、`README.md` 2 处）→ 改为中性表述「机场（订阅服务商）」「实测某机场的节点域名 TTL 只有 120 秒」。依据：commit skill 敏感扫描规则里「特定网络服务商标识」属硬红线（名称为订阅制服务商时不得入库），对应的技术结论保留、名称去掉。
- **真实 tailnet 地址** 1 处（`install.sh` 用法示例里的 `100.109.98.106`）→ 改为文档安全示例 `100.64.0.5`（与 README 示例一致）；其余 IP 均为私有网段或文档示例网段（`127.0.0.1` / `192.168.1.101` / `100.64.0.5` / `0.0.0.0`），可公开。

**凭证边界**：真实凭证不在这三个文件里——运行时配置在 Mac mini 的 `~/.config/subsync/config.json`（权限 600），不进仓库；install.sh 只在首次部署时现场生成随机令牌与密钥。

**验证**：改写后复扫 `jms|just my socks` 无命中；`subsync.py` 过 `py_compile`、`install.sh` 过 `bash -n`；三文件 gitleaks 均 `no leaks found`；镜像与全局逐字节一致。

**回归风险**：无。本次只改文本（注释与文档措辞、示例地址），服务逻辑与脚本行为未动；敏感内容剥离后不影响任何使用方式。

### 2026-10-31 注销 diff-view 子项目（改用 add-mode / commit-mode 暂停自动提交看 diff）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么**：用户 2026-10-31 决定注销 diff-view 功能——原话「需要 diff-view 的时候关闭 auto-add 或 auto-commit 就行了」。新做的两个开关（`add-mode` / `commit-mode`）已经把「不想让 AI 自动提交、我自己用 `git diff` / `git diff --cached` 过一遍」这个需求覆盖了，diff-view 那套「扩展自动打开 diff + 静默关闭标签」就不再需要，养着一个双组件的套件（pi 侧扩展 + VSCode 侧扩展）反而是维护负担。

**改了什么**（本仓库 1 个文件；配套动作已由 Kit 那边完成，一并记录供溯源）：

1. **`pi/agent/docs/agents-registry.md`（本仓库镜像）**：「子项目映射」表删除 `ExecutiveAssistantAgent（Kit） | diff-view` 整行——原行写明两个组件（diff-view-pie＝pi 侧扩展、diff-view-vsce＝VSCode 侧扩展）、项目位置 `~/Developer/diff-view`、2026-10-18 建立（原 diff-bridge 同日并入）、2026-10-19 开源（v0.2.0）。
2. **配套（Kit 侧已完成，本次仅核对）**：卸载两个扩展（`~/.pi/agent/extensions/diff-view.ts` 与 VSCode 扩展 `xhqing.diff-view-vsce`）；清理 `~/.pi/agent/state/ai-edit-diff` 快照目录（约 925MB）；`diff-view` 项目 README 顶部加中英双语注销说明、CHANGELOG 记「注销（2026-10-31 用户决定，功能停用）」；`xhqing` 中英名册删除该条目。

**保留**：本地项目 `~/Developer/diff-view` 与 GitHub 仓库 `xhqing/diff-view` **不删，作存档**（与 v1.8.0 那批「除名 agent 删本地副本」不同——这里是**子项目功能注销**，不是 agent 除名，且项目已有归档性质的说明提交，留着供日后再用时参考）。

**实测核对**（不只信描述）：`~/.pi/agent/extensions/` 下已无 `diff-view*`；`~/Developer/diff-view` 目录仍在、工作区干净、最新提交为 `90ba694 chore: 注销说明（功能停用，仓库保留作存档）`；`roster-sync-check.py` 两份名册均报「名册与 registry 一致」，无豁免项（说明 xhqing 名册那行确实删了、没有靠豁免压着）。

**回归风险**：无（纯登记变更）。需要说清的边界：两个新开关提供的是「**不自动提交**，你自己看 `git diff`」，**不是**「自动弹 diff 视图」——diff-view 原来那个「AI 改完自动把 diff 推到 VSCode 标签页」的能力是真的没有了，不是换个名字藏着；日后如果要那个体验，靠归档的仓库重新安装即可。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

## [1.9.0] - 2026-10-31

### 2026-10-31 add-mode / commit-mode 新增输入框斜杠命令（六个用户入口）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么加**：此前控制两个开关必须切到终端敲 `add-mode` / `commit-mode`，麻烦。用户要求直接在 pi 输入框里敲斜杠命令控制——`/manual-add`、`/auto-add`、`/manual-commit`、`/auto-commit`（外加两个查状态的 `/add-mode`、`/commit-mode`），不切终端、不经过模型。

**改了什么**（5 个文件）：

1. **`extensions/add-mode-guard.ts`**：新增 `registerCommands(pi)`，注册三个命令——`/manual-add`（暂停本项目自动 add，可带路径）、`/auto-add`（恢复）、`/add-mode`（查看状态）。
2. **`extensions/commit-mode-guard.ts`**：同样注册 `/manual-commit`、`/auto-commit`、`/commit-mode`。
3. **`patch/add-mode/README.md`**：新增「输入框斜杠命令（用户入口）」小节——三个命令表、「本项目」= 会话工作目录（脚本自动取其 git 仓库根，带路径参数时以参数为准）、改完扩展需 `/reload` 或新会话才出现在补全里。
4. **`patch/commit-mode/README.md`**：同上（commit 侧三个命令）。
5. **`CLAUDE.md`**：add-mode 与 commit-mode 两个条目各补一句「输入框斜杠命令是用户入口，AI 不调用（工具列表里没有），AI 侧改开关一律走 shell 命令且只有用户明确要求时才切」。

**实现机制（两个关键选择）**：

- **真扩展命令，不走模型**：用 `pi.registerCommand` 注册（不是 prompt 模板），敲下去直接执行、不消耗 token；结果用 `ctx.ui.notify` 显示。
- **不依赖 PATH**：handler 用**绝对路径 + `python3`** 调用同模块的 `patch/*-mode` 脚本，不用 `~/.local/bin` 里那份——即使没跑 `install.sh`、或 PATH 里没有，斜杠命令也能工作；默认路径取会话 cwd。

**用户入口边界（用户特别强调的一点）**：斜杠命令**只给用户用**——AI 的工具列表里根本没有斜杠命令这种东西，所以结构上就不可能「AI 自己敲 `/manual-add` 把开关关了」。AI 侧改开关仍走 shell 命令，且规则要求只有用户明确要求时才切。这一点在 CLAUDE.md 与两个 README 里都显式写明。

**兼容性**：纯新增入口。`add-mode` / `commit-mode` 的 shell 命令、状态文件、守卫拦截逻辑全部未动；装了旧版的用户不敲斜杠命令就无任何变化；扩展更新后需 `/reload` 或新会话才会出现新命令。

**验证**：5 个文件与全局逐字节一致；本机 `~/.local/bin` 两个命令仍为 v1.8.0 对应版本，`add-mode list` / `commit-mode list` 均报「全部自动」（状态未因本次同步被改动）；斜杠命令本身已由 Kit 在真实 TUI 会话（含 `pi -p` 四条命令）中实测可用，本次同步仅做逐字节搬运与静态核对。

**回归风险**：低。① **AI 无法调用**——斜杠命令不在工具列表里，开关仍只能由用户（或用户在会话里明确要求后由 AI 走 shell）改；② **原有守卫逻辑未变**——只新增注册函数与两个命令定义，拦截与提示代码未改；③ **无命名冲突**——`manual-add` / `auto-add` / `add-mode` / `manual-commit` / `auto-commit` / `commit-mode` 六个名字与现有命令无重叠；④ 不碰状态文件格式，v1.8.0 已登记的项目继续生效。

## [1.8.0] - 2026-10-31

### 2026-10-31 add-mode 与 commit-mode 完全解耦：拆成两个独立模块

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：v1.7.0 把 commit-mode 拆成了两个开关，但仍是**同一份代码**（一个脚本 + 一个扩展管两件事）。用户要求进一步——**两个功能完全独立、不在同一份代码文件里**，各自演进时互不影响：各自有命令、状态文件、守卫扩展，互不引用对方代码。

**改了什么**（13 个文件：新增 5 个 / 改写 3 个 / 联动 2 个 / 文档 3 个）：

**add 一侧（全新独立模块）**

1. **新增 `patch/add-mode/add-mode`**：独立命令 `manual|auto|toggle|status|list`，只管自动 add（看 `git diff`，工作区 vs 暂存区）。
2. **新增 `patch/add-mode/install.sh`**：复制到 `~/.local/bin/add-mode`。
3. **新增 `patch/add-mode/README.md`**：用途、用法、状态文件、已知边界。
4. **新增 `extensions/add-mode-guard.ts`**：读 `state/add-mode.json`，注入「自动 add 已关闭」提示 + 用户无意图时硬拦 `git add`。

**commit 一侧（收窄为只管 commit）**

5. **改写 `patch/commit-mode/commit-mode`**：去掉 add 相关逻辑与对象参数，只管自动 commit；收到旧语法 `manual add` / `manual all` 时给**迁移提示**（指向 `add-mode`），不再执行。
6. **`patch/commit-mode/install.sh`**：头部注释精简一行（去掉了「与 macmini-tmux 的做法一致」的括号说明）——原本以为没变，实际同步时发现这处改动，按全局版本对齐。
7. **改写 `patch/commit-mode/README.md`**：只管 commit（看 `git diff --cached`，暂存区 vs HEAD）、与 add-mode 完全独立的说明、已知边界。
8. **改写 `extensions/commit-mode-guard.ts`**：只拦 `git commit`，提示里写明「即使 add 流程预检干净也不自动衔接 commit」。

**联动方（读两个独立状态文件）**

9. **`extensions/redundant-ask-guard.ts`**：改为分别读 `add-mode.json` / `commit-mode.json`，授权清单按**四种组合**（都自动 / 只 add 手动 / 只 commit 手动 / 都手动）动态生成；文件头注释同步更新。
10. **`extensions/settle-repo-check.ts`**：合并读两个状态文件，任一暂停即跳过收尾催提交。

**文档**

11. **`CLAUDE.md`**（三处）：①「Git 写操作必须先征得同意」节原来的一条**拆成三条**——`自动 add 开关：add-mode` / `自动 commit 开关：commit-mode` / 「两个开关完全独立，是两个功能」（不同命令、不同状态文件、不同扩展文件，互不引用）；②「输出风格」清单第 ② 条例外改为「被 add-mode / commit-mode 暂停的项目例外」；③「会话收尾检查」改为「被 add-mode 或 commit-mode 暂停的仓库（任一暂停即跳过）」。
12. **`skills/add/SKILL.md`**：description 与「授权边界」第 1 条子项改为分别引用两个命令（add 被暂停则不发本 skill；commit 被暂停则 add 照常但不衔接 commit）。
13. **`CHANGELOG.md`**：本条记录。

**状态文件**：`state/add-mode.json` 与 `state/commit-mode.json`，结构都是 `{"manual": [...], "updated": ...}`；两者都在 macmini 镜像排除的 `state/` 里，不进仓库。

**兼容性（三件，写清边界）**：

- **旧命令**：`commit-mode manual add` / `manual all`（v1.7.0 语法）现在只打印迁移提示、**不执行也不改状态**（实测：退出码 0、两个状态文件均未被写入），提示内容指向 `add-mode manual` 与「两个都要暂停就各执行一次」。
- **旧状态结构不再读取**：两个新脚本只读各自文件里的 `manual` 字段，**不会**从 v1.7.0 的 `manualAdd` / `manualCommit` 自动搬数据——这是有意的取舍（两个功能解耦、各管各的状态）。当前两个状态文件本来就是空的（v1.7.0 期间没有项目被登记），所以实际无损失；若日后有用户的旧登记要追，需用 `add-mode manual` / `commit-mode manual` 重新登记。
- **v1.7.0 的公开版本历史不回改**：`CHANGELOG.md` 的 `## [1.7.0]` 节与已发的 Release 保持原样，本次变更只写在新条目 / 新版本里。

**验证**：13 个文件与全局逐字节一致（`diff -rq` 逐目录 + `diff -q` 逐文件核过）；两个脚本过 `py_compile`、两个 `install.sh` 过 `bash -n`；`~/.local/bin/add-mode`（7323 字节）与 `commit-mode`（8052 字节）均为新版且与仓库脚本内容一致；旧语法迁移提示实测正确且不改状态；`add-mode status` / `commit-mode status` 在本仓库均显示开启（默认全自动）。

**回归风险**：低。① **默认行为不变**——两个开关初始都是开启，未登记项目的会话行为与此前一致；② **两个扩展互不干扰**——各自读自己的状态文件、各自只拦自己那一步（全局实测中两扩展同时挂载、系统提示只注入各自那一段）；③ **安全阀不变**——用户明确要求提交时，走的仍是 skill 完整流程（gitleaks + 语义预检、敏感扫描、cache 检测、人工过目、发版异常暂停全在）；④ 唯一的真实代价是上面写的「旧状态结构不自动迁移」，已在条目里明写，避免后人误以为有迁移逻辑。

## [1.7.0] - 2026-10-31

### 2026-10-31 commit-mode 拆成两个独立开关：自动 add 与自动 commit 分别暂停

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：v1.6.0 的人工提交模式是**单一开关**（`add` 与 `commit` 一起暂停）。用户随即指出这是两种不同需求，必须分开控：① 只想看**工作区 vs 暂存区**的改动 → 关掉自动 add（`git diff`）；② 想先审核已经暂存的改动、看**暂存区 vs HEAD**（`git diff --cached`）→ 关掉自动 commit、add 继续自动。单一开关把两者绑在一起，第二种需求做不到「只停提交、不停 add」。

**改了什么**（7 个文件）：

1. **`patch/commit-mode/commit-mode`（重写）**：命令改为「动作 + 对象」——`manual add|commit|all [路径]`、`auto add|commit|all [路径]`、`toggle add|commit|all [路径]`、`status`、`list`；**省略对象默认 `all`**（所以 `commit-mode manual` 与 v1.6.0 语法等价、向后兼容）。状态文件结构改为 `{"manualAdd": [...], "manualCommit": [...], "updated": ...}`，**兼容旧版单一 `manual` 字段**（读时视为两个都手动，下次保存自动转新结构）。`status` 同时显示两个开关，`list` 按两个开关分组。
2. **`patch/commit-mode/README.md`（重写）**：两种暂停分别对应哪种 diff 视图、命令表、状态文件位置与结构、谁在读它（三个扩展）、已知边界。
3. **`extensions/commit-mode-guard.ts`（重写）**：两个开关**分别生效**——自动 add 关闭时拦 `git add`、自动 commit 关闭时拦 `git commit`；系统提示按**四种组合**（都手动 / 只 add 手动 / 只 commit 手动 / 都自动）分别生成，其中「只关 commit」时特别写清「add 仍自动，但预检干净后不要自动衔接 commit」；用户意图拆成 `userWantsCommit`（提交 / commit / 发版 / bump / release）与 `userWantsAdd`（含上述外加 `/add` / 预检 / 暂存），所以只关 commit 时用户敲 `/add` 能照常 add、但 commit 仍被拦。
4. **`extensions/redundant-ask-guard.ts`（修改）**：授权清单 brief 按两个开关的**三种非默认组合**分别改写（都暂停 / 只 add 暂停 / 只 commit 暂停），避免与硬拦截自相矛盾。
5. **`extensions/settle-repo-check.ts`（修改）**：同时读 `manualAdd` 与 `manualCommit`（兼容旧 `manual`），**任一手动即跳过**该仓库的收尾催提交；提示文案改为「被 commit-mode 暂停的仓库」。
6. **`CLAUDE.md`（修改，三处）**：①「Git 写操作必须先征得同意」节那条规则改写为「自动 add / 自动 commit 两个独立开关」——两种用法对应的两种 diff、完整命令示例、被暂停那一侧的共同行为（不自行执行 / 只在用户明确要求时执行 / 收尾巡检跳过 / 不急着提交以免清掉 diff）、边界（AI 不得自行切模式）与工具强制清单；②「输出风格」已授权清单第 ② 条例外改为「自动 add / 自动 commit 被 commit-mode 暂停的项目例外」；③「会话收尾检查」改为「add 或 commit 任一暂停即不适用本条」。
7. **`skills/add/SKILL.md`（修改）**：description 与「授权边界」第 1 条子项改为区分两个开关——自动 add 被关的项目不发起本 skill；**只关自动 commit 的项目 add 照常、但预检完全干净后不自动衔接 commit**（第 7 步衔接暂停）。

**兼容性**：旧状态文件 `{"manual": [...]}` 照常可读（读时视为 add 与 commit 都手动），下次保存自动写成 `manualAdd` / `manualCommit` 新结构；`commit-mode manual`（不带对象）仍等价于 `manual all`——旧习惯不受影响。

**验证**：8 个文件与全局逐字节一致（`diff -q` 逐文件核过）；`commit-mode` 过 `py_compile`；`~/.local/bin/commit-mode` 与本仓库脚本内容一致；当前状态 `manualAdd` / `manualCommit` 均为空，`commit-mode status` 显示「add：自动 / commit：自动」。

**回归风险**：无。① **默认行为不变**——两个开关初始均为自动，不登记任何项目时行为与 v1.6.0 之前完全一致；② **不会出现「半自动」误提交**——只关 add 时没有暂存内容，commit 也就无从发生；只关 commit 时 add 可执行，但预检干净后不自动衔接 commit（规则与守卫都写了）；③ **安全阀不变**——无论哪种模式，用户明确要求提交时走的仍是 skill 完整流程（gitleaks + 语义预检、敏感扫描、cache 检测、人工过目、发版异常暂停全在）；④ 守卫仍按命令文本判断（下限防线），这一性质未变。

## [1.6.0] - 2026-10-31

### 2026-10-31 新增「手动提交模式」开关（commit-mode）：按项目暂停自动 add / commit

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户反馈 add / commit 的自动触发太积极——有时候只想先看看工作区相对暂存区的改动（diff 视图逐行过一遍），结果改动被自动提交了。需要一个能**按项目精确控制**「自动提交 / 手动提交」的开关：默认仍是自动（常设授权不变），个别项目想自己把关时手动打开。

**改了什么**（8 个文件，新增 4 个 + 修改 4 个）：

1. **新增 `extensions/commit-mode-guard.ts`**（手动提交模式守卫，三层作用）：① `before_agent_start` 每轮把「本项目手动提交模式，不要自行发起 add / commit」注入系统提示（预防）；② `tool_call` 在用户当轮**没有明确**提交要求时硬拦 `git add` / `git commit`（下限防线）；③ 与 `redundant-ask-guard.ts` / `settle-repo-check.ts` 联动。判定细节：解析 `git -C <路径>` 与 `cd <路径>` 以覆盖跨目录操作子项目仓库；**intercom 消息触发的轮次不算用户输入**（避免把上一轮的用户输入借用成授权）；状态按 mtime 缓存。
2. **新增 `patch/commit-mode/commit-mode`**（Python 脚本，无扩展名）、**`install.sh`**（复制到 `~/.local/bin/commit-mode`）、**`README.md`**（用法与设计说明）：命令有 `manual [路径]` / `auto [路径]` / `toggle` / `status` / `list`；**粒度是目录**——登记的目录及其所有子目录（含子项目仓库）都生效；省略路径时默认当前 git 仓库根。
3. **修改 `extensions/redundant-ask-guard.ts`**：授权清单 brief 改为**按模式动态生成**——手动模式下把「工作区 / 暂存区有待提交内容 → 直接按 /add 或 /commit 流程处理」换成「不要自行提交」。不改会与 commit-mode-guard 自相矛盾：一个注入「直接提交」、一个硬拦，AI 走进死路。
4. **修改 `extensions/settle-repo-check.ts`**：收尾巡检把手动模式仓库从 dirty 列表里过滤掉（全部被过滤时静默），不催提交。
5. **修改 `CLAUDE.md`**（三处）：①「输出风格 · 已授权事项不问第二遍」清单第 ② 条加「手动提交模式的项目例外」；②「Git 写操作必须先征得同意」节新增条目「手动提交模式开关：按项目暂停自动 add / commit（2026-10-31 用户立，工具强制）」——写清命令、目录粒度、手动模式下的四条行为（不自行发起 / 只在用户明确要求时执行 / 收尾巡检跳过 / 不急着提交以免清掉 diff）、边界（AI 不得自行切模式）与工具强制清单；③「会话收尾检查」的「处理方式」补一句「手动提交模式下的仓库不适用本条」。
6. **修改 `skills/add/SKILL.md`**：description 里「有待提交内容自动发起」补「手动提交模式（commit-mode）的项目除外」；「授权边界」第 1 条补一条子项说明手动模式不适用自动发起。

**不进镜像**：`state/commit-mode.json` 是运行时状态（`state/` 本就在两台机器的同步排除项里，两机各管各的）。

**验证**：五个扩展 / 脚本 / 文档与全局逐字节一致（`diff -q` 逐文件核过）；`commit-mode` 过 `py_compile`、`install.sh` 过 `bash -n`；开关已安装到 `~/.local/bin/commit-mode`；当前状态文件 `manual` 列表为空（即默认全部项目自动提交，不影响本仓库自己的提交流程）。

**回归风险**：低。① **默认行为不变**——手动模式初始为空，不登记任何项目的会话行为与此前完全一致；② **范围受限**——只影响登记目录及其子目录，其它项目、其它 agent 仓库不受影响；③ **安全阀不变**——手动模式只是「不自动发起」，一旦用户明确要求提交，走的仍是 skill 完整流程（gitleaks + 语义预检、敏感扫描、cache 检测、人工过目、发版异常暂停全在）；④ 拦截只在「用户当轮无提交意图」时生效，用户自己敲 `/commit` / `/add` 照常放行；⑤ 守卫按命令文本判断，用脚本包一层仍可绕过——它只是下限防线，真正的判断靠规则文本（扩展头注释里已如实写明局限）。

### 2026-10-31 除名 agent 不在本地留副本：改写两条退役备注 + 新增通则

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 指示「除名的智能体项目本身不需要存在于本地了，也不需要在本地备份，只要 gh 上面是最新版的就可以了」。上一批刚把 Alfred 与 Tinker 除名，那两条备注写的是「本地目录与 GitHub 仓库保留为存档」——与用户新口径相反，不改就会误导以后的会话去本地找已经不存在的东西。

**改了什么**（1 个文件，`pi/agent/docs/agents-registry.md` 三处）：

1. **Alfred 条**：结尾改为「本地目录已按用户 2026-10-31 要求删除（`~/Developer/DeviceStewardAgent` 不再存在），GitHub 仓库 `xhqing/DeviceStewardAgent` 保留最新版为唯一源；原有子项目 ResourceMonitor 早已退役」——即把「本地存档」换成「GitHub 为唯一源」。
2. **Tinker 条**：同上口径（`~/Developer/PatchClaudeAgent` 已删除，`xhqing/PatchClaudeAgent` 为唯一源）。
3. **新增通则**：「除名 agent 的本地副本处理口径（2026-10-31 用户立）」——除名 agent 的项目**本地目录一律删除、不在本地备份**，只要 GitHub 仓库是最新版即可；并写明删除的前置条件（先确认工作区干净、与 `origin/main` 同步，避免丢本地改动）与查阅方式（从 GitHub 取）。

**实测核对**（不只信文字描述）：`~/Developer/DeviceStewardAgent` / `~/Developer/PatchClaudeAgent` 两个目录均确认已不存在；`xhqing/DeviceStewardAgent`（最后推送 2026-10-17）与 `xhqing/PatchClaudeAgent`（2026-10-17）两个仓库仍在 GitHub 上。

**回归风险**：无。① 两条备注只是把「保留为存档」换成「已删除、GitHub 为唯一源」，职责、除名原因、子项目退役等历史信息一字未删；② 新通则只管「除名 agent」，不影响仍在用的 Agent 项目及其本地目录；③ 删除了「本地还有存档」的错误预期，反而避免了后续会话白跑一趟。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 第二批除名：Tinker（PatchClaudeAgent）从注册表移除

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 要求「Tinker 这个 Agent 也除名，不需要了」——紧接在同一天除名电脑管家 Alfred 之后，团队侧身的第二个人。

**改了什么**（2 个文件）：

1. `pi/agent/docs/agents-registry.md`：智能体命名注册表删除 `Tinker / PatchClaudeAgent / 补丁维护匠` 整行（现 18 行）；「销售流水线与三小组」的基础设施小组描述删掉「Tinker 给 CC 打补丁；」一句；「已注销 / 已退役的 Agent」下新增「**已除名的 Agent（2026-10-31 用户决定，第二批）**」——写明原职责（VSCode Claude Code 扩展升级后重新应用自定义补丁 / 自愈引擎）、**本次未指定接替者**、项目本体退役（`~/Developer/PatchClaudeAgent` 与 GitHub 仓库保留为存档）。
2. `pi/agent/CLAUDE.md`：「团队结构参考」开头的 agent 计数从 19 再改为 18，并把三次减员的日期与对象写全（2026-10-26 Hermes → 20、2026-10-31 Alfred → 19、2026-10-31 Tinker → 18）。

**验证**：`roster-sync-check.py` 两份名册均报「名册与 registry 一致」（Tinker 与 Alfred 两行已由 Kit 同批从 `xhqing` 中英 README 中删除）；注册表行数 = 18，与 `CLAUDE.md` 新计数一致。

**回归风险**：无。① PatchClaudeAgent 目前无子项目挂在映射表里（删行不影响子项目映射表）；② 退役备注保留了原有职责描述与仓库位置，日后要找回能力时有据可查；③ 本次未指定接替者，所以没有像 Alfred 那样往具体 Agent 行里写接管说明——这一点在退役条目里写明了，避免后人误以为漏写。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 除名电脑管家 Alfred（职责并入 Kit），名册宿主机口径改为 `macmini&macbook`

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 两条指示——① 电脑管家（Alfred / DeviceStewardAgent）从名册除名，原话「可以从名册中除名了，以后他的工作由 Kit 处理」；② `xhqing` 名册的宿主机字段改为 `macmini&macbook`（2026-10-28 两机全量双向镜像后，字面「单宿主机」已不符合现实）。同批还按用户「先把 NewsScoreStudy 从名册移除」的指示，把它从子项目映射表里彻底去掉（上一批只加了「不列入公开名册」标注，这一批改为整行移除 + 移入「已移出名册的子项目」）。

**改了什么**（2 个文件）：

1. `pi/agent/docs/agents-registry.md`：
   - **智能体命名注册表**：删除 `Alfred / DeviceStewardAgent / 电脑管家` 整行（19 行）；**Kit 行**末尾追加接管说明（2026-10-31 起接管本地电脑 / 远程服务器 / 云电脑的资源监控与管理建议（进程 / 内存 / 存储治理））。
   - **销售流水线与三小组**：删掉基础设施小组里「Alfred 负责……低负载的流畅工作状态」一句。
   - **退役备注**：新增「**已除名的 Agent（2026-10-31 用户决定）**」——Alfred 职责已并入 Kit，项目本体退役（项目目录与 GitHub 仓库保留为存档，原子项目 ResourceMonitor 早已退役）；同时把原有的 Hermes 条目改成「已注销 / 已退役的 Agent」+ 条目内注日期（两个日期不同的退役事件不再挤在一个标题下）。
   - **新增「已移出名册的子项目（2026-10-31 用户决定）」**：NewsScoreStudy——仓库本体与私有远程保留，只是从名册与子项目映射表里同时移除（两表必须内容一致），并写明要恢复时两处同时加回。
   - **子项目映射表**：删除 `QuantStrategistAgent（Mark） | NewsScoreStudy` 与 `DayTradingAgent（Victor） | NewsScoreStudy`（后者为移交痕迹行）两行。
   - **宿主机归属段修订**：字面的「每个 Agent 只允许存在于一个宿主机」改为「**活跃写操作只在一台机器上做**」（避免同一 git 仓库两边同时写导致 `.git` 冲突），并注明 `xhqing` 名册 Host machine 列自 2026-10-31 起统一写 `macmini&macbook`；历史沿革（默认本机、Mark 迁机 / 迁回）保留不动。
   - **「名册同步」节例外条款**：改为「**目前没有例外**」，写明 NewsScoreStudy 已从两张表同时移除、不再需要 allowlist 豁免。
2. `pi/agent/patch/roster-sync/allowlist.json`：`missing_in_readme` 清空（NewsScoreStudy 已不在 registry 里，豁免自然失效）。

**顺带修正一处口径滞后**（`pi/agent/CLAUDE.md`）：「团队结构参考」开头原写「团队共有 21 个 agent」，已跟不上实际——2026-10-26 注销 Hermes 减到 20，本次除名 Alfred 减到 19。改为「团队共有 19 个 agent」并注明两次减员的日期与依据（与注册表行数对齐），免得后人按旧数字判断。

**验证**：`roster-sync-check.py` 两份名册（`README.md` / `README_cn.md`）均报「名册与 registry 一致」，无豁免项；注册表行数 = 19，与 `CLAUDE.md` 新计数一致。

**回归风险**：无。① Alfred 只在注册表 / 小组描述里出现，职责文本完整移入 Kit 行与退役备注，不丢信息；② 退役备注与历史条目全部保留（Hermes、Alfred、NewsScoreStudy 三条各自成条，可追溯）；③ 「单宿主机」从硬性规定改为「活跃写操作唯一」是对现实的追认，不移除任何现有约束（macmini 断 GitHub、同一仓库只在一台机器上写等约束仍在）；④ allowlist 清空不影响检查逻辑，脚本本身未改。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 把 NewsScoreStudy 明确标为「不列入公开名册」，豁免理由改写

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 指示「NewsScoreStudy 这个项目先从名册中移除」。该仓库实际是 Mark（QuantStrategistAgent）的子项目（2026-10-26 由 Victor 移交），此前靠 roster-sync 豁免压着不写进公开名册，但豁免理由写的是「描述语待确认」——跟现在的情况不符：不是「等描述语」暂缓，而是用户主动要求先不列。**上一条记录里「NewsScoreStudy 继续按 2026-10-26 指示暂缓」的说法已被本条取代**（暂缓的依据换成了用户 2026-10-31 的新指示）。

**改了什么**（2 个文件）：

1. `pi/agent/docs/agents-registry.md`：
   - NewsScoreStudy 行（属 `QuantStrategistAgent（Mark）`）开头加标注：**不列入公开名册**（用户 2026-10-31 要求先从名册移除，豁免见 roster-sync allowlist）——描述本体一律保留，只把「按用户要求不公开」这件事写在行首，翻表的人一眼就能看到、不会以为漏写。
   - 「名册同步」节的例外条款同步改写：由「用户 2026-10-26 明确说描述语待确认，暂缓写入」改为「用户 2026-10-31 明确要求先从名册移除——它属 Mark 的子项目，公开名册暂不列出；用户发话后再加回并删豁免」。
2. `pi/agent/patch/roster-sync/allowlist.json`：`NewsScoreStudy` 的豁免理由改写为「用户 2026-10-31 明确要求『先从名册中移除』：该仓库是 Mark（QuantStrategistAgent）的子项目，公开名册暂不列出；用户发话后再加回（原 2026-10-26 的『描述语待确认』口径已被本条取代）」；`repo` 与 `since`（2026-10-26，豁免首次登记的日期）保持不动。

**公开名册无需改动**：`xhqing` 仓库的两份 README 里这个仓库本来就是 0 处（一直被豁免），所以本轮不涉及那个仓库的修改与提交。

**验证**：`roster-sync-check.py` 跑过，两份名册均报「名册与 registry 一致」，只剩 `NewsScoreStudy` 一条豁免、理由已是新口径。

**回归风险**：无。① 只在 registry 行首加了不公开标注、描述内容未删，后续用户发话加回时不需要重建内容；② 豁免机制、allowlist 结构与 `since` 时间线保持不变，只换了理由文本（作者可追溯性不丢）。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 名册改为「实时同步 registry、不再逐次询问」，撤销 dotfiles 豁免

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-31 明确改了口径——原话「xhqing 公开名册必须实时同步全局注册表，这个不用问，下次自动同步」。据此作废旧的两条规矩：① 描述语要先问用户；② 私有仓库默认放空不写。**上一条记录（同日更早）里「等用户确认后再补公开名册」的做法已被本条取代**。

**改了什么**（2 个文件）：

1. `pi/agent/docs/agents-registry.md` 的「名册同步」节改写（由 Kit 改，本次同步进镜像）：
   - 删除旧的两条：「描述语要先问用户」「私有仓库默认放空不写（含理由说明与存量私有仓库的过渡口径）」。
   - 新增「名册实时同步、不再逐次询问（2026-10-31 用户立，修订）」：名册就是 registry 两张表的公开镜像，registry 改了什么、名册就同批改成什么，**不问用户、不等确认**；描述语由 Kit 按仓库实际情况直接写——一句话说清「它是什么 / 解决什么问题」，不夸大、不写无关内容、不泄个人信息与凭证；**私有仓库也照常列名册**。
   - 保留例外通道：用户对某个具体仓库有专项指示的从其指示，目前只有 `NewsScoreStudy`（用户 2026-10-26 明确说描述语待确认，暂缓，留在 allowlist 豁免里，用户发话后补齐并删豁免）。
   - 附修订说明（写明本条取代哪两条旧规矩 + 用户原话 + 修订日期），避免后人对着一份不知何时改口、为何改口的规则误判。

2. `pi/agent/patch/roster-sync/allowlist.json`：删除 `dotfiles` 的 `missing_in_readme` 豁免（该仓库已写进公开名册），现只剩 `NewsScoreStudy` 一条。

3. 同批顺手修正 `pi/agent/docs/agents-registry.md` 里 dotfiles 行的现状描述：原写「本机私有、未建远程」，现改为「私有仓库，远程 `github.com/xhqing/dotfiles`」——该仓库 2026-10-31 已建私有远程并推送完毕，旧描述已失真。

**验证**：`roster-sync-check.py` 跑过，两份名册（`README.md` / `README_cn.md`）均报「名册与 registry 一致」，只剩 `NewsScoreStudy` 一条豁免（正常）。

**回归风险**：无。① 豁免机制与 allowlist 本身保留未动，只是少了一条已失效的条目；② 例外的判定强度没降——专项指示仍然优先于「实时同步」通用规则，`NewsScoreStudy` 继续按用户 2026-10-26 的指示暂缓；③ 描述语的约束（不夸大、不泄个人信息与凭证）写进了规则正文，与全局 CLAUDE.md「敏感信息禁止写入未被 .gitignore 忽略的文件」互相印证。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-31 登记 Kit 的新子项目 dotfiles，并给 roster-sync 加一条豁免

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：Kit（ExecutiveAssistantAgent）在 2026-10-31 建了一个按 App 分类的个人配置文件仓库 `~/Developer/dotfiles`（本机 git、未建远程），需要登记为它的子项目；同时因为该仓库是私有配置仓库、公开名册上的描述语还没经用户确认，按 2026-10-26 立的「公开描述语先问用户」规矩，先在 roster-sync 的豁免清单里挂一条，让名册一致性检查不至于天天报这一条。

**改了什么**（2 个文件）：

1. `pi/agent/docs/agents-registry.md` 的子项目映射表新增一行 `ExecutiveAssistantAgent（Kit） | dotfiles`——说明栏写明用途（配置文件在仓库里只存一份、安装时软链到系统位置、新机器 clone + `./install.sh` 一键恢复）、现状（2026-10-31 建立，本机私有、未建远程）、以及一处容易被踩的共用关系（目前收录 ghostty / cmux 两个 App，`ghostty/config` 被两者共用，因为 cmux 基于 libghostty 读同一份配置，共用关系在仓库根 README 与各 App 目录 README 里注明）。
2. `pi/agent/patch/roster-sync/allowlist.json` 的 `missing_in_readme` 数组新增 `dotfiles` 条目——理由为「私有配置文件仓库（本机 git、暂未建远程），公开名册上的描述语待用户确认」，`since` 记 2026-10-31。

**未登记到公开名册**（*已被同日更晚的条目取代，见上：名册已改为实时同步*）：本仓库 README 的团队名册这次没有动，等用户确认 dotfiles 的公开描述语后再补；确认前靠上述豁免条目让检查通过。

**回归风险**：无。① 注册表只是加一行，不改动任何既有 Agent 行的职责与分组；② 豁免清单是「登记在案、写清理由和日期」的有意豁免，不放松检查逻辑本身——一旦 README 补上 dotfiles，这一条会变成多余项、由检查报出来再删掉。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

## [1.5.65] - 2026-10-29

### 2026-10-29 澄清：`pi-` 前缀是实现判据、不是用户原话，并补上源头命名规范

**为什么改**：用户 2026-10-29 质疑「守卫不允许我关非 `pi-` 前缀的会话？我没有规定这个啊」。核实后确认：用户 2026-10-04 的本意是「**别动我在终端里开着的会话**」，而「只允许杀 `pi-` 前缀的会话」是当时为了让规则能写成代码判据而加的**工具层概括、不是用户原话**。这个概括的口子在实际干活时露了出来——开发 `macmini-tmux` 的 et 封装时，agent 建了一个无前缀的测试会话 `mmt-et4`，结果它被当成「用户的会话」保护起来、自己反而清不掉。

**改了什么**（1 个文件，全局 ↔ 镜像逐字节一致）：`CLAUDE.md`「会话间协作」节「用户终端里的会话（前台）一律不许用命令关闭」条下新增两个子条目：

1. **说明（用户澄清）**：「只允许杀 `pi-` 前缀的会话」是实现判据，不是用户原话；用户的本意是「别动我在终端里开着的会话」。
2. **配套源头规范（2026-10-29 立）**：既然判据靠前缀，**agent 自己创建的 tmux 会话一律用 `pi-` 前缀命名**（如 `pi-build`、`pi-test-et`）——这样「`pi-` 前缀 = agent 建的、其它 = 用户建的」才成立：agent 能清理自己建的东西，又不会误伤用户；反过来，agent 忘了加前缀就会被当成「用户的」保护起来、自己也清不掉（`mmt-et4` 就是实例）。

**守卫实现未改**：`extensions/session-guard.ts` 逻辑保持原样（保护非 `pi-` 会话），本次只是把「agent 必须用 `pi-` 前缀」这条源头规范补进规则，让判据自洽。

### 2026-10-29 修复：redundant-ask-guard 的「镜像同步」关键词补变体（1.5.64 记录的已知缺口已闭合）

**为什么改**：`## [1.5.64]` 的 redundant-ask-guard 条目里记录了一个实测缺口——`AUTHORIZED_HINTS` 只写了「镜像同步」，用户若说「要我直接同步到镜像吗」只命中询问句式、匹配不到类别，不触发回执。本次按最小改动把变体补上。

**改了什么**（1 个文件，全局 ↔ 镜像逐字节一致）：`extensions/redundant-ask-guard.ts` 第一条 hint 的正则 `镜像同步|CapabilityManagerAgent|Prometheus` → `镜像同步|同步(到|回)?镜像|CapabilityManagerAgent|Prometheus`，覆盖「同步到镜像 / 同步回镜像」等说法；其余判定逻辑不动。

**验证**：4 个用例通过——「要我直接同步到镜像吗」「需要我把这版同步回镜像吗？」「要我现在做镜像同步吗」均命中「镜像同步」类别，`/commit` 类询问仍命中对应类别。

## [1.5.64] - 2026-10-29

### 2026-10-29 新增：redundant-ask-guard（已授权事项不问第二遍，工具强制）

**为什么改**：用户 2026-10-29 立规「已经授权过的事不要再问用户，直接做。这个能不能工具强制掉，不要总是给多余的询问」。起因：全局 CLAUDE.md 早已写明「镜像同步由 Prometheus 负责、发现分叉自动同步对齐、无需询问」，AI 收尾时仍问了一句「要我现在做吗」。用户随后又补了第二条口径：「不要让我看警告，这种事情定了规矩我就不想插手了，警告应该让当前会话看见，比如这次是你改的全局文件警告就通知你提醒你要 call Prometheus 同步，不是通知我！」——所以最终实现**不向用户弹任何提示**，命中时只把回执注入 AI 自己的上下文。

**改了什么**（2 个文件，全局 ↔ 镜像逐字节一致；同批的 `session-guard.ts` 已在上一提交同步、另有专门条目记录）：

1. 新增 `extensions/redundant-ask-guard.ts`：
   - `before_agent_start` 把「已授权事项清单」（`AUTHORIZED_BRIEF`，5 条：镜像同步 → agent_call Prometheus；工作区有待提交 → 直接 /add 或 /commit；其它 agent 项目仓库有待提交 → agent_call 对方；/add 预检干净自动衔接 commit、commit 自动 bump / 发版；新建项目 git init、向注册表追加新 agent 行）追加进 systemPrompt，每轮预防（内容固定、缓存友好、约 200 字，已追加过则跳过）。
   - `message_end` 检查 assistant 回复：命中「询问句式 `ASK_RE`」+「已授权关键词 `AUTHORIZED_HINTS`」时，不通知用户，只把回执暂存到模块变量 `pendingReminder`；下一次 `before_agent_start` 以 `message: { customType: "ask-guard", content: pendingReminder, display: false }` 注入——`display: false` 表示只进 AI 上下文、TUI 不显示（依据 `docs/session-format.md`：`display: true` = show in TUI、`false` = hidden）。
   - 回执含两部分：上一轮对已授权事项问了什么（原句片段）+ 这件事的正确做法（按命中类别给出）。句式补充了「要我直接…」「要我（现在|先）？（把|做|去|来|帮|直接|再）」，「注册表」关键词放宽（原只匹配「注册表追加」，实测「注册表补上」漏判）。仍应询问的边界保留：方案分叉大 / 返工成本高 / 规则未覆盖 / 不可逆破坏性操作。
2. `CLAUDE.md`「输出风格」节新增「已授权事项不问第二遍（2026-10-29 用户立）」：写明 5 条清单、仍应询问的边界与配套工具的两段机制（预防 + 只给 AI 看的回执，不向用户弹提示），措辞与 `AUTHORIZED_BRIEF` 保持一致。

**验证**：redundant-ask-guard 9 个用例全过（4 个应命中并给出正确做法、5 个应放过且不误伤合理询问）；本仓同步后另跑一次 `bun build` 转译校验。**本仓实测发现的已知缺口**：`AUTHORIZED_HINTS` 的关键词写的是「镜像同步」，用户若说「要我直接同步到镜像吗」这类变体，只命中询问句式、匹配不到类别 → 不触发回执；该清单设计上刻意偏窄（宁可漏、不误伤合理询问），是否放宽待用户决定。

### 2026-10-29 修复：session-guard 的 kill 拦截只看「目标参数」（口径修正 + 误报修复）

**为什么改**：用户澄清 2026-10-04 立的那条「不许用命令关闭前台 pi 会话」的口径——**只禁止杀 pi 会话进程，杀其它进程（mosh-server、node、普通服务等）是允许的**。原实现是「整条命令里同时出现 kill 类词与 pi 字样就拦」，于是 `pkill -f mosh-server` 因为同一条命令里还带着 `tmux kill-session -t pi-xxx` 的会话名而被连坐误报，把合法的清理动作一起挡住了。

**改了什么**（1 个文件，全局 ↔ 镜像逐字节一致）：

1. `extensions/session-guard.ts` 新增 `killTargets(command)`：提取每个 `kill` / `pkill` / `killall` 命令的**目标参数**部分（命令词后必须是空白或行尾，因此 `kill-session`、`pip3` 之类不会被误当成 kill 命令）。
2. 主判断由「整条命令里找 pi 字样」改为「只在 kill 的目标参数里找 pi 字样」——杀 mosh-server / node 等非 pi 进程放行，目标确实是 pi 才拦。
3. 目标为空时（如 `... | xargs kill`）退回整条命令判断，保持保守、避免漏拦。
4. 头注释补 2026-10-29 的修正说明；`tmux kill-server` / `tmux kill-session` 两条规则未改动。

**验证**：15 个用例全过——放行 `pkill -f mosh-server`、`pkill -f node`、`pkill -f api-server`、`kill -9 <非 pi pid>`；仍拦 `pkill -f "pi -n"`、`killall pi`、`kill -TERM $(pgrep -f 'pi -n')`、`| xargs kill`（目标为空的保守路径）。本仓同步后另跑一次 `bun build` 转译校验，确认语法可用。

### 2026-10-29 同步：agents-registry 新增子项目 macmini-tmux

**为什么改**：Kit 按用户要求新建子项目 `macmini-tmux`（在 Mac mini 上方便使用 tmux 的 CLI 封装：`macmini tmux` 自动递增会话名 `session#N`、`-s` 断线重连、`-a` 接回最近会话、`-l` 列表，另可透传任意命令），全局 `agents-registry.md` 的「子项目映射」表新增一行。该项目刚在本地建立、尚无 GitHub 远程仓库，公开名册的描述语待用户确认，因此同批登记进 `patch/roster-sync/allowlist.json` 豁免，避免名册校验误报「缺子项目」。

**改了什么**：

1. `docs/agents-registry.md`：「子项目映射」表新增 ExecutiveAssistantAgent（Kit）→ `macmini-tmux` 一行（用途、项目路径、2026-10-29 建立）。
2. `patch/roster-sync/allowlist.json`：先登记 `macmini-tmux` 豁免条目（理由：尚无远程仓库、公开/私有与描述语待定）；同日项目即开源到 github.com/xhqing/macmini-tmux、`xhqing` 主页中英名册已同批补上，该豁免条目已随之删除（现文件里只保留 NewsScoreStudy 一条）。同日 `agents-registry.md` 该行补记「已开源 github.com/xhqing/macmini-tmux（2026-10-29，v0.1.0）」。

### 2026-10-29 变更：子项目 copybridge 改名为 vscode-copy-anywhere（镜像同步）

**为什么改**：用户 2026-10-29 指出 `copybridge` 这个名字「时间久了我从名字看不出这个项目是做什么的」——`bridge` 是隐喻，且未交代「VSCode」「文件」两个关键信息。Kit 将子项目改名为 `vscode-copy-anywhere`（场景 + 动作 + 效果全写进名字），本仓仅需同步两处引用。

**改了什么**（2 个文件，全局 ↔ 镜像逐字节一致）：

1. `docs/agents-registry.md`：子项目映射表 Kit 行——仓库名 `copybridge` → `vscode-copy-anywhere`，描述更新为「让 VSCode 资源管理器里复制的文件能粘到任意 App 的 macOS 后台小工具」，并注记 2026-10-30 改名及原因。
2. `skills/commit/SKILL.md`：第 10 步发版门禁「语义层」的举例 `blog / copybridge` → `blog / vscode-copy-anywhere`（举例指向已改名仓库，不改就指向不存在的仓库）。

**项目侧（不在本仓记）**：目录 / GitHub 仓库 / 源码与产物名 / LaunchAgent label / 脚本 / 中英 README / logo / 徽章路径的改动与各自 CHANGELOG，见该子仓库本身；名册同步见 `xhqing` 仓库（中英 README + `update_traffic.py` 采集列表 + 流量数据文件改名）。

### 2026-10-29 变更：子项目 `.pi` 由软链接改为「真实目录 + 资源引用」（组合式超集）

**为什么改**：用户提问「子项目的 `.pi` / `AGENTS.md` 与负责它的智能体保持一致好，还是做超集好（上一版曾是超集）」，并指出最近又碰到「子项目需要独有的配置要放进 `.pi`」，想把超集改回来。核查后确认根因：`.pi` **整目录软链接**把「共享」和「独占」压在了同一个符号上——子项目往 `.pi` 写任何东西，等于直接写进 Agent 项目，瞬间影响该 Agent 全部兄弟子项目并进入 Agent 仓库的 git 历史；而 pi 的上下文文件（`AGENTS.md`）**没有 include / 导入机制**（只从全局 + 祖先目录 + 当前目录加载），超集只能靠复制、复制必然漂移。因此定为**分层**：身份层保持一致（软链接），能力层做超集但用「引用 + 追加」实现。

**改了什么**（四类文件，全局 ↔ 镜像逐字节一致）：

1. `CLAUDE.md`「团队结构参考」节「智能体专属文件」条重写为两层模型（2026-10-30 用户修订，取代 2026-10-17 的「`.pi` 也挂软链接」）：身份层 `AGENTS.md` 软链接必须一致（理由：无 include 机制、复制必漂移、会话仍是同一个 agent）；能力层 `.pi/` 是子项目自己的真实目录，`.pi/settings.json` 用路径引用 Agent 的 `extensions` / `skills` / `prompts` / `themes`，本地独有内容放 `./skills` 等，子项目专属规则用 `.pi/APPEND_SYSTEM.md` 追加（`SYSTEM.md` 是整体替换，禁用）；并写明纪律（只允许追加、不允许重述基座规则）。
2. `CLAUDE.md`「工作规则 · `.pi/` 目录只放 pi 自己要读的东西」：白名单补 `APPEND_SYSTEM.md` / `SYSTEM.md`（`docs/usage.md`「System Prompt Files」明确其语义，此前漏列）；「为什么」第 1 条按现状改写——不再只说「`.pi` 常是软链接」，改为「`.pi` 形态会变（软链时代 → 2026-10-30 起真实目录），谁都不能保证它不会被替换 / 重建」。
3. `docs/agents-registry.md`「智能体专属文件归属与子项目映射」节改为 2026-10-30 版：规则 2 拆为 2a 身份层（软链接）、2b 能力层（真实 `.pi` + settings 引用，含 JSON 模板、pi 文档依据与本机实测）；规则 3（随仓库提交）、规则 6（迁移口径）、映射表说明同步；新增「历史沿革」条——2026-08-10 超集 → 10-12 禁止 → 10-17 软链接 → 10-30 本版，并说明前两版超集的失败点在于「用拷贝实现超集」而非方向错误。
4. `docs/new-agent-scaffold.md` 子项目脚手架条改写：新建子项目 = `AGENTS.md` 软链接 + 真实 `.pi/settings.json`（含可直接复制的 JSON 模板）。
5. `extensions/pi-dir-guard.ts`：`ALLOWED` 补 `APPEND_SYSTEM.md` / `SYSTEM.md`，头注释（立规起因第 2 条）与拦截理由文案按新模型更新；`bun` 解析校验通过。

**依据与实测**（守「查证外部系统行为先找官方文档」）：`docs/settings.md`「Resources」——项目 `.pi/settings.json` 的路径相对 `.pi` 解析、支持 `~` / 绝对路径 / glob / `!` 排除，路径可为目录（递归收集）；`docs/skills.md` / `docs/extensions.md`——`.pi/{skills,extensions,prompts,themes}` 的自动发现照常生效（本地新增不必写进 settings）；`docs/usage.md`「System Prompt Files」——`APPEND_SYSTEM.md` 追加、`SYSTEM.md` 替换。源码复核（`dist/core/package-manager.js`）：settings 的普通条目只做「显式加载」、不构成自动发现的白名单，重复路径按 canonical path 去重。实测：`xhqing` 子项目改造后跑 `pi --approve -p`，技能（termux-ssh / language-partner）与项目级扩展（input-llm-dump，落盘到子项目 `tmp/`）均从 Kit 的 Agent 项目加载成功。

**落地范围**：Kit 名下 5 个子项目（xhqing / copybridge / diff-view / ark-key-pool / macmini-tmux）本批已改造并随各自仓库提交；其余 15 个子项目分属 Atlas / Mark / Anvil / Victor / Gatsby / NeuralCore，已由 Kit 逐个委派给负责 Agent 按本文档自行改造提交。

## [1.5.63] - 2026-10-28

### 2026-10-28 镜像校验修正 + 每日全量校验（verify.py 按 .stignore 实际规则、重扫 600 秒）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：v1.5.62 的镜像工具落地后暴露两处不足——① `verify.py` 用写死的跳过规则，比两边 `.stignore` 的实际规则更宽（`pi-agent` 侧无条件跳过 `*.log`、`developer` 侧无条件跳过 `*.lock`），像 `*.log`、`Cargo.lock` 这类排除规则不一致的文件会被误当成「已排除」而不参与比对，校验会给出虚假的「一致」结论；② 文件监听在「删除与写入竞争」时会漏掉最终状态，形成 Syncthing 自认为一致、磁盘上却多出一份的孤儿文件。

**改了什么**：

1. **`verify.py` 按两边 `.stignore` 的实际规则校验**：每个共享目录各自带 `skip_exact` / `skip_prefix` / `skip_suffix` / `skip_rel`（`developer` 侧只在 `.git` 内跳过 `*.lock`），不再共用一刀切的黑名单；并支持指向目录的符号链接（记录链接目标、不跟进去）。
2. **重扫间隔 3600 → 600 秒**（`setup.py`）：缩短兜底周期，让孤儿文件在 10 分钟内被纠正。
3. **新增 `pi/agent/patch/macmini-mirror/verify-daily.sh`**：每天 03:00 由 launchd `com.xhq.mirror-verify` 跑一次全量 SHA-256 比对（约 25 秒），结果追加到 `~/Library/Logs/macmini-mirror-verify.log`，发现差异时发系统通知（不抢焦点）。
4. **`macmini-mirror.md`**：补「每日深度校验」段与 `verify-daily.sh` / `com.xhq.mirror-verify.plist` 文件清单，重扫间隔说明同步为 600 秒。

**回归风险**：无。① 比对规则变严格只会多查出真实差异（此前是漏报），不会误报已排除项；② 重扫间隔缩短只增加少量磁盘扫描开销（两次全量扫描各约数秒）；③ 每日校验是独立 launchd 任务，失败只发通知，不影响同步本身。

## [1.5.62] - 2026-10-28

### 2026-10-28 本机 ↔ macmini 全量双向镜像（Syncthing）+ macmini 切断 GitHub

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-28 要求「把本机注册表里的所有 Agent 项目和非 Agent 项目全部镜像到 macmini、逐字节一致，任一方改动自动同步；全局 `~/.pi/agent/` 也要逐字节一致；切断 macmini 与 GitHub 的连接，所有同步到 GitHub 的动作走本机」。目的是让 macmini 成为本机智能体团队的完整副本（热备 / 远程算力两用），同时把 GitHub 写操作收敛到本机一处。

**改了什么**：

1. **两台机器各跑 Syncthing 2.1.5**（本机 brew、macmini 独立二进制 + launchd `com.local.syncthing`），共享两个目录：`developer`（`~/Developer` ↔ macmini `~/Developer`）与 `pi-agent`（`~/.pi/agent` ↔ macmini `~/.pi/agent`），类型 `sendreceive`、fsWatcher 近实时（3 秒）、staggered 版本库保留 30 天。
2. **新增 `pi/agent/docs/macmini-mirror.md`**：拓扑、同步语义（冲突副本 / 删除可恢复）、排除项及理由、GitHub 断连与恢复方法、日常操作、已知边界（双机同时改同一文件 / 同一 git 仓库的风险）。
3. **新增 `pi/agent/patch/macmini-mirror/`**：`setup.py`（幂等配置两机 Syncthing）、`status.py`（状态检查 + 异常通知）、`verify.py`（逐字节 SHA-256 校验）、`stignore-developer` / `stignore-pi-agent`（排除项模板）。
4. **同步范围与排除**：`~/Developer` 排除 `node_modules` / `.lake` / `.venv` / `venv` / `__pycache__` / `*.pyc` / `.DS_Store` / `.git` 瞬时锁；`~/.pi/agent` 排除 `sessions` / `state` / `logs` / `tmp` / `intercom` / `npm` / `bin`（运行时与架构相关）以及记录本机绝对路径的配置（`trust.json` / `mcp-*cache` / `anysearch/runtime.conf` / `session-link` 的 config 与注册表）。排除项均确认未被任何仓库跟踪；其余能力层逐字节同步。
5. **macmini 断 GitHub**：SSH 密钥移到 `~/.ssh/disabled-github-20261028/`；`~/.ssh/config` 把 `github.com` 指向 `127.0.0.1:9`；git 全局 `insteadOf` 把 GitHub 的 https / ssh / git 协议地址改写到不存在的域名。实测 `git ls-remote`（https / scp / ssh）与 `ssh -T git@github.com` 全部失败，同步不依赖 GitHub。
6. **更新全局规则与注册表口径**：`pi/agent/CLAUDE.md`「跨机协作」新增「全量镜像」条并修正「给 macmini 的 Mark-\* 会话派活不会回流本机」的旧说法（镜像为双向，改动会回流，须避免双机同时写同一仓库）；`pi/agent/docs/agents-registry.md` 同步更新镜像说明与 Mark 段。
7. **停用旧的单向同步**：`patch/sync-to-macmini/` 移入 `patch/_retired/` 并留 `RETIRED.md`；launchd `com.xhq.pi-sync-macmini` 卸载（plist 移到 `~/Library/LaunchAgents/disabled/`）。保留旧实现只为可回溯，禁止重新启用（会与双向镜像打架）。

**回归风险**：无。① 双向镜像不改变任何既有能力文件的语义，只是把它们复制到第二台机器；② 旧单向同步已停用，不会两套机制互相 `--delete`；③ macmini 断 GitHub 只影响 macmini 上的 GitHub 读写（有意为之，可逆：恢复步骤写在 `macmini-mirror.md`），不影响本机与 GitHub 的现有流程；④ `sessions` / `state` / `npm` / `bin` 等运行时与架构相关目录明确排除，不会把 arm64 二进制推到 x64 机器上导致 pi 不可用。

## [1.5.61] - 2026-10-28

### 2026-10-28 新增「`.pi/` 目录只放 pi 自己要读的东西」规则 + 工具强制守卫 pi-dir-guard.ts

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-28 立规，起因是一起真实事故——某个 git worktree 把 git 的 `pre-push` 钩子挂在 `.pi/hooks/` 下、用 `core.hooksPath` 指过去，结果：① pi 每次启动都把 `.pi/hooks` 当成「已废弃的旧版钩子目录」，弹迁移警告并要求按任意键；② 更危险的是 `.pi` 在团队里经常是**软链接**（子项目挂 `../<Agent 项目>/.pi`），一旦恢复成软链接，`core.hooksPath` 指向的目录就不存在了，而 git 遇到不存在的 hooks 目录**不报错、不提示、直接跳过所有钩子**——「推 main 会被拦」的保护无声消失。用户原话：「定一个全局规矩，没必要放在 `.pi` 目录下面的内容禁止放在 `.pi` 目录下面」。

**改了什么**：

1. `pi/agent/CLAUDE.md`「工作规则」新增一节「`.pi/` 目录只放 pi 自己要读的东西」——判断标准一条（**pi 自己会不会去读它？**不会就禁止放）、允许清单（`settings.json` / `extensions/` / `skills/` / `prompts/` / `themes/` / `npm/` / `git/` / `sessions/`，均已按 pi 官方文档核实）、四类内容的正确去处（git 钩子 → 仓库或 worktree 的 gitdir；临时产物 → `tmp/`；项目脚本 / 配置 → 项目正式目录；只对本机生效且不入库的 → `.git` 内部）、三条理由（静默失效 > 被 pi 迁移逻辑误判 > 语义混淆易被整体重置）、全局 `~/.pi/agent/` 的同类约定（非 pi 内容放 `patch/`、`docs/`）。
2. 新增 `pi/agent/extensions/pi-dir-guard.ts`：`tool_call` 拦截三类动作——① 写 / 编辑类工具的目标路径落在 `.pi/` 下且首段不在白名单；② shell 命令里「写动作（`mv` / `cp` / `ln` / `mkdir` / `touch` / `tee` / `rsync` / `install` / `unzip` / `tar` / `chmod` / `chown` / `dd` / `truncate` / `shred` / `sed -i` / 重定向）+ `.pi/` 下非白名单条目」同时命中；③ 任何把 `core.hooksPath` 指向 `.pi` 的命令（无例外）。
3. 判定函数 `checkTargetPath()` / `checkCommand()` 单独导出，配 23 条用例实测（拦：`.pi/hooks` 各种写法、`mv` / `cp` / `mkdir` / 重定向写入、`hooksPath` 指 `.pi`；放：`.pi/extensions` 与 `.pi/settings.json` 等白名单、`ls` / `cat` / `grep` 等只读、全局 `~/.pi/agent/` 下任意路径、`pkg/.pix/` 这类同前缀目录）——全部通过。

**局限（如实记录）**：守卫按命令文本里是否出现 `.pi/` 判断，`cd .pi && mkdir hooks` 这类「先切目录、再用相对路径写」绕得过去；命令里同时出现写动词与只读的 `.pi` 路径时可能误报（如 `grep -rn mv .pi/hooks`）。它是下限防线，判断仍靠规则本身。

**回归风险**：无。① 只影响「往 `.pi/` 下写非 pi 内容」这一类动作，pi 自身资源（扩展 / skills / prompts / settings 等）与全局 `~/.pi/agent/` 完全不受影响；② 只读命令不拦，日常查看 `.pi` 不受干扰；③ 全程防御性 catch，扩展失灵时不阻塞会话；④ 不改动任何既有扩展与规则条文。

### 2026-10-27 新增「禁止 Agent 自行关闭 xpilot」规则 + 工具强制守卫 xpilot-guard.ts

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户 2026-10-27 立规。起因：AI 为「逐节点验证老虎白名单」用 `xpilot stop` + `xpilot start <节点>` 把 6 个节点挨个切了一遍（共停起 7 次），而 **xpilot 是本机全局出口**——停掉它等于同时掐断 AI 自己的老虎 API、以及 `system_proxy.enabled=true` 下用户浏览器等全部代理流量。用户原话：「你关了 xpilot 你自己也断了知道吗！禁止所有 Agent 自己关闭 xpilot，确实需要的话必须经过用户授权。」

**改了什么**：

1. `pi/agent/CLAUDE.md` 新增一节「禁止 Agent 自行关闭 xpilot（必须用户授权；已硬拦截并向用户汇报）」——列明禁止动作（`stop` / `restart` / `uninstall-launchd` / 进程终止类命令指向 xpilot / `launchctl unload·bootout` xpilot 守护项）、放行的只读动作（`status` / `node list` / `test --node` / `config show` / `switch`）、确需停重开时的授权流程（说明影响 → 当次授权 → 命令加 `# AI_AUTHORIZED_XPILOT_STOP`）、以及对应工具强制落点。
2. 新增 `pi/agent/extensions/xpilot-guard.ts`：`tool_call` 拦截，命中禁止动作即 **block 暂停执行 + `ctx.ui.notify` 直接向用户汇报**（汇报含「AI 想自主关闭 xpilot、已被拦下」+ 被拦命令摘要 + 授权方式）；覆盖 `bash` 与 `background_run` 两条执行路径（只拦 bash 会被后台任务绕过）；逃生门为当次授权标记。
3. 判定函数 `isXpilotStopCommand()` 单独导出，配 20 条用例实测（拦 9 条：直连 CLI / `python -m xpilot.cli stop` / `restart` / `uninstall-launchd` / 两种进程终止写法 / 带 pgrep 的命令替换 / `launchctl unload` / 链式命令；放 11 条：带授权标记、`status` / `test` / `switch` / `start` / `node list`、以及 `grep`·`echo`·`cat`·`git commit -m` 里出现该字样的读文本场景）——全部通过。

**局限（如实记录）**：`kill -9 <pid>` 这种**不出现 xpilot 字样**的精确 PID 杀法拦不住（无从静态判断 PID 归属）；本守卫只提高绕过成本，不是银弹——与 focus-guard / kdbx-guard 同一取舍。

**回归风险**：无。① 新守卫只拦「停 xpilot」这一类动作，其它命令（含 `xpilot start` / `switch` / `test`）一律放行；② 全程防御性 catch，扩展失灵时不阻塞会话；③ 不改动任何既有扩展与规则条文。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

### 2026-10-27 修 duty-macmini 的 screen 启动漏 `-U`（macmini 上 pi 界面双重编码乱码）

同步全局 `~/.pi/agent` 的改动（本仓库是全局通用能力的开源镜像，与权威源逐字节一致）。

**为什么改**：用户从本机 `macmini-pi` 接进 macmini 的 pi 会话后，整屏边框线、项目符号、中文全是乱码（`â` / `å` 连片、末尾显示 `â¢ macmini`）。实测定位：macmini 自带 `screen 4.00.03` 只有在**创建会话时带 `-U`** 才按 UTF-8 处理；不带 `-U` 时按 8-bit 处理，把 UTF-8 多字节字符逐字节拆开、丢掉 C1 控制字节（0x80–0x9F）再按 UTF-8 重编码——`─`（E2 94 80）变 `â`、`•`（E2 80 A2）变 `â¢`、`中文` 变 `ä¸...`。而 `duty.sh` 起会话时只写了 `screen -dmS`，macmini 上所有常驻 pi 会话（`pi-macmini` / `pi-Mark*`）由此全部中招。

**改了什么**：`pi/agent/patch/duty-macmini/duty.sh` 的拉起行由 `$SCREEN -dmS "$name" ...` 改为 `$SCREEN -U -dmS "$name" ...`，并在上方加注释说明成因与回归风险。

**验证**：同环境对照实验（都用无 LANG 的 `env -i` 模拟 launchd，只差 `-U`）——不带 `-U` 抓到的客户端字节是 `LINE:[âââ] BUL:[â¢] CJK:[ä¸...]`；带 `-U` 抓到的边框字节是完整 `E2 94 80`（`─`），双重编码残留计数 0。真 pi 会话同样验证：不带 `-U` 边框变 `âââ…`，带 `-U` 正常。另外确认 `screen -X "utf8 on"` 无法给已存在的会话补救（对已连上的客户端不生效），**旧会话必须重建**。

**回归风险**：无。`-U` 只是让 screen 按 UTF-8 解析，不影响会话名、cwd、intercom 名与重启周期；已同步到 macmini（两边 sha 一致）。`pi-Mark*` 系会话的 `restart_h=0`（不自动重启），要享受修复需重建一次。

> 注：本条目写在 `## [Unreleased]` 下，版本号由下次发版 bump 时统一提升（未改动 `VERSION`）。

## [1.5.60] - 2026-10-26

### 2026-10-26 注销 Hermes（NetOpsAgent）、XPilot 移交 Atlas；Atlas 子项目名 pi → pi-harness

`pi/agent/docs/agents-registry.md` 同步全局改动（用户在 Kit 会话交办）：瘦身团队结构，把代理工具链并入全栈线。

**为什么改**：Hermes 名下只有 XPilot 一个子项目、职责单一（代理节点测速 / 选路 / 故障转移 / 订阅刷新），而这类 CLI 工具的构建发布、Python 工程化本就是全栈范畴；用户决定不再为单项目维持一个独立 Agent，直接把项目并入 Atlas。同时修正一处长期漂移——Atlas 行的在手项目清单里仍写着旧名 `pi`，而项目在 2026-10-18 已改名 `pi-harness`（注册表该处没跟上，子项目映射表已是新名，两张表口径不一致）。

**改了什么**：

- 智能体命名注册表：移除 **Hermes**（NetOpsAgent）整行。
- Atlas（FullStackEngineerAgent）行：在手项目 `pi` 更正为 `pi-harness`，并补入 `XPilot`。
- 基础设施小组描述：删除 Hermes 及其网络运维职责。
- 子项目映射表：`NetOpsAgent（Hermes） | XPilot` 改为 `FullStackEngineerAgent（Atlas） | XPilot`，说明栏补注完整职责与移交来源。
- 新增「已注销 / 已退役的 Agent」清单（此前只有子项目级退役清单，Agent 级退役无处记录）。

**同批配套改动**（各自项目记录）：XPilot 两条身份软链接改指 `../FullStackEngineerAgent/`；Atlas 项目「子项目清单」节补入 XPilot；Hopper（TestEngineerAgent）移除两处 Hermes 的小组同组列举；xhqing 主页中英双语名册删除 NetOpsAgent 行、XPilot 并入 Atlas 行。

全局与镜像逐字节一致（`diff -q` 校验）。

## [1.5.59] - 2026-10-26

### 2026-10-26 修 session-sweep 僵尸会话漏清（第二处根因：记录文件匹配失败即永久放过）

`pi/agent/patch/session-sweep/session-sweep.py` 修复一处长期漏清的判定缺陷。

**起因**：用户报告本机卡顿，排查发现 6 个 pi 进程里有 tmux 后台会话 `pi-reload-test` 存活 **18 天**、`pi-Gatsby` 存活 **10 天**。日志 `~/.pi/agent/logs/session-sweep.log` 显示每轮巡视都在写它们「匹配不到记录文件（拿不准）」，却从未被清。

**根因**：脚本靠「进程启动时间 ≈ 记录文件名里的 UTC 时间戳」匹配 session 记录文件（容差 5 分钟），匹配不到就置 `idle_min=None`；而 `main()` 对 `idle_min=None` 的处理是**一律「拿不准 → 保留」**（除非显式 `--kill-unknown`，而扩展 `session-sweep.ts` 调用时不带该参数）。于是记录文件一旦对不上（被清理过、归档过、命名规则变过），该会话就**永久**躲过清扫——上一轮 2026-10-23 的修复只修了「候选 > 3 个整体拒绝」那条死锁，没发现这条。

**修法**：改为**运行时长兜底**——无人在看（`attached=0`）+ 进程已跑远超阈值 + 不是「忙死型」（`runaway`）时按僵尸处理；兜底阈值取 `max(idle_min × 2, 360)`（新增常量 `UNKNOWN_FALLBACK_MULT = 2`），避免误伤刚启动、记录尚未落盘的会话。`--kill-unknown` 语义不变（显式强制清），「忙死型」仍只报告不自动杀。干跑输出新增「（按运行时长估算）」标记，`last_active` 为空时显示「无记录」。

**验证**：单测（`--idle-min 360` 模拟扩展调用）四条用例全过——18 天与 10 天且匹配不到记录的判为候选、刚启动 6 分钟的保留、`runaway`（600 小时 + 45% CPU）保留。同轮实测清理三个后台会话（`pi-Kit`、`pi-reload-test`、`pi-Gatsby`）。

全局与镜像逐字节一致（`diff -q` 校验）。

### 2026-10-26 名册同步规则增补：私有仓库默认放空不写

`pi/agent/docs/agents-registry.md`「名册同步」节新增一条（用户 2026-10-26 立）：**凡私有仓库（GitHub `--private`）的 Agent 项目 / 子项目，在 xhqing 公开名册里默认不写、直接登记 allowlist 豁免，且不必询问用户**——不要为这种事阻塞；用户显式要求写时才写，描述语用用户给的原话。存量私有仓库（`xhs-mentor-scam`、按用户显式要求写入的 `NewsScoreStudy`）不受影响。

**为什么改**：同一天按旧规则（「描述语要先问用户」）为 `NewsScoreStudy` 是否上公开名册逐次征询，阻塞了主流程；公开主页列私有仓库本身也会把「存在不想公开的内容」这件事暴露出去，默认关掉更安全。全局与镜像逐字节一致。

## [1.5.58] - 2026-10-26

### 2026-10-26 名册同步规矩落地（新增守卫扩展 + 校验脚本；registry 补规则节；顺带补齐 ark-key-pool 镜像）

**① 新增 `pi/agent/extensions/roster-sync-guard.ts` + `pi/agent/patch/roster-sync/`（`roster-sync-check.py` 与 `allowlist.json`）**：用户 2026-10-26 立规——`agents-registry.md` 的任何改动（新增 / 删除 Agent 或子项目、归属变更、迁机）必须**与 `xhqing` 主页 README 名册在同一批里同步**（英文 + 中文两份）。按团队元规则「规矩必须配套工具强制」，这条规矩落地为机器校验：脚本把 registry「智能体命名注册表」+「子项目映射」两张表与两份 README 名册做集合比对（缺 / 多都报，带删除线的「已移交」痕迹行自动跳过，`allowlist.json` 登记待用户确认的有意豁免），退出码 1 表示有漂移；扩展在某次工具调用写到 registry 后立即跑一次比对并当场插话，每轮收尾（`agent_settled`）再兜底比一次（Kit 会话注入提醒、其它会话只弹通知），同一批漂移只提醒一次。本机实测：正向退出码 0（只剩豁免项）、负向能准确报出缺 / 多、扩展四条路径（插话 / 去重 / 无关写入不触发 / 非 Kit 会话不插话）全过。

**② `pi/agent/docs/agents-registry.md`**：在「子项目映射」表下方新增「名册同步（2026-10-26 用户立，硬性规定 + 工具强制）」节——规矩原文、责任人（名册归 Kit，但改 registry 的会话负责同批补齐）、「公开描述语先问用户、未认可先登记豁免」、工具强制入口、以及脚本查不到的部分（描述文字与 Host machine 列）靠人。

**③ 顺带补齐 `pi/agent/extensions/ark-key-pool.ts`**：全局副本早已领先（2026-10-24 起的按「Key + 模型」粒度额度冷却、逐次翻倍重试、冷却只记实际插入 header 的那把 Key），镜像停在旧版本——按「发现分叉立即同步、全局权威优先」补齐。

全局与镜像逐字节一致（上述四文件 `diff -q` 校验；`diff -rq` 全面核对 skills / CLAUDE.md / docs / patch / extensions 五部分无其它分叉，仅本机私有的 `skills/anysearch/.env`、`skills/backup/endpoints/endpoints.json` 与 `patch/session-link/config.json`、`local-links.json` 不在镜像内属预期）。


### 2026-10-26 注册表与跨机协作口径同步（新增子项目 NewsScoreStudy 归 Mark；Mark 从 macmini 迁回本机）

**① `pi/agent/docs/agents-registry.md`**：子项目映射表新增 `QuantStrategistAgent（Mark） | NewsScoreStudy`——面试实操题研究仓库（评估「大模型给新闻打的分（-1~1）值不值得交易」，模拟数据、代码匿名化，交付 PLAN / REPORT / NOTES；私有远程 `github.com/xhqing/NewsScoreStudy`）。该仓库 2026-10-26 由 Victor（DayTradingAgent）建立并移交 Mark，Victor 行保留一行带删除线的「已移交」指针以免归属丢失。「宿主机归属」节新增一段：**Mark 已由用户从 macmini 拷回本机，本机为权威源**；macmini 上的同名目录与 4 个 Mark 常驻会话暂保留但不权威（用户当日选择「两边都不动、只改本机口径」，属对「迁移 = 转移而非双活」的已知例外，非遗漏）。

**② `pi/agent/CLAUDE.md`（「跨机协作：macmini 值班会话」节）**：原「已迁移的 Agent」段改写为「已迁回的 Agent」——Mark 全体系拷回本机、本机权威；会话表增加「现行口径」列（值班会话正常使用，4 个 Mark 会话保留但不权威）；并加一条告警：**给 macmini 上的 Mark-\* 会话派活改的是 macmini 副本、不会回流本机**，非必须用 macmini 环境的任务一律在本机做。

全局与镜像逐字节一致（两文件 `diff -q` 校验；`diff -rq` 确认无其它分叉，仅本机私有的 `skills/anysearch/.env`、`skills/backup/endpoints/endpoints.json` 不在镜像内属预期）。无代码 / 机制变更，其它 agent 项目零影响。

## [1.5.57] - 2026-10-23

pi-harness 改名登记（注册表子项目行 `pi` → `pi-harness`：GitHub 2026-10-18 改名、本地目录 2026-10-23 同步改名），并修复 `sync-to-macmini` 脚本 rsync 未指定 ssh 超时导致跨网段 / 离线卡死的问题（增加连通性预检 + ConnectTimeout / ServerAlive 保活）。详见下方 2026-10-23 分节。

## [1.5.56] - 2026-10-23

修复后台会话自动清扫长期静默失效（用户实测：本机积到 18 个僵尸会话、跑了 5~15 天没被清，pi-Hopper 空转 8 天 11 小时持续吃 87% CPU 且上下文 99.3% 卡死，导致 8GB 内存的 MacBook Air 负载冲到 14、swap 用满 11.4GB、磁盘只剩 8GB）。根因三层，逐层修：① `session-sweep.py` 的批量安全阀原为「候选 > 3 个就整体拒绝执行」——僵尸积到第 4 个后永久死锁、越积越多，现改为**分批清理**（每批最多 3 个、按空闲降序优先清最老的，其余 `deferred` 留待下次巡视，`--force` 一次清完），安全阀意图保留但不再制造死锁；② `--json` 与低阈值拒绝路径现在**始终输出合法 JSON 且退出码 0**（原实现返回非零退出码 + 人类可读文字，上层 `execFileSync` 抛异常后被 `catch {}` 静默吞掉，清理失败长期无人知晓），扩展侧同步改用 `spawnSync` + 容错解析 + **写日志到 `~/.pi/agent/logs/session-sweep.log`**（`SWEEP` / `ERROR` / `REFUSED` / `FATAL` 四类留痕），失败可见可追；③ 新增 **runaway（忙死型）检测**——原清扫靠记录文件 mtime 判「空闲」，失控会话持续重试写日志会一直刷新 mtime、永远被判「刚活动过」而躲过清理（pi-Hopper 正是如此），现对「运行 ≥ 24 小时且生命周期平均 CPU ≥ 20%」的会话单独标记提示、不自动杀（长跑真任务也会命中，交人判断）。同步镜像与全局两端逐字节一致。

同一轮追加（2026-10-23 用户定调，`session-sweep.ts`）：巡视改为**全程静默、用户无感**。原实现在巡视后用 `ctx.ui.notify` 向会话弹提示——报告「已自动关闭 N 个 / 另有 N 个空闲 30 分钟~6 小时暂未清 / 要清可跑 `session-sweep.py --kill --idle-min 30`」。用户明确表示「这个巡视不需要提示，要做到用户无感，提示给用户也没啥意义，用户不会自己去执行程序的」：用户看不见 tmux 后台会话，把待清清单和可执行命令摆给他只是干扰。现移除全部 notify，已清 / 顺延 / 待定 / 失控 / 失败一律只写 `session-sweep.log`（`KILLED` / `DEFERRED` / `PENDING` / `WARN` / `SWEEP` / `ERROR` / `FATAL` 留痕），日志超过 1 MB 自动滚成 `.log.1` 防占地。分级策略不变：空闲 ≥ 6 小时的明显僵尸照旧自动清（每批 ≤ 3 个），30 分钟 – 6 小时区间照旧不自动杀（可能刚用完或在等反馈，等它跨过 6 小时阈值后自动清），只是不再向人报告、也不再给任何需要用户执行的命令建议。

## [1.5.55] - 2026-10-23

镜像结构全面转向 pi-harness：原 `claude/` 目录（skills / docs / patch / CLAUDE.md）整体迁入 `pi/agent/` 下对应路径（git mv 保留历史），`claude/hooks/`（Claude Code 遗留脚本）删除，此后不再维护 `claude/` 镜像；同步更新 `.gitignore`（敏感文件规则改到 `pi/agent/`）、`capability-sync.md`（重写为五部分 + 第六类 npm 清单，去掉 hooks）、注册表与脚手架文档、项目级 capability-manager skill 与 README 双语的路径 / 范围描述。详见下方 2026-10-23 分节。

## [1.5.54] - 2026-10-22

新增通用扩展 `ark-key-pool`：为火山方舟 Agent Plan 提供多 Key 自动切换（不同账号的 Key 池、额度耗尽 / Key 失效自动换下一个、冷却状态跨进程共享），配套文档 `docs/ark-key-pool.md`。详见下方 2026-10-22 分节。

## [1.5.53] - 2026-10-18

ai-edit-diff 增加可直接键入的 diff 开关命令：`/open-diff`、`/close-diff` 用户命令与 `close_diff` 工具（`open_diff` 抽成共用 `runOpenDiffFlow`）；关闭走「请求 + 确认」协议（close-requests / close-acks，配新建的 VSCode 侧助手扩展 diff-bridge——只关闭左侧为 pi 改动前快照的 diff 标签、静默不抢焦点），并修启用提示缺字。子项目映射同步新增 diff-bridge 行（Kit 名下，本地项目）。详见下方 2026-10-18 分节。

## [1.5.52] - 2026-10-18

会话生命周期联动（session-link 机制）：本机派活会话关闭 → macmini 上由它派活的任务链自动清上下文重启（链标记 `<!-- pi-chain:<id> -->` + replica 侧链注册 + 级联重置），并加「禁止远端设备派活到本机」的方向守卫；duty.sh 重写为多会话守护（duty.conf 清单 + PID 精确匹配），sync 脚本排除 session-link 状态文件。详见下方 2026-10-18 分节。

## [1.5.51] - 2026-10-17

跨机协作机制落地：`CLAUDE.md` 新增「跨机协作：macmini 值班会话」节（标准呼叫命令、用途、能力边界）；`agents-registry.md` 新增「宿主机归属」段（单宿主规则 + Mark 及子项目迁至 macmini 的记录）；`patch/` 新增 `duty-macmini/`（screen + launchd 值班会话守护，含 SCREENDIR 固定与冷却防重复拉起）与 `sync-to-macmini/`（fs.watch 防抖 watcher + rsync 单向同步）。详见下方 2026-10-17 分节。

## [1.5.50] - 2026-10-17

skill-creator 新增 pi 版触发评测脚本（`scripts/run_eval_pi.py`）：用 `pi -p --mode json` 跑评测查询、从事件流检测被测 SKILL.md 是否被读取，替代依赖 Claude Code CLI 的原版 `run_eval.py`；自带「空响应检测 + 重试」（实测 pi 偶发空响应约 10-25%），默认隔离模式（只测该 skill 的 description 本身），支持 `--description` 覆盖做 A/B 与 `--dry-run`。同步补「去 CC 化」文本：SKILL.md 顶部加本地使用注记与 pi 版引用块、`run_eval.py` / `improve_description.py` 文件头加使用注记、`eval-viewer/viewer.html` 提示语改为「agent session (e.g. pi)」。详见下方 2026-10-17 分节。

## [1.5.49] - 2026-10-17

agent-call 修复：`dir` 以 `~` 开头时，唤醒会话的 `tmux new-session -c` 拿到的是未展开的 `~`，导致新建 pi 会话落在 home 目录、加载不到目标 Agent 的身份与规则（实测：四个新唤醒会话 cwd 为 `/Users/xhq`）。修复：传给 tmux 的目录改用展开后的绝对路径。

## [1.5.48] - 2026-10-17

智能体专属文件归属规则修订（2026-10-17 用户决定，取代 2026-10-12 的「子项目一律不得存在」）：子项目改为挂两条指回负责 Agent 的软链接——`AGENTS.md → ../<负责Agent项目>/AGENTS.md`、`.pi → ../<负责Agent项目>/.pi`（随仓库提交），在子项目目录开会话即继承负责 Agent 的身份 / 规则 / 技能（「Agent 进驻子项目」）；智能体专属文件的**实体**仍只属于 Agent 项目；后台开启 / 唤醒会话仍限定 Agent 项目根目录；`.claude/` 不纳入本网络（不再维护，存量暂留）。同步内容：`claude/CLAUDE.md`（团队结构参考节重写 + 会话命名约定改为「人格名 + session-id 唯一定位会话」）、`claude/docs/agents-registry.md`（《智能体专属文件归属与子项目映射》节全文重写为 2026-10-17 版；映射表加软链接说明；channels-watch 退役并入已退役清单）、`claude/docs/new-agent-scaffold.md`（新建子项目挂软链接约定）；`pi/agent/extensions/agent-call.ts` 目录校验由「标记文件存在性」升级为按注册表校验（子项目目录会被拒绝，防软链接误放行），并支持按 session-id（或短前缀）定位会话。

## [1.5.47] - 2026-10-15

ai-edit-diff 委派窗口追补：上限 1 小时 → 24 小时（对方可能隔夜才处理）；新增「活动后安静关窗」——见到对方活动后安静超过 30 分钟即关窗、恢复常态通知（`AI_EDIT_DIFF_DELEGATE_IDLE_MS` 可覆盖）；详见下方 2026-10-15 分节。

## [1.5.46] - 2026-10-15

ai-edit-diff 新增「委派窗口」：自己用 `agent_call` / `intercom` 委派出去的活，被委派方中间的改动静默（只看对方最终完成汇报；按会话 id / 目标目录匹配；阻塞式返回后 30 分钟尾随窗口、报错即撤销）；外部与用户改动照常通知；详见下方 2026-10-15 分节。

## [1.5.45] - 2026-10-15

ai-edit-diff 修复：自己的工具改动 / 新增文件不再通知自己（四层静默机制——工具运行登记 / 运行期抑制 / 收尾清扫 / 后台任务窗口）；跨会话与用户改动照常通知；详见下方 2026-10-15 分节。

## [1.5.44] - 2026-10-14

ai-edit-diff 改造：变更通知只发给「任务进行中」的会话——已完成任务、等用户过目/指示的会话不接收通知（变更只消化进已知状态）；通知去掉 `triggerTurn`（不再唤醒空闲会话多跑一轮）；详见下方 2026-10-14 分节。

## [1.5.43] - 2026-10-14

session-guard 修复：kill-session 判定收紧为紧凑形式（对齐 CC 端规则 8）——修「命令文本里同时出现关键词即误伤」；真命令拦截不变；详见下方 2026-10-14 分节。

## [1.5.42] - 2026-10-14

focus-guard 扩展：用 `open` 代开网页页面纳入本机焦点拦截（给链接、不代开——2026-10-14 用户追加立规）；CLAUDE.md / 钩子规则 9 / pi 扩展三处同步、双端行为验证；详见下方 2026-10-14 分节。

## [1.5.41] - 2026-10-14

新增本机屏幕焦点守卫（2026-10-14 用户立规）：本机禁止抢焦点的 osascript 焦点 / UI 操作与直接调用 codef，此类测试改去 macmini（`ssh mac-mini`）或找 cuAgent；CC 钩子规则 9 + pi 扩展 focus-guard 双端强制，逃生门标记 `AI_AUTHORIZED_LOCAL_FOCUS`；详见下方 2026-10-14 分节。

## [1.5.40] - 2026-10-14

ai-edit-diff 变更通知新增「先判断相关性、再决定是否读取」：通知附文件名 / 项目位置 / 上下文提示三行依据 + 四步判断，大概率无关则不读（避免无关信息干扰当前任务）；touched 新增触碰来源 src；详见下方 2026-10-14 分节。

## [1.5.39] - 2026-10-14

本版含两项改动：ai-edit-diff 排除 tmp/ 目录与 `monitor_log_` 前缀（盯盘采样日志不再产生变更通知噪音）；子项目清单收缩（取消 8 个子项目、xhs-mentor-scam 移出 EA tmp/ 改为独立开发目录）；详见下方 2026-10-14 分节。

## [1.5.38] - 2026-10-14

本版含三项改动：pi background-tasks 完成通知改造（通知不再显示 + AI 忙时聚合——消费积压通知队列不再占用用户窗口）；ai-edit-diff 路径解析修正（bash 命令里的相对路径改为按命令内实际的 `cd` 目录解析，修掉「误登记导致无关会话收到误导性变更通知」的根因）；codef 命名回退同步（登记侧回退为 codef / `xhqing/codef`）；详见下方 2026-10-14 与 2026-10-13 分节。

## [1.5.36] - 2026-10-13

发版门禁收紧：自动发版链只在自最新 tag 含 fix / feat 类改动时触发（2026-10-13 用户立），纯文档 / 杂事类不发版、不 bump；镜像同步六文件（`CLAUDE.md` + `skills/` 的 commit / bump / release / add / dev-workflow）；详见下方 2026-10-13 分节。

## [1.5.35] - 2026-10-12

智能体专属文件归属新规（2026-10-12 用户修订，取代「子项目超集」规则）镜像同步：五文件（`CLAUDE.md` / `agents-registry.md` / `new-agent-scaffold.md` / `settle-repo-check.py` / `agent-call.ts`）；capability-manager 的 sync-flow 两处「超集」表述对齐；TODO T1 闭环归档；详见下方 2026-10-12 分节。

## [1.5.34] - 2026-10-12

镜像新增 image-marker 扩展：粘贴图片在输入框里显示为 `[Image #1]` 标记（回车提交时还原成真实路径，对模型 / 工具透明），替代原来的一长串临时文件绝对路径；详见下方 2026-10-12 分节。

## [1.5.33] - 2026-10-12

ai-edit-diff 两项修正：① 通知措辞——来源不明时不再默认归因「用户修改」，改用中性措辞「来源未识别」（实践中大部分是其它会话改的）；② 复合命令（`cp … && diff …`）不再被误判为只读——写动作正确登记快照/声明，自己改自己的文件不再误报；详见下方 2026-10-12 分节。

## [1.5.32] - 2026-10-12

capability-sync 文档补「CHANGELOG 追加自查」（防日期节错位与标题重复）；源自两批同步的同类结构问题（均由 Prometheus 在提交前修正）；详见下方 2026-10-12 分节。

## [1.5.31] - 2026-10-12

agent-wait-banner 再修订：新增「主动判断」——send 类委派消息里写明「无需回复」即不点亮提醒（没有要等的就不提醒）；CLAUDE.md 同步；详见下方 2026-10-12 分节。

## [1.5.30] - 2026-10-12

agent-wait-banner 修订：send 窗口加 15 分钟超时上限——没有真实待办时大红提醒不再一直挂着（用户曾被「幻影后台」误导）；全局 CLAUDE.md 规则同步；详见下方 2026-10-12 分节。

## [1.5.29] - 2026-10-12

ai-edit-diff 改造：文件变更通知升级为「跨会话广播」——碰过文件的活跃会话（前台 + 后台）都会收到变更通知（用户改动 / 其它会话改动都通知；附来源与改动前快照，自己的改动不自报）；user-edit-notify 退役文件删除、capability-sync 文档同步；详见下方 2026-10-12 分节。

## [1.5.28] - 2026-10-12

pi 第三方包清单刷新：移除 pi-workspace-history（本机卸载该扩展，镜像三件套同步更新）；详见下方 2026-10-12 分节。

## [1.5.27] - 2026-10-12

ai-edit-diff 改造：diff 默认不自动打开，改为按需 `open_diff` 工具——询问「哪个 VSCode 窗口 + 哪个文件」、用户授权后在指定窗口打开（tmux 全链路实测通过）；详见下方 2026-10-12 分节。

## [1.5.26] - 2026-10-12

镜像新增 ai-edit-diff 扩展（通用「改动可视化 / 双向知情」，user-edit-notify 的通用化改造版）；user-edit-notify 排除模式兼容 `.disabled` 退役文件；详见下方 2026-10-12 分节。

## [1.5.25] - 2026-10-12

scroll-reverser skill 移出通用能力范围（转为 ExecutiveAssistantAgent 项目专属 skill）：全局与镜像同步删除、capability-manager 引用更新；详见下方 2026-10-12 分节。

## [1.5.24] - 2026-10-12

capability-manager skill 口径对齐：pi 扩展镜像剔除项目专用扩展（同步命令 / 巡检 / 合法差异表补排除项，与 capability-sync.md 口径一致）；详见下方 2026-10-12 分节。

## [1.5.23] - 2026-10-12

镜像口径明确化：pi 扩展不含项目专用扩展（判定标准 + 现例 `user-edit-notify.ts`）；详见下方 2026-10-12 分节。

## [1.5.22] - 2026-10-12

scroll-reverser skill 补「beta 自动更新后重启中断」失灵形态（用户报「滚动方向总是不对」的实测诊断与修复）；详见下方 2026-10-12 分节。

## [1.5.21] - 2026-10-11

capability-manager skill 对齐第七类同步对象（pi 第三方包清单）：SKILL.md / sync-flow / content-lifecycle 的同步范围、验证与巡检口径补上 npm 清单（`refresh.py` 刷新、`--check` 核验）；详见下方 2026-10-11 分节。

## [1.5.20] - 2026-10-11

新增「pi 第三方包清单」镜像（第七类同步对象）：第三方 npm 包的备份与迁移清单（`pi/agent/npm/`）+ 刷新脚本 `patch/npm-manifest/refresh.py`；详见下方 2026-10-11 分节。

## [1.5.19] - 2026-10-11

新增全局 pi 扩展 background-tasks（后台任务工具：`background_run` / `background_list` / `background_stop`、完成通知唤醒、会话退出清理、与 footer 提醒联动；自 DayTradingAgent 项目级上移为全局通用能力）；详见下方 2026-10-11 分节。

## [1.5.18] - 2026-10-11

agent-wait-banner 重做（v3）：提醒改挂 footer 状态行（不再注入消息首行横幅）、显示时机改为「有未完活动且会话静止」、修复「intercom 回信不清窗」与「结束后提醒残留」缺陷、新增后台任务上报通道（`agent-wait-banner:activity`）；CLAUDE.md 规则节同步改写（pi 端自动显示、CC 端保留手写）；详见下方 2026-10-11 分节。

## [1.5.17] - 2026-10-11

注册表镜像：DayTradingAgent（Victor）登记新子项目 TradingProofs（交易数学的 Lean 4 + Mathlib 机器可验证证明，2026-10-11 立项）；详见下方 2026-10-11 分节。

## [1.5.16] - 2026-10-09

agent-wait-banner 判定精化：等待窗口精确化（send 类委派等回信期间才补横幅；ask 一有结果即结窗不再补），修复「已收尾汇报被误补横幅」的假阳性（用户实测指出）；同步更新全局 CLAUDE.md 工具描述句；详见下方 2026-10-09 分节。

## [1.5.15] - 2026-10-09

capability-manager skill 对齐现状：命名规则改为「以 `Agent` 结尾、前缀尽可能简单」、引用模型改单一出口（删旧「分发到各 agent 项目副本」描述）、清理 find-skill 残留与注册表路径修正；详见下方 2026-10-09 分节。

## [1.5.14] - 2026-10-09

注册表新增第 21 个 agent `cuAgent`（电脑操作员，computer-use 专用、不分组直属用户）并同步修订新建 Agent 命名规则（以 `Agent` 结尾、前缀尽可能简单，不再强制拟人名）；computer-use 口径由「已弃用并移除」修订为「仅限 cuAgent 项目内使用」（项目级 MCP）；详见下方 2026-10-09 分节。

## [1.5.13] - 2026-10-09

注册表镜像：zcode-cli 与 cmux-launcher 标注「2026-10-09 起短期搁置（用户决定暂不维护）」（Atlas 两个子项目）；详见下方 2026-10-09 分节。

## [1.5.12] - 2026-10-09

新增「等待回执期间大红警示横幅」规则（等待其它智能体回复的阶段性汇报首行必须带固定大红横幅，防用户误以为任务完成而误关会话）+ pi 端扩展 `agent-wait-banner` 兜底（委派后收尾消息缺横幅自动补、等待期挂红色 widget）；详见下方 2026-10-09 分节。

## [1.5.11] - 2026-10-09

新增「会话收尾检查」全局规则（所有 Agent 会话收尾前必须把自己负责的子项目仓库处理干净、不干净不收尾）+ 双端工具强制（pi 端扩展 settle-repo-check 巡检提醒、CC 端 Stop hook 未干净阻断收尾一次）；详见下方 2026-10-09 分节。

## [1.5.10] - 2026-10-09

发版节奏口径对齐：修复 / 功能合并进 main 后自动发正式版、验收移到发版之后（dev-workflow + commit 措辞）；注册表加行（Atlas 子项目 mp4-player）；详见下方 2026-10-09 分节。

## [1.5.9] - 2026-10-09

test-cases-guard 收窄：`git add` 把测试文件入暂存区不再拦（只防「改测试内容」）；详见下方 2026-10-09 分节。

## [1.5.8] - 2026-10-09

全局注册表超集映射表加行（Atlas 新增子项目 channels-watch、Kit 新增子项目 copybridge）；详见下方 2026-10-09 分节。

## [1.5.7] - 2026-10-08

task-label 缺陷修复（二）：输入里的长路径 / URL 不再把临时标签挤成路径碎片；详见下方 2026-10-08 分节。

## [1.5.6] - 2026-10-08

task-label 缺陷修复：续接类输入（如 `continue`）不再覆盖任务标签；自动总结失败后允许重试；详见下方 2026-10-08 分节。

## [1.5.5] - 2026-10-08

computer-use 弃用并移除：CLAUDE.md 规则节改写为「已弃用并移除」；镜像删除 `claude/patch/done-dialog`；详见下方 2026-10-08 分节。

## [1.5.4] - 2026-10-08

用毕通知升级为「屏幕正中央确认弹窗」：新增 `patch/done-dialog/done-dialog.sh`（弹窗 +「知道了」按钮 + 阻塞等点击，点击即确认信号 / 控制权交还）；CLAUDE.md 该节同步改准；详见下方 2026-10-08 分节。

## [1.5.3] - 2026-10-08

电脑操作授权节奏细化：一次申请覆盖整段操作（开始前申请一次、中途不重复打断、结束后通知归还）；审批弹框选「Allow server for this session」可一次放行整段；详见下方 2026-10-08 分节。

## [1.5.2] - 2026-10-08

新增「电脑操作（computer-use）授权」规则：用前必向用户申请、用毕必通知归还；pi 端配套把 open-computer-use 的 `approveTools` 改为 `true`（每次调用弹审批框）；详见下方 2026-10-08 分节。

## [1.5.1] - 2026-10-07

task-label 扩展改进：临时标签截断处补省略号「…」（超长输入不再硬切）；详见下方 2026-10-07 分节。

## [1.5.0] - 2026-10-07

新增 pi 端扩展 task-label（会话任务标签：footer 状态行三态显示——空闲 / 正在处理 / 完成，随会话持久化、由 agent_start / agent_settled 自动切换）；详见下方 2026-10-07 分节。

## [1.4.5] - 2026-10-07

backup skill 飞书端点补两条实测踩坑：`+upload` 同名不覆盖会生成副本（自动化上传须先删同名旧文件再上传）、`--output` 只接受当前目录下的相对路径；详见下方 2026-10-07 分节。

## [1.4.4] - 2026-10-05

补 add skill 的「常设授权」触发来源（description 与「授权边界」段），修复与 commit skill 的口径不一致——该自动发起时不再可能漏触发；详见下方 2026-10-04 分节。

## [1.4.3] - 2026-10-05

新增第 5 种 commit 授权形式（常设授权：工作区 / 暂存区有待提交内容即直接按 skill 流程提交、无需逐次询问），CLAUDE.md、CC 钩子、pi 扩展与 commit skill 标记说明同步更新；详见下方 2026-10-04 分节。

## [1.4.2] - 2026-10-04

发布 `claude/docs/` 镜像（修复 .gitignore 裸 `docs/` 规则静默吞掉镜像部分的缺口）+ 新增分支保护现状文档与「直推可用性视仓库实际状态」口径修正；commit skill 补全「PR 合并后远端源分支清理」（`--auto` 异步合并下 `--delete-branch` 不生效、由 9z 兜底）；详见下方 2026-10-04 分节。

## [1.4.1] - 2026-10-04

修复 public-text-guard 误伤：含版本号的分支名（如 `chore/bump-v1.4.0`）不再被当成推 tag 拦截——形如版本号的 refspec 收紧为「裸 token」判定；详见下方 2026-10-04 分节。

## [1.4.0] - 2026-10-04

新增收尾自动巡视后台会话（pi 端扩展 `session-sweep.ts`：`agent_settled` 时自动巡视——空闲 ≥ 6 小时自动清理、30 分钟 – 6 小时只列出提示，全局 10 分钟节流）并为清扫器脚本加入安全阀（`--json` 纯 JSON 输出、批量 / 低阈值拒绝执行）；详见下方 2026-10-04 分节。

## [1.3.0] - 2026-10-04

新增会话保护工具链与跨会话委派授权：`session-guard`（pi 端扩展，禁止关闭用户终端里的前台 pi 会话与危险 tmux 操作，与 CC 钩子规则 8 同源）、`session-sweep`（后台会话清扫器，默认干跑、`--kill` 才动手）；`AI_AUTHORIZED_COMMIT` 明确授权扩为四种形式（新增跨会话委派）；详见下方 2026-10-04 分节。

## [1.2.1] - 2026-10-04

release skill 产物核查改为「以项目声明为准」（取消「历史 assets」信号），同步全局 `~/.claude/CLAUDE.md` 的 `/release` 限定与本仓库「不带产物」发版声明；详见下方 2026-10-04 分节。

## [1.2.0] - 2026-10-04

新增 `kdbx-guard`（密码库 / 密钥文件的删除 / 移动 / 覆盖硬拦截，防 AI 误删经文件同步传播到两端）并收紧 commit 判定（文本提及不再误触发守卫）；详见下方 2026-10-04 分节。

## [1.1.0] - 2026-10-03

自 1.0.0 以来的通用能力变更汇总（每项详情见下方各日期分节）：新增 pre-commit 凭证扫描 skill、auto-rc 预发布工作流、`agent-call` 跨会话协作扩展与 `version-guard` 版本一致性守卫扩展；实现发版自动链（`/commit` 第 10 步自动衔接 `/bump` → `/add` → `/commit` → `/release`）与 `/add` 预检完全干净后自动衔接提交推送；新增敏感扫描白名单机制、修正 gitleaks 单路径调用；开源镜像扩展至六部分；dev-workflow 修订测试产物不单独提交、不单独开 PR；release skill 新增公开文本发布前敏感自检（notes / tag message 定稿后、公开动作前检测，2026-10-03）。

## 2026-10-23

### 变更（镜像结构迁移：claude/ → pi/agent/，全面转向 pi-harness）

- **为什么改**：2026-10-22 用户决定——团队已全面转向 pi-harness，`claude/` 目录是 Claude Code 时代的镜像结构，不再需要；通用能力镜像应与全局 `~/.pi/agent/` 的路径一一对应，clone 者拿到的目录结构也要与 pi 时代一致。
- **改了什么**：① `git mv` 迁移——`claude/skills/` → `pi/agent/skills/`、`claude/docs/` → `pi/agent/docs/`、`claude/patch/` → `pi/agent/patch/`、`claude/CLAUDE.md` → `pi/agent/CLAUDE.md`；`claude/hooks/`（3 个 CC 遗留脚本）`git rm`，不迁移；`claude/` 目录随后删除。② `.gitignore` 的本机敏感文件规则同步改到 `pi/agent/` 新路径（find-skill 的 .env / cache、backup 的 endpoints、session-link 的运行状态）。③ `capability-sync.md` 重写：镜像范围由「五部分 + 生成式清单（含 hooks 遗留）」改为「五部分（skills / CLAUDE.md / docs / patch / extensions）+ 第六类 npm 清单」，去掉全部 `claude/` 与 hooks 描述，补 2026-10-22 迁移说明。④ `agents-registry.md` / `new-agent-scaffold.md` 的镜像路径引用更新（`claude/docs/` → `pi/agent/docs/`，六部分 → 五部分 + 清单）。⑤ 全局 `~/.pi/agent/CLAUDE.md` 的镜像路径引用同步更新。⑥ 项目级 `.claude/README.md` 与 `capability-manager` skill（SKILL.md + references）全部路径与同步范围描述更新（`~/.claude/` → `~/.pi/agent/`、`claude/` → `pi/agent/`、六部分 → 五部分、第七类 → 第六类、删除 hooks 同步块）。⑦ README 双语更新：去掉「项目副本同步」等 Claude Code 时代口径，管理范围表改为 pi 的目录结构（skills / CLAUDE.md / docs / patch / extensions + npm 清单）。
- **验证**：五部分 diff 逐字节一致（`CLAUDE.md` / `docs` / `extensions` / `patch` / `skills`，敏感文件与本机产物按规则排除）；`git check-ignore` 确认新路径规则生效；git 识别 88 个 rename + 4 个 rename-with-modify + 3 个 delete（hooks），无内容丢失。
- **回归风险评估**：`claude/` 只作为开源镜像存在、不是运行依赖（运行时只加载全局 `~/.pi/agent/`），迁移不影响任何 agent 的实际运行；`hooks/` 自 pi 起已退役（hooks 改名 extensions），删除无功能影响。
- **镜像同步**：本条目即迁移记录本身；版本 1.5.55 发版。

### 变更（pi-harness 改名登记 + sync-to-macmini 挂起修复）

- **为什么改**：① pi 仓库已改名 `xhqing/pi-harness`（GitHub 2026-10-18；本地开发目录 2026-10-23 同步改名 `~/Developer/pi-harness`），注册表子项目行需对应更新（Atlas 更新全局）；② `sync-to-macmini` 脚本的 rsync 未指定 ssh 选项，跨网段 / 离线时会一直挂起（实测卡 1 小时 11 分钟、堵死 watcher 后续全部同步），需加连接预检与超时。
- **改了什么**：① `pi/agent/docs/agents-registry.md` 子项目行 `pi` → `pi-harness`（描述补改名历史）；② `pi/agent/patch/sync-to-macmini/sync-to-macmini.sh` 增加连通性预检（连不上直接跳过）与 `-e "$RSYNC_SSH"`（ConnectTimeout 10s + ServerAlive 保活），涵盖核心文件与各能力目录的同步命令。
- **验证**：两文件与全局逐字节一致。
- **镜像同步**：两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Atlas 委派 + 顺带纳入同批已同步的脚本修复）；版本 1.5.57 发版。

## 2026-10-22

### 新增（ark-key-pool：Agent Plan 多 Key 自动切换扩展）

- **为什么改**：2026-10-22 用户需求——火山方舟 Agent Plan 有两个不同账号的 Key，希望一个不能用时自动切换另一个。pi 原生凭证模型是「一个 provider 一份凭证」（`auth.json` 单条），既不能配两个 Key，也没有故障切换；Agent Plan 额度耗尽返回 `429 AccountQuotaExceeded`、Key 失效返回 `401`，原生只会用同一个 Key 重试。
- **改了什么**：① 新增 `pi/agent/extensions/ark-key-pool.ts`：`before_provider_headers` 每次请求从池中挑可用 Key 覆盖 `Authorization`；`message_end` 识别 401/403/429 写冷却（状态文件跨进程共享，只存 Key 的 SHA-256 前缀）；401/403 原本不被 pi 重试，扩展把 `errorMessage` 改写成可重试形态（带 429），让 pi 的自动重试带着下一个 Key 继续；429 额度耗尽本就触发 pi 重试，重试时自然换 Key；冷却时间优先解析响应里的 `reset at` 时间，上限 1 天；另提供 `/ark-key-pool` 查看状态与 `/ark-key-pool reset` 清除冷却。② 新增 `pi/agent/docs/ark-key-pool.md`（原理、配置、命令、已知边界、测试记录）。配置模板 `ark-agent-plan-keys.json.example` 留在本机 `~/.pi/agent/` 根目录（含凭证占位，不入镜像）；真实配置 `ark-agent-plan-keys.json` 与本机同目录、0600 权限、仅本机。
- **验证**：本地 mock 跑四个场景全过——正常请求、额度耗尽切换（key-A 429 → key-B 成功）、Key 失效切换（key-A 401 → 改写 → key-B 成功）、两个 Key 都耗尽（各试一次后兜底 auth.json Key）；另验证跨进程冷却共享（新进程直接跳过已冷却 Key）与冷却到期自动恢复。全程未消耗真实额度。
- **镜像同步**：随本批同步（全局权威优先）；版本 1.5.54 发版。

## 2026-10-19

### 变更（diff-view 开源到 GitHub：注册表行更新为已开源）

- **为什么改**：2026-10-19 用户指示把 Kit 名下子项目 diff-view 开源到 GitHub；公开仓库 `github.com/xhqing/diff-view` 已建并发布 `v0.2.0`（产物为唯一 zip：内含 vsix 与 pi 扩展文件、共用同一版本号）。
- **改了什么**：`claude/docs/agents-registry.md` 子项目行——「尚未开源」更新为「已开源 github.com/xhqing/diff-view（2026-10-19，v0.2.0）」，项目路径说明同步微调；其余内容不变。
- **回归风险评估**：纯状态文字更新（未开源 → 已开源），无机制改动；镜像与全局 `diff -q` 逐字节一致。
- **镜像同步**：`docs/agents-registry.md` 覆盖至镜像；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

## 2026-10-18

### 变更（会话生命周期联动：session-link 机制）

- **为什么改**：2026-10-17 用户方案——后端会话的清上下文时机绑定本机派活会话的关闭（用户关了本机会话 = 判定任务完成），并禁止远端设备派活到本机跑后端进程。
- **改了什么**：① `claude/CLAUDE.md` 在「跨机协作」节下新增「会话生命周期联动（session-link 机制）」；② `pi/agent/extensions/session-link.ts` 新扩展（链标记 `<!-- pi-chain:<id> -->`、replica 侧链注册 chain-registry、source 侧 session_shutdown 联动 ssh 触发级联重置、replica 侧派活方向守卫）；③ `claude/patch/session-link/chain-reset.sh`（任务链级会话重置脚本）；④ `claude/patch/duty-macmini/` 重写（多会话守护 + duty.conf 5 会话清单 + PID 精确匹配修复 + session-link 排除逻辑）；⑤ `claude/patch/sync-to-macmini/` 排除 session-link 状态文件（config.json / local-links.json / chain-registry.json），镜像 `.gitignore` 加同三项双保险并清掉误同步的 config.json。
- **验证**：五部分一致（CLAUDE.md / patch / extensions，状态文件按规则排除）；gitleaks 全绿；语义预检无凭证（仅 ssh 别名与路径）。
- **镜像同步**：随本批同步（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 通告）；版本 1.5.52 发版。

### 变更（ai-edit-diff：新增 /open-diff、/close-diff 命令与 close_diff 工具；配 VSCode 侧助手 diff-bridge）

- **为什么改**：2026-10-18 用户需求——diff 的「打开 / 关闭」升级为可直接键入的命令（`/open-diff`、`/close-diff`），并指出启用提示缺字（「正在干活的会话**会**收到文件变更通知」）。打开此前只有 AI 工具可调（`open_diff`）；关闭在 VSCode 没有官方外部接口（`code` CLI 无子命令、AppleScript 查不了 VSCode 窗口——实测报 -1728、UI 脚本抢焦点），需要 VSCode 内部配合。
- **改了什么**：① 全局 `~/.pi/agent/extensions/ai-edit-diff.ts`：`open_diff` 工具实现抽成共用流程 `runOpenDiffFlow`，新增 `/open-diff`、`/close-diff` 用户命令与 `close_diff` 工具；关闭走「请求 + 确认」协议——pi 写 `state/ai-edit-diff/close-requests/<id>.json` 并等 `close-acks/<id>-*.json`（首个确认后再等 400ms 收其它窗口、总上限 2 秒），汇总后回报；未装 / 未重载助手扩展时如实报告并提示；新增 `close-requests` / `close-acks` 状态目录与清理逻辑；修提示文案缺字。② 新建 VSCode 侧助手扩展项目 **diff-bridge**（`~/Developer/diff-bridge`，属 Kit 子项目、尚未开源）：每个 VSCode 窗口每 1 秒轮询请求目录，只关闭「左侧 = pi 改动前快照」的 diff 标签（`preserveFocus` 静默、不碰用户自己的对比视图），回写确认；含命令面板兜底命令与 `diff-bridge` 输出渠道；本地打包 vsix 已安装（`xhqing.diff-bridge@0.1.0`，窗口重载后生效）。③ 子项目映射同步：`claude/docs/agents-registry.md` 新增 diff-bridge 行（Kit 名下）、EA 项目「子项目清单」与 CHANGELOG 同步登记。
- **验证**：VSCode 侧 4 条场景（关闭全部 / 按路径过滤 / 陈旧请求不执行 / 非法请求不崩）与 pi 侧 5 条（注册 / 空候选提示 / 写请求与等待 / 带路径解析 / 模拟确认回报）全部通过（交付前临时验证脚本，正式测试用例归测试 Agent 出题）；两镜像 `diff` 逐字节一致。
- **回归风险评估**：仅新增（命令 / 工具 / 目录 / 清理），既有行为不动；`open_diff` 工具描述与流程未变（仅内部抽函数）；`close_diff` 列入只读工具集（运行期不抑制通知）。
- **镜像同步**：`ai-edit-diff.ts`、`docs/agents-registry.md` 两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（ai-edit-diff：取消会话启动时的「已启用改动可视化」提示）

- **为什么改**：2026-10-18 用户反馈——每次会话启动都弹一条「已启用『改动可视化』……」的说明太吵，不需要这条提示。
- **改了什么**：全局 `~/.pi/agent/extensions/ai-edit-diff.ts` 删除 `session_start` 里的启动通知（`ctx.ui.notify(...)` 三行），并补文件头改造记录；功能本身（变更通知 / `open_diff` / `/open-diff` / `/close-diff`）不受影响，只是不再在启动时提示。
- **回归风险评估**：仅删一条纯 UI 提示，不涉及任何机制逻辑；[1.5.53] 那条「修启用提示缺字」随本条一并作废（提示已不存在）。
- **镜像同步**：`ai-edit-diff.ts` 覆盖至 `pi/agent/extensions/`（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（ai-edit-diff 更名为 diff-view：功能定位是「独立于 git 的文件内容 diff 视图」）

- **为什么改**：2026-10-18 用户指出原名不严谨——「ai-edit-diff」把范围说窄成「AI 编辑产生的 diff」，但用户手改同样产生 diff；该扩展的实际定位是「独立于 git 的文件内容 diff 视图」（改动来源不限），据此更名为 `diff-view.ts`。
- **改了什么**：① 全局 `~/.pi/agent/extensions/ai-edit-diff.ts` → `diff-view.ts`（文件改名 + 头部新增定位说明与改名记录）；② 引用同步——`claude/docs/agents-registry.md`（diff-bridge 行）、`claude/docs/capability-sync.md`（镜像纳入说明）；③ 镜像侧同步：`pi/agent/extensions/ai-edit-diff.ts` → `diff-view.ts`；④ 下游引用同步：diff-bridge 仓库（README 双语 / `extension.js` 注释 / CHANGELOG，Kit 自行提交）、EA 项目（`CLAUDE.md` 子项目清单行 / `.pi/extensions/input-llm-dump.ts` 注释 / CHANGELOG）。
- **保持不变（有意）**：内部状态目录 `state/ai-edit-diff/`、环境变量名 `AI_EDIT_DIFF_*` 未动——已装的 VSCode 侧 diff-bridge 与正在运行的会话都指向它们，动了会打断「/close-diff 协作」；对外语义（工具 / 命令 / 通知）不受影响，仅文件名与文档引用更新。
- **回归风险评估**：纯改名与引用同步，无逻辑改动；`diff -q` 两镜像逐字节一致；全局无其他代码引用旧文件名。
- **镜像同步**：`diff-view.ts`（新）、`docs/agents-registry.md`、`docs/capability-sync.md` 三处覆盖至镜像；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（diff-view 整合：pi 侧组件源码迁入项目仓库，全局副本转为 install.sh 部署）

- **为什么改**：2026-10-18 用户决定——pi 侧扩展与 VSCode 侧扩展（原 diff-bridge）本是一个功能，整合进同一个项目 `diff-view`（Kit 名下子项目），下设 `diff-view-pie`（pi 侧）、`diff-view-vsce`（VSCode 侧）两个组件，都安装才是完整功能。
- **改了什么**：① 全局 `~/.pi/agent/extensions/diff-view.ts` 的源头迁至项目 `~/Developer/diff-view/diff-view-pie/diff-view.ts`（全局那份自此为 install.sh 部署副本；本批内容改动：`diff-bridge` → `diff-view-vsce` 名称引用、VSCode 扩展检测前缀改 `xhqing.diff-view-vsce`、头部新增归属与整合说明）；② `claude/docs/agents-registry.md` 子项目行更名（diff-bridge → diff-view，含两组件说明）；③ `claude/docs/capability-sync.md` 新增「特例：`diff-view.ts` 的源头在项目侧（2026-10-18 立）」一条；④ 镜像 `pi/agent/extensions/diff-view.ts` 随全局副本同步。
- **回归风险评估**：纯整合 + 名称 / 路径引用更新，无协议改动（状态目录 `state/ai-edit-diff/` 与环境变量 `AI_EDIT_DIFF_*` 有意保持，两侧组件都指向它们）；两镜像 `diff` 逐字节一致。
- **镜像同步**：`diff-view.ts`、`docs/agents-registry.md`、`docs/capability-sync.md` 三处覆盖；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

## 2026-10-17

### 变更（channels-watch 退役：从注册表移除）

- **为什么改**：2026-10-17 用户决定 channels-watch 项目退役、不再维护；本地侧已清理完毕（launchd 任务卸载关停、`~/Developer/channels-watch` 项目目录与生产副本 `~/.local/share/channels-watch` 均已删除）。
- **改了什么**：全局 `~/.claude/docs/agents-registry.md` 两处——① 命名表 Atlas 行「目前在手项目」列表移除 channels-watch（现为 ghostty-launcher、codef、pi、ghostty、mp4-player）；②「智能体专属文件归属与子项目映射」表删除 channels-watch 整行。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 逐字节一致；镜像行数 81 → 80。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；提交经 `/add` → `/commit` 流程执行。

### 变更（输出风格：汇报优先级规则同步）

- **为什么改**：2026-10-17 用户立规——汇报内容以当前用户给出的任务为主，其它程序触发的事件（自动巡检提醒、文件变更通知、后台任务完成、跨会话消息、系统注入事件等）简单汇报、一两句话带过；规则已落进全局 `~/.claude/CLAUDE.md`「输出风格」节（含日期标注）。
- **改了什么**：镜像 `claude/CLAUDE.md` 同步该条新增（+1 行）；全局源改动在本仓库之外、无需处理。
- **验证**：`diff ~/.claude/CLAUDE.md claude/CLAUDE.md` 逐字节一致。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；提交经 `/add` → `/commit` 流程执行。

### 变更（全局权威源迁移至 ~/.pi/agent/：镜像全量重同步）

- **为什么改**：2026-10-17 用户决定以 pi 为主、抛弃对 `~/.claude/` 的软链接依赖——全局规则与技能的真身迁至 `~/.pi/agent/`（`CLAUDE.md` / `skills/` / `docs/` / `patch/`，各文件内的旧路径引用已全部改写为新路径）；`~/.claude/` 原内容保留为遗留副本（不再维护），仅 `~/.claude/hooks/` 原位保留（Claude Code 侧守卫）。
- **改了什么**：按新版 `capability-sync.md` 口径（权威源 = `~/.pi/agent/` 的 skills / CLAUDE.md / docs / patch + `~/.claude/hooks/`）全量重同步镜像：`claude/CLAUDE.md`、`claude/skills/`（14 个 skill 的路径引用改写随载）、`claude/docs/`（含顶部新增「2026-10-17 权威源迁移」说明段的新版 capability-sync.md 与重写后的 agents-registry / new-agent-scaffold）、`claude/patch/`（含 refresh.py / restore.py 路径改写）；`pi/agent/extensions/` 的 `agent-call.ts`（REGISTRY 路径改为 `~/.pi/agent/docs/agents-registry.md`、提示语同步）与 `agent-wait-banner.ts`（注释）同步；`pi/agent/npm/` 清单经 `refresh.py` 刷新。镜像 `claude/` 目录名与来源目录解耦、保持不改。
- **验证**：`diff -r` 六部分全绿（CLAUDE.md / docs / skills / patch / hooks / extensions；豁免仅敏感文件与本机产物）；`python3 ~/.pi/agent/patch/npm-manifest/refresh.py --check` 通过。
- **镜像同步**：全量覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 通告）；提交经 `/add` → `/commit` 流程执行。

### 变更（TODO：登记文档口径更新待办 T2）

- **为什么改**：权威源迁移至 `~/.pi/agent/` 后，项目自有文档（根 `CLAUDE.md`、双 README、capability-manager skill）仍有大量 `~/.claude/` 旧口径，体量较大不宜并入本次同步批。
- **改了什么**：`TODO.md` 新增 🟡 节与 **T2**（文档权威源口径更新，含范围与新旧引用区分规则）。
- **验证**：TODO.md 节结构与编号（T2 = 项目内最大编号 + 1）符合规范。
- **镜像同步**：不涉及镜像（本项目自有文档）。

### 变更（skill-creator：pi 版触发评测脚本 + 去 CC 化文本同步）

- **为什么改**：本机已以 pi 为主，原触发评测脚本依赖 Claude Code CLI（`claude -p`）不可用；需要 pi 原生实现以继续做 description A/B 与触发率评测。
- **改了什么**：① 新增 `claude/skills/skill-creator/scripts/run_eval_pi.py`（`pi -p --mode json` 跑查询 + 事件流检测 SKILL.md 被读取；空响应检测 + 重试；默认隔离；`--description` 覆盖 A/B；`--dry-run`；本机实测 3/3 通过）；② SKILL.md 顶部加本地使用注记、「Description optimization」节加 pi 版引用块；③ `run_eval.py` / `improve_description.py` 文件头加 ⚠️ 使用注记；④ `eval-viewer/viewer.html` 提示语改为「agent session (e.g. pi)」。
- **验证**：镜像与全局逐字节一致（`__pycache__` 已排除）；gitleaks 全绿。
- **镜像同步**：随本批同步（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；版本 1.5.50 发版。

### 变更（settle-repo-check 脚本归位 + 去 CC 化文本批量）

- **为什么改**：① pi 启动时警告「Global hooks/ directory found. Hooks have been renamed to extensions」——`~/.pi/agent/hooks/` 目录名在 pi 中已废弃，被扩展调用的辅助脚本应统一放 `patch/` 下（对齐 session-sweep 等既有模式）；② 2026-10-17 用户立「去 CC 化」：全局文本中「CC 端实现」的对称叙述改为「pi 端为唯一实现」，`.claude/hooks` 相关改为「历史遗留」。
- **改了什么**：① settle-repo-check 脚本迁至 `~/.pi/agent/patch/settle-repo-check/settle-repo-check.py`（镜像新增 `claude/patch/settle-repo-check/` 目录），删除全局 `~/.pi/agent/hooks/`，引用全面更新（settle-repo-check 扩展、CLAUDE.md、agents-registry、capability-sync）；② 文本批量：`claude/CLAUDE.md`、docs 三件套、skills（commit / release / dev-workflow 含 references/test-cases、anysearch）、12 个 pi 扩展的注释；③ `capability-sync.md` 口径改为五部分（skills / CLAUDE.md / docs / patch + extensions），`claude/hooks/` 标记为历史遗留、不再维护、不参与逐字节比对。
- **验证**：五部分 diff 全绿（skills / CLAUDE.md / docs / patch / extensions）；hooks 已从比对范围移除。
- **镜像同步**：全量覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；提交经 `/add` → `/commit` 流程执行。

### 变更（session-sweep 提示语措辞修订）

- **为什么改**：2026-10-17 用户要求修订收尾巡视提示语——原句「看不见的后台会话 = 不存在」表达不严谨。
- **改了什么**：全局 `~/.pi/agent/extensions/session-sweep.ts` 第 85 行提示语改为「后台会话用户不可见」（仅此一句）；镜像同步同文件。
- **验证**：扩展目录 `diff -r` 一致；改动仅限该提示语措辞。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录；提交经 `/add` → `/commit` 流程执行。

### 变更（拟人名修订：Markowitz 更名 Mark）

- **为什么改**：2026-10-17 用户要求把量化 agent 拟人名 Markowitz 改为 Mark（项目名 QuantStrategistAgent 不变，取自 Harry Markowitz 的常用名）。
- **改了什么**：全局 `~/.pi/agent/docs/agents-registry.md`（注册表行 + 投资与交易小组段 + 子项目映射表 Intraday / Swing / gridtrader 三行）、`~/.pi/agent/CLAUDE.md`（QSAgent 缩写约定注）；镜像同步两文件。
- **验证**：两镜像 `diff` 逐字节一致。
- **镜像同步**：两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录；提交经 `/add` → `/commit` 流程执行。

### 变更（跨机协作：macmini 值班会话 + 能力层实时同步）

- **为什么改**：2026-10-17 用户决定把 Mark 整体迁到 macmini（单宿主），并建立「值班会话 + 实时同步」的跨机协作机制；同时立规「每个 Agent 只允许存在于一个宿主机；迁移 = 转移而非双活、原机器须清理活跃副本（归档即可）」。
- **改了什么**：① `claude/CLAUDE.md` 新增「跨机协作：macmini 值班会话」节（标准呼叫命令、用途、能力边界，含已迁移 Agent Mark 的呼叫方式）；② `claude/docs/agents-registry.md` 在「子项目映射」表前新增「宿主机归属」段（单宿主规则 + Mark 及子项目 Intraday / Swing / gridtrader 2026-10-17 迁至 macmini）；③ `claude/patch/` 新增 `duty-macmini/`（screen 常驻 + launchd 周期检查守护脚本，含 SCREENDIR 固定与 60 秒冷却——修复「3 小时拉起 85 个重复会话」事故）与 `sync-to-macmini/`（fs.watch 防抖 watcher + rsync 单向同步脚本，排除本机私有文件）。
- **验证**：镜像与全局逐字节一致（CLAUDE.md / docs / patch）；脚本语义预检无凭证 / 密钥（主机地址仅 ssh 别名）。
- **镜像同步**：随本批同步（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；版本 1.5.51 发版。

## 2026-10-15

### 变更（ai-edit-diff：自己的工具改动不通知自己——四层静默机制）

- **为什么改**：2026-10-15 用户立规——「某个会话通过工具改动或新增了某个文件内容，不需要通知自己，因为自己发起的改动或新增自己知道」。原实现只靠「工具声明（claim）+ 改动前快照落盘」一条路静默同步，四类情况仍会让轮询把自己的改动当成外部变更、以「来源未识别」通知自己：① 新增文件 / 镜像缺失时没有快照，收尾落盘根本不处理该路径；② 命令被误判为只读（典型：`npx prettier --write a.md` 里的文件名让只读关键词 `\bfile\b` 命中）、或脚本写了命令文本里没出现的文件（git checkout / 构建脚本 / 格式化工具）；③ 长任务超过声明 60 秒有效期；④ 后台任务在工具窗口之外写文件。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 四层保障——a) **工具运行登记**：tool_call 时登记 write/edit 的 path、bash/background_run 从命令里解析出的路径、未知工具输入里像路径的字符串；登记不要求文件已存在（覆盖新增文件）并记录 preHash；b) **运行期抑制**：本会话可能写文件的工具执行期间（声明每 20 秒刷新、长任务不过期），轮询检测到的变更一律静默同步、不通知；c) **结束收尾**：按 preHash 判定「真变了」才写 meta（归属自己）并更新镜像与自己已知状态，再做运行窗口内「清扫」——脚本写文件等路径不在工具输入里的情况一并静默同步；d) **后台任务窗口**：经 pi.events 的 `agent-wait-banner:activity` 与 background-tasks 扩展联动（窗口上限 10 分钟），窗口内变更同样静默。例外：变更记录明确指向别的会话 / 用户时照常通知（跨会话知情不受影响）。配套修正：只读关键词判定收紧（词后不允许跟「.」，修 `file.md` 类误判）、工具结束收尾不再要求「此前有快照」、claim 在收尾时全量清理（不再残留 60 秒）、agent_end 残留登记兜底清扫、新增文件创建的归属与跟踪。
- **验证**：一次性冒烟测试（EA 项目 `tmp/ai-edit-diff-test/`：mock pi API + esbuild 打包真实源码、状态目录隔离）10 项断言全部通过——自有脚本写入不通知、外部用户改动照常通知、别的会话改动即使自己工具在跑也照常通知、自己新增文件不通知且随后外部修改照常通知、空闲不打扰（只消化状态）、prettier 误判场景不通知；对照改动前版本同一测试 5 项失败（含「自己的脚本改动会通知自己」的复现）——修复真实生效。
- **回归风险评估**：跨会话知情不受影响（外部来源照常通知）；代价是工具运行窗口内外部来源的改动会被一并静默吞掉（窗口通常毫秒～秒级；长任务期间的外部改动可能错过，但之后读取该文件时读到的仍是最新内容）——属「自己的改动不通知自己」的固有边界，已写入扩展头部说明。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（ai-edit-diff：委派出去的活——被委派会话中间的改动静默）

- **为什么改**：2026-10-15 用户立规——「我委派出去的改动（agent_call / intercom 让别的会话做的）也不通知我；这种情况只需要在被委派会话最终完成的汇报通知你就行，中间由被委派的会话改动的文件不需要通知」。触发场景：Kit 委派 Prometheus 提交镜像时，其 `/bump` 同时 `edit` 了 VERSION / README / README_cn / CHANGELOG 四个文件，这些中间改动以「来源未识别」通知回了委派方会话。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 新增「委派窗口」——① 本会话调用 `agent_call` / `intercom`（send / ask / handover）时登记窗口（目标名字 / 会话 id / 目标目录 dir，窗口上限默认 1 小时、`AI_EDIT_DIFF_DELEGATE_MS` 可覆盖）；② 窗口内由被委派方产生的变更静默并入自己已知状态、不通知——归属匹配两条路：按会话 id（经 pi-intercom `list --json` 把名字解析成 id，注册时预热、每 60 秒刷新；`to` 直接给 id 时前缀匹配）与按目标目录兜底（对方没加载本扩展时归属显示「未识别」，只能按目录判断）；③ 阻塞式委派（agent_call ask / intercom ask / handover）返回后只保留 30 分钟尾随窗口（`AI_EDIT_DIFF_DELEGATE_GRACE_MS` 可覆盖）；工具报错（对方没连上等）立即撤销窗口。跨会话与用户改动照常通知。
- **验证**：冒烟测试扩到 15 项断言全部通过（新增 5 项：委派窗口内目标目录里静默、窗口过期后恢复通知、ask 返回后尾随窗口内静默、尾随窗口过后恢复、按会话 id 匹配目录外也静默）；对照上一版（v1.5.45）同测试恰为新增的 5 项失败——新逻辑真实生效。
- **回归风险评估**：既有 10 项断言全数保留通过（自己的改动静默 / 外部改动通知 / 空闲不打扰等均不受影响）；边界——窗口内落在目标目录里的外部改动（用户 / 其它会话）也会被一并静默，与工具运行窗口同源的取舍（窗口有上限、只作用于该目录）；委派窗口不持久化（重启会话即失效，最多是将中间改动恢复为通知，无害）。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（ai-edit-diff：委派窗口时长调整——覆盖隔夜处理、活动后自动关窗）

- **为什么改**：1.5.46 上线当日的实测——当晚 01:35 发出、注明「无需回复」的委派（Kit → Prometheus 提交镜像），对方次日 11:42 才动工（bump 流程 `edit` 了 CHANGELOG），中间改动仍以「来源未识别」通知到了委派方。暴露两个问题：① 原窗口上限 1 小时拦不住「隔夜才处理」的委派；② 光有上限、没有「对方干完就收」的机制，长窗口会长期静默目标目录。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 委派窗口两项调整——① 上限默认 1 小时 → **24 小时**（`AI_EDIT_DIFF_DELEGATE_MS` 可覆盖），覆盖对方隔夜 / 隔天才处理的情况；② 新增**活动后安静关窗**：窗口内每抑制一次对方的活动就刷新 `lastActivity`，安静超过 **30 分钟**即关窗、恢复常态通知（`AI_EDIT_DIFF_DELEGATE_IDLE_MS` 可覆盖）——对方这一波干完就收，不必等满上限。阻塞式返回后的 30 分钟尾随窗口与报错撤销不变。
- **验证**：冒烟测试扩到 16 项断言全部通过——新增两项：① 见过活动后安静期满（测试 0.6 秒）即关窗、恢复通知（发生在上限 2.5 秒之前，确证是安静关窗在起作用）；② 对方一直没动手时以上限（测试 2.5 秒）关窗、之后恢复通知。
- **回归风险评估**：既有 14 项断言全数通过；边界变化——委派的目标目录最长可静默 24 小时（此前 1 小时），但一旦对方开始动手，安静 30 分钟后就自动收；「目标目录内用户 / 其它会话改动被一并静默」的既有边界时长随之放大，属用户明确要的「中间过程不看、只看汇报」。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（agents-registry：Gatsby 升级为社媒运营官）

- **为什么改**：2026-10-14 用户决定——Gatsby（CommunityManagerAgent）从「社群运营官」升级为「社媒运营官」，运营范围从「微信社群（私域）」扩展为群主本人的社媒账号矩阵（YouTube——横向长视频 + 纵向中短视频 / 小红书——图文 + 纵向中短视频 / 公众号 / 小绿书 / 视频号——纵向中短视频 / 微信社群 / 个人微信朋友圈）；本会话（Kit）同时整理社媒运营知识素材交接给 Gatsby（落地进其项目级规则与 skill）。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：`docs/agents-registry.md` 两处——① 命名表 Gatsby 行：职位「社群运营官」→「社媒运营官」，职责描述更新为社媒矩阵（7 个产品，原社群运营内容保留）；② 团队结构段：Gatsby 段更新——「只做私域社群、不越界到公域」的旧限定废止（新角色跨公私域），改为「与 Buzz 的分工」：Buzz 负责数字产品销售的渠道引流内容（X / IG / YouTube / 小红书 / 知乎 / B 站），Gatsby 负责群主本人账号的长期运营与私域阵地——平台有重叠、任务不同。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 逐字节一致；新条目落在 `## 2026-10-15` 日期节内、日期标题不重复。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（Gatsby 项目更名为 SocialMediaManagerAgent）

- **为什么改**：2026-10-15 用户决定——Gatsby 角色已升级为「社媒运营官」，项目名 `CommunityManagerAgent`（含义为「社群运营」）与职责不再匹配，更名为与「社媒运营智能体」对应的 `SocialMediaManagerAgent`。
- **改了什么**：① GitHub 仓库改名为 `xhqing/SocialMediaManagerAgent`（旧 URL 自动重定向）+ 本地目录 `~/Developer/CommunityManagerAgent` → `~/Developer/SocialMediaManagerAgent`（git remote 已更新）；② 全局 `~/.claude/docs/agents-registry.md` 命名表 Gatsby 行项目名更新（描述补记更名历史）；③ 全局 `~/.pi/agent/extensions/version-guard.ts` 注释里的项目名更新（逻辑无硬编码，无需改）；④ 本机 `~/.pi/agent/trust.json` 信任路径更新（非镜像范围的本机状态文件）；⑤ 镜像同步：`claude/docs/agents-registry.md` 与 `pi/agent/extensions/version-guard.ts` 两文件覆盖。
- **验证**：两镜像 `diff` 逐字节一致；`gh repo view` 新名可访问、旧名重定向；新目录 git 工作区干净、`git fetch` 连通。
- **镜像同步**：两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（子项目映射：xhs-mentor-scam 移交 SocialMediaManagerAgent）

- **为什么改**：2026-10-15 用户决定——xhs-mentor-scam 项目移交 Gatsby（SocialMediaManagerAgent）负责、作为其子项目（原由 Kit / ExecutiveAssistantAgent 负责）。
- **改了什么**：全局 `~/.claude/docs/agents-registry.md` 子项目映射表 xhs-mentor-scam 行由 ExecutiveAssistantAgent（Kit）移至 SocialMediaManagerAgent（Gatsby），行内注明移交与 launchd 自动提交推送信息；期间修复了第一版编辑在表格中留下的空行（会中断 markdown 表格渲染）。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 逐字节一致；表格空行已删除、渲染连续。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus 记录（Kit 委派）；提交经 `/add` → `/commit` 流程执行。

## 2026-10-14

### 变更（子项目清单收缩：取消 8 个子项目 + xhs-mentor-scam 移出 EA tmp/）

- **为什么改**：2026-10-14 用户决定集中收缩子项目——取消 8 个不再维护的子项目（Wright 的 GitComic、agent-team-playbook-src；Atlas 的 zcode-cli、zcode-vsce、cmux-launcher；Alfred 的 ResourceMonitor；Kit 的 CyberRipple、blog）；另 xhs-mentor-scam 从 ExecutiveAssistantAgent 项目 `tmp/video` 迁出为独立开发目录 `~/Developer/xhs-mentor-scam`（与其配套：ai-edit-diff 同日新增 tmp/ 排除后，tmp/ 下文件不再产生变更通知，迁出后其编辑仍可被通知）。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：`docs/agents-registry.md`——① 命名表 Atlas 行「在手项目」清单更新（移除 zcode-cli / zcode-vsce / cmux-launcher）；② 子项目映射表移除上述 8 行、新增「已取消的子项目（2026-10-14 用户决定，不再维护）」注记（本地项目资料删除，GitHub 远端仓库保留为存档；CyberRipple 原未建远端仓库，其组织总览内容已并入 `xhqing` 主页 README）；③ xhs-mentor-scam 行路径更新（`ExecutiveAssistantAgent` 项目 `tmp/video` → `~/Developer/xhs-mentor-scam`）。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 逐字节一致；`~/Developer/xhs-mentor-scam` 存在；新条目落在 `## 2026-10-14` 日期节内、日期标题不重复。
- **镜像同步**：单文件覆盖（全局权威优先；由 EA 子会话执行）；本条 CHANGELOG 由 Prometheus（CapabilityManagerAgent 会话）补记。

### 变更（ai-edit-diff：tmp/ 目录与 monitor_log_ 前缀不再跟踪变更通知）

- **为什么改**：2026-10-14 港股 auto 盯盘实录——密采样日志 `tmp/monitor_log_*.csv` 每 40 秒写入一次，被 ai-edit-diff 记为「外部变更」→ 每个采样段产生数条「文件变更通知」，单场盯盘积压上百条（每条触发一个 AI 回合，收盘后仍在逐条补发）。用户裁定加排除规则（治本）。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 两处——① `SKIP_SEGMENTS` 新增 `${path.sep}tmp${path.sep}` 与 `${path.sep}monitor_log_`（新登记被排除：`tmp/` 目录整体不做变更跟踪，`monitor_log_` 前缀兜底覆盖 tmp/ 以外的同款日志）；② `loadTouched()` 加载时加 `shouldTrack(p)` 过滤——重启后旧登记里的已排除路径直接丢弃，避免残留检测。
- **验证**：`node --experimental-strip-types --check` 语法通过；逻辑核对——`tmp/monitor_log_*.csv` 命中 `/tmp/` 段 → `shouldTrack` 返回 false（已确认 `.csv` 在 `TEXT_EXT` 内、段匹配生效）。
- **回归风险评估**：`tmp/` 下的文件不再产生变更通知（符合预期——临时产物与运行日志本不需要改聊提醒）；其它路径的跟踪与通知不受影响；`loadTouched` 过滤对已删除文件同样返回 false（本就无需跟踪）。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 DayTradingAgent（Victor 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（pi background-tasks 扩展：完成通知不再显示 + AI 忙时聚合——通知消费不占用户窗口）

- **为什么改**：用户 2026-10-14 要求「消费积压的通知队列在后台完成、不要在会话窗口输出（这个是不需要用户感知的动作）」。背景：2026-10-13 一次美股盯盘连续跑了 380+ 个密采样段后台任务，收盘后积压的完成通知被 pi 逐条放送、每条各触发一轮 AI 回复，会话窗口被「bg-N 确认」刷屏。通知的本质是「唤醒 AI 的信号」，不是给用户看的内容。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`background-tasks.ts` 两项行为——① 通知消息 `display: false`：不渲染到会话窗口（pi 语义：仍进 AI 上下文、仍触发唤醒）；② **忙时聚合**：AI 干活期间（`agent_start`..`agent_settled`）完成的任务不逐条投递、静默积攒（pending 缓冲），AI 空闲后合并为**一条摘要**发出——单条任务照旧附输出尾部；合并批次只列 id / 状态 / 日志路径、不带尾部（AI 按需读日志，避免上下文被过期尾部灌满）。配套：任务启动失败通知同走聚合路径；`session_shutdown` / `session_start` 清理缓冲与定时器。
- **验证**：`/reload` 热载后实测三场景（DayTradingAgent 会话）——① 单任务（AI 空闲等待）：任务完成后约 1.2 秒聚合窗口即被唤醒、单条通知带输出尾部照常；② 忙时聚合（核心场景）：3 个 8 秒任务全部在 AI 的 14 秒忙碌窗口内完成 → 期间零打扰、AI settle 后收到**一条 3 行合并摘要**（该文本格式旧代码不可能产出，确证新逻辑生效）；③ `background_list` / `background_stop` 与 agent-wait-banner 活动上报不受影响。
- **回归风险评估**：正常「空闲等待 → 任务完成 → 唤醒」循环节奏不变（新增 1.2 秒聚合窗口）；忙时通知延迟至 settle 后投递、不丢通知；单条场景的通知内容（含输出尾部）不减；密采样段循环等既有工作流不受影响。
- **镜像同步**：单文件覆盖（全局权威优先）。本条 CHANGELOG 由 DayTradingAgent（Victor 会话）记录；工作区另含未提交的 1.5.37 批次（2026-10-13，Kit / Atlas 会话准备），版本 bump 与提交 / 发版一并委派 Prometheus（CapabilityManagerAgent 会话）执行（最终按三批合并处理、发行为 v1.5.38）。

### 变更（ai-edit-diff：变更通知新增「先判断相关性、再决定是否读取」）

- **为什么改**：用户 2026-10-14 指出——变更通知目前一律提示「重新读取该文件」，但收到通知的会话可能正在处理与这个文件无关的任务；一旦按要求去读，无关文件的新内容就进了上下文、干扰当前任务。要求：会话收到 file-change-notify 后先判断当前任务是否用得到该文件，大概率无关就不读新变更内容；判断依据可看文件名、文件在项目结构中的位置（用户所称「项目 schema 文件」的所在位置——即 .git / CLAUDE.md / AGENTS.md / package.json 这类项目标识文件圈定的项目归属）、以及上下文里有没有该文件变更前的内容。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 三项——① 通知消息由「直接要求重读」改为「先判断、再决定读不读」：新增三行判断依据（「文件位置」按项目标识文件定位所属项目、与本会话当前项目比对；「上下文提示」区分本会话此前是直接读过 / 直接编辑过 / 仅在 shell 命令里访问过 / 未记录读过；「相关度参考」给中高 / 偏低 / 不确定），动作写成四步（判断依据 → 大概率无关则不读、不调整任务方向 → 相关或拿不准才重读 → 若之后要改它先读最新、避免覆盖）；② touched 记录新增「触碰来源」src（read / edit / bash-read / bash-write / unknown，只升不降——保留最强的来往信号），重启恢复的旧记录无 src 时按 unknown 处理；③ 新增 `findProjectRoot()` / `relevanceFacts()` 辅助函数（项目根定位 + 三行判断依据生成），头部注释追加本次改造记录。
- **验证**：一次性端到端脚本（EA 项目 `tmp/ai-edit-diff-verify/verify-notify.mjs`：mock pi + jiti 加载真实扩展源码驱动），19 项断言全部通过——① 直接读过 + 同项目变更 → 「直接读过」「中高」与四步判断齐备、旧版无条件重读文案已移除；② 仅 bash 访问 + 其它项目变更 → 「仅在 shell 命令里访问过」「偏低」；③ 无 src 的旧记录（兼容路径）→ 「未记录到本会话读过」；④ 自己编辑不触发自通知、touched 的 src 正确持久化（read / bash-read / edit）；⑤ 扩展经 jiti 加载无报错。
- **回归风险评估**：通知的产生条件（谁、何时收到）不变，只改消息内容与判断辅助；「一律重读」改为「先判断」——若接收会话误判「无关」，代价是暂时不更新旧内容认知，但之后真正用到该文件时读到的即最新内容、且此后每次变更仍会再通知，不会永久错过；跨项目 / 弱关联文件正是此前的主要噪音来源，默认不读符合预期。旧 touched 记录无 src 字段向后兼容（按未知处理，只影响提示措辞）。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit 会话暂记，版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 移除（win-ai-monitor skill 删除——Win 设备弃用）

- **为什么改**：2026-10-14 用户明确「win-ai 那个全局 skill 可以删除掉，现在不用那台 Win 设备了」——局域网 Windows 机器（win-ai / win-ai-admin）及其远程操作 / GUI 投递 / CDP 自动化等用途全部弃用，该设备专属 skill 失去存在意义；连带清理全局 CLAUDE.md 中的 win-ai 专属条文（skill 引用与「Windows SSH（win-ai）红线」节），避免留下悬空引用与失效规矩。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：① 删除全局 skill `~/.claude/skills/win-ai-monitor/`（`~/.pi/agent/skills/` 为指向全局的符号链接，自动跟随）；② 全局 `CLAUDE.md`——「工作规则」开头括号句删去「win-ai SSH 的完整细则随 win-ai-monitor skill 加载」，整节删除「### Windows SSH（win-ai）红线」（连接规范 3 条）；③ 镜像同步：删除 `claude/skills/win-ai-monitor/`、覆盖 `claude/CLAUDE.md`。全局与镜像两侧 live 配置全量 grep 确认无 win-ai 残留（仅剩历史归档性质的 file-history 与 CHANGELOG 记录）。
- **验证**：两侧 `skills/` 目录均无 win-ai-monitor；`diff ~/.claude/CLAUDE.md claude/CLAUDE.md` 逐字节一致；新条目落在 `## 2026-10-14` 日期节内、日期标题不重复。
- **回归风险评估**：win-ai-monitor 记载的是该设备专属的 SSH / 桌面代理 / CDP 经验，设备弃用后无调用场景；CLAUDE.md 删掉的是 win-ai 专属红线，通用规则（文件操作、tmp、汇报前验证、运行隔离、VSCode 远程窗口等）不受影响；如需恢复，skill 与旧版条文均在本仓库 git 历史中（删除前快照另存于本机 ai-edit-diff snapshots）。
- **镜像同步**：目录删除 + 单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 新增（本机屏幕焦点守卫：焦点抢夺硬拦截——CC 钩子规则 9 + pi 扩展 focus-guard）

- **为什么改**：2026-10-14 用户立规「本机焦点禁止抢夺」（起因：AI 为排查 codef 故障在本机反复置顶窗口、开菜单、点平铺项，连续打断用户操作）；需要做此类测试时改去 macmini（`ssh mac-mini`）或找 cuAgent（唯一获准在本机用 computer-use 的 agent）。
- **改了什么**（全局 `~/.claude/` + `~/.pi/agent/` 权威源 → 镜像）：① `CLAUDE.md` 新增小节「本机屏幕焦点禁止抢夺」（与「VSCode 进程与远程窗口」节并列；含禁令、替代路径、逃生门标记 `AI_AUTHORIZED_LOCAL_FOCUS`、双端强制说明）；② `hooks/pre-tool-use-guard.sh` 新增规则 9（本地 `osascript` + 焦点 / UI 动词拦截；本地直接调用 `codef` 拦截〔`--version` 除外〕；命令含 `ssh` 视为远端放行；与 pi 端同源）；③ `pi/agent/extensions/focus-guard.ts` 新增（pi 端工具强制，判定逻辑与规则 9 同源）。
- **验证**（Atlas 侧）：CC 钩子 11 个应拦截载荷全部 DENY、7 个应放行场景全部 ALLOW、旧规则（杀 VSC / git commit / kdbx）回归正常；镜像六部分 diff 除本三处外无分叉。
- **镜像同步**：三处已按「全局权威优先」覆盖，diff 逐字节一致；本条 CHANGELOG 由 Prometheus（CapabilityManagerAgent 会话）补记。

### 变更（focus-guard 扩展：open 代开网页页面纳入本机焦点拦截——给链接、不代开）

- **为什么改**：2026-10-14 当晚用户追加立规——AI 在用户正看别的东西时用 `open` 打开了 tokenplus 页面，抢走屏幕焦点（用户原话「下次不要帮我打开网页页面，给我链接就行」「打开页面操作会抢我的焦点，我正在看另一个东西」）。这是当日早些时候「本机屏幕焦点禁止抢夺」立规的同主题延伸：原规只拦 `osascript` 焦点操控与 `codef`，未覆盖「AI 主动代开网页」这个高频场景；约定改为「要给用户看的网页，把链接原文发给他、让他自己点开」。
- **改了什么**（全局 `~/.claude/` 与 `~/.pi/agent/extensions/` 权威源 → 镜像，三处）：① `CLAUDE.md`「本机屏幕焦点禁止抢夺」节——「本机禁止」条增补「用 `open` 代开网页页面（`open http(s)://…`、本地 `.html`——浏览器 / 预览窗口会被带到前台抢走焦点）」，并新增一条「网页一律给链接原文、不要代开」的约定（含起因原话）；② `hooks/pre-tool-use-guard.sh` 规则 9——新增第三类拦截：命令段以 `open` 起头且含 URL（http/https/file）或本地 `.html` 文件则 deny（逃生门沿用 `AI_AUTHORIZED_LOCAL_FOCUS`；与 pi 端同源）；③ `pi/agent/extensions/focus-guard.ts`——同源新增 `OPEN_START_RE` / `WEB_TARGET_RE` 判定与 `OPEN_URL_DENY` 文案。
- **验证**：`bash -n` 双端语法通过；CC 端行为测试——`open https://…` → deny、`open ~/Downloads` → 放行、`echo "open https://…"` → 放行；pi 端正则行为测试 10 用例全部通过（含 `open "https://…"`、`open -a "Google Chrome" …`、`open file:///…`、`open notes.html` 应拦，`open ~/Downloads`、行内文本、`cat`、`ssh mac-mini 'open …'` 应放行）；`diff` 复核三文件全局 × 镜像逐字节一致。
- **回归风险评估**：判定限定「命令段以 `open` 起头 + 目标是网页页面」——打开文件夹 / 应用、文本中出现的 open、远端（含 ssh）命令、以及用户当场授权（带 `AI_AUTHORIZED_LOCAL_FOCUS` 标记）的操作均照常放行；`osascript` / `codef` 既有拦截不受影响。
- **镜像同步**：三文件覆盖（全局权威优先；本次同步由外部机制先行完成——Kit 会话复核 `diff` 逐字节一致）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 修复（session-guard：kill-session 判定收紧——修「命令文本里出现关键词即误伤」）

- **为什么改**：2026-10-14 晚间实测误伤——一条只读排查命令（同一 bash 命令里既有 `tmux list-sessions`、又有文本性质的 `kill-session` 字样）被 pi 端 session-guard 误判为 `tmux kill-session` 真命令而拦截（报「未指定名字」）。根因：pi 端正则 `tmux\s+(\S+\s+)*?kill-session` 允许 tmux 与 kill-session 之间跨越任意词元（含 `|`、`;`、引号文本），只要命令里同时出现两处字样即可能触发；而 CC 端规则 8 本就是紧凑形式（`tmux` + 选项 + `kill-session` 紧邻），两端判定不一致。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`session-guard.ts` 的 `TMUX_KILL_SESSION` 收紧为 `/(^|[^A-Za-z0-9_])tmux\s+(-\S+\s+)*kill-session([^A-Za-z0-9_-]|$)/`——对齐 CC 端规则 8 的紧凑判定（拦截真命令的行为不变，仅消除跨段 / 文本误伤）；注释补充本次修正与误伤案例说明。
- **验证**：8 用例全过——真命令拦截 3 例（`tmux kill-session`、`tmux -q kill-session`、多选项形式）行为不变；`pi-` 前缀与 `AI_AUTHORIZED_SESSION_KILL` 标记照常放行；核心误伤场景（`tmux list-sessions …` + 文本 `kill-session`）对比：旧误拦 → 新放行。`node --experimental-strip-types --check` 语法通过；镜像 `diff` 逐字节一致。
- **回归风险评估**：真命令拦截面不变；放行面不变；仅消除「非紧凑共存关键词」的误伤。已知边界（与 CC 端一致、未扩）：`tmux -L sock kill-session`（选项带值）这类写法两端都不拦（AI 少见；如需覆盖可另立条目）。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（焦点规则口径澄清：未经授权禁止、取得当次授权可执行——文案同步，判定逻辑不变）

- **为什么改**：2026-10-14 深夜用户澄清口径——「你可以跑抢焦点的程序，**前提是拿到我的授权**」：本机执行不是被绝对禁止，而是必须先取得用户**当次**授权；cuAgent 是「需要使用 computer-use 能力（看屏 / 真实点击拖拽）」时的专门通道，普通脚本测试用不上；macmini 则是「不想打扰用户」时的备选。据此修正三处文案（**判定逻辑不变**，拦截范围 / 标记放行 / ssh 放行均照旧）。
- **改了什么**（全局 `~/.claude/` 与 `~/.pi/agent/extensions/` 权威源 → 镜像）：① `CLAUDE.md` 该节标题改为「未经授权禁止；取得当次授权可执行」、正文加澄清句、「执行方式（按优先级）」重写（① 本机授权执行 → ② macmini → ③ cuAgent 仅限 computer-use 类能力）、补「未获授权不得执行」条；② `hooks/pre-tool-use-guard.sh` 规则 9 注释与两条 deny 文案同步新口径；③ `pi/agent/extensions/focus-guard.ts` 文档块与 deny 文案同步。
- **验证**（Atlas 侧）：hook 语法检查通过；11 个应拦截载荷全部 DENY、7 个应放行场景全部 ALLOW；pi 扩展 `node --experimental-strip-types --check` 通过；三处与全局权威源逐字节一致。
- **镜像同步**：三处覆盖（全局权威优先）；本条 CHANGELOG 由 Prometheus（CapabilityManagerAgent 会话）补记。

### 变更（ai-edit-diff：变更通知只发给「任务进行中」的会话——已完成任务、等用户的会话不打扰）

- **为什么改**：2026-10-14 用户指出——已完成当前任务、在等用户过目汇报的会话不需要接收文件变更通知：这类会话任务状态已经完成，只需要等用户下一步指示；通知的目的是让「任务做到一半」的会话更新到最新信息继续完成任务，对已完成的会话是纯打扰（通知还会把空闲会话直接唤醒、多跑一轮无谓回合）。要求：对已完成任务的会话不发通知、不需要它做任何动作。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 四处——① 通知加「任务进行中」闸门：`handleChange` 里只在 `isAgentWorking()`（新增辅助：`ctx.isIdle() === false`；`session_start` 保存 ctx 引用供轮询期调用）时才发通知；已完成任务、在等用户（或等外部回信 / 后台任务）的空闲会话不发——变更只消化进它的已知状态（`touchSet` 照常执行），等用户下一步指示后新任务用到该文件时自然读到最新内容；② 通知消息去掉 `triggerTurn: true`——彻底关掉「通知把空闲会话唤醒跑一轮」的可能（消息以 steer 排队、在下一个 LLM 调用前投递；即便时序上恰好空闲也只静静排队、不触发回合）；③ 头部注释 B) 与启动提示文案同步新语义；④ 即时 poll 的注释更新（恢复会话时只消化缺席期间变更，不通知）。
- **验证**：`bun build --external='*'` 语法通过；端到端 mock 实测 8 项断言全过（EA 项目 `tmp/ai-edit-diff-verify/verify-idle-gate.mjs`：mock pi + jiti 加载真实扩展源码、可切换 `ctx.isIdle()`）——① 空闲时变更不发通知、且变更已消化进 touched 已知状态；② 忙碌时变更照常发通知（内容 / customType / 不带 triggerTurn 均正确）；③ 再次空闲变更仍不通知；④ 忙碌时文件删除同样走通知（含「文件已被删除」状态）。空闲检测失败按「不通知」安全侧兜底（返回 false）。
- **回归风险评估**：任务进行中的会话照常收到通知（主要场景不变）；空闲会话的变更不再即时提醒——但变更被消化进已知状态、后续任务用到该文件时读到的即最新内容，且会话重新进入任务后其文件仍会被轮询、此后每次变更照常通知，不会永久错过。边界：等外部回信 / 后台任务期间（agent 已 settle、尚未被唤醒）的变更也不通知——如需「等回信时也提醒」可后续细化（监听后台活动事件）；当前按用户「任务状态已完成 / 未完成」的简单口径处理。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit（ExecutiveAssistantAgent 会话）记录；版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

## 2026-10-13

### 变更（agents-registry 子项目映射表：Atlas 子项目更名回退 codefs → codef）

- **为什么改**：用户 2026-10-13 明确——codef 项目保持原名与命令命名（`codef` / `codef left` / `codef --version`，仅新增 `--version`），早些时候的「codef 更名 codefs」及对应登记需整体回退。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：`docs/agents-registry.md` 子项目映射表 Atlas 行名称与开发目录路径回退（`codefs` / `~/Developer/codefs` → `codef` / `~/Developer/codef`）；`docs/repo-branch-protection.md` 已开保护仓库清单同步仓库名回退（`xhqing/codefs` → `xhqing/codef`）。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 与 `diff ~/.claude/docs/repo-branch-protection.md claude/docs/repo-branch-protection.md` 逐字节一致；新条目落在 `## 2026-10-13` 日期节内、日期标题不重复。
- **镜像同步**：两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Atlas 会话记录（命名回退同步），提交流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（ai-edit-diff：bash 路径解析改为按命令内实际的 cd 目录）

- **为什么改**：用户 2026-10-13 指出：bash 命令里的相对路径不能按会话工作目录硬解析（那是错判），应看命令里实际的 `cd` 目录；带绝对路径的文件才是天然可靠的判断。起因是本机实测到一次误通知：会话执行 `cd <pi 安装目录> && head CHANGELOG.md` 时，相对路径 `CHANGELOG.md` 被解析成会话工作目录下的同名文件（ExecutiveAssistantAgent 项目的 CHANGELOG.md），使该文件被误登记为「碰过」、后续变更通知打扰了无关会话。
- **改了什么**（全局 `~/.pi/agent/extensions/` 权威源 → 镜像）：`ai-edit-diff.ts` 的 `extractPaths()` 改为逐段扫描 bash 命令（按 shell 分隔符切段）、跟踪命令内实际的 `cd` 目录解析相对路径；绝对路径与 `~/` 路径不受 cd 影响、始终采用；当前目录无法静态确定（`cd $VAR` / `cd -` / 命令替换等）时**跳过**相对路径——宁可漏记、不再错记。新增 `resolveCdTarget()`：解析 cd 目标——跳过 `-P` / `-L` / `--` 等选项、支持引号路径、识别 `~`（家目录）与裸 `cd`；无法识别的形态返回 null（其后相对路径不登记）。头部注释追加 2026-10-13 改造记录。
- **验证**：① 从源文件抽取函数跑 19 条用例全部通过（cd 后相对路径按 cd 解析、无 cd 时保持原行为、绝对 / 波浪号路径、`cd $VAR` 与 `cd -` 跳过、`cd -P` 选项、含空格引号路径、子 shell 形式、裸 cd 等）；② 两次真实 `pi -p` 会话端到端实测——会话 cwd 为 ExecutiveAssistantAgent 时执行 `cd /opt/.../pi-coding-agent && head -5 CHANGELOG.md` 不再产生 EA 项目文件的误登记（旧版会误记 `CHANGELOG.md`）；对照组 `cd /tmp/.../probe && head -3 probe.md` 的 touched 记录正确为 `/tmp/.../probe/probe.md`。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit 会话暂记，版本 bump 与提交 / 发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行——最终按三批合并处理、随 v1.5.38 一并发行（未单独发 1.5.37）。

### 变更（agents-registry 子项目映射表：Atlas 子项目 codef 更名 codefs）

- **为什么改**：用户 2026-10-13 决定把 codef 项目（命令 / 脚本 / GitHub 仓库 / 本地开发目录）统一更名 codefs，登记侧（全局映射表与分支保护清单）需随更。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：`docs/agents-registry.md` 子项目映射表 Atlas 行名称与开发目录路径更新（`codef` / `~/Developer/codef` → `codefs` / `~/Developer/codefs`）；`docs/repo-branch-protection.md` 已开保护仓库清单同步仓库名（`xhqing/codef` → `xhqing/codefs`）。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 与 `diff ~/.claude/docs/repo-branch-protection.md claude/docs/repo-branch-protection.md` 逐字节一致；新条目落在 `## 2026-10-13` 日期节内、日期标题不重复。
- **镜像同步**：两文件覆盖（全局权威优先）；本条 CHANGELOG 由 Atlas 会话记录（codefs 改名同步），提交流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（发版门禁收紧：仅 fix / feat 类改动触发自动发版）

- **为什么改**：2026-10-12 pi 仓库一个「文档迁移 + 版本号 bump」的纯文件改动 PR 合并后触发了自动发版链（发出 v0.0.5）——用户 2026-10-13 裁定：「以后这种文件改动不应该触发发版流程，只有 fix 和 feat 核心功能的修复和新增核心功能才触发发版」。原门禁只看「自最新 tag 有新提交」，文档 / 杂事类提交也会驱动 bump + Release：发版噪音大、版本号被非功能改动推着走。
- **改了什么**（全局 `~/.claude/` 权威源）：
  - `skills/commit/SKILL.md`：第 10 步新增「内容性质判定」关卡（判定与动作改三步）——机械层扫 fix / feat conventional 前缀（`git log --no-merges <tag>..HEAD`），无命中再走语义层判读（明确为功能修复 / 新增才命中、拿不准按不命中；发版链内部延续豁免防死锁）；纯文档 / 杂事类不发版、不触发 bump，汇报说明。9j 版本滞后检测同口径分流（非功能类新提交不算「滞后」问题）；核心定位 / 汇报 / 例外清单与 description 同步。
  - `skills/bump/SKILL.md`：description 与「边界」补自动衔接门禁（仅自最新 tag 含 fix / feat 类改动时由第 10 步衔接；用户主动 `/bump` 不受限）。
  - `skills/release/SKILL.md`：description 与「授权语义」补同一门禁与边界（门禁只约束来源 2 自动衔接；用户主动 `/release` 不受限——显式发版意图即授权）。
  - `skills/add/SKILL.md`：自动衔接 commit 链条说明补发版条件收紧注记。
  - `skills/dev-workflow/SKILL.md`：第 10 步入口表述同步（「有新提交（含 fix / feat 类改动）但未 bump」）。
  - `CLAUDE.md`：「Git 写操作必须先征得同意」段三处自动发版链描述补门禁。
- **验证**：`check_description.py` 四个受影响 skill 描述均 PASS（commit 1006/1024）；`diff -r ~/.claude/skills claude/skills` 与 `diff ~/.claude/CLAUDE.md claude/CLAUDE.md` 仅剩已知私有 / 本机产物差异（anysearch `.env`、backup `endpoints.json`、`__pycache__`），六文件逐字节一致。
- **镜像同步**：六文件已按「全局权威优先」覆盖；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（agents-registry 子项目映射表：新增 ExecutiveAssistantAgent → xhs-mentor-scam）

- **为什么改**：用户 2026-10-13 指定——小红书陪跑反诈视频项目（独立仓库位于 ExecutiveAssistantAgent 项目 `tmp/video`）归 Kit（ExecutiveAssistantAgent）负责；按「新增 / 变更子项目时同步更新映射表与对应 Agent 项目子项目清单」规则登记（Agent 项目侧同步见该仓库 CHANGELOG）。
- **改了什么**（全局 `~/.claude/` 权威源 → 镜像）：`docs/agents-registry.md` 子项目映射表 ExecutiveAssistantAgent（Kit）名下新增 `xhs-mentor-scam` 行（小红书「陪跑 / 带教」反诈视频项目材料，私人仓库；独立 git 仓库位于 ExecutiveAssistantAgent 项目 `tmp/video`，绑定 GitHub 私有远程持续备份）。
- **验证**：`diff ~/.claude/docs/agents-registry.md claude/docs/agents-registry.md` 逐字节一致；新条目落在 `## 2026-10-13` 日期节内、日期标题不重复。
- **镜像同步**：单文件覆盖（全局权威优先）；本条 CHANGELOG 由 Kit 会话暂记，提交流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

## 2026-10-12

### 变更（scroll-reverser skill：补「beta 自动更新后重启中断」失灵形态）

- **为什么改**：2026-10-12 用户报「滚动方向总是不对」。Kit 会话按该 skill 流程诊断：app 进程不在运行、主开关 `InvertScrollingOn=0`；plist 佐证 `SUUpdateRelaunchingMarker=1`、`SULastCheckTime` 为前一日晚间——与 10-11 beta 通道自动更新（build 10528 → 10558）后重启流程未完成相符。该形态（自动更新后 app 未重启回来）是 skill 失灵流程第 1 步「app 没在运行」此前未记述的实例（原只写「重启后自启失败」）。
- **改了什么**：`claude/skills/scroll-reverser/SKILL.md` 第 1 步括注补「beta 自动更新后重启中断也曾见」一句；本机快照 `~/.claude/skills/scroll-reverser/local/config.md`（本机私有数据、不进镜像）同步更新——版本 10528 → 10558、追加 2026-10-12 诊断与修复记录及单次观察（含 `SUUpdateRelaunchingMarker` 残留待留意）。
- **验证**：修复实测通过——启动 app + `set enabled to true` 后 `enabled=true`、`InvertScrollingOn=1`；干净重启 app 复验：进程在、开关保持 true、其余配置键均符合本机应然值。
- **镜像同步**：`claude/skills/scroll-reverser/SKILL.md` 已按「全局权威优先」覆盖，diff 与全局逐字节一致（本机数据 config.md 按规矩不进镜像）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（镜像口径明确化：pi 扩展镜像不含项目专用扩展）

- **为什么改**：2026-10-12 Prometheus 七类复核时发现全局 `~/.pi/agent/extensions/user-edit-notify.ts`（EA（ExecutiveAssistantAgent）专用的主文件编辑通知扩展——监听 EA 项目 `tmp/video/voice-script.md`、仅 EA 会话激活、含硬编码本机路径，2026-10-11 建）未镜像、上报待确认。Kit 会话核查判定：该扩展属「项目专用机制」而非通用能力（现有 14 个镜像扩展均无项目硬编码），直接镜像对 clone 者无意义、且带出 EA 项目工作流细节，故不纳入镜像；同时将判定明确进同步口径，避免每次复核重复报警。
- **改了什么**：`claude/docs/capability-sync.md` 两处——「范围」段 pi 扩展括注补「项目专用扩展不纳入镜像」判定标准（含特定项目硬编码路径 / 仅单项目会话激活）与现例（含「如需纳入应先改造为通用形式」引导）；「怎么验证」段允许差异清单补该项、pi 扩展 diff 命令补 `-x 'user-edit-notify.ts'` 排除。
- **验证**：`diff -r -x 'user-edit-notify.ts' ~/.pi/agent/extensions pi/agent/extensions` 通过（14 个通用扩展无差异）；`claude/docs/capability-sync.md` 与全局 diff 逐字节一致。
- **镜像同步**：`claude/docs/capability-sync.md` 已按「全局权威优先」覆盖；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（capability-manager skill 口径对齐：pi 扩展镜像剔除项目专用扩展）

- **为什么改**：2026-10-12 `capability-sync.md` 明确「pi 扩展镜像不含项目专用扩展」后，本项目专属 skill `capability-manager` 的操作命令仍按旧口径全量处理——`cp ~/.pi/agent/extensions/*.ts` 会把 EA 专用的 `user-edit-notify.ts` 复制进镜像（违反新规）、两处 `diff -r` 与巡检脚本会对其误报 ❌。与 v1.5.21 第七类对齐同一手法，一并补齐。
- **改了什么**（`.claude/skills/capability-manager/`，项目专属 skill、不进全局 / 不进镜像）：
  - `references/sync-flow.md`：情形 1 的 pi 扩展 cp 改为带排除的循环（`user-edit-notify.ts` 列为排除项、注明新增项目专用扩展时补行）；一致性核对与巡检脚本的 pi 扩展 diff 补 `-x 'user-edit-notify.ts'`；合法差异表新增「pi 扩展目录下的项目专用扩展」一行。
  - `SKILL.md`：同步范围 bullet 的 pi 扩展括注补「项目专用扩展（含项目硬编码 / 仅单项目激活）不进镜像」。
  - `references/content-lifecycle.md`：判断矩阵 pi 端扩展行补「项目专用扩展不经镜像」。
- **验证**：按 skill 内新巡检命令试跑通过（`diff -r -x 'user-edit-notify.ts' …` ✅）；逐文件 grep 复核排除项覆盖 cp / diff / 巡检 / 表格 / 说明共六处。

### 变更（scroll-reverser skill 移出通用能力范围：转为 EA 项目专属 skill）

- **为什么改**：2026-10-12 用户决定把 scroll-reverser skill 从全局通用能力转为 ExecutiveAssistantAgent（Kit）的**项目专属 skill**——它维护的是本机这台 Mac 的滚动方向工具，归 EA 项目语义上更贴切；迁移后不再占用全局能力、不再参与镜像同步链，后续维护随 EA 仓库走。
- **改了什么**：① 全局下线：删除 `~/.claude/skills/scroll-reverser/` 与 `~/.pi/agent/skills/scroll-reverser/`（内容已完整迁至 `~/Developer/ExecutiveAssistantAgent/.pi/skills/scroll-reverser/`；本机数据 `local/config.md` 随迁、由 EA 的 `.gitignore` 忽略，仅 `local/README.md` 入库作说明）。② 镜像同步删除：本仓库 `claude/skills/scroll-reverser/` 移除；`.gitignore` 中该 skill 的 `local/` 忽略条目一并清理。③ 引用清理：capability-manager 的 `SKILL.md` 与 `references/sync-flow.md` 三处「本机数据差异」示例由 scroll-reverser 改为 backup/endpoints（该 skill 已不在同步范围，示例随之更新）。
- **验证**：全局与镜像两侧均不再含 scroll-reverser（diff 复核）；EA 侧 `.pi/skills/scroll-reverser/` 结构完整（SKILL.md / references/guide.md / local/README.md 入库、local/config.md 被忽略）。
- **镜像同步**：本仓库删除与引用更新已由 Kit 会话完成；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（镜像新增 ai-edit-diff 扩展；user-edit-notify 排除模式兼容 .disabled）

- **为什么改**：2026-10-12 Prometheus 复核时发现全局新增通用扩展 `ai-edit-diff.ts`（「改动可视化 / 双向知情」，与 git 无关、任何项目可用——10-11 建立、是 EA 专用 `user-edit-notify.ts` 的通用化改造版，10-12 已活跃投产）尚未镜像；同发现 `user-edit-notify.ts` 已退役更名 `.disabled`，使 v1.5.23 写入的排除模式 `-x 'user-edit-notify.ts'` 不再命中（复核会误报差异）。按「通用扩展进镜像、项目专用扩展排除」口径一并处理。
- **改了什么**：① 镜像新增 `pi/agent/extensions/ai-edit-diff.ts`（与全局逐字节一致）。② `claude/docs/capability-sync.md`：范围段「项目专用扩展」现例更新（注明 user-edit-notify 已退役为 `.disabled`、其通用化版 ai-edit-diff 已纳入镜像）；验证段排除模式兼容化（`-x 'user-edit-notify.ts*'`，含 `.disabled`）。③ capability-manager 的 `references/sync-flow.md` 四处同步（cp 循环排除模式、两处 diff 命令、合法差异表）。
- **验证**：`diff -r -x 'user-edit-notify.ts*' ~/.pi/agent/extensions pi/agent/extensions` 通过（15 个通用扩展逐字节一致）；docs diff 一致。
- **镜像同步**：由 Kit 会话完成；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（ai-edit-diff 改造：diff 按需打开——询问窗口/文件 + 授权后打开）

- **为什么改**：2026-10-12 用户反馈「diff 视图不应默认每次修改都打开；应在用户需要时询问：在 VSCode 的哪一个窗口、打开哪一个文件的 diff；用户授权后才在特定窗口打开特定文件的 diff」。原实现每轮结束自动打开（最多 8 个标签），会打扰用户正在工作的窗口。
- **改了什么**（`pi/agent/extensions/ai-edit-diff.ts`）：① 默认不打开——`agent_end` 不再自动打开 diff（也不再发「已打开 N 个」消息），改为把「本轮改动前快照」登记进「最近改动」（跨轮、上限 50、同文件保留最新）；② 新增 `open_diff` 工具——用户按需触发时：选文件（候选多于一个时）→ 选目标窗口（窗口多于一个时；列窗读 VSCode `windowsState`）→ 确认授权 → `code --folder-uri <folder> --diff <快照> <当前>` 在指定窗口打开（含无差异/文件不可读的预检与无 UI 会话的降级提示）；③ 启动提示文案同步更新。功能 B（用户改动通知 AI）不变。
- **验证**：tmux 测试会话全链路实测通过——AI 改文件（快照登记）→ 调用 `open_diff` → 窗口选择对话框（3 窗口）→ 确认授权 → diff 精确开在指定的 vscode-window-test 窗口（`code --status` 窗口标题验证），未开在最近活跃窗口；默认路径（无 open_diff 调用）无任何自动打开。
- **镜像同步**：`pi/agent/extensions/ai-edit-diff.ts` 已按「全局权威优先」覆盖，diff 逐字节一致；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（pi 第三方包清单刷新：移除 pi-workspace-history）

- **为什么改**：2026-10-12 用户判定本机 pi 扩展 `pi-workspace-history`（工作区历史：每轮快照、`/undo` / `/redo`，第三方 npm 包 0.5.0）不再需要，指示卸载并清理残余数据。本机第三方包状态变化后，按第七类同步对象（pi 第三方包清单）规矩刷新镜像。
- **改了什么**：① 本机侧：`pi remove npm:pi-workspace-history`——全局 `~/.pi/agent/settings.json` 的 packages 条目移除、包与依赖树清理；扩展运行时数据 `~/.pi/agent/state/workspace-history/`（约 37MB，3 个工作区快照，经用户确认）清除。② 镜像侧：`pi/agent/npm/` 三件套由 `refresh.py` 重新生成——`package.json` 依赖声明、`package-lock.json` 锁记录、`PACKAGES.md` 清单中的该包条目均移除；`refresh.py` 的 PURPOSES 用途表保留该包条目（仅在包存在时被引用、不进任何生成文件，便于日后重装复用）。
- **验证**：`python3 ~/.claude/patch/npm-manifest/refresh.py --check` 通过（镜像三件套与当前本机一致）；PACKAGES.md 生成内容与镜像文件逐字节比对一致。
- **镜像同步**：本仓库 `pi/agent/npm/` 三件套已刷新；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（ai-edit-diff：文件变更通知升级为跨会话广播）

- **为什么改**：2026-10-12 用户指出两点问题并给出目标行为：① 通知「串台」——会话会被通知它从没碰过的、其它任务在改的文件；② 其它会话（AI）改的文件被误判为「用户手动修改」；③ 用户明确需求——同一文件可能被用户和多个活跃会话增删改查，**文件内容发生变动时，碰过该文件的当前活跃会话（含前台与后台）都应收到通知**，及时更新对该文件的最新认知，无论改动来自用户还是某个会话。
- **改了什么**（`pi/agent/extensions/ai-edit-diff.ts`，重构通知层；open_diff 功能 A 保持不变）：
  - 新增跨会话共享状态三件套：`meta/`（每个文件最新变更记录：新内容哈希 + 改动前快照 + 来源）；`touched/`（每会话「碰过」的文件清单，持久化、会话重启恢复后仍记得）；`claims/`（会话工具改文件的短时声明，用于把变更归因到会话而不是「用户」）。
  - 轮询重写：每个会话只轮询「自己碰过的文件」——自己已知哈希 ≠ 当前内容即视为变更 → 读共享 meta 归因（首个发现者补记快照与 meta）→ 通知本会话；自己的工具改动不自报（但写 meta/mirror 供其它会话感知）；移除原「跨会话预加载」跟随（消灭串台）。
  - 通知来源三分类：`【文件变更通知 · 由会话「名字」修改】/【· 由用户手动修改】/【· 检测到外部修改】`；文件被删除 / 被重建也能识别并通知。
  - 性能与测试便利：每个文件先 stat（mtime+size 未变则跳过读取）；快照 30 天保留期（会话启动时顺带 GC）；状态目录与轮询间隔支持环境变量覆盖（`AI_EDIT_DIFF_STATE_DIR` / `AI_EDIT_DIFF_POLL_MS`）。
- **验证**：① bun mock 多会话 harness（18 项断言全过）：用户/会话改动都通知到所有碰过文件的会话、没碰过的不通知、归因正确、自己的改动不自报、重复轮询去重、删除与重建、会话重启后的「补课」通知。② tmux 双真实会话（AIT-A / AIT-B）全链路实测：两会话读同一文件 → 外部修改 → 两会话都收到「由用户手动修改」通知并自动重读；A 会话用工具追加内容 → B 收到「由会话「AIT-A」修改」通知、A 自己无通知。
- **其它同步**：`user-edit-notify.ts`（旧独立扩展，同日早先退役为 `.disabled`）已彻底删除；`claude/docs/capability-sync.md` 内「现已退役为 .disabled」的描述同步更正为「同日退役并删除」。
- **镜像同步**：`pi/agent/extensions/ai-edit-diff.ts` 与 `claude/docs/capability-sync.md` 已按「全局权威优先」覆盖，diff 逐字节一致（扩展目录全量核对无差异）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（agent-wait-banner：send 窗口加 15 分钟超时上限）

- **为什么改**：2026-10-12 用户反馈：footer 的大红提醒「还有后台进程在运行中，请稍等」挂了一下午——实际没有任何后台任务（`background_list` 为空），只是本会话此前用 send 模式（fire-and-forget、且明确「无需回复」）委派过消息，扩展把「send 未收到回信」计为活动窗口，而无人回信时该窗口永不销。用户定调：**没有真实待办，提醒就不应该存在**。
- **改了什么**：① `pi/agent/extensions/agent-wait-banner.ts`：新增 `SEND_TTL_MS`（默认 15 分钟，环境变量 `PI_WAIT_BANNER_TTL_MS` 可覆盖）；`refresh()` 先做超时撤销（`pruneExpiredSends()`）再渲染——send 窗口超过上限仍未收到回信即自动撤下提醒；原有清窗（回信到达 / 用户输入 / 委派失败）不变；头部注释补 2026-10-12 修订说明。② 全局 `CLAUDE.md`「等待回复 / 后台任务运行期间的大红提醒」条目：显示时机处补 send 窗口 15 分钟上限（含 `PI_WAIT_BANNER_TTL_MS` 可调），工具强制条的修订历史补 2026-10-12 一笔。
- **验证**：bun mock harness 15 项断言全过——send 显示 / 超时自动撤销（TTL=1.2s 实测）/ 回信清窗 / 用户输入清窗 / ask 生命周期 / 干活中隐藏与恢复 / 外部活动上报 / 委派失败撤销。
- **镜像同步**：`pi/agent/extensions/agent-wait-banner.ts` 与 `claude/CLAUDE.md` 已按「全局权威优先」覆盖，diff 逐字节一致（扩展目录全量核对无差异）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（agent-wait-banner：新增「无需回复」主动判断）

- **为什么改**：2026-10-12 用户对 1.5.30 的超时方案继续追加要求：「没有后台进程要等的话，应该主动判断出来，然后主动把这个提醒撤销」——不应只靠 15 分钟兜底超时，能当场判定「没有要等的东西」时就该不点亮提醒。
- **改了什么**：① `pi/agent/extensions/agent-wait-banner.ts`：新增 `isNoReplyMessage()`——send / handover 类委派的消息文本里写明「无需回复」（含「不用回复 / 不必回复 / 不需要回复 / 无需回信 / 无需进一步动作 / no need to reply / no reply needed 等」变体）即视为 fire-and-forget，**不登记等待窗口、不点亮提醒**；需要回信的照常点亮，收到回信 / 用户输入 / 委派失败照旧立即撤销；15 分钟超时保留作兜底（标记写漏或无法判断时）。② 全局 `CLAUDE.md`：显示时机处补「主动判断」描述，新增「发出 send 类委派时的写法」子条（不需回信的写明「无需回复」），工具强制条修订史补 2026-10-12 两点。
- **验证**：bun mock harness 17 项断言全过（新增：「无需回复 / 不用回复 / no need to reply / 无需你进一步动作」四种变体不点亮；对照组——需要回信的 send 正常点亮）。
- **镜像同步**：`pi/agent/extensions/agent-wait-banner.ts` 与 `claude/CLAUDE.md` 已按「全局权威优先」覆盖，diff 逐字节一致（扩展目录全量核对无差异）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（capability-sync 文档：补 CHANGELOG 追加自查）

- **为什么改**：2026-10-12 连续两批镜像同步（1.5.30 / 1.5.31），Kit 会话暂记 CHANGELOG 条目时出现同一结构问题——新条目被插到上一日期节（`## 2026-10-11`）之下、并重复一个日期标题；均由 Prometheus 在提交前修正。为防复发，把「追加后的自查」写进同步文档。
- **改了什么**：`claude/docs/capability-sync.md`「怎么验证」段新增一条——追加 CHANGELOG 条目后自查：新条目须落在当前日期节内（行号在下一个日期标题之前）、日期标题不重复（`grep -c '^## <日期>$' CHANGELOG.md` 应为 1）；并记下成因（插入锚点处把日期标题重写了一遍；正确写法是「新条目 + 原锚点文本原样」）。
- **验证**：自查命令在现仓库实跑通过（日期标题 10-12 / 10-11 各 1 次）；本次新增条目按新写法插入，位于 10-12 节末尾（`## 2026-10-11` 之前）。
- **镜像同步**：`claude/docs/capability-sync.md` 已按「全局权威优先」覆盖，diff 逐字节一致；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（ai-edit-diff：通知措辞中性化 + 复合命令判定修复）

- **为什么改**：2026-10-12 用户反馈通知措辞不准确（「用户手动修改了文件」实践中大部分不成立，往往是其它会话改的；要求如实表述「文件被修改了」）；排查时又发现一个连带 bug——复合命令（如 `cp a b && diff a b`）里因含 `diff` 字样被整条误判为「只读」，导致写动作没登记快照/声明，自己改自己碰过的文件也会收到误报（当时那条「由用户手动修改」通知就是本会话自己 cp 镜像时发给自己的）。
- **改了什么**：`pi/agent/extensions/ai-edit-diff.ts`：① 轮询首个发现者的归因由 `{kind:"user"}` 改为 `{kind:"unknown"}`（有 claim 的仍精确归到具体会话）；② 通知标题三分类改为「由会话「名字」修改」/「来源未识别」（旧记录兼容仍可显示「由用户修改」，但新产生的不再默认归因）；③ 未知来源时正文增加说明行「变更来源：未识别——不是本会话所为（可能是其它会话，也可能是用户手动改）」；④ bash 读写判定加密：出现写类命令（cp/mv/rm/sed/tee/touch/mkdir/ln/dd/truncate/chmod/chown/install）或文件重定向即按写处理（先剔除 `2>/dev/null`、`2>&1` 等无害重定向），不再被命令里的 `diff` 等只读字样带偏；⑤ 头部注释补本次改造记录。
- **验证**：bun mock harness 21 项断言全过（含新增：来源不明改用中性措辞、标题不出现「用户」字样；复合命令 `cp … && diff …` 写自己碰过的文件不自报、meta 正确归因到本会话）。
- **镜像同步**：`pi/agent/extensions/ai-edit-diff.ts` 已按「全局权威优先」覆盖，diff 逐字节一致（扩展目录全量核对无差异）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（镜像新增 image-marker 扩展：粘贴图片显示为 [Image #N]）

- **为什么改**：2026-10-12 用户反馈——pi 里 Ctrl+V 粘贴剪贴板图片时，输入框中插入的是临时文件的绝对路径（`/var/folders/.../pi-clipboard-<uuid>.png`），又长又占地方，贴几张图就看不清自己到底贴了什么；希望像 Claude Code 那样显示成简洁的带编号标记（`[Image #1]`）。该显示优化与具体项目无关、任何用 pi 的人都用得上，属通用能力，故纳入镜像。
- **改了什么**：① 全局新增 `~/.pi/agent/extensions/image-marker.ts`（约 180 行，含中文头注）。② 镜像新增 `pi/agent/extensions/image-marker.ts`（与全局逐字节一致）。③ 本 CHANGELOG 记条目、VERSION 与两个 README 版本徽章同步 bump 到 1.5.34。
- **实现要点**：搭 pi-tui Editor 自带的「粘贴折叠 + 提交时展开」机制（即贴大段文本显示 `[paste #1 +30 lines]` 的那套），而不是另起一套渲染：`insertTextAtCursor()` 把 Ctrl+V 插入的图片路径换成 `[Image #N]`、`handlePaste()` 覆盖终端括号粘贴（Cmd+V 直通 / 复制文件后贴路径）、`expandPasteMarkers()` 在回车提交（`submitValue()`）与 `getExpandedText()` 时把标记还原成真实路径、`submitValue()` 提交后把编号归零（下一条消息重新从 #1 开始，与 Claude Code 一致）、`setTextInternal()` 在文本被回填（历史上下翻阅 / 恢复排队消息 / fork 选中消息 / 外部编辑器返回）时重新折叠。只对「整段文本就是一张已存在图片文件的路径」生效（单行、图片扩展名、文件真实存在），普通文本粘贴 / 命令 / 代码片段不受影响；连着贴两张图自动空格分隔，展开后是两条独立路径（不会粘成 `a.pngb.png` 一条无效路径）。
- **验证**：tmux 真实 pi 会话全链路实测七项全过——① 单张图片显示 `[Image #1]` 且提交后会话记录（jsonl）里是真实临时路径；② 同一条消息连贴两张显示 `[Image #1] [Image #2]`、展开为以空格分隔的两条路径；③ 回车提交后编号归零（下一条消息重新从 #1 开始）；④ 历史记录上翻回填时重新折叠成标记；⑤ 普通文本粘贴不折叠；⑥ 非图片文件路径（`/etc/hosts`）不折叠；⑦ 带引号的图片路径折叠、展开后仍是原样的带引号文本。
- **镜像同步**：`pi/agent/extensions/image-marker.ts` 已按「全局权威优先」覆盖，`diff -r ~/.pi/agent/extensions pi/agent/extensions` 逐字节一致（16 个通用扩展无差异）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus 执行。

### 变更（智能体专属文件归属新规镜像同步 + sync-flow 对齐 + TODO T1 闭环）

- **为什么改**：2026-10-12 用户把原「子项目 `.claude/` 超集」规则改为两条新规——① 智能体专属文件（`CLAUDE.md` / `AGENTS.md` / `.claude/` / 项目级 `.pi/` 等「会话启动时按工作目录加载、表征智能体身份」的项目级文件）只有 Agent 项目允许拥有、非 Agent 项目（含子项目）一律不得存在；② 后台开启 pi 会话（intercom / `agent_call` / `agent_wake`）只能以 Agent 项目根目录为工作目录。Kit 会话完成全局侧细则与镜像同步（五文件，diff 逐字节一致），本仓复核并完成我这侧的对齐与闭环。
- **改了什么**：
  - 镜像（Kit 同步、本会话复核）：`claude/CLAUDE.md`（团队结构参考节新规 + 缩写约定 / 会话收尾检查 / agent_call 措辞同步）、`claude/docs/agents-registry.md`（「智能体专属文件归属与子项目映射（2026-10-12 修订）」节取代原超集节；映射表改名「子项目映射」）、`claude/docs/new-agent-scaffold.md`（新增「非 Agent 项目不得有智能体专属文件」条）、`claude/hooks/settle-repo-check.py`（表名正则改「子项目映射」+ 目录名大小写不敏感匹配修正）、`pi/agent/extensions/agent-call.ts`（唤醒前校验目标目录为 Agent 项目目录：根目录含 `CLAUDE.md` / `AGENTS.md` / `.claude/CLAUDE.md`，否则拒绝启动并报错）。
  - `capability-manager/references/sync-flow.md` 两处「超集」表述按新规改写（「单一出口说明」与「情形 2」末段：子项目不再携带智能体专属文件，指向 `agents-registry.md` 新节）。
  - TODO 闭环：T1（sync-flow 过时项）经核查其内容已由 v1.5.15 / v1.5.21 / 本批全部修复——移入新建 `TODO-archive.md` 标 `✅已完成`（正文逐字保留，已与原文比对一致）；`TODO.md` 清空。
- **验证**：六部分（skills / CLAUDE.md / docs / hooks / patch / pi 扩展）+ 第七类 npm 清单（`--check` 通过）全量 diff 复核——仅既有豁免差异（anysearch `.env`、backup `endpoints.json`、`__pycache__` 等）；五文件与全局逐字节一致；CHANGELOG 追加自查通过（本条目位于 2026-10-12 节内、日期标题唯一）。

## 2026-10-11

### 变更（全局注册表超集映射表加行：Victor 新增子项目 TradingProofs）

- **为什么改**：2026-10-11 用户把交易数学形式化项目单独立项，交给 DayTradingAgent（Victor）负责、作为其子项目——把交易数学（从 `notes/cumulative-return-derivation.md` 的固定比例下注推导开始）做成 Lean 4 + Mathlib 的机器可验证证明；作为 Victor 的子项目登记进注册表（DayTradingAgent 此前在映射表中无子项目行）。
- **改了什么**：`agents-registry.md` 超集映射表在 ProductProducerAgent → agent-team-playbook-src 行后加一行：DayTradingAgent（Victor）→ TradingProofs（从固定比例下注的累计收益率推导开始，覆盖强数定律指数增长率 / 凯利最优 f\* /「两倍凯利」边界；与实盘执行完全隔离；2026-10-11 立项；按 2026-10-09 新式脚手架不建 `.claude/`，超集以 CLAUDE.md 全文随附落地）。
- **镜像同步**：`claude/docs/agents-registry.md` 已由 Victor 会话按「全局权威优先、自动同步」覆盖，diff 与全局逐字节一致；六部分整体 diff 复核一致（仅既有的本机豁免差异：anysearch `.env`、backup `endpoints.json`、scroll-reverser `local/config.md`、`__pycache__` 产物）。本条 CHANGELOG 由 Victor 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（agent-wait-banner 重做：提醒移至 footer 状态行、修复回信清窗缺陷、接入后台任务上报）

- **为什么改**：2026-10-11 用户对 pi 会话的「大红横幅」提出四个问题——① 有内容正在动态输出时提醒是多余的（用户看得到活动、不会关窗口）；② 输出完、任务真正结束提醒还挂着（DayTradingAgent 实测：send 给 Prometheus 的回信早已到达并确认，界面横幅因「回信不清窗」持续残留）；③ 文案「正在等待其它智能体回复中」不严谨（实际场景还涉及后台任务）；④ 提醒位置可换（footer 或动态栏）。
- **改了什么**：① `~/.pi/agent/extensions/agent-wait-banner.ts` 重做：显示位置从「消息首行自动横幅 + 编辑器上方 widget」改为 **footer 状态行**（`ctx.ui.setStatus`）；文案改为「🟥🟥🟥 还有后台进程在运行中，请稍等 🟥🟥🟥」；不再向消息内容注入任何横幅。② 显示时机改为「还有未完活动 **且** 会话静止（agent_start..agent_settled 之外）」——agent 干活期间隐藏、停下后若仍有活动则显示、活动全部结束立即撤下。③ 修复清窗缺陷（问题②的根因）：旧版只认 role=user 的 message_start，而 intercom 回信以 custom message 注入、不触发该事件，send 窗口永不关闭；新版扫会话条目（`custom_message` / `intercom_message`）按条数销掉 send 窗口，另加「委派工具失败（tool_result isError）即撤销窗口」与 30 秒兜底轮询。④ 新增活动上报通道：pi.events 事件 `agent-wait-banner:activity`（载荷 `{ source, active }`），项目扩展可把自家后台任务接进提醒（首个接入：DayTradingAgent 的 `background_run` 后台任务，运行中显示、全部结束撤）。⑤ 全局 CLAUDE.md「大红提醒」规则节同步改写：pi 端明确为「扩展自动显示、agent 无需手写横幅」；无该机制的 harness（CC 端）保留手写要求；文案与机制描述更新（标题改为「等待回复 / 后台任务运行期间的大红提醒」）。
- **验证**：扩展加载验证（tsx + pi -p 会话均通过）；tmux 实测会话四条链路全过——background_run 任务运行中显示 / 任务结束撤销 / send 待回信显示 / 回信到达撤销（测试会话 pi-bgtest 已清理）。
- **镜像同步**：`claude/CLAUDE.md` 与 `pi/agent/extensions/agent-wait-banner.ts` 已按「全局权威优先、自动同步」覆盖，diff 逐字节一致；六部分整体 diff 复核一致（仅既有的本机豁免差异）。本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（新增全局 pi 扩展 background-tasks：后台任务工具，自 DayTradingAgent 上移）

- **为什么改**：2026-10-11 用户指出「后台跑命令」是通用能力、应放全局（原为 DayTradingAgent 项目级扩展）——上移后全部 pi 会话可用（长构建 / 批量任务等「后台跑 → 完成唤醒」循环不再只有一个项目有），并与全局 `agent-wait-banner` footer 提醒联动天然打通。
- **改了什么**：新增 `~/.pi/agent/extensions/background-tasks.ts`——`background_run` / `background_list` / `background_stop` 三工具（补 pi 无内建后台 bash，语义对齐 CC 的 run_in_background / TaskStop）、完成时 `[后台任务完成]` 通知唤醒、会话退出清理遗留任务、`:activity` 活动上报供 footer 提醒；日志落「会话工作目录 tmp/pi-bg/」。DayTradingAgent 侧同步：删原项目级扩展、密采样停盯提醒迁入其 `trade-guards` 的 TaskStop 桥、CLAUDE.md / SKILL.md / host-integration.md 与其 CHANGELOG 同步（详见该项目 CHANGELOG）。
- **验证**：桥冒烟 21/21（全局路径加载 + 三工具 + 上报）；pi -p 双环境加载；tmux 实测（EA 目录、非 DayTradingAgent）后台任务运行中 footer 提醒显示 / 结束撤销。
- **镜像同步**：`pi/agent/extensions/background-tasks.ts` 新增并同步（diff 逐字节一致）；本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 新增（pi 第三方包清单：备份与迁移用——第七类同步对象 + 刷新脚本）

- **为什么改**：2026-10-11 用户提出——同步到本仓库的目的除「自研能力开源」外还有「智能体系统在用通用能力的备份」：以防笔记本损坏换新机时能方便找回与迁移。第三方包源码不适合直接入库（体积 / 平台耦合 / 更新成本），但「版本号 + 项目地址」清单可以；要求把本机 `~/.pi/agent/npm/` 的在用状态纳入同步。
- **改了什么**：① 新增镜像目录 `pi/agent/npm/`——`package.json` / `package-lock.json`（本机 `~/.pi/agent/npm/` 副本：声明 + 精确锁，含版本、下载地址与完整性哈希）、`PACKAGES.md`（生成的人读清单：包名 / 精确版本 / 来源 / License / 用途）、`README.md`（用途与换机恢复步骤：装 pi 本体 → 逐个 `pi install` 精确版本 → 拷回 `claude/` 与 `pi/agent/extensions/` 自研能力 → 凭证与数据另行处理）。② 新增 `claude/patch/npm-manifest/refresh.py`（刷新脚本：复制两 json + 生成 PACKAGES.md；`--check` 校验镜像与当前本机一致）。③ `claude/docs/capability-sync.md` 纳入第七类同步对象（生成式内容、校验用 `--check`；更新时机 = 装 / 删 / 升级 pi 包后），并顺带补全 patch 目录描述（session-sweep）与 pi 扩展数量说明（14 个、以目录实际为准）。
- **验证**：refresh.py 同步运行通过、`--check` 通过；docs 与 patch 镜像 diff 逐字节一致；六部分整体 diff 复核一致（仅既有的本机豁免差异）。本条 CHANGELOG 由 Kit 会话暂记，提交与发版流程委派 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（capability-manager skill 对齐第七类同步对象：pi 第三方包清单）

- **为什么改**：2026-10-11 第七类同步对象（pi 第三方包清单——`pi/agent/npm/` + `patch/npm-manifest/refresh.py`）落地后，本项目专属 skill `capability-manager`（Prometheus 的操作手册）的同步范围、验证与巡检口径仍只提「六部分」，漏掉「装 / 删 / 升级 pi 包后刷新清单」与「npm 清单用 `--check` 核验」两条动作；按 2026-10-09 命名 / 单一出口对齐的先例一并补齐。
- **改了什么**（`.claude/skills/capability-manager/`，项目专属 skill、不进全局 / 不进镜像）：
  - `SKILL.md`：description、「同步范围」「claude/ 镜像说明」「diff 验证护栏」「场景 A 镜像步」「场景 B diff 步」「详见」七处补上第七类（刷新用 `refresh.py`、核验用 `--check`、生成式不比对逐字节）。
  - `references/sync-flow.md`：范围行、镜像行、「单一出口说明」后新增第七类说明；情形 1 末补刷新命令；一致性核对补 `--check` 命令；合法差异段、巡检脚本（新增 npm 清单 ✅/❌ 检查）同步。
  - `references/content-lifecycle.md`：通用原则段补第七类；判断矩阵新增「pi 第三方包清单（第七类，生成式）」行；「六部分之外」改「非同步对象」（避免与第七类混淆）。
- **验证**：description 长度检查通过（`check_description.py`，569/1024、exit 0）；逐文件 grep 复核第七类引用齐备。

## 2026-10-09

### 变更（agent-wait-banner 判定精化：等待窗口精确化，修复「已收尾汇报被误补横幅」）

- **为什么改**：2026-10-09 用户实测指出一处矛盾——超时放弃 / 已收到回复的收尾汇报（正文写着「无进行中的等待」）被旧版扩展自动补上大红横幅，两句话打架。根因：旧版判定为粗粒度「本轮只要委派过其它智能体（`agent_call` / `intercom` / `agent_wake`），收尾消息若没带横幅就自动补」，不区分「是否还在等待」。
- **改了什么**：① pi 扩展 `~/.pi/agent/extensions/agent-wait-banner.ts` 判定重构为「等待窗口」（v2）——**send 类委派**（`agent_call` mode=send / `intercom` send|handover）发出后、到任何新消息（对方回信 / 用户输入）到达前，窗口内汇报自动补横幅；**ask 类调用**用 `toolCallId` 登记、`tool_execution_end`（回复 / 超时 / 失败）即结窗不再补（按「联系不上不硬等」原则，超时后不提醒保持会话）；`agent_wake` 单独不算等待；widget 与窗口同步（ask 阻塞期间挂、窗口关闭即撤）。② 全局 CLAUDE.md「工具强制」描述句同步更新（替代原「本轮只要委派过就补」的表述）。
- **验证**：单元测试 14/14 通过（含今日场景复盘：ask 回复后 / ask 超时后 → 不补；send 后未收消息 → 补；send 后回信 → 不补；intercom handover → 补；已含横幅字样不重复补）；端到端实测（两个临时 pi 会话）——send 后、回信前输出被正确补横幅，回信后与 ask 返回后的输出均不补。新逻辑从下一个新会话生效（扩展启动时加载，已在运行的会话仍持旧版）。
- **同步**：镜像 `pi/agent/extensions/agent-wait-banner.ts` 与 `claude/CLAUDE.md` 已更新至与全局逐字节一致。

### 变更（capability-manager skill 对齐现状：命名规则 / 单一出口模型 / find-skill 清理）

- **为什么改**：2026-10-09 命名规则修订（cuAgent 建立的配套）后，Kit 巡检提醒本项目专属 skill `capability-manager` 及其 references 仍写旧命名规则（「拟人名必选」「目录名 XxxAgent」等）；全面核对时发现另外两处系统性过时：① 三个 references 仍把「全局 → 各 agent 项目副本分发」写成现行流程（该分发层 2026-09-13 已终结、副本已全部清空）；② 多处引用已不存在的 find-skill。本次一并对齐到现状。
- **改了什么**（`.claude/skills/capability-manager/`，项目专属 skill、不进全局 / 不进镜像，只动本项目文件）：
  - `SKILL.md`：description 与场景 B / 汇报口径删「各 agent 项目副本 / 分发」旧模型（改单一出口）；场景 C 命名流程改为「以 `Agent` 结尾、前缀尽可能简单；用户要求时才按历史拟人名惯例」；注册表位置改指 `~/.claude/docs/agents-registry.md`；合法差异示例改用现行本机数据目录（scroll-reverser `local/`、backup `endpoints/`）。
  - `references/registry-and-scaffolding.md`：定名 / 查重 / 注册表追加 / 镜像路径按现状改准；脚手架改为「不建 `.claude/`、不复制通用副本」（与 new-agent-scaffold.md 对齐）；徽章标准改 License / Version / Type（删旧「Last Commit / AI Agent」口径）；补 `AGENTS.md` 软链与 VERSION / CHANGELOG 生成；开源命令占位符改 `<目录名>`；建远程的授权口径补 `/commit` 通道。
  - `references/sync-flow.md`：「同步情形 2（分发）」改写为已终结说明；角色速查表与巡检脚本去掉项目副本层；find-skill 例外段与合法差异表改列现行本机数据差异。
  - `references/content-lifecycle.md`：判断矩阵与新增 / 下线 / 修改流程去掉分发步骤；改 CLAUDE.md 的影响示例更新。
- **验证**：description 长度检查 `check_description.py` 通过（549/1024，exit 0）；旧词零残留扫描（find-skill / XxxAgent / DigiVendAgent / browser-use 无命中）；「拟人名」「分发」剩余处均为有意保留的历史语境说明。

### 新增（第 21 个 agent：cuAgent——电脑操作员；同步修订新建 Agent 命名规则）

- **为什么改**：2026-10-09 用户建立第 21 个 agent **cuAgent（电脑操作员）**——用 computer-use 能力（GUI 自动化：看屏幕 / 点击 / 输入 / 拖拽）代替用户操作本机电脑界面；独立工具型 agent、不分组、直属用户，独立于销售流水线（远程仓库待建）。并随之一并修订新建 Agent 的命名规则：**以 `Agent` 结尾、前缀尽可能简单**（如 `cuAgent`）——不再要求「职称式全称 + PascalCase」，新建 agent 也不再强制拟人名（历史 agent 多为拟人名，沿用保留）。
- **改了什么**：
  - `agents-registry.md`：注册表加 cuAgent 行（名称 / 项目（仓库）/ 职称「电脑操作员」/ 职责）；表头「拟人名」改「名称」并补命名规则说明（「以 `Agent` 结尾、前缀尽可能简单，如 `cuAgent`；历史 agent 多为拟人名」）；「销售流水线与三小组」段补 cuAgent 位置说明（不分组、直属用户、独立于销售流水线）；「新建 Agent 时自动维护注册表」节与超集关系节里的「带拟人名的」措辞按新口径修订。
  - `new-agent-scaffold.md`：目录名 / 名称规则改为「以 `Agent` 结尾、前缀尽可能简单」；引入语与 logo 小节措辞同步（「含团队 agent 与独立工具型 agent」）。
  - `commit/SKILL.md`（9d 步）：「拟人名」全面改「名称」；「缺名则定名」改为优先简洁名（以 `Agent` 结尾的目录名本身即名称），用户要求拟人名时才按历史惯例起名；查重口径（拟人名与项目名都查）、9g 排除清单、缓存模板说明同步。
  - `icon-design/SKILL.md`：logo 视觉区分节「拟人实体用拟人头像」改为「Agent 门面用统一模板」（名称含拟人名与简洁名）。
  - `CLAUDE.md`：「团队结构参考」节由「20 个拟人名 agent」改为「21 个 agent」，新建流程与查重措辞按新命名规则同步。
- **镜像同步**：五处已覆盖——`claude/CLAUDE.md`、`claude/docs/agents-registry.md`、`claude/docs/new-agent-scaffold.md`、`claude/skills/commit/SKILL.md`、`claude/skills/icon-design/SKILL.md`，diff 与全局逐字节一致（本会话复核确认；六部分整体 diff 复核一致，仅既有的本机豁免差异）。本批改动由其它会话完成（Kit 巡检发现并委派）；Prometheus（CapabilityManagerAgent 会话）复核 diff、补记本条 CHANGELOG 并走提交与发版流程。

### 变更（computer-use：由「已弃用并移除」修订为「仅限 cuAgent 项目内使用」）

- **为什么改**：2026-10-09 用户确认恢复 computer-use 能力、且**限定只有 cuAgent 能用**（cuAgent 的立项即建立在此能力上）——2026-10-08 曾「彻底弃用并移除」，本次按新范围修订而非全面恢复。
- **改了什么**：`CLAUDE.md` 该节由「已弃用并移除」改写为「仅限 cuAgent 项目内使用」——computer-use 只以 cuAgent 项目的**项目级 MCP** 形式存在（cuAgent 仓库根 `.mcp.json`，npx 拉起固定版本、不装全局）；**其它任何会话 / 项目不得启用、使用或全局安装** computer-use 类工具，全局 `~/.pi/agent/mcp-adapter.json` 保持无该条目；确需在 cuAgent 之外使用仍须先经用户明确同意。沿革（2026-10-08 弃用与组件移除 → 2026-10-09 限定恢复）保留在节内。
- **镜像同步**：`claude/CLAUDE.md` 已覆盖，diff 与全局逐字节一致（本会话复核确认）。

### 变更（全局注册表：zcode-cli 与 cmux-launcher 标注短期搁置）

- **为什么改**：2026-10-09 用户决定 zcode-cli 与 cmux-launcher 短期搁置（暂不主动维护）——两者是 Atlas（FullStackEngineerAgent）的子项目。为如实反映项目状态，把该决定标注进注册表映射表，避免后续查表时误以为两者仍在活跃维护。
- **改了什么**：`agents-registry.md` 超集映射表两行加注——zcode-cli：「2026-10-09 起短期搁置（用户决定暂不维护，本地开发目录已删除）」；cmux-launcher：「2026-10-09 起短期搁置（用户决定暂不维护，本地开发目录已归档）」。
- **镜像同步**：`claude/docs/agents-registry.md` 已覆盖，diff 与全局逐字节一致（本会话复核确认；六部分整体 diff 复核一致，仅既有的本机豁免差异）。本批次由 Atlas（FullStackEngineerAgent 会话）完成镜像同步，Prometheus（CapabilityManagerAgent 会话）复核 diff 并补记本条 CHANGELOG。

### 新增（等待回执期间的大红警示横幅：防阶段性汇报被误读为「任务已完成」+ pi 扩展兜底）

- **为什么改**：2026-10-09 用户反馈——等待其它智能体回执期间，阶段性汇报写得太像「总结报告」，用户不细看会以为任务已全部完成，实测差点误关会话（发生在等 Atlas / Hermes 回执期间）。新口径（写入全局 `~/.claude/CLAUDE.md`「会话间协作」节）：**等待其它智能体回复期间的所有阶段性汇报，首行必须带固定大红横幅** `🟥🟥🟥 正在等待其它智能体回复中 —— 暂时不要关闭当前会话！ 🟥🟥🟥`（用 ANSI 大红加粗包裹 `\x1b[1;31m…\x1b[0m`；🟥 本身即红色、作 ANSI 失效时的兜底；只有确认「全部回复已到齐、任务真正收尾」的汇报才不带，拿不准就带）。
- **工具强制（pi 端扩展 `~/.pi/agent/extensions/agent-wait-banner.ts`）**：本轮只要委派过其它智能体（`agent_call` / `intercom` / `agent_wake`）——收尾消息若没带横幅就自动前置一条大红加粗的（按「正在等待其它智能体回复中」标记去重、已带则不重复补）；委派发生时在编辑器上方挂一条红色 widget 提示等待中，新消息（用户输入或回执，均为 user 角色）到达即撤；防御性 catch、失灵不影响会话。
- **镜像同步**：两处已覆盖——`claude/CLAUDE.md`、`pi/agent/extensions/agent-wait-banner.ts`，diff 与全局逐字节一致（本会话复核确认；六部分整体 diff 复核一致，仅既有的本机豁免差异）。本批次由 Kit（ExecutiveAssistantAgent 会话）完成镜像同步并实测（5 项 mock 冒烟测试通过），Prometheus（CapabilityManagerAgent 会话）复核 diff 并补记本条 CHANGELOG。
- **落地边界**：pi 扩展在会话启动时加载——本次新增扩展对尚未启动的下一个新会话生效，已在运行的会话（含本条批次的会话）不加载；规则文本层面（全局 `CLAUDE.md`）对所有会话即时生效。

### 新增（会话收尾检查：负责的子项目仓库必须干净——新全局规则 + 双端工具强制）

- **为什么改**：2026-10-09 用户立新全局规则——每个 Agent 会话**结束任务之前**（向用户交付 / 收尾汇报之前）必须检查自己负责的全部子项目仓库是否干净，**不干净的全部要处理干净**才能收尾（不是只报告、也不留给「下次自然提交」）。触发背景：当日实测全队 22 个子项目仓库有 16 个不干净，其中 Atlas 名下 8 个只挂着上一轮同步改动未提交——子项目随附版同步、文档补记这类零散改动会长期烂在各个工作区里；收尾自检让每个 Agent 交付时，名下所有仓库都处于「干净 + 与远端同步」的终态。
- **规则正文**（写入全局 `~/.claude/CLAUDE.md`「工作规则」新增节）：干净口径（`git status --porcelain` 无输出、与远端无落后分叉、本地领先的提交该推就推）、检查范围（该 Agent 项目 `CLAUDE.md` 的「子项目清单」节 + 注册表「超集关系映射」表）、处理方式（按各仓库自己的流程 `/add` → `/commit`，多仓库逐个处理；查不到 / 拿不准是否在途 WIP 的先向用户说明）、边界（只查自己负责的；临时产物与刻意留住的工作区在途改动不算）。
- **工具强制（双端，判定逻辑同源——同一个 Python 脚本）**：
  - `~/.claude/hooks/settle-repo-check.py`（CC 端 Stop hook，已在 `~/.claude/settings.json` 的 `hooks.Stop` 注册）：由 cwd 在注册表「超集关系映射」表定位所属 Agent 的全部子项目，逐个 `git status --porcelain` 巡检；未干净时 exit 2 **阻断收尾一次**（stderr 给 Claude 理由、促其先处理）、`stop_hook_active` 时放行防循环；cwd 不属于任何 Agent / 子项目时静默通过；`--json` 模式供 pi 端扩展调用。
  - `~/.pi/agent/extensions/settle-repo-check.ts`（pi 端扩展）：`agent_settled` 钩子调用上述脚本巡检本会话所在 Agent 项目的子项目仓库——全部干净则静默；发现不干净则 ① 通知用户（`ctx.ui.notify` warning）、② 就同一批不干净仓库向会话注入一次提醒促其处理；**去重签名**防重复打断（同一批只提醒一次，集合变化或全部干净后重新计数）。
- **镜像同步**：三处已覆盖——`claude/CLAUDE.md`、`claude/hooks/settle-repo-check.py`、`pi/agent/extensions/settle-repo-check.ts`，diff 与全局逐字节一致（本会话复核确认）；六部分（skills / CLAUDE.md / docs / hooks / patch / pi 扩展）一并整体 diff 复核一致。本批次由 Kit（ExecutiveAssistantAgent 会话）完成镜像同步，Prometheus（CapabilityManagerAgent 会话）复核 diff 并补记本条 CHANGELOG。

### 变更（全局注册表超集映射表加行：Atlas 新增子项目 mp4-player）

- **为什么改**：2026-10-09 用户把 mp4-player（VSCode 视频播放扩展，上游 Brodazz/mp4-player 的独立仓库：编辑器标签页内带音频播放视频，内置 ffmpeg WebAssembly 做音频解码与格式转码）交给 FullStackEngineerAgent（Atlas）负责并纳入其子项目；作为 Atlas 的子项目登记进注册表。
- **改了什么**：`agents-registry.md` 超集映射表在 Atlas → ghostty 行后加一行：Atlas → mp4-player（…2026-10-09 移交 Atlas，开发目录 ~/Developer/mp4-player）。
- **镜像同步**：全局注册表由 Kit（ExecutiveAssistantAgent 会话）按「全局权威优先、自动同步」规则覆盖到镜像 `claude/docs/agents-registry.md`，diff 与全局逐字节一致（本会话复核确认）；本条 CHANGELOG 补记由 Prometheus（CapabilityManagerAgent 会话）执行。

### 变更（发版节奏口径对齐：修复 / 功能合并进 main 后自动发正式版，验收移到发版之后）

- **为什么改**：2026-10-09 用户明确「修复合并进 main 之后就应该自动发布正式版」，并指出不该拿「要不要发版」问用户。触发场景：ghostty-launcher 的 Issue #8 修复合并进 main 后，开发会话按 dev-workflow 原措辞「试用要在发版链被触发前完成」停住问用户要不要发版——而 commit skill 第 10 步本就是「合并后自动走 bump → add → commit → release」的全自动链，文本与工具 / 用户口径冲突，本次把文本对齐到工具与用户口径。
- **改了什么**：
  - `skills/dev-workflow/SKILL.md`：description、核心逻辑段、第 9 步（使用验收）、第 10 步（正式发版）四处——「试用满意才正式发版」「试用要在发版链被触发前完成」「正式发布的版本 = 用户使用验收过的 main 快照」等措辞改为「**发版自动衔接**：修复 / 功能合并进 main 后由 bump → add → commit → release 链自动发正式版，不等人工试用；**验收发生在发版之后**（装上正式版实际使用即为验收），发现问题走修复循环（新 Issue + 测试先行 → 修复合并 → 补丁版自动发版）」；预发布通道保留为「需要提前试用时」的可选手段，不再是正式发版前置。
  - `skills/dev-workflow/references/acceptance.md`：文件定位段与「main 与发布的语义闭环」段同步（验收落点由「发版前」移到「发版后」）。
  - `skills/commit/SKILL.md`：「汇报」节里「正式发版以用户预发布试用满意为前提……未 bump 时本流程不会自动发版」改为「修复 / 功能合并进 main 后由发版链自动发正式版——不要拿『要不要发版』问用户」。
  - 镜像同步：`claude/skills/` 三处已覆盖，逐字节一致。
- **落地佐证**（2026-10-09）：对齐后立即按新口径执行——ghostty-launcher 的 Issue #8 修复（PR #9 合并）→ bump 0.2.3（PR #11）→ 正式发版 v0.2.3（带 ghostty-launcher-0.2.3.vsix 产物），全程未再向用户确认发版。

### 变更（test-cases-guard 收窄：只防「改测试内容」，`git add` 入暂存区不再拦）

- **为什么改**：2026-10-09 用户裁定收窄 test-cases-guard 的口径。触发场景：ghostty-launcher Issue #8 修复按 dev-workflow 走到收尾时，开发会话要把「测试 + 实现 + CHANGELOG」一次提交（同一次提交、同一个 PR，2026-09-30 用户定的硬规矩），而守卫原先把 `git add` 归入 git 写动词（`rm|mv|add|clean|restore|checkout|stash`）——于是开发 Agent 连「把测试文件入暂存区」也被拦下，dev-workflow 这条动线被工具强制断在半路，只能靠用户手动 `git add` 或加例外标记。用户口径：**守卫只防「开发 Agent 改测试内容」，不拦「把未改动的测试文件入暂存区」**——暂存不改变文件内容，而内容改写路径（bash 写动词 / Write、Edit 工具 / `git rm`、`mv`、`clean`、`restore`、`checkout`、`stash`）已经单独拦住了。
- **改了什么**：① `~/.claude/hooks/test-cases-guard.py`：`GIT_WRITE` 去掉 `add`（保留 `rm|mv|clean|restore|checkout|stash`）；头部「拦截范围 / 放行 / 强度边界」三段与 deny 文案同步改写（明确写出 `git add` 不在此列、不拦的理由）。② `~/.pi/agent/extensions/test-cases-guard.ts`：同一份规则逐条对齐（正则、注释、deny 文案同步改）。③ 文档同步：`skills/dev-workflow/SKILL.md` 第 4 步纪律 1 与 `skills/dev-workflow/references/test-cases.md` 强度边界段补上「`git add` 不拦」与理由（原先那段「拦不住 `git add .`」的边界描述已过时，改为准确边界）。④ 镜像同步：`claude/hooks/`、`claude/skills/`、`pi/agent/extensions/` 三部分已覆盖，六部分 diff 逐字节一致（仅本机私有文件与 `__pycache__` 属豁免差异）。
- **验证**（2026-10-09，两端各自真实跑）：CC 端把合成 JSON 喂给 hook 实跑 9 条——`git add` 单个测试文件 / 混合（实现 + 测试）/ `git add -A` → 放行；`rm` / `git rm` / `git checkout --` 测试文件、Write 工具写测试文件 → 仍拦截；带授权标记 → 放行；Edit 工具改实现文件 → 放行。pi 端把扩展源文件原样载入（仅替换 pi 包 import）后用合成 tool_call 事件跑 12 条——含 `git mv` / `sed -i` / 输出重定向 / 带标记等场景，12/12 全部符合预期（同时验证改后 TS 可正常加载）。
- **落地边界**：pi 端扩展在会话启动时加载，已在运行中的会话仍持旧版（本次收窄对下一个会话生效）——已在跑的开发会话这一次仍需走例外标记或用户手动 `git add`，重启后不再需要。

### 变更（全局注册表超集映射表加行：Atlas 新增子项目 channels-watch）

- **为什么改**：2026-10-09 用户决定将视频号私信监控工具 channels-watch 立项并开源（仓库 xhqing/channels-watch），交由 FullStackEngineerAgent（Atlas）负责维护；作为 Atlas 的子项目登记进注册表。
- **改了什么**：`agents-registry.md` 超集映射表在 Atlas → ghostty 行后加一行：Atlas → channels-watch（视频号私信只读监控，Python + Playwright；2026-10-09 立项开源）。
- **镜像同步**：`claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致；顺带修正 `README_cn.md` 版本徽章落后（1.5.1 → 1.5.8）。

### 变更（全局注册表超集映射表加行：Kit 新增子项目 copybridge）

- **为什么改**：2026-10-09 核对团队仓库 Visitors 徽章数据源时发现，copybridge（2026-10-08 建立的 macOS 剪贴板桥接工具，已开源 xhqing/copybridge）尚未登记进注册表超集映射表与 ExecutiveAssistantAgent 子项目清单，一并补登（其采集列表登记已随同日 xhqing 变更完成）。
- **改了什么**：`agents-registry.md` 超集映射表在 Kit → blog 行后加一行：Kit → copybridge（macOS 剪贴板桥接工具；2026-10-08 建立、2026-10-09 登记）。
- **镜像同步**：`claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致。

## 2026-10-08

### 新增（电脑操作 computer-use 授权：用前必申请、用毕必通知归还）

- **背景**：2026-10-08 用户立规——此前开发 copybridge 时连续使用 computer-use 操作用户电脑，既未提前申请、用毕也未通知，与用户抢操作权、让用户空等。
- **规则**（写入全局 `~/.claude/CLAUDE.md`「工作规则」新增节）：任何 GUI 操作类能力（open-computer-use MCP、Codex computer-use 等任何等价工具）**使用前必须先向用户申请电脑操作授权**（说明要做什么、大概需要多久），得到明确同意后才能开始；**使用结束后必须主动通知用户并归还控制权**；授权不跨次复用；纯读取屏幕（截图）同属申请范围。
- **工具强制（pi 端）**：`~/.pi/agent/mcp-adapter.json` 已把 `open-computer-use` 的 `approveTools` 由 `false` 改为 `true`——每次调用都弹审批框（Allow once / Allow for session / Allow server for this session / Deny），授权选项由用户本人决定、AI 不得代点；无审批可答场景（headless）fail closed。注：该配置为本机运行时配置、不在镜像六部分范围，镜像只含规则文本。
- **镜像同步**：`claude/CLAUDE.md` 已随全局同步（2026-10-08，逐字节一致）。

### 变更（电脑操作授权节奏细化：开始前申请一次、中途不重复、结束通知归还）

- **背景**：2026-10-08 用户补充口径——「中间不要申请，开始用之前申请一次就行」。
- **细化**（`~/.claude/CLAUDE.md` 该节已改准）：**一次申请覆盖整段操作**——开始前申请一次（说明要做什么、大概多久），过程中不重复申请、不中途打断用户；操作结束后通知并归还；下一次操作重新申请（授权不跨次复用）。
- **弹框配合**：审批弹框仍是首道调用的兜底——用户在弹框选「Allow server for this session」即一次性放行整段操作、之后不再被打断（选「Allow once」则每次都会问，由用户自定）。
- **镜像同步**：`claude/CLAUDE.md` 已随全局同步（2026-10-08）。

### 变更（用毕通知升级：屏幕正中央确认弹窗 +「知道了」按钮 + 点击信号回传）

- **背景**：2026-10-08 用户指出会话内文字通知不可感知——操作完别的界面后，用户屏幕最上层是被操作界面的窗口、会话窗口被盖住，用户不知道何时结束；要求改为**屏幕正中央的系统弹窗** + 「知道了」按钮，用户点击即确认信号（控制权正式交还用户）。
- **新增**：`patch/done-dialog/done-dialog.sh`（屏幕正中央 `display dialog`；标题「电脑操作已结束」、唯一按钮「知道了」；支持传入「本次操作摘要」；阻塞等待点击——点击返回 `acknowledged`、中止返回 `dismissed`）。已实测全链路：弹窗 → 用户点击 → 信号回传（`acknowledged`）。
- **规则同步**：`~/.claude/CLAUDE.md` 该节「用毕」要求改为——必须弹该弹窗并等待点击才算完成交接；**不得只用会话消息 / 系统通知横幅替代**。
- **镜像同步**：`claude/CLAUDE.md` 与 `claude/patch/done-dialog/` 已随全局同步（2026-10-08）。

### 变更（computer-use 弃用并移除：规则改写 + 补丁脚本删除）

- **背景**：2026-10-08 用户实测后决定彻底弃用 computer-use（原话：「我不想用computer-use能力了，以后也不想用了」），要求删除相关 MCP 与工具。
- **全局处置**：pi 端 MCP 配置条目（`~/.pi/agent/mcp-adapter.json` 的 `open-computer-use`）移除、文件置空；全局 npm 包 `@qwen-code/open-computer-use` 卸载；MCP 元数据缓存删除；`~/.claude/patch/done-dialog/` 删除；运行中的相关进程经 launchctl / 空闲超时清理。
- **规则改写**：`~/.claude/CLAUDE.md` 该节由「用前必申请授权、用毕必弹窗归还」改为「已弃用并移除」——任何会话不得重装、启用或使用 computer-use 类工具（重装需用户明确同意）。
- **镜像同步**：`claude/CLAUDE.md` 已随全局同步；`claude/patch/done-dialog/` 镜像已删除（2026-10-08）。

### 变更（task-label：续接类输入不再覆盖任务标签）

- **为什么改**：2026-10-08 用户报告实缺陷——任务因模型报错意外中断后，用户在会话里输入 `continue` 继续，footer 的 task-label 就一直显示「正在处理：continue」、不再反映实际任务。根因：临时标签的保护条件是「输入长度 ≥ 8 个字符才当新任务」，「继续」只有 2 个字会被护住，但英文 `continue` 恰好 8 个字符、被误判为新任务描述，把整条标签覆盖成一个命令词；覆盖只进内存、要等本轮跑完且自动总结成功才能换回，长任务期间标签就一直错着。
- **改了什么**：`pi/agent/extensions/task-label.ts`（全局与镜像两处逐字节一致）——
  - 新增 `isContinuation()` 判定（连同 `CONTINUATION_HEAD_RE` / `CONTINUATION_FILLER_RE` 导出以便测试）：句首是续接用语（继续 / 接着 / 重试 / 重新 / 下一步 / continue / go on / keep going / carry on / resume / retry / try again …，可带「请 / please」前置），且剥掉语气词、指代词、泛动词后剩余实义内容不足 4 个字，才算「续接类」输入；「继续调研 vscode 问题」「keep working on the parser bug」这类带任务内容的输入仍按新任务处理；
  - `before_agent_start` 设置临时标签前先过 `isContinuation()`——续接类输入保留原标签（只把状态切成「正在处理」），不再覆盖；
  - `autoSummarize()` 的「已总结」计数 `lastSummarizedUserCount` 由「调用前记」改为「成功后才记」——总结失败时不再被标记成已总结，之后再有结算（越过 15 秒节流）会自动重试（本次事故里第一次自动总结恰逢模型 API 报错失败、标签卡在原始输入上，也有这个因素）。
- **测试**：`isContinuation` 用例表 35 例（中英文续接用语、带任务内容的续接式输入、边界空串）+ mock pi API 事件流 13 例（复现事故场景「已有标签 + continue 输入不覆盖」、无标签时续接输入不造标签、新任务正常替换、结算后自动总结替换、总结失败保留标签并允许重试）共 48/48 通过；真实 tmux 会话端到端实测：任务完成标签「✅ 完成：简单确认回复」→ 输入 `continue` → footer 保持「⏳ 正在处理：简单确认回复」（修复前会变成「正在处理：continue」）→ 结算后标签不变；再发真实新任务「帮我写一个统计当前目录文件数量的脚本并运行」→ 标签正常替换。持久化核对：`continue` 轮次的 task-label 记录写的是原任务标签、从未写入 `continue`。
- **镜像同步**：`pi/agent/extensions/task-label.ts` 已同步（与全局逐字节一致）。

### 变更（task-label：长路径 / URL 输入不再把标签挤成路径碎片）

- **为什么改**：2026-10-08 用户补充报告——临时标签直接取用户输入截断（40 字），当输入里带有很长的绝对路径（截图附件路径、项目文件路径等）时，标签截出来只剩「…/var/f…」这类没有语义的路径碎片，看不出会话在干什么。
- **改了什么**：`pi/agent/extensions/task-label.ts`（全局与镜像两处逐字节一致）——新增 `condenseForLabel()`，在临时标签截断前先去噪：
  - Markdown 图片（粘贴的附件）整体丢掉，链接只保留链接文字，尖括号链接脱壳；
  - URL 去掉协议与查询串，保留「域名 + 路径」这类有语义的部分；
  - 路径只保留文件名（`/Users/x/foo/bar.ts` → `bar.ts`）；文件名本身像机器长名（超过 24 字或含 ≥10 位连续十六进制串，如 `ghostty-paste-4728C268-…png`）就整个丢掉；整条输入只剩一个这样的长名路径时退回截断后的文件名（至少能看出「在弄一个文件」）；
  - 只对「像真路径」的 token 生效（「和/或」这类单斜杠普通文字、`TODO.md` 这类无路径文件名不碰），`isContinuation()` 的判定不受影响。
- **测试**：`condenseForLabel` 用例表 14 例（用户报告的真实长路径场景、项目文件路径、Windows / `~` 路径、URL 去协议去查询串、Markdown 附件、普通文字不误伤、长名路径退回文件名）+ mock 事件流复现用例 + 既有 48 例回归，共 64/64 通过；真实 tmux 会话端到端实测：发送带长路径的指令 → 进行中标签「⏳ 正在处理：看一下 test.ts 这个文件有多少行，先 sleep 15 再回复」（修复前会是「正在处理：看一下 /Users/xhq/Developer/Executiv…」）→ 结算后「✅ 完成：统计 test.ts 文件行数并测试延迟回复」。
- **镜像同步**：`pi/agent/extensions/task-label.ts` 已同步（与全局逐字节一致）。

## 2026-10-07

### 变更（backup skill 飞书端点：补两条实测踩坑）

在密码库云端异地备份落地过程中实测发现两条坑，补入 `skills/backup/references/feishu.md` 的坑位清单（第 5、6 条）：

- ① **`+upload` 同名不覆盖、会生成副本**：同一文件重复上传后云端出现两个同名文件（不报错、不覆盖）→ 自动化上传（定时 / 实时推送）**必须先删云端同名旧文件再上传**：`files list` 找到同名 token → `+delete --file-token <t> --type file --as user --yes` → 再 `+upload`，保证云端每个文件恒定一份。原文档只写了 `.md → docx` 路径的「不能同名覆盖」，二进制文件同样如此。
- ② **`--output` 只接受当前目录下的相对路径**：传绝对路径被拒（`unsafe output path`）→ 下载前先 `cd` 到目标目录、用 `./文件名`。

### 新增（task-label：pi 会话任务标签扩展）

- **为什么做**：用户要「动态自动显示 / 更新任务标签」——会话干活时界面显示「正在处理 T11」、干完自动切成完成态，方便在多个（tmux）会话间一眼看出各自在做什么。pi 的 TUI 本身没有「任务标签」概念（官方明确不含内置 to-do），但扩展可用 `ctx.ui.setStatus()` 在 footer 状态行渲染任意文本，这个能力此前没有现成实现。
- **改了什么**：新增 pi 端扩展 `pi/agent/extensions/task-label.ts`（同时装入全局 `~/.pi/agent/extensions/`，两处逐字节一致）：
  - 命令：`/task <文本>` 设置 / 更新标签、`/task done` 手动标记完成、`/task clear` 清除、`/task`（空参）查看当前状态；
  - 三态显示（footer 状态行）：空闲 `◦ <标签>`（暗色）→ agent 干活 `⏳ 正在处理：<标签>`（强调色，`agent_start` 自动切）→ 一轮彻底跑完 `✅ 完成：<标签>`（成功色，`agent_settled` 自动切；`ctx.isIdle()` 不为真时不误标，避免自动重试 / 排队消息中途误判完成）；
  - 持久化：按会话落 custom entry `task-label`（只存 label + done，「正在处理」是瞬态、不落盘），`/new`、`/resume`、`/fork`、`/reload` 时自动重载对应会话的标签；
  - 防御性：UI 与落盘调用均有 try/catch，扩展失灵不影响会话。
- **测试**：mock pi API 用例 25/25 通过（设置 / 清除 / 恢复、干活途中设置、再开工自动切回、非 idle 不误标、换会话清态、清洗与截断、无标签 done 警告等）；真实 tmux 会话端到端实测三态（`✅ 完成` → `⏳ 正在处理` → `✅ 完成`）全部符合预期。
- **镜像同步**：`pi/agent/extensions/task-label.ts` 已同步（与全局逐字节一致）。

### 变更（task-label 升级：标签自动总结，不再必须手动设置）

- **为什么改**：用户在 1.5.0 落地后追问「标签总是需要人设置吗？不会自动总结会话内容为标签吗」——v1 只能手动 `/task` 设置，不符合「多个会话一眼看出在干什么」的需求。
- **改了什么**：`pi/agent/extensions/task-label.ts` 升级（全局与镜像两处逐字节一致）：
  - **自动总结（默认开）**：agent 每干完一轮（`agent_settled`）后台用当前会话模型总结最近会话片段（最多 12 条消息 / 6000 字符），生成不超 30 字的标签自动替换旧标签；干活途中先用用户输入做临时标签（「继续」这类短句不覆盖旧标签）；总结结果会清洗掉模型可能多写的「总结：」前缀 / 引号 / 句末标点；
  - **节流与安全**：同一会话两次总结至少隔 15 秒、且必须比上次总结多出新的用户消息才再调；单次 30 秒超时；换会话或新一轮开始后过期的总结结果直接丢弃；失败静默保留现有标签；非交互模式（`-p` 等）不调；
  - **手动仍可钉住**：`/task <文本>` 手动设置后自动总结暂停；`/task auto [on|off]` 查看 / 开关自动总结（默认 on，开启时空闲会立刻总结一次）；`/task clear` 清标签但保留自动总结；
  - 持久化字段扩为 `label / done / auto / source`；旧格式（无 source）按「自动开 + 手动」兼容恢复。
- **测试**：mock pi API 用例 38/38 通过（含自动总结触发 / 无新输入不重复调、手动钉住、开关、旧数据恢复、短句保留旧标签、清洗截断、过期结果丢弃等）；真实 tmux 会话端到端实测：临时标签 `⏳ 正在处理：请从1数到50…` → 干完 `✅ 完成：…` → 数秒后被自动总结替换为 `✅ 完成：自我介绍与连续数数测试`（真实模型调用成功）。
- **镜像同步**：`pi/agent/extensions/task-label.ts` 已同步（与全局逐字节一致）。

### 变更（task-label：临时标签截断处补省略号「…」）

- **为什么改**：用户发现干活途中的临时标签显示的是自己输入的原文、结尾被硬切——临时标签是用户输入清洗后直接截断到 40 字符（无省略号），观感像 bug、也不易看出「干完会换成自动总结」。
- **改了什么**：`pi/agent/extensions/task-label.ts`（全局与镜像两处逐字节一致）：
  - `clean()` 增加 `ellipsis` 选项（默认关闭、行为不变；开启时超长文本截到 `max-1` 字符 + 补「…」，总长仍不超过 `max`）；仅临时标签调用处开启（`before_agent_start` 里 `clean(event.prompt, PROVISIONAL_LEN, true)`）。
  - 其它调用路径不受影响：手动标签（80 字）、总结清洗（240 字大范围）、历史标签恢复保持原行为（不加省略号）。
- **测试**：`clean()` 边界用例——短输入不截断、正好 40 字不截断不加省略号、超长截 39 字 +「…」（总长 40）、含换行 / 制表符折成空格、手动标签 80 字路径行为不变；`bun build` 转译通过。
- **镜像同步**：`pi/agent/extensions/task-label.ts` 已同步（与全局逐字节一致）。

## 2026-10-04

### 新增（kdbx-guard：密码库 / 密钥文件的删除与覆盖硬拦截）

- **为什么做**：2026-10-04 用户在配置 KeePass 双端同步（Syncthing 手机 ↔ Mac）时明确提出「担心 AI 误删电脑端数据库文件」。风险是复合的：数据库内容丢了无法重建，而文件同步的语义是「两端完全一致」——**本机删除会传播到对端**，一次误删 = 两端同时失去数据（对端只剩 `.stversions` 里一份需人工取回的归档）。此前只有文本纪律（「增改查优先、慎用删除」），对这类文件没有任何硬闸。
- **改了什么**：
  ① 新增 pi 端扩展 `pi/agent/extensions/kdbx-guard.ts`（tool_call 拦截，两端同源判定）：A) 写 / 编辑类工具（write / edit）命中受保护路径直接 deny（无逃生门）；B) bash / powershell 的删除 / 移动 / 清空动作（`rm` / `mv` / `unlink` / `shred` / `trash` / `truncate`、`find -delete`、`>` 重定向覆盖）命中受保护路径时 deny，命令带标记 `AI_AUTHORIZED_KDBX_OP` 放行。
  ② `~/.claude/hooks/pre-tool-use-guard.sh` 新增**规则 7**（Bash 删除 / 移动 / 覆盖）与**规则 7 前置段**（Write / Edit / MultiEdit / NotebookEdit 等写类工具按 `file_path` 拦截；因该段需在 Bash 早退之前执行，`deny_msg()` 函数定义上移到脚本前部）；与 pi 端判定逻辑逐条对齐。
  ③ 受保护目标：任何含 `.kdbx` 的路径、`~/Key/` 与 `/Key/` 下的密钥文件、含 `KeePass` 的目录、`~/Sync` 同步根目录（覆盖 `rm -rf ~/Sync` 这类连窝端与 `rm -rf ~/Sync/KeePass/*` 这类通配删除）。绝对路径统一写作 `/Users/[^/]+/Sync` 通配、**不硬编码个人路径**（仓库既有规范：脚本统一用 `~` / `$HOME` 展开、便于开源镜像直接复用）；首版实现曾写成 `/Users/<本机用户名>/Sync` 字面量，/add 预检被拦下后改为通配形态。
  ④ 全局 `~/.claude/CLAUDE.md`「工作规则」新增子节「**密码库与密钥文件不得删除 / 移动（钩子已硬拦截）**」——说明保护对象、拦截动作、逃生门，以及「正常使用不触发本规则」的边界（读写密码库由 KeePassXC / KeePassDX 自身完成，不需要 AI 碰文件）。
- **测试**：同组 25 用例对照测试（Bash 删除 / 移动 / 覆盖 11、写类工具 4、既有规则回归 10），CC 端 25/25；pi 端另用 15 用例组验证 15/15，逐条结果一致。边界用例覆盖「带 `AI_AUTHORIZED_KDBX_OP` 标记放行」「普通 `rm -rf ~/Downloads/junk` / `mv` 放行」「`read` 工具读库放行」「`rm -rf ~/Sync` 连窝端拦截」。可移植化改造后两端各重跑 13 例路径匹配测试（绝对路径当前用户 / 任意用户、`~` / `$HOME` 形态、通配删除、带标记放行、普通删除与「别的路径含 Sync」不误伤）13/13、13/13。
- **镜像同步**：`claude/hooks/pre-tool-use-guard.sh`、`claude/CLAUDE.md`、`pi/agent/extensions/kdbx-guard.ts` 已同步；六部分 diff 核对一致。

### 变更（commit 判定收紧：文本提及不再误触发守卫）

- **为什么改**：当日 kdbx-guard 的测试里，把测试用例写成 JSON 字符串喂给 CC 钩子，其中一条 payload 含 `"command":"git commit -m test # AI_AUTHORIZED_COMMIT"`——pi 端 `git-status-guard.ts` 的判定是「命令里同时出现 `AI_AUTHORIZED_COMMIT` 与 `git commit`」（全文包含式匹配），于是把这段**文本**误判成「本次 run 发生过授权 commit」，强制要求在最终回复里贴 `git status` 块（还让用户误以为真的执行了 commit）。同一原因下 `git-commit-guard.ts` 与 CC 钩子规则 3 也会对含这类文本的命令误报拦截。误伤方向虽安全（多拦 / 多提醒，不放松），但造成困惑、且掩盖了真正的触发信号。
- **改了什么**：三处判定统一收紧为「**按 `&&` / `||` / `;` / `|` / 换行切分命令段后，只认段首为 `git` 的命令段**」——
  ① pi 端 `pi/agent/extensions/git-commit-guard.ts`：新增 `SEGMENT_SPLIT` + `GIT_COMMIT_SEGMENT` 常量与 `hasGitCommit()` 函数，替换原全文包含式正则；
  ② pi 端 `pi/agent/extensions/git-status-guard.ts`：同源复制同一判定（`isAuthorizedCommit` 改为「命令含标记 + 存在 git commit 段」）；
  ③ `~/.claude/hooks/pre-tool-use-guard.sh` 规则 3：新增 `is_git_command()` 辅助函数（切段 → 去前导空白 → 段首必须 `git` → 子命令匹配），规则 3 改用它（规则 5 / 6 暂未改，属同族、可按需再收）。
- **合法路径不受影响**：`/commit` skill 的真实写法 `git commit -m "<msg>" && git push # AI_AUTHORIZED_COMMIT` 仍照常识别（切段后首个 `git` 开头的段命中 `commit`；标记在整条命令里、不要求与 commit 同段）；`cd <repo> && git commit ...`、`git -C <repo> commit ...`、`git status ; git commit ...` 同样命中；`git log --grep=commit`、`git commit-tree` 仍不命中。
- **测试**：pi 端 12 用例（含 skill 串联写法、`cd` / `git -C` / 分号串联、`git log --grep=commit`、`commit-tree`、文本提及两例）全部通过；CC 端 18 用例（规则 3 处理 11 + 规则 7 回归 4 + 规则 1/2/6 与普通命令回归 3）全部通过；两端结论一致。
- **镜像同步**：`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/git-commit-guard.ts`、`pi/agent/extensions/git-status-guard.ts` 已同步；六部分 diff 核对一致。

### 新增（session-sweep：后台会话清扫器 + 用完即清 / 不活跃即清规矩）

- **为什么做**：用户 2026-10-04 明确——「**我看不到后台会话，后台会话对我来说等于不存在**」，要求「只要不活跃都要清理掉，或者用完就清理掉」。现状是代际遗田：tmux 里挂着一堆 `pi-<名字>` 后台会话（实测 21 个），其中 19 个已空闲约 29 小时（10-03 团队批量化唤醒留下），而且全部无 tmux 客户端附着（= 没人看得见）；光靠「下次记得清」的文本纪律不可靠，需要工具。
- **改了什么**：
  ① 全局 `~/.claude/CLAUDE.md`「会话间协作」节新增一条「**后台会话用完即清、不活跃即清**」：用完就清（`agent_call` / `agent_wake` 拉起的会话完成使命后主动 `tmux kill-session`，下次需要会重新唤醒）；不活跃就清（空闲 ≥ 30 分钟且无人在看）；明确「不能自作主张清」的四类（真实 tty 上的会话、30 分钟内有活动、活跃工作流等反馈、拿不准的情况）；给出「无人在看」「空闲」的判定方法（tmux 附着计数 + 会话记录文件 mtime，含 slug 推导规则）。
  ② 新增 `patch/session-sweep/session-sweep.py`（可移植、无硬编码个人路径）：默认干跑列出候选与保留理由，`--kill` 才真关闭；支持 `--idle-min` / `--exclude` / `--kill-unknown` / `--json`；安全阀——只动 `pi-` 前缀、有客户端附着的跳过、非 tmux 的 pi 进程不动、记录文件匹配不到的默认不动。会话→记录文件的映射用「进程启动时间 ↔ 文件名 UTC 时间戳」（实测误差 0–1 秒）。
- **当时执行的清理**：20 个后台会话（含 19 个空闲 ≈ 29 小时 + 1 个从未使用的空会话 `pi-vendy`）已关闭，0 失败；`pi-Victor`（27 分钟前还在活跃工作流里等反馈）按规矩保留。另有 2 个非 tmux 的 tty 会话（GrowthMarketerAgent / CommunityManagerAgent）属用户可见范围，未动。
- **镜像同步**：`claude/CLAUDE.md`、`claude/patch/session-sweep/session-sweep.py` 已同步；六部分 diff 核对一致。

### 变更（会话保护 + 跨会话委派提交：两条新规矩配套工具强制）

- **为什么做**：用户在「后台会话用完即清」立规后立刻补了两条边界与一条授权——
  ① **终端窗口里的 pi 会话（前台）由用户本人操作，禁止 agent 用命令关闭**（他看得见这些会话、会自己处理）。风险很实：`pkill -f "pi -n"`、`kill <pid>`、`tmux kill-server` 这三类写法都会误伤用户正在用的会话（`kill-server` 更是把用户自己的 tmux 会话一起端掉）。
  ② **其它 agent 的仓库有待提交内容时自动委派**：用户原话「每次检查到或者得知其它 Agent 的仓库有需要 commit 的内容就自动 call 这个 agent 使用 /add skill 或 /commit skill 处理一下，不要每次都问我」——把「跨会话委派提交」升为常设授权，省去反复确认。
- **改了什么**：
  ① 全局 `~/.claude/CLAUDE.md`：「Git 写操作必须先征得同意」节新增「常设授权：其它 agent 仓库有待提交内容 → 自动委派，不必询问用户」条目；「Git 暂存区禁止 AI 自主增删改」节把 commit 的明确授权从「三种形式」扩为「**四种形式**」（新增 ④ 跨会话委派）；「工作规则 · 会话间协作」节新增同一条的完整条目（含授权边界：只允许委派对方按它自己的 skill 流程提交，不得由本会话替对方仓库执行 git 写操作）；「后台会话」条目新增子条「**用户终端里的会话（前台）一律不许用命令关闭**」（禁止 kill/pkill/killall 打 pi 进程、禁止 `tmux kill-server` 与指向非 `pi-` 名字的 `kill-session`；关闭后台会话只能 `tmux kill-session -t <pi-名字>`）。
  ② 新增 pi 端扩展 `pi/agent/extensions/session-guard.ts`（与 CC 钩子规则 8 同源）：拦 `tmux kill-server`、拦指向非 `pi-` 名字的 `tmux kill-session`、拦打 pi 进程的 `kill` / `pkill` / `killall`（两种识别方式：命令文本出现 pi 特征；或目标是具体 pid 且实测 `ps` 显示该进程就是 `pi`——用于抓裸 `kill <pid>`）；逃生门标记 `AI_AUTHORIZED_SESSION_KILL`。
  ③ `~/.claude/hooks/pre-tool-use-guard.sh` 新增**规则 8**（同源判定）；规则 3 与 pi 端 `git-commit-guard.ts` 的 deny 消息、`skills/commit/SKILL.md` 的标记说明同步补上第四种授权形式。
- **测试**：pi 端 14 用例、CC 端 17 用例（含 tmux 两类、kill/pkill/killall、按 pid 实测识别、合法路径 `tmux kill-session -t pi-*` 放行、带标记放行，以及规则 2 / 7 的回归），两端全部通过。
- **镜像同步**：`claude/CLAUDE.md`、`claude/skills/commit/SKILL.md`、`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/session-guard.ts`、`pi/agent/extensions/git-commit-guard.ts` 已同步；六部分 diff 核对一致。

### 变更（收尾自动巡视：session-sweep 扩展 + 清扫器安全阀）

- **为什么做**：用户给「后台会话不活跃即清」定了清扫方式——**不挂系统定时器**，改成「agent 干完活收尾时顺手跑一次 `session-sweep.py`」。光靠 agent 记性不可靠，故工具化：新增 pi 端扩展在 `agent_settled`（Pi 不会再自动继续）时自动巡视。
- **改了什么**：
  ① 新增 `pi/agent/extensions/session-sweep.ts`：`agent_settled` 时巡视一次（全局 10 分钟节流）——空闲 **≥ 6 小时**的明显僵尸自动 `--kill`；**30 分钟 – 6 小时**的只 notify 列清单、**不自动杀**（避免误伤刚用完或在等工作流反馈的会话）。
  ② `claude/patch/session-sweep/session-sweep.py`：`--json` 改为**纯 JSON 输出**（此前混人类可读文字，会让上游扩展的 `JSON.parse` 静默失败）；`--kill` 结果纳入 JSON 的 `killed` 字段；新增**安全阀**——`--idle-min < 10` 分钟或候选 > 3 个时**拒绝执行**，除非显式 `--force`。
  ③ 全局 `~/.claude/CLAUDE.md`「后台会话」条目补「清扫方式（不挂定时器）」与「脚本安全阀」两条。
- **事故记录（安全阀的由来）**：脚本改完后为测 kill 路径跑了 `--idle-min 0 --kill --kill-unknown`，结果把**三个真实会话**一并清掉——正在跑提交流程的 `pi-Prometheus`、在等工作流反馈的 `pi-Victor`、以及 `pi-buzz`。所幸 Prometheus 的提交与 bump 在被杀前已完成（`7163ef8` + PR #5 → `9943c59`，工作区干净、无锁文件），未丢工作；但 **v1.3.0 的 tag / Release 因进程被杀而中断**（已重新委派补齐）。安全阀即由此事故而来：批量或低阈值清理必须先干跑看清单。
- **测试**：扩展端模拟 `agent_settled`——30 分钟 – 6 小时区间只 notify ✓、10 分钟节流生效 ✓；脚本端验证低阈值拒绝（退出码 2）、候选 > 3 拒绝、`--json` 可直接被 JSON 解析器读取 ✓；另用自建的 `pi-zombietest` 会话验证了 `--kill` 真能关闭目标会话 ✓。
- **镜像同步**：`claude/CLAUDE.md`、`claude/patch/session-sweep/session-sweep.py`、`pi/agent/extensions/session-sweep.ts` 已同步；六部分 diff 核对一致。

### 修复（public-text-guard 误伤：含版本号的分支名被当成推 tag）

- **为什么改**：Prometheus 走 bump 链时报了实证——`git push origin chore/bump-v1.4.0` 这类**分支推送**被 public-text-guard 拦下（「refspec 形如版本号」那一条没有前边界，`bump-v1.4.0` 里出现了 `v1.4.0` 就命中），必须额外带 `AI_SENSITIVE_CHECKED` 才能过；同日我自己跑的验收命令里含这段文本也被拦，属同一误伤。
- **改了什么**：两端同源收紧——形如版本号的 refspec 必须是**裸 token**（前面不能是字母数字 / `/` / `.` / `-`，后面同理）：
  ① pi 端 `pi/agent/extensions/public-text-guard.ts`：版本号分支加前后边界 `(?<![\w/.-])v?\d+\.\d+\.\d+(?![\w/.-])`；
  ② `~/.claude/hooks/pre-tool-use-guard.sh` 规则 6：改写为 `([^[:alnum:]/_.-]|^)v?[0-9]+\.[0-9]+\.[0-9]+([^[:alnum:]/_.-]|$)`（ERE 无 lookbehind，用前导字符类等价表达）。
  `--tags` / `--follow-tags` / `refs/tags/` 三种写法判定不变，真推 tag 照旧拦截。
- **测试**：CC 端 18 用例、pi 端 13 用例（含 `v1.4.0^{}`、`refs/tags/`、`--tags`、`--follow-tags`、`gh release create`、`gh pr create`、打 annotated tag 仍拦；`chore/bump-v1.4.0`、`bump-v1.4.0`、`bugfix/v2.0.1-x`、`release/1.2.3` 改为放行；带标记放行、普通推送与查询不受影响），两端全部通过。
- **镜像同步**：`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/public-text-guard.ts` 已同步；六部分 diff 核对一致。

### 新增（分支保护试点 + 「main 是否锁定」口径修正 + `docs/repo-branch-protection.md`）

- **为什么做**：Prometheus 报「守卫修复直推 main」时发现政策口径与现实不符——文档写「remote main 已锁定直推、一切经 PR + CI 合并」，实测全机 42 个远程仓库里只有 **4 个**真开了保护，35 个 public 仓库裸着（直推永远成功，技能里「push 被拒 → 走 PR 兜底」的分支永不触发），当天一次正常直推被当成异常追查。
- **改了什么**：① 新增 `docs/repo-branch-protection.md`（事实来源 7 个已保护仓库 / 未保护范围 / private 受限、试点参数模板、铺开前必先开 auto-merge 的前置条件、常用命令含「gh api 的 404 响应体是合法 JSON，判定要看退出码」这个坑、紧急关闭逃生门）；② 全局 `~/.claude/CLAUDE.md` 口径改为「直推可用性**视仓库实际保护状态**而定、不全局默认锁定」并指向新文档；③ 用户决策试点：`CapabilityManagerAgent`、`ExecutiveAssistantAgent`、`zcode-cli` 开启保护（要求 PR（0 批准）+ 必需检查 `validate` + **对管理员同样生效** + 禁强推 + 禁删分支）。
- **未铺开其余 32 个的原因**：它们 `allow_auto_merge=false`，直接开保护会让 PR 悬空（技能 9z 只等 15 分钟），铺开前必须先开 auto-merge；另 `zcode-cli` 的定时任务 `prepare`（schedule 触发）连续失败（`bun run sync` 退出 1），因其不是 PR 检查、未挂为必需检查（已告知用户）。

### 修复（镜像 `claude/docs/` 被 .gitignore 静默吞掉——docs 从未发布过）

- **事故**：同步 `docs/repo-branch-protection.md` 时发现镜像仓库远端 `claude/` 下只有 `CLAUDE.md` / `hooks` / `patch` / `skills`——**整个 docs 部分从未入库**。根因：`.gitignore` 第 29 行一条**裸 `docs/`** 规则（从模板带来的「运行时数据目录」规则）把 `claude/docs/` 一并匹配掉了；本地 `diff` 校验全绿、远端却少一整部分，**单靠 diff 发现不了**。
- **改了什么**：① 镜像仓库 `.gitignore` 的 `docs/` 改为 `/docs/`（只限定根目录，保留模板原意、不再吞镜像部分）并加注释说明事故；② 全局 `~/.claude/docs/capability-sync.md`「怎么验证」节补要求——除了 `diff -r`，**还要确认六部分在 git 里是「已跟踪」状态**（`git ls-files` 非空 / `git check-ignore` 无输出）；③ 补齐 docs：`agents-registry.md`、`capability-sync.md`、`new-agent-scaffold.md`、`repo-branch-protection.md` 四个文件解除忽略后随本次提交入库。
- **影响面核查**：全机 23 个仓库有同样的裸 `docs/` 规则，但**多数是有意为之**——如 `ExecutiveAssistantAgent` 的 `docs/` 装的是简历 PDF、投标模板、面试准备等业务/隐私数据（注释写明「可能含明文账号密码」），忽略是**正确且必要**的（实际上保护了这些内容没进 public 仓库）；`blog` 的 docs 正常跟踪（140/140）。仅镜像仓库该规则属误伤模板残留。
- **镜像同步**：`claude/CLAUDE.md`、`claude/docs/*.md`、`.gitignore`。

### 变更（新增第 5 种 commit 授权形式：常设授权「有待提交内容即直接提交，不用问」）

- **为什么做**：用户 2026-10-04 明确「**下次工作区或暂存区有待提交的内容就直接触发 /add 或者 /commit 提交，不用问我**」——把「发现有待提交内容 → 走 skill 流程提交」从「逐次询问」改为**常设授权**，减少反复确认。授权边界：**授权的是流程、不是跳过检查**——add / commit skill 的全部安全阀（gitleaks + AI 语义预检、暂存区敏感扫描、cache 检测、需人工过目即停在 add 阶段、发版异常暂停等）照常生效。
- **改了什么**：
  ① 全局 `~/.claude/CLAUDE.md`：「Git 写操作必须先征得同意」节新增常设授权条目；「Git 暂存区禁止 AI 自主增删改」节把 commit 的明确授权从「四种形式」扩为「**五种形式**」（新增 ⑤ 常设授权），并明确口头泛指令不算**单次**授权但仍受常设授权约束。
  ② CC 钩子 `pre-tool-use-guard.sh` 规则 3、pi 端 `git-commit-guard.ts` 的 deny 消息、`skills/commit/SKILL.md` 的标记说明同步补上第五种形式。
  ③ **首次演练（ExecutiveAssistantAgent 项目）**：该仓库工作区改动（新增 termux-ssh skill + README 双语 skills 清单修正 + CHANGELOG）按新授权**直接走完 /add → /commit**——预检三步全绿（不入库检测 / gitleaks 零命中 / AI 语义扫描零可疑块）→ 5 文件入暂存 → `git commit` → **直推 main 被新开的分支保护拒绝**（保护试点当场得到验证）→ 自动走 PR 兜底通道（PR #3）→ auto-merge 合并 → 9z 步骤按 skill 的场景 B 用非破坏性 `git branch -f` 对齐本地 main、清理本地与远端源分支；全程未询问用户。
- **镜像同步**：`claude/CLAUDE.md`、`claude/hooks/pre-tool-use-guard.sh`、`claude/skills/commit/SKILL.md`、`pi/agent/extensions/git-commit-guard.ts` 已同步；六部分 diff 核对一致。

### 变更（add skill：description 与授权段补「常设授权」触发来源）

- **为什么改**：上一批同步漏了一处——`skills/add/SKILL.md` 的 description 与「授权边界」段仍只写「用户触发 /add，或 bump 自动衔接」，未反映 2026-10-04 新立的常设授权（工作区 / 暂存区有待提交内容即直接发起）；commit skill 已补、add skill 漏补，两边口径不一致会导致「该自动发起时没发起」。
- **改了什么**：`claude/skills/add/SKILL.md`：description 补「或发现工作区 / 暂存区有待提交内容时自动发起」；「授权边界」第 1 条补常设授权形式（`check_description.py` 复检 PASS，772/1024）。
- **镜像同步**：`claude/skills/add/SKILL.md` 已同步。

### 修复（commit skill：PR 合并后远端源分支清理补全——`--auto` 异步合并下 `--delete-branch` 不生效）

- **为什么修**：2026-10-04 分支保护试点后首次实走 PR 通道（PR #8）发现的流程缺口——`gh pr merge --auto --delete-branch` 只启用 auto-merge 就退出，**异步完成的合并不会执行删除**（`gh` 不在场）；仓库又未开 `delete_branch_on_merge` 时，远端源分支合并后一直挂着。核查：`chore/publish-claude-docs`（PR #8）合并后仍在远端；`chore/gate-changelog`（PR #1，2026-09-06）更是挂了近一个月，属同类尾巴的长期积累。
- **改了什么**：① commit skill 9z 新增「远端源分支清理」步骤——PR 确认 MERGED 后核验并 `git push origin --delete <分支>`（失败不阻断对齐、如实报告）；② 第 8 步两处「删除远端分支」的表述修正为「异步 auto-merge 下 `--delete-branch` 不生效、由 9z 核验清理兜底」，消除技能承诺与实测的偏差；③ 本仓库侧开启 `delete_branch_on_merge=true`（GitHub 在合并时自动删分支，与 9z 显式清理互为兜底）。
- **清理**：远端 `chore/gate-changelog`、`chore/publish-claude-docs` 两个已合并分支已删除，远端仅剩 `main`。
- **镜像同步**：`claude/skills/commit/SKILL.md`。

### 变更（release skill 产物核查改为「以项目声明为准」；本项目声明不带产物）

- **为什么改**：2026-10-04 用户立规——发版产物问题「以后不要再询问」。背景：v1.1.0 / v1.2.0 发版时 release skill 第 7 步按「本仓库历史 Release 挂过 assets」（v1.0.0 在案）暂停等待裁决；用户说明 v1.0.0 的 assets 是当时**借 Release 作备份**、并非发布惯例——该历史信号在本仓库属假信号。同时用户要求不能一刀切「全局一律不带产物」：VSCE / 二进制类项目的产物是安装链路必需品（如 vsce-install 从 Release 取 vsix），一刀切会静默破坏那些项目。
- **改了什么**：① `skills/release/SKILL.md` 第 7 步重写为「产物核查（以项目声明为准）」——**取消「本仓库历史 assets」信号**；「项目规则 / 文档 / 项目 skill / cache 明确声明要产物」「仓库存在 tag 触发产物 workflow，或 README 下载链接指向 Release 产物」「fork upstream 同名 tag 挂 assets」任一命中（= 已声明）→ 照常构建上传；未声明 → 默认不带产物、直接发布、不再询问。「注意」段与 description 同步。② 全局 `~/.claude/CLAUDE.md`「/release」授权段补限定：产物按项目声明为准，未声明默认不带、不询问。③ 本项目根 `CLAUDE.md` 增加项目级发版声明「本仓库发版不带产物（历史 v1.0.0 assets 属借用备份，不代表惯例）」。
- **镜像同步**：`claude/skills/release/SKILL.md`、`claude/CLAUDE.md` 已同步（`diff` 逐字节一致；`~/.pi/agent/skills` 与 `~/.claude/skills` 同 inode，自动跟随）。
- **关联**：v1.2.0 已于本日前序发布（用户裁决：不带产物）；本改动经 `/add` → `/commit` 自动链提交，并随自动发版链发布。

## 2026-10-03

### 变更（release skill：公开文本发布前敏感自检）

- **为什么做**：release skill 对外公开的文字内容（Release notes、annotated tag message）此前没有独立的敏感信息检测环节——既有的三道防线（add 预检、commit 暂存区扫描、gitleaks pre-commit hook）全发生在「文件进仓库」环节；而 release 对外文本有三个路径不在扫描链内：① CHANGELOG 缺条目时的手写 notes；② `--generate-notes` 现场生成的文本；③ 翻译现场生成的新文字（信息源自已扫过的 CHANGELOG，但属现场生成、无复核环节）。Release 一旦发布即面向全球公开（Release 页面、通知、RSS 分发），曝光面大于仓库文件本身，需要补一道发布前最后防线。
- **改了什么**：`skills/release/SKILL.md` 第 4 步新增「**公开文本敏感自检（打 tag 前必做）**」子段——
  ① **时机**：notes 与 tag message 定稿后、任何公开动作（打 tag / 推 tag / 建 Release）之前；
  ② **对象**：notes 文本与 tag message 文本（同源时合并扫一份、有差异分别扫；title 由项目名 + 版本号构成、不专门检测）；
  ③ **方式**：工具 + 语义两层（口径与 /add 预检一致）——待发布文本写入 `tmp/` 临时文件跑 gitleaks（缺失 / 失败降级 AI 正则扫描并标注），AI 逐段检查三类敏感内容（财务状况 / 个人隐私标识 / 敏感叙述，拿不准按可疑处理），白名单联动 `.commit-cache.md`（范围外照常扫、凭证实值不适用白名单）；
  ④ **`--generate-notes` 来源**：改用 `gh api .../releases/generate-notes` 预生成文本 → 自检 → `--notes-file` 传入（保持「自检早于公开」不变量）；
  ⑤ **命中处理**：暂停本次发布（不 tag、不推、不建 Release）、报告命中内容与处理建议，用户处理后重新触发 `/release`（白名单条目当次追加、下次起效，与 /commit 机制一致）；自检通过（含白名单跳过）在汇报中注明。
  同步更新：授权语义异常清单新增第 6 条（公开文本敏感自检命中）、预发布通道「流程差异」句补「无论 notes 来源为何均须过自检」、注意节与汇报节、description（656/1024 字符）。
- **镜像同步**：`claude/skills/release/SKILL.md` 已同步（pi 端与全局为同一硬链接文件，编辑即两端生效）；其余五部分未动。

### 新增（release-guard：发布公开动作敏感自检硬拦截）

- **为什么做**：按「规矩必须配套工具强制」元规则，为同日新增的 release skill「公开文本敏感自检」配套硬拦截——此前自检只靠文本纪律，若执行者跳过自检直接打 tag / 发 Release，未检查的文本（tag message / Release notes）即公开且事后无拦截点。
- **改了什么**：
  ① 新增 pi 端扩展 `pi/agent/extensions/release-guard.ts`（tool_call 拦截）：命令未带标记 `AI_SENSITIVE_CHECKED` 时，对三类公开发布动作一律 deny——打 annotated tag（`-a`/`--annotate`/`-m`/`--message`/`-F`/`--file`）、推送 tag（`--tags`/`--follow-tags`/`refs/tags/`/refspec 形如版本号）、`gh release create|edit`；查询类（`git tag -l`、`git push` 普通分支、`gh release view/list`）与本地删除类（`git tag -d`）不拦。
  ② `~/.claude/hooks/pre-tool-use-guard.sh` 新增**规则 6**（CC / CodeBuddy 等端，与 pi 端判定逻辑对齐、两端同步改）；`release-guard.ts` 与其余 guard 同构（防御性 catch、不阻塞会话）。
  ③ `skills/release/SKILL.md`：第 4 步自检子段补「完成后的放行标记（工具强制）」条目，第 5-7 步命令示例带 `# AI_SENSITIVE_CHECKED` 标记，注意节补 release-guard 说明（description 656/1024 不变）。
- **测试**：两端同组 29 用例对照测试（tag 创建 9、tag 推送 8、gh release 6、标记放行 3、无关命令 3），CC 端 29/29、pi 端 29/29、逐条结果一致。
- **镜像同步**：`claude/skills/release/SKILL.md`、`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/release-guard.ts` 已同步；其余部分未动。

### 变更（public-text-guard：范围扩展至 PR / Issue 公开文本；commit / dev-workflow skill 配套）

- **为什么做**：PR title / body、Issue 文本、commit message 与 Release notes 一样是「会发出去的公开文字」，但此前不在任何扫描链内——文件内容有三道防线（add 预检 / commit 扫描 / gitleaks hook），这些**现场生成的文本**是空白；PR body 还是 AI 基于 diff 的自由概括，最容易从对话上下文带出敏感信息（100% 真实事故类型：敏感信息进 git 历史只能 filter-repo 重写）。用户 2026-10-03 要求补齐三项（skill 纪律 + PR / Issue 工具拦截 + commit message 纪律）。
- **改了什么**：
  ① pi 端扩展 `release-guard.ts` **更名为 `public-text-guard.ts`** 并扩展范围——新增 `gh pr create|edit`、`gh issue create|edit` 两类拦截（原覆盖打 tagged tag / 推 tag / Release 创建编辑不变）；更名原因：职责已从「发布链」扩到「一切公开文本」。判定逻辑与 CC 端保持一致。
  ② `~/.claude/hooks/pre-tool-use-guard.sh` 规则 6 同步扩展（加 PR / Issue 正则；注释与 deny 消息更新为 public-text-guard）。
  ③ `skills/commit/SKILL.md`：新增「公开文本敏感自检（commit message / PR / Issue）」节（时机、两层检测方式、工具强制说明）；第 6 步（生成 commit message 后自检）、第 8 步两处 `gh pr create`（带 `# AI_SENSITIVE_CHECKED` 标记 + 建前自检）同步；description 更新（997/1024）。
  ④ `skills/dev-workflow/SKILL.md`：第 7 步 PR 命令带标记 + 「建 PR 前先过公开文本自检」bullet；第 1 步 `gh issue create` 补「公开前自检、带标记」；授权边界段两条创建命令补标记要求；description 更新。
  ⑤ `skills/release/SKILL.md`：守卫引用全面更名（release-guard → public-text-guard）+ 补「同时覆盖 PR / Issue」指向。
- **测试**：两端同组 40 用例对照测试（新增 PR / Issue 用例 14 条），CC 端 40/40、pi 端 40/40、逐条一致；实机验证（无头 pi 加载扩展）：无标记 `gh pr create` 被拦截未执行、带标记 `gh issue create` 放行执行（测试环境无 remote、gh 自身报错，与守卫无关）。
- **镜像同步**：`claude/skills/commit|dev-workflow|release/SKILL.md`、`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/public-text-guard.ts`（旧 `release-guard.ts` 删除）已同步；其余部分未动。

## 2026-10-02

### 变更（发版自动链扩展：未就绪自动 /bump → /add，全链自动化）

- **为什么做**：用户 2026-10-02 追加要求——「不要提示我 /bump：如果检测出来需要先 /bump 则自动触发 /bump，bump 之后自动触发 /add」。上一版（同日前述条目）实现为「版本未就绪时不触发 release、**提示**先 /bump」；用户要求把 bump 环节也自动化，使 commit 流程在检测到「有新提交但版本未就绪」时直接补齐版本并一路发版，全程不提示、不询问。
- **改了什么**：
  ① `skills/commit/SKILL.md`：第 10 步「版本就绪检查」由「未就绪 → 不触发 + 提示」改为「未就绪 → **自动进入 `/bump` 完整流程** → bump 第 5 步自动衔接 `/add` → 预检干净时继续自动衔接 `/commit`（bump 提交经 PR + CI 合并、9z 对齐 main）→ 回到第 10 步（版本已就绪）→ `/release` 完成发版」；新增**防循环条款**（若本次 commit 本身是 bump 链条产物而仍未就绪，停止报告、不再触发第二次 bump）。description、前言段、核心定位段、9j（正文与第 4 点）、「严禁编辑项目文件」例外清单（七类 → 八类，新增第 ⑧ 类：bump 链条中版本号文件改动由 `/bump` 环节按其职责执行）、汇报段同步。
  ② `skills/bump/SKILL.md`：第 5 步由「指引用户 `git add` + `/commit`」改为「**自动衔接 `/add`**（候选集 = 第 4 步改动文件清单）→ 预检完全干净时继续自动衔接 commit skill → 自动发版」；保留「只 bump、不要提交」逃生口（输出旧式手动指引）；职责边界表、第 6/7 步、description、边界段同步。
  ③ `skills/add/SKILL.md`：触发来源与 git add 授权补「bump skill 改完版本号文件后的自动衔接（2026-10-02 起）」；第 0 步候选集补「bump 传入的改动文件清单」；第 7 步报告组织、与其他 skill 衔接段同步（新增 bump 衔接说明）。
  ④ `skills/release/SKILL.md`：description、授权语义来源②、预发布「试用后处置」段同步为「未就绪 → 先自动走 /bump → /add → /commit 链条补齐、就绪后进入本流程」。
  ⑤ `skills/dev-workflow/SKILL.md`：发版口径更新为全自动链（`/bump` → `/add` → `/commit` → `/release`；入口两种：用户主动 `/bump`、或 commit 流程检测到未 bump 自动触发）；核心逻辑段、第 10 步、正式发版段、授权段四处同步。
  ⑥ 全局 `CLAUDE.md`：授权例外段新增 `/bump` 描述（用户主动 / commit 自动衔接 = 预授权整条链）、`/add` 与 `/release` 描述更新为自动 bump 链条；暂存区授权形式③、git add 例外段补 bump 来源。
- **设计要点与回归风险**：全自动链使「功能合并后对 main 的 `/commit` / `/add` 链条会连带自动完成 bump 与正式发版」——这改变了 dev-workflow 原「正式发布由用户验收后触发（`/bump` + `/release` 人工门禁）」的落点，已在 dev-workflow 中如实标注（「试用要在发版链被触发前完成；如需收紧门禁需修订该段与 commit skill 第 10 步」），并向用户汇报此影响。防循环条款保证链条不无限递归；`git-commit-guard` / `pre-tool-use-guard` 判定逻辑未变（授权场景③的语义仍为「/add 预检完全干净后的自动衔接」，/add 的来源不影响该条件）。
- **镜像同步**：`claude/skills/commit|release|add|bump|dev-workflow/SKILL.md`、`claude/CLAUDE.md` 已同步；六部分 diff 核对除本机私有文件（anysearch/.env、backup/endpoints/endpoints.json、scroll-reverser/local/config.md）与 `__pycache__` 本机产物外逐字节一致。

### 变更（commit skill：流程末尾自动衔接 /release 发版）

- **为什么做**：用户 2026-10-02 立规——「全局 commit skill 最后 commit 成功之后加一个判断：如果工作区干净且暂存区也干净、且有新功能或新修复需要发版，则直接自动触发 /release skill 开启发版流程」。原状：正式发版需用户手动 `/release`（三段式 `/bump` → `/commit` → `/release` 的最后一段），bump 之后的发版动作还要用户再介入一次。
- **改了什么**：
  ① `skills/commit/SKILL.md`：新增**第 10 步「自动衔接发版检测」**（原第 10 步 `git status` 收尾顺延为第 11 步）——前置条件：本次 commit + push 成功（PR 通道须 9z 已合并对齐）、在 main 且与远端同步、**工作区与暂存区干净**（`git status --porcelain` 为空）、存在 VERSION 且 gh 就绪；判定：① 自最新 tag 有新提交（无 tag 即首次发版），② 版本就绪（VERSION 未发布 + CHANGELOG 顶部一致）——两者全满足则直接进入 `/release` 完整流程，未就绪则按 9j 口径提示先 `/bump`（bump 后的 `/commit` 自动发版）。description、核心定位段、9z 引用、注意段、汇报段、9j 指引同步更新。
  ② `skills/release/SKILL.md`：授权语义改为**触发来源两种**（用户主动输入 / commit skill 第 10 步自动衔接——预授权链路、无需二次确认；自动衔接下执行流程一步不省）；description 与预发布「试用后处置」段同步。
  ③ `skills/add/SKILL.md`：预检完全干净自动衔接 commit 的链条明确**延伸到自动发版**——满足发版条件时继续自动衔接 `/release`（授权边界第 3 条、第 7 步列举、报告组织、衔接段、description 五处同步）。
  ④ `skills/dev-workflow/SKILL.md`：验收门禁口径更新——「`/bump` 由用户主动触发即验收通过的表达；bump 后的 `/commit` 自动衔接 `/release` 完成发版」，核心逻辑段、第 10 步、验收段、授权段四处同步。
  ⑤ `skills/bump/SKILL.md`：description、三段式表格、第 7 步汇报同步「无需手动 `/release`，commit skill 第 10 步自动衔接」。
  ⑥ 全局 `CLAUDE.md` 三处：`/release` 授权例外段补「触发来源两种 + 自动衔接预授权」；`/add` 授权自动延伸段补「满足条件时继续自动衔接触发 `/release`」；暂存区授权形式③同步。
  ⑦ `pi/agent/extensions/git-status-guard.ts`：注释与 notify 文本里的「commit skill 第 10 步」（指 git status 收尾）随步骤编号改为「第 11 步」（判定逻辑不变）。
- **设计要点**：**「版本就绪」作为触发条件是刻意的**——未 bump 时触发 `/release` 会撞上 release 第 3 步「tag 已存在」的异常暂停（报 tag 冲突、要用户从「force push / 补发 / 保持现状」里选），而真正待办是 `/bump`；release 第 0 步的版本就绪校验只管「VERSION 与 CHANGELOG 是否一致」，拦不住「一致地停在已发布版本上」的情形。把 bump 提示留在 9j / 第 10 步更准确（未就绪 → 提示 `/bump` → bump 后 `/commit` 自动发版）。与 dev-workflow 验收门禁的交互：主路径变为「用户验收满意 → `/bump`（用户主动 = 验收通过的表达）→ `/commit` → 自动发版」，发版动作自动化不改变「正式发布以用户试用满意为前提」——未 bump 不会自动发版（回归风险已评估、口径已同步）。
- **镜像同步**：`claude/skills/commit|release|add|bump|dev-workflow/SKILL.md`、`claude/CLAUDE.md`、`pi/agent/extensions/git-status-guard.ts` 已同步；六部分 diff 核对除本机私有文件（anysearch/.env、backup/endpoints/endpoints.json、scroll-reverser/local/config.md）与 `__pycache__` 本机产物外逐字节一致。

### 新增（skill：wechat-mac-ops —— 微信 Mac 客户端操作；当日迁出到项目，见下方更正）

> **归属更正（2026-10-02，同日）**：本 skill 起初按「通用能力」建在全局 `~/.claude/skills/` 并镜像到本项目；同日晚些时候用户裁定「这是 Gatsby 的专属 skill，放 CommunityManagerAgent 本项目，不放全局」，已迁到 `~/Developer/CommunityManagerAgent/.claude/skills/wechat-mac-ops/`（配 `.pi/skills → ../.claude/skills` 软链，CC 与 pi 都能发现），**全局目录与本项目 `claude/skills/` 镜像已删除**——因此本项目 `claude/skills/` 清单里**没有** `wechat-mac-ops`，这不是遗漏。本条目保留作沿革记录（下文的「镜像同步」一句已失效，以本注为准）。

- **为什么做**：2026-10-02 用户要求把当天操作微信群的经验沉淀成 skill、避免下次踩坑。当天在微信客户端完成三件事——改群名（AI+X 实战经验交流群）、编辑并发布群公告（v1.2.0）、在群里发一条自我介绍消息——全程只有命令行＋剪贴板可用，踩了几个真坑（弹窗坐标换算不对、click 工具被无障碍路径吞掉、type_text 无效、误触关闭丢编辑）。
- **做了什么**：新增 skill `wechat-mac-ops`（`~/.claude/skills/wechat-mac-ops/`）：
  - `SKILL.md`（103 行）：三个任务的分步流程（改群名 / 改群公告 / 群内发言）＋ 统一机制（三条命令行 + 截图坐标约定）＋ 收尾纪律（恢复剪贴板、清理含隐私的截图、汇报影响面）＋ 坑清单
  - `references/computer-use.md`：open-computer-use 的工作机制（截图像素 → 窗口点 → 全局点的换算、点击的三条路径 AX / postToPid / 全局指针兜底、环境变量、权限与隐私）
  - `references/wechat-ui.md`：微信 Mac 4.x 界面地图（窗口清单、主窗口与群公告窗口的控件位置、三个确认弹窗的按钮语义、会惊动群里的三种操作）
  - `scripts/`：`ocu.sh`（截图 + 元素树）、`tap.sh`（拖拽式真实点击）、`clic.sh`（真点击）、`wxgeom.py`（窗口几何 / 坐标换算 / 鼠标指针回读）
- **验证**：description 长度检查通过（340/1024，skill-creator 的 `check_description.py`）；四个脚本在本机实跑通过——窗口几何与本机实测值一致（主窗口 X=18 Y=30 W=817 H=696）、坐标换算结果与当天实际操作值对得上、截图落盘正常。
- **镜像同步**：`claude/skills/wechat-mac-ops/` 已同步，`diff -r` 逐字节一致。

### 新增（版本一致性守卫：VERSION ↔ 群公告版本号，三层工具强制）

- **为什么做**：用户 2026-10-02 立规（CommunityManagerAgent 项目规则）——「`VERSION` 里面的版本号应该和 `announcement.txt` 的版本号一致。这个是硬性规定，工具强制」。背景：该项目此前是「两套体系」（群公告版本独立于项目 `VERSION`、不比对，2026-08-27 裁定），实际长期背离（`VERSION` 停在 0.1.0、公告已到 v1.2.0），而公告通道又是该项目唯一的对外发布通道，版本号分开维护无收益、易漂移。
- **做了什么（三层同源，规则变更时三处同步改）**：
  ① 新增 pi 扩展 `version-guard.ts`（`~/.pi/agent/extensions/`）：拦截 `git commit` / `git tag`（含 `git -C <path>` 与开头 `cd <dir> &&` 形态），检出仓库根 `VERSION` 与 `docs/community/announcement.txt` 的「版本：」行不一致即 deny；版本号按 major.minor.patch 比对（`v` 前缀差异视为一致）；fail-closed（两侧文件都在而任一侧解析不出同样拦）；逃生标记 `VERSION_MISMATCH_OK`（用户授权后使用）。仅当仓库同时存在两个文件时生效，其它项目零影响。
  ② `~/.claude/hooks/pre-tool-use-guard.sh` 新增规则 5（CC / CodeBuddy 等端，判定与逃生标记同 ①）。
  ③ 全局 git pre-commit hook（`~/.config/git/hooks/pre-commit`）增加同一检查——该 hook 在本机 `~/.config/git/hooks/`、**不属开源镜像范围**（与 gitleaks hook 同），clone 者需自行按同规则配置；逃生门 `git config hooks.version-consistency false`。
- **全局规则同步**：全局 `CLAUDE.md`「版本信息一致性」节新增一段——项目若还有自带版本号的对外发布物（如群公告 `announcement.txt`），其版本号必须与 `VERSION` **完全一致**（bump 一个必须同步 bump 另一个），并注明三层工具强制与生效范围。
- **实测验证**：git hook（拦截 / 放行 / 逃生门配置）、CC 规则 5（不一致 deny、逃生标记放行、一致放行、无关仓库放行、缺「版本：」行 fail-closed）、pi 扩展 9 用例（`git commit` / `git tag` / 逃生标记 / 一致 / 非 commit 命令 / 非 git 仓库 / `git -C` 形态 / `cd &&` 形态 / cd 后非 commit）全部通过。
- **镜像同步**：`pi/agent/extensions/version-guard.ts`、`claude/hooks/pre-tool-use-guard.sh`、`claude/CLAUDE.md`、`claude/docs/capability-sync.md`（pi 扩展清单 4 → 5）已同步；六部分 diff 核对（排除本机产物）逐字节一致。

## 2026-10-01

### 新增（跨会话协作：agent-call 扩展 + 全局协作规则）

- **为什么做**：用户需要「agent 之间自己传话、不让用户当传话筒」，且对方会话未开启时不能让任务阻塞。经调研选定 pi 生态方案：pi-intercom（会话互通能力）+ 自研 agent-call 扩展（自动唤醒 + 调用）。2026-10-01 用户确认：形态用 pi 扩展、命名 `agent-call.ts`、协作触发规则放全局规则文件。
- **做了什么**：
  ① 新增 pi 扩展 `agent-call.ts`（`~/.pi/agent/extensions/`）：提供 `agent_wake`（确保目标会话在线——不在线则在目标项目目录用 tmux 启动 `pi -n <名字>` 并等待注册）与 `agent_call`（唤醒 + 发送；`mode=send` 走 pi-intercom 扩展 Outbox 事件通道、消息以本会话身份发出；`mode=ask` 走 pi-intercom CLI 阻塞等待回复并自动附加发送者签名）两个工具。依赖 pi-intercom 与 tmux；`PI_INTERCOM_CLI` / `PI_AGENT_BIN` 环境变量可覆盖路径，代码不含任何私有信息。
  ② 全局 `CLAUDE.md` 新增「会话间协作（agent-call）」小节：自动唤醒（调用时尽快带上目标项目目录）、两种模式（send/ask）、消息自带背景、联系不上不硬等、会话命名约定（`pi -n <agent名字>`）。
  ③ 实测验证（本机三个测试 pi 会话）：会话发现、send 身份（接收方消息头显示「From caller」）、自动唤醒（关闭目标会话后 `agent_call` 自动拉起新会话、注册、投递并拿到回复）全部通过。
- **镜像同步**：`pi/agent/extensions/agent-call.ts` 与 `claude/CLAUDE.md` 已同步；六部分 diff 核对（除本机私有文件与本机产物）逐字节一致。

### 变更（add / commit 自动衔接机制：/add 预检完全干净后直接进入 commit skill，减少用户二次介入）

- **为什么改**：用户 2026-10-01 立规——「如果没有需要人工审核的文件和不建议入库的文件则可以直接调用全局的 commit skill，这样可以减少我的介入，增加自动化程度」。原状（2026-09-22 起）：/add 完成预检分流后必须由用户再输入 /commit 才能提交；预检完全干净（无人工过目、无不建议入库）时那次 /commit 没有新增任何把关价值，白白多一次介入。
- **改了什么**：
  ① `skills/add/SKILL.md`：description 补自动衔接说明（含触发条件与 2026-10-01 出处）；「授权边界」第 3 条由「不 commit、不 push」改为「预检完全干净时自动衔接 commit skill（全局 CLAUDE.md 授权形式③）」；新增**第 7 步「自动衔接 commit skill」**——判定条件三条全部满足才衔接（至少 1 个文件加入暂存区 + 需人工过目 0 个 + 不建议入库 0 个；「白名单跳过」不构成阻断，用户此前已确认可公开）、满足则直接进入 commit skill 完整流程一步不省（含其全部检测与终止 / 暂停规则，`git commit` 照常带 `# AI_AUTHORIZED_COMMIT` 标记）、逃生口（用户当轮明确说「只 add、不要提交」时不衔接）、报告组织（add 三段式报告 + commit 完整汇报连成一链，含 `>> git status` 收尾）；第 6 步报告指引句按「自动衔接 / 未衔接」两场景拆分；「与其他 skill 的衔接」段与定位段同步。
  ② `skills/commit/SKILL.md`：description 与「核心定位」触发判定改为**来源两种**（① 用户当前消息 /commit；② add skill 预检完全干净后的自动衔接，2026-10-01 用户立）；「两步用 && 串联」段的授权来源、`# AI_AUTHORIZED_COMMIT` 标记场景说明、汇报段「重新触发」措辞同步。
  ③ 全局 `CLAUDE.md` 三处同步（见镜像同步）：「Git 写操作必须先征得同意」例外段增 `/add` 自动衔接；「Git 暂存区禁止 AI 自主增删改」第 1 条明确授权由两种形式扩为**三种形式**（③ = /add 预检完全干净后的自动衔接）；「commit skill 的触发与终止」改为**触发来源两种**。
  ④ `hooks/pre-tool-use-guard.sh` 与 `pi/agent/extensions/git-commit-guard.ts`：授权标记 AI_AUTHORIZED_COMMIT 的使用场景说明由两种扩为三种（判定逻辑不变，仍以标记存在与否为准）；`pi/agent/extensions/git-status-guard.ts` 注释同步（强制锚点来源扩为三种）。
- **设计要点**：「/add 授权自动延伸」的边界——只在下述条件全满足时生效：本次预检**至少 1 个文件入暂存区**（无预检成果可提交的零入库场景不衔接）+ 需人工过目 0 个 + 不建议入库 0 个；有任一不满足则停在 add 报告阶段不衔接（保留原有人工把关）；命中的安全规则（commit skill 敏感扫描 / cache 检测、git-commit-guard 标记）全部原样保留，自动衔接不是跳过防线、只是省掉重复的触发动作。
- **镜像同步**：`claude/skills/add/SKILL.md`、`claude/skills/commit/SKILL.md`、`claude/CLAUDE.md`、`claude/hooks/pre-tool-use-guard.sh`、`pi/agent/extensions/git-commit-guard.ts`、`pi/agent/extensions/git-status-guard.ts` 已同步，六部分 diff 核对除本机私有文件（anysearch/.env、backup/endpoints/endpoints.json、scroll-reverser/local/config.md）与 `__pycache__` 外逐字节一致；`~/.pi/agent/skills` 与 `~/.claude/skills` 为同 inode 硬链接，自动跟随。

## 2026-09-30

### 变更（dev-workflow 修订：测试产物不单独提交、不单独开 PR——修正「测试先交付即提交」的流程缺陷）

- **为什么改**：用户 2026-09-30 裁定——测试先行的产物不能先提交、更不能先开 PR。此前 skill 第 3 步让测试 Agent「报告应 `git add` 的路径、commit 由用户亲自执行」，而 `/commit` 在非 main 分支上必然 push 分支 + 建 PR + enable auto-merge，「测试先交付即提交」实际等于「测试单独开一个 PR」；PR 描述又按惯例带 `fixes #N`，合并那一刻 GitHub 的自动关闭关键词会把 Issue 提前关成 completed。2026-09-29 实测事故：ghostty-launcher 的测试 PR #2（只含测试、CI 红）合并，1 秒后 Issue #1 被自动关成 completed，而实现还只在分支上；main 也因此出现「测试已进、实现未进」的半程状态、CI 全量必红，破了 main 永远绿的底线。正确动线：测试写在功能分支工作区放着**不提交**，开发完成、本地全量测试转绿后由用户一次性 `git add`（测试 + 实现 + CHANGELOG）+ `/commit`——测试与实现在**同一次提交、同一个 PR** 里进 main。
- **改了什么**：
  ① `skills/dev-workflow/SKILL.md`：第 3 步新增专门段落「测试产物不单独提交、不单独开 PR（2026-09-30 用户定，硬规矩）」——写清为什么（含事故实证）、正确移交方式（报告测试文件清单 / 测试命令 / 自跑见红证据即结束交付，测试以未提交的工作区改动留在分支上）、唯一例外（合并 `origin/main` 时未提交的测试文件撞上游改动被 git 拒，可先本地提交一次但不 push / 不开 PR）；第 3 步任务下发与交付口径、第 5 步「测试有没有变」（按工作区文件比对而非 commit）、第 7 步标题与 PR 条目（PR 只在开发完成 + 本地全量绿后创建一次，内容 = 测试 + 实现，禁止为测试单独开 PR）、流程总览第 8 项、沿革、授权边界段同步。
  ② `skills/dev-workflow/references/test-cases.md`：「先红后绿的时序」三条重写（测试不提交、与实现同一次提交同一 PR、测试先行不是「先提交先开 PR」的先行）；Hopper 主通道条目同步。
  ③ `skills/commit/SKILL.md` 第 1 步新增「测试文件独占暂存区的暂停询问」配套工具强制——暂存区全部是测试文件、无任何功能代码 / 配置改动时先停下，说明风险（`fixes #N` 提前关 Issue + main 半程状态）并建议等实现一起提交，用户明确确认是有意的纯测试提交后才继续（**暂停型决策点**，同第 0a 步语义，不是敏感扫描 / cache 那种「命中即终止」）。
- **镜像同步**：`claude/skills/dev-workflow/`（`SKILL.md` + `references/test-cases.md`）与 `claude/skills/commit/SKILL.md` 已同步，`diff -rq` 除本机私有文件（anysearch/.env、backup/endpoints/endpoints.json、scroll-reverser/local/config.md）与 `__pycache__` 外逐字节一致。
- **配套改动（不在本仓库镜像范围）**：测试 Agent 项目 TestEngineerAgent 的 `CLAUDE.md` 出题动线第 4 步、工作原则、约束段与双语 README 第 2 步同步修订（测试产物留在工作区、不提请用户提交），记该项目自己 CHANGELOG。

## 2026-09-29

### 变更（commit / add 缓存检测补例外：`.commit-cache.md` 不算 cache、不拦）

- **为什么改**：`.commit-cache.md` 名字含 cache，会被 commit skill 第 3 步 / add skill 第 1 步的「名字含 cache」检测字面命中——实际它是 commit skill 自己的状态文件（标配标记 + 敏感扫描白名单），本就应入库、且在扩展出白名单段后更需要正常随提交入库；不修则下一次 `/commit` 会把暂存中的它误判为运行时缓存、自动写进 `.gitignore` 并终止流程。
- **改了什么**：① `skills/commit/SKILL.md` 第 3 步、② `skills/add/SKILL.md` 第 1 步各补一句例外——「项目根 `.commit-cache.md` 是 commit skill 的状态文件（本就应入库、非运行时缓存），不算 cache、不拦」。
- **触发场景**：2026-09-29 该文件（含白名单段）进 `/add` 预检时实际遇到该判定分叉，按语义判为放行、规则仍存字面歧义，据此把例外写进规则消除歧义。
- **镜像同步**：`claude/skills/commit/SKILL.md`、`claude/skills/add/SKILL.md` 已同步，diff 逐字节一致。

### 变更（commit / add 新增「敏感扫描白名单」机制：用户确认可公开的命中项不再重复拦截）

- **为什么改**：2026-09-29 实战——`/commit` 敏感扫描命中了两个身份标识类内容块，用户确认「可公开、加入 commit 白名单，下次不再检测」；但按原机制命中即终止、重跑还会再拦，已被用户确认的内容反复打断流程。据此把「一次性人工确认」固化为可复用的白名单机制。
- **改了什么**：
  ① `skills/commit/SKILL.md`：第 2 步敏感扫描新增「先读白名单」——读项目根 `.commit-cache.md` 的「敏感扫描白名单」段，命中条目描述范围的内容跳过、不再拦截（汇报里列一行「白名单跳过」，不静默省略）；白名单只覆盖条目描述范围、范围外或拿不准照常拦截；凭证类实值命中不适用白名单。结果处理「发现敏感内容」分支补：用户明确确认「可公开」后可把对应条目追加进白名单（例外②）——本次仍终止、不续跑，白名单对下一次起效。例外②措辞扩为「写入缓存标记或敏感扫描白名单条目」（正文两处同步）。汇报要求补一行「白名单跳过」。
  ② `skills/add/SKILL.md`：第 3 步 AI 语义扫描新增同一白名单读取（命中条目范围的内容块不进人工过目清单、报告列一行；gitleaks 命中不豁免）——否则 `/add` 会对同一批已确认内容重复拦截；第 6 步报告模板加「白名单跳过」可选行。
  ③ `.commit-cache.md` 格式段（commit skill 内）：新增白名单段的格式说明、写入门槛与五条边界（用户明确确认才追加 / 只覆盖描述范围 / 拿不准按不在 / 凭证不豁免 / 可删条目撤销），完整模板补「敏感扫描白名单」段。
- **镜像同步**：`claude/skills/commit/SKILL.md`、`claude/skills/add/SKILL.md` 已同步，diff 逐字节一致（`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接，自动跟随）。
- **首次应用**：GrowthMarketerAgent `.commit-cache.md` 当日登记两条白名单条目（X 账号标识类 / 个人账号身份细节类，用户确认可公开）；项目侧登记结果记该项目 CHANGELOG。

### 变更（dev-workflow：测试任务的跨 agent 下发改为写入 Hopper 项目 TODO.md 并报编号）

- **为什么改**：2026-09-29 用户裁定——开发流程需要测试 Agent（Hopper）出题时，不再由用户人工转达（原第 3 步写「开发 Agent 向用户报告：请在测试 Agent 会话出测试——给它 worktree 路径 + Issue 链接」），改为**开发 Agent 直接把出题任务写入 Hopper 项目（TestEngineerAgent）根 `TODO.md` 并报告编号**（如「已写为 Hopper 的 T6」），用户在 Hopper 会话按 TODO 接活。首个真实用例：ghostty-launcher Issue #1（面板 New Window 偶发无反应、需测试先行，2026-09-29）。
- **改了什么**：
  ① `skills/dev-workflow/SKILL.md`：第 3 步第 1 条重写为「任务下发」——写入 Hopper 项目根 `TODO.md`（按该文件既有格式与全局 TODO 规范：编号顺延 = 扫该项目 `TODO.md` + `TODO-archive.md` 取最大编号 + 1、按紧急度入节、写 `（记录：YYYY-MM-DD HH:MM）` 时间戳；正文写清背景 + Issue 链接 + worktree 路径与分支名 + 要做什么 + 关联；同时在 Hopper 项目 CHANGELOG 记一条），写完向用户报告编号；「沿革」段补记 2026-09-29 修订。
  ② `skills/dev-workflow/references/test-cases.md`：「测试的三个来源」第 1 条（测试 Agent 主通道）同步改为 TODO 下发写法。
- **镜像同步**：`claude/skills/dev-workflow/SKILL.md`、`claude/skills/dev-workflow/references/test-cases.md` 已同步，`diff -r` 逐字节一致（`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接，自动跟随）；description 长度自检 PASS（549/1024，未改 frontmatter）。
- **关联记录**：TestEngineerAgent（Hopper）`TODO.md` 新增 T6 + 该项目 `CHANGELOG.md` 同日条目。

## 2026-09-25

### 变更（anysearch / agent-reach 两 skill 分工切割：消除搜索路由重叠区）

- **为什么改**：用户询问两个 skill 是否存在重复。逐项核查后确认：两者不是互为子集，但重叠四块——通用网页搜索（anysearch `search` ↔ agent-reach 的 Exa）、网页正文提取（anysearch `extract` ↔ Jina Reader）、X / Reddit / LinkedIn 公开检索（anysearch `social_media` 域 ↔ 平台 CLI）、股票行情（anysearch `finance.quote` ↔ 雪球）。更实际的问题是两者 description 都自称搜索首选（agent-reach 写「MUST USE … anything on the internet」，anysearch 只有一句英文、无中文触发词），中文请求「搜一下 X」几乎必被 agent-reach 抢走触发，anysearch 可能白装。用户决策：两个都保留（各自都有独占能力：agent-reach 独占小红书 / B站 / V2EX / YouTube 字幕 / RSS / gh CLI，anysearch 独占垂直域检索 / 批量并行搜索 / 微博知乎微信），按「anysearch 作检索层、agent-reach 作平台层」做分工切割，重叠区统一为首选 / 兜底两条路径。
- **改了什么**：
  ① `skills/anysearch/SKILL.md` 的 description 重写（121 → 854 字符，check_description.py 实测 PASS）：补中文触发词（查一下 / 搜一下 / 调研 / 最新消息 / 查行情 / 查财报 / 查论文 / 查专利）、写明垂直域结构化标识符检索规则、划定边界（平台内 / 账号级数据归 agent-reach）。
  ② 同文件「Social Media Source Workflow」段新增 Freshness note（用户提出「x_latest 混旧帖、能否按最新排序」的调查结论）：实测证实 `x_latest` / `x_top` 是热度 × 时间混合排序、非严格时间序（同一关键词拉 10 条可跨 3 周），且无服务端排序参数（官方文档未列出排序参数，实测传入 `sort=` 未观察到排序变化）；需要最新内容时拉满 `--max_results 10` 后按返回的 `Posted:` 时间自行重排 / 过滤，冷门关键词池内新帖少时回退通用搜索。
  ③ `skills/agent-reach/SKILL.md` 的 description 收窄（901 → 906 字符，实测 PASS）：触发面从「anything on the internet」收窄为「用户提到平台 / 分享平台链接」，去掉「shares any URL」这类通用网页触发（归 anysearch），新增【分工】段；正文常驻规则第 4 条「Exa 搜索」改「anysearch 搜索」、新增第 6 条「通用检索走 anysearch」，把 Exa / Jina Reader 降级为兜底。
  ④ 同 skill 的 `references/search.md` / `references/web.md` 顶部各加一行兜底标注（Exa、Jina Reader / web-reader 是 anysearch 不可用时的兜底路径；RSS 仍走本文档）。
- **实测依据**：anysearch 四类调用全部跑通（普通搜索 1.1s、社交域 X 搜索、金融域结构化行情、网页提取）；agent-reach `doctor --json` 体检——ok = YouTube / B站 / V2EX / RSS / web，warn = GitHub / Twitter / LinkedIn / 雪球 / Exa，off = Reddit / Facebook / Instagram / 小红书 / 小宇宙（后端未装）。
- **镜像同步**：`claude/skills/anysearch/SKILL.md`、`claude/skills/agent-reach/`（SKILL.md + references/search.md + references/web.md）已同步，diff 逐字节一致（anysearch 的 `.env` 属敏感例外）；`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接自动跟随。
- **防回归提示（重要）**：两个 skill 均由上游维护（AnySearch 官方、Agent Reach 上游），核查确认**两者都不会自动升级**（无自更新逻辑、无定时任务；agent-reach 的 `check-update` 只查询远端版本、SKILL.md 规则 5 只要求 AI 顺带提醒用户，升级仍须用户一句话触发）；但以下动作会覆盖本地定制——`agent-reach install`、`agent-reach skill --install`、`agent-reach uninstall`（均 force 覆盖式写入）与 anysearch 手动下载覆盖目录；单纯升级 Python 包不碰 skill 文件。附注：update.md 称「doctor 会保留已有 skill」与本机 1.5.0 及上游 main 代码不符——doctor 实际只做体检、不安装 skill，且 `_install_skill` 的「已存在则保留」分支（force=False）无任何调用点、是死代码。升级后按 `MEMO.md` M1 的自检命令确认定制在否，丢了按本条记录重做。

### 新增（skill 定制自动恢复机制：launchd 监听 + 结构化重打，被覆盖后自动补回、无需记忆）

- **为什么改**：用户指出「升级后检查定制」靠记忆不可靠——会发生无感覆盖、事后遗忘，要求做成「升级后自动补上」的机制（参照 PatchClaudeAgent/Tinker 的自愈思路）。前一条已查明两个 skill 不会自动升级，但 `agent-reach install` / `agent-reach skill --install` / `agent-reach uninstall` 与 anysearch 手动覆盖会丢定制。
- **改了什么**：① 新建本机目录 `~/.claude/local/skill-custom/`（本机私有，不入 git、不入镜像）：`restore.py`（结构化重打引擎）、`snippets/`（7 个定制片段，权威内容源）、`README.md`、`restore.log`、`conflicts/`；② 新建 launchd 服务 `~/Library/LaunchAgents/com.xhq.skill-custom.plist`——WatchPaths 监听 4 个受管文件及其目录（变动即跑，实测延迟约 10 秒）+ 登录时一次 + 每小时兜底；③ 引擎对每个定制点按结构定位（frontmatter 键 / 定制段首行 / 插入锚点）做幂等 upsert：缺失则重插、片段更新则同步目标、锚点丢失则留现场 + 桌面通知不硬写。设计过程：先试 3-way merge（git merge-file），实测发现 version 行随上游发版必变、与紧邻的 description 定制必然冲突，遂改结构化重打（不受 version 变化干扰）。
- **验证**：端到端实测——4 个受管文件全部回退到上游原版，launchd WatchPaths 自动触发重打回定制版，与镜像逐字节一致；片段更新同步（改 snippet → 目标同步 → 改回 → 复原）通过；幂等（重复运行零动作）；`--check` 全 ok；服务已加载。
- **边界**：上游大改结构致锚点消失时不硬写、桌面通知、现场存 `conflicts/`（人工处理）；机制只在本机，不进镜像。

### 新增（hooks 纳入开源镜像：`claude/hooks/` 建立，镜像范围升为四部分）

- **为什么改**：用户要求把全局 `~/.claude/hooks/` 的强制守卫脚本也同步到本项目 `claude/hooks/`。此前镜像范围只有三部分（skills / CLAUDE.md / docs），而全局 `hooks/` 已被「规矩必须配套工具强制」元规则作为硬约束的落地点（杀 VSC 进程前必问、远程连接禁用当前窗口、commit 授权标记、X/Twitter 账号隔离、测试文件写保护五条拦截全在其中），却只存在于本机全局、不随开源仓出去——clone 本项目的人看不到这些强制工具的实现。
- **改了什么**：① 新建 `claude/hooks/`，镜像全局两个脚本 `pre-tool-use-guard.sh`（PreToolUse 规则 1~4）与 `test-cases-guard.py`（dev-workflow 测试文件写保护），内容逐字节一致、执行位保留；**不含**本机产物 `__pycache__/`（字节码缓存）与 `pre-tool-use-guard.sh.bak-20260923`（编辑备份），并把这两类明确写进范围陈述的排除项。② 镜像范围由「三部分」升为「四部分（skills / CLAUDE.md / docs / hooks）」：全局权威侧改四处——`~/.claude/docs/capability-sync.md`（指针节 + 范围节 + 验证节，并写明 hooks 由 `settings.json` 的 `hooks.PreToolUse` 注册）、`~/.claude/docs/agents-registry.md`（Prometheus 行）、`~/.claude/docs/new-agent-scaffold.md`（单一出口段）、`~/.claude/CLAUDE.md`（团队结构参考指针行）；镜像侧 `claude/CLAUDE.md` 与 `claude/docs/` 三文件 `cp` 覆盖、逐字节一致。③ 项目级同步：根 `CLAUDE.md`（四部分表述 + hooks 纳入日期）、`.claude/README.md`（写明通用守卫 hook 的镜像在 `claude/hooks/`、项目级 `.claude/` 不放它，并修正指向已不存在的「底层通用能力开源」节的悬空引用）、capability-manager skill（SKILL.md 6 处：description + 范围/镜像/步骤/引用共 5 处正文；`references/content-lifecycle.md` 4 处，判断矩阵新增 hooks 行；`references/sync-flow.md` 12 处：范围表述、双向同步命令、diff 命令、合法差异表、巡检脚本，hooks 比对统一用 `diff -r -x '__pycache__' -x '*.bak*'` 排本机产物）。
- **验证**：四部分 diff 全过——`CLAUDE.md` 逐字节一致、`docs` 逐字节一致、`hooks`（排本机产物后）逐字节一致、`skills` 仅剩既有本机敏感例外（anysearch `.env`、backup endpoints、scroll-reverser local、skill-creator `__pycache__`）；capability-manager 的 `check_description.py` 实测 PASS（531/1024）；全仓库搜索无残留的「三部分」范围陈述（全局侧 0 处）。
- **边界**：hooks 纳入镜像只解决「开源分发」，不改变本机加载方式——CC 端仍由全局 `~/.claude/settings.json` 的 `hooks.PreToolUse` 按绝对路径注册生效；pi 端对应实现是 `~/.pi/agent/extensions/*.ts`，不在镜像范围。

### 新增（`local/skill-custom` 技能定制自动恢复器纳入开源镜像）

- **为什么改**：用户要求把全局 `~/.claude/local/` 的内容同步到本项目 `claude/local/`。全局该目录目前只有一份内容——今天下午新建的 `skill-custom/`（skill 定制自动恢复机制：结构定位重打引擎 + 定制片段 + launchd 触发器），此前被明确记为「本机私有、不进镜像」，本次用户决定改为公开。
- **改了什么**：① 新建 `claude/local/skill-custom/`，镜像三类内容——`restore.py`（236 行重打引擎）、`snippets/`（7 个定制片段：anysearch / agent-reach 的 description、Freshness note、常驻规则第 4 / 6 条、两处兜底标注）、`README.md`；`diff -r` 逐字节一致。② **不镜像运行产物**：`.lock`（并发锁）、`restore.log` / `launchd.out.log` / `launchd.err.log`（动作日志）、`conflicts/`（锚点丢失现场快照）——随时变动、含本机运行轨迹，属本机产物。③ 全局 `~/.claude/local/skill-custom/README.md` 两处修正：标题的「本机私有」改为「本机机制；代码与片段已开源镜像」，边界段的「本机制只在本机存在，不进 git、不进开源镜像」改为写明镜像去向与本机产物排除项——否则镜像里会出现一句自我否定的说明。
- **与前序记录的关系（重要）**：本条推翻今天早些时候「新增（skill 定制自动恢复机制…）」条目里的边界结论「机制只在本机，不进镜像」。该结论已被用户本次指令取代，旧条目按历史保留、不再有效；本机制代码与片段的权威源仍是全局 `~/.claude/local/skill-custom/`（改定制先改全局、再镜像）。
- **待定（等用户拍板，未做）**：① 镜像范围表述——现文档口径仍为「四部分（skills / CLAUDE.md / docs / hooks）」，是否把 `local/` 列为第五部分、以及「整个 `local/`」还是「只点名 `skill-custom/`」纳入镜像，取决于用户对 `local/` 隐私边界的决定（`local/` 是全局的本机私有区，若整体纳入镜像，以后放进去的任何文件都会直接进公开仓库）。② `README.md` / `restore.py` 里的 launchd 标签 `com.xhq.skill-custom` 与 `~/Library/LaunchAgents/…plist` 路径含本机个人标识，是否泛化为占位符（保持原样则为逐字节一致）。
- **验证**：`diff -r -x '*log' -x '.lock' -x 'conflicts'` 全目录逐字节一致；敏感扫描（token / key / cookie / 账户 / `/Users/xhq` 绝对路径）全目录无命中——脚本统一用 `~` 展开、无硬编码个人路径。

### 变更（`local/` 改名 `patch/`：目录语义从「本机私有」纠正为「自研可公开补丁层」）

- **为什么改**：用户指出 `local` 这个目录名与其真实目的不符——该目录不是「本机私有区」，而是「自研机制的开源实现区」（放进去就是要公开的）。改名消除语义误导，避免以后有人（包括 AI 自己）按「local = 本机私有」的惯例把隐私内容放进去。
- **改了什么**：① 全局目录 `~/.claude/local/` → `~/.claude/patch/`；② 项目镜像 `claude/local/` → `claude/patch/`（逐字节一致）；③ 引用点全量更新：launchd 配置 `~/Library/LaunchAgents/com.xhq.skill-custom.plist`（ProgramArguments 脚本路径 + StandardOutPath / StandardErrorPath 共 3 处）并重载服务、`~/.claude/patch/skill-custom/README.md` 2 处（tail 路径、镜像去向）、项目根 `MEMO.md` M1（2 处路径 + 更新时间戳）；④ 镜像范围表述由「四部分」升为「五部分（skills / CLAUDE.md / docs / hooks / patch）」，同步更新全局权威侧 4 文件（capability-sync.md 四段、agents-registry.md、new-agent-scaffold.md、CLAUDE.md）与项目侧 5 文件（根 CLAUDE.md、.claude/README.md、capability-manager SKILL.md 6 处、content-lifecycle.md 4 处、sync-flow.md 13 处），hooks / patch 的 diff 命令统一带排除本机产物的 `-x` 参数；⑤ CHANGELOG 历史条目里的 `local/` 路径按「历史不改写」保留（本条即对其的更新说明）。
- **验证**：① 机制侧——`restore.py --check` 从新路径运行四项全 ok；launchd 服务重载后 `launchctl print` 确认 program / arguments / stdout 均指向新路径，`kickstart` 实测 runs +1、退出码 0；② 五部分 diff 全过（CLAUDE.md / docs / hooks / patch 逐字节一致，skills 仅既有本机敏感例外）；③ 全仓「四部分」残留扫描为空、「claude/local」引用扫描为空（CHANGELOG 历史除外）；④ capability-manager description 实测 PASS（539/1024）。
- **边界**：改名只动目录与路径引用，不改机制行为；`patch/` 下的运行产物（`*.log`、`.lock`、`conflicts/`）仍不进镜像。另：上一轮遗留的「launchd 标签 `com.xhq.skill-custom` 是否泛化」仍未决，本轮保持原样（逐字节一致优先）。

### 新增（项目根 `TODO.md` 建立：记 capability-manager 参考文档的过时项 T1）

- **为什么改**：本项目此前没有 `TODO.md`（只有 `MEMO.md`），而本轮核对镜像时发现 `.claude/skills/capability-manager/references/sync-flow.md` 有两处与现状不符，属「待办」而非本轮能定的事（涉及口径选择）。按全局 CLAUDE.md「待办一律写入项目根 TODO.md、禁止写到其它地方」的规矩，建该文件并把发现问题记为 T1。
- **改了什么**：新建项目根 `TODO.md`（活跃待办清单；头部写明条目格式、编号规则、四级紧急度与归档去向）；T1 记入 🟠 橙色节——① 文档举例仍用已下线的 `find-skill`（全局 `~/.claude/skills/` 已无该 skill，现存合法差异为 anysearch `.env`、backup `endpoints.json`、scroll-reverser `local/config.md`、skill-creator `scripts/__pycache__` 四项）；② sync-flow.md 的「全局 → 各 agent 项目副本（分发）」章节及对应巡检，与权威文档 `~/.claude/docs/capability-sync.md`「分发层已终结」矛盾（2026-09-25 实测各 agent 项目 `.claude/skills/` 只剩专属 skill，无通用 skill 副本）。
- **验证**：`TODO.md` 已建、内容已回读确认；各 agent 项目 `.claude/skills/` 实测清单已记入 T1 作依据。

### 新增（pi 端扩展纳入开源镜像：`pi/agent/extensions/` 建立，镜像范围升为六部分）

- **为什么改**：用户要求把全局 `~/.pi/agent/extensions/` 的内容同步到本项目 `pi/agent/extensions/`。pi 端的四个工具强制扩展（git-commit-guard / git-status-guard / test-cases-guard / twitter-guard，与 `hooks/` 是同一套工具强制的 pi 侧实现）此前只存在本机、不随开源仓出去。
- **改了什么**：① 新建 `pi/agent/extensions/`，镜像四个 `.ts`（git-commit-guard 1.8K、git-status-guard 6.4K、test-cases-guard 4.9K、twitter-guard 3.0K），`diff -r` 逐字节一致；敏感扫描无命中（无绝对路径、无凭证值、无个人标识；`TWITTER_AUTH_TOKEN` 等只是环境变量名，`token` 字样指命令行词元）。② 镜像范围由「五部分」升为「六部分（skills / CLAUDE.md / docs / hooks / patch / pi 扩展）」，权威源变为两个：`~/.claude/`（前五部分）+ `~/.pi/agent/extensions/`（pi 扩展）；同步更新全局权威侧 4 文件（capability-sync.md 4 处、agents-registry.md、new-agent-scaffold.md、CLAUDE.md 指针行）→ 镜像侧 `claude/CLAUDE.md` 与 `claude/docs/` 逐字节一致；项目侧 5 文件（根 CLAUDE.md、`.claude/README.md`、capability-manager SKILL.md 6 处、content-lifecycle.md 4 处含判断矩阵新增 pi 扩展行、sync-flow.md 13 处含权威源表、双向同步命令、diff、巡检）。
- **与前序记录的关系（重要）**：本条推翻此前多处「pi 端扩展不在 Prometheus 镜像范围」的结论（2026-09-23 twitter-guard 条目、2026-09-22 git-status-guard 条目，以及本日 hooks 条目边界段的「pi 端对应实现是 `~/.pi/agent/extensions/*.ts`，不在镜像范围」）。旧条目按历史保留、不再有效。
- **路径说明**：镜像目录为 `pi/agent/extensions/`（不带点，与 `claude/` 镜像目录同惯例）；pi 实际加载的是用户级 `~/.pi/agent/extensions/`，项目内 `.pi/` 目录（`skills` 软链接）是另一回事，两者不混。
- **验证**：`diff -r ~/.pi/agent/extensions pi/agent/extensions` 逐字节一致；六部分巡检全过（skills 仅既有本机敏感例外）；全仓「五部分」扫描仅剩「前五部分」等正确表述（无过时范围口径）；capability-manager description 实测 PASS（573/1024）；sync-flow.md 代码围栏 16 个配对。
- **边界**：pi 扩展无本机产物（4 个 `.ts` 全部参与比对）；pi 端生效仍是用户级加载（新会话生效），镜像只解决开源分发，不改加载方式。

### 变更（add skill 修正 gitleaks 调用方式：多路径会导致扫描范围失控）

- **为什么改**：2026-09-25 实测发现 `gitleaks dir` 的用法是 `gitleaks dir [flags] [path]`、**只接受单个路径**；把多个候选路径拼在一条命令里时扫描范围会失控（实测扫了约 70MB，把指定路径之外的目录也带了进来），既慢、又会让无关命中混进结果。原 add skill 第 2 步命令写作 `gitleaks dir <候选文件所在目录或文件清单>`，「文件清单」的措辞会诱导多路径用法——同日 GrowthMarketerAgent 的 /add 流程中已实际踩到。
- **改了什么**（2026-09-25）：`skills/add/SKILL.md` 第 2 步——命令示例改为单路径形式（`gitleaks dir <候选文件或目录>`）；说明行重写为「一次只传一个路径（gitleaks dir 只接受单个 [path]；多路径拼在一条命令里会让扫描范围失控——实测会扫描远超指定路径的内容，既慢、又可能混入无关命中）；候选多时逐个跑」。
- **验证**：同一批候选文件改为逐个单路径复扫，全部零命中；多参数对照实测确认范围失控（70MB 扫描量、tmp/ 探针文件的命中混入结果）。
- **镜像同步**：`claude/skills/add/SKILL.md` 已同步、diff 逐字节一致（`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接自动跟随）。

## 2026-09-23

### 新增（全局规则「X / Twitter 查询必须带账号隔离」+ 两端钩子硬拦截）

- **为什么改**：用户在 GrowthMarketerAgent 会话里发现——`twitter-cli` 的取值顺序是「环境变量 → 浏览器 cookie」，且**浏览器侧会遍历所有 Chrome profile**（`Default` → `glob("Profile *")`，取第一个有 x.com cookie 的）。本机查询专用号在 Default、运营号在 Profile 1，因此存在一条静默风险路径：查询号的 cookie 一旦失效，工具会**自动落到运营号**，让正在运营发帖的号承担自动化访问风险；且 `get_cookies()` 在环境变量验证失败时也会回退扫浏览器，同样可能落到运营号。用户此前的「另一个 Chrome 账号/profile 登运营号」挡不住该扫描。用户要求：这条规矩很常用，只写项目 CLAUDE.md 不够，**要用全局 hook 工具强制**（配套全局「规矩必须配套工具强制」元规则）。
- **改了什么**：① 全局 `~/.claude/CLAUDE.md` 工作规则节新增「X / Twitter 查询必须带账号隔离（钩子已硬拦截）」——要求跑任何 `twitter` / `opencli twitter` 命令前先 `. ~/.x-isolation.env && twitter status` 确认账号；确需不带隔离时加标记 `# AI_AUTHORIZED_X_UNSAFE`。② CC 端 `~/.claude/hooks/pre-tool-use-guard.sh` 新增**规则 4**：拦截未带隔离的 twitter CLI 调用（子命令白名单 + 命令位兜底两段判定，避免 `grep twitter file.txt`、`which twitter`、`~/.twitter-cli/` 路径等误报）与 `opencli twitter`（浏览器会话通道、无隔离机制）；放行条件为命令含 `x-isolation.env` / `TWITTER_CHROME_PROFILE` / `TWITTER_AUTH_TOKEN` / `AI_AUTHORIZED_X_UNSAFE`。③ 新建 pi 端 `~/.pi/agent/extensions/twitter-guard.ts`，判定逻辑与 CC 规则 4 **逐条对齐**（同一套正则、同一放行标记）；14 条用例两端实测结果完全一致（拦截 6 / 放行 8，含误报用例全过）。④ 本机 `~/.x-isolation.env`（0600，不在镜像范围）：设 `TWITTER_CHROME_PROFILE=Default` + 从 `~/.agent-reach/config.yaml` 提取查询号 cookie 注入环境变量，把工具钉在查询号上（失效即报错、不静默切号）；`~/.zshenv` source 之（用户终端全局生效，agent 的 bash 工具为非交互式 shell 不读 `.zshenv`，需显式 source——该约束已写入规则文本）。
- **镜像同步**：`claude/CLAUDE.md` 已用全局版本覆盖同步、diff 逐字节一致（本次同步同时带上了镜像此前落后的「Language」节——全局早已扩写「输出到会话的回复 + 写入磁盘的落盘文件」两类出口，镜像停在旧版，属分叉回正）；`claude/docs/` diff 无差异。**钩子与 pi 扩展不在镜像范围**（capability-sync 三部分为 skills / CLAUDE.md / docs），故本机文件不入开源仓库。

## 2026-09-22

### 变更（add skill 过目粒度修订：人工过目以内容 change block 为单位，文件类型不再触发强制过目）

- **为什么改**：用户定规（2026-09-22）：新增文档 / 配置 / 记录类文件扫描之后内容没有敏感信息就不需要人工过目——「是否要过目」不以文件 / 文档为单位，而以具体的内容 change block 为单位。原第 4 步「高风险类型强制人工」按文件类型一刀切（新增 `*.md` 等即使两层扫描干净也进人工清单），与该口径冲突，且让用户肉眼过目的量变大（每个新增文档都要点一次头），稀释「少而精」。
- **改了什么**：① 第 3 步引入「内容 change block」为最小判断单位（修改类看 diff hunk、新增类按逻辑段落 / 配置项分块），判断纪律同步从「拿不准的文件」改为「拿不准的块」；② 第 4 步整体重写：取消类型强制人工——新增文档 / 配置 / 记录类所有内容块干净即直接进暂存区，触发过目的唯一理由是具体内容块疑似敏感，报告理由精确到块（行号 + 片段）；保留「这些类型是敏感叙述高发区、逐块扫描格外仔细」的警觉要求（把关强度落在扫描质量而非类型一刀切）；③ 第 5 步分流口径同步（「干净文件」条件从「不属强制人工类型」改为「所有内容块均无敏感信息」，可疑侧从「可疑 / 高风险文件」改为「含可疑内容块的文件」）；④ 第 6 步报告示例去掉「新增文档类双保险」类型理由行、理由示例落到内容块；⑤ description 同步（449/1024 实测 PASS）。
- **镜像同步**：`claude/skills/add/SKILL.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接自动跟随。

### 变更（dev-workflow 预发布供料自动化：新增 auto-rc workflow 模板，main CI 绿后自动发 rc 预发布）

- **为什么改**：用户提出把 dev-workflow 的 release 部分改成「CI 通过 + auto-merge 进 main 后自动发布」。分析后裁定：完全自动正式发版不可取——它架空「正式发布的版本必须是用户使用验收过的」这条根基（CI 只能断言客观回归，断言不了「好用」），且与 VERSION 唯一权威（自动发版要自动 bump，bump 须经 PR 进 main，结构上套娃）、CHANGELOG 纪律（自动生成满足不了「为什么改 + 改了什么」）冲突，还会让每个 PR 合并都出一个正式版、版本节奏失控。真正繁琐且值得自动化的是**预发布的供料**：采纳折中方案——「CI 绿 + auto-merge 后自动发 rc 预发布，正式发版仍由用户触发 /bump + /release」，验收供料自动化、发版裁决权保留。
- **改了什么**：① 新建 `skills/dev-workflow/assets/auto-rc.yml`（可复制模板）：GitHub Actions workflow_run 监听 main 的 CI workflow（success 才进入）、concurrency 串行防撞号、排队期间 main 前进则旧运行跳过、目标版本 = CHANGELOG 顶部第一条未发布的语义版本否则 VERSION patch+1、rc 号查 tag 递增、notes 自动列自上个正式 tag 以来的提交、打 tag + `gh release create --prerelease`；两个定制点（workflow 名与 ci.yml 一致、构建命令按项目改）以注释标注，构建步 exit 1 兜底防未定制直接用。② dev-workflow SKILL.md 六处：核心逻辑段验收来源补自动供料说明、沿革补 2026-09-22 预发布供料自动化一笔、流程总览第 9 条补「配 auto-rc 时随合并自动发」、第 1 步远端门禁新增可选项「自动预发布 workflow」、第 8 步合并后收尾补自动 rc 时序（比合并完成晚一个 CI 周期）、第 9 步预发布主通道改写为自动（主）+ 手动（辅）两条供料通道。③ dev-workflow `references/acceptance.md` 两处：预发布主通道一节重写（自动 / 手动两通道的机制、时序、版本号推导、防重复手发）、「main 与发布的语义闭环」补自动 rc 定位句（自动化的是供料，不是「替用户决定满意」，不碰发版裁决权）。④ release SKILL.md 两处：预发布通道「触发」条补 auto-rc 分工（配了的项目合并后 rc 自动发，手动主要用于合并前提前试用；用户要 rc 先报告最近的自动 rc 避免重复手发），顺带修正两处过时的「dev-workflow 第 8 步」引用为第 9 步（验收步骤号早已变更）。frontmatter description 两 skill 均未动（触发语义不变；dev-workflow 549/1024、release 458/1024 实测在限）。
- **镜像同步**：`claude/skills/dev-workflow/`（SKILL.md + acceptance.md + 新建 assets/auto-rc.yml）、`claude/skills/release/SKILL.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接自动跟随。验证：workflow 模板 YAML 语法实测合法（PyYAML 解析，on/workflow_run/concurrency/if 断言全过）。

### 变更（敏感信息防护体系升级：新建 add skill 预检分流 + gitleaks 工具层双层落地）

- **为什么改**：用户原有防泄漏流程 = 人工肉眼过内容 + `/commit` 时 AI 扫描两层，文件多时人工「扫看过去」效率低且不可靠；且唯一自动防线由 AI 按指令执行（文本规矩非工具强制，存在简化步骤风险），无确定性工具交叉验证、无平台兑底。用户决策：把「人工全量过 + 亲自 add」升级为「工具 + AI 双引擎预检分流——干净文件 AI 自动 add，可疑文件留工作区人工过目（少而精）」。
- **改了什么**：① 新建 `skills/add/SKILL.md`（~430 字符 description）：`/add` 触发预检分流——候选收集（含删除类直接 add）→ 不入库检测（cache / 二进制 / 大文件）→ gitleaks 工具扫描（缺則降级 AI 正则并标注）→ AI 语义扫描（财务 / 隐私 / 敏感叙述三类，拿不准即按可疑）→ 高风险类型强制人工（新增文档 / 配置 / 记录类）→ 干净文件批量 add，可疑留工作区输出三段式报告（✅已加入 / 👁需过目附理由 / 🚫不建议入库）；授权边界：触发即授权当次 add 预检通过文件，对暂存区只增不改。② 本机 `~/.gitleaks.toml` 全局规则配置（[extend] useDefault = true 保留内置约 200 种密钥规则 + 自定义公网 IPv4 规则含私有段 / 文档段 / 公共 DNS allowlist；服务商词表留注释占位由用户自行补充；不入镜像范围）。③ 本机 `~/.config/git/hooks/pre-commit` + `git config --global core.hooksPath`：commit 前对暂存区再扫一道（含仓库级逃生门 `git config hooks.gitleaks false`、行级豁免 `gitleaks:allow`、gitleaks 缺失时放行防卡死；不入镜像范围）。④ 全局 CLAUDE.md「Git 暂存区禁止 AI 自主增删改」第 2 条修订为「删改禁」，新增第 3 条 add 授权例外（把关方式升级而非取消）。⑤ commit skill 六处「用户已自行 git add」口径改为「经 /add 预检加入或用户手动 add」（description 944→952 字符，行为零变化）。
- **验证**：gitleaks 三路径实测——自定义规则命中（公网 IP）、内置规则命中（AWS 假 key，证明 extend 生效）、allowlist 正确放行（私有段 / 公共 DNS / 文档示例 key）；hook 四场景实测——脏暂存区拦截（exit 1）、干净放行（exit 0）、行级豁免、仓库级逃生门；RE2 兼容性坑已踩平（Go 正则不支持 lookbehind）。git commit 集成路径未直接测试（git-commit-guard 正确拦截 AI 测试性 commit，属预期行为，待用户真实提交流程自然验证）。
- **镜像同步**：`claude/skills/add/SKILL.md`（新建）、`claude/skills/commit/SKILL.md`、`claude/CLAUDE.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills` 为指向 `~/.claude/skills` 的符号链接自动跟随。

### 变更（skill-creator 新增 description 长度硬关卡：事前预算 + 事后实测脚本双关卡）

- **为什么改**：commit skill 当日新增 9z 步时 description 顶到 1027 字符、超出 Agent Skills 规范 1024 上限（pi 端报 Skill conflicts），且此类超限已发生多次——根因是长流程型 skill 的 description 常驻离上限一步之遥（commit 现 944、agent-reach 901），任何增量修改都可能顶爆，而长度靠肉眼估算从不可靠。按「规矩必须配套工具强制」元规则补机器判定。
- **改了什么**：① 新建 `scripts/check_description.py`：解析 SKILL.md frontmatter description（单行带/不带引号、`|`/`>` 块标量均支持），按 UTF-16 code unit 计量（`len(s.encode('utf-16-le')) // 2`，与 pi 加载器 JS `string.length` 完全同语义，含 emoji 也不偏），逐文件报 PASS/FAIL/ERR（超限报超多少、达标报余量），exit 0/1 作关卡判定；支持多文件批量巡检；② SKILL.md「Write the SKILL.md」章 description 要点后新增「description length hard gate」条目：改前先跑脚本看现长与余量、写完改完必跑脚本且 exit 0 才算交付，超限时优先把流程机制细节从 description 挪进正文（Progressive Disclosure）而非削弱触发短语；附限制出处（Agent Skills spec / pi `[Skill conflicts]` 警告行为）。验证：全量 15 个 skill 巡检全 PASS（commit 944、agent-reach 901 为仅有的两个贴顶项）；构造用例（超限 FAIL / 块标量解析 / 缺 description ERR）全部符合预期。
- **镜像同步**：`claude/skills/skill-creator/`（SKILL.md + 脚本）已同步 diff 逐字节一致；`~/.pi/agent/skills/skill-creator/` 与权威源同 inode 硬链接自动跟随。

### 变更（commit skill 新增 9z 步：等待 PR 合并后自动对齐本地 main，/commit 当次闭环不留分叉尾巴）

- **为什么改**：2026-09-22 pi 仓库 /commit 实战——PR 被 CI squash 合并后本地 main 与远端产生「内容相同但哈希不同」的分叉，对齐只能靠下次 /commit 的 0a 步兑底（分叉场景还要人工 rebase），每次都留一步手动尾巴。用户立规：把「等 CI 绿 + auto-merge 合并进 remote main + 合并后自动对齐本地 main」加进 commit skill 末尾，当次闭环。
- **改了什么**：commit/SKILL.md 共 8 处：① 新增「9z. 等待 PR 合并并对齐本地 main」步（插在第 9 步之后、第 10 步之前；仅第 8 步走了 PR 通道的场景执行；轮询 `gh pr view --json state,mergedAt` 上限 15 分钟，超时不阻塞交 0a 兑底；CI 失败 / PR 被关 / 异常即停均如实报告；合并后对齐分两场景——功能分支场景 `git switch main` → `git merge --ff-only origin/main` → `git branch -D`，main 兑底通道场景 `git branch -f main origin/main` → `git switch main` → `git branch -D <chore分支>`，全部非破坏性命令、绝不自动 rebase；删分支用 -D 的原因：squash 合并后无祖先关系，内容已进 squash commit、不丢信息）；② 第 8 步两处「不等 CI」「对齐方式由用户决定」改为指向 9z；③ 0a 步补与 9z 互补说明；④ 「注意」段、⑤ 「汇报」段两处、⑥ frontmatter description 同步更新。回归检查：与 2026-09-21「远端 main 对齐前置检测 + PR 兑底通道」条目无冲突——0a 保留不变（兑底跨会话 / 9z 超时 / 异常即停场景），9z 纯增量当次闭环，两者互补不替代。
- **镜像同步**：`claude/skills/commit/SKILL.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills/commit/SKILL.md` 为硬链接自动跟随。**修复**：初版 description 1027 字符超出 pi 端 skill 加载器 1024 上限（加载报 Skill conflicts），当日精简 9z 段（206→123 字符，砍掉场景 A/B 具体命令细节——正文 9z 步全有，description 留行为概要）至 944 字符并重新同步三端。

### 变更（镜像范围口径对齐：全面统一为三部分 skills / CLAUDE.md / docs，清理 rules 时代残留）

- **为什么改**：docs/ 早在 2026-09-12 已纳入镜像为第三部分，但 2026-09-14 的 rules 残留口径清理把「三部分」当成 rules 时代旧说法（skills / rules / CLAUDE.md）统一改成了「两部分」，误伤了 docs 口径，造成多处漂移：本 CHANGELOG 头部、agents-registry 的 Prometheus 行、「capability-sync.md『怎么验证』节数词与括号列举自相矛盾（写两部分却列了三个）」、capability-manager skill 的 SKILL.md 场景 A 步骤与两个 references。用户要求对齐。
- **改了什么**：① `CHANGELOG.md` 头部列举改三部分；② `claude/docs/agents-registry.md` Prometheus 行「两部分」→「三部分」（权威源 `~/.claude/docs/agents-registry.md` 同步修改，逐字节一致）；③ `claude/docs/capability-sync.md`「怎么验证」数词改三部分（权威源同步）；④ `.claude/skills/capability-manager/SKILL.md`：场景 A 步骤 3 的旧「skills / rules / CLAUDE.md」改「skills / CLAUDE.md / docs」、脚手架步骤「复制通用 skills / rules / settings」去掉已废弃的 rules；⑤ `references/content-lifecycle.md`：通用原则改三部分、判断矩阵补 docs 参考文档行、结尾同步范围列举补 docs；⑥ `references/sync-flow.md`：同步范围改三部分、同步情形 1 / 3 的 cp 命令补 docs、一致性核对与巡检的 diff 命令补 docs、数词全部改三部分。

### 变更（项目定位口径去「Claude Code」限定：智能体团队/舰队已不限于单一 harness）

- **为什么改**：智能体舰队如今不仅建立在 Claude Code 之上，也包含其它 harness（如 pi、DSH），「Claude Code 智能体团队/舰队」的限定词以偏概全，用户要求不再强调 Claude Code。
- **改了什么**：去掉「Claude Code」限定词，统一改为中性的「智能体团队/舰队」表述，共 6 处：① 本 CHANGELOG 头部项目定位句；② `claude/docs/capability-sync.md`（权威源 `~/.claude/docs/capability-sync.md` 同步修改，全局与镜像保持逐字节一致）；③④ `README_cn.md` 两处 + `README.md` 两处（双语同步）；⑤⑥ `.claude/skills/capability-manager/SKILL.md` 的 description 与正文各一处。

### 变更（icon-design skill 新增文字边界硬校验：事前预算公式 + 事后实测脚本双关卡）

- **为什么改**：codef 项目 `assets/logo.svg` 副标题文字超出画布被裁切（渲染像素检测证实文字像素顶到画布右边缘），且用户反馈该问题「经常出现」。根因：skill 原自检清单三项（外轮廓 / 配色 / 构图）全为**主观项**，没有任何文字宽度的量化关卡；而 `<text>` 实际渲染宽度是逐字符 advance width 之和、随字体字号变化，凭直觉给 x 坐标与 font-size 经常偏差 20% 以上，且文字超出 viewBox 被直接裁切、看 SVG 源码发现不了——必须实测。按「规矩必须配套工具强制」元规则补机器判定。
- **改了什么**：① SKILL.md 新增「六、文字边界硬校验（含 `<text>` 的 SVG 必做）」：事前预算公式（英文比例字体平均字符宽 ≈ 0.55 em、全角 ≈ 1.0 em，`起点 x + 预估宽度 ≤ 画布宽 × 95%`，超了优先缩短文字其次降字号）+ 事后实测硬性关卡（跑校验脚本 exit 0 才算过，肉眼与源码检查不算数）+ 口径说明（5% 边距是防裁切硬底线，与构图留白 10%–15% 审美要求独立并行）；② 自检清单由三项扩为四项，第 ④ 项指向实测脚本；③ 骨架要点行提示文字必须过边界校验；④ 原「六、为什么」顺延为第七章；⑤ 新建 `scripts/check-text-bounds.py`（渲染完整 SVG 与「移除全部 `<text>`」两版图像逐像素相减得纯文字包围盒，校验落在 5% 边距安全区内；依赖 `rsvg-convert` + Pillow；支持 `--margin-pct` / `--scale` 参数）。校验器自身已双向验证：对 codef 旧 logo（长副标题）FAIL、修复后 PASS。
- **镜像同步**：`claude/skills/icon-design/` 已同步 diff 逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（dev-workflow skill 修订：commit 一律由用户亲自执行，AI 不申请授权不代行）

- **为什么改**：2026-09-22 用户裁定——commit 动作由用户亲自完成（自行 `git add` 后触发 `/commit` skill，commit + push + PR auto-merge 一条龙），AI 不再申请 commit 授权、不代行；AI 职责收敛为「交付报告列明应 `git add` 的路径与改动摘要 + 确保 `/commit` skill 覆盖所需功能（缺口先补 skill）」。dev-workflow 原表述（2026-09-21 用户立规「commit 须用户明确授权后执行、当轮授权后 AI 带 `# AI_AUTHORIZED_COMMIT` 标记执行」）与新裁定冲突。
- **改了什么**（2026-09-22）：全局权威源 `~/.claude/skills/dev-workflow/` 修订并同步镜像 `claude/skills/dev-workflow/`：SKILL.md 五处（杂事通道 `git add` 主语明确为用户；第 3 步测试 Agent 出题交接改为「交付自检后报告用户列明 add 路径，commit 由用户执行」；第 7 步 CI 红修复循环改走用户 `/commit`；流程内授权说明改为「commit 一律由用户亲自执行」；「git / gh 授权边界」段整体改写——`git commit` 从「须用户明确授权后 AI 执行」收敛为「AI 一律不代为执行，用户自行 `git add` + `/commit`，暂存区由用户亲自把关、skill 只提交暂存区内容」）；`references/test-cases.md` 两处（出题动线与 Hopper 主通道描述同步）。pi 端 `~/.pi/agent/skills/` 副本与权威源同文件，自动一致。

## 2026-09-21

### 变更（commit skill 第 10 步新增工具强制：git status 收尾必须真实执行，pi 端 git-status-guard 扩展兑底）

- **为什么改**：当日 pi 会话 /commit 汇报收尾时 AI 没有实际执行 `git status`，凭上下文手工拼了一段假输出贴进代码块——既猜错工作区状态（实际 working tree clean，拼的是有未暂存改动），还拼出真实 git 不会输出的 `git cast -A` 提示语，被用户自己执行 git status 后发现不一致。用户裁决：按「规矩必须配套工具强制」元规则补工具强制，防「忘执行 / 贴错 / 编造」三种失守。
- **改了什么**：① 新建 pi 端扩展 `~/.pi/agent/extensions/git-status-guard.ts`：强制锚点为带 `# AI_AUTHORIZED_COMMIT` 标记的 `git commit`（与 git-commit-guard 授权判定同源），三层防线——commit 的工具结果追加提醒（收尾必须实际执行 `git status` 并原样贴出）；assistant 最终消息里的 `>> git status` 代码块与扩展实测输出逐字比对（规范化换行与行尾空白），不符即替换为真实输出并加警示行（编造 / 贴过期输出 / 贴 `--short` 变体都会被纠正）；run 结束（agent_settled）仍无 status 代码块时实测 git status 直接 notify 用户曝光。状态生命周期 agent_start 重置、tool_call 置位、settled 清除；判定与执行全程防御性 catch 不阻塞会话；敏感扫描 / cache 检测命中即终止的场景无 commit 无锚点、仍靠文本纪律。冒烟测试 8 场景通过（编造替换 / 真实放行 / 行尾空白差异规范化后放行 / 漏贴兑底 notify / 非授权全链路不触发），pi print 模式真环境加载无错；② commit/SKILL.md 第 10 步增补「工具强制」说明（代码块内容必须来自真实执行、不得凭推断拼造，含事故记录），「注意」段加对应条目；CC 端 Stop hook 配套待补，文本已注明。
- **镜像同步**：`claude/skills/commit/SKILL.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills/commit/SKILL.md` 为硬链接自动跟随；pi 端扩展不在 Prometheus 镜像范围。

### 变更（commit skill 两项流程新增：远端 main 对齐前置检测 + main 禁推时自动走 PR 兜底通道）

- **为什么改**：当日 pi 仓库 /commit 实战暴露两个流程缺口——① 本地 main 落后 origin/main（PR 被 CI squash 合并后没跟上）时直接走到 push 必撞 non-fast-forward，push 被拒后只能人工指引建分支，每次都要用户手动补一步；② remote main 已锁定直推（分支保护），skill 原行为是「如实报告 + 指引 PR 通道」，但指引后的建分支 / push / 建 PR / auto-merge 全套动作要用户重新驱动，体验断裂。用户立规补两条：流程最前面加远端对齐检测、最后面加 main 禁推时自动走分支 PR + CI 自动合并通道。
- **改了什么**：① 新增第 0a 步「远端 main 对齐检测」（原第 0 步分支感知顺延为 0b）：`git fetch origin` 后用 `git rev-list --count main..origin/main` / `origin/main..main` 判领先关系——远端领先且本地不领先（纯落后）直接拉取对齐（main 上 `git pull --ff-only origin main`，其它分支上 `git fetch origin main:main` 快进 main 引用不动工作区）；两边分叉或拉取失败等矛盾 → 暂停询问用户（流程内决策点，非敏感扫描类终止，答复后可继续不须重新 /commit），不自行改写历史；② 第 8 步 main push 被分支保护拒绝或 non-fast-forward 拒绝时，不再只作指引，自动执行 PR 兜底通道：`git switch -c chore/<事项>` 带上本地 main 领先提交 → push 分支 → `gh pr create` → `gh pr merge --squash --auto --delete-branch` 启用 auto-merge（CI 绿自动合并）；本地 main 与远端对齐方式仍由用户决定（AI 不执行 reset / force）；③ description / 导语 / 「核心定位」/ 0 步 main 分流 / 「注意」/ 「汇报」段同步对齐新行为（汇报段加 PR 兜底场景的报告项：拦截原因 / 分支名 / PR URL / auto-merge 状态 / 本地 main 对齐提醒）。
- **镜像同步**：`claude/skills/commit/SKILL.md` 已同步 diff 逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（全局 TODO 新规：TODO 与 GitHub Issue 不得重复，转移到 Issue 的条目必须归档）

- **为什么改**：dev-workflow 已定 GitHub Issue 为需求端（问题随手开 Issue、fixes #N 合并自动关闭），同一待办事项容易同时挂在项目 TODO.md 与 Issue 两处，状态会漂移（一边关了另一边还挂着）；用户立规：两边不得重复，TODO 条目转移到 Issue 后必须归档。
- **改了什么**：全局 CLAUDE.md「待办（TODO）管理」章节新增一条「TODO 与 GitHub Issue 不得重复（同一事项单一在途源）」：同一事项只允许在一个地方在途；为某条待办建了对应 Issue（或决定改由 Issue 追踪）后，该条目移入 TODO-archive.md、标 `✅**已转移**` + 指向 Issue（如 `（已转移至 Issue #42）`），不留在 TODO.md；反向同理——已在 Issue 追踪的事项不再写进 TODO.md，建 Issue 前查 TODO.md、记 TODO 前查 Issue 列表。归档动作沿用现有「移出 TODO 一律进归档」闭环，未新增其它机制。
- **镜像同步**：`claude/CLAUDE.md` 已同步 diff 逐字节一致；顺带修复该镜像落后全局的既有分叉（「待办无可选项」句此前只改了全局未同步镜像，本次 cp 整体覆盖一并对齐）；`~/.pi/agent/CLAUDE.md` 为软链接指向全局文件、自动生效，无需同步。

### 变更（commit 授权收紧：不论分支/worktree/流程一律须用户明确授权，hook 硬拦截配套）

- **为什么改**：pi 会话中开发 Agent 依 dev-workflow 旧表述「流程内授权功能分支 commit」未经用户确认直接执行了 `git commit`，与全局铁律「commit 唯一授权入口 `/commit`」直接冲突；用户裁决：铁律优先，commit 不论哪个分支、哪个 worktree、哪条流程都必须用户明确授权，并按「规矩必须配套工具强制」元规则补 hook 硬约束。
- **改了什么**：① 全局 CLAUDE.md 铁律第 1 条修订——明确授权仅两种形式（用户主动发起 `/commit`，或用户当轮消息明确授权 commit；AI 列命令后用户点头不算），配套 `# AI_AUTHORIZED_COMMIT` 授权标记机制（仅上述两场景使用）；② dev-workflow/SKILL.md「git / gh 授权边界」将 `git commit` 移出授权清单（含测试 Agent 出题后与 CI 红修复循环的 commit），第 3 步、第 7 步及 references/test-cases.md 同步对齐；③ commit/SKILL.md 串联命令模板 `git commit -m "<msg>" && git push` 尾部带 `# AI_AUTHORIZED_COMMIT` 标记 + 标记语义说明（`/commit` 触发即明确授权）；④ hook 两份：`~/.claude/hooks/pre-tool-use-guard.sh` 新增规则 3（无标记 `git commit` 一律 deny），新建 `~/.pi/agent/extensions/git-commit-guard.ts`（pi 端，与 CC 端判定对齐：`git commit` / `git -C <path> commit` / 选项带参数形态全覆盖，`git log --grep=commit`、`git checkout`、`git commitfoo` 等不误伤，含字样即拦属明确取舍宁误拦不漏拦；正则单测 13 组 + CC 端实测 8 组通过，TS 语法检查通过）。
- **镜像同步**：`claude/CLAUDE.md`、`claude/skills/dev-workflow`、`claude/skills/commit` 已同步 diff 逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随；CC 端 hook 与 pi 端 extension 不在 Prometheus 镜像范围。CC 端 hook 每次调用新进程即时生效；pi 端 extension 新会话加载生效。

### 变更（全局注册表超集映射表加行：Wright 新增子项目 agent-team-playbook-src）

- **为什么改**：用户为 The Agent Team Playbook 付费产品建专门私有仓库做版本管理（tag + gh release 附分语言 zip），作为 ProductProducerAgent（Wright）的子项目登记。
- **改了什么**：`agents-registry.md` 超集映射表在 Wright → GitComic 行后加一行：Wright → agent-team-playbook-src（产品私有源仓库；与公开落地页仓 agent-team-playbook 区分）。
- **镜像同步**：`claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致。

### 变更（同日三次修订：Issue 作需求端，测试开发分离 + 测试先行，hook 护测试文件全量）

- **为什么改**：同日用户三次修订 dev-workflow 需求端与测试权属——① GitHub Issue 作为需求端（平时遇到问题随手开 Issue、有空再解决，主流开源模式；Issue open/closed 替代 test-cases 的 pending/passed 状态机，fixes #N 合并自动关闭，归档动作整体消失）；② 测试开发分离 + 测试统一先行（用户推演：小改动不写测试则回归防护网有缺口、后补测试会写成快照式断言、同会话自己写隔离太薄——测试文件对开发物理可见可改，纪律墙不硬）；③ 测试 Agent（Hopper）主通道出题（读 Issue 在功能分支写测试、自跑见红、commit；独立会话降为无测试 Agent 环境的代行——先行时序下实现尚不存在，出题上下文天然无实现）；④ 开发对测试文件全量只读可运行（hook 从只护 test-cases/ 扩展到测试目录段 + 测试文件名全量）。
- **改了什么**：① dev-workflow/SKILL.md 十一步重写（第 1 步门禁改为 Issue + 远端门禁就位；新第 3 步测试先行——测试 Agent 出题先红、开发才开工；第 4 步纪律改为测试文件全量只读；第 5 步对齐后改查 Issue 与测试 commit 变更；第 6 步口径简化为全绿；第 7 步 PR 带 fixes #N；第 8 步收尾无归档；核心逻辑与角色分立重写：用例定义权归测试 Agent、实现权归开发、合并裁决权归 CI、发布裁决权归用户）；② references/test-cases.md 重写（Issue 需求端与状态机、先红后绿时序及「分支内先行、不先进 main」论证、三源出题、hook 全量保护、存量 test-cases/ 迁移指引、Hopper 外部权威源镜像机制随目录体系取消）；③ references/acceptance.md 与 merge-discipline.md 对应更新（修复循环改为「开 Issue → 测试 Agent 先写失败测试 → fix 分支」，需求变更走 Issue 更新通道）；④ commit/SKILL.md 清理归档分支措辞、PR body 加 fixes #N；⑤ hook 两份同步扩展：`~/.claude/hooks/test-cases-guard.py`（四端共用）与 `~/.pi/agent/extensions/test-cases-guard.ts` 判定逻辑逐条对齐——保护对象扩展为测试目录独立段（test / tests / __tests__ / __snapshots__ / spec / e2e）+ 测试文件名（*.test.* / *.spec.* / test_*.py / *_test.py / *_test.go / conftest.py / *.snap）+ 存量 test-cases/，整段 / 全名匹配不误伤 latest / contest / testcase，重定向目标判定泛化，Bash 预筛扩展；Python 版 23 组判定用例全部通过（应拦 11 路径 + 11 命令，放行 8 路径 + 12 命令），TS 版语法转译与模块加载验证通过（pi 端新会话生效）。
- **镜像同步**：`claude/skills/` 五文件已同步 diff 一致；`~/.pi/agent/skills/` 为硬链接自动跟随；pi extension（`~/.pi/agent/extensions/test-cases-guard.ts`）为 pi 端专属、不在 Prometheus 镜像范围。

### 变更（同日二次修订：合并去人工门禁，验收过程化，人工门禁落点移到正式发版）

- **为什么改**：同日用户二次修订 dev-workflow 门禁分工——「CI 绿即 auto-merge 合并」的合并环节去掉用户验收条件（合并由 CI 独裁，不等人工）；用户验收是过程而非瞬时门禁：复杂项目 CI 较慢，等待窗口正好先从功能分支预发布，用户体验预发布版本就是在验收，需要一段时间；试用满意、且功能已合并进 main 后才正式发版——人工门禁从「合并前」移到「发版前」，发现问题走修复循环（fix 分支 + PR + CI + 新 rc），发版推迟到满意为止。
- **改了什么**：① dev-workflow/SKILL.md 十步重排（第 6 步 push+建 PR+enable auto-merge 一体化，合并即 CI 绿自动执行；新第 7 步合并后收尾；新第 8 步使用验收（过程：预发布试用、修复循环、需求变更通道）；新第 9 步正式发版（/bump + /release 由用户触发，触发即验收通过的表达）；删「验收后冻结 PR head」纪律；授权边界改为 auto-merge 标准动作；核心逻辑改为「main 必须永远绿，正式发布的版本必须是用户使用验收过的」）；② merge-discipline.md：门禁分工改为「合并裁决权归机器（分支保护 + CI 独裁）、发布裁决权归用户（试用满意才发版）」，删验收冻结段、新增合并后修复循环段，门禁精确含义分两层表述；③ acceptance.md 重写为「预发布试用与发版验收」（验收为何过程化、预发布主通道 + 本地测试包轻量选项、修复循环、main 与发布语义闭环：main = CI 绿集合、正式发布 = 用户试用过的 main 快照、预发布是桥）；④ test-cases.md：归档安全性依据改为「CI 机器裁决完成即归档，试用发现问题开新用例组新编号、旧组不复活」；⑤ commit/SKILL.md：建 PR 后统一顺手 enable auto-merge（gh pr merge --squash --auto --delete-branch），不手动 merge，汇报节提醒改为「发版前确认用户已预发布试用满意且 PR 均已合并」；⑥ release/SKILL.md：预发布 tag 落点扩展（合并前功能分支 / 合并后 main 两阶段均可，体验即验收），试用后处置（问题 → 修复循环递增 rc；满意 → 正式发版）；⑦ bump/SKILL.md：第 6 步改为确认 auto-merge（commit skill 建 PR 时已顺手 enable，未启用则补）。
- **镜像同步**：`claude/skills/` 七文件已同步，diff 与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（dev-workflow 改回远端主流模式：main 分支保护 + PR + CI 门禁 + 预发布，四 skill 联动改版）

- **为什么改**：用户 2026-09-21 裁定，开发流程回归主流形态——remote main 分支锁定直推（分支保护）、一切经 PR、CI 通过才能合并进 main、回归防护网放 CI 里；正式发布必须在功能合并进 main 之后，合并前可从功能分支预发布。取代 2026-09-07 的本地裁决版（无 PR 无 CI、main 可直推、本地快进合并）。旧版把裁决全部压在本地（本地全量测试 + 本地超集校验 + 快进合并），「绿」与「可合并」无结构绑定，依赖纪律而非平台机制；新版把机器门禁移到远端 CI + 分支保护 required checks，合并条件由 GitHub 结构性强制。
- **改了什么**（全局 `~/.claude/skills/` 四个 skill + 根 CLAUDE.md）：
  1. **dev-workflow/SKILL.md 全面改写**：十步新流程（定性 → 开工门禁（用例组 + 远端门禁就位）→ worktree + 功能分支 → 开发纪律 → 对齐 origin/main → 本地全量测试（预检）→ push + 建 PR 远端 CI 裁决（权威）→ 用户验收（人工门禁，可选预发布安装来源，验收后冻结 PR head）→ 合并 PR（CI 绿 + 验收过，squash + 可 auto-merge）→ 收尾（归档小 PR、删分支、清 worktree））。杂事不再「main 直改直推」，同样经 chore 分支 + PR + CI；第 1 步新增远端门禁就位检查（分支保护配置 + ci.yml 最小规范，含首次启用顺序「先 ci.yml 进 main、再开保护设 required」防死锁）；git/gh 授权边界扩展（push 功能分支 / gh pr create / gh pr merge / 预发布 tag + --prerelease 属流程内授权）。
  2. **references/merge-discipline.md 重写**：超集校验 + 快进合并论证 → 三重门（分支保护结构性门 / 远端 CI 机器门 / 用户验收人工门）+ 验收冻结（验收后不 push 新 commit）+ squash 树等价（merge 后 main 的树 == PR head 的树，物理基础从本地快进换成平台 merge 语义）+ up-to-date / update-branch 并行循环 + 复验口径。
  3. **references/test-cases.md**：新增「CI 集成」一节（ci.yml 最小规范：pull_request + push main 触发、单测 + test-cases 全量 + 类型检查、required checks、存量仓库恢复启用、CI 红处置）；同步机制落地改为「同步分支 + PR」；归档改为「归档分支 + 小 PR + CI 绿 auto-merge」；强度边界段更新（CI 恢复后的增益：回归网持续生效 + 干净环境独立复核，防 hack 仍靠人工验收 + Hopper）。
  4. **references/acceptance.md**：验收安装来源两选项（本地测试包 / 预发布 Release）；验收期间 main 变动改为 up-to-date 自动挡 + 复验口径；main 语义闭环更新（main = CI 绿 + 功能类验收过的集合；预发布是 main 外的前瞻快照）。
  5. **commit/SKILL.md**：分支感知三通道（main 仅无保护仓库可直推，被保护拒绝时如实报告 + 指引建分支走 PR；功能 / 杂事 / bump 分支 push 后顺手建 PR 若无；不 merge）；汇报节同步更新；description 改写。
  6. **bump/SKILL.md 重写**：main 直改直推 → 建 `chore/bump-v<版本>` 分支改齐版本号 → /commit（push + 建 PR）→ enable auto-merge（CI 绿自动 squash 合并进 main）；三段式发版表格更新（② 段从「/commit 直推」变为「CI 绿 auto-merge」）。
  7. **release/SKILL.md**：新增「预发布通道」一节（功能分支打 `v<目标版本>-rc.N` / `-beta.N` tag 发 --prerelease Release，不 bump 版本文件，供合并 main 前验收 + 早期尝鲜；迭代递增 N，旧预发布保留）；第 0 步改「路径分流 + 对齐 remote main」（正式版只从 main、功能须已合并；预发布走专属通道跳过版本就绪校验）；「注意」节补预发布必带 --prerelease。
  8. **全局 CLAUDE.md**：「/commit 例外」段的 /commit 定义补一句「在非 main 分支上 push 后顺手建 PR（remote main 已锁定直推，2026-09-21 起）」。
- **镜像同步**：`claude/skills/` 四 skill + `claude/CLAUDE.md` 已同步，diff 与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随（CLAUDE.md 为符号链接）。

## 2026-09-20

### 变更

- **agents-registry.md 同步：ghostty 行改为独立分叉表述**（`claude/docs/agents-registry.md`）。为什么改：全局权威源同步更新——xhqing/ghostty 已于 2026-09-20 断开与原上游 ghostty-org/ghostty 的 fork 关系（GitHub 独立仓库状态），此后自主演进；原「个人 fork、跟上游版本 rebase 维护」表述过期。改了什么：ghostty 行改为「独立分叉仓库……断开 fork 关系、自主演进，v1.3.1 基线 + 贴图补丁」（源变更记 FullStackEngineerAgent CHANGELOG）。

- **agents-registry.md 同步：Atlas 职责行列举更新、映射表补 cmux-launcher 与 ghostty 两行**（`claude/docs/agents-registry.md`）。为什么改：全局权威源同步更新——cmux-launcher 纳入时漏改注册表（历史欠账，本次补齐）；ghostty（Ghostty 终端个人维护 fork，Cmd+V 粘贴剪贴板图片为临时文件路径补丁）正式成为 Atlas 第六个子项目；Atlas 职责行的项目列举已过时，改为概括式并指向映射表（源变更记 FullStackEngineerAgent CHANGELOG）。

## 2026-09-19

### 变更

- **agents-registry.md 的 pi 行改为独立分叉表述**（`claude/docs/agents-registry.md`）。为什么改：全局权威源同步更新——xhqing/pi 已于 2026-09-19 在 GitHub 断开与 earendil-works/pi 的 fork 关系，此后自主演进；原「个人 fork、跟上游同步并做个人维护」表述过期，会误导后续会话去做上游同步。改了什么：pi 行改为「独立分叉仓库……断开 fork 关系，自主维护演进」（源变更记 FullStackEngineerAgent CHANGELOG）。

### 变更（release skill 新增「产物惯例核查」防裸发）

- **为什么改**：2026-09-19 在 pi fork 发 v0.86.0 时，release skill 的产物探测（`*.vsix` / `dist/*` / `build/*` / `target/*.zip`）对「产物由 CI 或专用脚本构建、发布前本地不存在」的项目零命中（pi 的产物是 CI 构建的各平台二进制包），探测为空后安静走了无产物发布分支，GitHub Release 裸发无任何 assets、事后人工构建补挂。根因两层：① 探测模式偏 VSCode 扩展，对 CI 中心化项目形态覆盖不到；② 探测为空时无「本项目按惯例应有产物」的对照告警。另外 fork 仓库 CI 链不可用（GitHub 对 fork 默认抑制 workflow 运行、发布类 secrets 缺失），产物只能本地构建，本地核查必须补位。
- **改了什么**：全局 `~/.claude/skills/release/SKILL.md` 第 7 步新增「产物惯例核查（本地探测为空时必做）」：探测为空时核查三个信号（tag 触发的产物构建 workflow / fork 场景 upstream 同名 Release 挂有 assets / 本仓库历史 Release 挂过 assets），任一命中即暂停指引先构建再上传（优先仓库自带构建脚本 + 冒烟验证 + `gh release upload`），三信号皆不命中才照旧无产物发布；同时注明本地直接建正式 Release 与 CI「draft → 转正」编排的互斥关系。探测列表补入 `*.tgz`。「注意」节同步增补对应提醒。镜像同步：`claude/skills/release/SKILL.md` 已同步，diff 与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（dev-workflow description 修正适用前提歧义：无 test-cases 体系不是绕过的理由）

- **为什么改**：2026-09-19 在 pi 项目（无 `test-cases/` 验收用例体系）要求解决 Issue #1（cursorStyle 核心功能），开发会话未触发 dev-workflow，直接在 main 上开发并提交。排查定位到 description 开头「存在测试用例的软件开发项目的核心功能开发循环」被误读为项目现状前置筛选条件（项目尚无用例体系 → 前提不满足 → 不触发）。这与流程自身逻辑矛盾：第 1 步开工门禁本来就设计了「无用例组 → 阻塞并引导建立」的从零建系路径，若从未建过用例体系的项目永远不触发，该路径永远无法执行。溯源自 2026-09-07 用户裁定「只有存在测试用例的软件开发项目才走 dev-workflow」，政策实质是「纯杂事不走、核心开发走」，本次修正消除歧义、贴合政策原意，不改变政策本身。
- **改了什么**：全局 `~/.claude/skills/dev-workflow/SKILL.md` description 两处：① 开头定语「存在测试用例的软件开发项目」改为「软件开发项目」（适用范围按项目性质而非项目现状判定）；② 触发段新增「项目尚无 test-cases 验收用例体系不是绕过本流程的理由——此时同样必须使用，第 1 步开工门禁会阻塞并引导先建用例组」。正文未动（第 0 步、第 1 步逻辑本就自洽）。镜像同步：`claude/skills/dev-workflow/SKILL.md` 已同步，diff 与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。关联：pi 项目根 `CLAUDE.md` 的 Development Rules 同日新增本地增补小节，明确该项目核心开发同样走 dev-workflow（pi 为 fork 仓库、无根 CHANGELOG，不另记）。

- **为什么改**：用户新建 GitComic 子项目（Git 漫画书产品线仓库，位于 `~/Developer/GitComic`）并由 ProductProducerAgent（Wright）负责；按「新增 / 变更子项目时以映射表为准」规则，在全局注册表映射表登记。
- **改了什么**（2026-09-19）：全局 `~/.claude/docs/agents-registry.md` 超集映射表新增一行：ProductProducerAgent（Wright）→ GitComic（Git 漫画书产品线仓库：试读 PDF + 引流图卡，en/zh 双语，后续全本迭代在该仓进行；制作资产与交付物在本机被忽略的 artifacts/）。镜像同步：`claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致。

### 变更（超集映射表新增 pi 子项目行）

- **为什么改**：用户将 pi（Pi agent harness 的个人 fork，fork 自 earendil-works/pi，位于 `~/Developer/pi`）变更为 FullStackEngineerAgent（Atlas）负责的子项目；按「新增 / 变更子项目时以映射表为准」规则，在全局注册表映射表登记。
- **改了什么**（2026-09-19）：全局 `~/.claude/docs/agents-registry.md` 超集映射表新增一行：FullStackEngineerAgent（Atlas）→ pi（Pi agent harness 的个人 fork，TypeScript monorepo：coding agent CLI / agent 运行时 / 统一多供应商 LLM API / TUI 组件库，跟上游同步并做个人维护）。镜像同步：`claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致。

### 变更（全局默认输出语言改回中文）

- **为什么改**：2026-09-18 应用户要求由中文改为英文默认；现用户再次调整，改回中文为默认输出语言。
- **改了什么**（2026-09-19）：全局 `~/.claude/CLAUDE.md`「Language」节第一条改为「默认使用**中文（简体中文）**回答用户」；例外为用户明确要求其他语言（用英语提问视为陪练场景，按「用户英语陪练」用英语回答）或上下文明显需要其他语言；普通话行文、排版、中文标点三条改为「约束中文输出——默认输出中文，故常态适用」。镜像同步：`claude/CLAUDE.md` 已同步，diff 与全局逐字节一致。

### 变更（新增「最终结论前先输出『==============』框线」输出规矩）

- **为什么改**：用户要求回复的最终结论与执行过程内容明确区分——过程内容之后、结论之前先单独一行输出「==============」框线，让用户一眼定位结论，不用在过程叙述里翻找。
- **改了什么**（2026-09-19）：全局 `~/.claude/CLAUDE.md`「输出风格」节新增条目（作为首条）：回复既有执行过程内容（读文件、跑命令、中间分析、逐项检测结果等）又有最终结论时，先输出完整过程内容，然后单独一行输出框线「==============」（14 个等号），紧接着输出最终结论；只有结论、没有过程内容的简短回复不硬加框线；框线行单独成行、上下留空行（避免被 Markdown 渲染成标题线）。镜像同步：`claude/CLAUDE.md` 已同步，diff 与全局逐字节一致。

## 2026-09-18

### 变更（全局默认输出语言改为英文）

- **为什么改**：用户要求把全局规则的默认输出语言设为英文（原为简体中文）。
- **改了什么**（2026-09-18）：全局 `~/.claude/CLAUDE.md` 「Language」节第一条改为「默认使用**英文（English）**回答用户」，例外不变（用户明确要求其他语言、或上下文明显需要其他语言时照用），并注明普通话行文、排版、中文标点三条仅在输出中文时适用。镜像同步：`claude/CLAUDE.md` 已同步，diff 与全局逐字节一致。

### 变更（新增「用户英语陪练」规则：意图不明先问、语言问题及时纠）

- **为什么改**：用户英语不算好但正在主动学习，会尽量用英语交流；需要配套规则保证：意图看不清时不瞎猜，同时随手纠错帮助提升。
- **改了什么**（2026-09-18）：全局 `~/.claude/CLAUDE.md` 「Language」节新增一条「用户英语陪练」：① 意图不确定就先问，不要凭猜测动手；② 发现用户用词、搭配、语法问题当场指出并给出更地道的说法（原句 → 建议写法），纠错简短友好、不喧宾夺主。镜像同步：`claude/CLAUDE.md` 已同步，diff 与全局逐字节一致。

## 2026-09-16

### 变更（QSAgent 体系概念修正：删「公开门面 / 私有本体」表述，QuantStrategistAgent 确立为 Agent 项目、Intraday / Swing / gridtrader 为其子项目）

- **为什么改**：用户裁定——只有以 Agent 结尾命名的仓库才是真 Agent 项目，「私有本体 / 公开门面」这套两分概念作废。原注册表把 Intraday（原 QuantStrategistAgent 改名而来）当 Agent 项目、仅挂 gridtrader 一个子项目，Swing 与 Intraday 的归属悬空，体系口径与用户口径（QuantStrategistAgent 是 Markowitz 的 Agent 项目）不一致。
- **改了什么**（2026-09-16）：① 全局 `~/.claude/docs/agents-registry.md` 超集映射表：删「Intraday（Markowitz 量化私有本体，原名……）| gridtrader」行，改为「QuantStrategistAgent（Markowitz）→ Intraday / Swing / gridtrader」三行；② 全局 `~/.claude/CLAUDE.md` QSAgent 缩写定义同步改为「主仓库 QuantStrategistAgent + 子项目 Intraday、Swing、gridtrader」。镜像同步：`claude/CLAUDE.md` 与 `claude/docs/agents-registry.md` 已同步，diff 与全局逐字节一致。

## 2026-09-14

### 变更（清除已废弃 `~/.claude/rules/` 目录的过期描述：README 中英 + capability-manager skill 全链）

- **为什么改**：全局 `~/.claude/rules/` 目录已废弃删除（全局规则现只存在于 CLAUDE.md，见全局 CLAUDE.md「新增全局规则直接写入全局 CLAUDE.md 对应章节」），但本仓库多处文档仍把它当现存功能描述：README 中英的结构表、capability-manager skill 的同步操作指引与 references 流程（甚至教「在 `~/.claude/rules/` 建文件 + CLAUDE.md 加 @ 引用」的完整操作）——不删会误导后续同步操作指向不存在的目录。镜像目录本身已与全局一致（两侧 `rules/` 均已不存在），本次仅文档修正。
- **改了什么**（2026-09-14）：① `README.md` / `README_cn.md`——正文列举给 rules 标注载体（in `CLAUDE.md`）、结构表删 `~/.claude/rules/` 行、`CLAUDE.md` 行描述补 working rules；② `.claude/skills/capability-manager/SKILL.md`——同步操作指引删 `~/.claude/rules/` 路径，注明全局规则在 CLAUDE.md 章节内；③ `references/content-lifecycle.md`——同步范围「三部分」改「两部分（skills / CLAUDE.md）」、判断矩阵删 rules/ 行、整章删除「改 rules/」操作流程；④ `references/sync-flow.md`——同步范围改两部分并注明目录已废弃、cp / diff / 核对清单删 rules 项；⑤ 本 CHANGELOG 头部描述同步改「两部分」。注：本次只改本项目自有文件（README + 项目级 skill），不动 `claude/` 镜像内容（全局侧对应文件无 `~/.claude/rules/` 现存性描述，无需同步）。

## 2026-09-13

### 变更（分发层终结：删除「全局 ↔ 各项目 anysearch 副本」同步规则，只保留单一出口）

- **为什么改**：单一出口模式落地后，各 agent 项目已陆续清除通用 skill 副本（2026-09-13 核验：`~/Developer/*/.claude/skills/` 下无任何 anysearch 副本），但全局 CLAUDE.md 指针节、capability-sync 文档、new-agent-scaffold 边界条款里仍保留「维护各项目 anysearch 副本」「既有项目副本按需维护」的分发层规则，指向已不存在的副本，用户指出过时并授权清理。现行规则收敛为：只有 Prometheus 镜像全局并开源，其余项目零分发。
- **改了什么**：① 全局 `~/.claude/CLAUDE.md` 指针节删「维护各项目 anysearch 副本」职责，补「Prometheus 是通用能力开源的单一出口」表述；② `~/.claude/docs/capability-sync.md`——标题「跨项目同步」→「镜像同步」、「何时读」删副本维护项、删「与下方各 skill 同步小节的关系」条、删「anysearch skill 同步（全局为权威副本）」整节（留一行去向说明指向 git 历史）；③ `~/.claude/docs/agents-registry.md` Prometheus 行「新建项目不再分发副本，既有项目副本按需维护」→「只有本项目镜像全局，其余 agent 项目不再分发副本」；④ `~/.claude/docs/new-agent-scaffold.md` 边界条款由「既有项目不做强制回退清理、副本按 capability-sync 同步小节维护」改为「单一出口已全量落地、副本已全部清除、分发层终结」；⑤ 本项目 README 中英两版目录表全局 skill 举例删去已不存在的 find-skill。镜像同步：`claude/CLAUDE.md` 与 `claude/docs/` 三文档已同步，diff 与全局逐字节一致。

## 2026-09-12

### 变更（test-cases-guard 补挂 pi 端 + 需求组编号规则）

- **为什么改**：① 上一条 dev-workflow 减重落地后发现 pi 端未挂载 test-cases-guard（工具强制只覆盖 CC / ZCode / CodeBuddy / Trae 四端，pi 会话里用例目录写保护只靠文本纪律），用户要求补挂；② 用户要求需求组带编号（#123 风格），给跨会话沟通与 CHANGELOG 引用提供稳定锚点。
- **改了什么**：① 新建 `~/.pi/agent/extensions/test-cases-guard.ts`——pi 的拦截机制与 CC 不同（进程内 tool_call 事件、非外部 PreToolUse 脚本），故将 Python 版判定逻辑逐条移植为 TS extension（拦截范围、授权标记、拆段判定一致），`pi -p` 实测三项通过（无标记写操作被拦、纯读放行、`# TEST_CASES_WRITE_OK` 放行）；② dev-workflow 需求组目录命名升级为 `<编号>-<需求名>`（如 123-login-timeout）：编号项目内全局递增、永不复用（新号 = pending + passed 最大编号 + 1，与 TODO 编号同构），沟通用 `#编号` 指代，目录名不带 #（shell 与正则判定友好），出用例方定号——SKILL.md 三处占位符、test-cases.md 目录结构与三通道、acceptance.md 一处同步更新；③ test-cases.md hook 节挂载清单收录 pi 端（五端）；④ Python 版 DENY_REASON 文案同步（豁免用途补「独立会话出用例、用户授权的归档挪动」，与新流程对齐）。镜像同步：`claude/skills/dev-workflow/` 四文件已同步，diff 与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（dev-workflow 测试环节减重：出用例改独立会话主通道、Hopper 转可选强化、归档授权化）

- **为什么改**：dev-workflow 原设计每次核心开发都必须经测试 Agent（Hopper）供用例 + 验收后 Hopper 归档，用户反馈对日常开发太重——用户当人肉中继传需求、等供用例、验收后再传归档，跨 Agent 往返成本大于日常开发的收益。与用户对齐后确认：重的根源是载体（专门 Agent 的协作环节）而非分权结构（用例与实现隔离，防「自己出题自己答」与「改用例迁就实现」），故保结构换载体，三个减重方案全部采纳。
- **改了什么**：全局 `~/.claude/skills/dev-workflow/`：① SKILL.md 三权分立总述改写——用例定义权泛化为「出用例方」（任何上下文里没有实现代码的独立出题者：日常独立会话、重要项目可选 Hopper），实质是上下文隔离而非人格化专门 Agent；② 第 1 步开工门禁：无用例时请用户以独立会话出用例（新开会话只喂需求文本与必要背景、带 `# TEST_CASES_WRITE_OK` 标记写入 pending），并新增「用例规模与需求体量匹配」分级（小需求轻量用例组、大功能完整用例组）；③ 第 8 步收尾：归档从「Hopper 验收归档」改为「用户授权 + 开发 Agent 带标记 `git mv` pending → passed」（hook 豁免通道原已存在，本次是规矩追上工具），重要功能可选 Hopper 独立归档验收；④ references/test-cases.md：「权威源与镜像」节改写为「用例来源与权威源」（独立会话日常主通道 / Hopper 可选强化 / 用户手写三通道，Hopper 镜像规则收为子节，「同步机制」节标注为 Hopper 通道），删「过渡期口径」节（概念随独立会话转正而取消），归档节改写（授权化通道 + diff 校验标注仅适用有外部权威源的项目），hook 强度边界补「日常靠第 6 步用户实物验收兜底」；⑤ acceptance.md / merge-discipline.md 的 Hopper 指名表述改泛称。hook 脚本 `test-cases-guard.py` 本身未动（豁免标记通道已有，无需改）。镜像同步：`claude/skills/dev-workflow/` 四文件已同步覆盖，diff 验证与全局逐字节一致；`~/.pi/agent/skills/` 为硬链接自动跟随。

### 变更（超集映射表新增 Atlas → ghostty-launcher 行，2026-09-12 晚）

- **为什么改**：用户新建 ghostty-launcher（VSCode 状态栏一键唤起外部 Ghostty 终端的扩展）并交由 Atlas（FullStackEngineerAgent）管理，按「Agent 项目与子项目的 `.claude/` 超集关系」规则，新增子项目须同步全局映射表。
- **改了什么**：全局 `~/.claude/docs/agents-registry.md` 超集关系映射表 FullStackEngineerAgent（Atlas）名下新增 ghostty-launcher 行，并按全局为权威同步覆盖本项目 `claude/docs/agents-registry.md` 镜像，`diff` 核对逐字节一致。

### 变更（全局 find-skill 提及清理：skill 已删，文档与 commit skill 联动去提及）

- **为什么改**：用户已删除全局 find-skill skill（实际使用中从未用到），但全局 CLAUDE.md、capability-sync.md、new-agent-scaffold.md、commit SKILL.md 仍多处提及（含一整节 find-skill 同步规则），全部失效，2026-09-12 清理。
- **改了什么**：①全局 `~/.claude/CLAUDE.md`「团队结构参考」指针「anysearch / find-skill 副本」→「anysearch 副本」；②`capability-sync.md`：删「## find-skill skill 同步」整节，「何时读」与「小节关系」两处表述去 find-skill，敏感信息举例由 find-skill 的 `.env` / `cache/` 换为 `settings.local.json`；③`new-agent-scaffold.md`：通用 skill 举例、边界小节表述、`.gitignore` 必含清单（删「`find-skill/.env` 与 `cache/`」）去 find-skill（第 11 行历史叙述保留——陈述的是过去事实，不指向现存物）；④commit SKILL.md cache 检测举例去 find-skill。镜像同步：`claude/` 下四个对应文件已同步，diff 验证逐字节一致。各 agent 项目 CLAUDE.md 的 find-skill 提及联动清理记各自 CHANGELOG。

### 变更（全局 CLAUDE.md 三层分流重构：592→171 行，占比 14%~20%→4%~6%）

- **为什么改**：接上午的零风险瘦身（仅 -3.4%，收益不足），用户点头执行三层分流方案——红线全量在场、低频参考资料拆独立文档、触发式规则并入对应 skill，把每个会话固定占用的上下文真正压下来（红线遵守的信号噪声比同步提升）。
- **改了什么**：①新建全局 `~/.claude/docs/`（并纳入开源镜像为第三部分）：`agents-registry.md`（注册表+流水线三小组+自动维护规则+超集关系及映射表）、`new-agent-scaffold.md`（通用能力单一出口+脚手架全套+徽章规范+双语 README 同步细则）、`capability-sync.md`（底层通用能力开源+anysearch/find-skill 同步）；②全局 CLAUDE.md 重写为 171 行：红线全保留（Git 三条、敏感信息、TODO/CHANGELOG/版本纪律、工作规则压缩版），新增「团队结构参考」指针节（四类场景→对应文档）；③Logo 双条规则并入 icon-design skill（新增「五、Logo 专项规范」节）；④Windows SSH 规范细则并入 win-ai-monitor skill（「SSH 连接」节新增「操作规范」小节，全局留 3 行红线）；⑤杀 VSC / 远程窗口压缩为钩子已拦的红线短条；⑥commit skill 四处注册表引用改指 `~/.claude/docs/agents-registry.md`；⑦capability-manager skill 与本项目 `.claude/CLAUDE.md` 的「三部分」过时说法（rules 已删）修正为「skills / CLAUDE.md / docs」。镜像同步：claude/CLAUDE.md、新增 claude/docs/、icon-design / win-ai-monitor / commit 三 skill（`~/.pi/agent/skills/` 为硬链接自动跟随）。效果：估算 token 27,408~39,485 → 7,900~11,400（占 200K 窗口 13.7%~19.7% → 约 4%~6%）。
- **并行改动找回**：重写底稿取自本会话开头快照，覆盖了同日两个并行会话的未提交改动，已按 CHANGELOG 记录与 Kit 项目子项目清单精确补回——①缩写表 DTAgent = DayTradingAgent（13:47 条目）；②超集映射表 Kit → blog 行（15:36 条目）。多会话并行改同一权威文件时此风险仍在，提醒：并行会话改全局后应尽快 commit 落库。

### 变更（超集映射表新增 Kit → blog 行，2026-09-12 15:36）

- **为什么改**：用户 2026-09-12 把 blog 仓库（docsify 静态博客）交由 Kit（ExecutiveAssistantAgent）负责，按「Agent 项目与子项目的 `.claude/` 超集关系」规则，新增子项目须同步全局 CLAUDE.md 的超集关系映射表。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 超集关系映射表 ExecutiveAssistantAgent（Kit）名下新增 blog 行，并按全局为权威同步覆盖本项目 `claude/CLAUDE.md` 镜像，`diff` 核对逐字节一致。

### 变更（全局 CLAUDE.md 缩写表新增 DTAgent = DayTradingAgent，2026-09-12 13:47）

- **为什么改**：用户定义新缩写「DTAgent」代表 DayTradingAgent（Victor 的日内交易盯盘项目），持久约定需落盘到全局缩写表才可靠（否则新会话不记得）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「语言」节缩写约定段追加 DTAgent 条目（含大小写不敏感列表同步），并按全局为权威同步覆盖本项目 `claude/CLAUDE.md` 镜像，`diff` 核对逐字节一致。

### 变更（全局 CLAUDE.md 零风险瘦身：删除立规日期与修订过程叙述）

- **为什么改**：全局规则经两个多月积累已 592 行、约 2.7万~3.9 万 token（占 200K 上下文窗口 14%~19%），用户咨询是否值得瘦身，选定「零风险表述压缩」方案——只删立规日期、修订过程叙述等溯源信息，所有规则语义、边界、核心教训全部保留在场，不动任何规则的适用条件。
- **改了什么**：①35 个章节标题里的「（2026-XX-XX 用户立 / 修订 / 增补……）」历史堆叠全部删除（TODO 节标题堆叠最多，约 90 字符）；②正文内联的「（2026-XX-XX 用户修订：……）」类日期标注删除，语义并入正文；③事故叙述压缩为去日期的短句（敏感信息双事故、CC-BRIDGE 发版误判、GLM 文档优先等），教训核心全部保留；④注册表表格里的改名 / 移交 / 立规历史叙述压缩（Kit、Hopkins、Gatsby、Hopper、Prometheus 行）；⑤修复一处失效引用（`verify-before-report.md` 已随 rules 目录删除，改指本文件「工作规则」节）；⑥「临时产物存放规则」小节混入的半角标点统一为中文标点。结果：100,231 → 96,801 字节（-3.4%），估算 token 占比 13.7%~19.7% → 13.3%~19.1%。用户已知晓本次瘦身幅度有限（正文重复表述少），后续若仍需压到 200 行级别需走三层分流方案（红线在场 + 低频指针化 + 并入 skill），另行决策。本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）；`~/.pi/agent/CLAUDE.md` 为软链接自动跟随。

### 变更（全局 CLAUDE.md 新增「Logo 视觉区分：拟人实体用拟人头像，项目用项目象征 logo」）

- **为什么改**：用户裁定视觉区分原则：门面 QuantStrategistAgent 与私有本体 Intraday 重组后 logo 全同，用户区分两者定位——拟人实体给拟人头像，项目给项目象征意义的 logo（Intraday 已换 ⏱️ 项目象征 logo，见该仓 CHANGELOG），并立为全局规则。
- **改了什么**：全局 CLAUDE.md 在「Logo / 图标资产文字一律用英文」之后并列新增小节「Logo 视觉区分（2026-09-12 用户立）」：拟人实体（主仓库 / 门面）用拟人头像模板，子项目（研究本体 / 组件 / 工具）用项目象征图形（象征元素取项目主题、配色避开已用组合、副标题与 README 口径一致）；存量撞脸接触时顺手改。本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。

### 变更（全局 CLAUDE.md 新增「Logo / 图标资产文字一律用英文」）

- **为什么改**：用户在 Swing 仓库指出 logo.svg 副标题混入中文（「日K趋势跟随策略」），要求 logo 内不放中文，并立为全局规则。logo 是面向全球读者的视觉标识，中文受众已有 README_cn.md 双语通道；且 SVG 中文依赖查看环境字体回退，渲染不可控（字体缺失显示方块），英文用通用字体族在哪个环境都稳定。
- **改了什么**：全局 CLAUDE.md 新增小节「Logo / 图标资产文字一律用英文（2026-09-12 用户立）」，适用于所有项目的 logo / 图标类视觉资产文件，插入位置在「中英双语 README 内容自动同步」之后；副标题口径与 README 英文版标题对齐；既有存量按「接触一处改一处」顺手清理。本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。

### 变更（全局 CLAUDE.md：QSAgent 仓库重组体系标注）

- **为什么改**：用户启动 Markowitz 量化项目仓库重组（求职展示与资产保密分层）：私有仓库 QuantStrategistAgent 更名 **Intraday**（日内研究本体），原名让给新建公开门面仓库；Swing 策略另立公开仓库。全局规则里的缩写释义与超集映射表需随仓库重组同步，否则指向旧结构。
- **改了什么**：①缩写约定 QSAgent 释义更新为体系结构（公开门面 QuantStrategistAgent + 私有本体 Intraday + 公开组件 Swing）；②超集映射表「QuantStrategistAgent（Markowitz）」行改为「Intraday（Markowitz 量化私有本体，原名 QuantStrategistAgent）」并注重组说明。本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。同日新建本地仓库 Swing 与 QuantStrategistAgent（门面）待用户 `/commit` 发布。

### 变更（全局 CLAUDE.md 缩写约定新增 QSAgent）

- **为什么改**：用户裁定 QuantStrategistAgent（Markowitz 的量化策略项目）以后简称为「QSAgent」，方便日常沟通指代，避免每次复述全名。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（权威源）「缩写约定」新增一条：输入「**QSAgent**」即指 QuantStrategistAgent（2026-09-12 立），大小写不敏感清单同步补入（qsagent 同义）；本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。

### 变更（全局 CLAUDE.md：五条全局规则全文并入，全局级 @ 引用机制废止）

- **为什么改**：`@` 引用只有 Claude Code 会自动展开，pi / ZCode 等不解析——五条「必须遵守」级规则（SSH 远程操作、文件操作优先级、临时产物、汇报前验证、运行版隔离）在这些 agent 里只剩一句话摘要，全文是否在场全靠 agent 自觉（2026-08-24「非 CC agent 开场逐一读取全文」纪律属软约束，2026-09-12 在 pi 会话实测即被跳过，直到用户问起才补读）。用户裁定：全文并入 CLAUDE.md 本体，一处修改、所有 agent 同时生效。
- **改了什么**：① 文末「工作规则」节从 @ 引用摘要清单改写为五条规则原文全文（标题降级：`#`→`###`、`##`→`####`）；② 「rules 文件必须在 CLAUDE.md 中 @ 引用」规则条改写为「rules 文件的加载机制」——@ 引用纪律仅适用项目级，全局级新增规则直接写入 CLAUDE.md 对应章节、不放 `~/.claude/rules/`；③ `~/.claude/rules/` 五文件保留为归档、头部加归档说明（不再是加载链路的一环、不再同步维护）；④ 镜像同步：`claude/CLAUDE.md`、`claude/rules/` 覆盖后 diff 一致；⑤ 顺带对齐存量分叉——win-ai-monitor SKILL.md 镜像落后全局 2026-09-04 版（桌面代理机制停用改写），以全局覆盖镜像，并删除镜像侧残留的旧部署脚本 `scripts/`（全局侧 2026-09-04 已清除、镜像当时漏删），skills 两边现仅余 endpoints.json 与 local/config.md 两处本机数据预期差异。

### 变更（全局 rules/ 目录整体删除：并入后的收尾清零）

- **为什么改**：五条全局规则已全文并入 CLAUDE.md「工作规则」节（见上一条），`~/.claude/rules/` 目录在加载链路上零依赖，且历史版本已由本仓库 git 历史完整留痕，本机归档副本属第三份冗余；用户裁定一并删除并清理全部引用表述。
- **改了什么**：① 删除全局 `~/.claude/rules/`（五文件）与镜像 `claude/rules/` 目录（git 历史保留全部版本可回溯）；② 全局 CLAUDE.md 十处表述更新——「底层通用能力开源」节从三部分改为两部分（skills / CLAUDE.md）、「rules 文件的加载机制」与「工作规则」节的「保留为归档」改为「已删除（历史见 git 历史）」、注册表 Prometheus 行同步、「临时产物存放规则」内两个指向已删文件的 file:// 交叉链接改为同文档指代；③ 更新 8 个存量项目 CLAUDE.md 里「见全局 ~/.claude/rules/」类指路为「见全局 ~/.claude/CLAUDE.md『工作规则』节」（AgentCortex、ApplyOptimizerAgent、CommunityManagerAgent、ExecutiveAssistantAgent、TestEngineerAgent、gridtrader、Intraday、QuantStrategistAgent；后三者的「权威源见 .claude/rules/」同步改为「claude/CLAUDE.md」）；④ 核验：全局与镜像两部分（skills / CLAUDE.md）逐字节一致，pi 软链接自动跟随，各 CLAUDE.md 中 `~/.claude/rules` 引用清零。项目侧改动在各项目仓库待用户自行提交。

## 2026-09-09

### 变更（commit skill：功能分支撤 PR 链，对齐 dev-workflow 2026-09-07 无 PR 无 CI 版）

- **为什么改**：2026-09-09 在 zcode-cli 功能分支上 `/commit` 时仍自动创建了 PR——commit skill 第 8 步的功能分支逻辑停留在 2026-09-06 版「功能分支自动走 PR 链（push → 建 PR → 等 CI 绿 → squash 合并）」，而 dev-workflow 已于 2026-09-07 改版为「全程本地、无 PR 无 CI」（合并回 main 是用户验收后本地超集校验 + 快进合并），两个 skill 脱节，commit skill 照旧走了已废止的 PR 链。误建的 PR（xhqing/zcode-cli#3）已关闭。用户裁定：功能分支上 `/commit` 到「commit + push 分支」即止，不建 PR、不等 CI、不合并。
- **改了什么**：commit skill（SKILL.md）共 6 处——frontmatter description 功能分支段改为「commit → push 分支本身即止，不建 PR、不等 CI、不合并」；第 0 步功能分支括注同步；第 7 步「功能分支 PR 链场景」措辞改「功能分支推送场景」；第 8 步整段重写（标题改「执行推送」，功能分支子流程从三步 PR 链改为「只推送分支本身——远端分支仅作备份，合并回 main 属 dev-workflow 第 7 步，存量仓库 ci.yml 保留不动」）；「注意」段同步；「汇报」段改「功能分支场景加报分支推送结果 + /release 前确认功能分支已合并回 main + 下次 /commit 继续推送同一分支」。全局 `~/.claude/skills/commit/`（与 `~/.zcode/skills/commit/` 为同一文件）改毕，本项目 `claude/skills/commit/` 镜像同步（diff 一致）。教训：dev-workflow 2026-09-07 改版撤 PR/CI 时未同步排查引用它的 skill——被其它 skill 引用的流程改版时，须排查交叉引用方同步修订。

### 变更（commit skill 镜像：敏感行为记录段对齐全局脱敏版）

- **为什么改**：同步 commit skill 时发现本项目 `claude/skills/commit/` 镜像第 36-49 行仍是旧版——敏感行为记录段含代理服务商与拒单报文的**字面词**（服务商名、节点代号、报文错误码原文），而全局权威源早已改为中性释义（不写字面词）；镜像落后于全局脱敏修订，属「敏感信息禁止写入未被 .gitignore 忽略的文件」的存量违规（历史 commit 中的旧字面词无法通过本次覆盖清除，如需彻底清除须重写历史，由用户另行决定）。
- **改了什么**：随上一条 commit skill 修订同步，以全局权威版整体覆盖本项目 `claude/skills/commit/SKILL.md`（PR 链修订与脱敏对齐同一次 cp 完成），diff 一致。

## 2026-09-08

### 变更（项目迁移收尾：capability-manager skill 内路径更新）

- **为什么改**：本项目现址在 `~/Developer/CapabilityManagerAgent`（`~/Documents/Projects/` 旧址已弃用，2026-09-08 迁移收尾时发现 skill 的 `$AUTH` 定义、diff / 循环脚本里仍指旧路径），避免按 skill 操作时访问不存在的位置。
- **改了什么**：`.claude/skills/capability-manager/` 下 SKILL.md + references 三篇（sync-flow.md、registry-and-scaffolding.md、content-lifecycle.md）共 17 处 `~/Documents/Projects` / `$AUTH` 路径更新为 `~/Developer`；skill 为本项目专属（不入全局 ↔ 镜像同步体系），不涉及 `claude/` 三部分镜像。

### 变更（注册表：Kit 定位多面手，找单找岗整体移交 Hopkins）

- **为什么改**：用户 2026-09-08 口径调整——Kit（总经理助理）定位为第一助理、团队多面手，不再强调找单找岗；找单接活找工作整体移交 Hopkins 专门负责。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（即 `~/.zcode/AGENTS.md` 软链接源）三处——注册表 Kit 行职责改为多面手（附 2026-09-08 移交注记）、Hopkins 行职责扩为「工作接单全链路（找单找岗、投递、转化一条龙，原由 Kit 发起的找单找岗动作并入）」、销售流水线段落 Kit 分工描述同步；本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。Kit 项目侧同步见 ExecutiveAssistantAgent CHANGELOG。

### 变更（超集映射表：Kit 新增子项目 CyberRipple）

- **为什么改**：用户 2026-09-08 把 CyberRipple 仓库（组织总览 README 中英双语）交由 Kit 负责，按超集规则须在全局映射表登记。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（即 `~/.zcode/AGENTS.md` 软链接源）超集关系映射表新增一行「ExecutiveAssistantAgent（Kit） → CyberRipple（组织总览仓库；远程仓库待建）」；本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。子项目侧落地与标配补齐记 ExecutiveAssistantAgent CHANGELOG。

### 变更（团队注册表：Justin 定位纯法务直属——「财务与法务」残留括注清理）

- **为什么改**：用户 2026-09-08 二次明确口径——Justin 现在的定位是纯法务（职称「法务Agent」、项目名 `LegalAgent`、直属用户不属任何小组），财务职能暂时空缺；注册表 Justin 行行尾「（财务与法务，跨组服务全部小组）」括注与新口径矛盾，属前次精简三小组时的中间态残留。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（即 `~/.zcode/AGENTS.md` 软链接源）Justin 行括注改为「（纯法务，跨组服务全部小组；财务职能暂时空缺）」；本项目 `claude/CLAUDE.md` 镜像同步（diff 一致）。同轮连带（Hopkins 会话）：xhqing README 双语 Justin 两处括注同步清理、CyberRipple org README 双语链接统一为 `LegalAgent`（GitHub 仓库尚未创建，立项待办见 ApplyOptimizerAgent TODO T12）。

### 变更（release / bump skill：安装链接固定 tag 形式，禁用 latest/download）

- **为什么改**：用户发现已发布 Release 的 notes 与 zcode-cli 三版 README 里安装命令用 `releases/latest/download/<带版本号资产名>.tgz` 形式——latest 指针随每次发布移动、资产名带版本号，版本一更新历史链接必然 404（zcode-cli 曾以「发版前预对齐」勉强维持，CHANGELOG 记录过两轮忘记执行导致 README 链接长期 404）。用户 2026-09-08 裁定弃用 latest 形式，改固定 tag URL（`releases/download/<tag>/<asset>`，永指该版本资产、历史链接不失效）。
- **改了什么**：① release skill（`~/.claude/skills/release/SKILL.md`）新增「安装链接：固定 tag 形式，禁用 latest/download」规范节——notes / README 安装链接一律固定 tag 形式、翻译改写 notes 时遇到存量 latest 链接顺手改、发布中发现项目 README 存量 latest 链接在汇报中列出建议随下次 bump 修（不当场改文件，保持发布原子性）；「注意」段未动（规范节自足）。② bump skill（`~/.claude/skills/bump/SKILL.md`）版本对齐范围调整——README 对齐项原排除「安装命令示例」，现改为：固定 tag URL 的安装命令版本号（tag 段与资产名）一并同步、遇到 latest/download 存量顺手改为固定 tag 形式（与 release skill 规范互指）。③ 本项目 `claude/skills/release/`、`claude/skills/bump/` 镜像同步（diff 验证逐字节一致）。zcode-cli 侧配套（README 9 处 + RELEASING.md 口径 + Release notes 存量）记 zcode-cli 自己的 CHANGELOG。

### 变更（团队注册表：投资与交易小组联动口径更新——删除 Markowitz→Victor 信号供给关系）

- **为什么改**：用户 2026-09-08 明确「量化策略师和日内交易员之间没有『标定信号』联系，这个定位过时了」——注册表与小组段里的「产量化信号给 Victor 当加权投票员 / 当加权输入」为旧口径，须删；两人在小组内的职责改为并列陈述（Markowitz 量化策略研发与回测标定，Victor 日内盯盘发信号）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（即 `~/.zcode/AGENTS.md` 软链接源）两处——注册表 Markowitz 行职责描述去掉「→ 产量化信号给 Victor 当加权投票员」、五小组段「投资与交易小组」括注改为并列职责表述；本项目 `claude/CLAUDE.md` 镜像同步（diff 验证与全局逐字节一致）。触发场景：CyberRipple org README 架构图绘制时用户纠正（Hopkins 会话执行）。

### 变更（dev-workflow 大转向重写为本地门禁版：镜像同步 + CodeBuddy 分发补齐）

- **为什么改**：2026-09-07 晚用户对开发工作流大转向定稿并拍板两轮口径（7 项 + 4 项）——远端 GitHub PR / CI 门禁整体取消（各仓库存量 `ci.yml` 保留不动、不再新增），裁决全部本地化：开工门禁（main 上须有 pending 需求组）+ 机器门禁（本地全量测试：passed 全绿 + 本次组全绿、其它组不阻塞）+ 人工门禁（用户装测试版安装包按 requirement.md 验收）+ 超集硬校验快进合并 + Hopper 归档验收。ZCode 侧 `~/.zcode/skills/dev-workflow/` 当晚整篇重写（SKILL.md 130 行九步骨架 + 三个 references：test-cases / merge-discipline / acceptance；旧 `references/ci-templates.md` 删除）；配套「测试用例目录只读」四端 hook（`~/.claude/hooks/test-cases-guard.py`，CC / ZCode / CodeBuddy / Trae 挂载，授权标记 `# TEST_CASES_WRITE_OK`）。全局权威源 `~/.claude/skills/dev-workflow/` 已是新版（与 ZCode 逐字节一致），但本项目 `claude/` 镜像仍停留在 2026-09-07 白天的 PR + CI 纪律制版本、CodeBuddy 端缺失——本轮补齐。
- **改了什么**：① `claude/skills/dev-workflow/` 从全局权威源 rsync 同步（含删除旧版 `references/ci-templates.md`），diff 逐字节验证一致；② `~/.codebuddy/skills/dev-workflow` 按该端软链惯例（既有 9 个 skill 同模式）建软链指向权威源；③ TestEngineerAgent（Hopper）角色文件 `CLAUDE.md` 同步对齐新流程（用例生产线 + 本地门禁裁决权 + hook 授权标记写入通道），变更记录记该项目自己的 CHANGELOG。
- **分发格局澄清（用户两次指正后实测定稿）**：权威源唯一在 `~/.claude/skills/dev-workflow`。ZCode（09-06 起即软链）与 CodeBuddy 为**条目级软链**指向权威源；**Trae CN 为 skills 目录级软链**（`~/.trae-cn/skills` → `~/.claude/skills`，inode 实证同一目录）——2026-09-07 晚经 ZCode 路径的重写实际直接落在权威源上，CC / ZCode / CodeBuddy / Trae 四端全部零维护、改权威源即生效。**唯一需要改动后手动同步的实体副本是本项目 `claude/` 开源镜像**（镜像实体进 git，体系使然）。

## 2026-09-07

### 变更（新增全局 skill：scroll-reverser——Mac 滚动方向工具 Scroll Reverser 的使用、配置与失灵修复）

- **为什么改**：用户 2026-09-07 交办——本机长期用 Scroll Reverser（Pilotmoon，开源）反转触控板滚动方向，偶发失灵（方向变回系统默认），要求把使用 / 配置 / 排障方法沉淀为全局 skill 供全部 agent 掌握，失灵时直接排查修复、无需现查。
- **改了什么**：
  - 新建 `~/.claude/skills/scroll-reverser/`（权威源）：`SKILL.md`（116 行，失灵六步分级修复流程 + 配置键速查 + 常见坑；description 229 字符，远低于 ZCode 1024 上限）；`references/guide.md`（完整参考：CGEventTap 工作原理、权限与官方重授权流程、安装 / 升级 / 卸载、全部偏好键与默认值、已知问题表——唤醒失灵自愈机制（ReleaseNotes v1.7.3）、外接屏需彻底重启（issue #132）、macOS 26 时好时坏（issue #200）、手势界面不可反转（#184）、AppleScript enabled 接口）；`local/`（本机数据，config.md 存本机应然配置快照与一键恢复命令块，按「Skill 内容纯净性」不进镜像，仅 README.md 入库）。
  - `~/.zcode/skills/scroll-reverser` 软链至权威源（ZCode 全局可用，与既有 20 个 skill 同模式）。
  - 镜像 `claude/skills/scroll-reverser/` 同步（SKILL.md + references/ + local/README.md，diff 逐字节验证一致；local/config.md 排除）；`.gitignore` 补 `claude/skills/scroll-reverser/local/*` + `!README.md` 排除规则。
  - **调研依据**：官方站点（版本 / 系统要求 / FAQ 重授权流程 / brew cask 安装）+ 源码键名实证（clone 仓库读 `AppDelegate.m` registerDefaults 与 `MouseTap.m` 反转逻辑链、sdef AppleScript 词典）+ GitHub issues（#132 / #195 / #200 / #92 / #184 / #38 / #165）+ 本机实测（AppleScript get enabled 通道打通、plist / 登录项 / 安装位置核查；发现本机装在桌面 iCloud 目录，已作为迁移建议记入 local/config.md）。

### 变更（main push 政策放宽：dev-workflow / commit / bump / release 四 skill 修订 + 镜像同步）

- **为什么改**：用户 2026-09-07 裁定三项——① **main push 不做限制**：受保护 main 挡住了一切直接 push（本地 main 领先想直推被拒、合并后本地 main 需绕路 reset 对齐），代价大于收益；② **普通文件处理修改不走 dev-workflow**：文档、版本号 bump、配置等不新增测试用例、不碰核心功能的杂事，直接在 main 上改 + commit + push；③ **只有存在测试用例的软件开发项目才走 dev-workflow**（feature 分支 + PR + CI）。推翻 2026-09-06 的「全团队统一无豁免配分支保护」与「main 仅本地提交」两项政策。
- **改了什么**：
  - **GitHub 远端**：撤除 zcode-cli 与 CapabilityManagerAgent 两个仓库的 main 分支保护（required checks `validate` + enforce_admins——全团队唯二挂保护的仓库，实测其余仓库均未保护）。撤除依据：GitHub 的 required checks 一旦配置就同时挡 merge 和直接 push、无法只挡其一；官方文档确认 auto-merge 仅对「有不满足合并要求的 PR」提供，无 required checks 的仓库 auto-merge 选项根本不出现。
  - **`skills/dev-workflow/`**：适用范围收窄为「存在测试用例的软件开发项目」（原：每个仓库必须配门禁、全团队统一无豁免）；main 不设分支保护、不限制直接 push，「CI 绿才合并」改由流程纪律保证；第 0 步门禁自检四项瘦身为两项（fork 检测 + CI workflow 存在；删分支保护配置与 auto-merge 开关检查）；第 4 步 `git publish` 别名从 `--auto`（auto-merge）改为 `gh pr checks --watch && gh pr merge --squash --delete-branch`（等 CI 完成、全绿退出码 0 才合并，红灯链自动中断）；第 5 步 strict 绿灯过期条目改为纪律建议（无强制）。`references/ci-templates.md`：job 名 `validate` 不再关联分支保护；删「纯文档仓库极简 CI 模板」段（纯文档仓库不走 dev-workflow、不配 CI），YAML 引号坑移入调整原则。
  - **`skills/commit/`**：main 分支感知从「仅本地提交模式」（2026-09-06 立）恢复为直推——`git commit && git push` 直推远程 main（普通文件修改、杂事、main 对齐走这条通道）；功能分支 PR 链第 3 步从设 auto-merge 改为 `gh pr checks --watch` 等 CI 完成绿灯 squash 合并（红灯不合并、报失败 job 与日志指引；会话不便久等时报 PR 号由用户手动收尾）；9j 版本滞后指引同步 bump 新流程；description 828 字符（< ZCode 客户端 1024 上限，实测安全）。
  - **`skills/bump/`**：流程简化为 main 直改——对齐 main → 在 main 上直接改齐版本号 → 指引 `git add` + `/commit` 直推（原：建 `chore/bump-<版本>` 分支走 PR；bump 属普通文件处理修改、不走 dev-workflow）；功能分支不碰版本号纪律不变；新增「改动只限版本号载体文件」边界。
  - **`skills/release/`**：对齐校验措辞同步（bump 走 `/commit` 直推、功能分支等 PR 合并）；删「不受 main 分支保护限制」的过时说明。
  - **镜像同步**：`claude/skills/` 补齐缺失的 dev-workflow（SKILL.md + references/）与 bump（SKILL.md），更新 commit / release 两份 SKILL.md，`diff -rq` 逐字节验证通过；`backup/endpoints/endpoints.json`（本机敏感数据）按规则不同步。
  - **待处理**：镜像 `claude/skills/win-ai-monitor/scripts/` 在全局无对应、且两侧 SKILL.md 有差异——本次未动的既有分叉，待判断方向后处理。
  - 关联：TestEngineerAgent `CLAUDE.md` 工作原则同步修订（记其自己的 CHANGELOG）。

## 2026-09-06

### 变更（commit skill description 压缩至 1024 字符以内：修复 ZCode 客户端发现不了该 skill）

- **为什么改**：2026-09-06 在 zcode-cli 会话实测定位——ZCode 官方 runtime 对 skill 的 frontmatter description 有 1024 字符硬上限（vendor/zcode.cjs 中 `desc.length > 1024` 即丢弃、错误码 `skill_description_too_long`；官方 zcode-guide 插件的 diagnosing-skills 指南明文同口径），commit skill 的 description 1126 字符超限，整个 skill 被 ZCode 加载器丢弃、Skill 工具报 `Skill not found: commit`。CC 侧不受影响（该上限是 ZCode runtime 行为）。同病待修：ef-communication（1465 字符）同样超限被丢。
- **改了什么**：`skills/commit/SKILL.md` frontmatter description 从 1126 压缩至 751 字符——保留全部语义骨架（触发词、只提交暂存区不执行 git add、main 分支仅本地提交模式、敏感扫描 + cache 检测命中即彻底终止、功能分支 PR 链 + auto-merge、push 后项目标配补齐与 `.commit-cache.md` 缓存、版本滞后与版本号一致性两个每次必查检测），去掉正文已详述的枚举细节；顺手把过期的「gh pr create --fill」表述改为「创建（标题须具体达意）」，与正文第 8 步 2026-09-06 的 PR 标题规范对齐。镜像同步：`~/.zcode/skills/commit` 为指向 `~/.claude/skills/commit` 的软链接（同一文件、天然同步）；`claude/skills/commit/SKILL.md` 已 cp 覆盖并逐字节核对，三处 description 实测均 751 < 1024。

### 变更（全局 CLAUDE.md 小组更名：任务池投标小组 → 工作接单小组）

- **为什么改**：用户 2026-09-06 拍板——小组名升级为「工作接单小组」，「任务池投标」降为小组下的接单策略之一（与招聘平台求职并列，同一条投递漏斗统一优化）；原小组名以「投标」命名整体，覆盖不了求职投递这条并行策略。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（+镜像 `claude/CLAUDE.md`，diff 验证逐字节一致）三处：① 注册表 Hopkins 行——「任务池投标小组的漏斗上游」改「工作接单小组的漏斗上游」、职责补「任务池投标与招聘平台求职同为小组下的接单策略」、隶属改「工作接单小组」；② 「销售流水线顺序」段五小组列举——小组名改「工作接单小组」，注明「任务池投标与招聘平台求职为小组下并行的接单策略——小组原名任务池投标小组，2026-09-06 更名」；③ 同段 Kit 括号改「工作接单小组的找单找岗动作由 Kit 发起」。各项目文件同步记各自 CHANGELOG。

### 变更（全局 CLAUDE.md 注册表 Hopkins 行更名：BidOptimizerAgent → ApplyOptimizerAgent）

- **为什么改**：电鸭平台岗位多为全职岗、有详细 JD、沟通需发简历——与 BOSS直聘求职同构，「投单」与「找工作」合流为同一条投递漏斗（用户 2026-09-06 拍板），原名的 Bid（投标）覆盖不了投简历找岗位。项目更名 ApplyOptimizerAgent、Title 改「投递转化率优化师」，职责描述同步扩展；拟人名 Hopkins 保留（科学广告方法论——简历即自我广告、话术即文案、漏斗归因即本行——与投递优化同构，更名后更贴切）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（+镜像 `claude/CLAUDE.md`，diff 验证逐字节一致）注册表 Hopkins 行——项目名、Title、职责描述三处更新（投递材料工程、漏斗含沟通 / 面试 / offer 环节、渠道清单纳入电鸭 + BOSS直聘），注明更名背景与日期。项目本体与各项目引用同步细节记 ApplyOptimizerAgent / xhqing 等各自 CHANGELOG。

### 变更（全局 CLAUDE.md 注册表新增 Hopper / TestEngineerAgent 行）

- **为什么改**：用户新建软件测试 Agent TestEngineerAgent（Hopper，软件测试工程师，2026-09-06 立项）——因团队软件项目反复出现回归（「改 A 坏 B」），按「新建带拟人名的 Agent 时自动维护注册表（免确认）」规矩，注册表追加新成员行、基础设施小组成员清单同步更新。
- **改了什么**：全局 `~/.claude/CLAUDE.md`（+镜像 `claude/CLAUDE.md`，diff 验证逐字节一致）两处：① 注册表表格加 Hopper 行（职责：需求转验收用例 / 存量补网 / 用例库与 CI 维护 / 验收判定，三权分立设计，隶属基础设施小组）；② 「销售流水线顺序」段基础设施小组成员清单末尾补 Hopper 一句。项目本体与关联同步细节记 TestEngineerAgent / xhqing 各自的 CHANGELOG。

### 变更（backup skill 开源化重构：Skill 内容纯净性规则首次落地 + 全局 CLAUDE.md 新增该规则）

- **为什么改**：用户 2026-09-06 立规则——**skill 核心功能文件必须可开源**（不含对 clone 者来说莫名其妙或无用的内容），**私人信息一律像凭证一样存放在用户级目录下被忽略的子目录中**。backup skill 自查发现三类私人信息散布在功能文件：云端根文件夹标识与命名（references/feishu.md、scripts/backup.sh 硬编码常量）、本机代理细节（references/feishu.md）、个人规则署名出处与事件叙述（SKILL.md / feishu.md / backup.sh 注释多处「用户 2026-09-0X 立」）。
- **改了什么**：
  - **全局 `~/.claude/CLAUDE.md`**（+镜像 `claude/CLAUDE.md`）：skill-creator 节后新增「Skill 内容纯净性：核心可开源 + 私人信息用户级存放」节——功能文件可开源标准、私人信息定义（token / folder 标识、个人命名、机器环境细节、署名出处、事件叙述）、存放模式（与凭证同模式进 skill 的本机数据子目录）、配置值进注册表、通用坑保留、新建即遵守 + 既有顺手清理。
  - **`skills/backup/`**：
    - `endpoints/endpoints.json`（本机数据，不进镜像）：新增私有字段 `root_folder_name` / `root_folder_token`（云端根备份文件夹）、`notes`（本机网络环境细节）；
    - `scripts/backup.sh`：删除硬编码的根文件夹 token 常量，改为从注册表按端点类型读取（缺失时报错提示注册）；`upload_one_feishu` 对 `.md` 文件自动走 `docs +create` 转飞书文档（docx）上传（标题 = 文件名去扩展名），与端点落位约定一致；注释去个人署名；
    - `references/feishu.md`：重写为通用版——私有值改占位符并指向注册表，保留全部通用机制（目录布局、认证、四坑、MD→docx 转换流程与三坑、查看恢复）；
    - `SKILL.md`：description 与正文的个人配置当前值改为「见注册表」、个人署名出处与事件叙述删除、凭证纪律节扩展为「凭证 + 本机私有数据同纪律」；
    - `endpoints/README.md`：字段说明补私有字段（root_folder_* / notes），写明「功能文件纯净 + 私有值进本目录」设计原则。
  - **验证**：`bash -n` 语法通过；注册表 token 读取正常；功能文件（SKILL.md / references / scripts / README）私人信息扫描清零；临时项目端到端实测——脚本从注册表读 token 建云端文件夹、`.md` 实际转为 docx（type=docx、标题与内容抽验通过），测试产物已全部清理。
  - **镜像同步**：`claude/skills/backup/`（SKILL.md / README.md / references / scripts / endpoints/README.md）与 `claude/CLAUDE.md` 已 cp 覆盖，md5 逐一核对一致；`endpoints/endpoints.json` 为本机数据按 gitignore 规则不入镜像。

### 变更（新增 CI workflow + main 分支保护：dev-workflow 门禁引导）

- **为什么改**：新建分支触发 dev-workflow 门禁自检，发现仓库缺三项门禁——无 CI workflow、main 无分支保护、auto-merge 未开；「main 必须永远绿」需要 PR 触发的 CI + required check 把「改 A 坏 B」的红灯拦在合并进 main 之前。
- **改了什么**：① 新增 `.github/workflows/ci.yml`（纯文档仓库极简模板：push main / pull_request / workflow_dispatch 三触发，`validate` job 秒级空验证，checkout 不保留凭证）；② main 配分支保护——required check `validate`（strict 模式）+ enforce_admins + 禁 force push 与删除，改动一律经 PR 合并；③ 仓库打开 allow_auto_merge（`gh pr merge --auto` 自动合并链的前提）。全程经 GitHub API 配置（gh token 补 workflow scope 后写入 workflow 文件）。

### 变更（commit skill：main 分支由「彻底终止」修订为「仅本地提交」，镜像同步补齐欠账）

- **为什么改**：用户 2026-09-06 修订——当日上午立的「main 分支且有提交历史 → 彻底终止」把「在 main 上只做本地提交、暂不推送」的需求也堵死了（如本地攒批改动、后续再经功能分支 + PR 进远程 main）。改为：感知到当前在 main（或 master）且有提交历史 → 不终止，敏感扫描 / cache 检测与 `git commit` 照常执行，但跳过全部推送动作（不 `git push`、不创建远程仓库、不建 PR、不设 auto-merge）——远程 main 仍只能经 PR + CI 门禁进入，本地 main 提交不同步远程。全新仓库无提交历史的初始提交场景维持原样（push 直推 main，新仓库无分支保护）。
- **改了什么**：全局 `~/.claude/skills/commit/SKILL.md`（权威源）多处：① description——main 感知句由「即彻底终止」改为「降级为仅本地提交模式」；② 「触发与终止规则」——「main 分支终止」条目改为「main 分支降级为仅本地提交」，「命中即彻底终止」的列举去掉 main 分支检测；③ 执行流程第 0 步——main 有提交历史分支由「立即彻底终止」改为「进入 main 仅本地提交模式：继续第 1-7 步、跳过第 8 步全部推送」；④ 第 7 步——补 main 模式无 push 可串联、单独执行 `git commit`；⑤ 第 8 步——开头加总闸「main 仅本地提交模式跳过本步全部动作（含 `gh repo create`——其自带推送、与不推送矛盾）」；⑥ 第 9 步——补 main 模式同样进入本步：本地检测项照常、push 依赖项（9c / 9j）自然跳过；⑦ 9j 前置示例补「push 未成功（含 main 仅本地提交模式未推送）」；⑧ 「核心定位」与「注意」段的 && 串联条目各补 main 例外；⑨ 汇报段——删「因 main 分支检测终止」分支，加「main 仅本地提交模式加报：仅本地未推送 + 本地领先 origin/main 提交数 + 后续出路」。
- **镜像同步**：`claude/skills/commit/SKILL.md` 随本次 cp 对齐全局，diff 验证逐字节一致——该镜像此前已落后全局一轮（缺当日上午的 main 分支感知、PR 链、9j 提示制、`>> git status` 命令标记等改动），本次一并补齐；ZCode 客户端用户级路径 `~/.zcode/skills/commit/SKILL.md` 与全局为硬链接（同 inode），天然同步。

## 2026-09-05

### 变更（commit skill 汇报收尾新增 git status 原样输出）

- **为什么改**：用户 2026-09-05 要求——commit skill 处理完到最后汇报时，最后一件事应执行 `git status`，并把命令输出**原样**以代码块方式直接输出，让用户在每次 `/commit` 结束时直接看到工作区与暂存区的真实状态（尤其第 9 步补标配会产生新的未提交工作区改动、终止情形下暂存区还有待处理内容），不必再自己跑一遍命令。
- **改了什么**：`skills/commit/SKILL.md` 两处协同——① 「执行流程」在原第 9 步（项目标配检测）之后新增**第 10 步**：进入汇报时作为汇报的最后一件事执行一次 `git status`，输出原样以代码块直接输出（不加工、不总结、不截断、不做额外解读），并明确**无论流程完整走完还是中途终止（敏感内容扫描 / cache 检测命中），汇报都以该代码块收尾**；② 「汇报」节末尾追加对应的收尾要求，与第 10 步互相指代。三副本同步：全局 `~/.claude/skills/commit/`（权威，直接编辑）→ `~/.zcode/skills/commit/`（符号链接指向全局、自动一致）→ 本项目 `claude/skills/commit/` 镜像（cp 覆盖后 diff 核对，逐字节一致）。

## 2026-09-04

### 变更（公开文件脱敏整改：隐私类别词本身即敏感信息，全链路清零）

- **为什么改**：用户 2026-09-04 二次纠正——**隐私类别名（如具体个人事务类目词）本身就是私人敏感信息**：公开仓库读者看到类别词即可推断仓库主的私人情况。首版 TODO 分流条文与变更记录自己点名了类别，属「一边立规矩一边泄密」的同源泄露；顺藤排查发现同一条公开管线（全局 CLAUDE.md → CMA 镜像 → 各项目公开文件）的存量条目里也有类别词残留。
- **改了什么**（2026-09-04 21:18-22:00）：
  - **全局 `~/.claude/CLAUDE.md` + 镜像 `claude/CLAUDE.md`**：TODO 分流条文的类别举例改为中性表述「个人隐私类待办」，并新增「条文与指引本身一律中性、不点明具体隐私类别——类别名本身即敏感信息」的明文要求。
  - **本仓 CHANGELOG.md 存量 4 处**（backup / md2pdf 历史条目）与**当日新增条目**：类别词全部改为「个人文档 PDF」「含个人身份的敏感文件名」等中性表述。
  - **skills/md2pdf**（SKILL.md description 1 处 + references/pitfalls.md 2 处）：触发词清单与案例来源表述去类别词，全局权威副本与镜像同步（diff 一致）。
  - **skills/agent-reach**（SKILL.md description 1 处）：平台触发词清单去 1 个类别词、保留平台名（触发语义不受影响），镜像同步。
  - **关联项目同步整改**（各记其本地记录）：ProductStrategistAgent hot-trend skill 1 处痛点类目词改中性（该文件已进其 git 历史、历史清洗待用户决策）；BidOptimizerAgent TODO-archive 3 处（提案形态表述、盯盘时间约束、电量玩法表述）改中性（同已进历史）。
  - **验证**：本机全部仓库（Developer/ 下 16 个 + xhqing）公开文件扫描（已跟踪 + 未跟踪、排除 gitignore 目录）类别词清零；两仓 git 历史 `git log -S` 扫描确认敏感词均未进历史（CMA 的全部改动、ExecutiveAssistantAgent 的 TODO 均为未提交状态，改文件即彻底解决，无需重写历史）；已进历史的仅 PSA hot-trend 1 处与 BidOptimizerAgent TODO-archive 3 处（详见下条风险报告）。

### 变更（TODO 管理规则增补：个人隐私类待办分流 local 版文件）

- **为什么改**：用户 2026-09-04 指出，个人隐私类内容不得放在公开版 `TODO.md` / `TODO-archive.md`（会被 git 跟踪、随开源仓库公开），应放相应的 local 版文件（如 `TODO.local.md`）。当日 ExecutiveAssistantAgent 的公开版 TODO 里挂着一批个人隐私类全流程待办，属应分流存量——趁两文件尚 untracked（未进 git 历史）及时移走。同日用户二次纠正：**隐私类别名本身即敏感信息**（公开文件里出现类别词，读者即可推断仓库主的私人情况），首版条文与变更记录自己点名了类别、属同源泄露，本条目与全局条文均已改为中性表述。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 「待办（TODO）管理」节三处修订并同步镜像 `claude/CLAUDE.md`（diff 一致）——① 标题日期补「2026-09-04 增补个人隐私类待办分流至 local 版文件」；② 「文件结构」新增「个人隐私类待办分流 local 版」条目：`TODO.local.md`（活跃）+ `TODO-archive.local.md`（归档）加入 `.gitignore`、格式与编号与公开版一致、编号共用同一套空间、公开版头部加分流指引（指引措辞与条文本身一律中性、不点明具体隐私类别——类别名本身即信息）；③ 「编号在项目内全局递增」补「取最大值时 local 版两文件同样要扫」；「边界」补隐私类待办整体分流的指路。存量分流落地（记 ExecutiveAssistantAgent 本地记录）：T1 / T1.5 / T2 / T3 四条移入该项目 `TODO.local.md` / `TODO-archive.local.md`，`.gitignore` 加两行忽略、公开版两文件清空并留中性指引。

### 变更（backup skill 增补备份目录准入纪律：只收用户点名文件 + 副本冗余不移动）

- **为什么改**：用户 2026-09-04 指出 `backup/` 目录存放内容的严格要求——① 只有用户主动点名要备份的文件才放进来：agent 不得自作主张放入，点名之外的文件进备份目录 = 被上传云端，等于替用户决定了什么该上云；② backup/ 里的文件必须是冗余副本、原文件留在原位置（完整多端模型 = 本地原文件 + backup/ 副本 + 云端各一份）——skill 原文写的「移动进去」会把原位置掏空、让 backup/ 持有孤本，与多端冗余的动机相悖。当日实盘教训：三份被点名「只备份到飞书」的文件被放在 backup/ 根下（= 会备份到全部端点）、一份从未被点名备份的工作手册被顺手放进 backup/，两处均不符合要求，随本条规则一并整改（两项目的 backup/ 整改明细各记其本地记录，不在本条展开）。
- **改了什么**：`SKILL.md`——① description 补「只收用户明确点名要备份的文件，复制副本进目录、原文件留原位置」；② 「备份范围」节重写三条 bullet：新增「只收用户明确点名的文件」「backup/ 里放副本，原文件留在原地」（复制不移动，原文件日后更新则重新复制覆盖副本），固定路径配置文件用符号链接的理由更新为「自动跟随原件更新、不像副本会过期，原件在场冗余天然成立」；③ 动作①「放入备份目录」第 2 步从「移动」改为「复制」，点名端点的文件明确「放进 `backup/<端点名>/`、不放根下——放根下 = 备份到全部端点」，第 4 步取消备份措辞同步（移出删除副本、原文件不受影响），步骤后补一行「没被点名过的文件不进 backup/，agent 认为值得备份时先建议」；④ 「通用纪律」新增第 5 条「放入前自检两问」（是否用户点名 / 本地原文件是否仍在原位置，发现孤本先补回原位置再放入）。`README.md`——「统一的备份范围」bullet 同步补「只收用户明确点名的文件——复制副本进目录、原文件留原位置，backup/ 永不持有孤本」。三副本同步：全局 `~/.claude/skills/backup/`（权威，直接编辑）→ `~/.zcode/skills/backup/`（符号链接指向全局、自动一致）→ 本项目 `claude/skills/backup/` 镜像（cp 覆盖后 diff 核对，唯一差异为机器本地的 `endpoints/endpoints.json`，属既定例外）。

## 2026-09-03

### 变更（脚手架规则修订：新建项目不建 `.claude/` 目录——`CLAUDE.md` 直接放项目根 + 项目根 `AGENTS.md` 软链接指向它）

- **为什么改**：用户 2026-09-03 修正全局脚手架规则——旧规定对 `CLAUDE.md` 的位置没有明说放项目根、容易被放进 `.claude/` 下，且要求新建项目照建 `.claude/settings.json` / `settings.local.json` / `settings.local.example.json` 等项目级配置；用户裁定这些一律不要，新建项目**不建 `.claude/` 目录**。同时新加一条：建项目根 `CLAUDE.md` 的同时，在项目根建一条 `AGENTS.md` 软链接指向 `CLAUDE.md`（兼容只认 `AGENTS.md` 的 agent 工具；当日已在 BidOptimizerAgent 按新制落地验证）。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 三处修订并同步镜像 `claude/CLAUDE.md`（diff 一致）——①「新建 Agent 项目的脚手架与开源约定」：原「不复制通用能力」条改写为「不建 `.claude/` 目录」（旧规定要求照建的 `.claude/` 下文件一律不要，项目根只建 `LICENSE.md` 等根目录文件）；「角色化 `CLAUDE.md`」条明确「直接放项目根目录」，并新增「建项目根 `CLAUDE.md` 的同时在项目根建软链接 `AGENTS.md`（`ln -s CLAUDE.md AGENTS.md`，内容天然同步）」。②「通用能力开源单一出口」：开头句与「怎么用」条同步改为「新建项目一律不建 `.claude/` 目录」，既有仍带 `.claude/` 的项目照旧维护。

## 2026-09-02

### 变更（backup 飞书端点改原文件直传 + 格式白名单：mode / file_formats 端点级配置）

- **为什么改**：用户 2026-09-02 两步指示——先要求把三份个人文档 PDF「备份原文件、不要压缩」手动直传飞书（实测云端可直接预览、无需下载解压），随即立规：**以后备份到飞书都以用户指定的文件格式备份，维护一份格式白名单，目前只允许 `['*.pdf','*.md']`**。tar.gz 打包形态对飞书端点废除，改为原文件直传 + 白名单过滤。
- **改了什么**：
  - **注册表新字段（机制通用化）**：每端点可配 `mode`（`raw` 原文件直传 / `archive` 打包 tar.gz，缺省 archive）与 `file_formats`（glob 白名单数组，大小写敏感，raw 模式生效）——feishu 条目设 `mode: "raw"` + `file_formats: ["*.pdf", "*.md"]`；将来任何端点（含 rclone）都可用同字段配置，维护白名单 = 改注册表数组、即时生效。
  - **脚本双模式**：`run_raw_backup`（raw）逐文件直传、云端按 `backup/` 内相对路径镜像建文件夹（含端点专属子目录、归档子目录），白名单不匹配逐条 `[SKIP]` 并汇总（uploaded / skipped / failed），符号链接 `cp -L` 解引用后以链接名上传；`run_archive_backup`（archive）保留原打包逻辑。飞书云端文件夹逐级复用 / 创建（bash 3.2 无关联数组，用「最近路径 + token」缓存），`--list` 增加端点模式与白名单提示行。新坑沉淀：lark-cli list 的 size 字段上传后可能为空、验证完整性须实际下载对比字节数。
  - **文档**：SKILL.md（description 增「备份格式白名单」触发词与 raw/archive 机制、端点体系节新增「备份模式与格式白名单」、动作②打包规则改写）、references/feishu.md（云端布局改为镜像相对路径、恢复方式、白名单维护、size=0 坑）、references/new-endpoint.md（登记字段补 mode / file_formats）、README.md（端点级备份形态条目）同步更新；镜像同步（diff 一致）。
  - **实测**：`--list` 显示 mode=raw 与白名单提示 ✅；真实备份三份 PDF 原文件直传（`3 uploaded, 1 skipped, 0 failed`——临时 .txt 正确被 SKIP）✅；直传文件此前已实测下载逐字节一致（672,172 bytes）✅。

### 变更（backup 端点子目录：backup/ 下以端点同名子目录区分备份端点）

- **为什么改**：用户 2026-09-02 追加要求——项目根 `backup/` 下还要**通过目录区分不同的备份端点**，即「哪个文件备份到哪个端」也由目录表达，延续「目录即标签」哲学（放进 backup/ = 要备份；放进哪个端点子目录 = 备份到哪端）。不同端点由此可承载不同文件集——例如某文件只想存飞书、不想进其它端。
- **改了什么**：
  - **协议**：`backup/` 一级子目录与已注册端点同名（如 `backup/feishu/`）→ 内容**只备份到该端点**；根下散文件与非端点名的普通子目录（归档目录）→ **备份到全部端点**（共享）。无清单、无额外标记，目录名即端点归属；存量平铺文件自动兼容（视为共享，无需迁移）。
  - **脚本（backup.sh 重构）**：注册表端点加载提前（`--list` 分组也需端点名）；`--list` 按「shared（to ALL endpoints）/ 各端专属（ONLY to endpoint: X）」分组展示；打包从「一次打包传全端」改为「**每目标端独立打包**」——该端包 = 共享内容 + 本端同名子目录（`tar --exclude` 排除其它端点子目录），某端无内容自动跳过；文件列表改经临时文件传递（防文件名含 `$` 时被未引号 heredoc 展开的坑）；修复 bash 3.2 + `set -e` 下循环体 `&&` 短路返回非零触发 errexit 的隐患（统一改 if 形式）；临时目录统一 WORKROOT + trap 清理（中途失败也回收）。
  - **文档**：SKILL.md（description 增「只备份到」触发词与端点子目录机制、目录制节新增端点子目录条目、动作①②同步改写）、README.md（机制概述）、references/new-endpoint.md（注册完成后的汇报加「端点子目录用法」告知）同步更新；镜像 `claude/skills/backup/` 同步（diff 一致，唯一差异仍为本机 endpoints.json）。
  - **实测**：`--list` 分组正确（3 共享 PDF + 1 飞书专属测试文件）✅；双端 `tar --exclude` 模拟验证（feishu 包含 shared + feishu/、排除 webdav/，普通子目录随全端进包）✅；真实备份全链路（4 files = 3 共享 + 1 飞书专属 → 飞书云盘）✅；测试文件与目录已清理，backup/ 恢复原状。

### 变更（feishu-backup 升级为通用多端点备份 skill：backup——飞书云盘降级为首个可插拔端点）

- **为什么改**：用户 2026-09-02 指示——AI 已渗透线上工作的方方面面、Agent 手里的权限太大（能读写文件、操作云端账户、执行删除），单端存储下一次误操作或凭证泄露就可能让重要信息被彻底删除，须以**多端备份**把该风险降到最低；而原 feishu-backup 从 skill 名到脚本到正文都与飞书强耦合，无法承载「继续注册更多备份端点」的诉求，故升级为纯粹通用的 backup skill，飞书云盘成为首个备份端点。
- **改了什么**：
  - **更名重构**：`feishu-backup` → `backup`（英文命名按「简到删无可删」：backup 一词已完整表达核心功能，多端点能力由 description 承载，对齐 commit / release 等单词命名风格）。既有修复全部保留（防回归核查通过）：目录制（backup/ 目录即备份范围，2026-09-01 立）、整目录 gitignore 脚本强制检测（2026-09-01 立）、脚本纯 ASCII 纪律、不加密裁定（2026-08-31 立）。
  - **端点注册制（新机制）**：注册表 `endpoints/endpoints.json` 登记每个已授权端点的 name / display / type / credential（凭证位置+用法）/ reference / authorized_at；首次使用某端点走授权流程（向用户拿凭证 → 最小只读操作验证 → 保存凭证 → 写使用方法并登记），之后直接凭证登录备份、不再打扰用户。凭证纪律：注册表与文档只记「凭证在哪、怎么用」，凭证本体由工具自管（lark-cli auth / rclone config）或存 `endpoints/` 下独立文件——该目录为本机数据，镜像仓库 `.gitignore` 忽略整目录内容、仅 `endpoints/README.md` 入库（对齐 find-skill/.env 先例），初始注册表含 feishu 端点（authorized_at 2026-09-02，凭证 lark-cli 自管）。
  - **两种端点类型**：`builtin-*`（专用工具对接，如 feishu 走 lark-cli，上传逻辑为脚本内分支）与 `rclone`（rclone 支持的任意远端：WebDAV / S3 / Google Drive / Dropbox / OneDrive 等，`rclone config` 配好凭证即注册成功、脚本零改动）；后续注册新端点优先 rclone 类型，判定标准与四步授权流程沉淀在 `references/new-endpoint.md`。
  - **默认全端冗余**：用户说「备份」不指定端点 = 同一备份包上传全部已注册端点（打包一次、逐端上传，单端失败不影响其它端、退出码聚合）；`--endpoint <name>` 只传指定端点。多端冗余正是本次升级的动机。
  - **脚本与文档**：`scripts/backup-project.sh` → `scripts/backup.sh`（重写为多端点入口，macOS bash 3.2 兼容——不用 mapfile 等高版本特性）；按 skill-creator 渐进披露重构——飞书专属细节（认证 / NO_PROXY 代理坑 / 相对路径坑 / 云端目录布局 / 查看恢复删除命令）从 SKILL.md 移入 `references/feishu.md`；新增 `README.md` 记录动机（AI 权限大 → 多端冗余降彻底删除风险）与结构说明。
  - **同步与接入**：镜像 `claude/skills/feishu-backup/` 删除、`claude/skills/backup/` 同步（diff 校验唯一差异为本机 endpoints.json，属敏感例外条款）；ZCode 运行时 `~/.zcode/skills/backup` 软链接接入全局权威源（原 feishu-backup 从未接入 ZCode）。
  - **全链路实测**：`bash -n` 语法 ✅；`--list` 列出三份 PDF ✅；真实备份 ✅——ExecutiveAssistantAgent 三份个人文档 PDF（1.1M）上传飞书云盘 `AI项目私有备份/ExecutiveAssistantAgent/ExecutiveAssistantAgent-backup-2026-09-02.tar.gz`，云端 list 复核包在（与 2026-09-01 包并存，项目子文件夹复用逻辑验证通过）；顺带补上 2026-09-01 遗留欠账「三 PDF 移入 backup/ 后因当日 shell 故障未实际执行备份」。

## 2026-09-01

### 变更（feishu-backup 机制重构：标签清单制 → 目录制——目录即标签）

- **为什么改**：用户连续两步纠正当日早先的标签制方案。第一步指出「标签文件名直接写进 `.gitignore`」不对——**`.gitignore` 是被 git 跟踪的公开文件，写入含个人身份的敏感文件名本身就是信息泄露**（与「敏感信息禁止写入未被 .gitignore 忽略的文件」规矩同源，载体本身会公开）；第二步进一步简化——**建一个专用目录存放待备份文件，目录下所有文件即备份范围，`.backup-tags.json` 标签清单整个不再需要**：「加入备份」= 移进目录、「取消」= 移出，目录即标签，无清单可维护、无中间状态。
- **改了什么**：① `backup-project.sh` 重构——读 `.backup-tags.json` 清单的逻辑全部移除，改为打包项目根 `backup/` 目录下全部内容；`tar -h` 解引用符号链接（固定路径不能移动的文件如 `CLAUDE.local.md` 在 `backup/` 放符号链接指向原文件，打包的是实际内容）；policy 检测简化为整目录一条 `git check-ignore backup`（未忽略终止，提示**只写目录一行、绝不写成员文件名**）；包内带 `backup/` 路径前缀，解压即还原。② SKILL.md 重写为目录制（机制说明、符号链接模式、坑清单第 8 条改为整目录忽略 + 文件名泄露教训）。③ 镜像 `claude/skills/feishu-backup/` 同步。存量迁移：ExecutiveAssistantAgent 落地中（.gitignore 已加 `backup/`，三个 PDF 移入目录待 shell 恢复）；CommunityManagerAgent 需迁移（`.backup-tags.json` 改为 `backup/` 下两个符号链接）。注：脚本重构与目录迁移因当日 shell 故障（/bin/zsh ENOENT）暂未实测，待恢复后验证。（2026-09-01）

### 变更（feishu-backup 硬规矩落地：标签文件必须 gitignore——脚本强制检测）

- **为什么改**：用户 2026-09-01 立「凡要私有备份到飞书的文件都必须加入 `.gitignore`」——备份到飞书的文件即私有文件（隐私 / 本机配置 / 个人交付物），若同时被 git 跟踪会进公开仓库，与「私有」定性矛盾、构成泄露风险。按「规矩必须配套工具强制」元规则，把检测落进备份脚本（仅靠 SKILL.md 文本约束会忘）。
- **改了什么**：① `scripts/backup-project.sh` 打包前新增 policy 检测——项目是 git 仓库时逐文件 `git check-ignore`，任一标签文件未被忽略即 `[ERR] policy violation` 列出文件并终止（exit 1），提示补 `.gitignore` 后重跑；非 git 项目自动跳过；② SKILL.md「打标签」动作新增第 4 步（确认文件本身被 `.gitignore` 忽略，没有就补上），坑清单新增第 8 条（硬规矩 + 脚本强制说明）；③ 镜像 `claude/skills/feishu-backup/` 同步（SKILL.md 与脚本同步编辑）。存量项目核查：ExecutiveAssistantAgent 三个备份标签 PDF 补入 `.gitignore`；CommunityManagerAgent 两个标签文件（CLAUDE.local.md、settings.local.json）经核查已在 `.gitignore` 中，无需改动。注：脚本新增检测因当日 shell 环境故障（/bin/zsh ENOENT）暂未实测，待环境恢复后跑一次未忽略场景验证拒绝路径。（2026-09-01）

### 新增（通用 skill：md2pdf Markdown 转 PDF 一条龙 + 像素级排版验证）

- **新建 `skills/md2pdf/`（SKILL.md + assets/default.css + scripts/md2pdf.sh + scripts/verify_pdf.swift + references/pitfalls.md），全局 `~/.claude/skills/` 落地、同步镜像到本项目 `claude/skills/md2pdf/`（diff 校验一致）；ZCode 运行时 `~/.zcode/skills/md2pdf` 以软链接指向全局权威源（对齐既有机制：`~/.zcode/skills/` 下全部 skill 自 2026-08-22 起即为软链接指向 `~/.claude/skills/`）**。**为什么**：同日在 ExecutiveAssistantAgent 排查三份中文个人文档 PDF「内容只占 A4 左半边」事故（详见该项目本地日志），实战踩出一串 md→pdf 链路的坑，用户要求沉淀为全局 skill 共享。**改了什么**：① 工具链定型 pandoc → Chrome headless 打印 → 像素级验证；② default.css 内置 pandoc 默认样式显式覆盖（`body { margin:0; max-width:none; padding:0 }`）与 A4 中文紧凑排版；③ `md2pdf.sh` 一条龙转换（内置 `<style>` 包装注入——实测 `--include-in-header` 裸插 CSS 文件不包标签、整份 CSS 静默失效；`file://` 绝对路径防错误页 PDF；bash 变量名后紧跟全角括号会被并入变量名的坑已修）；④ `verify_pdf.swift` 零依赖定量验证（MediaBox 纸张判定 + 每页墨迹左右边界百分比 + 窄栏 / 不对称 / 空页报警，判据经三组样本实测：居中窄栏 14%/84% 正确报警、A4 满宽 6.7%/93.3% 不误报）；⑤ pitfalls.md 沉淀四大坑详解（pandoc 默认窄栏、Chrome 错误页、视觉模型验证不可靠、校验截图须互异）与 CSS 定制指南。端到端实测通过：测试 MD → A4 PDF（左 6%/右 93% 满宽对称）✅，空 CSS 对照组正确抓出 Letter + 居中窄栏 ⚠️。

### 新增（通用 skill：feishu-backup 飞书云盘文件级备份）

- **标签清单从全局集中制改为项目内分散制（用户 2026-09-01 裁定，同日落地）**：清单文件从 `~/.claude/backup-tags.json`（全局一份、按项目分组）改为**各项目根 `.backup-tags.json`**（格式 `{"files":[...]}`，仅含本项目）——打开项目即见备份状态，且随项目走。配套改动：① `scripts/backup-project.sh` 改读 `<项目根>/.backup-tags.json`（云盘根文件夹 token 移入脚本常量），并因脚本曾混入不可见 Unicode 字符导致 bash 报错而全量重写为**纯 ASCII**（注释与输出一律英文，此教训已写入 SKILL.md 坑清单）；② SKILL.md「打标签」动作增加「确认项目 `.gitignore` 忽略 `.backup-tags.json`」步骤（清单本身也是私有文件）；③ CommunityManagerAgent 落地新制：项目根建 `.backup-tags.json`（含 CLAUDE.local.md 与 settings.local.json 两标签）、`.gitignore` 补忽略（git check-ignore 验证生效）、全局旧清单 `~/.claude/backup-tags.json` 删除；④ 新制 `--list` 与真实备份均实测通过（2 标签文件 → 云盘 3.8KB 包），镜像 `claude/skills/feishu-backup/` 同步（diff 一致）。

- **新建 `skills/feishu-backup/`（SKILL.md + scripts/backup-project.sh），全局 `~/.claude/skills/` 落地、同步镜像到本项目 `claude/skills/`（diff 校验一致）**。**为什么**：用户裁定所有重要文件必须有远端备份，而私有文件（`CLAUDE.local.md`、`settings.local.json`、`docs/` 运行数据等）不进 git、无法用 GitHub 备份——飞书云盘 + 官方 CLI（lark-cli v1.0.92，`~/.local/bin/`）填补这个缺口；经用户讨论裁定**不加密**（风险模型：本地丢失为真风险、云端泄露为低概率低损失，加密反而引入密钥丢失风险）。**改了什么**：① 文件级标签制——清单 `~/.claude/backup-tags.json`（跨项目、本机文件）按项目记录需备份文件的相对路径，用户口头指定打标签、备份时只打包清单内文件；② 备份脚本打包（tar 相对路径）→ 上传飞书云盘「AI项目私有备份/<项目名>/」（时间戳命名），`--list` 参数查清单不上传；③ SKILL.md 沉淀本机特有的坑：lark-cli 认证（`auth login --recommend`）、飞书域名必须 NO_PROXY 直连（本机全局代理 127.0.0.1:1087 走飞书会 TLS 握手超时）、`+upload` 只接受相对路径、`+download` 用 `--file-token`、device code 几分钟过期等。全链路已实测验证：打标签 → 打包 → 上传 → 下载 → 逐字节校验一致。初始标签：CommunityManagerAgent 的 `CLAUDE.local.md` 与 `.claude/settings.local.json`（2026-09-01 已完成首次备份）。

## 2026-08-30

### 新增（全局新增元规则「规矩必须配套工具强制」+ PreToolUse 守卫钩子——镜像同步）

- **为什么改**：2026-08-30「连接远程禁止复用窗口」规矩立后几分钟，Agent 又用 `open vscode://` URI 复用了用户窗口——证明纯文本规则（rules / skills / CLAUDE.md）在长会话中必然被遗忘。用户裁定立元规则：任何规矩指定后都要尽可能用工具（hook / settings deny / 代码）强制辅助防止忘记，仅文本记录不够。
- **改了什么**：① 新建 `~/.claude/hooks/pre-tool-use-guard.sh`（PreToolUse 钩子）——硬拦截两类违规：未带 `# AI_AUTHORIZED_KILL_VSC` 授权标记的杀 VSCode 进程命令、`open vscode://vscode-remote` 复用窗口式远程连接触发（deny + 给出正确替代命令）；② 全局 `~/.claude/settings.json` 注册该钩子（matcher: Bash）；③ 全局 CLAUDE.md 新增「规矩必须配套工具强制（2026-08-30 用户立，元规则）」节，并在「杀 VSC 进程」「连接远程禁止复用窗口」两条规矩下补「工具强制」说明；④ 本项目 `claude/CLAUDE.md` 镜像同步（diff 验证逐字节一致）。
- **同步**：全局为权威源，先落全局再镜像到本项目 `claude/`。

### 新增（全局 CLAUDE.md 新增「连接远程 VSCode Server 禁止复用当前窗口」规则——镜像同步）

- **为什么改**：2026-08-30 Alfred 会话中用 `vscode://vscode-remote/...` URI 触发 Remote-SSH 连接 win-ai，VSCode 复用了用户正在其中工作的项目窗口，远程会话顶替了用户的本地工作现场，被用户指出。远程开发会话须与用户本地工作窗口严格隔离。
- **改了什么**：① 全局 `~/.claude/CLAUDE.md` 新增「连接远程 VSCode Server 禁止复用当前窗口（2026-08-30 用户立）」节——AI 触发远程连接必须强制新窗口（命令行 `--new-window`；禁用会复用现有窗口的 `vscode://` URI 方式）；② 本项目 `claude/CLAUDE.md` 镜像同步（diff 验证逐字节一致）。
- **同步**：全局为权威源，先落全局再镜像到本项目 `claude/`。

### 新增（全局 CLAUDE.md 新增「杀 VSC 进程前必须先问」规则——镜像同步）

- **为什么改**：2026-08-30 Alfred 会话中，Agent 在修复本地 VSCode 卡顿时准备直接杀 VSCode 进程、未先征询，被用户纠正——VSCode 可能挂着未保存的窗口状态、正在跑的任务、调试会话，擅自杀进程会造成用户工作现场丢失，用户要求把杀进程的决定权留在自己手里。
- **改了什么**：① 全局 `~/.claude/CLAUDE.md` 新增「杀 VSC 进程前必须先问（2026-08-30 用户立）」节——凡杀 VSCode 进程（`pkill` / `kill` / `killall` / `osascript quit` 强制结束等一切手段）必须先 AskUserQuestion 列明进程范围与原因、授权后才执行；查询类操作（`ps`）不受限；② 本项目 `claude/CLAUDE.md` 镜像同步（diff 验证逐字节一致）。
- **同步**：全局为权威源，先落全局再镜像到本项目 `claude/`。

### 新增（全局新增规则文件 runtime-dev-isolation.md——运行版本与开发版本隔离——镜像同步）

- **为什么改**：2026-08-30 在 CC-Bridge 发现全局命令被 `npm link` 指向开发目录、glm daemon 随之运行开发源码——运行版本不可控，开发中的改动实时污染实际环境（该项目自己的 `.claude/rules/cc-bridge-install.md` 本就明令禁止，属违规操作）。用户裁定把这条禁令上升为**全局规则、适用于所有项目**：任何项目的开发代码必须走完发布流程（GitHub Release）之后才可在实际环境使用，实际用的版本必须从 Release 安装 / 更新，运行版与开发版严格隔离。
- **改了什么**：① 新建全局 `~/.claude/rules/runtime-dev-isolation.md`——核心原则（禁 npm link 及一切等价手段、禁常驻服务直跑开发源码、须从 Release 安装）、怎么用（开发期验证方式、发布后安装、自检命令、代价须知）、边界（任何项目适用、项目细则为具体指引本规则为总纲、开发目录内自测不受限）；② 全局 `~/.claude/CLAUDE.md`「工作规则（全局 rules 显式引用）」节——「四个规则文件」改「五个」、追加 `@rules/runtime-dev-isolation.md` 引用；③ 本项目 `claude/` 镜像同步（rules 文件 + CLAUDE.md，diff 验证逐字节一致、rules 目录整体一致）。
- **同步**：全局为权威源，先落全局再镜像到本项目 `claude/`。

## 2026-08-29

### 变更（全局 CLAUDE.md 超集关系映射表追加 QuantStrategistAgent → gridtrader——镜像同步）

- **为什么改**：用户指定 gridtrader（网格交易策略开发及回测工具，Python / backtrader）由 QuantStrategistAgent（Markowitz）负责维护，成为其子项目，须登记进全局「超集关系映射（完整清单，权威）」表。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 映射表追加「QuantStrategistAgent（Markowitz） | gridtrader | 网格交易策略开发及回测工具（Python / backtrader）」一行；`claude/CLAUDE.md` 镜像同步（diff 验证逐字节一致）。

## 2026-08-28

### 变更（全局 CLAUDE.md 注册表 Gatsby 行职责描述更新——社群定名并清退「互帮互助」表述——镜像同步）

- **为什么改**：CommunityManagerAgent（Gatsby）侧两轮定位校准（2026-08-27 / 08-28）——群主定名社群为「AI前沿跨界交流群」，并裁定「互帮互助」不在任何地方体现（多数群友为获取信息而来、无明确求助需求且不想被求助打扰，互助是群活跃后的自然副产品）。全局注册表 Gatsby 行的社群描述仍写「以 AI 为纽带的跨界互帮互助交流群」，与最新定位不符，每次会话加载都会把 Gatsby 的运营拉回互助框架，须同步更新。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 注册表 Gatsby 行社群描述改为「运营用户的微信社群『AI前沿跨界交流群』」；`claude/CLAUDE.md` 镜像同步（diff 验证逐字节一致）。

## 2026-08-26

### 变更（全局 CLAUDE.md 登记新子项目 zcode-vsce——镜像同步）

- **为什么改**：用户新立项 zcode-vsce（非官方 ZCode VSCode 扩展客户端，与 zcode-cli 平行的姊妹项目、同归 Atlas / FullStackEngineerAgent 负责）。按「超集关系映射（完整清单，权威）须与各 Agent 项目子项目清单一致」规则，全局 CLAUDE.md 的映射表与 Atlas 注册表行需同步登记新子项目。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 两处——① 「智能体命名注册表」Atlas 行的「主要职责」补 zcode-vsce（非官方 ZCode VSCode 扩展客户端）；② 「超集关系映射」表新增一行 `FullStackEngineerAgent（Atlas） | zcode-vsce | 非官方 ZCode VSCode 扩展客户端（与 zcode-cli 平行的姊妹项目：同一官方 runtime、app-server 协议、webview 前端）`。`claude/CLAUDE.md` 镜像 cp 同步（diff 验证逐字节一致）。同日 FullStackEngineerAgent 项目侧同步：其 `.claude/CLAUDE.md` 子项目清单与双版 README 补 zcode-vsce（源变更已记该项目 CHANGELOG）。

### 变更（全局 CLAUDE.md「敏感信息禁止写入」节增补财务状况类型——镜像同步）

- **为什么改**：2026-08-26 发现 ExecutiveAssistantAgent 的 CHANGELOG 条目写入了用户个人财务状况描述（收入目标、本金状况、财务紧迫程度、职业投入状态），随公开仓库进入 git 历史，被迫重写该仓库全部历史 + force push 才能清除。原「敏感信息禁止写入」节枚举的敏感类型（账户号、API key、token、密码、私钥、连接串等）全部是凭证类信息，没覆盖「财务状况描述」这一类型——它不是凭证、没有占位符可填，须明确「整体不写」的处理方式，堵住规则缺口（2026-08-26 用户立）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「敏感信息禁止写入未被 .gitignore 忽略的文件」节三处——① 标题日期标注增补「2026-08-26 增补财务状况」；② 敏感信息枚举加入「个人 / 公司 / 组织的财务状况（收入目标与实际收入、本金、资产、负债、存款、财务紧迫程度、职业投入状态等描述性信息）」；③ 「为什么」补记 2026-08-26 事故，「怎么用」新增一条：财务状况类没有占位符可用，文档写动机时只陈述业务目标与方法论、不写财务背景，确需记录的写入 `.gitignore` 忽略的本机文档；「拿不准按敏感处理」条同步补充财务类口径。`claude/CLAUDE.md` 镜像 cp 同步（diff 验证逐字节一致）；`~/.zcode/AGENTS.md` 为软链接（2026-08-24 起）自动跟随，无需单独同步。

## 2026-08-24

### 变更（全局 CLAUDE.md「工作规则」节新增 rules 加载机制说明：`@` 引用仅 CC 解析，非 CC agent 须主动读文件——镜像与 ZCode 副本同步）

- **为什么改**：2026-08-24 调研确认 ZCode 无 `rules/` 目录机制且不解析 `@` 引用（官方文档明文：不展开 `@import` / `@include`）——全局 CLAUDE.md「工作规则」节的四行 `@rules/` 引用在 ZCode 里只是普通文本，四个规则文件全文不会进入 ZCode 上下文。为让规则在非 CC agent 也生效，经用户裁定采用方案 A：保留 `@` 引用（CC 自动加载不动），在节内加加载机制说明，要求非 CC agent 会话开始时主动读取四个规则文件全文。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「工作规则（全局 rules 显式引用）」节在四行 `@` 引用之前新增一段加载机制说明：`@` 引用只有 CC 自动解析展开；其它 agent（如 ZCode）不解析，须在会话开始时用读文件工具逐一读取 `~/.claude/rules/` 四文件全文。`claude/CLAUDE.md` 镜像同步；ZCode 全局指令副本 `~/.zcode/AGENTS.md` 一并 cp 对齐（diff 验证三处逐字节一致）。

### 变更（ZCode 全局指令副本 `~/.zcode/AGENTS.md` 由 cp 同步改为软链接指向 `~/.claude/CLAUDE.md`）

- **为什么改**：2026-08-24 方案 A 落地后 ZCode 副本仍靠手动 cp 对齐，每次全局 CLAUDE.md 变更都要记得同步、有漏同步风险；用户裁定改为软链接，全局改动即时反映到 ZCode、零维护。
- **改了什么**：删除 `~/.zcode/AGENTS.md` 普通文件（删前确认与全局逐字节一致、内容无丢失），`ln -s ~/.claude/CLAUDE.md ~/.zcode/AGENTS.md` 建立软链接，diff 验证读取内容一致。此后 ZCode 的全局指令 = 全局 CLAUDE.md 本体，不再单独同步该文件（Prometheus `claude/CLAUDE.md` 镜像的 cp 同步不变）。

## 2026-08-23

### 变更（CLAUDE.md 镜像随全局对齐：Kit 行更名 ExecutiveAssistantAgent + 补齐五小组 / Atlas / Hopkins / Justin / 查证规则滞后）

- **为什么改**：两个来源——① Kit 主项目由 PersonalAssistantAgent 更名为 ExecutiveAssistantAgent（Title「总经理助理」定名后的名字对齐，GitHub 仓库同步改名），全局 `~/.claude/CLAUDE.md` 注册表 Kit 行与「超集关系映射」表仓库名已更名，镜像须随权威源对齐；② 发现镜像落后于全局：同日早前全局的「五小组重组（Hopkins / Justin / Atlas 注册表行、流水线段、FullStackEngineerAgent 脚手架引用、zcode-cli 映射行）」与 2026-08-22 立的「查证外部行为先找官方文档」规则未同步进镜像，按「全局 ↔ 镜像时刻一致、发现分叉自动对齐」规则一并补齐。
- **改了什么**：`claude/CLAUDE.md` 以全局 `~/.claude/CLAUDE.md` 覆盖对齐（diff 校验逐字节一致）；顺带将 ZCode 全局指令副本 `~/.zcode/AGENTS.md`（同为全局 CLAUDE.md 的派生副本、同样滞后）一并 cp 对齐。


### 变更（commit skill 敏感内容扫描检测面扩充：新增「敏感行为记录」四类——IP 字面量 / 代理商标识 / 监管报文 / 地域规避叙述）

- **为什么改**：2026-08-21 DayTradingAgent 排查发现「代理交易的行为记录」类泄漏（节点 IP、订阅商名、监管拒单报文、境内规避实测故事线）全部走过了 /commit 扫描——旧扫描只拦凭证「值」类（账户号 / token / 净值），不拦「行为记录」类；DayTradingAgent 同日已做工作区中性化清理 + 规划 git 历史重写，扫描面扩充是防复发的配套（DayTradingAgent TODO T3）。
- **改了什么**：全局 `~/.claude/skills/commit/SKILL.md` 第 2 步敏感内容扫描新增「敏感行为记录」类别——① 公网 IPv4 字面量（回环 / 内网 / 文档示例网段 192.0.2.x / 198.51.100.x / 203.0.113.x 放行）；② 代理服务商标识（订阅商名 / 节点入口域名体系 / 节点代号）；③ 券商监管报文（错误码 + 报文原文引用）；④ 地域规避叙述（「境内拒境外受理」类把身份与绕行手段串成故事线的叙述；合规要求的中性表述不拦）。扫描方式同步升级为「全部暂存文件跑内容正则」（旧版只按文件名 + 抽样）。`claude/skills/commit/SKILL.md` 镜像同步（diff 验证逐字节一致）。
- **回归风险**：无既有保护被削弱——四类全是新增检测维度；误报风险（技术文档引用公网 IP）用「逐个判断 + 文档示例网段放行」缓解。

## 2026-08-22

### 变更（全局 CLAUDE.md 新增「查证外部行为先找官方文档」规则：立规并镜像到 `claude/`）

- **为什么改**：2026-08-22 在 CC-BRIDGE 判断「GLM 端点如何解读 CC 的 effort 档」时，先做本地 A/B 实验就下了结论，用户指出应先查官方文档——官方明文映射表本就存在，且顺带给出「默认档即 max」等实验没覆盖的关键信息。用户立规：「官方文档优先于本地实验」要记录到全局规则。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「表述的逻辑严谨性」节新增第四条「查证外部行为先找官方文档，本地实验只做补充验证（2026-08-22 用户立）」——外部系统行为规则（API 参数语义、档位映射、配置默认值等）第一步查官方文档（权威承诺），本地实验只是单点观察（n=1、有噪声、随版本变）；文档查不到才实验且结论须标注「本地实测」，文档与实验冲突以文档为准；边界：用户自己的代码 / 项目行为靠读源码与实测、不受本条约束。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致；rules / skills 两部分核对无分叉）。

### 变更（注册表新增 Atlas / FullStackEngineerAgent：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：2026-08-22 新建 FullStackEngineerAgent（Atlas，全栈开发工程师）——团队第 17 个 agent，负责横跨前后端的完整开发，zcode-cli 为其子项目。按「新建带拟人名的 Agent 时自动维护注册表（免确认）」规则，须把 Atlas 追加进全局注册表并补流水线位置说明。
- **改了什么**：全局 `~/.claude/CLAUDE.md`——注册表表格追加 Atlas 行（全栈开发工程师 / FullStackEngineerAgent / 横跨前后端的完整开发，目前在手 zcode-cli）；「销售流水线顺序」段独立清单补 Atlas、并补一句 Atlas（全栈）与 Anvil（后端）的分工（横跨前后端及偏前端 / TUI / 客户端侧归 Atlas，纯服务端归 Anvil）；「超集关系映射」表加「FullStackEngineerAgent（Atlas）→ zcode-cli」行；脚手架节参考项目示例从 DigiVendAgent 改为 FullStackEngineerAgent（对齐最新模板形态）。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。

## 2026-08-21

### 变更（缩写约定新增 DSH：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：2026-08-21 用户要求安装 DeepSeek Harness 时以缩写「DSH」指代（「帮我安装DSH」+ 补充「deepseek harness」），并指示把该缩写记入全局规则——一般情况下提到 DSH / dsh 就是指 DeepSeek Harness，避免以后每次都要用户解释。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「Language」节「缩写约定」条——新增「输入『DSH』即指 DeepSeek Harness（DeepSeek 开源的 agent harness，npm 包 `@deepseek-ai/dsh`，2026-08-21 立）」；大小写不敏感清单补 DSH / dsh 与示例「『dsh 安装』= 安装 DeepSeek Harness」；上下文辨别示例补「`dsh` 在分布式 shell 语境指 Dancer's shell / distributed shell，不按缩写解读」。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：只加缩写解读规则；`dsh` 在明确谈论分布式 shell（Dancer's shell）的上下文中仍按上下文实际含义辨别，不强制解读为 DeepSeek Harness。

### 变更（TODO 待办编号规则新增：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户指令（2026-08-21）——待办 TODO 里的每条待办都要有待办编号，方便用户与 AI 针对性沟通（直接「T-12 处理了吗」指代，不必复述长正文）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节——标题时间线补「2026-08-21 增补待办编号」；「怎么用」新增「每条待办必须有唯一待办编号（2026-08-21 用户立）」条：格式 **T+序号**（前缀 `T` 直接连序号、不带连字符，如 `T11`）、置于 `[ ]` 之后正文之前；编号项目内全局递增、永不复用（新编号 = TODO.md 与 TODO-archive.md 两文件中出现过的最大编号 + 1，归档编号也算占用）；归档保留编号；MEMO.md 备忘条目同样编号、前缀 `M` 连写（如 `M11`）与 `T` 区分（MEMO.md 与 MEMO-archive.md 都要扫）；存量无编号条目接触一条补一条（补编号不改正文、时间戳不必更新）；编号只用于指代、不表达优先级或顺序。「备忘录 MEMO.md」小节「条目格式」同步补 `M` 前缀连写编号要求。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：只改全局规则与镜像；各业务项目现有 `TODO.md` / `MEMO.md` 存量条目不一次性返工，按「接触一条补一条」口径由各项目后续顺手补编号。

### 变更（措辞统一 fleet → team / 舰队 → 团队：全局 CLAUDE.md + commit skill 修订，镜像到 `claude/`；本项目级文件与 README 同步改）

- **为什么改**：用户 2026-08-16 已把 xhqing 主页 README 的自称从「舰队 / fleet」改为「团队 / team」，但全局元规范、commit skill、各 agent 项目文档与两个 logo 仍是旧措辞——外部读者沿「主页 → agent 仓库 → 本项目 `claude/` 镜像」的浏览路径会看到两种自称并存，观感割裂；用户裁定全量统一为「团队 / team」（2026-08-21）。
- **改了什么**：
  - 全局 `~/.claude/CLAUDE.md`：7 处 fleet、1 处「全舰队」→ 团队 / 全团队（注册表 Prometheus 行、自动维护注册表节、脚手架节、Visitors 徽章节 ×2、超集关系节、销售流水线段）；GitHub secret 名 `FLEET_TRAFFIC_PAT` 是后台标识符、暂保留。
  - 全局 `~/.claude/skills/commit/SKILL.md`：14 处 fleet → 团队（Visitors 徽章例外段、9a/9l、缓存标记模板、汇报段）。
  - `claude/CLAUDE.md` + `claude/skills/commit/SKILL.md` 镜像同步（`diff` 验证逐字节一致；顺手清掉镜像里误嵌套的 `commit/commit/` 目录）。
  - 本项目级文件：`README.md` / `README_cn.md`（fleet → team、舰队 → 团队，含「fleet registry」→「team registry」）、`assets/logo.svg`（「Fleet-wide ~/.claude/ backbone」→「Team-wide」）、`.claude/skills/capability-manager/`（SKILL.md description 与正文、content-lifecycle / registry-and-scaffolding / sync-flow 三个 references，场景 C 标题「fleet 扩展」→「团队扩展」）。
- **边界**：各 CHANGELOG 的历史条目按纪律不改（记录的是当时事实）；`.claude/skills/find-skill/cache/` 已 gitignore 不公开，不动；`vendy-fleet-architecture.md` 是 AutoMemory 历史文件名引用（文件已不存在、checkpoint 未被 git 跟踪），不动。

### 变更（「CHANGELOG 记录不用问」规则新增：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：2026-08-21 用户在 DayTradingAgent 场景明确立规「记录 CHANGELOG 不用问」——凡有变更（增 / 删 / 改）都要记录 CHANGELOG 是**本分动作**，直接记录、不需要先问用户「要不要记 CHANGELOG」，问「要不要记录」是多余的反 confirm（当天 AI 改完 skill 规则后问「要我现在把这次变更记入 CHANGELOG 吗」，被用户纠正）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「CHANGELOG 记录纪律」节「怎么记」段新增一条「**记录不用问（2026-08-21 用户立）**」。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。

## 2026-08-20

### 变更（「超集关系映射」表新增 DeviceStewardAgent（Alfred）→ ResourceMonitor：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：新建 DeviceStewardAgent（Alfred，电脑管家 Agent，2026-08-20 立项推上 GitHub），其子项目 ResourceMonitor（VSCode 扩展：整机资源监控 + AI 清理建议）随之入体系——按「Agent 项目与子项目的 `.claude/` 超集关系」规则（2026-08-10 立），映射表须登记新对（注册表内 Alfred 行此前已存在，仅缺映射行）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「超集关系映射」表追加一行「DeviceStewardAgent（Alfred）| ResourceMonitor | 整机资源监控 + AI 清理建议的 VSCode 扩展（TypeScript）」。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。

## 2026-08-19

### 变更（TODO 体系增补备忘录 MEMO.md 与「放弃」归档口径：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户指令（2026-08-19，源于 DayTradingAgent 场景）——①TODO.md 功能定位收紧：待办清单只放「要尽可能尽快处理、要及时清空」的内容，**不设「长期备忘」分类**，比绿色紧急度还低的超低频需求（周期性 / 条件触发、无排期压力）专门放备忘录文档；②用户说「放弃、不处理」的待办 = 移除待办 + 归档留痕（不裸删）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节——标题补「+ 备忘录 MEMO.md」；正文新增「TODO.md 的功能定位」段（及时清空、不设长期备忘、备忘类进 `MEMO.md`）；文件结构补 `MEMO.md` 与 `✅**已放弃**` 状态；「怎么用」新增「放弃 = 移除 + 归档留痕」条；新增「备忘录 MEMO.md」小节（功能定位 / 条目格式【时间戳 + 下次触发锚点】/ 完成与归档【**2026-08-19 补：归档进专属 `MEMO-archive.md`、与 TODO-archive 平行互不混放】/ 触发时机【不设自动提醒、相关场景 AI 主动翻】/ 新建项目不强制预建）。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。

### 变更（缩写约定追加 GH / gh = GitHub + 全部缩写大小写不敏感：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户指令（2026-08-19，两条）——①新增缩写「GH / gh」一般情况下默认代表 GitHub，特殊情况根据上下文辨别；②此前约定的 CC / VSC / VSCE / CB 同样适用小写形式（cc / vsc / vsce / cb），特殊情况同样按上下文识别真正语义。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「Language」节「缩写约定」条目改写——缩写清单追加「GH」即指 GitHub；新增一句「缩写**大小写不敏感**」，大写「CC / VSC / VSCE / CB / GH」与对应小写「cc / vsc / vsce / cb / gh」同义（举例：「cc 会话」= Claude Code 会话、「gh 仓库」= GitHub 仓库）；「解读以不影响上下文理解为前提」的兜底从原来只针对 CB 推广到**全部缩写**，并给典型示例（小写 `gh` 出现在命令位置指 GitHub CLI 命令、`cc` 在编译器语境指 C 编译器，均不按缩写解读）。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：只改全局 CLAUDE.md 的缩写约定条目与镜像；各业务项目自己的文档不受影响（本条是「读用户输入时怎么解读缩写」的会话级规则，不要求项目文档改写）。

### 新增（fleet 注册表登记新 agent：Alfred / DeviceStewardAgent 电脑管家）

- **为什么改**：用户指令——注册一个新智能体「电脑管家」，负责本地电脑 / 远程服务器 / 云电脑的资源管理与建议，让设备始终处于低负载的流畅工作状态；按「新建带拟人名的 Agent 时自动维护注册表（免确认）」规矩，向全局 CLAUDE.md 的智能体命名注册表追加新成员。
- **改了什么**：全局 `~/.claude/CLAUDE.md` 注册表追加一行——拟人名 **Alfred**（查重通过，与现有 14 个拟人名不重复）、项目 `DeviceStewardAgent`、职称「电脑管家」、职责「资源管理：本地电脑 / 远程服务器 / 云电脑的资源监控与管理建议（进程 / 内存 / 存储治理）→ 让设备始终处于低负载的流畅工作状态，独立于销售流水线」；「销售流水线顺序」段同步补 Alfred 位置（独立于流水线）与一句职责说明。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：本轮只做注册表登记（全局 CLAUDE.md + 镜像同步）；DeviceStewardAgent 项目本体的脚手架（目录、CLAUDE.md、README、git init、开源到 GitHub 等）尚未创建，待用户指示后按「新建 Agent 项目的脚手架与开源约定」执行。

## 2026-08-17

### 变更（TODO 紧急度命名弃「灯」用「色」：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户 2026-08-17 指示——TODO 紧急度命名不用「灯」这个字，改用「色」，如「红色紧急度」；四级分级标准与排序不变，只改命名词形。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节——四级名称「🔴 红灯 / 🟠 橙灯 / 🟡 黄灯 / 🟢 绿灯」改为「🔴 红色紧急度 / 🟠 橙色紧急度 / 🟡 黄色紧急度 / 🟢 绿色紧急度」；「文件结构」里 TODO.md 分节描述、「怎么标」的标题枚举同步换词；「TODO-archive.md」描述里「优先级标注」改「紧急度标注」；「怎么标」追加存量清理口径「既有分节标题还写红灯等的，接触一处改一处」。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致；改名说明里的历史词「弃『灯』用『色』」属必要保留）。
- **边界**：命名词形改动只落全局 CLAUDE.md 与镜像；各业务项目自己的 `TODO.md` / `TODO-archive.md` 分节标题由各项目随后自行更新（归档文件历史节名保留原词属历史事实）。各项目 TODO 的更新记录在各项目自己的 CHANGELOG，不记本文件。

### 变更（Visitors 徽章更名 Visits/day (14d)：alt 文本与 xhqing 集中统计新 label 对齐）

- **为什么改**：用户要求（2026-08-17）访问量徽章名需表达「最近半月日均访问量」口径——xhqing 集中统计侧的 badge JSON label 已从 `Visitors` 改为 `Visits/day (14d)`（`Visits/day` 是 shields.io 表达日均的惯例写法、`(14d)` 标注 14 天滚动窗口），各仓 README 的徽章 alt 文本同步对齐，避免 alt 与徽章实际显示文字脱节。
- **改了什么**：README 徽章区 `alt="Visitors"` → `alt="Visits/day (14d)"`，仅改 alt 文本，endpoint URL、数据源、徽章口径均不变（口径改动记 xhqing 仓库 CHANGELOG，本仓只改 alt）。

### 变更（TODO 标注方式修订：颜色只标分节标题、条目不标颜色 emoji——全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户 2026-08-17 指示——分级颜色只保留在四个分节标题上（🔴 红灯 / 🟠 橙灯 / 🟡 黄灯 / 🟢 绿灯），条目本身不再标注颜色 emoji，避免标题与条目两处颜色不一致或混乱；条目紧急度由所在分节表达，逐条标色属冗余。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「优先级分类」的「怎么标」条目改写——颜色只出现在 `##` 分节标题、条目不标颜色 emoji；判断拿不准往高靠保留；存量带色条目「接触一条删一条」顺手清理。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：只改标注方式规矩，四级分级标准与排序本身不变；各项目 TODO 条目的 emoji 清理由各项目自己执行并记各自 CHANGELOG。

### 变更（TODO 优先级改四级紧急度「红灯 / 橙灯 / 黄灯 / 绿灯」：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户 2026-08-17 再次指示——三级紧急度扩为四级（红、橙、黄、绿，从最紧急到最不紧急），原「高危 / 中危 / 轻危」分别对应前三级（红 / 橙 / 黄），**计划类新功能实现独立放第四级绿灯**（上一轮曾把计划类并进绿灯=原轻危的定义域，本轮拆开：轻危类卫生 / 文档问题归黄灯、计划类新功能独占绿灯，两类性质不同不再混装）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节——「文件结构」分节描述改四级排序；「优先级分类」小节改四级：🔴 红灯（原高危标准）/ 🟠 橙灯（原中危标准）/ 🟡 黄灯（原轻危标准：文档措辞 / 格式漂移 / 卫生问题 / 不影响正确性的优化）/ 🟢 绿灯（计划类新功能实现：新能力立项、改造方案落地，改期无实际损失），条目署期改「2026-08-17 用户改为四级紧急度」；「怎么标」的 emoji 枚举更新为 🔴/🟠/🟡/🟢。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。同日早前的「三级改名」条目（见下）为本次四级的中间态，一并保留可追溯。
- **边界**：分级规则改动只落全局 CLAUDE.md 与镜像；各业务项目自己的 `TODO.md` 分节标题由各项目随后自行更新（归档文件历史节名保留原词）。各项目 TODO 的更新记录在各项目自己的 CHANGELOG，不记本文件。

### 变更（TODO 优先级三级命名改「红灯 / 黄灯 / 绿灯」三级紧急度：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户 2026-08-17 指示——待办分级此前的「高危 / 中危 / 轻危」命名改为三级紧急度「红灯 / 黄灯 / 绿灯」（从最紧急到最不紧急），语义不变、命名更直观；同时绿灯的定义域放宽，把「计划类新功能实现（改期无实际损失）」也纳入绿灯（原三级里这类待办没有明确归属——它不是缺陷修复、不落在任何一级的标准里）。
- **改了什么**：全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节——「文件结构」里 TODO.md 的分节描述改为「红灯最紧急在前、黄灯居中、绿灯最不紧急在后」；「优先级分类」小节三条改名（🔴 高危→🔴 红灯【最紧急】/ 🟡 中危→🟡 黄灯【次紧急】/ 🟢 轻危→🟢 绿灯【最不紧急，定义域追加计划类新功能实现】），条目署期改为「2026-08-16 用户立；2026-08-17 用户改三级紧急度命名」；emoji 标记（`[ ] 🔴/🟡/🟢`）与判断标准本身不变。`claude/CLAUDE.md` 镜像同步（`diff` 验证逐字节一致）。
- **边界**：改名只动全局 CLAUDE.md 与镜像；各业务项目自己的 `TODO.md` / `TODO-archive.md` 分节标题由各项目随后自行更新（归档文件里的历史节名保留原词、属历史事实不改）。各项目 TODO 的更新记录在各项目自己的 CHANGELOG，不记本文件。

### 新增（keep-awake skill——Mac 合盖防睡眠全局通用化）

- **为什么改**：用户指令——Mac 合盖防睡眠此前只在 DayTradingAgent 有实现（盯盘场景专用、已并入 trade 盯盘流程），现提炼为全局 skill 供任意场景使用。同时按用户要求，启用后必须提示「已启用」并**重点提醒接入电源**——`caffeinate -s` 的合盖防睡眠（`PreventSystemSleep` assertion）只在接电源（AC）时有效（`man caffeinate` 明确），电池下合盖是硬件强制睡眠、软件防不住；DayTradingAgent 版因盯盘开盖场景曾去掉电池警告，全局通用版恢复并强化该提醒。
- **改了什么**：新增 `skills/keep-awake/`（全局权威源 `~/.claude/skills/keep-awake/` 落地后镜像同步）——
  - **SKILL.md**：description 覆盖「合盖防睡眠」「防止 Mac 睡眠」「keep awake」等触发场景，启用后回复必须含「已启用提示 + 电源重点提醒」；正文含机制与前提（AC-only 硬约束）、启用 / 停用 / 状态查询、根因背景（源自 2026-07-24 DayTradingAgent 盯盘复盘，与 trade 盯盘链路不冲突的说明）。
  - **scripts/on.sh**：幂等启用（`pgrep` 查重→`pmset -g batt` 检测电源→`nohup caffeinate -s` 后台启动 + `disown`→复检确认），按电源状态输出差异化提醒——AC 打 ✅、电池打 ⚠️⚠️「请立即接入电源」、检测失败打 ⚠️ 请确认接电源；脚本层面保证电源提醒不依赖 AI 转述。
  - **scripts/off.sh**：`pkill -f "caffeinate -s"` 停用，无进程时幂等返回不报错。
  - **实跑验证通过**：启用（AC 检测正确、`pmset -g assertions` 确认 `PreventSystemSleep` 生效）→ 停用 → 幂等再停用 → 重新启用全链路正常。
- **与 DayTradingAgent 的关系**：实现逻辑源自其 keep-awake skill；该项目的防睡眠已并入 trade 盯盘流程（preflight 无条件启用、停盯自动解除），继续独立运行，不受本次全局化影响。
- **同步镜像**：`claude/skills/keep-awake/` 随全局逐字节一致（`diff -r` 验证通过）。

### 变更（新增「中英双语 README 内容自动同步」规定：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：2026-08-17 在 xhqing 改赞助段措辞时只改了中文版 README、随后停下来问用户「英文版要不要同步」，被用户纠正——英文版必须与中文版内容同步，这不需要问，每次改动都应自动同步。据此立规写入全局。
- **改了什么**：**全局 `~/.claude/CLAUDE.md`** 新增「中英双语 README 内容自动同步（2026-08-17 用户立）」节——凡项目同时存在中英双版 README（英文 `README.md` + 中文 `README_cn.md`，以项目实际双版文件名为准），每次改动任何一版的内容都必须在同一轮改动里自动同步另一版，不需要问用户；中文版为权威方向（用户用中文打磨措辞，英文跟随）；英文按英文习惯表达、不必逐字直译，但语义内容（信息点、列举项、口径、数字）必须对齐；语言固有差异允许（如中文「如……等」的非穷尽语义，英文 "such as" 已含，不必再叠 "etc."）；边界——语言特有的内容（如语言切换链接）不算内容差异、单语 README 项目不适用。
- **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致（`diff` 验证通过）。

## 2026-08-16

### 变更（Visitors 徽章命名全局统一为首字母大写：全局 CLAUDE.md 与 commit skill 规格措辞修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户指令（2026-08-16）「Visitors 徽章全局统一，首字母大写」——前一条「英文首字母必须大写」规定落地后，全局规则与 commit skill 正文里描述这枚徽章的措辞仍有小写 `visitors`（如「visitors 访问量徽章」「`alt="visitors"`」），规格本身与自己的规定不一致，需一并收口。
- **改了什么**：**全局 `~/.claude/CLAUDE.md`「访问量徽章」条目**——条目名与正文的小写 `visitors` 统一为 `Visitors`，并补注 badge JSON 的 `label` 字段实为 `Visits/day`（徽章展示日均访问量，`alt` 与 label 是两个不同的显示位）；**全局 `~/.claude/skills/commit/SKILL.md`**——description、9a「Visitors 访问量徽章」段、9l、例外清单、缓存标记说明、汇报段共 10 处小写 `visitors` 措辞改为 `Visitors`，9a 段的 `alt="visitors"` 规格改为 `alt="Visitors"` 并同样补注 label=`Visits/day`。
- **同步镜像**：`claude/CLAUDE.md`、`claude/skills/commit/SKILL.md` 随全局逐字节一致（`diff` 验证通过）。
- **关联**：各 fleet 仓库 README 的 `alt="visitors"` → `alt="Visitors"` 存量修正由各仓库自行记录，不在此重复。

### 变更（徽章规矩新增「英文首字母必须大写」规定：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户立规（2026-08-16）——README 徽章上的英文小写首字母（`license-MIT`、`visits/day`、`mode-signal` 等）在徽章墙上观感不一致、显得随意，与 fleet 统一的专业视觉风格不符；首字母大写是英文标识词的标准书写规范。
- **改了什么**：**全局 `~/.claude/CLAUDE.md`「新建 Agent 项目的脚手架与开源约定」节**新增「徽章英文首字母必须大写（2026-08-16 用户立）」条目——README 里所有徽章上的英文文字（静态 badge 的 label 与 message、endpoint 徽章 JSON 的 `label` 字段、`<img>` 的 `alt` 文本）凡英文首字母一律大写（如 `License-MIT`、`Visits/day`、`Mode-Signal`）；新写徽章直接按大写书写，既有小写存量接触一处改一处；边界：URL 路径等非显示内容不管，单词内部字母（`AI`、`iOS`）按该词本身规范书写。同时「访问量徽章」条目里的徽章名示例从 `visitors` 更新为 `Visitors`（与「日均口径」改动同批落地）。
- **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致（`diff` 验证通过）。
- **关联**：本规定的存量落地修正分散在各仓库（xhqing 的 badge JSON 与采集脚本、三个 agent 仓库的 README），各仓库侧的变更记各自 CHANGELOG，不在此重复。

### 变更（待办 TODO 管理新增「优先级分类」规定：全局 CLAUDE.md 修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户在 DayTradingAgent 全项目审计后立规——待办不分轻重混排，紧急的（会亏钱的 bug）和不要紧的（改个措辞）排在一起，容易先做了轻的、漏了重的；按严重度分层后「什么必须马上修」一眼可见，处理顺序有依据。
- **改了什么**：**全局 `~/.claude/CLAUDE.md`「待办（TODO）管理」节**新增「优先级分类（2026-08-16 用户立，每次写入 TODO 必须判断）」条目——① 每条待办写入 `TODO.md` 时必须判断严重度并标注类别，**至少分三类**：🔴 高危（不修会直接亏钱 / 下错单 / 安全事故 / 数据统计结论错误 / 核心功能不可用，须优先处理）、🟡 中危（边界情况出错 / 防护缺口 / 口径不一致可能演化为实际损失，排在高危之后）、🟢 轻危（文档措辞 / 格式漂移 / 卫生问题 / 不影响正确性的优化，有空再处理）；② 标注格式「`[ ] 🔴` / `[ ] 🟡` / `[ ] 🟢`」放条目开头；③ 判断拿不准往高靠（宁高勿低）；④ `TODO.md` 文件结构同步改为按优先级分节（高危在前、中危居中、轻危在后，同优先级内可再按主题分三级节），`TODO-archive.md` 归档时保留优先级标注；⑤ 既有无类别的存量条目接触一条补一条（顺手补标、不专门返工）。
- **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致（`diff` 验证通过）。
- **关联**：本规定的首次落地应用在 DayTradingAgent（当日全项目审计发现落入 TODO.md、按三类分级），该项目侧的 TODO 重构记其自己仓库的 CHANGELOG，不在此重复。

### 变更（徽章规矩新增 fleet visitors 访问量徽章例外：全局 CLAUDE.md + commit skill 同步修订，随自动同步规矩镜像到 `claude/`）

- **为什么改**：2026-08-16 全舰队上线集中式「真去重」访问统计（部署在 xhqing 仓库：`scripts/update_traffic.py` + 每日 GitHub Action 拉官方 Traffic API，各 fleet 仓库 README 挂 visitors 徽章、URL 指向 `xhqing/xhqing` 的 `traffic/badges/<repo>.json`）。而既有徽章规矩（全局 CLAUDE.md「脚手架」节 + commit skill 9a/9l）规定「标准三枚 License / Version / Type、不含动态徽章」——新徽章若不修规矩，会被 commit skill 第 9l 步当违规徽章删掉。故立例外条款：这枚 visitors 徽章属「指向本仓库静态 JSON 的 endpoint 徽章」，不是 shields.io 实时抓取 GitHub 的动态数值徽章，与原规矩的立法本意（避免随仓库变动的动态数值 / 时间徽章）不冲突。
- **改了什么**：
  - **全局 `~/.claude/CLAUDE.md`「新建 Agent 项目的脚手架与开源约定」节**：标准徽章条目后新增「访问量徽章（visitors，2026-08-16 立，fleet 仓库专用例外）」条目——fleet 各仓库在标准三枚之外另挂一枚 visitors 徽章（shields.io endpoint 指向 `xhqing/xhqing` 的 `traffic/badges/<repo>.json`）；说明允许理由（静态 JSON endpoint、非实时动态徽章、fleet 统一部署的有意例外）与边界（只豁免这一种 URL 形态，komarev / seeyoufarm 等第三方计数图片及其它动态徽章仍不挂）。
  - **全局 `~/.claude/skills/commit/SKILL.md`** 六处：① description——项目标配徽章项补「fleet 仓库可另挂指向 xhqing traffic/badges/ 的 visitors 访问量徽章，属允许例外」；② 9a 新增「visitors 访问量徽章」专段（URL 形态、允许理由、**9a 不主动补挂**——挂徽章是 fleet 部署动作而非标配缺失、数据源 JSON 由 xhqing 采集流程生成非本仓库可自行补造；已挂的不动，9l 对该 URL 形态豁免；边界同上）；③ 9l 检测逻辑——检测时先排除 URL 含 `xhqing/xhqing/main/traffic/badges/` 的 endpoint 徽章（不算三类违规）、修正段的「其余徽章」清单明确含 visitors 访问量徽章；④ 底线原则两处「移除动态徽章」措辞补「fleet 仓库的 visitors 访问量徽章属允许例外、不删」（第 20、272 行）；⑤ 缓存段 `readme-badges` 标记说明与缓存模板行补例外表述；⑥ 汇报段徽章清单项补「fleet 仓库已挂的 visitors 访问量徽章属允许例外、如实报告『保留未动』」。
  - **同步镜像**：`claude/CLAUDE.md` 与 `claude/skills/commit/SKILL.md` 随全局逐字节一致；`diff -r` 验证三部分（skills / rules / CLAUDE.md）全部一致。
- **关联**：本次修订与 xhqing 仓库的集中式统计部署是同一件事的两面（统计基础设施在 xhqing、规矩层在全局 CLAUDE.md + commit skill）；xhqing 侧的变更记录在其自己仓库的 CHANGELOG，不在此重复。

## 2026-08-12

### 新增（README 访问量徽章——舰队集中式访问统计）

- **为什么改**：全舰队上线集中式「真去重」访问统计（图片徽章方案无法去重，走官方 Traffic API 路线）：统计集中部署在 xhqing 仓库（`scripts/update_traffic.py` + 每日 GitHub Action），各 fleet 仓库只需在 README 挂徽章、零运行负担。
- **改了什么**：README（EN/CN）徽章区新增 visitors 徽章（shields.io endpoint 指向 `xhqing/xhqing` 仓库 `traffic/badges/<repo>.json`，由每日采集的官方 Traffic API 数据更新）。徽章数字含义：按日去重访客的累计（GitHub 只提供每日 uniques，跨天不去重），自 2026-08-16 起累计。

### 变更（全局 CLAUDE.md「脚手架与开源约定」节徽章规定修订：标准徽章改为 License / Version / Type 三枚，去掉 Forks 及 Stars / Last Commit，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户立新规矩——README 徽章**不要** Forks 徽章，**必须含有**的三枚分别是 License / Version / Type。原规定是「License MIT / Stars / Last Commit / AI Agent」四枚；用户决定把 Stars（GitHub 星标数）与 Last Commit（最近提交时间）一并去掉——它们与 Forks 同属「随仓库变动的动态数值 / 时间徽章」，徽章集合只保留静态描述类（许可证、版本号、项目类型），逻辑统一。其中 `Type` 即原 `AI Agent` 那枚「标项目类型」的徽章，只是归类名改为 Type。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 「新建 Agent 项目的脚手架与开源约定」节的**标准徽章**规定从「shields.io：License MIT / Stars / Last Commit / AI Agent」改为「shields.io：**License / Version / Type** 三枚是必须含有的底线——License 标开源许可证（如 MIT）、Version 标项目版本号（取自 VERSION 文件）、Type 标项目类型（如 AI Agent）；**不含** Forks，也不含 Stars / Last Commit 等 GitHub 动态数值 / 时间徽章；另**不含**点明 LLM / 厂商的徽章（如 "Built with Claude Code"）」。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。
- **待跟进（回归风险提醒）**：全局 commit skill（`~/.claude/skills/commit/`）第 9 步项目标配检测会查 README 徽章——其检测项与措辞仍按旧规定（「不含 GitHub Stars 数量徽章」等），与新规矩的「License / Version / Type 三枚必须含有、不含 Forks / Stars / Last Commit」不一致。本次只改 CLAUDE.md 规定，**未动 commit skill 检测逻辑**，留待用户决定是否同步更新 commit skill。

### 变更（落实上一条「待跟进」：commit skill 第 9 步徽章检测同步新规矩，随自动同步规矩镜像到 `claude/`）

- **为什么改**：落实上一条「待跟进」——commit skill 的徽章检测逻辑（9a「徽章组合」补哪些徽章、9l 清理哪些违规徽章、description / 底线原则段 / 缓存标记 / 报告模板里的徽章表述）仍按旧规矩（License + last-commit + Type / 只删 Stars），与刚修订的全局 CLAUDE.md 新规矩（License / Version / Type 三枚必须、不含 Forks / Stars / Last Commit）不一致，须同步更新，否则 `/commit` 检测与规定打架。
- **改了什么**（全局 `~/.claude/skills/commit/SKILL.md`，已镜像到 `claude/`）：
  - **description**：项目标配里的徽章项从「徽章(不含 GitHub Stars 数量徽章)」改为「标准徽章(License/Version/Type 三枚必须含有，不含 Forks/Stars/Last Commit)」。
  - **9a「徽章组合」**：从「有 remote 用 License + `github/last-commit/<user>/<repo>` + Type 三枚、无 remote 用 License + Type 两枚、不用 Stars」改为「**固定三枚 License / Version / Type**，不按 remote 区分数量」——新增 **Version 徽章**（版本号取 `VERSION` 文件，VERSION 尚不存在时按 9m「版本号取值顺序」兜底：`package.json` version → 主 manifest → 已有 CHANGELOG 顶部版本 → `1.0.0`；URL 形如 `img.shields.io/badge/Version-v1.2.3-blue`），移除 `last-commit` 徽章；明确三枚统一用静态 `badge` 端点、**不使用** `github/stars/`、`github/forks/`、`github/last-commit/` 等动态徽章（已存在的由 9l 清理）；Version 徽章的版本号后续随 9j（版本滞后 bump）/ 9k（版本号一致性同步）一起更新。
  - **9l**：从「README 不含 GitHub Stars 数量徽章」（只删 stars 一类）升级为「**README 徽章组合合规**」——标准三枚（License / Version / Type）齐全且**不得包含 Forks / Stars / Last Commit 三类动态徽章**（URL 路径含 `github/forks/`、`github/stars/`、`github/last-commit/` 之一即违规）；检测、修正、突破「只补不删」原则的措辞相应扩展到三类。
  - **缓存标记**：`readme-no-stars-badge` 改名为 `readme-badges`（语义从「不含 stars」升级为「徽章组合合规」）；缓存模板行、缓存标记说明（第 257 行）、报告模板（第 276 行）联动更新。
  - **底线原则段两处例外表述**（第 20、271 行）：「移除 GitHub Stars 数量徽章（第 9l 步）」改为「移除 Forks/Stars/Last Commit 等动态徽章（第 9l 步）」。
  - **报告模板**（第 276 行）：「徽章清单（含移除 GitHub Stars 数量徽章，如有）」改为「徽章清单（License / Version / Type 三枚补全情况，含移除 Forks / Stars / Last Commit 等动态徽章，如有）」。
  - **同步镜像**：`claude/skills/commit/SKILL.md` 随全局逐字节一致；diff 验证通过；旧表述（`readme-no-stars-badge`、「GitHub Stars 数量徽章」）已全量扫描确认无残留。

## 2026-08-10

### 变更（commit skill 缓存文件名简化 + 全局 CLAUDE.md 新增「文件命名规范」节，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户立「文件命名规范」——文件名必须用英文命名、且用尽可能简单的名字（去掉冗余修饰词）；commit skill 检测缓存文件名 `.commit-skill-cache.md` 中 `skill` 是冗余修饰，简化为 `.commit-cache.md`。
- **改了什么**（全局 `~/.claude/`，已镜像到 `claude/`）：
  - 全局 `~/.claude/CLAUDE.md` 新增「## 文件命名规范（2026-08-10 用户立）」节：英文命名 + 尽可能简单（删冗余修饰词，示例 `.commit-skill-cache.md` → `.commit-cache.md`）；边界——不牺牲语义清晰（压到语义不明即过度简化）；存量文件改名须同步更新所有引用处。
  - 全局 commit skill `SKILL.md`：全部 9 处 `.commit-skill-cache.md` 引用改为 `.commit-cache.md`（description、核心定位、第 9 步、xhqing 例外段、9e/9j/9k 不写标记段、缓存专用载体文件段等）。
  - **同步镜像**：`claude/CLAUDE.md`、`claude/skills/commit/SKILL.md` 随全局逐字节一致；diff 验证通过。

### 变更（全局 CLAUDE.md「超集关系」节再修订：CLAUDE.md 内容是「新增」而非「覆盖」，冲突以子项目为准，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户于 2026-08-10 同日再次纠正——Agent 项目 `CLAUDE.md` 内容进子项目不是「覆盖」，而是「**新增**」：子项目原有的 `CLAUDE.md` 内容**保持不变**，Agent 的内容加进去；两者放一起后**不能有逻辑冲突**（身份矛盾、规则打架、职责冲突等），**若有冲突以子项目原有的内容为准，且必须向用户汇报冲突内容**（冲突双方各是什么、怎么处理的）。原「覆盖到子项目」表述会误导为覆盖掉子项目原有内容。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 超集关系节总述：`CLAUDE.md` 的**内容**同样「覆盖到子项目」改为「**新增到子项目**」；「子项目独有内容保留不动」括注补「子项目原有的 `CLAUDE.md` 内容」。
  - 「`CLAUDE.md` 内容同样超集」条：明确**做法是「新增」而不是「覆盖」**——子项目原有内容保持不变、Agent 内容新增进去（置于原有内容之前 / 之后均可）；新增**逻辑冲突约束**：两者放一起不能有逻辑冲突，发现冲突以子项目原有内容为准、必须向用户汇报冲突内容；Agent 内容更新时同步新增 / 更新子项目对应内容、子项目原有内容始终保留不动。
  - 实例清单两处（「子项目清单」「边界」）：补入 PersonalAssistantAgent（Kit）→ xhqing（用户 GitHub 个人主页仓库）。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。

### 变更（全局 CLAUDE.md「超集关系」节：实例清单升级为权威映射表 + 补 Hermes → XPilot，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户指出规则里「当前实例：……」是举例式内联罗列（两处重复——「子项目清单」条、「边界」条），让人误以为只是举例而非权威清单，且两处重复维护会不一致；同时用户新增子项目 XPilot 交由 Hermes（NetOpsAgent）负责，需登记进映射。要求所有超集关系映射写清楚、单一权威来源。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 超集关系节新增「**超集关系映射（完整清单，权威）**」表格，列出全部 Agent → 子项目映射：BackendEngineerAgent（Anvil）→ CC-BRIDGE、PersonalAssistantAgent（Kit）→ xhqing、NetOpsAgent（Hermes）→ XPilot（本次新增）；并要求新增 / 变更子项目时以此表为准、同步更新对应 Agent 项目 `.claude/CLAUDE.md` 的「子项目清单」节。
  - 「子项目清单」「边界」两处原来的「当前实例：……」内联罗列，改为引用上方映射表（消除两处重复、单一来源）。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。

### 变更（全局 CLAUDE.md「超集关系」节修订：CLAUDE.md 内容同样超集、效果等价即可，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户明确要求 Agent 项目 `CLAUDE.md` 的**所有内容**也保持超集关系——不要求逐字节一致、不要求放在同名文件，只要效果等价（子项目会话能加载 / 看到 Agent 的全部规则）即可；最简单是把 Agent 项目 `CLAUDE.md` 内容直接加进子项目 `CLAUDE.md`，也可放子项目 `rules/` 下再 `@` 引用。原「`CLAUDE.md` 例外（各项目独有、只要求归属说明）」表述已不再成立，需修订。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 「Agent 项目与子项目的 `.claude/` 超集关系」节总述：补「`CLAUDE.md` 的**内容**同样覆盖到子项目（实现方式不限、效果等价即可）」。
  - 「`CLAUDE.md` 例外」条改为「`CLAUDE.md` 内容同样超集（实现方式不限，效果等价即可）」：内容须完整覆盖到子项目，但方式不限——直接加进子项目 CLAUDE.md 或放子项目 `rules/` 下 `@` 引用均可；建议带指代说明（如「以下为 BackendEngineerAgent（Anvil）CLAUDE.md 全文，其中『本项目』均指 BackendEngineerAgent」）避免指代混淆；Agent 项目 `CLAUDE.md` 内容更新时同步更新子项目对应内容。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。

### 变更（全局 CLAUDE.md 新增「Agent 项目与子项目的 `.claude/` 超集关系」节，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户要求把「Agent 项目与所属子项目之间 `.claude/` 超集关系」立为**全局规则**——该关系存在于所有 Agent 项目与其负责的子项目之间，需在全局注明（此前仅写在 BackendEngineerAgent 项目级 CLAUDE.md）。目的：保证用户只操作子项目（如 CC-BRIDGE）时，子项目的 `.claude/` 也包含 Agent 项目的完整内容，体现项目归对应 Agent 负责。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 新增「## Agent 项目与子项目的 `.claude/` 超集关系（2026-08-10 用户立）」节，要点：Agent 项目 `.claude/` 为权威源、子项目 `.claude/` 为超集（除 `CLAUDE.md` 外每个文件逐字节一致、子项目独有内容保留不动）；Agent 项目 `.claude/` 内容变更（新增 / 修改 / 删除）自动同步到所有子项目、无需询问；子项目清单由各 Agent 项目 CLAUDE.md 维护（当前实例：Anvil → CC-BRIDGE）；`CLAUDE.md` 各项目独有、不逐字节同步、只要求子项目含「由该 Agent 负责」的归属说明；同步后 diff 验证；源变更记 Agent 项目 CHANGELOG、同步不重复记子项目 CHANGELOG；`settings.local.json` 同样同步、子项目 `.gitignore` 缺忽略规则一并补上；边界：目前仅 BackendEngineerAgent → CC-BRIDGE 一例。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。

### 变更（全局 CLAUDE.md 智能体命名注册表新增 Anvil 行 + 位置说明，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户新建后端开发工程师 Agent（`BackendEngineerAgent`，拟人名 **Anvil**），按「新建带拟人名的 Agent 时自动维护注册表（免确认）」规矩，需向全局 CLAUDE.md 的智能体命名注册表追加新成员行，并在「销售流水线顺序」段补位置说明。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/`）：
  - 注册表表格新增一行：**Anvil** | BackendEngineerAgent | 后端开发工程师 | 负责所有后端开发工作（服务端逻辑 / API / 数据库 / 系统架构 / 桥接服务），目前在手 CC-BRIDGE（Claude Code 上游桥接框架），独立于销售流水线。
  - 「销售流水线顺序」段：独立 agent 名单补入 Anvil（Kit、Victor、Tinker、Prometheus、Markowitz、Hermes、Anvil 各自独立）。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；diff 验证通过。

## 2026-08-10

### 变更（新增全局 rules「Windows SSH 远程操作规范」+ 全局 CLAUDE.md 补齐 rules `@` 引用区，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户为 Mac 本机配置了经 SSH 管理同一局域网 Windows 机器的通道（`~/.ssh/config` 别名 `win-ai`、专用密钥免密登录普通权限账户），并要求把「`ssh win-ai` 只能用于普通权限操作、管理员凭据仅限人工应急」立为**全局操作规范**（对所有 agent 会话生效）。同时发现全局 CLAUDE.md 此前没有 rules `@` 引用区（既有 3 个 rules 文件未被引用，属「漏加载」违规），按「rules 文件必须在 CLAUDE.md 中 @ 引用」纪律一并补齐。属全局通用能力（rules 增补 + CLAUDE.md 规矩补齐），按「底层通用能力开源」自动同步规矩镜像到本项目 `claude/`。
- **改了什么**（全局 `~/.claude/`，已镜像到 `claude/`）：
  - **新增全局 rules**：`rules/windows-ssh-ai-operation.md`——对 Windows 机器的操作**默认**经 `ssh win-ai`（公钥免密、普通权限账户）执行；**需要管理员权限时先征求用户同意**、同意后以管理员身份（`ssh win-ai-admin`）执行本次操作（默认不主动使用管理员权限）；两条通道都是公钥免密，无需也不应使用密码文件；记录连接方式只用别名 + 占位符、不把真实 IP / 用户名写进会被 git 跟踪的文件。规则正文不写任何真实连接信息（IP、用户名、密码），clone 者按本机 `~/.ssh/config` 自行适配。（当日按用户要求两次修订：初稿曾写「管理员凭据仅限人工应急」，用户纠正为「管理员权限 AI 也可用、只是需征求同意」；随后按用户要求给管理员账户也配置了公钥免密通道，规则同步改为两条免密通道 + 密码文件退役）
  - **全局 `~/.claude/CLAUDE.md` 末尾新增「工作规则（全局 rules 显式引用）」节**：`@` 引用新增的 `windows-ssh-ai-operation` 及既有 `file-operation-priority-rules` / `tmp-dir-for-artifacts` / `verify-before-report` 三条（此前未被引用 = 漏加载，本次补齐）。
  - **同步镜像**：`claude/rules/windows-ssh-ai-operation.md` 与 `claude/CLAUDE.md` 随全局逐字节一致；`diff -r` 验证 rules / CLAUDE.md 均一致。

## 2026-08-10

### 变更（新增全局 skill `win-ai-monitor`——Win-AI 操作监视台，随自动同步规矩镜像到 `claude/skills/`）

- **为什么改**：用户配置了经 SSH 管理 Windows 机器（`win-ai` / `win-ai-admin`），并要求「AI 在 Win 上执行操作时全程可见」。经多轮调试（Session 0 隔离导致窗口不可见、脚本编码、GUI 事件作用域等），最终用「计划任务 XML（InteractiveToken）+ PsExec `-i 2` 投递到用户会话 + WinForms GUI 全屏置顶窗体」打通，用户确认窗口可见。为固化这套方案、避免下次重折腾，按用户要求写成全局 skill。
- **改了什么**：
  - 新增 `skills/win-ai-monitor/`：`SKILL.md`（触发说明 + 启动步骤 + 写日志方法 + 重建流程 + 关键坑清单）+ `scripts/monitor-gui.ps1`（全屏置顶 GUI 监视窗口）+ `scripts/start-monitor.ps1`（清理残留 → psexec 投递 → 触发任务 → 验证）+ `scripts/winaimonitor-task.xml`（登录自启任务模板）。
  - 核心规矩：**每次启动必须全屏 + 窗口最上层（TopMost）**；写 `.ps1` 必须带 UTF-8 BOM；GUI Timer 用全局变量。
  - 同步镜像：`claude/skills/win-ai-monitor/` 与全局逐字节一致。

## 2026-08-10

### 变更（`win-ai-monitor` skill 重构：从「全屏置顶监视台」改为「桌面代理 + 后台监视台」的窗口按需切换方案，随自动同步规矩镜像到 `claude/skills/`）

- **为什么改**：用户在多轮实测后明确需求——不是「监视台永远置顶」，而是「**操作哪个窗口，哪个窗口最大化置顶**」：执行命令时弹置顶终端窗口显示输入输出，操作 VSCode / Edge / 飞书等程序时把对应窗口置顶；任务栏始终保留；监视台只做后台记录、不抢焦点。旧版「全屏置顶监视台」会挡住一切窗口，已不合用。
- **改了什么**：
  - **SKILL.md 重写**：核心机制从「全屏置顶监视台」改为「桌面代理（win-ai-agent）+ 后台监视台」。代理指令 `EXEC <命令>`（弹最大化置顶终端执行命令、打印输入输出）、`TOP <进程名>`（任意窗口最大化置顶，如 `TOP Code` 置顶 VSCode）；新增启动/重启、清理残留 AI-CMD 窗口、重建流程；关键坑补「任务栏恢复」（不要隐藏任务栏，万一消失须在用户会话重启 explorer）、`$Args` 自动变量坑。
  - **scripts/ 更新**：新增 `win-ai-agent.ps1`（代理 v7，支持任意窗口置顶）、`winaiagent-task.xml`（代理登录自启任务）；`monitor-gui.ps1` 改为后台记录版（不置顶、不抢焦点、可覆盖）；移除废弃的 `start-monitor.ps1`（旧控制台方案）。
  - **验证**：多窗口连续切换测试通过（TOP Code / TOP msedge / TOP Feishu / EXEC 终端均正常最大化置顶，任务栏保留）。
  - **同步镜像**：`claude/skills/win-ai-monitor/` 与全局逐字节一致。

## 2026-08-09

### 变更（通用能力开源改单一出口：新建 agent 项目不再放通用能力副本 + 全量同步镜像 + 各项目副本清理）

- **为什么改**：用户立新规则——新建 Agent 项目**不再放置与全局重复的通用能力**（anysearch、find-skill、通用三件套等），通用能力开源分发统一经本项目 `claude/` 镜像一次性完成。直接触发是 2026-08-09 新建 NetOpsAgent 时发现副本易过期分叉（anysearch `runtime.conf` 副本与全局不一致、find-skill 副本多出 `.env.example`）；此前各项目各自放副本、通用能力一改就要同步所有项目，维护成本高且必然漂移。属全局通用能力（CLAUDE.md 规矩修订 + 镜像扩充 + 各项目副本清理），按「底层通用能力开源」自动同步规矩镜像到本项目 `claude/`。
- **改了什么**（全局 `~/.claude/CLAUDE.md`，已镜像到 `claude/CLAUDE.md`）：
  - **新增「通用能力开源单一出口」节（2026-08-09 立）**，取代原「skill 项目副本的存在原因」：新建 Agent 项目一律不放与全局重复的通用能力；通用能力经本项目 `claude/` 镜像统一开源；边界为只管新建项目，既有项目副本不做强制回退。
  - **「新建 Agent 项目的脚手架与开源约定」修订**：「每个项目都复制 skills / rules / commands」改为「不复制通用能力，只放角色专属内容 + 项目级配置」。
  - **anysearch / find-skill 两个同步小节**：同步范围收为「已存在副本的既有项目」，新建项目不再放置。
  - **「rules 文件必须在 CLAUDE.md 中 @ 引用」节补充边界**：项目级 `@` 引用针对项目自有的 `.claude/rules/` 文件。
  - **注册表 Prometheus 职责行更新**：职责加入「通用能力开源单一出口（新建 agent 项目不再分发副本，既有项目副本按需维护）」。
- **改了什么**（镜像扩充，`claude/skills/` 补 5 个缺失 skill + manifest）：
  - 补入全局存在、镜像缺失的 `agent-reach`、`ef-broadcast`、`ef-communication`、`ef-profile`、`ef-trading` 5 个 skill 与 `.ef-manifest.json`（EigenFlux 技能元数据）；`diff -r` 验证后 skills / rules / CLAUDE.md 三部分与全局逐字节一致（`find-skill/.env` 与 `cache/` 本机数据仍由 `.gitignore` 隔离，为唯一允许差异）。
- **改了什么**（各 agent 项目副本清理，用户 2026-08-09 授权统一执行）：
  - NetOpsAgent（新建）：删除 `.claude/skills/anysearch/`、`find-skill/`、`.claude/rules/` 通用三件套、`.claude/commands/install-skill.md`，`.gitignore` 去 find-skill 条目，`.claude/CLAUDE.md` 注明「通用能力从全局 / 本项目镜像获取」，CHANGELOG 记「移除」条目。
  - 既有 6 个老项目统一清理：DataAnalystAgent、DigiVendAgent、GrowthMarketerAgent、PersonalAssistantAgent、ProductProducerAgent、SiteBuilderAgent 删除 `.claude/skills/anysearch/`、`find-skill/`、`install-skill.md` 与通用三件套 rules（保留各自角色专属内容，如 DigiVendAgent 的 `vend`、SiteBuilderAgent 的 `site-builder`、销售流水线专属 rules）；各项目 `.gitignore` 去 find-skill 条目；PersonalAssistantAgent 的 `.claude/CLAUDE.md` 更新通用能力引用为「从全局 / 本项目镜像获取」；QuantStrategistAgent 虽无 anysearch / find-skill 副本，其遗留的配套 `install-skill.md` 命令一并删除。5 个项目无 CHANGELOG（历史遗留未按标配补齐），清理记录统一记本文件、由 commit skill 在其 `/commit` 时补 CHANGELOG / VERSION 标配。

## 2026-08-05

### 变更（撤销 todo-skill、待办管理改回项目根 TODO.md / TODO-archive.md 文件制，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户决定撤销 2026-08-05 当日刚立的 todo-skill 机制——待办管理不需要专门的 skill，方法论直接写进全局 CLAUDE.md 即可对所有项目生效；数据文件放项目根（项目通用位置、天然存在、不依赖 skill 加载），省去维护 skill 本体及各项目副本的负担。属全局通用能力（CLAUDE.md 规矩修订 + 删除通用 skill），按「底层通用能力开源」自动同步规矩（2026-08-01 用户立：发现分叉直接同步、无需询问）镜像到本项目 `claude/`。
- **改了什么**：
  - 全局 `~/.claude/CLAUDE.md`「待办（todo）管理走 todo-skill」节修订为「待办（TODO）管理：项目根 TODO.md 与 TODO-archive.md」：数据文件改放**项目根**（`TODO.md` 活跃只放未完成 + `TODO-archive.md` 归档已完成 / 已更新）、不设 skill、不依赖 skill 加载；原 SKILL.md 方法论全文吸收进本节（文件结构、待办条目格式、四步使用流程、边界），核心规矩全部保留（记录时间戳精确到分钟 / 前后矛盾以最新时间戳为准 / 做完改动闭环归档 / 不删已处理条目 / 敏感信息占位符）。
  - **删除 todo-skill**：全局 `~/.claude/skills/todo/` 与本镜像 `claude/skills/todo/` 删除（SKILL.md 方法论已并入全局 CLAUDE.md 节、无信息丢失）；DayTradingAgent 项目副本 `.claude/skills/todo/` 同步删除、其 TODO 数据文件移回项目根（见 DayTradingAgent CHANGELOG 2026-08-05）。
  - **同步镜像**：`claude/CLAUDE.md` 随全局逐字节一致；`diff -r` 验证 skills / rules / CLAUDE.md 三部分均一致（todo 在全局与本镜像两边均不存在）。

### 变更（全局 CLAUDE.md「待办统一存项目根 TODO.md」修订为「待办管理走 todo-skill」+ 新建全局 todo-skill，随自动同步规矩镜像到 `claude/`）

- **为什么改**：用户决定把待办管理机制从「各项目根 TODO.md 单文件（未完成与已处理混放）」改为 todo-skill 制——`TODO.md` 只放未完成条目、已完成 / 已更新条目归档到 `TODO-archive.md`，使「还有哪些没做」一眼全览。属全局通用能力（CLAUDE.md 规矩修订 + 新通用 skill），按「底层通用能力开源」自动同步规矩（2026-08-01 用户立：发现分叉直接同步、无需询问）镜像到本项目 `claude/`。
- **改了什么**：
  - 全局 `~/.claude/CLAUDE.md`「待办（todo）统一存项目根 TODO.md」节整体修订为「待办（todo）管理走 todo-skill（2026-08-05 改为 todo-skill 制）」：数据文件改放各项目 `.claude/skills/todo/`（`TODO.md` 活跃只放未完成 + `TODO-archive.md` 归档已完成 / 已更新）；闭环流程由「标记保留在原文件」改为「条目移入归档」；原「时间戳精确到分钟 / 前后矛盾以最新时间戳为准 / 不删已处理条目」等核心规矩保留、细节指针到 todo-skill。
  - **新建全局 todo-skill**（`~/.claude/skills/todo/`，本镜像 `claude/skills/todo/`）：`SKILL.md` 方法论——文件结构（SKILL.md 全局权威逐字节一致 / TODO.md 活跃 / TODO-archive.md 归档，后两者为各项目数据不同步）、待办条目格式（记录时间戳）、四步使用流程（记录 / 查询 / 完成更新闭环 / 矛盾以最新为准）、边界（不污染规范文档、敏感信息占位符）。按 skill-creator 方法论写（pushy description、Progressive Disclosure、主文件精简）。
  - **同步镜像**：`claude/CLAUDE.md` 与 `claude/skills/todo/SKILL.md` 随全局逐字节一致；`diff -r` 验证 skills / rules / CLAUDE.md 三部分均一致。
- **边界**：todo-skill 属通用 skill，各业务 agent 项目按需自行建立 `.claude/skills/todo/` 数据文件（DayTradingAgent 已先行落地：待办拆分 10 未完成 + 29 归档、项目根 TODO.md 移除，见其 CHANGELOG 2026-08-05；其它项目沿用旧制或按 todo-skill 迁移由各项目决定）。

## 2026-08-04

### 变更（项目说明 CLAUDE.md 从根目录迁入 `.claude/`，并订正正文残留的「项目根本目录」措辞）

- **为什么改**：项目说明 `CLAUDE.md` 原在仓库根目录，但它属项目级内容（非通用能力主体），放进 `.claude/`（本项目独有的项目级能力目录）与 capability-manager skill 等项目级能力同处一处更合理、根目录也更干净。迁入后正文仍写「项目根本目录的这个 `CLAUDE.md`」，与新位置 `.claude/CLAUDE.md` 不符，需订正。
- **改了什么**：
  - **迁入**（提交 `6b8650d`，纯重命名、内容未变）：`CLAUDE.md` → `.claude/CLAUDE.md`。
  - **订正措辞**：正文「项目根本目录的这个 `CLAUDE.md`」改为「本文件（`.claude/CLAUDE.md`）」，与新位置一致；其余内容（通用能力主体在 `claude/`、`.claude/` 为项目级能力目录、缓存独立到 `.commit-skill-cache.md` 等）不变。

### 新增（capability-manager skill：把 Prometheus 的通用能力维护流程固化成可执行 skill，消除 README 历史死链）

- **为什么改**：capability-manager skill 此前只是双语 README 里的一句引用文字（链接 + 激活段说明），从未作为 skill 实体存在——README 链接是死链，2026-08-03「遗留问题收尾」条目当时把英文版链接改指向 `claude/CLAUDE.md`、中文版仍指向不存在的 skill。用户要求新建该 skill，把 Prometheus（通用能力管家）的通用能力维护 / 跨项目同步 / fleet 注册表流程固化成可执行 skill，让 README 引用真正有效。
- **改了什么**：
  - **新建 capability-manager skill**（权威源 `claude/skills/capability-manager/`）：`SKILL.md` + 3 个 references（`sync-flow.md` 三层同步与一致性核对、`content-lifecycle.md` 改通用能力内容全链路、`registry-and-scaffolding.md` fleet 注册表与新项目脚手架）。定位为 Prometheus 的**轻量操作手册**——与 CLAUDE.md 分工：CLAUDE.md 管规则（S 级、始终在场），本 skill 管「按场景的 step-by-step 流程 + 护栏 checklist + 命令模板」，**引用 CLAUDE.md 规则、不重复**。覆盖 3 场景：改通用能力内容 / 三层同步与一致性核对 / fleet 扩展。按 skill-creator 方法论写（pushy description、Progressive Disclosure、SKILL.md <500 行、详情拆 references）。
  - **同步全局**：`cp -R` 到 `~/.claude/skills/capability-manager/`，`diff -r` 验证权威源与全局逐字节一致。capability-manager 是 Prometheus 专属 skill，不分发到各业务 agent 项目。
  - **修正双语 README 死链**：`README.md` 与 `README_cn.md` 的 skill 链接从 `.claude/skills/capability-manager/SKILL.md`（带点、不存在）改为 `claude/skills/capability-manager/SKILL.md`（不带点、权威源真实位置），死链消除。

### 变更（英文版 README 按中文版暂存区基准同步）

- **为什么改**：中文版 `README_cn.md` 已在暂存区做过精简（删「不是传统软件项目」引用块、删「经中枢同步」要点、精简核心工作流段等），英文版需对齐到同一基准。
- **改了什么**：英文版 `README.md` 删「This is not a traditional software project...」引用块、删「Sync through the hub」要点、精简 Core workflow 段（删大段说明 + anysearch/find-skill 详细规则）、激活段删「sync a common skill across agent projects」、第一条要点按基准改为「Global is authoritative」。
- **已知矛盾（留待用户定夺，非本次回归）**：中文版基准的「全局为权威」与 2026-08-03 架构调整（本项目 `claude/` 为唯一权威源、全局为镜像）字面冲突——会话中已提醒用户，用户选择照中文版基准同步。日后若要统一权威方向表述，需同步修订双语 README「Who is Prometheus」段的第一条要点。
  > **2026-08-04 后续（见下一条）**：本条所述矛盾已由「架构反转」消除——权威方向反转后「全局为权威」成为正确表述，README 不再需要改。

### 变更（架构反转：全局为权威源、本项目 `claude/` 为镜像；同步范围收为三部分、去掉 commands/）

- **为什么改（用户 2026-08-04 立）**：2026-08-03 把权威源定在本项目 `claude/`（全局为镜像），但同文件的 anysearch / find-skill 同步节一直写「全局为权威副本」，两边内部矛盾；且全局 `~/.claude/` 才是所有项目运行时实际加载的「活」源头，以它为权威更贴合使用。用户决定反转：**全局 `~/.claude/` 为唯一权威源，本项目 `claude/` 为开源镜像**；同时把同步范围从四部分（含 `commands/`）收为**三部分**（skills / rules / CLAUDE.md），`commands/` 各处自行管理、不进同步。
- **改了什么**：
  - **CLAUDE.md 元规范**（`claude/CLAUDE.md` + 全局镜像）：「底层通用能力开源」节整节重写——标题改「全局权威 ↔ 本项目镜像，三部分时刻一致」；权威方向段反转（全局权威、`claude/` 镜像、先落全局再镜像 `claude/`）；范围段收为三部分（不含 `commands/`、不含项目级专属 skill、不含 `settings.json`）；目录布局 / 为什么 / 怎么验证 / 同步关系 / 自动同步 / CHANGELOG 各段配套反转。另改 3 处配套表述（anysearch / find-skill 同步节的「权威源层级」→「三部分镜像之一」、注册表 Prometheus 行的「权威源 `claude/`」→「全局为权威源、`claude/` 为镜像」）。同步全局，diff 验证逐字节一致。
  - **capability-manager skill 挪位 + 内容反转**：从 `claude/skills/capability-manager/`（原通用权威位置）挪到 `.claude/skills/capability-manager/`（**项目级专属**，不进通用同步体系）；清理 `claude/skills/` 与全局 `~/.claude/skills/` 里的 capability-manager 副本。SKILL.md + 3 个 references（sync-flow / content-lifecycle / registry-and-scaffolding）内容全部按新架构反转（全局权威、`claude/` 镜像、三部分、去 `commands/`）。
  - **项目根 `CLAUDE.md`**：开头段改——「四部分」→「三部分」、「通用能力底座权威源」→「全局权威源的开源镜像」、补 capability-manager 在 `.claude/` 的说明。
  - **`CHANGELOG.md` 头部说明**：「四部分」→「三部分」、「权威源」→「开源镜像仓库」、补权威方向反转注明。
  - **双语 README 链接**：capability-manager skill 链接从 `claude/skills/...`（原权威位置）改为 `.claude/skills/capability-manager/SKILL.md`（项目级新位置）。README 权威表述（「全局为权威」）经反转后正好符合新架构，无需改动——上一条「英文 README 同步」遗留的权威方向矛盾就此消除。
- **顺带消除的内部矛盾**：2026-08-03「`claude/` 权威」与 anysearch / find-skill 节「全局权威」的打架，反转后统一为「全局权威」，自洽。

### 移除（英文版 README 删除 Domain 徽章）

- **为什么改（用户 2026-08-04 立）**：用户认为英文版 `README.md` 顶部的 Domain 徽章不需要——它标注的「claude」域信息对读者价值有限，且中文版 `README_cn.md` 本就没有 Domain 徽章，删后双语 README 的徽章行也更一致。
- **改了什么**：`README.md` 删除原第 10 行的 `[![Domain](https://img.shields.io/badge/Domain-claude-F97316.svg)](#)`，徽章行剩 License / Last Commit / Type 三个。

## 2026-08-03

### 变更（commit skill 缓存载体独立：从项目级 `CLAUDE.md` 迁到专用文件 `.commit-skill-cache.md`）

- **为什么改（用户 2026-08-03 立）**：用户要求 commit skill 的检测缓存标记**不再寄生在项目级 `CLAUDE.md` 里**，改由一个**专用文件**承载——`CLAUDE.md` 应只放项目说明，缓存是 commit skill 的运行状态、性质不同，混在一起既污染项目说明、也让 `CLAUDE.md` 因缓存频繁变动。机制上 commit skill 第 9 步后检测时**专门找这个文件、不存在就新建**。
- **改了什么**：
  - **commit skill（权威源 `claude/skills/commit/SKILL.md` + 全局镜像）**：把缓存载体从「项目级 `<项目根>/CLAUDE.md`」整体换成「项目根 `.commit-skill-cache.md`」——① `description` 与「核心定位」概述的「齐全则在项目级 `CLAUDE.md` 标记」改为「在项目根 `.commit-skill-cache.md` 标记」；② 第 9 步开头「先读项目级 `CLAUDE.md`」改为「先读项目根 `.commit-skill-cache.md`（不存在则视为无缓存、稍后新建）」；③ `xhqing` Profile 例外段的「与 CLAUDE.md 缓存读写」同步改；④ 9e/9j/9k 三处「项目级 CLAUDE.md 缓存段不写 `automemory`/`version-staleness`/`version-consistency` 标记」改为「`.commit-skill-cache.md` 不写……」；⑤ 「CLAUDE.md 检测缓存」整段重写为「`.commit-skill-cache.md` 检测缓存」——明确它是**专用载体文件**（不存在→新建、只含缓存内容、**不碰项目 `CLAUDE.md`**），commit skill **不再在项目 `CLAUDE.md` 里写缓存**；缓存模板顶部加文件头说明（这文件由 commit skill 自动维护、勿手改）+ 标题从二级 `##` 升为文件级一级 `#`；⑥ 「例外仅七类」编辑授权清单两处（核心定位段 + 注意段）的②「项目级 `CLAUDE.md` 追加缓存段」改为「项目根 `.commit-skill-cache.md` 写入缓存标记（不存在则新建）」；⑦ 末尾说明「该 `CLAUDE.md` 与本次补全的……」改为「该 `.commit-skill-cache.md` 与本次补全的……」。
  - **本项目落地**：新建项目根 `.commit-skill-cache.md`，把原寄生在根 `CLAUDE.md` 的九条标记（readme-standard / license / github-about / agent-persona / attribution-name / readme-link-text / repo-sponsors / readme-no-stars-badge / changelog-version）原样迁入；根 `CLAUDE.md` 删除整个「commit skill 检测缓存」段，仅保留项目简要说明，并加一句指向新缓存文件。
  - **文件命名与入库**：专用文件定名 `.commit-skill-cache.md`、放项目根、**进 git**（与原寄生在 `CLAUDE.md` 里同属被跟踪、多机 / clone 者共享检测状态）；点开头表明是工具自动维护的缓存、不与 `CLAUDE.md`/`README.md` 等正式文档并列，`.md` 保留可读性。
  - **同步全局**：`claude/skills/commit/SKILL.md` 覆盖全局 `~/.claude/skills/commit/SKILL.md`，`diff` 验证逐字节一致。
- **落地说明（各 agent 项目）**：commit skill 改读 `.commit-skill-cache.md` 后，各 agent 项目（DayTradingAgent 等）根 `CLAUDE.md` 里**原有的「commit skill 检测缓存」段不再被读取**——属冗余死文字（无害，不影响功能），各项目下次 `/commit` 时会因 `.commit-skill-cache.md` 不存在而全量重检测一次、并新建该文件；旧 `CLAUDE.md` 缓存段可由各项目择机手动删除（不删也无妨）。

### 变更（目录布局迁移：通用能力权威源从 `.claude/` 迁到 `claude/`，`.claude/` 保留为本项目独有的项目级能力目录）

- **为什么改（用户 2026-08-03 立）**：用户决定把开源出去的通用能力底座从 `.claude/` 迁到 `claude/` 目录（不带点）——`claude/` 不会被 Claude Code 自动加载（不是标准配置目录名），它纯粹是本项目「开源给全世界的通用能力」的权威源副本；`.claude/` 目录保留为本项目**独有的项目级能力目录**，放本项目特有、不随通用能力同步的内容。两者分工清晰：`claude/` 管「开源通用能力」、`.claude/` 管「本项目自己的项目级能力」。本项目运行时实际依赖的能力由全局 `~/.claude/` 镜像提供（逐字节一致），不受本次迁移影响。
- **改了什么**：
  - **迁移**：`.claude/CLAUDE.md`、`.claude/rules/`、`.claude/skills/`（含 find-skill 的 `.env` 与 `cache/` 本机数据）整体迁到 `claude/` 对应位置；`.claude/` 目录保留为空，新增 `.claude/README.md` 说明其「项目独有能力目录」定位（目录不空、clone 后可见）。
  - **`claude/CLAUDE.md`（权威源，随后镜像全局）**：① 所有「本项目 `.claude/`」表述改为「本项目 `claude/`」（「底层通用能力开源」节的权威方向、范围、diff 验证命令、自动同步段）；② 该节新增「目录布局」段，说明 `claude/`（开源副本、不被自动加载）与 `.claude/`（项目独有能力目录）的分工；③ anysearch / find-skill 同步节的「所有项目下的副本」限定为「所有 agent 项目下的副本」并注明本项目自身副本在 `claude/`（属权威源层级、由「底层通用能力开源」节管理）；④ 删除 anysearch 节残留的「`runtime.conf` 路径例外」句——该例外在 2026-07-31「runtime.conf 不再特殊对待、逐字节一致」新规后已失效（实际 runtime.conf 就是绝对路径逐字节一致），属当时漏删，本次一并删掉、核心内容清单补入 `runtime.conf`；⑤ 「skill 项目副本的存在原因」节明确本项目副本在 `claude/skills/`、其它 agent 项目仍在各自 `.claude/skills/`（Claude Code 只从那里加载）；⑥ 智能体注册表 Prometheus 行的职责描述补「权威源 `claude/` ↔ 全局 ↔ 各 agent 项目副本」。
  - **项目根文档**：根 `CLAUDE.md` 开头段与 `CHANGELOG.md` 头部说明改为 `claude/`，并注明 `.claude/` 保留为项目独有能力目录；`.gitignore` 的 find-skill 忽略路径从 `.claude/skills/find-skill/` 改为 `claude/skills/find-skill/`（`.claude/settings.local.json` 条目保留，`.claude/` 目录仍在使用）；`README.md` / `README_cn.md` 同步修订（见下一条目）。
  - **同步全局**：`claude/CLAUDE.md` 覆盖全局 `~/.claude/CLAUDE.md`，`diff -r` 验证 CLAUDE.md / rules / skills 三部分逐字节一致（find-skill `.env` / `cache/` 为被 `.gitignore` 隔离的唯一允许差异）。
- **其它 agent 项目不受影响**：各 agent 项目的 `.claude/` 仍是 Claude Code 标准加载目录，同步分发照旧（全局 → 各 agent 项目副本）。

### 变更（README 双语：权威源与目录布局描述随迁移更新）

- **为什么改**：README 的「全局为权威」表述停留在迁移前旧架构（2026-07-31 已改为本项目为权威源，README 滞后未更新）；本次目录迁移后，README 里「仓库行为由 `.claude/` 塑造」「项目副本」等描述也与新布局不符，需一并对齐。
- **改了什么**：`README.md` 与 `README_cn.md` 双语同步——①「仓库即 agent、行为由 `.claude/` 下的 skills/rules 塑造」改为 `claude/`；②「Global is authoritative / 全局为权威」改为「仓库 `claude/` 是权威源，全局 `~/.claude/` 是镜像，各 agent 项目 `.claude/` 取副本」；③ 核心工作流段的「权威副本在 `~/.claude/`」改为「权威副本在仓库 `claude/`，镜像到全局、再复制进各 agent 项目 `.claude/`」；④ anysearch 同步规则描述同步删除 `runtime.conf` 路径例外（与权威源 CLAUDE.md 一致）；⑤ 文末 skill 链接前缀 `.claude/` 改为 `claude/`。

### 变更（遗留问题收尾：README 去 stars 徽章 + 修死链 + 新建 VERSION + 补缓存标记）

- **为什么改（用户 2026-08-03 指示「这几个问题主动修改一下」）**：上一轮目录迁移汇报时指出的三个历史遗留问题——① README 顶部仍挂 GitHub Stars 数量徽章（commit skill 第 9l 步规范禁止，本应等下次 `/commit` 清理）；② 项目根缺 `VERSION` 文件（commit skill 第 9m 步规范「任何项目必须有」）；③ README 文末引用的 `claude/skills/capability-manager/SKILL.md` 实际不存在（历史遗留死链，capability-manager skill 从未建立）。用户指示主动修掉，不等 `/commit`。
- **改了什么**：
  - **README 去 stars 徽章（第 9l 步落地）**：`README.md` 与 `README_cn.md` 顶部徽章行各删掉 `github/stars/` 徽章整行（`?style=social` 变体），保留 License / Last Commit / Type 三枚（符合 9a 徽章组合）+ 自定义 Domain 徽章。**顺带更新 Domain 徽章文字**：`Domain-~%2F.claude` → `Domain-claude`——徽章显示的管辖域随目录迁移从 `~/.claude` 改为权威源 `claude/`，避免读者误解。
  - **修死链**：① `README.md` / `README_cn.md` 文末「完整操作步骤、护栏、fleet 注册表维护」句子的链接从不存在的 `claude/skills/capability-manager/SKILL.md` 改为真实的 `claude/CLAUDE.md`（这些内容实际都写在「底层通用能力开源」「anysearch/find-skill 同步」「智能体命名注册表」等节里），措辞同步微调；② 双语 README「How it's activated」段的「激活后加载 `capability-manager` skill」也一并改为「执行写在 `claude/CLAUDE.md` 里的护栏」——同属对不存在 skill 的引用，全仓库清理干净。
  - **新建 `VERSION`**：按 commit skill 第 9m 步取值顺序——无 `package.json`、无主 manifest、CHANGELOG 顶部无版本号标题 → 取 `1.0.0`。项目内其余文件（README / CHANGELOG）无版本号标注，与 VERSION 无冲突（版本信息一致性检查通过）。
  - **补缓存标记**：项目级 `CLAUDE.md` 检测缓存段追加 `readme-no-stars-badge`（9l）与 `changelog-version`（9m）两条标记——下次 `/commit` 不再重复检测这两项。
- **验证**：README 双语徽章行已无 `github/stars/` 字样；仓库内无 capability-manager 引用残留；VERSION 内容为 `1.0.0`。

### 变更（CLAUDE.md 两条规则边界修订：CHANGELOG 记录纪律与版本信息一致性从「有文件才生效」改为「文件为标配、无条件生效」）

把权威源 `.claude/CLAUDE.md` 与全局 `~/.claude/CLAUDE.md` 同步更新；两边现已逐字节一致。

- **为什么改（用户 2026-08-03 立，承接 commit skill 第 9m 步）**：commit skill 新增第 9m 步规定「任何项目都必须有 `CHANGELOG.md` 与 `VERSION` 两个文件」（缺失自动新建）后，原两条规则的边界「仅在项目根有该文件时生效；没有该文件的项目不受本条约束」与它矛盾——既然文件是标配必建，就不存在「没有文件」的情形，边界里的缺省豁免句成了死文字，且语义上与「标配必建」冲突。遂删掉豁免句、改为「文件为项目标配、规则无条件生效」。
- **改了什么**：
  - **「版本信息一致性」边界**：删掉「仅在项目根有 `VERSION` 文件时生效；没有 `VERSION` 的项目不受本条约束，按各文件原有规则」，改为「`VERSION` 文件为项目标配（2026-08-03 用户立：任何项目都必须有 `CHANGELOG.md` 与 `VERSION` 两个文件，缺失由 commit skill 第 9m 步自动新建）——本规则对任何项目都生效，不存在『没有 `VERSION` 就不受约束』的情况」。后缀差异的判断边界保留不动。
  - **「CHANGELOG 记录纪律」边界**：同样删掉「仅在项目根有 `CHANGELOG.md` 时生效；没有 CHANGELOG 的项目不受本条约束」，改为「`CHANGELOG.md` 为项目标配（……缺失由 commit skill 第 9m 步自动新建）——本规则对任何项目都生效，不存在『没有 CHANGELOG 就不受约束』的情况」。「查」操作免记、盯盘信号记录两条边界保留不动。
  - **commit skill 9m 措辞微调**：原「它们是『CHANGELOG 记录纪律』『版本信息一致性』规则生效的前提」改为「落地载体（这两条规则现无条件生效、无缺省豁免）」——边界修订后规则无条件生效，原「生效的前提」表述与新规则一致性不足。
  - **同步全局**：`~/.claude/CLAUDE.md` 与 `~/.claude/skills/commit/SKILL.md` 均 `cp` 覆盖，`diff` 验证两份逐字节一致。
- **落地说明**：各业务项目（如 DayTradingAgent 等）的 `CLAUDE.md` 若复制过旧版这两条边界，下次改动时可顺带对齐（属各项目自己的落地动作，不记入本 CHANGELOG）。

### 变更（commit skill：规定任何项目必须有 CHANGELOG.md 与 VERSION——新增第 9m 检测项，缺失则自动新建）

把权威源 `.claude/skills/commit/SKILL.md` 与全局 `~/.claude/skills/commit/SKILL.md` 同步更新；两边现已逐字节一致。

- **为什么改（用户 2026-08-03 立）**：用户规定**任何项目都必须有 `CHANGELOG.md` 与 `VERSION` 两个文件**，并要求把它加入 commit skill 第 9 步「项目标配检测」清单——检测到缺失就自动新建。此前这两个文件是「有才生效」的前提（CHANGELOG 记录纪律、版本信息一致性、9j 版本滞后检测、9k 版本号一致性检测都挂「项目根有该文件才查」），现在从「可选」升级为「标配必建」，补齐后 9j/9k 才有对象可查。
- **改了什么**：
  - **新增第 9m 步「CHANGELOG.md 与 VERSION 文件」**（缓存标记 `changelog-version`）：所有项目（`xhqing` Profile 仓库随第 9 步开头例外跳过）检测项目根是否有这两个文件，缺失则自动新建。`VERSION` 新建时版本号取值顺序：① `package.json` 顶层 `version`；② 主 manifest（`manifest.json`/`pyproject.toml`/`Cargo.toml`/`*.csproj`）；③ 已有 `CHANGELOG.md` 顶部最新实际版本标题（仅建 `VERSION` 时可用）；④ 皆无 → `1.0.0`。`CHANGELOG.md` 新建时顶部写 `## [<当前版本号>] - <今天日期 YYYY-MM-DD>`（**不写 `[Unreleased]` 占位**，与 9k「最新实际版本标题须与 VERSION 一致」天然对齐）。本步排在 9j/9k 之后：首次 `/commit` 缺 VERSION 时 9j/9k 按「无 VERSION」跳过、由 9m 创建，自下次 `/commit` 起 9j/9k 正常执行。
  - **同步各处引用，保持 skill 内部自洽**：`description` 与「核心定位」概述、第 9 步开头的「本地检测 / 例外跳过」编号清单（`9a/9b/9d/9g/9h/9k/9l` 与 `9a–9l` 两处）补入 9m；「例外仅六类」编辑授权清单两处（核心定位段 + 注意段）改为「例外仅七类」、补 ⑦「新建 CHANGELOG.md 与 VERSION 文件」；「CLAUDE.md 检测缓存」段的标记计数从「八类」改为「九类」、缓存模板补 `changelog-version` 块、标记说明补一行；汇报段补「CHANGELOG.md 与 VERSION 文件（第 9m 步）的新建结果（缺哪个建哪个 + 版本号取值来源）或已存在确认」。
  - **同步全局**：权威源改动完成后 `cp` 覆盖全局 `~/.claude/skills/commit/SKILL.md`，`diff` 验证两份逐字节一致。
- **落地说明**：各 agent 项目下次 `/commit` 时若缺 `CHANGELOG.md` / `VERSION`，第 9m 步会自动新建（首次运行因缺 `changelog-version` 标记而必查）。

### 变更（commit skill：README 徽章不再展示 GitHub Stars 数量徽章——新增第 9l 检测项 + 9a 徽章组合去掉 stars）

把权威源 `.claude/skills/commit/SKILL.md` 与全局 `~/.claude/skills/commit/SKILL.md` 同步更新；两边现已逐字节一致。

- **为什么改（用户 2026-08-03 立）**：
  - 用户要求 README 的徽章里**不再显示 GitHub Stars 数量徽章**（`img.shields.io/github/stars/<user>/<repo>` 那枚），并让 commit skill 在项目标配检测里兜底保证这条。
  - **必须两处同改、否则 skill 自相矛盾**：commit skill 原第 9a 步的「徽章组合」规则规定「有 remote 用 4 枚徽章」，其中第 2 枚正是 `github/stars/<user>/<repo>?style=social`。如果只新增一个「检测并删除 stars 徽章」的检测项、却不改这条组合规则，每次 `/commit` 会先由 9a 把 stars 徽章补回去、再由新检测项删掉，反复横跳。所以必须同时：① 改 9a 的徽章组合，让它以后不再添加 stars；② 新增检测项，清理已存在（用户手加或历史遗留）的 stars 徽章。
- **改了什么**：
  - **9a「徽章组合」去掉 stars**：有 remote 时从原来的 4 枚（License + stars + last-commit + Type）改为 3 枚（License + last-commit + Type）；并显式注明「不使用 GitHub Stars 数量徽章，已存在的 stars 徽章由第 9l 步清理」。无 remote 情形不变（2 枚：License + Type）。
  - **新增第 9l 步「README 不含 GitHub Stars 数量徽章」**（缓存标记 `readme-no-stars-badge`）：扫描 `README.md` 与 `README_cn.md` 的徽章行，凡 URL 路径含 `github/stars/` 的徽章 → 删除该整行 markdown；其余徽章 / LOGO / 正文一律保留。本步明确**突破 9a「只补不删」原则，仅针对 stars 徽章删除**（不删其它徽章、不动 LOGO 与正文）。两版均无 stars 徽章（或某份文件不存在）→ 写 `readme-no-stars-badge` 缓存标记。与 9a 互补：9a 管「该有的徽章是否齐全」（且不再加 stars），9l 管「清理已存在的 stars」。
  - **同步各处引用，保持 skill 内部自洽**：第 9 步开头的「本地检测 / 例外跳过」编号清单（原 `9a/9b/9d/9g/9h/9k` 与 `9a–9k` 两处）补入 9l；「CLAUDE.md 检测缓存」段的标记计数从「七类」改为「八类」、缓存模板补 `readme-no-stars-badge` 块、标记说明补一行；`description` 在「徽章」处加括注「(不含 GitHub Stars 数量徽章)」；「例外仅六类」编辑授权清单两处（核心定位段 + 注意段）补「移除 GitHub Stars 数量徽章（第 9l 步）」；汇报段补「徽章清单（含移除 GitHub Stars 数量徽章，如有）」。
  - **同步全局**：权威源改动完成后 `cp` 覆盖全局 `~/.claude/skills/commit/SKILL.md`，`diff` 验证两份逐字节一致（均 49033 字节）。
- **落地说明**：各 agent 项目（如本次触发场景 PersonalAssistantAgent）的 README 若仍有 stars 徽章，下次 `/commit` 时第 9l 步会自动检测并删除（首次运行因缺 `readme-no-stars-badge` 标记而必查）。本次 PersonalAssistantAgent 的 `README.md` / `README_cn.md` 已手动删除 stars 徽章（该项目无 CHANGELOG.md，故该处改动不另记）。

## 2026-08-02

### 变更（CLAUDE.md 规矩修订：待办从「todos/ 目录」改为「项目根 TODO.md 单文件」+ 已完成待办打 ✅ 保留不删）

把全局 `~/.claude/CLAUDE.md` 与本项目权威源 `.claude/CLAUDE.md` 的「待办（todo）」一节整体修订，两边现已逐字节一致。

- **为什么改（用户 2026-08-02 立）**：
  - **不再用 `todos/` 目录**：单文件 `TODO.md` 就够用，少一层目录更简单；`TODO.md` 内部按主题分节（`##` 二级标题）即可分类，不必拆成多文件。
  - **已完成待办打 ✅ 保留、不删除**：原来「做完改动就把待办从清单删除」，改成「打 ✅ 标记完成、原条目保留不删」——保留完整的待办记录（当初打算做什么、做没做、什么时候做的），方便日后出问题时回溯排查。
- **改了什么**：
  - 标题从「待办（todo）统一存项目根 todos/ 目录（2026-08-01 用户立）」改为「待办（todo）统一存项目根 TODO.md（2026-08-01 用户立，2026-08-02 修订）」。
  - 存放位置：`项目根的 todos/ 目录` → `项目根的 TODO.md 文件`；「为什么」段补「不再用 todos/ 目录」的理由；「怎么用」段去掉「按主题拆多个文件」、改为「TODO.md 内部按主题分节」。
  - 「前后矛盾的待办以最新时间戳为准」：旧条处理从「要么删除、要么标注被取代」改为「不删除、标注被取代并打 ✅」（与新的「不删除」基调一致）。
  - 「做完改动要闭环」：从「查 todos/ → 删待办 → 记 CHANGELOG」改为「查 TODO.md → 标 ✅ 保留 → 记 CHANGELOG」，明确「不要删除已完成待办条目，保留方便回溯排查」，并建议补完成时间戳 `（完成：YYYY-MM-DD HH:MM）`。
  - 注：各业务项目里现有的 `todos/TODO.md` 需自行迁移到项目根 `TODO.md`、并清理 `todos/` 目录（属各项目自己的落地动作，不记入本 CHANGELOG）。

### 变更（CLAUDE.md 待办规矩补充：已完成 / 已更新双状态标记格式）

把全局 `~/.claude/CLAUDE.md` 与本项目权威源 `.claude/CLAUDE.md` 的「待办（todo）」节里「做完改动要闭环」「前后矛盾的待办以最新时间戳为准」两条，补充**双状态标记格式**；两边现已逐字节一致。

- **为什么改（用户 2026-08-02 立）**：原来待办处理只有「完成」一种状态（`[ ]` 改 `✅` + 完成时间戳）。但实际还有「表述被新决定取代、事还没做完」的情况（如决定从「放弃 signal 改纯 auto」变为「两者共存」，旧待办表述过时但事项未完成）——这种情况用「完成」标记会误标（事没做完），用删除又丢失可追溯。遂引入「更新」状态，与「完成」区分。
- **改了什么**：
  - **标记格式**：「已完成」「已更新」三个字**加粗**以一眼区分两种状态；两种都原条目保留不删（可追溯）。
  - **完成（事情真做完）**：原条目开头 `[ ]` 换成 `✅**已完成**`、补 `（完成：YYYY-MM-DD HH:MM）`，原条目内容不动。
  - **更新（表述 / 决定被新决定取代、事还没做完）**：**原条目内容一字不动**，只在开头把 `[ ]` 换成 `✅**已更新**` + `（更新：YYYY-MM-DD HH:MM）`（标记挂在原条目前面，原标题 / 记录时间戳 / 正文都不改、不塞注释）；然后在下方**另起一段新增一条** `[ ]` 待办写最新决定（带新记录时间戳）。「已被取代」关系靠旧条目标记 + 相邻新条目 + 新时间戳表达。
  - **执行语义（看到 ✅ 即跳过）**：两种状态都使条目退出活跃待办——凡 `✅` 开头的条目（无论 `✅**已完成**` 还是 `✅**已更新**`）都视为已处理、看到即跳过、不再执行；活跃待办只有 `[ ]` 开头的条目（「更新」情况下要执行的是另起一段新增的那条 `[ ]`，不是挂标记的旧条目）。
  - 「前后矛盾以最新为准」条里旧条处理「打 ✅」同步为「打 `✅**已更新**`、原条目内容不动、另起一段新增」（旧条被取代属「更新」状态）。
- **落地**：各业务项目自己的 `TODO.md` 里，已处理待办的标记格式按此新规（如 DayTradingAgent 本次更新模式决定过期待办时已采用 `✅**已更新**`）。

### 新增（CLAUDE.md 硬性规定：Git 暂存区禁止 AI 自主增删改）

在全局 `~/.claude/CLAUDE.md` 与本项目权威源 `.claude/CLAUDE.md` 新增独立一节「Git 暂存区禁止 AI 自主增删改（2026-08-02 用户立，硬性规定）」，紧跟「Git 写操作必须先征得同意」节之后；两边现已逐字节一致。按「能否自主做」把 AI 对暂存区的操作分三层：

1. **AI 能自主做的：只有只读查询**（status / diff / log / show / ls-files / branch 等），无需授权。
2. **需用户明确授权才能做：`git commit`**——授权形式 = 用户主动发起 `/commit`（口头说「提交」、对 AI 列出的 commit 命令点头，都不算）；commit 提交用户已 `git add` 的内容。
3. **禁止（授权也不行）：对暂存区的增、删、改（含移动）**——`git add` / `git stage`（增）、`git rm --cached` / `git reset HEAD <file>` / `git restore --staged` / 影响暂存区的 reset（删）、`git mv` 等（改 / 移动）。

- **为什么新增（用户 2026-08-02 立）**：AI 此前用 `git mv` 移动文件时同步改了暂存区，篡改了用户亲自 `git add` 把关的暂存区内容。立这条硬规，把暂存区钉成「AI 自主只能只读、commit 需用户用 `/commit` 明确授权、增删改含移动一律禁止」，确保暂存区放什么、何时提交都由用户亲自决定，AI 永不替用户改动暂存区、也不擅自提交。
- **回溯修订「Git 写操作必须先征得同意」节**：核心禁令的命令列表里给 `git commit` 加注「仅限 `/commit` 触发、不走本节先征得同意」，指向本节，消除新老规矩的表面冲突。
- **边界**：工作区普通文件操作（不经 git 的 mv / rm / 编辑）不受限；只读不受限；`git commit` 仅限 `/commit` 触发；`git reset --soft`（只移 HEAD、不动暂存区）不在本节禁列（但仍属改仓库历史、受「先征得同意」约束）。

## 2026-08-01

### 新增
- **新建本 `CHANGELOG.md`**：本项目此前无 CHANGELOG。因「同步动作记权威源 CHANGELOG」规矩落地，建立本文件，首条即记本次同步。

### 变更（CLAUDE.md 规矩补充：全局领先 → 同步覆盖权威源）
本次把全局 `~/.claude/CLAUDE.md` 的三处规矩更新同步覆盖到本项目权威源 `.claude/CLAUDE.md`（全局此前已领先，本次一次性对齐，两边现已逐字节一致；`skills` / `rules` / `commands` 本就无 drift）：

- **「发布『最新版』默认指 GitHub Release」补充适用范围限定**：该默认只适用于用户自己的项目；别人的项目按其实际发布渠道（官方 Marketplace、Open VSX、官网等）判断，不默认往 GitHub Release 上靠。
- **「待办统一存 todos/」补充两条**：
  - 每条待办必须附带记录时间戳，格式 `（记录：YYYY-MM-DD HH:MM）`，**至少精确到分钟**（不能只到天）；时间戳记的是「这条待办当前内容的写下 / 更新时间」（不是待办涉及事件的发生时间），改主意重写正文后同步更新为重写那一刻。
  - 前后矛盾的待办以**最新时间戳**为准（旧条删除，或标注「已被 YYYY-MM-DD HH:MM 的条目取代、弃用」）；精确到分钟是为了同一天内多次改主意也能分先后。
- **「底层通用能力开源」补充两条**：
  - 全局与权威源出现分叉时**自动同步对齐**，不再每次询问用户（同步方向仍权威源优先；若全局领先则覆盖回权威源一次性对齐后继续走权威源优先）。
  - 同步动作本身的变更记录**只记本 CHANGELOG**，不记各业务项目 CHANGELOG。

### 变更（中英双语规定：从「纯英文/纯中文」改为「以某语言为主、特殊场景可用任何语言」）

把 GitHub About description、英文版 README、中文版 README 的语言基调规定，从原本硬性的「英文部分纯英文、中文部分简体中文」改为更实用、更严谨的弹性表述：**英文部分以美式英文为主（特殊场景可用任何语言），中文部分以简体中文为主（特殊场景可用任何语言）**。

- **为什么改**：原规定追求「逐字纯净」，commit skill 第 9a 步用「扫描 `README.md` 是否含中文字符、唯一允许跳转链接文字含中文」机械判定，会误伤正文里合理保留的中文专有名词、人名、机构名、产品名、引用原文、代码示例、注音等——这些是必要的内容元素、不是违规。一刀切「纯英文」既不实用（真实 README 常需混入少量其它语言字词）、也不严谨（把合理的特殊场景当成错误）。改为「以某语言为主、特殊场景可用任何语言」后，既保持「英文版主体是英文、中文版主体是中文」的基调，又给必要的中外混排留出合法出口。
- **改了什么**：
  - **`.claude/CLAUDE.md` + 全局镜像**「开源到 GitHub」段：description 的中英双语表述从「英文部分纯英文、中文部分简体中文」改为「英文部分以美式英文为主（特殊场景可用任何语言）、中文部分以简体中文为主（特殊场景可用任何语言）」。
  - **`.claude/skills/commit/SKILL.md` + 全局镜像**：① 第 9a 步把「语言纯度」（机械扫描中文字符、见中文即违规）整体改为「语言基调」（逐处语义判断：属特殊场景的中文保留不动、属「本该用英文却写成中文」的正文才改为英文），并明确 LOGO / 徽章默认用英文（项目名是中文等特殊场景可保留中文）、`README_cn.md` 反向同理（以简体中文为主、必要英文术语保留）；② 第 9c 步 GitHub About description 的中英双语判定与补全同步改为新基调；③ 「只补不删」「例外清单①」「缓存段说明」里的「语言纯度修正」「纯英文」「中文为主」等表述统一更新为「语言基调修正」「以美式英文为主」「以简体中文为主」。
  - **项目根 `CLAUDE.md`** commit skill 检测缓存注释：同步更新 GitHub About 条目里的中英双语规范表述。
- **影响**：commit skill 下次 `/commit` 检测 README 语言时，不再机械地「见中文即改英文」，而是逐处判断是否属特殊场景；属特殊场景的中文（专有名词、人名、引用原文等）保留不动，只有「本该用英文却写成中文」的正文才改为英文。本次改动已同步覆盖全局镜像，`CLAUDE.md` / `skills` / `rules` 三部分核对逐字节一致。
