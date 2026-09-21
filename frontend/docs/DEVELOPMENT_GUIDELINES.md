# Development Guidelines

## Purpose

Establish the daily development workflow, quality standards, and decision-making process for all contributors.

## Scope

All frontend development work: features, bug fixes, refactors, and documentation updates.

---

## Before You Code

1. **Read the relevant doc** from [README.md](./README.md)
2. **Search the codebase** for existing components, hooks, and patterns
3. **Identify the correct layer** — see [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
4. **Check route registry** — see [ROUTING_GUIDELINES.md](./ROUTING_GUIDELINES.md)
5. **Confirm no duplicate** — see [REUSABILITY_GUIDELINES.md](./REUSABILITY_GUIDELINES.md)

---

## Development Workflow

### 1. Branch and Plan

- Create a focused branch for one concern
- List affected layers (feature, routes, shared, etc.)
- Identify if changes are breaking — get approval if yes

### 2. Implement

- Follow existing conventions in the nearest similar file
- Use path aliases (`@shared`, `@features`, `@admin`)
- Register routes in central config — never ad-hoc `<Route>` in components
- Run `npm run build` before opening PR

### 3. Verify

```bash
npm run build    # TypeScript + production build
npm run lint     # ESLint
npm test         # Vitest unit tests
```

### 4. Review

Use [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) before submitting and when reviewing others.

---

## Environment Setup

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL |

Create `.env.local` for local overrides — never commit secrets.

---

## Code Quality Standards

| Standard | Rule |
|----------|------|
| TypeScript | Prefer explicit types; avoid `any` (see [TYPESCRIPT_GUIDELINES.md](./TYPESCRIPT_GUIDELINES.md)) |
| Imports | Use path aliases; group: external → aliases → relative |
| Components | Single responsibility; extract when > ~200 lines |
| Side effects | RTK Query for server state; Redux only for auth |
| Styling | Tailwind + theme tokens — no hardcoded hex colors |
| Errors | Use `normalizeApiError` + toast; wrap routes in error boundaries |

---

## Adding a New Feature — Decision Tree

```
Is it an admin portal screen?
  YES → modules/admin/features/ + adminRouteEntries.ts
  NO → Is it authenticated?
    YES → Is it MS-only or shared?
      MS → features/ + pages/protected/ms/ + protectedRouteEntries.ts
      Admin legacy → features/admin/ + pages/protected/admin/ (discouraged for new work)
    NO → features/ + pages/public/ + PublicRoutes.tsx
```

---

## Rules

1. Minimal, focused diffs — do not refactor unrelated code in the same PR
2. Preserve backward compatibility unless explicitly approved
3. No breaking changes to route paths without migration plan
4. All new routes must be lazy-loaded
5. All authenticated routes must use `ProtectedRoute`
6. Business logic stays in hooks/services — not in route files or page wrappers

---

## Best Practices

- Write self-documenting code; comments only for non-obvious business rules
- Match the documentation level of surrounding files
- Reuse `validationRules` from `@shared/lib/formValidation`
- Use `reportError(error, { source: '...' })` in catch blocks
- Prefer configuration arrays over copy-paste route definitions

---

## Do's

- ✅ Run build locally before PR
- ✅ Add unit tests for utilities, mappers, and reducers
- ✅ Use existing shared form fields and UI components
- ✅ Follow [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)

---

## Don'ts

- ❌ Do not commit `.env` files with secrets
- ❌ Do not disable ESLint rules without justification
- ❌ Do not add dependencies without team discussion
- ❌ Do not create cosmetic-only refactors mixed with feature work
- ❌ Do not bypass `ProtectedRoute` for authenticated pages

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| New admin page in `features/admin/` | Use `modules/admin/features/` |
| Hardcoded API URL | Use `VITE_API_BASE_URL` via `baseApi` |
| Duplicate toast libraries in same shell | Legacy: `react-hot-toast`; Admin panel: `sonner` |
| Forgetting to register lazy route | Add entry to route config array |
| Importing from `@features/` inside administrator portal | Use `@shared/` or `@entities/` only |

---

## Recommended Patterns

### Hook encapsulates form + API

```tsx
// features/login/hooks/useLoginForm.ts
export const useLoginForm = () => {
  const form = useForm<FormData>();
  const [triggerLogin] = useLoginUserMutation();
  // submit, error handling, redirect
  return { form, onSubmit, loading };
};
```

### Page delegates to feature

```tsx
// pages/public/contact/index.tsx
export { default } from "@features/contact";
```
