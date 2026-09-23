## find-skills

- **Install:** `npx skills add vercel-labs/skills --skill find-skills --agent pi --copy -y`
- **Source:** [vercel-labs/skills](https://github.com/vercel-labs/skills/tree/main/skills/find-skills)
- **Category:** Discovery / workflow extension
- **Status:** Trial
- **Full docs:** [find-skills on skills.sh](https://www.skills.sh/vercel-labs/skills/find-skills)

### What it adds

Helps identify and install relevant skills from the skills.sh ecosystem when a task may already have a reusable workflow.

### Usage

Use it for requests such as:

```text
Find a skill for Playwright accessibility testing.
```

It uses the Skills CLI:

```bash
npx skills find <query>
npx skills add <owner/repo> --skill <skill-name> --agent pi --copy -y
```

### Notes

- Prefer well-established skills and verify their source before installing.
- Installed skills run with full agent permissions; review `SKILL.md` before relying on one.
