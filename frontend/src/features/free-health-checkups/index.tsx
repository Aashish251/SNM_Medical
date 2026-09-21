import { useMemo } from "react";
import { CampListingWidget } from "@widgets/camp-listing";
import { usePublishedCamps } from "@entities/camp";
import { HEALTH_CHECKUP_LISTING_CONFIG } from "./listingConfig";

export default function FreeHealthCheckupsPage() {
  const camps = usePublishedCamps("health-checkup");
  const config = useMemo(
    () => ({ ...HEALTH_CHECKUP_LISTING_CONFIG, camps }),
    [camps]
  );

  return <CampListingWidget config={config} />;
}
