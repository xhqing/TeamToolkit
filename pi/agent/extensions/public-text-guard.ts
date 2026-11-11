/**
 * 公开文本敏感自检守卫（pi 端，tool_call 拦截）。
 *
 * 按「规矩必须配套工具强制」元规则，为公开文本的敏感自检配套硬拦截：tag
 * message、Release notes、PR title / body、Issue 文本这些「会发出去的文字」
 * 在公开前都要求先做敏感检查，命令里没有 AI_SENSITIVE_CHECKED 标记一律 deny。
 *
 * 拦截范围（四类公开动作，都由公开文本承载）：
 * - 打 annotated tag（-a / --annotate / -m / --message / -F / --file）；
 * - 推送 tag（--tags / --follow-tags / refs/tags/ / refspec 形如版本号）；
 * - gh release create / edit；
 * - gh pr create / edit、gh issue create / edit。
 * 查询类（git tag -l、git push 普通分支、gh release/pr/issue 的 view/list 等）
 * 与本地删除类（git tag -d）不拦——拦截目标是把文字推向公开的动作，不是一切
 * 相关命令。commit message 也是公开文本，但敏感性无法从命令行文本自动判定，
 * 由 commit skill「公开文本敏感自检」节的纪律约束，不在本守卫的命令模式内。
 *
 * 判定逻辑由 pi 端独立维护（2026-10-17 起为唯一实现）。标记 AI_SENSITIVE_CHECKED 表示「将公开的文本已做敏感检查」：
 * 正式发版按 release skill 第 4 步自检、commit / PR / Issue 按 commit skill 的
 * 「公开文本敏感自检」节执行后再加；其它临时场景至少确认文本无敏感内容。
 * 判定全程防御性 catch：本扩展失灵时不阻塞会话（与其它 guard 一致）。
 *
 * （本文件 2026-10-03 由 release-guard.ts 更名而来，同日扩展 PR / Issue 覆盖。）
 */

import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { existsSync, readFileSync } from "node:fs";

const CHECK_MARK = "AI_SENSITIVE_CHECKED";

/**
 * 公开文本的格式型密钥检测（2026-11-08 加）。
 *
 * 为什么加：本守卫原来只校验「命令里有没有 AI_SENSITIVE_CHECKED 标记」，
 * 不校验文本内容——AI 只要随手写上标记就能把密钥推进 Release notes / PR body。
 * 现在带不带标记都先扫一遍内容：命中就 block，标记也不能掩盖密钥实值。
 *
 * 边界（诚实声明）：只查有固定格式的密钥；「描述性财务状况」「隐私叙述」这类
 * 仍然只能靠 AI 语义判断。完整扫请按 release skill 第 4 步跑 gitleaks。
 */
