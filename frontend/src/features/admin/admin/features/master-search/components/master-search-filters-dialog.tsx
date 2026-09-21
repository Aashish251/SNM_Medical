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
import { SelectDropdown } from "@admin/components/select-dropdown";
import { DEFAULT_FILTER_VALUES, YES_NO_OPTIONS } from "../constants";
import type { MasterSearchFilterValues, SelectOption } from "../types";

type MasterSearchFiltersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MasterSearchFilterValues>;
  onSubmit: (values: MasterSearchFilterValues) => void;
  isFetching: boolean;
  departmentOptions: SelectOption[];
  qualificationOptions: SelectOption[];
  sewaLocationOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
};

export function MasterSearchFiltersDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isFetching,
  departmentOptions,
  qualificationOptions,
  sewaLocationOptions,
  stateOptions,
  cityOptions,
}: MasterSearchFiltersDialogProps) {
  const handleOpenChange = (state: boolean) => {
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="text-start">
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Filter users by registration details, location, and status flags.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="master-search-filters"
            onSubmit={(event) => {
              void form.handleSubmit((values) => {
                onSubmit(values);
                handleOpenChange(false);
              })(event);
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Reg ID, Name, Contact, Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select department"
                    items={departmentOptions}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qualificationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select qualification"
                    items={qualificationOptions}
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
                    placeholder="Select sewa location"
                    items={sewaLocationOptions}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select state"
                    items={stateOptions}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select city"
                    items={cityOptions}
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
                    placeholder="Select pass entry"
                    items={[
                      { label: "All", value: DEFAULT_FILTER_VALUES.passEntry },
                      ...YES_NO_OPTIONS,
                    ]}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

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
                    placeholder="Select is present"
                    items={[
                      { label: "All", value: DEFAULT_FILTER_VALUES.isPresent },
                      ...YES_NO_OPTIONS,
                    ]}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(DEFAULT_FILTER_VALUES)}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="master-search-filters"
            disabled={isFetching}
          >
            {isFetching ? "Searching..." : "Search"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
