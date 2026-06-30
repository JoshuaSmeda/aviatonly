import type { StatusMeta } from "./types";

/**
 * Canonical AVIATONLY listing status values.
 * Must stay in sync with `ListingStatus` in `prisma/schema.prisma`.
 */
export enum ListingStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  NEEDS_CHANGES = "NEEDS_CHANGES",
  VALUATION_READY = "VALUATION_READY",
  INSPECTION_PENDING = "INSPECTION_PENDING",
  INSPECTION_PASSED = "INSPECTION_PASSED",
  INSPECTION_FAILED = "INSPECTION_FAILED",
  APPROVED_FOR_LISTING = "APPROVED_FOR_LISTING",
  LIVE_FIXED_PRICE = "LIVE_FIXED_PRICE",
  LIVE_AUCTION = "LIVE_AUCTION",
  UNDER_OFFER = "UNDER_OFFER",
  DEPOSIT_PENDING = "DEPOSIT_PENDING",
  UNDER_CONTRACT = "UNDER_CONTRACT",
  TRANSFER_PENDING = "TRANSFER_PENDING",
  SOLD = "SOLD",
  WITHDRAWN = "WITHDRAWN",
  EXPIRED = "EXPIRED",
}

export const LISTING_STATUS_META: Record<ListingStatus, StatusMeta> = {
  [ListingStatus.DRAFT]: {
    label: "Draft",
    description: "Aircraft intake started but not yet submitted.",
    badgeVariant: "secondary",
  },
  [ListingStatus.SUBMITTED]: {
    label: "Submitted",
    description: "Submitted to AVIATONLY and waiting to enter the review queue.",
    badgeVariant: "secondary",
  },
  [ListingStatus.UNDER_REVIEW]: {
    label: "Under Review",
    description: "AVIATONLY is reviewing the aircraft data, photos, and documents.",
    badgeVariant: "outline",
  },
  [ListingStatus.NEEDS_CHANGES]: {
    label: "Needs Changes",
    description: "Changes are required from the seller before review can continue.",
    badgeVariant: "destructive",
  },
  [ListingStatus.VALUATION_READY]: {
    label: "Valuation Ready",
    description: "AVIATONLY has prepared an indicative market estimate for your aircraft.",
    badgeVariant: "outline",
  },
  [ListingStatus.INSPECTION_PENDING]: {
    label: "Inspection Pending",
    description: "An independent AMO or platform inspection is scheduled or in progress.",
    badgeVariant: "outline",
  },
  [ListingStatus.INSPECTION_PASSED]: {
    label: "Inspection Passed",
    description: "Inspection completed successfully and the aircraft is cleared to list.",
    badgeVariant: "default",
  },
  [ListingStatus.INSPECTION_FAILED]: {
    label: "Inspection Failed",
    description: "Inspection found issues that block publication until resolved.",
    badgeVariant: "destructive",
  },
  [ListingStatus.APPROVED_FOR_LISTING]: {
    label: "Approved for Listing",
    description: "Cleared by AVIATONLY and ready to be published as fixed-price or auction.",
    badgeVariant: "default",
  },
  [ListingStatus.LIVE_FIXED_PRICE]: {
    label: "Live · Fixed Price",
    description: "Published and live as a fixed-price listing.",
    badgeVariant: "default",
  },
  [ListingStatus.LIVE_AUCTION]: {
    label: "Live · Auction",
    description: "Published and live as a timed auction.",
    badgeVariant: "default",
  },
  [ListingStatus.UNDER_OFFER]: {
    label: "Under Offer",
    description: "A buyer offer or accepted bid is being progressed.",
    badgeVariant: "default",
  },
  [ListingStatus.DEPOSIT_PENDING]: {
    label: "Deposit Pending",
    description: "Awaiting buyer deposit before the deal is locked.",
    badgeVariant: "outline",
  },
  [ListingStatus.UNDER_CONTRACT]: {
    label: "Under Contract",
    description: "Deal locked and under contract pending transfer.",
    badgeVariant: "default",
  },
  [ListingStatus.TRANSFER_PENDING]: {
    label: "Transfer Pending",
    description: "SACAA change-of-ownership documentation lodged and in progress.",
    badgeVariant: "outline",
  },
  [ListingStatus.SOLD]: {
    label: "Sold",
    description: "Transfer confirmed and the sale is closed.",
    badgeVariant: "secondary",
  },
  [ListingStatus.WITHDRAWN]: {
    label: "Withdrawn",
    description: "Listing was withdrawn before completing the sale.",
    badgeVariant: "secondary",
  },
  [ListingStatus.EXPIRED]: {
    label: "Expired",
    description: "Listing expired before completing the sale.",
    badgeVariant: "secondary",
  },
};

