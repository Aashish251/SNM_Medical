# Accessibility Guidelines

## Purpose

Ensure the application is usable by people with disabilities and meets baseline accessibility standards.

## Scope

All UI components, forms, navigation, and interactive elements.

---

## Foundation: Radix UI

Both UI kits (`shared/components/ui` and `@admin/components/ui`) are built on **Radix UI** primitives, which provide:

- Keyboard navigation
- Focus management
- ARIA attributes
- Screen reader support

**Prefer shadcn/Radix components over custom interactive elements.**

---

## Semantic HTML

```tsx
// ✅ Correct
<main>
  <h1>Dashboard</h1>
  <nav aria-label="Main navigation">...</nav>
  <button type="submit">Save</button>

// ❌ Avoid
<div onClick={handleClick}>Save</div>   // use <button>
<div className="text-2xl font-bold">    // use <h1>–<h6>
```

Use appropriate heading hierarchy (`h1` → `h2` → `h3`) — one `h1` per page.

---

## Keyboard Navigation

- All interactive elements must be reachable via Tab
- Dropdowns, dialogs, and menus: Radix handles arrow keys and Escape
- Custom interactive elements need explicit `tabIndex={0}` and key handlers
- Do not trap focus outside of modals (Radix Dialog handles trapping)

---

## Focus Management

- Visible focus rings: use `ring-ring` / `focus-visible:ring-2` (shadcn default)
- After dialog close, focus returns to trigger element (Radix default)
- After route navigation, focus should move to main content (admin panel header handles this)

---

## Forms

- Every input must have an associated `<label>` or `aria-label`
- Required fields: indicate visually and with `aria-required`
- Error messages linked via `aria-describedby` (shadcn FormMessage handles this in admin panel)
- Legacy FormInputs accept `label` prop — always provide it

```tsx
<TextField label="Email" register={...} error={errors.email} />
```

---

## ARIA Attributes

| Scenario | Attribute |
|----------|-----------|
| Loading state | `aria-busy="true"` on container |
| Toggle button | `aria-pressed` |
| Expandable section | `aria-expanded` |
| Live notifications | `aria-live="polite"` (Sonner toasts) |
| Icon-only button | `aria-label="Delete record"` |
| Navigation region | `aria-label="Sidebar navigation"` |

---

## Color Contrast

- Use semantic tokens (`text-foreground`, `text-muted-foreground`) — designed for contrast
- Do not rely on color alone to convey status — add text or icons
- Brand colors on buttons must meet WCAG AA contrast with text
- Test admin panel in both light and dark modes

---

## Images and Icons

- Decorative images: `alt=""`
- Informative images: descriptive `alt` text
- Icon-only buttons: require `aria-label`

```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
```

---

## Screen Reader Support

- Use semantic landmarks: `<main>`, `<nav>`, `<header>`, `<footer>`
- Table headers: use proper `<th>` elements (TanStack Table column definitions)
- Status changes announced via toast (Sonner/react-hot-toast handle this)
- Avoid `display: none` on content that should be screen-reader accessible — use visually hidden classes instead

---

## Rules

1. Use Radix/shadcn components for all interactive UI
2. Every form input has a label
3. Icon-only buttons have `aria-label`
4. Do not remove focus outlines without replacement
5. Heading hierarchy must be logical
6. Color is not the only indicator of state

---

## Do's

- ✅ Test keyboard-only navigation on new screens
- ✅ Use shadcn `FormLabel` + `FormMessage` in admin panel
- ✅ Provide alt text for meaningful images

---

## Don'ts

- ❌ Do not use `<div onClick>` instead of `<button>`
- ❌ Do not remove Radix accessibility props when wrapping components
- ❌ Do not disable focus rings globally
- ❌ Do not use placeholder as the only label

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Click handler on div | Use Button component |
| Missing label on input | Add `label` prop or `aria-label` |
| Icon button without label | Add `aria-label` |
| Skipped heading levels | Maintain h1 → h2 → h3 order |

---

## Recommended Patterns

Admin panel sidebar and dialog components follow accessible patterns — use them as reference implementations.

For legacy forms, always pass the `label` prop to shared FormInput components.
