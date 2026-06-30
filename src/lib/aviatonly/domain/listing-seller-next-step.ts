import { isLiveStatus, ListingStatus } from "./listing-status";
import type { WorkspacePrimaryCta } from "@/lib/aviatonly/mock/types";

export interface ListingWorkspaceNextStep {
  sectionLabel: string;
  message: string;
  actionRequired: boolean;
  primaryCta: WorkspacePrimaryCta | null;
}

export interface DeriveSellerListingNextStepInput {
  listingId: string;
  status: ListingStatus;
  blockingSellerTasks: Array<{ title: string }>;
  offerCount: number;
  hasDeal: boolean;
}

function waitState(message: string): ListingWorkspaceNextStep {
  return {
    sectionLabel: "What's happening now",
    message,
    actionRequired: false,
    primaryCta: null,
  };
}

function actionState(
  message: string,
  primaryCta: WorkspacePrimaryCta,
  sectionLabel = "Your next step",
): ListingWorkspaceNextStep {
  return {
    sectionLabel,
    message,
    actionRequired: true,
    primaryCta,
  };
}

export function deriveSellerListingNextStep(
  input: DeriveSellerListingNextStepInput,
): ListingWorkspaceNextStep {
  const base = `/dashboard/listings/${input.listingId}`;

  if (input.blockingSellerTasks.length > 0) {
    const first = input.blockingSellerTasks[0];
    const extra =
      input.blockingSellerTasks.length > 1
        ? ` (+${input.blockingSellerTasks.length - 1} more)`
        : "";

    return actionState(
      `${first.title}${extra}`,
      {
        label: input.status === ListingStatus.DRAFT ? "Resume intake" : "Fix review items",
        href:
          input.status === ListingStatus.DRAFT
            ? `/dashboard/seller/upload?listingId=${input.listingId}`
            : `${base}?tab=review-tasks`,
      },
    );
  }

  if (input.status === ListingStatus.NEEDS_CHANGES) {
    return actionState("Submit the fixes AVIATONLY requested on your listing", {
      label: "Open review tasks",
      href: `${base}?tab=review-tasks`,
    });
  }

  if (
    input.offerCount > 0 &&
    (isLiveStatus(input.status) || input.status === ListingStatus.UNDER_OFFER)
  ) {
    return actionState(
      `Review and respond to ${input.offerCount} pending offer${input.offerCount === 1 ? "" : "s"}`,
      {
        label: "Review offers",
        href: `${base}?tab=leads-offers`,
      },
    );
  }

  if (input.status === ListingStatus.DRAFT) {
    return actionState("Complete the intake wizard and submit for AVIATONLY review", {
      label: "Resume intake",
      href: `/dashboard/seller/upload?listingId=${input.listingId}`,
    });
  }

  if (input.status === ListingStatus.VALUATION_READY) {
    return actionState(
      "Review AVIATONLY's indicative estimate and check your asking price or auction reserve",
      {
        label: "Review estimate",
        href: `${base}?tab=valuation`,
      },
    );
  }

  if (input.hasDeal) {
    return waitState("Your sale is in progress — AVIATONLY will update you at each milestone");
  }

  switch (input.status) {
    case ListingStatus.SUBMITTED:
      return waitState(
        "Your submission is in the queue. Nothing needed from you.",
      );
    case ListingStatus.UNDER_REVIEW:
      return waitState(
        "Our team is reviewing your aircraft data, photos, and documents. Nothing needed from you.",
      );
    case ListingStatus.INSPECTION_PENDING:
      return waitState(
        "An independent inspection is scheduled or underway. Nothing needed from you.",
      );
    case ListingStatus.INSPECTION_PASSED:
      return waitState(
        "Inspection passed — AVIATONLY is finalizing your listing. Nothing needed from you.",
      );
    case ListingStatus.INSPECTION_FAILED:
      return waitState(
        "Inspection found issues — AVIATONLY will send fix instructions if anything is required from you.",
      );
    case ListingStatus.APPROVED_FOR_LISTING:
      return waitState(
        "Your listing is approved — AVIATONLY will publish when ready. Nothing needed from you.",
      );
    case ListingStatus.LIVE_FIXED_PRICE:
    case ListingStatus.LIVE_AUCTION:
      return waitState(
        "Your aircraft is live — we'll notify you when buyers enquire or make offers.",
      );
    case ListingStatus.UNDER_OFFER:
    case ListingStatus.DEPOSIT_PENDING:
      return waitState("Buyer activity is in progress. Nothing needed from you right now.");
    case ListingStatus.UNDER_CONTRACT:
      return waitState("The deal is under contract — deposit and verification are in progress.");
    case ListingStatus.TRANSFER_PENDING:
      return waitState("SACAA ownership transfer is in progress. Nothing needed from you.");
    case ListingStatus.SOLD:
      return waitState("Sale completed — no further action required.");
    case ListingStatus.WITHDRAWN:
      return waitState("This listing was withdrawn and is no longer active.");
    case ListingStatus.EXPIRED:
      return waitState("This listing has expired and is no longer active.");
    default:
      return waitState("Nothing required from you — AVIATONLY will update you when needed.");
  }
}
