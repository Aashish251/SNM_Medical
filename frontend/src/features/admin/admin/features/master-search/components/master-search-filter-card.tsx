import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Filter,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Trash2,
  Plus,
  Search,
  RotateCcw,
  Building,
  GraduationCap,
  MapPin,
  Map,
  Building2,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { SELECT_NONE_VALUE, YES_NO_OPTIONS } from "../constants";
import type { MasterSearchFilterValues, SelectOption } from "../types";
import { cn } from "@admin/lib/utils";
import { MasterSearchSelect } from "./master-search-select";

type MasterSearchFilterCardProps = {
  form: UseFormReturn<MasterSearchFilterValues>;
  onSubmit: (values: MasterSearchFilterValues) => void;
  onReset: () => void;
  isFetching?: boolean;
  departmentOptions: SelectOption[];
  qualificationOptions: SelectOption[];
  sewaLocationOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
};

type QuickFilterKey =
  | "all"
  | "present_today"
  | "on_duty"
  | "pending"
  | "dispensary"
  | "pharmacy"
  | "pathology";

export function MasterSearchFilterCard({
  form,
  onSubmit,
  onReset,
  isFetching,
  departmentOptions,
  qualificationOptions,
  sewaLocationOptions,
  stateOptions,
  cityOptions,
}: MasterSearchFilterCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterKey>("all");
  const [savedFilters, setSavedFilters] = useState<string[]>([
    "Dispensary Staff",
    "Active Users",
    "Pending Users",
  ]);

  const { register, setValue, watch, handleSubmit } = form;

  const currentValues = watch();

  const handleQuickFilter = (key: QuickFilterKey) => {
    setActiveQuickFilter(key);

    if (key === "all") {
      onReset();
      return;
    }

    if (key === "present_today") {
      setValue("isPresent", "1");
      handleSubmit(onSubmit)();
      return;
    }

    if (key === "dispensary") {
      const match = departmentOptions.find((d) =>
        d.label.toLowerCase().includes("dispensary")
      );
      if (match) setValue("departmentId", match.value);
      handleSubmit(onSubmit)();
      return;
    }

    if (key === "pharmacy") {
      const match = departmentOptions.find((d) =>
        d.label.toLowerCase().includes("pharmacy")
      );
      if (match) setValue("departmentId", match.value);
      handleSubmit(onSubmit)();
      return;
    }

    if (key === "pathology") {
      const match = departmentOptions.find((d) =>
        d.label.toLowerCase().includes("pathology")
      );
      if (match) setValue("departmentId", match.value);
      handleSubmit(onSubmit)();
      return;
    }

    if (key === "pending") {
      setValue("searchTerm", "");
      handleSubmit(onSubmit)();
      return;
    }

    if (key === "on_duty") {
      handleSubmit(onSubmit)();
      return;
    }
  };

  const removeSavedFilter = (filterName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFilters((prev) => prev.filter((f) => f !== filterName));
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Header with darker title bar background */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-100/90 p-4 sm:px-6 dark:border-slate-700/80 dark:bg-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Filter User
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use filters to find specific users quickly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Saved Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <Bookmark className="h-3.5 w-3.5 text-blue-600" />
                <span>Saved Filters</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-slate-400">
                Recent Filters
              </DropdownMenuLabel>
              {savedFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  className="flex items-center justify-between text-xs"
                  onClick={() => {
                    setValue("searchTerm", filter);
                    handleSubmit(onSubmit)();
                  }}
                >
                  <span>{filter}</span>
                  <button
                    type="button"
                    onClick={(e) => removeSavedFilter(filter, e)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-xs font-medium text-blue-600 focus:text-blue-700"
                onClick={() => {
                  const name = prompt("Enter filter name:");
                  if (name && !savedFilters.includes(name)) {
                    setSavedFilters((prev) => [...prev, name]);
                  }
                }}
              >
                <Plus className="me-1.5 h-3.5 w-3.5" />
                Save Current Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collapsible toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8.5 gap-1 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <span>{isCollapsed ? "Show Filters" : "Hide Filters"}</span>
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 opacity-70" />
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Body */}
      {!isCollapsed && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 sm:pt-5">
          {/* 8 Field Grid with Icons on left & no duplicate label above */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Search by name, contact or email */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-500" />
              <Input
                placeholder="Search by name, contact or email..."
                {...register("searchTerm")}
                className="h-9.5 rounded-lg border-slate-200 bg-white pl-9 text-xs shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* 2. Department */}
            <MasterSearchSelect
              value={String(currentValues.departmentId ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("departmentId", val)}
              options={departmentOptions}
              placeholder="Select department"
              icon={Building}
              iconColor="text-blue-500"
              searchable
            />

            {/* 3. Qualification */}
            <MasterSearchSelect
              value={String(currentValues.qualificationId ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("qualificationId", val)}
              options={qualificationOptions}
              placeholder="Select qualification"
              icon={GraduationCap}
              iconColor="text-blue-500"
              searchable
            />

            {/* 4. Sewa Location */}
            <MasterSearchSelect
              value={String(currentValues.sewaLocation ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("sewaLocation", val)}
              options={sewaLocationOptions}
              placeholder="Select sewa location"
              icon={MapPin}
              iconColor="text-blue-500"
              searchable
            />

            {/* 5. State */}
            <MasterSearchSelect
              value={String(currentValues.stateId ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("stateId", val)}
              options={stateOptions}
              placeholder="Select state"
              icon={Map}
              iconColor="text-blue-500"
              searchable
            />

            {/* 6. City */}
            <MasterSearchSelect
              value={String(currentValues.cityId ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("cityId", val)}
              options={cityOptions}
              placeholder="Select city"
              icon={Building2}
              iconColor="text-blue-500"
              searchable
            />

            {/* 7. Pass Entry */}
            <MasterSearchSelect
              value={String(currentValues.passEntry ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("passEntry", val)}
              options={[
                { label: "All pass entry", value: SELECT_NONE_VALUE },
                ...YES_NO_OPTIONS,
              ]}
              placeholder="Select pass entry"
              icon={CreditCard}
              iconColor="text-blue-500"
              searchable={false}
            />

            {/* 8. Is Present */}
            <MasterSearchSelect
              value={String(currentValues.isPresent ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("isPresent", val)}
              options={[
                { label: "All statuses", value: SELECT_NONE_VALUE },
                ...YES_NO_OPTIONS,
              ]}
              placeholder="Select is present"
              icon={UserCheck}
              iconColor="text-blue-500"
              searchable={false}
            />
          </div>

          {/* Quick Filters Row + Search/Reset Actions */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quick Filters:
              </span>

              <button
                type="button"
                onClick={() => handleQuickFilter("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "all"
                    ? "border border-blue-500 bg-blue-50 text-blue-700 shadow-xs dark:bg-blue-950/60 dark:text-blue-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                All Users
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("present_today")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "present_today"
                    ? "border border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Present Today
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("on_duty")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "on_duty"
                    ? "border border-amber-500 bg-amber-50 text-amber-700 shadow-xs dark:bg-amber-950/60 dark:text-amber-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                On Duty
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("pending")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "pending"
                    ? "border border-orange-500 bg-orange-50 text-orange-700 shadow-xs dark:bg-orange-950/60 dark:text-orange-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Pending
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("dispensary")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "dispensary"
                    ? "border border-blue-500 bg-blue-50 text-blue-700 shadow-xs dark:bg-blue-950/60 dark:text-blue-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Dispensary
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("pharmacy")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "pharmacy"
                    ? "border border-purple-500 bg-purple-50 text-purple-700 shadow-xs dark:bg-purple-950/60 dark:text-purple-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Pharmacy
              </button>

              <button
                type="button"
                onClick={() => handleQuickFilter("pathology")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeQuickFilter === "pathology"
                    ? "border border-rose-500 bg-rose-50 text-rose-700 shadow-xs dark:bg-rose-950/60 dark:text-rose-300"
                    : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Pathology
              </button>
            </div>

            {/* Reset & Search Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveQuickFilter("all");
                  onReset();
                }}
                className="h-9 gap-1.5 rounded-lg border-slate-200 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isFetching}
                className="h-9 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
