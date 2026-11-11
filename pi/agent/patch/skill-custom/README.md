# skill-custom —— 本机 skill 定制自动恢复器（本机机制；代码与片段已开源镜像）

**解决的问题**：agent-reach / anysearch 这两个由上游维护的 skill，升级时会覆盖本机定制（description 分工、兜底标注、Freshness note）。升级动作由人手触发、时间不可预测，靠记忆事后检查不可靠——本机制在文件被覆盖后自动把定制重打回去，无需人工。

## 组成

- `restore.py` —— 重打引擎：对每个定制点按「结构定位」（frontmatter 键 / 定制段首行 / 插入锚点）做幂等 upsert（缺失则插入、内容过期则更新为片段内容）。锚点丢失时不硬写，留现场 + 桌面通知。
- `snippets/` —— 定制内容片段（**权威**：要改定制改这里，跑一次脚本即同步到 skill 文件）。
- `restore.log` —— 动作日志（超 200KB 自动保留末尾 500 行）。
- `conflicts/` —— 锚点丢失时的现场快照（需人工处理）。
- `~/Library/LaunchAgents/com.xhq.skill-custom.plist` —— 触发器：WatchPaths 监听 4 个受管文件与所属目录（变动即跑，延迟约 10 秒）+ 登录时一次 + 每小时兜底。

## 受管文件与定制点

| 文件 | 定制点 |
|---|---|
| `~/.pi/agent/skills/anysearch/SKILL.md` | description 块；Freshness note 段 |
| `~/.pi/agent/skills/agent-reach/SKILL.md` | description 块；常驻规则第 4 条；第 6 条 |
| `~/.pi/agent/skills/agent-reach/references/search.md` | 顶部兜底标注行 |
| `~/.pi/agent/skills/agent-reach/references/web.md` | 顶部兜底标注行 |

## 用法

```bash
python3 restore.py --check   # 只查看状态（应为全 ok）
python3 restore.py           # 立即重打 / 同步（幂等）
```

平时不用手动跑（launchd 自动）。**更新定制内容**：改 `snippets/` 里对应片段 → 跑一次 `restore.py`（或等 launchd 自动触发）。

## 维护检查

```bash
launchctl list | grep skill-custom      # 应在列（否则 launchctl load ~/Library/LaunchAgents/com.xhq.skill-custom.plist 重新加载）
tail ~/.pi/agent/patch/skill-custom/restore.log   # 最近动作
```

## 边界

- 上游大改结构导致锚点消失 → 脚本不硬写、桌面通知、现场留在 `conflicts/`，此时需人工处理（一般是更新片段或插入锚点）。
- 上游若恰好改了与定制同一处（如 description）→ 以本机定制为准（覆盖），日志有记录。
- 机制代码与定制片段（`restore.py`、`snippets/`、本文件）已开源镜像到 agents-infra 仓库的 `claude/patch/skill-custom/`（2026-09-25 起，逐字节一致）；运行产物（`restore.log` / `launchd.*.log` / `.lock` / `conflicts/`）只在本机、不进镜像。skill 本身的开源镜像（agents-infra/claude/skills/）同步仍走原流程。
