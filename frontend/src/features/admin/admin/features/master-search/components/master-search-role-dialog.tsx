import type { UseFormReturn } from "react-hook-form";
import { Button } from "@admin/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@admin/components/ui/form";
import { Input } from "@admin/components/ui/input";
import { Textarea } from "@admin/components/ui/textarea";
import { SelectDropdown } from "@admin/components/select-dropdown";
import {
  DEFAULT_ROLE_FORM_VALUES,
  ON_DUTY_OPTIONS,
  SELECT_NONE_VALUE,
  YES_NO_OPTIONS,
} from "../constants";
import type { MasterSearchRoleFormValues, SelectOption } from "../types";

type MasterSearchRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MasterSearchRoleFormValues>;
  onSubmit: (values: MasterSearchRoleFormValues) => Promise<boolean>;
  isUpdatingRole: boolean;
  selectedCount: number;
  sewaLocationOptions: SelectOption[];
  isDeleteSelected: boolean;
};

const withNone = (options: { label: string; value: string }[]) => [
  { label: "No change", value: SELECT_NONE_VALUE },
  ...options.filter((option) => option.value !== SELECT_NONE_VALUE),
];

export function MasterSearchRoleDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isUpdatingRole,
  selectedCount,
  sewaLocationOptions,
  isDeleteSelected,
}: MasterSearchRoleDialogProps) {
  const locationOptions = withNone(sewaLocationOptions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="text-start">
          <DialogTitle>Update User Status</DialogTitle>
          <DialogDescription>
            Apply status and role changes to {selectedCount} selected user
            {selectedCount === 1 ? "" : "s"}. Leave fields as &quot;No change&quot;
            to skip them.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="master-search-role"
            onSubmit={(event) => {
              void form.handleSubmit(async (values) => {
                const success = await onSubmit(values);
                if (success) onOpenChange(false);
              })(event);
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="isPresent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Present</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={withNone(YES_NO_OPTIONS)}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pass Entry</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={withNone(YES_NO_OPTIONS)}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Admin</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={withNone(YES_NO_OPTIONS)}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDeleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Deleted</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={withNone(YES_NO_OPTIONS)}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onDuty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On Duty</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={withNone(ON_DUTY_OPTIONS)}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sewaLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sewa Location</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={locationOptions}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="samagamHeldIn"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Samagam Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter samagam location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              rules={{
                validate: (value) => {
                  if (isDeleteSelected && (!value || value.trim().length === 0)) {
                    return "Please enter the remark.";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter remark message"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(DEFAULT_ROLE_FORM_VALUES)}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="master-search-role"
            disabled={isUpdatingRole || selectedCount === 0}
          >
            {isUpdatingRole ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
