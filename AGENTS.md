# agents-infra

本项目的通用能力主体（`skills` / `AGENTS.md` / `docs` / `hooks` / `patch` / pi 扩展六部分）位于 `pi/agent/` 与 `pi/agent/extensions/`，是全局权威源（`~/.pi/agent/` 前五部分、`~/.pi/agent/extensions/` 的 pi 扩展）的**开源镜像**（2026-08-04 起权威方向反转：全局为权威、本项目对应目录为镜像），与全局逐字节一致（原 `rules/` 已于 2026-09-12 并入规则文件后删除；`docs/` 于 2026-09-12 拆出参考文档后纳入镜像；`hooks/`、`patch/` 于 2026-09-25 纳入镜像，`patch/` 由 `local/` 改名而来；pi 扩展（`~/.pi/agent/extensions/` 的四个工具强制 `.ts`）于 2026-09-25 纳入镜像）。本文件（项目根 `AGENTS.md`）**不承载通用能力内容**（避免与 `pi/agent/AGENTS.md` 重复或冲突、也不参与「全局 ↔ 本项目镜像六部分逐字节一致」的核对），仅作为本项目的简要说明。`.claude/` 目录为本项目独有的项目级能力目录，放本项目特有、不随通用能力同步的内容（如 capability-manager skill——Prometheus 本项目的专属工具，同步规则详见 `~/.pi/agent/docs/capability-sync.md`）。

commit skill 的检测缓存已独立到项目根 [`.commit-cache.md`](.commit-cache.md)（2026-08-03 起从本文件迁出，2026-08-10 按文件命名规范简化文件名），不再寄生在本 `AGENTS.md` 里。

## 发版声明：不带产物（2026-10-04）

本仓库发版**不带产物**——Release 只含 tag 与 notes，不上传 assets。历史 v1.0.0 的 3 个 skill tar.gz 是当时**借 Release 作备份**的临时用途（用户 2026-10-04 说明），**不代表本仓库的发布惯例**；release skill 的产物核查以本声明为准（未声明产物的项目默认不带产物、直接发布）。
