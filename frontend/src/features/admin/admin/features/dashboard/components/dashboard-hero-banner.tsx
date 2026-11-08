import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import {
  RotateCw,
  UserPlus,
  CalendarClock,
  Search,
  Sparkles,
  Stethoscope,
  Activity,
} from "lucide-react";
import { Button } from "@admin/components/ui/button";
import {
  ROUTE_ADMIN_DUTY_CHART,
  ROUTE_ADMIN_MASTER_SEARCH,
  ROUTE_ADMIN_PATIENTS,
  ROUTE_ADMIN_USERS,
} from "@admin/constants/routePaths";

interface DashboardHeroBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
}

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = ({
  onRefresh,
  isRefreshing = false,
  lastUpdated,
}) => {
  const { userDetails, userType } = useAppSelector((state) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = userDetails?.name || "Administrator";
  const roleName = userType === "admin" ? "Medical Administrator" : "Medical Sewadar";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const formattedTime = lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(lastUpdated))
    : new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A2540] p-6 text-white shadow-xl sm:p-7">
      {/* Ambient background glow & decorative elements */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-1/4 size-64 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-0 size-48 rounded-full bg-indigo-500/10 blur-2xl" />

      {/* Grid Pattern Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Column: Greeting, Name, Date */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-inset ring-blue-500/30 backdrop-blur-md">
              <Sparkles className="size-3.5 text-blue-300" />
              {roleName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/25">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live Sync
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            {getGreeting()},{" "}
            <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-teal-200 bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>

          <p className="flex flex-wrap items-center gap-2 text-xs text-slate-300 sm:text-sm">
            <span>{formattedDate}</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Activity className="size-3.5 text-blue-400" />
              Last updated: {formattedTime}
            </span>
          </p>
        </div>

        {/* Right Column: Quick Action buttons + Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 gap-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            <RotateCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing…" : "Refresh"}</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 gap-1.5 bg-blue-600 text-white shadow-md hover:bg-blue-500"
          >
            <Link to={ROUTE_ADMIN_USERS}>
              <UserPlus className="size-3.5" />
              <span>Add Registration</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            <Link to={ROUTE_ADMIN_DUTY_CHART}>
              <CalendarClock className="size-3.5" />
              <span className="hidden sm:inline">Duty Chart</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            <Link to={ROUTE_ADMIN_PATIENTS}>
              <Stethoscope className="size-3.5" />
              <span className="hidden sm:inline">OPD Patients</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            <Link to={ROUTE_ADMIN_MASTER_SEARCH}>
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

