# Error Handling Guidelines

## Purpose

Standardize error capture, display, and recovery across API calls, UI components, and route boundaries.

## Scope

All error scenarios: API failures, render crashes, validation errors, and logging.

---

## Error Boundary Hierarchy

| Level | Component | Used At |
|-------|-----------|---------|
| App | `AppErrorBoundary` | `main.tsx` root |
| Route/Page | `RouteErrorBoundary` / `withPageErrorBoundary` | Public routes, protected routes, admin layout |
| Widget | `WidgetErrorBoundary` | Header, footer, dashboard charts |

Import from `@shared/error`:

```tsx
import { RouteErrorBoundary, withPageErrorBoundary, WidgetErrorBoundary } from "@shared/error";
```

Each level renders appropriate fallbacks:
- `GlobalErrorFallback` — full page crash
- `PageErrorFallback` — page-level recovery
- `WidgetErrorFallback` — isolated widget failure

---

## Route Error Wrapping

### Public routes

```tsx
<Route
  path={SNM_NAV_LOGIN_LINK}
  element={withPageErrorBoundary(<Login />, "login")}
/>
```

### Protected routes

Automatic via `createProtectedRoute.tsx`:

```tsx
<RouteErrorBoundary name={routeName}>
  <Page />
</RouteErrorBoundary>
```

### Admin layout

`AdminLayout` wraps outlet in `RouteErrorBoundary`.

---

## API Error Handling

### normalizeApiError

Central utility at `shared/api/errors.ts`:

```tsx
import { normalizeApiError } from "@shared/api/errors";

try {
  await mutation(data).unwrap();
} catch (error) {
  const { message } = normalizeApiError(error);
  toast.error(message);
  reportError(error, { source: "feature-name" });
}
```

Handles RTK Query errors, network failures, and unknown errors with a user-friendly fallback message.

### Global auth errors

401/403 handled in `baseQueryWithAuth` — do not duplicate signOut logic in features.

---

## Validation Errors

Displayed inline on form fields via React Hook Form:

```tsx
<TextField
  error={errors.email}
  register={register("email", validationRules.email)}
/>
```

Do not toast field-level validation errors — show them on the field.

---

## Logging Strategy

| Tool | Purpose |
|------|---------|
| `reportError(error, context)` | `shared/lib/monitoring.ts` — dev console, pluggable reporter |
| `logBoundaryError` | `shared/error/errorLogger.ts` — boundary catch logging |
| `setErrorReporter` | Hook for future Sentry/Datadog integration |

Always include a `source` context string:

```tsx
reportError(error, { source: "login" });
reportError(error, { source: "update-profile" });
```

---

## User-Facing Error Messages

| Scenario | UX |
|----------|-----|
| API failure | Toast with `normalizeApiError` message |
| Session expired | Toast + auto signOut (global) |
| Page crash | Error boundary fallback with retry |
| Widget crash | Widget fallback — rest of page works |
| Form validation | Inline field errors |
| Empty/not found | Dedicated empty state UI — not an error |

**Never show:** stack traces, raw error objects, HTTP status codes to end users.

---

## Rules

1. Wrap all public routes in `withPageErrorBoundary`
2. Protected routes use `RouteErrorBoundary` via factory
3. All API catch blocks use `normalizeApiError`
4. All catch blocks call `reportError` with source context
5. Widgets with external data wrapped in `WidgetErrorBoundary`

---

## Do's

- ✅ Provide retry actions in error fallbacks where possible
- ✅ Dismiss loading toasts before showing error toasts
- ✅ Test error boundaries render correctly (see existing tests)

---

## Don'ts

- ❌ Do not use empty `catch {}` blocks
- ❌ Do not `console.log` errors in production without `reportError`
- ❌ Do not catch errors silently without user feedback
- ❌ Do not duplicate 401 handling in feature code

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `catch (e) { toast.error("Error") }` | Use `normalizeApiError(e).message` |
| No error boundary on new page | Wrap in `withPageErrorBoundary` |
| Toast for required field missing | RHF inline validation |
| Logging token in error context | Strip sensitive fields |

---

## Recommended Patterns

### Complete submit handler

```tsx
const onSubmit = async (data: FormData) => {
  const loadingToast = toast.loading("Saving...");
  try {
    await mutation(data).unwrap();
    toast.dismiss(loadingToast);
    toast.success("Saved successfully!");
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(normalizeApiError(error).message);
    reportError(error, { source: "my-feature" });
  }
};
```

### Existing tests (reference)

- `shared/api/errors.test.ts`
- `shared/error/ErrorBoundary.test.tsx`
- `shared/error/errorLogger.test.ts`
