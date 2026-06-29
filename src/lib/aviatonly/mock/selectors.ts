import {
  BuyerActivityType,
  DocumentStatus,
  isLiveStatus,
  ListingStatus,
  OfferStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { getListingEventLabel } from "./activity";
import { countMissingDocumentsForListing } from "./documents";
import { getMockDealsForSeller } from "./deals";
import { getMockDealForListing } from "./deals";
import { formatTimeAgo, formatZar } from "./format";
import { getMockLeadsForSeller, countLeadsForListing } from "./leads";
import {
  getMockListingsForSeller,
  listingLocation,
  listingTitle,
  MOCK_LISTINGS,
} from "./listings";
import { countActiveOffersForListing, getMockOffersForSeller } from "./offers";
import { countPhotoIssuesForListing } from "./photos";
import { getMockEventsForSeller } from "./activity";
import { getOpenReviewTasksForListing, MOCK_REVIEW_TASKS } from "./review-tasks";
import type {
  ActionRequiredItem,
  ActivityFeedItem,
  BuyerActivityFeedItem,
  DealProgressSummary,
  ListingWorkspaceOverview,
  ReviewQueueRow,
  SellerAircraftSummary,
  WorkspacePrimaryCta,
} from "./types";
import { DEMO_SELLER_ID, getMockUserById } from "./users";
import { getMockDocumentsForListing } from "./documents";
import { getMockEventsForListing } from "./activity";
import { getMockPhotosForListing } from "./photos";
import type { MockAircraftListing } from "./types";

const REVIEW_QUEUE_STATUSES: ListingStatus[] = [
  ListingStatus.SUBMITTED,
  ListingStatus.UNDER_REVIEW,
  ListingStatus.NEEDS_CHANGES,
  ListingStatus.VALUATION_READY,
  ListingStatus.INSPECTION_PENDING,
];

function deriveMissingItems(listingId: string): string[] {
  const items: string[] = [];

  getMockDocumentsForListing(listingId)
    .filter(
      (d) =>
        d.reviewStatus === DocumentStatus.MISSING ||
        d.reviewStatus === DocumentStatus.NEEDS_REPLACEMENT,
    )
    .forEach((d) => {
      if (d.reviewStatus === DocumentStatus.MISSING) {
        items.push(d.documentType.replace(/-/g, " "));
      } else {
        items.push(`${d.documentType.replace(/-/g, " ")} (needs replacement)`);
      }
    });

  getOpenReviewTasksForListing(listingId)
    .filter((t) => t.blockingPublication)
    .forEach((t) => {
      if (!items.some((i) => i.toLowerCase().includes(t.title.toLowerCase().slice(0, 12)))) {
        items.push(t.title);
      }
    });

  return items.slice(0, 4);
}

function deriveNextAction(listing: { id: string; status: ListingStatus; completenessScore: number }): string {
  const openTasks = getOpenReviewTasksForListing(listing.id).filter((t) => t.blockingPublication);
  if (openTasks.length > 0) {
    return openTasks[0].title;
  }

  const offerCount = countActiveOffersForListing(listing.id);
  if (offerCount > 0) {
    return `Respond to ${offerCount} pending offer${offerCount === 1 ? "" : "s"}`;
  }

  switch (listing.status) {
    case ListingStatus.DRAFT:
      return "Finish the intake wizard to submit for review";
    case ListingStatus.VALUATION_READY:
      return "Confirm pricing before AVIATONLY approves publication";
    case ListingStatus.UNDER_CONTRACT:
      return "Awaiting buyer deposit verification";
    case ListingStatus.LIVE_FIXED_PRICE:
    case ListingStatus.LIVE_AUCTION:
      return "Monitor buyer enquiries and offers";
    default:
      return "AVIATONLY is reviewing your submission";
  }
}

export function buildSellerAircraftSummaries(sellerId = DEMO_SELLER_ID): SellerAircraftSummary[] {
  return getMockListingsForSeller(sellerId).map((listing) => ({
    id: listing.id,
    registration: listing.registration,
    title: listingTitle(listing),
    location: listingLocation(listing),
    status: listing.status,
    completeness: listing.completenessScore,
    missingItems: deriveMissingItems(listing.id),
    leads: countLeadsForListing(listing.id),
    offers: countActiveOffersForListing(listing.id),
    nextAction: deriveNextAction(listing),
  }));
}

export function buildActionRequiredItems(sellerId = DEMO_SELLER_ID): ActionRequiredItem[] {
  const listings = getMockListingsForSeller(sellerId);
  const items: ActionRequiredItem[] = [];

  for (const listing of listings) {
    const title = `${listing.registration} · ${listingTitle(listing)}`;
    const href = `/dashboard/listings/${listing.id}`;

    const blockingTasks = getOpenReviewTasksForListing(listing.id).filter(
      (t) => t.status === ReviewTaskStatus.WAITING_ON_SELLER && t.blockingPublication,
    );

    if (blockingTasks.length > 0) {
      items.push({
        id: `act-${listing.id}-tasks`,
        registration: listing.registration,
        title,
        description: blockingTasks.map((t) => t.title).join(" · "),
        ctaLabel: listing.status === ListingStatus.DRAFT ? "Resume wizard" : "Fix now",
        href: listing.status === ListingStatus.DRAFT ? "/dashboard/seller/upload" : href,
        urgent: listing.status === ListingStatus.NEEDS_CHANGES,
      });
    }

    const pendingOffers = countActiveOffersForListing(listing.id);
    if (
      pendingOffers > 0 &&
      (listing.status === ListingStatus.LIVE_FIXED_PRICE ||
        listing.status === ListingStatus.LIVE_AUCTION)
    ) {
      items.push({
        id: `act-${listing.id}-offers`,
        registration: listing.registration,
        title,
        description: `${pendingOffers} buyer offer${pendingOffers === 1 ? "" : "s"} awaiting your response.`,
        ctaLabel: "View offers",
        href,
        urgent: true,
      });
    }
  }

  const draft = listings.find((l) => l.status === ListingStatus.DRAFT);
  if (draft && !items.some((i) => i.id === `act-${draft.id}-tasks`)) {
    items.push({
      id: `act-${draft.id}-draft`,
      registration: draft.registration,
      title: `${draft.registration} · ${listingTitle(draft)}`,
      description: `Draft listing is ${draft.completenessScore}% complete. Finish the wizard to submit for review.`,
      ctaLabel: "Resume wizard",
      href: "/dashboard/seller/upload",
    });
  }

  return items;
}

export function buildBuyerActivityFeed(sellerId = DEMO_SELLER_ID): BuyerActivityFeedItem[] {
  const listings = getMockListingsForSeller(sellerId);
  const regByListingId = Object.fromEntries(listings.map((l) => [l.id, l.registration]));

  const offerItems = getMockOffersForSeller(sellerId)
    .filter((o) => o.status === OfferStatus.RECEIVED || o.status === OfferStatus.UNDER_REVIEW)
    .map((o) => ({
      item: {
        id: `ba-offer-${o.id}`,
        type: BuyerActivityType.OFFER,
        registration: regByListingId[o.listingId] ?? "",
        message: `New offer of ${formatZar(o.amount)} received from a verified buyer.`,
        timeAgo: formatTimeAgo(o.createdAt),
      } as BuyerActivityFeedItem,
      createdAt: o.createdAt,
    }));

  const leadItems = getMockLeadsForSeller(sellerId).map((l) => {
    const isDocRequest =
      l.message.toLowerCase().includes("logbook") ||
      l.message.toLowerCase().includes("document") ||
      l.message.toLowerCase().includes("access");
    return {
      item: {
        id: `ba-lead-${l.id}`,
        type: isDocRequest ? BuyerActivityType.DOC_REQUEST : BuyerActivityType.ENQUIRY,
        registration: regByListingId[l.listingId] ?? "",
        message: l.message,
        timeAgo: formatTimeAgo(l.createdAt),
      } as BuyerActivityFeedItem,
      createdAt: l.createdAt,
    };
  });

  return [...offerItems, ...leadItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((entry) => entry.item);
}

export function buildDealProgressSummaries(sellerId = DEMO_SELLER_ID): DealProgressSummary[] {
  return getMockDealsForSeller(sellerId).map((deal) => {
    const listing = MOCK_LISTINGS.find((l) => l.id === deal.listingId);
    const buyer = getMockUserById(deal.buyerId);
    return {
      id: deal.id,
      registration: listing?.registration ?? "",
      title: listing ? listingTitle(listing) : "",
      status: deal.status,
      buyer: buyer
        ? `${buyer.name ?? buyer.email} · ${buyer.verificationStatus === "VERIFIED" ? "FICA cleared" : "verification pending"}`
        : "Verified buyer",
      agreedPrice: deal.agreedPrice,
      nextAction: deal.nextAction,
      listingId: deal.listingId,
    };
  });
}

export function buildRecentActivityFeed(sellerId = DEMO_SELLER_ID, limit = 5): ActivityFeedItem[] {
  const listingIds = getMockListingsForSeller(sellerId).map((l) => l.id);
  const regByListingId = Object.fromEntries(
    getMockListingsForSeller(sellerId).map((l) => [l.id, l.registration]),
  );

  return getMockEventsForSeller(sellerId, listingIds)
    .slice(0, limit)
    .map((event) => ({
      id: event.id,
      type: getListingEventLabel(event.type),
      registration: regByListingId[event.listingId] ?? "",
      message: event.message ?? "",
      timeAgo: formatTimeAgo(event.createdAt),
    }));
}

export function buildReviewQueueRows(): ReviewQueueRow[] {
  return MOCK_LISTINGS
    .filter((l) => REVIEW_QUEUE_STATUSES.includes(l.status))
    .map((listing) => {
      const seller = getMockUserById(listing.sellerId);
      return {
        id: listing.id,
        submittedAt: listing.updatedAt,
        registration: listing.registration,
        aircraftTitle: listingTitle(listing),
        sellerName: seller?.name ?? "Unknown seller",
        completeness: listing.completenessScore,
        missingDocs: countMissingDocumentsForListing(listing.id),
        photoIssues: countPhotoIssuesForListing(listing.id),
        status: listing.status,
        assignedReviewer:
          listing.id === "zs-mno" ? "AVIATONLY Ops" : null,
      };
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

function derivePrimaryCta(listing: MockAircraftListing): WorkspacePrimaryCta {
  const base = `/dashboard/listings/${listing.id}`;
  const blockingSellerTasks = getOpenReviewTasksForListing(listing.id).filter(
    (t) => t.blockingPublication && t.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );
  const offerCount = countActiveOffersForListing(listing.id);
  const deal = getMockDealForListing(listing.id);

  if (listing.status === ListingStatus.DRAFT) {
    return { label: "Resume intake wizard", href: "/dashboard/seller/upload" };
  }

  if (blockingSellerTasks.length > 0 || listing.status === ListingStatus.NEEDS_CHANGES) {
    const firstTask = blockingSellerTasks[0];
    const title = firstTask?.title.toLowerCase() ?? "";
    const tab =
      title.includes("photo") || title.includes("cockpit") || title.includes("propeller")
        ? "media"
        : title.includes("document") ||
            title.includes("mpi") ||
            title.includes("logbook") ||
            title.includes("stamp")
          ? "documents"
          : "review-tasks";
    return { label: "Resolve blocking tasks", href: `${base}?tab=${tab}` };
  }

  if (offerCount > 0) {
    return {
      label: `Review ${offerCount} offer${offerCount === 1 ? "" : "s"}`,
      href: `${base}?tab=leads-offers`,
    };
  }

  if (deal) {
    return { label: "Open deal room", href: `${base}?tab=deal-room` };
  }

  if (listing.status === ListingStatus.VALUATION_READY) {
    return { label: "Confirm pricing", href: `${base}?tab=valuation` };
  }

  if (listing.status === ListingStatus.APPROVED_FOR_LISTING) {
    return { label: "Preview listing", href: `${base}?tab=preview` };
  }

  if (listing.status === ListingStatus.INSPECTION_PENDING) {
    return { label: "View inspection status", href: `${base}?tab=inspection` };
  }

  if (isLiveStatus(listing.status)) {
    return { label: "View leads & offers", href: `${base}?tab=leads-offers` };
  }

  return { label: "View aircraft data", href: `${base}?tab=aircraft-data` };
}

export function buildListingWorkspaceOverview(listingId: string): ListingWorkspaceOverview | null {
  const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
  if (!listing) {
    return null;
  }

  const blockingTasks = getOpenReviewTasksForListing(listingId).filter((t) => t.blockingPublication);
  const events = getMockEventsForListing(listingId)
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      type: getListingEventLabel(event.type),
      registration: listing.registration,
      message: event.message ?? "",
      timeAgo: formatTimeAgo(event.createdAt),
    }));

  return {
    listingId,
    nextAction: deriveNextAction(listing),
    primaryCta: derivePrimaryCta(listing),
    blockingTasks,
    recentActivity: events,
    missingItems: deriveMissingItems(listingId),
    leadCount: countLeadsForListing(listingId),
    offerCount: countActiveOffersForListing(listingId),
    photoCount: getMockPhotosForListing(listingId).length,
    documentCount: getMockDocumentsForListing(listingId).length,
    hasActiveDeal: Boolean(getMockDealForListing(listingId)),
  };
}

export function countOpenSellerTasks(sellerId = DEMO_SELLER_ID): number {
  const listingIds = getMockListingsForSeller(sellerId).map((l) => l.id);
  return MOCK_REVIEW_TASKS.filter(
    (t) =>
      listingIds.includes(t.listingId) &&
      t.status !== ReviewTaskStatus.DONE &&
      t.status !== ReviewTaskStatus.CANCELLED,
  ).length;
}
