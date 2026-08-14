## @juicesharp/rpiv-args

- **Install:** `pi install npm:@juicesharp/rpiv-args@x.x.x`
- **Purpose:** Adds shell-style arguments and runtime substitutions for Pi skill invocations.
- **Full docs:** [rpiv-args README](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-args#readme)

### What it adds

`rpiv-args` lets skills consume invocation arguments and command output in `SKILL.md` bodies.

It supports:
- positional arguments with `$1`, `$2`, and higher numbers
- all arguments as `$ARGUMENTS` or `$@`
- argument slices with `${@:N}` and `${@:N:L}`
- shell-style quoting for multi-word values
- `${SKILL_DIR}` and `${SESSION_ID}` runtime variables
- inline shell output with `` !`command` `` syntax and multi-line ```` ```! ```` blocks
- an explicit `Skill input:` label and skill-invocation protocol so raw arguments are not mistaken for instructions

### Usage

Add placeholders or shell substitutions to a skill body, then pass arguments when invoking it:

```text
/skill:deploy api production
```

A skill body such as:

```text
Deploy service $1 to $2.
```

becomes:

```text
Deploy service api to production.
```

Use `$ARGUMENTS` when the skill should receive everything the user typed after the skill name:

```text
/skill:fix-issue login page crashes on mobile
```

With this skill body:

```text
Fix the following issue: $ARGUMENTS
```

Pi expands it to:

```text
Fix the following issue: login page crashes on mobile
```

Use `$1`, `$2`, and `$3` only when each word has a specific meaning:

```text
/skill:deploy api production
```

Here `$1` is `api` and `$2` is `production`.

### Notes

- `$1` means the first argument, `$2` means the second, and so on.
- If the user does not provide an argument, the placeholder becomes blank.
- Quoted text stays together: `/skill:deploy "staging server"` makes `$1` equal `staging server`.
- `argument-hint` is just documentation for users; it does not validate or change arguments.
- Inline shell snippets run before Pi sends the skill text to the model.
- Inline shell snippets can fail or time out; when they do, the error text is inserted into the skill text.
- Placeholder replacement is plain text replacement, so it also happens inside code examples.
