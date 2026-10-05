## pi-web-access

- **Install:** `pi install npm:pi-web-access@x.x.x`
- **Purpose:** Adds web search and content extraction to Pi, with optional GitHub, PDF, YouTube, and video workflows.
- **Full docs:** [pi-web-access README](https://github.com/nicobailon/pi-web-access#readme)

### Tools

- `web_search` — search the web through configured providers.
- `fetch_content` — fetch one or more URLs as readable content; also handles supported GitHub, PDF, YouTube, image, and video inputs.
- `get_search_content` — retrieve full stored search or fetch results by response ID.
- `source_check` — gather cited passages for a claim.

### How it works

- `web_search` finds pages; `fetch_content` reads them. Pi's selected model uses the results to answer.
- Search works without a key via Exa MCP. Optional provider keys and routing go in optional config file `~/.pi/agent/web-search.json`; configured providers run in sequence, not as a combined search.
- SearXNG is an optional self-hosted search provider.
- Crawl4AI is an optional page-extraction project, not a search provider.

### Requirements and cautions

- Remote hosted extraction providers are opt-in for remote HTTP(S) URLs; review upstream security and privacy guidance before enabling them.
- Video frame extraction requires `ffmpeg`; YouTube frame extraction also requires `yt-dlp`. Basic search and page fetching need neither.
