## upgrade-review

- **Location:** `.pi/skills/upgrade-review/`
- **Use:** Review a Renovate dependency update and decide whether any tracked documentation is affected.
- **Invoke:** `/skill:upgrade-review <package> <old-version> → <new-version>`, or run it with no arguments (`/skill:upgrade-review`) on a Renovate branch.
- **Coverage:** Works for extensions, standalone skills, Pi itself, utilities, and other tracked dependencies. It discovers relevant documentation across the repository rather than assuming one package-named document.
- **Output:** Important upstream changes, compatibility/security impact, documentation updates (or an explicit no-change decision), sources, and verification.
