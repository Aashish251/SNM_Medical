# Testing Guidelines

## Purpose

Define testing standards, tools, and expectations for maintaining code quality.

## Scope

Unit tests, component tests, and testing practices. E2E is not currently configured.

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| Vitest 4 | Test runner |
| jsdom | DOM environment |
| @testing-library/react | Component rendering |
| @testing-library/jest-dom | DOM matchers |

### Scripts

```bash
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

### Configuration

`vitest.config.ts`:
- `globals: true`
- `include: ["src/**/*.test.{ts,tsx}"]`
- Same path aliases as Vite

---

## What to Test

### Required (high value)

| Category | Examples |
|----------|----------|
| Utility functions | `normalizeApiError`, `formDataMappers` |
| Redux reducers | `authSlice` signIn/signOut |
| Custom hooks | `useProfileWizardForm` |
| Error boundaries | Render fallback on error |
| Validation rules | Edge cases in `formValidation` |

### Recommended

| Category | Examples |
|----------|----------|
| Config factories | `createMasterConfig` output shape |
| Route helpers | `getDefaultRouteForUserType` |
| Entity stores | Camp localStorage store read/write |

### Not Required (low value)

- shadcn UI primitives (tested upstream)
- Pure presentational components with no logic
- Static config objects
- Snapshot tests of entire pages

---

## File Organization

Colocate tests with source:

```
entities/session/model/
├── authSlice.ts
└── authSlice.test.ts

shared/api/
├── errors.ts
└── errors.test.ts
```

Naming: `<filename>.test.ts` or `<filename>.test.tsx`

---

## Writing Tests

### Utility test example

```tsx
import { describe, it, expect } from "vitest";
import { normalizeApiError } from "./errors";

describe("normalizeApiError", () => {
  it("returns fallback message for unknown errors", () => {
    const result = normalizeApiError("unexpected");
    expect(result.message).toBe("Something went wrong. Please try again.");
  });
});
```

### Reducer test example

```tsx
import { authSlice, signIn, signOut } from "./authSlice";

describe("authSlice", () => {
  it("signIn sets session state", () => {
    const state = authSlice.reducer(undefined, signIn({
      token: "abc",
      userType: "admin",
      userDetails: null,
      isSignedIn: true,
    }));
    expect(state.isSignedIn).toBe(true);
    expect(state.token).toBe("abc");
  });
});
```

### Component test example

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("ErrorBoundary", () => {
  it("renders fallback when child throws", () => {
    // See shared/error/ErrorBoundary.test.tsx for reference
  });
});
```

---

## Mocking

### RTK Query

Wrap components in test Provider with configured store:

```tsx
import { Provider } from "react-redux";
import { store } from "@app/store";

render(
  <Provider store={store}>
    <ComponentUnderTest />
  </Provider>
);
```

For isolated tests, create a test store with `configureStore`.

### Router

Use `MemoryRouter` for components requiring routing context:

```tsx
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter initialEntries={["/login"]}>
    <Login />
  </MemoryRouter>
);
```

---

## Existing Tests (Reference)

| File | Coverage |
|------|----------|
| `shared/api/errors.test.ts` | API error normalization |
| `shared/error/ErrorBoundary.test.tsx` | Error boundary rendering |
| `shared/error/errorLogger.test.ts` | Error logging |
| `shared/hooks/useProfileWizardForm.test.ts` | Registration wizard hook |
| `entities/session/model/authSlice.test.ts` | Auth reducers |
| `entities/registration/model/formDataMappers.test.ts` | Form mappers |

---

## Rules

1. Add tests for new utilities, reducers, and mappers
2. Colocate tests with source files
3. Tests must pass before PR merge
4. No testing implementation details — test behavior
5. Do not mock what you don't own unnecessarily

---

## Do's

- ✅ Test edge cases and error paths
- ✅ Use descriptive test names: `"returns MS dashboard for ms role"`
- ✅ Follow existing test file patterns

---

## Don'ts

- ❌ Do not skip tests for complex business logic
- ❌ Do not test third-party library internals
- ❌ Do not rely on network calls in unit tests — mock API
- ❌ Do not commit `.only` or `.skip` without removal before merge

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing implementation details | Test public behavior/output |
| No test for new utility function | Add colocated `.test.ts` |
| Fragile selectors | Use role/text queries over CSS classes |
| Missing Provider wrapper | Wrap with Redux/Router providers |

---

## Future: E2E Testing

E2E is not configured. When added, prefer Playwright or Cypress for:
- Login flow
- Role-based redirects
- Critical admin CRUD paths

Document E2E setup in this file when implemented.

---

## Recommended Patterns

When adding a new utility to `shared/lib/` or reducer to `entities/`, add a colocated test file as part of the same PR.
