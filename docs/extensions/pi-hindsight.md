## @luxusai/pi-hindsight

- **Install:** `pi install npm:@luxusai/pi-hindsight@x.x.x`
- **Purpose:** Adds persistent project memory to Pi using a Hindsight server.
- **Full docs:** [Pi Hindsight documentation](https://luxus.github.io/pi-hindsight/)

### What it adds

- Recalls relevant project memory before model calls.
- Retains structured session changes after completed agent runs.
- Provides explicit tools for retaining, recalling, and reflecting on memory.
- Keeps project memory isolated by project bank; user memory is opt-in.

### Usage

Run `/hindsight` in Pi to inspect the effective server URL and memory profile. This stack tracks the package in `settings.json` and syncs `hindsight.jsonc` to `~/.pi/agent/hindsight.jsonc`.

The default self-hosted Hindsight URL is `http://localhost:8888`; this repository overrides it in the tracked `hindsight.jsonc`.

`/hindsight` -> **Open hub** shows the active Hindsight configuration including project bank, memory scope, recall/retain enabled etc.

### Caveats

- Hindsight requires a reachable Hindsight server.
- Project-local `.pi/hindsight.json` and `.pi/hindsight/` files are runtime state.
- Automatic retention may write session-derived memory to the configured project bank.
