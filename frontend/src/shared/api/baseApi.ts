import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { signOut } from "@entities/session/model/authSlice";
import { toast } from "@shared/lib/toast";
import { normalizeApiError } from "./errors";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
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

  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(signOut());
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
    "Login",
    "MasterSearch",
    "RegistrationDropdown",
    "UserDetails",
  ],
  endpoints: () => ({}),
});

export { normalizeApiError };
