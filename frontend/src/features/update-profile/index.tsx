import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { STEPS } from "@shared/config/common";
import { useUpdateProfileForm } from "./hooks/useUpdateProfileForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@widgets/registration-wizard";
import {
  useRegisterUserMutation,
  useGetUserDetailsQueryQuery,        //  use this
} from "./services";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FormValues } from "@shared/types/CommonType";
import { normalizeApiError } from "@shared/api/errors";
import { reportError } from "@shared/lib/monitoring";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { createUpdateProfileFormData } from "@entities/registration";
import {
  ROUTE_ADMIN_MASTER_SEARCH,
  ROUTE_MS_ADMIN_DASHBOARD,
} from "@app/router/routePaths";

const UpdateProfile = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const { userType, userDetails: authUserDetails } = useSelector(
    (state: RootState) => state.auth
  );
  const regId = useLocation().state as { userId?: string | number } | null;
  const profileId = regId?.userId ?? authUserDetails?.id;

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
  } = useUpdateProfileForm();

  const { handleSubmit, reset } = form;

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useGetUserDetailsQueryQuery(profileId ? Number(profileId) : 0, {
    skip: !profileId,
  });

  const [existingProfilePic, setExistingProfilePic] = useState<string | undefined>();
  const [existingCertificate, setExistingCertificate] = useState<string | undefined>();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Fetching user details...", { id: "fetch-user" });
    } else {
      toast.dismiss("fetch-user");
    }

    if (isError) {
      toast.error("Failed to load user details");
      console.error("Get user details error:", error);
    }

    if (userDetails) {
      const certificate = userDetails.data.certificate;
      setExistingProfilePic(userDetails.data.profileImage ?? undefined);
      setExistingCertificate(
        typeof certificate === "string" ? certificate : undefined
      );

      const formattedData: FormValues = {
        ...userDetails.data,
        profilePic: undefined,
        certificate: undefined,
      };

      reset(formattedData);
      toast.success("Profile details loaded!");
    }
  }, [isLoading, isError, userDetails, error, reset]);

  // Show loading spinner until dropdown data is loaded
  if (dropdownLoading || !dropdownOption) {
    return <LoadingSpinner />;
  }

  const onSubmit = async (data: FormValues) => {
    if (!profileId) {
      toast.error("Unable to determine the profile to update.");
      return;
    }

    try {
      const formData = createUpdateProfileFormData(data, profileId);

      await toast.promise(
        triggerRegisterUser({ id: profileId, formData }).unwrap(),
        {
          loading: "Updating Profile...",
          success: "Profile Updated successfully!",
          error: "Failed to update profile",
        }
      );
      setDisabled(false);
      if (userType == "admin") {
        navigate(ROUTE_ADMIN_MASTER_SEARCH);
      } else {
        navigate(ROUTE_MS_ADMIN_DASHBOARD);
      }
    } catch (error) {
      setDisabled(false);
      reportError(error, { source: "update-profile" });
      toast.error(normalizeApiError(error).message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center font-sans pt-[120px] md:pt-[90px] lg:pt-[100px]">
      <div className="max-w-6xl w-full p-8">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(stepId) =>
            currentStep >= stepId && setCurrentStep(stepId)
          }
        />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold bg-to-two-right-theme-gradient bg-clip-text text-transparent tracking-wide">
            {STEPS[currentStep - 1].title} Details
          </h2>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
        >
          {currentStep === 1 && (
            <PersonalDetailsStep
              form={form}
              dropdownOption={dropdownOption}
              cities={cities}
              citiesLoading={citiesLoading}
              nextStep={nextStep}
              reset={() => resetStep(1)}
              existingProfilePic={existingProfilePic}
              checkDuplicates={false}
            />
          )}

          {currentStep === 2 && (
            <ProfessionalDetailsStep
              form={form}
              dropdownOption={dropdownOption}
              nextStep={nextStep}
              prevStep={prevStep}
              reset={() => resetStep(2)}
              existingCertificate={existingCertificate}
              regId={profileId}
            />
          )}

          {currentStep === 3 && (
            <LoginDetailsStep
              form={form}
              disabled={disabled}
              setDisabled={setDisabled}
              prevStep={prevStep}
              reset={() => resetStep(3)}
            />
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateProfile;
