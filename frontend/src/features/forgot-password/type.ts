export type SecurityQuestions = {
  email: string;
  mobileNo: string;
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

export interface ApiData{
  matched_answers:number;
  status?:string;
  reg_id?:number;
}

export interface ForgotPasswordResponse {
  success: boolean;
  data?:ApiData[];
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}
