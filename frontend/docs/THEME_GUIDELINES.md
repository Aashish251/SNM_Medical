# Theme Guidelines

## Purpose

Ensure visual consistency by reusing theme tokens instead of hardcoded values.

## Scope

All styling: Tailwind classes, CSS variables, and component theming.

---

## Styling Stack

| Layer | Technology |
|-------|------------|
| Utility CSS | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Design tokens | CSS custom properties (shadcn-style) |
| Component variants | `class-variance-authority` (CVA) |
| Class merging | `cn()` from `@shared/lib/utils` |
| Animations | `tailwindcss-animate`, `tw-animate-css` |
| Primitives | Radix UI via shadcn components |

---

## Two Theme Scopes

| Scope | CSS File | Root Class |
|-------|----------|------------|
| Global (public + legacy) | `src/index.css` | `:root`, `.dark` |
| Admin panel | `@admin/styles/admin.css` | `.admin-root` |

Admin panel theme is scoped — dark mode toggled via `ThemeProvider` without affecting the public site.

---

## Brand Colors

Defined in `src/index.css` `@theme inline`:

```css
--color-brand-primary: #186dc9;
--color-brand-secondary: #E46E55;
--color-brand-accent: #FACC15;
--to-right-gradient-theme: linear-gradient(to right, var(--color-brand-primary), var(--color-brand-secondary));
```

### Tailwind Usage

```tsx
className="bg-brand-primary text-white"
className="bg-gradient-to-r from-brand-primary to-brand-secondary"
```

---

## Semantic Tokens (shadcn)

Use semantic tokens for UI components:

| Token | Tailwind Class | Use |
|-------|---------------|-----|
| `--background` | `bg-background` | Page background |
| `--foreground` | `text-foreground` | Primary text |
| `--primary` | `bg-primary` | Primary buttons |
| `--secondary` | `bg-secondary` | Secondary surfaces |
| `--muted` | `bg-muted` | Subtle backgrounds |
| `--muted-foreground` | `text-muted-foreground` | Secondary text |
| `--destructive` | `bg-destructive` | Error/delete |
| `--border` | `border-border` | Borders |
| `--ring` | `ring-ring` | Focus rings |
| `--sidebar-*` | `bg-sidebar` etc. | Admin sidebar |

---

## Typography

- Default: system font stack via Tailwind
- Headings: Tailwind `text-xl`, `text-2xl`, `font-semibold`, `font-bold`
- Body: `text-sm`, `text-base`
- Muted: `text-muted-foreground`

Do not import custom font files without design approval.

---

## Spacing

Use Tailwind spacing scale consistently:

| Context | Classes |
|---------|---------|
| Page padding | `p-4`, `p-6`, `px-4 lg:px-8` |
| Section gaps | `space-y-4`, `space-y-6`, `gap-4` |
| Card padding | `p-4` or `p-6` |
| Form field gaps | `space-y-4` |

---

## Border Radius

Configured via CSS variable:

```css
--radius: 0.625rem;
```

Tailwind: `rounded-lg`, `rounded-md`, `rounded-sm` map to radius tokens.

---

## Icons

| Library | Use |
|---------|-----|
| `lucide-react` | Primary — admin panel, new components |
| `react-icons` | Legacy public site icons |
| `@radix-ui/react-icons` | shadcn component internals |

Prefer `lucide-react` for new work. Standard size: `className="h-4 w-4"` (inline), `h-5 w-5` (buttons).

---

## Dark Mode

| Shell | Mechanism |
|-------|-----------|
| Admin panel | `ThemeProvider` — `light` / `dark` / `system`, cookie-backed |
| Public site | `.dark` class on root (limited usage) |

Admin panel dark tokens defined in `admin.css` under `.admin-root.dark`.

---

## Rules

1. **Never hardcode hex colors** in components — use Tailwind token classes
2. Use `cn()` for conditional classes
3. Use CVA for component variants (see shadcn Button)
4. Add new brand tokens to `index.css` `@theme` — not inline
5. Admin panel tokens go in `admin.css`

---

## Do's

- ✅ Use `bg-primary`, `text-muted-foreground`, `border-border`
- ✅ Use brand gradient CSS variable for hero sections
- ✅ Test both light and dark mode for administrator portal screens

---

## Don'ts

- ❌ Do not use `style={{ color: '#186dc9' }}`
- ❌ Do not use arbitrary Tailwind colors (`bg-[#186dc9]`) unless one-off prototype
- ❌ Do not modify shadcn component internals — extend via className
- ❌ Do not mix global and admin portal CSS variables in one component

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `text-gray-500` for secondary text | `text-muted-foreground` |
| `bg-blue-600` for primary button | `bg-primary` |
| Hardcoded gradient | `var(--to-right-gradient-theme)` |
| Inline dark mode styles | Use `.dark` token overrides |

---

## Recommended Patterns

```tsx
import { cn } from "@shared/lib/utils";

<button className={cn(
  "inline-flex items-center gap-2 rounded-md px-4 py-2",
  "bg-primary text-primary-foreground",
  "hover:bg-primary/90",
  disabled && "opacity-50 cursor-not-allowed"
)} />
```

### Adding shadcn components

Legacy shell: `npx shadcn@latest add <component>` (maps to `@shared/components/ui` via `components.json`)

Admin panel: manually add to `@admin/components/ui/` following existing shadcn patterns.
