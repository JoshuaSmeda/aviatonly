import type {
  AircraftMarketplaceFilters,
  AircraftMarketplaceListing,
  PriceRangePreset,
  TtafRangePreset,
} from "./aircraft-marketplace-types";
import {
  getCategoryFilterLabel,
  getPriceRangeLabel,
  getSaleTypeFilterLabel,
  getTtafFilterLabel,
  isPriceFilterActive,
  PRICE_FILTER_MAX,
  PRICE_FILTER_MIN,
} from "./filter-labels";

export const DEFAULT_FILTERS: AircraftMarketplaceFilters = {
  searchTerm: "",
  country: "ALL",
  province: "ALL",
  airfield: "ALL",
  saleType: "ALL",
  priceRange: "ALL",
  minPrice: "",
  maxPrice: "",
  category: "ALL",
  registrationType: "ALL",
  make: "ALL",
  seats: "ANY",
  engineCount: "ANY",
  ttafRange: "ANY",
  maintenanceFlags: [],
  avionicsFlags: [],
  publicStatus: "ALL",
};

export const PAGE_SIZE = 9;

export const PROVINCE_OPTIONS = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export const AIRFIELD_OPTIONS = [
  "Morningstar",
  "Wonderboom",
  "Lanseria",
  "Stellenbosch",
  "Grand Central",
  "Virginia",
  "George",
  "Port Elizabeth",
];

export const MAKE_OPTIONS = [
  "Cessna",
  "Piper",
  "Beechcraft",
  "Cirrus",
  "Sling",
  "Vans",
  "Mooney",
  "Diamond",
  "Tecnam",
  "Robinson",
  "Bell",
];

export const MAINTENANCE_FLAG_OPTIONS = [
  { value: "airworthy", label: "Currently airworthy" },
  { value: "mpi_current", label: "MPI current" },
  { value: "logbooks_complete", label: "Logbooks complete" },
  { value: "hangared", label: "Hangared" },
  { value: "no_damage", label: "No known damage history" },
  { value: "inspection_available", label: "Inspection available" },
];

export const AVIONICS_FLAG_OPTIONS = [
  { value: "ifr", label: "IFR equipped" },
  { value: "autopilot", label: "Autopilot" },
  { value: "adsb", label: "ADS-B" },
  { value: "glass", label: "Glass cockpit" },
  { value: "garmin", label: "Garmin panel" },
  { value: "mode_s", label: "Mode S transponder" },
  { value: "gps", label: "GPS/NAV/COM" },
  { value: "engine_monitor", label: "Engine monitor" },
  { value: "elt", label: "ELT" },
];

function matchesPriceRange(price: number | undefined, preset: PriceRangePreset, minPrice: string, maxPrice: string): boolean {
  const min = minPrice ? Number(minPrice) : PRICE_FILTER_MIN;
  const max = maxPrice ? Number(maxPrice) : PRICE_FILTER_MAX;
  const isFullRange = preset === "ALL" && min <= PRICE_FILTER_MIN && max >= PRICE_FILTER_MAX;

  if (isFullRange) return true;
  if (price == null) return false;

  if (preset === "CUSTOM" || isPriceFilterActive({ priceRange: preset, minPrice, maxPrice })) {
    if (price < min) return false;
    if (max < PRICE_FILTER_MAX && price > max) return false;
    return true;
  }

  const ranges: Record<Exclude<PriceRangePreset, "ALL" | "CUSTOM">, [number, number | null]> = {
    UNDER_500K: [0, 500_000],
    "500K_1M": [500_000, 1_000_000],
    "1M_2_5M": [1_000_000, 2_500_000],
    "2_5M_5M": [2_500_000, 5_000_000],
    OVER_5M: [5_000_000, null],
  };

  if (preset === "ALL") return true;

  const [rangeMin, rangeMax] = ranges[preset];
  if (price < rangeMin) return false;
  if (rangeMax != null && price > rangeMax) return false;
  return true;
}

