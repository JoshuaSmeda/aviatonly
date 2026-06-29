import { DealStatus } from "@/lib/aviatonly/domain";
import type { MockDeal } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-25T16:45:00.000Z";

export const MOCK_DEALS: MockDeal[] = [
  {
    id: "deal-1",
    listingId: "zu-pqr",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    acceptedOfferId: "offer-accepted-pqr",
    agreedPrice: 1_250_000,
    currency: "ZAR",
    depositAmount: 125_000,
    commissionAmount: 31_250,
    vatAmount: 4_687,
    status: DealStatus.DEPOSIT_PENDING,
    nextAction: "Awaiting buyer deposit verification — compliance review in progress",
    createdAt: "2026-06-22T10:00:00.000Z",
    updatedAt: T,
  },
];

export function getMockDealForListing(listingId: string): MockDeal | undefined {
  return MOCK_DEALS.find((d) => d.listingId === listingId);
}

export function getMockDealsForSeller(sellerId: string): MockDeal[] {
  return MOCK_DEALS.filter((d) => d.sellerId === sellerId);
}

export function getMockDealById(id: string): MockDeal | undefined {
  return MOCK_DEALS.find((d) => d.id === id);
}
