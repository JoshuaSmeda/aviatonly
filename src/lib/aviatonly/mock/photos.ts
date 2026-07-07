import { PhotoStatus } from "@/lib/aviatonly/domain";
import type { MockAircraftPhoto } from "./types";

/** Demo photo data — cleared for a fresh database start. */
export const MOCK_PHOTOS: MockAircraftPhoto[] = [];

export function getMockPhotosForListing(listingId: string): MockAircraftPhoto[] {
  return MOCK_PHOTOS.filter((p) => p.listingId === listingId);
}

export function countPhotoIssuesForListing(listingId: string): number {
  return MOCK_PHOTOS.filter(
    (p) =>
      p.listingId === listingId &&
      (p.status === PhotoStatus.REJECTED || p.status === PhotoStatus.NEEDS_REPLACEMENT),
  ).length;
}
