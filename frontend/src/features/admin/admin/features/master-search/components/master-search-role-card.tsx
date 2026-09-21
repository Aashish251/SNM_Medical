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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import {
  DEFAULT_ROLE_FORM_VALUES,
  SELECT_NONE_VALUE,
  YES_NO_OPTIONS,
  ON_DUTY_OPTIONS,
} from "../constants";
import type { MasterSearchRoleFormValues, SelectOption } from "../types";

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
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/35 shadow-xs transition-all dark:border-rose-900/40 dark:bg-rose-950/20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100/80 p-4 sm:px-6 dark:border-rose-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100/80 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">
                Add User Role
              </h3>
              {selectedCount > 0 && (
                <span className="rounded-full bg-rose-200/70 px-2 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-900/80 dark:text-rose-200">
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
          className="h-8.5 gap-1 rounded-lg border-rose-200/80 bg-white/80 px-3 text-xs font-medium text-rose-800 hover:bg-rose-100/50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300"
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
          {/* Row 1: 5 Columns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Is Present */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                Is Present
              </label>
              <Select
                value={String(currentValues.isPresent ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("isPresent", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select isPresent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-xs">
                    Select isPresent
                  </SelectItem>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Pass Entry */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                Pass Entry
              </label>
              <Select
                value={String(currentValues.passEntry ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("passEntry", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select pass entry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-xs">
                    Select pass entry
                  </SelectItem>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Is Admin */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                Is Admin
              </label>
              <Select
                value={String(currentValues.isAdmin ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("isAdmin", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select isAdmin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-xs">
                    Select isAdmin
                  </SelectItem>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Is Delete */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                Is Delete
              </label>
              <Select
                value={String(currentValues.isDeleted ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("isDeleted", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select isDelete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-xs">
                    Select isDelete
                  </SelectItem>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 5. On Duty */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                On Duty
              </label>
              <Select
                value={String(currentValues.onDuty ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("onDuty", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select onDuty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE} className="text-xs">
                    Select onDuty
                  </SelectItem>
                  {ON_DUTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: 3 Fields + Action Buttons */}
          <div className="mt-4 grid grid-cols-1 items-end gap-4 lg:grid-cols-12">
            {/* Sewa Location */}
            <div className="lg:col-span-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Sewa Location
              </label>
              <Select
                value={String(currentValues.sewaLocation ?? SELECT_NONE_VALUE)}
                onValueChange={(val) => setValue("sewaLocation", val)}
              >
                <SelectTrigger className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Select sewa Location" />
                </SelectTrigger>
                <SelectContent>
                  {sewaLocationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Samagam Location */}
            <div className="lg:col-span-3">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Building className="h-3.5 w-3.5 text-blue-500" />
                Samagam Location
              </label>
              <Input
                placeholder="Enter samagam location"
                {...register("samagamHeldIn")}
                className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Remark Message */}
            <div className="lg:col-span-3">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                Remark Message
              </label>
              <Input
                placeholder="Enter remark message"
                {...register("remark")}
                className="h-9.5 rounded-lg border-slate-200 bg-white text-xs shadow-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 lg:col-span-2">
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
