## @narumitw/pi-usage

- **Install:** `pi install npm:@narumitw/pi-usage@x.x.x`
- **Purpose:** Shows current-account usage for OpenAI Codex, Kimi For Coding, GitHub Copilot, OpenRouter, OpenCode Go (Zen), and xAI OAuth subscriptions inside Pi.
- **Full docs:** [pi-usage README](https://github.com/narumiruna/pi-extensions/blob/main/packages/pi-usage/README.md)

### Usage

```text
/usage
/fast
```

`/usage` opens an interactive menu for the current provider. It can refresh usage, view another configured provider, view all configured providers, and—when supported—toggle Codex Fast mode or redeem an earned Codex usage-limit reset.

`/fast` toggles persistent Fast routing for supported official OpenAI Codex models. It accepts no arguments and is unavailable in print or JSON mode.

### Notes

- The statusline key is `usage` and refreshes every five minutes for the selected supported provider.
- Codex reset redemption requires the current matching Pi ChatGPT OAuth account; API keys, custom/proxy origins, and non-current accounts fail closed.
- The extension does not switch accounts; account selection remains owned by Pi or an account-management extension.
- Copilot quota uses Pi's stored OAuth credential only when it matches the active runtime credential. Copilot and Codex usage endpoints are undocumented provider APIs.
- OpenRouter reports per-key credit/spend limits, not account-level credits.
- OpenCode Go reports rolling, weekly, and monthly Zen usage windows.
- Kimi For Coding reports plan windows and a separately labeled booster wallet; xAI OAuth usage is enabled by default, available through explicit `/usage` actions, and is not added to the statusline.
