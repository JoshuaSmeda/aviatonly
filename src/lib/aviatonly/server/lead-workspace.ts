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
import { formatTimeAgo, formatLeadFollowUpAt } from "@/lib/aviatonly/mock/format";
import { prisma } from "@/lib/prisma";
import { aircraftTitle } from "./leads";
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
  const metadata = activity.metadata as { nextFollowUpAt?: string | null } | null;
  let message = activity.message;

  if (type === LeadActivityType.FOLLOW_UP_SET) {
    if (metadata?.nextFollowUpAt) {
      message = `Follow-up scheduled for ${formatLeadFollowUpAt(metadata.nextFollowUpAt)}.`;
    } else if (message?.startsWith("Follow-up scheduled for ")) {
      const isoMatch = message.match(
        /Follow-up scheduled for (\d{4}-\d{2}-\d{2}T[\d:.]+Z?)\./,
      );
      if (isoMatch?.[1]) {
        message = `Follow-up scheduled for ${formatLeadFollowUpAt(isoMatch[1])}.`;
      }
    } else if (message === null || message.toLowerCase().includes("cleared")) {
      message = "Follow-up cleared.";
    }
  }

  return {
    id: activity.id,
    type,
    label: LEAD_ACTIVITY_TYPE_LABELS[type] ?? activity.type,
    message,
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

export async function getLeadWorkspace(
  leadId: string,
  detailBasePath: string,
): Promise<LeadWorkspaceView | null> {
  return queryLeadWorkspace(leadId, detailBasePath);
}
