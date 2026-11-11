/**
 * git commit 未授权拦截（pi 端，tool_call 拦截）。
 *
 * 两道理由，缺一不可：
 *
 * 1. **授权**（2026-09-21 用户立规）：commit 不论分支 / worktree / 流程一律须用户明确
 *    授权，无 `AI_AUTHORIZED_COMMIT` 标记的 `git commit` 一律 deny。授权标记仅限：
 *    /commit skill 的串联命令、用户当轮明确授权后、/add 预检完全干净后的自动衔接、
 *    跨会话委派、常设授权下的自动提交。
 * 2. **闸门**（2026-11-11 用户立）：**禁止裸 `git commit`**——裸 commit 会跳过 commit
 *    skill 的二门检测（敏感内容扫描 = gitleaks + AI 语义扫描；cache 检测），等于绕开
 *    安全阀。所以放行前要求 `~/.pi/agent/state/commit-gate.json` 存在且未过期，而这张
 *    闸门只由 `/commit` 流程（经 `patch/commit-gate/gate.py begin`）打开；流程结束或失败
 *    时用 `gate.py end` 关上。当天实测：绕过三轮当天就发生了，靠事后提醒兜不住。
 *
 * 规则变更时两端同步改（pi / CC），不能只改一边（「规矩必须配套工具强制」）。
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const AUTH_MARK = "AI_AUTHORIZED_COMMIT";
// 2026-10-04 收紧：先按 && / || / ; / | / 换行 切分命令段，只认「以 git 开头的命令段」——
// 此前用全文包含式匹配，文档 / 测试用例 / echo 文本里出现的 "git commit" 会被误判成
// 真命令（实际误伤过：喂给 CC hook 的测试 payload 里含这句话，把守卫误触发了）。
// 只匹配 git commit 本体（含 git -C <path> commit 形态与带 -m 等子选项的形式）；
// 不匹配 git log --grep=commit、git checkout 等非 commit 子命令。
const SEGMENT_SPLIT = /&&|\|\||;|\n|\|/;
const GIT_COMMIT_SEGMENT = /^git(?:\s+-\S+(?:\s+[^\s-][^\s]*)?)*\s+commit(?![A-Za-z0-9_-])/;
const GATE_PATH = join(homedir(), ".pi", "agent", "state", "commit-gate.json");

/** 命令里是否存在「以 git 开头且子命令为 commit」的命令段。 */
function hasGitCommit(command: string): boolean {
	return command.split(SEGMENT_SPLIT).some((seg) => GIT_COMMIT_SEGMENT.test(seg.trim()));
}

/** 闸门是否开着（文件在、能解析、未过期）。任何异常都按「关闭」处理。 */
function gateOpen(): boolean {
	try {
		const data = JSON.parse(readFileSync(GATE_PATH, "utf8")) as { expires_at?: number };
		return typeof data.expires_at === "number" && data.expires_at > Date.now() / 1000;
	} catch {
		return false;
	}
}

const DENY_AUTH =
	"[git-commit-guard] 拦截：commit 需用户明确授权（不论分支 / worktree / " +
	"流程，全局铁律 + 2026-09-21 用户立规）。明确授权仅五种形式：用户主动" +
	"触发 /commit、用户当轮消息明确授权 commit、/add 预检完全干净后的" +
	"自动衔接、跨会话委派（其它 agent 依常设授权发起）、常设授权下的自动提交" +
	"（工作区 / 暂存区有待提交内容即直接提交，2026-10-04 用户立）。" +
	"获得授权后在命令末尾加注释标记 `# AI_AUTHORIZED_COMMIT` " +
	"再执行；未获授权不得擅自加标记。";

const DENY_GATE =
	"[git-commit-guard] 拦截：**禁止裸 git commit**（2026-11-11 用户立规）。" +
	"裸 commit 会跳过 commit skill 的两门检测——敏感内容扫描（gitleaks + AI 语义扫描）" +
	"与 cache 检测——等于绕开安全阀。正确做法：走 `/commit` 流程（它会先开闸、做检测，" +
	"再提交）。若确实已在按 skill 流程执行，只是闸门过期：重新执行 " +
	"`python3 ~/.pi/agent/patch/commit-gate/gate.py begin` 后重试；" +
	"流程结束或失败时用 `gate.py end` 关闸。查看状态：`gate.py status`。";

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (isToolCallEventType("bash", event)) {
				const command = event.input.command ?? "";
				if (!hasGitCommit(command)) return;
				if (!command.includes(AUTH_MARK)) {
					return { block: true, reason: DENY_AUTH };
				}
				if (!gateOpen()) {
					return { block: true, reason: DENY_GATE };
				}
			}
		} catch {
			// 判定异常时不阻塞会话（与 test-cases-guard 一致）
		}
	});
}