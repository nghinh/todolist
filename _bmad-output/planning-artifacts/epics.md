---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
workflowType: 'epics-and-stories'
status: 'complete'
---

# TodoList - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for TodoList, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: A user can create an account (sign up).
FR2: A user can sign in and sign out.
FR3: A user can access the product in a web browser on desktop and mobile.
FR4: A user can create a task (with at least a title).
FR5: A user can edit a task (e.g. title, notes).
FR6: A user can delete a task.
FR7: A user can set a due date on a task.
FR8: A user can set a priority on a task (e.g. high, medium, low or equivalent).
FR9: A user can reorder or otherwise prioritize tasks within a list or view.
FR10: A user can see a list of their tasks.
FR11: A user can associate a task with a project, milestone, or goal (link task to project context).
FR12: A user can see which project, milestone, or goal a task is linked to when viewing the task or list.
FR13: A user can create or select the project/milestone/goal options used when linking tasks (within MVP scope).
FR14: A user can set a task's status (e.g. to do, in progress, blocked, done).
FR15: A user can see the current status of each task in the list or detail view.
FR16: A user can add a short note when marking a task as blocked (or equivalent).
FR17: A user can see a "what to do today" (or equivalent) view that shows tasks relevant for today.
FR18: A user can see overdue tasks (tasks past their due date).
FR19: A user can see upcoming tasks (e.g. by due date or time window).
FR20: A user can see tasks grouped or filtered by project, milestone, or goal when such links exist.
FR21: A user can see tasks ordered or filtered by priority and/or due date.
FR22: Task data (title, due date, priority, status, project link, notes) is persisted and restored across sessions.
FR23: A user's account and task data are scoped to that user (users see only their own data unless a shared/team capability is explicitly added later).
FR24: A new user can complete an initial onboarding flow (e.g. create account and add or import at least one task).
FR25: Core task and view actions are usable via keyboard (keyboard-operable).
FR26: Critical UI elements and content have labels or text that support screen readers (accessibility).

### NonFunctional Requirements

NFR-P1: The "what to do today" view and main task list load and become usable within a few seconds on a typical 3G/4G connection (e.g. first meaningful content within 3 s, interactive within 5 s).
NFR-P2: User actions that change task state (create, update status, reorder) complete and reflect in the UI within 2 seconds under normal conditions.
NFR-P3: The application remains responsive on target devices (desktop and mobile); no blocking of the main thread that prevents interaction for more than 1 second during normal use.
NFR-S1: User authentication uses a secure mechanism (e.g. password hashed at rest, or delegated auth); sessions are invalidated on sign-out and appropriately time-limited.
NFR-S2: User task and account data are only accessible to the owning user; access control is enforced so one user cannot read or modify another user's data.
NFR-S3: Data in transit between client and server is protected (e.g. TLS/HTTPS); sensitive data at rest is protected using standard practices (e.g. encryption at rest where applicable).
NFR-R1: Task and account data are persisted so that normal failures (e.g. browser close, refresh) do not cause loss of saved data once an action has been confirmed.
NFR-R2: The application handles transient network failures without silent data loss; failed updates are either retried or surfaced so the user can retry.
NFR-A1: Core flows (sign-in, task list, "what to do today," task create/edit, status update) meet WCAG 2.1 Level AA where applicable (contrast, focus, labels, keyboard operation).
NFR-A2: Critical interactive elements are keyboard-operable and have visible focus indicators; screen reader users can identify and activate primary actions and understand task and list content.

### Additional Requirements

- **Starter template (Epic 1 Story 1):** Initialize app with T3 Stack: `npm create t3-app@latest`; select App Router, Prisma or Drizzle, NextAuth, Tailwind; SQLite for dev or Postgres for production. Project initialization using this command is the first implementation story.
- **Data model:** User (from NextAuth); Task (id, userId, title, dueDate, priority, status, projectId/milestoneId/goalId, notes, sortOrder, createdAt, updatedAt); Project/Milestone/Goal (id, userId, name, type). All data scoped by userId.
- **Migrations:** Use Prisma Migrate or Drizzle migrations; version migrations in repo.
- **API:** tRPC procedures for task and project CRUD and "today"/list queries; consistent error shape (code + message); 401/403/4xx/5xx; surface failures to UI.
- **Frontend:** Next.js App Router; Server/Client Components; TanStack Query for server state; routes /, /today, /tasks, /auth/signin; semantic HTML, keyboard and focus, ARIA/labels (WCAG 2.1 AA).
- **Infrastructure:** Vercel (or similar) for Next.js; env for DB URL and NextAuth secret; PostgreSQL (Neon/Supabase/Railway) for production; migrations as part of deploy or pre-deploy step.
- **Implementation sequence (from Architecture):** (1) T3 init + DB + NextAuth; (2) Task and Project schema + migrations; (3) Auth and per-user scoping; (4) Task and project CRUD + "today"/list queries; (5) UI (today view, task list, forms); (6) Deploy + production DB.

