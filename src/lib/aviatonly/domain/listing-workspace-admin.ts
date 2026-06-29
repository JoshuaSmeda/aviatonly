import { ListingStatus } from "./listing-status";
import type { WorkspacePrimaryCta } from "@/lib/aviatonly/mock/types";

export function deriveAdminNextAction(status: ListingStatus): string {
  switch (status) {
    case ListingStatus.SUBMITTED:
    case ListingStatus.UNDER_REVIEW:
      return "Tick every row on Aircraft Data, Media, and Documents";
    case ListingStatus.NEEDS_CHANGES:
      return "Waiting for seller to fix items and resubmit";
    case ListingStatus.VALUATION_READY:
      return "Intake approved — confirm valuation";
    default:
      return "No intake review action required";
  }
}

export function deriveAdminPrimaryCta(
  listingId: string,
  status: ListingStatus,
): WorkspacePrimaryCta {
  const base = `/dashboard/listings/${listingId}`;

  if (
    status === ListingStatus.SUBMITTED ||
    status === ListingStatus.UNDER_REVIEW
  ) {
    return { label: "Start on aircraft data", href: `${base}?tab=aircraft-data` };
  }

  if (status === ListingStatus.NEEDS_CHANGES) {
    return { label: "View review tasks", href: `${base}?tab=review-tasks` };
  }

  return { label: "Open aircraft data", href: `${base}?tab=aircraft-data` };
}
