# Form Validation Architecture & Guide

This document establishes the centralized form validation structure for the SNM Medical codebase using `react-hook-form`. All existing and future forms must follow these conventions.

---

## 1. Single Source of Truth

All validation rules, schemas, patterns, and sanitizers are defined in:
- **`src/shared/lib/formValidation.ts`** (canonical source: `@shared/lib/formValidation`)
- Re-exported for Admin modules at: **`src/features/admin/admin/lib/form-validation.ts`** (`@admin/lib/form-validation`)

> **Rule for AI & Human Developers:**
> Never write inline validation regexes or duplicate validators (e.g. email, phone, name patterns) across components. Always import from `@shared/lib/formValidation`.

---

## 2. Core Validation Rules & Helpers Reference

### Rules (`validationRules.*`)

| Rule | Description | Behavior / Validation Error |
| :--- | :--- | :--- |
| `validationRules.required(label, options?)` | Mandatory field validator | Displays `"${label} is required"`. Automatically disallows whitespace-only by default (`"${label} cannot contain only spaces"`). |
| `validationRules.noWhitespaceOnly(label)` | Whitespace disallow rule | For optional fields where empty is allowed, but whitespace-only is rejected. |
| `validationRules.alphabetic(label, options?)` | Letters & spaces validator | Allows letters and spaces. Disallows whitespace-only (`"${label} cannot contain only spaces"`). Disallows numbers & symbols. Can be required via `{ required: true }`. |
| `validationRules.trimmedAlphabetic(label, fieldName, setValue, options?)` | **Recommended:** One-stop alphabetic field registration | Combines `alphabetic` validation, `onChange` non-alpha filtering, and `onBlur` whitespace trimming & space collapsing. |
| `validationRules.fullName(label?)` | Person's full name rule | Requires minimum 2 characters, only letters, with single spaces between words. |
| `validationRules.email` / `requiredEmail(label?)` | Email address rule | Validates standard email format. Rejects whitespace-only. |
| `validationRules.mobileNumber` | 10-digit Indian mobile rule | Requires 10 digits starting with digits 6-9. |
| `validationRules.identifier(label?)` | Email OR Phone number | Accepts either a valid email address OR a 10-digit mobile number (used in Login). |
| `validationRules.age` | Age rule | Enforces numbers only between 0 and 150. |
| `validationRules.password(options?)` | Password complexity rule | Enforces minimum length (default 6). |
| `validationRules.confirmPassword(getPassword)` | Password match rule | Validates that the field matches the watched password value. |
| `validationRules.minLength(label, length)` | Minimum length | Displays `"${label} must be at least ${length} characters"`. |
| `validationRules.maxLength(label, length)` | Maximum length | Displays `"${label} must be at most ${length} characters"`. |

### Sanitizers & Utilities

| Helper | Purpose |
| :--- | :--- |
| `sanitizeWhitespace(value)` | Trims leading/trailing whitespace and collapses multiple consecutive spaces between words into a single space. |
| `isWhitespaceOnly(value)` | Returns `true` if a string is non-empty but contains only whitespace characters. |
| `trimFormValues(values)` | Traverses a form values object and returns a cleaned copy where all string fields are sanitized with `sanitizeWhitespace`. |
| `createTrimOnBlurHandler(fieldName, setValue, customOnBlur?)` | Reusable `onBlur` handler for React Hook Form fields. Normalizes leading/trailing and consecutive spaces on blur, and triggers validation if only spaces were entered. |
| `createFileValidation(options)` | Validates file upload extension and maximum file size (in MB). |

---

## 3. Recommended Usage Patterns

### Pattern A: Standard Form Inputs with `register`

For text fields that accept words with spaces (such as security questions, samagam name, last sewa, recommender, etc.), use `validationRules.trimmedAlphabetic`:

```tsx
import { TextField } from "@shared/components/FormInputs";
import { validationRules } from "@shared/lib/formValidation";

// Optional field:
<TextField
  label="Samagam Held In"
  placeholder="Enter samagam held in"
  register={register(
    "samagamHeldIn",
    validationRules.trimmedAlphabetic("Samagam Held In", "samagamHeldIn", form.setValue)
  )}
  error={errors.samagamHeldIn}
/>

// Required field:
<TextField
  label="What is your favorite food?"
  required
  placeholder="Enter favorite food"
  register={register(
    "favoriteFood",
    validationRules.trimmedAlphabetic(
      "Favorite food",
      "favoriteFood",
      form.setValue,
      { required: true }
    )
  )}
  error={errors.favoriteFood}
/>
```

### Pattern B: Admin Dialogs with Shadcn `<FormField>`

When using `@admin/components/ui/form`'s `<FormField control={form.control} name="..." rules={...} />`:

```tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@admin/components/ui/form";
import { Input } from "@admin/components/ui/input";
import { validationRules } from "@shared/lib/formValidation";

<FormField
  control={form.control}
  name="patientName"
  rules={validationRules.required("Patient Name")}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Patient Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter patient name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pattern C: Identifier (Email or Phone) in Login

```tsx
<TextField
  label="Email ID / Contact No."
  placeholder="Enter your email or mobile number"
  required
  register={register(
    "identifier",
    validationRules.identifier("Email ID or Contact Number")
  )}
  error={errors.identifier}
/>
```

### Pattern D: Password & Password Confirmation

```tsx
<PasswordField
  label="New Password"
  required
  register={register("newPassword", validationRules.password({ minLength: 6 }))}
  error={errors.newPassword}
/>

<PasswordField
  label="Confirm Password"
  required
  register={register(
    "confirmPassword",
    validationRules.confirmPassword(() => watch("newPassword"))
  )}
  error={errors.confirmPassword}
/>
```

### Pattern E: Safe Payload Submission with `trimFormValues`

Before submitting form data to mutations or API endpoints, clean the payload with `trimFormValues`:

```tsx
import { trimFormValues } from "@shared/lib/formValidation";

const onSubmit = async (data: FormValues) => {
  const cleanData = trimFormValues(data);
  const formData = createRegistrationFormData(cleanData);
  await triggerRegisterUser(formData).unwrap();
};
```

---

## 4. Whitespace Validation Specification

In accordance with system requirements, form fields must handle whitespace as follows:

1. **Whitespace-Only Prevention**: Any field populated entirely with spaces (e.g. `"   "`) must be flagged as invalid with message `"${label} cannot contain only spaces"`.
2. **OnBlur Trimming**: When a user leaves a field, leading and trailing whitespace must be trimmed immediately, while preserving single spaces between words (e.g. `"  South  Indian  Dosa  "` becomes `"South Indian Dosa"`).
3. **Submission Sanitization**: `createRegistrationFormData` and `trimFormValues` guarantee that only trimmed values are transmitted to API payloads.
4. **Consistency**: Both unauthenticated (`/register`) and authenticated Admin (`/admin/users`) registration flows share the exact same step components (`ProfessionalDetailsStep`, `LoginDetailsStep`, `PersonalDetailsStep`) and validation logic.