### FR Coverage Map

FR1: Epic 1 – Sign up (create account).
FR2: Epic 1 – Sign in and sign out.
FR3: Epic 1 – Access product in browser on desktop and mobile.
FR4: Epic 2 – Create a task (at least title).
FR5: Epic 2 – Edit a task (e.g. title, notes).
FR6: Epic 2 – Delete a task.
FR7: Epic 3 – Set due date on a task.
FR8: Epic 3 – Set priority on a task.
FR9: Epic 3 – Reorder or prioritize tasks within a list or view.
FR10: Epic 2 – See a list of tasks.
FR11: Epic 4 – Associate a task with a project, milestone, or goal.
FR12: Epic 4 – See which project/milestone/goal a task is linked to.
FR13: Epic 4 – Create or select project/milestone/goal options when linking.
FR14: Epic 5 – Set a task's status (e.g. to do, in progress, blocked, done).
FR15: Epic 5 – See current status of each task in list or detail.
FR16: Epic 5 – Add a short note when marking a task as blocked.
FR17: Epic 6 – See "what to do today" view.
FR18: Epic 6 – See overdue tasks.
FR19: Epic 6 – See upcoming tasks.
FR20: Epic 6 – See tasks grouped or filtered by project/milestone/goal.
FR21: Epic 6 – See tasks ordered or filtered by priority and/or due date.
FR22: Epic 2 – Task data persisted and restored across sessions.
FR23: Epic 1 & 2 – User data scoped to that user (auth + all task APIs).
FR24: Epic 7 – New user can complete initial onboarding flow.
FR25: Epic 7 – Core actions usable via keyboard.
FR26: Epic 7 – Critical UI has labels/text for screen readers.

## Epic List

### Epic 1: App Foundation & Authentication
Users can create an account, sign in, sign out, and access the product in a web browser on desktop and mobile. Establishes the runnable app and per-user data scoping.
**FRs covered:** FR1, FR2, FR3, FR23 (auth and scoping).

### Epic 2: Core Task List
Users can create, edit, and delete tasks and see a list of their tasks; task data is persisted and restored across sessions and scoped to the signed-in user.
**FRs covered:** FR4, FR5, FR6, FR10, FR22, FR23.

### Epic 3: Task Attributes & Prioritization
Users can set a due date and priority on tasks and reorder or prioritize tasks within a list or view.
**FRs covered:** FR7, FR8, FR9.

### Epic 4: Task–Project Context
Users can link a task to a project, milestone, or goal; create or select those options; and see the link when viewing the task or list.
**FRs covered:** FR11, FR12, FR13.

### Epic 5: Task Status & Progress
Users can set and see task status (e.g. to do, in progress, blocked, done) and add a short note when marking a task as blocked.
**FRs covered:** FR14, FR15, FR16.

### Epic 6: Today, Overdue & Discovery Views
Users can see a "what to do today" view, overdue tasks, upcoming tasks, and tasks grouped or filtered by project/milestone/goal and ordered by priority and/or due date.
**FRs covered:** FR17, FR18, FR19, FR20, FR21.

### Epic 7: Onboarding & Accessibility
New users can complete an initial onboarding flow; core task and view actions are keyboard-operable and critical UI has labels/text that support screen readers.
**FRs covered:** FR24, FR25, FR26.

---

## Epic 1: App Foundation & Authentication

Users can create an account, sign in, sign out, and access the product in a web browser on desktop and mobile. Establishes the runnable app and per-user data scoping. **FRs:** FR1, FR2, FR3, FR23.

### Story 1.1: Initialize T3 Stack application with NextAuth

As a developer,
I want the application initialized with the T3 Stack and NextAuth configured,
So that we have a runnable app with session-based authentication and a foundation for per-user scoping.

**Acceptance Criteria:**

