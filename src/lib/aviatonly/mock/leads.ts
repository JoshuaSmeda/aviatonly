import type { MockLead } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-28T14:00:00.000Z";

export const MOCK_LEADS: MockLead[] = [
  {
    id: "lead-1",
    listingId: "zs-def",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    message: "Interested in a pre-buy inspection window. Is hangarage included?",
    status: "QUALIFIED",
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-20T10:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-2",
    listingId: "zs-def",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    message: "Requesting engine logbook access before making an offer.",
    status: "VIEWING_REQUESTED",
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-25T08:30:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-3",
    listingId: "zu-xyz",
    buyerId: "user-buyer-james",
    sellerId: DEMO_SELLER_ID,
    message: "What is the hangarage situation at Tedderfield?",
    status: "NEW",
    verificationStatus: "PENDING",
    createdAt: "2026-06-27T16:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-4",
    listingId: "zs-abc",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    message: "Can you confirm TTAF and last engine overhaul date?",
    status: "CONTACTED",
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-24T11:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-5",
    listingId: "zs-abc",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    message: "Is the aircraft available for a viewing next week?",
    status: "NEW",
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-26T09:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-6",
    listingId: "zu-xyz",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    message: "Interested in the avionics suite — ADS-B out confirmed?",
    status: "QUALIFIED",
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-22T13:00:00.000Z",
    updatedAt: T,
  },
];

export function getMockLeadsForListing(listingId: string): MockLead[] {
  return MOCK_LEADS.filter((l) => l.listingId === listingId);
}

export function countLeadsForListing(listingId: string): number {
  return MOCK_LEADS.filter((l) => l.listingId === listingId).length;
}

export function getMockLeadsForSeller(sellerId: string): MockLead[] {
  return MOCK_LEADS.filter((l) => l.sellerId === sellerId);
}
