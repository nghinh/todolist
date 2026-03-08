---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/product-brief-TodoList-2026-03-08.md']
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-08'
project_name: 'TodoList'
user_name: 'Nghi'
date: '2026-03-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 26 FRs across User & Account (sign up, sign in/out, browser access); Task Management (create, edit, delete, due date, priority, reorder, list); Task–Project Context (link task to project/milestone/goal, create/select those options, show link in list/detail); Status & Progress (set status, blocked note, show status); Views & Discovery ("what to do today," overdue, upcoming, filter/group by project, order by priority/due date); Data & Persistence (persist and restore task data, strict per-user scoping); Onboarding & Usability (onboarding flow, keyboard operation, screen reader support). Architecture must support a web app, auth, per-user storage, and efficient reads for "today," overdue, and filtered/ordered lists.

**Non-Functional Requirements:** Performance: first meaningful content ~3 s, interactive ~5 s; task mutations visible in UI within ~2 s; no long main-thread blocks. Security: secure auth and session handling; strict per-user access; TLS and at-rest protection. Reliability: no data loss on refresh; failed updates retried or surfaced. Accessibility: WCAG 2.1 AA for core flows; keyboard and screen reader support. These drive choices for client performance, API design, auth/session model, data isolation, and error handling.

**Scale & Complexity:**
- Primary domain: Full-stack web (SPA + backend)
- Complexity level: Low
- Estimated architectural components: Web client, auth/session, task and project-context data model and API, persistence with per-user isolation

### Technical Constraints & Dependencies

- Web-only MVP (SPA; PWA/offline later). Modern browsers; no IE.
- No real-time or third-party integrations for MVP.
- No special regulatory compliance.
- MVP should stay lean to avoid over-building (e.g. no real-time sync initially).

### Cross-Cutting Concerns Identified

- **Authentication & authorization:** Sign up, sign in/out, session lifecycle; all APIs and data scoped by user.
- **Per-user data isolation:** Every task and project-context operation must be bound to the authenticated user.
- **Responsive & accessible UI:** Layout and interaction patterns must support desktop and mobile and WCAG 2.1 AA.
- **Persistence & failure handling:** Reliable save/load and clear handling of network/refresh so NFR-R1 and R2 are met.

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack web (SPA + backend)** — From PRD: web application, auth, per-user task and project-context persistence, modern browsers, no real-time for MVP.

### Starter Options Considered

- **create-t3-app (T3 Stack)** — Next.js 15, TypeScript, Tailwind CSS, optional tRPC, Prisma or Drizzle, NextAuth. Single CLI, type-safe API and DB, well-suited for small team and MVP.
- **create-next-app** — Official Next.js starter (React, App Router, TypeScript, Tailwind). Lighter; you add auth and DB separately.
- **Vite + React** (e.g. `npm create vite@latest`) — SPA-only; backend and auth would be separate. Fits if you want a strict front-end/back-end split.

### Selected Starter: T3 Stack (create-t3-app)

**Rationale for Selection:** Aligns with PRD (web app, auth, persistence, per-user data). Single full-stack (Next.js + API + DB + auth), TypeScript end-to-end, one create command. Suitable for intermediate skill level and straightforward deployment (e.g. Vercel + hosted DB).

**Initialization Command:**

```bash
npm create t3-app@latest
```

(Or: `pnpm create t3-app@latest` / `bun create t3-app@latest`. When prompted, select App Router, Prisma or Drizzle, NextAuth, Tailwind; DB provider e.g. SQLite for dev or Postgres for production.)

**Architectural Decisions Provided by Starter:**

- **Language & runtime:** TypeScript; Node for build and dev.
- **Styling:** Tailwind CSS.
- **Build:** Next.js (Turbopack in dev).
- **Testing:** Add Vitest/Jest as needed; not required for MVP.
- **Code organization:** Next.js App Router; `/src/app`, `/src/server`, `/src/components`; shared types.
- **Development:** `npm run dev`, hot reload, env from `.env`.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (block implementation until decided):** Data model (Task, Project/Milestone/Goal, User); database (Prisma or Drizzle with SQLite dev / Postgres prod); authentication (NextAuth, session, per-user isolation); API surface (tRPC or Next.js API routes for task and project CRUD).

**Important (shape architecture):** Frontend data fetching and caching (e.g. TanStack Query with tRPC or fetch); deployment (Vercel + hosted DB).

**Deferred (post-MVP):** Real-time sync, PWA/offline, team visibility, integrations.

### Data Architecture

