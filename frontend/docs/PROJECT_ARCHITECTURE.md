# Project Architecture

## Purpose

Define the architectural model, layer boundaries, and dependency flow for the SNM Medical frontend so all contributors build consistently and the system scales safely.

## Scope

Applies to all code under `src/`. Covers public site, legacy protected routes, and the administrator portal.

---

## Architecture Overview

The codebase uses a **hybrid Feature-Sliced Design (FSD)–inspired** layout:

```
src/
├── app/           Application bootstrap, store, router registry, providers
├── routes/        Route composition arrays and guards
├── pages/         Thin lazy-loaded route entry points
├── features/      Legacy business capabilities (public + protected)
├── features/admin/admin/  Administrator portal
├── widgets/       Composite UI blocks (header, footer, camp-listing)
├── entities/      Domain models, auth slice, mappers
├── shared/        Cross-cutting API, UI, hooks, constants, errors
├── assets/        Static asset exports
└── lib/           Legacy re-export aliases
```

### Dependency Flow (allowed direction)

```
app → routes → pages → features/widgets → entities → shared
modules/admin → entities → shared (may NOT import from features/)
```

**Rule:** Lower layers must never import from higher layers. `shared/` must not import from `features/` or `modules/`.

---

## Three UX Shells

| Shell | Trigger | Providers | Navigation |
|-------|---------|-----------|------------|
| Public + Legacy | All paths except `/admin/*` | `AppProviders` | Site header dropdown |
| Admin Panel | `pathname.startsWith('/admin')` | `AdminProviders` | Sidebar |

`App.tsx` switches shells based on pathname — do not add a fourth shell without architectural review.

---

## Layer Responsibilities

### `app/` — Application Core

- Redux store configuration (`store.ts`, `rootReducer.ts`)
- Global providers (`AppProviders.tsx`)
- Centralized router registry (`router/routePaths.ts`, `router/*Entries.ts`)
- Route metadata and auth redirects

### `routes/` — Route Wiring

- `AppRoutes.tsx` — composes Public, Protected, Admin routes
- `ProtectedRoute.tsx` — shared auth + role guard
- `AuthRedirect.tsx` — guest-only login redirect
- Does **not** contain business logic

### `pages/` — Route Adapters

Thin re-exports only. One file per route entry:

```tsx
// src/pages/public/login/index.tsx
export { default } from "@features/login";
```

### `features/` — Legacy Business Modules

Self-contained capabilities with `index.tsx`, `hooks/`, `services/`, `components/`.

Used for: login, register, public pages, legacy `/ms/*` and `/admin/*` screens.

### `modules/admin/` — Bounded Admin Sub-App

Self-contained module with its own UI kit, layout, providers, and config-driven patterns (`EntityListPage`, `createMasterConfig`).

**All new administrator features go here**, not in `features/admin/`.

### `widgets/` — Composite UI

Reusable composed blocks spanning multiple features: header, footer, camp-listing, dashboard-shell.

### `entities/` — Domain Layer

- `session/` — canonical auth slice (`authSlice`)
- `registration/` — form data mappers
- `camp/` — localStorage-backed camp store

Domain logic without UI. Redux slices live here when globally shared.

### `shared/` — Infrastructure

API (`baseApi`), form fields, shadcn UI, constants, error boundaries, hooks, utilities.

---

## Admin vs Medical Staff

| Role | Constant | Default Post-Login | Primary Experience |
|------|----------|-------------------|-------------------|
| Medical Staff | `SNM_MS_USERTYPE` (`"ms"`) | `/ms-admin/dashboard` | `features/admin/medical-staff/` |
| Administrator | `SNM_ADMIN_USERTYPE` (`"admin"`) | `/admin/dashboard` | `features/admin/admin/` |

Legacy `/admin/*` routes remain for backward compatibility but are not the default admin destination.

---

## Scalability Strategy

1. **Route registry** — config-driven route entries in `@app/router`
2. **Lazy loading** — all protected and administrator portal pages are code-split
3. **Manual chunks** — administrator portal isolated in `vite.config.ts`
4. **RTK Query** — single `baseApi` with feature-colocated endpoint injection
5. **Module boundaries** — new bounded contexts go in `modules/<name>/`
6. **Minimal Redux** — only auth + API cache in global store

---

## Rules

1. New public features → `features/` + `pages/public/` + `PublicRoutes.tsx`
2. New MS features → `features/` + `pages/protected/ms/` + `protectedRouteEntries.ts`
3. New administrator features → `features/admin/admin/features/` + `adminRouteEntries.ts`
4. New MS admin features → `features/admin/medical-staff/` + `protectedRouteEntries.ts`
5. Auth state lives only in `@entities/session` — not in feature-local Redux
6. API endpoints inject into `baseApi` — never create separate API slices

---

## Best Practices

- Copy the closest existing feature as a template before starting
- Keep `pages/` as one-line re-exports
- Colocate API services with the feature that owns them
- Use path aliases (`@shared`, `@features`, `@admin`) — never deep relative imports across layers

---

## Do's

- ✅ Register routes in central `@app/router` config arrays
- ✅ Use `ProtectedRoute` for all authenticated pages
- ✅ Import paths from `@app/router/routePaths` or `@shared/constants`
- ✅ Put cross-feature UI in `shared/` or `widgets/`

---

## Don'ts

- ❌ Do not add business logic to `routes/` or `pages/`
- ❌ Do not import `features/` from `modules/admin/`
- ❌ Do not create a second auth slice — use `@entities/session`
- ❌ Do not hardcode route path strings — use constants

---

## Common Mistakes

| Mistake | Correct Approach |
|---------|-----------------|
| Adding admin feature to `features/admin/` | Use `modules/admin/features/` |
| Hardcoding `/admin/dashboard` | Import `ROUTE_ADMIN_DASHBOARD` |
| Creating new Redux slice for UI state | Use local `useState` or RTK Query cache |
| Importing admin portal UI in public site | Keep UI kits separate |

---

## Recommended Patterns

### Config-driven CRUD (admin portal)

```tsx
// modules/admin/features/master/city/index.tsx
export function MasterCity() {
  return <EntityListPage config={cityConfig} />;
}
```

### Feature-colocated API

```tsx
// features/login/services/loginApi.ts
export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({ /* ... */ }),
  }),
});
```

### Thin page wrapper

```tsx
export { default } from "@features/contact";
```
