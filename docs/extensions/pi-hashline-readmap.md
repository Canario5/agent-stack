## pi-hashline-readmap

- **Install:** `pi install npm:pi-hashline-readmap@x.x.x`
- **Purpose:** Replaces Pi's default file tools with hashline-based ones. You get `LINE:HASH` anchors, structural file maps, symbol reads, better grep output, and `ast_search` for structural code search.
- **Full docs:** [pi-hashline-readmap README](https://github.com/coctostan/pi-hashline-readmap#readme)

### What it changes

`pi-hashline-readmap` replaces Pi's built-in:
- `read`
- `edit`
- `grep`
- `ls`
- `find`

It also adds or improves:
- `write`
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

### Notes

- Good when you want safer edits and easier navigation in larger files.
- `read`, `grep`, `ast_search`, and `write` results can feed follow-up edits.
- `bash` output is post-processed to reduce noise while preserving useful results.
