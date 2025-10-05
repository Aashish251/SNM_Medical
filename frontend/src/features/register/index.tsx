import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@shared/components/ui/button";
import { SelectField } from "@shared/components/FormInputs/SelectField";
import { TextField } from "@shared/components/FormInputs/TextField";
import { DUMMY, STEPS } from "./config";
import { Stepper } from "./components/Stepper";
import { FileUploadField } from "@shared/components/FormInputs/FileUploadField";
import { TextareaField } from "@shared/components/FormInputs/TextareaField";

export type FormValues = {
  title: string;
  fullName: string;
  contact: string;
  gender: string;
  email: string;
  birthdate: string;
  age: string;
  address: string;
  stateId: string;
  cityId: string;
  profilePic?: File | null;

  qualificationId: string;
  departmentId: string;
  availability: string;
  shift: string;
  experience: string;
  lastSewa: string;
  recommendedBy: string;
  certificate?: File | null;

  password: string;
  confirmPassword: string;
  userType: "admin" | "ms";
  remark: string;
};

// -------------------- MAIN COMPONENT --------------------
const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      fullName: "",
      contact: "",
      gender: "",
      email: "",
      birthdate: "",
      age: "",
      address: "",
      stateId: "",
      cityId: "",
      qualificationId: "",
      departmentId: "",
      availability: "",
      shift: "",
      experience: "",
      lastSewa: "",
      recommendedBy: "",
      password: "",
      confirmPassword: "",
      userType: "ms",
      remark: "",
    },
    mode: "onTouched",
  });

  const birthdate = watch("birthdate");

  useEffect(() => {
    if (!birthdate) return;
    const b = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    setValue("age", String(Math.max(age, 0)));
  }, [birthdate, setValue]);

  // const handleFile = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: keyof FormValues
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setValue(field, file, { shouldValidate: true });
  //   if (field === "profilePic") setProfilePreview(URL.createObjectURL(file));
  //   if (field === "certificate") setCertificateName(file.name);
  // };

  const fieldError = (name: keyof FormValues) =>
    errors[name]?.message?.toString() ?? null;

  const validateStep = async () => {
    const requiredFields: Record<number, (keyof FormValues)[]> = {
      1: [
        "title",
        "fullName",
        "contact",
        "gender",
        "email",
        "birthdate",
        "address",
        "stateId",
        "cityId",
      ],
      2: ["qualificationId", "departmentId", "availability", "shift"],
      3: ["password", "confirmPassword"],
    };
    return trigger(requiredFields[currentStep]);
  };

  const nextStep = async () => (await validateStep()) && setCurrentStep((s) => s + 1);
  const prevStep = () => setCurrentStep((s) => s - 1);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form submitted ✅", data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center font-sans pt-[120px] md:pt-[90px] lg:pt-[100px]">
      <div className="max-w-6xl w-full p-8">
        {/* Account Type */}
        {/* <div className="mb-8 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">
            Account Type
          </h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setValue("userType", "ms", { shouldValidate: true })}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${watch("userType") === "ms"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
            >
              Medical Staff
            </button>
            <button
              type="button"
              onClick={() => setValue("userType", "admin", { shouldValidate: true })}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${watch("userType") === "admin"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
            >
              Administrator
            </button>
          </div>
        </div> */}
        {/* Stepper */}
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(stepId) => {
            if (currentStep >= stepId) {
              setCurrentStep(stepId);
            }
          }}
        />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-wide">
            {STEPS[currentStep - 1].title} Details
          </h2>
        </div>

        <motion.form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
        >
          {currentStep === 1 && (
            <>
              <h3 className="text-2xl font-bold mb-6">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <SelectField<FormValues>
                  label="Title"
                  name="title"
                  control={control}
                  required
                  options={DUMMY.titles}
                />

                {/* <SelectField
                  label="Title"
                  placeholder="Select Title"
                  options={DUMMY.titles}
                  onChange={(val) => setValue("title", val, { shouldValidate: true })}
                  error={fieldError("title")}
                /> */}

                <TextField
                  label="Full Name"
                  required
                  register={register("fullName", { required: "Full name is required" })}
                  placeholder="Enter full name"
                  error={errors.fullName}
                />

                <TextField
                  label="Contact"
                  required
                  error={errors.contact}
                  register={register("contact", {
                    required: "Contact is required",
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message: "Enter valid 10-digit number",
                    },
                  })}
                  placeholder="10-digit mobile number"
                />

                <SelectField<FormValues>
                  label="Gender"
                  name="gender"
                  control={control}
                  required
                  options={DUMMY.genders}
                />



                <TextField
                  label="Email"
                  required
                  register={register("email", { required: "Email address is required" })}
                  placeholder="Enter full Email address"
                  error={errors.email}
                />

                <TextField
                  label="Birthdate "
                  required
                  type="date"
                  register={register("birthdate", { required: "birthdate is required" })}
                  placeholder="Enter full birthdate"
                  error={errors.birthdate}
                />

                <TextField
                  label="Age "
                  readOnly={true}
                  register={register("age", { required: "Age is required" })}
                  placeholder="Enter the age."
                  error={errors.age}
                />

                {/* <SelectField
                  label="State"
                  required
                  placeholder="Select State"
                  options={DUMMY.states}
                  onChange={(val) => setValue("stateId", val, { shouldValidate: true })}
                  error={fieldError("stateId")}
                /> */}

                {/* <SelectField
                  label="City"
                  required
                  placeholder="Select City"
                  options={DUMMY.genders}
                  onChange={(val) => setValue("cityId", val, { shouldValidate: true })}
                  error={fieldError("cityId")}
                /> */}

                <FileUploadField
                  label="Profile Picture"
                  required
                  register={register("profilePic", { required: "Profile picture is required" })}
                  error={errors.profilePic}
                />

                <TextareaField
                  label="Address"
                  placeholder="Enter address"
                  required
                  register={register("address", { required: "Description is required" })}
                  error={errors.address}
                />


              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={nextStep}>Next</Button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-2xl font-bold mb-6">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                  label="Qualification"
                  placeholder="Select Qualification"
                  options={DUMMY.qualifications}
                  onChange={(val) =>
                    setValue("qualificationId", val, { shouldValidate: true })
                  }
                  error={fieldError("qualificationId")}
                />
                <SelectField
                  label="Department"
                  placeholder="Select Department"
                  options={DUMMY.departments}
                  onChange={(val) =>
                    setValue("departmentId", val, { shouldValidate: true })
                  }
                  error={fieldError("departmentId")}
                />
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={prevStep}>
                  Previous
                </Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 className="text-2xl font-bold mb-6">Login Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Password"
                  type="password"
                  required
                  register={register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                  placeholder="Enter password"
                  error={errors.password}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  required
                  register={register("confirmPassword", {
                    required: "Confirm password",
                    validate: (v: string) =>
                      v === watch("password") || "Passwords do not match",
                  })}
                  placeholder="Re-enter password"
                  error={errors.confirmPassword}
                />
              </div>

              <div className="flex justify-between mt-10">
                <Button variant="secondary" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
