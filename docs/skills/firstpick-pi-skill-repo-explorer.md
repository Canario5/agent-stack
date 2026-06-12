## repo-explorer

- **Install:** `pi install npm:@firstpick/pi-skill-repo-explorer@x.x.x`
- **Package:** `@firstpick/pi-skill-repo-explorer`
- **Category:** Discovery / understanding
- **Full docs:** [repo-explorer README](https://github.com/Firstp1ck/npm-packages/tree/main/pi-skill-repo-explorer#readme)

### What it adds

`repo-explorer` gives Pi a repository exploration workflow that returns a compact handoff with key files, symbols, risks, next actions, and optional evidence.

Use it for:
- unfamiliar codebases
- finding where something is implemented
- mapping dependencies before a change
- planning safe edits without dumping many files into context

### Usage

Explicit skill command, reliable call:

```text
/skill:repo-explorer find the authentication flow and the files I need before changing login behavior.
```

Mention the skill by name, likely to be called:

```text
Use repo-explorer to find the authentication flow and the files I need before changing login behavior.
```

Plain task request, no skill name. Pi may load the skill when the request clearly matches its description, but this is not guaranteed:

```text
Explore this repo for where extension docs and settings packages are maintained.
```

### Notes

- Start with compact output; request more depth only when needed.
- The skill writes an effectiveness report under its skill directory after each invocation.
- It is a good first step before `code-quality` on an unfamiliar repo.
