export interface UploadSlotDef {
  id: string;
  label: string;
  instruction: string;
}

/**
 * Commission rules kept central so they can change without touching the UI.
 * Initial model: success-based commission of 2.5% (excl. VAT) on the final price.
 */
export const DEFAULT_PLATFORM_COMMISSION_RATE = 0.025;
export const SOUTH_AFRICA_VAT_RATE = 0.15;

export function estimateCommission(price?: number) {
  if (!price || price <= 0) return null;
  const commission = price * DEFAULT_PLATFORM_COMMISSION_RATE;
  const vat = commission * SOUTH_AFRICA_VAT_RATE;
  return { commission, vat, total: commission + vat, net: price - commission - vat };
}

export const ZAR = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

/** SACAA registers the nine South African provinces. */
export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export const AIRCRAFT_CATEGORIES = [
  "Single-Engine Piston",
  "Multi-Engine Piston",
  "Turboprop",
  "Light Jet",
  "Helicopter",
  "Experimental / LSA",
  "Microlight",
  "Glider / Sailplane",
  "Other",
] as const;

/** Common avionics & equipment shown as checkboxes; anything else goes in a free-text box. */
export const AVIONICS_OPTIONS = [
  "IFR certified",
  "Autopilot",
  "ADS-B Out",
  "ADS-B In",
  "Mode S transponder",
  "GPS / GNSS navigator",
  "Glass cockpit (EFIS)",
  "Engine monitor",
  "406 MHz ELT",
  "Audio panel / intercom",
  "DME",
  "Standby instruments",
] as const;

export const MAINTENANCE_STATUSES = [
  "Current — in annual / MPI valid",
  "MPI due within 90 days",
  "Project / non-flying",
  "Stored — not currently airworthy",
] as const;

/**
 * Guided photo slots. Sellers upload specific angles instead of generic photos
 * so buyers can assess condition, gauges, and known wear points.
 */
export const PHOTO_SLOTS: UploadSlotDef[] = [
  { id: "exterior-45", label: "Exterior 45° front profile", instruction: "Three-quarter front view showing the full airframe." },
  { id: "tail-on", label: "Direct tail-on view", instruction: "Straight from behind, centred on the empennage." },
  { id: "wing-leading-edge", label: "Wing leading edges", instruction: "Close-up of leading edges showing any dents or erosion." },
  { id: "undercarriage", label: "Undercarriage / nose / tailwheel", instruction: "Gear legs, tyres, and wheel fairings." },
  { id: "brake-lines", label: "Brake lines", instruction: "Brake assemblies and lines at the wheels." },
  { id: "prop-tips", label: "Propeller tips & leading edges", instruction: "Each blade tip and leading edge, close enough to see nicks." },
  { id: "engine-cowling", label: "Engine / cowling / powerplant", instruction: "Cowl removed if possible, showing the powerplant." },
  { id: "exhaust-stacks", label: "Exhaust stacks", instruction: "Exhaust system and stacks for cracks or staining." },
  { id: "oil-filter-firewall", label: "Oil filter / firewall region", instruction: "Firewall and accessory area around the oil filter." },
  { id: "cockpit-panel", label: "Cockpit panel powered on", instruction: "Instrument panel with avionics powered up and readable." },
  { id: "seats-belts", label: "Seats & seatbelt tags", instruction: "Seats and the dated tags on each seatbelt." },
  { id: "interior", label: "Interior condition", instruction: "Cabin trim, headliner, and floor condition." },
];

/**
 * Private document slots. Treated as sensitive — in production these are stored
 * privately and only released via short-lived signed URLs after authorization.
 */
export const DOCUMENT_SLOTS: UploadSlotDef[] = [
  { id: "mpi-stamp", label: "Last MPI stamp", instruction: "The most recent Mandatory Periodic Inspection stamp." },
  { id: "latest-logbook", label: "Latest logbook entry", instruction: "Most recent signed maintenance entry." },
  { id: "airframe-logbook", label: "Airframe logbook summary", instruction: "Summary pages of the airframe logbook." },
  { id: "engine-logbook", label: "Engine logbook summary", instruction: "Summary pages of the engine logbook." },
  { id: "prop-logbook", label: "Propeller logbook summary", instruction: "Summary pages of the propeller logbook." },
  { id: "coa", label: "Certificate of Airworthiness / ATF", instruction: "C of A for type-certified, or Authority to Fly for non-type-certified." },
  { id: "cor", label: "Certificate of Registration", instruction: "Current SACAA Certificate of Registration." },
  { id: "weight-balance", label: "Weight & balance data sheet", instruction: "Latest weight and balance schedule." },
  { id: "ad-sb", label: "AD/SB compliance status", instruction: "Airworthiness Directive / Service Bulletin status sheet, where applicable." },
];
