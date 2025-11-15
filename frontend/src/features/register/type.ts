import { b, n } from "node_modules/framer-motion/dist/types.d-DsEeKk6G";

export type City = { id: string; name: string };

export interface Step {
  id: number;
  title: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export interface CityItem {
  id: number;
  city_name: string;
  state_id: number;
}

export interface CitiesByStateRequest {
  stateId: number;
}

interface GetCitiesByStateResponse {
  cities: CityItem[];
  count: number;
}

export interface CitiesByStateResponse {
  success: boolean;
  message: string;
  data: GetCitiesByStateResponse;
}

export interface StateOption {
  id: number;
  state_name: string;
  country_id: number;
}

export interface CityOption {
  id: number;
  name: string;
}

export interface RegistrationDropdownResponse {
  success: boolean;
  data: {
    states: StateOption[];
    cities: CityOption[];
    departments: string[];
    qualifications: string[];
  };
}

interface GetCitiesByStateResponse {
  cities: CityItem[];
  count: number;
}

export type FormValues = {
  title: string;
  fullName: string;
  contact: string;
  gender: string;
  email: string;
  birthdate: string;
  age: number;
  address: string;
  stateId: string;
  cityId: string;
  profilePic?: File | null;

  qualificationId: string;
  departmentId: string;
  availability: string;
  shift: string;
  experience: string;
  lastSewa: string;
  recommendedBy: string;
  certificate?: File | null;

  password: string;
  confirmPassword: string;
  favoriteFood: string;
  childhoodNickname: string;
  motherMaidenName: string;
  hobbies: string;
  userType: "admin" | "ms";
  remark: string;
};
