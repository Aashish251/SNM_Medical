# State Management

## Purpose

Define when and how to use Redux, RTK Query, local state, and entity stores to avoid unnecessary global state.

## Scope

All client-side state in the application.

---

## Store Structure

```tsx
// app/rootReducer.ts
{
  api: baseApi.reducer,    // RTK Query cache
  auth: authReducer,       // Session only (persisted)
}
```

**Only two Redux concerns:** authentication and server cache. Do not add slices without architectural approval.

---

## When to Use What

| State Type | Solution | Example |
|------------|----------|---------|
| Auth session | Redux `auth` slice | token, userType, userDetails |
| Server data | RTK Query | login, master search, dropdowns |
| Form input | `useState` / React Hook Form | login form, entity dialog |
| UI toggle | `useState` | modal open, tab selection |
| Persisted local data | Entity store (localStorage) | camp records |
| Admin theme | React Context | `ThemeProvider` in admin portal |
| Derived data | `useMemo` | filtered lists, computed stats |

---

## Redux — Auth Slice

**Canonical location:** `entities/session/model/authSlice.ts`

```tsx
interface AuthState {
  isSignedIn: boolean;
  token?: string;
  userType?: string;       // "admin" | "ms"
  userDetails?: UserObject | null;
  error: string | null;
}
```

Actions: `signIn(payload)`, `signOut()`

Access via typed hooks:

```tsx
import { useAppSelector, useAppDispatch } from "@app/store/hooks";

const { isSignedIn, userType, token } = useAppSelector(state => state.auth);
const dispatch = useAppDispatch();
```

**Legacy re-export:** `features/login/redux/authSlice.ts` → points to entities. Do not edit the shim.

### Persistence

Only `auth` is whitelisted in redux-persist (`localStorage` key: `persist:root`).

---

## RTK Query

Single API slice: `shared/api/baseApi.ts`

### Endpoint Injection Pattern

Colocate endpoints with the owning feature:

```tsx
// features/login/services/loginApi.ts
export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
      invalidatesTags: ["Login"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginUserMutation } = loginApi;
```

### Tag Types (registered in baseApi)

`AdminStats`, `Cities`, `Login`, `MasterSearch`, `RegistrationDropdown`, `UserDetails`

Add new tag types to `baseApi.ts` when introducing cache invalidation.

### Auth Headers

Token attached automatically in `prepareHeaders` from `state.auth.token`.

401/403 responses trigger automatic `signOut()` + toast.

---

## Selectors

Prefer inline selectors for simple access:

```tsx
const userType = useAppSelector(state => state.auth.userType);
```

Create dedicated selector functions only when:
- The selector is reused in 3+ places
- The derivation is non-trivial

```tsx
// entities/session/model/selectors.ts (if needed)
export const selectIsAdmin = (state: RootState) =>
  state.auth.userType === SNM_ADMIN_USERTYPE;
```

---

## Memoization

| Hook | When to Use |
|------|-------------|
| `useMemo` | Expensive derived data (filtering large arrays) |
| `useCallback` | Stable callbacks passed to memoized children |
| `React.memo` | Pure presentational components receiving stable props that re-render often |

**Do not memoize prematurely.** Profile first for administrator portal tables with 100+ rows.

---

## Entity Local Stores

`entities/camp/store.ts` uses localStorage — pattern for client-only data not yet backed by API:

```tsx
const { camps, addCamp, updateCamp } = useCampStore();
```

Do not put localStorage logic in components — use entity store/hooks.

---

## Rules

1. No new Redux slices without team approval
2. All API data through RTK Query — not manual fetch + useState
3. Auth state only in `entities/session`
4. Do not store server data in Redux outside RTK Query cache
5. Use `useAppSelector` / `useAppDispatch` — not raw `useSelector`

---

## Do's

- ✅ Invalidate RTK Query tags after mutations
- ✅ Use mutation `unwrap()` in try/catch for error handling
- ✅ Keep form state in React Hook Form, not Redux

---

## Don'ts

- ❌ Do not create `useAuth` that duplicates selector logic inconsistently — use selectors directly (or propose a shared hook via PR)
- ❌ Do not persist UI state to localStorage
- ❌ Do not store API responses in `useState` when RTK Query hooks exist

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| New slice for modal open state | `useState(false)` |
| Fetch in useEffect + setState | RTK Query `useXQuery` |
| Editing shim authSlice | Edit `entities/session/model/authSlice.ts` |
| Separate createApi per feature | `baseApi.injectEndpoints` |

---

## Recommended Patterns

### Mutation with error handling

```tsx
try {
  const response = await triggerLogin(payload).unwrap();
  dispatch(signIn({ token: response.data.token, /* ... */ }));
} catch (error) {
  toast.error(normalizeApiError(error).message);
  reportError(error, { source: "login" });
}
```
