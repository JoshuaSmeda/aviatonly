import type {
  AircraftCategory,
  AircraftMarketplaceDetail,
  AircraftMarketplaceFilters,
  AircraftMarketplaceListing,
  AircraftSaleType,
  PublicAircraftStatus,
  RegistrationType,
  SortOption,
} from "./aircraft-marketplace-types";

const CATEGORY_LABELS: Record<AircraftCategory, string> = {
  SINGLE_ENGINE_PISTON: "Single Engine Piston",
  MULTI_ENGINE_PISTON: "Multi Engine Piston",
  TURBOPROP: "Turboprop",
  JET: "Jet",
  HELICOPTER: "Helicopter",
  LIGHT_SPORT: "Light Sport Aircraft",
  EXPERIMENTAL_NTCA: "Experimental / NTCA",
  GLIDER: "Glider",
  MICROLIGHT: "Microlight",
};

const SALE_TYPE_LABELS: Record<AircraftSaleType, string> = {
  FIXED_PRICE: "Fixed Price",
  AUCTION: "Auction",
  MAKE_OFFER: "Make Offer",
  PRICE_ON_APPLICATION: "Price on Application",
};

const STATUS_LABELS: Record<PublicAircraftStatus, string> = {
  AVAILABLE: "Available",
  NEW_LISTING: "New Listing",
  UNDER_OFFER: "Under Offer",
  AUCTION_LIVE: "Auction Live",
  AUCTION_SCHEDULED: "Auction Scheduled",
  SOLD: "Sold",
};

export function getCategoryLabel(category: AircraftCategory): string {
  return CATEGORY_LABELS[category];
}

export function getSaleTypeLabel(saleType: AircraftSaleType): string {
  return SALE_TYPE_LABELS[saleType];
}

export function getPublicStatusLabel(status: PublicAircraftStatus): string {
  return STATUS_LABELS[status];
}

export function formatAircraftTitle(listing: Pick<AircraftMarketplaceListing, "year" | "make" | "model" | "variant">): string {
  const base = `${listing.year} ${listing.make} ${listing.model}`;
  return listing.variant ? `${base} ${listing.variant}` : base;
}

export function formatLocation(listing: Pick<AircraftMarketplaceListing, "location">): string {
  const parts = [
    listing.location.airfield,
    listing.location.province,
    listing.location.country,
  ].filter(Boolean);
  return parts.join(", ");
}

/** Search query for map embeds and external Google Maps links. */
export function getListingMapQuery(
  listing: Pick<AircraftMarketplaceListing, "location">,
): string {
  const airfield = listing.location.airfield?.trim();
  if (airfield) {
    return [airfield, listing.location.province, listing.location.country]
      .filter(Boolean)
      .join(", ");
  }

  return formatLocation(listing);
}

export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Embeddable map URL. Works without an API key via Google's query embed.
 * Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY for the official Maps Embed API in production.
 */
