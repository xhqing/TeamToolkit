/**
 * 钩子开关守卫（pi 端，tool_call 拦截，2026-11-08 立）
 *
 * 为什么需要：全局 git pre-commit hook 是「密钥类敏感信息」唯一的确定性防线——它不依赖
 * AI 自觉，每次 commit 都会跑 gitleaks。但这条防线有两个一键关闭的开关，而此前没有任何
 * 守卫拦它们：
 *
 *   1. `git commit --no-verify`（短选项 `-n`）—— 当次跳过全部 pre-commit hook；
 *   2. `git config hooks.gitleaks false` —— 永久关闭本仓库的 gitleaks 扫描；
 *   3. `git config core.hooksPath /dev/null` —— 让 git 找不到任何 hook。
 *
 * 这三条一旦被用来「图快」，确定性防线就静默消失了，而且没有任何痕迹——事后无法判断
 * 某次提交到底扫过没有。所以按「规矩必须配套工具强制」元规则，把它们拦下来。
 *
 * 逃生门：命令末尾加注释标记 `# AI_ALLOW_SKIP_HOOKS`（须用户当轮明确授权，不得擅自加）。
 *
 * 判定全程防御性 catch：本扩展失灵时不阻塞会话（与其它 guard 一致）。
 */

import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const ALLOW_MARK = "AI_ALLOW_SKIP_HOOKS";
// 与 git-commit-guard / public-text-guard 同源的 git 命令前缀（含 git -C <path> / -c k=v 形态）
const GIT_PREFIX = String.raw`\bgit\s+(?:-\S+\s+(?:[^\s-][^\s]*\s+)?)*`;

// git commit --no-verify / -n（-n 在 commit 里就是 --no-verify，没有别的含义；
// 同时覆盖 -nm 这类组合短选项：-n 后面跟字母也算）
const COMMIT_NO_VERIFY = new RegExp(
	GIT_PREFIX + String.raw`commit[^;&|\n]*(?:--no-verify(?![a-zA-Z0-9-])|(?<![\w-])-n[a-zA-Z]*\b)`,
);

// git push --no-verify（跳过 pre-push；本项目暂未用 pre-push，一并拦住以免将来漏）
const PUSH_NO_VERIFY = new RegExp(GIT_PREFIX + String.raw`push[^;&|\n]*--no-verify(?![a-zA-Z0-9-])`);

// git config [--global] hooks.gitleaks false（仓库级 / 全局关闭 gitleaks 扫描）
const DISABLE_GITLEAKS = new RegExp(
	GIT_PREFIX + String.raw`config[^;&|\n]*hooks\.gitleaks[^;&|\n]*(?:\bfalse\b|\b0\b|["']false["'])`,
);

// git -c hooks.gitleaks=false ...（单次命令内联关闭，常见于 commit 前的「临时关一下」）
const INLINE_DISABLE = new RegExp(String.raw`\bgit\s+-c\s+hooks\.gitleaks\s*=\s*(?:false|0)`);

// git config core.hooksPath 指向 /dev/null 或空串（让 git 找不到任何 hook）
const HOOKS_PATH_OFF = new RegExp(
	GIT_PREFIX + String.raw`config[^;&|\n]*core\.hooksPath[^;&|\n]*(?:\/dev\/null|["']{2})`,
);

const DENY_REASON =
	"[verify-guard] 拦截：这条命令会跳过或关闭 commit 前的 gitleaks 扫描。\n" +
	"为什么拦：全局 pre-commit hook 是密钥类敏感信息唯一的确定性防线，不依赖 AI 自觉；" +
	"`--no-verify` / `hooks.gitleaks=false` / `core.hooksPath=/dev/null` 会让它静默消失，" +
	"事后也无法判断某次提交到底扫过没有。\n" +
	"正确做法：去掉这些开关正常提交；若扫描有误报，在该行尾加 `gitleaks:allow` 注释豁免（只豁免这一行）。\n" +
	"确实需要跳过（例如确认过的紧急修复）时，先取得用户当轮明确授权，再在命令末尾加注释标记 " +
	"`# AI_ALLOW_SKIP_HOOKS`。";

/**
 * 把引号里的内容揉掉再判定：`git commit -m "别加 -n 了"` 里的 -n 是消息文字，
 * 不是开关。不揉掉的话这条命令会被误报成「跳过 hook」。
 */
function stripQuoted(cmd: string): string {
	return cmd.replace(/"[^"]*"|'[^']*'/g, '""');
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (!isToolCallEventType("bash", event)) return;
			const command = event.input.command ?? "";
			if (command.includes(ALLOW_MARK)) return;
			const scan = stripQuoted(command);
			if (
				COMMIT_NO_VERIFY.test(scan) ||
				PUSH_NO_VERIFY.test(scan) ||
				DISABLE_GITLEAKS.test(scan) ||
				INLINE_DISABLE.test(scan) ||
				HOOKS_PATH_OFF.test(scan)
			) {
				return { block: true, reason: DENY_REASON };
			}
		} catch {
			// 判定异常时不阻塞会话
		}
	});
}
