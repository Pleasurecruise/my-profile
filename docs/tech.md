# Tech Stack

## 🎯 Core Framework
- **Next.js 15.5.2**
- **React 18.3.1**
- **TypeScript 5**

## 🎨 UI Design & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitive components
  - React Avatar, Dialog, Tabs, Tooltip and more components
- **Shadcn UI** - Design system based on Radix UI with New York style
- **Magic UI** - Special effect components
- **Lucide React** - Modern icon library
- **Framer Motion** - High-performance animation library for page animations
- **next-themes** - Dark/light theme switching

## 🔐 Authentication & Authorization
- **Better Auth 1.3.7**
- **NextJS Cookies** - Better Auth adapter for Next.js

## 📊 Database & ORM
- **PostgreSQL** - Production-grade relational database
- **Drizzle ORM 0.44.5** - Lightweight TypeScript ORM
- **Drizzle Kit** - Database migration and management tools
- **Database Schema**:
  - user: User information table
  - session: Session management table
  - account: Third-party account linking table
  - verification: Email verification table

## 🌐 API & Communication
- **tRPC 11.5.0** - End-to-end type-safe API solution
  - @trpc/client - Client-side
  - @trpc/server - Server-side
  - @trpc/react-query - React Query integration
- **React Query** - Server state management and caching
- **SuperJSON** - Enhanced JSON serialization

## 📧 Email Service
- **Nodemailer** - Email sending service for password reset functionality

## 🤖 AI Integration
- **OpenAI SDK** - OpenAI API integration capabilities

## 📝 Content Management
- **Gray Matter** - Markdown file frontmatter parsing
- **React Markdown** - Markdown rendering component
- **Remark/Rehype Ecosystem**:
  - remark-gfm: GitHub Flavored Markdown support
  - rehype-pretty-code: Code syntax highlighting
  - shiki: Code highlighting engine
- **Unified** - Document processing pipeline

## 🛠️ Development Tools
- **ESLint 9** - Code quality linting
- **PostCSS** - CSS post-processor
- **TSX** - TypeScript executor
- **dotenv** - Environment variable management

## 📦 Package Management & Build
- **npm** - Package manager
- **Turbopack** - Next.js next-generation bundler
- **Type Definitions**: Complete TypeScript type support

## 🔧 Configuration Files
- `next.config.ts` - Next.js configuration with GitHub avatar domain support
- `tailwind.config.ts` - Tailwind custom configuration
- `drizzle.config.ts` - Database configuration
- `components.json` - Shadcn/ui configuration
- `tsconfig.json` - TypeScript compilation configuration

## 📂 Project Structure
```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
│   ├── ui/       # Shadcn UI components
│   └── magicui/  # Magic UI components
├── lib/          # Utility functions and configurations
├── db/           # Database schema and connections
├── server/       # API routes
├── trpc/         # tRPC configuration
└── styles/       # Style files
```