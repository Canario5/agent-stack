## pi-hashline-readmap

- **Install:** `pi install npm:pi-hashline-readmap@x.x.x`
- **Purpose:** Replaces Pi's default file tools with hashline-based ones. You get `LINE:HASH` anchors, structural file maps, symbol reads, better grep output, and `ast_search` for structural code search.
- **Full docs:** [pi-hashline-readmap README](https://github.com/coctostan/pi-hashline-readmap#readme)

### What it changes

`pi-hashline-readmap` replaces Pi's built-in:
- `read`
- `edit`
- `grep`
- `write`
- `ls`
- `find`

It also adds or improves:
- `ast_search`
- optional `nu`
- compressed `bash` output for noisier commands

### Usage

Mostly automatic. Once installed, Pi uses the replaced tools directly.

Useful patterns:
- `read({ path: "src/App.tsx", map: true })` — read file and append a structure map
- `read({ path: "src/App.tsx", symbol: "App" })` — read one symbol only
- `grep({ pattern: "useState", path: "src" })` — get anchored grep results
- `ast_search({ pattern: "useState($$$ARGS)", path: "src/App.tsx" })` — search by code shape

### Optional tools unleashing the full power

Useful extras if you want better fallbacks and nicer output:
- `ast-grep` — fallback for `ast_search`
- `nushell` — fallback for the `nu` tool
- `fd` — speeds up `find`
- `universal-ctags` — better symbol maps on fallback paths
- `difftastic` — better semantic edit summaries
- `shellcheck`, `yq`, `scc` — handy extra CLI support

The stack's `mise.toml` installs the cross-platform `ast-grep`, Nu, `fd`, difftastic, ShellCheck, and `yq` binaries wherever Pi runs. See the [Mise notes](../external-utilities/mise.md). `scc` stays opt-in.

**Important**: Universal Ctags is the exception: install it separately only if you need fallback symbol maps. It is not currently pinned in `mise.toml` because its maintained release layout is not consistent across platforms:

- Windows: `winget install --id UniversalCtags.Ctags --exact`
- macOS: `brew install universal-ctags`
- Linux: use the distribution package, for example `apt install universal-ctags`

This exception is not Renovate-tracked by this repository.

### Notes

- Good when you want safer edits and easier navigation in larger files.
- `read`, `grep`, `ast_search`, and `write` results can feed follow-up edits.
- `bash` output is post-processed to reduce noise while preserving useful results; `PI_RTK_BYPASS=1` skips route compression, but the default context guard may still trim oversized output.
- The LLM automatically sees compact tool-use rules before calling tools, which helps it avoid invalid combinations. The detailed `prompts/*.md` files are reference docs; changing them alone does not change what the LLM sees.
