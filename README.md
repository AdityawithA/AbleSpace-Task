# AbleSpace Task Manager

Full-stack Task Management app for AbleSpace's Fresher assessment. Next.js + Tailwind
frontend, NestJS + Prisma backend, guest login with JWT, persistent light/dark theme,
kanban board with task CRUD. Built without matching the provided Figma — see below for
details.

## 🔗 Live Demo

- **App:** https://ablespace-task-web.onrender.com
- **API:** https://ablespace-task-api.onrender.com/api

Both are deployed on Render's free tier, which spins down after ~15 minutes of
inactivity. If the app has been idle, the **first load can take 30–60 seconds** while
the backend wakes up — that's expected, not a bug. Subsequent requests are fast.

> **Note on the database:** the Postgres instance backing this app is on Render's free
> tier, which expires 30 days after creation. If it lapses before the 45-day window the
> assignment asks for, the live app may show a database connection error until the DB is
> recreated/upgraded — the code and deployment config themselves remain fully correct.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** NestJS + Prisma
- **Database:** PostgreSQL (Render), SQLite supported for local dev — see setup below
- **Auth:** Guest login issuing a JWT, no password required



**This implementation intentionally does not follow the provided Figma design.** The UI is
an original kanban board (To Do / In Progress / Done, priority badges, light/dark theme,
responsive layout) built to satisfy the functional requirements — task CRUD, theme
switching with persistence, guest login, responsiveness — without matching the visual
design. This is a deliberate, documented deviation, not an oversight.

Since "Design Fidelity" and "Attention to detail" are explicitly primary evaluation
criteria, expect this to cost points on those specific dimensions. Everything else —
backend architecture, validation, component reusability, responsiveness as a general
property (not matched to specific breakpoints from the design), code quality — is built
to the same standard it would be either way.

## Project structure

```
apps/
  api/    NestJS backend (auth, tasks, Prisma)
  web/    Next.js frontend (App Router, Tailwind)
```

## Features implemented

- Guest login (enter a name → JWT issued, no password)
- Task CRUD: create, edit, delete, move between statuses
- Kanban board with To Do / In Progress / Done columns
- Priority levels (Low / Medium / High) with color badges
- Due dates
- Light/dark theme toggle, **persisted across refresh** via `localStorage`, with a
  blocking inline script in `app/layout.tsx` to prevent a flash of the wrong theme
- Responsive layout (columns stack vertically on mobile, side-by-side on desktop)
- Reusable UI components (`Button`, `Input`, `Textarea`, `Modal`)
- Backend validation via NestJS `class-validator` DTOs + global `ValidationPipe`
- Tasks scoped per-user (JWT-protected routes, ownership checks on every mutation)

## Local setup

### Prerequisites
- Node.js 18+
- npm

### 1. Install dependencies
```bash
cd ablespace-task-manager
npm install --workspaces
```

### 2. Backend setup
The committed `schema.prisma` targets PostgreSQL (matching the production deployment).
To run locally, either point `DATABASE_URL` in `apps/api/.env` at your own local/cloud
Postgres instance, or switch `provider = "postgresql"` back to `provider = "sqlite"` in
`apps/api/prisma/schema.prisma` for quick local testing (delete the `prisma/migrations`
folder first if you switch providers, since migration history is provider-specific).

```bash
cd apps/api
cp .env.example .env
# edit .env: set DATABASE_URL to your own Postgres (or switch schema to sqlite first)
npx prisma migrate dev --name init
npm run start:dev
```
API runs at `http://localhost:4000/api`.

### 3. Frontend setup (in a new terminal)
```bash
cd apps/web
cp .env.example .env
npm run dev
```
App runs at `http://localhost:3000`.

### 4. Try it
Open `http://localhost:3000`, enter any name, click "Continue as Guest", and start
creating tasks.

## Deployment

This project is deployed on **Render** (all three pieces — Postgres, backend, frontend —
in one dashboard).

### Database
A Render PostgreSQL instance provisions `DATABASE_URL` automatically. `schema.prisma` is
set to `provider = "postgresql"` to match.

### Backend (`ablespace-task-api`)
- Root Directory: `apps/api`
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm run start`
- Environment variables: `DATABASE_URL` (Render Postgres external URL, with
  `?sslmode=require` appended), `JWT_SECRET`, `CORS_ORIGIN` (set to the frontend's URL,
  no trailing slash)

### Frontend (`ablespace-task-web`)
- Root Directory: `apps/web`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Environment variable: `NEXT_PUBLIC_API_URL` (the backend's URL + `/api`)

**Note:** `NEXT_PUBLIC_*` variables are baked into the build at build time, not read at
runtime — if you change one, trigger a full rebuild, not just a restart, or the old value
will still be in the deployed bundle.

Live URLs for this deployment are at the top of this README under **Live Demo**.

## Documented deviations from Figma

This project was built without following the Figma design. The visual design (layout,
colors, typography, icons, spacing, illustrations) is original and was not matched
against the provided design file. All functional requirements — task CRUD, guest login,
theme switching with persistence, responsive layout — are implemented; only visual
fidelity to the specific Figma mockups is out of scope for this submission.

## Part 2 — Product Understanding

See `part-2-caseload-writeup.md` in this repo for the Take Data / Caseload workflow
write-up and suggested UX/functionality improvements.