# dsh: 项目级 APPEND_SYSTEM 注入

把项目根（或 worktree 根）的 `.dsh/APPEND_SYSTEM.md` 追加到 DSH 的系统提示末尾，等价于 pi 的 `.pi/APPEND_SYSTEM.md`。

## 为什么需要

- DSH 自带的 `dsh-agent-instructions` 只读 `AGENTS.md` / `CLAUDE.md` 候选文件，不读 `.dsh/APPEND_SYSTEM.md`。
- dsh-tui 把 host 层的 `agent-instructions` 关掉了，模型面插件改由 agent preset 决定；`liangshen` preset 甚至只给“文件存在”的提示，不注入全文。
- 所以 `.dsh/APPEND_SYSTEM.md` 需要这个插件来注入。

## 安装

```bash
mkdir -p ~/.dsh/profiles/dsh-tui/plugins
cp ~/.pi/agent/patch/dsh/project-append-system.mjs \
   ~/.dsh/profiles/dsh-tui/plugins/project-append-system.mjs
```

在 `~/.dsh/profiles/dsh-tui/cordis.patch.yml` 里加：

```yaml
- id: project-append-system
  name: ./plugins/project-append-system.mjs
```

也可以用 `./install.sh` 完成复制；YAML 那一行仍需手工确认（脚本不自动改 profile）。

## 使用

在项目根放 `.dsh/APPEND_SYSTEM.md`，例如：

```markdown
# dsh-team 项目规则
> 本文件只适用于 DSH（dsh-team）。pi 的规则见 `.pi/APPEND_SYSTEM.md`。

- ……
```

插件在 `agent/created` 时从 cwd 向上找最近的 `.git`，读 `<root>/.dsh/APPEND_SYSTEM.md`，加上运行时横幅后注册为系统提示 section（order 10300）。

- Leader 在 agent 项目里 → 读 agent 项目的 `.dsh/APPEND_SYSTEM.md`（dsh 帽子）。
- Worker 在私有子项目 worktree 里 → 读子项目 worktree 的 `.dsh/APPEND_SYSTEM.md`（工地规则）。

## 限制

- **`liangshen` preset 会压制系统段**：它用 `dsh-persona` 的 `complete: true`，persona 前缀是唯一系统提示，插件注册的 section 会被忽略。需要 standard preset；或者把注入改成持久用户消息（`agent/pre-step` / inbox）。
- **文件在会话开始时读取一次**，中途修改不会热更新；重开会话生效。
- **系统提示每次请求都计费**：`APPEND_SYSTEM.md` 保持短小，只放硬规则；详细 playbook 放到 `.dsh/skills/` 或普通文档里按需读。
- **不要放凭证 / 私钥**：系统提示会进入模型上下文与日志；凭证只放本机被忽略的配置或 `~/.dev/private`。
- 插件源码是公开的（随 agents-infra 镜像发布）；安装副本在 `~/.dsh/profiles/dsh-tui/plugins/`，属于本机配置，不发布。

## 验证

```bash
node --check ~/.pi/agent/patch/dsh/project-append-system.mjs
dsh --profile dsh-tui --dump-config | grep -A2 project-append-system
```

`--dump-config` 能看到条目、且没有解析错误，就说明插件挂载成功；实际注入效果在 TUI 会话里验证。