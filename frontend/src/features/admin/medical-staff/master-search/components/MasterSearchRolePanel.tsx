import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@shared/components/ui";
import { SearchableSelect, TextField } from "@shared/components/FormInputs";
import { SelectField } from "@shared/components/FormInputs";
import { DUMMY } from "../config";
import type { RoleFormValues } from "../hooks/useMasterSearchActions";
import type { FormEventHandler } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { SewaLocationOption } from "@shared/types/CommonType";

type MasterSearchRolePanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleControl: Control<RoleFormValues>;
  registerRole: UseFormRegister<RoleFormValues>;
  roleErrors: FieldErrors<RoleFormValues>;
  roleWatch: (name: keyof RoleFormValues) => unknown;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onReset: () => void;
  isUpdatingRole: boolean;
  sewaLocations: SewaLocationOption[];
};

export function MasterSearchRolePanel({
  open,
  onOpenChange,
  roleControl,
  registerRole,
  roleErrors,
  roleWatch,
  onSubmit,
  onReset,
  isUpdatingRole,
  sewaLocations,
}: MasterSearchRolePanelProps) {
  const idDeleted = roleWatch("isDeleted");
  const isDeleteSelected =
    String(idDeleted) === "1" || idDeleted === 1 || idDeleted === true;

  return (
    <section className="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full bg-to-two-right-theme-gradient text-white p-3 flex justify-between items-center cursor-pointer select-none"
          >
            <h2 className="font-bold">Add User Role</h2>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end"
          >
            <SelectField
              control={roleControl}
              name="isPresent"
              label=""
              options={DUMMY.IsPresent}
              labelKey="label"
              valueKey="value"
              defaultValue={null}
              placeholder="Select isPresent"
            />

            <SelectField
              control={roleControl}
              name="passEntry"
              label=""
              options={DUMMY.PassEntry}
              labelKey="label"
              valueKey="value"
              defaultValue={null}
              placeholder="Select pass entry"
            />

            <SelectField
              control={roleControl}
              name="isAdmin"
              label=""
              options={DUMMY.isAdmin}
              labelKey="label"
              valueKey="value"
              defaultValue={null}
              placeholder="Select isAdmin"
            />

            <SelectField
              control={roleControl}
              name="isDeleted"
              label=""
              options={DUMMY.isDelete}
              labelKey="label"
              valueKey="value"
              defaultValue={null}
              placeholder="Select isDelete"
            />

            <SelectField
              control={roleControl}
              name="onDuty"
              label=""
              options={DUMMY.onDuty}
              labelKey="label"
              valueKey="value"
              defaultValue={null}
              placeholder="Select onDuty"
            />

            <SearchableSelect
              control={roleControl}
              name="sewaLocation"
              label=""
              options={sewaLocations}
              labelKey="sewalocation_name"
              valueKey="id"
              placeholder="Select sewa location"
            />

            <TextField
              label=""
              register={registerRole("samagamHeldIn")}
              placeholder="Enter samagam location"
            />

            <div className="lg:col-span-2 xl:col-span-1">
              <TextField
                label=""
                placeholder="Enter remark message"
                register={registerRole("remark", {
                  validate: (value) => {
                    if (isDeleteSelected) {
                      if (!value || String(value).trim().length === 0) {
                        return "Please enter the remark.";
                      }
                    }
                    return true;
                  },
                })}
                error={roleErrors.remark}
              />
            </div>

            <div className="flex gap-2 lg:col-span-2 xl:col-span-2">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors h-[38px] flex items-center justify-center"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isUpdatingRole}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors h-[38px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingRole ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
