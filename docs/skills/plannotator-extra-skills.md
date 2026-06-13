## Plannotator extra skills

- **Install CLI:** install [Plannotator CLI](../external-utilities/plannotator-cli.md) first so `plannotator` is on `PATH`.
- **Install skills:** `npx skills add backnotprop/plannotator/apps/skills/extra`
- **Category:** Planning / Plannotator
- **Full docs:** [Plannotator installation guide](https://plannotator.ai/docs/getting-started/installation/)

### What it adds

Optional Plannotator skills for planning workflows that are not bundled with the Pi extension anymore:

- `plannotator-setup-goal` — turns a rough request into a specific, reviewable goal before the agent writes a plan or edits code.
- `plannotator-compound` — breaks a multi-part coding request into smaller plan/review cycles, so you can approve each stage before the agent continues.
- `plannotator-visual-explainer` — helps create or review visual artifacts, diagrams, or UI explanations through Plannotator.

### Installation

First install [Plannotator CLI](../external-utilities/plannotator-cli.md). The skills shell out to `plannotator`, so the command must be available on `PATH` for the Pi process.

Then install the extra skills:

```bash
npx skills add backnotprop/plannotator/apps/skills/extra
```

In the `skills` installer UI, choose the Pi/OpenAI Agent Skills target that writes to `~/.agents/skills` when available.

### Usage

Explicit skill command, reliable call:

```text
/skill:plannotator-setup-goal set up a reviewed goal for updating the extension docs.
```

Mention the skill by name, likely to be called:

```text
Use plannotator-setup-goal for this change.
```

