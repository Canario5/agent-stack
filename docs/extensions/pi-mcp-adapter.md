## pi-mcp-adapter

- **Install:** `pi install npm:pi-mcp-adapter@x.x.x`
- **Purpose:** Use MCP servers through Pi with one compact proxy tool instead of listing every server tool. Servers connect lazily by default.
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

Precedence (lowest to highest): `~/.config/mcp/mcp.json` > `~/.agents/mcp.json` > `~/.agents/mcp/mcp.json` > `<pi agent dir>/mcp.json` > `<pi agent dir>/mcp-adapter.json` > `.mcp.json` > `.pi/mcp.json` > `.pi/mcp-adapter.json`. Opt-in ancestor config roots are also loaded below the current directory's files.

### Usage

The agent calls the `mcp` tool (same as `read`, `bash`, etc). You don't type this — the agent does it.

The interactive command is `/mcp-adapter`; on Pi 0.99+ `/mcp` also opens the adapter, which replaces Pi's built-in MCP for the session and disables it in user settings on first start. For static bearer-token servers, `bearerTokenStore: true` enables OS credential storage; manage the token with `pi-mcp-adapter token set|status|remove <server>` rather than putting it in config.

### Semantic search

Semantic search uses Pi's classifier models and credentials; v7 removed the adapter's key command and `SYSTEMONE_*` settings. Use Pi's `/login` for OpenRouter, set `TYPESAFE_API_KEY` or `OPENROUTER_API_KEY` in Pi's environment, or configure a provider in `models.json`.

Run `/mcp-adapter semantic setup` to migrate `settings.jev`. For manual migration:

- Rename `settings.jev` to `settings.semanticSearch`.
- Rename `semanticCandidateLimit` to `candidateLimit` and `semanticMinProbability` to `minProbability`.
- Format `model` as `provider/id`.
- Remove `requestTimeoutMs`, `maxRetries`, `maxStateBytes`, and `maxQuestionsPerRequest`.
- Change `settings.jev: false` to `settings.semanticSearch: false`.

See the [migration guide](https://github.com/nicobailon/pi-mcp-adapter/blob/v7.0.0/docs/scripting.md#moving-from-a-system-one-key) for the full mapping.

A previously stored System One key remains in the OS credential store; remove it if no longer needed.

| Action | Agent call |
|--------|------------|
| Status | `mcp({ })` |
| Search tools | `mcp({ search: "screenshot" })` |
| Describe tool | `mcp({ describe: "tool_name" })` |
| Call tool | `mcp({ tool: "name", args: '{"key": "val"}' })` |
| Connect server | `mcp({ connect: "server-name" })` |

`args` may be a JSON object or a JSON string. Prefer the object form; use a string for providers that require simpler schemas.

The adapter exposes MCP prompts as slash commands, supports server overrides (`/mcp-adapter disable` and `/mcp-adapter enable`), and guards oversized results.

- Use Pi's `codemode` for multi-call scripts; this stack enables it with `"defaultTools": ["+codemode"]`. The adapter's `mcpScript` was removed in v6; reusable scripts can be configured as `scriptTools` (Pi 0.99+).
- For servers that support MCP Tasks, set `"protocolVersion": "auto"` to run long calls in the background.
- Typed extraction is optional. Set `settings.extraction.allowedServers` to name servers whose tool results may be sent to Cloudflare.

### Tips

- **`directTools`** — by default, the agent discovers tools through `mcp({ search: ... })`, which saves tokens but adds a step. For frequently used servers, set `"directTools": true` to expose their tools directly.

  Expose all tools:
  ```json
  {
    "mcpServers": {
      "github": {
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
