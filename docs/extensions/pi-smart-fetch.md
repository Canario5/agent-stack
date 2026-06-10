## pi-smart-fetch

- **Install:** `pi install npm:pi-smart-fetch@x.x.x`
- **Purpose:** Adds smarter web fetching tools to Pi with browser-like TLS/HTTP fingerprints, readable Defuddle extraction, useful page metadata, batch fetching, downloads, and multiple output formats.
- **Full docs:** [pi-smart-fetch README](https://github.com/Thinkscape/agent-smart-fetch/tree/main/packages/pi-smart-fetch#readme)

### What it adds

`pi-smart-fetch` registers two Pi tools:

- `web_fetch` — fetch one URL and return clean readable content plus metadata
- `batch_web_fetch` — fetch many URLs with bounded concurrency

### When to use

Use `pi-smart-fetch` for live web fetching. Use [context-mode](./context-mode.md) when fetched or generated output should be indexed, searched, or kept out of chat context.

Use it for:

- docs and API reference pages
- GitHub issues, PRs, discussions, and pages
- Reddit, Hacker News, Substack, X / Twitter, and YouTube pages
- pages where raw HTML would be too noisy for the chat context

### Usage

Usually you ask Pi naturally:

```text
fetch the React docs page about useEffect and summarize the cleanup behavior
```

The agent can call:

```text
web_fetch(url, browser?, os?, headers?, maxChars?, timeoutMs?, format?, removeImages?, includeReplies?, proxy?, verbose?)
```

For multiple pages, it can call:

```text
batch_web_fetch(requests, verbose?)
```

Each `batch_web_fetch` request accepts the same options as `web_fetch`, except `verbose`.

### Output formats

| Format | Use for |
|---|---|
| `markdown` | Default readable page content |
| `html` | Cleaned HTML |
| `text` | Plain text without markdown formatting |
| `json` | Metadata-heavy or structured workflows |
| `raw` | Full raw response for later parsing |

### Optional defaults

You can set defaults in `~/.pi/agent/settings.json` or project `.pi/settings.json`:

```json
{
  "smartFetchVerboseByDefault": false,
  "smartFetchDefaultMaxChars": 50000,
  "smartFetchDefaultTimeoutMs": 15000,
  "smartFetchDefaultBrowser": "chrome_145",
  "smartFetchDefaultOs": "windows",
  "smartFetchDefaultRemoveImages": false,
  "smartFetchDefaultIncludeReplies": "extractors",
  "smartFetchDefaultBatchConcurrency": 8,
  "smartFetchTempDir": "/tmp/smart-fetch-pi"
}
```

Project `.pi/settings.json` overrides global `~/.pi/agent/settings.json`. Legacy `webFetch*` aliases are also supported.

### Notes

- Uses browser-like TLS/HTTP fingerprints, but it does not execute JavaScript or solve login/interactive anti-bot flows.
- Defuddle strips common page chrome such as nav, sidebars, related links, share widgets, and footers.
- Supports downloads and large files by streaming attachments and binaries to temp files.
- Can follow sane client-side `<meta>` redirects and matching alternate content links from page `<head>`.

