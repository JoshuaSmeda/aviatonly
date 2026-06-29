import { isLiveStatus, ListingStatus } from "./listing-status";

/** Ordered AVIATONLY admin review pipeline — one forward step at a time. */
export const LISTING_REVIEW_PIPELINE = [
  {
    id: "submitted",
    label: "Submitted",
    description: "Aircraft is in the review queue.",
    anchorStatus: ListingStatus.SUBMITTED,
  },
  {
    id: "data-review",
    label: "Data review",
    description: "Verify aircraft data, guided photos, and document vault.",
    anchorStatus: ListingStatus.UNDER_REVIEW,
  },
  {
    id: "valuation",
    label: "Valuation",
    description: "Confirm internal valuation and seller pricing.",
    anchorStatus: ListingStatus.VALUATION_READY,
  },
  {
    id: "approval",
    label: "Approved",
    description: "Cleared for publication — not yet public.",
    anchorStatus: ListingStatus.APPROVED_FOR_LISTING,
  },
  {
    id: "published",
    label: "Published",
    description: "Live on the public catalog.",
    anchorStatus: null,
  },
] as const;

export type ListingReviewPipelineStepId =
  (typeof LISTING_REVIEW_PIPELINE)[number]["id"];

export type ListingReviewStepState = "complete" | "current" | "upcoming" | "blocked";

export interface ListingReviewPipelineStepView {
  id: ListingReviewPipelineStepId;
  label: string;
  description: string;
  state: ListingReviewStepState;
}

const STATUS_STEP_INDEX: Partial<Record<ListingStatus, number>> = {
  [ListingStatus.SUBMITTED]: 0,
  [ListingStatus.UNDER_REVIEW]: 1,
  [ListingStatus.NEEDS_CHANGES]: 1,
  [ListingStatus.VALUATION_READY]: 2,
  [ListingStatus.INSPECTION_PENDING]: 2,
  [ListingStatus.INSPECTION_PASSED]: 2,
  [ListingStatus.INSPECTION_FAILED]: 1,
  [ListingStatus.APPROVED_FOR_LISTING]: 3,
  [ListingStatus.LIVE_FIXED_PRICE]: 4,
  [ListingStatus.LIVE_AUCTION]: 4,
};

/** Next status when admin completes the current pipeline step. */
const FORWARD_NEXT_STATUS: Partial<Record<ListingStatus, ListingStatus>> = {
  [ListingStatus.SUBMITTED]: ListingStatus.UNDER_REVIEW,
  [ListingStatus.UNDER_REVIEW]: ListingStatus.VALUATION_READY,
  [ListingStatus.VALUATION_READY]: ListingStatus.APPROVED_FOR_LISTING,
};

/** Previous pipeline status — admin rollback only (pre-publication). */
const ROLLBACK_PREVIOUS_STATUS: Partial<Record<ListingStatus, ListingStatus>> = {
  [ListingStatus.UNDER_REVIEW]: ListingStatus.SUBMITTED,
  [ListingStatus.VALUATION_READY]: ListingStatus.UNDER_REVIEW,
  [ListingStatus.APPROVED_FOR_LISTING]: ListingStatus.VALUATION_READY,
};

export function getListingReviewStepIndex(status: ListingStatus): number {
  if (isLiveStatus(status)) return 4;
  return STATUS_STEP_INDEX[status] ?? -1;
}

export function getListingReviewPipelineSteps(
  status: ListingStatus,
): ListingReviewPipelineStepView[] {
  const currentIndex = getListingReviewStepIndex(status);
  const blocked = status === ListingStatus.NEEDS_CHANGES;

  return LISTING_REVIEW_PIPELINE.map((step, index) => {
    let state: ListingReviewStepState = "upcoming";

    if (currentIndex < 0) {
      state = "upcoming";
    } else if (index < currentIndex) {
      state = "complete";
    } else if (index === currentIndex) {
      state = blocked ? "blocked" : "current";
    }

    return {
      id: step.id,
      label: step.label,
      description: step.description,
      state,
    };
  });
}

export function getListingReviewForwardStatus(
  status: ListingStatus,
): ListingStatus | null {
  return FORWARD_NEXT_STATUS[status] ?? null;
}

export function getListingReviewRollbackStatus(
  status: ListingStatus,
): ListingStatus | null {
  return ROLLBACK_PREVIOUS_STATUS[status] ?? null;
}

