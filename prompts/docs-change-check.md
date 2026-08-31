---
description: Review a completed change for required documentation updates before finalizing
---

Treat `$@` as the target repository and current change scope.

Run a bounded post-change documentation check:

1. Launch a fresh read-only `docs-reviewer` with the exact repository/cwd, changed files or diff, task intent, and any named documentation requirements. It must inspect the actual source and canonical docs.
2. If the verdict is `NO UPDATE NEEDED`, report its evidence and stop.
3. If the verdict is `HUMAN DECISION REQUIRED`, report the decision and stop.
4. If the verdict is `UPDATE REQUIRED`, present the smallest exact documentation update plan and ask for approval. Do not silently edit documentation.
5. After approval only, launch one `docs-writer` as the sole documentation writer. Require it to update only canonical docs, run named validation, and run `drift check` when existing relevant bindings may be stale.
6. Finish with the docs-reviewer verdict, writer evidence, Drift result when applicable, and any explicit LLM Wiki/Hindsight action.

Do not update a wiki or retain memory merely because a code change occurred.
