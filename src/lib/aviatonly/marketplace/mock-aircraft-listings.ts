import type {
  AircraftMarketplaceDetail,
  AircraftMarketplaceListing,
} from "./aircraft-marketplace-types";

/** Demo marketplace listings — cleared for a fresh database start. */
const MOCK_LISTINGS: AircraftMarketplaceDetail[] = [];

export const MOCK_AIRCRAFT_LISTINGS: AircraftMarketplaceListing[] = MOCK_LISTINGS;

export function getMockListingBySlug(slug: string): AircraftMarketplaceDetail | undefined {
  return MOCK_LISTINGS.find((listing) => listing.slug === slug);
}

export function getMockListingSummaries(): AircraftMarketplaceListing[] {
  return MOCK_LISTINGS;
}

export function getMarketplaceStats() {
  const listings = MOCK_LISTINGS.filter((l) => l.publicStatus !== "SOLD");
  return {
    totalListings: listings.length,
    verifiedListings: listings.filter((l) => l.isVerified).length,
    fixedPriceCount: listings.filter((l) => l.saleType === "FIXED_PRICE").length,
    auctionCount: listings.filter((l) => l.saleType === "AUCTION").length,
  };
}
