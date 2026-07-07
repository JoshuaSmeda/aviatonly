import { ReviewTaskStatus } from "@/lib/aviatonly/domain";
import type { MockListingReviewTask } from "./types";

/** Demo review task data — cleared for a fresh database start. */
export const MOCK_REVIEW_TASKS: MockListingReviewTask[] = [];

export function getMockReviewTasksForListing(listingId: string): MockListingReviewTask[] {
  return MOCK_REVIEW_TASKS.filter((t) => t.listingId === listingId);
}

export function getOpenReviewTasksForListing(listingId: string): MockListingReviewTask[] {
  return MOCK_REVIEW_TASKS.filter(
    (t) =>
      t.listingId === listingId &&
      t.status !== ReviewTaskStatus.DONE &&
      t.status !== ReviewTaskStatus.CANCELLED,
  );
}
