# Tech Stack

This document reflects the stack and architecture currently used in the repository.

## Overview

This project is a `pnpm` workspace built around a Vite SPA + Hono API server deployed on **Cloudflare Workers**, plus a shared local package `@my-profile/ui`.

At runtime it combines:

- a React 19 frontend with Tailwind CSS v4
- a Hono API server running in the Cloudflare Workers runtime
- Better Auth + Drizzle ORM + PostgreSQL (via Cloudflare Hyperdrive) for authentication and persistence
- Cloudflare R2 as the blog content store
- Notion API as the gallery data source
- Resend for transactional email
- OpenAI + Vercel AI SDK for the chat page

## Core Runtime

| Package                   | Version    | Notes                                     |
| ------------------------- | ---------- | ----------------------------------------- |
| `vite-plus`               | `0.1.19`   | Vite-based dev/build/lint/format workflow |
| `@cloudflare/vite-plugin` | `1.33.2`   | Runs Workers runtime locally during dev   |
| `react` / `react-dom`     | `19.2.5`   | React 19 SPA                              |
| `@tanstack/react-router`  | `1.168.25` | File-based client routing                 |
| `hono`                    | `4.12.15`  | API server (Workers-compatible)           |
| `typescript`              | `6.0.3`    | Main language across app and workspace    |
| `pnpm`                    | `10.33.2`  | Workspace package manager                 |

Implementation details:

- `vite.config.ts` wires React, Tailwind, TanStack Router codegen, and the Cloudflare plugin
- local dev runs through `wrangler dev --config wrangler.dev.toml`; production build runs through `vp build`; remote/prod bindings live in `wrangler.toml`
- `server/app.ts` uses `export default app` — the Cloudflare Workers entry format
- `@my-profile/ui` is consumed as a local workspace package

## Frontend & UI

### Styling system

- **Tailwind CSS v4** via `@import "tailwindcss"` in `src/styles/globals.css`
- **`@tailwindcss/vite`** for Vite integration
- **`@tailwindcss/typography`** enabled through the CSS plugin syntax
- **CSS variables design tokens** for colors, radius, theming, and utility mapping
- **`tw-animate-css`** for animation utilities
- No `tailwind.config.ts`; the project uses the Tailwind v4 CSS-first configuration style

### Component stack

- **Radix UI** primitives for accessible low-level components
- **shadcn/ui** (`components.json`, New York style, CSS variables enabled)
- **Magic UI** and **Aceternity UI** registry-based visual components
- **Lucide React** and **Tabler Icons** for iconography
- **Framer Motion** and **Motion** for animation
- **next-themes** for dark/light theme switching in plain React
- **Sonner** for toast notifications

### Typography and global UX

- Fonts are loaded from Google Fonts in `index.html`; current setup: `JetBrains Mono`, `Noto Sans SC`, `Fira Code`
- Global layout includes: themed background overlays, scroll progress indicator, floating terminal, cherry blossom visual effect

## Authentication

Authentication is implemented with **Better Auth 1.6** and stored in PostgreSQL via Drizzle ORM.

Enabled capabilities (`server/auth.ts`):

- email + password sign-up / login
- required email verification (via Resend)
- password reset by email (via Resend)
- GitHub OAuth
- Google OAuth
- session cookies with cookie cache (30 min)

`server/auth.ts` resolves runtime config from Workers bindings and reuses the shared Drizzle connection created from `HYPERDRIVE.connectionString`.

Related packages: `better-auth`, `drizzle-orm`, `postgres`, `resend`

## Database & Persistence

### Stack

- **PostgreSQL**
- **Drizzle ORM** for SQL access
- **`postgres`** connection pooling for PostgreSQL
- **Cloudflare Hyperdrive** — proxies the Postgres connection inside the Workers runtime

Current persisted models: `User`, `Session`, `Account`, `Verification`, `AmIOkStatus`

### Hyperdrive

`HYPERDRIVE` is a Workers binding declared in both `wrangler.toml` and `wrangler.dev.toml`. Better Auth uses `env.HYPERDRIVE.connectionString` through the shared `postgres` + Drizzle helper. Locally, `localConnectionString` points to `postgresql://pleasure1234:123456@localhost:5432/mydb`.

## API Layer

The API is plain **Hono** routes — no tRPC. All routes are registered in `server/app.ts` under `/api/*`.

