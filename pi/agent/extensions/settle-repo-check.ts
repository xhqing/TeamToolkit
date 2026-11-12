/**
 * 子项目仓库收尾巡检（pi 端扩展，agent_settled 钩子）。
 *
 * 2026-10-09 用户立规：所有 Agent 会话结束任务之前必须检查自己负责的子项目仓库是否
 * 干净，不干净的全部要处理干净。本扩展 = 该规则的「顺手检查 + 提醒」工具化：每轮收尾
 * （agent_settled = Pi 不会再自动继续）时调用 ~/.pi/agent/patch/settle-repo-check/settle-repo-check.py 巡检
 * 本会话所在 Agent 项目的子项目仓库——
 *   - 全部干净 → 什么都不做（清空去重签名）；
 *   - 发现不干净 → ① 通知用户（ctx.ui.notify）；② 就同一批不干净仓库向会话注入一次
 *     提醒（pi.sendMessage + triggerTurn，促其按规则处理）。
 *
 * 防循环：去重签名（不干净仓库集合）——同一批只注入一次；集合变化（清掉一些 / 又脏了
 * 新的）或全部干净后重新计数。真是在途 WIP 的，Agent 向用户说明即可，不会被反复打断。
 *
 * 判定逻辑：底层调用同一个 Python 脚本（见全局 AGENTS.md「会话收尾检查」节）。
 *
 * 2026-10-31 增：与 add-mode / commit-mode 两个独立开关联动——被暂停的仓库（用户
 * 想看 diff、暂时不想提交）不催提交：从 dirty 列表里过滤掉，全部被过滤时保持静默。
 * 两个开关各有独立状态文件（add-mode.json / commit-mode.json），任一暂停即跳过。
 *
 * 2026-11-12 增：**残留 worktree 的提示按所有权路由**（用户立规：巡检提示要发给相关
 * 会话，不能无差别发给当前会话）。判定顺序：
 *   1) 所有权记录（state/worktrees.jsonl，worktree-name-guard.ts / worktree-adopt.py 写的）
 *      里的会话还"在线 → 直接经 pi-intercom 发给它（不打扰当前会话）；
 *      若记录里就是本会话 → 照旧 notify 本会话；
 *   2) 没有可用记录时，找 cwd 恰好是该 worktree 目录的活跃会话 → 发给它；
 *   3) 都没有 → 只写一行日志（state/settle-repo-check.log），**不改 notify、不 triggerTurn、
 *      不写进会话消息**——agent_settled 每轮都跑，这里再发就等于换个方式继续打扰。
 * 另外 session_start 会拍一份 worktree 路径基线：没有所有权记录、且本会话开始前就存在的
 * worktree 一律按第 3 条静默处理（不把上几轮遗留的历史包袱压给新会话）。
 *
 * dirty / unpublished 两类**不跟着收窄**：它们确实是当前 Agent（Leader）的职责，收窄
 * 会漏掉真正需要处理的事（2026-11-12 用户明确）。
 */

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const AGENT_DIR = join(homedir(), ".pi", "agent");
const CHECKER = join(AGENT_DIR, "patch", "settle-repo-check", "settle-repo-check.py");
const INTERCOM_CLI = join(AGENT_DIR, "npm", "node_modules", ".bin", "pi-intercom");
const LOG_FILE = join(AGENT_DIR, "state", "settle-repo-check.log");
const ADD_STATE = join(AGENT_DIR, "state", "add-mode.json");
const COMMIT_STATE = join(AGENT_DIR, "state", "commit-mode.json");
const OUTBOX_REQUEST_EVENT = "intercom:outbox-request";
const OUTBOX_RESULT_EVENT = "intercom:outbox-result";
const OUTBOX_TIMEOUT_MS = 15_000;

type Dirty = { repo: string; changes: number; path: string };
type Worktree = {
	repo: string;
	path: string;
	branch: string;
	owner_session?: string;
	owner_cwd?: string;
};
type Session = { id: string; name?: string; cwd?: string; status?: string };
type OutboxResult = { requestId?: string; status?: string; code?: string; detail?: string };

// 已提醒过的「不干净仓库集合」签名：同一批不重复注入 / 通知，防循环
let nudged = "";
// 漏发版提醒的去重签名（与 nudged 分开，否则两类提醒会互相覆盖）
let nudgedStale = "";
// 残留 worktree 提醒的去重签名
let nudgedWorktree = "";
// 会话启动时各仓库 worktree 路径基线：null = 还没拍到（此时不做「本轮新出现」判定）
let baseline: Set<string> | null = null;

/** 状态缓存：两个开关文件各自按 mtime 失效。 */
let stateCache: { sig: string; entries: string[] } | null = null;

