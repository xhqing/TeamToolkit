# CONTRIBUTING 模板

供 `commit` skill 第 9n 步使用：项目缺 `CONTRIBUTING.md` / `CONTRIBUTING_cn.md` 时从这里拷过去。

## 必须替换占位符

模板正文里有 `{{LICENSE_NAME}}`，**拷过去后必须替换成项目实际使用的许可证名称**。照抄不替换 = 把错误的许可证名写给贡献者看。

自检：`grep "{{LICENSE_NAME}}" CONTRIBUTING*.md` 必须为空。

## 许可证名称映射表

读项目根的 `LICENSE.md`，按特征词映射：

| `LICENSE.md` 里的特征 | `{{LICENSE_NAME}}` 填什么 |
|---|---|
| `MIT License` | `MIT License` |
| `GNU GENERAL PUBLIC LICENSE` + `Version 3` | `GNU General Public License v3.0 or later (GPL-3.0-or-later)` |
| `GNU GENERAL PUBLIC LICENSE` + `Version 2` | `GNU General Public License v2.0 (GPL-2.0)` |
| `GNU LESSER GENERAL PUBLIC LICENSE` | `GNU Lesser General Public License (LGPL)` |
| `Apache License` + `Version 2.0` | `Apache License 2.0` |
| `Mozilla Public License` | `Mozilla Public License 2.0 (MPL-2.0)` |
| `PolyForm Noncommercial` | `PolyForm Noncommercial License 1.0.0` |
| `BSD 3-Clause` | `BSD 3-Clause License` |
| `BSD 2-Clause` | `BSD 2-Clause License` |
| 认不出 | **暂停，问用户**——不要猜 |

## 最关键的一条

**不要假设项目是 MIT。**

2026-11-09 就是踩这个坑：一个批量脚本硬编码了 MIT，把 `cmux`（上游 GPL-3.0-or-later）和 `ToolCallingRules`（PolyForm Noncommercial）的 CONTRIBUTING 都写成了 MIT。前者会让贡献者以为自己的代码按 MIT 授权（可商用），后者更糟——项目本身禁止商用，却写着允许，两套说法直接打架。

## 另一个坑：不要往已有 CONTRIBUTING 里硬塞模板段

如果项目已有自己的 CONTRIBUTING，只能在它末尾**追加缺的那两节**，不要整份覆盖。而且追加前要先确认它**真的缺**——`ToolCallingRules` 原本已有完整的许可条款，被误判成「缺要素」后塞进一段矛盾的 MIT，事后又得回滚。
