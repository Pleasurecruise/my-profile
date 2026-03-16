# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 16, React 19, TypeScript, TailwindCSS v4, and tRPC. Features a blog, AI chat, Moments feed, interactive terminal, real-time activity status, and authentication.

## Package Manager

This project uses **pnpm**. Always use `pnpm` commands, never `npm` or `yarn`.

## Development Commands

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Production build (Turbopack)
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Database (Prisma)

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
pnpm db:studio     # Open Prisma Studio
```

## Architecture

### Core Stack
- **Next.js 16** — App Router, Turbopack
- **React 19** — with Server Components
- **TypeScript 5**
- **TailwindCSS v4** — no `tailwind.config.ts` needed for most config, uses CSS variables
- **tRPC 11** — end-to-end type-safe API
- **Prisma 7** — ORM with PostgreSQL
- **Better Auth 1.5** — authentication (OAuth + email)

### Key Directories

```
src/
├── app/               # Next.js App Router
│   ├── _terminal/     # Interactive terminal (commands, types, terminal.tsx)
│   ├── am-i-ok/       # Real-time activity status page
│   ├── api/am-i-ok/   # Status API route (GET/POST)
│   ├── about/         # About page
│   ├── blog/          # Blog (MDX)
│   ├── chat/          # AI chat (OpenAI)
│   ├── moment/        # Moments feed
│   └── cv/            # CV / Resume
├── components/
│   ├── ui/            # shadcn/ui components
│   └── magicui/       # Magic UI components
├── data/
│   └── resume.tsx     # All personal/portfolio data — edit here
├── db/                # Prisma schema and client
├── trpc/              # tRPC router and procedures
└── lib/               # Utility functions
content/               # Blog posts in MDX format
scripts/               # macOS LaunchAgent for am-i-ok status
```

### Data & Content
- **Portfolio data**: `src/data/resume.tsx` — navbar items, skills, projects, social links
- **Blog posts**: MDX files in `content/`
- **Database**: PostgreSQL via Prisma — handles auth sessions, moments, etc.

### Special Features

**Interactive Terminal** (`src/app/_terminal/`)
- Slash command system with autocomplete selector
- Supports `/help`, `/skills`, `/social`, `/contact`, `/projects`, `/links`, `/am-i-ok`, `/dino`, `/go`, and many easter-egg commands
- Adding a new command: add to `TOP_COMMANDS` + `HELP_TEXT` + `resolveCommand()` in `commands.ts`
- For async commands, use `kind: "fetch"` — handled in `terminal.tsx`

**Am I OK** (`src/app/am-i-ok/`, `scripts/`)
- Displays real-time activity: current apps and device
- `scripts/am-i-ok-agent.sh` runs via macOS LaunchAgent, POSTs every 30s
- API stores up to 2 foreground apps; page auto-refreshes every 30s
- App icons from `cdn.simpleicons.org`; dark-mode inversion handled per-icon

**Moments** (`src/app/moment/`)
- Social feed with Mapbox globe visualization

**AI Chat** (`src/app/chat/`)
- OpenAI SDK integration via Vercel AI SDK

### Environment Variables

See `.env.example`. Key variables:
- `DATABASE_URL` / `POSTGRES_URL` — PostgreSQL connection
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — auth config
- `OPENAI_API_KEY` / `OPENAI_API_URL` / `OPENAI_MODEL` — AI chat
- `AM_I_OK_SECRET` — bearer token for status push API
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox for globe
- `ALI_OSS_*` — Alibaba Cloud OSS for media uploads

## Important Files

| File | Purpose |
|------|---------|
| `src/data/resume.tsx` | All personal data, navbar items, projects |
| `src/app/_terminal/commands.ts` | Terminal slash commands |
| `src/app/api/am-i-ok/route.ts` | Status push/fetch API |
| `scripts/am-i-ok-agent.sh` | macOS agent script |
| `src/db/` | Prisma schema and client |
| `src/app/layout.tsx` | Root layout, providers, metadata |