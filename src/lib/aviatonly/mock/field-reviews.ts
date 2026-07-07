import type { MockListingFieldReview } from "./types";

/** Demo field review data — cleared for a fresh database start. */
export const MOCK_FIELD_REVIEWS: MockListingFieldReview[] = [];

export function getMockFieldReviewsForListing(listingId: string): MockListingFieldReview[] {
  return MOCK_FIELD_REVIEWS.filter((review) => review.listingId === listingId);
}
