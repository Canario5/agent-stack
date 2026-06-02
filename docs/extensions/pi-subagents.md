## pi-subagents

- **Install:** `pi install npm:pi-subagents@x.x.x`
- **Purpose:** Gives Pi focused helper agents to review code, scout files, plan changes, implement tasks, or run work in parallel.
- **Full docs:** [pi-subagents README](https://github.com/nicobailon/pi-subagents#readme)

### What it adds

`pi-subagents` gives Pi a `subagent` orchestration tool plus bundled agents, prompts, skills, and async run management.

Builtin agents include:
- `scout` — fast local codebase reconnaissance
- `researcher` — web/docs research with sources
- `planner` — implementation plans from existing context
- `worker` — approved implementation work
- `reviewer` — code review and small fixes
- `context-builder` — stronger handoff context and meta-prompts
- `oracle` — second-opinion advisory review
- `delegate` — lightweight generic delegation

### Usage

Use it by asking Pi naturally. You do not need to create agents first; pick the helper by role and describe the job:

```text
Use reviewer to review this diff and point out fixes worth doing now.
```

```text
Use scout to inspect the auth flow and tell me the important files, risks, and next questions.
```

```text
Ask oracle for a second opinion on my current plan. Challenge assumptions before we edit.
```

```text
Have worker implement this approved plan, then run reviewers and apply the feedback that makes sense.
```

For a first workflow, use `scout` when you need orientation, `planner` before a bigger change, `worker` for approved edits, `reviewer` to check work, and `oracle` when the decision feels risky.

### Customizing agents

Workflows/chains decide **when** agents run. Agent files and settings decide **what each agent is**.

For small changes to bundled agents, use `subagents.agentOverrides` in settings. Project settings go in `.pi/settings.json`; user-wide settings go in `~/.pi/agent/settings.json`.

```json
{
  "subagents": {
    "agentOverrides": {
      "reviewer": {
        "model": "anthropic/claude-sonnet-4",
        "thinking": "high",
        "tools": "read, grep, find, bash",
        "systemPrompt": "Review changes for correctness, tests, and unnecessary complexity. Report only evidence-backed findings."
      }
    }
  }
}
```

For bigger changes, create a custom agent markdown file in `.pi/agents/` for this project or `~/.pi/agent/agents/` for all projects. A project agent with the same name as a builtin replaces that builtin.

```md
---
name: security-reviewer
description: Security-focused code reviewer
tools: read, grep, find, bash, mcp:chrome-devtools
model: anthropic/claude-sonnet-4
inheritProjectContext: true
---
Review for security risks, unsafe defaults, missing validation, and risky dependencies.
```

Use `tools` to limit normal tools. Use `mcp:<server-or-tool-group>` entries for direct MCP tools when `pi-mcp-adapter` is installed. MCP servers themselves are still configured in `mcp.json`; the agent config only decides which tools the child may receive.

### Simple team workflow

A workflow is the idea; a chain is the saved file that runs it. For example, a small frontend team could be:

```text
frontend-lead → worker → code-quality
```

Subagents normally report back when their run finishes. If a child should ask the parent session a question while it is still running, add `pi-intercom` and mention that in the task.

Save a reusable version as `.pi/chains/frontend-change.chain.md`:

```md
---
name: frontend-change
description: Plan, implement, and clean up a frontend change
---

## frontend-lead
Review the requested frontend change and propose the safest component-level approach for: {task}

## worker
Implement the frontend lead's recommended approach.

Frontend lead output:
{previous}

## code-quality
Review the current implementation for simplicity, naming, duplication, and unnecessary abstraction.

Worker summary:
{previous}

Return fixes worth doing now.
```

Then run it naturally:

```text
Run the frontend-change chain for the button redesign described in button-change.md.
```

In that run, `{task}` becomes `the button redesign described in button-change.md`, so the first step receives the original request. `{previous}` means “the result from the step directly above this one”: `worker` gets the `frontend-lead` result, and `code-quality` gets the `worker` result. The final reviewer should still inspect the changed files itself; `{previous}` only adds the worker’s summary and intent. For a more independent final review, omit `Worker summary: {previous}` and tell the reviewer to inspect the edited files directly.

Pi may show a preview/clarify screen before running a chain so you can inspect or edit the steps. Slash commands usually run directly; chain/tool workflows may show a preview screen first.

For parallel workflows, multiple subagents run at the same time. Use them for independent or read-only work, like several reviewers checking the same diff. Avoid parallel writers editing the same files; a safer pattern is `worker → parallel reviewers → worker fixes`.

You can also use the slash-command layer:
- `/run` — launch a single agent
- `/chain` — launch a chain of steps
- `/parallel` — launch parallel tasks
- `/run-chain` — run a saved workflow
- `/subagents-doctor` — check setup and async/intercom state

### Optional shortcuts

Reusable prompt workflows include:
- `/parallel-review`
- `/review-loop`
- `/parallel-research`
- `/parallel-context-build`
- `/parallel-handoff-plan`
- `/gather-context-and-clarify`
- `/parallel-cleanup`

### Notes

- Installing the extension does not automatically review every change; ask for delegation or add that preference to project instructions.
- Builtin agents inherit the current Pi default model unless overridden in settings.
- If you run a subagent in the background, it keeps working after Pi returns control to you. Later, ask “show active async runs” or “check subagent status” to see whether it finished.
