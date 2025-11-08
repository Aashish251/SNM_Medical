export type SecurityQuestions = {
  email: string;
  contact: string;
  favoriteFood: string;
  childhoodNickname: string;
  motherMaidenName: string;
  hobbies: string;
};

export type ResetPassword = {
  password: string;
  confirmPassword: string;
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  // token: string;
  password: string;
  passwordConfirmation?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}
