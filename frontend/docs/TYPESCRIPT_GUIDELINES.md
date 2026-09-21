# TypeScript Guidelines

## Purpose

Define typing standards for safe, maintainable TypeScript across the codebase.

## Scope

All `.ts` and `.tsx` files.

---

## Current State

- Build uses `tsconfig.json` with `strict: false`
- Stricter config exists in `tsconfig.app.json` (not used by build)
- ESLint flags `@typescript-eslint/no-explicit-any` violations
- **Goal:** write strict-compatible code even if build allows loose checks

---

## Core Rules

### No `any`

```tsx
// ❌ Avoid
const data: any = response.data;

// ✅ Correct
const data = response.data as LoginResponse;
// or
interface LoginResponse { /* ... */ }
```

Use `unknown` for truly unknown types, then narrow:

```tsx
function handleError(error: unknown) {
  const { message } = normalizeApiError(error);
}
```

### Explicit Props Interfaces

```tsx
interface LoginFormProps {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  loading: boolean;
}
```

### Explicit Return Types on Exported Functions

```tsx
export function getDefaultRouteForUserType(userType?: string): string { /* ... */ }
export function normalizeApiError(error: unknown): ApiError { /* ... */ }
```

---

## Type Organization

| Type Category | Location |
|---------------|----------|
| Feature-specific | `features/<name>/type.ts` |
| Domain entities | `entities/<domain>/` |
| Shared types | `shared/types/` |
| Route meta | `app/router/routeMeta.ts` |
| API request/response | Colocated with service file or feature `type.ts` |
| Component props | Same file as component or `types.ts` in component folder |

---

## Enum vs Union Types

**Prefer string union types** over enums (project convention):

```tsx
// ✅ Preferred
type UserRole = "admin" | "ms";
type Role = "admin" | "ms";

// ❌ Avoid (unless required by external library)
enum UserRole { Admin = "admin", MS = "ms" }
```

Existing unions:
- `UserRole = "admin" | "ms"` in `routeMeta.ts`
- `Role = "admin" | "ms"` in `useLoginForm.ts`

---

## Generic Usage

Use generics for reusable utilities and RTK Query:

```tsx
builder.mutation<LoginResponse, LoginRequest>({ /* ... */ })

export type ValidationRule = {
  required?: string | boolean;
  pattern?: { value: RegExp; message: string };
};
```

---

## Utility Types

Use built-in utility types:

```tsx
type PartialUser = Partial<UserObject>;
type ReadonlyConfig = Readonly<EntityConfig>;
type FormValues = Record<string, unknown>;  // admin panel dynamic forms
```

---

## Redux Typing

Use typed hooks from `@app/store/hooks`:

```tsx
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import type { RootState, AppDispatch } from "@app/store";
```

Do not use untyped `useSelector` / `useDispatch`.

---

## Import Types

Use `import type` for type-only imports:

```tsx
import type { ComponentType } from "react";
import type { RouteMeta } from "@app/router/routeMeta";
```

---

## Rules

1. No `any` in new code
2. Props interfaces for all components
3. String union types over enums
4. Type API request/response in service files
5. Use `import type` for type-only imports
6. Use typed Redux hooks

---

## Do's

- ✅ Narrow `unknown` errors with type guards or `normalizeApiError`
- ✅ Export types alongside components when consumed externally
- ✅ Use RTK Query generics for endpoint typing

---

## Don'ts

- ❌ Do not use `@ts-ignore` without comment explaining why
- ❌ Do not cast to `any` to silence errors — fix the type
- ❌ Do not duplicate type definitions — import from canonical location
- ❌ Do not mix admin portal `UserRole` (superadmin/cashier) with auth `UserRole` (admin/ms)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Untyped event handlers | `React.FormEvent`, `React.ChangeEvent<HTMLInputElement>` |
| `as any` on API response | Define response interface |
| Duplicate UserObject type | Import from canonical entity type |
| Missing null checks | Use optional chaining + guards |

---

## Recommended Patterns

### Feature type file

```tsx
// features/login/type.ts
export interface LoginRequest {
  email?: string;
  mobileNo?: string;
  password: string;
  role: "admin" | "ms";
}

export interface LoginResponse {
  success: boolean;
  data: { token: string; user: UserObject };
}
```

### Typed route entry

```tsx
loader: () => Promise<{ default: ComponentType }>;
```