function matchesTtaf(ttaf: number | undefined, preset: TtafRangePreset): boolean {
  if (preset === "ANY" || ttaf == null) return preset === "ANY";

  const ranges: Record<Exclude<TtafRangePreset, "ANY">, [number, number | null]> = {
    UNDER_500: [0, 500],
    "500_1500": [500, 1500],
    "1500_3000": [1500, 3000],
    "3000_6000": [3000, 6000],
    OVER_6000: [6000, null],
  };

  const [min, max] = ranges[preset];
  if (ttaf < min) return false;
  if (max != null && ttaf > max) return false;
  return true;
}

function matchesSeats(seats: number | undefined, preset: AircraftMarketplaceFilters["seats"]): boolean {
  if (preset === "ANY" || seats == null) return preset === "ANY";
  switch (preset) {
    case "1_2":
      return seats <= 2;
    case "3_4":
      return seats >= 3 && seats <= 4;
    case "5_6":
      return seats >= 5 && seats <= 6;
    case "7_PLUS":
      return seats >= 7;
    default:
      return true;
  }
}

function matchesEngineCount(count: number | undefined, preset: AircraftMarketplaceFilters["engineCount"]): boolean {
  if (preset === "ANY" || count == null) return preset === "ANY";
  switch (preset) {
    case "SINGLE":
      return count === 1;
    case "TWIN":
      return count === 2;
    case "MULTI":
      return count >= 3;
    default:
      return true;
  }
}

function matchesMaintenanceFlags(listing: AircraftMarketplaceListing, flags: string[]): boolean {
  if (flags.length === 0) return true;
  const summary = `${listing.maintenanceSummary ?? ""} ${listing.highlights.join(" ")}`.toLowerCase();
  return flags.every((flag) => {
    switch (flag) {
      case "airworthy":
        return summary.includes("airworthy");
      case "mpi_current":
        return summary.includes("mpi");
      case "logbooks_complete":
        return summary.includes("logbook");
      case "hangared":
        return summary.includes("hangar");
      case "no_damage":
        return summary.includes("no known damage") || summary.includes("no damage");
      case "inspection_available":
        return summary.includes("inspection");
      default:
        return true;
    }
  });
}

function matchesAvionicsFlags(listing: AircraftMarketplaceListing, flags: string[]): boolean {
  if (flags.length === 0) return true;
  const haystack = `${listing.avionicsSummary ?? ""} ${listing.highlights.join(" ")}`.toLowerCase();
  return flags.every((flag) => {
    switch (flag) {
      case "ifr":
        return haystack.includes("ifr");
      case "autopilot":
        return haystack.includes("autopilot");
      case "adsb":
        return haystack.includes("ads-b") || haystack.includes("adsb");
      case "glass":
        return haystack.includes("glass") || haystack.includes("g1000") || haystack.includes("g3x");
      case "garmin":
        return haystack.includes("garmin");
      case "mode_s":
        return haystack.includes("mode s");
      case "gps":
        return haystack.includes("gps");
      case "engine_monitor":
        return haystack.includes("engine monitor");
      case "elt":
        return haystack.includes("elt");
      default:
        return true;
    }
  });
}

