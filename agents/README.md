# Harness agents

This directory is the version-controlled source for global Pi Subagents roles. `scripts/sync-pi.mjs` mirrors it to `~/.pi/agent/agents/`.

> Mirroring replaces `~/.pi/agent/agents/` and `~/.pi/agent/prompts/`. Put every global role and prompt you want to keep in this repository; keep project-specific roles in `<project>/.pi/agents/`.

## Vendored defaults

These are verbatim copies from `pi-subagents@0.61.0` and shadow the package roles after sync:

- `scout.md`
- `worker.md`
- `reviewer.md`
- `oracle.md`
- `researcher.md`

Before upgrading `pi-subagents`, compare these files with the installed package. Keep local edits limited to deliberate harness policy.

## Documentation roles

| Role | Authority | Use |
|---|---|---|
| `docs-architect` | Read-only | Plan canonical ownership, migration, Drift candidates, and the wiki/Hindsight boundary. |
| `docs-writer` | Sole writer | Apply an approved, evidence-backed documentation plan. |
| `docs-reviewer` | Read-only | Decide whether a completed code/configuration change requires a canonical documentation update. |

All roles treat repository source and accepted decisions as authoritative. Hindsight recall is a lead to verify; it is never canonical truth or a task handoff mechanism. `llm-wiki/` is only for explicitly approved durable research, investigations, and decisions.

## Workflow prompts

`prompts/` is also mirrored to `~/.pi/agent/prompts/`. These files are ordinary Pi prompt templates: they tell the parent agent to compose and run `pi-subagents` roles. They are not persisted `workflowScript` programs themselves.

Pi Subagents provides the runtime composition layer (`runs.run`, `runs.all`, missions, artifacts, and supervision). Use a stored `workflowScript` only when this prompt-driven workflow proves too variable or needs deterministic branching that the parent should not decide.

```text
/docs-architecture C:/Dev/Ukol/alex-can-boilerplate
```

Builds a read-only plan using `scout` + `docs-architect`, then `oracle`. It stops for approval before editing.

```text
/docs-change-check C:/path/to/project
```

Runs `docs-reviewer` after a completed change. It stops if no docs update is needed or a decision is missing; after approval it uses one `docs-writer` and validates relevant Drift bindings.

Do not automate documentation edits yet. First run both prompts successfully on real work. A later opt-in hook may launch only `docs-reviewer` after changed Pi tasks; it must never auto-write docs.
