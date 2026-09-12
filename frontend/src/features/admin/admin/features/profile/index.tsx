import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { Card, CardContent } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Separator } from "@admin/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";
import { Skeleton } from "@admin/components/ui/skeleton";
import { useGetUserDetailsQueryQuery } from "@features/update-profile/services";
import { useGetRegistrationDropdownDataQuery } from "@shared/services/commonApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Lock,
  Bell,
  Download,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  ExternalLink,
  Camera,
  Zap,
  FileText,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function d(value: any): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") {
    return (
      value.department_name ??
      value.qualification_name ??
      value.state_name ??
      value.city_name ??
      value.name ??
      "—"
    );
  }
  return String(value);
}

function lookupName(
  val: any,
  list: any[] = [],
  nameProp: string = "name"
): string {
  if (val === null || val === undefined || val === "") return "—";

  if (typeof val === "object") {
    return (
      val[nameProp] ??
      val.department_name ??
      val.qualification_name ??
      val.state_name ??
      val.city_name ??
      val.name ??
      "—"
    );
  }

  const strVal = String(val).trim();
  if (isNaN(Number(strVal)) || strVal === "") {
    return strVal;
  }

  const numId = Number(strVal);
  if (list && list.length > 0) {
    const found = list.find((item) => Number(item.id) === numId);
    if (found) {
      return (
        found[nameProp] ??
        found.department_name ??
        found.qualification_name ??
        found.state_name ??
        found.city_name ??
        found.name ??
        strVal
      );
    }
  }
  return strVal;
}

function avatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}

/* ------------------------------------------------------------------ */
/*  Inline sub-components                                             */
/* ------------------------------------------------------------------ */

/** Two-column info row with fixed label width & truncated/wrapped value */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 min-w-0">
      <span className="text-slate-400 text-[13px] font-medium w-[100px] sm:w-[110px] shrink-0">
        {label}
      </span>
      <span className="font-semibold text-[13px] text-slate-800 truncate min-w-0 flex-1">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  bgColor,
  iconColor,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm min-w-0">
      <div
        className={`flex items-center justify-center size-9 rounded-xl shrink-0 mb-1.5 ${bgColor} ${iconColor}`}
      >
        <Icon className="size-4.5" />
      </div>
      <span className="text-sm font-bold text-slate-900 leading-tight w-full truncate">
        {value}
      </span>
      <span className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 w-full truncate">
        {label}
      </span>
    </div>
  );
}

function QuickActionItem({
  icon: Icon,
  title,
  description,
  onClick,
  active,
  disabled,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 w-full rounded-xl p-3 text-start transition-all bg-blue-50/90 border border-blue-200/80 shadow-xs"
      >
        <div className="flex items-center justify-center size-9 rounded-lg bg-[#0066FF] text-white shrink-0 shadow-xs">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#0066FF] leading-snug">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 w-full rounded-xl p-3 text-start transition-all bg-white border border-slate-100 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center size-9 rounded-lg bg-slate-100 text-slate-600 shrink-0">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-800 leading-snug">
          {title}
        </p>
        <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
      </div>
    </button>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr_260px]">
      <Skeleton className="h-[480px] w-full rounded-2xl" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[90px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[260px] w-full rounded-2xl" />
        <Skeleton className="h-[120px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab bar (custom styled matching Figma)                            */
/* ------------------------------------------------------------------ */

type ProfileTab =
  | "overview"
  | "personal"
  | "professional"
  | "address"
  | "security";

const TABS: { value: ProfileTab; label: string; icon: React.ElementType }[] = [
  { value: "overview", label: "Overview", icon: User },
  { value: "personal", label: "Personal Details", icon: FileText },
  { value: "professional", label: "Professional", icon: Briefcase },
  { value: "address", label: "Address", icon: MapPin },
  { value: "security", label: "Security", icon: Shield },
];

function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (v: ProfileTab) => void;
}) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto w-full scrollbar-none">
      {TABS.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`
              flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 sm:px-6 text-sm font-semibold whitespace-nowrap transition-all flex-1 min-w-[120px]
              ${
                isActive
                  ? "bg-[#0066FF] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 font-medium"
              }
            `}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Profile Component                                            */
/* ------------------------------------------------------------------ */

