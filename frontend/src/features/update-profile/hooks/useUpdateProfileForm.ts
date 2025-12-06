import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { calculateAge } from "@shared/lib/utils";
import {
  useLazyGetCitiesByStateQuery,
  useGetRegistrationDropdownDataQuery,
} from "@shared/services/commonApi";
import { FormValues, CityItem } from "@shared/types/CommonType";
import { requiredFields } from "@shared/config/common";

export const useUpdateProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<CityItem[]>([]);
  const { data: dropdownOption } = useGetRegistrationDropdownDataQuery();
  const [triggerGetCitiesByState, { isLoading: citiesLoading }] =
    useLazyGetCitiesByStateQuery();

  const form = useForm<FormValues>({
    defaultValues: {
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
      availability: "",
      shift: "",
      experience: "",
      lastSewa: "",
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
    },
    mode: "onTouched",
  });

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
        console.error("Failed to fetch cities", error);
        setCities([]);
      }
    };

    const id = Number(stateId);
    if (id) fetchCities(id);
    else {
      setCities([]);
      setValue("cityId", "");
    }
  }, [stateId, setValue]);

  const nextStep = async () => {
    const valid = await trigger(requiredFields[currentStep]);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    dropdownOption,
    cities,
    citiesLoading,
    form,
  };
};
