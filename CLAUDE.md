# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Vite, React 19, TypeScript, TailwindCSS v4, TanStack Router, and a Hono API server running on **Cloudflare Workers**. Features a blog, AI chat, photo gallery, interactive terminal, real-time activity status, and authentication.

## Package Manager

This project uses **pnpm** with a workspace. Always use `pnpm` commands, never `npm` or `yarn`.

## Development Commands

```bash
pnpm dev       # Cloudflare Workers dev server (wrangler dev + @cloudflare/vite-plugin)
pnpm build     # Production build
pnpm check     # Type check (vp check && tsgo --noEmit)
pnpm lint      # Lint (vite-plus)
pnpm format    # Format (vite-plus)
```

## Architecture

### Core Stack

- **vite-plus** — unified toolchain: dev server, build, lint, format, type-check
- **@cloudflare/vite-plugin** — runs the Hono server in a local Workers runtime during dev
- **Vite** — SPA build (`dist/client/`), output served by the Workers `ASSETS` binding
- **TanStack Router** — file-based client-side routing, auto-generates `src/routeTree.gen.ts`
- **React 19** — SPA (no Server Components)
- **TypeScript 6** + tsgo (TypeScript Go native preview, used in `pnpm check`)
- **TailwindCSS v4** — no `tailwind.config.ts`, configured via CSS variables in `globals.css`
- **Hono** — API server, entry point `server/app.ts` exported as `export default app` (Workers format)
- **Cloudflare Workers** — deployment target; wrangler.toml defines all platform bindings
- **Drizzle ORM + postgres-js** — SQL access to PostgreSQL via Hyperdrive; schema defined in `server/lib/schema.ts`
- **Better Auth 1.6** — authentication (OAuth + email/password); initialized per-request via `getAuth(env)`

### Cloudflare Bindings

Declared in `wrangler.toml`, typed in `server/types/bindings.ts`:

| Binding        | Type       | Purpose                     |
| -------------- | ---------- | --------------------------- |
| `ASSETS`       | Static     | Serves the built SPA        |
| `BLOG_BUCKET`  | R2         | Blog Markdown files storage |
| `HYPERDRIVE`   | Hyperdrive | PostgreSQL connection proxy |
| `KV_NAMESPACE` | KV         | Runtime config values       |

Local dev uses `wrangler.dev.toml` + `.dev.vars`. Remote/prod uses `wrangler.toml`, `KV_NAMESPACE`, and `[[secrets_store_secrets]]` bindings.

All env values are accessed via Workers bindings — **never** `process.env`.

### Workspace Structure

```
.
├── src/                    # Vite SPA (TanStack Router)
├── server/                 # Hono app (Cloudflare Workers entry)
├── types/                  # Shared types (@shared/* alias)
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
│   ├── story.tsx        # Story page data
│   └── travel.tsx       # Travel data
├── lib/                 # Auth client, query client, utils
├── types/               # Frontend-only types (use types/ root for shared types)
└── styles/              # globals.css — design tokens, article/code block CSS
```

### Key Directories (`server/`)

```
server/
├── app.ts               # Hono app — CORS, auth middleware, route registration; default export
├── auth.ts              # Better Auth instance (initialized via getAuth(env))
├── routes/              # API route handlers
│   ├── am-i-ok.ts       # Status push/fetch
│   ├── blog.ts          # Blog content from R2
│   ├── chat.ts          # OpenAI streaming chat
│   ├── gallery.ts       # Photo gallery (Notion)
│   ├── presence.ts      # Real-time presence count
│   └── story.ts         # Story markdown
├── lib/                 # Server-side helpers
│   ├── auth-middleware.ts
│   ├── blog.ts          # R2 fetch + compile
│   ├── db.ts            # Drizzle ORM client (postgres-js + Hyperdrive)
│   ├── email.ts         # Resend email client
│   ├── notion-gallery.ts # Notion API for gallery photos
│   ├── runtime-config.ts # Secret Store + KV + .dev.vars config resolution
│   ├── schema.ts        # Drizzle table definitions (auth tables + am_i_ok_status)
│   └── story.ts         # Story content helper
└── types/               # Server-side type definitions
    ├── auth.ts          # AuthBindings for Hono
    ├── bindings.ts      # Cloudflare Workers bindings interface
    ├── cloudflare.ts    # R2Bucket, Hyperdrive, Assets, KVNamespace, SecretStoreSecret types
    ├── cloudflare-workers.d.ts  # cloudflare:workers module shim
    ├── config.ts        # ResolvedAuthConfig, KvConfigKey, SecretBackedValue types
    └── notion.ts        # Notion API response types
```

### Shared Types (`types/`)

Root-level `types/` directory aliased as `@shared/` in both `vite.config.ts` and `tsconfig.json`. Use for types consumed by both `src/` and `server/`.

```
types/
├── blog.ts      # BlogTreeNode, BlogFileTreeData, BlogPostData
├── gallery.ts   # GalleryPhoto
└── story.ts     # Story types
```

### Data & Content

