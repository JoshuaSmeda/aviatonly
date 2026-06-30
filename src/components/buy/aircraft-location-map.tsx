import type { AircraftMarketplaceListing } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatLocation,
  getGoogleMapsEmbedUrl,
  getListingMapQuery,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { cn } from "@/lib/utils";

interface AircraftLocationMapProps {
  listing: Pick<AircraftMarketplaceListing, "location">;
  className?: string;
}

const detailCardClass =
  "overflow-hidden rounded-xl border border-border bg-card shadow-none";

export function AircraftLocationMap({ listing, className }: AircraftLocationMapProps) {
  const mapQuery = getListingMapQuery(listing);
  if (!mapQuery) return null;

  const embedUrl = getGoogleMapsEmbedUrl(mapQuery);
  const locationLabel = formatLocation(listing);

  return (
    <section className={cn(detailCardClass, className)}>
      <div className="relative aspect-[21/9] min-h-[220px] w-full bg-muted sm:min-h-[280px]">
        <iframe
          title={`Map showing ${locationLabel}`}
          src={embedUrl}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
