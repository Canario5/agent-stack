## @narumitw/pi-codex-usage

- **Install:** `pi install npm:@narumitw/pi-codex-usage@x.x.x`
- **Purpose:** Shows ChatGPT Codex subscription usage inside Pi without requiring Codex CLI.
- **Full docs:** [pi-codex-usage README](https://github.com/narumiruna/pi-extensions#readme)

### Usage

```text
/codex-status
/codex-status --refresh
/codex-status --no-statusline
/codex-status --clear-statusline
```

### Notes

- Uses Pi's `openai-codex` subscription auth first.
- Falls back to `codex app-server --listen stdio://` only when Pi auth is unavailable.
- Automatically shows a compact statusline item while the current Pi model uses `openai-codex`.
- Results are cached for five minutes unless `--refresh` is used.
