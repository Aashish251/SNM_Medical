import { useMemo, useState } from "react";
import type { Camp, CampFilters } from "../model/types";
import { DEFAULT_CAMP_FILTERS } from "../model/types";

export function useCampListing(camps: Camp[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CampFilters>(DEFAULT_CAMP_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);

  const filteredCamps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return camps.filter((camp) => {
      if (query) {
        const searchable = [
          camp.title,
          camp.shortDescription,
          camp.fullAddress,
          camp.landmark,
          camp.organizerName,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      if (filters.donationType !== "all" && camp.entryType !== filters.donationType) {
        return false;
      }

      if (filters.city !== "all") {
        const city = camp.fullAddress.split(",").pop()?.trim().toLowerCase() || "";
        if (!city.includes(filters.city.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [camps, filters, searchQuery]);

  const openCampDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    setDetailsModalOpen(true);
  };

  const openRegistrationForm = (camp: Camp) => {
    setSelectedCamp(camp);
    setRegistrationModalOpen(true);
  };

  const resetFilters = () => setFilters(DEFAULT_CAMP_FILTERS);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filterModalOpen,
    setFilterModalOpen,
    eligibilityModalOpen,
    setEligibilityModalOpen,
    detailsModalOpen,
    setDetailsModalOpen,
    registrationModalOpen,
    setRegistrationModalOpen,
    selectedCamp,
    filteredCamps,
    openCampDetails,
    openRegistrationForm,
    resetFilters,
  };
}
