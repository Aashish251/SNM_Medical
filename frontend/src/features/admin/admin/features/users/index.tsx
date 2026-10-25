import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Button } from "@admin/components/ui/button";
import { Badge } from "@admin/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import {
  ROUTE_ADMIN_REGISTRATION_REPORT,
  ROUTE_ADMIN_DUTY_CHART,
} from "@admin/constants/routePaths";
import { STEPS, requiredFields } from "@shared/config/common";
import { useRegistrationForm } from "@features/register/hooks/useRegistrationForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@widgets/registration-wizard";
import { useRegisterUserMutation } from "@features/register/services";
import { createRegistrationFormData } from "@entities/registration";
import { FormValues } from "@shared/types/CommonType";
import { trimFormValues } from "@shared/lib/formValidation";
import { normalizeApiError } from "@shared/api/errors";
import { reportError } from "@shared/lib/monitoring";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { ApiErrorDialog } from "@shared/components/ApiErrorDialog";
import { toast as hotToast } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import {
  UserPlus,
  ClipboardList,
  CheckCircle2,
  CalendarClock,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export function Users() {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    resetStep,
    dropdownOption,
    dropdownLoading,
    cities,
    citiesLoading,
    form,
  } = useRegistrationForm();

  const handleFullReset = () => {
    form.reset();
    setCurrentStep(1);
    setSuccessInfo(null);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setDisabled(true);

      const trimmedData = trimFormValues(data);

      // Validate all required fields
      const allRequiredFields: (keyof FormValues)[] = [
        ...requiredFields[1],
        ...requiredFields[2],
        ...requiredFields[3],
      ];
      const missingFields = allRequiredFields.filter((field) => {
        const val = trimmedData[field];
        if (val === undefined || val === null || val === "") return true;
        if (typeof val === "string" && val.trim().length === 0) return true;
        return false;
      });

      if (missingFields.length > 0) {
        const errorMsg = `Missing required fields: ${missingFields.join(", ")}`;
        setSubmitError(errorMsg);
        setDisabled(false);
        return;
      }

      // Ensure userType is medical staff
      const registrationData: FormValues = {
        ...trimmedData,
        userType: trimmedData.userType || "ms",
      };

      const formData = createRegistrationFormData(registrationData);

      await triggerRegisterUser(formData).unwrap();
      hotToast.success("Medical staff member registered successfully!");
      sonnerToast.success("Medical staff member registered successfully!");

      setSuccessInfo({
        name: registrationData.fullName,
        email: registrationData.email,
      });

      // Reset form fields and navigate back to step 1 for subsequent additions
      form.reset();
      setCurrentStep(1);
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      reportError(error, { source: "admin-registration" });
      const message = normalizeApiError(error).message;
      setSubmitError(message);
    }
  };

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Add New Registration
              </h1>

            </div>
            <p className="text-sm text-muted-foreground">
              Register a new medical staff member into the system with personal, professional, and login credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullReset}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(ROUTE_ADMIN_REGISTRATION_REPORT)}
              className="gap-1.5"
            >
              <ClipboardList className="h-4 w-4" />
              View Registration Report
            </Button>
          </div>
        </div>

        {/* Success Alert Banner if a member was recently registered */}
        <AnimatePresence>
          {successInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">
                    Registration Completed Successfully!
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Medical staff member <strong className="text-foreground">{successInfo.name}</strong> ({successInfo.email}) has been enrolled in the directory.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSuccessInfo(null)}
                  className="bg-background"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Add Another
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => navigate(ROUTE_ADMIN_DUTY_CHART)}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CalendarClock className="h-4 w-4" />
                  Assign Duty
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Loading State */}
        {dropdownLoading || !dropdownOption ? (
          <Card className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner />
          </Card>
        ) : (
          <Card className="border border-border/80 shadow-sm bg-card overflow-hidden">
            {/* Stepper Header */}
            <CardHeader className="bg-muted/30 border-b pb-6 pt-6">
              <div className="w-full max-w-4xl mx-auto">
                <Stepper
                  steps={STEPS}
                  currentStep={currentStep}
                  onStepClick={(stepId) =>
                    currentStep >= stepId && setCurrentStep(stepId)
                  }
                />
                <div className="text-center mt-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold mt-2">
                    {STEPS[currentStep - 1]?.title} Details
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    {currentStep === 1 && "Fill in the candidate's personal and demographic information."}
                    {currentStep === 2 && "Enter qualifications, department, availability, and experience."}
                    {currentStep === 3 && "Configure security questions, password, and administrative remarks."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Step Form Content */}
            <CardContent className="p-0 sm:p-4">
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {currentStep === 1 && (
                  <PersonalDetailsStep
                    form={form}
                    dropdownOption={dropdownOption}
                    cities={cities}
                    citiesLoading={citiesLoading}
                    nextStep={nextStep}
                    reset={() => resetStep(1)}
                  />
                )}

                {currentStep === 2 && (
                  <ProfessionalDetailsStep
                    form={form}
                    dropdownOption={dropdownOption}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    reset={() => resetStep(2)}
                  />
                )}

                {currentStep === 3 && (
                  <div className="p-4 sm:p-8">
                    <LoginDetailsStep
                      form={form}
                      prevStep={prevStep}
                      disabled={disabled}
                      setDisabled={setDisabled}
                      reset={() => resetStep(3)}
                    />
                  </div>
                )}
              </motion.form>
            </CardContent>
          </Card>
        )}
      </Main>
      <ApiErrorDialog message={submitError} onClose={() => setSubmitError("")} />
    </>
  );
}

export { Users as AddNewRegistration };
export default Users;
