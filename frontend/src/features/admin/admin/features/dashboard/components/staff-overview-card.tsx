import { Card, CardContent } from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";

type StaffOverviewCardProps = {
  title: string;
  value: number;
  color: string;
  image: string;
  className?: string;
};

export function StaffOverviewCard({
  title,
  value,
  color,
  image,
  className,
}: StaffOverviewCardProps) {
  return (
    <Card
      className={cn(
        "shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <CardContent className="flex items-center justify-between gap-2 p-3">
        <img
          src={image}
          alt={title}
          className="size-12 shrink-0 object-contain"
        />
        <div className="min-w-0 text-end">
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color }}
          >
            {value.toLocaleString()}
          </div>
          <div className="truncate text-xs text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
