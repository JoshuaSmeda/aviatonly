import type { Prisma } from "@prisma/client";
import {
  LEAD_ACTIVITY_TYPE_LABELS,
  LeadActivityType,
  LeadPriority,
  LeadSource,
  BuyerVerificationStatus,
  LeadStatus,
  LeadType,
  ListingStatus,
} from "@/lib/aviatonly/domain";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import { prisma } from "@/lib/prisma";
import { aircraftTitle, countLeadsInDatabase } from "./leads";
import type { LeadWorkspaceView } from "./lead-workspace-types";

const workspaceInclude = {
  listing: {
    select: {
      id: true,
      registration: true,
      make: true,
      model: true,
      year: true,
      status: true,
      airfield: true,
      province: true,
    },
  },
  buyer: { select: { id: true, name: true, email: true } },
  seller: { select: { id: true, name: true, email: true } },
  assignee: { select: { id: true, name: true } },
  activities: {
    orderBy: { createdAt: "desc" as const },
    include: {
      actor: { select: { name: true, email: true } },
    },
  },
} satisfies Prisma.LeadInclude;

function listingLocation(airfield: string, province: string): string {
  return `${airfield} · ${province}`;
}

function mapActivity(
  activity: Prisma.LeadActivityGetPayload<{
    include: { actor: { select: { name: true; email: true } } };
  }>,
): LeadWorkspaceView["activities"][number] {
  const type = activity.type as LeadActivityType;
  return {
    id: activity.id,
    type,
    label: LEAD_ACTIVITY_TYPE_LABELS[type] ?? activity.type,
    message: activity.message,
    actorName: activity.actor?.name ?? activity.actor?.email ?? null,
    createdAt: activity.createdAt.toISOString(),
    timeAgo: formatTimeAgo(activity.createdAt.toISOString()),
  };
}

