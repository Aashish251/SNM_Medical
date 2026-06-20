import { cn } from "@admin-panel/lib/utils";
import type { RecentActivity } from "../data/dashboard-data";

const typeColors: Record<RecentActivity["type"], string> = {
  registration: "var(--color-brand-primary)",
  camp: "#EF4444",
  staff: "var(--color-brand-secondary)",
  report: "#16A34A",
};

type RecentActivityCardProps = {
  activity: RecentActivity;
  className?: string;
};

export function RecentActivityCard({
  activity,
  className,
}: RecentActivityCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40",
        className
      )}
    >
      <div
        className="mt-1 size-2 shrink-0 rounded-full"
        style={{ backgroundColor: typeColors[activity.type] }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {activity.description}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground/80">
          {activity.timestamp}
        </p>
      </div>
    </div>
  );
}
