import type { MockListingEvent } from "./types";

export const ListingEventType = {
  SELLER_SUBMITTED_LISTING: "SELLER_SUBMITTED_LISTING",
  ADMIN_STARTED_REVIEW: "ADMIN_STARTED_REVIEW",
  ADMIN_APPROVED_FOR_LISTING: "ADMIN_APPROVED_FOR_LISTING",
  ADMIN_REVERTED_REVIEW_STEP: "ADMIN_REVERTED_REVIEW_STEP",
  ADMIN_REQUESTED_CHANGES: "ADMIN_REQUESTED_CHANGES",
  PHOTO_UPLOADED: "PHOTO_UPLOADED",
  PHOTO_REPLACED: "PHOTO_REPLACED",
  PHOTO_REMOVED: "PHOTO_REMOVED",
  PHOTO_REJECTED: "PHOTO_REJECTED",
  DOCUMENT_UPLOADED: "DOCUMENT_UPLOADED",
  DOCUMENT_REPLACED: "DOCUMENT_REPLACED",
  DOCUMENT_REMOVED: "DOCUMENT_REMOVED",
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
  [ListingEventType.ADMIN_STARTED_REVIEW]: "Review started",
  [ListingEventType.ADMIN_APPROVED_FOR_LISTING]: "Approved for listing",
  [ListingEventType.ADMIN_REVERTED_REVIEW_STEP]: "Review step reverted",
  [ListingEventType.ADMIN_REQUESTED_CHANGES]: "Changes requested",
  [ListingEventType.PHOTO_UPLOADED]: "Photo uploaded",
  [ListingEventType.PHOTO_REPLACED]: "Photo replaced",
  [ListingEventType.PHOTO_REMOVED]: "Photo removed",
  [ListingEventType.PHOTO_REJECTED]: "Photo rejected",
  [ListingEventType.DOCUMENT_UPLOADED]: "Document uploaded",
  [ListingEventType.DOCUMENT_REPLACED]: "Document replaced",
  [ListingEventType.DOCUMENT_REMOVED]: "Document removed",
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

/** Demo listing event data — cleared for a fresh database start. */
export const MOCK_LISTING_EVENTS: MockListingEvent[] = [];

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
