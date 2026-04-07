# Tech Stack

This document reflects the stack and architecture currently used in the repository, not a generic personal-site template.

## Overview

This project is a `pnpm` workspace built around a Next.js 16 App Router application plus a shared local package, `@my-profile/ui`.

At runtime it combines:

- a React 19 frontend with Tailwind CSS v4
- a type-safe API layer built with tRPC
- Better Auth + Prisma + PostgreSQL for authentication and persistence
- Alibaba Cloud OSS as the blog content source
- OpenAI + Vercel AI SDK for the chat page

## Core Runtime

| Package | Version | Notes |
|---------|---------|-------|
| `next` | `16.2.2` | App Router, Route Handlers, metadata routes |
| `react` / `react-dom` | `19.2.4` | React 19 app |
| `typescript` | `6.0.2` | Main language across app and workspace package |
| `pnpm` | `10.33.0` | Workspace package manager |

Implementation details:

- `next.config.ts` enables `reactCompiler: true`
- dev and build both use Turbopack via `next dev --turbopack` and `next build --turbopack`
- `@my-profile/ui` is transpiled through `transpilePackages`

## Frontend & UI

### Styling system

- **Tailwind CSS 4.2.2** via `@import "tailwindcss"` in `src/styles/globals.css`
- **`@tailwindcss/postcss`** for PostCSS integration
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
- **next-themes** for dark/light theme switching
- **Sonner** for toast notifications

### Typography and global UX

- Fonts are loaded with `next/font/google`
- Current font setup:
  - `JetBrains Mono` (aliased as the main sans variable)
  - `Noto Sans SC`
  - `Fira Code`
- Global layout includes:
  - themed background overlays
  - scroll progress indicator
  - floating terminal entry point
  - cherry blossom visual effect from `@my-profile/ui`

## Authentication

Authentication is implemented with **Better Auth 1.6.0** and stored in PostgreSQL via Prisma.

Enabled auth capabilities in `src/server/auth.ts`:

- email + password sign-up/login
- required email verification
- password reset by email
- GitHub OAuth
- Google OAuth
- Next.js cookie integration through `nextCookies()`

Related packages:

- `better-auth`
- `@better-auth/prisma-adapter`
- `nodemailer`

Email flows use SMTP credentials validated in `src/lib/env.ts` and sent through `src/server/email.ts`.

## Database & Persistence

### Primary database stack

- **PostgreSQL**
- **Prisma 7.7.0**
- **`@prisma/adapter-pg`** with direct Postgres adapter usage

### Prisma setup

- schema file: `prisma/schema.prisma`
- generated client output: `src/generated/prisma`
- root client wrapper: `src/server/prisma.ts`

Current persisted models:

- `User`
- `Session`
- `Account`
- `Verification`
- `AmIOkStatus`

The schema is focused on auth/session data plus one app-specific table for live status updates.

## API Layer

### tRPC stack

- `@trpc/server` `11.16.0`
- `@trpc/client` `11.16.0`
- `@trpc/react-query` `11.16.0`
- `@tanstack/react-query` `5.96.2`
- `superjson` `2.2.6`
- `zod` `4.3.6`

The app uses:

- server-side callers for React Server Components
- a React client provider for client components
- `publicProcedure` and `protectedProcedure`
- Zod-validated inputs and formatted validation errors

Current top-level routers:

- `welcome`
- `chat`

### Route Handlers

The app also exposes Route Handlers under `src/app`, including:

- `/api/auth/[...all]` for Better Auth
- `/api/trpc/[trpc]` for tRPC
- `/api/am-i-ok` for live device/app status updates
- `/feed.xml`
- `/llms.txt`
- Open Graph image routes

## AI Integration

The chat feature is built with:

- **OpenAI SDK 6.33.0**
- **Vercel AI SDK 6.0.151** (`ai`)

Implementation notes:

- OpenAI client is created in `src/server/api/routers/chat.ts`
- base URL is configurable through `OPENAI_API_URL`
- model is configurable through `OPENAI_MODEL`
- responses are streamed
- chat access is protected with `protectedProcedure`
- the current implementation keeps short-lived in-memory message state for resumable streaming

## Content System

### Blog source and compilation

The blog is not stored as local MDX pages inside `src/app`.

Instead, blog content is:

1. listed from **Alibaba Cloud OSS**
2. fetched in `src/server/blog.ts`
3. compiled through the shared `@my-profile/ui` markdown compiler
4. rendered as HTML in the blog route

### Markdown pipeline

The compiler lives in `packages/ui/src/markdown/compiler` and uses:

- `unified`
- `remark-parse`
- `remark-gfm`
- `remark-frontmatter`
- `remark-directive`
- `remark-rehype`
- `rehype-stringify`
- `@shikijs/rehype`
- `shiki`
- `yaml`

What the pipeline extracts or generates:

- YAML frontmatter
- table of contents
- custom directive/component metadata
- syntax-highlighted HTML

### Generated content endpoints

- `/feed.xml` builds an RSS feed from the OSS-backed blog posts
- `/llms.txt` exposes a plain-text summary for LLM consumption

## Maps, Media, and External Services

- **`mapbox-gl` `3.20.0`** for map-based experiences
- **`cobe` `2.0.1`** for globe rendering
- **`ali-oss` `6.23.0`** for blog/media storage access
- **`react-tweet`** for embedded tweets
- **`embla-carousel-react`** for carousel UI
- **`react-chrome-dino-ts`** for the terminal mini-game
- **`rough-notation`** for annotation effects

Note:

- `mapbox-gl@3.20.0` is patched locally through `patches/mapbox-gl@3.20.0.patch`
- `ali-oss` is listed in `serverExternalPackages`

## Workspace Layout

```text
.
├── docs/                   # Project documentation
├── packages/
│   └── ui/                 # Shared UI package used by the app
│       ├── src/components/ # Shared visual components
│       ├── src/markdown/   # Markdown compiler and blog rendering helpers
│       └── src/terminal/   # Reusable terminal UI and command system
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── scripts/                # Local automation scripts (including am-i-ok agent)
├── src/
│   ├── app/                # Next.js App Router pages and route handlers
│   │   ├── (auth)/         # Login and signup pages
│   │   ├── api/            # Better Auth, tRPC, am-i-ok endpoints
│   │   ├── am-i-ok/
│   │   ├── blog/
│   │   ├── chat/
│   │   ├── cv/
│   │   ├── gallery/
│   │   ├── moment/
│   │   ├── password/
│   │   └── story/
│   ├── components/         # App-level components and UI wrappers
│   ├── data/               # Resume, links, travel, gallery, moments data
│   ├── lib/                # Env validation and shared utilities
│   ├── server/             # Auth, Prisma, mail, OSS, blog services
│   └── trpc/               # tRPC React and RSC integration
└── content/                # Additional local content files
```

## Tooling

- **Biome 2.4.10** for formatting and linting
- **PostCSS** for CSS processing
- **tsx** for running TypeScript scripts
- **Vercel** deployment config in `vercel.json`

Key package scripts:

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm format`
- `pnpm check`
- `pnpm db:generate`
- `pnpm db:push`
- `pnpm db:studio`

## Environment Strategy

Environment variables are parsed centrally with **Zod** in `src/lib/env.ts`.

That validation covers:

- database access
- auth secrets and callback base URL
- GitHub / Google OAuth credentials
- SMTP mail configuration
- OpenAI API configuration
- Alibaba Cloud OSS credentials
- the `am-i-ok` shared secret

This means misconfigured runtime values fail fast during startup instead of surfacing later as partial runtime errors.
