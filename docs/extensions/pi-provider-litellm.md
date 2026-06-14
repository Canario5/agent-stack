## pi-provider-litellm
- **Install:** `pi install npm:pi-provider-litellm@x.x.x`
- **Purpose:** Registers LiteLLM proxy models in Pi and enriches them with metadata such as context size and pricing.
- **Login:** Use `/login litellm`, or `/login` → `Use a subscription` → `LiteLLM`. This works now correcly with v1.2.7 and onwards.
- **Backup fallback:** Manual auth editing should no longer be needed, but keep this short `auth.json` excerpt as a future fallback/backup reference:
```
"litellm": {
  "type": "oauth",
  "access": "redacted-token",
  "refresh": "",
  "expires": 253402300799000,
  "baseUrl": "https://litellm.redacted.com"
}
```
- **Note:** The `expires` field does not matter for static API keys.
- **Requirement:** The LiteLLM token must be allowed to call `/model/info` (for extra metadata); v1.2.7 can fall back to `/v1/models`, then `/health`, when `/model/info` is unavailable.
- **Usage:** Automatic. Use `/litellm-refresh` to refresh the model list and ignore the cache.
- **Optional auth:** v1.2.7 also supports dynamic token helpers with `LITELLM_API_KEY_HELPER` and Google ADC token auth with `LITELLM_GCLOUD_TOKEN_AUTH=1`.