| Route prefix    | Handler file                | Purpose                    |
| --------------- | --------------------------- | -------------------------- |
| `/api/auth/*`   | `server/auth.ts`            | Better Auth handler        |
| `/api/blog`     | `server/routes/blog.ts`     | Blog content from R2       |
| `/api/chat`     | `server/routes/chat.ts`     | OpenAI streaming chat      |
| `/api/am-i-ok`  | `server/routes/am-i-ok.ts`  | Activity status push/fetch |
| `/api/presence` | `server/routes/presence.ts` | Real-time presence count   |
| `/api/gallery`  | `server/routes/gallery.ts`  | Gallery photos from Notion |
| `/api/story`    | `server/routes/story.ts`    | Story markdown content     |

## AI Integration

The chat feature is built with:

- **OpenAI SDK** `6.34.0`
- **Vercel AI SDK** `6.0.168` (`ai`)

Implementation: responses are streamed; base URL and model are configurable via `OPENAI_API_URL` / `OPENAI_MODEL` secrets.

## Content System

### Blog

Blog content is stored in **Cloudflare R2** (`BLOG_BUCKET` binding). The flow:

1. `server/lib/blog.ts` calls `bucket.list()` to enumerate Markdown files
2. `bucket.get(key)` fetches file content
3. Content is compiled through `@my-profile/ui/markdown` compiler
4. Result (`{ code, frontmatter, toc, excerpt }`) is returned as JSON

### Markdown pipeline

The compiler lives in `packages/ui/src/markdown/compiler` and uses:

- `unified` + `remark-parse`
- `remark-gfm` — GitHub Flavored Markdown
- `remark-frontmatter` — YAML frontmatter extraction
- `@shikijs/rehype/core` — syntax highlighting with dual light/dark themes
- custom `rehypeToc` plugin — TOC extraction + heading anchor links
- `@mdx-js/mdx` — MDX compilation for client hydration

### Gallery

Gallery photos are sourced from a **Notion** database (`server/lib/notion-gallery.ts`). The Notion integration uses `@notionhq/client` and caches results for 50 minutes.

## Email

Transactional email (verification, password reset) is sent via **Resend** (`resend` package). `server/lib/email.ts` wraps the Resend SDK and reads `RESEND_API_KEY` / `RESEND_FROM` from Workers env.

## Maps and External Services

- **`mapbox-gl` `3.22.0`** — map on the story page (patched via `patches/mapbox-gl@3.22.0.patch`)
- **`react-chrome-dino-ts`** — terminal mini-game
- **`rough-notation`** — annotation effects

## Workspace Layout

```text
.
├── docs/                   # Project documentation
├── packages/
│   └── ui/                 # Shared UI package (@my-profile/ui)
│       ├── src/components/ # CherryBlossom, HelloSignature
│       ├── src/footer/     # PresenceCount, SiteAge
│       ├── src/markdown/   # Markdown compiler + BlogContent component
│       └── src/terminal/   # Interactive terminal UI and command system
├── public/                 # Static assets
├── scripts/                # macOS am-i-ok agent
├── server/                 # Hono app (Cloudflare Workers entry)
│   ├── app.ts              # Route registration, default export
│   ├── auth.ts             # Better Auth instance
│   ├── lib/                # Blog, email, gallery, database helpers
│   ├── routes/             # Route handlers
│   └── types/              # Bindings, Cloudflare, Notion types
├── src/                    # Vite SPA (TanStack Router)
│   ├── routes/             # Page components
│   ├── components/         # UI components
│   ├── data/               # Personal data, links, story, travel
│   ├── lib/                # Auth client, query client, utils
│   └── styles/             # globals.css
├── types/                  # Shared types (@shared/* alias)
├── wrangler.toml           # Cloudflare Workers config
└── .dev.vars.example       # Local dev secrets template
```

## Tooling

- **vite-plus** `0.1.19` — unified dev/build/lint/format (wraps Vite + Biome)
- **tsx** — runs TypeScript scripts directly
- **wrangler** `4.85.0` — Cloudflare Workers CLI (deploy, secret management, local dev)
- **vitest** `4.1.5` — test runner
- **tsgo** (`@typescript/native-preview`) — TypeScript Go native type-check preview

Key scripts:

```bash
pnpm dev          # wrangler dev with wrangler.dev.toml
pnpm build        # production build
pnpm check        # vp check && tsgo --noEmit
pnpm lint         # vp lint
pnpm format       # vp fmt
```

## Environment Strategy

All environment values are **Cloudflare Workers bindings** — no `process.env`.

- **Local dev bindings** live in `wrangler.dev.toml`; **remote/prod bindings** live in `wrangler.toml`
- **KV-backed config** is read from `KV_NAMESPACE`, with `.dev.vars` as the local fallback
- **Secret values** are bound through `[[secrets_store_secrets]]` in `wrangler.toml`, with `.dev.vars` as the local fallback
- Server code reads env via `c.env` in Hono handlers and passes bindings through helper functions where needed
- All binding types are defined in `server/types/bindings.ts`
