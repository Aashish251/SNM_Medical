# Form Guidelines

## Purpose

Standardize form implementation using React Hook Form, shared field components, and validation rules.

## Scope

All forms in legacy features, public pages, and administrator portal entity dialogs.

---

## Two Form Systems

| Shell | Form UI | Pattern |
|-------|---------|---------|
| Public / Legacy | `@shared/components/FormInputs/*` | `register` prop + `error` from RHF |
| Admin Panel | `@admin/components/ui/form` | `FormField` + config-driven fields |

Do not mix form systems within a single screen.

---

## React Hook Form — Standard Setup

```tsx
import { useForm } from "react-hook-form";

interface FormData {
  identifier: string;
  password: string;
}

const form = useForm<FormData>();
const { register, handleSubmit, formState: { errors } } = form;
```

Encapsulate in a custom hook (`useLoginForm`, `useRegistrationForm`).

---

## Shared Form Fields (Legacy)

Location: `shared/components/FormInputs/`

| Component | Use For |
|-----------|---------|
| `TextField` | Text, email |
| `PasswordField` | Password with toggle |
| `NumberField` | Numeric input |
| `SelectField` | Simple select |
| `SearchableSelect` | Searchable dropdown |
| `TextareaField` | Multi-line text |
| `CheckboxField` | Boolean |
| `DatePickerField` | Date selection |
| `FileUploadField` | File upload |

### Usage

```tsx
<TextField
  label="Email"
  register={register("email", validationRules.email)}
  error={errors.email}
/>
```

---

## Validation Rules

Centralized in `shared/lib/formValidation.ts`:

```tsx
import { validationRules } from "@shared/lib/formValidation";

register("email", {
  ...validationRules.required("Email"),
  ...validationRules.email,
})

register("mobileNo", {
  ...validationRules.required("Mobile"),
  ...validationRules.mobileNumber,
})
```

Available rules: `required`, `email`, `mobileNumber`, `password`, `minLength`, `maxLength`, `min`, `max`.

**Add new reusable rules here** — not inline in every form.

---

## Multi-Step Registration Wizard

Shared hook: `shared/hooks/useProfileWizardForm.ts`

Used by:
- `features/register/hooks/useRegistrationForm.ts`
- `features/update-profile/`

Steps in `shared/components/Registration/`:
- PersonalDetailsStep
- ProfessionalDetailsStep
- LoginDetailsStep

Dropdown data via `CommonApi` RTK Query.

---

## Admin Panel — Config-Driven Forms

```tsx
// entity-form-dialog.tsx uses:
const form = useForm<Record<string, unknown>>();

// Config defines fields:
const fields: EntityFormField[] = [
  { name: "name", label: "City Name", type: "text", required: true },
  { name: "status", label: "Status", type: "select", options: statusOptions },
];
```

Create configs via `createMasterConfig()` or `create-camp-config.ts`.

---

## Error Handling

| Error Type | Handling |
|------------|----------|
| Field validation | RHF `errors` → display on field |
| API error on submit | `normalizeApiError` → toast |
| Loading state | Disable submit button + loading indicator |

```tsx
const onSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await mutation(data).unwrap();
    toast.success("Saved successfully!");
  } catch (error) {
    toast.error(normalizeApiError(error).message);
  } finally {
    setLoading(false);
  }
};
```

---

## Form Layouts

- Legacy: Tailwind grid in feature components
- Admin panel: shadcn `FormItem` + `FormLabel` + `FormMessage` in dialogs
- Registration wizard: step indicator + `ProfileSection` wrapper

---

## Rules

1. All forms use React Hook Form
2. Validation rules from `validationRules` — not inline regex copy-paste
3. Form logic in hooks — components render only
4. Shared fields before custom one-offs
5. admin portal forms via `EntityFormDialog` + config

---

## Do's

- ✅ Type form data with explicit interfaces
- ✅ Show field-level errors below inputs
- ✅ Disable submit during loading
- ✅ Use `toast.loading` / dismiss pattern for long operations

---

## Don'ts

- ❌ Do not use uncontrolled inputs without RHF
- ❌ Do not duplicate validation regex across files
- ❌ Do not submit without error handling
- ❌ Do not mix legacy FormInputs in administrator portal dialogs

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Inline `/^[^\s@]+@[^\s@]+/` regex | `validationRules.email` |
| Form state in Redux | React Hook Form |
| 200-line form in index.tsx | Extract hook + sub-components |
| Missing `required` validation | Use `validationRules.required("Field")` |

---

## Recommended Patterns

### Login form hook (reference)

See `features/login/hooks/useLoginForm.ts` — canonical pattern for simple forms with API submit and redirect.
