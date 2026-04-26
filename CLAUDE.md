# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Vite, React 19, TypeScript, TailwindCSS v4, TanStack Router, and a Hono API server. Features a blog, AI chat, photo gallery, interactive terminal, real-time activity status, and authentication.

## Package Manager

This project uses **pnpm** with a workspace. Always use `pnpm` commands, never `npm` or `yarn`.

## Development Commands

```bash
pnpm dev       # Vite dev server (vite-plus)
pnpm build     # Production build (prisma generate + vp build)
pnpm start     # Start production server (tsx server/index.ts)
pnpm check     # Type check (vp check && tsgo --noEmit)
pnpm lint      # Biome lint (--error-on-warnings)
pnpm format    # Biome format
```

### Database (Prisma)

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
pnpm db:studio     # Open Prisma Studio
```

## Architecture

### Core Stack

- **vite-plus** — unified toolchain: dev server, build, lint, format, type-check
- **Vite** — SPA build with `@tailwindcss/vite` and `@hono/vite-dev-server`
- **TanStack Router** — file-based client-side routing, auto-generates `src/routeTree.gen.ts`
- **React 19** — SPA (no Server Components)
- **TypeScript 6** + tsgo (TypeScript Go native preview, used in `pnpm check`)
- **TailwindCSS v4** — no `tailwind.config.ts`, configured via CSS variables in `globals.css`
- **Hono** — API server, served via `@hono/node-server`
- **Prisma 7** — ORM with PostgreSQL
- **Better Auth 1.6** — authentication (OAuth + email/password)

### Workspace Structure

```
.
├── src/                    # Vite SPA (TanStack Router)
├── server/                 # Hono API server
└── packages/
    └── ui/                 # Shared UI package (@my-profile/ui)
        └── src/
            ├── components/ # CherryBlossom, HelloSignature
            ├── footer/     # PresenceCount, SiteAge
            ├── terminal/   # Interactive terminal
            └── markdown/   # Blog compiler + BlogContent component
```

### Key Directories (`src/`)

```
src/
├── routes/
│   ├── __root.tsx       # Root layout (Navbar, FloatingTerminal, CherryBlossom)
│   ├── index.tsx        # Home
│   ├── blog/            # Blog listing + post pages
│   ├── chat.tsx         # AI chat (OpenAI via Vercel AI SDK)
│   ├── cv.tsx           # CV / Resume
│   ├── gallery.tsx      # Photo gallery
│   ├── story.tsx        # Personal story page
│   ├── am-i-ok.tsx      # Real-time activity status
│   ├── _auth/           # Auth pages (login, signup)
│   └── password/        # Password reset
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── magicui/         # Magic UI components
│   ├── aceternityui/    # Aceternity UI components
│   ├── layout/          # Navbar, FloatingTerminal, ThemeProvider
│   ├── blog/            # Blog-specific components (FileTree, Toc, etc.)
│   ├── chat/            # AI chat components
│   └── cv/              # CV section components
├── data/
│   ├── resume.tsx       # All personal data — edit here
│   ├── links.tsx        # External links
│   └── travel.tsx       # Travel data
├── lib/                 # Auth client, query client, utils
├── types/               # Shared TypeScript types
└── styles/              # globals.css — design tokens, article/code block CSS
```

### Key Directories (`server/`)

```
server/
├── app.ts               # Hono app — CORS, auth middleware, route registration
├── auth.ts              # Better Auth instance
├── index.ts             # Node.js entry point; serves SPA dist in production
├── routes/              # API route handlers
│   ├── am-i-ok.ts       # Status push/fetch
│   ├── blog.ts          # Blog content from Ali OSS
│   ├── chat.ts          # OpenAI streaming chat
│   ├── gallery.ts       # Photo gallery (Notion)
│   ├── presence.ts      # Real-time presence count
│   └── story.ts         # Story markdown
└── lib/                 # Server-side helpers
    ├── ali-oss.ts        # Alibaba Cloud OSS client
    ├── blog.ts           # Blog fetch + compile
    ├── prisma.ts         # Prisma client singleton
    ├── env.ts            # Server environment variables (t3-oss/env-core)
    └── auth-middleware.ts
