---
name: skill-creator
description: Create, port, test, and improve Pi Agent Skills. Use when a user wants a new SKILL.md, a reusable workflow, skill evaluation against a baseline, review of skill outputs, or better automatic triggering.
license: Apache-2.0
compatibility: Pi 0.87+; Node.js for Pi eval runs; Python 3 for the optional upstream benchmark viewer.
---

# Skill Creator for Pi

This is a Pi port of Anthropic's `skill-creator`, not the Claude Code CLI workflow. Keep the upstream license and bundled reviewer, benchmark, grader, analyzer, and schema references. The Pi runner is `scripts/pi_eval.mjs`; do **not** run the bundled `run_eval.py`, `run_loop.py`, or `improve_description.py` (they launch `claude -p`).

## Decide what to build

Start where the user is: a new workflow, an existing skill to improve, an external skill to port, or an eval set to run. Derive intent from the conversation first. Establish the actual task, when to trigger, expected deliverables, examples, failure cases, constraints, and how success will be judged. Ask only for missing decisions. If a short reusable prompt suffices, say so instead of manufacturing a skill.

For a port, inspect the original skill and its bundled resources, license, and executable assumptions. Preserve its actual workflow, not just its title and description. Translate unsupported agent commands into Pi equivalents and document any functionality that cannot be carried over. Do not quietly replace a full workflow with a checklist.

## Draft the skill

- Follow Pi's `docs/skills.md` and the Agent Skills spec: directory `skill-name/SKILL.md`, YAML `name` and `description` describing **what** and **when**, matching lowercase-hyphenated names. Use relative links to optional `references/`, `assets/`, and `scripts/`.
- Put trigger conditions in the description; put workflow, decision branches, and output contract in the body. Make instructions specific enough that two runs take the same process, but avoid boilerplate and repeating general agent rules.
- Put deterministic repeated operations in scripts when doing so saves work; make inputs, outputs, failure behavior and runtime requirements explicit. Review third-party scripts before running them.
- For skills shared through this stack, place hand-written files in `.pi/skills/`, add a short `docs/skills/<name>.md` and an index entry in `docs/skills/skills.md`; `scripts/sync-pi.mjs` mirrors skills globally. Do not hand-edit Skills CLI-managed skills without deliberately forking and dropping their lock entry.
- For an existing skill, snapshot its **old** directory before editing. For a new skill, the baseline is no skill at all.

## Design real evaluations

Create 2–3 representative user prompts, including an edge case. Include inputs when a task depends on files and measurable assertions only where they genuinely predict quality. Also write positive and near-miss negative **trigger** prompts: 'would I load this skill?' is not the same as 'does its answer look good?'. Present prompts and expected criteria to the user before launching paid runs; confirm the model, cost and file-write scope. A runnable eval task can execute tools and write outside its temporary working directory: use trusted prompts/skills and do not treat the temp directory as a security sandbox.

Save `<skill-dir>/evals/evals.json` or a separate untracked workspace plan:

```json
{
  "skill_name": "example-skill",
  "evals": [
    { "id": 1, "prompt": "A realistic task", "files": [], "assertions": ["required answer text"], "should_trigger": true }
  ]
}
```

Assertions in this Pi runner mean **literal text in the final answer**, not arbitrary file or semantic checks. Omit them for subjective work: no `grading.json` is written until you grade those runs yourself; never aggregate a benchmark before grading. For trigger evals include near-misses with `"should_trigger": false`; evaluate those separately from task-quality prompts. Avoid scoring a skill from a single anecdote.

## Run with Pi

The Node runner launches separate Pi 0.87+ JSON sessions with identical model and options, using `--no-skills --skill <candidate>` versus `--no-skills` (or `--skill <old-skill>`). It uses `--no-extensions --no-session` to avoid ambient skill collisions and session history. It records transcript events, token and time measurements, direct evidence of a `read` of `SKILL.md`, assertion results, and files from each temporary cwd. It does **not** run the repo's extensions, so a skill that depends on one needs a dedicated interactive test instead. On Windows pass the Pi JavaScript CLI file via `--pi`; a `.cmd` shim is not safe to invoke with arbitrary prompts through a shell.

```bash
node .pi/skills/skill-creator/scripts/pi_eval.mjs \
  path/to/candidate path/to/evals.json path/to/new-workspace \
  --model provider/model-id --thinking medium
```

Use `--baseline path/to/old-skill` for an existing skill. On Windows, add `--pi C:/path/to/@earendil-works/pi-coding-agent/dist/bundle/cli.js`. The runner refuses to overwrite a workspace; use a new directory for each iteration. It is deliberately bounded to one run per condition and a two-minute timeout per run by default (`--timeout <milliseconds>`). Repeat a noisy case in new workspaces before drawing conclusions; cost and token measurements are observational, not causal proof.

`results.json` reports `skillRead` for the candidate: compare it with `should_trigger` from evals. A read of `SKILL.md` is stronger evidence than a helpful answer, but only confirms triggering in this isolated environment. Check Pi startup diagnostics and `/skill:<name>` after `/reload` in the real configuration as well.

## Grade, review, iterate

- Review `eval-N/{with_skill,without_skill}/run-1/outputs/` and `events.jsonl`; for an old-skill comparison the baseline directory is `old_skill`. Programmatic assertions have weak semantics: do not let literal string matches override visible failures.
- For subjective or file-based criteria, use the bundled `agents/grader.md` guidance to write `grading.json` with `expectations: [{text, passed, evidence}]` and a `summary` for **each** condition. Use `agents/analyzer.md` to look for non-discriminating criteria, variance and cost regressions. For close calls use `agents/comparator.md` for a blind comparison.
- Use `python <this-skill-dir>/scripts/aggregate_benchmark.py <workspace> --skill-name <name>` to aggregate graded cases. Read `references/schemas.md` if editing a benchmark file; its exact field names matter to the viewer.
- Render the actual outputs for user review with `python <this-skill-dir>/eval-viewer/generate_review.py <workspace> --skill-name <name> --static <workspace>/review.html` (optionally `--benchmark <workspace>/benchmark.json`). Show the output path and collect the exported `feedback.json`; do not treat silence as approval.
- Improve the skill based on observed failure modes, not only a benchmark number. Compare again against the same baseline and at least one fresh prompt; stop when feedback is satisfactory or further revisions cease to help. For description tuning, revise the description and rerun positive/negative trigger prompts, including held-out near-misses. The upstream automated Claude-only description optimizer has **not** been ported; do not claim automatic optimization.

If Python or an interactive viewer is unavailable, inspect paired `answer.md`, other output files and `grading.json` directly with the user. If the runner cannot access a provider, report that as an untested integration rather than claiming the eval passed.

## Finish

Validate frontmatter, paths, an explicit invocation and discovery, and run `node scripts/sync-pi.mjs --dry-run` if changing this stack. Report what changed, the eval prompts, observed outcomes, feedback and any unsupported or untested behavior. Re-read the bundled license before distributing a modified fork.
