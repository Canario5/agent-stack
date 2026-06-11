## pi-powerline

- **Install:** `pi install npm:pi-powerline@x.x.x`
- **Purpose:** Improves Pi's terminal UI with a Powerline-style header, footer, and breadcrumb.
- **Full docs:** [pi-powerline README](https://github.com/jwu/pi-powerline#readme)

### Settings

Configure it in global `~/.pi/agent/settings.json` or project `.pi/settings.json`:

```json
{
  "powerline": true,
  "breadcrumb": "inner",
  "footer": true,
  "header": true,
  "header-info": true
}
```

Project settings override global settings.

### Commands

```text
/powerline
/powerline info
/powerline breadcrumb:top|inner|hide
/powerline footer:on|off
/powerline header:on|off
/powerline header-info:on|off
```

### Notes

- Nerd Font icons are auto-detected; set `PI_NERD_FONTS=1` or `PI_NERD_FONTS=0` to force them.
- `header-info` requires Pi `quietStartup: true` and only appears on startup/reload.