```

### Data & Content

- **Site data**: `src/data/resume.tsx` — navbar items, skills, projects, social links
- **Blog posts**: Markdown files stored in Alibaba Cloud OSS, fetched via `server/lib/blog.ts`
- **Database**: PostgreSQL via Prisma — handles auth sessions, etc.

### Special Features

**Interactive Terminal** (`packages/ui/src/terminal/`)

- Slash command system with autocomplete selector
- Supports `/help`, `/skills`, `/social`, `/contact`, `/projects`, `/links`, `/am-i-ok`, `/dino`, `/go`, `/reload`, and easter-egg commands
- Adding a new command: add to `TOP_COMMANDS` + `HELP_TEXT` + `resolveCommand()` in `packages/ui/src/terminal/core/commands.ts`
- For async commands, use `kind: "fetch"` — handled in `terminal.tsx`
- Configured via `TerminalConfig` (routes, personal data injected from the app)

**Blog** (`src/routes/blog/`, `server/lib/blog.ts`, `packages/ui/src/markdown/`)

- Markdown content stored in Ali OSS, fetched server-side in `server/lib/blog.ts`
- Compiled by `packages/ui/src/markdown/compiler/` using a unified/MDX pipeline:
  - `remark-gfm` — GitHub Flavored Markdown
  - `remark-frontmatter` — YAML frontmatter extraction
  - `@shikijs/rehype/core` — syntax highlighting with dual light/dark themes (lazy language loading)
  - `rehypeToc` — heading anchor links + TOC extraction
- `defaultLanguage: "text"` and `fallbackLanguage: "text"` ensure code blocks with no/unknown language render as plain text
- Returns `CompileRawResult`: `{ code, frontmatter, toc, excerpt }`
- `BlogContent` component hydrates the compiled MDX code client-side

**Am I OK** (`src/routes/am-i-ok.tsx`, `server/routes/am-i-ok.ts`, `scripts/`)

- Displays real-time activity: current apps and device
- `scripts/am-i-ok-agent.sh` runs via macOS LaunchAgent, POSTs every 30s
- API stores up to 2 foreground apps; page auto-refreshes every 30s
- App icons from `cdn.simpleicons.org`; dark-mode inversion handled per-icon

**AI Chat** (`src/routes/chat.tsx`, `server/routes/chat.ts`)

- OpenAI SDK integration via Vercel AI SDK streaming

### Linting & Formatting

Uses **vite-plus** built-in lint and format (`pnpm lint` / `pnpm format`). Config lives in `vite.config.ts` under the `lint` and `fmt` keys:

- `lint.ignorePatterns` — excludes `dist/`, `src/generated/`, `src/routeTree.gen.ts`
- `fmt.indent` — tabs
- `fmt.ignorePatterns` — same as lint

Avoid `any` in TypeScript; for unified plugin chains use `Plugin` type cast instead.

### Environment Variables

See `.env.example`. Key variables:

- `DATABASE_URL` / `POSTGRES_URL` / `PRISMA_DATABASE_URL` — PostgreSQL connection
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — auth config
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `MAIL_HOST` / `MAIL_PORT` / `MAIL_AUTH_USER` / `MAIL_AUTH_PASS` — email for auth
- `OPENAI_API_KEY` / `OPENAI_API_URL` / `OPENAI_MODEL` — AI chat
- `AM_I_OK_SECRET` — bearer token for status push API
- `VITE_MAPBOX_TOKEN` — Mapbox for gallery globe
- `ALI_OSS_*` — Alibaba Cloud OSS for blog storage

## Important Files

| File                                              | Purpose                                              |
| ------------------------------------------------- | ---------------------------------------------------- |
| `src/data/resume.tsx`                             | All personal data, navbar items, projects            |
| `server/lib/blog.ts`                              | Blog post fetching from Ali OSS + compile call       |
| `server/app.ts`                                   | Hono app entry — route registration                  |
| `packages/ui/src/terminal/core/commands.ts`       | Terminal slash commands                              |
| `packages/ui/src/markdown/compiler/index.ts`      | Markdown → MDX compiler (unified pipeline)           |
| `packages/ui/src/markdown/compiler/shiki.ts`      | Shiki highlighter singleton (bundled langs, lazy)    |
| `packages/ui/src/markdown/compiler/rehype-toc.ts` | TOC extraction + heading anchor injection            |
| `server/routes/am-i-ok.ts`                        | Status push/fetch API                                |
| `scripts/am-i-ok-agent.sh`                        | macOS agent script                                   |
| `src/routes/__root.tsx`                           | Root layout, providers, global UI                    |
| `src/styles/globals.css`                          | Global styles, design tokens, article/code block CSS |

## License

[AGPL-v3](LICENSE). This project contains code derived from [Taki](https://github.com/canmi21/taki) (AGPL-v3).
