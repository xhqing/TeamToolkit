/**
 * macmini 模型守卫（2026-11-11 用户立规；2026-11-12 补「用不了要汇报」）。
 *
 * 用户原话：
 *   「macmini 上不管是什么 harness 默认使用 magpie 的免费模型，如需使用其它付费模型或
 *     订阅模型必须经过用户同意。」
 *   「如果 magpie 的免费模型使用不了需要汇报原因。」
 *
 * 立规的直接起因：2026-11-11 Atlas 为了让 cmux 的 Worker 在 macmini 上跑起来，先逐个
 * 测 provider（coding-plan 订阅无效 / dashscope 欠费 / zai 套餐到期），最后给 7 个
 * Worker 指定 `deepseek/deepseek-flash`、`deepseek/deepseek-v4-pro`，走的是用户登录在
 * `~/.pi/agent/auth.json` 里的 **DeepSeek 官方付费 Key**（约 1,284 次请求、输入约 137 万
 * + 缓存读约 2.7 亿 token），并把这套做法写进了 `macmini-use` skill。
 *
 * 配套设施：`patch/magpie-tunnel/` 用 launchd 常驻 SSH 反向隧道，把 macmini 的
 * 127.0.0.1:3425 映射到本机 magpie，所以 macmini 上 `magpie/...` 模型本来是能用的——
 * 不需要、也不允许自行降级到付费模型。
 *
 * 拦截范围（三处入口，规则一致）：
 *   A. 本机执行 `ssh mac-mini '… pi … --model <非 magpie> …'`；
 *   B. macmini 本机上执行 `pi … --model <非 magpie>`（本扩展随 ~/.pi/agent 同步过去）；
 *   C. `macmini_run` 工具的命令里出现同样的形态。
 *
 * 放行：
 *   - `--model magpie/…`（免费模型本人）；
 *   - 不带 `--model` 的启动（默认 provider 就是 magpie，settings.json 已锁定）；
 *   - 命令里带 `# AI_AUTHORIZED_MODEL`（仅限用户当轮明确同意，AI 不得自行添加）。
 *
 * 已知局限：值写成变量（`--model "$M"`）时无法静态判断，这里放行；判断主要靠规则。
 */

import os from "node:os";
import { type ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** 用户当次授权标记（仅限用户在当轮明确同意使用非 magpie 模型时添加）。 */
const MARK = "AI_AUTHORIZED_MODEL";

/** 本机是否是 macmini（本扩展也会在 macmini 上加载）。 */
function onMacmini(): boolean {
	return os.hostname().toLowerCase().includes("mac-mini");
}

/** 命令是否指向 macmini（ssh mac-mini / ssh macmini 等形态）。 */
const SSH_MACMINI_RE = /(?:^|[\s;&|(`])ssh\b[^\n;&|`]*?(?:\bmac-mini\b|\bmacmini\b)/i;

/**
 * 命令段里是否在启动 pi（排除 pi-intercom 这类前缀：`pi` 后面必须是空白）。
 * 覆盖 `pi -n …`、`pi -p …`、`/Users/mac/.local/node/bin/pi …`、`node …/pi …`，
 * 以及被 `tmux new-session … "pi -n …"` / `ssh … 'pi …'` 包住的形式（前缀允许引号）。
 */
const PI_LAUNCH_RE = /(?:^|[\s;&|(`"'])(?:[^\s;&|()`"']*\/)?pi\s/;

/** 取 `--model` 的值（支持 `--model value` 与 `--model=value`）。 */
function modelOf(seg: string): string | null {
	const m = seg.match(/--model(?:=|\s+)([^\s;&|'"]+)/);
	if (!m) return null;
	return m[1];
}

/** 值是否属于 magpie（允许 `magpie` 与 `magpie/<model>`）。 */
function isMagpieModel(v: string): boolean {
	if (v === "magpie") return true;
	if (v.startsWith("magpie/")) return true;
	// 变量形态无法静态判断，放行（规则兜底）
	if (v.startsWith("$")) return true;
	return false;
}

const DENY = [
	"⛔ 拦下：在 macmini 上启动 pi 会话时指定了非 magpie 的模型。",
	"",
	"2026-11-11 用户立规：macmini 上不管是什么 harness，默认使用 **magpie 的免费模型**；",
	"改用其它付费 / 订阅模型（deepseek 官方、coding-plan、dashscope、zai-coding-cn、",
	"tokenplus 等）**必须先经用户当次同意**。",
	"",
	"正确做法：",
	"- 用 `--model magpie/<model>`（例：`magpie/codearts/deepseek-v4.1-flash-1017`），",
	"  或干脆不带 `--model`（默认 provider 就是 magpie）；",
	"- magpie 连不上（隧道断 / 本机 magpie 未运行 / 模型报错）时，**停下来向用户汇报原因**：",
	"  `bash ~/.pi/agent/patch/magpie-tunnel/install.sh --status` 看本机 magpie、launchd、",
	"  macmini 侧三处状态，把错误原文带回；不得自行改用付费模型顶替。",
	"",
	"若用户当轮明确同意使用其它模型，命令末尾加 `# AI_AUTHORIZED_MODEL` 再执行。",
].join("\n");

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			const toolName = event.toolName;
			if (toolName !== "bash" && toolName !== "macmini_run") return;
			const command = (event.input as { command?: string })?.command ?? "";
			if (!command || command.includes(MARK)) return;

			const macminiTarget =
				toolName === "macmini_run" || onMacmini() || SSH_MACMINI_RE.test(command);
			if (!macminiTarget) return;

			// 逐段检查「启动 pi 且带 --model」的片段
			for (const raw of command.split(/&&|\|\||[;|\n]/)) {
				const seg = raw.replace(/^\s+/, "");
				if (!seg) continue;
				if (!PI_LAUNCH_RE.test(seg)) continue;
				const model = modelOf(seg);
				if (!model) continue;
				if (!isMagpieModel(model)) {
					return { block: true, reason: DENY };
				}
			}
		} catch {
			// 判定异常时不阻塞会话
		}
	});
}