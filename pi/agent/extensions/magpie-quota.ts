/**
 * magpie 模型额度标注：/mq 选择器（行内带额度状态）+ footer 状态行。
 *
 * 起因（2026-11-14 用户提出）：在 pi 里切 magpie 模型时，希望模型后面直接看到
 * 「额度是否已经耗尽」，免得切到一个没额度的模型白等一次请求。用户原话：
 * 「在pi里面选magpie的模型的时候能否在后面备注额度是否已经耗尽的信息，
 *   magpie上面可能有相关的信息，但是我切模型是直接在pi这边切，需要后面标注
 *   才比较方便选择」
 *
 * 为什么不改造内置 /model：
 *   1. 内置选择器每行只渲染 `model.id [provider]`，配置里的 `name` 只在底部
 *      「Model Name:」详情行显示，没法给整列加标注（见 pi dist 的
 *      modes/interactive/components/model-selector.js）；
 *   2. 内置交互命令不允许扩展覆盖——同名扩展命令会被跳过并告警。
 *   所以这里提供独立选择器 /mq：可用额度排在前面，行内直接标状态；同时把当前
 *   模型的额度状态挂到 footer，切完模型一眼能看见有没有踩到死模型。
 *
 * 数据来源（magpie 本机端点，无需 auth）：
 *   GET /v1/magpie/quotas  → 每个上游 provider 的额度窗口（used / remaining / resetsAt）
 *   GET /v1/models         → 模型的 owned_by 即额度 provider 名
 *   magpie 只跑在本机（127.0.0.1:3425），macmini 通过 SSH 反向隧道映射同一地址，
 *   所以两端都用同一个 baseUrl。
 *
 * 额度口径（实测各 provider 的字段）：
 *   - used + remaining 才是总量（trae-cn 的 limit 字段与 remaining 对不上，不能直接用）；
 *     剩余比例 = remaining / (used + remaining)；
 *   - 一个 provider 可能有多个额度窗口（codearts 有三个积分包），
 *     全部窗口剩余 <= 0 才算「耗尽」，否则按剩余最少的窗口提示；
 *   - 没有额度窗口的 provider（opencode-zen-free、cline）视为「无额度信息」，
 *     按可用处理、排在中间。
 *
 * 命令：/mq [过滤词]  打开带额度标注的 magpie 模型选择器
 *      /mq list      只打印各 provider 额度摘要，不开选择器
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { DynamicBorder, getAgentDir } from "pi-coding-agent";
import { Container, Input, Spacer, Text } from "pi-tui";

const PROVIDER = "magpie";
const STATUS_KEY = "magpie-quota";
const DEFAULT_BASE = "http://127.0.0.1:3425";
const QUOTA_TTL_MS = 20_000;
const CATALOG_TTL_MS = 10 * 60_000;
const FOOTER_REFRESH_MS = 3 * 60_000;
const FETCH_TIMEOUT_MS = 5_000;

type Level = "ok" | "dead" | "unknown";

interface ProviderState {
	level: Level;
	detail: string;
}

interface Snapshot {
	at: number;
	providers: Map<string, ProviderState>;
	owner: Map<string, string>;
	error?: string;
}

interface ModelState {
	level: Level;
	owner: string;
	detail: string;
}

function magpieBase(): string {
	const fromEnv = process.env.MAGPIE_BASE_URL;
	if (fromEnv && fromEnv.trim()) return fromEnv.trim().replace(/\/+$/, "");
	try {
		const raw = readFileSync(join(getAgentDir(), "models.json"), "utf8");
		const cfg = JSON.parse(raw) as { providers?: Record<string, { baseUrl?: unknown }> };
		const url = cfg.providers?.[PROVIDER]?.baseUrl;
		if (typeof url === "string" && url.trim() && !url.includes("$")) return url.trim().replace(/\/+$/, "");
	} catch {
		// 读不到配置就用默认地址
	}
	return DEFAULT_BASE;
}

// models.json 的 magpie baseUrl 是 OpenAI 风格地址（…:3425/v1），
// magpie 自己的管理端点挂在根上（/v1/magpie/quotas、/v1/models），所以先去尾再拼。
function endpoints(): { quotas: string; models: string } {
	let root = magpieBase();
	if (root.endsWith("/v1")) root = root.slice(0, -3);
	return { quotas: root + "/v1/magpie/quotas", models: root + "/v1/models" };
}

async function getJson(url: string): Promise<unknown> {
	const res = await fetch(url, {
		headers: { Authorization: "Bearer magpie" },
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	});
	if (!res.ok) throw new Error("HTTP " + res.status);
	return res.json();
}

function num(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function fmtReset(iso: string): string {
	const t = Date.parse(iso);
	if (!Number.isFinite(t)) return "";
	const d = new Date(t);
	const pad = (n: number) => String(n).padStart(2, "0");
	return pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

interface WindowInfo {
	name: string;
	remainingPct: number;
	exhausted: boolean;
	resetsAt?: string;
}

function windowInfo(raw: Record<string, unknown>): WindowInfo {
	const used = num(raw.used);
	const remainingRaw = num(raw.remaining);
	let remainingPct: number;
	if (used !== undefined && remainingRaw !== undefined && used + remainingRaw > 0) {
		remainingPct = (remainingRaw / (used + remainingRaw)) * 100;
	} else if (remainingRaw !== undefined && num(raw.limit)) {
		remainingPct = (remainingRaw / (num(raw.limit) as number)) * 100;
	} else if (used !== undefined) {
		remainingPct = Math.max(0, 100 - used);
	} else if (remainingRaw !== undefined) {
		remainingPct = remainingRaw > 0 ? 100 : 0;
	} else {
		remainingPct = 100;
	}
	const exhausted = remainingRaw !== undefined ? remainingRaw <= 0 : remainingPct <= 0;
	return {
		name: typeof raw.name === "string" && raw.name ? raw.name : "额度",
		remainingPct: Math.max(0, Math.min(100, remainingPct)),
		exhausted,
		resetsAt: typeof raw.resetsAt === "string" ? raw.resetsAt : undefined,
	};
}

function deriveProviderState(raw: Record<string, unknown>): ProviderState {
	const windows = Array.isArray(raw.windows) ? (raw.windows as Record<string, unknown>[]).filter(Boolean) : [];
	if (windows.length === 0) return { level: "unknown", detail: "无额度信息" };
	const infos = windows.map(windowInfo);
	const dead = infos.every((w) => w.exhausted);
	const worst = infos.reduce((a, b) => (b.remainingPct <= a.remainingPct ? b : a));
	if (dead) {
		const reset = worst.resetsAt ? "（" + fmtReset(worst.resetsAt) + " 重置）" : "";
		const what = infos.length > 1 ? infos.length + " 个额度包均耗尽" : worst.name + " 耗尽";
		return { level: "dead", detail: what + reset };
	}
	return { level: "ok", detail: worst.name + " 剩余 " + Math.round(worst.remainingPct) + "%" };
}

let cached: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;
let catalogAt = 0;

async function loadSnapshot(force = false): Promise<Snapshot> {
	const now = Date.now();
	if (!force && cached && now - cached.at < QUOTA_TTL_MS) return cached;
	if (inflight) return inflight;
	inflight = (async (): Promise<Snapshot> => {
		const base = endpoints();
		const providers = new Map<string, ProviderState>();
		const owner = new Map<string, string>(cached?.owner ?? []);
		let error: string | undefined;
		try {
			const payload = (await getJson(base.quotas)) as { data?: Record<string, unknown>[] };
			for (const item of payload.data ?? []) {
				const name = item?.provider;
				if (typeof name === "string" && name) providers.set(name, deriveProviderState(item));
			}
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		}
		if (owner.size === 0 || now - catalogAt > CATALOG_TTL_MS) {
			try {
				const payload = (await getJson(base.models)) as { data?: Record<string, unknown>[] };
				for (const item of payload.data ?? []) {
					const id = item?.id;
					const ownerName = item?.owned_by;
					if (typeof id === "string" && typeof ownerName === "string" && ownerName) owner.set(id, ownerName);
				}
				catalogAt = Date.now();
			} catch {
				// 目录拿不到就沿用旧映射；一条都没有时下面按「未知」处理
			}
		}
		const snapshot: Snapshot = { at: Date.now(), providers, owner, error };
		cached = snapshot;
		return snapshot;
	})().finally(() => {
		inflight = null;
	});
	return inflight;
}

function stateForModel(snapshot: Snapshot, modelId: string): ModelState {
	const owner = snapshot.owner.get(modelId);
	if (!owner) return { level: "unknown", owner: "", detail: snapshot.error ? "额度接口无响应" : "未匹配到额度来源" };
	const provider = snapshot.providers.get(owner);
	if (!provider) return { level: "unknown", owner, detail: "无额度信息" };
	return { level: provider.level, owner, detail: provider.detail };
}

function rankOf(level: Level): number {
	if (level === "ok") return 0;
	if (level === "unknown") return 1;
	return 2;
}

function footerText(state: ModelState): string | undefined {
	if (state.level === "dead") return "⛔ magpie " + state.owner + " " + state.detail;
	if (state.level === "ok") return "✅ magpie " + state.owner + " " + state.detail;
	return undefined;
}

interface Row {
	model: { provider: string; id: string; name?: string };
	state: ModelState;
}

function buildRows(ctx: ExtensionContext, snapshot: Snapshot): Row[] {
	const current = ctx.model;
	const models = ctx.modelRegistry
		.getAvailable()
		.filter((model) => model.provider === PROVIDER)
		.map((model) => ({ model: { provider: model.provider, id: model.id, name: model.name }, state: stateForModel(snapshot, model.id) }));
	models.sort((a, b) => {
		const byLevel = rankOf(a.state.level) - rankOf(b.state.level);
		if (byLevel !== 0) return byLevel;
		const aCurrent = current?.provider === a.model.provider && current?.id === a.model.id;
		const bCurrent = current?.provider === b.model.provider && current?.id === b.model.id;
		if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;
		return a.model.id.localeCompare(b.model.id);
	});
	return models;
}

function rowText(row: Row, isSelected: boolean, isCurrent: boolean, theme: any): string {
	const cursor = isSelected ? "→ " : "  ";
	const marker = isCurrent ? "✓ " : "  ";
	const idText = isSelected ? theme.fg("accent", row.model.id) : row.model.id;
	const label = row.state.owner ? row.state.owner + " " + row.state.detail : row.state.detail;
	const badge =
		row.state.level === "dead"
			? theme.fg("error", "⛔ " + label)
			: row.state.level === "ok"
				? theme.fg("success", "✅ " + label)
				: theme.fg("dim", "❔ " + label);
	return cursor + marker + idText + "  " + badge;
}

async function openPicker(pi: ExtensionAPI, ctx: ExtensionContext, snapshot: Snapshot, initialQuery: string): Promise<void> {
	const rows = buildRows(ctx, snapshot);
	if (rows.length === 0) {
		ctx.ui.notify("没有可用的 magpie 模型（检查 models.json 里的 magpie provider）", "warning");
		return;
	}
	const stamp = new Date(snapshot.at).toLocaleTimeString("zh-CN", { hour12: false });
	const picked = await ctx.ui.custom<string | null>((tui, theme, keybindings, done) => {
		const container = new Container();
		const input = new Input();
		const list = new Container();
		let query = initialQuery;
		let index = 0;
		let filtered: Row[] = rows;

		const refilter = () => {
			const q = query.trim().toLowerCase();
			if (!q) {
				filtered = rows;
			} else {
				filtered = rows.filter((row) => (row.model.id + " " + row.state.owner + " " + row.state.detail).toLowerCase().includes(q));
			}
			index = Math.min(index, Math.max(0, filtered.length - 1));
			renderList();
		};

		const renderList = () => {
			list.clear();
			if (filtered.length === 0) {
				list.addChild(new Text(theme.fg("muted", "  没有匹配的模型"), 0, 0));
				return;
			}
			const maxVisible = 12;
			const start = Math.max(0, Math.min(index - Math.floor(maxVisible / 2), filtered.length - maxVisible));
			const end = Math.min(start + maxVisible, filtered.length);
			for (let i = start; i < end; i++) {
				const row = filtered[i];
				if (!row) continue;
				const isCurrent = ctx.model?.provider === row.model.provider && ctx.model?.id === row.model.id;
				list.addChild(new Text(rowText(row, i === index, isCurrent, theme), 0, 0));
			}
			if (start > 0 || end < filtered.length) {
				list.addChild(new Text(theme.fg("muted", "  (" + (index + 1) + "/" + filtered.length + ")"), 0, 0));
			}
		};

		if (initialQuery) input.setValue(initialQuery);
		input.onSubmit = () => {
			const row = filtered[index];
			if (row) done(row.model.id);
		};

		container.addChild(new DynamicBorder());
		container.addChild(new Spacer(1));
		container.addChild(new Text(theme.fg("muted", "  magpie 模型 · 额度读取于 " + stamp + (snapshot.error ? "（额度接口异常：" + snapshot.error + "）" : "")), 0, 0));
		container.addChild(new Spacer(1));
		container.addChild(input);
		container.addChild(new Spacer(1));
		container.addChild(list);
		container.addChild(new Spacer(1));
		container.addChild(new Text(theme.fg("dim", "  ↑↓ 选择 · enter 切换 · esc 取消 · 输入过滤（可用额度在前，耗尽的排最后）"), 0, 0));
		container.addChild(new DynamicBorder());

		renderList();

		return {
			render: (width: number) => container.render(width),
			invalidate: () => container.invalidate(),
			handleInput: (data: string) => {
				if (keybindings.matches(data, "tui.select.up")) {
					if (filtered.length > 0) index = index === 0 ? filtered.length - 1 : index - 1;
					renderList();
					tui.requestRender();
					return;
				}
				if (keybindings.matches(data, "tui.select.down")) {
					if (filtered.length > 0) index = index === filtered.length - 1 ? 0 : index + 1;
					renderList();
					tui.requestRender();
					return;
				}
				if (keybindings.matches(data, "tui.select.confirm")) {
					const row = filtered[index];
					if (row) done(row.model.id);
					return;
				}
				if (keybindings.matches(data, "tui.select.cancel")) {
					done(null);
					return;
				}
				input.handleInput(data);
				const next = input.getValue();
				if (next !== query) {
					query = next;
					index = 0;
					refilter();
				}
				tui.requestRender();
			},
		};
	});

	if (!picked) return;
	await switchModel(pi, ctx, picked);
}

async function switchModel(pi: ExtensionAPI, ctx: ExtensionContext, modelId: string): Promise<void> {
	const model = ctx.modelRegistry.find(PROVIDER, modelId);
	if (!model) {
		ctx.ui.notify("找不到模型 " + modelId, "error");
		return;
	}
	const switched = await pi.setModel(model);
	if (!switched) ctx.ui.notify("切换到 " + modelId + " 失败（检查 magpie 是否在运行）", "error");
}

async function refreshFooter(ctx: ExtensionContext, force = false): Promise<void> {
	const model = ctx.model;
	if (!model || model.provider !== PROVIDER) {
		ctx.ui.setStatus(STATUS_KEY, undefined);
		return;
	}
	try {
		const snapshot = await loadSnapshot(force);
		const state = stateForModel(snapshot, model.id);
		ctx.ui.setStatus(STATUS_KEY, footerText(state));
	} catch {
		ctx.ui.setStatus(STATUS_KEY, undefined);
	}
}

function summaryText(snapshot: Snapshot): string {
	if (snapshot.error) return "额度接口异常：" + snapshot.error;
	const lines: string[] = [];
	const entries = [...snapshot.providers.entries()].sort((a, b) => rankOf(a[1].level) - rankOf(b[1].level));
	for (const [name, state] of entries) {
		const mark = state.level === "dead" ? "⛔" : state.level === "ok" ? "✅" : "❔";
		lines.push(mark + " " + name + "：" + state.detail);
	}
	if (lines.length === 0) lines.push("没有额度数据");
	return lines.join("\n");
}

export default function magpieQuota(pi: ExtensionAPI): void {
	let timer: ReturnType<typeof setInterval> | null = null;
	let activeCtx: ExtensionContext | null = null;

	const stopTimer = () => {
		if (timer) clearInterval(timer);
		timer = null;
	};

	pi.registerCommand("mq", {
		description: "选择 magpie 模型（带额度状态标注）",
		handler: async (args, ctx) => {
			const argument = (args ?? "").trim();
			const snapshot = await loadSnapshot(true);
			if (argument.toLowerCase() === "list") {
				ctx.ui.notify(summaryText(snapshot), "info");
				return;
			}
			if (!ctx.hasUI) {
				ctx.ui.notify(summaryText(snapshot), "info");
				return;
			}
			await openPicker(pi, ctx, snapshot, argument);
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		activeCtx = ctx;
		stopTimer();
		void refreshFooter(ctx, true);
		if (ctx.hasUI) {
			timer = setInterval(() => {
				if (activeCtx) void refreshFooter(activeCtx);
			}, FOOTER_REFRESH_MS);
			(timer as unknown as { unref?: () => void }).unref?.();
		}
	});

	pi.on("model_select", async (_event, ctx) => {
		activeCtx = ctx;
		void refreshFooter(ctx, false);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		stopTimer();
		activeCtx = null;
		ctx.ui.setStatus(STATUS_KEY, undefined);
	});
}
