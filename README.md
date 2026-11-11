<div align="center">
  <img src="assets/logo.svg" width="640" alt="agents-infra">
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/Version-2.1.0-blue.svg)](#)
[![Type](https://img.shields.io/badge/Type-Agents%20Infra-FF1493.svg)](#)

</div>

# agents-infra

> The infrastructure every agent in a multi-agent team runs on: global rules, skills, extensions, helper scripts and configuration — published as one open-source mirror.

[简体中文](README_cn.md)

agents-infra is the **open-source mirror of a multi-agent team's shared capability layer**. Everything under the user-level `~/.pi/agent/` directory that is **not specific to one agent but shared by all** — global rules (`AGENTS.md`), skills, pi extensions, helper scripts under `patch/`, reference docs, and the third-party package manifest — is reproduced here under `pi/agent/`, byte-identical to the global authoritative copy.

> **Renamed on 2026-11-11.** This project has carried three names: `CapabilityManagerAgent` (maintained by an agent persona named Prometheus) → `TeamToolkit` (2026-11-05, when it was demoted to a plain project) → `agents-infra` (2026-11-11, so the name states what it actually is: the shared infrastructure of the whole fleet, not one agent's toolkit). It is a **plain project** (no agent persona) owned by the team's executive assistant, and publishing is done by a single-pusher script on one machine. Old URLs redirect automatically.

---

## What's in here

| Path | What it is |
|---|---|
| `pi/agent/AGENTS.md` | The team's global rules: working conventions, tool-enforced guardrails, cross-machine workflow |
| `pi/agent/skills/` | General-purpose skills (backup, release, commit, macOS/remote-compute helpers, …) |
| `pi/agent/extensions/` | pi extensions that enforce those rules in code (guards, banners, sync helpers) |
| `pi/agent/patch/` | Self-built helper scripts and small mechanisms |
| `pi/agent/docs/` | Reference docs: agent registry, capability sync, cross-machine mirror, release process |
| `pi/agent/npm/` | Manifest of third-party pi packages in use (declaration + lock file, no package contents) |

Nothing here is a running dependency: the team loads `~/.pi/agent/` directly, and this repository is only the published snapshot.

---

## Core workflow: global is authoritative, single pusher publishes

```
~/.pi/agent  ──(one-way rsync)──►  agents-infra/pi/agent/  ──►  commit → branch → PR → auto-merge
   (authoritative, synced across machines)        (published mirror, one pusher only)
```

- **Global is authoritative.** Changes are made in `~/.pi/agent/` first; the mirror is generated from it.
- **Only one machine publishes.** Both machines hold the same global content, but generating the mirror on two machines would produce duplicate commits and PRs (and could leak one machine's local-only config). The publish script refuses to run elsewhere.
- **Generated, not hand-edited.** Content under `pi/agent/` is overwritten on every publish; edit the global copy instead.
- **Never published**: session records, runtime state, local credentials, and machine-specific configuration are excluded by the publish script.

---

## How to use it

Clone and read — the docs and skills are self-contained Markdown, and the scripts are plain Python/shell:

```bash
git clone https://github.com/xhqing/agents-infra.git
cd agents-infra
ls pi/agent/skills        # one directory per skill, each with SKILL.md
cat pi/agent/AGENTS.md    # the working rules these skills operate under
```

If you run [pi](https://github.com/earendil-works/pi), you can copy the parts you want into your own `~/.pi/agent/` (skills and extensions are discovered from there). Paths and credentials are deliberately not included, so re-authorize tools on your own machine.

---

## Position in the team

agents-infra is **not an agent** — it is the shared foundation every agent stands on: the rules they follow, the skills they reuse, the guards that keep them from doing something destructive. It sits outside the sales pipeline and outside any working group.

---

## License & Attribution

MIT. If you derive from or redistribute this project, please retain the copyright notice and license file, and link back to this repository.
