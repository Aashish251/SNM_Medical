// src/pages/Login/type.ts  (adjust path as needed)

export interface UserObject {
  id: number | string; // backend returns a number (49) — allow number | string
  name: string;
  email: string;
  role?: string;
  userType?: string;
  profilePic?: string;
}

/** Redux auth state */
export interface AuthState {
  isSignedIn: boolean;
  error: string | null;
  userType?: string;
  token?: string;
  userDetails?: UserObject | null;
}

/** Payload dispatched when signing in */
export interface SignInPayload {
  token: string;
  userType?: string;
  isSignedIn: boolean;
  userDetails?: UserObject | null;
}

/** Request shape sent to login endpoint */
export interface LoginRequest {
  email?: string;
  contact?: string;
  password: string;
  role: string;
}

/** Inner `data` object returned by the API */
export interface LoginData {
  token: string;
  user: UserObject;
}

/** Full login response shape returned by your backend */
export interface LoginResponse {
  success: boolean;
  message?: string;
  data: LoginData;
}
