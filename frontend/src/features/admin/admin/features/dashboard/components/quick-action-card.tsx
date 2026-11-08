import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";

export type QuickActionCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  color?: string;
  className?: string;
};

export function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  color = "#2563EB",
  className,
}: QuickActionCardProps) {
  return (
    <Link to={href} className={cn("group block focus-visible:outline-hidden", className)}>
      <Card className="h-full rounded-xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-card dark:hover:border-slate-700">
        <CardContent className="flex items-start gap-3.5 p-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
              color: color,
            }}
          >
            <Icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                  {title}
                </p>
                {badge && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                    {badge}
                  </span>
                )}
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
