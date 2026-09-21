# Architecture Baseline (Phase 0)

Captured: 2026-06-13

## Stack

| Layer | Technology |
|-------|------------|
| Build | Vite 7, TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, Radix UI |
| State | Redux Toolkit, RTK Query, redux-persist |
| Routing | React Router 7 (lazy-loaded routes) |
| Forms | React Hook Form |

## Build Output (baseline)

| Chunk | Raw size | Gzip |
|-------|----------|------|
| Largest vendor chunk (`vendor-*.js`) | 478 kB | 155 kB |
| Previous largest entry (pre-split) | 664 kB | 216 kB |
| Admin master-search | 65 kB | 19 kB |
| Registration form mappers | 16 kB | 5 kB |

Build command: `npm run build` — passes with `strict: false` (`tsconfig.json`).

## Lint Status (baseline)

- **449 problems** (207 errors, 242 warnings) via `npm run lint`
- Primary debt: `@typescript-eslint/no-explicit-any`, `no-unsafe-*`, unused vars, React 19 `forwardRef` warnings in shadcn UI primitives
- Strict config exists in `tsconfig.app.json` but is not used by the build

## Route Map

### Public

| Path | Feature |
|------|---------|
| `/` | landing-page |
| `/blood-donation` | blood-donation |
| `/free-health-checkups` | free-health-checkups |
| `/patient-registration` | patient-registration |
| `/contact` | contact |
| `/login` | login (guest-only via AuthRedirect) |
| `/register` | register |
| `/forgot-password` | forgot-password |

### Protected

| Path | Roles | Feature |
|------|-------|---------|
| `/ms/dashboard` | ms | msdashboard |
| `/ms/update-profile` | ms, admin | update-profile |
| `/admin/dashboard` | admin | admin/dashboard |
| `/admin/duty-chart` | admin | admin/duty-chart |
| `/admin/update-profile` | admin | update-profile |
| `/admin/master-search` | admin | admin/master-search |
| `/admin/daily-report` | admin | admin/daily-report |
| `/admin/registration-report` | admin | admin/registration-report |
| `/admin/master-report` | admin | admin/master-report |

## API Contracts (RTK Query via `baseApi.injectEndpoints`)

| Module | Endpoints |
|--------|-----------|
| loginApi | `POST /api/auth/login` |
| CommonApi | registration dropdown, cities-by-state |
| RegisterApi | `POST /api/user/register` |
| UpdateProfileApi | `PUT /api/user/update`, `GET /api/user/:id` |
| AdminApi | dashboard stats, user details |
| MasterSearchApi | `POST /api/search/master`, approve, export, update-role |
| ForgotPasswordApi | forgot/reset password |

Auth: Bearer token from `state.auth.token`; auto sign-out on 401/403.

## Current `src/` Layout

```
src/
  app/          — store, providers, router meta, error boundary
  routes/       — public/protected route definitions
  pages/        — route-level composition (thin wrappers)
  widgets/      — header, footer, dashboard-shell, registration-wizard
  features/     — business capabilities
  entities/     — session, registration mappers
  shared/       — api, ui primitives, hooks, lib, constants, types
```

## Migration Status

| Phase | Status |
|-------|--------|
| 0 — Baseline | Done (this document) |
| 1 — Providers, hooks, error boundary, route meta, base API | Done |
| 2 — Single `baseApi` with endpoint injection | Done |
| 3 — Entity extraction, form mappers | Done |
| 4 — SOLID component splits, widget migration | Done (Header, MasterSearch) |
| 5 — Master-search server paging, debounce, chunk splitting | Done (vendor chunks) |
| 6 — Tests, strict TS, observability | In progress (8 unit tests added) |

## Known Gaps

1. `redux-persist` configured but `PersistGate` was missing from providers (fixed in Phase 1).
2. `routeMeta` existed but was not consumed by route guards (fixed in Phase 1).
3. Export endpoint uses a high `limit` for full-dataset export (server-side; not client pagination).
4. Largest bundle chunk (~664 kB) needs vendor splitting.
5. No automated tests yet.
