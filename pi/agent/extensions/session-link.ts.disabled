/**
 * session-link —— 任务链追踪 + 会话生命周期联动 + 派活方向守卫
 *
 * 设计（2026-10-17 用户方案，Kit 实现）：
 * 用户本机的前台会话是「派活会话」：任务没完成用户不会关它，关了 = 用户判定完成。
 * 所以把 macmini 后台会话的「清上下文重启」绑到本机派活会话的关闭上——
 * 本机会话一关，它派活过的 macmini 会话（含 macmini 上派生的整条任务链）自动重置。
 *
 * 四个机制：
 * 1. **链标记**：派活（agent_call / agent_wake / intercom）时在消息尾部追加
 *    `<!-- pi-chain:<id> -->`。链的起点（本机 source 角色）生成新 id；
 *    被派活方（macmini replica 角色）从「收到的消息历史」里继承 id，继续向下透传。
 * 2. **链注册**：replica 侧每次出站派活时，把「链 → 自己 + 目标」登记进
 *    chain-registry.json，这样「重置链」时能找到链上全部会话（级联）。
 * 3. **关闭联动**：source 侧本机会话 session_shutdown（quit/new/resume/fork）→
 *    读本机登记找它发起的所有链 → ssh 通知 macmini 执行 chain-reset.sh。
 * 4. **方向守卫**：replica 侧（macmini）禁止跨机出站派活——目标必须在「本机会话
 *    清单」（从 duty.conf 读）里，否则 block（用户 2026-10-17：不允许远端设备
 *    利用本机资源跑后端进程）。
 */

