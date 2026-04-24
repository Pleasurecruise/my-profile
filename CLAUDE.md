# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Next.js 16, React 19, TypeScript, TailwindCSS v4, and tRPC. Features a blog, AI chat, Moments feed, photo gallery, interactive terminal, real-time activity status, and authentication.

## Package Manager

This project uses **pnpm** with a workspace. Always use `pnpm` commands, never `npm` or `yarn`.

## Development Commands

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Production build (Turbopack)
pnpm start      # Start production server
pnpm lint       # Biome lint (--error-on-warnings)
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
- **React 19** — with Server Components and React Compiler
- **TypeScript 6**
- **TailwindCSS v4** — no `tailwind.config.ts`, configured via CSS variables in `globals.css`
- **tRPC 11** — end-to-end type-safe API
- **Prisma 7** — ORM with PostgreSQL
- **Better Auth 1.6** — authentication (OAuth + email/password)
- **Biome** — linter (replaces ESLint)

### Workspace Structure

```
.
├── src/                    # Main Next.js app
└── packages/
    └── ui/                 # Shared UI package (@my-profile/ui)
        └── src/
            ├── components/ # CherryBlossom, HelloSignature
            ├── terminal/   # Interactive terminal
            └── markdown/   # Blog compiler + BlogContent component
```

### Key Directories (`src/`)

```
src/
├── app/
│   ├── (auth)/        # Auth pages (login, signup, password reset)
│   ├── am-i-ok/       # Real-time activity status page
│   ├── api/am-i-ok/   # Status API route (GET/POST)
│   ├── blog/          # Blog pages — content fetched from Ali OSS
│   ├── chat/          # AI chat (OpenAI via Vercel AI SDK)
│   ├── cv/            # CV / Resume
│   ├── gallery/       # Photo gallery
│   ├── moment/        # Moments feed
│   └── story/         # Personal story page
├── components/
│   ├── ui/            # shadcn/ui components
│   └── magicui/       # Magic UI components
├── data/
│   └── resume.tsx     # All personal data — edit here
├── db/                # Prisma schema and client
├── server/            # Server-side helpers (blog.ts, ali-oss.ts)
├── trpc/              # tRPC router and procedures
└── lib/               # Utility functions
scripts/               # macOS LaunchAgent for am-i-ok status
```

### Data & Content
- **Site data**: `src/data/resume.tsx` — navbar items, skills, projects, social links
- **Blog posts**: Markdown files stored in Alibaba Cloud OSS, fetched at request time
- **Database**: PostgreSQL via Prisma — handles auth sessions, moments, etc.

### Special Features

**Interactive Terminal** (`packages/ui/src/terminal/`)
- Slash command system with autocomplete selector
- Supports `/help`, `/skills`, `/social`, `/contact`, `/projects`, `/links`, `/am-i-ok`, `/dino`, `/go`, `/reload`, and easter-egg commands
- Adding a new command: add to `TOP_COMMANDS` + `HELP_TEXT` + `resolveCommand()` in `packages/ui/src/terminal/core/commands.ts`
- For async commands, use `kind: "fetch"` — handled in `terminal.tsx`
- Configured via `TerminalConfig` (routes, personal data injected from the app)

**Blog** (`src/app/blog/`, `src/server/blog.ts`, `packages/ui/src/markdown/`)
- Markdown content stored in Ali OSS, fetched server-side in `getBlogPost()`
- Compiled by `packages/ui/src/markdown/compiler/` using a unified pipeline:
  - `remark-gfm` — GitHub Flavored Markdown
  - `remark-frontmatter` — YAML frontmatter extraction
  - `remark-directive` — custom leaf directives (`::image`, `::video`, etc.)
  - `@shikijs/rehype/core` — syntax highlighting with dual light/dark themes (lazy language loading via `bundledLanguages`)
  - `rehypeToc` — heading anchor links + TOC extraction
- `defaultLanguage: "text"` and `fallbackLanguage: "text"` ensure code blocks with no/unknown language render as plain text (not blank)
- Returns `CompileResult`: `{ html, frontmatter, toc, components }`
- `BlogContent` component (`"use client"`) renders the HTML and wraps tables in scrollable containers

**Am I OK** (`src/app/am-i-ok/`, `scripts/`)
- Displays real-time activity: current apps and device
- `scripts/am-i-ok-agent.sh` runs via macOS LaunchAgent, POSTs every 30s
- API stores up to 2 foreground apps; page auto-refreshes every 30s
- App icons from `cdn.simpleicons.org`; dark-mode inversion handled per-icon

**Moments** (`src/app/moment/`)
- Social feed with Mapbox globe visualization

**AI Chat** (`src/app/chat/`)
- OpenAI SDK integration via Vercel AI SDK streaming

### Linting

Uses **Biome** (`pnpm lint`). Key rules in effect:
- `noExplicitAny` — avoid `any`; for unified plugin chains use `Plugin` type cast instead
- `noImportantStyles` — CSS `!important` requires `/* biome-ignore */` comment with justification
- `noDescendingSpecificity` — CSS selectors must go from lower to higher specificity in file order

### Environment Variables

See `.env.example`. Key variables:
- `DATABASE_URL` / `POSTGRES_URL` — PostgreSQL connection
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — auth config
- `OPENAI_API_KEY` / `OPENAI_API_URL` / `OPENAI_MODEL` — AI chat
- `AM_I_OK_SECRET` — bearer token for status push API
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox for globe
- `ALI_OSS_*` — Alibaba Cloud OSS for blog storage

## Important Files

| File | Purpose |
|------|---------|
| `src/data/resume.tsx` | All personal data, navbar items, projects |
| `src/server/blog.ts` | Blog post fetching from Ali OSS + compile() call |
| `packages/ui/src/terminal/core/commands.ts` | Terminal slash commands |
| `packages/ui/src/markdown/compiler/index.ts` | Markdown → HTML compiler (unified pipeline) |
| `packages/ui/src/markdown/compiler/shiki.ts` | Shiki highlighter singleton (bundled langs, lazy) |
| `packages/ui/src/markdown/compiler/rehype-toc.ts` | TOC extraction + heading anchor injection |
| `src/app/api/am-i-ok/route.ts` | Status push/fetch API |
| `scripts/am-i-ok-agent.sh` | macOS agent script |
| `src/db/` | Prisma schema and client |
| `src/app/layout.tsx` | Root layout, providers, metadata |
| `src/styles/globals.css` | Global styles, design tokens, article/code block CSS |

## License

[AGPL-v3](LICENSE). This project contains code derived from [Taki](https://github.com/canmi21/taki) (AGPL-v3).