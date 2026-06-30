export type AircraftSaleType =
  | "FIXED_PRICE"
  | "AUCTION"
  | "MAKE_OFFER"
  | "PRICE_ON_APPLICATION";

export type PublicAircraftStatus =
  | "AVAILABLE"
  | "NEW_LISTING"
  | "UNDER_OFFER"
  | "AUCTION_LIVE"
  | "AUCTION_SCHEDULED"
  | "SOLD";

export type AircraftCategory =
  | "SINGLE_ENGINE_PISTON"
  | "MULTI_ENGINE_PISTON"
  | "TURBOPROP"
  | "JET"
  | "HELICOPTER"
  | "LIGHT_SPORT"
  | "EXPERIMENTAL_NTCA"
  | "GLIDER"
  | "MICROLIGHT";

export type RegistrationType = "ZS" | "ZU" | "FOREIGN";

export type AircraftListingImage = {
  id: string;
  url: string;
  alt: string;
  slotKey?: string;
  isPrimary?: boolean;
};

export type PublicAuctionCardPhase = "SCHEDULED" | "LIVE" | "ENDED";

export type PublicReserveCardStatus = "MET" | "NOT_MET" | "HIDDEN";

export type AuctionCardCtaKind = "VIEW_AUCTION" | "REGISTER_TO_BID" | "PLACE_BID";

/** Public-safe auction summary for catalog cards — never includes reserve price. */
export type MarketplaceAuctionSummary = {
  auctionId?: string;
  phase: PublicAuctionCardPhase;
  openingBid: number;
  currentBid?: number | null;
  bidCount: number;
  startsAt: string;
  effectiveEndsAt: string;
  showReserveStatus: boolean;
  /** Present only when `showReserveStatus` is true. */
  reserveMet?: boolean | null;
  biddingOpen?: boolean;
  /** Optional — set when viewer session is known (detail page / server render). */
  viewerIsRegistered?: boolean;
  viewerCanBid?: boolean;
};

export type AircraftMarketplaceListing = {
  id: string;
  slug: string;
  registration: string;
  year: number;
  make: string;
  model: string;
  variant?: string;
  category: AircraftCategory;
  saleType: AircraftSaleType;
  publicStatus: PublicAircraftStatus;
  price?: number;
  currency: "ZAR" | "USD" | "EUR";
  priceLabel?: string;
  location: {
    airfield?: string;
    province?: string;
    country: string;
  };
  totalTimeAirframe?: number;
  engineTime?: number;
  engineTimeLabel?: string;
  seats?: number;
  engineCount?: number;
  registrationType?: RegistrationType;
  avionicsSummary?: string;
  maintenanceSummary?: string;
  highlights: string[];
  images: AircraftListingImage[];
  isVerified?: boolean;
  isFeatured?: boolean;
  listedAt: string;
  updatedAt: string;
  auction?: MarketplaceAuctionSummary;
};

export type AircraftTechnicalSpec = {
  airframe: {
    totalTimeAirframe?: number;
    yearOfManufacture?: number;
    serialNumber?: string;
    category?: string;
    registrationType?: string;
    damageHistory?: string;
    accidentHistory?: string;
    corrosionNotes?: string;
    paintCondition?: string;
    interiorCondition?: string;
  };
  engines: Array<{
    position: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    engineHours?: number;
    timeSinceOverhaul?: number;
    timeSinceNew?: number;
    overhaulDate?: string;
    knownIssues?: string;
  }>;
  propeller?: {
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    bladeCount?: number;
    propellerType?: string;
    propellerHours?: number;
    timeSinceOverhaul?: number;
    knownDamageNotes?: string;
  };
  avionics: {
    primarySuite?: string;
    comRadios?: string;
    navRadios?: string;
    transponder?: string;
    adsB?: string;
    gps?: string;
    autopilot?: string;
    efis?: string;
    engineMonitor?: string;
    elt?: string;
    intercom?: string;
    otherEquipment?: string;
  };
  maintenance: {
    lastMpiDate?: string;
    nextMpiDueDate?: string;
    mpiHoursRemaining?: number;
    maintenanceOrganisation?: string;
    logbooksComplete?: boolean;
    airframeLogsAvailable?: boolean;
    engineLogsAvailable?: boolean;
    propellerLogsAvailable?: boolean;
    adSbComplianceKnown?: boolean;
    currentlyAirworthy?: boolean;
    coaExpiry?: string;
    knownDefects?: string;
  };
};

export type AircraftDocumentSummary = {
  label: string;
  status: string;
};

export type AircraftVerificationSummary = {
  documentsReviewed?: boolean;
  photosVerified?: boolean;
  inspectionAvailable?: boolean;
  inspectionCompleted?: boolean;
  notes?: string;
};

export type AircraftMarketEstimate = {
  available: boolean;
  minValue?: number;
  maxValue?: number;
  currency?: "ZAR" | "USD" | "EUR";
  marketPosition?: string;
  notes?: string;
};

export type AircraftContactInfo = {
  sellerType: "PRIVATE" | "BROKER" | "AVIATONLY";
  contactName: string;
  phone?: string;
  email?: string;
};

export type AircraftMarketplaceDetail = AircraftMarketplaceListing & {
  description: string;
  technicalSpec: AircraftTechnicalSpec;
  documents: AircraftDocumentSummary[];
  verification: AircraftVerificationSummary;
  marketEstimate: AircraftMarketEstimate;
  contact: AircraftContactInfo;
};

export type SortOption =
  | "NEWEST"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "TTAF_ASC"
  | "YEAR_DESC"
  | "UPDATED"
  | "AUCTION_ENDING";

export type PriceRangePreset =
  | "ALL"
  | "UNDER_500K"
  | "500K_1M"
  | "1M_2_5M"
  | "2_5M_5M"
  | "OVER_5M"
  | "CUSTOM";

export type TtafRangePreset =
  | "ANY"
  | "UNDER_500"
  | "500_1500"
  | "1500_3000"
  | "3000_6000"
  | "OVER_6000";

export type SeatsPreset = "ANY" | "1_2" | "3_4" | "5_6" | "7_PLUS";

export type EngineCountPreset = "ANY" | "SINGLE" | "TWIN" | "MULTI";

export type AircraftMarketplaceFilters = {
  searchTerm: string;
  country: string;
  province: string;
  airfield: string;
  saleType: AircraftSaleType | "ALL";
  priceRange: PriceRangePreset;
  minPrice: string;
  maxPrice: string;
  category: AircraftCategory | "ALL";
  registrationType: RegistrationType | "ALL";
  make: string;
  seats: SeatsPreset;
  engineCount: EngineCountPreset;
  ttafRange: TtafRangePreset;
  maintenanceFlags: string[];
  avionicsFlags: string[];
  publicStatus: PublicAircraftStatus | "ALL";
};
