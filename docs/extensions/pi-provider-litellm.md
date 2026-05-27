## pi-provider-litellm
- **Why** It fetches extra info from litellm `/model/info` route if available. Good for context, price etc informations.
- **Issue:** Interactive login with pi `/login litellm` didnt worked (windows issue maybe?)
- **Workaround:** Manually paste config directly into pi´s config file `.pi/agent/auth.json`:  
```
"litellm": {
  "type": "oauth",
  "access": "redacted-token",
  "refresh": "",
  "expires": 253402300799000,
  "baseUrl": "https://litellm.redacted.com"
}
```
- **Note:** Expires field doesnt matter in this case.
- **Note2:** LiteLLM server MUST have the model info route `/model/info` explicitly allowed for the token.
- **Usage:** new slash command added into pi `/litellm-refresh` — force re-fetch the model list, ignoring cache