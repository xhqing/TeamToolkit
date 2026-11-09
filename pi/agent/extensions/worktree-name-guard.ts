/**
 * worktree 命名守卫（pi 端，tool_call 拦截，2026-11-09 用户立规）。
 *
 * 规矩：**worktree 目录名必须以「本仓库名」开头，形如 `<仓库名>-<事项>`**。
 * 禁止「其它项目名 / Agent 项目名 + 子项目名」的拼法——例如
 * `~/Developer/FullStackEngineerAgent-turn-diff` 会让人误以为是 turn-diff 子项目的
 * worktree，实际是 FullStackEngineerAgent 主仓库的分支，用户在文件系统里根本看不出归属。
 * 文本规则在全局 `~/.pi/agent/AGENTS.md`「开发流程：worktree + PR」节铁律 1。
 *
 * 判定方式（两种违规都拦）：
 * 1. 目标目录名的**最长前缀**（`T === D` 或 `T.startsWith(D + "-")`）不是本仓库名
 *    （D 取自目标父目录与 `~/Developer` 下的条目名）→ 违规，名字里的第一个项目名必须是本仓库；
 * 2. 前缀是本仓库名、但事项 slug **恰好等于另一个项目 / 目录的名字** →
 *    违规（`FullStackEngineerAgent-turn-diff` 这种「事项撞上子项目名」的形态同样看不出归属）。
 *
 * 逃生门（仅限用户当轮明确授权，AI 不得自行添加）：命令末尾 `# AI_AUTHORIZED_WORKTREE_NAME`。
 * 判定失败时 fail-open：守卫失灵不阻塞会话。
 */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const AUTH_MARK = "AI_AUTHORIZED_WORKTREE_NAME";
const SEGMENT_SPLIT = /&&|\|\||;|\n|\|/;
const WORKTREE_RE = /(?:^|\s)worktree\s+(add|move)(?=\s|$)([\s\S]*)$/;
/** add 里这些选项后面跟一个值（不是路径）。 */
const ADD_VALUE_OPTS = new Set(["-b", "-B", "--orphan", "--reason"]);

const DENY =
	"[worktree-name-guard] 拦截：worktree 目录名必须以「本仓库名」开头（2026-11-09 用户立规）。" +
	"正确写法 `<仓库名>-<事项>`，例如 `~/Developer/turn-diff-fix-empty-diff`；" +
	"禁止 `FullStackEngineerAgent-turn-diff` 这类「其它项目名 / Agent 项目名 + 子项目名」的拼法——" +
	"那样看不出它是哪个项目的 worktree。子项目的工作就在子项目仓库的 worktree 里做：" +
	"`git -C ~/Developer/<子项目> worktree add ~/Developer/<子项目>-<事项> -b <分支>`。" +
	"确需例外时须用户当轮明确授权，并在命令末尾加 `# AI_AUTHORIZED_WORKTREE_NAME`。";

function execGit(dir: string, args: string[]): string | null {
	try {
		return execFileSync("git", ["-C", dir, ...args], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
			timeout: 5000,
		}).trim();
	} catch {
		return null;
	}
}

/** 从 `git -C <path> ...` 里取出 -C 路径；没有则用调用方 cwd。 */
function repoDirFromSegment(segment: string, fallback: string): string {
	const match = /(?:^|\s)-C\s+("([^"]+)"|'([^']+)'|(\S+))/.exec(segment);
	const dir = match?.[2] ?? match?.[3] ?? match?.[4];
	if (!dir) return fallback;
	return dir.replace(/^~(?=\/|$)/, os.homedir());
}

/** 本仓库名：主工作区（worktree list 的第一项）的目录名。 */
function repoNameOf(dir: string): string | null {
	const listed = execGit(dir, ["worktree", "list", "--porcelain"]);
	if (listed) {
		const first = listed.split("\n").find((line) => line.startsWith("worktree "));
		if (first) return path.basename(first.slice("worktree ".length).trim());
	}
	const top = execGit(dir, ["rev-parse", "--show-toplevel"]);
	return top ? path.basename(top) : null;
}

/** 目标父目录 + ~/Developer 下已有的条目名（用来判断前缀归属）。 */
function siblingNames(parent: string): Set<string> {
	const names = new Set<string>();
	for (const base of [parent, path.join(os.homedir(), "Developer")]) {
		try {
			for (const entry of readdirSync(base)) names.add(entry);
		} catch {
			// 目录不存在就跳过
		}
	}
	return names;
}

/** 解析路径参数；含变量 / 命令替换等动态内容时返回 null（放弃判定）。 */
function resolveTarget(raw: string, base: string): string | null {
	const value = raw.trim();
	if (!value || value.includes("$") || value.includes("`")) return null;
	return path.resolve(base, value.replace(/^~(?=\/|$)/, os.homedir()));
}

/** `worktree add` / `worktree move` 的目标路径（语义上「新建的那一个」）。 */
function targetPathOf(action: string, rest: string, base: string): string | null {
	const tokens = rest.replace(/["'`]/g, "").split(/\s+/).filter(Boolean);
	const positional: string[] = [];
	for (let i = 0; i < tokens.length; i += 1) {
		const token = tokens[i];
		if (token.startsWith("-")) {
			if (ADD_VALUE_OPTS.has(token)) i += 1;
			continue;
		}
		positional.push(token);
	}
	const raw = action === "add" ? positional[0] : positional[1];
	if (!raw) return null;
	return resolveTarget(raw, base);
}

/** 返回违规原因；null = 放行。 */
function verdict(targetAbs: string, repoName: string | null): string | null {
	const targetName = path.basename(targetAbs);
	if (!targetName || targetName === "." || targetName === "..") return null;
	if (!repoName) return null;

	const names = siblingNames(path.dirname(targetAbs));

	let prefix: string | null = null;
	for (const name of names) {
		if (targetName === name || targetName.startsWith(`${name}-`)) {
			if (!prefix || name.length > prefix.length) prefix = name;
		}
	}
	// 目标父目录里没有任何已知项目名 → 看不出归属，放行。
	if (!prefix) return null;

	if (prefix !== repoName) {
		return `目标目录名「${targetName}」的前缀是「${prefix}」，但本次操作的是「${repoName}」仓库——第一个项目名必须是本仓库，否则看不出这是哪个项目的 worktree。`;
	}

	const slug = targetName === prefix ? "" : targetName.slice(prefix.length + 1);
	if (slug && names.has(slug) && slug !== repoName) {
		return `目标目录名「${targetName}」的事项部分「${slug}」正好是另一个项目的名字——看着像「${slug}」的 worktree，实际是「${repoName}」的。把事项写成能看出做什么的短语（如 \`${repoName}-rename-subproject\`）。`;
	}

	return null;
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (!isToolCallEventType("bash", event)) return;
			const command = event.input.command ?? "";
			if (command.includes(AUTH_MARK)) return;

			const cwd = process.cwd();
			for (const raw of command.split(SEGMENT_SPLIT)) {
				const segment = raw.trim();
				const match = WORKTREE_RE.exec(segment);
				if (!match) continue;
				if (!/(?:^|\s)git(?=\s|$)/.test(segment)) continue;

				const repoDir = repoDirFromSegment(segment, cwd);
				const target = targetPathOf(match[1], match[2], repoDir);
				if (!target) continue;

				const repoName = repoNameOf(repoDir);
				const reason = verdict(target, repoName);
				if (reason) return { block: true, reason: `${DENY}\n具体问题：${reason}` };
			}
		} catch {
			// fail-open：守卫自身异常不阻塞会话
		}
	});
}
