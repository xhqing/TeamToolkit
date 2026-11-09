/**
 * 会话「还有后台活动」期间的大红提醒（pi 端扩展）。
 *
 * 背景（2026-10-09 用户立规，全局 ~/.pi/agent/AGENTS.md「会话间协作」节）：等待其它
 * 智能体回复时，会话容易被误认为「任务已全部完成」——用户实测差点关掉会话。规则：
 * 还有后台活动时，界面上要能提醒用户别关会话（文案：「还有后台进程在运行中，请稍等」）。
 *
 * ## 2026-10-11 重做（用户反馈后的第三版行为）
 *
 * 旧版（判定精化版）的两个动作被用户指出四个问题：
 *   - 动作 ①：等待窗口内的收尾消息自动加「消息首行大红横幅」；
 *   - 动作 ②：等待窗口内在编辑器上方挂红色 widget。
 *   问题 1：有内容正在动态输出时，提醒是多余的（用户看得到活动、不会关窗口）；
 *   问题 2：输出完了、任务真正结束，提醒还挂着——根因是旧版清窗只认 role=user 的
 *     message_start，而 intercom 回信以 custom message 注入、不触发该事件，
 *     于是 send 窗口永不关闭、横幅一直补（用户看到「永不消失」的现场）；
 *   问题 3：文案「正在等待其它智能体回复中」不够严谨（实际场景还涉及后台任务）；
 *   问题 4：提醒位置可以换（footer / 动态栏都可以）。
 *
 * 本版行为：
 *   - **显示位置：footer 状态行**（`ctx.ui.setStatus`）——轻量、不占正文与编辑器
 *     空间、随状态撤销；**不再向消息内容注入任何横幅**（消息里不再有红字）。
 *   - **显示时机：仅在「还有未完活动」且「会话静止（不在干活）」时显示**——
 *     agent 干活期间（agent_start..agent_settled）隐藏（用户看着输出、不需要提醒），
 *     停下后若仍有活动则显示；活动全部结束立即撤下。
 *   - **活动来源**（任一成立即视为「还有后台进程在运行」）：
 *       1) send 类委派（`agent_call` mode=send / `intercom` action=send|handover）
 *          发出后未收到回信；
 *       2) ask 类调用（`agent_call` 默认 / `intercom` action=ask）阻塞中；
 *       3) 其它扩展上报的活跃活动（pi.events 事件 `agent-wait-banner:activity`，
 *          载荷 `{ source: string, active: boolean }`）——项目扩展可用它把自家
 *          后台任务接进提醒（当前接入：trading-agent 的 `background_run`）。
 *   - **清窗**：
 *       - 用户输入（message_start role=user）→ 全部清空（自愈兜底）；
 *       - send 类消息写明「无需回复」（无需回信）→ 不点亮提醒（主动判断，见文末修订）；
 *       - send 窗口超时（默认 15 分钟，见文末 2026-10-12 修订）→ 自动撤销；
 *       - intercom 回信到达（会话条目出现新的 `custom_message` / `intercom_message`）
 *         → 按条数销掉 send 窗口（旧版漏掉的正是这条）；
 *       - 委派工具本身失败（tool_result isError：目标不存在等）→ 撤销对应窗口；
 *       - ask 结束（tool_execution_end）→ 清对应 ask。
 *
 * 注意：pi 扩展在会话启动时加载——已在运行的会话仍持旧版，本次修正在下一个新会话生效。
 *
 * ## 2026-10-12 修订（主动判断 + send 窗口加超时）
 *
 * 用户反馈：fire-and-forget 的 send 类委派（发出时已说明「无需回复」）等不到回信时，
 * 提醒会一直挂在 footer——用户等了一下午，被误导以为还有后台进程在跑。用户定调：
 * **没有真实待办，提醒就不应该存在——应该主动判断出来、主动撤销**。本版两条改动：
 *   1) **主动判断**：send 类委派的消息里写明「无需回复」（fire-and-forget 标记，
 *      匹配见 `isNoReplyMessage`）→ 不点亮提醒（本来就没有要等的东西）；需要
 *      回信的正常点亮，收到回信/用户输入/委派失败照旧立即撤销。
 *   2) **兜底超时**：send 窗口最长保留 15 分钟（`PI_WAIT_BANNER_TTL_MS` 可覆盖），
 *      超时自动撤销（防「标记写漏或无法判断」时长期误报）。
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

/** footer 状态行的 key（多扩展共用 footer，各自占一段）。 */
const STATUS_KEY = "agent-wait-banner";
/** 其它扩展上报活动的 pi.events 事件名（载荷 { source, active }）。 */
const ACTIVITY_EVENT = "agent-wait-banner:activity";
/** 提醒文案。 */
const BANNER_TEXT = "🟥🟥🟥 还有后台进程在运行中，请稍等 🟥🟥🟥";
/**
 * send 类委派窗口的最长保留时间：超过仍未收到回信就自动撤销。
 * 目的（2026-10-12 用户定调）：没有真实待办时提醒不应存在——fire-and-forget 委派
 * 无人回信时不能让提醒一直误导用户。可用 PI_WAIT_BANNER_TTL_MS 覆盖（毫秒）。
 */