import { execFile, spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const DIR = join(homedir(), ".pi", "agent", "patch", "session-link");
const CONFIG = join(DIR, "config.json");
const LOCAL_LINKS = join(DIR, "local-links.json"); // source 侧：本机会话 → 发起的链
const CHAIN_REGISTRY = join(DIR, "chain-registry.json"); // replica 侧：链 → 会话集合
const DUTY_CONF = join(DIR, "..", "duty-macmini", "duty.conf"); // macmini 上：本地会话清单
const LOG = join(DIR, "session-link.log");

const CHAIN_RE = /<!--\s*pi-chain:([a-z0-9-]{4,64})\s*-->/i;
const LOG_MAX_BYTES = 256 * 1024;

type Config = {
	role: "source" | "replica";
	/** replica 侧：允许的派活目标（macmini 本地会话）；空数组 = 从 duty.conf 读 */
	allowTargets?: string[];
	resetScript?: string; // macmini 侧重置脚本路径
};

function log(msg: string): void {
	try {
		mkdirSync(DIR, { recursive: true });
		if (existsSync(LOG) && readFileSync(LOG).length > LOG_MAX_BYTES) writeFileSync(LOG, "");
		appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`);
	} catch {
		/* 日志失败不影响主流程 */
	}
}

function loadJson<T>(path: string, fallback: T): T {
	try {
		if (!existsSync(path)) return fallback;
		return JSON.parse(readFileSync(path, "utf8")) as T;
	} catch {
		return fallback;
	}
}

function saveJson(path: string, data: unknown): void {
	try {
		mkdirSync(DIR, { recursive: true });
		writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
	} catch (err) {
		log(`saveJson failed: ${String(err)}`);
	}
}

function loadConfig(): Config {
	// 双重判定：config 文件优先，但 **hostname 是最终裁决者**
	// （macmini 与本机共享同步管道，config.json 可能被同步覆盖——
	//  hostname 不会骗人：macmini 主机名是 Macs-Mac-mini.local）。
	const cfg = loadJson<Partial<Config>>(CONFIG, {});
	const host = hostname().toLowerCase();
	const isMacmini = host.includes("mac-mini") || host.includes("macmini");
	const role: "source" | "replica" = isMacmini
		? "replica"
		: cfg.role === "source" || cfg.role === "replica"
			? cfg.role
			: "source";
	return { ...cfg, role };
}

/** 从 duty.conf 读 macmini 本地会话名（replica 侧用；本机没有该文件时返回空） */
function localSessionNames(): string[] {
	try {
		if (!existsSync(DUTY_CONF)) return [];
		return readFileSync(DUTY_CONF, "utf8")
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l && !l.startsWith("#"))
			.map((l) => l.split("|")[1]?.trim())
			.filter((n): n is string => !!n);
	} catch {
		return [];
	}
}

/** 当前会话在 macmini 上的注册名（进程 argv 里的 -n 参数；没有则 undefined） */
function sessionNameFromArgv(): string | undefined {
	const args = process.argv;
	const i = args.indexOf("-n");
	if (i >= 0 && args[i + 1]) return args[i + 1];
	const j = args.findIndex((a) => a.startsWith("--name="));
	if (j >= 0) return args[j].slice("--name=".length);
	return undefined;
}

function newChainId(): string {
	const rand = Math.random().toString(36).slice(2, 6);
	return `c-${Math.floor(Date.now() / 1000)}-${rand}`;
}

/** 从会话记录文件尾部找最近的链标记（继承用） */
function inheritChainId(sessionFile: string | undefined): string | undefined {
	if (!sessionFile || !existsSync(sessionFile)) return undefined;
	try {
		const raw = readFileSync(sessionFile, "utf8");
		const tail = raw.slice(-200_000); // 只扫尾部，够覆盖最近消息
		const matches = tail.match(new RegExp(CHAIN_RE.source, "gi"));
		if (!matches || matches.length === 0) return undefined;
		const last = matches[matches.length - 1];
		return last.match(CHAIN_RE)?.[1];
	} catch {
		return undefined;
	}
}

type LinkTarget = { name: string; mode: string; at: number };
type LocalLinks = { sessions: Record<string, { chains: Record<string, { targets: LinkTarget[]; updatedAt: number }> }> };
type ChainRegistry = { chains: Record<string, { sessions: string[]; updatedAt: number }> };

export default function sessionLinkExtension(pi: ExtensionAPI) {
	const config = loadConfig();

	// 启动诊断：确认扩展被加载、角色、argv（名字来源）
	pi.on("session_start", async () => {
		log(`[boot] role=${config.role} argv=${JSON.stringify(process.argv.slice(0, 6))} cwd=${process.cwd()}`);
	});

	// ── 1) 出站派活拦截：打链标记 + 登记 ────────────────────────────────
	pi.on("tool_call", async (event, ctx) => {
		try {
			const tool = event.toolName;
			const isWake = tool === "agent_wake";
			const isCall = tool === "agent_call";
			const isIntercom = tool === "intercom";
			const isBash = tool === "bash";
			if (!isWake && !isCall && !isIntercom && !isBash) return;

			const input = event.input as Record<string, unknown>;

			// ── bash 分支：真实跨机派活走 `ssh mac-mini '... pi-intercom (send|ask) --to X --text "..."'` ──
			if (isBash) {
				const cmd = String(input.command ?? "");
				if (!/pi-intercom\s+(ask|send)/.test(cmd)) return;
				const targetMatch = cmd.match(/--to\s+["']?([A-Za-z0-9_-]+)/);
				const target = targetMatch?.[1] ?? "";
				if (!target) return;

				// 方向守卫（replica）：bash 里跨机出站（目标不在本地清单）→ 拦
				if (config.role === "replica") {
					const allowed = new Set([...(config.allowTargets ?? []), ...localSessionNames()]);
					if (allowed.size > 0 && !allowed.has(target)) {
						log(`BLOCK bash 跨机出站：target=${target}`);
						return {
							block: true,
							reason:
								`禁止跨机出站派活（bash）：目标「${target}」不在 macmini 本地会话清单内。\n` +
								`规定（2026-10-17 用户立）：远端设备不得派活到本机。`,
						};
					}
				}

				// 链标记注入（--text "..." / --text '...' 的闭合引号前插入）
				let chainId: string | undefined;
				if (config.role === "source") chainId = newChainId();
				else chainId = inheritChainId(ctx.sessionManager.getSessionFile());
				if (!chainId) return;

				const textRe = /(--text\s*)(["'])([\s\S]*?)\2/;
				if (!textRe.test(cmd)) return; // 没有 --text（如 --help）→ 不处理
				const newCmd = cmd.replace(textRe, (_m, pre, q, body) => {
					const marker = CHAIN_RE.test(body) ? "" : ` <!-- pi-chain:${chainId} -->`;
					return `${pre}${q}${body}${marker}${q}`;
				});
				input.command = newCmd;

				// 登记
				if (config.role === "source") {
					const sessionFile = ctx.sessionManager.getSessionFile() ?? "unknown";
					const key = sessionFile.split("/").pop() ?? sessionFile;
					const links = loadJson<LocalLinks>(LOCAL_LINKS, { sessions: {} });
					const entry = (links.sessions[key] ??= { chains: {} });
					const chain = (entry.chains[chainId] ??= { targets: [], updatedAt: 0 });
					if (!chain.targets.some((t) => t.name === target)) {
						chain.targets.push({ name: target, mode: "bash-ssh", at: Date.now() });
					}
					chain.updatedAt = Date.now();
					saveJson(LOCAL_LINKS, links);
					log(`[source] chain=${chainId} target=${target} via=bash session=${key}`);
				} else {
					const self = sessionNameFromArgv();
					const registry = loadJson<ChainRegistry>(CHAIN_REGISTRY, { chains: {} });
					const chain = (registry.chains[chainId] ??= { sessions: [], updatedAt: 0 });
					for (const name of [self, target]) {
						if (name && !chain.sessions.includes(name)) chain.sessions.push(name);
					}
					chain.updatedAt = Date.now();
					saveJson(CHAIN_REGISTRY, registry);
					log(`[replica] chain=${chainId} self=${self ?? "?"} target=${target} via=bash`);
				}
				return;
			}

			const target = typeof input.name === "string" ? input.name : typeof input.to === "string" ? input.to : "";
			if (!target) return;

			// ── 方向守卫（replica = macmini）：禁止跨机出站（派活给本机或其它机器） ──
			if (config.role === "replica") {
				const allowed = new Set([...(config.allowTargets ?? []), ...localSessionNames()]);
				if (allowed.size > 0 && !allowed.has(target)) {
					log(`BLOCK 跨机出站派活：target=${target}（replica 只允许本地会话）`);
					return {
						block: true,
						reason:
							`禁止跨机出站派活：目标「${target}」不在 macmini 本地会话清单内。\n` +
							`规定（2026-10-17 用户立）：远端设备不得派活到本机（不占用本机资源跑后端进程）。\n` +
							`macmini 上可派活的目标：${[...allowed].join("、")}。`,
					};
				}
			}

			// ── 链标记：source 生成新链；replica 从收件历史继承 ──
			let chainId: string | undefined;
			if (config.role === "source") {
				chainId = newChainId();
			} else {
				chainId = inheritChainId(ctx.sessionManager.getSessionFile());
				if (!chainId) return; // replica 没有链（非派活场景）→ 不标记
			}

			// ── 写入消息（agent_call / intercom；agent_wake 没有消息体，只登记） ──
			if (!isWake) {
				const marker = ` <!-- pi-chain:${chainId} -->`;
				if (typeof input.message === "string" && !CHAIN_RE.test(input.message)) {
					input.message = input.message + marker;
				} else if (typeof input.text === "string" && !CHAIN_RE.test(input.text)) {
					input.text = input.text + marker;
				}
			}

			// ── 登记 ──
			if (config.role === "source") {
				// 本机侧：会话文件 → 链 → 目标
				const sessionFile = ctx.sessionManager.getSessionFile() ?? "unknown";
				const key = sessionFile.split("/").pop() ?? sessionFile;
				const links = loadJson<LocalLinks>(LOCAL_LINKS, { sessions: {} });
				const entry = (links.sessions[key] ??= { chains: {} });
				const chain = (entry.chains[chainId!] ??= { targets: [], updatedAt: 0 });
				if (!chain.targets.some((t) => t.name === target)) {
					chain.targets.push({ name: target, mode: isWake ? "wake" : isCall ? "call" : "intercom", at: Date.now() });
				}
				chain.updatedAt = Date.now();
				saveJson(LOCAL_LINKS, links);
				log(`[source] chain=${chainId} target=${target} session=${key}`);
			} else {
				// macmini 侧：链 → 自己 + 目标
				const self = sessionNameFromArgv();
				const registry = loadJson<ChainRegistry>(CHAIN_REGISTRY, { chains: {} });
				const chain = (registry.chains[chainId!] ??= { sessions: [], updatedAt: 0 });
				for (const name of [self, target]) {
					if (name && !chain.sessions.includes(name)) chain.sessions.push(name);
				}
				chain.updatedAt = Date.now();
				saveJson(CHAIN_REGISTRY, registry);
				log(`[replica] chain=${chainId} self=${self ?? "?"} target=${target}`);
			}
		} catch (err) {
			log(`tool_call handler error: ${String(err)}`);
			// 防御性放行：链接机制失灵不阻断正常派活
		}
	});

	// ── 2) replica 侧自注册：干完一轮（agent_settled）时把自己加入收到的链 ──
	// 覆盖「只收指令、没再派活」的末端会话（否则重置时会在链上漏掉它）。
	pi.on("agent_settled", async (_event, ctx) => {
		try {
			if (config.role !== "replica") return;
			const self = sessionNameFromArgv();
			if (!self) return;
			const chainId = inheritChainId(ctx.sessionManager.getSessionFile());
			if (!chainId) return;
			const registry = loadJson<ChainRegistry>(CHAIN_REGISTRY, { chains: {} });
			const chain = (registry.chains[chainId] ??= { sessions: [], updatedAt: 0 });
			if (!chain.sessions.includes(self)) {
				chain.sessions.push(self);
				chain.updatedAt = Date.now();
				saveJson(CHAIN_REGISTRY, registry);
				log(`[replica] settled 自注册 chain=${chainId} self=${self}`);
			}
		} catch (err) {
			log(`agent_settled handler error: ${String(err)}`);
		}
	});

	// ── 3) 本机会话关闭 → 重置它发起的整条链 ─────────────────────────────
	pi.on("session_shutdown", async (event, ctx) => {
		try {
			if (config.role !== "source") return;
			// reload 只是扩展重载：会话仍在，不触发
			if (event.reason === "reload") return;

			const sessionFile = ctx.sessionManager.getSessionFile() ?? undefined;
			const key = sessionFile ? (sessionFile.split("/").pop() ?? sessionFile) : undefined;
			if (!key) return;

			const links = loadJson<LocalLinks>(LOCAL_LINKS, { sessions: {} });
			const entry = links.sessions[key];
			if (!entry) return;
			const chains = Object.keys(entry.chains);
			if (chains.length === 0) return;

			const script = config.resetScript ?? "~/.pi/agent/patch/session-link/chain-reset.sh";
			const args = [script, ...chains.flatMap((c) => ["--chain", c])];
			const child = spawn("ssh", ["-o", "BatchMode=yes", "-o", "ConnectTimeout=5", "mac-mini", `bash ${args.join(" ")}`], {
				detached: true,
				stdio: "ignore",
			});
			child.unref();
			log(`[source] shutdown(${event.reason}) → 重置链 ${chains.join(",")}`);
			// 清理本地登记（这些链已交给 macmini 重置；重启后会话换新文件，旧记录无用）
			delete links.sessions[key];
			saveJson(LOCAL_LINKS, links);
		} catch (err) {
			log(`session_shutdown handler error: ${String(err)}`);
		}
	});
}
