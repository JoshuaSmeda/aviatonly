import { ListingStatus } from "./listing-status";
import {
  canRollbackListingStatus,
  getListingReviewForwardStatus,
  getListingReviewRollbackStatus,
} from "./listing-review-workflow";

export class ListingTransitionError extends Error {
  constructor(
    public readonly from: ListingStatus,
    public readonly to: ListingStatus,
    message?: string,
  ) {
    super(message ?? `Cannot transition listing from ${from} to ${to}.`);
    this.name = "ListingTransitionError";
  }
}

const TERMINAL_STATUSES: readonly ListingStatus[] = [
  ListingStatus.SOLD,
  ListingStatus.WITHDRAWN,
  ListingStatus.EXPIRED,
];

/** Strict forward transitions — one next step per review stage. */
const ALLOWED_FORWARD_TRANSITIONS: Record<ListingStatus, readonly ListingStatus[]> = {
  [ListingStatus.DRAFT]: [],
  [ListingStatus.SUBMITTED]: [ListingStatus.UNDER_REVIEW],
  [ListingStatus.UNDER_REVIEW]: [
    ListingStatus.VALUATION_READY,
    ListingStatus.NEEDS_CHANGES,
  ],
  [ListingStatus.NEEDS_CHANGES]: [],
  [ListingStatus.VALUATION_READY]: [ListingStatus.APPROVED_FOR_LISTING],
  [ListingStatus.INSPECTION_PENDING]: [
    ListingStatus.INSPECTION_PASSED,
    ListingStatus.INSPECTION_FAILED,
  ],
  [ListingStatus.INSPECTION_PASSED]: [ListingStatus.APPROVED_FOR_LISTING],
  [ListingStatus.INSPECTION_FAILED]: [ListingStatus.NEEDS_CHANGES],
  [ListingStatus.APPROVED_FOR_LISTING]: [
    ListingStatus.LIVE_FIXED_PRICE,
    ListingStatus.LIVE_AUCTION,
  ],
  [ListingStatus.LIVE_FIXED_PRICE]: [],
  [ListingStatus.LIVE_AUCTION]: [],
  [ListingStatus.UNDER_OFFER]: [],
  [ListingStatus.DEPOSIT_PENDING]: [],
  [ListingStatus.UNDER_CONTRACT]: [],
  [ListingStatus.TRANSFER_PENDING]: [],
  [ListingStatus.SOLD]: [],
  [ListingStatus.WITHDRAWN]: [],
  [ListingStatus.EXPIRED]: [],
};

export function canTransitionListingStatus(
  from: ListingStatus,
  to: ListingStatus,
): boolean {
  if (from === to) return true;
  if (TERMINAL_STATUSES.includes(from)) return false;
  if (canRollbackListingStatus(from, to)) return true;
  return ALLOWED_FORWARD_TRANSITIONS[from].includes(to);
}

export function assertCanTransitionListingStatus(
  from: ListingStatus,
  to: ListingStatus,
): void {
  if (!canTransitionListingStatus(from, to)) {
    throw new ListingTransitionError(from, to);
  }
}

export function assertCanForwardListingStatus(
  from: ListingStatus,
  to: ListingStatus,
): void {
  const expected = getListingReviewForwardStatus(from);
  const isPublish =
    to === ListingStatus.LIVE_FIXED_PRICE || to === ListingStatus.LIVE_AUCTION;

  if (isPublish) {
    if (from !== ListingStatus.APPROVED_FOR_LISTING) {
      throw new ListingTransitionError(from, to);
    }
    return;
  }

  if (to === ListingStatus.NEEDS_CHANGES) {
    if (from !== ListingStatus.UNDER_REVIEW) {
      throw new ListingTransitionError(from, to);
    }
    return;
  }

  if (expected !== to) {
    throw new ListingTransitionError(from, to);
  }
}

export function assertCanRollbackListingStatus(
  from: ListingStatus,
  to: ListingStatus,
): void {
  if (!canRollbackListingStatus(from, to)) {
    throw new ListingTransitionError(from, to);
  }
  if (getListingReviewRollbackStatus(from) !== to) {
    throw new ListingTransitionError(from, to);
  }
}

export const ADMIN_REVIEW_STATUSES: readonly ListingStatus[] = [
  ListingStatus.SUBMITTED,
  ListingStatus.UNDER_REVIEW,
  ListingStatus.NEEDS_CHANGES,
  ListingStatus.VALUATION_READY,
  ListingStatus.INSPECTION_PENDING,
  ListingStatus.INSPECTION_PASSED,
  ListingStatus.INSPECTION_FAILED,
  ListingStatus.APPROVED_FOR_LISTING,
];

export function isAdminReviewStatus(status: ListingStatus): boolean {
  return ADMIN_REVIEW_STATUSES.includes(status);
}
