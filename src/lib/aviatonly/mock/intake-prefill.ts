import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import { SaleType } from "@/lib/aviatonly/domain";
import {
  getMockAirframe,
  getMockAvionics,
  getMockEngines,
  getMockListingById,
  getMockMaintenance,
  getMockPropellers,
} from "./listings";

/**
 * Maps a mock draft listing into partial intake wizard values for resuming work.
 * Used when no Prisma autosave draft exists yet.
 */
export function getIntakePrefillFromListing(listingId: string): Partial<AircraftFormValues> | null {
  const listing = getMockListingById(listingId);
  if (!listing) return null;

  const airframe = getMockAirframe(listingId);
  const engine = getMockEngines(listingId)[0];
  const propeller = getMockPropellers(listingId)[0];
  const avionics = getMockAvionics(listingId);
  const maintenance = getMockMaintenance(listingId);

  const engineMakeModel =
    engine?.manufacturer && engine?.model
      ? `${engine.manufacturer} ${engine.model}`
      : engine?.manufacturer ?? engine?.model ?? "";

  const propellerMakeModel =
    propeller?.manufacturer && propeller?.model
      ? `${propeller.manufacturer} ${propeller.model}`
      : propeller?.manufacturer ?? propeller?.model ?? "";

  return {
    registration: listing.registration,
    registrationType: listing.registrationType,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    category: listing.category,
    airfield: listing.airfield,
    province: listing.province,
    ownerName: listing.ownerName ?? "",
    sellerRole: listing.sellerRole ?? undefined,
    authorisedToSell: listing.authorisedToSell ?? false,
    saleType: listing.saleType === SaleType.AUCTION ? "AUCTION" : "FIXED_PRICE",
    valuationEstimate: listing.valuationEstimate ?? undefined,
    askingPrice: listing.askingPrice ?? undefined,
    reservePrice: listing.reservePrice ?? undefined,
    startingBid: listing.startingBid ?? undefined,
    bidIncrement: listing.bidIncrement ?? undefined,
    ttaf: airframe?.totalTimeAirframe ?? undefined,
    engineMakeModel,
    engineHours: engine?.engineHours ?? undefined,
    tso: engine?.timeSinceOverhaul ?? undefined,
    propellerMakeModel,
    propellerHours: propeller?.propellerHours ?? undefined,
    avionicsEquipment: avionics?.equipment ?? [],
    avionics: avionics?.summary ?? "",
    maintenanceStatus: maintenance?.status ?? undefined,
    lastMpiDate: maintenance?.lastMpiDate ? new Date(maintenance.lastMpiDate) : undefined,
    knownDefects: maintenance?.notes ?? airframe?.damageHistory ?? "",
  };
}

/** Demo seller's in-progress draft listing id for intake resume hints. */
export const DEMO_DRAFT_LISTING_ID = "zs-ghi";
