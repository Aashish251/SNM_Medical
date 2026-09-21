# Future Development Rules

## Purpose

Master document of **mandatory rules** for all future development. Every contributor must follow these rules without exception.

## Scope

All code changes, features, refactors, and bug fixes.

---

## Mandatory Rules

### 1. Architecture

- Follow the feature-based / module-based architecture defined in [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)
- New **administrator** features go in `modules/admin/features/` — not `features/admin/`
- New **public** features go in `features/` with thin `pages/` wrapper
- Business logic in hooks and services — never in route files or page wrappers
- Respect layer dependency flow: no upward imports

### 2. Routing

- **Always use centralized routing** in `@app/router` — never create duplicate routing systems
- All route paths defined in `routePaths.ts` — never hardcode path strings
- All new routes must be lazy-loaded
- All authenticated routes must use `ProtectedRoute`
- Post-login redirects only via `getDefaultRouteForUserType()`
- Register routes in config arrays: `protectedRouteEntries.ts` or `adminRouteEntries.ts`

### 3. Reusability

- **Search for existing components before creating new ones**
- Extend existing components via props/config before duplicating
- Use `EntityListPage` + config for admin CRUD screens
- Use shared `FormInputs` for legacy forms
- Use `validationRules` for all form validation
- Prefer configuration over copy-paste

### 4. State Management

- Redux is for **auth only** (+ RTK Query cache) — no new slices without approval
- Server data via RTK Query — never manual fetch + useState
- Form state via React Hook Form — not Redux
- Local UI state via `useState` — closest to usage

### 5. API Layer

- All endpoints inject into `baseApi` — never create separate API slices
- Type all request/response interfaces
- Handle errors with `normalizeApiError` + toast + `reportError`
- Never hardcode API URLs — use `VITE_API_BASE_URL`

### 6. Styling and Theme

- **Never hardcode colors** — use theme tokens (`bg-primary`, `text-muted-foreground`, brand CSS vars)
- Use the correct UI kit per shell (shared vs @admin)
- Use `cn()` for conditional classes
- Use Tailwind spacing scale — no arbitrary magic numbers

### 7. Security

- All protected routes behind `ProtectedRoute` with correct roles
- Never commit secrets, tokens, or `.env` files
- Never bypass auth guards for convenience
- Backend validates all authorization — frontend guards are UX only

### 8. Error Handling

- Wrap public routes in error boundaries
- Never use empty catch blocks
- Never show stack traces or raw errors to users
- Always call `reportError` with source context in catch blocks

### 9. TypeScript

- No `any` in new code
- Explicit props interfaces for components
- String union types over enums
- Use typed Redux hooks (`useAppSelector`, `useAppDispatch`)

### 10. Naming

- Follow [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) without deviation
- PascalCase components, camelCase hooks/functions, UPPER_SNAKE constants
- Path aliases always — no deep relative imports

### 11. Performance

- Lazy-load all route components
- Paginate large data sets
- Do not import administrator portal code in public features
- Profile before optimizing — no premature memo everywhere

### 12. Compatibility

- **Do not introduce breaking changes without approval**
- Maintain backward compatibility for existing routes
- Legacy `/admin/*` routes remain functional during migration
- Minimal, focused diffs — no drive-by refactors

### 13. Testing

- `npm run build` must pass before PR
- Add tests for new utilities, reducers, and mappers
- Colocate tests with source files

### 14. Code Review

- Self-review against [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) before requesting review
- No unrelated changes in the same PR
- No commented-out code or debug logging

---

## Decision Quick Reference

| I need to... | Do this |
|-------------|---------|
| Add admin page | `modules/admin/features/` + `adminRouteEntries.ts` + sidebar-data |
| Add public page | `features/` + `pages/public/` + `PublicRoutes.tsx` |
| Add MS page | `features/` + `pages/protected/ms/` + `protectedRouteEntries.ts` |
| Add API endpoint | `baseApi.injectEndpoints` in feature `services/` |
| Add form | React Hook Form + shared FormInputs or EntityFormDialog |
| Add route path | `@app/router/routePaths.ts` |
| Add nav link | `navlinks.ts` or `sidebar-data.ts` |
| Add validation | `shared/lib/formValidation.ts` |
| Add shared utility | `shared/lib/` |
| Add global state | **Stop** — ask architect first |

---

## Prohibited Actions

| Action | Why |
|--------|-----|
| Create a second routing system | Maintenance nightmare — use `@app/router` |
| Create a new Redux slice | Store bloat — use RTK Query or local state |
| Hardcode route paths | Breaks central routing — use constants |
| Hardcode colors | Breaks theming — use tokens |
| Copy-paste components | Creates drift — extend or configure |
| Mix UI kits in one screen | Inconsistent UX and bundle bloat |
| Put logic in pages/ | Violates architecture — use features |
| Skip ProtectedRoute | Security gap |
| Use `any` type | Type safety debt |
| Force push to main | Team policy |

---

## Migration Direction

The project is migrating administrator features from legacy `/admin/*` to `/admin/*`:

| Status | Path | Action |
|--------|------|--------|
| Medical Staff Admin | `/ms-admin/*` | **Add MS admin features here** |
| Administrator Portal | `/admin/*` | **Add administrator features here** |
| Legacy `/ms/*`, `/admin/*` | Redirects only | Backward compatibility |

---

## Scalability Principles

For a codebase targeting 100,000+ users:

1. **Config-driven over hardcoded** — routes, nav, entity lists, forms
2. **Lazy-loaded over eager** — every route and heavy module
3. **Centralized over scattered** — paths, auth, errors, validation
4. **Minimal global state** — RTK Query cache + auth only
5. **Module boundaries** — new bounded contexts in `modules/<name>/`
6. **Backward compatible evolution** — no big-bang rewrites

---

## Pre-Implementation Checklist

Before writing code, confirm:

- [ ] I read the relevant doc from [README.md](./README.md)
- [ ] I searched for existing components/hooks/patterns
- [ ] I know which layer my code belongs in
- [ ] I know which route config file to update
- [ ] I will not hardcode paths or colors
- [ ] I will not create duplicate routing or state
- [ ] I will follow the code review checklist before PR

---

## Document Maintenance

These rules evolve with the project. When architecture changes:

1. Update the relevant guideline document
2. Update this master rules document
3. Notify the team of changes
4. Do not let docs drift from implementation

**These documents are the source of truth for how development must be done.**
