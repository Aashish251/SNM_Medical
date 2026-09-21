import type { FormValues } from "@shared/types/CommonType";

type ProfileFormDataOptions = {
  id?: string | number;
  includeCredentials?: boolean;
  includeRemark?: boolean;
};

export function createRegistrationFormData(data: FormValues) {
  return createProfileFormData(data, { includeCredentials: true });
}

export function createUpdateProfileFormData(
  data: FormValues,
  id: string | number
) {
  return createProfileFormData(data, { id, includeRemark: true });
}

function createProfileFormData(data: FormValues, options: ProfileFormDataOptions) {
  const formData = new FormData();

  if (options.id !== undefined) {
    formData.append("id", String(options.id));
  }

  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("mobileNo", data.mobileNo);
  formData.append("dateOfBirth", data.dateOfBirth);
  formData.append("address", data.address || "");
  formData.append("stateId", String(data.stateId || ""));
  formData.append("cityId", String(data.cityId || ""));
  formData.append("departmentId", String(data.departmentId || ""));
  formData.append("qualificationId", String(data.qualificationId || ""));
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

  if (options.includeCredentials) {
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword || data.password);
  }

  if (options.includeRemark) {
    formData.append("remark", data.remark || "");
  }

  appendFileListValue(formData, "profilePic", data.profilePic);
  appendFileListValue(formData, "certificate", data.certificate);

  return formData;
}

function appendFileListValue(
  formData: FormData,
  fieldName: "profilePic" | "certificate",
  value: FormValues[typeof fieldName]
) {
  if (value instanceof FileList && value.length > 0) {
    formData.append(fieldName, value[0]);
  }
}
