/**
 * macmini 模型守卫（2026-11-11 立规；2026-11-12 改为「清单驱动」+「用不了要汇报」）。
 *
 * 用户规则（两条，逐字保留）：
 *   「macmini 上不管是什么 harness 默认使用 magpie 的免费模型，如需使用其它付费模型或
 *     订阅模型必须经过用户同意。」
 *   「如果 magpie 的免费模型使用不了需要汇报原因。」
 *
 * 2026-11-12 追加：
 *   「magpie 的模型必须是 hy4free 或者 deepseek-4.1-flash-1017」
 *   「需要专门维护一个 macmini 上面的可用模型清单，这个清单我会根据情况动态调整，
 *     目前只有 magpie 的 hy4free 和 deepseek-4.1-flash-1017」
 *
 * 2026-11-13 追加（用户明确授权）：`magpie/auto/hy4std` 加入清单。它是 Hy4 的标准计费
 * 通道（上游 `free: false`、`rate: 0.29`），与 `hy4free` 的声明能力参数相同。守卫逻辑
 * 不变——清单即权威，是否免费由用户维护清单时决定，代码不判断价格。
 *
 * 所以本守卫不再硬编码任何模型名，只认清单：
 *   `patch/macmini-models/allowlist.json` 的 `models[].model`（用户动态维护）。
 *   - 清单里的模型 → 放行；
 *   - 清单外的模型 → 拦截（包括 magpie 的其它模型）；
 *   - 不带 `--model` 的启动 → 取 `~/.pi/agent/settings.json` 的默认 provider/model
 *     拼成完整名，不在清单里也拦（否则「默认模型」会绕过清单）。
 *   - 清单缺失 / 解析失败 → 保守拦截，并提示先修清单。
 *
 * 拦截范围（三处入口）：A. 本机 `ssh mac-mini '… pi … --model …'`；
 * B. macmini 本机上的同类启动（本扩展随 ~/.pi/agent 同步过去）；
 * C. `macmini_run` 工具命令里的同类形态。
 *
 * 逃生门：命令末尾 `# AI_AUTHORIZED_MODEL`（仅限用户当轮明确同意用清单外的模型，
 * AI 不得自行添加）。
 *
 * 2026-11-14 追加（用户立）：清单之外再加一个「最终兜底」模型——清单内模型全部没额度时
 * 走它。兜底模型写在 allowlist.json 的 `fallback` 字段里（当前为
 * `tokenplus/deepseek/deepseek-v4.1-flash-1017`，思考等级固定 max）。「是否全部都
 * 没额度」不做静态判断，由 patch/macmini-models/pick.py 实时读 magpie 额度判定：
 *   - 清单内还有可用额度 → 用兜底模型一律拦下（防止顺手用付费模型）；
 *   - 清单内全部没额度 / magpie 读不到额度 → 放行兜底。
 * 兜底模型启用时强制带 `--thinking max`（用户对该模型的定义就是 max 思考等级）。
 *
 * 立规起因：2026-11-11 Atlas 为了让 cmux 的 Worker 在 macmini 上跑起来，自行测了一圈
 * provider 后给 7 个 Worker 指定 `deepseek/deepseek-flash` / `deepseek-v4-pro`，走了
 * 用户登录在 `~/.pi/agent/auth.json` 里的 DeepSeek 官方付费 Key（约 1,284 次请求、
 * 输入约 137 万 + 缓存读约 2.7 亿 token），并把做法写进了 `macmini-use` skill。
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import { type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const MARK = "AI_AUTHORIZED_MODEL";
const DIR = join(homedir(), ".pi", "agent", "patch", "macmini-models");
const ALLOWLIST = join(DIR, "allowlist.json");
const PICK = join(DIR, "pick.py");
const SETTINGS = join(homedir(), ".pi", "agent", "settings.json");

type Entry = { model?: string; display?: string; note?: string };
type Fallback = { model: string; enabled: boolean; thinking?: string };

interface Allowlist {
	models: string[];
	fallback: Fallback | null;
}

/** 读清单；文件缺失 / 解析失败返回 null（调用方按「保守拦截」处理）。 */
function loadAllowlist(): Allowlist | null {
	try {
		if (!existsSync(ALLOWLIST)) return null;
		const data = JSON.parse(readFileSync(ALLOWLIST, "utf8")) as { models?: Entry[]; fallback?: Fallback };
		const list = (data.models ?? [])
			.map((e) => String(e?.model ?? "").trim())
			.filter(Boolean);
		if (!list.length) return null;
		const raw = data.fallback;
		const model = raw && typeof raw.model === "string" ? raw.model.trim() : "";
		const fallback: Fallback | null = model
			? { model, enabled: raw?.enabled !== false, thinking: typeof raw?.thinking === "string" ? raw.thinking : undefined }
			: null;
		return { models: list, fallback };
	} catch {
		return null;
	}
}

/** 问 pick.py：现在允许用兜底模型吗（它会实时读 magpie 额度）。 */
function checkFallback(model: string): { ok: boolean; output: string } {
	try {
		const output = execFileSync("python3", [PICK, "--check-model", model], {
			encoding: "utf8",
			timeout: 15_000,
			stdio: ["ignore", "pipe", "pipe"],
		});
		return { ok: true, output: output.trim() };
	} catch (err) {
		const e = err as { stdout?: string; stderr?: string; message?: string };
		const output = (e.stdout || e.stderr || e.message || "未知错误").trim();
		return { ok: false, output };
	}
}


