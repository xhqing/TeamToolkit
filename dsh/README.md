# ~/.dsh：DSH 团队权威源

这个目录是 **dsh-team 的权威源**。DSH agent 在演化过程中会直接修改这里的全局文件
（`AGENTS.md`、`profiles/dsh-tui/` 配置、插件）。它不是只读的部署副本。

## 镜像

- 目标：`agents-infra/dsh/`
- 同步：Syncthing `dsh` 文件夹（MacBook sendonly → macmini receiveonly），只同步 secret-free 核心
- 发布机：**macmini**（agents-infra 只在这里；macmini 不装 DSH）
- 发布脚本：`~/.pi/agent/patch/agents-infra-publish/publish_dsh.py`（在 macmini 上跑）
- 发布的是 **secret-free 核心**，不是整个 `~/.dsh`

排除：`.env`、`.credentials.yaml`、`.anonymous-user-id`、`sessions/`、`storages/`、
`attachments/`、`profiles/*/node_modules/`、`profiles/*/.plugin-manager/`、
`settings.yaml.imported`、`*.log`、`__pycache__`。

## 新机器恢复

1. clone `github.com/xhqing/agents-infra`；
2. 运行 clone 里的 `dsh/bootstrap.sh`（它会把 `dsh/` 的核心文件复制到 `~/.dsh`）；
3. 在 `~/.dsh/profiles/dsh-tui/` 跑一次 `pnpm install`（或让 `dsh` 初始化）；
4. 配置模型与凭证（本机私有，不进仓库）。

## 修改与发布

1. 直接改 `~/.dsh` 下的文件（这就是权威源）；
2. 等 Syncthing `dsh` 文件夹同步到 macmini；
3. 在 macmini 上跑 `python3 ~/.pi/agent/patch/agents-infra-publish/publish_dsh.py`（可加 `--check` / `--dry-run`）；
4. 脚本会同步到 macmini 的 `~/Developer/agents-infra/dsh/` 并开 PR 自动合并。

不要把 `~/.dsh` 的内容手工复制到别处作为“第二权威源”；如果确实需要冻结某个版本，用 git tag / 镜像历史。