/** Ordered milestones for the happy-path listing lifecycle. */
export const LISTING_PHASES = [
  { key: "DRAFT", label: "Draft" },
  { key: "SUBMITTED", label: "Submitted" },
  { key: "REVIEW", label: "Review" },
  { key: "VALUATION", label: "Valuation" },
  { key: "INSPECTION", label: "Inspection" },
  { key: "LIVE", label: "Live" },
  { key: "OFFER", label: "Offer" },
  { key: "CONTRACT", label: "Contract" },
  { key: "TRANSFER", label: "Transfer" },
  { key: "SOLD", label: "Sold" },
] as const;

export type ListingPhaseKey = (typeof LISTING_PHASES)[number]["key"];

export const OFF_TRACK_STATUSES: readonly ListingStatus[] = [
  ListingStatus.WITHDRAWN,
  ListingStatus.EXPIRED,
];

export const TERMINAL_STATUSES: readonly ListingStatus[] = [
  ListingStatus.SOLD,
  ListingStatus.WITHDRAWN,
  ListingStatus.EXPIRED,
];

export const ATTENTION_STATUSES: readonly ListingStatus[] = [
  ListingStatus.NEEDS_CHANGES,
  ListingStatus.INSPECTION_FAILED,
];

export const LIVE_STATUSES: readonly ListingStatus[] = [
  ListingStatus.LIVE_FIXED_PRICE,
  ListingStatus.LIVE_AUCTION,
];

const STATUS_PHASE_INDEX: Record<ListingStatus, number> = {
  [ListingStatus.DRAFT]: 0,
  [ListingStatus.SUBMITTED]: 1,
  [ListingStatus.UNDER_REVIEW]: 2,
  [ListingStatus.NEEDS_CHANGES]: 2,
  [ListingStatus.VALUATION_READY]: 3,
  [ListingStatus.INSPECTION_PENDING]: 4,
  [ListingStatus.INSPECTION_PASSED]: 4,
  [ListingStatus.INSPECTION_FAILED]: 4,
  [ListingStatus.APPROVED_FOR_LISTING]: 4,
  [ListingStatus.LIVE_FIXED_PRICE]: 5,
  [ListingStatus.LIVE_AUCTION]: 5,
  [ListingStatus.UNDER_OFFER]: 6,
  [ListingStatus.DEPOSIT_PENDING]: 6,
  [ListingStatus.UNDER_CONTRACT]: 7,
  [ListingStatus.TRANSFER_PENDING]: 8,
  [ListingStatus.SOLD]: 9,
  [ListingStatus.WITHDRAWN]: -1,
  [ListingStatus.EXPIRED]: -1,
};

export function getListingStatusMeta(status: ListingStatus): StatusMeta {
  return LISTING_STATUS_META[status];
}

export function getListingPhaseIndex(status: ListingStatus): number {
  return STATUS_PHASE_INDEX[status];
}

export function getListingProgressPercent(status: ListingStatus): number {
  const index = getListingPhaseIndex(status);
  if (index < 0) return 0;
  return Math.round((index / (LISTING_PHASES.length - 1)) * 100);
}

export function isOffTrackStatus(status: ListingStatus): boolean {
  return OFF_TRACK_STATUSES.includes(status);
}

export function isTerminalStatus(status: ListingStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isAttentionStatus(status: ListingStatus): boolean {
  return ATTENTION_STATUSES.includes(status);
}

export function isLiveStatus(status: ListingStatus): boolean {
  return LIVE_STATUSES.includes(status);
}

/** True once the listing has reached the valuation workflow step or later. */
export function isValuationPhaseReached(status: ListingStatus): boolean {
  return getListingPhaseIndex(status) >= STATUS_PHASE_INDEX[ListingStatus.VALUATION_READY];
}
