/**
 * macmini-use 远端层的连通性冒烟测试（需要能 ssh mac-mini；不在 CI 跑）。
 *
 * 用法：
 *   bun ~/.pi/agent/patch/macmini-use/test-remote.ts
 *
 * 覆盖：路径映射、远端 PATH / Node 版本、目录不存在的报错、后台任务与日志、git 只读判定。
 */

import { buildScript, execRemote, launchRemote, mapPath } from "../../extensions/macmini-use/remote.ts";
import { checkCommand as checkGitWrite } from "../../extensions/git-readonly-guard.ts";

let failed = 0;
function check(name: string, ok: boolean, detail = ""): void {
	if (ok) {
		console.log(`✅ ${name}`);
		return;
	}
	failed += 1;
	console.error(`❌ ${name}${detail ? `\n   ${detail}` : ""}`);
}

// 1) 路径映射
const a = mapPath("~/Developer/dev-agent");
check("mapPath 本机 home → /Users/mac", a.remote === "/Users/mac/Developer/dev-agent" && a.mirrored);
check("mapPath 远端路径原样保留", mapPath("/Users/mac/Developer/x").remote === "/Users/mac/Developer/x");
check("mapPath /tmp 不标记为镜像", mapPath("/tmp/x").mirrored === false);

// 2) 远端执行：PATH / Node 版本 / cwd
const res = await execRemote(
	buildScript("/Users/mac/Developer/dev-agent", "pwd; node -v; python3 -V; uname -m"),
	{ timeoutMs: 30_000 },
);
check("ssh 执行成功", res.code === 0, res.stderr);
check("Node 22（非登录 shell 的 PATH）", /v22\./.test(res.stdout), res.stdout);
check("x86_64 架构", /x86_64/.test(res.stdout), res.stdout);

// 3) 远端目录不存在 → 退出码 97 + 明确提示
const missing = await execRemote(buildScript("/Users/mac/Developer/__macmini_use_missing__", "pwd"), {
	timeoutMs: 20_000,
});
check("目录不存在时报 97", missing.code === 97, `code=${missing.code} stderr=${missing.stderr}`);
check("提示同步延迟", /Syncthing/.test(missing.stderr), missing.stderr);

// 4) 后台任务：立即返回、日志可轮询
const job = await launchRemote(buildScript("/tmp", "sleep 2; echo job-done; node -v"), "smoke");
check("后台启动成功", !job.error && Boolean(job.logPath), job.error ?? "");
await new Promise((r) => setTimeout(r, 5000));
const tail = await execRemote(buildScript("/tmp", `cat ${job.logPath}; pgrep -f ${job.scriptPath} >/dev/null && echo running || echo done`), {
	timeoutMs: 20_000,
});
check("后台任务产出结果", /job-done/.test(tail.stdout), tail.stdout);
check("后台任务已结束", /done/.test(tail.stdout), tail.stdout);

// 5) 远端 git 写操作判定（与 macmini 守卫共用同一函数）
check("远端 git add 被判定为写", checkGitWrite("git add -A").blocked);
check("远端 git status 只读放行", !checkGitWrite("git status --porcelain").blocked);
check("远端 gh pr create 被判定为写", checkGitWrite("gh pr create --fill").blocked);

// 6) 清理 smoke 任务留下的脚本与日志
await execRemote(buildScript("/tmp", `rm -rf /tmp/macmini-jobs/${job.jobId}.sh /tmp/macmini-jobs/${job.jobId}.log`), {
	timeoutMs: 20_000,
});

if (failed > 0) {
	console.error(`\n${failed} 项失败`);
	process.exit(1);
}
console.log("\n✅ 冒烟测试全部通过");
