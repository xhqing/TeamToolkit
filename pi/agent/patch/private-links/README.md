# private-links：私有内容接线管理

> 配套规则见全局 `AGENTS.md`「私有内容目录 `~/.dev/private`」。本目录只有两个文件：
> `manifest.tsv`（登记清单）与 `private-links.py`（工具）。

## 它解决什么问题

架构改成「代码走 GitHub、只有 `~/.pi/agent` 与 `~/.dev/private` 用 Syncthing」之后，
项目里那些被 `.gitignore` 忽略、但跨机需要一致的私密内容（`TODO.local.md`、`backup/`、
本机 `docs/`、凭证配置、素材）就失去了传输通道。做法是在 `~/.dev/private` 存本体、
项目里放软链接；本工具负责把这件事变可靠。

## 命令

```bash
python3 private-links.py list                    # 按仓库汇总登记项与体积
python3 private-links.py check                   # 巡检（0 问题才干净）
python3 private-links.py materialize [路径...]    # 建软链接（默认全部仓库 + 它们的 worktree）
python3 private-links.py adopt [仓库名...]        # 把项目里的实体搬进 private 并原地建链接
python3 private-links.py restore 仓库 相对路径     # 取消接线（把本体搬回项目）
```

## manifest.tsv 格式

每行 `仓库名 <TAB> 仓库内相对路径`；相对路径支持 `*` 通配（如
`trading-agent	backup/trade/live-unlock.*.local`）。`#` 开头是注释。

新增一项的标准动作：

1. 在清单里加一行；
2. 跑 `adopt <仓库名>`（把现有实体搬过去）；
3. 跑 `check` 确认 0 问题；
4. 这台机器和另一台机器都不需要另外操作——另一台机器同步到清单后跑一次 `materialize`。

## 为什么用 `$HOME` 绝对路径做链接目标

链接本身不进 git、也不跨机：每台机器各自 `materialize`，链接目标是本机的
`/Users/<user>/.dev/private/...`。所以两台机器的 home 不同不构成问题，也避免了
「绝对路径被同步到另一台就断」的经典坑。

## 为什么不用手建链接

- 编辑器「写临时文件再 rename」的原子保存会把软链接换成普通文件 → 之后修改不再进 private，
  而且没有任何报错；`check` 会把它报成 `[ENTITY]`。
- `git clean -fdx` 会删掉被忽略的软链接 → 运行 `materialize` 即可恢复。

## `.git/info/exclude` 为什么会被自动修改

软链接在 git 眼里是**文件**，而仓库 `.gitignore` 里常见的是带尾斜杠的目录规则（`docs/`、
`backup/`），匹配不到软链接 —— 它就会变成未跟踪文件、被 `/add` 误收。工具的作法是把它写进
**仓库本地**的 `.git/info/exclude`（不修改仓库里的 `.gitignore`，避免为了一点本地接线去改
公开仓库）。写入内容在一个带标记的块里，工具每次重写该块，不会碰你手写的其它规则。
