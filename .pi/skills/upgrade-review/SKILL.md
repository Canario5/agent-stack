---
name: upgrade-review
description: "Review a dependency update in this Pi stack: identify important upstream changes, assess compatibility and security impact, discover every relevant repository document without assuming its path, and update only documentation made inaccurate. Use for Renovate dependency-update branches or a package/skill update request."
---

# Upgrade Review

Review one dependency update end to end. This skill applies to Pi extensions, standalone skills, Pi itself, utilities, and any other dependency tracked by this repository.

## Input

Accept either:

- a package and version range, for example `pi-provider-litellm 2.0.5 → 2.0.6`; or
- a Renovate branch or pull request; or
- no arguments, in which case inspect the current branch's dependency diff against its merge base with `main`.

If the target cannot be determined from the input or diff, ask the user for it before researching.

## Workflow

### 1. Establish the exact update

1. Inspect the dependency diff and identify every changed package, old version, and new version.
2. Locate all tracked configuration locations for each package. Do not assume a specific file: search the repository for the exact package identifier and verify whether equivalent runtime configs remain aligned.
3. State the update range and configuration files in scope. Keep grouped Renovate updates as separate package reviews unless their upstream release notes explicitly make them interdependent.

### 2. Research primary sources

For every package, prefer these sources in order:

1. upstream release notes and the tagged version comparison;
2. upstream changelog, migration guide, README, or documentation;
3. package registry metadata and repository links;
4. only when needed, upstream issues or pull requests that explain a release-note item.

Do not infer behavior from a version number. Record source URLs and distinguish confirmed facts from missing release notes.

Classify each confirmed change as one or more of:

- breaking or migration required;
- security or privacy;
- configuration, authentication, or environment;
- user-visible behavior or commands;
- compatibility or runtime requirement;
- internal-only / no action expected.

Prioritize changes that alter this stack's setup, documented usage, supported Pi versions, permissions, endpoints, defaults, or security posture. Say explicitly when the update has no material user-facing change.

### 3. Discover relevant documentation

Do not assume that a package has one documentation file, that its filename matches the package name, or that it is an extension.

Search the whole repository documentation and configuration surface for:

- the exact package name, scoped and unscoped forms, and normalized name variants;
- the upstream repository and product names;
- commands, settings keys, environment variables, provider names, and features affected by the release;
- index and overview documents that link to or summarize the package;
- integration docs describing a relationship between the updated package and another extension, skill, utility, script, or runtime.

Start with `docs/`, `README.md`, tracked settings files, scripts, and local `.pi/skills/`, then expand only where search evidence indicates a dependency. Treat a document as in scope only when it contains an affected claim, setup path, integration, or discoverability entry. Do not rewrite unrelated documents or make speculative edits.

### 4. Decide and edit

For each in-scope document, compare its claims to the confirmed release changes:

- update it when a claim is now inaccurate, incomplete in a materially misleading way, or omits a new required action/security constraint;
- leave it unchanged when the update does not affect its documented claims;
- update indexes only when a title, location, package identity, or concise summary is now inaccurate.

Keep changes minimal, practical, and documentation-first. Preserve existing install commands and useful caveats unless upstream evidence proves they changed. Never add generic release-note prose to permanent docs.

If editing package pins, preserve alignment across all tracked configurations where that package is intentionally present. Do not modify the dependency version merely because this skill reviewed it; Renovate or the user owns that change.

### 5. Verify

1. Re-read every changed document and validate its claims against the cited primary sources.
2. Validate changed JSON or JSON5 configuration when applicable.
3. Run the narrowest relevant repository check. For documentation-only changes, at minimum run `node scripts/sync-pi.mjs --dry-run` to confirm local skills and configuration still sync.
4. Report any unverified claim, unavailable source, or compatibility risk rather than guessing.

## Required response

Return this concise structure:

```markdown
## Upgrade
- `package`: old → new
- Tracked locations: ...

## Important changes
- [classification] confirmed change — impact on this stack

## Documentation review
- Updated: `path` — why
- Checked, no change: `path` — why

## Verification
- Commands/checks run: ...
- Sources: ...
- Risks or follow-up: ...
```

A valid outcome is **no documentation changes needed**. Do not manufacture edits to make the review appear useful.
