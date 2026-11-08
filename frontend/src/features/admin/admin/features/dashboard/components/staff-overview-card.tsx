import { Card, CardContent } from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";
import { imageMap } from "@shared/config/imageMap";

export type StaffOverviewCardProps = {
  title: string;
  value: number;
  color?: string;
  image?: string;
  percentage?: number;
  className?: string;
};

export function StaffOverviewCard({
  title,
  value,
  color = "#2563EB",
  image,
  percentage,
  className,
}: StaffOverviewCardProps) {
  // Resolve image from imageMap if not directly provided
  const resolvedImage =
    image || imageMap[title] || imageMap[title.replace(/s$/, "")] || DEFAULT_PROFILE_IMAGE;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-card dark:hover:border-slate-700",
        className
      )}
    >
      {/* Top micro-color stripe */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: color }}
      />

      <CardContent className="flex items-center justify-between gap-3 p-3.5">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1 dark:bg-slate-900/50">
          <img
            src={resolvedImage}
            alt={title}
            className="size-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
            }}
          />
        </div>

        <div className="min-w-0 flex-1 text-end">
          <div
            className="text-2xl font-extrabold tracking-tight tabular-nums"
            style={{ color }}
          >
            {value.toLocaleString()}
          </div>
          <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300" title={title}>
            {title}
          </div>
          {percentage !== undefined && (
            <div className="text-[10px] text-muted-foreground">
              {percentage}% of staff
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
