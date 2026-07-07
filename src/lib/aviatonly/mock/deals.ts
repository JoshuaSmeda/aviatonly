import type { MockDeal } from "./types";

/** Demo deal data — cleared for a fresh database start. */
export const MOCK_DEALS: MockDeal[] = [];

export function getMockDealForListing(listingId: string): MockDeal | undefined {
  return MOCK_DEALS.find((d) => d.listingId === listingId);
}

export function getMockDealsForSeller(sellerId: string): MockDeal[] {
  return MOCK_DEALS.filter((d) => d.sellerId === sellerId);
}

export function getMockDealById(id: string): MockDeal | undefined {
  return MOCK_DEALS.find((d) => d.id === id);
}
