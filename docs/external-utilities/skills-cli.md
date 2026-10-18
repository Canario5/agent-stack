## Skills CLI

Repository: https://github.com/vercel-labs/skills

### Purpose

`skills` is the CLI for installing, listing, updating, removing, and creating Agent Skills from GitHub repositories, local paths, and other supported sources.

Use it when a skill is distributed as plain `SKILL.md` files instead of as a Pi extension package in `settings.json`.

### Pi compatibility

Pi is a supported target. In this repo, `npx skills add <owner/repo> <skill-name> --agent pi --copy -y` installs project skills under `.agents/skills/`. The CLI's own global install location is separate; `scripts/sync-pi.mjs` mirrors this repo's project skills into Pi's `~/.pi/agent/skills/` directory.

Keep `.agents/skills/` as the repo's single skill directory.

### Install / run

No separate install is required; run through `npx`:

```bash
npx skills --help
```

Telemetry can be disabled per command with environment variable:

```bash
# Linux, macOS, WSL, Git Bash
printf '\nexport DISABLE_TELEMETRY=1\n' >> ~/.bashrc
```
```powershell
# Windows PowerShell
setx DISABLE_TELEMETRY 1
```

Restart the terminal after setting it.

### Common commands

```bash
npx skills add <owner/repo> --list
npx skills add <owner/repo> --skill <skill-name> --agent pi --copy -y
npx skills list --json
npx skills update --agent pi -p -y
npx skills remove <skill-name> --agent pi -y
npx skills init my-skill
```

### Tracking convention

Track the files for upstream skills installed with the Skills CLI:

- `.agents/skills/<skill-name>/` — copied skill files discovered by Pi.
- `skills-lock.json` — upstream source, path, and computed hash for CLI-managed skills.
- `docs/skills/<skill-name>.md` and `docs/skills/skills.md` — human-facing notes and index entry.

Custom skills also live in `.agents/skills/` and are tracked as ordinary repo files, but do not belong in `skills-lock.json` unless installed and managed by the Skills CLI.

Do not put skill sources in `settings.json` unless they are npm Pi extension packages.

### Update workflow

Run from the repo root, optionally naming one skill to update, then review the diff:

```bash
npx skills update --agent pi -p -y
# or update only find-skills
npx skills update --agent pi -p find-skills -y
```


### Local modifications

Avoid editing CLI-managed `.agents/skills/` files if you want clean upstream updates. Custom skills in `.agents/skills/` are maintained directly in this repository.
