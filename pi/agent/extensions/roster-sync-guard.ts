/**
 * 名册同步守卫（pi 端扩展）——registry 改了，xhqing 主页 README 名册必须同批跟上。
 *
 * 2026-10-26 用户立规（由 Victor 转达给 Kit）：`~/.pi/agent/docs/agents-registry.md`
 * 的任何改动——新增 / 删除项目或 Agent、子项目归属变更——必须**第一时间**同步更新
 * `xhqing` 仓库 README 里的名册表格（那张「Subprojects (🌐 public · 🔒 private)」），
 * 不是「下次顺手改」，而是和 registry 改动在同一批里做完。
 *
 * 为什么要有工具强制：这规矩 2026-10-26 立规当天就已经漂了三项（diff-view /
 * ark-key-pool / NewsScoreStudy 都在 registry 里、README 名册全无），纯文本规矩衰减得
 * 比人记得快。本扩展 = 该规矩的硬提醒层，判定逻辑全在
 * `~/.pi/agent/patch/roster-sync/roster-sync-check.py`（registry 表格 ↔ 两份 README
 * 名册的集合比对，缺 / 多都报，`allowlist.json` 登记待用户确认的有意豁免）。
 *
 * 触发时机：
 *   1. 某次工具调用写到了 `agents-registry.md`（write / edit / bash 命中路径）→ 调用
 *      结束立即比对；发现漂移就当场插话，促其**同一批**补齐两份 README。
 *   2. 每轮收尾（agent_settled）→ 再比对一次兜底。Kit 会话（cwd 在
 *      assistant 或 xhqing 仓库里）会注入提醒促其处理；其它会话只弹通知
 *      不插话——xhqing 名册是 Kit 的活，不该让别的 agent 跑去改别人的仓库。
 *
 * 防循环 / 防噪音：同一批漂移只插话一次（签名去重），漂移清空或换了一批才重新提醒。
 * 检查不出结果（registry 缺失、脚本不存在、python 报错）时一律静默放过——守卫不该
 * 因为环境问题卡住正常工作。
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const CHECKER = join(homedir(), ".pi", "agent", "patch", "roster-sync", "roster-sync-check.py");
const REGISTRY = join(homedir(), ".pi", "agent", "docs", "agents-registry.md");
const KIT_DIRS = [
	join(homedir(), "Developer", "assistant"),
	join(homedir(), "Developer", "xhqing"),
];

type Drift = {
	missing_agents: { project: string; persona?: string }[];
	extra_agents: { project: string }[];
	missing_subprojects: { agent: string; repo: string }[];
	extra_subprojects: { agent: string; repo: string }[];
};

type Report = Drift & { readme: string; allowlisted: unknown[] };

/** 注册表登记的 Agent 项目必须挂 Type-AI Agent 徽章（2026-11-09 用户立，判据看徽章不看名字）。 */
type BadgeIssue = { project: string; reason: string };

/** 跑一次比对；返回漂移摘要（无漂移 / 出错返回 null）。 */
function runCheck(): { sig: string; text: string } | null {
	if (!existsSync(CHECKER)) return null;
	let out: string;
	try {
		out = execFileSync("python3", [CHECKER, "--json"], { encoding: "utf8", timeout: 30000 });
	} catch (err) {
		// 有漂移时脚本以退出码 1 结束，stdout 仍是完整 JSON——先把 stdout 捞出来
		const stdout = (err as { stdout?: string }).stdout;
		if (!stdout) return null; // 真出错（registry 缺失 / 解析失败）：静默放过
		out = stdout;
	}

	let data: { ok?: boolean; reports?: Report[]; badge_issues?: BadgeIssue[] };
	try {
		data = JSON.parse(out);
	} catch {
		return null;
	}
	if (!data.reports || data.ok) return null;

	const lines: string[] = [];
	const sigParts: string[] = [];
	for (const r of data.reports) {
		for (const a of r.missing_agents) {
			lines.push(`${r.readme}：缺 Agent 行 ${a.project}`);
			sigParts.push(`agent+${a.project}`);
		}
		for (const a of r.extra_agents) {
			lines.push(`${r.readme}：多出 Agent 行 ${a.project}`);
			sigParts.push(`agent-${a.project}`);
		}
		for (const s of r.missing_subprojects) {
			lines.push(`${r.readme}：${s.agent} 缺子项目 ${s.repo}`);
			sigParts.push(`sub+${s.repo}`);
		}
		for (const s of r.extra_subprojects) {
			lines.push(`${r.readme}：${s.agent} 多出子项目 ${s.repo}`);
			sigParts.push(`sub-${s.repo}`);
		}
	}
	for (const b of data.badge_issues ?? []) {
		lines.push(`Agent 项目徽章：${b.project} — ${b.reason}`);
		sigParts.push(`badge+${b.project}`);
	}
	if (lines.length === 0) return null;
	return { sig: sigParts.sort().join("|"), text: lines.join("；") };
}

