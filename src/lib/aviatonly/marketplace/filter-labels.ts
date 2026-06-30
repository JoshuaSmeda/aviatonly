import type {
  AircraftCategory,
  AircraftMarketplaceFilters,
  AircraftSaleType,
  PriceRangePreset,
  PublicAircraftStatus,
  RegistrationType,
  SortOption,
  TtafRangePreset,
} from "./aircraft-marketplace-types";

export const PRICE_FILTER_MIN = 0;
export const PRICE_FILTER_MAX = 10_000_000;
export const PRICE_FILTER_STEP = 250_000;

const SALE_TYPE_LABELS: Record<AircraftSaleType | "ALL", string> = {
  ALL: "All sale types",
  FIXED_PRICE: "Fixed price",
  AUCTION: "Auction",
  MAKE_OFFER: "Make offer",
  PRICE_ON_APPLICATION: "Price on application",
};

const CATEGORY_LABELS: Record<AircraftCategory | "ALL", string> = {
  ALL: "All categories",
  SINGLE_ENGINE_PISTON: "Single engine piston",
  MULTI_ENGINE_PISTON: "Multi engine piston",
  TURBOPROP: "Turboprop",
  JET: "Jet",
  HELICOPTER: "Helicopter",
  LIGHT_SPORT: "Light sport aircraft",
  EXPERIMENTAL_NTCA: "Experimental / NTCA",
  GLIDER: "Glider",
  MICROLIGHT: "Microlight",
};

const TTAF_LABELS: Record<TtafRangePreset, string> = {
  ANY: "Any total time",
  UNDER_500: "Under 500 hours",
  "500_1500": "500 – 1,500 hours",
  "1500_3000": "1,500 – 3,000 hours",
  "3000_6000": "3,000 – 6,000 hours",
  OVER_6000: "Over 6,000 hours",
};

const PRICE_PRESET_LABELS: Record<PriceRangePreset, string> = {
  ALL: "Any price",
  UNDER_500K: "Under R500k",
  "500K_1M": "R500k – R1m",
  "1M_2_5M": "R1m – R2.5m",
  "2_5M_5M": "R2.5m – R5m",
  OVER_5M: "Over R5m",
  CUSTOM: "Custom price range",
};

const SORT_LABELS: Record<SortOption, string> = {
  NEWEST: "Newest listed",
  PRICE_ASC: "Price: low to high",
  PRICE_DESC: "Price: high to low",
  TTAF_ASC: "Total time: low to high",
  YEAR_DESC: "Year: newest first",
  UPDATED: "Recently updated",
  AUCTION_ENDING: "Auction ending soon",
};

export function getProvinceLabel(value: string): string {
  return value === "ALL" ? "All provinces" : value;
}

export function getAirfieldLabel(value: string): string {
  return value === "ALL" ? "All airfields" : value;
}

export function getMakeLabel(value: string): string {
  return value === "ALL" ? "All makes" : value;
}

export function getSaleTypeFilterLabel(value: AircraftMarketplaceFilters["saleType"]): string {
  return SALE_TYPE_LABELS[value];
}

export function getCategoryFilterLabel(value: AircraftMarketplaceFilters["category"]): string {
  return CATEGORY_LABELS[value];
}

export function getTtafFilterLabel(value: AircraftMarketplaceFilters["ttafRange"]): string {
  return TTAF_LABELS[value];
}

export function getPricePresetLabel(value: PriceRangePreset): string {
  return PRICE_PRESET_LABELS[value];
}

export function getSortLabel(value: SortOption): string {
  return SORT_LABELS[value];
}

export function formatPriceFilterAmount(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return millions % 1 === 0 ? `R${millions}m` : `R${millions.toFixed(1)}m`;
  }
  if (amount >= 1_000) {
    return `R${Math.round(amount / 1_000)}k`;
  }
  return `R${amount.toLocaleString("en-ZA")}`;
}

export function getPriceRangeLabel(filters: Pick<AircraftMarketplaceFilters, "priceRange" | "minPrice" | "maxPrice">): string {
  if (filters.priceRange === "ALL" || (!filters.minPrice && !filters.maxPrice)) {
    return "Any price";
  }
  if (filters.priceRange !== "CUSTOM") {
    return getPricePresetLabel(filters.priceRange);
  }
  const min = filters.minPrice ? Number(filters.minPrice) : PRICE_FILTER_MIN;
  const max = filters.maxPrice ? Number(filters.maxPrice) : PRICE_FILTER_MAX;
  return `${formatPriceFilterAmount(min)} – ${formatPriceFilterAmount(max)}`;
}

export function isPriceFilterActive(filters: Pick<AircraftMarketplaceFilters, "priceRange" | "minPrice" | "maxPrice">): boolean {
  if (filters.priceRange !== "ALL" && filters.priceRange !== "CUSTOM") return true;
  const min = filters.minPrice ? Number(filters.minPrice) : PRICE_FILTER_MIN;
  const max = filters.maxPrice ? Number(filters.maxPrice) : PRICE_FILTER_MAX;
  return min > PRICE_FILTER_MIN || max < PRICE_FILTER_MAX;
}

export function getRegistrationTypeLabel(value: RegistrationType | "ALL"): string {
  if (value === "ALL") return "All registration types";
  if (value === "FOREIGN") return "Foreign registered";
  return value;
}

export function getPublicStatusFilterLabel(value: PublicAircraftStatus | "ALL"): string {
  if (value === "ALL") return "All statuses";
  const labels: Record<PublicAircraftStatus, string> = {
    AVAILABLE: "Available",
    NEW_LISTING: "New listing",
    UNDER_OFFER: "Under offer",
    AUCTION_LIVE: "Auction live",
    AUCTION_SCHEDULED: "Auction scheduled",
    SOLD: "Sold",
  };
  return labels[value];
}
