## preset

- **Install:** Bundled local extension, synced by `scripts/sync-pi-config.mjs`.
- **Purpose:** Switches named model, thinking, tool, and instruction presets.
- **Source:** Pi's official [`preset.ts` example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/preset.ts), with local `excludeTools` support.

### Usage
Run `/preset` without an argument to open the selector. `pi --preset <name>` applies a preset at startup.

```text
/preset nano
/preset standard
/preset agents
```
- `nano` keeps core coding tools, web fetch, and everyday Hindsight memory tools; it excludes context-mode, delegation, repository exploration, and administrative tools.
- `standard` adds productive context-mode, web, repository exploration, and Hindsight tools while excluding delegation and low-frequency maintenance tools. MCP not active.
- `agents` enables the advanced toolset for delegation; it intentionally excludes not relevant tools for coding.

`excludeTools` is resolved against `pi.getAllTools()` at activation time, so new tools join both presets automatically.

The extension changes the active model tool surface immediately; it does not unload extension code.
