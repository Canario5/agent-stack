## Plannotator CLI

- **Command:** `plannotator`
- **Used by:** [Plannotator extra skills](../skills/plannotator-extra-skills.md) and non-Pi Plannotator hook integrations.
- **Scope:** User-level CLI, not a Pi extension package.
- **Full docs:** [Plannotator installation guide](https://plannotator.ai/docs/getting-started/installation/)

### What it adds

The Plannotator CLI opens the local browser review UI for plan review, markdown/file annotation, assistant-message annotation, code review, and archived sessions.

For Pi’s built-in slash commands, keep using [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md). The CLI matters when a skill or external hook shells out to `plannotator ...`.

### Installation

macOS / Linux / WSL:

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

### Important caveat

`plannotator` must be on `PATH` for the Pi process, not just for an interactive shell. If a Plannotator skill loads but cannot open the browser UI, first verify that Pi can run `plannotator` from its environment.

### Related skills

Install [optional Plannotator skills](../skills/plannotator-extra-skills.md) separately with:

```bash
npx skills add backnotprop/plannotator/apps/skills/extra
```