function norm(raw: string): string {
	let p = raw.trim();
	if (p === "~") p = homedir();
	else if (p.startsWith("~/")) p = join(homedir(), p.slice(2));
	const abs = resolve(p);
	let real = abs;
	try {
		real = realpathSync.native(abs);
	} catch {
		// 路径不存在：保留绝对路径
	}
	return real.replace(/\/+$/, "") || "/";
}

/** 只写一行日志（静默兜底 / 路由结果用）；失败不影响会话。 */
function logLine(line: string): void {
	try {
		mkdirSync(dirname(LOG_FILE), { recursive: true });
		appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${line}\n`);
	} catch {
		// 日志写不进去就算了
	}
}

/** 读单个开关的状态文件条目；失败当空。 */
function entriesOf(file: string): { entries: string[]; mtime: number } {
	try {
		const st = statSync(file);
		const data = JSON.parse(readFileSync(file, "utf8")) as { manual?: unknown };
		const entries = Array.isArray(data?.manual)
			? data.manual.filter((x): x is string => typeof x === "string" && x.trim() !== "").map(norm)
			: [];
		return { entries, mtime: st.mtimeMs };
	} catch {
		return { entries: [], mtime: -1 };
	}
}

/** 读两个开关（add-mode / commit-mode 各自独立的状态文件）；任一暂停即算被暂停。 */
function pausedEntries(): string[] {
	const a = entriesOf(ADD_STATE);
	const c = entriesOf(COMMIT_STATE);
	const sig = `${a.mtime}|${c.mtime}`;
	if (stateCache && stateCache.sig === sig) return stateCache.entries;
	const entries = [...a.entries, ...c.entries];
	stateCache = { sig, entries };
	return entries;
}

/** 仓库路径（它自己或它所在仓库）是否被 commit-mode 暂停（add / commit 任一）。 */
function isManualRepo(path: string): boolean {
	const entries = pausedEntries();
	if (entries.length === 0) return false;
	const p = norm(path);
	if (entries.some((e) => p === e || p.startsWith(e + "/"))) return true;
	let root = p;
	try {
		const out = execFileSync("git", ["-C", p, "rev-parse", "--show-toplevel"], {
			encoding: "utf8",
			timeout: 5000,
			stdio: ["ignore", "pipe", "ignore"],
		});
		if (out.trim()) root = norm(out);
	} catch {
		// 不是 git 仓库：用路径本身参与前缀判定
	}
	return entries.some((e) => root === e || root.startsWith(e + "/"));
}

/** 活跃 pi 会话列表（pi-intercom broker）；取不到就当没有。 */
function activeSessions(): Session[] {
	if (!existsSync(INTERCOM_CLI)) return [];
	try {
		const out = execFileSync(INTERCOM_CLI, ["list", "--json"], {
			encoding: "utf8",
			timeout: 20_000,
			stdio: ["ignore", "pipe", "ignore"],
		});
		const data = JSON.parse(out) as { sessions?: Session[] };
		return (data.sessions ?? []).filter((s) => typeof s.id === "string" && s.id !== "");
	} catch {
		return [];
	}
}

/** 子代理会话 / intercom CLI 桥不算可投递对象（它们是临时的、不是「相关会话」）。 */
function routable(s: Session): boolean {
	const name = (s.name ?? "").trim();
	if (!name) return true;
	return !name.startsWith("subagent-chat-") && name !== "pi-intercom-cli";
}

/** 残留 worktree 的投递去向（纯函数，便于单测）。 */
export type WorktreeRoutes = {
	/** 归本会话（所有权记录就是自己 / 本轮新增的）→ notify 当前会话 */
	mine: Worktree[];
	/** 发给其它会话 */
	batches: Array<{ to: string; items: Worktree[] }>;
	/** 找不到相关会话 → 只记日志 */
	silent: Worktree[];
};

/**
 * 判定每条残留 worktree 该发给谁（2026-11-12 用户立规：提示发给相关会话）。
 * 顺序：所有权记录 → 记录里的 cwd 唯一命中 → worktree 目录本身的活跃会话 →
 *       本轮新增（无记录）算自己的 → 其余静默。
 */
export function decideWorktreeRoutes(opts: {
	leftover: Worktree[];
	sessions: Session[];
	selfIds: string[];
	baseline: Set<string> | null;
}): WorktreeRoutes {
	const { leftover, sessions, selfIds, baseline } = opts;
	const isSelf = (id: string) => selfIds.includes(id);
	const mine: Worktree[] = [];
	const silent: Worktree[] = [];
	const batches = new Map<string, Worktree[]>();

	for (const w of leftover) {
		const key = norm(w.path);
		const owner = (w.owner_session ?? "").trim();

		if (owner && isSelf(owner)) {
			mine.push(w);
			continue;
		}

		let target = owner ? sessions.find((s) => s.id === owner) : undefined;
		if (!target && w.owner_cwd) {
			// 所有权记录的 sessionId 与 intercom id 可能不同（子代理 / 稳定 ID）：
			// 按记录里的 cwd 精确匹配，唯一命中才用，避免送错人
			const same = sessions.filter((s) => !isSelf(s.id) && s.cwd && norm(s.cwd) === norm(w.owner_cwd as string));
			if (same.length === 1) target = same[0];
		}
		if (!target) target = sessions.find((s) => s.cwd && norm(s.cwd) === key);

		if (target && isSelf(target.id)) {
			mine.push(w);
			continue;
		}
		if (target && routable(target)) {
			const arr = batches.get(target.id) ?? [];
			arr.push(w);
			batches.set(target.id, arr);
			continue;
		}
		// 没有所有者记录、但本会话开始前就存在 → 历史包袱，不打扰
		if (!owner && baseline && !baseline.has(key)) {
			mine.push(w);
			continue;
		}
		silent.push(w);
	}

	return { mine, batches: [...batches].map(([to, items]) => ({ to, items })), silent };
}

export default function (pi: ExtensionAPI) {
	const pendingOutbox = new Map<string, (result: OutboxResult) => void>();
	pi.events.on(OUTBOX_RESULT_EVENT, (result: OutboxResult) => {
		if (!result || typeof result.requestId !== "string") return;
		const resolver = pendingOutbox.get(result.requestId);
		if (resolver) {
			pendingOutbox.delete(result.requestId);
			resolver(result);
		}
	});

	/** 经 pi-intercom 的 outbox 通道发给另一个会话（以本会话身份发送）。 */
	async function sendToSession(to: string, message: string): Promise<{ ok: boolean; detail: string }> {
		const requestId = `settle-worktree-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
		return await new Promise((resolvePromise) => {
			const timer = setTimeout(() => {
				pendingOutbox.delete(requestId);
				resolvePromise({ ok: false, detail: "等待 pi-intercom 发送结果超时（本会话可能未启用 pi-intercom）" });
			}, OUTBOX_TIMEOUT_MS);
			pendingOutbox.set(requestId, (result) => {
				clearTimeout(timer);
				if (result.status === "sent") {
					resolvePromise({ ok: true, detail: result.messageId ?? "" });
				} else {
					resolvePromise({
						ok: false,
						detail: `${result.code ?? result.status ?? "未知"}${result.detail ? `：${result.detail}` : ""}`,
					});
				}
			});
			pi.events.emit(OUTBOX_REQUEST_EVENT, {
				version: 1,
				requestId,
				extensionId: "settle-repo-check",
				extensionName: "Settle Repo Check",
				to,
				message,
			});
		});
	}

	// 会话启动时拍 worktree 路径基线（纯 git，不查 gh）；拍不到就保持 null（不做新出现判定）
	pi.on("session_start", async (_event, ctx) => {
		try {
			const out = execFileSync("python3", [CHECKER, "--cwd", ctx.cwd, "--worktree-paths"], {
				encoding: "utf8",
				timeout: 30_000,
				stdio: ["ignore", "pipe", "ignore"],
			});
			const data = JSON.parse(out) as { paths?: string[] };
			baseline = new Set((data.paths ?? []).map((p) => norm(p)));
		} catch {
			baseline = null;
		}
	});

	pi.on("agent_settled", async (_event, ctx) => {
		try {
			if (!existsSync(CHECKER)) return;

			const out = execFileSync("python3", [CHECKER, "--cwd", ctx.cwd, "--json"], {
				encoding: "utf8",
				timeout: 30000,
			});
			const data = JSON.parse(out) as {
				agent: string;
				dirty: Dirty[];
				unpublished?: Array<{ repo: string; version: string; commits: number }>;
				worktrees?: Worktree[];
			};

			// ---------------------------------------------------------------------
			// 残留 worktree（2026-11-08 加；2026-11-12 改为按所有权路由）
			// ---------------------------------------------------------------------
			const leftover = data.worktrees ?? [];
			if (leftover.length > 0) {
				const selfId = String(ctx.sessionManager.getSessionId());
				const intercomSelf = (process.env.PI_INTERCOM_SESSION_ID ?? "").trim();
				const selfIds = [selfId, intercomSelf].filter((id) => id !== "");

				const sessions = activeSessions();
				const { mine, batches, silent } = decideWorktreeRoutes({ leftover, sessions, selfIds, baseline });

				const sig =
					leftover.map((w) => `${w.repo}:${w.branch}`).sort().join(",") +
					`|${batches.map((b) => b.to).sort().join(",")}|${mine.length}`;
				if (sig !== nudgedWorktree) {
					nudgedWorktree = sig;

					if (mine.length > 0) {
						ctx.ui.notify(
							`[settle-repo-check] 有 ${mine.length} 个已合并且干净的 worktree 可清理：` +
								mine.map((w) => `${w.repo}:${w.branch}`).join("、"),
							"info",
						);
					}
					for (const w of silent) {
						logLine(`worktree 静默：${w.repo}:${w.branch} → ${w.path}（无在线所有者会话，非本轮新增）`);
					}
					for (const { to, items } of batches) {
						const name = sessions.find((s) => s.id === to)?.name ?? "";
						const list = items.map((w) => `${w.repo}:${w.branch} → ${w.path}`).join("；");
						const text =
							`[settle-repo-check] 巡检发现以下 worktree 已合并且工作区干净，可以清理：${list}。` +
							`确认用完就 \`git -C ${join(homedir(), "Developer", items[0]?.repo ?? "")} worktree remove <路径>\`，` +
							`并删掉已合并分支。这条提示只发给建它的会话，不需要回复用户。`;
						const sent = await sendToSession(to, text);
						logLine(
							sent.ok
								? `worktree 已投递：${list} → ${name || to}（${sent.detail}）`
								: `worktree 投递失败：${list} → ${name || to}（${sent.detail}）`,
						);
					}
				}
			} else {
				nudgedWorktree = "";
			}

			// ---------------------------------------------------------------------
			// 漏发版提醒（2026-11-08 加）：发版自动衔接只挂在 /commit 流程末尾，
			// 走 PR + auto-merge 的链路没有环节回头检查——turn-diff 当天静默积压 7 个版本。
			// 这一类不跟着收窄：它确实是当前 Agent（Leader）的职责（2026-11-12 用户明确）。
			// ---------------------------------------------------------------------
			const stale = data.unpublished ?? [];
			if (stale.length > 0) {
				const staleList = stale.map((s) => `${s.repo}（v${s.version}，${s.commits} 个待发布提交）`).join("、");
				const staleSig = stale.map((s) => `${s.repo}@${s.version}`).sort().join(",");
				if (staleSig !== nudgedStale) {
					nudgedStale = staleSig;
					ctx.ui.notify(
						`[settle-repo-check] 有功能类改动但版本未发布：${staleList}（该走 /release）`,
						"warning",
					);
				}
			} else {
				nudgedStale = "";
			}
			const all = data.dirty ?? [];
			// 被 commit-mode 暂停的仓库：用户暂时不想提交，不催
			const dirty = all.filter((d) => !isManualRepo(d.path));
			const skipped = all.length - dirty.length;

			if (dirty.length === 0) {
				nudged = "";
				return;
			}

			const sig = dirty
				.map((d) => d.repo)
				.sort()
				.join(",");
			if (sig === nudged) return; // 同一批已提醒过：保持安静，等它自己处理
			nudged = sig;

			const list = dirty.map((d) => `${d.repo}（${d.changes} 处改动）`).join("、");
			const skipNote = skipped > 0 ? `（另有 ${skipped} 个被 commit-mode 暂停的仓库已跳过）` : "";
			ctx.ui.notify(
				`[settle-repo-check] ${data.agent} 名下还有 ${dirty.length} 个子项目仓库不干净：${list} ` +
					`（2026-10-09 用户规则：收尾前必须处理干净）${skipNote}`,
				"warning",
			);

			const send = (
				pi as unknown as {
					sendMessage?: (
						message: { customType: string; content: string; display: boolean },
						options?: { triggerTurn?: boolean },
					) => void;
				}
			).sendMessage;
			send?.(
				{
					customType: "settle-repo-check",
					content:
						`[settle-repo-check] 你名下还有 ${dirty.length} 个子项目仓库不干净：${list}。` +
						`按用户 2026-10-09 立的规则，收尾前要全部处理干净——各仓库走 /add → /commit` +
						`（该 bump / 发版就照常走）；若是在途 WIP（如 dev-workflow 先行的测试产物），` +
						`向用户说明即可，不要硬提交。` +
						(skipped > 0 ? `另：${skipped} 个被 commit-mode 暂停（add / commit 手动）的仓库已跳过，不要去提交。` : ""),
					display: true,
				},
				{ triggerTurn: true },
			);
		} catch {
			// 防御性放行：巡检失灵不影响会话（与其它 guard 一致）
		}
	});
}