---
name: vsce-install
description: 已停用（2026-11-09 用户立：团队工作流不再使用 VSCode，日常界面迁到 cmux）——仅在用户当轮明确要求安装 / 升级 VSCode 扩展时才用。干净地安装/升级 VSCode 扩展（VSCE）到最新版。当用户要求「安装/升级/更新/重装 VSCode 扩展」「装最新版扩展」「升级 VSCE」「重装扩展」时触发。默认从 GitHub Release 取最新版 vsix，并强制执行「卸载历史版本 → 删残留目录 → 清 contribution 缓存 → 重装」四步，避免历史版本残留导致 view 类型解析冲突（典型症状：webview view 报 "There is no data provider registered that can provide view data"，点活动栏图标打不开面板）。
---

# VSCE Install — 干净安装/升级 VSCode 扩展

> ⚠️ **已停用（2026-11-09 用户立）**：团队整体工作流不再使用 VSCode，日常界面已迁到 **cmux**（见全局 `~/.pi/agent/AGENTS.md`「工作环境：cmux 优先，VSCode 退役」）。本 skill **只在用户当轮明确要求**安装 / 升级某个 VSCode 扩展时执行；AI 不得主动提议装 VSCode 扩展，也不得用「在 VSCode 里看效果」当验证手段。正文保留作过渡期参考。

## 为什么需要这个 skill

VSCode 扩展升级时，旧版本目录常残留在 `~/.vscode/extensions/` 下（每个版本一个独立目录 `<publisher>.<name>-<version>`），VSCode 的 contribution manifest 缓存（`CachedExtensionVSIXs`）也可能没干净切换到新版本。

历史版本残留会污染新版解析：如果旧版把某个 view 声明成 tree view、新版改成了 webview view，升级后 VSCode 可能仍按旧的 tree view 解析，但运行时新代码注册的是 `WebviewViewProvider`，类型对不上 → 报 `There is no data provider registered that can provide view data`，点活动栏图标打不开面板。

所以**每次安装/升级扩展，都必须先彻底清理历史残留，再装最新版**，不能只覆盖安装。这是真实排查过的坑（Resource Monitor v0.2.1 升级后点图标无反应，根因就是 0.1.0/0.2.0/0.2.1 三个版本目录同时残留，0.1.0 的 tree view 声明污染了 view 类型解析）。

## 核心原则

1. **默认装最新版**：从对应仓库的 GitHub Release 取最新 tag 的 vsix（用户约定「发布/最新版默认指 GitHub Release」，不是 Marketplace / Open VSX，除非用户明确指定）。
2. **强制走清理流程**：哪怕用户只说「装一下」「升级一下」，也要执行下方的卸载 + 删残留 + 清缓存，不能直接覆盖装。
3. **reload 由用户做**：清理重装后，`reload window` / 重启 VSCode 这一步必须在 GUI 里做，Agent 代不了，要明确提示用户。
4. **装项目扩展前先核对版本号一致性**：当装的是**正在开发的项目扩展**（Agent 手上有本地代码目录、能读 `package.json`）时，下载 Release vsix 前先比 GitHub Release 最新 tag 与本地 `package.json` 的 `version` 是否一致——一致才从 Release 装；不一致不盲目装，先排查（忘了发版 / 发版失败 / 本地版本号没跟上 / Release 与本地代码不同步）。装别人的扩展（无本地代码）不适用此条。

## 前置确认：先搞清四件事再动手

- **publisher.name**：从 vsix 内的 `package.json` 读 `publisher` + `name`（如 `xhqing.resource-monitor`），或从 GitHub Release asset 名 / 仓库名推断。后续所有命令都要用这个 id。
- **VSCode 变体**：用户实际用哪个？`code` / `code-insiders` / `cursor` / `windsurf` 等，每个有独立的扩展目录和缓存路径。用 `which code code-insiders cursor windsurf 2>/dev/null` + `<cli> --list-extensions --show-versions | grep <name>` 确认扩展实际装在哪个变体里。**对用户实际用的那个变体操作**，别只对默认 `code` 操作。
- **平台**：macOS / Linux / Windows 的扩展目录和缓存路径不同（见下方「平台/变体路径速查」）。
- **版本号一致性（仅装项目扩展时）**：装正在开发的项目扩展（手上有本地代码目录），下载 vsix 前先比 GitHub Release 最新 tag 与本地 `package.json` 的 `version` 是否一致。本地读项目根 `package.json` 的 `version`；Release 取最新 tag 用 `gh release view -R <owner>/<repo> --json tagName -q .tagName`（或 `gh release list`），tag 前缀若有 `v`，两边连前缀一起比、或都去掉 `v` 再比。**两边相等才装**；不等则停下排查（忘了发版 / 发版失败 / 本地版本号没跟上 / Release 与代码不同步），不直接装。

