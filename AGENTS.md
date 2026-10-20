# AGENTS.md

This repo is a small Pi harness extension registry and documentation set.

Rules for agents:
- Keep changes minimal and documentation-first.
- Add or update one extension at a time unless explicitly asked otherwise.
- Extension docs live in `docs/extensions/<package-name>.md`.
- Update `docs/extensions/extensions.md` whenever adding, removing, or renaming an extension doc.
- Treat `settings.json` as the source of truth for normal-sync Pi package pins and `settings.devcontainer.json` for devcontainer-sync pins; keep both intentional when changing packages.
- For Skills CLI-managed skills, update from the repo root and review both the skill changes and `skills-lock.json`; keep the lockfile consistent with the installed skill sources and hashes. Do not regenerate it for extension-provided or local skills.
- Keep wording concise, practical, and specific to Pi usage.
- Preserve install commands, purpose bullets, usage notes, and important caveats.
- Do not expand docs with generic background or marketing text.
- Do not rewrite unrelated files.
