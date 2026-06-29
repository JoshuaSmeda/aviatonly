import type { MockListingEvent } from "./types";
import { DEMO_SELLER_ID } from "./users";

export const ListingEventType = {
  SELLER_SUBMITTED_LISTING: "SELLER_SUBMITTED_LISTING",
  ADMIN_REQUESTED_CHANGES: "ADMIN_REQUESTED_CHANGES",
  PHOTO_REJECTED: "PHOTO_REJECTED",
  DOCUMENT_REJECTED: "DOCUMENT_REJECTED",
  VALUATION_ADDED: "VALUATION_ADDED",
  INSPECTION_SCHEDULED: "INSPECTION_SCHEDULED",
  LISTING_PUBLISHED: "LISTING_PUBLISHED",
  OFFER_RECEIVED: "OFFER_RECEIVED",
  OFFER_ACCEPTED: "OFFER_ACCEPTED",
  LEAD_RECEIVED: "LEAD_RECEIVED",
  VIEWING_REQUESTED: "VIEWING_REQUESTED",
  DEPOSIT_PENDING: "DEPOSIT_PENDING",
} as const;

export type ListingEventType = (typeof ListingEventType)[keyof typeof ListingEventType];

export const LISTING_EVENT_LABELS: Record<ListingEventType, string> = {
  [ListingEventType.SELLER_SUBMITTED_LISTING]: "Submitted for review",
  [ListingEventType.ADMIN_REQUESTED_CHANGES]: "Changes requested",
  [ListingEventType.PHOTO_REJECTED]: "Photo rejected",
  [ListingEventType.DOCUMENT_REJECTED]: "Document rejected",
  [ListingEventType.VALUATION_ADDED]: "Valuation added",
  [ListingEventType.INSPECTION_SCHEDULED]: "Inspection scheduled",
  [ListingEventType.LISTING_PUBLISHED]: "Listing published",
  [ListingEventType.OFFER_RECEIVED]: "Offer received",
  [ListingEventType.OFFER_ACCEPTED]: "Offer accepted",
  [ListingEventType.LEAD_RECEIVED]: "Lead received",
  [ListingEventType.VIEWING_REQUESTED]: "Viewing requested",
  [ListingEventType.DEPOSIT_PENDING]: "Deposit pending",
};

export const MOCK_LISTING_EVENTS: MockListingEvent[] = [
  {
    id: "ev-1",
    listingId: "zs-def",
    actorId: "user-buyer-marcus",
    type: ListingEventType.OFFER_RECEIVED,
    message: "Offer of R5,950,000 submitted by a verified buyer.",
    metadata: { offerId: "offer-1", amount: 5950000 },
    createdAt: "2026-06-28T14:00:00.000Z",
  },
  {
    id: "ev-2",
    listingId: "zs-abc",
    actorId: "user-admin-reviewer",
    type: ListingEventType.ADMIN_REQUESTED_CHANGES,
    message: "AVIATONLY requested 2 replacement photos and the latest MPI stamp.",
    metadata: { taskIds: ["task-zs-abc-photos", "task-zs-abc-cockpit", "task-zs-abc-mpi"] },
    createdAt: "2026-06-28T11:00:00.000Z",
  },
  {
    id: "ev-3",
    listingId: "zu-xyz",
    actorId: "user-admin-reviewer",
    type: ListingEventType.VALUATION_ADDED,
    message: "Pre-valuation estimate completed. Reserve price confirmation needed.",
    metadata: { lowEstimate: 1100000, highEstimate: 1250000 },
    createdAt: "2026-06-27T15:20:00.000Z",
  },
  {
    id: "ev-4",
    listingId: "zs-def",
    actorId: "user-admin-reviewer",
    type: ListingEventType.LISTING_PUBLISHED,
    message: "Listing went live as a fixed-price listing.",
    metadata: { saleType: "FIXED_PRICE" },
    createdAt: "2026-06-26T09:00:00.000Z",
  },
  {
    id: "ev-5",
    listingId: "zu-pqr",
    actorId: DEMO_SELLER_ID,
    type: ListingEventType.OFFER_ACCEPTED,
    message: "Offer accepted. Deal moved to under contract, awaiting deposit.",
    metadata: { dealId: "deal-1", agreedPrice: 1250000 },
    createdAt: "2026-06-22T10:00:00.000Z",
  },
  {
    id: "ev-6",
    listingId: "zs-mno",
    actorId: "user-seller-elaine",
    type: ListingEventType.SELLER_SUBMITTED_LISTING,
    message: "ZS-MNO submitted for AVIATONLY review.",
    metadata: null,
    createdAt: "2026-06-29T06:30:00.000Z",
  },
  {
    id: "ev-7",
    listingId: "zs-def",
    actorId: "user-buyer-sarah",
    type: ListingEventType.OFFER_RECEIVED,
    message: "Offer of R6,100,000 submitted — cash buyer.",
    metadata: { offerId: "offer-2", amount: 6100000 },
    createdAt: "2026-06-27T10:00:00.000Z",
  },
  {
    id: "ev-8",
    listingId: "zs-def",
    actorId: "user-buyer-sarah",
    type: ListingEventType.LEAD_RECEIVED,
    message: "Document access requested — engine logbook review before offer.",
    metadata: { leadId: "lead-2", leadType: "DOCUMENT_ACCESS" },
    createdAt: "2026-06-25T08:30:00.000Z",
  },
  {
    id: "ev-9",
    listingId: "zu-xyz",
    actorId: "user-buyer-sarah",
    type: ListingEventType.VIEWING_REQUESTED,
    message: "Viewing requested at FATA for Saturday morning.",
    metadata: { leadId: "lead-7" },
    createdAt: "2026-06-24T07:30:00.000Z",
  },
  {
    id: "ev-10",
    listingId: "zu-xyz",
    actorId: "user-buyer-james",
    type: ListingEventType.LEAD_RECEIVED,
    message: "New enquiry about hangarage at Tedderfield.",
    metadata: { leadId: "lead-5", leadType: "GENERAL_ENQUIRY" },
    createdAt: "2026-06-27T16:00:00.000Z",
  },
  {
    id: "ev-11",
    listingId: "zs-abc",
    actorId: "user-buyer-sarah",
    type: ListingEventType.VIEWING_REQUESTED,
    message: "Viewing requested at Lanseria for next week.",
    metadata: { leadId: "lead-9" },
    createdAt: "2026-06-26T09:00:00.000Z",
  },
];

export function getMockEventsForListing(listingId: string): MockListingEvent[] {
  return MOCK_LISTING_EVENTS.filter((e) => e.listingId === listingId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getMockEventsForSeller(sellerId: string, listingIds: string[]): MockListingEvent[] {
  return MOCK_LISTING_EVENTS
    .filter((e) => listingIds.includes(e.listingId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getListingEventLabel(type: string): string {
  return LISTING_EVENT_LABELS[type as ListingEventType] ?? type;
}
