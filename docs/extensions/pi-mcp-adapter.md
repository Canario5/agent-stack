## pi-mcp-adapter

- **Install:** `pi install npm:pi-mcp-adapter@x.x.x`
- **Purpose:** Use MCP servers through pi. One proxy tool (~200 tokens) instead of hundreds. Servers start lazily — only when you actually call a tool.
- **Full docs:** [pi-mcp-adapter README](https://github.com/nicobailon/pi-mcp-adapter/blob/main/README.md)

### Config

Preferred: `.mcp.json` in project root, or `~/.config/mcp/mcp.json` for shared global config. Pi also reads `~/.agents/mcp.json` and `~/.agents/mcp/mcp.json`.


```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Adapter-owned settings and overrides belong in `<pi agent dir>/mcp-adapter.json` (normally `~/.pi/agent/mcp-adapter.json`) and `.pi/mcp-adapter.json`. On Pi 0.99+, the adapter also reads `<pi agent dir>/mcp.json` and `.pi/mcp.json`.

Precedence (lowest to highest): `~/.config/mcp/mcp.json` > `~/.agents/mcp.json` > `~/.agents/mcp/mcp.json` > `<pi agent dir>/mcp.json` > `<pi agent dir>/mcp-adapter.json` > `.mcp.json` > `.pi/mcp.json` > `.pi/mcp-adapter.json`.


### Usage

The agent calls the `mcp` tool (same as `read`, `bash`, etc). You don't type this — the agent does it.


The interactive command is `/mcp-adapter`; on Pi 0.99+ `/mcp` also opens the adapter, which replaces Pi's built-in MCP for the session and disables it in user settings on first start. For static bearer-token servers, `bearerTokenStore: true` enables OS credential storage; manage the token with `pi-mcp-adapter token set|status|remove <server>` rather than putting it in config.

### System One semantic search

With a valid System One key, the adapter can provide semantic search across enabled MCP tools. TypeSafe remains the default provider; set `SYSTEMONE_ENDPOINT` to use another compatible provider and use `pi-mcp-adapter key set systemone` to store its key. `/mcp-adapter jev setup` chooses which servers may share semantic-search data; the project policy is saved and Pi reloads. Script evaluation remains opt-in.

| Action | Agent call |
|--------|------------|
| Status | `mcp({ })` |
| Search tools | `mcp({ search: "screenshot" })` |
| Describe tool | `mcp({ describe: "tool_name" })` |
| Call tool | `mcp({ tool: "name", args: '{"key": "val"}' })` |
| Connect server | `mcp({ connect: "server-name" })` |

`args` may be a JSON object or a JSON string. Prefer the object form; use a string for providers that require simpler schemas.


The adapter also supports MCP prompts as slash commands, disabled-server overrides (`/mcp-adapter disable` / `/mcp-adapter enable`), oversized-output guarding, and optional `mcpScript` for trusted multi-call JavaScript workflows. `mcpScript` is off by default; enable it with `"settings": { "scriptMode": true }` in `mcp-adapter.json`.

### Tips

- **`directTools`** — by default, the agent discovers MCP tools through the proxy tool (`mcp({ search: ... })`). That saves tokens but adds a step. If you use a mcp server frequently (e.g., filesystem, github), set `"directTools": true` on it — its tools appear directly in the agent's tool list, no search trough mcp proxy needed.

  Expose all tools:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "directTools": true,
        "excludeTools": ["search_repositories", "get_file_contents"]
      }
    }
  }
  ```

  Or pick specific tools only:
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "directTools": ["search_repositories", "get_file_contents"]
      }
    }
  }
  ```

  Good for 5–20 tools. Beyond that, the token cost of listing them all outweighs the convenience.

  You can also toggle this per-server in the `/mcp-adapter` interactive panel — no manual JSON editing needed.

- **Lifecycle modes** — controls when servers connect:
  - `"lazy"` (default) — connects on first tool call. Disconnects after `idleTimeout` (default 10 min).
  - `"eager"` — connects at startup, but **does not auto-reconnect** if the connection drops. No idle timeout by default (set `idleTimeout` explicitly to enable).
  - `"keep-alive"` — connects at startup, auto-reconnects on failure. No idle timeout. Use for critical servers (e.g., database).
  - `"lazy-keep-alive"` — connects on first use, then stays resident and auto-reconnects.

  Set a global default under `"settings"`, then override per-server:

  ```json
  {
    "settings": {
      "idleTimeout": 10
    },
    "mcpServers": {
      "my-server": {
        "command": "npx",
        "args": ["-y", "some-mcp-server"],
        "lifecycle": "lazy"
      },
      "chatty-server": {
        "command": "node",
        "args": ["server.js"],
        "lifecycle": "lazy",
        "idleTimeout": 30
      }
    }
  }
  ```

  `my-server` uses the global 10 min default. `chatty-server` overrides it to 30.
