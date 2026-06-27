# Security Guidelines

## Purpose

Define security practices for authentication, authorization, input handling, and API communication.

## Scope

All frontend security concerns. Note: backend validation is always required — frontend checks are UX, not security boundaries.

---

## Authentication

### Token Storage

- JWT stored in Redux `auth.token`
- Persisted via redux-persist to `localStorage` (key: `persist:root`)
- Attached as `Authorization: Bearer <token>` on all API requests

### Login Flow

1. User submits credentials + role selection to `POST /api/auth/login`
2. API returns `{ token, user: { userType } }`
3. `signIn()` stores session in Redux
4. Redirect via `getDefaultRouteForUserType()`

### Session Expiry

`baseQueryWithAuth` handles 401/403 globally:
- Dispatches `signOut()` — clears token and session
- Shows toast notification

---

## Authorization (RBAC)

### Roles

| Role | Constant | Value |
|------|----------|-------|
| Medical Staff | `SNM_MS_USERTYPE` | `"ms"` |
| Administrator | `SNM_ADMIN_USERTYPE` | `"admin"` |
| Public | `SNM_PUBLIC_USERTYPE` | `"all"` (nav filtering only) |

### Route Guards

All protected routes use `ProtectedRoute`:

```tsx
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminLayout />
</ProtectedRoute>
```

- Unauthenticated → `/login`
- Wrong role → `/` (home)

Route metadata in `routeMeta.ts` defines `requiredRoles` per path.

### Navigation Filtering

Header nav filtered by `userType` in `useHeaderNavigation.ts` — users only see links for their role.

### Component-Level Checks

Use sparingly for UX (disabling fields), not as sole security:

```tsx
disabled={userType !== SNM_ADMIN_USERTYPE}
```

**Backend must enforce authorization on every API endpoint.**

---

## Input Validation

- All forms validated client-side via React Hook Form + `validationRules`
- Email, mobile (10-digit Indian), password patterns centralized
- Never trust client validation alone — backend validates independently

---

## XSS Prevention

- React escapes JSX by default — do not use `dangerouslySetInnerHTML` without sanitization
- Do not render raw API HTML content without a sanitization library
- Validate and encode user input before displaying

---

## Secure API Usage

| Rule | Implementation |
|------|---------------|
| HTTPS in production | Deployment configuration |
| No credentials in code | `VITE_API_BASE_URL` env var |
| Bearer token only | `prepareHeaders` in baseApi |
| No cookie auth | `credentials: "omit"` |
| Auto logout on 401/403 | `baseQueryWithAuth` |

---

## Token Handling Rules

1. Never log tokens to console in production
2. Never commit tokens or `.env` files
3. Never pass tokens in URL query parameters
4. Clear session on logout via `signOut()`
5. Do not implement custom token refresh without backend contract

---

## Rules

1. All authenticated routes behind `ProtectedRoute`
2. Role checks on routes via `allowedRoles` / `routeMeta`
3. Tokens only in Redux auth slice — not scattered state
4. No secrets in source code or git
5. Use `normalizeApiError` — do not expose stack traces to users

---

## Do's

- ✅ Clear auth state on logout and session expiry
- ✅ Validate all form inputs client-side
- ✅ Use environment variables for API URLs
- ✅ Report errors via `reportError` without exposing sensitive data

---

## Don'ts

- ❌ Do not store passwords in state beyond form submission
- ❌ Do not bypass `ProtectedRoute` for "hidden" admin pages
- ❌ Do not expose internal error details in toast messages
- ❌ Do not commit `.env.local` or API keys

---

## Common Mistakes

| Mistake | Risk |
|---------|------|
| Role check only in UI | Bypassed via direct URL — route guard required |
| Token in localStorage manually | Use redux-persist — single source |
| Client-only authorization | Backend must validate every request |
| Logging full API error responses | May contain sensitive data |

---

## Recommended Patterns

### Protected admin portal route tree

```tsx
<Route path={ROUTE_ADMIN_BASE} element={
  <ProtectedRoute allowedRoles={["admin"]}>
    <AdminLayout />
  </ProtectedRoute>
}>
  {/* all child routes inherit protection */}
</Route>
```
