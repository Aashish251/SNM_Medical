export interface AuthState {
  isSignedIn: boolean;
  error: string | null;
  userType: string;
  token?: string;
}

export interface SignInPayload {
  token: string;
  userType: string;
  isSignedIn: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
