import { cn } from "@admin/lib/utils";
import { UserCheck, Stethoscope, Droplets, FileSpreadsheet, Clock } from "lucide-react";

export type RecentActivityItem = {
  id: string | number;
  title: string;
  description: string;
  timestamp: string;
  type: "registration" | "camp" | "staff" | "report" | "patient";
  badge?: string;
};

const typeConfig = {
  registration: {
    color: "#2563EB",
    bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    icon: UserCheck,
  },
  patient: {
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    icon: Stethoscope,
  },
  camp: {
    color: "#DC2626",
    bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    icon: Droplets,
  },
  staff: {
    color: "#7C3AED",
    bg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    icon: UserCheck,
  },
  report: {
    color: "#D97706",
    bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    icon: FileSpreadsheet,
  },
};

export function RecentActivityCard({
  activity,
  className,
}: {
  activity: RecentActivityItem;
  className?: string;
}) {
  const config = typeConfig[activity.type] || typeConfig.registration;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-sm dark:border-slate-800 dark:bg-card dark:hover:bg-slate-900/60",
        className
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          config.bg
        )}
      >
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {activity.title}
          </p>
          {activity.badge && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {activity.badge}
            </span>
          )}
        </div>

        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {activity.description}
        </p>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
          <Clock className="size-3" />
          <span>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
