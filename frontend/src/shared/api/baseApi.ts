import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { refreshToken, signOut } from "@entities/session/model/authSlice";
import { toast } from "@shared/lib/toast";
import { normalizeApiError } from "./errors";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string } };
    const token = state.auth?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type") && headers.get("x-is-form-data") !== "true") {
      headers.set("Content-Type", "application/json");
    }

    headers.delete("x-is-form-data");
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const refreshedToken = result.meta?.response?.headers.get("X-Session-Token");
  if (refreshedToken) api.dispatch(refreshToken(refreshedToken));

  const state = api.getState() as { auth?: { token?: string } };
  if (result.error?.status === 401 && state.auth?.token) {
    api.dispatch(signOut());
    if (typeof window !== "undefined") {
      localStorage.setItem("snm-session-event", JSON.stringify({ type: "expired", at: Date.now() }));
      window.location.assign("/login?reason=timeout");
    }
    toast.error("Your session has expired. Please log in again.");
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "AdminStats",
    "Cities",
    "DutyChart",
    "Login",
    "MasterSearch",
    "Masters",
    "Patients",
    "RegistrationDropdown",
    "Reports",
    "UserDetails",
  ],
  endpoints: () => ({}),
});

export { normalizeApiError };
