import { OfferStatus } from "@/lib/aviatonly/domain";
import type { MockOffer } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-28T16:00:00.000Z";

export const MOCK_OFFERS: MockOffer[] = [
  {
    id: "offer-1",
    listingId: "zs-def",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    amount: 5_950_000,
    currency: "ZAR",
    message: "Verified buyer — subject to pre-buy inspection within 14 days.",
    status: OfferStatus.RECEIVED,
    expiresAt: "2026-07-10T00:00:00.000Z",
    createdAt: "2026-06-28T14:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "offer-2",
    listingId: "zs-def",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    amount: 6_100_000,
    currency: "ZAR",
    message: "Cash buyer, can close within 30 days.",
    status: OfferStatus.UNDER_REVIEW,
    expiresAt: "2026-07-12T00:00:00.000Z",
    createdAt: "2026-06-27T10:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "offer-3",
    listingId: "zu-xyz",
    buyerId: "user-buyer-james",
    sellerId: DEMO_SELLER_ID,
    amount: 1_000_000,
    currency: "ZAR",
    message: "Opening offer — happy to discuss after inspection.",
    status: OfferStatus.RECEIVED,
    expiresAt: "2026-07-15T00:00:00.000Z",
    createdAt: "2026-06-26T15:00:00.000Z",
    updatedAt: T,
  },
];

export function getMockOffersForListing(listingId: string): MockOffer[] {
  return MOCK_OFFERS.filter((o) => o.listingId === listingId);
}

export function countActiveOffersForListing(listingId: string): number {
  return MOCK_OFFERS.filter(
    (o) =>
      o.listingId === listingId &&
      o.status !== OfferStatus.REJECTED &&
      o.status !== OfferStatus.WITHDRAWN &&
      o.status !== OfferStatus.EXPIRED,
  ).length;
}

export function getMockOffersForSeller(sellerId: string): MockOffer[] {
  return MOCK_OFFERS.filter((o) => o.sellerId === sellerId);
}
