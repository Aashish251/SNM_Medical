import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@shared/components/ui";
import { SearchableSelect } from "@shared/components/FormInputs/SearchableSelect";
import { SelectField } from "@shared/components/FormInputs";
import type { FormEventHandler } from "react";
import { Controller, type Control } from "react-hook-form";
import { DUMMY } from "../config";
import type { MasterSearchFilterValues } from "../hooks/useMasterSearchFilters";
import type {
  CityItem,
  SewaLocationOption,
  StateOption,
} from "@shared/types/CommonType";

type MasterSearchFiltersProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterControl: Control<MasterSearchFilterValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onExport: () => void;
  isFetching: boolean;
  isExporting: boolean;
  departments: string[];
  qualifications: string[];
  sewaLocations: SewaLocationOption[];
  states: StateOption[];
  cities: CityItem[];
};

export function MasterSearchFilters({
  open,
  onOpenChange,
  filterControl,
  onSubmit,
  onExport,
  isFetching,
  isExporting,
  departments,
  qualifications,
  sewaLocations,
  states,
  cities,
}: MasterSearchFiltersProps) {
  return (
    <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full bg-to-two-right-theme-gradient text-white p-3 flex justify-between items-center cursor-pointer select-none"
          >
            <h2 className="font-bold">Filter User</h2>
            {open ? (
              <IoIosArrowUp className="w-6 h-6" />
            ) : (
              <IoIosArrowDown className="w-6 h-6" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 border-t">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center"
          >
            <Controller
              name="searchTerm"
              control={filterControl}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Reg_id, Name, Contact, Email"
                  className="px-3 py-2 border rounded w-full"
                />
              )}
            />

            <SearchableSelect
              control={filterControl}
              name="departmentId"
              label=""
              options={departments}
              labelKey="department_name"
              valueKey="id"
              placeholder="Select department"
            />

            <SearchableSelect
              control={filterControl}
              name="qualificationId"
              label=""
              options={qualifications}
              labelKey="qualification_name"
              valueKey="id"
              placeholder="Select qualification"
            />

            <SearchableSelect
              control={filterControl}
              name="sewaLocation"
              label=""
              options={sewaLocations}
              labelKey="sewalocation_name"
              valueKey="id"
              placeholder="Select sewa location"
            />

            <SearchableSelect
              control={filterControl}
              name="stateId"
              label=""
              options={states}
              labelKey="state_name"
              valueKey="id"
              placeholder="Select state"
            />

            <SearchableSelect
              control={filterControl}
              name="cityId"
              label=""
              options={cities}
              labelKey="city_name"
              valueKey="id"
              placeholder="Select city"
            />

            <SelectField
              control={filterControl}
              name="passEntry"
              label=""
              options={DUMMY.PassEntry}
              labelKey="label"
              valueKey="value"
              placeholder="Select pass entry"
            />

            <SelectField
              control={filterControl}
              name="isPresent"
              label=""
              options={DUMMY.IsPresent}
              labelKey="label"
              valueKey="value"
              placeholder="Select is present"
            />

            <button
              type="submit"
              disabled={isFetching}
              className="px-4 py-2 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 w-full col-span-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              onClick={onExport}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-600 text-white rounded-2xl font-bold hover:bg-gray-700 w-full col-span-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
