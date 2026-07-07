import { OfferStatus } from "@/lib/aviatonly/domain";
import type { MockOffer } from "./types";

/** Demo offer data — cleared for a fresh database start. */
export const MOCK_OFFERS: MockOffer[] = [];

export function getMockOffersForListing(listingId: string): MockOffer[] {
  return MOCK_OFFERS.filter((o) => o.listingId === listingId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function countActiveOffersForListing(listingId: string): number {
  return MOCK_OFFERS.filter(
    (o) =>
      o.listingId === listingId &&
      o.status !== OfferStatus.REJECTED &&
      o.status !== OfferStatus.WITHDRAWN &&
      o.status !== OfferStatus.EXPIRED &&
      o.status !== OfferStatus.ACCEPTED,
  ).length;
}

export function getMockOffersForSeller(sellerId: string): MockOffer[] {
  return MOCK_OFFERS.filter((o) => o.sellerId === sellerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getMockOfferById(id: string): MockOffer | undefined {
  return MOCK_OFFERS.find((o) => o.id === id);
}
