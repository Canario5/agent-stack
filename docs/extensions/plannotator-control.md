# plannotator-control

A small local extension that lets Pi enter Plannotator plan mode and check its status. It connects the global agent workflow to Plannotator; it does not replace Plannotator or approve plans.

## Setup

Run the normal config sync, then restart Pi:

```bash
node scripts/sync-pi-config.mjs
```

This installs the connector and copies [`global-workflow.md`](../../global-workflow.md) to `~/.pi/agent/AGENTS.md`. That workflow tells Pi to use plan mode for nontrivial work. The sync replaces the global `AGENTS.md`; edit the repository source, not the generated copy.

## What it does

Pi can call `plannotator_control` with either action:

- `enter` — enter planning mode if idle; leave an existing planning or execution session unchanged.
- `status` — report `idle`, `planning`, or `executing`.

After entering, Pi drafts a Markdown plan and submits it with `plannotator_submit_plan`. You review and approve the plan before implementation. On a timeout, check status before retrying: the original request may have succeeded.

**Execution order:** The tool uses `executionMode: "sequential"` so it finishes before later calls in the same batch. Pi should enter plan mode and wait for confirmation before continuing. If entry fails, later calls are not automatically cancelled.

**Approval caveat:** The connector requires an interactive session. In Plannotator 0.28.23, missing review UI files can still cause automatic approval. During normal use, you review and approve the plan in your browser.

## Verify

In a fresh, interactive Pi session, ask for a small but nontrivial change and tell Pi to plan first. Confirm that it calls `plannotator_control`, Plannotator opens a plan review, and Pi waits for your decision. Reject or comment once; Pi should revise the plan without implementing it. Approve only when ready.

A successful status response alone does not verify the browser review or approval workflow. The connector requires an interactive session and a working Plannotator extension; plan mode is a workflow guard, not a shell or OS security boundary.

The connector uses Plannotator's documented `plannotator:request` event API and was checked with Pi 1.3.0 and Plannotator 0.28.23. Compatibility with later versions is not guaranteed.

## Remove

Remove the connector copy from `~/.pi/agent/extensions/`, its `write()` entry from `scripts/sync-pi-config.mjs`, and its instructions from `global-workflow.md`; then sync and restart Pi. Removing the connector alone leaves the workflow instructions pointing to a missing tool. The manual fallback is `/plannotator-plan-mode`.
