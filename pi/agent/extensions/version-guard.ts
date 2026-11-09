/**
 * 版本一致性守卫（pi 端，tool_call 拦截）：`VERSION` ↔ 群公告版本号必须一致。
 *
 * 2026-10-02 用户立规（social-agent / 原 CommunityManagerAgent 项目规则，硬性规定）：项目根的
 * `VERSION` 与 `docs/community/announcement.txt` 的「版本：」行是同一套编号，
 * bump 一个必须同步 bump 另一个；两者不一致时 commit / tag 一律拦截。为什么
 * 要工具强制：两个版本号此前分属「两套体系」（不比对），实际运行中长期背离
 * （VERSION 停在 0.1.0、公告已到 v1.2.0），靠文本纪律容易漏。
 *
 * 三层同源（规则变更时三处同步改，不能只改一处——「规矩必须配套工具强制」）：
 * 1. 全局 git pre-commit hook（`~/.config/git/hooks/pre-commit`）——最终硬闸，
 *    对任何客户端（pi / CC / GUI / 命令行）生效；
 * 2. 本扩展（pi 端，2026-10-17 起为唯一实现）。
 *
 * 判定范围：仅当仓库同时存在 `VERSION` 与 `docs/community/announcement.txt`
 * 时生效（其它项目零影响）；拦截目标为 `git commit` / `git tag`（含
 * `git -C <path> ...` 形态）。版本号按 major.minor.patch 比对，前缀 `v` 差异
 * 视为一致（`1.2.0` 与 `v1.2.0` 一致）。fail-closed：两侧文件都在、但任一侧
 * 版本号解析不出（文件为空 / 「版本：」行缺失 / 格式变化）同样拦截——宁可
 * 显式报错让人类修，也不静默失效。
 *
 * 逃生门：命令里含标记 `VERSION_MISMATCH_OK`（确需临时不一致时，由用户授权
 * 后使用）。判定全程防御性 catch：本扩展失灵时不阻塞会话（与 git-commit-
 * guard / test-cases-guard 一致）。
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const ESCAPE_MARK = "VERSION_MISMATCH_OK";
// 与 git-commit-guard.ts 同源的匹配（含 git -C <path> 形态）
const GIT_COMMIT = /\bgit\s+(?:-\S+\s+(?:[^\s-][^\s]*\s+)?)*commit\b/;
const GIT_TAG = /\bgit\s+(?:-\S+\s+(?:[^\s-][^\s]*\s+)?)*tag\b/;
const ANN_REL = join("docs", "community", "announcement.txt");

/** 取 major.minor.patch 核心三段（前缀 v / V 差异忽略）。 */
function coreVersion(text: string): string | null {
	const m = text.trim().match(/^[vV]?(\d+)\.(\d+)\.(\d+)/);
	return m ? `${m[1]}.${m[2]}.${m[3]}` : null;
}

/** 从群公告里取「版本：」行的版本号。 */
function announcedVersion(text: string): string | null {
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^\s*版本\s*[:：]\s*(.+)$/);
		if (m) return coreVersion(m[1]);
	}
	return null;
}

/** 版本不一致时返回两边版本号；无关 / 解析不出 / 一致时返回 null。 */
function mismatch(cwd: string): { version: string; announced: string } | null {
	let root = "";
	try {
		root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
			cwd,
			encoding: "utf8",
			timeout: 5000,
		}).trim();
	} catch {
		return null;
	}
	if (!root) return null;

	let versionText = "";
	let annText = "";
	try {
		versionText = readFileSync(join(root, "VERSION"), "utf8");
	} catch {
		return null; // 无 VERSION → 规则不适用
	}
	try {
		annText = readFileSync(join(root, ANN_REL), "utf8");
	} catch {
		return null; // 无群公告 → 规则不适用
	}

	const version = coreVersion(versionText);
	const announced = announcedVersion(annText);
	if (version !== null && announced !== null && version === announced) return null;
	// 两侧存在但任一解析不出（格式变化等）或两者不同 → 拦截（fail-closed，宁可显式报错也不静默失效）
	return { version: version ?? "（无法解析）", announced: announced ?? "（无法解析）" };
}

function denyReason(bad: { version: string; announced: string }): string {
	return (
		"[version-guard] 拦截：`VERSION`（" +
		bad.version +
		"）与群公告版本号（docs/community/announcement.txt 的「版本：」行 = " +
		bad.announced +
		"）不一致——2026-10-02 用户立的硬性规定：两者必须一致（bump 一个必须" +
		"同步 bump 另一个）。先把两边改成同一个版本号再提交 / 打 tag；确需临时" +
		"不一致时，命令加标记 `# VERSION_MISMATCH_OK`（用户授权后使用）。"
	);
}

/** 命令实际作用的仓库目录：优先 `git -C <dir>`，其次开头的 `cd <dir> &&`，否则会话 cwd。 */
function commandTarget(command: string, base: string): string {
	const dashC = command.match(/(?:^|\s)-C\s+(?:'([^']+)'|"([^"]+)"|(\S+))/);
	const dashCDir = dashC?.[1] ?? dashC?.[2] ?? dashC?.[3];
	if (dashCDir) return isAbsolute(dashCDir) ? dashCDir : resolve(base, dashCDir);
	const cd = command.match(/^\s*cd\s+(?:'([^']+)'|"([^"]+)"|(\S+))\s*(?:&&|;)/);
	const cdDir = cd?.[1] ?? cd?.[2] ?? cd?.[3];
	if (cdDir) return isAbsolute(cdDir) ? cdDir : resolve(base, cdDir);
	return base;
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event, ctx) => {
		try {
			if (!isToolCallEventType("bash", event)) return;
			const command = event.input.command ?? "";
			if (!GIT_COMMIT.test(command) && !GIT_TAG.test(command)) return;
			if (command.includes(ESCAPE_MARK)) return;
			const cwd = (ctx as { cwd?: string } | undefined)?.cwd ?? process.cwd();
			const bad = mismatch(commandTarget(command, cwd));
			if (!bad) return;
			return { block: true, reason: denyReason(bad) };
		} catch {
			// 判定异常时不阻塞会话
		}
	});
}
