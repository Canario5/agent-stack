## tech-deep-dive

- **Install:** `pi install npm:@firstpick/pi-skill-tech-deep-dive@x.x.x`
- **Package:** `@firstpick/pi-skill-tech-deep-dive`
- **Category:** Planning / decision support
- **Full docs:** [tech-deep-dive README](https://github.com/Firstp1ck/npm-packages/tree/main/pi-skill-tech-deep-dive#readme)

### What it adds

`tech-deep-dive` gives Pi a structured evaluation workflow for picking or comparing technology options.

Use it for:
- libraries, frameworks, tools, platforms, databases, APIs, and models
- architecture choices with trade-offs
- ecosystem and maintenance checks
- recommendation writeups with criteria scoring

### Usage

Explicit skill command, reliable call:

```text
/skill:tech-deep-dive compare queue libraries for this TypeScript service.
```

Mention the skill by name, likely to be called:

```text
Use tech-deep-dive to compare queue libraries for this TypeScript service.
```

Plain task request, no skill name. Pi may load the skill when the request clearly matches its description, but this is not guaranteed:

```text
Evaluate whether we should use SQLite, Postgres, or DuckDB for this local analytics feature.
```

### Notes

- Best for decisions where several viable options exist.
- Give it constraints such as runtime, deployment target, budget, license, and team familiarity.
- Do not treat the recommendation as final without checking current docs or project constraints.
