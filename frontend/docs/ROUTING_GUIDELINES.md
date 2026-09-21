# Routing Guidelines

## Purpose

Ensure all routing is centralized, consistent, and role-aware. Prevent duplicate routing systems.

## Scope

All route definitions, navigation config, guards, redirects, and lazy loading.

---

## Centralized Router (`@app/router`)

All route paths and registrations flow through `src/app/router/`:

| File | Responsibility |
|------|----------------|
| `routePaths.ts` | **Single source of truth** for all path strings |
| `authRedirects.ts` | Post-login redirect by role |
| `protectedRouteEntries.ts` | Legacy `/ms/*` + `/admin/*` route config |
| `adminRouteEntries.ts` | `/admin/*` child route config (Administrator Portal) |
| `createProtectedRoute.tsx` | Factory for legacy protected routes |
| `createAdminRoutes.tsx` | Factory for admin portal nested routes |
| `routeMeta.ts` | Access metadata (roles, titles, layout) |
| `index.ts` | Public barrel export |

---

## Route Path Constants

**Always import paths — never hardcode strings.**

```tsx
// ✅ Correct
import { ROUTE_ADMIN_DASHBOARD } from "@app/router/routePaths";
import { SNM_NAV_MS_DASHBOARD_LINK } from "@shared/constants";

// ❌ Wrong
navigate("/admin/dashboard");
```

### Path Prefixes

| Prefix | Role(s) | Experience |
|--------|---------|------------|
| `/ms-admin/*` | `ms` | Medical Staff Admin (header nav) |
| `/admin/*` | `admin` | Administrator Portal (sidebar) |

Legacy redirects preserve old bookmarks: `/ms/*` → `/ms-admin/*`, `/admin/*` → `/admin/*`.

---

## Route Registration

### Public routes

Add to `src/routes/PublicRoutes.tsx`:

```tsx
<Route
  path={SNM_NAV_CONTACT_LINK}
  element={withPageErrorBoundary(<Contact />, "contact")}
/>
```

### Legacy protected routes

Add entry to `protectedRouteEntries.ts`:

```tsx
{
  path: ROUTE_MS_DASHBOARD,
  name: "ms-dashboard",
  loader: () => import("@pages/protected/ms/dashboard"),
}
```

Also add metadata to `routeMeta.ts` with `requiredRoles`.

### administrator portal routes

Add entry to `adminRouteEntries.ts`:

```tsx
{
  path: "users",
  name: "admin-users",
  loader: () => import("@admin/features/users").then(m => ({ default: m.Users })),
}
```

administrator portal features use **named exports**, not default exports.

---

## Protected Routes

All authenticated routes must use `ProtectedRoute`:

```tsx
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminLayout />
</ProtectedRoute>
```

Behavior:
- Not signed in → redirect to `/login` (saves `from` in location state)
- Wrong role → redirect to `/` (home)

---

## Role-Based Redirects

Use `getDefaultRouteForUserType()` from `@app/router/authRedirects`:

| Role | Redirect |
|------|----------|
| `ms` | `/ms-admin/dashboard` |
| `admin` | `/admin/dashboard` |

Used in:
- `features/login/hooks/useLoginForm.ts`
- `routes/AuthRedirect.tsx`

**Do not duplicate redirect logic elsewhere.**

---

## Lazy Loading

All protected and administrator portal pages must be lazy-loaded:

```tsx
// Legacy — via loader in route entry
loader: () => import("@pages/protected/admin/dashboard")

// Admin panel — via lazy in factory
const Page = lazy(loader);
```

`AppRoutes.tsx` wraps all routes in `<Suspense fallback={<LoadingSpinner />}>`.

---

## Navigation Configuration

| Shell | Config File | Pattern |
|-------|-------------|---------|
| Legacy header nav | `shared/config/navlinks.ts` | `NavLink[]` filtered by `userType` |
| Admin panel sidebar | `@admin/components/layout/data/sidebar-data.ts` | Grouped items with icons |

Both must import paths from `@app/router/routePaths` or re-exported constants — not hardcoded strings.

Navigation is **configuration-driven**. Add new items to the config array; do not hardcode links in components.

---

## Layout Routes

| Layout | Used By | Location |
|--------|---------|----------|
| Site shell (Header + Footer) | Public, `/ms/*`, `/admin/*` | `App.tsx` |
| `AdminLayout` (sidebar) | `/admin/*` | `@admin/layouts/AdminLayout.tsx` |
| `DashboardLayout` | Legacy dashboard pages | `shared/components/Dashboard/` |

Layout selection happens at the route/shell level — not inside individual page components (except legacy `DashboardLayout` wrapper).

---

## Rules

1. **One routing system** — extend `@app/router`, never create parallel route files
2. All paths in `routePaths.ts`
3. All new routes lazy-loaded
4. All authenticated routes guarded by `ProtectedRoute`
5. Post-login redirects only via `getDefaultRouteForUserType()`
6. Register administrator portal routes in `adminRouteEntries.ts` only

---

## Do's

- ✅ Add `routeMeta` entry when adding protected routes
- ✅ Use `RouteErrorBoundary` / `withPageErrorBoundary` for error isolation
- ✅ Re-export administrator portal constants from central paths

---

## Don'ts

- ❌ Never define `<Route>` inside feature components
- ❌ Never create a second router or `BrowserRouter`
- ❌ Never hardcode role checks without `ProtectedRoute`
- ❌ Never add a third admin routing prefix without architecture review

---

## Common Mistakes

| Mistake | Consequence |
|---------|-------------|
| Hardcoded path in navigate() | Breaks on path changes |
| Missing `routeMeta` entry | No document title / inconsistent metadata |
| Default export in administrator portal feature | Breaks lazy loader `.then(m => ({ default: m.X }))` |
| Duplicate route in PublicRoutes and ProtectedRoutes | Unpredictable matching |

---

## Recommended Patterns

### Adding a new admin portal page (checklist)

1. Create feature in `modules/admin/features/<name>/index.tsx`
2. Add entry to `adminRouteEntries.ts`
3. Add path constant to `routePaths.ts` (if new path segment)
4. Add sidebar entry to `sidebar-data.ts`
5. Add `routeMeta` entry with `requiredRoles: ["admin"]`
