# agents-infra-publish：全局能力层的单 pusher 发布

> 配套规则见全局 `AGENTS.md`「维护全局通用能力」条与 `docs/capability-sync.md`。

## 一句话

把 `~/.pi/agent`（五部分 + npm 清单）单向发布到 `agents-infra` 仓库（`pi/agent/`），
**只允许在 macmini 上跑**——两台机器都推会造成重复提交与分叉。

## 命令

```bash
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py            # 发布
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py --check    # 只查是否一致
python3 ~/.pi/agent/patch/agents-infra-publish/publish.py --dry-run  # 看会改哪些文件
```

## 它为什么这么做

| 步骤 | 原因 |
|---|---|
| 先等 Syncthing `idle` | 否则可能把「只同步到一半的全局目录」发布出去（AGENTS.md 引用还没到的 skill） |
| 发现 `*.sync-conflict-*` 直接退出 | 有冲突副本说明能力层本身要人管，不能当正常内容推上去 |
| rsync 带 `--delete` 单向覆盖 | 镜像必须与全局一致，删掉的文件也要同步删掉 |
| 清理镜像孤儿顶层条目 | `--delete` 只管 PARTS 内部；整个条目从清单里消失（如规则文件改名）时，旧文件会永远留在镜像里，需额外删除（`MIRROR_KEEP` 里的 `npm` 除外） |
| 自动写 CHANGELOG | 生成物手写必飘；条目里带「为什么改 / 改了什么 / 回归风险」 |
| 分支 + PR + `--auto` 合并 | remote main 锁定，不直推 |

## 排除项（不进公开仓库）

运行时目录（`sessions/ state/ logs/ tmp/ intercom/ npm/ bin/`）、本机私有配置
（`trust.json`、`mcp-project-approvals.json`、`skills/anysearch/{.env,runtime.conf}`、
`skills/backup/endpoints/`、`patch/session-link/*.json`）、本机产物（`*.log *.lock __pycache__ *.pyc`）。

清单在 `publish.py` 的 `EXCLUDES`，与 `docs/capability-sync.md` 第四节必须保持一致。

## 失败排查

| 现象 | 处理 |
|---|---|
| `等待 Syncthing 收敛超时` | 另一台机器在写，稍后重跑；持续不收敛看 `patch/macmini-mirror/status.py` |
| `有 Syncthing 冲突副本` | 人工对比合并、删掉副本后重跑 |
| `只允许在 macmini 上跑` | 正常。macmini 不在线时先改全局，等它上线跑一次即可 |
| PR 自动合并没有触发 | CI 没通过或分支保护要求分支最新；`gh pr view` 看状态 |

## npm 清单怎么更新（重要）

`pi/agent/npm/` **不由发布机生成**：`~/.pi/agent/npm/` 是架构相关目录、不参与两机同步，
两机装的包版本可能不同（实测 macmini 与 MacBook 就差一个小版本）。在发布机上跑
`refresh.py` 会把版本号写回去，所以清单只在**装了包的那台机器**上生成：

```bash
python3 ~/.pi/agent/patch/npm-manifest/refresh.py --dst /tmp/agents-infra-npm   # 在装包的机器上
scp /tmp/agents-infra-npm/* mac-mini:~/Developer/agents-infra/pi/agent/npm/      # 拷到发布机
ssh mac-mini 'python3 ~/.pi/agent/patch/agents-infra-publish/publish.py'        # 正常发布
```
