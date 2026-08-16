# Pi extension stack

A small, practical home for the Pi extensions, skills, MCP config, and related external utilities I use.

## Layout

- `scripts/sync-pi.mjs` — user-facing sync script; installs Pi, syncs config, and copies skills.
- `install-devcontainer.sh` — VS Code dotfiles entry point for the devcontainer sync.
- `settings.json` — tracked default Pi settings and extension packages for the stack.
- `settings.devcontainer.json` — tracked full Pi config used by `scripts/sync-pi.mjs --devcontainer`.
- `mcp.json` — tracked Pi MCP config.
- `settings.local.example.json` — example for `~/.pi/agent/settings.local.json` machine-local overrides.
- `.pi/skills/` — copied into global `~/.pi/agent/skills/` by `scripts/sync-pi.mjs`.
- `skills-lock.json` — Skills CLI lock file for installed skills managed by vercel npx skills.
- `docs/` — notes for extensions, skills, and external utilities.

Keep active Pi config files at the repo root. Do not put `settings.json`, `settings.devcontainer.json`, or `mcp.json` under `.pi/` in this repo unless you intentionally want Pi to treat the repo as a project-local Pi config root and create local runtime state such as `.pi/npm/`.

## Sync Pi on a machine

Preview first:

```bash
node scripts/sync-pi.mjs --dry-run
```

Install the pinned Pi harness globally with `pnpm` or `npm`, then write the active Pi config:

```bash
node scripts/sync-pi.mjs
```

It syncs:

```text
~/.pi/agent/settings.json
~/.pi/agent/mcp.json
~/.pi/agent/skills/
```

The Pi harness version is pinned in `scripts/install-pi.mjs`; extension package versions are pinned in `settings.json` and `settings.devcontainer.json`. Renovate tracks package versions there.

## Local extras

For machine-specific overrides, copy the example file to Pi's global agent directory:

```bash
cp settings.local.example.json ~/.pi/agent/settings.local.json
```

Then edit `~/.pi/agent/settings.local.json`. It is merged by `scripts/sync-pi.mjs` after the selected tracked config.

## Devcontainer dotfiles usage

Add this to VS Code User Settings JSON (`CTRL+SHIFT+P -> Preferences: Open User Settings (JSON)`)
```
"dotfiles.repository": "https://github.com/Canario5/agent-stack.git",
"dotfiles.targetPath": "~/agent-stack",
"dotfiles.installCommand": "install-devcontainer.sh",
```

When VS Code creates a devcontainer, it clones this repo to `~/agent-stack` and runs the install command from there.

After the container is created, update this Pi stack from any directory in the container terminal:

```bash
update-pi-stack
```

`update-pi-stack` goes to the cloned dotfiles repo, pulls the latest changes, and reapplies the devcontainer Pi config:

```bash
git pull --ff-only
node scripts/sync-pi.mjs --devcontainer
```

## Indexes

- [`docs/extensions/extensions.md`](docs/extensions/extensions.md)
- [`docs/skills/skills.md`](docs/skills/skills.md)
- [`docs/external-utilities/external-utilities.md`](docs/external-utilities/external-utilities.md)
