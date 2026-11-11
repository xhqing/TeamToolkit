<div align="center">
  <img src="assets/logo.svg" width="640" alt="agents-infra">
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/Version-2.1.0-blue.svg)](#)
[![Type](https://img.shields.io/badge/Type-Agents%20Infra-FF1493.svg)](#)

</div>

# agents-infra

> 多智能体团队里每个 agent 都跑在其上的基础设施：全局规则、技能、扩展、辅助脚本与配置，以一份开源镜像发布出来。

[English](README.md)

agents-infra 是**多智能体团队「共享能力层」的开源镜像**。用户级 `~/.pi/agent/` 目录下那些**不专属于某一个 agent、而是所有 agent 共用**的东西——全局规则（`AGENTS.md`）、技能、pi 扩展、`patch/` 下的辅助脚本、参考文档、第三方包清单——都在本仓库的 `pi/agent/` 下逐字节复现，与全局权威源保持一致。

> **2026-11-11 更名**：本项目先后叫过三个名字——`CapabilityManagerAgent`（由名为 Prometheus 的智能体角色维护）→ `TeamToolkit`（2026-11-05 降级为普通项目时的名字）→ `agents-infra`（2026-11-11 定现名，让名字直接说清它是什么：全队共用的基础设施，而不是某个 agent 的工具箱）。现在它是**普通项目**（不再有智能体人设），归团队的总经理助理（Kit）负责，发布动作由单台机器上的脚本完成。旧地址会自动重定向。

---

## 这里有什么

| 路径 | 内容 |
|---|---|
| `pi/agent/AGENTS.md` | 团队全局规则：工作约定、工具强制的护栏、跨机工作流程 |
| `pi/agent/skills/` | 通用技能（备份、发版、提交、macOS / 远程算力辅助等） |
| `pi/agent/extensions/` | 把这些规则落成代码的 pi 扩展（护栏、横幅、同步辅助） |
| `pi/agent/patch/` | 自研补丁脚本与小机制 |
| `pi/agent/docs/` | 参考文档：智能体名册、能力同步、跨机镜像、发版流程 |
| `pi/agent/npm/` | 第三方 pi 包清单（声明 + 锁文件，不含包内容） |

这些内容都不是运行依赖：团队直接加载 `~/.pi/agent/`，本仓库只是发布出来的快照。

---

## 核心工作方式：全局是权威源，单点发布

```
~/.pi/agent  ──(单向 rsync)──►  agents-infra/pi/agent/  ──►  提交 → 分支 → PR → 自动合并
   （权威源，两机之间同步）              （发布镜像，只由一个设备推送）
```

- **全局是权威源**：改动先落在 `~/.pi/agent/`，镜像由它生成。
- **只有一个设备负责发布**：两台机器持有同一份全局内容，但如果两边都生成镜像，就会造出重复提交与重复 PR（还可能把某一台的本机配置推上公网）。发布脚本在其他机器上会直接拒绝执行。
- **镜像内容是生成物**：每次发布都会覆盖 `pi/agent/` 下的内容，要改就改全局那一份。
- **永不发布**：会话记录、运行时状态、本机凭证与机器相关配置，都由发布脚本排除。

---

## 怎么用

克隆下来直接读——文档与技能都是自包含的 Markdown，脚本是纯 Python / shell：

```bash
git clone https://github.com/xhqing/agents-infra.git
cd agents-infra
ls pi/agent/skills        # 每个目录一个技能，内含 SKILL.md
cat pi/agent/AGENTS.md    # 这些技能所遵循的工作规则
```

如果你在用 [pi](https://github.com/earendil-works/pi)，可以把需要的部分拷进自己的 `~/.pi/agent/`（技能与扩展从该目录自动发现）。路径与凭证是刻意不含的，相关工具请在你自己的机器上重新授权。

---

## 在团队中的位置

agents-infra **不是 agent**，而是所有 agent 共同站立的地基：它们遵循的规则、复用的技能、以及防止误操作的护栏。它不属于销售流水线，也不属于任何工作小组。

---

## 许可与署名

MIT。若你基于本项目衍生或再分发，请保留版权声明与许可文件，并注明来源。
