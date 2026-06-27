# Folder Structure

## Purpose

Define where every type of file belongs to prevent inconsistent organization as the project grows.

## Scope

All files under `src/`. Applies when creating new features, modules, components, or utilities.

---

## Top-Level Map

```
src/
├── app/                    # Bootstrap, store, router registry, providers
│   ├── providers/
│   ├── router/             # routePaths, route entries, factories, routeMeta
│   ├── store/
│   ├── App.tsx
│   ├── rootReducer.ts
│   └── store.ts
│
├── routes/                 # Route arrays, ProtectedRoute, AuthRedirect
│   ├── AppRoutes.tsx
│   ├── PublicRoutes.tsx
│   ├── ProtectedRoutes.tsx
│   ├── ProtectedRoute.tsx
│   └── AuthRedirect.tsx
│
├── pages/                  # Thin route entry re-exports ONLY
│   ├── public/
│   └── protected/
│       ├── ms-admin/       # Medical Staff admin routes
│       └── update-profile/
│
├── features/
│   ├── login/
│   ├── register/
│   ├── admin/
│   │   ├── medical-staff/  # MS admin (header nav) — dashboard, reports, etc.
│   │   └── admin/          # Administrator portal (sidebar) — users, master CRUD, etc.
│   └── ...
│
├── widgets/                # Composite UI (header, footer, camp-listing)
├── entities/               # Domain: session, registration, camp
├── shared/                 # Cross-cutting infrastructure
├── assets/                 # Static images/icons exports
└── lib/                    # Legacy alias re-exports
```

---

## Where to Create New Code

| What you're building | Location |
|---------------------|----------|
| New public page | `features/<name>/` + `pages/public/<name>/` |
| New MS admin page | `features/admin/medical-staff/<name>/` + `pages/protected/ms-admin/` |
| New administrator portal page | `features/admin/admin/features/<name>/` + `adminRouteEntries.ts` |
| Administrator portal UI | `features/admin/admin/components/ui/` (alias: `@admin`) |
| Shared hook | `shared/hooks/` |
| Feature-specific hook | `features/<name>/hooks/` or `@admin/hooks/` |
| RTK Query endpoints | `features/<name>/services/` or `shared/services/` |
| Redux slice (global) | `entities/<domain>/model/` |
| Domain types | `entities/<domain>/` or feature `type.ts` |
| Route constants | `@app/router/routePaths.ts` |
| Nav labels + links | `@shared/constants/index.ts` |
| Error boundary | `shared/error/` |
| Utility function | `shared/lib/` |
| Static assets | `src/assets/` or `public/` |
| Unit tests | Colocated: `<file>.test.ts(x)` next to source |

---

## Feature Module Structure (Legacy)

```
features/<feature-name>/
├── index.tsx              # Default export page component
├── type.ts                # Feature-specific types
├── hooks/
│   └── use<Feature>Form.ts
├── services/
│   └── <feature>Api.ts    # baseApi.injectEndpoints
└── components/
    └── <Component>.tsx
```

---

## Admin Panel Feature Structure

```
modules/admin/features/<feature-name>/
├── index.tsx              # Named export (e.g. export function Dashboard)
├── components/            # Feature-specific sub-components
├── data/                  # Static/mock data, configs
└── <config>.ts            # Entity list or camp config
```

For CRUD master data:

```
modules/admin/features/master/<entity>/
└── index.tsx              # ~25 lines: EntityListPage + createMasterConfig
```

---

## Pages Directory Rules

**Pages are route adapters only.** Maximum one re-export line:

```tsx
export { default } from "@features/login";
```

Do not add hooks, state, or layout logic to `pages/`.

---

## Shared Layer Structure

```
shared/
├── api/           baseApi.ts, errors.ts
├── components/
│   ├── FormInputs/    TextField, SelectField, etc.
│   ├── ui/            shadcn primitives (legacy shell)
│   ├── Dashboard/     DashboardLayout
│   ├── Registration/  Multi-step wizard steps
│   └── DataTable/     Legacy data table
├── config/        navlinks.ts
├── constants/     Site labels, nav links (re-export route paths)
├── error/         Error boundaries, fallbacks, logger
├── hooks/         useProfileWizardForm, etc.
├── lib/           utils, formValidation, toast, monitoring
├── services/      CommonApi (shared endpoints)
├── styles/
└── types/         NavLinksType, CommonType
```

---

## Path Aliases

| Alias | Path |
|-------|------|
| `@app/*` | `src/app/*` |
| `@routes/*` | `src/routes/*` |
| `@pages/*` | `src/pages/*` |
| `@features/*` | `src/features/*` |
| `@widgets/*` | `src/widgets/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*` | `src/shared/*` |
| `@admin/*` | `src/features/admin/admin/*` |
| `@assets/*` | `src/assets/*` |
| `@lib/*` | `src/lib/*` |

---

## Rules

1. Never create `src/components/` at root — use `shared/` or feature-local `components/`
2. Never put business logic in `pages/`
3. Route paths defined once in `@app/router/routePaths.ts`
4. admin portal must not import from `@features/`
5. Tests colocated with source files (`*.test.ts`)

---

## Do's

- ✅ Mirror the nearest existing feature's folder structure
- ✅ Colocate services with the feature that owns the API
- ✅ Put cross-feature utilities in `shared/lib/`

---

## Don'ts

- ❌ Do not create `utils/` at project root outside `shared/lib/`
- ❌ Do not duplicate constants across features
- ❌ Do not nest features inside other features

---

## Common Mistakes

| Mistake | Correct Location |
|---------|-----------------|
| API file in `shared/services/` for one feature | `features/<name>/services/` |
| Page with 100 lines of logic | Move to `features/<name>/index.tsx` |
| New route path in feature file | `@app/router/routePaths.ts` |
| Admin UI component in `shared/` | `@admin/components/` |

---

## Recommended Patterns

When unsure, find the closest existing feature and replicate its folder layout exactly.
