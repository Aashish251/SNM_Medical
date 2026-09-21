import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";

type DashboardStatCardProps = {
  label: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  color?: string;
  className?: string;
};

export function DashboardStatCard({
  label,
  value,
  change,
  icon: Icon,
  color = "var(--color-brand-primary)",
  className,
}: DashboardStatCardProps) {
  return (
    <Card className={cn("shadow-sm transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className="flex size-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}
        >
          <Icon className="size-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {change && (
          <p className="mt-1 text-xs text-muted-foreground">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}
