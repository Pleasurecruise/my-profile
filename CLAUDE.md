# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a personal portfolio website built with Next.js 15, featuring a modern tech stack with TypeScript, TailwindCSS, and tRPC. The site includes a blog, chat functionality, authentication, and various interactive UI components.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Database Operations
- `npm run db:generate` - Generate Drizzle database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:push` - Push schema changes to database

## Architecture Overview

### Core Structure
- **Next.js App Router**: Uses the modern app directory structure (`src/app/`)
- **Database**: PostgreSQL with Drizzle ORM, schema defined in `src/db/auth-schema.ts`
- **Authentication**: Better Auth integration with session management
- **API**: tRPC for type-safe API routes (`src/trpc/`)
- **Styling**: TailwindCSS with custom animations and Radix UI components

### Key Directories
- `src/app/` - Next.js app router pages and layouts
- `src/components/` - Reusable React components including shadcn/ui and custom components
- `src/data/resume.tsx` - Personal information and portfolio data
- `src/db/` - Database schema and configuration
- `src/trpc/` - tRPC router definitions and procedures
- `src/lib/` - Utility functions and configurations
- `content/` - Blog posts in MDX format

### Data Management
- Resume/portfolio data is centralized in `src/data/resume.tsx`
- Blog posts are stored as MDX files in `content/` directory
- Database handles user authentication and sessions

### Special Features
- **Chat System**: AI-powered chat functionality (likely OpenAI integration)
- **Blog**: MDX-based blog with syntax highlighting and rich formatting
- **Moments**: Social media-like posts/updates feature
- **Authentication**: OAuth and email-based authentication flows

### Tech Stack Notes
- Uses Turbopack for faster development builds
- Framer Motion for animations and transitions
- React Query integration via tRPC
- TypeScript throughout for type safety
- ESLint with Next.js and TypeScript configurations

### Environment Setup
- Requires PostgreSQL database (configure DATABASE_URL in .env)
- Better Auth configuration needed for authentication flows
- OpenAI API key likely required for chat functionality

## Important Files
- `src/data/resume.tsx` - Update personal information here
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Styling system configuration
- `src/app/layout.tsx` - Root application layout and providers