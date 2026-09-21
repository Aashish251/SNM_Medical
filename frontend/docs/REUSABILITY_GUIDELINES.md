# Reusability Guidelines

## Purpose

Prevent duplication by establishing a search-first, extend-before-create workflow.

## Scope

Components, hooks, utilities, configs, and business logic across all layers.

---

## Core Principle

> Before creating anything new, search for an existing solution.

---

## Reuse Hierarchy

```
1. Use existing shared component/hook as-is
2. Extend existing component via props/config
3. Compose existing components into new widget
4. Extract shared pattern from duplicate code
5. Create new component (last resort)
```

---

## Where to Search

| Need | Search Location |
|------|----------------|
| Form field | `shared/components/FormInputs/` |
| UI primitive | `shared/components/ui/` or `@admin/components/ui/` |
| Data table | `EntityListPage`, `shared/components/DataTable` |
| Hook | `shared/hooks/`, feature `hooks/` |
| Validation | `shared/lib/formValidation.ts` |
| API pattern | nearest feature `services/` |
| Error handling | `shared/api/errors.ts`, `shared/error/` |
| Route path | `@app/router/routePaths.ts` |
| Constants | `@shared/constants` |
| Camp logic | `entities/camp/`, `widgets/camp-listing/` |

---

## Configuration Over Duplication

admin portal master pages demonstrate the target pattern:

```tsx
// One framework, many entities
export function MasterCity() {
  return <EntityListPage config={cityConfig} />;
}

export function MasterState() {
  return <EntityListPage config={stateConfig} />;
}
```

When 3+ screens share structure, extract a config-driven framework.

---

## Business Logic Separation

| Layer | Contains |
|-------|----------|
| UI component | Rendering, event handlers that delegate |
| Hook | Form state, API calls, navigation |
| Service | RTK Query endpoints |
| Entity | Domain mappers, stores |
| Config | Field definitions, column definitions |

**Never embed API calls or Redux dispatch in presentational components.**

---

## Widget Layer

When a UI block is used across multiple features, promote to `widgets/`:

| Widget | Reused By |
|--------|-----------|
| `camp-listing` | blood-donation, free-health-checkups (public) |
| `header` | All public/legacy pages |
| `dashboard-shell` | Legacy dashboard pages |
| `registration-wizard` | register, update-profile |

Promotion criteria: used in 2+ features AND contains composed logic.

---

## Rules

1. Search before create — every time
2. Extend via props/config before copying a component
3. Extract to `shared/` when used by 2+ features in different shells
4. Do not duplicate route paths, validation rules, or API error handling
5. Prefer `createMasterConfig()` pattern for similar CRUD screens

---

## Do's

- ✅ Check `EntityListPage` before building a new admin table page
- ✅ Check `FormInputs/` before creating a custom input
- ✅ Promote duplicated logic to `shared/lib/` after second occurrence
- ✅ Use `validationRules` for all form validation

---

## Don'ts

- ❌ Do not copy-paste a component and rename it
- ❌ Do not duplicate `normalizeApiError` handling patterns
- ❌ Do not create feature-specific versions of shared utilities
- ❌ Do not rebuild shadcn components from scratch

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Custom text input component | Use `TextField` |
| New admin CRUD page from scratch | Use `EntityListPage` + config |
| Duplicate camp listing logic | Use `CampListingWidget` |
| Third copy of email regex | Add to `validationRules` |

---

## Recommended Patterns

### Before creating a component, ask:

1. Does a shared component exist?
2. Can I add a prop/variant to an existing one?
3. Can I solve this with configuration?
4. Will another feature need this too? → put in `shared/` or `widgets/`
