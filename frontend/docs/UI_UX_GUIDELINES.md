# UI/UX Guidelines

## Purpose

Maintain a consistent user experience across public site, legacy protected pages, and admin panel.

## Scope

Layouts, common UI patterns, feedback states, and interaction design.

---

## Page Layouts

| Layout | Used By | Structure |
|--------|---------|-----------|
| Site shell | Public, `/ms/*`, `/admin/*` | Header → main content → Footer |
| DashboardLayout | Legacy dashboards | Content wrapper with padding |
| AdminLayout | `/admin/*` | Sidebar + header + `<Outlet />` |
| Full-width public | Landing, camps | Hero sections, no dashboard wrapper |

---

## Cards

Use shadcn `Card` components:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

Admin panel: `@admin/components/ui/card`
Legacy: `@shared/components/ui/card`

---

## Tables

| Shell | Component | Features |
|-------|-----------|----------|
| Legacy master search | `@shared/components/DataTable` | Server-side paging |
| Admin panel | `EntityListPage` + `@tanstack/react-table` | Sort, filter, pagination, row actions |

admin portal table pattern:

```tsx
<EntityListPage config={entityConfig} />
```

Do not build custom tables when `EntityListPage` supports the use case.

---

## Buttons

Use shadcn Button with variants:

| Variant | Use |
|---------|-----|
| `default` / primary | Primary action (Submit, Save) |
| `outline` | Secondary action (Cancel) |
| `destructive` | Delete, irreversible actions |
| `ghost` | Toolbar icons, subtle actions |
| `link` | Navigation-style actions |

Always show loading/disabled state during async operations.

---

## Dialogs and Drawers

| Component | Use |
|-----------|-----|
| `Dialog` | Confirmations, forms (entity create/edit) |
| `AlertDialog` | Destructive confirmations (delete) |
| `Sheet` | Mobile sidebar, secondary panels |
| `Drawer` (vaul) | Bottom sheets on mobile |

Admin panel entity CRUD uses `EntityFormDialog` and `EntityDeleteDialog`.

---

## Forms in UI Context

- Label every input
- Show validation errors inline below fields
- Group related fields visually (grid layout)
- Primary submit button at bottom-right or form footer

---

## Empty States

When lists/tables have no data:

```tsx
<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
  <Icon className="h-12 w-12 mb-4 opacity-50" />
  <p className="text-lg font-medium">No records found</p>
  <p className="text-sm">Create your first record to get started.</p>
</div>
```

Include a call-to-action when the user can create records.

---

## Loading States

| Context | Pattern |
|---------|-----------|
| Route transition | `<LoadingSpinner />` in Suspense fallback |
| Page data fetch | RTK Query `isLoading` → skeleton or spinner |
| Button action | Disabled button + "Saving..." text |
| Admin nav | `react-top-loading-bar` on route change |
| Table data | Skeleton rows or overlay spinner |

Never leave the user without feedback during operations > 300ms.

---

## Pagination, Search, Filters

### Legacy master search
Server-side paging via API parameters.

### Admin panel
- `EntityListPage` includes built-in search/filter
- `use-admin-table-search` hook for table-level filtering
- Client-side filtering for mock/local data stores

---

## Toast Notifications

| Shell | Library | Import |
|-------|---------|--------|
| Public / Legacy | react-hot-toast | `@shared/lib/toast` |
| Admin Panel | sonner | `@admin/components/ui/sonner` |

```tsx
toast.success("Saved!");
toast.error("Something went wrong");
const id = toast.loading("Saving...");
toast.dismiss(id);
```

---

## Rules

1. Use existing shadcn components — do not rebuild primitives
2. Consistent spacing via Tailwind (`gap-4`, `p-6`, `space-y-4`)
3. Loading, empty, and error states required for all data views
4. Destructive actions require confirmation dialog
5. Match the UI kit of the current shell

---

## Do's

- ✅ Use `lucide-react` icons consistently
- ✅ Responsive design with Tailwind breakpoints (`md:`, `lg:`)
- ✅ Use `text-muted-foreground` for secondary text

---

## Don'ts

- ❌ Do not use browser `alert()` or `confirm()`
- ❌ Do not show raw API error objects to users
- ❌ Do not mix toast libraries in one shell
- ❌ Do not leave tables without empty states

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Custom modal div | Use shadcn Dialog |
| No loading on submit | Disable button + show spinner |
| Hardcoded spacing values | Tailwind spacing scale |
| Inline styles for colors | Theme tokens (see THEME_GUIDELINES.md) |

---

## Recommended Patterns

Reference implementations:
- Login page: `features/login/`
- Admin dashboard: `modules/admin/features/dashboard/`
- Entity CRUD: `modules/admin/features/master/city/`
- Public camp listing: `widgets/camp-listing/`