const SECRET_PATTERNS: Array<{ id: string; re: RegExp }> = [
	{ id: "私钥头", re: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/ },
	{ id: "GitHub token", re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/ },
	{ id: "OpenAI 风格 key", re: /\bsk-[A-Za-z0-9_-]{20,}/ },
	{ id: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/ },
	{ id: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}/ },
	{ id: "Google OAuth secret", re: /\bGOCSPX-[A-Za-z0-9_-]{20,}/ },
	{ id: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
	{ id: "本机 ark key", re: /\b(?:msk|mark)-[A-Za-z0-9._-]{24,}/ },
	// ---- 隐私类（2026-11-08 第二批：只覆盖能正则化的部分）----
	{ id: "手机号", re: /(?:^|[^0-9])1[3-9]\d{9}(?:[^0-9]|$)/ },
	{ id: "身份证号", re: /\b\d{6}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/ },
	{ id: "本机绝对路径", re: /\/Users\/[A-Za-z0-9._-]+\// },
	{
		id: "财务金额",
		re: /(?:月薪|年薪|工资|收入|亏损|盈利|本金|存款|负债|总资产|净值)[^0-9\n]{0,10}(?:\d{1,3}(?:,\d{3})+|\d{5,})(?:\s*(?:元|万|USD|HKD|US\$|HK\$))?/,
	},
];

/** 从命令里把「要公开的文本」抽出来：内联参数值与 -F / --notes-file 指向的文件。 */
function extractTexts(cmd: string): Array<{ text: string; where: string }> {
	const out: Array<{ text: string; where: string }> = [];
	const inlineRe = /(?:--notes|--body|-m|--message)\s+(?:"((?:[^"\\]|\\.)*)"|'([^']*)'|([^\s;&|]+))/g;
	let m: RegExpExecArray | null;
	while ((m = inlineRe.exec(cmd))) {
		const value = m[1] ?? m[2] ?? m[3] ?? "";
		if (value) out.push({ text: value, where: `参数 ${m[0].split(/\s+/)[0]}` });
	}
	const fileRe = /(?:--notes-file|--body-file|-F)\s+(\S+)/g;
	while ((m = fileRe.exec(cmd))) {
		const path = m[1].replace(/^["']|["']$/g, "");
		try {
			if (existsSync(path)) out.push({ text: readFileSync(path, "utf8"), where: `文件 ${path}` });
		} catch {
			// 读不到就不扫（退回原行为：要求标记）
		}
	}
	return out;
}
// 与 git-commit-guard / version-guard 同源的 git 命令前缀匹配（含 git -C <path> 形态）
const GIT_PREFIX = String.raw`\bgit\s+(?:-\S+\s+(?:[^\s-][^\s]*\s+)?)*`;
// gh 命令前缀匹配（含 gh -R owner/repo 等全局选项形态）
const GH_PREFIX = String.raw`\bgh\s+(?:-\S+\s+(?:[^\s-][^\s]*\s+)?)*`;
// annotated tag 创建：tag 段内出现 -a/-m/-F 或对应长选项；[^;&|\n]* 限制在同一命令段内
const TAG_CREATE = new RegExp(
	GIT_PREFIX + String.raw`tag[^;&|\n]*(?:-[aAmF](?![a-zA-Z0-9])|--(?:annotate|message|file)(?![a-zA-Z0-9-]))`,
);
// tag 推送：--tags / --follow-tags / refs/tags/ / refspec 形如 v1.2.3
// 2026-10-04 修误伤：形如版本号的 refspec 必须是「裸 token」——前面不能是分支名字符
// （字母数字 / `/` / `.` / `-`）：`git push origin chore/bump-v1.4.0` 是推分支、不是推 tag，
// 旧写法不带前边界会把这种分支名误判为 tag 推送而拦下。(用 `([^[:alnum:]/_.-]|^)` 表达同一约束。)
const TAG_PUSH = new RegExp(
	GIT_PREFIX +
		String.raw`push[^;&|\n]*(?:--tags(?![a-zA-Z0-9-])|--follow-tags(?![a-zA-Z0-9-])|refs/tags/|(?<![\w/.-])v?\d+\.\d+\.\d+(?![\w/.-]))`,
);
// GitHub Release 创建 / 编辑（notes 等公开文本）
const GH_RELEASE = new RegExp(GH_PREFIX + String.raw`release\s+(?:create|edit)(?![a-zA-Z0-9-])`);
// GitHub PR / Issue 创建 / 编辑（title / body 是公开文本）
const GH_PR_ISSUE = new RegExp(GH_PREFIX + String.raw`(?:pr|issue)\s+(?:create|edit)(?![a-zA-Z0-9-])`);

const DENY_REASON =
	"[public-text-guard] 拦截：公开动作（打 annotated tag / 推送 tag / 创建或编辑 " +
	"GitHub Release / PR / Issue）前必须先对将公开的文本（tag message、Release " +
	"notes、PR / Issue 的 title 与 body）做敏感检查——正式发版按 release skill " +
	"第 4 步「公开文本敏感自检」；commit / PR / Issue 按 commit skill 的「公开文本" +
	"敏感自检」节执行；其它场景至少确认待公开文本无敏感内容。确认后在命令末尾加" +
	"注释标记 `# AI_SENSITIVE_CHECKED` 再执行；不得未经检查擅自添加标记。";

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (!isToolCallEventType("bash", event)) return;
			const command = event.input.command ?? "";
			const isPublicAction =
				TAG_CREATE.test(command) ||
				TAG_PUSH.test(command) ||
				GH_RELEASE.test(command) ||
				GH_PR_ISSUE.test(command);
			if (!isPublicAction) return;

			// 内容检查：命中格式型密钥就 block——即使带了标记也不放行（2026-11-08 加）
			const hits: string[] = [];
			for (const { text, where } of extractTexts(command)) {
				for (const p of SECRET_PATTERNS) {
					if (p.re.test(text)) hits.push(`${where} → ${p.id}`);
				}
			}
			if (hits.length > 0) {
				return {
					block: true,
					reason:
						"[public-text-guard] 拦截：待公开的文本里发现了格式型密钥或隐私标识——\n" +
						[...new Set(hits)].map((h) => `  - ${h}`).join("\n") +
						"\n即使命令带了 AI_SENSITIVE_CHECKED 标记也不放行。请把密钥实值删掉 / 改成占位符后重试" +
						"（真实值只放本机被忽略的配置或 ~/.dev/private/）。",
				};
			}

			if (command.includes(CHECK_MARK)) return;
			if (isPublicAction) {
				return {
					block: true,
					reason:
						DENY_REASON +
						"\n（本轮自动扫过文本，未发现格式型密钥；但描述性财务 / 隐私叙述仍须你自己看完再确认。）",
				};
			}
		} catch {
			// 判定异常时不阻塞会话
		}
	});
}
