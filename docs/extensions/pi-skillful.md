## pi-skillful

- **Install:** `pi install npm:pi-skillful@x.x.x`
- **Purpose:** Allows skills to be invoked anywhere in a prompt, selected skills to be hidden to reduce prompt context, and skill visibility to be toggled directly in a session.
- **Full docs:** [pi-skillful README](https://github.com/jvm/pi-mono/tree/main/packages/pi-skillful#readme)

### What it adds

`pi-skillful` adds three skill-focused workflow improvements:

a. progressive loading of `.agents/skills/` from ancestor directories above the git repository root
b. inline `/skill:name` invocation anywhere in a prompt, including multiple skills in one prompt
c. selected global or project skills (not skills in package!) can be hidden from the model's automatic skill-discovery prompt to reduce prompt context
 d. selected global or project skills can be toggled on or off directly in the current Pi session

> **Important:** `hiddenSkills` does not affect skills bundled by Pi packages. Package skills remain advertised and still consume their catalog-description context; use package filtering to stop loading them.

Hidden global and project skills remain loaded and can still be invoked explicitly with `/skill:name`.

### Progressive skill loading

When a project is inside a Git repository, Pi normally stops discovering `.agents/skills/` at the repository root. `pi-skillful` also discovers existing `.agents/skills/` directories in ancestor folders up to the filesystem root, while preserving Pi's closer-directory-first name precedence. Projects without a Git repository are unchanged because Pi already walks to the filesystem root.

### Usage

Open the skill visibility and toggle menu:

```text
/skillful
```

Use the Global or Project tab to choose which settings file to edit. Toggle a skill off to hide it from the model's automatic `<available_skills>` prompt. Only global and project skills are configurable; skills bundled inside Pi packages are not affected. To remove a package skill from the prompt, filter that package's `skills` resources in `settings.json`.

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
    "hiddenSkills": ["upgrade-review"],
    "toggleSlots": {
      "1": "repo-explorer",
      "2": "code-quality"
    },
    "toggleModifier": "alt"
  }
}
```

Project settings are read and writable only when Pi trusts the current project. In an untrusted project, `pi-skillful` uses global settings only.

Configured slots appear on the prompt editor border. Press `alt+1` through `alt+9` by default to toggle that skill for the current session. Supported `toggleModifier` values include `alt`, `ctrl`, `ctrl+shift`, `alt+shift`, `ctrl+alt`, and `ctrl+alt+shift`.

### Notes

- Project settings inherit global `skillful` settings until changed in the Project tab.
- Project-scope settings require a trusted project.
- Hidden skills show in Pi's startup skill list with the error color.
- `/new` preserves the current toggle state; resuming, forking, cloning, reloading, or restarting Pi resets toggles from settings.
- When a project settings file contains only `skillful` settings and the project override is removed, `.pi/settings.json` is deleted instead of leaving an empty settings file behind.
