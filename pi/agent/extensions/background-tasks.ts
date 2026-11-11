/**
 * pi 宿主后台任务工具（全局通用能力，2026-10-11 自 trading-agent 项目级扩展上移）。
 *
 * 为什么需要它：pi 官方设计「不内建后台 bash」（README 明说 use tmux），而
 * 「长任务放后台跑 → 完成时通知唤醒 AI → 继续下一步」是很多工作流的刚需
 * （盯盘密采样循环、长构建、批量任务等）——没有后台任务能力，这类循环根本转不起来。
 * 本扩展用 Node 子进程 + 完成时 `pi.sendMessage(..., { triggerTurn: true })` 补上这一能力：
 *
 *   - `background_run`   ≈ CC 的 `Bash(run_in_background=true)`：非阻塞启动、输出落文件，
 *                          进程结束时以通知消息唤醒 AI（消息里带输出尾部 + 完整日志路径）。
 *   - `background_stop`  ≈ CC 的 `TaskStop`：杀整个进程组（含子进程）。
 *   - `background_list`  ≈ 查看后台任务清单与日志路径。
 *
 * 来历与解耦：2026-09-29 为 trading-agent 的 pi 宿主接入而写（项目级扩展）；
 * 2026-10-11 用户指出「后台跑命令」是通用能力、应放全局——故上移为全局扩展，供
 * 所有 pi 会话使用。上移时做了三处解耦：① 不再依赖任何项目的守卫脚本与项目根探测；
 * ② 日志固定落「会话工作目录 tmp/pi-bg/」（缺省自动创建）；③ 文案去项目化——项目
 * 专属规则由各项目自己的守卫 / skill 规定（如 trading-agent 的 trade-guards 仍会
 * 拦不合规跑法，其密采样停盯提醒由该项目守卫桥在 `background_stop` 结果里注入）。
 *
 * 通知策略（2026-10-14 用户立：通知的显示与消费不需要用户感知）：
 *   ① 通知消息 `display: false`——不渲染到会话窗口（仍进 AI 上下文、仍触发唤醒）；
 *   ② 忙时聚合——AI 正在干活（agent_start..agent_settled）期间完成的任务不逐条投递，
 *      静默积攒，AI 空闲后合并为一条摘要发出（单条照旧附输出尾部；合并批次只列
 *      id / 状态 / 日志路径、不带尾部——AI 按需读日志，避免上下文被过期尾部灌满）。
 *
 * 与全局 agent-wait-banner 扩展联动：后台任务运行期间通过 pi.events 发
 * `agent-wait-banner:activity`（`{ source: "background-tasks", active }`），
 * 会话界面显示「🟥🟥🟥 还有后台进程在运行中，请稍等 🟥🟥🟥」；全部任务结束即撤。
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Type } from "typebox";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

interface BgTask {
	id: string;
	command: string;
	label: string;
	pid: number;
	/** 会话工作目录（启动命令与日志目录的基准）。 */
	cwd: string;
	logPath: string;
	/** 日志相对会话工作目录的路径（展示用，如 tmp/pi-bg/<stag>-bg-1.log；stag = 完整会话标识）。 */
	logRel: string;
	startedAt: number;
	endedAt?: number;
	status: "running" | "exited" | "killed" | "failed";
	exitCode: number | null;
	signal?: string | null;
	/** 是否已计入「运行中」联动计数（防 error / exit 重复扣减）。 */
	counted?: boolean;
}

/** 待投递的通知（AI 忙时积压，空闲后单条 / 合并发出，见文件头「通知策略」）。 */
interface PendingNote {
	/** 合并列表里的一行（短）。 */
	entryLine: string;
	/** 单条投递时的完整文本（带输出尾部）。 */
	fullText?: string;
}

/** 输出尾部（通知里只带尾部，完整输出在日志文件）。 */
function tailOf(logPath: string, maxLines = 60, maxChars = 6000): string {
	try {
		const text = fs.readFileSync(logPath, "utf8");
		let lines = text.split("\n");
		if (lines.length > maxLines) lines = lines.slice(-maxLines);
		let out = lines.join("\n").trimEnd();
		if (out.length > maxChars) out = out.slice(-maxChars);
		return out;
	} catch {
		return "";
	}
}

function fmtDuration(ms: number): string {
	const s = Math.max(0, Math.round(ms / 1000));
	if (s < 60) return `${s} 秒`;
	const m = Math.floor(s / 60);
	return `${m} 分 ${s % 60} 秒`;
}

