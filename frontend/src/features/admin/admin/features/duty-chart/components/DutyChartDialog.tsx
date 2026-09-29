import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { SearchableSelect } from "@admin/components/entity-list";
import { shiftOptions, dutyStatusOptions, useDutyStaffOptions } from "../data/records";
import type {
  DutyChartEntry,
  DutyDepartmentOption,
  DutyStaffOption,
} from "../services/dutyChartApi";

interface DutyChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  currentRow?: DutyChartEntry;
  departmentOptions: DutyDepartmentOption[];
  staffOptions?: DutyStaffOption[];
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

interface FormValues {
  title: string;
  date: string;
  shift: string;
  department: string;
  name: string;
  contact: string;
  status?: string;
}

export function DutyChartDialog({
  open,
  onOpenChange,
  mode,
  currentRow,
  departmentOptions = [],
  onSubmit,
}: DutyChartDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // Fetch staff options from the API filtered by selected department
  const staffForDepartment = useDutyStaffOptions(selectedDepartment || undefined);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      date: "",
      shift: "",
      department: "",
      name: "",
      contact: "",
      status: "assigned",
    },
  });

  // Reset form when dialog opens or currentRow changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && currentRow) {
        setSelectedDepartment(currentRow.department || "");
        form.reset({
          title: currentRow.title || "",
          date: currentRow.date ? String(currentRow.date).slice(0, 10) : "",
          shift: currentRow.shift || "",
          department: currentRow.department || "",
          name: currentRow.name || "",
          contact: currentRow.contact || "",
          status: currentRow.status || "assigned",
        });
      } else {
        setSelectedDepartment("");
        form.reset({
          title: "58TH MAHARASHTRA NIRANKARI SANT SAMAGAM",
          date: new Date().toISOString().slice(0, 10),
          shift: shiftOptions[0]?.value || "Morning (8.00 AM to 4.00 PM)",
          department: "",
          name: "",
          contact: "",
          status: "assigned",
        });
      }
    }
  }, [open, mode, currentRow, form]);

  // When Department changes, update form and reset staff/contact
  const handleDepartmentChange = (deptValue: string) => {
    setSelectedDepartment(deptValue);
    form.setValue("department", deptValue, { shouldValidate: true });

    // Always reset staff and contact when department changes
    form.setValue("name", "", { shouldValidate: true });
    form.setValue("contact", "", { shouldValidate: true });
  };

  // When Staff Name changes, auto-populate Contact Number
  const handleStaffChange = (staffName: string) => {
    form.setValue("name", staffName, { shouldValidate: true });
    const matchedStaff = staffForDepartment.find((s) => s.value === staffName);
    if (matchedStaff?.contact) {
      const cleanContact = matchedStaff.contact.replace(/\D/g, "").slice(0, 10);
      form.setValue("contact", cleanContact, { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    // Contact number validation: strictly 10 numeric digits
    const cleanContact = values.contact.replace(/\D/g, "");
    if (cleanContact.length !== 10) {
      form.setError("contact", {
        type: "manual",
        message: "Contact number must be exactly 10 digits.",
      });
      return;
    }

    const payload: Record<string, string> = {
      title: values.title.trim(),
      date: values.date,
      shift: values.shift,
      department: values.department,
      name: values.name,
      contact: cleanContact,
      status: mode === "add" ? "assigned" : values.status || "assigned",
    };

    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[85vh] p-0 flex flex-col gap-0 rounded-xl overflow-hidden shadow-2xl border bg-background">
        <DialogHeader className="p-6 pb-4 border-b text-start">
          <DialogTitle>
            {mode === "edit" ? "Edit Duty" : "Add Duty"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the selected duty assignment record."
              : "Create a new duty assignment record."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="duty-dialog-form"
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-135px)]"
          >
            {/* 1. Samagam Title */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Samagam Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Samagam Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 58TH MAHARASHTRA NIRANKARI SANT SAMAGAM"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. Date and Shift in the same row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shift"
                rules={{ required: "Shift is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shift" />
                        </SelectTrigger>
                        <SelectContent>
                          {shiftOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 3. Department with text-based search */}
            <FormField
              control={form.control}
              name="department"
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={departmentOptions}
                      value={field.value}
                      placeholder="Type to search department..."
                      onChange={handleDepartmentChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 4. Staff Name (Dependent on selected Department — fetched from API) */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Staff Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Name</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={staffForDepartment}
                      value={field.value}
                      placeholder={
                        !selectedDepartment
                          ? "Select Department first"
                          : staffForDepartment.length === 0
                          ? "No staff found in this department"
                          : "Type to search staff name..."
                      }
                      disabled={
                        !selectedDepartment || staffForDepartment.length === 0
                      }
                      onChange={handleStaffChange}
                    />
                  </FormControl>
                  {selectedDepartment && staffForDepartment.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      No staff members are registered under {selectedDepartment}.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5. Contact Number (Numeric only, exactly 10 digits, auto-populated) */}
            <FormField
              control={form.control}
              name="contact"
              rules={{
                required: "Contact Number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Contact number must be exactly 10 digits.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={field.value}
                      onChange={(e) => {
                        // Accept only numeric values, restricted to exactly 10 digits
                        const numericVal = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        field.onChange(numericVal);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* In Edit mode, allow editing status if needed, but in Add mode, Status is completely removed */}
            {mode === "edit" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {dutyStatusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter className="p-4 sm:p-6 border-t bg-muted/20 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="duty-dialog-form">
            {mode === "edit" ? "Update Duty" : "Add Duty"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

