## Caliber / ai-setup

Repository: https://github.com/caliber-ai-org/ai-setup  
Package: `@rely-ai/caliber`

Requires Node.js 20 or newer.

### What Caliber is

Caliber is a setup assistant for AI coding tools. It looks at a repository, asks an LLM to summarize how the project works, and writes agent instruction files.

For Pi, the important output is `AGENTS.md`.

Pi already reads `AGENTS.md` when it starts work in a repo. So Caliber can help by drafting or refreshing that file.

```text
repo source files + package files + existing docs
        ↓
Caliber analyzes the project with an LLM
        ↓
Caliber drafts AGENTS.md
        ↓
human reviews and edits AGENTS.md
        ↓
Pi uses AGENTS.md as project instructions
```

Caliber does not add Pi tools, install a Pi extension, or change how Pi runs. It only helps create repo-local instruction files that Pi can read.

### What `AGENTS.md` should explain

A useful `AGENTS.md` tells Pi things a new developer would normally need to learn, for example:

- what the project is
- where the important files live
- how to run tests, builds, docs, or checks
- what files are generated or should not be edited casually
- project-specific rules, review expectations, and caveats

Caliber is useful when that information is missing, stale, or spread across the repo.

### Recommended first use with Pi

Use `init`, not `bootstrap`, for the simplest Pi workflow.

From the repository root, preview what Caliber would generate:

```bash
npx @rely-ai/caliber init --agent codex --dry-run
```

- `--agent codex` asks Caliber for the output style that includes `AGENTS.md`.

Caliber does not currently have `--agent pi`. Use `--agent codex` for Pi because the Codex-style output includes `AGENTS.md`, and Pi reads `AGENTS.md`.

The command can still be interactive. Caliber may ask which LLM provider to use because it needs a model to generate the instructions. Use a provider you already have access to, or stop if you are not ready to run generation.

If the preview looks useful, run it without `--dry-run`.

Then review `AGENTS.md` before committing it. Do not blindly accept the generated file.

### Review before commit

Check the generated `AGENTS.md` like you would review code:

- Is the project description correct?
- Are the commands real and current?
- Are paths and file names accurate?
- Did it preserve existing human-written rules?
- Did it add generic advice that should be removed?
- Did it create extra files this repo does not want?

Commit only the instructions you want Pi and other agents to follow.

### `init` vs `bootstrap`

Caliber has two setup paths:

```bash
npx @rely-ai/caliber init --agent codex
```

Use this for Pi. It runs the setup wizard directly and can write `AGENTS.md`.

```bash
npx @rely-ai/caliber bootstrap
```

Use this only if you are setting up Caliber through another supported agent CLI. `bootstrap` installs helper skills such as `/setup-caliber`; then that other agent runs `/setup-caliber` and performs the setup from inside its own session.

Both paths are meant to reach the same general result: generated agent context for the repo. For Pi, `init --agent codex` is clearer because it directly targets the file Pi can use.

### `--agent all`

Caliber also documents:

```bash
npx @rely-ai/caliber init --agent all
```

That means generate files for every supported target. It is not needed for Pi-only setup and may create extra non-Pi config files. Prefer `--agent codex` when the goal is only to improve Pi's `AGENTS.md`.

### Keeping it up to date

When the repo changes enough that `AGENTS.md` may be stale, preview a refresh:

```bash
npx @rely-ai/caliber refresh --dry-run
```

If the preview improves the instructions, apply it:

```bash
npx @rely-ai/caliber refresh
```

Useful checks:

```bash
npx @rely-ai/caliber status
npx @rely-ai/caliber score
```

- `status` shows the current Caliber setup state.
- `score` checks context quality without an LLM call. Treat it as a signal, not proof that the file is correct.

### Hooks and learning

Caliber has optional automation commands:

```bash
npx @rely-ai/caliber hooks --install
npx @rely-ai/caliber hooks --remove
```

`hooks` installs or removes automatic refresh hooks, usually around commits. Hooks can keep generated instructions fresher, but they can also change files during normal git work. For a new Pi setup, prefer manual `refresh --dry-run` until the team is comfortable with Caliber.

```bash
npx @rely-ai/caliber learn
```

`learn` manages session-learning hooks and learned patterns for supported agent setups. It is usually not needed if the only goal is to maintain `AGENTS.md` for Pi.

### Undo or remove

If Caliber output is not useful, use these to revert Caliber-generated resources:

```bash
npx @rely-ai/caliber undo
```