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
