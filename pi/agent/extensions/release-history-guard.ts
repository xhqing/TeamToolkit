/**
 * 发版历史保留守卫（pi 端，tool_call 拦截，2026-11-12 用户立规）。
 *
 * 规矩：**发版失败一律递进一个版本，失败的 tag 与 GitHub Release 原样保留**——
 * 不删 tag、不删 Release、不移动 tag（`git tag -f` / `git push --force`）、不同版本重试。
 * 文本规则在全局 `~/.pi/agent/AGENTS.md`「发版失败一律递进版本，失败历史原样保留」节与
 * `skills/release/SKILL.md`「构建失败怎么办」节。
 *
 * 为什么需要工具强制：改写 / 删除已发布 tag 是不可逆操作，会让他人手里的引用、缓存的发布
 * 记录、Release 页面的历史证据失真；2026-11-12 曾连续两版构建失败（r19 / r20），当时考虑过
 * 「删掉失败版本重发同一个版本号」的做法，用户明确要求改为递进版本、保留失败历史。
 *
 * 拦截范围（只对 bash 命令生效）：
 * 1. `git tag -d` / `--delete` / `-f` / `--force`（删除或覆盖 tag）；
 * 2. `git push` 带 `--delete` / `-d` / `--force` / `-f` / `--force-with-lease` / `--mirror`
 *    且 refspec 指向 tag（含 `refs/tags/<name>` 与形如版本号的 tag 名）；
 * 3. `git push <remote> :refs/tags/<name>` 或 `:<版本形 tag>` 形态（删远端 tag）；
 * 4. `gh release delete` / `gh release delete-asset`（删除 Release 或其中资产）。
 *
 * 逃生门（仅限用户当轮明确授权，AI 不得自行添加）：命令末尾 `# AI_AUTHORIZED_RELEASE_HISTORY`。
 *
 * 判定失败时 fail-open（与其它守卫一致）：守卫失灵不阻塞会话。
 */

import { execFileSync } from "node:child_process";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const MARK = "AI_AUTHORIZED_RELEASE_HISTORY";

const SEGMENT_SPLIT = /&&|\|\||;|\n|\|/;
const GIT_SEGMENT = /^git(?=\s|$)/;

const DENY =
	"[release-history-guard] 拦截：发版历史原样保留，不许删除或改写已发布的 tag / Release（2026-11-12 用户立规）。" +
	"发版失败时的正确做法：修掉问题 → bump 到下一个版本号（r19 失败 → r20 → r21）→ 重新发版；" +
	"失败的 tag 与 Release 保持原样，可给失败版本的 Release 追加一句「构建失败，由 rN 取代」的说明（只追加，不删改）。" +
	"确需改动历史时须用户当轮明确授权，并在命令末尾加 `# AI_AUTHORIZED_RELEASE_HISTORY`。";

type RepoContext = { dir: string };

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
	return dir.replace(/^~(?=\/|$)/, process.env.HOME ?? "~");
}

function repoContext(segment: string, cwd: string): RepoContext {
	return { dir: repoDirFromSegment(segment, cwd) };
}

/** 解析 `git <subcommand>` 之后的 token（去掉引号）。 */
function tokensAfter(segment: string, subcommand: string): string[] {
	const match = new RegExp(`(?:^|\\s)${subcommand}(?=\\s|$)([\\s\\S]*)$`).exec(segment);
	if (!match) return [];
	return match[1]
		.replace(/["'`]/g, "")
		.split(/\s+/)
		.map((token) => token.trim())
		.filter(Boolean);
}

function isExistingTag(dir: string, name: string): boolean {
	const out = execGit(dir, ["tag", "-l", name]);
	if (!out) return false;
	return out.split("\n").some((line) => line.trim() === name);
}

/** 判断某个 refspec / 名字是否指向 tag（含版本号形态与已存在的 tag）。 */
function looksLikeTag(dir: string, raw: string): boolean {
	let name = raw.replace(/^\+/, "");
	if (name.startsWith("refs/tags/")) return true;
	if (name.startsWith(":")) {
		name = name.slice(1);
		if (name.startsWith("refs/tags/")) return true;
	}
	// `v0.65.2.2-r19` / `1.2.3` 这类版本号形态直接视为 tag。
	if (/^v?\d+(?:\.\d+)+/.test(name)) return true;
	return isExistingTag(dir, name);
}

/** git subcommand（跳过 `-C`、`--no-pager` 等全局选项）。 */
function gitSubcommand(segment: string): string | null {
	return /^git(?:\s+-C\s+(?:"[^"]+"|'[^']+'|\S+)|\s+--\S+)*\s+([a-z-]+)/.exec(segment)?.[1] ?? null;
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (!isToolCallEventType("bash", event)) return;
			const command = event.input.command ?? "";
			if (command.includes(MARK)) return;

			const cwd = process.cwd();
			for (const raw of command.split(SEGMENT_SPLIT)) {
				const segment = raw.trim();
				if (!segment) continue;

				// gh release delete / delete-asset：删除 Release 或其资产属于改写发版历史。
				if (/(?:^|\s)gh\s+release\s+(?:delete|delete-asset)\b/.test(segment)) {
					return { block: true, reason: DENY };
				}

				if (!GIT_SEGMENT.test(segment)) continue;
				const subcommand = gitSubcommand(segment);
				if (!subcommand) continue;

				const context = repoContext(segment, cwd);

				if (subcommand === "tag") {
					const tokens = tokensAfter(segment, "tag");
					const destructive = tokens.some((token) =>
						/^(?:-d|--delete|-f|--force)$/.test(token),
					);
					if (destructive) return { block: true, reason: DENY };
					continue;
				}

				if (subcommand === "push") {
					const tokens = tokensAfter(segment, "push");
					const flags = tokens.filter((token) => token.startsWith("-"));
					const positional = tokens.filter((token) => !token.startsWith("-"));
					// positional[0] 是 remote，其余是 refspec。
					const refspecs = positional.slice(1);

					const destructiveFlag = flags.some((flag) =>
						/^(?:--delete|-d|--force|-f|--force-with-lease(?:=.*)?|--force-if-includes|--mirror)$/.test(
							flag,
						),
					);
					if (destructiveFlag && refspecs.some((ref) => looksLikeTag(context.dir, ref))) {
						return { block: true, reason: DENY };
					}
					// `git push origin :refs/tags/<name>` / `:v1.2.3` 形态（删远端 tag），不带 --delete 也能删。
					if (refspecs.some((ref) => ref.startsWith(":") && looksLikeTag(context.dir, ref))) {
						return { block: true, reason: DENY };
					}
				}
			}
		} catch {
			// fail-open：守卫自身异常不阻塞会话
		}
	});
}