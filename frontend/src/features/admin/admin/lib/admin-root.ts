export function getAdminRoot(): HTMLElement {
  return (
    document.querySelector<HTMLElement>(".admin-root") ??
    document.documentElement
  );
}
