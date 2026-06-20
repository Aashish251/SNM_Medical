import { Calendar, Clock, MapPin, UserPlus, CalendarCheck } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@shared/components/ui/card";
import type { Camp, CampListingLabels } from "../model/types";

type CampCardProps = {
  camp: Camp;
  labels: CampListingLabels;
  onViewDetails: (camp: Camp) => void;
  onRegister: (camp: Camp) => void;
};

export function CampCard({ camp, labels, onViewDetails, onRegister }: CampCardProps) {
  const actionLabel =
    camp.entryType === "walk-in" ? labels.walkInAction : labels.appointmentAction;
  const city = camp.fullAddress.split(",").pop()?.trim() || "Location";

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/80 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-4 p-5 pb-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-foreground md:text-xl">
              {camp.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {camp.shortDescription}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary flex-shrink-0" aria-hidden />
            <span className="line-clamp-1">{city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary flex-shrink-0" aria-hidden />
            <span>{camp.driveDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary flex-shrink-0" aria-hidden />
            <span>{`${camp.startTime} – ${camp.endTime}`}</span>
          </div>
          <div className="flex items-center gap-2">
            {camp.entryType === "walk-in" ? (
              <UserPlus className="size-4 text-primary flex-shrink-0" aria-hidden />
            ) : (
              <CalendarCheck className="size-4 text-primary flex-shrink-0" aria-hidden />
            )}
            <span className="text-xs font-semibold text-foreground">
              {camp.entryType === "walk-in" ? "Walk-in allowed" : "Appointment required"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid gap-3 p-5 pt-0">
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl font-semibold"
          onClick={() => onViewDetails(camp)}
        >
          See More Details
        </Button>
        <Button
          className="h-11 w-full rounded-xl font-semibold bg-to-two-right-theme-gradient to-yellow-200 shadow-md text-white font-bold text-base transition-transform duration-300"
          onClick={() => onRegister(camp)}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
