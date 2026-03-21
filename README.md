# my-profile

Personal website — [yiming1234.cn](https://yiming1234.cn)

## Stack

Next.js 16 · React 19 · TypeScript · TailwindCSS v4 · tRPC · Prisma · PostgreSQL · Better Auth

## Features

- **Home** — landing page with Vanta animated cloud background
- **Blog** — MDX with syntax highlighting and math rendering
- **Chat** — AI assistant powered by OpenAI
- **Moments** — personal feed with Mapbox globe
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **Am I OK** — real-time activity status pushed from macOS
- **CV** — resume page with work, projects, and hackathons
- **Story** — personal story page with interactive map
- **llms.txt** — LLM-friendly site summary at `/llms.txt`

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in required values
pnpm db:push
pnpm dev
```

## Environment

See `.env.example` for all required variables. Key ones:

| Variable | Purpose                            |
|----------|------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string       |
| `BETTER_AUTH_SECRET` | Auth secret key                    |
| `OPENAI_API_KEY` | AI chat                            |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Globe visualization                |
| `AM_I_OK_SECRET` | Status push API token              |
| `ALI_OSS_*` | Alibaba Cloud OSS for blog uploads |

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # ESLint
pnpm db:studio    # Prisma Studio
```

The `scripts/am-i-ok-agent.sh` runs as a macOS LaunchAgent to push current app activity every 30s. To install:

```bash
# 1. Edit the plist: set script path, AM_I_OK_SECRET, BETTER_AUTH_URL
# 2. Load the agent
cp scripts/cn.yiming1234.am-i-ok.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/cn.yiming1234.am-i-ok.plist
```