/**
 * commit skill 收尾的 git status 汇报（pi 端工具强制）。
 *
 * 背景（2026-09-21 事故）：一次 /commit 汇报收尾时 AI 没有实际执行 `git status`，
 * 而是凭上下文手工拼了一段假输出贴进代码块——既猜错了工作区状态，还拼出
 * `git cast -A` 这种真实 git 不会输出的提示语。用户立规要求工具强制，本扩展即
 * 配套下限防线（元规则「规矩必须配套工具强制」）。
 *
 * 2026-11-09 改版（用户定稿）：**不再要求 AI 在回复里手贴 `git status`**。
 * 理由：手贴费输出 token、可能编造、还会被 TUI 流式渲染的残影坑到（曾出现
 * `Your branch is` 与完整行并存的显示错乱，见 xhqing/pi-harness#61）。改为：
 *   - AI 没贴 → 本扩展在 run 收尾把**实测**结果写成持久记录（appendEntry，只进
 *     TUI 聊天记录、**不参与 LLM 上下文**，不污染后续任何一轮）；
 *   - AI 贴了 → 照旧与实测比对，不符即整体替换并附说明（防编造下限防线不撤）。
 *
 * 三层防线：
 * 1. tool_result：带 AI_AUTHORIZED_COMMIT 标记的 commit 执行后追加提醒——收尾由本
 *    扩展自动记录实测 status，AI 不必手贴；若仍要贴，需与实测一致。
 * 2. message_end：assistant 消息含 `>> git status` 代码块时实测比对（规范化换行与
 *    行尾空白后逐字比），不符即替换为实测输出并加警示行。
 * 3. agent_settled：本 run 有授权 commit 且 AI 从未贴块 → 收集本 run 触及的所有 git
 *    目标目录（`git -C` / `cd`），逐个实测 `git status`，用 pi.appendEntry 写入持久
 *    记录 + registerEntryRenderer 渲染进聊天记录，并 notify 一句「已写入」。
 *
 * 为什么用 appendEntry 而不是 sendMessage：sendMessage 注入的是 custom message，
 * 官方文档明确「participate in LLM context」——会把这段 status 塞进模型下一轮的
 * 上下文。本记录只用于**用户事后核对**，不需要模型看到，所以用 appendEntry（文档：
 * custom entries do NOT participate in LLM context）。
 *
 * 判定与执行全程防御性 catch：本扩展失灵时不阻塞会话。
 *
 * 2026-11-11 补充（用户要求）：收尾记录**末尾必须给出总结**——逐个仓库核对
 * 「local main 与 origin/main 是否同步」+「是否存在未提交内容」，有问题的行用红色
 * 字体（theme.fg("error")）、干净的行用绿色字体（theme.fg("success")），问题仓库排在
 * 前面。背景：一次 run 可能触及十几个仓库（改名 / 批量同步场景），逐块的原始 status
 * 太长，用户一眼看不出到底哪几个仓库没收拾干净。
 * 口径说明：同步判断基于**本地 origin/main 缓存**（`git rev-list --left-right --count`），
 * 不做联网 fetch——授权 commit 后刚 push 过，本地缓存即远端状态；无 main / origin/main
 * 的仓库标红提示人工核对，不静默当作「已同步」。
 */

import { execFileSync, execSync } from "node:child_process";
import { basename } from "node:path";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Box, Spacer, Text } from "pi-tui";

const AUTH_MARK = "AI_AUTHORIZED_COMMIT";
// 与 git-commit-guard.ts 同源的 commit 匹配（含 git -C <path> commit 形态）。
// 2026-10-04 收紧：按 && / || / ; / | / 换行 切分命令段，只认「以 git 开头的命令段」——
// 此前用全文包含式匹配，文档 / 测试用例 / echo 文本里的 "git commit" 会把守卫误触发。
const SEGMENT_SPLIT = /&&|\|\||;|\n|\|/;
const GIT_COMMIT_SEGMENT = /^git(?:\s+-\S+(?:\s+[^\s-][^\s]*)?)*\s+commit(?![A-Za-z0-9_-])/;
// 最终回复里的 status 代码块：``` [语言标注] 换行 >> git status 换行 输出体 ```
const STATUS_BLOCK = /```[^\n]*\n>> git status\n([\s\S]*?)```/;
// appendEntry 的 customType
const ENTRY_TYPE = "git-status-guard";

