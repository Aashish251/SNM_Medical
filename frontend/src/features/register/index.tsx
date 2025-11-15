import React from "react";
import { motion } from "framer-motion";
import { STEPS } from "./config";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@shared/components/Registration";
import { useRegisterUserMutation } from "./services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FormValues } from "./type";

const Register = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    dropdownOption,
    cities,
    citiesLoading,
    form,
  } = useRegistrationForm();

  const { handleSubmit, reset } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form submission data:", data);

      // Validate required fields
      const requiredFields = [
        "fullName",
        "email",
        "password",
        "contact",
        "birthdate",
      ];
      const missingFields = requiredFields.filter(
        (field) => !data[field as keyof FormValues]
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      const formData = new FormData();

      // Required fields with field name mapping
      const fieldMapping = {
        contact: "mobileNo",
        birthdate: "dateOfBirth",
      };

      // Required fields
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword || data.password);
      formData.append("mobileNo", data.contact); // mapped from contact
      formData.append("dateOfBirth", data.birthdate); // mapped from birthdate
      formData.append("address", data.address || "");
      formData.append("stateId", String(data.stateId || ""));
      formData.append("cityId", String(data.cityId || ""));
      formData.append("departmentId", String(data.departmentId || ""));
      formData.append("qualificationId", String(data.qualificationId || ""));

      // Optional fields
      formData.append("title", data.title || "Mr");
      formData.append("gender", data.gender || "1");
      formData.append("userType", data.userType || "ms");
      formData.append("experience", String(data.experience || 0));
      formData.append("lastSewa", data.lastSewa || "");
      formData.append("recommendedBy", data.recommendedBy || "");
      formData.append("samagamHeldIn", "");

      formData.append("favoriteFood", data.favoriteFood || "");
      formData.append("childhoodNickname", data.childhoodNickname || "");
      formData.append("motherMaidenName", data.motherMaidenName || "");
      formData.append("hobbies", data.hobbies || "");


      // Handle file uploads
      if (data.profilePic instanceof FileList && data.profilePic.length > 0) {
        formData.append("profilePic", data.profilePic[0]);
      }
      if (data.certificate instanceof FileList && data.certificate.length > 0) {
        formData.append("certificate", data.certificate[0]);
      }

      // Debug: Log form data entries
      console.log("FormData contents:", formData);
      for (const pair of (formData as any).entries()) {
        console.log(pair[0], pair[1]);
      }

      await toast.promise(triggerRegisterUser(formData).unwrap(), {
        loading: "Registering...",
        success: "Registered successfully!",
        error: "Failed to register",
      });

      navigate("/login"); // redirect on success
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
              reset={reset}
            />
          )}

          {currentStep === 2 && (
            <ProfessionalDetailsStep
              form={form}
              dropdownOption={dropdownOption}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <LoginDetailsStep form={form} prevStep={prevStep} />
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
