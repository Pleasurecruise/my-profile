# Tech Stack

## Core Framework

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.4 |
| TypeScript | 5.x |

## UI & Styling

- **TailwindCSS 4.2.1** — utility-first CSS, configured via CSS variables (no `tailwind.config.ts`)
- **Radix UI** — accessible primitives (Avatar, Dialog, Tabs, Tooltip, Select, etc.)
- **shadcn/ui** — component library built on Radix (New York style)
- **Magic UI** — special effect components (`blur-fade`, `dock`, etc.)
- **Framer Motion 12** / **Motion 12** — animations and page transitions
- **Lucide React** — icon library
- **next-themes** — dark/light theme switching
- **tw-animate-css** — additional Tailwind animation utilities

## Authentication

- **Better Auth 1.5.5** — OAuth + email authentication
- **@better-auth/prisma-adapter** — Prisma integration

## Database & ORM

- **PostgreSQL** — production database
- **Prisma 7.5.0** — ORM and migrations
- **@prisma/adapter-pg** — direct Postgres adapter

## API Layer

- **tRPC 11.13.4** — end-to-end type-safe API (`@trpc/client`, `@trpc/server`, `@trpc/react-query`)
- **TanStack Query 5** — server state management and caching
- **SuperJSON 2** — enhanced JSON serialization
- **Vercel AI SDK 6** (`ai`) — streaming AI responses

## AI Integration

- **OpenAI SDK 6** — chat completions
- **Vercel AI SDK** — streaming UI for chat

## Content (Blog)

- **gray-matter** — MDX frontmatter parsing
- **react-markdown 10** + **harden-react-markdown** — safe Markdown rendering
- **rehype-pretty-code 0.14** + **shiki 4** — syntax highlighting
- **remark-gfm** — GitHub Flavored Markdown
- **remark-math** + **rehype-katex** — LaTeX math rendering
- **unified** — document processing pipeline

## Maps & Visualization

- **Mapbox GL 3.20** — interactive globe in Moments
- **cobe 0.6** — 3D globe WebGL component

## Media & Storage

- **ali-oss** — Alibaba Cloud OSS for image/media uploads

## Email

- **Nodemailer 8** — password reset emails

## Other

- **Embla Carousel** — carousel component
- **rough-notation** — hand-drawn style annotations
- **react-tweet** — embedded tweets
- **react-chrome-dino-ts** — Dino game in terminal
- **sonner** — toast notifications
- **zod 4** — schema validation

## Development Tools

- **pnpm 10** — package manager
- **Turbopack** — Next.js bundler (dev + build)
- **Biome** — linting (`biome`)
- **PostCSS** — CSS processing
- **tsx** — TypeScript script runner

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── _terminal/     # Interactive terminal
│   ├── am-i-ok/       # Real-time activity status
│   ├── api/           # API routes
│   ├── about/
│   ├── blog/
│   ├── chat/
│   ├── cv/
│   └── moment/
├── components/
│   ├── ui/            # shadcn/ui
│   └── magicui/       # Magic UI
├── data/
│   └── resume.tsx     # Portfolio data
├── db/                # Prisma schema + client
├── trpc/              # tRPC router
└── lib/               # Utilities
content/               # Blog MDX posts
scripts/               # macOS LaunchAgent scripts
docs/                  # Documentation
```