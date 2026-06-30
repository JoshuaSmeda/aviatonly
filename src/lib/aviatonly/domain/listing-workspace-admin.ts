import { ListingStatus } from "./listing-status";
import type { ListingWorkspaceNextStep } from "./listing-seller-next-step";

export function deriveAdminListingNextStep(
  listingId: string,
  status: ListingStatus,
): ListingWorkspaceNextStep {
  const base = `/dashboard/listings/${listingId}`;

  switch (status) {
    case ListingStatus.SUBMITTED:
    case ListingStatus.UNDER_REVIEW:
      return {
        sectionLabel: "Your next step",
        message:
          "Review and tick off every row on Aircraft Data, Media, and Documents before finalizing intake.",
        actionRequired: true,
        primaryCta: { label: "Start intake review", href: `${base}?tab=aircraft-data` },
      };
    case ListingStatus.NEEDS_CHANGES:
      return {
        sectionLabel: "What's happening now",
        message: "Waiting for the seller to fix flagged items and resubmit.",
        actionRequired: false,
        primaryCta: null,
      };
    case ListingStatus.VALUATION_READY:
      return {
        sectionLabel: "Your next step",
        message: "Intake approved — confirm valuation and move the listing toward publication.",
        actionRequired: true,
        primaryCta: { label: "Open valuation", href: `${base}?tab=valuation` },
      };
    case ListingStatus.APPROVED_FOR_LISTING:
      return {
        sectionLabel: "Your next step",
        message: "Listing cleared for publication — publish to the public catalog when ready.",
        actionRequired: true,
        primaryCta: { label: "Preview & publish", href: `${base}?tab=preview` },
      };
    case ListingStatus.INSPECTION_PENDING:
      return {
        sectionLabel: "What's happening now",
        message: "Inspection is scheduled or in progress — no admin action until results are in.",
        actionRequired: false,
        primaryCta: null,
      };
    case ListingStatus.LIVE_FIXED_PRICE:
    case ListingStatus.LIVE_AUCTION:
      return {
        sectionLabel: "What's happening now",
        message: "Listing is live on the catalog — monitor leads, offers, and deal progress.",
        actionRequired: false,
        primaryCta: null,
      };
    default:
      return {
        sectionLabel: "What's happening now",
        message: "No intake review action required on this listing right now.",
        actionRequired: false,
        primaryCta: null,
      };
  }
}

/** @deprecated Use deriveAdminListingNextStep */
export function deriveAdminNextAction(status: ListingStatus): string {
  return deriveAdminListingNextStep("", status).message;
}

/** @deprecated Use deriveAdminListingNextStep */
export function deriveAdminPrimaryCta(
  listingId: string,
  status: ListingStatus,
): { label: string; href: string } {
  const step = deriveAdminListingNextStep(listingId, status);
  return step.primaryCta ?? { label: "Open workspace", href: `/dashboard/listings/${listingId}` };
}
