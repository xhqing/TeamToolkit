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
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const CHECKER = join(homedir(), ".pi", "agent", "patch", "settle-repo-check", "settle-repo-check.py");
const ADD_STATE = join(homedir(), ".pi", "agent", "state", "add-mode.json");
const COMMIT_STATE = join(homedir(), ".pi", "agent", "state", "commit-mode.json");

type Dirty = { repo: string; changes: number; path: string };

// 已提醒过的「不干净仓库集合」签名：同一批不重复注入 / 通知，防循环
let nudged = "";
// 漏发版提醒的去重签名（与 nudged 分开，否则两类提醒会互相覆盖）
let nudgedStale = "";

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

export default function (pi: ExtensionAPI) {
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
			};

			// 漏发版提醒（2026-11-08 加）：发版自动衔接只挂在 /commit 流程末尾，
			// 走 PR + auto-merge 的链路没有环节回头检查——turn-diff 当天静默积压 7 个版本。
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
