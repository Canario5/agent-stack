# Pi harness stack config

A small, practical home for the Pi extensions, skills, MCP config, and related external utilities I use.

## TLDR: Commands you use

- `node scripts/sync-pi.mjs` — install or update Pi, CLI tools (with [Mise](./docs/external-utilities/mise.md)) and sync Pi configs.
- `update-pi-stack` — for devcontainers simplified command - it git pull files + run sync-pi.mjs

- There are three tool presets: `pi --preset nano` for minimal context polution, `pi --preset standard` for everyday work, and `pi --preset agents` for advanced tools; switch them dynamically with `/preset`
- Memory retention can be temporarily disabled for the next session with `/hindsight:next-opt-out`

**Required**:
- Node.js required for the sync scripts.
- Mise is required on pc hosts and must be activated in your shell; in devcontainers for Bash is Mise installed and activated automatically. See [Mise setup](docs/external-utilities/mise.md).
- A reachable Hindsight server is required for memory operations.

## Layout

- `scripts/sync-pi.mjs` — public sync command; also creates `update-pi-stack` for devcontainers.
- `scripts/install-tools.mjs` — internal Mise manifest synchronizer and tool installer.
- `scripts/sync-pi-config.mjs` — internal settings, MCP, and skills synchronizer.
- `scripts/install-devcontainer.sh` — VS Code dotfiles entry point.
- `settings.json` — tracked default Pi settings and extension packages for the stack.
- `settings.devcontainer.json` — tracked full Pi config used by `scripts/sync-pi.mjs --devcontainer`.
- `mise.toml` — tracked cross-platform versions for Pi and supporting CLIs.
- `mcp.json` — tracked Pi MCP config.
- `hindsight.jsonc` — tracked global Pi Hindsight memory configuration.
- `settings.local.example.json` — example for `~/.pi/agent/settings.local.json` machine-local overrides.
- `.pi/skills/` — copied into global `~/.pi/agent/skills/` by `scripts/sync-pi.mjs`.
- `extensions/preset.ts` and `presets.json` — official Pi preset extension and the tracked `nano`/`standard`/`agents` definitions, synced globally.
- `skills-lock.json` — Skills CLI lock file for installed skills managed by vercel npx skills.
- `docs/` — notes for extensions, skills, and external utilities.

Keep active Pi config files at the repo root. Do not put `settings.json`, `settings.devcontainer.json`, or `mcp.json` under `.pi/` in this repo unless you intentionally want Pi to treat the repo as a project-local Pi config root and create local runtime state such as `.pi/npm/`.

## Sync Pi on a normal machine

Install the pinned Pi harness and CLI tools to Mise's global config and write the active Pi config:

```bash
node scripts/sync-pi.mjs
```
Add --dry-run to preview changes first.

It syncs:

```text
Mise global [tools] entries declared in mise.toml
~/.pi/agent/settings.json
~/.pi/agent/mcp.json
~/.pi/agent/hindsight.jsonc
~/.pi/agent/skills/
~/.pi/agent/extensions/preset.ts
~/.pi/agent/presets.json
```

Use `mise current` to see the selected tool versions and `mise cfg` to inspect the active configuration. **Important: activate Mise in your shell after syncing so `pi` and its supporting CLIs are on `PATH`**, then restart the terminal; see the [Mise setup notes](docs/external-utilities/mise.md). Versions are pinned in `mise.toml`, and Renovate tracks them.

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
If Mise is absent, the setup installs it user-locally with Mise's [official Bash installer](https://mise.jdx.dev/installing-mise.html). It then installs the pinned tools, syncs Pi config, configures Bash activation, and creates `update-pi-stack`.

**Update in existing devcontainer**

```bash
update-pi-stack
```

It fast-forward pulls `~/agent-stack` and reapplies its pinned Pi, CLI tools, settings, MCP config, and skills.

## Indexes

- [`docs/extensions/extensions.md`](docs/extensions/extensions.md)
- [`docs/skills/skills.md`](docs/skills/skills.md)
- [`docs/external-utilities/external-utilities.md`](docs/external-utilities/external-utilities.md)
