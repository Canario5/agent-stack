## context-mode CLI

- **Purpose:** Runs the `context-mode` MCP server that provides Pi's `ctx_*` tools for **Pi extension:** [context-mode](../extensions/context-mode.md).
- **Full docs:** [context-mode README](https://github.com/mksglu/context-mode#readme)

### Installation

1. Run `node scripts/sync-pi.mjs` from this stack. Mise installs the pinned `context-mode` CLI from `mise.toml`.

Without Mise it can be installed with npm:

```bash
  npm install -g context-mode@x.x.x
```

Direct npm installation bypasses the central Mise manifest and is not updated by this repository's Renovate configuration.

2. Install the [Pi package](../extensions/context-mode.md).

3. Make sure `mcp.json` contains the MCP server:
   ```json
   {
     "mcpServers": {
       "context-mode": {
         "command": "context-mode"
       }
     }
   }
   ```
4. Restart Pi.


### Check

```bash
command -v context-mode
context-mode doctor
```

PowerShell:

```powershell
Get-Command context-mode
context-mode doctor
```