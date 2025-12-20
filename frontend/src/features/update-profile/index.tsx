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
import { useSelector } from "react-redux";
import { RootState } from "@app/store";

const UpdateProfile = () => {
  const [triggerRegisterUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const userType = useSelector((state: RootState) => state.auth.userType);
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

  // 🔹 Call API as soon as we have an ID
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useGetUserDetailsQueryQuery(regId ? Number(regId) : 0, {
    skip: !regId, // don't call if id is missing
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
      console.log("API response data:", userDetails); // ✅ console log

      // Store existing file URLs
      setExistingProfilePic(userDetails.data.profileImage); // Fixed: profileImage now exists in FormValues
      setExistingCertificate(userDetails.data.certificate as string); // Using as string since setExistingCertificate expects string | undefined

      const formattedData: any = {
        ...userDetails.data,
        profilePic: undefined,
        certificate: undefined,
      };

      reset(formattedData);
      toast.success("Profile details loaded!");
    }
  }, [isLoading, isError, userDetails, error, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("id", regId as string);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("mobileNo", data.mobileNo); // mapped from contact
      formData.append("dateOfBirth", data.dateOfBirth); // mapped from birthdate
      formData.append("address", data.address || "");
      formData.append("stateId", String(data.stateId || ""));
      formData.append("cityId", String(data.cityId || ""));
      formData.append("departmentId", String(data.departmentId || ""));
      formData.append("qualificationId", String(data.qualificationId || ""));

      // Optional fields
      formData.append("title", data.title || "Mr");
      formData.append("age", String(data.age || 0));
      formData.append("shiftTimeId", data.shiftTimeId || "");
      formData.append("availableDayId", data.availableDayId || "");
      formData.append("gender", data.gender || "Male");
      formData.append("userType", data.userType || "ms");
      formData.append("experience", String(data.experience || 0));
      formData.append("lastSewa", data.lastSewa || "");
      formData.append("recommendedBy", data.recommendedBy || "");
      formData.append("samagamHeldIn", data.samagamHeldIn || "");

      formData.append("favoriteFood", data.favoriteFood || "");
      formData.append("childhoodNickname", data.childhoodNickname || "");
      formData.append("motherMaidenName", data.motherMaidenName || "");
      formData.append("hobbies", data.hobbies || "");
      formData.append("remark", data.remark || "");

      // Handle file uploads
      if (data.profilePic instanceof FileList && data.profilePic.length > 0) {
        formData.append("profilePic", data.profilePic[0]);
      }
      if (data.certificate instanceof FileList && data.certificate.length > 0) {
        formData.append("certificate", data.certificate[0]);
      }

      // Debug: Log form data entries (FormData logging requires iteration)
      console.log("Final FormData contents:");
      for (const [key, value] of (formData as any).entries()) {
        console.log(`${key}:`, value);
      }

      await toast.promise(
        triggerRegisterUser({ id: regId as string, formData }).unwrap(),
        {
          loading: "Updating Profile...",
          success: "Profile Updated successfully!",
          error: "Failed to update profile",
        }
      );
      setDisabled(false);
      if (userType == "admin") {
        navigate("/admin/master-search");
      } else {
        navigate("/ms/dashboard");
      }
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
              existingProfilePic={existingProfilePic}
            />
          )}

          {currentStep === 2 && (
            <ProfessionalDetailsStep
              form={form}
              dropdownOption={dropdownOption}
              nextStep={nextStep}
              prevStep={prevStep}
              reset={() => resetFields(step2Fields)}
              existingCertificate={existingCertificate}
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
