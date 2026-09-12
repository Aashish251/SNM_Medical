export function getAvatarUrl(path?: string | null): string | undefined {
  const value = typeof path === "string" ? path.trim() : "";

  if (!value) return undefined;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;

  return `${baseUrl}${normalizedPath}`;
}
