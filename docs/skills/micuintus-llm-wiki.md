## llm-wiki

- **Install:** `pi install npm:@micuintus/llm-wiki@x.x.x`
- **Package:** `@micuintus/llm-wiki`
- **Category:** Context / memory
- **Full docs:** [llm-wiki README](https://github.com/micuintus/llm-wiki#readme)

### What it adds

`llm-wiki` gives Pi a skill for maintaining a plain-markdown personal or project knowledge base using Karpathy's LLM Wiki pattern.

Use it for:
- saving durable notes from papers, articles, chats, books, or agent sessions
- compiling raw sources into cross-linked topic pages
- tracking decisions, bugs, open questions, and synthesized knowledge
- asking what the wiki already knows about a topic

### How to use it

Use `llm-wiki` when something should be remembered beyond the current chat. It is not automatic; ask Pi to save or query the wiki.

Common requests:

```text
/skill:llm-wiki start a new project wiki for this repo.
```

```text
/skill:llm-wiki save these notes about our deployment process to the wiki.
```

```text
/skill:llm-wiki add this article to the wiki and update any related topic pages.
```

```text
/skill:llm-wiki what does the wiki say about local-first sync?
```

What Pi should do:

| Request | What happens |
|---|---|
| Start a wiki | Create `llm-wiki/` starter files and propose schema choices. |
| Save notes or an article | Register the source, write or update topic pages, then update the wiki index and log. |
| Ingest a Pi session | Read only the selected session log, extract durable decisions/errors/artifacts, then compile useful knowledge into the wiki. |
| Ingest a web chat | Import one selected chat URL into `raw-sources/conversations/`, then compile useful knowledge into topic pages. |
| Ask the wiki | Read existing wiki pages and answer with links/citations where possible. |

### Importing sessions and web chats

Pi sessions and web chats can be added to the wiki, but only when you ask for a specific one.

**Pi sessions:** Ask for a specific session to be ingested, for example:

```text
/skill:llm-wiki ingest today's Pi session about the extension docs.
```

Pi only imports the session you ask for. It can save useful decisions, problems, changed files, and outcomes to the wiki. It does not automatically archive all Pi chats.

**Web chats:** Ask for a specific chat URL to be imported, for example:

```text
/skill:llm-wiki ingest this ChatGPT conversation into the project wiki: <url>
```

The `ingest-web-chat` subskill imports one Claude.ai, ChatGPT, Gemini, or Le Chat conversation URL at a time. It does **not** require a Chrome DevTools MCP server. Instead, you start a normal Chrome browser with a special `--remote-debugging-port` option, sign in normally, and the import script connects to that browser through Chrome's built-in debugging API (CDP) to read the visible chat page. The extracted chat is saved into `llm-wiki/raw-sources/conversations/`. From there, the main `llm-wiki` workflow can compile the chat into topic pages.

Use these recipes when a specific session or chat contains durable knowledge worth preserving, not as a general transcript backup system.

### Notes

- This is a pure skill package: no CLI, server, database, or Obsidian dependency.
- Wiki files live as markdown, usually under `llm-wiki/` in the project.
- This complements project docs; it does not replace README or user-facing documentation.
- The skill expects `SCHEMA.md`, `index.md`, `log.md`, and `raw-sources/` conventions once a wiki exists.
- For new wikis, let the skill create starter stubs and propose schema choices before ingesting sources.
