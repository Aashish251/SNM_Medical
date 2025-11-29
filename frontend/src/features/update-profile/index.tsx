import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { STEPS } from "./config";
import { useUpdateProfileForm } from "./hooks/useUpdateProfileForm";
import {
  Stepper,
  PersonalDetailsStep,
  ProfessionalDetailsStep,
  LoginDetailsStep,
} from "@shared/components/Registration";
import {
  useRegisterUserMutation,
  useLazyGetUserDetailsQueryQuery,
} from "./services";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FormValues } from "./type";

const UpdateProfile = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const { id: regId } = useParams();
  const [triggerGetUserDetails] = useLazyGetUserDetailsQueryQuery();
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

  const { handleSubmit, reset } = form;

  console.log(regId);

  useEffect(() => {
    if (regId) {
      toast.promise(
        triggerGetUserDetails(Number(regId))
          .unwrap()
          .then((data) => {
            const formattedData: any = {
              ...data,
              profilePic: undefined,
              certificate: undefined,
            };
            reset(formattedData);
            console.log("fdgfd ",data)
          }),
        {
          loading: "Fetching user details...",
          success: "User details loaded!",
          error: "Failed to load user details",
        }
      );
    }
  }, [regId, triggerGetUserDetails]);

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
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

export default UpdateProfile;