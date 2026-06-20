import { Search, ShieldCheck, SlidersHorizontal, HeartPulse } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { useCampListing } from "./hooks/useCampListing";
import type { CampListingConfig } from "./model/types";
import {
  CampCard,
  CampDetailsDialog,
  CampRegistrationDialog,
  EligibilityDialog,
  FilterDialog,
} from "./ui";

type CampListingWidgetProps = {
  config: CampListingConfig;
};

export function CampListingWidget({ config }: CampListingWidgetProps) {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filterModalOpen,
    setFilterModalOpen,
    eligibilityModalOpen,
    setEligibilityModalOpen,
    detailsModalOpen,
    setDetailsModalOpen,
    registrationModalOpen,
    setRegistrationModalOpen,
    selectedCamp,
    filteredCamps,
    openCampDetails,
    openRegistrationForm,
    resetFilters,
  } = useCampListing(config.camps);

  return (
    <div className="flex w-full flex-col pb-16">
      <section
        className="relative overflow-hidden bg-to-right-theme-gradient pb-16 pt-[120px] text-white md:pt-[104px]"
        aria-labelledby={config.heroHeadingId}
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
            {config.heroBadge}
          </span>
          <h1
            id={config.heroHeadingId}
            className="max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            {config.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
            {config.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-10 w-full max-w-full px-4 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Search camps
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                {config.searchTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {config.searchDescription}
              </p>
            </div>
            {config.showEligibilityCheck && (
              <div className="flex flex-col gap-3 sm:items-end">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setEligibilityModalOpen(true)}
                >
                  <ShieldCheck className="size-4" aria-hidden />
                  Check Eligibility
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Label htmlFor={config.searchInputId} className="sr-only">
                Search camps
              </Label>
              <Input
                id={config.searchInputId}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={config.searchPlaceholder}
                className="pl-12"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
            </div>
            <Button
              variant="outline"
              type="button"
              className="h-11 px-5"
              onClick={() => setFilterModalOpen(true)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filter
            </Button>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCamps.map((camp) => (
            <CampCard
              key={camp.id}
              camp={camp}
              labels={config.labels}
              onViewDetails={openCampDetails}
              onRegister={openRegistrationForm}
            />
          ))}
        </div>
      </div>

      {config.showEligibilityCheck && (
        <EligibilityDialog
          open={eligibilityModalOpen}
          onOpenChange={setEligibilityModalOpen}
        />
      )}
      <FilterDialog
        open={filterModalOpen}
        filters={filters}
        filterCities={config.filterCities}
        filterDescription={config.labels.filterDescription}
        onOpenChange={setFilterModalOpen}
        onApply={(updatedFilters) => {
          setFilters(updatedFilters);
          setFilterModalOpen(false);
        }}
        onReset={() => {
          resetFilters();
          setFilterModalOpen(false);
        }}
      />
      <CampDetailsDialog
        open={detailsModalOpen}
        camp={selectedCamp}
        labels={config.labels}
        onOpenChange={setDetailsModalOpen}
        onRegister={(camp) => {
          setDetailsModalOpen(false);
          openRegistrationForm(camp);
        }}
      />
      <CampRegistrationDialog
        open={registrationModalOpen}
        camp={selectedCamp}
        labels={config.labels}
        onOpenChange={setRegistrationModalOpen}
      />
    </div>
  );
}

export default CampListingWidget;
