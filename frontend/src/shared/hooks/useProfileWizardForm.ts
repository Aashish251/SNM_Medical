import { useEffect, useState } from "react";
import { useForm, type UseFormProps } from "react-hook-form";
import { calculateAge } from "@shared/lib/utils";
import { normalizeApiError } from "@shared/api/errors";
import { toast } from "@shared/lib/toast";
import {
  useLazyGetCitiesByStateQuery,
  useGetRegistrationDropdownDataQuery,
} from "@shared/services/commonApi";
import { FormValues, CityItem } from "@shared/types/CommonType";
import { requiredFields } from "@shared/config/common";

type ProfileWizardMode = "register" | "update";

const DEFAULT_FORM_VALUES: FormValues = {
  title: "",
  fullName: "",
  mobileNo: "",
  gender: "",
  email: "",
  dateOfBirth: "",
  age: 0,
  address: "",
  stateId: "",
  cityId: "",
  qualificationId: "",
  departmentId: "",
  availableDayId: "",
  shiftTimeId: "",
  experience: "",
  lastSewa: "",
  samagamHeldIn: "",
  recommendedBy: "",
  certificate: undefined,
  password: "",
  confirmPassword: "",
  userType: "ms",
  remark: "",
  favoriteFood: "",
  childhoodNickname: "",
  motherMaidenName: "",
  hobbies: "",
  profilePic: undefined,
};

export function useProfileWizardForm(mode: ProfileWizardMode) {
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<CityItem[]>([]);
  const { data: dropdownOption, isLoading: dropdownLoading } =
    useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState, { isLoading: citiesLoading }] =
    useLazyGetCitiesByStateQuery();

  const formOptions: UseFormProps<FormValues> = {
    defaultValues: DEFAULT_FORM_VALUES,
    mode: mode === "register" ? "onBlur" : "onTouched",
  };

  const form = useForm<FormValues>(formOptions);
  const { watch, setValue, trigger } = form;
  const stateId = watch("stateId");
  const birthdate = watch("dateOfBirth");

  useEffect(() => {
    if (birthdate) setValue("age", calculateAge(birthdate));
  }, [birthdate, setValue]);

  useEffect(() => {
    const fetchCities = async (id: number) => {
      try {
        const result = await triggerGetCitiesByState({ stateId: id }).unwrap();
        setCities(result?.data?.cities || []);
      } catch (error) {
        toast.error(normalizeApiError(error).message);
        setCities([]);
      }
    };

    const id = Number(stateId);
    if (id) {
      void fetchCities(id);
    } else {
      setCities([]);
      setValue("cityId", "");
    }
  }, [stateId, setValue, triggerGetCitiesByState]);

  const nextStep = async () => {
    const valid = await trigger(requiredFields[currentStep]);
    if (valid) setCurrentStep((step) => step + 1);
  };

  const prevStep = () => setCurrentStep((step) => step - 1);

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    dropdownOption,
    dropdownLoading,
    cities,
    citiesLoading,
    form,
  };
}
