# HR Workflow Designer

A full-stack application for HR teams to **design, configure, and simulate** internal workflows (onboarding, leave approval, document checks, and similar processes) on a **drag-and-drop canvas** powered by [React Flow](https://reactflow.dev/). The stack uses a **React + Vite** SPA, an **Express.js** REST API, and **MongoDB** for persistence.

---

## Production deployment

| Service | URL |
|--------|-----|
| **Frontend (Railway)** | [https://frontend-production-ca54.up.railway.app](https://frontend-production-ca54.up.railway.app) |

Configure the backend API URL at **build time** via `VITE_API_BASE_URL` so the deployed UI calls your live API (`https://<your-api-host>/api/...`). Ensure the backend’s **`FRONTEND_URL`** (or **`FRONTEND_URLS`**) includes `https://frontend-production-ca54.up.railway.app` so CORS allows the browser.

---

## Architecture

### High-level view

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                             │
│  React · Vite · Zustand · React Flow · react-hook-form + zod     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS  (axios → /api/*)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express.js API (Node.js)                       │
│  REST routes under /api · CORS · Helmet · JSON body              │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                   │
│  Workflows · AutomationAction (seeded defaults)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Responsibilities

- **Frontend**  
  - Visual workflow editor: palette → canvas (nodes/edges), side panel for node configuration, top bar for save/export/simulate.  
  - Client state lives in **Zustand**; server persistence goes through **axios** to `/api/workflows`.  
  - **Simulation** can call `POST /api/simulate` with the current graph (no DB read required for the dry run).

- **Backend**  
  - **CRUD** for workflows (`/api/workflows`).  
  - **Automations catalog** (`/api/automations`) with optional seed data when the collection is empty.  
  - **Simulation** (`/api/simulate`): validates graph shape (single start, end, connectivity, cycle detection via topological ordering) and returns ordered steps.  
  - **Health** (`/api/health`) for load balancers and Railway checks.

- **Data**  
  - Workflows store React Flow–compatible **nodes** (id, type, position, `data`) and **edges**.  
  - Automation definitions are small metadata documents (`id`, `label`, `params`).

### Monorepo layout

The repo is a **pnpm workspace**: one lockfile, shared tooling, independent `backend` and `frontend` packages.

```text
Tredence_CaseStudy/
├── .github/workflows/     # CI: typecheck, lint, test, build, artifacts
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   └── index.ts       # App entry, CORS, /api/* mounting
│   ├── Dockerfile         # Build from repository root
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios client, /api prefix, typed calls
│   │   ├── components/    # Canvas, forms, palette, sandbox, UI
│   │   ├── hooks/         # Automations, simulate
│   │   ├── store/         # Zustand workflow store
│   │   └── types/         # Shared TS types for nodes
│   ├── Dockerfile
│   └── package.json
├── package.json           # Root scripts: dev, build, lint, test
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── .dockerignore
```

### API surface (contract)

All JSON APIs are under **`/api`**:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Liveness / readiness style check |
| `GET` | `/api/workflows` | List workflows |
| `GET` | `/api/workflows/:id` | Get one workflow |
| `POST` | `/api/workflows` | Create workflow |
| `PUT` | `/api/workflows/:id` | Update workflow |
| `DELETE` | `/api/workflows/:id` | Delete workflow |
| `GET` | `/api/automations` | List automation actions (seed if empty) |
| `POST` | `/api/simulate` | Run simulation on posted nodes/edges |

The frontend uses **`VITE_API_BASE_URL`** as the **server origin only** (no `/api` suffix). Request paths are built as `${origin}/api/...` so they always align with Express mounts.

---

## Design choices

1. **Monorepo (pnpm)**  
   Single install, one CI pipeline, clear separation of `backend` and `frontend` without publishing shared packages. Types are duplicated at the edges (DTOs) rather than a shared package to keep deployment simple.

2. **Zustand over Redux**  
   Canvas state (nodes, edges, selection) is local and updates often; Zustand keeps logic readable with minimal boilerplate and works naturally with React Flow’s controlled mode.

3. **React Hook Form + Zod**  
   Node configuration forms need validation and dynamic fields (e.g. key/value lists, automation params). RHF limits re-renders; Zod encodes schemas close to the UI.

4. **React Flow**  
   Industry-standard graph editor for React: built-in pan/zoom, minimap, and custom node types. Custom nodes are thin presentational components; data is normalized in the store.

5. **Simulation on the server**  
   Topological sort (Kahn-style ordering) detects cycles and produces a deterministic step list. Keeps validation logic in one place and matches “HR wants a trustworthy dry run” expectations.

6. **Automations seeded in MongoDB**  
   First `GET /api/automations` can insert default rows if the collection is empty, avoiding hardcoded lists in the frontend while still allowing DB-backed edits later.

7. **Docker from repo root**  
   Dockerfiles expect **`pnpm-workspace.yaml`** and **`pnpm-lock.yaml`** at the build context root so each service image installs only the workspace slice it needs.

8. **Production frontend container**  
   Static `dist/` is served with **`serve`**, binding to **`PORT`**, which matches Railway and similar platforms better than a fixed nginx `:80` only.

9. **CORS**  
   `FRONTEND_URL` or comma-separated `FRONTEND_URLS` whitelist the SPA origin(s). The production frontend URL must be listed when deploying.

10. **No `PORT` in backend `.env` for hosted environments**  
    Platforms inject `PORT`; duplicating it in `.env` can cause conflicts (e.g. Vercel/Railway).

---

## Assumptions

1. **MongoDB is available** to the API at runtime; workflow and automation features require a valid `MONGO_URI` with permissions to read/write the chosen database.

2. **Users are trusted HR admins**; there is no authentication/authorization layer in this codebase. Any client that can reach the API can call it unless protected by network or gateway rules.

3. **Workflow graphs** are edited as a single canvas per save; concurrent editing by multiple users is not handled (no locking or real-time merge).

4. **Simulation** is illustrative: steps are ordered and validated structurally (start/end counts, connectivity, cycles) but do not execute real emails, Slack, or HRIS integrations.

5. **Node `data` payloads** are stored as flexible objects in MongoDB (`Mixed`); the UI assumes the shapes defined in the frontend TypeScript types for each node type.

6. **API base URL** for the SPA is fixed at **build time** (`VITE_API_BASE_URL`). Changing the API host after build requires a new frontend build.

7. **HTTPS and DNS** for production are assumed to be configured by the host (e.g. Railway); the README documents the provided frontend hostname.

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| UI | React 18, TypeScript, Vite 5, Tailwind CSS |
| Canvas | React Flow 11 |
| State | Zustand |
| Forms | react-hook-form, Zod, @hookform/resolvers |
| HTTP | axios |
| API | Express.js, Mongoose, Helmet, CORS, morgan |
| DB | MongoDB |
| Tooling | pnpm workspaces, ESLint, Vitest (frontend), GitHub Actions CI |

---

## Local development

1. Copy environment templates:

   ```bash
   cp backend/.env.example backend/.env    # set MONGO_URI; do not set PORT for hosted deploys
   cp frontend/.env.example frontend/.env   # VITE_API_BASE_URL=http://localhost:4000
   ```

2. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)  
   - API: [http://localhost:4000](http://localhost:4000) (default; `PORT` may override locally if set by the shell)

3. Quick checks:

   - `GET http://localhost:4000/api/health` → `{ "ok": true, ... }`  
   - If workflow list fails with MongoDB authorization errors, fix `MONGO_URI` user privileges or use a local MongoDB without auth for development.

---

## Production builds

```bash
pnpm install
pnpm build
```

- Backend output: `backend/dist/` — run with `pnpm --filter backend start` after build.  
- Frontend output: `frontend/dist/` — static assets; production Docker image serves them with `serve`.

---

## Deployment (Railway)

- **Build context** for Docker must be the **repository root** (where `pnpm-workspace.yaml` lives).  
- **Backend**: Dockerfile path `backend/Dockerfile`; set `MONGO_URI`, `FRONTEND_URL` or `FRONTEND_URLS` (include the production frontend URL above).  
- **Frontend**: Dockerfile path `frontend/Dockerfile`; set build-time `VITE_API_BASE_URL` to your **API origin** (scheme + host, no `/api` path).  

Example local image build:

```bash
docker build -f backend/Dockerfile -t hr-api .
docker build -f frontend/Dockerfile --build-arg VITE_API_BASE_URL=https://YOUR-API.up.railway.app -t hr-ui .
```

### Other hosts (e.g. Vercel)

- Do not set `PORT` in backend `.env` when the platform assigns it.  
- Deploying the Express app on Vercel typically requires a serverless adapter or running the API on a Node-friendly service; the SPA can be deployed as static files separately.

---

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs on pushes/PRs:

- TypeScript `tsc --noEmit` for backend and frontend  
- ESLint  
- Vitest (frontend)  
- Production builds and uploads `frontend/dist` as an artifact  

---

## Roadmap (possible extensions)

- Authentication (JWT/OAuth) and role-based access  
- Undo/redo (e.g. Immer + Zustand middleware)  
- Workflow versioning and audit history  
- Real-time collaboration (WebSockets)  
- Storybook and E2E tests (Playwright)

---

## License

Private / project use unless otherwise specified.
