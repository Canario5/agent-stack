## Skills CLI

Repository: https://github.com/vercel-labs/skills

### Purpose

`skills` is the CLI for installing, listing, updating, removing, and creating Agent Skills from GitHub repositories, local paths, and other supported sources.

Use it when a skill is distributed as plain `SKILL.md` files instead of as a Pi extension package in `settings.json`.

### Pi compatibility

Pi is a supported target. In this repo, `npx skills add <skill-name> --agent pi --copy` installs project skills under `.agents/skills/` (not `.pi/skills/`). Global installs use Pi's global agent skills directory.

Keep `.agents/skills/` as the repo's single skill directory. `skills-lock.json` records only skills installed and managed by the Skills CLI; it does not claim ownership of custom skills maintained directly in this repo.

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

Track the files for upstream skills installed with the Skills CLI:

- `.agents/skills/<skill-name>/` — copied skill files discovered by Pi.
- `skills-lock.json` — upstream source, path, and computed hash for CLI-managed skills.
- `docs/skills/<skill-name>.md` and `docs/skills/skills.md` — human-facing notes and index entry.

Custom skills also live in `.agents/skills/` and are tracked as ordinary repo files, but do not belong in `skills-lock.json` unless installed and managed by the Skills CLI.

Do not put skill sources in `settings.json` unless they are npm Pi extension packages.

### Update workflow

Run periodically:

```bash
npx skills update -p -y
```

Then review the git diff before committing.

### Local modifications

Avoid editing CLI-managed `.agents/skills/` files if you want clean upstream updates. Custom skills in `.agents/skills/` are maintained directly in this repository.
