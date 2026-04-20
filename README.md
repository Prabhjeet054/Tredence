# HR Workflow Designer

A full-stack visual workflow designer for HR teams built with React Flow, Express.js, and MongoDB.

## Repository layout

```
Tredence_CaseStudy/
├── .github/workflows/   # CI (and optional CD)
├── backend/             # Express + TypeScript API
├── frontend/            # Vite + React app
├── package.json         # Root scripts (pnpm dev, build, lint, test)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── .dockerignore        # Used for Docker builds from repo root
```

## Architecture

- **Frontend**: React + TypeScript + Vite, Zustand for state, React Flow for canvas, react-hook-form + zod for forms
- **Backend**: Express.js + TypeScript REST API
- **Database**: MongoDB (Mongoose ODM)
- **Monorepo**: pnpm workspaces (`backend` + `frontend` packages)

## How to Run

1. `cp backend/.env.example backend/.env` and fill in `MONGO_URI` (never add **`PORT`** here — platforms like Vercel and Railway set it; locally the API defaults to port **4000**).
2. `cp frontend/.env.example frontend/.env`
3. `pnpm install`
4. `pnpm dev` — starts both frontend (port 5173) and backend (port 4000)

### Verify the API

- `GET http://localhost:4000/api/health` — should return `{ "ok": true, ... }` (no database required).
- If `GET /api/workflows` returns **not authorized**, your `MONGO_URI` user cannot read that database. Use credentials with `readWrite` on the DB, or run a local MongoDB without authentication (for example `docker run -d --name mongo-dev -p 27017:27017 mongo:7` when nothing else is using port 27017).

## Production builds

From the repository root:

```bash
pnpm install
pnpm --filter backend build    # outputs backend/dist
pnpm --filter frontend build   # outputs frontend/dist
```

Or `pnpm build` (root `package.json` runs backend then frontend).

## Deploy on Railway

Use **two services** in one Railway project (or two projects): one for the API, one for the UI. **Build context must be the monorepo root** (where `pnpm-workspace.yaml` and `pnpm-lock.yaml` live).

### Backend (API) service

1. **Settings → Source**: connect this GitHub repo.
2. **Settings → Build**: builder **Dockerfile**, Dockerfile path **`backend/Dockerfile`**. Root directory **`.`** (repository root).
3. **Variables** (at minimum):
   - `MONGO_URI` — MongoDB Atlas or Railway MongoDB plugin connection string.
   - `FRONTEND_URL` — public URL of your frontend (e.g. `https://your-frontend.up.railway.app`) for CORS. You can use **`FRONTEND_URLS`** instead with comma-separated origins.
4. Railway sets **`PORT`** automatically; the server listens on **`0.0.0.0`**.
5. Optional health check path: **`/api/health`**.

Start command is defined by the image (`node backend/dist/index.js`). You can also run without Docker using **`pnpm --filter backend start`** after `pnpm --filter backend build`, with the same env vars.

### Frontend (static app) service

1. **Settings → Build**: builder **Dockerfile**, Dockerfile path **`frontend/Dockerfile`**. Root directory **`.`** (repository root).
2. **Variables** for **build time** (required): set **`VITE_API_BASE_URL`** to your backend **origin only** (no `/api` path), e.g. `https://your-api.up.railway.app`. The frontend always requests `${origin}/api/...`, matching Express. A legacy value ending in `/api` is normalized automatically.
3. The production image serves the SPA with **`serve`** and listens on **`PORT`** (Railway assigns this).

Local Docker smoke tests from repo root:

```bash
docker build -f backend/Dockerfile -t hr-api .
docker build -f frontend/Dockerfile --build-arg VITE_API_BASE_URL=http://localhost:4000 -t hr-ui .
```

### Vercel (and similar hosts)

- Do **not** put **`PORT`** in `backend/.env`. The platform sets `PORT` at runtime; defining it in `.env` can conflict with deployment.
- Prefer deploying the **Vite frontend** as a static site; run the **Express API** on a Node-friendly host (Railway, Render, Fly.io) or adapt it to Vercel serverless if you need API routes on Vercel.

## Design Decisions

- Monorepo for shared types and unified CI/CD
- Zustand chosen over Redux for lightweight, hook-friendly state with no boilerplate
- React Hook Form + Zod gives type-safe, performant forms without re-renders
- Simulate endpoint uses topological sort (Kahn's algorithm) for cycle detection and ordering
- Mock automations seeded in MongoDB on first call to avoid hardcoding

## What I'd add with more time

- Auth (JWT/OAuth)
- Undo/Redo with immer + zustand middleware
- Workflow versioning
- Real-time collaboration via WebSockets
- Storybook for component documentation
- E2E tests with Playwright
