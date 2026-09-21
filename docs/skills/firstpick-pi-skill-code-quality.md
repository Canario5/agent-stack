## code-quality

- **Install:** `pi install npm:@firstpick/pi-skill-code-quality@x.x.x`
- **Package:** `@firstpick/pi-skill-code-quality`
- **Category:** Quality / review
- **Full docs:** [code-quality README](https://github.com/Firstp1ck/pi-coding-agent-forge/tree/main/pi-skill-code-quality#readme)

### What it adds

`code-quality` instructs Pi to improve permanent code as it writes, with focused review and verification guidance for maintainability and standards.

Use it for:
- code reviews and warning cleanup
- linting, formatting, and quality gate setup
- maintainability and complexity checks
- Rust, TypeScript, Python, shell, and mixed repos

### Usage

Explicit skill command, reliable call:

```text
/skill:code-quality review this diff for maintainability and unnecessary complexity.
```

Mention the skill by name, likely to be called:

```text
Use code-quality to review this diff for maintainability and unnecessary complexity.
```

Plain task request, no skill name. Pi may load the skill when the request clearly matches its description, but this is not guaranteed:

```text
Review this diff for maintainability, warnings, and unnecessary complexity.
```

### Notes

- Prefer focused review scopes over broad repo-wide audits.
- Ask for evidence-backed findings and fixes worth doing now.
- When enabled, apply its writing practices to permanent code changes; explicit review-only requests remain read-only.
- Pair with `repo-explorer` first when the codebase is unfamiliar.
