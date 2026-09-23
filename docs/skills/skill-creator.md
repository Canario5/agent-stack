## skill-creator (Pi port)

- **Location:** `.pi/skills/skill-creator/` (synced by `node scripts/sync-pi.mjs`).
- **Source:** [Anthropic skill-creator](https://github.com/anthropics/skills/tree/34040c9c568585f6929bedeaad110ad08f079624/skills/skill-creator), Apache-2.0; upstream assets and license are bundled. This is a local fork, not a Skills CLI-managed update.
- **Use:** `/skill:skill-creator <skill to create, port or improve>`.
- **Workflow:** Draft, approve eval cases, compare Pi JSON-mode candidate and baseline runs, inspect graded outputs, render the upstream static review viewer, iterate.
- **Run:** `node .pi/skills/skill-creator/scripts/pi_eval.mjs <candidate-dir> <evals.json> <new-workspace> --model <provider/model>`; use `--baseline <old-skill-dir>` when improving a skill. On Windows add `--pi <path-to-pi/dist/bundle/cli.js>` instead of a `.cmd` shim.
- **Caveats:** Eval runs cost tokens and can execute tools; confirm prompts before running. Sessions isolate skills/extensions and history, **not** file-system access. Benchmark aggregation and the static viewer need Python (`py` on Windows). Bundled `run_eval.py`, `run_loop.py`, and `improve_description.py` still invoke `claude -p` and are not used; description optimization is manual iteration over Pi trigger tests. A paired two-prompt smoke run succeeded on `openai-codex/gpt-5.6-luna`, but broader quality and provider compatibility remain unverified.
