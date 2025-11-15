import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store, type RootState } from "@app/store";
import { signOut } from "@features/login/redux/authSlice";
import { toast } from "@shared/lib/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit", // optional, keep if you don't use cookies
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Don't set Content-Type for FormData, let the browser handle it
    if (!headers.has("Content-Type") && !(headers.get("x-is-form-data") === "true")) {
      headers.set("Content-Type", "application/json");
    }
    
    // Remove our custom header before sending
    headers.delete("x-is-form-data");
    return headers;
  },
});

// Wrapper to handle token expiration globally
export const customBaseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await customBaseQuery(args, api, extraOptions);

  // Check for 401 (Unauthorized) or 403 (Forbidden) - token expired
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    // Dispatch logout to clear auth state
    store.dispatch(signOut());
    
    // Optional: Show toast for user feedback
    toast.error("Your session has expired. Please log in again.");
    
    // Navigation is handled by ProtectedRoute (redirects to login if not signed in)
  }

  return result;
};
