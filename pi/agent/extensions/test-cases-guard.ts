/**
 * dev-workflow 测试文件写保护（pi 端，tool_call 拦截）。
 *
 * 保护对象（测试文件全量）、授权标记、拆段判定、误伤边界与历史多端 hook 逐条对齐
 * （2026-10-17 起 pi 端为唯一实现）；pi 端事件在进程内，故实现为 TS extension 而非 spawn
 * Python。规则变更时两处同步改，不能只改一边（「规矩必须配套工具强制」）。
 *
 * 背景见 dev-workflow skill 的 references/test-cases.md（2026-09-21 三次修订，
 * 2026-11-13 修订）：测试（用例）定义权经 Hopper 除名后归 dev-agent（Atlas）的
 * Leader；Worker 对一切测试文件只读 + 可运行、禁止增删改——防「改测试迁就实现」，
 * 也防补「快照式测试」。
 *
 * 2026-10-09 用户收窄（两端同步改）：守卫只防「改测试内容」，不拦「把测试文件
 * 入暂存区」——`git add` 不改变文件内容，而 dev-workflow 要求「测试 + 实现同一次
 * 提交、同一个 PR」，需要开发 Agent 能把测试文件加进暂存区；此前 `git add` 被
 * 归入写动词、把这条动线也拦住了。收窄后：bash 写动词、Write/Edit 工具、git 的
 * rm/mv/clean/restore/checkout/stash（这些都会改动或搬走测试内容）照常拦。
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

// —— 作用范围（2026-11-13 用户立）——
// 测试开发分离 + 测试文件写保护只覆盖 dev-agent（Atlas）名下的子项目（测试定义权已随
// Hopper 除名并入 dev-agent，其它 agent 的项目不套用这套范式）。范围按仓库注册表的
// 「子项目映射」表实时解析，worktree 通过 `.git` 里的 `gitdir:` 反查主仓库名。
const REGISTRY = path.join(os.homedir(), ".pi", "agent", "docs", "agents-registry.md");
let scopeCache: { mtimeMs: number; repos: Set<string> } | null = null;

function devAgentSubprojects(): Set<string> {
	try {
		const st = fs.statSync(REGISTRY);
		if (scopeCache && scopeCache.mtimeMs === st.mtimeMs) return scopeCache.repos;
		const repos = new Set<string>();
		for (const line of fs.readFileSync(REGISTRY, "utf-8").split("\n")) {
			const m = line.match(/^\|\s*dev-agent（Atlas）\s*\|\s*([^|]+?)\s*\|/);
			if (m) repos.add(m[1].replace(/[`*]/g, "").trim());
		}
		scopeCache = { mtimeMs: st.mtimeMs, repos };
		return repos;
	} catch {
		return new Set();
	}
}

/** 从路径向上找 git 仓库根，返回主仓库目录名（worktree 反查主仓库）。 */
function repoNameOf(start: string): string | null {
	let dir = path.resolve(start);
	for (let i = 0; i < 40; i++) {
		const gitPath = path.join(dir, ".git");
		if (fs.existsSync(gitPath)) {
			try {
				if (fs.statSync(gitPath).isFile()) {
					const m = fs.readFileSync(gitPath, "utf-8").match(/gitdir:\s*(.+)/);
					if (m) {
						const mainGit = m[1].trim().replace(/\/worktrees\/[^/]+\/?$/, "");
						return path.basename(path.dirname(mainGit));
					}
				}
				return path.basename(dir);
			} catch {
				return path.basename(dir);
			}
		}
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}

/** 目标是否落在 dev-agent 名下的子项目仓库里（含其 worktree）。读不到注册表时放行。 */
function inDevAgentSubproject(targetHint?: string): boolean {
	const repos = devAgentSubprojects();
	if (repos.size === 0) return false;
	const raw = targetHint ? targetHint : process.cwd();
	let probe = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
	if (!fs.existsSync(probe)) probe = path.dirname(probe);
	const name = repoNameOf(probe);
	return name !== null && repos.has(name);
}

const AUTH_MARK = "TEST_CASES_WRITE_OK";

// —— 测试目标判定（路径 / token 形态）——
// 存量 test-cases/ 与常见测试目录（须为独立路径段，不误伤 latest / contest）
const TEST_DIR_SEG = /(?:^|\/)(?:test-cases|tests?|__tests__|__snapshots__|spec|e2e)(?:\/|$)/;
// 测试文件名（basename 形态锚定结尾）
const TEST_FILE = /(?:^|\/)(?:[\w.+-]+\.(?:test|spec)\.[A-Za-z0-9.]+|test_[\w.+-]+\.py|[\w.+-]+_test\.py|[\w.+-]+_test\.go|conftest\.py|[\w.+-]+\.snap)$/;

function isTestTarget(path: string): boolean {
	if (!path) return false;
	return TEST_DIR_SEG.test(path) || TEST_FILE.test(path);
}

// 任意参数含测试目标即违规的写动词（mv 源或目标任一在保护内都算）
const WRITE_ANY = /\b(rm|rmdir|shred|unlink|touch|mkdir|tee|truncate|dd|chmod|chown|mv)\b/;
// 目标参数（尾部 token）是测试目标才违规的写动词（cp src dst：源是读取，放行）
const WRITE_DST = /\b(cp|ln|rsync|scp|install)\b/;
// 会改动 / 搬走测试内容的 git 子命令：注意**不含 `git add`**——暂存不改变文件
// 内容，且开发侧要把测试与实现放进同一次提交、需要它入暂存区（2026-10-09 收窄）
const GIT_WRITE = /\bgit\s+(rm|mv|clean|restore|checkout|stash)\b/;
const SED_INPLACE = /\bsed\s+(?:-\w*i\w*|--in-place)/;
const REDIRECT = />{1,2}\s*(\S+)/;
const FIND_DELETE = /\s-delete\b/;
// Bash 快速预筛：不含这些字样的命令直接放行（段级精判兜底准确性）
const PREFILTER = /test|spec|e2e|snap|conftest/i;

const DENY_REASON =
	"[test-cases-guard] 拦截：dev-agent 名下子项目的测试文件（测试目录 test/ tests/ __tests__/ " +
	"spec/ e2e/、*.test.* / *.spec.* / test_*.py / *_test.go / conftest.py " +
	"等）对 Worker 只读 + 可运行，禁止增删改——测试定义权归 Leader（测试先行，防「改测试迁就实现」" +
	"与「补快照式测试」；dev-workflow 纪律）。若确需写入（Leader 出题、用户授权的例外操作），" +
	"在命令末尾加授权标记 `# TEST_CASES_WRITE_OK`，或由用户手动操作；若发现测试 / 需求本身有问题，" +
	"终止开发并向 Leader / 用户上报，不自行改测试绕过（`git add` 把测试文件入暂存区不在此列，不拦——暂存不改内容）。" +
	"其它 agent 的项目不在这套范式范围内，不受拦截。";

function stripQuotes(tok: string): string {
	return tok.replace(/^['"]+|['"]+$/g, "");
}

/** 段中是否出现指向测试目标的 token。 */
function segTestTarget(seg: string): boolean {
	for (const tok of seg.split(/[\s'"]+/)) {
		if (tok && isTestTarget(tok)) return true;
	}
	return false;
}

/** 判定单个命令段是否对测试目标有写操作。 */
function segViolates(seg: string): boolean {
	const hasTarget = segTestTarget(seg);
	const m = seg.match(REDIRECT);
	const redirectHit = !!m && isTestTarget(stripQuotes(m[1]));
	if (!hasTarget && !redirectHit) return false;
	if (WRITE_ANY.test(seg) || GIT_WRITE.test(seg) || SED_INPLACE.test(seg)) return true;
	if (redirectHit) return true;
	if (FIND_DELETE.test(seg) && hasTarget) return true;
	if (WRITE_DST.test(seg)) {
		// cp / ln / rsync / scp / install：仅当尾部 token（目标）是测试目标
		const tokens = seg.split(/[\s'"]+/).filter(Boolean);
		if (tokens.length > 0 && isTestTarget(stripQuotes(tokens[tokens.length - 1]))) {
			return true;
		}
	}
	return false;
}

function bashViolates(command: string): boolean {
	if (command.includes(AUTH_MARK) || !PREFILTER.test(command)) return false;
	// 按 ; && || | 换行 拆段逐段判定，把误判限制在单段内
	for (const seg of command.split(/[;|&\n]+/)) {
		if (segViolates(seg)) return true;
	}
	return false;
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", async (event) => {
		try {
			if (isToolCallEventType("bash", event)) {
				if (bashViolates(event.input.command ?? "") && inDevAgentSubproject()) {
					return { block: true, reason: DENY_REASON };
				}
			} else if (
				isToolCallEventType("write", event) ||
				isToolCallEventType("edit", event)
			) {
				if (isTestTarget(event.input.path ?? "") && inDevAgentSubproject(event.input.path)) {
					return { block: true, reason: DENY_REASON };
				}
			}
		} catch {
			// 判定异常时不阻塞会话（防御性放行，与 Python 版一致）
		}
	});
}
