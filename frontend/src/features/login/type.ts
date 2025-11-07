export interface userObject {
  id: string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
  profilePic?:string;
}

export interface AuthState {
  isSignedIn: boolean;
  error: string | null;
  userType?: string;
  token?: string;
  userDetails?: userObject | null;
}

export interface SignInPayload {
  token: string;
  userType?: string;
  isSignedIn: boolean;
  userDetails?: userObject | null;
}

export interface LoginRequest {
  email?: string;
  contact?: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType?: string;
  };
}