## @juicesharp/rpiv-ask-user-question

- **Install:** `pi install npm:@juicesharp/rpiv-ask-user-question@x.x.x`
- **Purpose:** Adds the `ask_user_question` tool so Pi can ask structured clarifying questions instead of guessing.
- **Full docs:** [rpiv-ask-user-question README](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-ask-user-question#readme)

### What it adds

`rpiv-ask-user-question` gives Pi a terminal dialog for user decisions.

It supports:
- one to four questions in a single dialog
- single-select and multi-select options with descriptions
- markdown/code/ASCII previews beside options, or stacked below them on narrow terminals
- a chat escape row when the user wants to discuss instead of choose
- notes attached to answers without marking a question answered
- a Submit tab that reviews answers and identifies unanswered questions
- collapsing the overlay with `Ctrl+]` by default, or a configured key
- RPC/ACP host dialogs; the tool is omitted from non-interactive runs

### Usage

No manual command is required. Pi can call `ask_user_question` when a task has choices.

Good uses:
- choosing between implementation approaches
- collecting setup preferences before creating files
- confirming UI or API design trade-offs
- asking several related project questions at once

Example prompt to Pi:

```text
Before implementing, ask me structured questions for any choices you should not guess.
```

### Notes

- Do not use it for trivial confirmations when normal chat is faster.
- Preview content is useful for comparing layouts, code snippets, diagrams, or config examples.
- `Esc` abandons the questionnaire; `Tab` moves between question tabs.
- Configuration is optional at `~/.config/rpiv-ask-user-question/config.json`; `collapseKey` and model-guidance overrides are supported.