**Given** a greenfield project directory,
**When** the T3 init command is run with App Router, Prisma or Drizzle, NextAuth, and Tailwind selected,
**Then** the project builds and runs with `npm run dev`, and the app shows a default landing or home page.
**And** NextAuth is configured with session strategy; sign-in and sign-out routes are available (e.g. `/auth/signin`).
**And** Database is configured (SQLite for dev or as chosen); migrations can be run.
**And** All API or server code that will touch user data is structured to accept a session/user id for future per-user scoping (FR23).

### Story 1.2: User can create an account (sign up)

As a new user,
I want to create an account (sign up),
So that I can sign in and use the app with my own data.

**Acceptance Criteria:**

**Given** the app is running and the user is not signed in,
**When** the user completes the sign-up flow (e.g. email and password or OAuth),
**Then** an account is created and the user is signed in.
**And** The user is redirected to the app (e.g. dashboard or home).
**And** Passwords are hashed at rest; session is established (NFR-S1).

### Story 1.3: User can sign in and sign out

As a registered user,
I want to sign in and sign out,
So that I can access my data when I use the app and leave securely when done.

**Acceptance Criteria:**

**Given** the user has an account,
**When** the user signs in with valid credentials (or OAuth),
**Then** a session is created and the user sees the authenticated app (e.g. dashboard or task list).
**When** the user signs out,
**Then** the session is invalidated and the user sees the unauthenticated state (e.g. sign-in page or landing) (NFR-S1).
**And** Unauthenticated requests to protected routes receive 401 or redirect to sign-in.

### Story 1.4: User can access the product in a web browser on desktop and mobile

As a user,
I want to access the product in my browser on desktop and mobile,
So that I can use it from any supported device.

**Acceptance Criteria:**

**Given** the user is signed in,
**When** the user opens the app in a modern browser (Chrome, Firefox, Safari, Edge) on desktop or mobile,
**Then** the app loads and the authenticated layout is visible (e.g. shell with navigation).
**And** Protected routes are only accessible when signed in; otherwise the user is redirected to sign-in.
**And** The layout is responsive so core UI is usable on phone and desktop (touch-friendly, readable).

---

## Epic 2: Core Task List

Users can create, edit, and delete tasks and see a list of their tasks; task data is persisted and scoped to the signed-in user. **FRs:** FR4, FR5, FR6, FR10, FR22, FR23.

### Story 2.1: Task data model and persistence (schema and API)

As a developer,
I want the Task model and CRUD API scoped by user,
So that the app can persist and retrieve tasks for the signed-in user only.

**Acceptance Criteria:**

**Given** the database and migrations are in place (from Epic 1),
**When** the Task schema is added (id, userId, title, notes, createdAt, updatedAt at minimum; optional fields for later epics),
**Then** migrations run successfully and the task table exists.
**And** tRPC (or API) procedures exist for: create task, get tasks for current user, get one task by id, update task, delete task.
**And** Every procedure requires a valid session and scopes all reads/writes by userId (FR23).
**And** Failed updates or missing session return appropriate errors (e.g. 401/403) and are surfaced to the client (NFR-R2).

### Story 2.2: User can create a task (with at least a title)

As a signed-in user,
I want to create a task with at least a title,
So that I can start capturing what I need to do.

**Acceptance Criteria:**

**Given** the user is signed in and on a page where they can add a task,
**When** the user enters a title and submits the create form,
**Then** the task is saved and associated with the current user.
**And** The new task appears in the user's task list (or a confirmation is shown and the list can be refreshed).
**And** Task data is persisted; after refresh or re-open, the task is still present (FR22).
**And** If the request fails (e.g. network), the user sees an error and can retry (NFR-R2).

### Story 2.3: User can see a list of their tasks

As a signed-in user,
I want to see a list of my tasks,
So that I can review what I have to do.

**Acceptance Criteria:**

**Given** the user is signed in and has zero or more tasks,
**When** the user navigates to the task list (e.g. `/tasks` or main view),
**Then** only that user's tasks are shown (FR23).
**And** Each task shows at least title; other fields (e.g. notes) may be shown as needed.
**And** The list loads within a few seconds on a typical connection (NFR-P1); list is interactive (NFR-P3).

### Story 2.4: User can edit a task (title, notes)

As a signed-in user,
I want to edit a task's title and notes,
So that I can correct or add detail.

**Acceptance Criteria:**

**Given** the user is signed in and has at least one task,
**When** the user opens the task for edit and changes title and/or notes and saves,
**Then** the task is updated in the database and the UI reflects the change.
**And** Only the task owner can update the task (FR23).
**And** The change is visible within 2 seconds under normal conditions (NFR-P2).
**And** Failed updates are surfaced so the user can retry (NFR-R2).

