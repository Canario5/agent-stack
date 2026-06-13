## @plannotator/pi-extension

- **Install:** `pi install npm:@plannotator/pi-extension@x.x.x`
- **Purpose:** Adds Plannotator browser UIs for plan approval, markdown annotation, and code review feedback inside Pi.
- **Full docs:** [Plannotator for Pi README](https://github.com/backnotprop/plannotator/blob/main/apps/pi-extension/README.md)

### What it is good for

Plannotator gives Pi a human review from the browser.

Use it when the work is important enough that you want to approve, reject, or annotate before Pi continues. For very small one-line edits, normal chat is usually faster.

The basic loop is:

1. Pi prepares something: a plan, markdown document, assistant message, or code diff.
2. Plannotator opens it in the browser.
3. You approve it, reject it, or add precise annotations.
4. Pi receives that feedback and continues with better instructions.

Good uses:

- Planning before coding: Pi writes a checklist plan, then waits for approval.
- Safer changes: plan mode restricts destructive commands and limits writes while planning.
- Precise feedback: annotate exact plan items, markdown sections, assistant text, or diff lines.
- Code review: inspect current git changes in a browser diff UI.

### What it adds

- Plan mode with a browser UI for approving or annotating markdown checklist plans.
- Plan diffs when a plan is resubmitted after feedback.
- Annotation UI for markdown files, folders, URLs, and rendered assistant messages.
- Code review UI for current git changes, staged changes, last commit, or branch diffs.
- Slash commands for plan mode, annotation, and code review workflows.

### First test: plan review flow

Use this test first because it exercises the most important Plannotator loop without requiring a complicated code change.

Expected result: the browser opens, you add one comment to the plan, Pi revises the plan, and then you approve it.

1. Start Pi from this repo:

   ```bash
   cd C:/Dev/projects/agent-stack
   pi
   ```

2. In Pi chat, start plan mode with a temporary plan file:

   ```text
   /plannotator test-plan.md
   ```

3. Ask for a tiny plan:

   ```text
   Create a simple plan to add one sentence to README.md explaining that this repo documents my Pi extension stack. Do not edit files yet. Submit the plan for Plannotator review.
   ```

4. The plan should be a short checklist, for example:

   ```markdown
   - [ ] Read README.md.
   - [ ] Add one short sentence describing the repo.
   - [ ] Check that the wording is concise.
   ```

5. Wait for the browser UI. Pi should create or update `test-plan.md` and submit it to Plannotator.

6. In the browser, add a short annotation such as `Keep the sentence short`, then deny/send feedback.

7. Return to Pi and wait for it to revise the plan.

8. When the plan looks good, approve it in the browser. Approval is the handoff point: before approval, Pi should stay in planning/review behavior; after approval, it can execute the accepted plan.

9. If you do not want to keep the test artifacts, ask Pi:

   ```text
   Remove the Plannotator test plan file and undo the README test sentence if it was added.
   ```

### Other quick tests

Annotate this documentation file:

```text
/plannotator-annotate docs/extensions/plannotator-pi-extension.md
```

Use this for documents, specs, README changes, or anything where inline comments are clearer than a long chat message.

Review current git changes:

```text
/plannotator-review
```

Use this after Pi has made changes and you want to mark exact lines as `fix this`, `this is unclear`, or `this risk needs tests`.

### Slash commands

- `/plannotator` — start or toggle plan mode.
- `/plannotator <file.md>` — start plan mode with a specific plan file.
- `/plannotator-annotate <file.md>` — open markdown or converted content in the annotation UI.
- `/plannotator-last` — annotate the latest rendered assistant message.
- `/plannotator-review` — open current git changes in the code review UI.

### Optional extra skills

`@plannotator/pi-extension@0.20.1` and newer no longer bundles the [optional Plannotator skills](../skills/plannotator-extra-skills.md). Those skills also require [Plannotator CLI](../external-utilities/plannotator-cli.md) on `PATH`.

### Which workflow to use

| Situation | Best command |
|---|---|
| You want Pi to plan before editing | `/plannotator <plan-file.md>` |
| You want to review a markdown doc/spec | `/plannotator-annotate <file.md>` |
| You want to comment on Pi's latest answer | `/plannotator-last` |
| You want to review changed code lines | `/plannotator-review` |

### Tips for useful feedback

Good Plannotator comments are short and specific:

- `Split this into two steps.`
- `Add a test step before implementation.`
- `Do not touch settings.json for this change.`
- `This wording is too broad; keep it specific to Pi extensions.`
- `Risk: this file is user-facing docs, so avoid internal implementation detail.`

Annotate the exact line, checklist item, or diff line that needs changes. That gives Pi better context than a general chat message like `make it better`.

### Configuration

Plannotator config is loaded in this order:

1. Package defaults from `plannotator.json`.
2. User config at `~/.pi/agent/plannotator.json`.
3. Project config at `.pi/plannotator.json`.

Later layers override earlier ones. Use config to customize per-phase model, thinking level, extra active tools, status label, and system prompt for `planning`, `executing`, and future `reviewing` phases.

Example project override:

```json
{
  "phases": {
    "planning": {
      "thinking": "high",
      "activeTools": ["read", "grep", "find", "ls", "plannotator_submit_plan"],
      "statusLabel": "plan"
    },
    "executing": {
      "thinking": "high"
    }
  }
}
```

### Notes

- Plan mode intentionally restricts destructive commands and limits writes while planning.
- Approving with notes is useful when the plan is good but implementation needs constraints.
- Use `/plannotator-review` after code changes when you want browser-based line annotations instead of plain chat review.
