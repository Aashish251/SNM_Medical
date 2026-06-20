import { useCallback, useEffect, useState } from "react";
import type { Camp } from "@widgets/camp-listing";
import {
  CAMP_STORE_CHANGED_EVENT,
  getCampsByType,
  getPublishedCampsByType,
} from "./store";
import type { CampAdminRecord, CampType } from "./types";

function useCampStoreRefresh<T>(selector: (campType: CampType) => T, campType: CampType) {
  const [data, setData] = useState(() => selector(campType));

  const refresh = useCallback(() => {
    setData(selector(campType));
  }, [campType, selector]);

  useEffect(() => {
    refresh();
    window.addEventListener(CAMP_STORE_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(CAMP_STORE_CHANGED_EVENT, refresh);
  }, [refresh]);

  return data;
}

export function useAdminCamps(campType: CampType): CampAdminRecord[] {
  return useCampStoreRefresh(getCampsByType, campType);
}

export function usePublishedCamps(campType: CampType): Camp[] {
  return useCampStoreRefresh(getPublishedCampsByType, campType);
}
