import { DocumentStatus, PhotoStatus } from "@/lib/aviatonly/domain";
import type { MockAircraftDocument } from "./types";

/** Demo document data — cleared for a fresh database start. */
export const MOCK_DOCUMENTS: MockAircraftDocument[] = [];

export function getMockDocumentsForListing(listingId: string): MockAircraftDocument[] {
  return MOCK_DOCUMENTS.filter((d) => d.listingId === listingId);
}

export function countMissingDocumentsForListing(listingId: string): number {
  return MOCK_DOCUMENTS.filter(
    (d) =>
      d.listingId === listingId &&
      (d.reviewStatus === DocumentStatus.MISSING ||
        d.reviewStatus === DocumentStatus.NEEDS_REPLACEMENT ||
        d.reviewStatus === DocumentStatus.REJECTED),
  ).length;
}