export function Profile() {
  const navigate = useNavigate();
  const { userDetails, userType } = useAppSelector((state) => state.auth);
  const userId = userDetails?.id;

  const { data: profileResponse, isLoading } = useGetUserDetailsQueryQuery(
    userId ? Number(userId) : 0,
    {
      skip: !userId,
    }
  );

  const { data: dropdownData } = useGetRegistrationDropdownDataQuery();
  const dropdowns = dropdownData?.data;

  const profile = profileResponse?.data;

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  // Lookup resolutions
  const qualificationsList = dropdowns?.qualifications ?? [];
  const departmentsList = dropdowns?.departments ?? [];
  const statesList = dropdowns?.states ?? [];
  const citiesList = dropdowns?.cities ?? [];

  // Resolved Display Values
  const displayName = profile?.fullName ?? userDetails?.name ?? "Purab Kanaujiya";
  const email = profile?.email ?? userDetails?.email ?? "purab.kanaujiya@gmail.com";
  const initials = displayName.slice(0, 2).toUpperCase();
  const profileImage = avatarUrl(profile?.profileImage ?? userDetails?.profilePic);

  const titleVal =
    String(profile?.title) === "1"
      ? "Mr"
      : String(profile?.title) === "2"
      ? "Mrs"
      : String(profile?.title) === "3"
      ? "Ms"
      : d(profile?.title);

  const genderVal =
    String(profile?.gender) === "1"
      ? "Male"
      : String(profile?.gender) === "2"
      ? "Female"
      : d(profile?.gender);

  const qualification = lookupName(
    profile?.qualificationId,
    qualificationsList,
    "qualification_name"
  );
  const resolvedQualification = qualification !== "—" ? qualification : "Student";

  const department = lookupName(
    profile?.departmentId,
    departmentsList,
    "department_name"
  );
  const resolvedDepartment = department !== "—" ? department : "Dispensary";

  const rawState = (profile as any)?.stateName ?? lookupName(profile?.stateId, statesList, "state_name");
  const rawCity = (profile as any)?.cityName ?? lookupName(profile?.cityId, citiesList, "city_name");

  const stateVal = rawState !== "—" && isNaN(Number(rawState)) ? rawState : "Maharashtra";
  const cityVal = rawCity !== "—" && isNaN(Number(rawCity)) ? rawCity : "Mumbai";
  const locationVal = `${cityVal}, ${stateVal}`;

  const role = userDetails?.userType ? userDetails.userType : "Medical Sewadar";
  const experience =
    d(profile?.experience) !== "—" ? `${d(profile?.experience)}` : "6.00";
  const lastSewa = d(profile?.lastSewa) !== "—" ? d(profile?.lastSewa) : "Pune";

  // Navigation
  const handleEditProfile = () => {
    if (!userId) return;
    navigate("/admin/profile/edit", { state: { userId } });
  };

  const handleChangePassword = () => {
    if (!userId) return;
    navigate(`/${userType ?? "admin"}/update-profile`, { state: { userId } });
  };

  /* ---------------------------------------------------------------- */
  /*  Profile sidebar (left column)                                   */
  /* ---------------------------------------------------------------- */

  const profileSidebar = (
    <Card className="rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden py-0 bg-white">
      {/* Cover image header */}
      <div className="relative h-[110px] w-full overflow-hidden bg-slate-100">
        <img
          src="/img/profile_cover.png"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Online badge top-right */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#059669] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
          <span className="size-2 rounded-full bg-[#10B981]" />
          Online
        </div>
      </div>

      {/* Avatar overlapping cover image */}
      <div className="-mt-14 flex flex-col items-center px-5 pb-3">
        <div className="relative">
          <Avatar className="size-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
            <AvatarImage
              src={profileImage}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-bold bg-[#E0F2FE] text-[#0066FF]">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Camera button badge */}
          <div
            onClick={handleEditProfile}
            className="absolute bottom-1 right-1 flex items-center justify-center size-7 rounded-full bg-[#0066FF] text-white shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Camera className="size-3.5" />
          </div>
        </div>

        {/* Name + role + badge */}
        <h3 className="mt-2.5 text-lg font-bold text-center text-[#0F172A] leading-tight">
          {displayName}
        </h3>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">{role}</p>

        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7] mt-2.5">
          {resolvedQualification}
        </span>

        {/* Quote */}
        <p className="mt-3.5 text-[12px] italic text-slate-500 text-center leading-relaxed px-2 font-serif">
          &ldquo;Seva is the true purpose of life.&rdquo;
        </p>
      </div>

      {/* Contact details */}
      <CardContent className="space-y-3 px-5 pb-5 pt-1">
        <Separator className="mb-3.5 bg-slate-100" />
        <div className="flex items-center gap-3 text-slate-700">
          <Mail className="size-4 text-slate-400 shrink-0" />
          <span className="text-[13px] font-medium truncate">{email}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <Phone className="size-4 text-slate-400 shrink-0" />
          <span className="text-[13px] font-medium">
            {d(profile?.mobileNo) !== "—" ? d(profile?.mobileNo) : "8692003830"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <MapPin className="size-4 text-slate-400 shrink-0" />
          <span className="text-[13px] font-medium truncate">
            {profile?.address ? d(profile?.address) : locationVal}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <Calendar className="size-4 text-slate-400 shrink-0" />
          <span className="text-[13px] font-medium">Joined Dec 22, 2025</span>
        </div>
      </CardContent>
    </Card>
  );

  /* ---------------------------------------------------------------- */
  /*  Stats bar                                                       */
  /* ---------------------------------------------------------------- */

  const statsBar = (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        icon={Calendar}
        value={d(profile?.age) !== "—" ? d(profile?.age) : "12"}
        label="Age"
        bgColor="bg-blue-50"
        iconColor="text-[#0066FF]"
      />
      <StatCard
        icon={GraduationCap}
        value={experience}
        label="Years Experience"
        bgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <StatCard
        icon={GraduationCap}
        value={resolvedQualification}
        label="Qualification"
        bgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        icon={Users}
        value={lastSewa}
        label="Previous Sewa"
        bgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Info sections                                                   */
  /* ---------------------------------------------------------------- */

  const sectionHeader = (icon: React.ElementType, title: string) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
        <Icon className="size-4 text-[#0066FF]" />
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      </div>
    );
  };

  const personalInfo = (
    <Card className="rounded-2xl border border-slate-200/90 p-5 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        {sectionHeader(User, "Personal Information")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <InfoRow label="Full Name" value={displayName} />
          <InfoRow label="Title" value={titleVal} />
          <InfoRow label="Email" value={email} />
          <InfoRow
            label="Mobile"
            value={
              d(profile?.mobileNo) !== "—" ? d(profile?.mobileNo) : "8692003830"
            }
          />
          <InfoRow
            label="Date of Birth"
            value={
              d(profile?.dateOfBirth) !== "—"
                ? d(profile?.dateOfBirth)
                : "2014-09-03"
            }
          />
          <InfoRow
            label="Age"
            value={d(profile?.age) !== "—" ? d(profile?.age) : "12"}
          />
          <InfoRow label="Gender" value={genderVal} />
        </div>
      </CardContent>
    </Card>
  );

  const professionalInfo = (
    <Card className="rounded-2xl border border-slate-200/90 p-5 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        {sectionHeader(Briefcase, "Professional Information")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <InfoRow label="Role" value={role} />
          <InfoRow label="Qualification" value={resolvedQualification} />
          <InfoRow label="Department" value={resolvedDepartment} />
          <InfoRow label="Experience" value={`${experience} Years`} />
          <InfoRow label="Previous Sewa" value={lastSewa} />
          <InfoRow
            label="Recommended By"
            value={
              d(profile?.recommendedBy) !== "—"
                ? d(profile?.recommendedBy)
                : "Pratik Ji"
            }
          />
        </div>
      </CardContent>
    </Card>
  );

  const addressInfo = (
    <Card className="rounded-2xl border border-slate-200/90 p-5 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        {sectionHeader(MapPin, "Address Information")}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_210px] gap-4 items-center">
          <div className="space-y-3 min-w-0">
            <div className="flex items-start gap-3">
              <span className="text-slate-400 text-[13px] font-medium w-[100px] sm:w-[110px] shrink-0 pt-0.5">
                Address
              </span>
              <span className="font-semibold text-[13px] text-slate-800 leading-snug break-words flex-1">
                {profile?.address
                  ? d(profile?.address)
                  : "Golden Nest, Mira Bhayandar, Thane -401107."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[13px] font-medium w-[100px] sm:w-[110px] shrink-0">
                Location
              </span>
              <span className="font-semibold text-[13px] text-slate-800 truncate flex-1">
                {locationVal}
              </span>
            </div>
          </div>
          {/* Map Image Thumbnail Card */}
          <div className="relative h-[100px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
            <img
              src="/img/map_preview.png"
              alt="Map Preview"
              className="w-full h-full object-cover"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                profile?.address ?? "Golden Nest, Mira Bhayandar, Thane"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-[#0066FF] text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md hover:bg-blue-50 transition-colors border border-blue-100"
            >
              <ExternalLink className="size-3" />
              View on Maps
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const securityInfo = (
    <Card className="rounded-2xl border border-slate-200/90 p-5 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        {sectionHeader(Shield, "Security Information")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <InfoRow label="Favorite Food" value={d(profile?.favoriteFood)} />
          <InfoRow label="Hobbies" value={d(profile?.hobbies)} />
          <InfoRow
            label="Childhood Nickname"
            value={d(profile?.childhoodNickname)}
          />
          <InfoRow label="Password" value="••••••••" />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangePassword}
            className="rounded-xl gap-1.5"
          >
            <Lock className="size-4" />
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  /* ---------------------------------------------------------------- */
  /*  Right sidebar widgets                                           */
  /* ---------------------------------------------------------------- */

  const quickActions = (
    <Card className="rounded-2xl border border-slate-200/90 p-4 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="size-4 text-[#0066FF]" />
          <h4 className="text-sm font-bold text-slate-900">Quick Actions</h4>
        </div>
        <div className="space-y-2">
          <QuickActionItem
            icon={Pencil}
            title="Edit Profile"
            description="Update your personal information"
            onClick={handleEditProfile}
            active
          />
          <QuickActionItem
            icon={Lock}
            title="Change Password"
            description="Keep your account secure"
            onClick={handleChangePassword}
          />
          <QuickActionItem
            icon={Bell}
            title="Notification Settings"
            description="Manage your preferences"
            disabled
          />
          <QuickActionItem
            icon={Download}
            title="Download Profile"
            description="Get a copy of your profile data"
            onClick={() => window.print()}
          />
        </div>
      </CardContent>
    </Card>
  );

  const motivationalBanner = (
    <Card className="rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-blue-100/40 border border-blue-100 p-4 shadow-sm py-0 relative overflow-hidden">
      <CardContent className="p-0 flex items-center gap-3.5">
        <div className="flex items-center justify-center size-12 rounded-full bg-blue-600/10 text-[#0066FF] shrink-0">
          <Heart className="size-6 text-[#0066FF]" />
        </div>
        <div>
          <p className="font-bold text-[13px] text-slate-900 leading-snug">
            Together for a Healthier Tomorrow
          </p>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            Small acts of service create a healthier, kinder world.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const accountStatusWidget = (
    <Card className="rounded-2xl border border-slate-200/90 p-4 shadow-sm bg-white py-0">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[12px] font-semibold text-slate-700">Account Status</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug mt-1">
          Your account is active and in good standing.
        </p>
      </CardContent>
    </Card>
  );

  const memberSinceWidget = (
    <Card className="rounded-2xl border border-slate-200/90 p-4 shadow-sm bg-white py-0">
      <CardContent className="p-0 flex items-start gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-blue-50 text-[#0066FF] shrink-0 mt-0.5">
          <Calendar className="size-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Member Since</p>
          <p className="text-[13px] font-bold text-slate-900 mt-0.5">Dec 22, 2025</p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Part of Medical Sewa family.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  /* ---------------------------------------------------------------- */
  /*  Overview tab content                                            */
  /* ---------------------------------------------------------------- */

  const overviewContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[270px_1fr_250px] xl:grid-cols-[280px_1fr_260px] gap-4 sm:gap-5 items-start">
      {/* Left sidebar */}
      <div className="space-y-4">{profileSidebar}</div>

      {/* Center main */}
      <div className="space-y-4 min-w-0">
        {statsBar}
        {personalInfo}
        {professionalInfo}
        {addressInfo}
      </div>

      {/* Right sidebar */}
      <div className="space-y-4 md:col-span-2 lg:col-span-1">
        {quickActions}
        {motivationalBanner}
        {accountStatusWidget}
        {memberSinceWidget}
      </div>
    </div>
  );

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
        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              View your account details and keep your information up to date.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Quote box */}
            <div className="hidden md:block rounded-xl bg-blue-50/70 border border-blue-100 px-4 py-2.5 text-right">
              <p className="text-[13px] italic text-slate-600 leading-snug font-serif">
                &ldquo;Serving with compassion for a healthier tomorrow.&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-[#0066FF] mt-0.5">
                ~ Medical Sewa 💙
              </p>
            </div>
            {/* Primary Edit button */}
            <Button
              onClick={handleEditProfile}
              disabled={!userId}
              className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl font-semibold px-5 py-2.5 shadow-sm gap-2 text-sm"
            >
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* ── Tab bar (custom pill-style, matching Figma) ──────── */}
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {/* ── Tab content ──────────────────────────────────────── */}
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {activeTab === "overview" && overviewContent}
            {activeTab === "personal" && (
              <div className="max-w-4xl">{personalInfo}</div>
            )}
            {activeTab === "professional" && (
              <div className="max-w-4xl">{professionalInfo}</div>
            )}
            {activeTab === "address" && (
              <div className="max-w-4xl">{addressInfo}</div>
            )}
            {activeTab === "security" && (
              <div className="max-w-4xl">{securityInfo}</div>
            )}
          </>
        )}
      </Main>
    </>
  );
}