## 标准 4 步流程

以下以 macOS + 默认 `code` 为例（其它平台/变体替换路径和 CLI 名）。

### 第 1 步：卸载扩展（清 VSCode 注册）

```bash
code --uninstall-extension <publisher>.<name>
```

### 第 2 步：删除所有历史版本残留目录

`--uninstall-extension` 通常只清当前生效版本，旧版本目录要手动删。用 glob 删全部版本，确保无残留：

```bash
rm -rf ~/.vscode/extensions/<publisher>.<name>-*
```

执行后用 `ls -d ~/.vscode/extensions/<publisher>.<name>-* 2>/dev/null` 确认目录已清空（无输出 = 干净）。

### 第 3 步：清 contribution manifest 缓存（关键）

这是让 VSCode「忘掉」旧 view / 命令声明的关键一步，不做的话缓存可能仍按旧版本解析：

```bash
# macOS（默认 Code）
rm -rf ~/Library/Application\ Support/Code/CachedExtensionVSIXs/<publisher>.<name>*
```

### 第 4 步：重装最新版 vsix

> 若装的是项目扩展，下载 vsix 前先确认上方「版本号一致性」已核对通过（Release tag 与本地 `package.json` version 两边相等），不等则停下排查，不进入本步。

```bash
code --install-extension <latest.vsix 路径> --force
```

`--force` 覆盖安装。vsix 从最新 GitHub Release 下载：

```bash
gh release download <latest-tag> -R <owner>/<repo> -p '*.vsix' -D tmp/vsix-check
```

或用用户指定的本地 vsix。

### 第 5 步（用户做）：reload window

提示用户在 VSCode 里执行命令面板 → `Developer: Reload Window`，或彻底重启 VSCode。**这一步 Agent 代不了，必须用户操作**。reload 后扩展才会用全新的 contribution 声明重新注册。

## 平台 / 变体路径速查

扩展目录与缓存路径按「平台 × 变体」组合：

| 平台 | 扩展目录 | contribution 缓存 |
|---|---|---|
| macOS | `~/.vscode/extensions` | `~/Library/Application Support/Code/CachedExtensionVSIXs/` |
| Linux | `~/.vscode/extensions` | `~/.config/Code/CachedExtensionVSIXs/` |
| Windows | `%USERPROFILE%\.vscode\extensions` | `%APPDATA%\Code\CachedExtensionVSIXs\` |

变体不同，缓存目录名也不同（把表中的 `Code` 换掉）：

- VSCode Insiders → `Code - Insiders`，CLI `code-insiders`
- Cursor → `Cursor`，CLI `cursor`
- Windsurf → `Windsurf`，CLI `windsurf`

扩展目录同理：Insiders 是 `~/.vscode-insiders/extensions`，Cursor 是 `~/.cursor/extensions`，Windsurf 是 `~/.windsurf/extensions`。

## 验证

装完 + 用户 reload 后，让用户点扩展的活动栏图标 / 执行扩展命令，确认功能正常。如果是 webview view，确认不再报 `no data provider`，面板能正常展开。

## 边界

- 只对用户**明确要装/升级**的扩展执行清理，不要顺手清理其它扩展。
- 删除的是扩展残留目录和缓存，重装即恢复，风险低；但执行前仍把命令列清楚。
- 如果扩展上架了 Marketplace / Open VSX 且用户明确要从那里装，按用户指定的来（`<cli> --install-extension <publisher>.<name>` 直接从市场装，但仍走清理流程）。
- 本 skill 是**全局通用工具型 skill**，放全局 `~/.pi/agent/skills/vsce-install/`，不需要同步到项目副本。
