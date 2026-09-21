export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return emailPattern.test(value.trim());
}

export function validatePassword(
  password: string,
  isEdit: boolean
): string | true {
  const trimmed = password.trim();
  if (isEdit && !trimmed) return true;
  if (!trimmed) return "Password is required.";
  if (trimmed.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(trimmed))
    return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(trimmed)) return "Password must contain at least one number.";
  return true;
}
