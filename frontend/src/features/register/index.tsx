import React from "react";
import { motion } from "framer-motion";
import { Stepper } from "./components/Stepper";
import { STEPS } from "./config";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import { PersonalDetailsStep } from "./components/PersonalDetailsStep";
import { ProfessionalDetailsStep } from "./components/ProfessionalDetailsStep";
import { LoginDetailsStep } from "./components/LoginDetailsStep";
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
      console.log(data)
      const formData = new FormData();

      for (const key in data) {
        if (key === "certificate" || key === "profilePic") {
          const file = data[key]?.[0];
          if (file) {
            formData.append(key, file);
          }
        } else {
          formData.append(key, data[key] as any);
        }
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
          <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-wide">
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