### Story 2.5: User can delete a task

As a signed-in user,
I want to delete a task,
So that I can remove items I no longer need.

**Acceptance Criteria:**

**Given** the user is signed in and has at least one task,
**When** the user confirms deletion of a task,
**Then** the task is removed from the database and disappears from the list (or the list refreshes).
**And** Only the task owner can delete the task (FR23).
**And** Deletion is persisted; after refresh, the task is gone (FR22).

---

## Epic 3: Task Attributes & Prioritization

Users can set a due date and priority on tasks and reorder tasks within a list or view. **FRs:** FR7, FR8, FR9.

### Story 3.1: User can set a due date on a task

As a signed-in user,
I want to set a due date on a task,
So that I can track when it needs to be done.

**Acceptance Criteria:**

**Given** the user is signed in and viewing or editing a task,
**When** the user sets or changes a due date (e.g. date picker or input),
**Then** the due date is saved and displayed on the task in list and detail views.
**And** The value is persisted and restored across sessions (FR22).
**And** Dates are stored and exchanged in a consistent format (e.g. ISO 8601 per architecture).

### Story 3.2: User can set a priority on a task

As a signed-in user,
I want to set a priority on a task (e.g. high, medium, low),
So that I can indicate importance.

**Acceptance Criteria:**

**Given** the user is signed in and viewing or editing a task,
**When** the user selects a priority (e.g. high, medium, low or equivalent),
**Then** the priority is saved and displayed on the task in list and detail views.
**And** The value is persisted and restored across sessions (FR22).

### Story 3.3: User can reorder tasks within a list or view

As a signed-in user,
I want to reorder or prioritize tasks within a list or view,
So that I can decide what to do first.

**Acceptance Criteria:**

**Given** the user is signed in and has two or more tasks in a list or view,
**When** the user reorders tasks (e.g. drag-and-drop or up/down),
**Then** the new order is saved (e.g. via sortOrder or equivalent) and the list reflects it.
**And** The order is persisted and restored across sessions (FR22).
**And** Reorder completes and reflects in the UI within 2 seconds under normal conditions (NFR-P2).

---

## Epic 4: Task–Project Context

Users can link a task to a project, milestone, or goal; create or select those options; and see the link when viewing the task or list. **FRs:** FR11, FR12, FR13.

### Story 4.1: Project/milestone/goal model and API

As a developer,
I want a Project (or Milestone/Goal) model and API scoped by user,
So that tasks can be linked to project context.

**Acceptance Criteria:**

**Given** the database is in use for tasks,
**When** the Project (or unified project/milestone/goal) schema is added (id, userId, name, type or equivalent),
**Then** migrations run and the table(s) exist.
**And** tRPC (or API) procedures exist for: create project, list projects for current user; all scoped by userId (FR23).
**And** Task schema is extended with projectId (or equivalent) and optional migration is run.

### Story 4.2: User can link a task to a project, milestone, or goal

As a signed-in user,
I want to associate a task with a project, milestone, or goal,
So that I can see how my work ties to project context.

**Acceptance Criteria:**

**Given** the user is signed in and has at least one project (or can create one) and one task,
**When** the user links the task to a project (or milestone/goal),
**Then** the link is saved and the task shows the association (FR11).
**And** Only the task owner can update the link (FR23).

### Story 4.3: User can create or select project/milestone/goal when linking

As a signed-in user,
I want to create or select the project/milestone/goal options when linking a task,
So that I can organize tasks by my projects and goals.

**Acceptance Criteria:**

**Given** the user is signed in and is linking a task to project context,
**When** the user chooses to create a new project (or milestone/goal) or select an existing one,
**Then** new options are created and stored for that user, or an existing option is selected (FR13).
**And** All options are scoped to the current user (FR23).

### Story 4.4: User can see project/milestone/goal link on task and in list

As a signed-in user,
I want to see which project, milestone, or goal a task is linked to in the task and in the list,
So that I can understand context at a glance.

**Acceptance Criteria:**

**Given** a task is linked to a project (or milestone/goal),
**When** the user views the task in detail or in a list,
**Then** the linked project/milestone/goal is displayed (e.g. name or label) (FR12).

---

## Epic 5: Task Status & Progress

Users can set and see task status and add a short note when marking a task as blocked. **FRs:** FR14, FR15, FR16.

### Story 5.1: User can set and see task status (to do, in progress, blocked, done)

As a signed-in user,
I want to set a task's status (e.g. to do, in progress, blocked, done) and see it in the list and detail,
So that I can track progress.

