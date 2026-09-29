import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  UserPlus,
  ChevronUp,
  ChevronDown,
  UserCheck,
  CreditCard,
  ShieldCheck,
  Trash2,
  Briefcase,
  MapPin,
  Building,
  MessageSquare,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import {
  DEFAULT_ROLE_FORM_VALUES,
  SELECT_NONE_VALUE,
  YES_NO_OPTIONS,
  ON_DUTY_OPTIONS,
} from "../constants";
import type { MasterSearchRoleFormValues, SelectOption } from "../types";
import { MasterSearchSelect } from "./master-search-select";

type MasterSearchRoleCardProps = {
  form: UseFormReturn<MasterSearchRoleFormValues>;
  onSubmit: (data: MasterSearchRoleFormValues) => Promise<boolean | void>;
  isUpdatingRole?: boolean;
  selectedCount: number;
  isDeleteSelected?: boolean;
  sewaLocationOptions: SelectOption[];
};

export function MasterSearchRoleCard({
  form,
  onSubmit,
  isUpdatingRole,
  selectedCount,
  isDeleteSelected,
  sewaLocationOptions,
}: MasterSearchRoleCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { register, setValue, watch, reset, handleSubmit } = form;
  const currentValues = watch();

  const handleReset = () => {
    reset(DEFAULT_ROLE_FORM_VALUES);
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount === 0) {
      toast.warning(
        "Please select at least one user from the table below to assign roles."
      );
      return;
    }

    await handleSubmit(async (values) => {
      await onSubmit(values);
    })(e);
  };

  return (
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-xs transition-all dark:border-rose-900/40 dark:bg-rose-950/20 overflow-hidden">
      {/* Header with darker title bar background */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/80 bg-rose-100/70 p-4 sm:px-6 dark:border-rose-900/50 dark:bg-rose-950/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-200/80 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">
                Add User Role
              </h3>
              {selectedCount > 0 && (
                <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-900/80 dark:text-rose-200">
                  {selectedCount} selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign roles and manage user access.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8.5 gap-1 rounded-lg border-rose-200/80 bg-white px-3 text-xs font-medium text-rose-800 hover:bg-rose-100/50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300"
        >
          <span>{isCollapsed ? "Show" : "Hide"}</span>
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 opacity-70" />
          )}
        </Button>
      </div>

      {/* Collapsible Form Body */}
      {!isCollapsed && (
        <form onSubmit={handleSubmitRole} className="p-4 sm:p-6 sm:pt-5">
          {/* Row 1: 5 Columns with left-side icons & no duplicate labels */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Is Present */}
            <MasterSearchSelect
              value={String(currentValues.isPresent ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("isPresent", val)}
              options={YES_NO_OPTIONS}
              placeholder="Select is present"
              icon={UserCheck}
              iconColor="text-blue-500"
              searchable={false}
            />

            {/* 2. Pass Entry */}
            <MasterSearchSelect
              value={String(currentValues.passEntry ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("passEntry", val)}
              options={YES_NO_OPTIONS}
              placeholder="Select pass entry"
              icon={CreditCard}
              iconColor="text-blue-500"
              searchable={false}
            />

            {/* 3. Is Admin */}
            <MasterSearchSelect
              value={String(currentValues.isAdmin ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("isAdmin", val)}
              options={YES_NO_OPTIONS}
              placeholder="Select is admin"
              icon={ShieldCheck}
              iconColor="text-blue-500"
              searchable={false}
            />

            {/* 4. Is Delete */}
            <MasterSearchSelect
              value={String(currentValues.isDeleted ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("isDeleted", val)}
              options={YES_NO_OPTIONS}
              placeholder="Select is delete"
              icon={Trash2}
              iconColor="text-rose-500"
              searchable={false}
            />

            {/* 5. On Duty */}
            <MasterSearchSelect
              value={String(currentValues.onDuty ?? SELECT_NONE_VALUE)}
              onChange={(val) => setValue("onDuty", val)}
              options={ON_DUTY_OPTIONS}
              placeholder="Select on duty"
              icon={Briefcase}
              iconColor="text-blue-500"
              searchable={false}
            />
          </div>

          {/* Row 2: 3 Fields + Action Buttons with left icons */}
          <div className="mt-3.5 grid grid-cols-1 items-center gap-3.5 lg:grid-cols-12">
            {/* Sewa Location (Searchable, ascending order) */}
            <div className="lg:col-span-4">
              <MasterSearchSelect
                value={String(currentValues.sewaLocation ?? SELECT_NONE_VALUE)}
                onChange={(val) => setValue("sewaLocation", val)}
                options={sewaLocationOptions}
                placeholder="Select sewa location"
                icon={MapPin}
                iconColor="text-blue-500"
                searchable
              />
            </div>

            {/* Samagam Location */}
            <div className="relative lg:col-span-3">
              <Building className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-500" />
              <Input
                placeholder="Enter samagam location"
                {...register("samagamHeldIn")}
                className="h-9.5 rounded-lg border-slate-200 bg-white pl-9 text-xs shadow-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Remark Message */}
            <div className="relative lg:col-span-3">
              <MessageSquare className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-500" />
              <Input
                placeholder="Enter remark message"
                {...register("remark")}
                className="h-9.5 rounded-lg border-slate-200 bg-white pl-9 text-xs shadow-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 lg:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9.5 flex-1 gap-1.5 rounded-lg border-rose-200 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:bg-slate-900 dark:text-rose-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isUpdatingRole}
                className="h-9.5 flex-1 gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" />
                <span>Submit</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
