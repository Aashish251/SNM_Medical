import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { useForm, Controller } from "react-hook-form";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Card, CardContent } from "@admin/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { Textarea } from "@admin/components/ui/textarea";
import { Separator } from "@admin/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { Skeleton } from "@admin/components/ui/skeleton";
import {
  useGetUserDetailsQueryQuery,
  useUpdateUserProfileMutation,
} from "@features/update-profile/services";
import {
  useGetRegistrationDropdownDataQuery,
  useLazyGetCitiesByStateQuery,
} from "@shared/services/commonApi";
import { createUpdateProfileFormData } from "@entities/registration";
import { FileUploadField } from "@shared/components/FormInputs";
import { openDocumentView } from "@shared/utils/documentHelper";
import { calculateAge } from "@shared/lib/utils";
import { DUMMY } from "@shared/config/common";
import { normalizeApiError } from "@shared/api/errors";
import { ROUTE_ADMIN_PROFILE } from "@admin/constants/routePaths";
import { validationRules, trimFormValues } from "@shared/lib/formValidation";
import toast from "react-hot-toast";
import type { FormValues, CityItem } from "@shared/types/CommonType";
import {
  ArrowLeft,
  Camera,
  User,
  Briefcase,
  MapPin,
  Upload,
  ExternalLink,
  Save,
  CircleCheck,
  Lock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function avatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}

type ProfileOption = {
  id: string | number;
  [key: string]: unknown;
};

type EditProfileDropdowns = {
  states: Array<ProfileOption & { state_name: string }>;
  departments: Array<ProfileOption & { department_name?: string; name?: string }>;
  qualifications: Array<ProfileOption & { qualification_name?: string; name?: string }>;
  availableDays: Array<ProfileOption & { available_day?: string; name?: string }>;
  shiftTimes: Array<ProfileOption & { shifttime?: string; name?: string }>;
};

function getOptionId(opt: unknown): string {
  if (!opt || typeof opt !== "object") return "";
  const o = opt as Record<string, unknown>;
  const raw =
    o.id ??
    o.state_id ??
    o.city_id ??
    o.department_id ??
    o.qualification_id ??
    o.available_day_id ??
    o.shifttime_id;
  return raw !== null && raw !== undefined ? String(raw) : "";
}

function resolveOptionId(
  value: unknown,
  label: unknown,
  options: ProfileOption[],
  labelKeys: string[]
): string {
  const rawValue =
    value && typeof value === "object"
      ? (value as Record<string, unknown>).id ??
        (value as Record<string, unknown>).state_id ??
        (value as Record<string, unknown>).city_id ??
        (value as Record<string, unknown>).department_id ??
        (value as Record<string, unknown>).qualification_id ??
        (value as Record<string, unknown>).available_day_id ??
        (value as Record<string, unknown>).shifttime_id
      : value;
  const valueId = rawValue === null || rawValue === undefined ? "" : String(rawValue);

  if (valueId && valueId !== "0") {
    const matchingId = options.find((option) => getOptionId(option) === valueId);
    if (matchingId) return getOptionId(matchingId);
  }

  const normalizedLabel = String(label ?? "").trim().toLowerCase();
  if (normalizedLabel) {
    const matchingLabel = options.find((option) =>
      labelKeys.some(
        (key) =>
          typeof (option as any)[key] === "string" &&
          ((option as any)[key] as string).trim().toLowerCase() === normalizedLabel
      )
    );
    if (matchingLabel) return getOptionId(matchingLabel);
  }

  return valueId === "0" ? "" : valueId;
}

function resolveChoiceValue(
  value: unknown,
  options: Array<{ id: number; label: string; value: string }>
): string {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return "";
  const match = options.find(
    (option) =>
      String(option.id) === rawValue ||
      option.value.toLowerCase() === rawValue.toLowerCase() ||
      option.label.toLowerCase() === rawValue.toLowerCase() ||
      option.label.replace(/\./g, "").toLowerCase() === rawValue.toLowerCase()
  );
  return match?.value ?? rawValue;
}

