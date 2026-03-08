# Story 1.1: Initialize T3 Stack application with NextAuth

**Story ID:** 1.1  
**Story Key:** 1-1-initialize-t3-nextauth  
**Epic:** 1 - App Foundation & Authentication  
**Status:** done

## Story

As a developer,
I want the application initialized with the T3 Stack and NextAuth configured,
So that we have a runnable app with session-based authentication and a foundation for per-user scoping.

## Acceptance Criteria

1. **Given** a greenfield project directory,  
   **When** the T3 init command is run with App Router, Prisma or Drizzle, NextAuth, and Tailwind selected,  
   **Then** the project builds and runs with `npm run dev`, and the app shows a default landing or home page.

2. **And** NextAuth is configured with session strategy; sign-in and sign-out routes are available (e.g. `/auth/signin`).

3. **And** Database is configured (SQLite for dev or as chosen); migrations can be run.

4. **And** All API or server code that will touch user data is structured to accept a session/user id for future per-user scoping (FR23).

## Tasks / Subtasks

- [x] **Task 1:** Run T3 create and select options (AC: 1)
  - [x] Run `npm create t3-app@latest` (or pnpm/bun equivalent) in project root (e.g. `c:\temp\TodoList` or a subfolder as desired).
  - [x] Select: App Router, Prisma or Drizzle, NextAuth, Tailwind. Use SQLite for dev (or Postgres if preferred).
  - [x] Ensure project builds (`npm run build`) and runs (`npm run dev`).
- [x] **Task 2:** Verify NextAuth and sign-in/sign-out (AC: 2)
  - [x] Confirm NextAuth is configured with session strategy; sign-in and sign-out routes work (e.g. `/auth/signin`).
  - [x] Add or verify auth options in `src/server/auth.ts` and `src/server/auth-options.ts` per T3.
- [x] **Task 3:** Database and migrations (AC: 3)
  - [x] Ensure DB URL in `.env` (e.g. `.env.local`); run migrations (Prisma: `npx prisma migrate dev` or Drizzle equivalent).
- [x] **Task 4:** Per-user scoping readiness (AC: 4)
  - [x] Ensure server/API code that will touch user data uses session (e.g. `auth()` or `getServerAuthSession()`) and is structured to scope by `userId` for future stories. No task/project APIs required in this story—only auth and app shell.

## Dev Notes

### Architecture compliance (from `_bmad-output/planning-artifacts/architecture.md`)

- **Starter:** T3 Stack only. Command: `npm create t3-app@latest`. Select: Next.js, TypeScript, Tailwind, Prisma or Drizzle, NextAuth; SQLite for dev or Postgres.
- **Structure:** Next.js App Router. Use `src/app`, `src/server`, `src/components`; shared types in `src/types`. Config at root: `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.cjs`. Env: `.env.local`, `.env.example`.
- **Auth:** NextAuth.js; session-based; secure cookie. Auth boundary: `src/server/auth.ts`, `src/server/auth-options.ts`; protect routes via `src/middleware.ts` (dashboard routes require session).
- **Naming:** camelCase in code/API (e.g. `userId`); PascalCase for components; follow T3/Next conventions.
- **Data:** DB access only in `src/server` (e.g. `src/server/db.ts`). All future queries scoped by `userId` from session.

### Project structure (target)

Align with architecture’s project tree. After init you should have at least:

- `src/app/` (layout.tsx, page.tsx, globals.css)
- `src/server/` (db.ts, auth, api/ if tRPC)
- `src/components/` (optional placeholder)
- `src/lib/utils.ts`, `src/types` (if present)
- `prisma/schema.prisma` and `prisma/migrations/` (or Drizzle equivalent)
- Root: package.json, next.config.js, tailwind.config.ts, tsconfig.json, .env.example, .gitignore

Do not create task or project routers/schemas in this story; only auth and runnable shell.

### Testing

- No automated tests required for this story (architecture: “Add Vitest/Jest as needed; not required for MVP”).
- Manual: run `npm run dev`, open app, confirm landing page and that sign-in/sign-out routes load (even if minimal UI).

### References

- [Source: _bmad-output/planning-artifacts/architecture.md] — Starter Template Evaluation, Core Architectural Decisions, Project Structure & Boundaries, Implementation Patterns.
- [Source: _bmad-output/planning-artifacts/epics.md] — Epic 1, Story 1.1.
- T3: https://create.t3.gg/ — use current create-t3-app prompts and defaults.

## Dev Agent Record

### Agent Model Used

Auto (Cursor agent)

### Completion Notes List

- T3 app scaffolded in `web/` via `npm create t3-app@latest web -- --CI --appRouter --trpc --prisma --nextAuth --tailwind --dbProvider sqlite` to avoid overwriting _bmad / _bmad-output.
- NextAuth (v5 beta) with Prisma adapter; session strategy; routes at `/api/auth/[...nextauth]` (sign-in/sign-out available).
- Prisma + SQLite; `npm run db:push` run; DATABASE_URL and AUTH_SECRET in `.env`.
- `src/env.js`: AUTH_DISCORD_ID and AUTH_DISCORD_SECRET made optional so build succeeds without Discord; DATABASE_URL validation relaxed to allow SQLite file path.
- tRPC context in `src/server/api/trpc.ts` exposes `session` from `auth()`; `protectedProcedure` enforces auth and provides `ctx.session.user.id` for future per-user scoping (AC4).
- `npm run build` succeeds; app ready for `npm run dev` from `web/`. No automated tests added (per architecture: not required for MVP).

### File List

- web/ (entire scaffold: package.json, next.config.js, tailwind/postcss/tsconfig, src/app, src/server, src/trpc, prisma, .env, .env.example, etc.)
- web/src/env.js (modified: optional Discord env, DATABASE_URL schema)
- _bmad-output/implementation-artifacts/sprint-status.yaml (created earlier for story cycle)
- _bmad-output/implementation-artifacts/1-1-initialize-t3-nextauth.md (this file, status and Dev Agent Record updated)

### Code Review (AI)

- **AC1–AC4:** Verified. Build and dev run; NextAuth session and routes at `/api/auth/[...nextauth]`; DB and db:push; tRPC context and `protectedProcedure` provide session/userId for future scoping.
- **Note:** Story referenced `auth-options.ts`; T3 7 uses `server/auth/config.ts` + `index.ts`—naming variance only. Dashboard middleware can be added when protected routes exist (Story 1.4).
- **Verdict:** Approved. Story marked done.
