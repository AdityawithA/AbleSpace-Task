# AbleSpace Task Manager

# AbleSpace Task Manager

Full-stack Task Management app for AbleSpace's Fresher assessment. Next.js + Tailwind
frontend, NestJS + Prisma backend, guest login with JWT, persistent light/dark theme,
kanban board with task CRUD. Built without matching the provided Figma — see below for
details.



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
```bash
cd apps/api
cp .env.example .env
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

### Backend → Railway or Render
1. Push this repo to GitHub.
2. Create a new Web Service, point it at `apps/api`.
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm run start`
5. Add environment variables: `DATABASE_URL` (a Postgres connection string — Railway/Render
   can provision one for you, or use [Neon](https://neon.tech)), `JWT_SECRET`, `CORS_ORIGIN`
   (your deployed frontend URL).
6. **Important:** if you switch to Postgres, change `provider = "sqlite"` to
   `provider = "postgresql"` in `apps/api/prisma/schema.prisma` before deploying, then run
   `npx prisma migrate deploy` against the production database.

### Frontend → Vercel
1. Import the repo into Vercel, set the root directory to `apps/web`.
2. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend
   (e.g. `https://your-api.up.railway.app/api`).
3. Deploy.

Keep both deployments live for at least 45 days after submission, per the assignment
guidelines.

## Documented deviations from Figma

This project was built without following the Figma design. The visual design (layout,
colors, typography, icons, spacing, illustrations) is original and was not matched
against the provided design file. All functional requirements — task CRUD, guest login,
theme switching with persistence, responsive layout — are implemented; only visual
fidelity to the specific Figma mockups is out of scope for this submission.

## Part 2 — Product Understanding

See `part-2-caseload-writeup.md` in this repo for the Take Data / Caseload workflow
write-up and suggested UX/functionality improvements.
