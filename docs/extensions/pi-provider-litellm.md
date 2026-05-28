## pi-provider-litellm
- **Install:** `pi install npm:pi-provider-litellm@x.x.x`
- **Purpose:** Fetches extra information from LiteLLM's `/model/info` route, such as context size and pricing.
- **Issue:** Interactive login with `pi /login litellm` did not worked (maybe Windows issue?).
- **Workaround:** Manually add the config to pi's auth file at `.pi/agent/auth.json`:  
```
"litellm": {
  "type": "oauth",
  "access": "redacted-token",
  "refresh": "",
  "expires": 253402300799000,
  "baseUrl": "https://litellm.redacted.com"
}
```
- **Note:** The `expires` field does not matter in this case.
- **Requirement:** The LiteLLM token must be allowed to call `/model/info`.
- **Usage:** Automatic. Also manual way with slash command `/litellm-refresh` which refreshes the model list and ignores the cache.