/** 当前默认模型（settings.json 的 provider/model 拼完整名）。 */
function defaultModelName(): string | null {
	try {
		const d = JSON.parse(readFileSync(SETTINGS, "utf8")) as {
			defaultProvider?: string;
			defaultModel?: string;
		};
		if (!d.defaultModel) return null;
		const m = String(d.defaultModel).trim();
		const p = d.defaultProvider ? String(d.defaultProvider).trim() : "";
		// 以 provider 名开头才算完整名；否则（如 defaultModel 为 codearts/xxx）拼上 provider
		if (p && !m.startsWith(`${p}/`)) return `${p}/${m}`;
		return m;
	} catch {
		return null;
	}
}

function onMacmini(): boolean {
	return hostname().toLowerCase().includes("mac-mini");
}

const SSH_MACMINI_RE = /(?:^|[\s;&|(`])ssh\b[^\n;&|`]*?(?:\bmac-mini\b|\bmacmini\b)/i;

/** 段内是否在启动 pi（允许引号前缀，覆盖 tmux / ssh 包裹形态）。 */
const PI_LAUNCH_RE = /(?:^|[\s;&|(`"'])(?:[^\s;&|()`"']*\/)?pi\s/;

function modelOf(seg: string): string | null {
	const m = seg.match(/--model(?:=|\s+)([^\s;&|'"]+)/);
	return m ? m[1] : null;
}

const THINKING_LEVELS = new Set(["off", "minimal", "low", "medium", "high", "xhigh", "max"]);

/** 拆出 `--model provider/id:max` 这种思考等级后缀（pi 原生支持的写法）。 */
function splitThinking(raw: string): { model: string; thinking?: string } {
	const idx = raw.lastIndexOf(":");
	if (idx <= 0) return { model: raw };
	const suffix = raw.slice(idx + 1);
	if (!THINKING_LEVELS.has(suffix)) return { model: raw };
	return { model: raw.slice(0, idx), thinking: suffix };
}

function deny(reason: string, allow: Allowlist | null): string {
	const lines = [
		"⛔ 拦下：在 macmini 上启动 pi 会话时用了清单外的模型。",
		"",
		"2026-11-11 用户立规：macmini 上默认只用 magpie 的免费模型；",
		"可用模型清单由用户动态维护（`~/.pi/agent/patch/macmini-models/allowlist.json`）。",
	];
	if (allow) {
		lines.push("", "当前清单（只能用这些）：", ...allow.models.map((m) => `- ${m}`));
		if (allow.fallback) {
			const fb = allow.fallback;
			lines.push(
				"",
				`兜底（仅当清单内模型全部没额度时可用，思考等级固定 ${fb.thinking ?? "max"}）：${fb.model}${fb.enabled ? "" : "（已停用）"}`,
			);
		}
	} else {
		lines.push(
			"",
			"⚠️ 清单文件缺失或格式错误，已保守拦截：",
			`  ${ALLOWLIST}`,
			"先修好清单（models[].model 数组），再起会话。",
		);
	}
	lines.push(
		"",
		`本次问题：${reason}`,
		"",
		"先跑一次选择器，它会按当前额度告诉你该用哪个模型（含兜底）：",
		"  `python3 ~/.pi/agent/patch/macmini-models/pick.py`",
		"magpie 连不上（隧道断 / 本机 magpie 未运行 / 模型报错）时，**停下来向用户汇报原因**：",
		"  `bash ~/.pi/agent/patch/magpie-tunnel/install.sh --status`",
		"  `python3 ~/.pi/agent/patch/macmini-models/check.py --ping`",
		"不得自行改用清单外的模型顶替。",
		"",
		"若用户当轮明确同意用清单外的模型，命令末尾加 `# AI_AUTHORIZED_MODEL` 再执行。",
	);
	return lines.join("\n");
}

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

			const allow = loadAllowlist();

			for (const raw of command.split(/&&|\|\||[;|\n]/)) {
				const seg = raw.replace(/^\s+/, "");
				if (!seg) continue;
				if (!PI_LAUNCH_RE.test(seg)) continue;

				const rawModel = modelOf(seg);
				if (rawModel) {
					const { model, thinking } = splitThinking(rawModel);
					if (allow && allow.models.includes(model)) continue;

					// 兜底模型：只在「清单内模型全部没额度」时放行（实时问 pick.py）
					const fallback = allow?.fallback;
					if (fallback && fallback.enabled && model === fallback.model) {
						const verdict = checkFallback(model);
						if (!verdict.ok) {
							return {
								block: true,
								reason: deny(`兜底模型 ${model} 现在还不能用：${verdict.output}`, allow),
							};
						}
						// 兜底模型的思考等级固定 max，命令里必须带（--thinking max 或 :max 后缀）
						const want = fallback.thinking ?? "max";
						const hasThinking =
							thinking === want || new RegExp(`--thinking(?:=|\\s+)${want}\\b`).test(seg);
						if (!hasThinking) {
							return {
								block: true,
								reason: deny(
									`用兜底模型 ${model} 时必须带 --thinking ${want}（用户对该模型的定义就是 ${want} 思考等级，也可写成 --model ${model}:${want}）`,
									allow,
								),
							};
						}
						continue;
					}

					return { block: true, reason: deny(`模型 ${model} 不在清单里`, allow) };
				}

				// 不带 --model：默认模型也必须在清单里，否则等于绕过清单
				const dflt = defaultModelName();
				if (!allow || !dflt || !allow.models.includes(dflt)) {
					return {
						block: true,
						reason: deny(
							`没有 --model，而默认模型 ${dflt ?? "(读不到 settings.json)"} 不在清单里`,
							allow,
						),
					};
				}
			}
		} catch {
			/* 判定异常时不阻塞会话 */
		}
	});
}