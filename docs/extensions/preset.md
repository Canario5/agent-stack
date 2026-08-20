## preset

- **Install:** Bundled local extension, synced by `scripts/sync-pi-config.mjs`.
- **Purpose:** Switches named model, thinking, tool, and instruction presets.
- **Source:** Pi's official [`preset.ts` example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/preset.ts), with local `excludeTools` support.

### Usage

```text
/preset base
/preset agents
```

Run `/preset` without an argument to open the selector. `pi --preset <name>` applies a preset at startup.

### Presets

`presets.json` is synced to `~/.pi/agent/presets.json`.

- `base` enables every registered tool except subagent, MCP, and LiteLLM-skill management tools.
- `agents` enables every registered tool.

`excludeTools` is resolved against `pi.getAllTools()` at activation time, so new tools join both presets automatically.

The extension changes the active model tool surface immediately; it does not unload extension code.
