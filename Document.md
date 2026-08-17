# Project Documentation — AbleSpace Task Manager

This document records how this project was built, deployed, and debugged — including
issues hit along the way and how they were resolved. It's meant to complement the README
(which covers setup/usage) with the fuller story, useful both as a personal reference and
as something to speak to in the interview.

---

## 1. What this is

A full-stack task management app built for the AbleSpace Full Stack Developer (Fresher)
assessment.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** NestJS + Prisma
- **Database:** PostgreSQL (Render, production) — SQLite supported for local dev
- **Auth:** Guest login issuing a JWT (no password)
- **Deployment:** Render (frontend, backend, and Postgres all in one platform)

Live app: https://ablespace-task-web.onrender.com
Live API: https://ablespace-task-api.onrender.com/api

---

## 2. Architecture

```
apps/
  api/    NestJS backend
    src/
      auth/       guest login, JWT strategy, guard, current-user decorator
      tasks/      CRUD controller/service, DTOs, app-level status/priority enums
      prisma/     PrismaService (DB client lifecycle)
    prisma/
      schema.prisma
  web/    Next.js frontend (App Router)
    app/
      page.tsx                 guest login screen
      (dashboard)/layout.tsx   auth guard + header (theme toggle, sign out)
      (dashboard)/board/       kanban board
    components/
      ui/       Button, Input/Textarea, Modal (reusable primitives)
      theme/    ThemeProvider, ThemeToggle (persisted light/dark)
      tasks/    TaskCard, TaskColumn, TaskFormModal
    lib/        typed API client, auth/session helpers
    hooks/      useTasks (data fetching + mutations)
```

**Data model** (Prisma):
- `User` — guest identity (`id`, `name`, `isGuest`, `createdAt`)
- `Task` — `title`, `description`, `status`, `priority`, `dueDate`, timestamps, owned by a
  `User` via `ownerId` (cascade delete)

**Auth flow:** guest enters a name → backend creates a `User` row → signs a JWT
(`sub: userId`) → frontend stores the token in `localStorage` → every API call attaches
`Authorization: Bearer <token>` → NestJS `JwtAuthGuard` + `JwtStrategy` validate it →
`TasksService` scopes every query to `ownerId` and throws `ForbiddenException` on
cross-user access attempts.

**Theme persistence:** an inline blocking `<script>` in `app/layout.tsx` reads
`localStorage` before React hydrates and applies the `dark` class immediately, avoiding a
flash of the wrong theme on refresh. `ThemeProvider` then takes over for toggling.

---

## 3. Build process, in order

1. Scaffolded the monorepo (`apps/api`, `apps/web`) with root `package.json` workspaces.
2. Backend: Prisma schema → PrismaService/Module → Auth module (guest login, JWT
   strategy/guard) → Tasks module (DTOs with `class-validator`, service with
   ownership-scoped CRUD, controller).
3. Frontend: Tailwind + theme CSS variables → root layout with theme-init script → typed
   API client (`lib/api.ts`) → auth/session helpers → reusable UI primitives (Button,
   Input, Modal) → guest login page → dashboard layout (auth guard) → `useTasks` hook →
   TaskCard/TaskColumn/TaskFormModal → kanban board page.
4. README + this documentation file + Part 2 scaffold.
5. Local testing, bug fixes (below), GitHub push, deployment, deployment bug fixes.

---

## 4. Bugs hit and how they were fixed

### 4.1 SQLite doesn't support Prisma enums
**Symptom:** `npm install --workspaces` failed during the Prisma `postinstall` step with:
```
Error validating: You defined the enum `TaskStatus`. But the current connector does not
support enums.
```
**Cause:** the original schema used real Prisma `enum` blocks for `TaskStatus` and
`TaskPriority`, but the datasource provider was `sqlite`, which doesn't support native
enums (Postgres does).
**Fix:** changed `status`/`priority` on the `Task` model to plain `String` fields with
defaults, and moved the enum *values* into an app-level TypeScript file
(`apps/api/src/tasks/task-enums.ts`) used only for `class-validator`'s `@IsEnum()` checks
and typing — not the database layer. This keeps the same validation behavior with a
DB-agnostic schema.

### 4.2 npm workspace install run from the wrong folder
**Symptom:** `npm error No workspaces found!`
**Cause:** the zip had extracted into a nested duplicate folder
(`ablespace-task-manager (1)\ablespace-task-manager`), and the command was run one level
too high, where there's no root `package.json`.
**Fix:** `cd` into the folder that directly contains `package.json` before running
install.

### 4.3 EPERM errors during npm install / prisma generate (Windows)
**Symptom:** Long `npm warn cleanup ... EPERM: operation not permitted, rmdir ...` blocks,
and later a standalone `EPERM: operation not permitted, rename ...query_engine-windows.dll`
after a successful migration.
**Cause:** Windows file locking — either an npm cleanup step trying to remove directories
of a package whose postinstall had failed (harmless noise, install still completed), or a
separate running Node process (the dev server) holding a lock on Prisma's generated query
engine `.dll` file while `prisma generate` tried to overwrite it.
**Fix:** stopped the running dev server, re-ran `npx prisma generate` cleanly — succeeded
with no errors. These were not application bugs, just OS-level file locking during
concurrent processes.