- **Database:** Prisma or Drizzle (as selected in T3 init). SQLite for local dev; PostgreSQL for production (e.g. Neon, Supabase, or Railway).
- **Core entities:** **User** (id, email, etc.; from NextAuth). **Task** (id, userId, title, dueDate, priority, status, projectId/milestoneId/goalId, notes, sortOrder, createdAt, updatedAt). **Project** (or **Milestone** / **Goal**) (id, userId, name, type; optional fields). All task and project data scoped by `userId` (per-user isolation).
- **Migrations:** Use Prisma Migrate or Drizzle migrations; version migrations in repo.
- **Caching:** No distributed cache for MVP. Rely on Next.js/tRPC request caching and client cache (e.g. TanStack Query) for list and "today" views.

### Authentication & Security

- **Authentication:** NextAuth.js (provided by T3). Session-based; secure cookie. Support credentials and/or OAuth as chosen in T3 setup.
- **Authorization:** Every task and project API/resolver checks session and scopes data by `userId`. No cross-user access.
- **Security:** HTTPS only (TLS). Passwords hashed (NextAuth/default). No additional compliance requirements for MVP.

### API & Communication

- **API style:** tRPC (if selected in T3) for type-safe procedures (task CRUD, project/milestone CRUD, "today" and list queries). Else Next.js API routes with a small REST or JSON API for the same operations.
- **Error handling:** Consistent error shape (e.g. code + message); 401 for unauthenticated, 403 for forbidden; 4xx/5xx for client/server errors. Surface failures to UI (NFR-R2).
- **Rate limiting:** Defer to platform (e.g. Vercel) or add simple rate limiting later; not blocking for MVP.

### Frontend Architecture

- **Framework:** Next.js App Router + React (from T3). Server Components where beneficial; Client Components for interactive task list, forms, and views.
- **State:** Server state via tRPC or fetch; client state (UI, forms) via React state or minimal store. TanStack Query (or similar) for server-state cache and "today"/list views.
- **Routing:** App Router file-based routes (e.g. `/`, `/today`, `/tasks`, `/auth/signin`).
- **Accessibility:** Semantic HTML, Tailwind for layout; keyboard and focus management; ARIA/labels for critical elements (WCAG 2.1 AA).

### Infrastructure & Deployment

- **Hosting:** Vercel (or similar) for Next.js. Environment variables for DB URL and NextAuth secret.
- **Database hosting:** PostgreSQL via Neon, Supabase, or Railway for production; SQLite for local.
- **CI/CD:** Git-based deploy (e.g. Vercel Git integration); run migrations as part of deploy or a pre-deploy step.
- **Monitoring/logging:** Use Vercel (or host) defaults for MVP; add structured logging and error tracking as needed.

### Decision Impact Analysis

**Implementation sequence:** (1) Initialize app with T3 and configure DB + NextAuth. (2) Define and migrate Task and Project (or Milestone/Goal) schema. (3) Implement auth and per-user scoping. (4) Implement task and project CRUD and "today"/list queries. (5) Build UI (today view, task list, forms). (6) Deploy to Vercel and connect production DB.

**Cross-component dependencies:** Data model drives API and UI. Auth and per-user scoping underpin all task/project access. Frontend depends on API and auth session.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical conflict points:** Naming (DB, API, code), project/file structure, API and data formats, error and loading handling. Without shared rules, agents may choose different conventions and produce incompatible code.

### Naming Patterns

**Database naming:** Follow the ORM default (Prisma: camelCase model/field names; Drizzle: similar). Use `userId` (camelCase) or `user_id` (snake_case) consistently for foreign keys—match the ORM. Table names: plural and lowercase (e.g. `tasks`, `projects`) or match ORM convention.

**API naming:** tRPC: procedures and routers in camelCase (e.g. `task.getToday`, `task.create`). REST/API routes: kebab-case or lowercase paths (e.g. `/api/tasks`, `/api/tasks/[id]`). Route params: `[id]` (Next.js). Query/body: camelCase in JSON.

**Code naming:** TypeScript/React: PascalCase for components and types (`TaskCard`, `TaskList`). camelCase for functions, variables, and props (`getTasksForToday`, `userId`). Files: PascalCase for components (`TaskCard.tsx`); camelCase or kebab-case for utilities; match T3/Next app structure (e.g. `src/app/(dashboard)/today/page.tsx`).

### Structure Patterns

**Project organization:** Follow T3/Next App Router layout. Components under `src/components` (optionally by feature, e.g. `task/`, `project/`). Server/API under `src/server` (tRPC routers, db client) or `src/app/api`. Shared types in `src/types` or next to server. Tests: co-located `*.test.ts`/`*.spec.ts` or a top-level `__tests__`/`tests` directory—pick one and stick to it.

**File structure:** Config at repo root or in `src` as per T3 (e.g. `next.config.js`, `tailwind.config.ts`). Env: `.env.local` for secrets; `.env.example` for documentation. Static assets under `public/` or `src/app/...` as per Next.

### Format Patterns

