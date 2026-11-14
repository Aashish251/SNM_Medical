import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import {
  RotateCw,
  UserPlus,
  Calendar,
  Users,
  Search,
  Activity,
  Zap,
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

  const rawName = userDetails?.name || "Administrator";

  // Always ensure the name ends with "Ji" without duplicating if already present
  const formatNameWithJi = (name: string) => {
    if (!name || !name.trim()) return "Sewadar Ji";
    const cleaned = name.trim().replace(/\s+ji$/i, "").trim();
    return `${cleaned} Ji`;
  };

  const displayName = formatNameWithJi(rawName);
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
        second: "numeric",
      }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-400/25 bg-gradient-to-r from-[#003882] via-[#004eab] to-[#006bd6] p-6 text-white shadow-xl shadow-blue-950/20 sm:p-7">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 size-60 -translate-y-1/2 rounded-full bg-blue-300/15 blur-3xl" />

      {/* Grid Pattern Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Medical Stethoscope & Glowing ECG Heartbeat Pulse Graphic */}
      <svg
        className="pointer-events-none absolute -bottom-2 -right-4 h-[200px] w-[340px] select-none opacity-85 sm:h-[230px] sm:w-[420px] lg:h-[250px] lg:w-[470px]"
        viewBox="0 0 480 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* ECG glow filter */}
          <filter id="ecgGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Metallic chrome gradient */}
          <linearGradient id="metalChromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="25%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          {/* Diaphragm disc gradient */}
          <radialGradient id="diaphragmGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="65%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>
          {/* Stethoscope flexible tube gradient */}
          <linearGradient id="tubeBlueGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Faint decorative medical cross symbols */}
        <path
          d="M 40 100 h 18 v -18 h 10 v 18 h 18 v 10 h -18 v 18 h -10 v -18 h -18 z"
          fill="rgba(255,255,255,0.04)"
        />
        <path
          d="M 410 40 h 14 v -14 h 8 v 14 h 14 v 8 h -14 v 14 h -8 v -14 h -14 z"
          fill="rgba(255,255,255,0.03)"
        />

        {/* Glowing ECG heartbeat trace */}
        <path
          d="M 10 185 L 60 185 L 75 185 L 85 155 L 95 215 L 105 135 L 115 205 L 125 180 L 135 185 L 200 185 L 210 165 L 220 200 L 230 185 L 340 185"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgGlowFilter)"
          opacity="0.9"
        />

        {/* Metallic Binaural Tubes & Ear Tips */}
        <path
          d="M 438 32 Q 425 15 402 24"
          stroke="#E2E8F0"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.95"
        />
        <circle cx="440" cy="34" r="4.5" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
        
        <path
          d="M 458 52 Q 445 25 422 28"
          stroke="#CBD5E1"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="460" cy="54" r="4.5" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Metallic spring arch */}
        <path
          d="M 402 24 Q 375 35 382 75 Q 387 95 408 115"
          stroke="url(#metalChromeGrad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 422 28 Q 400 40 405 78 Q 408 95 408 115"
          stroke="url(#metalChromeGrad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Rubber flexible stethoscope tubing */}
        <path
          d="M 408 115 Q 420 145 390 185 Q 370 215 345 195 Q 315 170 340 130 Q 370 90 418 110 Q 450 125 435 175 Q 420 215 375 220 L 368 220"
          stroke="url(#tubeBlueGrad)"
          strokeWidth="6.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Chestpiece connection stem */}
        <rect x="358" y="214" width="14" height="12" rx="3" fill="url(#metalChromeGrad)" />

        {/* Stethoscope Chestpiece / Metallic Bell */}
        <g transform="translate(365, 215)">
          {/* Metallic outer bezel */}
          <circle cx="0" cy="0" r="30" fill="url(#metalChromeGrad)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.45))" />
          {/* Inner ring */}
          <circle cx="0" cy="0" r="26" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Acoustic disc */}
          <circle cx="0" cy="0" r="21" fill="url(#diaphragmGrad)" />
          {/* Chrome central hub */}
          <circle cx="0" cy="0" r="8" fill="url(#metalChromeGrad)" />
          <circle cx="0" cy="0" r="4" fill="#334155" />
          {/* Subtle reflection curve */}
          <path
            d="M -14 -14 A 20 20 0 0 1 14 -14"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Column: Role & Live Sync Pills, Dhan Nirankar ji Greeting, Date & Timestamp */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-inset ring-blue-400/40 backdrop-blur-md">
              <Activity className="size-3.5 text-blue-200" />
              {roleName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/30 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live Sync
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Dhan Nirankar ji,{" "}
            <span className="bg-gradient-to-r from-blue-100 via-sky-200 to-cyan-100 bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>

          <p className="flex flex-wrap items-center gap-2 text-xs text-blue-100/90 sm:text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="size-3.5 text-sky-200" />
              {formattedDate}
            </span>
            <span className="text-blue-300/60">•</span>
            <span className="flex items-center gap-1.5 text-blue-200/90">
              <Zap className="size-3.5 text-sky-300" />
              Last updated: {formattedTime}
            </span>
          </p>
        </div>

        {/* Right Column: Action Buttons arranged in rows */}
        <div className="flex flex-col items-start gap-2.5 sm:items-end">
          {/* Top row of actions: Refresh, Add Registration, Duty Chart, OPD Patients */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-9 gap-1.5 rounded-lg border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white shadow-xs backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <RotateCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing…" : "Refresh"}</span>
            </Button>

            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-[#1877F2] px-4 text-xs font-semibold text-white shadow-md hover:bg-blue-600"
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
              className="h-9 gap-1.5 rounded-lg border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white shadow-xs backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <Link to={ROUTE_ADMIN_DUTY_CHART}>
                <Calendar className="size-3.5" />
                <span>Duty Chart</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-lg border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white shadow-xs backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <Link to={ROUTE_ADMIN_PATIENTS}>
                <Users className="size-3.5" />
                <span>OPD Patients</span>
              </Link>
            </Button>
          </div>

          {/* Bottom row: Search button */}
          <div className="flex items-center">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-lg border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white shadow-xs backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <Link to={ROUTE_ADMIN_MASTER_SEARCH}>
                <Search className="size-3.5" />
                <span>Search</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
