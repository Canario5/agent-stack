## pi-web-access

- **Install:** `pi install npm:pi-web-access@x.x.x`
- **Purpose:** Adds web search and content extraction to Pi, with optional GitHub, PDF, YouTube, and video workflows.
- **Full docs:** [pi-web-access README](https://github.com/nicobailon/pi-web-access#readme)

### Tools

- `web_search` — search the web through configured providers.
- `fetch_content` — fetch one or more URLs as readable content; also handles supported GitHub, PDF, YouTube, image, and video inputs.
- `get_search_content` — retrieve full stored search or fetch results by response ID.
- `source_check` — gather cited passages for a claim.

### Usage

Ask Pi to search for information or fetch a URL. The extension can use Exa MCP search without an API key; other providers and workflows may require configuration. Provider keys and options belong in `~/.pi/agent/web-search.json`; consult upstream docs before enabling paid or remote extraction providers.

`fetch_content` accepts either `url` or `urls` for single or multiple pages. Use `web_search` to discover pages and `fetch_content` to read them. Use [context-mode](./context-mode.md) when results should be indexed, searched, or kept out of chat context.

### Requirements and cautions

- Remote hosted extraction providers are opt-in for remote HTTP(S) URLs; review upstream security and privacy guidance before enabling them.
- Video frame extraction requires `ffmpeg`; YouTube frame extraction also requires `yt-dlp`. Basic web search and page fetching do not require these binaries.