const SEND_TTL_MS = Number(process.env.PI_WAIT_BANNER_TTL_MS) || 15 * 60_000;

/** 该调用是否属「send 类委派」：发出后等对方回信（不阻塞）。 */
function isSendLike(toolName: string, input: Record<string, unknown>): boolean {
	if (toolName === "agent_call") return input.mode === "send";
	if (toolName === "intercom") return input.action === "send" || input.action === "handover";
	return false;
}

/** 该调用是否属「ask 类调用」：阻塞式等待回复（结束后即结窗）。 */
function isAskLike(toolName: string, input: Record<string, unknown>): boolean {
	if (toolName === "agent_call") return input.mode !== "send"; // 默认（未传 mode）= ask
	if (toolName === "intercom") return input.action === "ask";
	return false;
}

/**
 * send 类委派是否「无需回信」（fire-and-forget）——消息里写明「无需回复」等标记即视为
 * 没有要等的东西，不点亮提醒（2026-10-12 用户定调：没有真实待办，提醒就不应该存在）。
 */
function isNoReplyMessage(input: Record<string, unknown>): boolean {
	const msg = typeof input.message === "string" ? input.message : "";
	if (!msg) return false;
	const zh = /(无需|不用|不必|不需要)[^。\n]{0,6}(回复|回信|进一步动作)/;
	const en = /no need to reply|no reply (needed|required|expected)|do not reply|don'?t reply/i;
	return zh.test(msg) || en.test(msg);
}

