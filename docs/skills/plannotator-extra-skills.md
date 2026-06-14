## Plannotator extra skills

- **Install CLI:** install [Plannotator CLI](../external-utilities/plannotator-cli.md) first so `plannotator` is on `PATH`.
- **Install skills:** `npx skills add backnotprop/plannotator/apps/skills/extra`
- **Category:** Planning / Plannotator
- **Full docs:** [Plannotator installation guide](https://plannotator.ai/docs/getting-started/installation/)

### What it adds

Optional Plannotator skills for larger human-in-the-loop workflows that are not bundled with the Pi extension anymore:

- `plannotator-setup-goal` — turns a rough request into a specific, reviewable goal before the agent writes a plan or edits code.
- `plannotator-compound` — breaks a multi-part coding request into smaller plan/review/execute cycles, so you can approve each stage before the agent continues.
- `plannotator-visual-explainer` — helps create or review visual artifacts, diagrams, architecture flows, screenshots, UI explanations, or documentation visuals through Plannotator.

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

### When to use each skill

| Skill | Use when |
|---|---|
| `plannotator-setup-goal` | The request is vague, risky, or likely to be misunderstood. Use it before planning or coding. |
| `plannotator-compound` | The task is large enough that one long agent run would be hard to review. Use it for staged approval loops. |
| `plannotator-visual-explainer` | The feedback is easier visually than in plain text: diagrams, UI flows, screenshots, architecture maps, or docs visuals. |

These extra skills complement [`@plannotator/pi-extension`](../extensions/plannotator-pi-extension.md). Use the extension's `/plannotator-review` command for local diff or pull request review; use these skills when the task itself needs goal setup, staged execution, or visual explanation.

