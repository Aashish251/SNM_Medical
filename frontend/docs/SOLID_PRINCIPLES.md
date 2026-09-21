# SOLID Principles

## Purpose

Explain how SOLID principles apply to this codebase with practical examples and enforcement rules.

## Scope

Architecture decisions, component design, services, and state management.

---

## S — Single Responsibility Principle

> A module should have one reason to change.

### Applied Here

| Module | Single Responsibility |
|--------|------------------------|
| `ProtectedRoute` | Auth + role guard only |
| `authRedirects.ts` | Post-login routing only |
| `normalizeApiError` | API error normalization only |
| `useLoginForm` | Login form state + submit |
| `EntityListPage` | Generic CRUD list rendering |
| `AdminLayout` | Sidebar shell layout |
| `routePaths.ts` | Path constants only |

### Rules

- Components render UI — hooks handle logic
- Route files wire routes — no business logic
- Services define API endpoints — no UI concerns
- Pages re-export — no implementation

### Violation Example

```tsx
// ❌ Component that fetches, validates, renders table, and handles routing
function MasterSearchPage() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(...).then(setData); }, []);
  // 300 lines of table + filter + export logic
}
```

### Correct Pattern

```tsx
// ✅ Hook + presentational + config
const { data, filters, onSearch } = useMasterSearch();
return <MasterSearchTable data={data} filters={filters} onSearch={onSearch} />;
```

---

## O — Open/Closed Principle

> Open for extension, closed for modification.

### Applied Here

**Route registry** — add routes by extending config arrays without modifying factories:

```tsx
// Add new route — no changes to createProtectedRoute.tsx
legacyProtectedRouteEntries.push({
  path: ROUTE_NEW_PAGE,
  name: "new-page",
  loader: () => import("@pages/protected/new-page"),
});
```

**EntityListPage** — new master entities via config, not new page implementations:

```tsx
export function MasterCity() {
  return <EntityListPage config={cityConfig} />;
}
```

**RTK Query** — new endpoints via injection, not modifying baseApi endpoints:

```tsx
baseApi.injectEndpoints({ endpoints: (builder) => ({ /* new */ }) });
```

### Rules

- Extend config arrays and inject endpoints
- Do not modify shared factories for one feature's needs
- Add variants via props/CVA, not conditional branches for each consumer

---

## L — Liskov Substitution Principle

> Derived types must be substitutable for their base types.

### Applied Here

- Shared FormInputs accept standard RHF `register` return — any field using `register` works
- `ProtectedRoute` wraps any children with consistent guard behavior
- shadcn components accept standard HTML attributes via prop spreading
- `EntityListPage` works with any config matching `EntityListConfig` interface

### Rules

- Shared components must not assume specific parent context
- Config interfaces must be satisfied completely — partial configs break the framework
- Error boundaries must catch errors from any child component

---

## I — Interface Segregation Principle

> Clients should not depend on interfaces they don't use.

### Applied Here

**Route entry types** — minimal interfaces:

```tsx
type ProtectedRouteEntry = {
  path: string;
  name: string;
  loader: () => Promise<{ default: ComponentType }>;
};
```

**Form field props** — each input accepts only its needed props, not the entire form state.

**EntityListConfig** — separate configs for columns, fields, and actions rather than one mega-config with everything optional.

### Rules

- Split large prop interfaces into focused ones
- Do not pass entire Redux state when `userType` suffices
- Feature types should not import admin portal types and vice versa

### Violation Example

```tsx
// ❌ Oversized props
interface PageProps {
  user: UserObject;
  token: string;
  allCities: City[];
  allStates: State[];
  onLogout: () => void;
  onNavigate: (path: string) => void;
  theme: Theme;
}
```

---

## D — Dependency Inversion Principle

> Depend on abstractions, not concretions.

### Applied Here

| Abstraction | Implementation |
|-------------|---------------|
| `baseApi` | RTK Query — features inject endpoints |
| `normalizeApiError` | Handles any error shape |
| `getDefaultRouteForUserType` | Callers don't know path strings |
| `EntityListPage` | Features provide config, not table logic |
| `validationRules` | Forms depend on rule objects, not raw regex |
| Path aliases | Code depends on `@shared`, not relative `../../../` |

### Rules

- Features depend on `@shared/api/baseApi` — not raw `fetch`
- Navigation depends on route constants — not hardcoded paths
- Components depend on hook abstractions — not direct Redux/store access in JSX

---

## SOLID Compliance Checklist

When reviewing code, verify:

- [ ] Component has one clear responsibility
- [ ] New feature extends config/factory rather than modifying shared code
- [ ] Shared components work with any valid input matching their interface
- [ ] Props interfaces are minimal and focused
- [ ] Dependencies point to abstractions (hooks, services, constants)

---

## Common SOLID Violations in This Codebase

| Violation | Location | Remediation |
|-----------|----------|-------------|
| Dual admin routing systems | `/admin/*` + `/admin/*` | Centralized in `@app/router` (done) — migrate features over time |
| Dual UI kits | shared + admin portal shadcn | Accept for now — do not create a third |
| Dual toast systems | hot-toast + sonner | Accept per shell — do not mix |
| `App.tsx` shell switching | Pathname condition | Accept — extracting would add complexity without benefit |

---

## Recommended Patterns

The admin portal `EntityListPage` + `createMasterConfig` pattern is the reference implementation of OCP and SRP in this codebase. Replicate it for similar CRUD features.