### 4.4 Postgres migration hung indefinitely
**Symptom:** `npx prisma migrate dev` printed the datasource line and then produced no
further output, seemingly frozen.
**Cause:** Render's external Postgres connection requires SSL; the connection string as
copied didn't specify this, so the client attempted a plaintext connection that stalled
rather than failing fast.
**Fix:** appended `?sslmode=require` to the end of the `DATABASE_URL` value. Migration then
completed in a few seconds.

### 4.5 Migration history mismatch after switching providers
**Symptom:**
```
Error: P3019 — The datasource provider `postgresql` specified in your schema does not
match the one specified in the migration_lock.toml, `sqlite`.
```
**Cause:** Prisma records which provider a migration history belongs to. The existing
`prisma/migrations` folder had been created under `sqlite`; switching `schema.prisma` to
`postgresql` without clearing that folder left a mismatch.
**Fix:** deleted `prisma/migrations` entirely and re-ran `prisma migrate dev` to generate a
fresh, Postgres-native migration history. Safe to do since this was local/pre-production
history, not a shared team migration log.

### 4.6 Render deploy failed: "Root directory 'apps/api ' does not exist"
**Symptom:** Deploy failed immediately with a root-directory error, despite `apps/api`
clearly existing in the repo.
**Cause:** a trailing space after `api` in the Root Directory field (`"apps/api "`),
likely introduced by copy-paste, made Render look for a literally different (nonexistent)
path.
**Fix:** retyped the field manually and verified no trailing whitespace using cursor
movement.

### 4.7 Render auto-filled an invalid build command
**Symptom:** Build Command field showed `yarn npm install && npx prisma generate && npm
run build` — an invalid command mixing `yarn` and `npm`.
**Cause:** Render's UI appears to have auto-suggested/templated a build command that
merged a Yarn default with the typed npm command; this project uses npm exclusively (no
`yarn.lock` present).
**Fix:** manually cleared and retyped the field as `npm install && npx prisma generate &&
npm run build`.

### 4.8 Environment variables leaked across services on Render's setup form
**Symptom:** while configuring the *backend* service, the environment variables list
included `NEXT_PUBLIC_API_URL` (a frontend-only variable) and `JWT_SECRET` was still the
literal placeholder text `change-this-to-a-long-random-string` from `.env.example`.
**Cause:** using Render's "Add from .env" convenience feature appears to have pulled in
variables from more than one `.env.example` in the monorepo, and copied the placeholder
value verbatim rather than a real secret.
**Fix:** manually deleted the out-of-scope `NEXT_PUBLIC_API_URL` variable from the backend
service, and replaced the placeholder `JWT_SECRET` with an actual random string.

### 4.9 "Failed to fetch" after both services were live
**Symptom:** guest login on the deployed frontend failed with a generic "Failed to fetch"
and, in the browser console, `net::ERR_CONNECTION_REFUSED` pointing at
`localhost:4000/api/auth/guest`.
**Cause:** `NEXT_PUBLIC_API_URL` is a Next.js *build-time* variable — it gets inlined into
the compiled JavaScript bundle when `next build` runs, not read at request time. The
frontend's first build ran before this variable was correctly set to the deployed backend
URL, so the built bundle still pointed at `localhost:4000`.
**Fix:** set `NEXT_PUBLIC_API_URL` to the real backend URL and **triggered a full
rebuild** (not just a restart) so the new value would actually be baked into the bundle.

### 4.10 CORS block after the rebuild
**Symptom:** a new, different console error appeared post-rebuild:
```
Access to fetch at '.../api/auth/guest' from origin '...onrender.com' has been blocked by
CORS policy: No 'Access-Control-Allow-Origin' header is present
```
**Cause:** the backend's `CORS_ORIGIN` environment variable had a typo and didn't exactly
match the deployed frontend's origin, so NestJS's CORS middleware correctly refused the
cross-origin request.
**Fix:** corrected `CORS_ORIGIN` to exactly match the frontend's URL (no trailing slash),
saved, let Render redeploy the backend. Login, task creation, status changes, and
persistence across refresh were then confirmed working end-to-end on the live URLs.

---

## 5. Known limitations / things to watch

- **Visual design does not match the provided Figma.** This was a deliberate scope
  decision, not an oversight — documented in the README as well.
- **Render free-tier cold starts:** both services sleep after ~15 minutes idle; first
  request after that can take 30–60 seconds.
- **Render free Postgres expires after 30 days.** The assignment asks for 45 days of
  uptime, so the database may need to be upgraded to a paid tier or recreated before then.
- **Part 2 (Caseload / Take Data product write-up) is not yet completed** with real
  screenshots from the live AbleSpace product — this requires manual exploration inside
  AbleSpace itself, which wasn't accessible during the build process described above.

---

## 6. What to be ready to explain in the interview

- Why status/priority are plain strings at the DB layer but typed enums at the app layer
  (SQLite/Postgres portability tradeoff).
- How the guest-login JWT flow works end to end, and how task ownership is enforced on
  every mutation (`ForbiddenException` on cross-user access).
- Why the theme-init script lives in `<head>` as a blocking inline script rather than in a
  React `useEffect` (avoids flash-of-wrong-theme on refresh).
- The difference between Next.js build-time (`NEXT_PUBLIC_*`) and runtime environment
  variables, and why that caused the "Failed to fetch" bug above.
- Why CORS exists and what it was actually protecting against here.