/**
 * VSCode 退役守卫（pi 端，tool_call 拦截）。
 *
 * 2026-11-09 用户立规：「团队整体工作流在任何时候以后都不使用 VSCode，逐渐实现从
 * VSCode 到 cmux 的过渡，只要碰到需要 VSCode 的时候就考虑能不能在 cmux 里面实现同样
 * 的功能。」立规起因很具体：AI 修完 README 图片渲染后让用户「在 VSCode 里确认一下」，
 * 而用户的工作环境早就是 cmux（`~/Developer/cmux`）——他不开 VSCode。
 *
 * 本守卫管两类操作：
 *
 * **A. 主动启动 / 驱动 VSCode**（逃生门 `# AI_AUTHORIZED_VSCODE`）
 *   1. `code ...`（VSCode CLI：开文件、开目录、装扩展、开远程窗口）；
 *   2. `open -a "Visual Studio Code"` / `open .../Visual Studio Code.app` / `open -b com.microsoft.VSCode`；
 *   3. `open vscode://` / `open vscode-insiders://`（用 URI 驱动 VSCode，且会复用当前窗口）；
 *   4. 直接执行 VSCode 的可执行文件（`.../Visual Studio Code.app/Contents/MacOS/...`）。
 *   放行只读查询（`code --version` / `--list-extensions` / `--help` / `--status`），
 *   以及仅仅**提到** VSCode 字样而不启动它的命令（如 `ls "/Applications/Visual Studio Code.app"`）
 *   ——判定看「命令段起头是不是启动动作」，不是「命令里有没有 VSCode 字样」。
 *
 * **B. 杀 VSCode 进程**（逃生门 `# AI_AUTHORIZED_KILL_VSC`）
 *   用户可能还有 VSCode 窗口开着（他本人用不用是另一回事，误杀同样会打断他、丢未保存内容）。
 *   `pkill` / `killall` / `kill` 的目标里出现 VSCode 特征（`Visual Studio Code`、`Code Helper`）
 *   即拦。已知局限：`kill <pid>` 裸 pid 形态不做进程名反查（VSCode 的 pid 天天变，反查成本高、
 *   收益低），本守卫只拦文本可判的形态；`codef`（全屏打开 VSCode 的 CLI）仍归 `focus-guard.ts`
 *   管（主要问题是抢焦点，标记 `AI_AUTHORIZED_LOCAL_FOCUS`）。
 */

import { type ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** 启动 / 驱动 VSCode 的逃生门。 */
const LAUNCH_MARK = "AI_AUTHORIZED_VSCODE";
/** 杀 VSCode 进程的逃生门（沿用既有标记，历史规则已用这个名字）。 */
const KILL_MARK = "AI_AUTHORIZED_KILL_VSC";

const LAUNCH_DENY = [
	"⛔ VSCode 已退役（2026-11-09 用户立规）：团队工作流不再使用 VSCode，日常界面是 cmux。",
	"",
	"这条命令会启动 / 驱动 VSCode，已被拦下。请改用 cmux 完成同样的事：",
	"- 看文件 / Markdown 渲染 / 图片：「在 cmux 里打开」而不是 `code <文件>`；",
	"- 改代码：直接编辑文件，或让用户在 cmux 里看；",
	"- 装扩展这类 VSCode 专属动作：先确认真的非做不可（用户当轮明确要求才做）。",
	"",
	"若用户当轮确实明确要求用 VSCode，命令末尾加 `# AI_AUTHORIZED_VSCODE` 再执行。",
].join("\n");

const KILL_DENY = [
	"⛔ 拦下：这条命令会终止 VSCode 进程。",
	"",
	"用户可能还有 VSCode 窗口开着、里面有未保存的内容——误杀会打断他。",
	"确需结束 VSCode 时，先向用户说明范围与原因、取得当次授权，再在命令末尾加",
	"`# AI_AUTHORIZED_KILL_VSC` 执行。",
].join("\n");

/** 命令段起头是 `code`（VSCode CLI）——排除 codef / codec / code=xxx 之类。 */
const CODE_CLI_RE = /^code(?:\s|$)/;
/** 这些是只读查询，不启动窗口，放行。 */
const CODE_READONLY_RE = /^code\s+(?:--version|-v|--help|-h|--list-extensions|--status)\b/;
/** 用 URI 驱动 VSCode（会复用当前窗口）。 */
const OPEN_VSCODE_SCHEME_RE = /^open\s+.*vscode(?:-insiders)?:\/\//;
/** 开 VSCode 应用本体（-a 或直接给 .app 路径）。 */
const OPEN_VSCODE_APP_RE = /^open\s+.*Visual Studio Code/i;
/** `open -b com.microsoft.VSCode` 这种 bundle id 形态。 */
const OPEN_VSCODE_BUNDLE_RE = /^open\s+.*com\.microsoft\.VSCode\b/;
/** 直接跑 VSCode 的可执行文件。 */
const VSCODE_BINARY_RE = /Visual Studio Code\.app\/Contents\/MacOS\//;

/** kill / pkill / killall 命令的「目标参数」里出现 VSCode 特征即拦。 */
const KILLISH_RE = /(?:^|[\s;&|(`])(kill|pkill|killall)(?=[ \t]|$)([^\n;&|`)]*)/g;
const VSCODE_PROCESS_RE = /Visual Studio Code|Code Helper/i;

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (event.toolName !== "bash" && event.toolName !== "powershell") return;
			const command = (event.input as { command?: string })?.command ?? "";
			if (!command) return;

			// B. 杀 VSCode 进程：只看 kill 的目标参数，避免同一条命令别处的字样连坐。
			if (!command.includes(KILL_MARK)) {
				for (const m of command.matchAll(KILLISH_RE)) {
					const target = m[2] ?? "";
					if (VSCODE_PROCESS_RE.test(target || command)) {
						return { block: true, reason: KILL_DENY };
					}
				}
			}

			// A. 启动 / 驱动 VSCode：按命令段判定起头动作。
			if (command.includes(LAUNCH_MARK)) return;
			for (const raw of command.split(/&&|\|\||[;|\n]/)) {
				const seg = raw.replace(/^\s+/, "");
				if (!seg) continue;

				if (CODE_CLI_RE.test(seg)) {
					if (CODE_READONLY_RE.test(seg)) continue;
					return { block: true, reason: LAUNCH_DENY };
				}
				if (
					OPEN_VSCODE_SCHEME_RE.test(seg) ||
					OPEN_VSCODE_APP_RE.test(seg) ||
					OPEN_VSCODE_BUNDLE_RE.test(seg) ||
					VSCODE_BINARY_RE.test(seg)
				) {
					return { block: true, reason: LAUNCH_DENY };
				}
			}
		} catch {
			// 判定异常时不阻塞会话
		}
	});
}
