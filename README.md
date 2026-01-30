# OpenCode Sidecar Stack

A DevContainer setup that separates your coding environment from your AI agent using a sidecar pattern.

## Architecture

```
┌──────────────────────────────────────────────┐
│              Docker Compose                  │
│  ┌─────────┐          ┌────────────────┐     │
│  │   app   │◀────────▶│     agent      │     │
│  │(VS Code)│          │   (OpenCode)   │     │
│  └────┬────┘          └───────┬────────┘     │
│       └──────────┬────────────┘              │
│           ┌──────▼──────┐                    │
│           │    /app     │                    │
│           └─────────────┘                    │
└──────────────────────────────────────────────┘
```

## Quick Start

```bash
cp .env.example .env                          # Add your API key
docker compose up -d                          # Start app container
docker compose --profile ai up -d             # Start agent (optional)
docker compose exec -it agent opencode        # Run OpenCode agent
```

## Configuration

Just add your API key for Opencode to `.env`.


## Pre-built Image

To skip building the agent image locally, comment out the `build` section and use a pre-built image instead.

Edit `docker-compose.yml`:
```yaml
agent:
  # build: ...
  image: ${AGENT_IMAGE:-ghcr.io/your-org/agent-opencode:latest}
```

## Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start app container |
| `docker compose --profile ai up -d` | Start with agent |
| `docker compose down` | Stop containers |
| `docker compose exec -it agent opencode` | Interactive OpenCode |
| `docker compose logs agent` | View agent logs |
| `docker compose restart agent` | Restart after config change |

## Files Structure

```
opencode-stack/
├── .devcontainer/
│   └── devcontainer.json       # VS Code integration
├── test-app/
│   └── Dockerfile              # Minimal test container
├── app/
│   └── ...                     # Shared workspace
├── agent.Dockerfile            # Agent image definition
├── docker-compose.yml          # Container orchestration
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

