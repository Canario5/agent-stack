## Drift

Repository: https://github.com/fiberplane/drift  
Drift is Linux/macOS only.

### Purpose

Drift is a documentation freshness check for markdown files. A doc can bind itself to source files or AST symbols. When the bound code changes, `drift check` reports the doc as stale so the agent or developer knows to update it.

Use it for docs that describe real implementation behavior: APIs, architecture notes, configuration guides, generated-context files, onboarding docs, and operational runbooks.

### Pi compatibility

Drift works with Pi as an external CLI because its links live in the repository in `drift.lock`. Pi can read the docs, update linked code, run Drift commands, and fix stale docs as part of the same task.

### Install

Install latest or pin a specific version:

```bash
curl -fsSL https://drift.fp.dev/install.sh | sh -s -- --version vX.Y.Z
```

On macOS or Linux with Homebrew:

```bash
brew install fiberplane/tap/drift
```

Run the same installer or package-manager command later to update the CLI.

Optional agent skill:

```bash
npx skills add fiberplane/drift
```

The CLI does the actual checking. The skill teaches compatible agents when to run `drift link`, `drift refs`, and `drift check`, so it is usually worth installing when your agent runtime supports skills. Skip it if you only run Drift manually/CI-only or want the smallest possible agent context.

### Setup

Per project. The global install only makes the `drift` command available. The useful state is the repo-local `drift.lock` file, which records doc-to-code bindings.

Start with a small set of important docs:

1. Pick markdown docs that describe concrete code behavior.
2. Link each doc to the relevant files or symbols.
3. Review and commit the generated `drift.lock`.
4. Ask Pi to run `drift check` after code changes that may affect linked docs.
5. Optionally add `drift check` to CI.

Do not try to maintain one global Drift configuration for all Pi projects; each repository has different docs, source paths, and stale-doc risks.

### Use with Pi

Recommended flow:

- Give Pi the implementation request and name the docs that must stay accurate.
- Ask Pi to inspect current Drift bindings before editing code.
- Let Pi update code and any affected linked docs.
- Run `drift check` before final review.
- If Drift reports stale docs, ask Pi to update the docs or refresh the bindings.

Example request:

```text
Use Drift for this change: update the login token refresh behavior.

Docs that must stay accurate:
- docs/auth.md
- docs/operations/session-expiry.md

First inspect the Drift links for those docs. After the code change, update any affected docs and run drift check before finalizing.
```

Useful commands:

```bash
drift link docs/auth.md src/auth/login.ts
drift link docs/auth.md src/auth/provider.ts#AuthConfig
drift link docs/auth.md
drift check
drift status
drift refs src/auth/login.ts
drift unlink docs/auth.md src/auth/login.ts
```

Command notes:

- `drift link` adds or refreshes bindings in `drift.lock`.
- `drift link docs/auth.md` refreshes all existing/inline anchors for that doc after the doc changes.
- `drift check` checks all linked docs for staleness and exits non-zero when any doc is stale.
- `drift status` shows current anchors from `drift.lock`.
- `drift refs` shows which docs reference a file.
- `drift unlink` removes a binding.
- `src/auth/provider.ts#AuthConfig` links the doc to the `AuthConfig` symbol inside that file.
- The same file or symbol can be linked from multiple docs.

### CI example

```yaml
# .github/workflows/drift.yml
name: Drift
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: fiberplane/drift@main
      - run: drift check
```

Use `fetch-depth: 0` so Drift can compare linked docs against earlier code versions. This is usually fine for small or medium repos, but large repos may want to test whether a shallower checkout works before using it in CI.

### Practical notes

Keep Drift checks tied to documentation that matters. Do not link every markdown file just because it exists.

Good review prompts:

```text
After changing the API handler, run drift refs for the edited files and update any linked docs.
```

```text
Before finalizing, run drift check. If a doc is stale, update the doc rather than removing the link unless the doc no longer describes that code.
```

Notes:

- Start with docs that reviewers or operators actually rely on.
- Avoid broad links that make docs stale after unrelated code edits.
- Put always-on engineering rules in `AGENTS.md`, for example: run relevant tests, run `drift check` when linked docs may be affected, and call out any stale docs that were not fixed.
- Drift does not create Pi tools or Pi extensions; it is a repo CLI plus optional agent skill.