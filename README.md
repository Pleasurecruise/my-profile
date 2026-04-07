# my-profile

Personal website — [yiming1234.cn](https://yiming1234.cn)

## Stack

Next.js 16 · React 19 · TypeScript · TailwindCSS v4 · tRPC · Prisma · PostgreSQL · Better Auth

## Features

- **Home** — landing page with animated background
- **Blog** — Markdown fetched from Alibaba Cloud OSS, compiled server-side with Shiki syntax highlighting and TOC generation
- **Chat** — AI assistant powered by OpenAI via Vercel AI SDK
- **Moments** — personal feed with Mapbox globe visualization
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **Am I OK** — real-time activity status pushed from macOS every 30s
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

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret key |
| `OPENAI_API_KEY` | AI chat |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Globe visualization |
| `AM_I_OK_SECRET` | Status push API token |
| `ALI_OSS_*` | Alibaba Cloud OSS for blog storage |

## Commands

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm lint         # Biome lint
pnpm db:studio    # Prisma Studio
```

## Am I OK Agent

`scripts/am-i-ok-agent.sh` runs as a macOS LaunchAgent, POSTing current app activity every 30s:

```bash
# 1. Edit the plist: set script path, AM_I_OK_SECRET, BETTER_AUTH_URL
cp scripts/cn.yiming1234.am-i-ok.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/cn.yiming1234.am-i-ok.plist
```

## Workspace

The repo is a pnpm workspace. Shared UI components live in `packages/ui`:

```
packages/ui/src/
├── components/      # CherryBlossom, HelloSignature
├── terminal/        # Interactive terminal (logic + components)
└── markdown/        # Blog compiler (Shiki, TOC, directives) + BlogContent
```