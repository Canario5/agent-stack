## External utilities

Third-party CLIs that can help Pi work better inside a repository.

| # | Utility | What it adds | Scope / notes |
|---:|---|---|---|
| 1 | [OpenSpec](./openspec.md) | Repo-local specs for proposed behavior changes, so agents can plan and validate larger edits against written requirements. | Per project. |
| 2 | [Drift](./drift.md) | Doc-to-code links that flag markdown docs as stale when linked code changes. | Per project; Linux/macOS CLI only. |
| 3 | [Caliber / ai-setup](./caliber.md) | Generated agent context files, especially `AGENTS.md`, from the current repository structure. | Per project. Review generated files before commit. |
| 4 | [Plannotator CLI](./plannotator-cli.md) | Browser review UI invoked by Plannotator skills or external hooks through the `plannotator` command. | User-level CLI; must be on `PATH` for the Pi process. |
| 5 | [Skills CLI](./skills-cli.md) | Installs, lists, updates, removes, and creates Agent Skills from GitHub repositories and local paths. | Use through `npx skills`. |

Do not list these in `settings.json` unless they later publish actual Pi extension packages.
