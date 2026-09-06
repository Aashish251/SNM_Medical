import { useForm } from "react-hook-form";
import { showSubmittedData } from "@admin/lib/show-submitted-data";
import { isValidEmail } from "@admin/lib/form-validation";
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
import { patientGenderOptions, patientStatusOptions } from "../data/data";
import { type Patient } from "../data/schema";

type PatientForm = {
  patientName: string;
  mobileNumber: string;
  email: string;
  address: string;
  guardianName: string;
  age: number | string;
  gender: string;
  disease: string;
  status: string;
};

type PatientActionDialogProps = {
  currentRow?: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PatientsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PatientActionDialogProps) {
  const isEdit = !!currentRow;
  const form = useForm<PatientForm>({
    defaultValues: isEdit
      ? {
          patientName: currentRow.patientName,
          mobileNumber: currentRow.mobileNumber,
          email: currentRow.email,
          address: currentRow.address,
          guardianName: currentRow.guardianName,
          age: currentRow.age,
          gender: currentRow.gender,
          disease: currentRow.disease,
          status: currentRow.status,
        }
      : {
          patientName: "",
          mobileNumber: "",
          email: "",
          address: "",
          guardianName: "",
          age: "",
          gender: "Male",
          disease: "",
          status: "active",
        },
  });

  const onSubmit = (values: PatientForm) => {
    form.reset();
    showSubmittedData(values, isEdit ? "Patient updated:" : "Patient created:");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update patient details here." : "Register new patient record here."}{" "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="patient-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="patientName"
                rules={{ required: "Patient Name is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="col-span-4" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                rules={{ required: "Mobile Number is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required.",
                  validate: (val) => isValidEmail(val) || "Please enter a valid email.",
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardianName"
                rules={{ required: "Father / Spouse Name is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Father/Spouse</FormLabel>
                    <FormControl>
                      <Input placeholder="Robert Doe" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                rules={{ required: "Age is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                rules={{ required: "Gender is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Gender</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select gender"
                      className="col-span-4"
                      items={patientGenderOptions.map(({ label, value }) => ({ label, value }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                rules={{ required: "Address is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, New Delhi" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disease"
                rules={{ required: "Disease / Reason is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Disease</FormLabel>
                    <FormControl>
                      <Input placeholder="Fever & Flu" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                rules={{ required: "Status is required." }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select status"
                      className="col-span-4"
                      items={patientStatusOptions.map(({ label, value }) => ({ label, value }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="patient-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
