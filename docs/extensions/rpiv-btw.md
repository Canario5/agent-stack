## @juicesharp/rpiv-btw

- **Install:** `pi install npm:@juicesharp/rpiv-btw@x.x.x`
- **Purpose:** Adds `/btw <question>` for side questions that stay out of the main conversation context.
- **Full docs:** [rpiv-btw README](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-btw#readme)

### What it adds

`rpiv-btw` gives Pi a bottom-panel side conversation for quick context-aware questions.

It supports:
- asking `/btw <question>` from an interactive Pi session
- answering in a terminal panel without adding the answer to the main conversation context
- using a read-only clone of the current conversation as context
- remembering prior `/btw` questions and answers during the same Pi process
- scrolling with `↑`/`↓`, clearing history with lowercase `x`, and dismissing/cancelling with `Esc`
- rebuilding context after compaction or branching, and retaining history across `/new`, `/fork`, `/resume`, and `/reload` during the same Pi process

### Usage

Ask a side question when you want help without changing the active task thread:

```text
/btw why did we switch from sockets to SSE last week?
```

Useful for:
- asking about context already present in the conversation
- checking a detail before continuing the main task
- exploring a related idea without distracting the primary agent
- keeping the main conversation context focused on implementation work


### Notes

- Requires interactive Pi mode; it is unavailable under `pi --print` or RPC.
- Needs a configured primary model and valid provider credentials.
- The side instance has no tools and can only answer in plain text.
- `/btw` history is in-memory only and is lost when the Pi process restarts.