function resolveUserType(value: unknown): "admin" | "ms" {
  const userType = String(value ?? "").trim().toLowerCase();
  if (userType === "admin" || userType.includes("admin")) return "admin";
  return "ms";
}

/* ------------------------------------------------------------------ */
/*  FormField wrapper                                                 */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-[13px] text-muted-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                  */
/* ------------------------------------------------------------------ */

function EditSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[320px] w-full rounded-xl" />
        <Skeleton className="h-[160px] w-full rounded-xl" />
      </div>
      <Skeleton className="h-[340px] w-full rounded-xl" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function ProfileEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userDetails } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const userIdFromLocation = state?.userId ?? searchParams.get("userId");
  const handleBackToProfile = () => {
    navigate(
      ROUTE_ADMIN_PROFILE,
      userIdFromLocation ? { state: { userId: userIdFromLocation } } : undefined
    );
  };
  const defaultUserId = userDetails?.id;
  const userId = userIdFromLocation ? String(userIdFromLocation) : defaultUserId;

  /* --- APIs -------------------------------------------------------- */
  const {
    // `data` can temporarily contain the previous query argument when this
    // route is reused for another user. Only hydrate the form from this ID.
    currentData: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetUserDetailsQueryQuery(Number(userId), {
    skip: !userId || userId === "0",
    refetchOnMountOrArgChange: 30,
  });

  const { data: dropdownData, isLoading: dropdownLoading } =
    useGetRegistrationDropdownDataQuery();

  const [triggerGetCities, { isLoading: citiesLoading }] =
    useLazyGetCitiesByStateQuery();

  const [triggerUpdate] = useUpdateUserProfileMutation();

  const dropdowns = dropdownData?.data as unknown as EditProfileDropdowns | undefined;
  const qualifications = dropdowns?.qualifications ?? [];
  const departments = dropdowns?.departments ?? [];
  const states = dropdowns?.states ?? [];
  const availableDays = dropdowns?.availableDays ?? [];
  const shiftTimes = dropdowns?.shiftTimes ?? [];
  const profileData = profileResponse?.data as
    | (FormValues & {
        stateName?: string;
        cityName?: string;
        qualificationName?: string;
        departmentName?: string;
        availableDay?: string;
        shiftTime?: string;
      })
    | undefined;
  // Also accept profile passed through navigation state as an initial hint
  // (avoids blank flash when RTK cache has expired).
  const passedProfile = state?.profile as typeof profileData;
  const selectedProfile =
    profileData ??
    (passedProfile && String((passedProfile as any).id ?? userId) === String(userId)
      ? passedProfile
      : undefined);

  /* --- Initial & reactive form values ------------------------------- */
  const initialFormValues = useMemo<FormValues | undefined>(() => {
    if (!selectedProfile) return undefined;

    const titleVal = resolveChoiceValue(selectedProfile.title, DUMMY.titles) || "Mr";
    const rawGender = resolveChoiceValue(selectedProfile.gender, DUMMY.genders);
    const genderVal =
      rawGender === "1"
        ? "Male"
        : rawGender === "2"
        ? "Female"
        : rawGender === "3"
        ? "Other"
        : rawGender || "Male";
    const userTypeVal = resolveUserType(selectedProfile.userType ?? (selectedProfile as any).role);
    const qualId = resolveOptionId(
      selectedProfile.qualificationId ?? (selectedProfile as any).qualification_id,
      selectedProfile.qualificationName ?? (selectedProfile as any).qualification_name,
      qualifications,
      ["qualification_name", "name"]
    );
    const deptId = resolveOptionId(
      selectedProfile.departmentId ?? (selectedProfile as any).department_id,
      selectedProfile.departmentName ?? (selectedProfile as any).department_name,
      departments,
      ["department_name", "name"]
    );
    const stId = resolveOptionId(
      selectedProfile.stateId ?? (selectedProfile as any).state_id,
      selectedProfile.stateName ?? (selectedProfile as any).state_name,
      states,
      ["state_name", "name"]
    );
    const ctId = String(selectedProfile.cityId ?? (selectedProfile as any).city_id ?? "");
    const dayId = resolveOptionId(
      selectedProfile.availableDayId ?? (selectedProfile as any).available_day_id,
      selectedProfile.availableDay ?? (selectedProfile as any).available_day,
      availableDays,
      ["available_day", "name"]
    );
    const shId = resolveOptionId(
      selectedProfile.shiftTimeId ?? (selectedProfile as any).shifttime_id,
      selectedProfile.shiftTime ?? (selectedProfile as any).shifttime,
      shiftTimes,
      ["shifttime", "name"]
    );

    return {
      ...selectedProfile,
      title: titleVal,
      gender: genderVal,
      userType: userTypeVal,
      qualificationId: qualId,
      departmentId: deptId,
      stateId: stId,
      cityId: ctId,
      availableDayId: dayId,
      shiftTimeId: shId,
      profilePic: undefined,
      certificate: undefined,
    };
  }, [
    selectedProfile,
    qualifications,
    departments,
    states,
    availableDays,
    shiftTimes,
  ]);

  /* --- Form -------------------------------------------------------- */
  const form = useForm<FormValues>({
    mode: "onTouched",
    values: initialFormValues,
  });

  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const [cities, setCities] = useState<CityItem[]>([]);
  const [existingProfilePic, setExistingProfilePic] = useState<string | undefined>();
  const [existingCertificate, setExistingCertificate] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync files / certificate when profile arrives
  useEffect(() => {
    if (!selectedProfile) return;

    setExistingProfilePic(selectedProfile.profileImage ?? undefined);
    setExistingCertificate(
      typeof selectedProfile.certificate === "string"
        ? selectedProfile.certificate
        : undefined
    );
  }, [selectedProfile]);

  /* --- Dropdown label helpers (for SelectValue display) ------------- */
  const getTitleLabel = (val?: string) =>
    DUMMY.titles.find((t) => t.value === val)?.label ?? val ?? "";

  const getGenderLabel = (val?: string) =>
    DUMMY.genders.find((g) => g.value === val)?.label ?? val ?? "";

  const getStateLabel = (val?: string) =>
    states.find((s) => getOptionId(s) === String(val))?.state_name ??
    (states.find((s) => getOptionId(s) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.stateId ?? (selectedProfile as any)?.state_id)
      ? selectedProfile?.stateName || (selectedProfile as any)?.state_name
      : "") ??
    "";

  const getCityLabel = (val?: string) =>
    cities.find((c) => getOptionId(c) === String(val))?.city_name ??
    (cities.find((c) => getOptionId(c) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.cityId ?? (selectedProfile as any)?.city_id)
      ? selectedProfile?.cityName || (selectedProfile as any)?.city_name
      : "") ??
    "";

  const getQualificationLabel = (val?: string) =>
    qualifications.find((q) => getOptionId(q) === String(val))?.qualification_name ??
    (qualifications.find((q) => getOptionId(q) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.qualificationId ?? (selectedProfile as any)?.qualification_id)
      ? selectedProfile?.qualificationName || (selectedProfile as any)?.qualification_name
      : "") ??
    "";

  const getDepartmentLabel = (val?: string) =>
    departments.find((d) => getOptionId(d) === String(val))?.department_name ??
    (departments.find((d) => getOptionId(d) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.departmentId ?? (selectedProfile as any)?.department_id)
      ? selectedProfile?.departmentName || (selectedProfile as any)?.department_name
      : "") ??
    "";

  const getAvailableDayLabel = (val?: string) =>
    availableDays.find((d) => getOptionId(d) === String(val))?.available_day ??
    (availableDays.find((d) => getOptionId(d) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.availableDayId ?? (selectedProfile as any)?.available_day_id)
      ? selectedProfile?.availableDay || (selectedProfile as any)?.available_day
      : "") ??
    "";

  const getShiftTimeLabel = (val?: string) =>
    shiftTimes.find((st) => getOptionId(st) === String(val))?.shifttime ??
    (shiftTimes.find((st) => getOptionId(st) === String(val)) as any)?.name ??
    (String(val) === String(selectedProfile?.shiftTimeId ?? (selectedProfile as any)?.shifttime_id)
      ? selectedProfile?.shiftTime || (selectedProfile as any)?.shifttime
      : "") ??
    "";

  // Auto-calculate age from DOB
  const birthdate = watch("dateOfBirth");
  useEffect(() => {
    if (birthdate) setValue("age", calculateAge(birthdate));
  }, [birthdate, setValue]);

  // Fetch cities when state changes
  const stateId = watch("stateId");
  useEffect(() => {
    const fetchCities = async (id: number) => {
      try {
        const result = await triggerGetCities({ stateId: id }).unwrap();
        const loadedCities = result?.data?.cities || [];
        setCities(loadedCities);
        const currentCityId = String(selectedProfile?.cityId ?? (selectedProfile as any)?.city_id ?? "");
        const targetCityId = watch("cityId") || currentCityId;
        if (targetCityId && loadedCities.some((c) => getOptionId(c) === targetCityId)) {
          setValue("cityId", targetCityId);
        } else if (selectedProfile?.cityName || (selectedProfile as any)?.city_name) {
          const cName = String((selectedProfile?.cityName || (selectedProfile as any)?.city_name || "")).trim().toLowerCase();
          const matchingCity = loadedCities.find(
            (city) =>
              city.city_name?.trim().toLowerCase() === cName ||
              (city as any).name?.trim().toLowerCase() === cName
          );
          if (matchingCity) setValue("cityId", getOptionId(matchingCity));
        }
      } catch {
        setCities([]);
      }
    };
    const id = Number(stateId);
    if (id) {
      void fetchCities(id);
    } else {
      setCities([]);
    }
  }, [stateId, triggerGetCities, selectedProfile, setValue]);

  /* --- File upload ------------------------------------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("profilePic", files as any);
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  /* --- Submit ------------------------------------------------------ */
  const onSubmit = async (data: FormValues) => {
    if (!userId) return;
    try {
      const trimmedData = trimFormValues(data);
      const formData = createUpdateProfileFormData(trimmedData, String(userId));
      await triggerUpdate({ id: String(userId), formData }).unwrap();
      setSaveMessage("Records updated successfully !");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  };

  /* --- Derived values ---------------------------------------------- */
  const isEditingOwnProfile = String(userId) === String(userDetails?.id);
  const displayName = selectedProfile?.fullName ?? (isEditingOwnProfile ? userDetails?.name : "") ?? "";
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarPath =
    existingProfilePic ??
    selectedProfile?.profileImage ??
    (isEditingOwnProfile ? userDetails?.profilePic : undefined);
  const currentAvatar = previewUrl ?? avatarUrl(avatarPath);

  const isLoading = profileLoading || dropdownLoading;

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-5">
        {/* ── Back + heading ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mb-3 gap-1.5"
              onClick={handleBackToProfile}
            >
              <ArrowLeft className="size-3.5" />
              Back to Profile
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Update your information to keep your profile up to date.
            </p>
          </div>
          <div className="hidden md:block shrink-0 rounded-lg bg-primary/5 px-4 py-2.5 border border-primary/10">
            <p className="text-[13px] italic text-muted-foreground leading-snug">
              &ldquo;Small changes make a big difference.&rdquo;
            </p>
            <p className="text-[11px] text-primary mt-0.5">&mdash; Medical Sewa 💜</p>
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────── */}
        {isLoading ? (
          <EditSkeleton />
        ) : profileError && !selectedProfile ? (
          <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
            Could not load this user’s profile. Go back and try again.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              {/* ======= LEFT: FORM SECTIONS ======= */}
              <div className="space-y-5">
                {/* Row 1: Photo + Personal Information */}
                <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                  {/* ─── Profile Photo card ─── */}
                  <Card className="py-0">
                    <CardContent className="px-5 py-5 flex flex-col items-center">
                      <div className="flex items-center gap-2 self-start mb-4">
                        <Camera className="size-4 text-primary" />
                        <h4 className="text-sm font-semibold">Profile Photo</h4>
                      </div>

                      <div className="relative mb-4">
                        <Avatar className="size-[140px]">
                          <AvatarImage src={currentAvatar} alt={displayName} />
                          <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute bottom-1 right-1 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground shadow-md cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="size-3.5" />
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5 mb-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="size-3.5" />
                        Upload New Photo
                      </Button>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        JPG, PNG (Max 5MB)
                      </p>
                    </CardContent>
                  </Card>

                  {/* ─── Personal Information card ─── */}
                  <Card className="py-0">
                    <CardContent className="px-5 py-5">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="size-4 text-primary" />
                        <h4 className="text-sm font-semibold">Personal Information</h4>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                        <FormField label="Title" required error={errors.title?.message}>
                          <Controller
                            control={form.control}
                            name="title"
                            rules={validationRules.required("Title")}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select">
                                    {getTitleLabel(field.value) || "Select"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {DUMMY.titles.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      {t.label}
                                    </SelectItem>
                                  ))}
                                  {field.value &&
                                    !DUMMY.titles.some((t) => t.value === field.value) && (
                                      <SelectItem value={String(field.value)}>
                                        {String(field.value)}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>

                        <FormField label="Full Name" required error={errors.fullName?.message}>
                          <Input
                            {...register("fullName", validationRules.fullName("Full name"))}
                            placeholder="Full Name"
                            aria-invalid={!!errors.fullName}
                          />
                        </FormField>

                        <FormField label="Email" required error={errors.email?.message}>
                          <Input
                            {...register("email", validationRules.requiredEmail("Email"))}
                            type="email"
                            placeholder="Email"
                            aria-invalid={!!errors.email}
                          />
                        </FormField>

                        <FormField label="Mobile" required error={errors.mobileNo?.message}>
                          <Input
                            {...register("mobileNo", validationRules.mobileNumber)}
                            placeholder="Mobile"
                            aria-invalid={!!errors.mobileNo}
                          />
                        </FormField>

                        <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
                          <Input
                            {...register("dateOfBirth", validationRules.required("Date of Birth"))}
                            type="date"
                            max={new Date().toISOString().slice(0, 10)}
                            aria-invalid={!!errors.dateOfBirth}
                          />
                        </FormField>

                        <FormField label="Age">
                          <Input
                            {...register("age")}
                            readOnly
                            className="bg-muted/50"
                          />
                        </FormField>

                        <FormField label="Gender" required error={errors.gender?.message}>
                          <Controller
                            control={form.control}
                            name="gender"
                            rules={validationRules.required("Gender")}
                            render={({ field }) => {
                              const normalizedVal =
                                field.value === "1"
                                  ? "Male"
                                  : field.value === "2"
                                  ? "Female"
                                  : field.value === "3"
                                  ? "Other"
                                  : field.value || "";

                              return (
                                <Select
                                  value={normalizedVal}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select">
                                      {getGenderLabel(normalizedVal) || "Select"}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DUMMY.genders.map((g) => (
                                      <SelectItem key={g.value} value={g.value}>
                                        {g.label}
                                      </SelectItem>
                                    ))}
                                    {normalizedVal &&
                                      !DUMMY.genders.some((g) => g.value === normalizedVal) && (
                                        <SelectItem value={normalizedVal}>
                                          {normalizedVal}
                                        </SelectItem>
                                      )}
                                  </SelectContent>
                                </Select>
                              );
                            }}
                          />
                        </FormField>

                        <FormField label="State" required error={errors.stateId?.message}>
                          <Controller
                            control={form.control}
                            name="stateId"
                            rules={validationRules.required("State")}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select State">
                                    {getStateLabel(field.value) || "Select State"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {states.map((s, i) => {
                                    const val = getOptionId(s) || String(i);
                                    const label = s.state_name ?? (s as any).name ?? val;
                                    return (
                                      <SelectItem key={val} value={val}>
                                        {label}
                                      </SelectItem>
                                    );
                                  })}
                                  {field.value &&
                                    !states.some((s) => getOptionId(s) === String(field.value)) && (
                                      <SelectItem value={String(field.value)}>
                                        {selectedProfile?.stateName || (selectedProfile as any)?.state_name || String(field.value)}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>

                        <FormField label="City" required error={errors.cityId?.message}>
                          <Controller
                            control={form.control}
                            name="cityId"
                            rules={validationRules.required("City")}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                disabled={citiesLoading}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={citiesLoading ? "Loading…" : "Select City"}>
                                    {getCityLabel(field.value) || (citiesLoading ? "Loading…" : "Select City")}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((c, i) => {
                                    const val = getOptionId(c) || String(i);
                                    return (
                                      <SelectItem key={val} value={val}>
                                        {c.city_name ?? (c as any).name ?? val}
                                      </SelectItem>
                                    );
                                  })}
                                  {field.value &&
                                    !cities.some((c) => getOptionId(c) === String(field.value)) && (
                                      <SelectItem value={String(field.value)}>
                                        {selectedProfile?.cityName || (selectedProfile as any)?.city_name || String(field.value)}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ─── Professional Information ─── */}
                <Card className="py-0">
                  <CardContent className="px-5 py-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="size-4 text-primary" />
                      <h4 className="text-sm font-semibold">Professional Information</h4>
                    </div>
                    <Separator className="mb-4 -mt-1" />

                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                      <FormField label="Role" required error={errors.userType?.message}>
                        <Controller
                          control={form.control}
                          name="userType"
                          rules={validationRules.required("Role")}
                          render={({ field }) => (
                            <Select
                              value={field.value || "ms"}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Role">
                                  {field.value === "admin" ? "Admin" : "Medical Sewadar"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ms">Medical Sewadar</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField label="Qualification" required error={errors.qualificationId?.message}>
                        <Controller
                          control={form.control}
                          name="qualificationId"
                          rules={validationRules.required("Qualification")}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Qualification">
                                  {getQualificationLabel(field.value) || "Select Qualification"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {qualifications.map((q, i) => {
                                  const val = getOptionId(q) || String(i);
                                  const label = q.qualification_name ?? (q as any).name ?? val;
                                  return (
                                    <SelectItem key={val} value={val}>
                                      {label}
                                    </SelectItem>
                                  );
                                })}
                                {field.value &&
                                  !qualifications.some((q) => getOptionId(q) === String(field.value)) && (
                                    <SelectItem value={String(field.value)}>
                                      {selectedProfile?.qualificationName || (selectedProfile as any)?.qualification_name || String(field.value)}
                                    </SelectItem>
                                  )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField label="Department" required error={errors.departmentId?.message}>
                        <Controller
                          control={form.control}
                          name="departmentId"
                          rules={validationRules.required("Department")}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Department">
                                  {getDepartmentLabel(field.value) || "Select Department"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dep, i) => {
                                  const val = getOptionId(dep) || String(i);
                                  const label = dep.department_name ?? (dep as any).name ?? val;
                                  return (
                                    <SelectItem key={val} value={val}>
                                      {label}
                                    </SelectItem>
                                  );
                                })}
                                {field.value &&
                                  !departments.some((dep) => getOptionId(dep) === String(field.value)) && (
                                    <SelectItem value={String(field.value)}>
                                      {selectedProfile?.departmentName || (selectedProfile as any)?.department_name || String(field.value)}
                                    </SelectItem>
                                  )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField label="Experience (Years)" required error={errors.experience?.message}>
                        <Input
                          {...register("experience", validationRules.required("Experience"))}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          aria-invalid={!!errors.experience}
                        />
                      </FormField>

                      <FormField label="Previous Sewa" error={errors.lastSewa?.message}>
                        <Input
                          {...register("lastSewa", validationRules.noWhitespaceOnly("Previous Sewa"))}
                          placeholder="Previous Sewa"
                        />
                      </FormField>

                      <FormField label="Recommended By" error={errors.recommendedBy?.message}>
                        <Input
                          {...register("recommendedBy", validationRules.noWhitespaceOnly("Recommended By"))}
                          placeholder="Recommended By"
                        />
                      </FormField>

                      <FormField label="Available Days">
                        <Controller
                          control={form.control}
                          name="availableDayId"
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Available Days">
                                  {getAvailableDayLabel(field.value) || "Select Available Days"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {availableDays.map((day, i) => {
                                  const val = getOptionId(day) || String(i);
                                  const label = day.available_day ?? (day as any).name ?? val;
                                  return (
                                    <SelectItem key={val} value={val}>
                                      {label}
                                    </SelectItem>
                                  );
                                })}
                                {field.value &&
                                  !availableDays.some((day) => getOptionId(day) === String(field.value)) && (
                                    <SelectItem value={String(field.value)}>
                                      {selectedProfile?.availableDay || (selectedProfile as any)?.available_day || String(field.value)}
                                    </SelectItem>
                                  )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField label="Preferred Shift Time">
                        <Controller
                          control={form.control}
                          name="shiftTimeId"
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Preferred Shift Time">
                                  {getShiftTimeLabel(field.value) || "Select Preferred Shift Time"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {shiftTimes.map((shift, i) => {
                                  const val = getOptionId(shift) || String(i);
                                  const label = shift.shifttime ?? (shift as any).name ?? val;
                                  return (
                                    <SelectItem key={val} value={val}>
                                      {label}
                                    </SelectItem>
                                  );
                                })}
                                {field.value &&
                                  !shiftTimes.some((shift) => getOptionId(shift) === String(field.value)) && (
                                    <SelectItem value={String(field.value)}>
                                      {selectedProfile?.shiftTime || (selectedProfile as any)?.shifttime || String(field.value)}
                                    </SelectItem>
                                  )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <div className="space-y-1.5">
                        <FileUploadField
                          label="Certificate"
                          existingUrl={existingCertificate}
                          regId={userId}
                          accept=".jpg,.jpeg,.png,.pdf"
                          selectedFile={watch("certificate")}
                          register={register("certificate")}
                        />
                        {(existingCertificate || (selectedProfile as any)?.certificate_doc_path) && userId && (
                          <div className="flex items-center gap-2 pt-0.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs text-[#0066FF] hover:text-blue-700 font-semibold"
                              onClick={() => void openDocumentView(userId)}
                            >
                              <ExternalLink className="size-3.5" />
                              View Certificate
                            </Button>
                          </div>
                        )}
                      </div>

                      <FormField label="Joined Date">
                        <Input
                          {...register("samagamHeldIn")}
                          type="date"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>

                {/* ─── Address Information ─── */}
                <Card className="py-0">
                  <CardContent className="px-5 py-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="size-4 text-primary" />
                      <h4 className="text-sm font-semibold">Address Information</h4>
                    </div>
                    <Separator className="mb-4 -mt-1" />

                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                      <FormField label="Address" required error={errors.address?.message}>
                        <Textarea
                          {...register("address", validationRules.required("Address"))}
                          placeholder="Address"
                          rows={3}
                          aria-invalid={!!errors.address}
                        />
                      </FormField>

                      <div className="space-y-3">
                        <FormField label="State" required error={errors.stateId?.message}>
                          <Controller
                            control={form.control}
                            name="stateId"
                            rules={validationRules.required("State")}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select State">
                                    {getStateLabel(field.value) || "Select State"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {states.map((s, i) => {
                                    const val = getOptionId(s) || String(i);
                                    const label = s.state_name ?? (s as any).name ?? val;
                                    return (
                                      <SelectItem key={val} value={val}>
                                        {label}
                                      </SelectItem>
                                    );
                                  })}
                                  {field.value &&
                                    !states.some((stateOption) => getOptionId(stateOption) === String(field.value)) && (
                                      <SelectItem value={String(field.value)}>
                                        {selectedProfile?.stateName || (selectedProfile as any)?.state_name || String(field.value)}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>

                        <FormField label="City" required error={errors.cityId?.message}>
                          <Controller
                            control={form.control}
                            name="cityId"
                            rules={validationRules.required("City")}
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                disabled={citiesLoading}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={citiesLoading ? "Loading…" : "Select City"}>
                                    {getCityLabel(field.value) || (citiesLoading ? "Loading…" : "Select City")}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((c, i) => {
                                    const val = getOptionId(c) || String(i);
                                    return (
                                      <SelectItem key={val} value={val}>
                                        {c.city_name ?? (c as any).name ?? val}
                                      </SelectItem>
                                    );
                                  })}
                                  {field.value &&
                                    !cities.some((city) => getOptionId(city) === String(field.value)) && (
                                      <SelectItem value={String(field.value)}>
                                        {selectedProfile?.cityName || (selectedProfile as any)?.city_name || String(field.value)}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* View on Maps link */}
                    {selectedProfile?.address && (
                      <div className="flex justify-end mt-3">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedProfile.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] text-primary font-medium hover:underline"
                        >
                          <ExternalLink className="size-3.5" />
                          View on Maps
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ─── Security Information ─── */}
                <Card className="py-0">
                  <CardContent className="px-5 py-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="size-4 text-primary" />
                      <h4 className="text-sm font-semibold">Security Information</h4>
                    </div>
                    <Separator className="mb-4 -mt-1" />

                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                      <FormField label="Favorite Food" error={errors.favoriteFood?.message}>
                        <Input
                          {...register("favoriteFood", validationRules.noWhitespaceOnly("Favorite food"))}
                          placeholder="Favorite Food"
                        />
                      </FormField>

                      <FormField label="Hobbies" error={errors.hobbies?.message}>
                        <Input
                          {...register("hobbies", validationRules.noWhitespaceOnly("Hobbies"))}
                          placeholder="Hobbies"
                        />
                      </FormField>

                      <FormField label="Nickname" error={errors.childhoodNickname?.message}>
                        <Input
                          {...register("childhoodNickname", validationRules.noWhitespaceOnly("Nickname"))}
                          placeholder="Nickname"
                        />
                      </FormField>

                      <FormField label="Mother's Name" error={errors.motherMaidenName?.message}>
                        <Input
                          {...register("motherMaidenName", validationRules.noWhitespaceOnly("Mother's Name"))}
                          placeholder="Mother's Name"
                        />
                      </FormField>
                      <FormField label="Remark" error={errors.remark?.message}>
                        <Textarea
                          {...register("remark", validationRules.noWhitespaceOnly("Remark"))}
                          placeholder="Remark"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ======= RIGHT: SIDEBAR ======= */}
              <div className="space-y-4">
                <Card className="py-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent border-primary/10">
                  <CardContent className="px-5 py-6 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-7 text-primary"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
                        <path d="m18 15-2-2" />
                        <path d="m15 18-2-2" />
                      </svg>
                    </div>
                    <h4 className="text-[15px] font-bold leading-snug">
                      Keep Your Profile<br />Up to Date
                    </h4>
                    <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">
                      Your information helps us serve better and stay connected.
                    </p>
                  </CardContent>
                </Card>

                <Card className="py-0">
                  <CardContent className="px-5 py-4 space-y-3">
                    {[
                      "Accurate information improves communication",
                      "Helps in better coordination",
                      "Keeps your account secure",
                      "Supports a stronger Medical Sewa community",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-muted-foreground leading-snug">
                          {text}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ── Bottom action bar ─────────────────────────────── */}
            <Separator className="my-5" />
            <div className="flex items-center justify-end gap-3 pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToProfile}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Main>
      <Dialog open={!!saveMessage} onOpenChange={(open) => { if (!open) { setSaveMessage(""); handleBackToProfile(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update complete</DialogTitle>
            <DialogDescription>{saveMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setSaveMessage(""); handleBackToProfile(); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
