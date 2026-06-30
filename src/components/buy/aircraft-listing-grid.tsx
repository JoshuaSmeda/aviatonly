import { AircraftListingCard } from "@/components/buy/aircraft-listing-card";
import type { AircraftMarketplaceListing } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";

interface AircraftListingGridProps {
  listings: AircraftMarketplaceListing[];
}

export function AircraftListingGrid({ listings }: AircraftListingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {listings.map((listing) => (
        <AircraftListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
