## OpenSpec

Repository: https://github.com/Fission-AI/OpenSpec

### Purpose

OpenSpec is a spec-driven development workflow for describing project changes before implementation. It helps an agent work from written requirements, affected behavior, and acceptance checks instead of a loose prompt.

Use it for larger features, architectural changes, or work where several agents or humans need shared context before code is edited.

### Pi compatibility

OpenSpec works with Pi as an external CLI because its specs live in the repository. After `openspec init`, Pi can read those files like other project documentation and use them while planning or implementing a change.

### Install

Install the CLI globally with npm:

```bash
npm install -g @fission-ai/openspec@latest
```

Run the same command later to update the CLI.

### Setup

Per project. The global install only makes the `openspec` command available. Initialize OpenSpec inside each repository that should use the workflow:

```bash
cd your-project
openspec init
```

Review the generated files and commit them if the project should use OpenSpec. Do not try to maintain one global OpenSpec configuration for all Pi projects; each project has different specs, change history, and agent guidance.

### Use with Pi

Recommended flow:

- Give Pi the actual request and a few concrete requirements.
- Ask Pi to draft the OpenSpec proposal/spec before editing code.
- Review the proposed requirements, affected areas, and acceptance checks.
- Approve or correct the spec.
- Let Pi implement against the approved spec and verify the result.

Example request:

```text
Use OpenSpec for this change: add night mode to the app.

Requirements:
- add a light/dark/system theme setting
- remember the user's choice
- apply dark colors to all existing screens

Non-goals:
- do not change unrelated layout or navigation

First read the existing OpenSpec files. Then draft the proposal/spec and show me the requirements, affected areas, and acceptance checks before editing code. After I approve, implement it and verify the result against the spec.
```

### Tests and review

Keep the request focused on the desired behavior, constraints, and non-goals.

Include tests when they are part of the definition:

```text
Acceptance:
- selected theme survives reload
- system mode follows the OS preference
- add or update tests for theme selection and persistence
```

Do not repeat generic process requirements, such as "review the code", in every OpenSpec request. Put always-on engineering rules in `AGENTS.md` instead, for example: review the final diff, avoid unrelated edits, run relevant tests, and call out risks.

### Good fit

- New behavior with unclear requirements.
- Larger refactors where the intended outcome matters more than the exact edit.
- Changes that need review before implementation.

### Poor fit

- Tiny fixes where a spec would add more overhead than clarity.
- Tasks where the desired code edit is already obvious.
- Projects where nobody will maintain the generated specs.
