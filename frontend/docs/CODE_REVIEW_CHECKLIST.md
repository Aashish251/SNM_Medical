# Code Review Checklist

## Purpose

Standardized checklist for every pull request to ensure quality, consistency, and architectural compliance.

## Scope

All code changes — features, bug fixes, refactors, and documentation.

---

## How to Use

1. **Author:** Self-review against this checklist before requesting review
2. **Reviewer:** Verify each applicable section
3. **Block merge** if mandatory items fail

---

## Architecture and Structure

- [ ] Code is in the correct layer (`features/`, `modules/admin/`, `shared/`, etc.)
- [ ] No business logic in `pages/` or `routes/`
- [ ] Path aliases used — no deep relative imports across layers
- [ ] administrator portal code does not import from `@features/`
- [ ] Follows [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)

---

## Routing

- [ ] New routes registered in central config (`protectedRouteEntries` or `adminRouteEntries`)
- [ ] Route paths use constants from `@app/router/routePaths` — not hardcoded
- [ ] Route is lazy-loaded
- [ ] Protected routes use `ProtectedRoute` with correct `allowedRoles`
- [ ] `routeMeta.ts` updated for new protected routes
- [ ] Navigation config updated (navlinks or sidebar-data)
- [ ] No duplicate routing system introduced
- [ ] Follows [ROUTING_GUIDELINES.md](./ROUTING_GUIDELINES.md)

---

## Code Quality

- [ ] TypeScript types defined — no new `any`
- [ ] Props interfaces for new components
- [ ] Single responsibility — no god components (> 200 lines without justification)
- [ ] No unrelated changes mixed into the PR
- [ ] No commented-out code or debug logs
- [ ] Follows [TYPESCRIPT_GUIDELINES.md](./TYPESCRIPT_GUIDELINES.md)
- [ ] Follows [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)

---

## Reusability

- [ ] Existing shared components searched before creating new ones
- [ ] FormInputs used for legacy forms
- [ ] EntityListPage/config pattern used for admin CRUD where applicable
- [ ] No duplicated validation rules, error handling, or path strings
- [ ] Follows [REUSABILITY_GUIDELINES.md](./REUSABILITY_GUIDELINES.md)

---

## State Management

- [ ] Server data via RTK Query — not manual fetch + useState
- [ ] No new Redux slices without approval
- [ ] Form state in React Hook Form — not Redux
- [ ] RTK Query tags invalidated after mutations
- [ ] Follows [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)

---

## API and Error Handling

- [ ] Endpoints injected into `baseApi` — not separate createApi
- [ ] Request/response types defined
- [ ] Errors handled with `normalizeApiError`
- [ ] `reportError` called in catch blocks with source context
- [ ] Routes wrapped in error boundaries
- [ ] Follows [API_GUIDELINES.md](./API_GUIDELINES.md) and [ERROR_HANDLING_GUIDELINES.md](./ERROR_HANDLING_GUIDELINES.md)

---

## Security

- [ ] Authenticated pages behind `ProtectedRoute`
- [ ] Role checks match route metadata
- [ ] No secrets, tokens, or `.env` files committed
- [ ] No sensitive data in logs or toast messages
- [ ] Follows [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md)

---

## UI/UX and Theme

- [ ] Correct UI kit for shell (shared vs @admin)
- [ ] Loading, empty, and error states implemented
- [ ] No hardcoded hex colors — theme tokens used
- [ ] Destructive actions have confirmation dialog
- [ ] Consistent spacing and typography
- [ ] Follows [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) and [THEME_GUIDELINES.md](./THEME_GUIDELINES.md)

---

## Forms

- [ ] React Hook Form used
- [ ] Validation from `validationRules` — not inline regex
- [ ] Form logic in hook — not in component body
- [ ] Field-level errors displayed inline
- [ ] Follows [FORM_GUIDELINES.md](./FORM_GUIDELINES.md)

---

## Performance

- [ ] New routes lazy-loaded
- [ ] No unnecessary re-renders (inline objects to memo children)
- [ ] Large lists paginated
- [ ] No heavy imports in public pages from admin portal
- [ ] Follows [PERFORMANCE_GUIDELINES.md](./PERFORMANCE_GUIDELINES.md)

---

## Accessibility

- [ ] Form inputs have labels
- [ ] Icon-only buttons have `aria-label`
- [ ] Interactive elements use button/link — not div onClick
- [ ] Heading hierarchy is logical
- [ ] Follows [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md)

---

## Testing

- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] New utilities/reducers have colocated tests
- [ ] Follows [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md)

---

## SOLID Compliance

- [ ] Component has one responsibility
- [ ] Extended config/factory rather than modifying shared code
- [ ] Props interfaces are focused — not oversized
- [ ] Dependencies on abstractions (hooks, services, constants)
- [ ] Follows [SOLID_PRINCIPLES.md](./SOLID_PRINCIPLES.md)

---

## Documentation

- [ ] Complex business logic has brief comment if non-obvious
- [ ] README or docs updated if architecture changed
- [ ] No unnecessary documentation files created

---

## Breaking Changes

- [ ] No breaking route path changes without migration plan
- [ ] Backward compatibility preserved
- [ ] Breaking changes explicitly flagged in PR description and approved

---

## PR Description Template

```markdown
## Summary
- [1-3 bullet points describing the change and why]

## Type
- [ ] Feature  [ ] Bug fix  [ ] Refactor  [ ] Docs

## Test Plan
- [ ] Build passes
- [ ] Tests pass
- [ ] Manual testing steps listed

## Checklist
- [ ] Self-reviewed against CODE_REVIEW_CHECKLIST.md
```

---

## Review Severity Guide

| Severity | Action |
|----------|--------|
| **Block** | Security issue, missing route guard, hardcoded secrets, breaks build |
| **Request changes** | Architecture violation, missing error handling, no types |
| **Suggest** | Naming improvement, optional memoization, minor style |
| **Nit** | Formatting, comment wording — author discretion |
