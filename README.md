# TaskFlow — Task Management System

A modern, responsive task management application built as a frontend-only submission for the Greening India mid-level engineering assignment.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 19 + TypeScript | Type safety, modern hooks API |
| **Build Tool** | Vite | Fast HMR, native ESM, minimal config |
| **Routing** | React Router v7 | Declarative, nested routes with layout support |
| **UI Components** | shadcn/ui + Tailwind CSS v4 | Accessible, composable primitives — no runtime overhead |
| **HTTP Client** | Axios | Interceptors for JWT injection and 401 handling |
| **Icons** | Lucide React | Lightweight, tree-shakeable icon set |
| **Mock API** | MSW (Mock Service Worker) | Intercepts network requests at the service worker level — service layer code is identical to what a real backend integration would use |

## Architecture Decisions

- **Flat structure over deep nesting** — `pages/`, `services/`, `context/`, `components/` at the top level. No `features/` folders or barrel files for a project this size.
- **Services return data, not Axios responses** — components never touch `response.data`. Easy to swap MSW for a real backend with zero component changes.
- **Auth via React Context** — a single global concern doesn't need Redux. JWT stored in `localStorage`, persisted across refreshes.
- **MSW for mocking** — chosen over `json-server` because it intercepts real `fetch`/`axios` calls in the browser. The service layer stays production-ready; only `main.tsx` bootstraps the worker.
- **Optimistic UI** — task status changes update instantly and revert on error.
- **Co-located routing** — all routes visible in one `App.tsx`. No route config abstraction.

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── layout.tsx           # App shell — navbar + content outlet
│   ├── navbar.tsx           # Top nav with user name + logout
│   ├── protected-route.tsx  # Auth gate — redirects to /login
│   └── task-modal.tsx       # Create/edit task dialog
├── context/
│   └── auth.tsx             # AuthProvider + useAuth hook
├── hooks/
│   └── use-async.ts         # Generic loading/error/data state
├── mocks/
│   ├── browser.ts           # MSW worker setup
│   ├── data.ts              # Seed data (users, projects, tasks)
│   └── handlers.ts          # Mock API route handlers
├── pages/
│   ├── login.tsx            # Login & Register with validation
│   ├── projects.tsx         # Projects list + create dialog
│   └── project-detail.tsx   # Tasks list, filters, CRUD
├── services/
│   ├── api.ts               # Axios instance + JWT interceptor
│   ├── auth.ts              # login(), register()
│   ├── projects.ts          # CRUD for projects
│   └── tasks.ts             # CRUD for tasks
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── App.tsx                  # Router + route definitions
├── main.tsx                 # Entry point — boots MSW then renders
└── index.css                # Tailwind + shadcn theme
```

## Running Locally

```bash
# Clone the repo
git clone https://github.com/MilindGupta-Creator/Green-India-Assgn.git
cd Green-India-Assgn

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Test Credentials

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `password123` |

You can also register a new account via the sign-up form.

## Mock API

This submission uses **MSW (Mock Service Worker)** to mock all backend endpoints at the network level. No separate server process is needed.

**Endpoints mocked:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with credentials |
| GET | `/projects` | List all projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project with tasks |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/projects/:id/tasks` | List tasks (filterable by status, assignee) |
| POST | `/projects/:id/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## Features

- **Authentication** — login/register with client-side validation, JWT persistence, protected routes
- **Projects** — list, create, navigate to detail view
- **Tasks** — create, edit, delete with modal form; filter by status and assignee
- **Optimistic UI** — task status changes reflect instantly, revert on failure
- **Loading & error states** — spinners, error messages with retry, empty state illustrations
- **Responsive** — works at 375px (mobile) and 1280px (desktop)

## What I'd Do With More Time

- **Drag-and-drop** — Kanban board view with `@dnd-kit` for reordering tasks across status columns
- **Dark mode** — toggle persisted in `localStorage`, already partially supported by shadcn theme
- **Real-time updates** — WebSocket/SSE integration for multi-user collaboration
- **Pagination** — for projects and tasks lists at scale
- **E2E tests** — Playwright tests covering auth flow, project CRUD, and task management
- **Proper user management** — assignee dropdown populated from project members instead of raw user IDs
