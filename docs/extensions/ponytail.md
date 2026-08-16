## @dietrichgebert/ponytail

- **Install:** `pi install npm:@dietrichgebert/ponytail@x.x.x`
- **Purpose:** Keeps coding changes as small as the requirement allows: reuse existing code, prefer the standard library and platform features, and avoid speculative abstractions.
- **Full docs:** [Ponytail README](https://github.com/DietrichGebert/ponytail#readme)

### Start using it

Ponytail is active for coding work. Ask Pi for the change you need as usual; it first understands the affected code, then takes the simplest safe implementation path.

```text
Add a date field to the account form. Keep the change minimal and preserve validation and accessibility.
```

It does **not** remove input validation, data-loss handling, security measures, accessibility basics, or explicitly requested behavior.

### Choose an intensity

```text
/ponytail lite
```

| Level | Use when |
|---|---|
| `lite` | You want the requested solution, plus a one-line suggestion for a simpler alternative. |
| `full` | Default. Prefer reuse, standard libraries, native platform features, and the smallest correct diff. |
| `ultra` | Challenge unnecessary work first; favor deletion or a one-line solution. |
| `off` | Turn Ponytail off for the current session. |

Run `/ponytail` without an argument to see the current level. `stop ponytail` or `normal mode` also turns it off.

### Practical tips

- Use `full` for normal feature work and bug fixes.
- Use `lite` when you want to decide whether to take the simpler alternative.
- Use `ultra` for cleanup or when a request may be speculative.
- For a deliberate shortcut with a known limit, ask Pi to leave a `ponytail:` comment that names the limit and upgrade path.

### Useful commands

| Command | Use when |
|---|---|
| `/ponytail-review` | You want a delete-list for unnecessary complexity in the current diff. |
| `/ponytail-audit` | You want a whole-repository over-engineering audit. |
| `/ponytail-debt` | You want to list deferred `ponytail:` shortcuts. |
| `/ponytail-gain` | You want Ponytail's benchmark impact summary. |
| `/ponytail-help` | You want the command quick reference. |

### Notes

- Non-trivial logic should still have one small runnable check or test.
- The default level can be set with `PONYTAIL_DEFAULT_MODE` or Ponytail's optional user config; see the upstream README for details.
