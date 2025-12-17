import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { STEPS } from "@shared/config/common";
import { useUpdateProfileForm } from "./hooks/useUpdateProfileForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@shared/components/Registration";
import {
  useRegisterUserMutation,
  useGetUserDetailsQueryQuery,        // ✅ use this
} from "./services";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FormValues } from "@shared/types/CommonType";

const UpdateProfile = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const { id: regId } = useParams();

  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    dropdownOption,
    cities,
    citiesLoading,
    form,
  } = useUpdateProfileForm();

  const { handleSubmit, reset, resetField } = form;

  // Field definitions for each step
  const step1Fields: (keyof FormValues)[] = [
    "title",
    "fullName",
    "mobileNo",
    "gender",
    "email",
    "dateOfBirth",
    "age",
    "stateId",
    "cityId",
    "profilePic",
    "address",
  ];

  const step2Fields: (keyof FormValues)[] = [
    "qualificationId",
    "departmentId",
    "availability",
    "shift",
    "experience",
    "samagamHeldIn",
    "lastSewa",
    "recommendedBy",
    "certificate",
  ];

  const step3Fields: (keyof FormValues)[] = [
    "password",
    "confirmPassword",
    "favoriteFood",
    "childhoodNickname",
    "motherMaidenName",
    "hobbies",
    "remark",
  ];

  const resetFields = (fields: (keyof FormValues)[]) => {
    fields.forEach((field) => {
      resetField(field);
    });
  };

  // 🔹 Call API as soon as we have an ID
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useGetUserDetailsQueryQuery(regId ? Number(regId) : 0, {
    skip: !regId, // don't call if id is missing
  });

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
      console.log("API response data:", userDetails); // ✅ console log

      const formattedData: any = {
        ...userDetails.data,
        profilePic: undefined,
        certificate: undefined,
      };

      reset(formattedData);
      toast.success("User details loaded!");
    }
  }, [isLoading, isError, userDetails, error, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key === "certificate" || key === "profilePic") {
          const file = data[key]?.[0];
          if (file) formData.append(key, file);
        } else {
          formData.append(key, data[key] as any);
        }
      }

      await toast.promise(triggerRegisterUser(formData).unwrap(), {
        loading: "Registering...",
        success: "Registered successfully!",
        error: "Failed to register",
      });
      setDisabled(false);
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error?.data?.message || "Something went wrong");
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
              reset={() => resetFields(step1Fields)}
            />
          )}

          {currentStep === 2 && (
            <ProfessionalDetailsStep
              form={form}
              dropdownOption={dropdownOption}
              nextStep={nextStep}
              prevStep={prevStep}
              reset={() => resetFields(step2Fields)}
            />
          )}

          {currentStep === 3 && (
            <LoginDetailsStep
              form={form}
              disabled={disabled}
              setDisabled={setDisabled}
              prevStep={prevStep}
              reset={() => resetFields(step3Fields)}
            />
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateProfile;
