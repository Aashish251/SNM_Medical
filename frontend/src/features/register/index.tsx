import React, { useState } from "react";
import { motion } from "framer-motion";
import { STEPS } from "@shared/config/common";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@widgets/registration-wizard";
import { useRegisterUserMutation } from "./services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FormValues } from "@shared/types/CommonType";
import { normalizeApiError } from "@shared/api/errors";
import { reportError } from "@shared/lib/monitoring";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { createRegistrationFormData } from "@entities/registration";

const Register = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    dropdownOption,
    dropdownLoading,
    cities,
    citiesLoading,
    form,
  } = useRegistrationForm();

  // Show loading spinner until dropdown data is loaded
  if (dropdownLoading || !dropdownOption) {
    return <LoadingSpinner />;
  }

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
    "availableDayId",
    "shiftTimeId",
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

  const onSubmit = async (data: FormValues) => {
    try {
      // console.log("Form submission data:", data);
      setDisabled(true);

      // Validate required fields
      const requiredFields = [
        "fullName",
        "email",
        "password",
        "mobileNo",
        "dateOfBirth",
      ];
      const missingFields = requiredFields.filter(
        (field) => !data[field as keyof FormValues]
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      const formData = createRegistrationFormData(data);

      await toast.promise(triggerRegisterUser(formData).unwrap(), {
        loading: "Registering...",
        success: "Registered successfully!",
        error: "Failed to register",
      });
      setDisabled(false);
      navigate("/login"); // redirect on success
    } catch (error) {
      setDisabled(false);
      reportError(error, { source: "registration" });
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
              prevStep={prevStep}
              disabled={disabled}
              setDisabled={setDisabled}
              reset={() => resetFields(step3Fields)}
            />
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
