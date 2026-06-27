# Naming Conventions

## Purpose

Standardize naming across files, code, routes, and constants for consistency and searchability.

## Scope

All source files, exports, variables, and configuration.

---

## Files and Folders

| Item | Convention | Example |
|------|------------|---------|
| Feature folder | kebab-case | `master-search/`, `free-health-checkups/` |
| Component file | PascalCase | `LoginForm.tsx`, `EntityListPage.tsx` |
| Hook file | camelCase with `use` prefix | `useLoginForm.ts`, `useHeaderNavigation.ts` |
| Service/API file | camelCase with Api suffix | `loginApi.ts`, `adminApi.ts` |
| Type file | `type.ts` or `types.ts` | `features/login/type.ts` |
| Config file | kebab-case or camelCase | `listingConfig.ts`, `create-master-config.ts` |
| Test file | same name + `.test.ts(x)` | `authSlice.test.ts` |
| Constants | `index.ts` in constants folder | `shared/constants/index.ts` |
| Route paths file | camelCase | `routePaths.ts`, `adminRouteEntries.ts` |

---

## Components

| Type | Convention | Example |
|------|------------|---------|
| React component | PascalCase | `LoginForm`, `DashboardLayout` |
| Admin panel feature | PascalCase named export | `export function Dashboard()` |
| Legacy feature | PascalCase default export | `export default Login` |
| Error boundary | PascalCase + ErrorBoundary | `RouteErrorBoundary` |

---

## Hooks

- Prefix with `use`: `useLoginForm`, `useProfileWizardForm`
- Return object with descriptive keys: `{ form, loading, onSubmit, error }`
- One hook per file

---

## Redux

| Item | Convention | Example |
|------|------------|---------|
| Slice name | camelCase domain | `auth` |
| Slice file | camelCase + Slice | `authSlice.ts` |
| Actions | camelCase verbs | `signIn`, `signOut` |
| Selectors | select + PascalCase | `selectIsAdmin` (if extracted) |
| RTK Query API | camelCase + Api | `loginApi`, `masterSearchApi` |
| Generated hooks | use + Endpoint name | `useLoginUserMutation`, `useGetUserQuery` |

---

## Services and API

| Item | Convention | Example |
|------|------------|---------|
| Endpoint name | camelCase verb + noun | `loginUser`, `getUserDetails` |
| URL paths | kebab-case REST | `/api/auth/login`, `/api/search/master` |
| Tag types | PascalCase | `"MasterSearch"`, `"UserDetails"` |

---

## Types and Interfaces

| Item | Convention | Example |
|------|------------|---------|
| Interface | PascalCase | `LoginRequest`, `AuthState` |
| Type alias | PascalCase | `UserRole`, `ValidationRule` |
| Props interface | ComponentName + Props | `LoginFormProps`, `ProtectedRouteProps` |
| Generic params | Single uppercase letter | `T`, `K`, `V` |

---

## Constants

| Item | Convention | Example |
|------|------------|---------|
| Site constants | SNM_ prefix + UPPER_SNAKE | `SNM_SITE_LOGO_TITLE` |
| Nav links | SNM_NAV_ prefix | `SNM_NAV_LOGIN_LINK` |
| User types | SNM_ + USERTYPE | `SNM_ADMIN_USERTYPE` (`"admin"`) |
| Route paths (router) | ROUTE_ prefix + UPPER_SNAKE | `ROUTE_ADMIN_DASHBOARD` |
| Admin panel re-exports | ROUTE_ADMIN_ prefix | `ROUTE_ADMIN_DASHBOARD` |
| Storage keys | kebab-case string | `"snm-camp-records"`, `"persist:root"` |

---

## Routes

| Item | Convention | Example |
|------|------------|---------|
| Public routes | lowercase kebab | `/free-health-checkups` |
| MS routes | `/ms/` prefix | `/ms/dashboard` |
| Legacy admin | `/admin/` prefix | `/admin/master-search` |
| Admin panel | `/admin/` prefix | `/admin/master/city` |
| Route entry name | kebab-case identifier | `"admin-master-city"` |

---

## CSS and Tailwind

| Item | Convention | Example |
|------|------------|---------|
| Tailwind classes | Utility classes | `bg-primary`, `text-muted-foreground` |
| CSS variables | kebab-case with `--` | `--color-brand-primary` |
| Custom variant | kebab-case | `@custom-variant dark` |
| Scoped root | kebab-case class | `.admin-root` |
| cn() usage | Conditional classes | `cn("base", isActive && "active")` |

---

## Utility Functions

| Item | Convention | Example |
|------|------------|---------|
| Functions | camelCase verb | `normalizeApiError`, `getDefaultRouteForUserType` |
| Boolean returns | is/has/can prefix | `isSignedIn`, `hasRole` |
| Factories | create + PascalCase | `createProtectedRoute`, `createMasterConfig` |
| Mappers | noun + Mapper | `formDataMappers` |

---

## Variables

| Item | Convention | Example |
|------|------------|---------|
| General | camelCase | `userType`, `loadingToast` |
| Constants (local) | UPPER_SNAKE or camelCase | `STORAGE_KEY`, `loading` |
| Component state | descriptive camelCase | `isOpen`, `selectedRole` |
| Event handlers | handle/on prefix | `handleSubmit`, `onRoleChange` |

---

## Path Aliases

Always use aliases — never deep relative paths across layers:

```tsx
import { baseApi } from "@shared/api/baseApi";       // ✅
import { baseApi } from "../../../shared/api/baseApi"; // ❌
```

---

## Rules

1. PascalCase for components, interfaces, types
2. camelCase for functions, hooks, variables, files (hooks/services)
3. UPPER_SNAKE for module-level constants
4. SNM_ prefix for site/nav constants
5. ROUTE_ prefix for path constants in router
6. kebab-case for URL paths and folder names

---

## Do's

- ✅ Follow the nearest existing file's naming when adding code
- ✅ Use descriptive names over abbreviations
- ✅ Name route entries matching their feature name

---

## Don'ts

- ❌ Do not abbreviate: `UsrProf` → `UserProfile`
- ❌ Do not mix camelCase and snake_case in URLs
- ❌ Do not create constants without the established prefix pattern
- ❌ Do not name admin portal auth roles the same as user-management roles

---

## Common Mistakes

| Mistake | Correct |
|---------|---------|
| `ROUTE_ADMIN_dashboard` | `ROUTE_ADMIN_DASHBOARD` |
| `login-form.tsx` | `LoginForm.tsx` |
| `useLogin` (missing Form/Page context) | `useLoginForm` |
| Hardcoded `/admin/dashboard` | `SNM_NAV_ADMIN_DASHBOARD_LINK` |
