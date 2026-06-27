# Component Guidelines

## Purpose

Define how React components are structured, sized, composed, and exported for maintainability at scale.

## Scope

All React components in `features/`, `modules/`, `widgets/`, and `shared/components/`.

---

## Smart vs Presentational

| Type | Responsibility | Location |
|------|---------------|----------|
| **Smart (container)** | Data fetching, Redux, routing, form submit | Feature `index.tsx`, hooks |
| **Presentational** | Render UI from props, no side effects | `components/` subfolders |

```tsx
// Smart — features/login/index.tsx
const Login = () => {
  const { form, onSubmit, loading } = useLoginForm();
  return <LoginForm form={form} onSubmit={onSubmit} loading={loading} />;
};

// Presentational — features/login/components/LoginForm.tsx
export const LoginForm = ({ form, onSubmit, loading }: LoginFormProps) => { /* ... */ };
```

---

## Component Size Limits

| Guideline | Threshold | Action |
|-----------|-----------|--------|
| Single file | ~200 lines | Extract sub-components or hooks |
| Props count | > 8 props | Consider composition or config object |
| JSX nesting | > 4 levels | Extract named sub-component |
| Multiple concerns | Form + table + dialog | Split into separate components |

admin portal master pages (~25 lines) demonstrate the target size via config-driven composition.

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Page/feature entry | `index.tsx` | `features/login/index.tsx` |
| Component | PascalCase.tsx | `LoginForm.tsx` |
| Hook file | camelCase with `use` prefix | `useLoginForm.ts` |
| Config | kebab-case or camelCase | `listingConfig.ts`, `create-master-config.ts` |

---

## Export Patterns

### Legacy features — default export from index

```tsx
// features/contact/index.tsx
const Contact = () => { /* ... */ };
export default Contact;
```

### administrator portal features — named export

```tsx
// modules/admin/features/dashboard/index.tsx
export function Dashboard() { /* ... */ }
```

### Shared components — named export

```tsx
export const TextField = ({ label, register, error }: TextFieldProps) => { /* ... */ };
```

### Barrel exports

Use `index.ts` sparingly for public API of a folder:

```tsx
// shared/components/FormInputs/index.ts
export { TextField } from "./TextField";
export { SelectField } from "./SelectField";
```

---

## Props Design

- Define explicit TypeScript interfaces for all props
- Prefer required props over excessive optional chaining
- Use discriminated unions for variant props
- Avoid spreading entire form objects when 2–3 fields suffice

```tsx
interface TextFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
}
```

---

## Composition Over Inheritance

Use composition and configuration instead of class inheritance or deep prop drilling:

```tsx
// ✅ Config-driven
<EntityListPage config={cityConfig} />

// ✅ Composition
<Card>
  <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
  <CardContent>{children}</CardContent>
</Card>

// ❌ Avoid
class AdminPage extends BasePage { /* ... */ }
```

---

## UI Kit Selection

| Shell | UI Components |
|-------|---------------|
| Public / Legacy | `@shared/components/ui/*` |
| Admin Panel | `@admin/components/ui/*` |

**Do not mix UI kits in a single screen.** Both are shadcn-based but maintained separately.

---

## Rules

1. One component, one responsibility
2. Business logic in hooks — not in JSX
3. No API calls directly in presentational components
4. Wrap risky widgets in `WidgetErrorBoundary`
5. Use `cn()` from `@shared/lib/utils` for conditional classes

---

## Do's

- ✅ Extract repeated JSX into sub-components
- ✅ Use existing FormInputs before creating new field components
- ✅ Use Radix UI primitives via shadcn components
- ✅ Colocate feature-specific components in `features/<name>/components/`

---

## Don'ts

- ❌ Do not use `any` for props
- ❌ Do not put fetch logic in render functions
- ❌ Do not create god components (> 400 lines)
- ❌ Do not inline complex SVG icons — use `lucide-react`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Form logic in component body | Extract `useXForm` hook |
| Duplicating TextField | Use `@shared/components/FormInputs/TextField` |
| Importing admin portal Button in public site | Use `@shared/components/ui/button` |
| Default + named export confusion | Follow shell-specific export pattern |

---

## Recommended Patterns

### Config-driven list page (admin portal)

```tsx
export function MasterCity() {
  return <EntityListPage config={cityConfig} />;
}
```

### Feature hook returns everything the UI needs

```tsx
return { form, loading, onSubmit, error };
```
