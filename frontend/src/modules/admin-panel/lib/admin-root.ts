export function getAdminPanelRoot(): HTMLElement {
  return (
    document.querySelector<HTMLElement>(".admin-panel-root") ??
    document.documentElement
  );
}
