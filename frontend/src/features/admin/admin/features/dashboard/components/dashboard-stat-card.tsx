import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export type DashboardStatCardProps = {
  label: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  className?: string;
};

export function DashboardStatCard({
  label,
  value,
  change,
  icon: Icon,
  color = "#2563EB",
  badge,
  trend,
  description,
  className,
}: DashboardStatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-card dark:hover:border-slate-700",
        className
      )}
    >
      {/* Top subtle highlight gradient bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 40%, transparent))`,
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Icon Container with soft background */}
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
            color: color,
          }}
        >
          <Icon className="size-6" style={{ color }} />
        </div>
      </div>

      {/* Footer / Change note */}
      {(change || description) && (
        <div className="mt-3.5 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-muted-foreground dark:border-slate-800">
          {trend === "up" && (
            <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="me-1 size-3.5" />
            </span>
          )}
          <span>{change || description}</span>
        </div>
      )}
    </Card>
  );
}
