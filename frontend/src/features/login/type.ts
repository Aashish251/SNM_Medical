import type { UserObject } from "@entities/session";

export type { AuthState, SignInPayload, UserObject } from "@entities/session";

export interface LoginRequest {
  email?: string;
  mobileNo?: string;
  contact?: string;
  password: string;
  role: string;
}

export interface LoginData {
  token: string;
  user: UserObject;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: LoginData;
}
