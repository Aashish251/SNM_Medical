# Performance Guidelines

## Purpose

Establish scalable performance patterns without premature optimization.

## Scope

Bundle size, code splitting, rendering, and data handling.

---

## Lazy Loading (Required)

All protected and administrator portal routes are lazy-loaded via route config:

```tsx
loader: () => import("@pages/protected/admin/dashboard")
```

`AppRoutes.tsx` wraps routes in `<Suspense fallback={<LoadingSpinner />}>`.

**Every new route must use lazy loading.**

---

## Code Splitting

Manual chunks configured in `vite.config.ts`:

| Chunk | Contents |
|-------|----------|
| `admin portal` | Entire administrator portal |
| `vendor-redux` | Redux Toolkit, react-redux, redux-persist |
| `vendor-router` | react-router-dom |
| `vendor-radix` | @radix-ui packages |
| `vendor-forms` | react-hook-form |
| `vendor-charts` | chart.js, react-chartjs-2 |
| `vendor-recharts` | recharts |
| `vendor-tanstack-table` | @tanstack/react-table |
| `vendor-motion` | framer-motion |
| `vendor-utils` | lodash, date-fns |
| `vendor` | remaining node_modules |

When adding heavy dependencies, consider if they belong in an existing chunk or need a new manual chunk entry.

---

## React Memoization

| Tool | When |
|------|------|
| `React.memo` | Pure components re-rendering due to stable-parent re-renders |
| `useMemo` | Expensive computations (filtering/sorting 100+ items) |
| `useCallback` | Callbacks passed to memoized children |

**Do not wrap every component in `memo`.** Profile first.

administrator portal tables with large datasets are the primary memoization candidates.

---

## RTK Query Caching

- Use RTK Query for server data — automatic deduplication and caching
- Set appropriate `keepUnusedDataFor` when needed
- Use `skip` option to avoid unnecessary fetches

```tsx
useGetUserQuery(id, { skip: !id });
```

---

## List Virtualization

For lists exceeding ~100 visible rows, consider virtualization before rendering all rows.

Current administrator portal tables use `@tanstack/react-table` with pagination — prefer **server-side or client-side pagination** over rendering all rows.

---

## Image Optimization

- Static assets in `public/` or `src/assets/`
- Use appropriate formats (SVG for logos, WebP where supported)
- Lazy load below-fold images with `loading="lazy"`

---

## Bundle Monitoring

Run production build and review chunk sizes:

```bash
npm run build
```

Current warning threshold: 1000 kB (`chunkSizeWarningLimit` in vite.config.ts).

Investigate if `vendor` chunk grows significantly after adding dependencies.

---

## Avoid Unnecessary Re-renders

- Colocate state as close to usage as possible
- Do not store derived data in state — use `useMemo`
- Avoid creating objects/arrays inline in JSX props to memoized children
- Use RTK Query selectors instead of copying data to local state

---

## Rules

1. All routes lazy-loaded
2. Heavy modules in manual chunks
3. No importing admin portal in public pages (shell split enforces this)
4. Paginate large data sets — do not render unbounded lists
5. Profile before optimizing

---

## Do's

- ✅ Use dynamic `import()` for heavy optional features
- ✅ Use pagination in tables and search results
- ✅ Debounce search inputs (see master-search pattern)

---

## Don'ts

- ❌ Do not import entire lodash — use specific imports if needed
- ❌ Do not eagerly import administrator portal code in public features
- ❌ Do not store full API response arrays in Redux outside RTK Query
- ❌ Do not add `memo`/`useCallback` everywhere by default

---

## Common Mistakes

| Mistake | Impact |
|---------|--------|
| Static import of large page | Increases initial bundle |
| Fetching all records without pagination | Slow render + memory |
| Re-fetching on every render | Use RTK Query with proper deps |
| Inline anonymous functions to memo children | Defeats memoization |

---

## Recommended Patterns

### Route entry with lazy loader

```tsx
{
  path: ROUTE_ADMIN_USERS,
  name: "admin-users",
  loader: () => import("@admin/features/users").then(m => ({ default: m.Users })),
}
```

### Debounced search (reference)

See `features/admin/master-search/` for server-side search with debounce pattern.
