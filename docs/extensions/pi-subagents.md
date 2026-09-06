## pi-subagents

- **Install:** `pi install npm:pi-subagents@x.x.x`
- **Purpose:** Gives Pi focused helper agents to review code, scout files, implement tasks, or run work in parallel.
- **Full docs:** [pi-subagents README](https://github.com/nicobailon/pi-subagents#readme)

### The mental model

- **Agent Markdown files** define reusable worker roles. Project agents live in `.pi/agents/`; user-wide agents live in `~/.pi/agent/agents/`.
- **Your prompt** gives an agent a task. You can use agents directly without creating a workflow.
- **`workflowScript`** is an optional recipe for coordinating multiple agents when you repeat the same process.
- **`return`** sends a workflow result back to the parent Pi conversation. It does not create a file or edit the project.
- **Files and artifacts** are created only when you explicitly configure output or ask an agent to write one.

Start simple:

```text
Ask the security reviewer agent to inspect this change.
```

Use a workflow only when you want a repeatable sequence, such as `scout → parallel reviewers → worker fixes`.

### What it adds

`pi-subagents` gives Pi a `subagent` orchestration tool plus bundled agents, prompts, skills, workflow execution, and async run management.

Builtin agents include:
- `scout` — fast local codebase reconnaissance
- `researcher` — web/docs research with sources (default researcher requires `pi-web-access` for web tools)
- `worker` — approved implementation work
- `reviewer` — code review and small fixes
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

For a first workflow, use `scout` when you need orientation, `worker` for approved edits, `reviewer` to check work, and `oracle` when the decision feels risky. Use `researcher` when you need sourced web or documentation research.

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

**Important:** Run agents in the background if they need MCP tools or provider extensions. Background agents require Pi installed from npm; the standalone Pi binary cannot run them.

### Recommended workflow

A workflow is simply a repeatable recipe for coordinating agents. You can also use agents directly without a workflow.

```text
clarify requirements → scout the code → worker implements → fresh reviewers check → worker applies useful fixes
```

`clarify requirements` is a conversation step. The other steps are typical agent roles.

For repeatable recipes, `workflowScript` is a small JavaScript program that starts agents, waits for their results, and returns a result to the parent Pi conversation:

```js
subagent({ workflowScript: `
  const scan = await runs.run("scan", { agent: "scout", task: "Scan the codebase" });
  const reviews = await runs.all([
    { key: "correctness", agent: "reviewer", task: "Review correctness: " + scan.output },
    { key: "tests", agent: "reviewer", task: "Review tests: " + scan.output }
  ]);
  return reviews.map(result => result.output);
` });
```

The `return` value is shown in the parent conversation. It does not create a file unless you explicitly configure output or ask an agent to write one.

### Where workflows live

- **One-off workflow:** Pi can create the `workflowScript` inline for the current request. You do not need to save it.
- **Reusable workflow:** Put a prompt template in `.pi/prompts/` for this project or `~/.pi/agent/prompts/` for all projects, then run it with `/prompt-workflow`. Templates with `chain:` frontmatter are translated into `workflowScript`.
- **Runtime state:** Active runs, mission state, status, and artifacts are managed under `.pi/subagents/`. Inspect them through Pi's status/Fleet commands; do not edit these files manually.

Use `/run <agent> [task]` for a direct child run. The legacy `/chain`, `/parallel`, and `/run-chain` slash commands are not registered in current releases.
When a run has a pending supervisor question, answer it explicitly before steering or following up on that background run.

Other useful commands:

- `/subagents-doctor` — check setup and async/intercom state
- `/subagents-guide [topic]` — read the installed package's current guide

### Optional shortcuts

Reusable prompt workflows include:
- `/parallel-review`
- `/review-loop`
- `/parallel-research`
- `/gather-context-and-clarify`
- `/parallel-cleanup`

### Notes

- Installing the extension does not automatically review every change; ask for delegation or add that preference to project instructions.
- Builtin agents inherit the current Pi default model unless overridden in settings.
- If you run a subagent in the background, it keeps working after Pi returns control to you. Later, ask “show active async runs” or “check subagent status” to see whether it finished.