const REMINDER =
	"\n\n[git-status-guard] 本次 run 已发生授权 commit：收尾时本扩展会自动把**实测** " +
	"`git status` 写成一条持久记录（只进聊天记录、不参与模型上下文），你**不必**手贴。" +
	"若仍想自己贴 `>> git status` 代码块，内容须与实测一致——不符会被替换并加说明。";

const REPLACED_NOTE =
	"> [git-status-guard] 上方代码块已替换为本扩展实测的真实 `git status` " +
	"输出——原贴内容与实际执行结果不符（可能未实际执行、编造或贴了过期" +
	"输出）。";

/** 命令里是否存在「以 git 开头且子命令为 commit」的命令段（与 git-commit-guard.ts 同源）。 */
function hasGitCommit(command: string): boolean {
	return command.split(SEGMENT_SPLIT).some((seg) => GIT_COMMIT_SEGMENT.test(seg.trim()));
}

function isAuthorizedCommit(command: string): boolean {
	return command.includes(AUTH_MARK) && hasGitCommit(command);
}

/** 在指定目录实测 git status；失败（非仓库 / 超时等）返回 null。 */
function runGitStatus(cwd: string): string | null {
	try {
		return execSync("git status", { cwd, encoding: "utf8", timeout: 10000 }).trim();
	} catch {
		return null;
	}
}

/**
 * 从命令里取所有 git 目标目录（按出现顺序，最后一个即最近）：`git -C <path>` 与 `cd <path>` 都算。
 * 背景：会话 cwd 常在 main 主工作区、实际提交在 worktree 里；一次 run 也可能动多个仓库
 * （2026-11-09 一次改名动了 15 个仓库），所以收尾要把这些目标逐个实测。
 */