/** 同一批漂移只提醒一次。 */
let nudged = "";

function inject(pi: ExtensionAPI, content: string, triggerTurn: boolean) {
	const send = (
		pi as unknown as {
			sendMessage?: (
				message: { customType: string; content: string; display: boolean },
				options?: { triggerTurn?: boolean },
			) => void;
		}
	).sendMessage;
	send?.({ customType: "roster-sync-guard", content, display: true }, { triggerTurn });
}

const ADVICE =
	`按用户 2026-10-26 的规矩，registry 的改动必须在同一批里同步到 xhqing 仓库的 README 名册：` +
	`~/Developer/xhqing/README.md 与 README_cn.md 两份都要改（双语文档同步）、改完走 /add → /commit。` +
	`有意暂不同步的（如描述语待用户确认）写进 ~/.pi/agent/patch/roster-sync/allowlist.json 并注明理由。`;

export default function (pi: ExtensionAPI) {
	// 记录「这次工具调用写了 registry」的 toolCallId
	const touched = new Set<string>();

	pi.on("tool_execution_start", async (event) => {
		const name = event.toolName ?? "";
		const args = (event.args ?? {}) as Record<string, unknown>;
		const pathish = [args.path, args.file_path, args.filePath].filter((v) => typeof v === "string") as string[];
		const cmd = typeof args.command === "string" ? args.command : "";
		const writesRegistry =
			pathish.some((p) => p === REGISTRY || p.endsWith("/.pi/agent/docs/agents-registry.md")) ||
			(cmd.includes("agents-registry.md") && /(>|sed -i|tee|cp|mv|python|perl)/.test(cmd));
		if (writesRegistry) touched.add(event.toolCallId);
	});

	pi.on("tool_execution_end", async (event, ctx) => {
		if (!touched.delete(event.toolCallId)) return;
		const drift = runCheck();
		if (!drift || drift.sig === nudged) return;
		nudged = drift.sig;
		ctx.ui.notify(`[roster-sync-guard] registry 改了但 xhqing README 名册没跟上：${drift.text}`, "warning");
		inject(pi, `[roster-sync-guard] 刚改了 agents-registry，但 xhqing 主页 README 名册不一致：${drift.text}。${ADVICE}`, true);
	});

	pi.on("agent_settled", async (_event, ctx) => {
		const drift = runCheck();
		if (!drift) {
			nudged = "";
			return;
		}
		if (drift.sig === nudged) return;

		const isKit = KIT_DIRS.some((d) => ctx.cwd === d || ctx.cwd.startsWith(`${d}/`));
		if (!isKit) {
			// 非 Kit 会话：只弹通知，不插话——不要把别的 agent 支使去改别人的仓库
			ctx.ui.notify(`[roster-sync-guard] registry 与 xhqing README 名册不一致（Kit 负责同步）：${drift.text}`, "info");
			return;
		}
		nudged = drift.sig;
		ctx.ui.notify(`[roster-sync-guard] registry 与 xhqing README 名册不一致：${drift.text}`, "warning");
		inject(pi, `[roster-sync-guard] registry 与 xhqing README 名册不一致：${drift.text}。${ADVICE}`, true);
	});
}
