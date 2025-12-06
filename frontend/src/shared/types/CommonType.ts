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

export interface SewaLocationOption {
  id: number;
  sewalocation_name: string;
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
    sewaLocations:SewaLocationOption[];
  };
}

// src/shared/types/user.ts
export interface User {
  id: number;
  regId: string;
  fullName: string;
  title: string;
  mobileNo: string;
  qualificationName?: string;
  sewalocationName?: string;
  shifttime?: string;
  departmentName?: string;
  email?: string;
  dob?: string;
  passEntry?: number | string;
  isPresent?: number | string;
  userType?: string;
  isDeleted: number | string;      // keep consistent shape
  isApproved?: number;
  stateName?: string;
  cityName?: string;
  certificateDocPath?: string;
}

export interface SearchResponse {
  status: boolean;
  message: string;
  data: User[];
}


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
    sewaLocations:SewaLocationOption[];
  };
}

interface GetCitiesByStateResponse {
  cities: CityItem[];
  count: number;
}

export type FormValues = {
  title: string;
  fullName: string;
  mobileNo: string;
  gender: string;
  email: string;
  dateOfBirth: string;
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
  samagamHeldIn: string;

  password: string;
  confirmPassword: string;
  favoriteFood: string;
  childhoodNickname: string;
  motherMaidenName: string;
  hobbies: string;
  userType: "admin" | "ms";
  remark: string;
};