**API response format:** tRPC: return plain data or throw with a typed error; no custom wrapper required. If using REST/JSON: use a consistent shape—e.g. `{ data: T }` for success and `{ error: { code: string, message: string } }` for errors. Use HTTP status codes (401, 403, 404, 500) and surface errors to the UI (NFR-R2).

**Data exchange:** JSON: camelCase for all client–server payloads. Dates: ISO 8601 strings (e.g. `2026-03-08T12:00:00Z`). Booleans: `true`/`false`. Prefer explicit null over omission for optional fields in API contracts.

### Communication Patterns

**State (server/client):** Server state via tRPC + TanStack Query (or fetch + cache). Use consistent query keys (e.g. by route/procedure and params). Client UI state: React state or minimal store; avoid duplicating server state. Updates: optimistic updates optional; always refetch or invalidate after mutations so the UI reflects persistence and failures.

**Events:** No event bus required for MVP. Use tRPC subscriptions or polling only if added later; document naming (e.g. `task.updated`) if introduced.

### Process Patterns

**Error handling:** Server: throw typed errors (e.g. tRPC `TRPCError` or equivalent) with code and message; map to HTTP status where applicable. Client: show user-facing message from `message`; log full error for debugging. Use error boundaries for React tree; form/field errors inline. No silent failures for mutations (NFR-R2).

**Loading states:** Use TanStack Query (or equivalent) `isLoading`/`isPending` and `isError` for server state. Naming: `isLoading` for initial load, `isFetching` for background refetch if needed. Local UI loading (e.g. submit button): `isSubmitting` or `isPending`. Show skeletons or spinners for list and “today” views to meet NFR-P1/P3.

### Enforcement Guidelines

**All AI agents MUST:**

- Use the naming conventions above (DB, API, code) so schemas, procedures, and components stay consistent.
- Use the chosen project structure (T3/Next) and place new code in the correct layers (server vs client, components vs pages).
- Use the agreed API and error format; surface errors to the user and do not swallow them.

**Pattern enforcement:** Prefer ESLint/TypeScript for naming and structure where possible. Document any new pattern in this section. If a pattern is violated, fix the violation and align the code with this document.

### Pattern Examples

**Good:** `TaskCard.tsx` component; `getTasksForToday` procedure; `userId` in session and DB; API errors with `code` and `message`; dates as ISO strings in JSON.

