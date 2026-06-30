import { AircraftListingGrid } from "@/components/buy/aircraft-listing-grid";
import type { AircraftMarketplaceListing } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";

interface SimilarAircraftSectionProps {
  listings: AircraftMarketplaceListing[];
}

export function SimilarAircraftSection({ listings }: SimilarAircraftSectionProps) {
  if (listings.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-none lg:p-6">
      <h2 className="mb-4 text-lg font-semibold">Similar aircraft</h2>
      <AircraftListingGrid listings={listings} />
    </section>
  );
}
