# Story 1.2: User can create an account (sign up)

**Story ID:** 1.2  
**Story Key:** 1-2-user-can-create-account  
**Epic:** 1 - App Foundation & Authentication  
**Status:** review

## Story

As a new user,
I want to create an account (sign up),
So that I can sign in and use the app with my own data.

## Acceptance Criteria

1. **Given** the app is running and the user is not signed in,  
   **When** the user completes the sign-up flow (e.g. email and password or OAuth),  
   **Then** an account is created and the user is signed in.

2. **And** The user is redirected to the app (e.g. dashboard or home).

3. **And** Passwords are hashed at rest; session is established (NFR-S1).

## Tasks / Subtasks

- [x] **Task 1:** Add sign-up (registration) flow (AC: 1, 2)
  - [x] Provide a sign-up page or form (e.g. `/auth/signup` or link from sign-in page).
  - [x] Collect email and password (or use existing OAuth provider; Discord is already in auth config but needs AUTH_DISCORD_ID/SECRET in .env to work).
  - [x] Create user in DB (NextAuth Prisma adapter handles this for OAuth; for credentials you need Credentials provider + manual user create with hashed password).
  - [x] After successful sign-up, establish session and redirect to app (e.g. home or a simple dashboard placeholder).
- [x] **Task 2:** Ensure passwords hashed and session established (AC: 3, NFR-S1)
  - [x] If using credentials: hash password (e.g. bcrypt or NextAuth-recommended) before storing; verify on sign-in.
  - [x] Session established via NextAuth after sign-up/sign-in; no plaintext passwords in session.

## Dev Notes

### Context from Story 1.1

- App lives in `web/`. NextAuth (v5) in `web/src/server/auth/` (config.ts, index.ts). Route: `web/src/app/api/auth/[...nextauth]/route.ts`.
- Prisma schema has User, Account, Session (NextAuth models). DB is SQLite; `npm run db:push` already run.
- tRPC has `protectedProcedure` and `createTRPCContext` with `session` for future per-user APIs.

### Architecture compliance

- **Auth:** NextAuth; session-based; secure cookie. Passwords hashed at rest (NFR-S1).
- **Naming:** camelCase (e.g. `userId`); follow existing T3/Next patterns in `web/`.
- **Data:** User creation via NextAuth adapter (OAuth) or custom Credentials provider that creates User in Prisma and hashes password.

### Options

- **Option A (simplest for MVP):** Use Discord OAuth only—user “signs up” by signing in with Discord first time (account created by adapter). Add AUTH_DISCORD_ID and AUTH_DISCORD_SECRET to `web/.env` and document in .env.example. Redirect after sign-in to home/dashboard.
- **Option B:** Add Credentials provider: sign-up form creates User with hashed password (e.g. bcrypt); sign-in validates credentials. Requires sign-up API or server action that hashes and creates User, then sign-in with Credentials provider.

Choose one approach and implement. If Option A, ensure redirect after first sign-in to app home/dashboard.

### Testing

- Manual: open sign-up (or sign-in with OAuth), complete flow, confirm user in DB and redirected; confirm session (e.g. show user email on landing when signed in). No automated tests required for MVP per architecture.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md] — Authentication & Security, Implementation Patterns.
- [Source: _bmad-output/planning-artifacts/epics.md] — Epic 1, Story 1.2.
- NextAuth v5: https://authjs.dev/ — Credentials provider, callbacks, adapter.

## Dev Agent Record

### Agent Model Used

Auto (Cursor agent)

### Completion Notes List

- Implemented Option B: Credentials provider with email/password sign-up. User model extended with optional `passwordHash`; bcrypt used to hash passwords (SALT_ROUNDS=10) before storing; Credentials provider added to auth config with authorize() that finds user by email and verifies via bcrypt.compare.
- Sign-up flow: `/auth/signup` page with form; server action `signUp` creates user in DB then calls signIn("credentials", { redirect: false }); on success redirects to "/". SignUpForm client component uses useActionState to show validation errors (required fields, min 8 chars, duplicate email).
- Home page: added "Sign up" link next to "Sign in"; session display uses email or name. Auth config: redirect callback to "/", session callback handles optional user for Credentials.
- Passwords hashed at rest (NFR-S1); session established after sign-up/sign-in.

### File List

- web/prisma/schema.prisma (User.passwordHash added)
- web/src/server/auth/config.ts (Credentials provider, bcrypt verify, pages + redirect callbacks)
- web/src/server/auth/sign-up.ts (new: signUp, signUpFormAction, bcrypt hash)
- web/src/app/auth/signup/page.tsx (new)
- web/src/app/auth/signup/SignUpForm.tsx (new, client form with useActionState)
- web/src/app/page.tsx (Sign up link, session display email/name)
- _bmad-output/implementation-artifacts/1-2-user-can-create-account.md (this file)
