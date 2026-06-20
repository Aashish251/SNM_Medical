export interface UserObject {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
  profilePic?: string;
}

export interface AuthState {
  isSignedIn: boolean;
  error: string | null;
  userType?: string;
  token?: string;
  userDetails?: UserObject | null;
}

export interface SignInPayload {
  token: string;
  userType?: string;
  isSignedIn: boolean;
  userDetails?: UserObject | null;
}
