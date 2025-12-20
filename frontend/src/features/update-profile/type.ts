import { FormValues } from "@shared/types/CommonType";


export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  data: FormValues;
}

