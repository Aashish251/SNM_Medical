import { useMemo } from "react";
import { CampListingWidget } from "@widgets/camp-listing";
import { usePublishedCamps } from "@entities/camp";
import { BLOOD_DONATION_LISTING_CONFIG } from "./listingConfig";

export default function BloodDonationPage() {
  const camps = usePublishedCamps("blood-donation");
  const config = useMemo(
    () => ({ ...BLOOD_DONATION_LISTING_CONFIG, camps }),
    [camps]
  );

  return <CampListingWidget config={config} />;
}
