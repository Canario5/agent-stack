# Pi extension stack

A small, practical home for the Pi extensions, skills, MCP config, and related external utilities I use.

## TLDR: Commands you use

- `node scripts/sync-pi.mjs` — install or update Pi, required CLI tools, and config on a normal machine.
- `update-pi-stack` — for devcontainers - it git sync files + sync-pi.mjs


## Layout

- `scripts/sync-pi.mjs` — public sync command; also creates `update-pi-stack` for devcontainers.
- `scripts/install-tools.mjs` — internal installer for Pi and required CLI tools.
- `scripts/sync-pi-config.mjs` — internal settings, MCP, and skills synchronizer.
- `scripts/install-devcontainer.sh` — VS Code dotfiles entry point.
- `settings.json` — tracked default Pi settings and extension packages for the stack.
- `settings.devcontainer.json` — tracked full Pi config used by `scripts/sync-pi.mjs --devcontainer`.
- `mcp.json` — tracked Pi MCP config.
- `settings.local.example.json` — example for `~/.pi/agent/settings.local.json` machine-local overrides.
- `.pi/skills/` — copied into global `~/.pi/agent/skills/` by `scripts/sync-pi.mjs`.
- `skills-lock.json` — Skills CLI lock file for installed skills managed by vercel npx skills.
- `docs/` — notes for extensions, skills, and external utilities.

Keep active Pi config files at the repo root. Do not put `settings.json`, `settings.devcontainer.json`, or `mcp.json` under `.pi/` in this repo unless you intentionally want Pi to treat the repo as a project-local Pi config root and create local runtime state such as `.pi/npm/`.

## Sync Pi on a normal machine

Preview first:

```bash
node scripts/sync-pi.mjs --dry-run
```

Install the pinned Pi harness and required CLI tools globally with `npm`, then write the active Pi config:

```bash
node scripts/sync-pi.mjs
```

It syncs:

```text
~/.pi/agent/settings.json
~/.pi/agent/mcp.json
~/.pi/agent/skills/
```

The Pi harness version is pinned in `scripts/install-tools.mjs`. The `context-mode` CLI version follows its package version in the selected settings file. Renovate tracks both.

## Local extras

For machine-specific overrides, copy the example file to Pi's global agent directory:

```bash
cp settings.local.example.json ~/.pi/agent/settings.local.json
```

Then edit `~/.pi/agent/settings.local.json`. It is merged by `scripts/sync-pi.mjs` after the selected tracked config.

## Devcontainer dotfiles setup

Add this to VS Code User Settings JSON (`CTRL+SHIFT+P -> Preferences: Open User Settings (JSON)`)
```
"dotfiles.repository": "https://github.com/Canario5/agent-stack.git",
"dotfiles.targetPath": "~/agent-stack",
"dotfiles.installCommand": "scripts/install-devcontainer.sh",
```

When VS Code creates a devcontainer, it clones this repo to `~/agent-stack` and runs the install command from there.
The setup installs Pi and required CLIs such as `context-mode` privately under `~/.pi`, then syncs config and creates `update-pi-stack`.

## Update an existing devcontainer

```bash
update-pi-stack
```

It fast-forward pulls `~/agent-stack` and reapplies its pinned Pi, CLI tools, settings, MCP config, and skills.

## Indexes

- [`docs/extensions/extensions.md`](docs/extensions/extensions.md)
- [`docs/skills/skills.md`](docs/skills/skills.md)
- [`docs/external-utilities/external-utilities.md`](docs/external-utilities/external-utilities.md)
