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
