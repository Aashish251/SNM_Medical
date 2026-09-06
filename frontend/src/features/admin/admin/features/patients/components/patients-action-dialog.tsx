import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { normalizeApiError } from "@shared/api/errors";
import { patientGenderOptions, patientStatusOptions } from "../data/data";
import { mapApiPatientToPatient, type Patient } from "../data/schema";
import {
  useGetPatientByIdQuery,
  useSavePatientRegistrationMutation,
} from "../services/patientsApi";

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
  const patientId = currentRow?.id;

  const {
    data: detailResponse,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
    isError: isDetailsError,
    error: detailsError,
  } = useGetPatientByIdQuery(patientId!, {
    skip: !open || !isEdit || !patientId,
  });

  const [savePatient, { isLoading: isSaving }] =
    useSavePatientRegistrationMutation();

  const form = useForm<PatientForm>({
    defaultValues: {
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

  useEffect(() => {
    if (open) {
      if (isEdit) {
        const fetchedItem = detailResponse?.data;
        if (fetchedItem) {
          const mapped = mapApiPatientToPatient(fetchedItem);
          form.reset({
            patientName: mapped.patientName,
            mobileNumber: mapped.mobileNumber,
            email: mapped.email,
            address: mapped.address,
            guardianName: mapped.guardianName,
            age: mapped.age,
            gender: mapped.gender,
            disease: mapped.disease,
            status: mapped.status,
          });
        } else if (currentRow) {
          form.reset({
            patientName: currentRow.patientName,
            mobileNumber: currentRow.mobileNumber,
            email: currentRow.email,
            address: currentRow.address,
            guardianName: currentRow.guardianName,
            age: currentRow.age,
            gender: currentRow.gender,
            disease: currentRow.disease,
            status: currentRow.status,
          });
        }
      } else {
        form.reset({
          patientName: "",
          mobileNumber: "",
          email: "",
          address: "",
          guardianName: "",
          age: "",
          gender: "Male",
          disease: "",
          status: "active",
        });
      }
    }
  }, [open, isEdit, detailResponse, currentRow, form]);

  useEffect(() => {
    if (open && isEdit && isDetailsError && detailsError) {
      toast.error(normalizeApiError(detailsError).message);
    }
  }, [open, isEdit, isDetailsError, detailsError]);

  const onSubmit = async (values: PatientForm) => {
    try {
      const fetchedItem = detailResponse?.data;
      const currentYear = new Date().getFullYear();
      const randomSuffix = Math.floor(100 + Math.random() * 900);

      const payload = {
        ...(isEdit && patientId ? { id: Number(patientId) || patientId } : {}),
        regnNo: isEdit
          ? (fetchedItem?.regnNo || currentRow?.regnNo || `OPD-${currentYear}-${randomSuffix}`)
          : `OPD-${currentYear}-${randomSuffix}`,
        date: isEdit
          ? (fetchedItem?.date || currentRow?.registrationDate || new Date().toISOString().split("T")[0])
          : new Date().toISOString().split("T")[0],
        patientName: values.patientName,
        mobileNumber: values.mobileNumber,
        email: values.email,
        address: values.address,
        guardianName: values.guardianName,
        age: Number(values.age),
        gender: values.gender,
        disease: values.disease,
        status: values.status,
      };

      const res = await savePatient(payload).unwrap();
      toast.success(
        res.message || (isEdit ? "Patient updated successfully" : "Patient created successfully")
      );
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const isBusyLoadingDetails = isEdit && (isLoadingDetails || isFetchingDetails);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isSaving) {
          form.reset();
          onOpenChange(state);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update patient details here."
              : "Register new patient record here."}{" "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {isBusyLoadingDetails ? (
          <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Fetching patient details...</span>
          </div>
        ) : (
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
                        <Input
                          placeholder="John Doe"
                          className="col-span-4"
                          autoComplete="off"
                          disabled={isSaving}
                          {...field}
                        />
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
                        <Input
                          placeholder="+91 9876543210"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                  }}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                        <Input
                          placeholder="Robert Doe"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                        <Input
                          type="number"
                          placeholder="30"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                        disabled={isSaving}
                        items={patientGenderOptions.map(({ label, value }) => ({
                          label,
                          value,
                        }))}
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
                        <Input
                          placeholder="123 Main St, New Delhi"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                        <Input
                          placeholder="Fever & Flu"
                          className="col-span-4"
                          disabled={isSaving}
                          {...field}
                        />
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
                        disabled={isSaving}
                        items={patientStatusOptions.map(({ label, value }) => ({
                          label,
                          value,
                        }))}
                      />
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}

        <DialogFooter>
          <Button
            type="submit"
            form="patient-form"
            disabled={isBusyLoadingDetails || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