**Avoid:** Mixing snake_case and camelCase in the same layer; returning raw DB rows with different key casing to the client; silent catch of mutation errors; ad-hoc loading flags that bypass the data layer.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
TodoList/
├── README.md
├── package.json
├── package-lock.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── today/
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   └── projects/
│   │   │       └── page.tsx
│   │   └── auth/
│   │       └── signin/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── task/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskFilters.tsx
│   │   ├── project/
│   │   │   ├── ProjectSelect.tsx
│   │   │   └── ProjectLink.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── server/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── api/
│   │   │   ├── root.ts
│   │   │   ├── trpc.ts
│   │   │   └── routers/
│   │   │       ├── task.ts
│   │   │       └── project.ts
│   │   └── auth-options.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── __mocks__/
│   ├── components/
│   └── e2e/
└── public/
```

(If Drizzle is chosen instead of Prisma: use `drizzle/` with schema and migrations; omit `prisma/`.)

### Architectural Boundaries

**API Boundaries:** tRPC routers under `src/server/api/routers/` (e.g. `task`, `project`) define the server API surface; no public REST endpoints except NextAuth. Auth boundary: `src/server/auth.ts` and `src/server/auth-options.ts`; middleware in `src/middleware.ts` protects dashboard routes.

**Component Boundaries:** Pages in `src/app` are thin; data via tRPC + TanStack Query. Feature components in `src/components/task` and `src/components/project`; shared UI in `src/components/ui`. No direct DB access from components; all data through server procedures.

**Service Boundaries:** Single application process; "services" are tRPC procedures and shared helpers in `src/server` and `src/lib`. No internal service-to-service HTTP; only procedure calls and DB access.

**Data Boundaries:** DB access only in `src/server` (Prisma/Drizzle client in `src/server/db.ts`). All queries scoped by `userId` from session. No distributed cache for MVP; client cache via TanStack Query.

### Requirements to Structure Mapping

**FR category → locations:**

- **User & Account:** `src/app/auth/signin`, `src/server/auth*.ts`, `src/middleware.ts`, NextAuth config.
- **Task Management:** `src/server/api/routers/task.ts`, `src/components/task/*`, `src/app/(dashboard)/tasks/page.tsx`, Prisma/Drizzle task schema and migrations.
- **Task–Project Context:** `src/server/api/routers/project.ts` and `task.ts`, `src/components/project/*`, project (or milestone/goal) schema.
- **Status & Progress:** Task schema and `task` router; status/blocked in `TaskCard`/`TaskForm`.
- **Views & Discovery:** `src/app/(dashboard)/today/page.tsx`, `tasks/page.tsx`, `projects/page.tsx`; `TaskList`, `TaskFilters`, "today" and list procedures in `task` router.
- **Data & Persistence:** `src/server/db.ts`, Prisma/Drizzle schema and migrations; per-user scoping in all task/project procedures.
- **Onboarding & Usability:** `src/app/page.tsx` or dedicated onboarding route; keyboard/accessibility in `src/components/ui` and task/project components.

**Cross-cutting:** Auth → `src/server/auth*.ts`, `src/middleware.ts`. Shared types → `src/types`. Utils → `src/lib/utils.ts`.

### Integration Points

**Internal:** App Router pages call tRPC hooks (TanStack Query); tRPC procedures use `db` and session. No event bus; mutations invalidate queries to refresh UI.

**External:** NextAuth (OAuth/credentials); production DB (Postgres). Env: `.env.local` / `.env.example`.

**Data flow:** User → page → tRPC hook → procedure → DB (read) or DB write then invalidate → UI update.

### File Organization Patterns

**Configuration:** Root-level `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.cjs`; env at root (`.env.local`, `.env.example`).

**Source:** App Router under `src/app`; server and tRPC under `src/server`; components by feature under `src/components`; shared code in `src/lib` and `src/types`.

**Tests:** `tests/components` for unit/component tests; `tests/e2e` for E2E; `__mocks__` for mocks. Co-located `*.test.ts`/`*.spec.ts` allowed if project standard is set.

**Assets:** Static under `public/`; app assets via `src/app` as needed.

### Development Workflow Integration

**Development:** `npm run dev`; Next.js dev server and hot reload; DB from env. Migrations: Prisma Migrate or Drizzle before or during dev.

**Build:** `npm run build`; Next build uses the structure above; no extra build-time structure.

**Deployment:** Vercel (or similar) builds from repo; migrations run as part of deploy or pre-deploy step; env for DB and NextAuth in host.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Technology choices are consistent: Next.js 15 + TypeScript + Tailwind + Prisma or Drizzle + NextAuth, with Vercel and Postgres for production. No version or integration conflicts identified.

**Pattern Consistency:** Naming (DB, API, code), structure (T3/App Router), and format (tRPC, JSON camelCase, ISO dates) align with the stack. Error and loading patterns support NFRs.

**Structure Alignment:** Directory layout matches T3 and the implementation patterns; server/client and API/component boundaries are clear.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:** All seven FR categories have explicit locations: User & Account (auth, middleware, signin); Task Management (task router, task components, tasks page, schema); Task–Project Context (project router, project components, schema); Status & Progress (task schema/router, TaskCard/TaskForm); Views & Discovery (today/tasks/projects pages, TaskList, TaskFilters); Data & Persistence (db, schema, migrations, per-user scoping); Onboarding & Usability (landing/onboarding, UI and component accessibility).

**Non-Functional Requirements Coverage:** Performance: Next/tRPC and TanStack Query support fast loads and mutations. Security: NextAuth, session, per-user scoping, HTTPS. Reliability: error handling and UI feedback documented. Accessibility: semantic HTML, Tailwind, keyboard/ARIA called out.

### Implementation Readiness Validation ✅

**Decision Completeness:** Critical decisions (data model, DB, auth, API, frontend, infra, sequence) are documented with enough detail to implement.

**Structure Completeness:** Project tree lists concrete files and folders; boundaries and integration points are described.

**Pattern Completeness:** Naming, structure, format, communication, and process patterns are defined with examples and enforcement guidelines.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps:** Prisma vs Drizzle is left to T3 init; document the chosen ORM in the architecture after init. Optional: add a one-line "first commands" subsection (e.g. `npm create t3-app@latest`, then apply schema).

**Nice-to-Have:** Vitest/Jest and E2E setup can be added when tests are introduced; not required for MVP.

### Validation Issues Addressed

No blocking issues. Optional ORM and "first commands" note can be added during or after first implementation story.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented
- [x] Technology stack specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High, given coherence, requirements coverage, and implementation readiness.

**Key Strengths:** Clear stack, per-user isolation, consistent patterns, and a concrete project structure that supports all FRs and NFRs.

**Areas for Future Enhancement:** Lock in Prisma vs Drizzle and document after init; add test tooling when moving beyond MVP.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow the architectural decisions in this document.
- Apply implementation patterns consistently (naming, structure, errors, loading).
- Respect project structure and boundaries (server vs client, routers vs components).
- Use this document as the source of truth for architecture questions.

**First Implementation Priority:** Initialize the app with the T3 Stack: `npm create t3-app@latest` (choose Next.js, TypeScript, Tailwind, Prisma or Drizzle, NextAuth; SQLite for dev). Then add Task and Project (or Milestone/Goal) schema and run migrations. This is the first implementation story.