export function filterListings(
  listings: AircraftMarketplaceListing[],
  filters: AircraftMarketplaceFilters,
): AircraftMarketplaceListing[] {
  const term = filters.searchTerm.trim().toLowerCase();

  return listings.filter((listing) => {
    if (listing.publicStatus === "SOLD") return false;

    if (term) {
      const haystack = [
        listing.registration,
        listing.make,
        listing.model,
        listing.variant,
        listing.location.airfield,
        listing.location.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    if (filters.country !== "ALL" && listing.location.country !== filters.country) return false;
    if (filters.province !== "ALL" && listing.location.province !== filters.province) return false;
    if (filters.airfield !== "ALL" && listing.location.airfield !== filters.airfield) return false;
    if (filters.saleType !== "ALL" && listing.saleType !== filters.saleType) return false;
    if (filters.category !== "ALL" && listing.category !== filters.category) return false;
    if (filters.registrationType !== "ALL" && listing.registrationType !== filters.registrationType) return false;
    if (filters.make !== "ALL" && listing.make !== filters.make) return false;
    if (filters.publicStatus !== "ALL" && listing.publicStatus !== filters.publicStatus) return false;

    if (!matchesPriceRange(listing.price, filters.priceRange, filters.minPrice, filters.maxPrice)) {
      return false;
    }
    if (!matchesTtaf(listing.totalTimeAirframe, filters.ttafRange)) return false;
    if (!matchesSeats(listing.seats, filters.seats)) return false;
    if (!matchesEngineCount(listing.engineCount, filters.engineCount)) return false;
    if (!matchesMaintenanceFlags(listing, filters.maintenanceFlags)) return false;
    if (!matchesAvionicsFlags(listing, filters.avionicsFlags)) return false;

    return true;
  });
}

export function getActiveFilterChips(filters: AircraftMarketplaceFilters): Array<{
  key: keyof AircraftMarketplaceFilters | string;
  label: string;
  value?: string;
}> {
  const chips: Array<{ key: keyof AircraftMarketplaceFilters | string; label: string; value?: string }> = [];

  if (filters.searchTerm.trim()) {
    chips.push({ key: "searchTerm", label: `"${filters.searchTerm.trim()}"` });
  }
  if (filters.province !== "ALL") chips.push({ key: "province", label: filters.province });
  if (filters.airfield !== "ALL") chips.push({ key: "airfield", label: filters.airfield });
  if (filters.category !== "ALL") {
    chips.push({
      key: "category",
      label: getCategoryFilterLabel(filters.category),
      value: filters.category,
    });
  }
  if (filters.saleType !== "ALL") {
    chips.push({
      key: "saleType",
      label: getSaleTypeFilterLabel(filters.saleType),
      value: filters.saleType,
    });
  }
  if (filters.make !== "ALL") chips.push({ key: "make", label: filters.make });
  if (isPriceFilterActive(filters)) {
    chips.push({ key: "priceRange", label: getPriceRangeLabel(filters), value: "CUSTOM" });
  }
  if (filters.ttafRange !== "ANY") {
    chips.push({
      key: "ttafRange",
      label: getTtafFilterLabel(filters.ttafRange),
      value: filters.ttafRange,
    });
  }
  if (filters.registrationType !== "ALL") {
    chips.push({ key: "registrationType", label: filters.registrationType, value: filters.registrationType });
  }

  filters.maintenanceFlags.forEach((flag) => {
    const option = MAINTENANCE_FLAG_OPTIONS.find((item) => item.value === flag);
    chips.push({ key: `maintenance:${flag}`, label: option?.label ?? flag });
  });

  filters.avionicsFlags.forEach((flag) => {
    const option = AVIONICS_FLAG_OPTIONS.find((item) => item.value === flag);
    chips.push({ key: `avionics:${flag}`, label: option?.label ?? flag });
  });

  return chips;
}

export function removeFilterChip(
  filters: AircraftMarketplaceFilters,
  chipKey: keyof AircraftMarketplaceFilters | string,
): AircraftMarketplaceFilters {
  const next = { ...filters };

  if (chipKey.startsWith("maintenance:")) {
    const flag = chipKey.replace("maintenance:", "");
    next.maintenanceFlags = next.maintenanceFlags.filter((item) => item !== flag);
    return next;
  }
  if (chipKey.startsWith("avionics:")) {
    const flag = chipKey.replace("avionics:", "");
    next.avionicsFlags = next.avionicsFlags.filter((item) => item !== flag);
    return next;
  }

  switch (chipKey) {
    case "searchTerm":
      next.searchTerm = "";
      break;
    case "province":
      next.province = "ALL";
      break;
    case "airfield":
      next.airfield = "ALL";
      break;
    case "category":
      next.category = "ALL";
      break;
    case "saleType":
      next.saleType = "ALL";
      break;
    case "make":
      next.make = "ALL";
      break;
    case "priceRange":
      next.priceRange = "ALL";
      next.minPrice = "";
      next.maxPrice = "";
      break;
    case "ttafRange":
      next.ttafRange = "ANY";
      break;
    case "registrationType":
      next.registrationType = "ALL";
      break;
    default:
      break;
  }

  return next;
}
