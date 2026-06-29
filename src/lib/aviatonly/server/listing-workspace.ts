import {
  DocumentStatus,
  isLiveStatus,
  ListingStatus,
  OfferStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { getListingEventLabel } from "@/lib/aviatonly/mock/activity";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import { parseListingEventTaskSummaries } from "@/lib/aviatonly/domain/listing-event-tasks";
import type {
  ListingWorkspaceOverview,
  MockAircraftAirframe,
  MockAircraftAvionics,
  MockAircraftDocument,
  MockAircraftEngine,
  MockAircraftListing,
  MockAircraftMaintenance,
  MockAircraftPhoto,
  MockAircraftPropeller,
  MockDeal,
  MockListingEvent,
  MockListingFieldReview,
  MockListingReviewTask,
  WorkspacePrimaryCta,
} from "@/lib/aviatonly/mock/types";
import {
  mapAirframeRecord,
  mapAvionicsRecord,
  mapDealRecord,
  mapDocumentRecord,
  mapEngineRecord,
  mapFieldReviewRecord,
  mapListingEventRecord,
  mapListingRecord,
  mapMaintenanceRecord,
  mapPhotoRecord,
  mapPropellerRecord,
  mapReviewTaskRecord,
} from "./listing-mappers";
import { queryListingById, type ListingWithDetails } from "./listings";
import { prisma } from "@/lib/prisma";

export interface ListingWorkspaceData {
  listing: MockAircraftListing;
  overview: ListingWorkspaceOverview;
  airframe: MockAircraftAirframe | null;
  engines: MockAircraftEngine[];
  propellers: MockAircraftPropeller[];
  avionics: MockAircraftAvionics | null;
  maintenance: MockAircraftMaintenance | null;
  photos: MockAircraftPhoto[];
  documents: MockAircraftDocument[];
  openTasks: MockListingReviewTask[];
  draftTasks: MockListingReviewTask[];
  fieldReviews: MockListingFieldReview[];
  intakeReviewFinalizedAt: string | null;
  intakeReviewTasksReleasedAt: string | null;
  deal: MockDeal | null;
  events: MockListingEvent[];
}

function deriveMissingItems(
  documents: MockAircraftDocument[],
  blockingTasks: MockListingReviewTask[],
): string[] {
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

  blockingTasks.forEach((t) => {
    if (!items.some((i) => i.toLowerCase().includes(t.title.toLowerCase().slice(0, 12)))) {
      items.push(t.title);
    }
  });

  return items.slice(0, 4);
}

async function countActiveOffers(listingId: string): Promise<number> {
  return prisma.offer.count({
    where: {
      listingId,
      status: {
        in: [OfferStatus.RECEIVED, OfferStatus.UNDER_REVIEW, OfferStatus.SELLER_COUNTERED],
      },
    },
  });
}

async function countLeads(listingId: string): Promise<number> {
  return prisma.lead.count({ where: { listingId } });
}

function deriveNextAction(
  listing: MockAircraftListing,
  blockingTasks: MockListingReviewTask[],
  offerCount: number,
): string {
  if (blockingTasks.length > 0) {
    return blockingTasks[0].title;
  }
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

function derivePrimaryCta(
  listing: MockAircraftListing,
  blockingSellerTasks: MockListingReviewTask[],
  offerCount: number,
  hasDeal: boolean,
): WorkspacePrimaryCta {
  const base = `/dashboard/listings/${listing.id}`;

  if (listing.status === ListingStatus.DRAFT) {
    return {
      label: "Resume intake wizard",
      href: `/dashboard/seller/upload?listingId=${listing.id}`,
    };
  }

  if (blockingSellerTasks.length > 0 || listing.status === ListingStatus.NEEDS_CHANGES) {
    return { label: "Fix review items", href: `${base}?tab=review-tasks` };
  }

  if (offerCount > 0) {
    return {
      label: `Review ${offerCount} offer${offerCount === 1 ? "" : "s"}`,
      href: `${base}?tab=leads-offers`,
    };
  }

  if (hasDeal) {
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

function buildOverviewFromRecord(
  record: ListingWithDetails,
  listing: MockAircraftListing,
  leadCount: number,
  offerCount: number,
): ListingWorkspaceOverview {
  const documents = record.documents.map(mapDocumentRecord);
  const blockingTasks = record.reviewTasks
    .filter((t) => t.blockingPublication && t.releasedToSeller)
    .map(mapReviewTaskRecord);
  const blockingSellerTasks = blockingTasks.filter(
    (t) => t.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );
  const hasDeal = record.deals.length > 0;

  const recentActivity = record.events.slice(0, 5).map((event) => ({
    id: event.id,
    type: getListingEventLabel(event.type),
    registration: listing.registration,
    message: event.message ?? "",
    timeAgo: formatTimeAgo(event.createdAt.toISOString()),
    tasks: parseListingEventTaskSummaries(
      (event.metadata as Record<string, unknown> | null) ?? null,
    ),
  }));

  return {
    listingId: listing.id,
    nextAction: deriveNextAction(listing, blockingTasks, offerCount),
    primaryCta: derivePrimaryCta(listing, blockingSellerTasks, offerCount, hasDeal),
    blockingTasks,
    recentActivity,
    missingItems: deriveMissingItems(documents, blockingTasks),
    leadCount,
    offerCount,
    photoCount: record.photos.length,
    documentCount: record.documents.length,
    hasActiveDeal: hasDeal,
  };
}

export async function getListingWorkspaceData(
  listingId: string,
): Promise<ListingWorkspaceData | null> {
  const record = await queryListingById(listingId);
  if (!record) return null;

  const listing = mapListingRecord(record);
  const [leadCount, offerCount] = await Promise.all([
    countLeads(listing.id),
    countActiveOffers(listing.id),
  ]);

  const allTasks = record.reviewTasks.map(mapReviewTaskRecord);
  const openTasks = allTasks.filter(
    (t) =>
      t.releasedToSeller &&
      t.status !== ReviewTaskStatus.DONE &&
      t.status !== ReviewTaskStatus.CANCELLED,
  );
  const draftTasks = allTasks.filter((t) => !t.releasedToSeller);

  const deal = record.deals[0]
    ? mapDealRecord(record.deals[0])
    : null;

  return {
    listing,
    overview: buildOverviewFromRecord(record, listing, leadCount, offerCount),
    airframe: record.airframe ? mapAirframeRecord(record.airframe) : null,
    engines: record.engines.map(mapEngineRecord),
    propellers: record.propellers.map(mapPropellerRecord),
    avionics: record.avionics ? mapAvionicsRecord(record.avionics) : null,
    maintenance: record.maintenance ? mapMaintenanceRecord(record.maintenance) : null,
    photos: record.photos.map(mapPhotoRecord),
    documents: record.documents.map(mapDocumentRecord),
    openTasks,
    draftTasks,
    fieldReviews: record.fieldReviews.map(mapFieldReviewRecord),
    intakeReviewFinalizedAt: record.intakeReviewFinalizedAt?.toISOString() ?? null,
    intakeReviewTasksReleasedAt: record.intakeReviewTasksReleasedAt?.toISOString() ?? null,
    deal,
    events: record.events.map(mapListingEventRecord),
  };
}

export async function countPhotoIssuesForListing(listingId: string): Promise<number> {
  return prisma.aircraftPhoto.count({
    where: {
      listingId,
      status: { in: ["REJECTED", "NEEDS_REPLACEMENT"] },
    },
  });
}

export async function countMissingDocumentsForListing(listingId: string): Promise<number> {
  return prisma.aircraftDocument.count({
    where: {
      listingId,
      reviewStatus: { in: [DocumentStatus.MISSING, DocumentStatus.NEEDS_REPLACEMENT] },
    },
  });
}