function commandTargets(command: string, cwd: string): string[] {
	const toAbs = (raw: string): string => {
		let p = raw.trim().replace(/^["']|["']$/g, "");
		if (p === "~" || p.startsWith("~/")) p = (process.env.HOME ?? "~") + p.slice(1);
		if (p.startsWith("/")) return p;
		return `${cwd.replace(/\/+$/, "")}/${p}`;
	};
	const out: string[] = [];
	for (const raw of command.split(SEGMENT_SPLIT)) {
		const seg = raw.trim();
		if (!seg) continue;
		const cd = /^cd\s+(.+)$/.exec(seg);
		if (cd) out.push(toAbs(cd[1].split(/\s+/)[0]));
		if (/^git\b/.test(seg)) {
			const re = /\s-C\s*("[^"]*"|'[^']*'|\S+)/g;
			let hit: RegExpExecArray | null;
			while ((hit = re.exec(seg)) !== null) out.push(toAbs(hit[1]));
		}
	}
	return out;
}

/** 在指定目录跑一条 git 命令，失败（非仓库 / 超时等）返回 null，不抛。 */
function gitOut(dir: string, args: string[]): string | null {
	try {
		return execFileSync("git", ["-C", dir, ...args], {
			encoding: "utf8",
			timeout: 5000,
		}).trim();
	} catch {
		return null;
	}
}

/** 取本地或 origin 的主分支引用全名（main 优先，回退 master），不存在返回 null。 */
function mainRef(dir: string, prefix: string): string | null {
	for (const name of ["main", "master"]) {
		const ref = `${prefix}/${name}`;
		if (gitOut(dir, ["rev-parse", "--verify", "--quiet", ref]) !== null) return ref;
	}
	return null;
}

/** 单个仓库的收尾诊断：未提交项数 + local main 与 origin/main 的领先 / 落后。 */
interface RepoDiag {
	dir: string;
	label: string;
	branch: string;
	dirty: number; // 未提交项数（含未跟踪文件）；-1 = 读取失败
	ahead: number; // local main 领先 origin/main 的提交数
	behind: number; // local main 落后 origin/main 的提交数
	comparable: boolean; // false = 无法核对（无 main / 无 origin/main / 读取失败）
	note: string; // 无法核对时的原因
}

function diagnose(dir: string): RepoDiag {
	const branch = gitOut(dir, ["branch", "--show-current"]) ?? "";
	const porcelain = gitOut(dir, ["status", "--porcelain"]);
	const dirty = porcelain === null ? -1 : porcelain.split("\n").filter((l) => l.trim()).length;

	const localRef = mainRef(dir, "refs/heads");
	const remoteRef = mainRef(dir, "refs/remotes/origin");
	let ahead = 0;
	let behind = 0;
	let comparable = false;
	let note = "";
	if (!localRef) note = "没有本地 main 分支，无法核对";
	else if (!remoteRef) note = "没有 origin/main，无法核对远端";
	else {
		// left = 只在 origin/main 上的提交（落后），right = 只在 main 上的提交（领先）
		const out = gitOut(dir, ["rev-list", "--left-right", "--count", `${remoteRef}...${localRef}`]);
		const [behindRaw, aheadRaw] = (out ?? "").split(/\s+/);
		const b = Number(behindRaw);
		const a = Number(aheadRaw);
		if (Number.isFinite(b) && Number.isFinite(a)) {
			ahead = a;
			behind = b;
			comparable = true;
		} else note = "无法读取 main 与 origin/main 的差异";
	}
	return { dir, label: basename(dir) || dir, branch, dirty, ahead, behind, comparable, note };
}

/** 总结行：有任何一个问题 → bad=true（渲染红色），全干净 → 绿色。 */
function summaryLine(d: RepoDiag): { bad: boolean; text: string } {
	const bits: string[] = [];
	if (!d.comparable) bits.push(d.note);
	else {
		if (d.behind > 0) bits.push(`local main 落后 origin/main ${d.behind} 个提交`);
		if (d.ahead > 0) bits.push(`local main 领先 origin/main ${d.ahead} 个提交（未推送）`);
	}
	if (d.dirty > 0) bits.push(`未提交 ${d.dirty} 项`);
	else if (d.dirty < 0) bits.push("无法读取工作区状态");

	const bad = bits.length > 0;
	const branchHint = d.branch && d.branch !== "main" && d.branch !== "master" ? `（${d.branch}）` : "";
	const detail = bad ? bits.join(" · ") : "local main 与 origin/main 同步 · 工作区干净";
	return { bad, text: `${bad ? "❌" : "✅"} ${d.label}${branchHint}：${detail}` };
}

/** 规范化：统一换行、去行尾空白、整体 trim 后逐字比对。 */
function normalize(s: string): string {
	return s
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((l) => l.trimEnd())
		.join("\n")
		.trim();
}

interface GitStatusData {
	at: number;
	results: { dir: string; status: string }[];
	diags?: RepoDiag[]; // 收尾总结数据（旧记录可能没有）
	summaryOnly?: boolean; // true = AI 已贴过 status，这条记录只放总结
}

export default function (pi: ExtensionAPI) {
	let armed = false; // 本次 agent run 内发生过授权 commit
	let sawStatusBlock = false; // 本次 run 内 assistant 消息出现过 status 代码块
	let lastTarget: string | null = null; // 最近一次 bash 命令里的 git 目标目录（worktree 场景）
	const targets = new Set<string>(); // 本次 run 触及的全部 git 目标目录

	// 持久记录渲染：只进聊天记录，不参与 LLM 上下文
	pi.registerEntryRenderer<GitStatusData>(ENTRY_TYPE, (entry, _opts, theme) => {
		const data = entry.data ?? { at: Date.now(), results: [] };
		const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
		box.addChild(new Text(theme.bold(theme.fg("accent", "git-status-guard")), 0, 0));
		box.addChild(
			new Text(
				theme.fg(
					"dim",
					data.summaryOnly
						? "收尾总结（git status 已在回复中贴出；本记录不参与模型上下文）"
						: "实测 git status + 收尾总结（本扩展执行，不参与模型上下文）",
				),
				0,
				0,
			),
		);
		data.results.forEach((r, i) => {
			// 多个 worktree 之间空一行，视觉上区分各自的状态块（2026-11-09 用户要求）
			if (i > 0) box.addChild(new Spacer(1));
			box.addChild(new Text(theme.fg("accent", r.dir), 0, 0));
			box.addChild(new Text(">> git status\n" + r.status, 0, 0));
		});

		// 收尾总结（2026-11-11 用户要求）：问题仓库排前面、红色，干净的排后面、绿色
		const diags = data.diags ?? [];
		if (diags.length > 0) {
			const bad = diags.filter((d) => summaryLine(d).bad);
			const good = diags.filter((d) => !summaryLine(d).bad);
			box.addChild(new Spacer(1));
			const head =
				bad.length > 0
					? `—— 收尾总结：${diags.length} 个仓库，${bad.length} 个需要处理 ——`
					: `—— 收尾总结：${diags.length} 个仓库，全部同步且干净 ——`;
			box.addChild(new Text(theme.bold(theme.fg("accent", head)), 0, 0));
			for (const d of [...bad, ...good]) {
				const line = summaryLine(d);
				box.addChild(new Text(theme.fg(line.bad ? "error" : "success", line.text), 0, 0));
			}
		}
		return box;
	});

	pi.on("agent_start", async () => {
		armed = false;
		sawStatusBlock = false;
		lastTarget = null;
		targets.clear();
	});

	// 置位锚点：授权 commit 命令进入执行；同时记录 git 目标目录
	pi.on("tool_call", async (event) => {
		try {
			if (isToolCallEventType("bash", event)) {
				const command = event.input.command ?? "";
				if (isAuthorizedCommit(command)) armed = true;
				const list = commandTargets(command, process.cwd());
				if (list.length > 0) {
					lastTarget = list[list.length - 1] ?? lastTarget;
					for (const t of list) targets.add(t);
				}
			}
		} catch {
			// 防御性放行
		}
	});

	// 第一层：授权 commit 的工具结果末尾追加提醒
	pi.on("tool_result", async (event) => {
		try {
			if (event.toolName !== "bash") return;
			const input = event.input as { command?: string };
			if (!isAuthorizedCommit(input.command ?? "")) return;
			return {
				content: [...event.content, { type: "text" as const, text: REMINDER }],
			};
		} catch {
			// 防御性放行
		}
	});

	// 第二层：最终消息里的 status 代码块与实测比对，不符即替换
	pi.on("message_end", async (event, ctx) => {
		try {
			if (event.message.role !== "assistant" || !armed) return;
			const content = event.message.content;
			let changed = false;
			const newContent = content.map((part) => {
				if (part.type !== "text") return part;
				if (STATUS_BLOCK.test(part.text)) sawStatusBlock = true;
				if (!armed || !STATUS_BLOCK.test(part.text)) return part;
				const pasted = STATUS_BLOCK.exec(part.text)?.[1] ?? "";
				// 候选目标：本次 run 里最近的 git 目标目录（worktree）优先，其次会话 cwd。
				// 贴出的内容匹配任一候选即放过；都不匹配时替换为第一个可实测的目标（优先 worktree）。
				const candidates = [lastTarget, ctx.cwd].filter((p): p is string => Boolean(p));
				let real: string | null = null;
				let matched = false;
				for (const candidate of candidates) {
					const out = runGitStatus(candidate);
					if (out === null) continue;
					if (real === null) real = out;
					if (normalize(pasted) === normalize(out)) {
						matched = true;
						break;
					}
				}
				if (real === null || matched) return part;
				changed = true;
				return {
					...part,
					text:
						part.text.replace(STATUS_BLOCK, "```\n>> git status\n" + real + "\n```") +
						"\n\n" +
						REPLACED_NOTE,
				};
			});
			if (changed) return { message: { ...event.message, content: newContent } };
		} catch {
			// 防御性放行：本扩展失灵不影响会话
		}
	});

	// 第三层：run 收尾 → 实测并写成持久记录（不进 LLM 上下文），末尾附红/绿的仓库总结
	pi.on("agent_settled", async (_event, ctx) => {
		try {
			if (!armed) return;
			armed = false;
			const missed = !sawStatusBlock;
			sawStatusBlock = false;
			const dirs = targets.size > 0 ? [...targets] : [ctx.cwd];

			const results: { dir: string; status: string }[] = [];
			const diags: RepoDiag[] = [];
			for (const dir of dirs) {
				const status = runGitStatus(dir);
				if (status === null) continue; // 非仓库 / 不可读 → 不进状态块，也不进总结
				results.push({ dir, status });
				diags.push(diagnose(dir));
			}
			if (results.length === 0) return;

			// AI 已贴过 status（且第二层已核对与实测一致）→ 只补一条总结记录，不重复状态块
			pi.appendEntry<GitStatusData>(
				ENTRY_TYPE,
				missed
					? { at: Date.now(), results, diags }
					: { at: Date.now(), results: [], diags, summaryOnly: true },
			);
			ctx.ui.notify(
				missed
					? "[git-status-guard] 已把实测 git status 与收尾总结写入会话记录（不参与模型上下文，可随时回看）"
					: "[git-status-guard] 已把收尾总结写入会话记录（不参与模型上下文，可随时回看）",
				"info",
			);
		} catch {
			// 防御性放行
		}
	});
}
