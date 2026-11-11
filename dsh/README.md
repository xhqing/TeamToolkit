# dsh：DSH 核心基础设施（可发布副本）

这里放 dsh-team 的核心基础设施，镜像到 `agents-infra` 的 `dsh/` 目录。
**它不是 `~/.dsh` 的完整拷贝**——`~/.dsh` 里还有凭证、会话、附件、运行时状态，不能公开；
而且发布机 macmini 上没有 `~/.dsh`（DSH 只装在 MacBook），所以不能直接镜像 live 目录。

## 内容

```text
dsh/
├── AGENTS.md                  # dsh-team 全局规则（canonical）
├── README.md                  # 本文件
├── install.sh                 # 部署到 ~/.dsh
└── profiles/
    └── dsh-tui/
        ├── cordis.yml
        ├── cordis.patch.yml   # 挂载 project-append-system 插件
        ├── package.json
        ├── pnpm-lock.yaml
        └── pnpm-workspace.yaml
```

插件源码在 `~/.pi/agent/patch/dsh/project-append-system.mjs`；发布脚本会把它映射到
`dsh/profiles/dsh-tui/plugins/project-append-system.mjs`，让镜像保持可安装。

## 部署

```bash
~/.pi/agent/dsh/install.sh
```

部署会把 `AGENTS.md`、profile 配置与插件复制到 `~/.dsh`。首次在新机器上还需要在
`~/.dsh/profiles/dsh-tui/` 跑一次 `pnpm install`（或让 `dsh` 初始化），然后重启 dsh。

## 修改与发布

1. 改这里的 `AGENTS.md` / profile 配置，或改 `patch/dsh/` 里的插件源码；
2. 跑 `install.sh` 让本机 `~/.dsh` 生效；
3. 在 macmini 上跑 `python3 ~/.pi/agent/patch/agents-infra-publish/publish.py` 发布；
4. 不要在 `~/.dsh` 里直接改完就结束——它只是部署副本，下次 `install.sh` 会覆盖。
