## Pi skills

Skills are documented as a lightweight registry: what each package adds, when to use it, and the caveats worth remembering later. Keep upstream docs as the source of truth for full behavior.

New skills start as **Trial** until they prove useful in normal Pi work.

### Categories

| Category | Use for |
|---|---|
| Discovery / understanding | Finding key files, symbols, architecture, and onboarding context. |
| Planning / decision support | Choosing tools, designing changes, and checking trade-offs before implementation. |
| Quality / review | Code review, standards, maintainability, and safe cleanup. |
| Context / memory | Indexing, searching, and keeping large outputs out of chat context. |
| Maintenance / diagnostics | Setup checks, upgrades, reset workflows, and health checks. |
| Orchestration | Delegating work to agents, sessions, dashboards, or review flows. |
| Annotation / review UI | Browser-based annotation, plan review, and code review feedback. |

### Standalone skill packages

Skills installed mainly as skills. These get their own short docs page.

| # | Skill | Package | Category | Status | Notes |
|---:|---|---|---|---|---|
| 1 | [llm-wiki](./micuintus-llm-wiki.md) | `@micuintus/llm-wiki` | Context / memory | Trial | Build a separate markdown knowledge wiki from saved articles, chats, notes, and project sources. |
| 2 | [repo-explorer](./firstpick-pi-skill-repo-explorer.md) | `@firstpick/pi-skill-repo-explorer` | Discovery / understanding | Needs adaptation | Useful idea, but upstream workflow may need Pi-specific cleanup before regular use. |
| 3 | [tech-deep-dive](./firstpick-pi-skill-tech-deep-dive.md) | `@firstpick/pi-skill-tech-deep-dive` | Planning / decision support | Trial | Use before choosing libraries, frameworks, tools, APIs, models, or architecture. |
| 4 | [code-quality](./firstpick-pi-skill-code-quality.md) | `@firstpick/pi-skill-code-quality` | Quality / review | Needs adaptation | Review before relying on it; upstream assumptions may not fit this setup. |

`Needs adaptation` means the skill looks useful, but its upstream instructions should be reviewed or adjusted before relying on it as a normal workflow.

### Extension-provided skills

Skills bundled with broader Pi extensions. List them here for discoverability, but keep detailed behavior in the extension docs.

| # | Skill | Provided by | Category | Status | Notes |
|---:|---|---|---|---|---|
| 1 | `context-mode` | [`context-mode`](../extensions/context-mode.md) | Context / memory | Core | Main workflow skill for context-mode behavior. |
| 2 | `ctx-index` | [`context-mode`](../extensions/context-mode.md) | Context / memory | Utility | Index local files or directories into searchable knowledge. |
| 3 | `ctx-insight` | [`context-mode`](../extensions/context-mode.md) | Context / memory | Utility | Open the context-mode analytics dashboard. |
| 4 | `ctx-search` | [`context-mode`](../extensions/context-mode.md) | Context / memory | Utility | Search previously indexed context-mode knowledge. |
| 5 | `ctx-stats` | [`context-mode`](../extensions/context-mode.md) | Context / memory | Utility | Show context savings and tool usage stats. |
| 6 | `ctx-doctor` | [`context-mode`](../extensions/context-mode.md) | Maintenance / diagnostics | Utility | Diagnose context-mode setup, hooks, and registration. |
| 7 | `ctx-upgrade` | [`context-mode`](../extensions/context-mode.md) | Maintenance / diagnostics | Utility | Upgrade context-mode and refresh hook setup. |
| 8 | `ctx-purge` | [`context-mode`](../extensions/context-mode.md) | Maintenance / diagnostics | Dangerous | Permanently delete indexed context-mode knowledge. |
| 9 | `pi-subagents` | [`pi-subagents`](../extensions/pi-subagents.md) | Orchestration | Core | Delegate to helper agents, chains, parallel runs, and async workflows. |
| 10 | `plannotator-annotate` | [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md) | Annotation / review UI | Utility | Open annotation UI for markdown, rendered HTML, URLs, or folders. |
| 11 | `plannotator-last` | [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md) | Annotation / review UI | Utility | Annotate the latest rendered assistant message and revise from feedback. |
| 12 | `plannotator-review` | [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md) | Annotation / review UI | Utility | Open browser-based code review for the current worktree or PR URL. |
| 13 | `plannotator-setup-goal` | [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md) | Annotation / review UI | Utility | Turn an idea into a reviewed goal package and execution plan. |

Rule of thumb: standalone skill package = table row plus own page. Extension-provided skill = table row only, linked back to the extension docs.