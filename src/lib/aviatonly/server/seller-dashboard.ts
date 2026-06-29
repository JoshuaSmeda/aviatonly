import {
  BuyerActivityType,
  DealStatus,
  DocumentStatus,
  LeadStatus,
  LeadType,
  ListingStatus,
  OfferStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { getListingEventLabel } from "@/lib/aviatonly/mock/activity";
import { formatTimeAgo, formatZar } from "@/lib/aviatonly/mock/format";
import type {
  ActionRequiredItem,
  ActivityFeedItem,
  BuyerActivityFeedItem,
  DealProgressSummary,
  ReviewQueueRow,
  SellerAircraftSummary,
} from "@/lib/aviatonly/mock/types";
import { prisma } from "@/lib/prisma";
import { listingLocation, listingTitle, mapListingRecord } from "./listing-mappers";
import {
  countMissingDocumentsForListing,
  countPhotoIssuesForListing,
} from "./listing-workspace";
import { queryListingsForSeller, queryReviewQueueListings } from "./listings";

export interface SellerDashboardData {
  aircraft: SellerAircraftSummary[];
  actionItems: ActionRequiredItem[];
  buyerActivity: BuyerActivityFeedItem[];
  dealProgress: DealProgressSummary[];
  recentActivity: ActivityFeedItem[];
}

async function countActiveOffersForListing(listingId: string): Promise<number> {
  return prisma.offer.count({
    where: {
      listingId,
      status: {
        in: [OfferStatus.RECEIVED, OfferStatus.UNDER_REVIEW, OfferStatus.SELLER_COUNTERED],
      },
    },
  });
}

async function countLeadsForListing(listingId: string): Promise<number> {
  return prisma.lead.count({ where: { listingId } });
}

async function deriveMissingItems(listingId: string): Promise<string[]> {
  const [documents, tasks] = await Promise.all([
    prisma.aircraftDocument.findMany({ where: { listingId } }),
    prisma.listingReviewTask.findMany({
      where: { listingId, blockingPublication: true, status: { not: ReviewTaskStatus.DONE } },
    }),
  ]);

  const items: string[] = [];
  documents
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

  tasks.forEach((t) => {
    if (!items.some((i) => i.toLowerCase().includes(t.title.toLowerCase().slice(0, 12)))) {
      items.push(t.title);
    }
  });

  return items.slice(0, 4);
}

async function deriveNextAction(
  listingId: string,
  status: ListingStatus,
): Promise<string> {
  const [blockingTasks, offerCount] = await Promise.all([
    prisma.listingReviewTask.findFirst({
      where: { listingId, blockingPublication: true, status: { not: ReviewTaskStatus.DONE } },
      orderBy: { createdAt: "asc" },
    }),
    countActiveOffersForListing(listingId),
  ]);

  if (blockingTasks) return blockingTasks.title;
  if (offerCount > 0) {
    return `Respond to ${offerCount} pending offer${offerCount === 1 ? "" : "s"}`;
  }

  switch (status) {
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

export async function querySellerAircraftSummaries(
  sellerId: string,
): Promise<SellerAircraftSummary[]> {
  const listings = await queryListingsForSeller(sellerId);

  return Promise.all(
    listings.map(async (listing) => {
      const [leads, offers, missingItems, nextAction] = await Promise.all([
        countLeadsForListing(listing.id),
        countActiveOffersForListing(listing.id),
        deriveMissingItems(listing.id),
        deriveNextAction(listing.id, listing.status),
      ]);

      return {
        id: listing.id,
        registration: listing.registration,
        title: listingTitle(listing),
        location: listingLocation(listing),
        status: listing.status,
        completeness: listing.completenessScore,
        missingItems,
        leads,
        offers,
        nextAction,
      };
    }),
  );
}

export async function queryActionRequiredItems(sellerId: string): Promise<ActionRequiredItem[]> {
  const listings = await queryListingsForSeller(sellerId);
  const items: ActionRequiredItem[] = [];

  for (const listing of listings) {
    const title = `${listing.registration} · ${listingTitle(listing)}`;
    const href = `/dashboard/listings/${listing.id}`;

    const blockingTasks = await prisma.listingReviewTask.findMany({
      where: {
        listingId: listing.id,
        status: ReviewTaskStatus.WAITING_ON_SELLER,
        blockingPublication: true,
      },
    });

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

    const pendingOffers = await countActiveOffersForListing(listing.id);
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

    const newLeads = await prisma.lead.count({
      where: { listingId: listing.id, status: LeadStatus.NEW },
    });
    if (
      newLeads > 0 &&
      (listing.status === ListingStatus.LIVE_FIXED_PRICE ||
        listing.status === ListingStatus.LIVE_AUCTION)
    ) {
      items.push({
        id: `act-${listing.id}-leads`,
        registration: listing.registration,
        title,
        description: `${newLeads} new buyer enquir${newLeads === 1 ? "y" : "ies"} to review.`,
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

export async function queryBuyerActivityFeed(
  sellerId: string,
): Promise<BuyerActivityFeedItem[]> {
  const listings = await queryListingsForSeller(sellerId);
  const regByListingId = Object.fromEntries(listings.map((l) => [l.id, l.registration]));

  const [offers, leads] = await Promise.all([
    prisma.offer.findMany({
      where: {
        sellerId,
        status: { in: [OfferStatus.RECEIVED, OfferStatus.UNDER_REVIEW] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.lead.findMany({
      where: {
        sellerId,
        status: { notIn: [LeadStatus.CLOSED, LeadStatus.UNQUALIFIED] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const offerItems = offers.map((o) => ({
    item: {
      id: `ba-offer-${o.id}`,
      type: BuyerActivityType.OFFER,
      registration: regByListingId[o.listingId] ?? "",
      message: `New offer of ${formatZar(o.amount)} received from a verified buyer.`,
      timeAgo: formatTimeAgo(o.createdAt.toISOString()),
    } as BuyerActivityFeedItem,
    createdAt: o.createdAt.toISOString(),
  }));

  const leadItems = leads.map((l) => {
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
        timeAgo: formatTimeAgo(l.createdAt.toISOString()),
      } as BuyerActivityFeedItem,
      createdAt: l.createdAt.toISOString(),
    };
  });

  return [...offerItems, ...leadItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((entry) => entry.item);
}

export async function queryDealProgressSummaries(
  sellerId: string,
): Promise<DealProgressSummary[]> {
  const deals = await prisma.deal.findMany({
    where: { sellerId },
    include: {
      listing: { select: { id: true, registration: true, make: true, model: true, year: true } },
      buyer: { select: { name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return deals.map((deal) => ({
    id: deal.id,
    registration: deal.listing.registration,
    title: listingTitle(deal.listing),
    status: deal.status as DealStatus,
    buyer: deal.buyer.name
      ? `${deal.buyer.name} · verification pending`
      : "Verified buyer",
    agreedPrice: deal.agreedPrice,
    nextAction: deal.nextAction ?? "Deal in progress",
    listingId: deal.listingId,
  }));
}

export async function queryRecentActivityFeed(
  sellerId: string,
  limit = 5,
): Promise<ActivityFeedItem[]> {
  const listings = await queryListingsForSeller(sellerId);
  const listingIds = listings.map((l) => l.id);
  const regByListingId = Object.fromEntries(listings.map((l) => [l.id, l.registration]));

  if (listingIds.length === 0) return [];

  const events = await prisma.listingEvent.findMany({
    where: { listingId: { in: listingIds } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return events.map((event) => ({
    id: event.id,
    type: getListingEventLabel(event.type),
    registration: regByListingId[event.listingId] ?? "",
    message: event.message ?? "",
    timeAgo: formatTimeAgo(event.createdAt.toISOString()),
  }));
}

export async function queryReviewQueueRows(): Promise<ReviewQueueRow[]> {
  const listings = await queryReviewQueueListings();

  return Promise.all(
    listings.map(async (listing) => {
      const mapped = mapListingRecord(listing);
      const [missingDocs, photoIssues] = await Promise.all([
        countMissingDocumentsForListing(listing.id),
        countPhotoIssuesForListing(listing.id),
      ]);

      const adminTask = listing.reviewTasks.find(
        (t) => t.assignedRole === "ADMIN" && t.status === ReviewTaskStatus.IN_PROGRESS,
      );

      return {
        id: listing.id,
        submittedAt: listing.updatedAt.toISOString(),
        registration: listing.registration,
        aircraftTitle: listingTitle(mapped),
        sellerName: listing.seller.name ?? "Unknown seller",
        completeness: listing.completenessScore,
        missingDocs,
        photoIssues,
        status: mapped.status,
        assignedReviewer: adminTask ? "AVIATONLY Ops" : null,
      };
    }),
  );
}

export async function getSellerDashboardData(sellerId: string): Promise<SellerDashboardData> {
  const [aircraft, actionItems, buyerActivity, dealProgress, recentActivity] = await Promise.all([
    querySellerAircraftSummaries(sellerId),
    queryActionRequiredItems(sellerId),
    queryBuyerActivityFeed(sellerId),
    queryDealProgressSummaries(sellerId),
    queryRecentActivityFeed(sellerId),
  ]);

  return { aircraft, actionItems, buyerActivity, dealProgress, recentActivity };
}
