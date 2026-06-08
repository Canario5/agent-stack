## @juicesharp/rpiv-btw

- **Install:** `pi install npm:@juicesharp/rpiv-btw@x.x.x`
- **Purpose:** Adds `/btw <question>` for side questions that stay out of the main conversation context.
- **Full docs:** [rpiv-btw README](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-btw#readme)

### What it adds

`rpiv-btw` gives Pi a bottom-panel side agent for quick context-aware questions.

It supports:
- asking `/btw <question>` from an interactive Pi session
- answering in a terminal panel without adding the answer to the main conversation context
- reading a clone of the current conversation so the side answer has context
- remembering prior `/btw` questions and answers during the same Pi process
- follow-up side questions that use the `/btw` thread history
- scrolling, clearing, closing, or cancelling the panel from the keyboard

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

- Requires interactive Pi mode; it is not for `pi --print` or RPC runs.
- Needs a configured primary model and valid provider credentials.
- Uses a fresh, tool-less side instance of the active primary llm used in active thread.
- `/btw` history is in-memory only and is lost when the Pi process restarts.