export default function backgroundTasks(pi: ExtensionAPI) {
	const tasks = new Map<string, BgTask>();
	let counter = 0;
	let shuttingDown = false;
	// 通知聚合状态（2026-10-14，见文件头「通知策略」）：
	let agentBusy = false; // AI 是否正在干活（agent_start..agent_settled）
	let flushTimer: NodeJS.Timeout | undefined; // 聚合窗口定时器（收拢瞬时完成的多任务）
	const pending: PendingNote[] = []; // 待投递通知（忙时积压）

	// ---- 与全局 agent-wait-banner 扩展联动 ----
	// 后台任务运行期间，会话界面（footer 状态行）显示
	// 「🟥🟥🟥 还有后台进程在运行中，请稍等 🟥🟥🟥」，避免用户误以为会话已空闲而关掉窗口。
	// 协议：pi.events 事件 `agent-wait-banner:activity`，载荷 { source, active }。
	const ACTIVITY_EVENT = "agent-wait-banner:activity";
	const ACTIVITY_SOURCE = "background-tasks";
	let runningCount = 0;
	const publishActivity = (active: boolean): void => {
		try {
			pi.events.emit(ACTIVITY_EVENT, { source: ACTIVITY_SOURCE, active });
		} catch {
			// 事件总线不可用时忽略（提醒是增强项，不影响任务本身）
		}
	};
	const releaseCount = (task: BgTask): void => {
		if (!task.counted) return;
		task.counted = false;
		runningCount = Math.max(0, runningCount - 1);
		if (runningCount === 0) publishActivity(false);
	};

	/** 会话工作目录（日志与命令都以它为基准；取不到时退到进程 cwd）。 */
	function sessionCwd(ctx?: ExtensionContext): string {
		try {
			const cwd = ctx?.sessionManager?.getCwd?.();
			if (typeof cwd === "string" && cwd) return cwd;
		} catch {
			// 忽略，退到 process.cwd()
		}
		return process.cwd();
	}

	function killGroup(pid: number, signal: NodeJS.Signals): void {
		try {
			process.kill(-pid, signal); // 负号 = 杀整个进程组（含子进程）
		} catch {
			try {
				process.kill(pid, signal);
			} catch {
				// 进程已退出
			}
		}
	}

	function notifyCompletion(task: BgTask, signal: string | null): void {
		const duration = fmtDuration((task.endedAt ?? Date.now()) - task.startedAt);
		const outcome =
			task.status === "exited"
				? `退出码 ${task.exitCode}`
				: signal
					? `被信号 ${signal} 终止`
					: "已结束";
		const tail = tailOf(task.logPath);
		const body = tail ? `\n──── 输出尾部 ────\n${tail}` : "\n（无输出）";
		const head =
			`[后台任务完成] ${task.id}${task.label ? `「${task.label}」` : ""} ${outcome}（运行 ${duration}）\n` +
			`命令：${task.command}\n` +
			`完整日志：${task.logRel}\n` +
			`请读取日志 / 输出完成分析，并按本会话的工作流程执行后续步骤。`;
		queueNote({
			entryLine: `- ${task.id}${task.label ? `「${task.label}」` : ""} ${outcome}（运行 ${duration}）| 日志 ${task.logRel}`,
			fullText: head + body,
		});
	}

	/** 通知入队：AI 空闲 → 短窗口后发出（收拢瞬时完成的多任务）；忙碌 → 静默积攒、等空闲再发。 */
	function queueNote(note: PendingNote): void {
		if (shuttingDown) return;
		pending.push(note);
		if (!agentBusy) scheduleFlush();
	}

	/** 调度 flush（1.2 秒聚合窗口；已有窗口在跑则不重复调度）。 */
	function scheduleFlush(): void {
		if (flushTimer || shuttingDown) return;
		flushTimer = setTimeout(() => {
			flushTimer = undefined;
			flushPending();
		}, 1200);
	}

	/** 发出积压通知：单条 → 完整文本（附输出尾部）；多条 → 合并摘要（不带尾部）。 */
	function flushPending(): void {
		if (pending.length === 0) return;
		const batch = pending.splice(0);
		const single = batch.length === 1 ? batch[0] : undefined;
		const text = single?.fullText
			? single.fullText
			: `[后台任务通知] ${batch.length} 个任务已结束：\n` +
				batch.map((n) => n.entryLine).join("\n") +
				`\n需要时读取对应日志分析。`;
		try {
			pi.sendMessage(
				{ customType: "bg-task", content: text, display: false },
				{ deliverAs: "followUp", triggerTurn: true },
			);
		} catch {
			// pi 正在退出等场景：忽略
		}
	}

	pi.registerTool({
		name: "background_run",
		label: "后台运行",
		description:
			"在后台运行一条 bash 命令（立即返回、不阻塞对话）；命令结束时 pi 会以通知消息唤醒你并附上输出尾部（若你正忙于其它工具调用，多个任务的完成通知会合并为一条摘要，届时按需读取日志）。" +
			"完整输出落在会话工作目录的 tmp/pi-bg/ 下（通知里给出具体路径）。" +
			"长任务（构建 / 批量处理 / 采样等）用它能不阻塞对话、且结束会收到唤醒通知；" +
			"项目若有自己的后台跑法规定，按其规定使用。",
		parameters: Type.Object({
			command: Type.String({ description: "要后台运行的 bash 命令（不要自己加 nohup / 行尾 & / sleep 轮询，直接写原命令即可）" }),
			label: Type.Optional(Type.String({ description: "任务标签，便于识别（如「全库构建」）" })),
		}),
		executionMode: "sequential",
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const cwd = sessionCwd(ctx);
			const logDir = path.join(cwd, "tmp", "pi-bg");
			fs.mkdirSync(logDir, { recursive: true });
			counter += 1;
			const id = `bg-${counter}`;
			// 日志文件按会话分名（<stag>-<id>.log）：任务编号是进程内计数、多会话并行时
			// 会重复（都从 bg-1 起），不加会话前缀会互相覆盖 / 混入别的会话的输出。
			// 2026-11-11 修（Issue #77 / T188HKUS）：不能截前 8 位——pi 的会话 id 是 UUIDv7，
			// 前 8 位是毫秒时间戳高位，相隔几十秒启动的两个会话会相同，日志照样会串。
			// 改用完整会话标识（去掉非字母数字，与 trading-agent 的 session_tag.py 同口径）。
			// 会话 id 若取不到（极端情况）退到进程启动时间戳。
			const sid = String(ctx?.sessionManager?.getSessionId?.() ?? "");
			const sidSafe = sid.replace(/[^A-Za-z0-9]/g, "") || `${Date.now().toString(36)}`;
			const logName = `${sidSafe}-${id}.log`;
			const logPath = path.join(logDir, logName);
			const logRel = `tmp/pi-bg/${logName}`;
			let fd: number | undefined;
			try {
				fd = fs.openSync(logPath, "a");
				// bash -c（非登录 shell）：pi 进程已继承用户环境（PATH / 代理等），
				// 不必再 source 一遍 ~/.bash_profile——登录 shell 会把 profile 报错行
				// 混进每段输出尾部，对输出分析是纯噪声。
				const child = spawn("bash", ["-c", params.command as string], {
					cwd,
					detached: true, // 独立进程组，停任务时整组杀
					stdio: ["ignore", fd, fd],
					env: { ...process.env },
				});
				if (child.pid === undefined) {
					throw new Error("spawn 未返回 pid");
				}
				fs.closeSync(fd);
				fd = undefined;
				const task: BgTask = {
					id,
					command: params.command as string,
					label: params.label ?? "",
					pid: child.pid,
					cwd,
					logPath,
					logRel,
					startedAt: Date.now(),
					status: "running",
					exitCode: null,
				};
				tasks.set(id, task);
				task.counted = true;
				runningCount += 1;
				publishActivity(true);
				child.on("error", (err) => {
					task.status = "failed";
					task.endedAt = Date.now();
					releaseCount(task);
					const note = `[后台任务失败] ${id}${task.label ? `「${task.label}」` : ""} 启动失败：${String(err)}`;
					queueNote({ entryLine: `- ${note}`, fullText: note });
				});
				child.on("exit", (code, signal) => {
					task.endedAt = Date.now();
					task.exitCode = code;
					task.signal = signal;
					if (task.status === "running") task.status = "exited";
					releaseCount(task);
					if (!shuttingDown) notifyCompletion(task, signal);
				});
				return {
					content: [
						{
							type: "text",
							text:
								`后台任务已启动：${id}${task.label ? `「${task.label}」` : ""}\n` +
								`日志：${logRel}\n` +
								`任务结束时你会收到通知（单条附输出尾部；多个任务在你忙碌期完成时会合并为一条摘要）；期间可继续其他工作，不要 sleep 等待。`,
						},
					],
					details: { id, pid: child.pid, log: logRel },
				};
			} catch (e) {
				if (fd !== undefined) {
					try {
						fs.closeSync(fd);
					} catch {
						// 忽略
					}
				}
				return {
					content: [{ type: "text", text: `❌ 后台任务启动失败：${String(e)}` }],
					isError: true,
					details: { id },
				};
			}
		},
	});

	pi.registerTool({
		name: "background_list",
		label: "后台任务清单",
		description: "列出后台任务（运行中 / 已完成）及其日志路径。",
		parameters: Type.Object({}),
		async execute() {
			if (tasks.size === 0) {
				return { content: [{ type: "text", text: "（无后台任务记录）" }], details: {} };
			}
			const lines: string[] = [];
			for (const t of tasks.values()) {
				const state =
					t.status === "running"
						? `运行中（已 ${fmtDuration(Date.now() - t.startedAt)}）`
						: t.status === "killed"
							? "已停止"
							: t.status === "failed"
								? "启动失败"
								: `已结束（退出码 ${t.exitCode ?? "?"}）`;
				lines.push(
					`- ${t.id}${t.label ? `「${t.label}」` : ""} [${state}] ${t.command.slice(0, 100)} | 日志 ${t.logRel}`,
				);
			}
			return { content: [{ type: "text", text: lines.join("\n") }], details: {} };
		},
	});

	pi.registerTool({
		name: "background_stop",
		label: "停止后台任务",
		description: "停止一个后台任务（杀掉整个进程组，含其子进程）。",
		parameters: Type.Object({
			id: Type.String({ description: "后台任务 id（如 bg-3；用 background_list 可查）" }),
		}),
		executionMode: "sequential",
		async execute(_toolCallId, params) {
			const task = tasks.get(params.id);
			if (!task) {
				const known = tasks.size ? [...tasks.keys()].join(", ") : "（无）";
				return {
					content: [{ type: "text", text: `❌ 未找到任务 ${params.id}。当前任务：${known}` }],
					isError: true,
					details: {},
				};
			}
			const previous = task.status;
			if (task.status === "running") {
				task.status = "killed";
				killGroup(task.pid, "SIGTERM");
				await new Promise((resolve) => setTimeout(resolve, 800));
				killGroup(task.pid, "SIGKILL"); // 兜底：SIGTERM 未及时退出的（如卡 IO 的进程）
			}
			const stateText =
				previous === "running" ? "运行中" : previous === "killed" ? "已停止" : previous === "failed" ? "启动失败" : `已结束（退出码 ${task.exitCode ?? "?"}）`;
			return {
				content: [{ type: "text", text: `已停止 ${task.id}${task.label ? `「${task.label}」` : ""}（原状态：${stateText}）。` }],
				details: { id: task.id },
			};
		},
	});

	// ---- 通知聚合：AI 忙闲感知（2026-10-14）----
	// AI 干活期间（agent_start..agent_settled）完成的任务不逐条投递——静默积攒；
	// settled（AI 不再自动继续）后统一 flush。正常「空闲等待 → 任务完成 → 唤醒」
	// 循环不受影响（完成时 AI 是空闲的 → 单条通知照常发出）。
	pi.on("agent_start", async () => {
		agentBusy = true;
	});
	pi.on("agent_settled", async () => {
		agentBusy = false;
		if (pending.length > 0) scheduleFlush();
	});

	// 会话退出（Ctrl+C / /new / /resume 等）：停掉本会话遗留的后台任务，避免孤儿进程。
	pi.on("session_shutdown", async () => {
		shuttingDown = true;
		if (flushTimer) {
			clearTimeout(flushTimer);
			flushTimer = undefined;
		}
		pending.length = 0;
		for (const t of tasks.values()) {
			if (t.status === "running") {
				t.status = "killed";
				killGroup(t.pid, "SIGTERM");
			}
		}
		runningCount = 0;
		publishActivity(false);
	});

	// 新会话（含 /new、/resume、/fork 换会话）：重置状态——退出标记不重置的话，
	// 换会话后新起任务的完成通知会被 forever 抑制；任务表清空（旧会话的任务已随 shutdown 停掉）。
	pi.on("session_start", async () => {
		shuttingDown = false;
		agentBusy = false;
		if (flushTimer) {
			clearTimeout(flushTimer);
			flushTimer = undefined;
		}
		pending.length = 0;
		tasks.clear();
		counter = 0;
		runningCount = 0;
		publishActivity(false);
	});
}
