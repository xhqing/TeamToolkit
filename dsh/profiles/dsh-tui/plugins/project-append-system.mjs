/**
 * dsh-team 项目级 APPEND_SYSTEM 注入插件。
 *
 * 作用：把当前项目（或 worktree）根目录的 `.dsh/APPEND_SYSTEM.md` 追加到
 * DSH 的系统提示末尾，等价于 pi 的 `.pi/APPEND_SYSTEM.md`。
 *
 * 为什么要插件：DSH 自带的 `dsh-agent-instructions` 只读 `AGENTS.md` /
 * `CLAUDE.md` 这类候选文件，不读 `.dsh/APPEND_SYSTEM.md`；dsh-tui 还把
 * host 层的 `agent-instructions` 关掉了，改由 agent preset 决定。所以
 * 项目级的“dsh 团队规则”需要这个插件来注入。
 *
 * 查找规则：从会话 cwd 向上找最近的 `.git`（普通仓库是目录，worktree 是
 * 文件），以它为项目根，读 `<root>/.dsh/APPEND_SYSTEM.md`。Leader 在 agent
 * 项目里 → 读 agent 项目的 dsh 帽子；Worker 在私有子项目 worktree 里 →
 * 读子项目的工地规则。同一个插件，按 cwd 自动切换。
 *
 * 来源：~/.pi/agent/patch/dsh/project-append-system.mjs（公开，随
 * agents-infra 镜像发布）；安装副本在 ~/.dsh/profiles/dsh-tui/plugins/。
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const name = "project-append-system";
export const inject = ["systemPrompt"];

const REL = join(".dsh", "APPEND_SYSTEM.md");

const BANNER = [
	"Runtime: dsh-team (DSH).",
	"The .pi/ directory belongs to pi-team; do not apply its rules.",
	"If you are running under pi, ignore this file.",
].join("\n");

/** 从 cwd 向上找最近含 `.git` 的目录；找不到就退回 cwd。 */
function projectRoot(start) {
	let dir = start;
	for (;;) {
		if (existsSync(join(dir, ".git"))) return dir;
		const parent = dirname(dir);
		if (parent === dir) return start;
		dir = parent;
	}
}

/** 读项目根的 `.dsh/APPEND_SYSTEM.md`，加上运行时横幅；没有就返回 undefined。 */
function readAppend(cwd) {
	const file = join(projectRoot(cwd), REL);
	if (!existsSync(file)) return undefined;
	try {
		const text = readFileSync(file, "utf8").trim();
		return text ? `${BANNER}\n\n${text}` : undefined;
	} catch {
		return undefined;
	}
}

export function apply(ctx) {
	// 同一个 agent 只注册一次 section；resume / clear 可能重复触发 agent/created。
	const registered = new WeakSet();

	ctx.on("agent/created", ({ agent }) => {
		if (!agent || registered.has(agent)) return;
		registered.add(agent);

		const cwd = agent.session?.header?.cwd;
		if (!cwd) return;

		const text = readAppend(cwd);
		if (!text) return;

		agent.ctx.systemPrompt.section({
			name: "project:append-system",
			order: 10300, // 排在 deployment persona suffix（10200）之后
			text,
			interpolate: false, // 规则里的 {{...}} 原样保留，不当变量解析
		});
	});
}