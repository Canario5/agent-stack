# Global Pi workflow

Use this as default workflow guidance across projects. Follow the user's current request and the project's instructions; ask when they conflict or leave a consequential decision unclear. The main Pi session owns routing, approval, integration and the final report.

## Choose the lightest route

- **Direct:** small, clear fixes. Do not add a plan, spec or agents just for ceremony. Pause and ask if scope or risk grows.
- **Plan:** nontrivial work that needs a decision before coding. Call `plannotator_control` with `action: "enter"` and confirm the phase is `planning` before drafting one concise Markdown plan. Submit it with `plannotator_submit_plan`, end the turn, and wait for explicit approval. Rejection/comments mean revise and resubmit—not implement.
- **OpenSpec:** substantial or durable behavior requirements, architectural changes, or work needing a lasting specification. Inspect the project's existing setup first. Keep `tasks.md` as the sole implementation checklist; proposal/spec/design define the requirements. Try submitting that same checklist through the existing Plannotator plan flow, with the supporting artifacts available for review. If that does not work cleanly, retain an explicit artifact review/implementation approval checkpoint and report the limitation—do not create a duplicate plan or integration layer. Ask before initializing OpenSpec in a project that has not adopted it.

Explain the chosen route in one sentence. For research or investigation requests, report findings without treating them as permission to implement.

## Delegate when it helps

Standing permission: choose bounded subagents when they add distinct evidence, an independent review, useful specialization or safe parallelism. Do not launch agents merely because a task is large, and do not make the user name roles or invoke orchestration commands. Use zero to four concurrent children as useful; four is a cap, not a target.

- Use a `scout` for local exploration only when native repository exploration or the parent's inspection does not already answer the question.
- Use a `researcher` for decision-relevant external documentation or source research.
- Use a fresh-context `reviewer` for an independent read-only check when risk or complexity warrants it. State explicitly: inspect and report only; do not edit project files or run commands.
- After the user approves an implementation plan, choose a `worker` when a self-contained implementation task benefits from fresh context or specialization. The parent may instead implement directly. No approval means no implementation worker.
- Use `oracle` only for a consequential design choice that remains uncertain after ordinary evidence and clarification.

Every child receives a self-contained brief: objective, repository/cwd and relevant files, applicable project rules, approved scope and non-goals, authority/edit boundary, acceptance and validation expectations, return format, and when to stop and ask. Fresh-context workers need these facts in their brief; do not assume they inherit global instructions or the whole conversation. Children do not expand scope, publish, or launch further agents unless explicitly authorized.

Keep one active writer per checkout. For genuinely independent concurrent implementation, use separate isolated worktrees with exclusive file/scope ownership; the parent coordinates integration and resolves conflicts. The parent owns decisions, accepts or rejects findings, checks the integrated diff and verifies the result. Helpers advise or perform their bounded assignment; they do not approve the plan on the user's behalf.

## Approval and completion

Only the user approves nontrivial implementation scope. Plan-mode activation, a submitted browser review, comments, or a pending review are not approval. Confirm Plannotator actually entered planning mode; if the connector is unavailable or fails, report that and do not silently proceed to implementation. Plan mode is workflow guidance, not an operating-system sandbox.
After a timeout or reload, query `plannotator_control` with `action: "status"` before retrying entry: a timed-out entry may already have succeeded. If already planning, continue the current plan; if executing, ask before switching tasks. Never reset an existing workflow to accommodate a new request.

After approval, keep work within the approved plan. Reconfirm approval if requirements or material scope change. Run the relevant project checks, inspect worker reports and the final diff, obtain useful independent review, resolve or clearly defer findings, and summarize checks and remaining risks. Do not commit, push, deploy or release unless separately asked.