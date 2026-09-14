/**
 * Document View Helper
 * Resolves document/PDF URLs to safe viewing endpoints.
 * Cloudinary PDFs and local uploads are routed through the backend
 * streaming proxy to avoid Cloudinary ACL 401 errors or missing file crashes.
 */
export const getDocumentViewUrl = (regId?: number | string | null, localBlobPath?: string | null): string => {
  if (localBlobPath && localBlobPath.startsWith("blob:")) {
    return localBlobPath;
  }

  if (!regId) return "";

  const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const baseUrl = rawBase.trim().replace(/\/+$/, "");

  return `${baseUrl}/api/files/view?regId=${encodeURIComponent(String(regId))}`;
};

export const openDocumentView = async (regId?: number | string | null): Promise<void> => {
  const documentUrl = getDocumentViewUrl(regId);
  if (!documentUrl) return;

  const documentWindow = window.open("about:blank", "_blank");

  try {
    const persistedState = localStorage.getItem("persist:root");
    const persistedRoot = persistedState ? JSON.parse(persistedState) : null;
    const persistedAuth = persistedRoot?.auth ? JSON.parse(persistedRoot.auth) : null;
    const token = persistedAuth?.token as string | undefined;

    const response = await fetch(documentUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) {
      throw new Error("Unable to open certificate");
    }

    const documentBlob = await response.blob();
    const blobUrl = URL.createObjectURL(documentBlob);
    if (documentWindow) {
      documentWindow.location.href = blobUrl;
    }
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  } catch (error) {
    documentWindow?.close();
    console.error("Unable to open certificate", error);
  }
};
