import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} from "@shared/services/commonApi";
import { toast } from "sonner";
import { normalizeApiError } from "@shared/api/errors";
import type { MasterSearchPayload } from "@shared/services/masterSearchApi";
import {
  DEFAULT_FILTER_VALUES,
  MASTER_SEARCH_DEFAULT_PAGE_LIMIT,
  MASTER_SEARCH_DEFAULT_SORT,
  SELECT_NONE_VALUE,
} from "../constants";
import {
  createDefaultSearchPayload,
  filterValuesToPayload,
  toSelectOptions,
  withNoneOption,
} from "../lib/mappers";
import type {
  MasterSearchFilterValues,
  MasterSearchSortState,
} from "../types";

export function useAdminMasterSearchPagination(
  initialLimit = MASTER_SEARCH_DEFAULT_PAGE_LIMIT
) {
  const [sortState, setSortState] = useState<MasterSearchSortState>(
    MASTER_SEARCH_DEFAULT_SORT
  );
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

export function useAdminMasterSearchFilters(
  pageLimit: number,
  sortState: MasterSearchSortState
) {
  const [searchPayload, setSearchPayload] = useState<MasterSearchPayload>(() =>
    createDefaultSearchPayload(pageLimit)
  );
  const [toolbarSearch, setToolbarSearch] = useState("");

  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState] = useLazyGetCitiesByStateQuery();

  const form = useForm<MasterSearchFilterValues>({
    defaultValues: DEFAULT_FILTER_VALUES,
  });

  const stateId = form.watch("stateId");

  const departmentOptions = useMemo(
    () =>
      withNoneOption(
        toSelectOptions(dropdownOption?.data?.departments, "department_name"),
        "All departments"
      ),
    [dropdownOption?.data?.departments]
  );

  const qualificationOptions = useMemo(
    () =>
      withNoneOption(
        toSelectOptions(
          dropdownOption?.data?.qualifications,
          "qualification_name"
        ),
        "All qualifications"
      ),
    [dropdownOption?.data?.qualifications]
  );

  const sewaLocationOptions = useMemo(
    () =>
      withNoneOption(
        toSelectOptions(
          dropdownOption?.data?.sewaLocations,
          "sewalocation_name"
        ),
        "All sewa locations"
      ),
    [dropdownOption?.data?.sewaLocations]
  );

  const stateOptions = useMemo(
    () =>
      withNoneOption(
        toSelectOptions(dropdownOption?.data?.states, "state_name"),
        "All states"
      ),
    [dropdownOption?.data?.states]
  );

  const [cityOptions, setCityOptions] = useState(() =>
    withNoneOption([], "All cities")
  );

  const loadCities = useCallback(
    async (id: number) => {
      try {
        const result = await triggerGetCitiesByState({ stateId: id }).unwrap();
        setCityOptions(
          withNoneOption(
            toSelectOptions(result?.data?.cities, "city_name"),
            "All cities"
          )
        );
      } catch (error) {
        toast.error(normalizeApiError(error).message);
        setCityOptions(withNoneOption([], "All cities"));
      }
    },
    [triggerGetCitiesByState]
  );

  useEffect(() => {
    const id = Number(stateId);
    if (stateId && stateId !== SELECT_NONE_VALUE && id) {
      void loadCities(id);
    } else {
      setCityOptions(withNoneOption([], "All cities"));
      form.setValue("cityId", SELECT_NONE_VALUE);
    }
  }, [form, loadCities, stateId]);

  /** Debounced toolbar search → server `searchKey` (Admin list pattern). */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextKey = toolbarSearch.trim();
      setSearchPayload((prev) => {
        if ((prev.searchKey ?? "") === nextKey) return prev;
        return {
          ...prev,
          searchKey: nextKey,
          page: 1,
        };
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [toolbarSearch]);

  const onAdvancedSearch = useCallback(
    (data: MasterSearchFilterValues) => {
      setToolbarSearch(data.searchTerm);
      setSearchPayload(
        filterValuesToPayload(
          data,
          pageLimit,
          sortState.column,
          sortState.direction
        )
      );
    },
    [pageLimit, sortState.column, sortState.direction]
  );

  const resetFilters = useCallback(() => {
    form.reset(DEFAULT_FILTER_VALUES);
    setToolbarSearch("");
    setSearchPayload(
      createDefaultSearchPayload(pageLimit)
    );
  }, [form, pageLimit]);

  return {
    form,
    searchPayload,
    setSearchPayload,
    toolbarSearch,
    setToolbarSearch,
    onAdvancedSearch,
    resetFilters,
    departmentOptions,
    qualificationOptions,
    sewaLocationOptions,
    stateOptions,
    cityOptions,
  };
}
