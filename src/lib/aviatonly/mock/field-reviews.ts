import { FieldReviewStatus } from "../domain/field-review-status";
import type { MockListingFieldReview } from "./types";

const T = "2026-06-28T12:00:00.000Z";

export const MOCK_FIELD_REVIEWS: MockListingFieldReview[] = [
  {
    id: "field-zs-abc-last-mpi",
    listingId: "zs-abc",
    fieldKey: "last-mpi",
    label: "Last MPI",
    status: FieldReviewStatus.REJECTED,
    rejectionReason: "Does not match logbook records",
    rejectionPreset: null,
    reviewedById: "user-admin-reviewer",
    reviewedAt: "2026-06-28T11:10:00.000Z",
  },
];

export function getMockFieldReviewsForListing(listingId: string): MockListingFieldReview[] {
  return MOCK_FIELD_REVIEWS.filter((review) => review.listingId === listingId);
}
