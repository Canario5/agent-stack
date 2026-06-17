## Skills CLI

Repository: https://github.com/vercel-labs/skills

### Purpose

`skills` is the CLI for installing, listing, updating, removing, and creating Agent Skills from GitHub repositories, local paths, and other supported sources.

Use it when a skill is distributed as plain `SKILL.md` files instead of as a Pi extension package in `settings.json`.

### Pi compatibility

Pi is a supported target. Project installs write to `.pi/skills/`; global installs write to `~/.pi/agent/skills/`.

For this repo, prefer project installs with copied files so the installed skill content, `skills-lock.json`, and docs can be reviewed and committed together.

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
npx skills update -p -y
npx skills remove <skill-name> --agent pi -y
npx skills init my-skill
```

### Tracking convention

Commit these when installing repo-local skills:

- `.pi/skills/<skill-name>/` — copied skill files loaded by Pi.
- `skills-lock.json` — source, upstream path, and computed hash.
- `docs/skills/<skill-name>.md` and `docs/skills/skills.md` — human-facing notes and caveats.

Do not put skill sources in `settings.json` unless they are npm Pi extension packages.

### Update workflow

Run periodically:

```bash
npx skills update -p -y
```

Then review the git diff before committing. 

### Local modifications

Avoid editing vendored `.pi/skills/` files if you want clean upstream updates. 
