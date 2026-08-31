---
description: Build an evidence-backed documentation architecture plan before any documentation migration
---

Treat `$@` as the target repository. Do not edit it.

Run a bounded documentation-architecture workflow:

1. In parallel, launch fresh read-only `scout` and `docs-architect` agents. The scout maps the repository, configuration, tests, instructions, and likely documentation sources of truth. The docs architect inventories documentation ownership, duplication, staleness, Drift candidates, and the boundary between `docs/`, `AGENTS.md`, `llm-wiki/`, and Hindsight.
2. Give both agents the exact target path/cwd and require file-and-line evidence.
3. Give their completed reports to one read-only `oracle`. Ask it to challenge the target ownership and migration plan, especially unnecessary new systems, duplicate truth, unsupported assumptions, and unapproved deletions.
4. Synthesize one approval-required migration plan. Include canonical ownership, exact changed/deleted/moved files, link updates, validation, and minimal Drift bindings. Include an LLM Wiki schema proposal only when an approved durable research or decision record requires one.
5. Stop. Do not launch a writer or modify files until I approve the plan.