export default function agentWaitBanner(pi: ExtensionAPI) {
	// ---- 活动状态 ----
	/** 未收到回信的 send 类委派（toolCallId → 发出时刻；Map 迭代序 = 发出序）。 */
	const pendingSends = new Map<string, number>();
	/** ask 类调用阻塞中（toolCallId）。 */
	const pendingAsks = new Set<string>();
	/** 外部上报的活跃活动来源（source 集合）。 */
	const activeSources = new Set<string>();
	/** agent 是否在干活（agent_start..agent_settled 之间）。 */
	let busy = false;
	/** 最近一次事件里的 ctx（供事件总线回调与兜底轮询使用）。 */
	let latestCtx: ExtensionContext | undefined;

	const hasActivity = (): boolean =>
		pendingSends.size > 0 || pendingAsks.size > 0 || activeSources.size > 0;

	// 渲染 footer 状态：还有活动且会话静止 → 显示；否则清除（防御性：失败不抛）。
	const render = (): void => {
		if (!latestCtx) return;
		try {
			latestCtx.ui.setStatus(STATUS_KEY, hasActivity() && !busy ? BANNER_TEXT : undefined);
		} catch {
			// 防御性放行
		}
	};

	// 回信清窗：从会话分支尾部往前扫，找「最早未清 send 之后」的 intercom 入站消息，
	// 每一条销掉一个 send 窗口（自愈式：不区分回信发信人——同一时刻通常只等一个；
	// 宁可少提醒、不误报）。条目时间戳是写入序、从尾向前扫到旧条目即停，开销极小。
	const reconcileReplies = (ctx: ExtensionContext): void => {
		const since = pendingSends.values().next().value as number | undefined;
		if (since === undefined) return;
		try {
			const branch = ctx.sessionManager.getBranch();
			let replies = 0;
			for (let i = branch.length - 1; i >= 0; i -= 1) {
				const entry = branch[i] as {
					type?: string;
					customType?: string;
					timestamp?: string;
				} | undefined;
				if (!entry) continue;
				const ts = entry.timestamp ? Date.parse(entry.timestamp) : Number.NaN;
				if (Number.isFinite(ts) && ts <= since) break; // 再往前都更旧，停止
				if (entry.type === "custom_message" && entry.customType === "intercom_message") {
					replies += 1;
				}
			}
			if (replies > 0) {
				const doomed = [...pendingSends.keys()].slice(0, replies);
				for (const key of doomed) pendingSends.delete(key);
			}
		} catch {
			// 防御性放行
		}
	};

	// 过期撤销：send 窗口超过 TTL 仍未收到回信 → 视为「不再等我」，撤下提醒。
	const pruneExpiredSends = (): void => {
		const now = Date.now();
		for (const [key, sentAt] of pendingSends) {
			if (now - sentAt > SEND_TTL_MS) pendingSends.delete(key);
		}
	};

	// 统一刷新：传入 ctx 时更新引用；先核对回信、再渲染。
	const refresh = (ctx?: ExtensionContext): void => {
		if (ctx) latestCtx = ctx;
		pruneExpiredSends();
		if (latestCtx) reconcileReplies(latestCtx);
		render();
	};

	// ---- 委派工具调用：登记活动窗口 ----
	pi.on("tool_call", async (event, ctx) => {
		try {
			const { toolName, toolCallId, input } = event as {
				toolName?: string;
				toolCallId?: string;
				input?: Record<string, unknown>;
			};
			if (!toolName || (toolName !== "agent_call" && toolName !== "intercom")) return;
			const args = input ?? {};
			const key = toolCallId ?? `anon-${Date.now()}-${pendingSends.size + pendingAsks.size}`;
			if (isSendLike(toolName, args)) {
				// 主动判断：消息里写明「无需回复」的 fire-and-forget 委派，没有要等的东西，不计入等待窗口
				if (!isNoReplyMessage(args)) pendingSends.set(key, Date.now());
			} else if (isAskLike(toolName, args)) {
				pendingAsks.add(key);
			}
			refresh(ctx);
		} catch {
			// 防御性放行
		}
	});

	// ---- 工具结果：委派失败（目标不存在等）→ 撤销对应窗口 ----
	pi.on("tool_result", async (event, ctx) => {
		try {
			const { toolName, toolCallId, isError } = event as {
				toolName?: string;
				toolCallId?: string;
				isError?: boolean;
			};
			if (!isError || !toolCallId) return;
			if (toolName !== "agent_call" && toolName !== "intercom") return;
			pendingSends.delete(toolCallId);
			pendingAsks.delete(toolCallId);
			refresh(ctx);
		} catch {
			// 防御性放行
		}
	});

	// ---- ask 结束（回复到达 / 超时 / 失败）：销掉对应窗口 ----
	pi.on("tool_execution_end", async (event, ctx) => {
		try {
			const { toolCallId } = event as { toolCallId?: string };
			if (toolCallId && pendingAsks.delete(toolCallId)) {
				refresh(ctx);
			}
		} catch {
			// 防御性放行
		}
	});

	// ---- 消息事件：用户输入 → 全部清空（自愈兜底）；其余仅刷新 ----
	pi.on("message_start", async (event, ctx) => {
		try {
			const { message } = event as { message?: { role?: string } };
			if (message?.role === "user") {
				pendingSends.clear();
				pendingAsks.clear();
			}
			refresh(ctx);
		} catch {
			// 防御性放行
		}
	});

	// ---- 干活中隐藏、停下后显示 ----
	pi.on("agent_start", async (_event, ctx) => {
		busy = true;
		refresh(ctx);
	});
	pi.on("agent_settled", async (_event, ctx) => {
		busy = false;
		refresh(ctx);
	});

	// ---- 外部活动上报（项目扩展的后台任务等） ----
	pi.events.on(ACTIVITY_EVENT, (data: unknown) => {
		try {
			const d = data as { source?: unknown; active?: unknown };
			if (typeof d?.source !== "string" || !d.source || typeof d.active !== "boolean") return;
			if (d.active) activeSources.add(d.source);
			else activeSources.delete(d.source);
			refresh();
		} catch {
			// 防御性放行
		}
	});

	// ---- 会话（重）开始：重置全部状态并清掉上一条会话可能残留的状态行 ----
	pi.on("session_start", async (_event, ctx) => {
		pendingSends.clear();
		pendingAsks.clear();
		activeSources.clear();
		busy = false;
		refresh(ctx);
	});

	// 兜底轮询：等待期间没有任何事件、回信悄悄到达时也能及时清窗（30 秒一次，开销可忽略）。
	try {
		const timer = setInterval(() => refresh(), 30_000);
		(timer as { unref?: () => void }).unref?.();
	} catch {
		// 防御性放行
	}
}
