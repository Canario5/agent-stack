## context-mode CLI

- **Purpose:** Runs the `context-mode` MCP server that provides Pi's `ctx_*` tools for **Pi extension:** [context-mode](../extensions/context-mode.md).
- **Full docs:** [context-mode README](https://github.com/mksglu/context-mode#readme)

### Installation
1. Install `context-mode` globally
    ```bash
    npm install -g context-mode
    ```

2. Install the [Pi package](../extensions/context-mode).

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