**Acceptance Criteria:**

**Given** the user is signed in and has at least one task,
**When** the user sets or changes the task status,
**Then** the status is saved and displayed on the task in list and detail views (FR14, FR15).
**And** Status is persisted and restored across sessions (FR22).
**And** Status change reflects in the UI within 2 seconds under normal conditions (NFR-P2).

### Story 5.2: User can add a short note when marking a task as blocked

As a signed-in user,
I want to add a short note when marking a task as blocked,
So that I can record why it's blocked (e.g. waiting on someone).

**Acceptance Criteria:**

**Given** the user is signed in and is setting a task's status to blocked,
**When** the user enters an optional short note (e.g. "waiting on design"),
**Then** the note is saved with the task and displayed when the task is shown as blocked (FR16).
**And** The note is persisted and restored across sessions.

---

## Epic 6: Today, Overdue & Discovery Views

Users can see "what to do today," overdue, upcoming, and filter/group/order by project and priority/due date. **FRs:** FR17, FR18, FR19, FR20, FR21.

### Story 6.1: "What to do today" view

As a signed-in user,
I want to see a "what to do today" (or equivalent) view with tasks relevant for today,
So that I can focus on today's work.

**Acceptance Criteria:**

**Given** the user is signed in and has tasks with due dates (including today) or no due date,
**When** the user opens the "today" view (e.g. `/today`),
**Then** tasks relevant for today are shown (e.g. due today or overdue, or definition per product) (FR17).
**And** The view loads and becomes usable within a few seconds on a typical connection (NFR-P1).

### Story 6.2: Overdue tasks view

As a signed-in user,
I want to see overdue tasks (past due date),
So that I can catch up on what's late.

**Acceptance Criteria:**

**Given** the user is signed in and has tasks with due dates in the past,
**When** the user views overdue tasks (dedicated view or section),
**Then** only tasks past their due date are shown (FR18).

### Story 6.3: Upcoming tasks view

As a signed-in user,
I want to see upcoming tasks (e.g. by due date or time window),
So that I can plan ahead.

**Acceptance Criteria:**

**Given** the user is signed in and has tasks with future due dates,
**When** the user views upcoming tasks (dedicated view or section),
**Then** tasks due in the future (or within a chosen window) are shown (FR19).

### Story 6.4: Filter/group by project and order by priority/due date

As a signed-in user,
I want to see tasks grouped or filtered by project/milestone/goal and ordered by priority and/or due date,
So that I can work by project or by priority.

**Acceptance Criteria:**

**Given** the user is signed in and has tasks, some linked to projects,
**When** the user applies filter or group by project/milestone/goal and/or order by priority or due date,
**Then** the list updates to show the filtered/grouped and ordered result (FR20, FR21).

---

## Epic 7: Onboarding & Accessibility

New users can complete an initial onboarding flow; core actions are keyboard-operable and screen-reader supported. **FRs:** FR24, FR25, FR26.

### Story 7.1: New user onboarding flow

As a new user,
I want to complete an initial onboarding flow (e.g. create account and add or import at least one task),
So that I can get value from the app quickly.

**Acceptance Criteria:**

**Given** the user has just created an account or signed in for the first time,
**When** the user goes through the onboarding flow,
**Then** they are guided to add or import at least one task (or equivalent first action) (FR24).
**And** After completion, they see their task list or "today" view.

### Story 7.2: Keyboard operation for core actions

As a user,
I want core task and view actions to be usable via keyboard,
So that I can operate without a mouse.

**Acceptance Criteria:**

**Given** the user is on the task list, "today" view, or task create/edit,
**When** the user uses only the keyboard (Tab, Enter, Space, arrows as appropriate),
**Then** they can navigate, focus, and activate primary actions (e.g. create task, edit, delete, change status) (FR25).
**And** Focus indicators are visible (NFR-A2).

### Story 7.3: Screen reader support for critical UI

As a screen reader user,
I want critical UI elements and content to have labels or text that support my assistive technology,
So that I can identify and use primary actions and understand task and list content.

**Acceptance Criteria:**

**Given** the user uses a screen reader,
**When** they navigate the core flows (sign-in, task list, "what to do today," create/edit task, status update),
**Then** critical interactive elements have accessible names/labels and task/list content is announced appropriately (FR26).
**And** Core flows meet WCAG 2.1 Level AA where applicable (contrast, focus, labels, keyboard) (NFR-A1, NFR-A2).
