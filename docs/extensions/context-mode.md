## context-mode

- **Install:** `pi install npm:context-mode@x.x.x` it requires - **CLI and MCP server:** [context-mode CLI](../external-utilities/context-mode.md).
- **Purpose:** Keeps large outputs out of Pi chat context (= it saves the tokens). It adds sandboxed processing, a local searchable knowledge base, and automatic hook-based routing so logs, test output, API responses, and other heavy results are processed safely instead of dumped into the conversation.
- **Full docs:** [context-mode README](https://github.com/mksglu/context-mode#readme)

### Install

1.  [Install `context-mode` globally](../external-utilities/context-mode.md) so the `context-mode` command exists.
2. Install the Pi package:
   ```bash
   pi install npm:context-mode@x.x.x
   ```
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

### How it works

`context-mode` integrates with Pi in two layers:

1. **Pi extension layer**  
   The package registers a Pi extension (`./build/adapters/pi/extension.js`) and uses Pi hooks such as:
   - `tool_call`
   - `tool_result`
   - `session_start`
   - `session_before_compact`

   This gives Pi **high session continuity** and automatic routing guidance for large-output tasks.

2. **MCP server layer**  
   The `context-mode` MCP server exposes `ctx_*` tools for sandboxed execution, indexing, search, diagnostics, and maintenance.

In practice, the extension nudges Pi away from raw `bash`/`read` when output may be large, and toward `ctx_execute`, `ctx_execute_file`, `ctx_search`, and related tools.

### Main tools

- `ctx_execute` — run code in a sandbox and return only printed findings
- `ctx_execute_file` — analyze a file without dumping the whole file into context
- `ctx_batch_execute` — run multiple commands and query results in one pass
- `ctx_index` / `ctx_search` — build and query a local searchable knowledge base
- `ctx_fetch_and_index` — fetch docs/pages and index them
- `ctx_stats` — show context savings
- `ctx_doctor` — verify installation and hooks
- `ctx_upgrade` — upgrade context-mode
- `ctx_purge` — delete indexed knowledge
- `ctx_insight` — open the analytics dashboard

### Usage

Ask Pi naturally to analyze logs, run tests, process large data, or search documentation. The extension should select `ctx_*` tools when appropriate like:

- “analyze this log file”
- “run the tests and summarize failures”
- “check recent git changes”
- “fetch the docs and search for auth config”
- “count TODOs in the repo”

Pi should prefer context-mode tools for those tasks instead of sending large raw outputs back into the chat.

You can also explicitly trigger the utility commands in chat:
- `ctx_execute` / `ctx_execute_file` — process data without dumping it into chat.
- `ctx_index` / `ctx_search` — store and query knowledge.
- `ctx_doctor`, `ctx_stats`, `ctx_upgrade`, `ctx_purge`, `ctx_insight` — maintenance commands.

### Notes

- Best for large outputs, logs, test runs, API responses, docs, and repo-wide analysis.
- File edits still use Pi's normal `read`, `edit`, and `write` tools.
- The `context-mode` executable and MCP configuration are required and documented separately in [context-mode CLI](../external-utilities/context-mode.md).