- **Site data**: `src/data/resume.tsx` — navbar items, skills, projects, social links
- **Blog posts**: Markdown files stored in **Cloudflare R2** (`BLOG_BUCKET`), fetched via `server/lib/blog.ts`
- **Gallery**: Photos sourced from **Notion** database via `server/lib/notion-gallery.ts`
- **Database**: PostgreSQL via **Drizzle ORM** + **Cloudflare Hyperdrive** — auth sessions and Am I OK status

### Special Features

**Interactive Terminal** (`packages/ui/src/terminal/`)

- Slash command system with autocomplete selector
- Supports `/help`, `/skills`, `/social`, `/contact`, `/projects`, `/links`, `/am-i-ok`, `/dino`, `/go`, `/reload`, and easter-egg commands
- Adding a new command: add to `TOP_COMMANDS` + `HELP_TEXT` + `resolveCommand()` in `packages/ui/src/terminal/core/commands.ts`
- For async commands, use `kind: "fetch"` — handled in `terminal.tsx`
- Configured via `TerminalConfig` (routes, personal data injected from the app)

**Blog** (`src/routes/blog/`, `server/lib/blog.ts`, `packages/ui/src/markdown/`)

- Markdown stored in Cloudflare R2, accessed via `c.env.BLOG_BUCKET` (R2Bucket binding)
- `server/lib/blog.ts` uses R2 `list()` and `get()` — no Ali OSS dependency
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

- OpenAI SDK + Vercel AI SDK streaming; model/URL configurable via `OPENAI_MODEL` / `OPENAI_API_URL`

**Email** (`server/lib/email.ts`)

- Transactional email via **Resend** SDK — used for verification and password reset
- `RESEND_API_KEY` and `RESEND_FROM` are Workers secrets

### Linting & Formatting

Uses **vite-plus** built-in lint and format (`pnpm lint` / `pnpm format`). Config lives in `vite.config.ts` under the `lint` and `fmt` keys:

- `lint.ignorePatterns` — excludes `dist/`, `src/generated/`, `src/routeTree.gen.ts`
- `fmt.indent` — tabs
- `fmt.ignorePatterns` — same as lint

Avoid `any` in TypeScript; for unified plugin chains use `Plugin` type cast instead.

### Environment Variables

No `process.env` — all env is accessed via Cloudflare Workers bindings.

- **Local dev**: put secrets in `.dev.vars` (see `.dev.vars.example`); wrangler injects them as `c.env`
- **Production**: platform bindings live in `wrangler.toml`; config comes from `KV_NAMESPACE` and Secret Store bindings
- `server/auth.ts` receives `env: Bindings` per-request via `getAuth(env)`; secrets resolved through `runtime-config.ts` (KV → Secret Store → `.dev.vars`)

Key variables:

- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — auth config
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `RESEND_API_KEY` / `RESEND_FROM` — email via Resend
- `OPENAI_API_KEY` / `OPENAI_API_URL` / `OPENAI_MODEL` — AI chat
- `AM_I_OK_SECRET` — bearer token for status push API
- `NOTION_TOKEN` — Notion API for gallery
- `HYPERDRIVE` (binding) — PostgreSQL proxy connection string
- `BLOG_BUCKET` (R2 binding) — blog Markdown files

## Important Files

| File                                              | Purpose                                               |
| ------------------------------------------------- | ----------------------------------------------------- |
| `src/data/resume.tsx`                             | All personal data, navbar items, projects             |
| `server/app.ts`                                   | Hono app entry — route registration, default export   |
| `server/auth.ts`                                  | Better Auth instance (initialized via `getAuth(env)`) |
| `server/lib/blog.ts`                              | Blog fetch from R2 + compile                          |
| `server/lib/email.ts`                             | Resend transactional email                            |
| `server/lib/notion-gallery.ts`                    | Gallery photos from Notion API                        |
| `server/lib/db.ts`                                | Drizzle ORM client (postgres-js + Hyperdrive)         |
| `server/lib/schema.ts`                            | Drizzle table definitions (auth + am_i_ok_status)     |
| `server/lib/runtime-config.ts`                    | Config resolution: KV → Secret Store → `.dev.vars`    |
| `server/types/bindings.ts`                        | Cloudflare Workers bindings interface                 |
| `types/blog.ts`                                   | Shared blog types (@shared/blog)                      |
| `wrangler.toml`                                   | Cloudflare Workers config (bindings, R2, Hyperdrive)  |
| `.dev.vars.example`                               | Local dev secrets template                            |
| `packages/ui/src/terminal/core/commands.ts`       | Terminal slash commands                               |
| `packages/ui/src/markdown/compiler/index.ts`      | Markdown → MDX compiler (unified pipeline)            |
| `packages/ui/src/markdown/compiler/shiki.ts`      | Shiki highlighter singleton (bundled langs, lazy)     |
| `packages/ui/src/markdown/compiler/rehype-toc.ts` | TOC extraction + heading anchor injection             |
| `server/routes/am-i-ok.ts`                        | Status push/fetch API                                 |
| `scripts/am-i-ok-agent.sh`                        | macOS agent script                                    |
| `src/routes/__root.tsx`                           | Root layout, providers, global UI                     |
| `src/styles/globals.css`                          | Global styles, design tokens, article/code block CSS  |

## License

[AGPL-v3](LICENSE). This project contains code derived from [Taki](https://github.com/canmi21/taki) (AGPL-v3).
