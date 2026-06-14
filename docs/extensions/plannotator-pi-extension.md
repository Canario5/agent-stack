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
- Code review: inspect Pi's local changes in a browser diff UI, mark exact risky lines, then send feedback back to Pi.
- Pull request review: open a PR diff, review changed files visually, and feed review notes back to the agent.

### What it adds

- Plan mode with a browser UI for approving or annotating markdown checklist plans.
- Plan diffs when a plan is resubmitted after feedback.
- Annotation UI for markdown files, folders, URLs, and rendered assistant messages.
- Code review UI for current git changes, staged changes, last commit, branch diffs, or pull request URLs.
- Slash commands for user-driven workflows, plus event-based plan mode control for other Pi extensions.

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

Review a pull request URL:

```text
/plannotator-review https://github.com/owner/repo/pull/123
```

### Slash commands

- `/plannotator` — start or toggle plan mode.
- `/plannotator <file.md>` — start plan mode with a specific plan file.
- `/plannotator-annotate <file.md>` — open markdown or converted content in the annotation UI.
- `/plannotator-last` — annotate the latest rendered assistant message.
- `/plannotator-review` — review the current local git changes in this repo.
- `/plannotator-review <PR URL or diff target>` — review a specific pull request, branch diff, or other supported diff target.

Choose the command by what you need to inspect. Use `/plannotator-annotate <target>` when the thing you want to review already exists and you want comments on the current content. For example, use it to review a plan, README, spec, instructions file, or other supported text/document source.

Use `/plannotator-review` when Pi or another developer changed files and you want to review those changes before accepting them. It opens a diff view: added lines, removed lines, renamed files, and changed files. This is the mode to use after Pi edits code or docs, or when reviewing a pull request.

### Programmatic plan mode

Users normally start plan mode with `/plannotator`, `Ctrl+Alt+P`, or `pi --plan`.

Since v0.20.2, other Pi extensions can control Plannotator plan mode through Pi's event bus. This lets extension-driven workflows enter, exit, toggle, or check plan mode without the user to run `/plannotator` manually.

For example, another extension could recognize a request like `plan this first` and call Plannotator's `plan-mode` event before the agent continues.

### Optional extra skills

`@plannotator/pi-extension@0.20.1` and newer no longer bundles the [optional Plannotator skills](../skills/plannotator-extra-skills.md). Those skills also require [Plannotator CLI](../external-utilities/plannotator-cli.md) on `PATH`.

### Core workflows

| Workflow | Command | Use when |
|---|---|---|
| Approve a plan before coding | `/plannotator <plan-file.md>` | You want Pi blocked until you approve the plan. |
| Review Pi's code changes | `/plannotator-review` | Pi edited files and you want line-level feedback before it continues. |
| Review a PR or branch diff | `/plannotator-review <PR-or-diff-target>` | You want Plannotator as a browser review UI for pull requests or larger diffs. |
| Review docs or specs | `/plannotator-annotate <file.md>` | You want inline comments on requirements, README edits, or docs before Pi codes against them. |
| Correct Pi's latest answer | `/plannotator-last` | Pi gave a long plan or explanation and exact visual feedback is clearer than chat. |
| Clarify the goal first | `plannotator-setup-goal` extra skill | The request is vague, risky, or easy to misunderstand. |
| Break up big work | `plannotator-compound` extra skill | You want staged plan/review/execute cycles instead of one large run. |

### Code review loop

Use `/plannotator-review` after Pi changes code or when you want to inspect a PR:

1. Pi edits files, or you provide a pull request URL.
2. Plannotator opens the diff in a browser.
3. You annotate exact changed lines with comments such as `fix this`, `missing test`, or `this behavior changed`.
4. Send feedback back to Pi.
5. Pi should triage the feedback, verify it against the code, and then discuss or make repairs.

This is most useful for risky refactors, dependency upgrades, behavior changes, and large pull requests where plain chat feedback would be too vague.

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
