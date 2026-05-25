import { useMemo, useState } from "react";
import { Search, ShieldCheck, SlidersHorizontal, HeartPulse } from "lucide-react";
import { SectionHeading } from "@shared/components/SectionHeading";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { CampCard, CampDetailsDialog, DonationRegistrationDialog, FilterDialog } from "./components";
import {
  BLOOD_DONATION_HERO_BADGE,
  BLOOD_DONATION_HERO_SUBTITLE,
  BLOOD_DONATION_HERO_TITLE,
  MOCK_BLOOD_CAMPS,
} from "./config";
import type { BloodDonationCamp, BloodDonationFilters } from "./types";

const INITIAL_FILTERS: BloodDonationFilters = {
  city: "all",
  donationType: "all",
};

export default function BloodDonationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BloodDonationFilters>(INITIAL_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<BloodDonationCamp | null>(null);

  const filteredCamps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MOCK_BLOOD_CAMPS.filter((camp) => {
      if (query) {
        const searchable = [
          camp.title,
          camp.shortDescription,
          camp.fullAddress,
          camp.landmark,
          camp.organizerName,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) {
          return false;
        }
      }

      if (filters.donationType !== "all" && camp.entryType !== filters.donationType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const openCampDetails = (camp: BloodDonationCamp) => {
    setSelectedCamp(camp);
    setDetailsModalOpen(true);
  };

  const openDonationForm = (camp: BloodDonationCamp) => {
    setSelectedCamp(camp);
    setDonationModalOpen(true);
  };

  return (
    <div className="flex w-full flex-col pb-16">
      <section
        className="relative overflow-hidden bg-to-right-theme-gradient pb-16 pt-[120px] text-white md:pt-[104px]"
        aria-labelledby="blood-donation-hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <svg
            className="absolute -right-24 top-0 h-72 w-72 text-white"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden
          >
            <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
            <HeartPulse className="size-4" aria-hidden />
            {BLOOD_DONATION_HERO_BADGE}
          </span>
          <h1
            id="blood-donation-hero-heading"
            className="max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            {BLOOD_DONATION_HERO_TITLE}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
            {BLOOD_DONATION_HERO_SUBTITLE}
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-10 w-full max-w-full px-4 sm:px-6 lg:px-8">
        <div className="grid">
          <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-md">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Search camps</p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">Find a blood donation camp near you</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Search by city, blood group, organizer, or location and discover camp details in one view.
                </p>
              </div>
              
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Label htmlFor="blood-donation-search" className="sr-only">
                  Search camps
                </Label>
                <Input
                  id="blood-donation-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by city, blood group, organizer…"
                  className="pl-12"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
              </div>
              <Button variant="outline" className="h-11 px-5" onClick={() => setFilterModalOpen(true)}>
                <SlidersHorizontal className="size-4" aria-hidden />
                Filter
              </Button>
            </div>
          </Card>

          
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCamps.map((camp) => (
            <CampCard key={camp.id} camp={camp} onViewDetails={openCampDetails} onRegister={openDonationForm} />
          ))}
        </div>

      </div>

     
      <FilterDialog
        open={filterModalOpen}
        filters={filters}
        onOpenChange={setFilterModalOpen}
        onApply={(updatedFilters) => {
          setFilters(updatedFilters);
          setFilterModalOpen(false);
        }}
        onReset={() => {
          setFilters(INITIAL_FILTERS);
          setFilterModalOpen(false);
        }}
      />
      <CampDetailsDialog
        open={detailsModalOpen}
        camp={selectedCamp}
        onOpenChange={setDetailsModalOpen}
        onRegister={(camp) => {
          setDetailsModalOpen(false);
          openDonationForm(camp);
        }}
      />
      <DonationRegistrationDialog
        open={donationModalOpen}
        camp={selectedCamp}
        onOpenChange={setDonationModalOpen}
      />
    </div>
  );
}
