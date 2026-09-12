# Frontend Audit Report — SNM Medical

**Date:** 2026-09-06
**Branch:** `SNM_medical_featur2.0`
**Scope:** `frontend/` — React 19 + TypeScript + Vite + Redux Toolkit + TanStack Table

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 **Error** | 14 | ☐ Pending |
| 🟠 **Warning** | 35+ | ☐ Pending |
| 🟡 **Potential Bug** | 8 | ☐ Pending |

---

## 🔴 Errors (Must Fix)

### E1. Fast Refresh — `react-refresh/only-export-components` (7 files)
**Files:**
- `src/app/router/createAdminRoutes.tsx:13`
- `src/features/admin/admin/components/ui/badge.tsx:45`
- `src/features/admin/admin/components/ui/button.tsx:61`
- `src/features/admin/admin/components/ui/form.tsx:156`
- `src/features/admin/admin/components/ui/sidebar.tsx:727`
- `src/features/admin/admin/context/direction-provider.tsx:49`
- `src/features/admin/admin/context/theme-provider.tsx:103`

**Fix:** Move non-component exports (functions, objects, providers) to a separate file (e.g., `constants.ts`, `config.ts`, or `utils.ts` alongside the component).

---

### E2. `src/entities/camp/store.ts:29` — Unused destructured variables
```ts
const { campType: _campType, status: _status, createdAt: _c, updatedAt: _u, ...camp } = record;
```
**Fix:** Use clean rest spread:
```ts
const { ...camp } = record;
```

---

### E3. `src/features/admin/admin/components/entity-list/column-helpers.tsx:95` — Unsafe `any` chain
**Fix:** Add type assertion:
```ts
const badgeColor = (statusBadgeMap.get(normalizedStatus) as string) ?? "";
```

---

### E4. `src/features/admin/admin/components/entity-list/column-helpers.tsx:113` — Unnecessary type assertion
**Fix:** Remove the redundant assertion.

---

### E5. `src/features/admin/admin/components/entity-list/entity-form-dialog.tsx:83` — Promise-returning function in `onSubmit`
**Problem:** Dialog closes before async `onSubmit` resolves.
**Fix:**
```ts
onSubmit={form.handleSubmit(async (values) => {
  if (onSubmit) { await onSubmit(values); }
  handleOpenChange(false);
})}
```

---

### E6. `src/features/admin/admin/components/sign-out-dialog.tsx:18` — Floating promise
**Problem:** `dispatch(signOut())` returns a Promise; navigation happens before sign-out completes.
**Fix:**
```ts
const handleSignOut = async () => {
  await dispatch(signOut());
  navigate(SNM_NAV_LOGIN_LINK, { replace: true });
};
```

---

### E7. `src/features/admin/admin/components/entity-list/entity-view-dialog.tsx:37` — `Object` default stringification
**Problem:** `String({})` → `"[object Object]"` shown to user.
**Fix:**
```ts
{value !== null && value !== undefined
  ? (typeof value === "object" ? JSON.stringify(value) : String(value))
  : "—"}
```

---

## 🟠 Warnings (Should Fix)

### W1. Array index as key (3 locations)
- `command-menu.tsx:43, 58`
- `pagination.tsx:92`

**Fix:** Use stable IDs instead of array index.

---

### W2. Unstable default props / context values (8+ locations)
- `toolbar.tsx:27` — `[]` as default prop
- `entity-list-provider.tsx:28` — `{}` as default prop
- `entity-list-provider.tsx:38, 45` — inline object in context value
- `form.tsx:36, 77` — inline object in context value
- `direction-provider.tsx:37` — inline object
- `search-provider.tsx:30` — inline object
- `theme-provider.tsx:97` — inline object
- `layout-provider.tsx:64` — inline object

**Fix:** Wrap in `useMemo` or define outside the component.

---

### W3. React 19 context patterns (10+ locations)
- `react-x/no-context-provider` — use `<Context>` instead of `<Context.Provider>`
- `react-x/no-use-context` — prefer `use(Context)` over `useContext(Context)`

**Fix:** Update for React 19 compatibility.

---

### W4. `@typescript-eslint/no-unsafe-assignment` — `toolbar.tsx:29, 49`
**Fix:** Add explicit types or narrow the `any` values.

---

