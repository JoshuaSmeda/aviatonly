import { OfferStatus } from "@/lib/aviatonly/domain";
import type { MockOffer } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-28T16:00:00.000Z";

export const MOCK_OFFERS: MockOffer[] = [
  // ZS-DEF — Cirrus SR22 (live, multiple active offers)
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
    listingId: "zs-def",
    buyerId: "user-buyer-peter",
    sellerId: DEMO_SELLER_ID,
    amount: 6_250_000,
    currency: "ZAR",
    message: "Full asking price — no finance contingency.",
    status: OfferStatus.SELLER_COUNTERED,
    expiresAt: "2026-07-08T00:00:00.000Z",
    createdAt: "2026-06-25T11:00:00.000Z",
    updatedAt: "2026-06-27T14:30:00.000Z",
  },
  // ZU-XYZ — Sling 2 (pre-auction interest)
  {
    id: "offer-4",
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
  {
    id: "offer-5",
    listingId: "zu-xyz",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    amount: 1_050_000,
    currency: "ZAR",
    message: "Will match reserve if MPI is current.",
    status: OfferStatus.REJECTED,
    expiresAt: null,
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-06-22T10:00:00.000Z",
  },
  // ZU-PQR — BushCat (accepted, deal in progress)
  {
    id: "offer-accepted-pqr",
    listingId: "zu-pqr",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    amount: 1_250_000,
    currency: "ZAR",
    message: "Accepted after document review — deposit to follow within 5 business days.",
    status: OfferStatus.ACCEPTED,
    expiresAt: null,
    createdAt: "2026-06-20T12:00:00.000Z",
    updatedAt: "2026-06-22T10:00:00.000Z",
  },
  // ZS-ABC — expired offer from earlier interest
  {
    id: "offer-6",
    listingId: "zs-abc",
    buyerId: "user-buyer-peter",
    sellerId: DEMO_SELLER_ID,
    amount: 820_000,
    currency: "ZAR",
    message: "Offer contingent on MPI passing without findings.",
    status: OfferStatus.EXPIRED,
    expiresAt: "2026-06-20T00:00:00.000Z",
    createdAt: "2026-06-10T08:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
  },
  {
    id: "offer-7",
    listingId: "zs-abc",
    buyerId: "user-buyer-james",
    sellerId: DEMO_SELLER_ID,
    amount: 800_000,
    currency: "ZAR",
    message: "Buyer withdrew after reviewing damage history notes.",
    status: OfferStatus.WITHDRAWN,
    expiresAt: null,
    createdAt: "2026-06-05T14:00:00.000Z",
    updatedAt: "2026-06-08T09:00:00.000Z",
  },
];

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
