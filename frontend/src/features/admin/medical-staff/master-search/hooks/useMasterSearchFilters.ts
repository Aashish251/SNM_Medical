import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} from "@shared/services/commonApi";
import { toast } from "@shared/lib/toast";
import { normalizeApiError } from "@shared/api/errors";
import type { CityItem } from "@shared/types/CommonType";
import type { MasterSearchPayload } from "../services/masterSearchApi";
import {
  MASTER_SEARCH_DEFAULT_PAGE_LIMIT,
  MASTER_SEARCH_DEFAULT_SORT,
} from "../constants";

export type SortState = {
  column: string | null;
  direction: "ASC" | "DESC";
};

export type MasterSearchFilterValues = {
  searchTerm: string;
  departmentId: string;
  qualificationId: string;
  sewaLocation: string;
  stateId: string;
  cityId: string;
  passEntry: string;
  onDuty: string;
  isPresent: string;
};

export function createDefaultSearchPayload(
  pageLimit: number
): MasterSearchPayload {
  return {
    searchKey: "",
    departmentId: null,
    qualificationId: null,
    sewaLocationId: null,
    cityId: null,
    stateId: null,
    isPresent: null,
    passEntry: null,
    limit: pageLimit,
    page: 1,
    sortBy: "regId",
    sortOrder: "ASC",
  };
}

export function useMasterSearchFilters(pageLimit: number, sortState: SortState) {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchPayload, setSearchPayload] = useState<MasterSearchPayload>(() =>
    createDefaultSearchPayload(pageLimit)
  );

  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState] = useLazyGetCitiesByStateQuery();

  const {
    control: filterControl,
    handleSubmit: handleFilterSubmit,
    setValue: setValueFilter,
    watch: watchFilter,
  } = useForm<MasterSearchFilterValues>({
    defaultValues: {
      searchTerm: "",
      departmentId: "",
      qualificationId: "",
      sewaLocation: "",
      stateId: "",
      cityId: "",
      passEntry: "",
      onDuty: "",
      isPresent: "",
    },
  });

  const stateId = watchFilter("stateId");

  const states = Array.isArray(dropdownOption?.data?.states)
    ? dropdownOption.data.states
    : [];
  const qualifications = Array.isArray(dropdownOption?.data?.qualifications)
    ? dropdownOption.data.qualifications
    : [];
  const departments = Array.isArray(dropdownOption?.data?.departments)
    ? dropdownOption.data.departments
    : [];
  const sewaLocations = Array.isArray(dropdownOption?.data?.sewaLocations)
    ? dropdownOption.data.sewaLocations
    : [];

  const handleFilterCity = useCallback(
    async (id: number) => {
      try {
        const result = await triggerGetCitiesByState({ stateId: id }).unwrap();
        setCities(result?.data?.cities || []);
      } catch (error) {
        toast.error(normalizeApiError(error).message);
        setCities([]);
      }
    },
    [triggerGetCitiesByState]
  );

  useEffect(() => {
    const id = Number(stateId);
    if (id) {
      void handleFilterCity(id);
    } else {
      setCities([]);
      setValueFilter("cityId", "");
    }
  }, [handleFilterCity, setValueFilter, stateId]);

  const onSearch = useCallback(
    (data: MasterSearchFilterValues) => {
      setSearchTriggered(true);
      setSearchPayload({
        searchKey: data.searchTerm.trim() || "",
        departmentId: data.departmentId || null,
        qualificationId: data.qualificationId || null,
        sewaLocationId: data.sewaLocation || null,
        cityId: data.cityId || null,
        stateId: data.stateId || null,
        isPresent: data.isPresent || null,
        passEntry: data.passEntry || null,
        limit: pageLimit,
        page: 1,
        sortBy: sortState.column,
        sortOrder: sortState.direction,
      });
    },
    [pageLimit, sortState.column, sortState.direction]
  );

  return {
    cities,
    states,
    departments,
    qualifications,
    sewaLocations,
    searchTriggered,
    searchPayload,
    setSearchPayload,
    filterControl,
    handleFilterSubmit,
    onSearch,
  };
}

export function useMasterSearchPagination(
  initialLimit = MASTER_SEARCH_DEFAULT_PAGE_LIMIT
) {
  const [sortState, setSortState] = useState<SortState>(MASTER_SEARCH_DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(initialLimit);

  return {
    sortState,
    setSortState,
    currentPage,
    setCurrentPage,
    pageLimit,
    setPageLimit,
  };
}
