import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { useForm } from "react-hook-form";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Card, CardContent } from "@admin/components/ui/card";
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
import { calculateAge } from "@shared/lib/utils";
import { DUMMY } from "@shared/config/common";
import { normalizeApiError } from "@shared/api/errors";
import { ROUTE_ADMIN_PROFILE } from "@admin/constants/routePaths";
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function avatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}

/* ------------------------------------------------------------------ */
/*  FormField wrapper                                                 */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
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
  const userIdFromState = state?.userId;
  const defaultUserId = userDetails?.id;
  const userId = userIdFromState ? String(userIdFromState) : defaultUserId;

  /* --- APIs -------------------------------------------------------- */
  const {
    data: profileResponse,
    isLoading: profileLoading,
  } = useGetUserDetailsQueryQuery(Number(userId), {
    skip: !userId || userId === "0",
  });

  const { data: dropdownData, isLoading: dropdownLoading } =
    useGetRegistrationDropdownDataQuery();

  const [triggerGetCities, { isLoading: citiesLoading }] =
    useLazyGetCitiesByStateQuery();

  const [triggerUpdate] = useUpdateUserProfileMutation();

  /* --- Form -------------------------------------------------------- */
  const form = useForm<FormValues>({
    mode: "onTouched",
  });

  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const profileData = profileResponse?.data;
  const [cities, setCities] = useState<CityItem[]>([]);
  const [existingProfilePic, setExistingProfilePic] = useState<string | undefined>();
  const [existingCertificate, setExistingCertificate] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasReset = useRef(false);

  // Populate form when data arrives
  useEffect(() => {
    if (profileData && !hasReset.current) {
      hasReset.current = true;
      setExistingProfilePic(profileData.profileImage ?? undefined);
      setExistingCertificate(
        typeof profileData.certificate === "string"
          ? profileData.certificate
          : undefined
      );
      const getVal = (val: any) => {
        if (!val) return "";
        if (typeof val === "object") return String(val.id ?? "");
        return String(val);
      };
      reset({
        ...profileData,
        qualificationId: getVal(profileData.qualificationId),
        departmentId: getVal(profileData.departmentId),
        stateId: getVal(profileData.stateId),
        cityId: getVal(profileData.cityId),
        profilePic: undefined,
        certificate: undefined,
      });
    }
  }, [profileData, reset]);

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
        setCities(result?.data?.cities || []);
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
  }, [stateId, triggerGetCities]);

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
      const formData = createUpdateProfileFormData(data, String(userId));
      await toast.promise(
        triggerUpdate({ id: String(userId), formData }).unwrap(),
        {
          loading: "Updating profile…",
          success: "Profile updated successfully!",
          error: "Failed to update profile",
        }
      );
      navigate(ROUTE_ADMIN_PROFILE);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  };

  /* --- Derived values ---------------------------------------------- */
  const displayName = profileData?.fullName ?? userDetails?.name ?? "";
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentAvatar = previewUrl ?? avatarUrl(existingProfilePic ?? userDetails?.profilePic);

  const isLoading = profileLoading || dropdownLoading;

  const dropdowns = dropdownData?.data;
  const qualifications = dropdowns?.qualifications ?? [];
  const departments = dropdowns?.departments ?? [];
  const states = dropdowns?.states ?? [];
  const sewaLocations = dropdowns?.sewaLocations ?? [];

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
              onClick={() => navigate(ROUTE_ADMIN_PROFILE)}
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
                        <FormField label="Full Name" required>
                          <Input
                            {...register("fullName", { required: true })}
                            placeholder="Full Name"
                            aria-invalid={!!errors.fullName}
                          />
                        </FormField>

                        <FormField label="Title" required>
                          <Select
                            value={watch("title") || ""}
                            onValueChange={(v) => setValue("title", v)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {DUMMY.titles.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        <FormField label="Email" required>
                          <Input
                            {...register("email", { required: true })}
                            type="email"
                            placeholder="Email"
                            aria-invalid={!!errors.email}
                          />
                        </FormField>

                        <FormField label="Mobile" required>
                          <Input
                            {...register("mobileNo", { required: true })}
                            placeholder="Mobile"
                            aria-invalid={!!errors.mobileNo}
                          />
                        </FormField>

                        <FormField label="Date of Birth" required>
                          <Input
                            {...register("dateOfBirth", { required: true })}
                            type="date"
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

                        <FormField label="Gender" required>
                          <Select
                            value={watch("gender") || ""}
                            onValueChange={(v) => setValue("gender", v)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {DUMMY.genders.map((g) => (
                                <SelectItem key={g.value} value={g.value}>
                                  {g.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      <FormField label="Role" required>
                        <Select
                          value={watch("departmentId") || ""}
                          onValueChange={(v) => setValue("departmentId", v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dep: any, i: number) => {
                              const val = String(typeof dep === "object" ? dep.id : dep);
                              const label = typeof dep === "object" ? (dep.department_name ?? dep.name) : dep;
                              return (
                                <SelectItem key={val || i} value={val}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField label="Qualification" required>
                        <Select
                          value={String(watch("qualificationId") || "")}
                          onValueChange={(v) => setValue("qualificationId", v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {qualifications.map((q: any, i: number) => {
                              const val = String(typeof q === "object" ? q.id : q);
                              const label = typeof q === "object" ? (q.qualification_name ?? q.name) : q;
                              return (
                                <SelectItem key={val || i} value={val}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField label="Department" required>
                        <Select
                          value={String(watch("departmentId") || "")}
                          onValueChange={(v) => setValue("departmentId", v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dep: any, i: number) => {
                              const val = String(typeof dep === "object" ? dep.id : dep);
                              const label = typeof dep === "object" ? (dep.department_name ?? dep.name) : dep;
                              return (
                                <SelectItem key={val || i} value={val}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField label="Experience (Years)" required>
                        <Input
                          {...register("experience", { required: true })}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          aria-invalid={!!errors.experience}
                        />
                      </FormField>

                      <FormField label="Previous Sewa">
                        <Input
                          {...register("lastSewa")}
                          placeholder="Previous Sewa"
                        />
                      </FormField>

                      <FormField label="Recommended By">
                        <Input
                          {...register("recommendedBy")}
                          placeholder="Recommended By"
                        />
                      </FormField>

                      <FileUploadField
                        label="Certificate"
                        existingUrl={existingCertificate}
                        regId={userId}
                        accept=".jpg,.jpeg,.png,.pdf"
                        selectedFile={watch("certificate")}
                        register={register("certificate")}
                      />

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
                      <FormField label="Address" required>
                        <Textarea
                          {...register("address", { required: true })}
                          placeholder="Address"
                          rows={3}
                          aria-invalid={!!errors.address}
                        />
                      </FormField>

                      <div className="space-y-3">
                        <FormField label="State" required>
                          <Select
                            value={watch("stateId") || ""}
                            onValueChange={(v) => setValue("stateId", v)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                  {s.state_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        <FormField label="City" required>
                          <Select
                            value={watch("cityId") || ""}
                            onValueChange={(v) => setValue("cityId", v)}
                            disabled={citiesLoading || cities.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={citiesLoading ? "Loading…" : "Select City"} />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.city_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>
                    </div>

                    {/* View on Maps link */}
                    {profileData?.address && (
                      <div className="flex justify-end mt-3">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileData.address)}`}
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
                onClick={() => navigate(ROUTE_ADMIN_PROFILE)}
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
    </>
  );
}
