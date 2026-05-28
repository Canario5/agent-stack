## pi-mcp-adapter

- **Install:** `pi install npm:pi-mcp-adapter@x.x.x`
- **Purpose:** Use MCP servers through pi. One proxy tool (~200 tokens) instead of hundreds. Servers start lazily — only when you actually call a tool.
- **Full docs:** [pi-mcp-adapter README](https://github.com/nicobailon/pi-mcp-adapter/blob/main/README.md)

### Config

Preferred: `.mcp.json` in project root, or `~/.config/mcp/mcp.json` for global mcp config.
Currently: `<pi agent dir>/mcp.json` mcp config scoped for pi harness only.

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

Precedence: `~/.config/mcp/mcp.json` > `<pi agent dir>/mcp.json` > `.mcp.json` > `.pi/mcp.json`

### Usage

The agent calls the `mcp` tool (same as `read`, `bash`, etc). You don't type this — the agent does it.

| Action | Agent call |
|--------|------------|
| Status | `mcp({ })` |
| Search tools | `mcp({ search: "screenshot" })` |
| Describe tool | `mcp({ describe: "tool_name" })` |
| Call tool | `mcp({ tool: "name", args: '{"key": "val"}' })` |
| Connect server | `mcp({ connect: "server-name" })` |

`args` is a JSON string, not an object.

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

  You can also toggle this per-server in the `/mcp` interactive panel — no manual JSON editing needed.

- **Lifecycle modes** — controls when servers connect:
  - `"lazy"` (default) — connects on first tool call. Disconnects after `idleTimeout` (default 10 min).
  - `"eager"` — connects at startup, but **does not auto-reconnect** if the connection drops. No idle timeout by default (set `idleTimeout` explicitly to enable).
  - `"keep-alive"` — connects at startup, auto-reconnects on failure. No idle timeout. Use for critical servers (e.g., database).

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
 

