## External utilities

Third-party CLIs that can help Pi work better inside a repository.

| # | Utility | What it adds | Scope / notes |
|---:|---|---|---|
| 1 | [Mise](./mise.md) | Cross-platform installation and version pinning for Pi and supporting CLIs. | User-level; sync applies the tracked `[tools]` entries to Mise's global config. |
| 2 | [context-mode CLI](./context-mode.md) | MCP server executable for Pi's `ctx_*` tools. | Managed by Mise; must be on the Pi process `PATH`. |
| 3 | [OpenSpec](./openspec.md) | Repo-local specs for proposed behavior changes, so agents can plan and validate larger edits against written requirements. | CLI managed by Mise; initialization and specs are per project. |
| 4 | [Drift](./drift.md) | Doc-to-code links that flag markdown docs as stale when linked code changes. | Per project; Linux/macOS CLI only. |
| 5 | [Caliber / ai-setup](./caliber.md) | Generated agent context files, especially `AGENTS.md`, from the current repository structure. | Per project. Review generated files before commit. |
| 6 | [Plannotator CLI](./plannotator-cli.md) | Browser review UI invoked by Plannotator skills or external hooks through the `plannotator` command. | User-level CLI; must be on `PATH` for the Pi process. |
| 7 | [Skills CLI](./skills-cli.md) | Installs, lists, updates, removes, and creates Agent Skills from GitHub repositories and local paths. | Use through `npx skills`. |
| 8 | [Hashline Readmap helpers](../extensions/pi-hashline-readmap.md) | Optional CLI fallbacks for structural search, symbols, diffs, shell, and YAML. | Cross-platform helpers are managed by Mise; Universal Ctags remains platform-installed. |

`context-mode` is also a Pi extension; see [context-mode extension](../extensions/context-mode.md).

Do not list external utilities in `settings.json` unless they publish actual Pi extension packages. Mise manages executable CLIs only; project initialization and generated files remain per repository.
