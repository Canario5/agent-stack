## Plannotator CLI

- **Command:** `plannotator`
- **Used by:** Non-Pi Plannotator hook integrations.
- **Scope:** User-level CLI, not a Pi extension package.
- **Full docs:** [Plannotator installation guide](https://plannotator.ai/docs/getting-started/installation/)

### What it adds

The Plannotator CLI opens the local browser UI for plan review, markdown/file annotation, assistant-message annotation, code review, archived sessions, and the Plannotator Inbox (`plannotator inbox`) for agent messages, questions, files, and guided reviews.

For Pi’s built-in slash commands and optional Inbox tool, use [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md). Running `plannotator inbox` interactively also connects detected agent integrations by default; set `PLANNOTATOR_INBOX_CONNECT=0` to skip that step. The CLI can also start the Inbox directly, or be used by external hooks that shell out to `plannotator ...`.

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
npx skills add backnotprop/plannotator/apps/skills/extra --agent pi --copy -y
```