export async function queryLeadWorkspace(
  leadId: string,
  detailBasePath: string,
): Promise<LeadWorkspaceView | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: workspaceInclude,
  });

  if (!lead) return null;

  const priorLeads = await prisma.lead.findMany({
    where: {
      buyerId: lead.buyerId,
      id: { not: lead.id },
    },
    include: {
      listing: {
        select: { id: true, registration: true, make: true, model: true, year: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    id: lead.id,
    listingId: lead.listingId,
    status: lead.status as LeadStatus,
    type: lead.type as LeadType,
    priority: lead.priority as LeadPriority,
    source: lead.source as LeadSource,
    message: lead.message,
    buyerVerification: lead.buyerVerificationStatus as BuyerVerificationStatus,
    internalNotes: lead.internalNotes,
    nextFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null,
    lastContactedAt: lead.lastContactedAt?.toISOString() ?? null,
    closedReason: lead.closedReason,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    buyer: {
      id: lead.buyer.id,
      name: lead.buyer.name ?? "Buyer",
      email: lead.buyer.email,
    },
    seller: {
      id: lead.seller.id,
      name: lead.seller.name ?? "Seller",
      email: lead.seller.email,
    },
    assignee: lead.assignee
      ? { id: lead.assignee.id, name: lead.assignee.name ?? "Assignee" }
      : null,
    listing: {
      id: lead.listing.id,
      registration: lead.listing.registration,
      title: aircraftTitle(lead.listing),
      status: lead.listing.status as ListingStatus,
      location: listingLocation(lead.listing.airfield, lead.listing.province),
      href: `/dashboard/listings/${lead.listing.id}`,
    },
    priorEnquiries: priorLeads.map((item) => ({
      id: item.id,
      registration: item.listing.registration,
      aircraftTitle: aircraftTitle(item.listing),
      status: item.status as LeadStatus,
      createdAt: item.createdAt.toISOString(),
      detailHref: `${detailBasePath}/${item.id}`,
    })),
    activities: lead.activities.map(mapActivity),
  };
}

async function buildMockLeadWorkspace(
  leadId: string,
  detailBasePath: string,
): Promise<LeadWorkspaceView | null> {
  const { getMockLeadById, MOCK_LEADS } = await import("@/lib/aviatonly/mock/leads");
  const { MOCK_LISTINGS, listingLocation: mockListingLocation, listingTitle } =
    await import("@/lib/aviatonly/mock/listings");
  const { getMockUserById } = await import("@/lib/aviatonly/mock/users");
  const { LeadPriority, LeadSource } = await import("@/lib/aviatonly/domain");

  const lead = getMockLeadById(leadId);
  if (!lead) return null;

  const listing = MOCK_LISTINGS.find((l) => l.id === lead.listingId);
  const buyer = getMockUserById(lead.buyerId);
  const seller = getMockUserById(lead.sellerId);
  if (!listing || !buyer || !seller) return null;

  const activities: LeadWorkspaceView["activities"] = [
    {
      id: `${lead.id}-created`,
      type: LeadActivityType.LEAD_CREATED,
      label: LEAD_ACTIVITY_TYPE_LABELS[LeadActivityType.LEAD_CREATED],
      message: lead.message,
      actorName: buyer.name ?? buyer.email,
      createdAt: lead.createdAt,
      timeAgo: formatTimeAgo(lead.createdAt),
    },
  ];

  if (lead.status !== LeadStatus.NEW) {
    activities.unshift({
      id: `${lead.id}-status`,
      type: LeadActivityType.STATUS_CHANGED,
      label: LEAD_ACTIVITY_TYPE_LABELS[LeadActivityType.STATUS_CHANGED],
      message: `Status updated to ${lead.status}.`,
      actorName: seller.name ?? seller.email,
      createdAt: lead.updatedAt,
      timeAgo: formatTimeAgo(lead.updatedAt),
    });
  }

  const priorEnquiries = MOCK_LEADS.filter(
    (item) => item.buyerId === lead.buyerId && item.id !== lead.id,
  )
    .slice(0, 5)
    .map((item) => {
      const priorListing = MOCK_LISTINGS.find((l) => l.id === item.listingId);
      return {
        id: item.id,
        registration: priorListing?.registration ?? "",
        aircraftTitle: priorListing ? listingTitle(priorListing) : "",
        status: item.status,
        createdAt: item.createdAt,
        detailHref: `${detailBasePath}/${item.id}`,
      };
    });

  return {
    id: lead.id,
    listingId: lead.listingId,
    status: lead.status,
    type: lead.type,
    priority: LeadPriority.NORMAL,
    source: LeadSource.PUBLIC_LISTING,
    message: lead.message,
    buyerVerification: lead.verificationStatus as BuyerVerificationStatus,
    internalNotes: null,
    nextFollowUpAt: null,
    lastContactedAt:
      lead.status === LeadStatus.CONTACTED ? lead.updatedAt : null,
    closedReason: lead.status === LeadStatus.CLOSED ? "Closed in demo data." : null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    buyer: {
      id: buyer.id,
      name: buyer.name ?? "Buyer",
      email: buyer.email,
    },
    seller: {
      id: seller.id,
      name: seller.name ?? "Seller",
      email: seller.email,
    },
    assignee: null,
    listing: {
      id: listing.id,
      registration: listing.registration,
      title: listingTitle(listing),
      status: listing.status,
      location: mockListingLocation(listing),
      href: `/dashboard/listings/${listing.id}`,
    },
    priorEnquiries,
    activities,
  };
}

export async function getLeadWorkspace(
  leadId: string,
  detailBasePath: string,
): Promise<LeadWorkspaceView | null> {
  try {
    const count = await countLeadsInDatabase();
    if (count > 0) {
      const workspace = await queryLeadWorkspace(leadId, detailBasePath);
      if (workspace) return workspace;
    }
  } catch {
    // fall through to mock
  }

  return buildMockLeadWorkspace(leadId, detailBasePath);
}