export function canRollbackListingStatus(
  from: ListingStatus,
  to: ListingStatus,
): boolean {
  return getListingReviewRollbackStatus(from) === to;
}

export interface ListingReviewForwardAction {
  toStatus: ListingStatus;
  title: string;
  description: string;
  confirmTitle: string;
  confirmDescription: string;
  successMessage: string;
  reviewTabHref: string;
}

export function getListingReviewForwardAction(
  listingId: string,
  status: ListingStatus,
): ListingReviewForwardAction | null {
  const base = `/dashboard/listings/${listingId}`;
  const toStatus = getListingReviewForwardStatus(status);

  if (!toStatus) {
    if (status === ListingStatus.APPROVED_FOR_LISTING) {
      return null;
    }
    return null;
  }

  switch (status) {
    case ListingStatus.SUBMITTED:
      return {
        toStatus,
        title: "Start data review",
        description:
          "Open aircraft data, media, and documents tabs before advancing. This assigns the listing to active review.",
        confirmTitle: "Start data review?",
        confirmDescription:
          "The seller will see that AVIATONLY is reviewing their submission. You can still revert to the queue if needed.",
        successMessage: "Data review started.",
        reviewTabHref: `${base}?tab=aircraft-data`,
      };
    case ListingStatus.UNDER_REVIEW:
      return {
        toStatus,
        title: "Complete data review",
        description:
          "Only advance after photos, documents, and technical data are checked. Next step is valuation.",
        confirmTitle: "Complete data review?",
        confirmDescription:
          "This moves the listing to the valuation step. Use “Request changes” if the seller must fix intake data first.",
        successMessage: "Data review complete — valuation step unlocked.",
        reviewTabHref: `${base}?tab=documents`,
      };
    case ListingStatus.VALUATION_READY:
      return {
        toStatus,
        title: "Approve for publication",
        description:
          "Confirm valuation and pricing on the Valuation tab, then approve. The listing is still not public.",
        confirmTitle: "Approve for publication?",
        confirmDescription:
          "The aircraft will be marked approved for listing. Publishing to the catalog is a separate final step.",
        successMessage: "Approved for publication.",
        reviewTabHref: `${base}?tab=valuation`,
      };
    default:
      return null;
  }
}

export function getListingReviewRollbackAction(
  status: ListingStatus,
): { toStatus: ListingStatus; label: string; description: string } | null {
  const toStatus = getListingReviewRollbackStatus(status);
  if (!toStatus) return null;

  const labels: Record<ListingStatus, { label: string; description: string }> = {
    [ListingStatus.SUBMITTED]: {
      label: "Return to review queue",
      description: "Moves the listing back to submitted — use if review was started by mistake.",
    },
    [ListingStatus.UNDER_REVIEW]: {
      label: "Return to data review",
      description: "Moves the listing back to data review — use if valuation was started too early.",
    },
    [ListingStatus.VALUATION_READY]: {
      label: "Return to valuation",
      description: "Moves the listing back to valuation — use if approval was clicked by mistake.",
    },
    [ListingStatus.DRAFT]: { label: "", description: "" },
    [ListingStatus.NEEDS_CHANGES]: { label: "", description: "" },
    [ListingStatus.INSPECTION_PENDING]: { label: "", description: "" },
    [ListingStatus.INSPECTION_PASSED]: { label: "", description: "" },
    [ListingStatus.INSPECTION_FAILED]: { label: "", description: "" },
    [ListingStatus.APPROVED_FOR_LISTING]: { label: "", description: "" },
    [ListingStatus.LIVE_FIXED_PRICE]: { label: "", description: "" },
    [ListingStatus.LIVE_AUCTION]: { label: "", description: "" },
    [ListingStatus.UNDER_OFFER]: { label: "", description: "" },
    [ListingStatus.DEPOSIT_PENDING]: { label: "", description: "" },
    [ListingStatus.UNDER_CONTRACT]: { label: "", description: "" },
    [ListingStatus.TRANSFER_PENDING]: { label: "", description: "" },
    [ListingStatus.SOLD]: { label: "", description: "" },
    [ListingStatus.WITHDRAWN]: { label: "", description: "" },
    [ListingStatus.EXPIRED]: { label: "", description: "" },
  };

  return { toStatus, ...labels[toStatus] };
}
