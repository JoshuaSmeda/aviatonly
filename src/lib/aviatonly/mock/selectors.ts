import {
  BuyerActivityType,
  deriveSellerListingNextStep,
  DocumentStatus,
  LeadStatus,
  LeadType,
  ListingStatus,
  OfferStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { getListingEventLabel } from "./activity";
import { countMissingDocumentsForListing } from "./documents";
import { getMockDealsForSeller } from "./deals";
import { getMockDealForListing } from "./deals";
import { formatTimeAgo, formatZar } from "./format";
import { getMockLeadsForSeller, countLeadsForListing, MOCK_LEADS, getMockLeadsForListing } from "./leads";
import {
  getMockListingsForSeller,
  listingLocation,
  listingTitle,
  MOCK_LISTINGS,
} from "./listings";
import { countActiveOffersForListing, getMockOffersForSeller, MOCK_OFFERS } from "./offers";
import { countPhotoIssuesForListing } from "./photos";
import { getMockEventsForSeller } from "./activity";
import { getOpenReviewTasksForListing, MOCK_REVIEW_TASKS } from "./review-tasks";
import type {
  ActionRequiredItem,
  ActivityFeedItem,
  BuyerActivityFeedItem,
  DealProgressSummary,
  LeadTableRow,
  ListingWorkspaceOverview,
  OfferTableRow,
  ReviewQueueRow,
  SellerAircraftSummary,
} from "./types";
import { DEMO_SELLER_ID, getMockUserById } from "./users";
import { getMockDocumentsForListing } from "./documents";
import { getMockEventsForListing } from "./activity";
import { getMockPhotosForListing } from "./photos";

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

function buildSellerNextStepForListing(listing: {
  id: string;
  status: ListingStatus;
}) {
  const blockingSellerTasks = getOpenReviewTasksForListing(listing.id).filter(
    (t) => t.blockingPublication && t.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );

  return deriveSellerListingNextStep({
    listingId: listing.id,
    status: listing.status,
    blockingSellerTasks,
    offerCount: countActiveOffersForListing(listing.id),
    hasDeal: Boolean(getMockDealForListing(listing.id)),
  });
}

export function buildSellerAircraftSummaries(sellerId = DEMO_SELLER_ID): SellerAircraftSummary[] {
  return getMockListingsForSeller(sellerId).map((listing) => {
    const nextStep = buildSellerNextStepForListing(listing);

    return {
      id: listing.id,
      registration: listing.registration,
      title: listingTitle(listing),
      location: listingLocation(listing),
      status: listing.status,
      completeness: listing.completenessScore,
      missingItems: deriveMissingItems(listing.id),
      leads: countLeadsForListing(listing.id),
      offers: countActiveOffersForListing(listing.id),
      nextAction: nextStep.message,
      actionRequired: nextStep.actionRequired,
    };
  });
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
        href: `${href}?tab=leads-offers`,
        urgent: true,
      });
    }

    const newLeads = getMockLeadsForListing(listing.id).filter((l) => l.status === LeadStatus.NEW);
    if (
      newLeads.length > 0 &&
      (listing.status === ListingStatus.LIVE_FIXED_PRICE ||
        listing.status === ListingStatus.LIVE_AUCTION)
    ) {
      items.push({
        id: `act-${listing.id}-leads`,
        registration: listing.registration,
        title,
        description: `${newLeads.length} new buyer enquir${newLeads.length === 1 ? "y" : "ies"} to review.`,
        ctaLabel: "View leads",
        href: `${href}?tab=leads-offers`,
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

  const leadItems = getMockLeadsForSeller(sellerId)
    .filter((l) => l.status !== LeadStatus.CLOSED && l.status !== LeadStatus.UNQUALIFIED)
    .map((l) => {
    const activityType =
      l.type === LeadType.DOCUMENT_ACCESS
        ? BuyerActivityType.DOC_REQUEST
        : BuyerActivityType.ENQUIRY;
    return {
      item: {
        id: `ba-lead-${l.id}`,
        type: activityType,
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
        canStartReview: listing.status === ListingStatus.SUBMITTED && listing.id !== "zs-mno",
      };
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function buildListingWorkspaceOverview(listingId: string): ListingWorkspaceOverview | null {
  const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
  if (!listing) {
    return null;
  }

  const blockingTasks = getOpenReviewTasksForListing(listingId).filter(
    (t) => t.blockingPublication && t.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );
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
    nextStep: buildSellerNextStepForListing(listing),
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

function mapLeadToTableRow(lead: (typeof MOCK_LEADS)[number]): LeadTableRow {
  const listing = MOCK_LISTINGS.find((l) => l.id === lead.listingId);
  const buyer = getMockUserById(lead.buyerId);
  const seller = getMockUserById(lead.sellerId);

  return {
    id: lead.id,
    listingId: lead.listingId,
    registration: listing?.registration ?? "",
    aircraftTitle: listing ? listingTitle(listing) : "",
    sellerName: seller?.name ?? "Unknown seller",
    buyerName: buyer?.name ?? "Buyer",
    buyerEmail: buyer?.email ?? "",
    buyerVerification: buyer?.verificationStatus ?? lead.verificationStatus,
    type: lead.type,
    status: lead.status,
    message: lead.message,
    createdAt: lead.createdAt,
    listingHref: `/dashboard/listings/${lead.listingId}?tab=leads-offers`,
  };
}

function mapOfferToTableRow(offer: (typeof MOCK_OFFERS)[number]): OfferTableRow {
  const listing = MOCK_LISTINGS.find((l) => l.id === offer.listingId);
  const buyer = getMockUserById(offer.buyerId);
  const seller = getMockUserById(offer.sellerId);

  return {
    id: offer.id,
    listingId: offer.listingId,
    registration: listing?.registration ?? "",
    aircraftTitle: listing ? listingTitle(listing) : "",
    sellerName: seller?.name ?? "Unknown seller",
    buyerName: buyer?.name ?? "Buyer",
    buyerEmail: buyer?.email ?? "",
    amount: offer.amount,
    status: offer.status,
    message: offer.message,
    expiresAt: offer.expiresAt,
    createdAt: offer.createdAt,
    listingHref: `/dashboard/listings/${offer.listingId}?tab=leads-offers`,
  };
}

export interface BuildLeadTableRowsOptions {
  sellerId?: string;
  listingId?: string;
  includeClosed?: boolean;
}

export function buildLeadTableRows(options: BuildLeadTableRowsOptions = {}): LeadTableRow[] {
  const { sellerId, listingId, includeClosed = true } = options;
  let leads = sellerId ? getMockLeadsForSeller(sellerId) : [...MOCK_LEADS];

  if (listingId) {
    leads = leads.filter((l) => l.listingId === listingId);
  }

  if (!includeClosed) {
    leads = leads.filter(
      (l) => l.status !== LeadStatus.CLOSED && l.status !== LeadStatus.UNQUALIFIED,
    );
  }

  return leads
    .map(mapLeadToTableRow)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface BuildOfferTableRowsOptions {
  sellerId?: string;
  listingId?: string;
  activeOnly?: boolean;
}

export function buildOfferTableRows(options: BuildOfferTableRowsOptions = {}): OfferTableRow[] {
  const { sellerId, listingId, activeOnly = false } = options;
  let offers = sellerId ? getMockOffersForSeller(sellerId) : [...MOCK_OFFERS];

  if (listingId) {
    offers = offers.filter((o) => o.listingId === listingId);
  }

  if (activeOnly) {
    offers = offers.filter(
      (o) =>
        o.status === OfferStatus.RECEIVED ||
        o.status === OfferStatus.UNDER_REVIEW ||
        o.status === OfferStatus.SELLER_COUNTERED,
    );
  }

  return offers
    .map(mapOfferToTableRow)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
