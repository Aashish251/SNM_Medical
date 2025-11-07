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