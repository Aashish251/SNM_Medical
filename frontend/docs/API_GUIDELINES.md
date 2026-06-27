# API Guidelines

## Purpose

Standardize how the frontend communicates with the backend via RTK Query.

## Scope

All HTTP requests, authentication headers, error handling, and response typing.

---

## Architecture

```
Feature service file
    └── baseApi.injectEndpoints()
            └── baseQueryWithAuth (shared/api/baseApi.ts)
                    └── fetchBaseQuery (VITE_API_BASE_URL)
```

**One API slice.** Never create additional `createApi` instances.

---

## Service Layer Structure

Colocate API definitions with the owning feature:

```
features/<feature>/services/<feature>Api.ts
shared/services/commonApi.ts          # Shared dropdowns, lookups
```

### Standard endpoint file

```tsx
import { baseApi } from "@shared/api/baseApi";

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Login"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginUserMutation } = loginApi;
```

---

## Existing API Modules

| Module | Location | Key Endpoints |
|--------|----------|---------------|
| loginApi | `features/login/services/loginApi.ts` | `POST /api/auth/login` |
| RegisterApi | `features/register/services/` | `POST /api/user/register` |
| UpdateProfileApi | `features/update-profile/services/` | `PUT /api/user/update`, `GET /api/user/:id` |
| ForgotPasswordApi | `features/forgot-password/service/` | forgot/reset password |
| AdminApi | `features/admin/dashboard/services/adminApi.ts` | dashboard stats |
| MasterSearchApi | `features/admin/master-search/services/` | search, approve, export |
| CommonApi | `shared/services/commonApi.ts` | registration dropdowns |

---

## Authentication Headers

Configured in `baseApi.ts` `prepareHeaders`:

```tsx
if (token) {
  headers.set("Authorization", `Bearer ${token}`);
}
```

- Token source: `state.auth.token`
- Credentials: `"omit"` (no cookies)
- Content-Type: `application/json` (unless `x-is-form-data: true` header for FormData uploads)

---

## Error Handling

### Global session expiry

`baseQueryWithAuth` auto-handles 401/403:
- Dispatches `signOut()`
- Shows toast: "Your session has expired. Please log in again."

### Feature-level errors

Always use `normalizeApiError`:

```tsx
import { normalizeApiError } from "@shared/api/errors";

try {
  await mutation(payload).unwrap();
} catch (error) {
  const { message } = normalizeApiError(error);
  toast.error(message);
  reportError(error, { source: "feature-name" });
}
```

`normalizeApiError` handles:
- RTK Query `FetchBaseQueryError` (extracts `data.message`)
- Network errors
- Native `Error` objects
- Unknown errors → fallback message

---

## Response Typing

Define request/response types in feature `type.ts`:

```tsx
export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: UserObject;
  };
}
```

Use generics on builder methods: `builder.mutation<LoginResponse, LoginRequest>`.

---

## Tag-Based Cache Invalidation

Register tag types in `baseApi.ts`:

```tsx
tagTypes: ["AdminStats", "Cities", "Login", "MasterSearch", ...]
```

Invalidate after mutations:

```tsx
invalidatesTags: ["MasterSearch"]
providesTags: (result) => [{ type: "UserDetails", id: userId }]
```

---

## FormData Uploads

Set custom header to skip JSON Content-Type:

```tsx
query: (formData) => ({
  url: "/api/upload",
  method: "POST",
  body: formData,
  headers: { "x-is-form-data": "true" },
})
```

---

## Rules

1. Inject endpoints into `baseApi` only
2. Export generated hooks from the same service file
3. Always type request and response
4. Always handle errors with `normalizeApiError`
5. Use `unwrap()` for mutations requiring try/catch
6. API URLs are relative to `VITE_API_BASE_URL`

---

## Do's

- ✅ Add new tag types to `baseApi.ts` when needed
- ✅ Use `reportError` in catch blocks for observability
- ✅ Keep endpoint URLs consistent with backend contract

---

## Don'ts

- ❌ Do not use raw `fetch()` for backend API calls
- ❌ Do not store tokens manually in localStorage (redux-persist handles auth)
- ❌ Do not swallow errors silently
- ❌ Do not hardcode API base URL

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `createApi` in feature | `baseApi.injectEndpoints` |
| Missing `overrideExisting: false` | Add to prevent HMR duplicate warnings |
| Not invalidating tags after mutation | Stale UI data |
| Ignoring 401 handling | Already global — don't duplicate signOut |

---

## Recommended Patterns

### Query with skip

```tsx
const { data, isLoading } = useGetUserQuery(userId, { skip: !userId });
```

### Optimistic updates (when needed)

Use RTK Query `onQueryStarted` — discuss in PR before implementing.
