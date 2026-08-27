## pi-context-view

- **Install:** `pi install npm:pi-context-view@x.x.x`
- **Purpose:** Visualizes context usage and exposes normally hidden context, including the system prompt, tool definitions, and instructions injected by extensions.
- **Full docs:** [pi-context-view README](https://github.com/dimk90/pi-context-view#readme)

### Commands

```text
/context
/context usage
/context injections
```

- `/context` and `/context usage` open the context usage view, grouped by categories such as tools, skills, and messages.
- `/context injections` shows captured system prompt, tool definitions, and extension injections from session start or resume.

### Notes

- Zoom is available for detailed breakdowns of large context windows.
- The extension does not add instructions or messages to the model context.
