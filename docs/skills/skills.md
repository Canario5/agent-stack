## Pi skills

Skills are documented as a lightweight registry: what each package adds, when to use it, and the caveats worth remembering later. Keep upstream docs as the source of truth for full behavior.

### Maintenance workflow

Update Skills CLI-managed project skills from the repo root, then review the diff. Name a skill to update only that one:

```bash
npx skills update --agent pi -p -y
npx skills update --agent pi -p find-skills -y
```


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

New skills start as **Trial** until they prove useful in normal Pi work.

### Local skills

Repository skills live in `.agents/skills/`; `scripts/sync-pi.mjs` mirrors them into Pi's global `~/.pi/agent/skills/` directory.

| Skill | Category | Status | Notes |
|---|---|---|---|
| [upgrade-review](./upgrade-review.md) | Maintenance / diagnostics | Trial | Reviews Renovate dependency updates and updates only affected documentation. |
| [skill-creator](./skill-creator.md) | Maintenance / diagnostics | Trial | Port Anthropic's draft/eval/review loop to Pi with paired runs and a feedback viewer. |

### Standalone skill packages

Skills installed mainly as skills get an index entry; add a separate page only when repo-specific usage or caveats are useful.

| # | Skill | Package | Category | Status | Notes |
|---:|---|---|---|---|---|
| 1 | [llm-wiki](./micuintus-llm-wiki.md) | `@micuintus/llm-wiki` | Context / memory | Trial | Build a separate markdown knowledge wiki from saved articles, chats, notes, and project sources. |
| 2 | [repo-explorer](./firstpick-pi-skill-repo-explorer.md) | `@firstpick/pi-skill-repo-explorer` | Discovery / understanding | Needs adaptation | Useful idea, but upstream workflow may need Pi-specific cleanup before regular use. |
| 3 | [tech-deep-dive](./firstpick-pi-skill-tech-deep-dive.md) | `@firstpick/pi-skill-tech-deep-dive` | Planning / decision support | Trial | Use before choosing libraries, frameworks, tools, APIs, models, or architecture. |
| 4 | [code-quality](./firstpick-pi-skill-code-quality.md) | `@firstpick/pi-skill-code-quality` | Quality / review | Needs adaptation | Review before relying on it; upstream assumptions may not fit this setup. |
| 5 | [find-skills](./find-skills.md) | `vercel-labs/skills` (`find-skills`) | Discovery / workflow extension | Trial | Find and install reusable skills from the skills.sh ecosystem. |
| 6 | `modern-javascript-patterns` | `wshobson/agents` (`modern-javascript-patterns`) | JavaScript / development | Trial | Practical ES6+ and functional patterns for refactoring and implementing JavaScript. |
| 7 | `responsive-design` | `wshobson/agents` (`responsive-design`) | Design / frontend | Trial | Build responsive interfaces with mobile-first layouts, container queries, and fluid sizing. |
| 8 | `auth-implementation-patterns` | `wshobson/agents` (`auth-implementation-patterns`) | Security / authentication | Trial | Guidance for JWT, OAuth2, sessions, and role-based access control. |

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
| 9 | `pi-subagents` | [`pi-subagents`](../extensions/pi-subagents.md) | Orchestration | Core | Delegate to helper agents, scripted workflows, parallel runs, and async work. |

Rule of thumb: standalone skill package = table row; add its own page only when it has repo-specific usage notes or caveats. Extension-provided skill = table row only, linked back to the extension docs.