### W5. Nested component definitions — `calendar.tsx:125, 135, 156`
**Problem:** `Root`, `Chevron`, `WeekNumber` defined inside `Calendar` → new functions every render.
**Fix:** Move to top-level definitions outside the component.

---

## 🟡 Potential Bugs / Logic Risks

### B1. `DataTable.tsx` — Column typo `changeUserStatue`
**Location:** Multiple props/interfaces use `changeUserStatue` (should be `changeUserStatus`).

---

### B2. `lib/customBaseQuery.ts` — Confusing duplicate export
```ts
export { baseQueryWithAuth as customBaseQuery } from "@shared/api/baseApi";
export { baseQueryWithAuth as customBaseQueryWithAuth } from "@shared/api/baseApi";
```
Both exports are identical. Remove the duplicate.

---

### B3. `shared/lib/monitoring.ts` — Silent error swallowing in production
```ts
export function reportError(error: unknown, context: MonitoringContext = {}) {
  if (import.meta.env.DEV) {
    console.error("Application error", error, context);
  }
}
```
**Risk:** No production error reporting for a medical application.
**Fix:** Add a production reporter (Sentry, LogRocket, or `fetch` to logging endpoint).

---

### B4. `app/router/authRedirects.ts` — Unsafe default redirect
```ts
return ROUTE_MS_ADMIN_DASHBOARD;  // any unknown type goes to ms-admin
```
**Risk:** Unknown/undefined `userType` lands on medical-staff dashboard → potential authorization bypass.
**Fix:** Default to `ROUTE_HOME` or redirect to login.

---

### B5. `shared/api/errors.ts` — Loose type guard
```ts
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}
```
Any object with `status` passes. Narrow further.

---

### B6. `routes/ProtectedRoute.tsx` — Missing `userType` null check
```ts
if (roles && !roles.includes(userType as "admin" | "ms")) {
```
If `userType` is `undefined`, the cast silently succeeds.
**Fix:**
```ts
if (roles && (!userType || !roles.includes(userType as "admin" | "ms"))) {
```

---

### B7. `shared/api/baseApi.ts` — `credentials: "omit"` with Bearer token
Verify backend doesn't expect cookie-based sessions (e.g., `httpOnly` refresh tokens).

---

### B8. `features/admin/admin/components/entity-list/entity-list-provider.tsx` — Unused import
```ts
import React, { useEffect, useState } from "react";
```
`useEffect` is imported but never used.

---

## ✅ What's Good

- [x] Proper error boundary hierarchy (App → Page → Widget)
- [x] Centralized route path definitions with JSDoc
- [x] Type-safe Redux hooks (`useAppDispatch`, `useAppSelector`)
- [x] Form validation with react-hook-form
- [x] API error normalization with test coverage
- [x] Lazy-loaded routes with Suspense
- [x] Auth-protected routes with role-based gating

---

## Checklist — Track Progress

```
[ ] E1  Fast Refresh fixes (7 files)
[ ] E2  Unused vars in camp/store.ts
[ ] E3  Unsafe any in column-helpers.tsx
[ ] E4  Unnecessary assertion in column-helpers.tsx
[ ] E5  entity-form-dialog.tsx promise handling
[ ] E6  sign-out-dialog.tsx floating promise
[ ] E7  entity-view-dialog.tsx object stringification

[ ] W1  Array index keys (3 locations)
[ ] W2  Unstable context/default props (8+ locations)
[ ] W3  React 19 context patterns (10+ locations)
[ ] W4  Unsafe assignments in toolbar.tsx
[ ] W5  Nested components in calendar.tsx

[ ] B1  DataTable typo (changeUserStatue → changeUserStatus)
[ ] B2  Duplicate export in customBaseQuery.ts
[ ] B3  Production error reporting in monitoring.ts
[ ] B4  Default route in authRedirects.ts
[ ] B5  Type guard in errors.ts
[ ] B6  userType null check in ProtectedRoute.tsx
[ ] B7  credentials: "omit" verification
[ ] B8  Unused import in entity-list-provider.tsx
```

---

## Running the Audit Again

```bash
# ESLint (run from frontend root)
npx eslint src/ --no-ignore

# TypeScript check
npx tsc -p tsconfig.json --noEmit

# Tests
npm test
```