export function getGoogleMapsEmbedUrl(query: string): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`;
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
}

export function formatCurrency(
  amount: number,
  currency: AircraftMarketplaceListing["currency"] = "ZAR",
): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceDisplay(listing: AircraftMarketplaceListing): string {
  if (listing.saleType === "PRICE_ON_APPLICATION") {
    return listing.priceLabel ?? "Price on application";
  }
  if (listing.saleType === "MAKE_OFFER") {
    return listing.priceLabel ?? "Make an offer";
  }
  if (listing.saleType === "AUCTION" && listing.auction) {
    const amount =
      listing.auction.currentBid != null && listing.auction.currentBid > 0
        ? listing.auction.currentBid
        : listing.auction.openingBid;
    const prefix =
      listing.auction.currentBid != null && listing.auction.currentBid > 0
        ? "Current bid"
        : "Opening bid";
    return `${prefix} ${formatCurrency(amount, listing.currency)}`;
  }
  if (listing.price != null) {
    return formatCurrency(listing.price, listing.currency);
  }
  return listing.priceLabel ?? "Contact for price";
}

export function formatHours(hours?: number): string {
  if (hours == null) return "—";
  return `${hours.toLocaleString("en-ZA")} hrs`;
}

export function formatCompactHours(hours?: number, label = "TTAF"): string {
  if (hours == null) return "";
  return `${hours.toLocaleString("en-ZA")} ${label}`;
}

export function buildListingStatsLine(listing: AircraftMarketplaceListing): string {
  const parts: string[] = [];
  if (listing.totalTimeAirframe != null) {
    parts.push(formatCompactHours(listing.totalTimeAirframe, "TTAF"));
  }
  if (listing.engineTime != null) {
    parts.push(formatCompactHours(listing.engineTime, listing.engineTimeLabel ?? "SMOH"));
  }
  if (listing.seats != null) {
    parts.push(`${listing.seats} Seats`);
  }
  if (listing.avionicsSummary) {
    parts.push(listing.avionicsSummary);
  }
  return parts.join(" · ");
}

export function sortListings(
  listings: AircraftMarketplaceListing[],
  sort: SortOption,
): AircraftMarketplaceListing[] {
  const copy = [...listings];
  switch (sort) {
    case "PRICE_ASC":
      return copy.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    case "PRICE_DESC":
      return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "TTAF_ASC":
      return copy.sort(
        (a, b) => (a.totalTimeAirframe ?? Number.MAX_SAFE_INTEGER) - (b.totalTimeAirframe ?? Number.MAX_SAFE_INTEGER),
      );
    case "YEAR_DESC":
      return copy.sort((a, b) => b.year - a.year);
    case "UPDATED":
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case "AUCTION_ENDING":
      return copy.sort((a, b) => {
        const aEnd = a.auction?.effectiveEndsAt
          ? new Date(a.auction.effectiveEndsAt).getTime()
          : Number.MAX_SAFE_INTEGER;
        const bEnd = b.auction?.effectiveEndsAt
          ? new Date(b.auction.effectiveEndsAt).getTime()
          : Number.MAX_SAFE_INTEGER;
        return aEnd - bEnd;
      });
    case "NEWEST":
    default:
      return copy.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
  }
}

export function paginateListings<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getSimilarListings(
  listing: AircraftMarketplaceDetail,
  allListings: AircraftMarketplaceListing[],
  limit = 4,
): AircraftMarketplaceListing[] {
  return allListings
    .filter((item) => item.id !== listing.id && item.publicStatus !== "SOLD")
    .map((item) => {
      let score = 0;
      if (item.category === listing.category) score += 3;
      if (item.make === listing.make) score += 2;
      if (item.location.province === listing.location.province) score += 1;
      if (
        listing.price &&
        item.price &&
        Math.abs(item.price - listing.price) / listing.price < 0.35
      ) {
        score += 2;
      }
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getListingDetailHref(slug: string): string {
  return `/dashboard/buy/${slug}`;
}

export function getFilterLabel(
  key: keyof AircraftMarketplaceFilters,
  value: string,
): string | null {
  if (!value || value === "ALL" || value === "ANY" || value === "") return null;

  switch (key) {
    case "category":
      return getCategoryLabel(value as AircraftCategory);
    case "saleType":
      return getSaleTypeLabel(value as AircraftSaleType);
    case "publicStatus":
      return getPublicStatusLabel(value as PublicAircraftStatus);
    case "registrationType":
      return value === "FOREIGN" ? "Foreign Registered" : value;
    case "priceRange":
      return (
        {
          UNDER_500K: "Under R500k",
          "500K_1M": "R500k – R1m",
          "1M_2_5M": "R1m – R2.5m",
          "2_5M_5M": "R2.5m – R5m",
          OVER_5M: "More than R5m",
          CUSTOM: "Custom price",
        }[value] ?? value
      );
    case "ttafRange":
      return (
        {
          UNDER_500: "Under 500 TTAF",
          "500_1500": "500 – 1,500 TTAF",
          "1500_3000": "1,500 – 3,000 TTAF",
          "3000_6000": "3,000 – 6,000 TTAF",
          OVER_6000: "Over 6,000 TTAF",
        }[value] ?? value
      );
    case "seats":
      return (
        {
          "1_2": "1–2 seats",
          "3_4": "3–4 seats",
          "5_6": "5–6 seats",
          "7_PLUS": "7+ seats",
        }[value] ?? value
      );
    case "engineCount":
      return value.charAt(0) + value.slice(1).toLowerCase();
    default:
      return value;
  }
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "NEWEST", label: "Newest listed" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "TTAF_ASC", label: "Total time: Low to High" },
  { value: "YEAR_DESC", label: "Year: Newest First" },
  { value: "UPDATED", label: "Recently updated" },
  { value: "AUCTION_ENDING", label: "Auction ending soon" },
];
