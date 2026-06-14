## pi-skillful

- **Install:** `pi install npm:pi-skillful@x.x.x`
- **Purpose:** Allows skills to be invoked anywhere in a prompt, selected skills to be hidden to reduce prompt context, and skill visibility to be toggled directly in a session.
- **Full docs:** [pi-skillful README](https://github.com/jvm/pi-mono/tree/main/packages/pi-skillful#readme)

### What it adds

`pi-skillful` adds three skill-focused workflow improvements:

- inline `/skill:name` invocation anywhere in a prompt, including multiple skills in one prompt
- selected skills can be hidden from the model's automatic skill-discovery prompt to reduce prompt context
- selected skills can be toggled on or off directly in the current Pi session

Hidden skills remain loaded and can still be invoked explicitly with `/skill:name`.

### Usage

Open the skill visibility and toggle menu:

```text
/skillful
```

Use the Global or Project tab to choose which settings file to edit. Toggle a skill off to hide it from the model's automatic `<available_skills>` prompt. Toggle it back on to advertise it again.

You can still explicitly invoke hidden skills:

```text
Please analyze this with /skill:code-quality, then summarize the fixes.
```

Inline invocation also supports more than one skill in the same prompt:

```text
Use /skill:repo-explorer and /skill:code-quality for this change.
```

### Session toggles

Assign up to nine skills to prompt-editor slots in settings:

```json
{
  "skillful": {
    "hiddenSkills": ["ctx-doctor", "ctx-stats"],
    "toggleSlots": {
      "1": "repo-explorer",
      "2": "code-quality"
    },
    "toggleModifier": "alt"
  }
}
```

Configured slots appear on the prompt editor border. Press `alt+1` through `alt+9` by default to toggle that skill for the current session. Supported `toggleModifier` values include `alt`, `ctrl`, `ctrl+shift`, `alt+shift`, `ctrl+alt`, and `ctrl+alt+shift`.

### Notes

- Project settings inherit global `skillful` settings until changed in the Project tab.
- Hidden skills show in Pi's startup skill list with the error color.
- `/new` preserves the current toggle state; resuming, forking, cloning, reloading, or restarting Pi resets toggles from settings.
