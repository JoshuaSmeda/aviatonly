import type { Prisma } from "@prisma/client";
import {
  LeadStatus,
  LeadType,
  LeadSource,
  LeadPriority,
  BuyerVerificationStatus,
  LeadActivityType,
} from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import type { LeadTableRow } from "@/lib/aviatonly/mock/types";

export function aircraftTitle(parts: { year: number; make: string; model: string }): string {
  return `${parts.year} ${parts.make} ${parts.model}`;
}

const leadTableInclude = {
  listing: {
    select: {
      id: true,
      registration: true,
      make: true,
      model: true,
      year: true,
    },
  },
  buyer: {
    select: { id: true, name: true, email: true },
  },
  seller: {
    select: { id: true, name: true, email: true },
  },
} satisfies Prisma.LeadInclude;

export interface QueryLeadTableRowsOptions {
  sellerId?: string;
  listingId?: string;
  includeClosed?: boolean;
}

export async function queryLeadTableRows(
  options: QueryLeadTableRowsOptions = {},
): Promise<LeadTableRow[]> {
  const { sellerId, listingId, includeClosed = true } = options;

  const where: Prisma.LeadWhereInput = {};

  if (sellerId) where.sellerId = sellerId;
  if (listingId) where.listingId = listingId;
  if (!includeClosed) {
    where.status = {
      notIn: [LeadStatus.CLOSED, LeadStatus.UNQUALIFIED],
    };
  }

  const leads = await prisma.lead.findMany({
    where,
    include: leadTableInclude,
    orderBy: { createdAt: "desc" },
  });

  return leads.map((lead) => ({
    id: lead.id,
    listingId: lead.listingId,
    registration: lead.listing.registration,
    aircraftTitle: aircraftTitle(lead.listing),
    sellerName: lead.seller.name ?? "Unknown seller",
    buyerName: lead.buyer.name ?? "Buyer",
    buyerEmail: lead.buyer.email,
    buyerVerification: lead.buyerVerificationStatus as LeadTableRow["buyerVerification"],
    type: lead.type as LeadType,
    status: lead.status as LeadStatus,
    message: lead.message,
    createdAt: lead.createdAt.toISOString(),
    listingHref: `/dashboard/listings/${lead.listingId}?tab=leads-offers`,
  }));
}

export async function countLeadsInDatabase(): Promise<number> {
  return prisma.lead.count();
}

export interface CreateLeadInput {
  listingId: string;
  buyerId: string;
  type: LeadType;
  message: string;
  source?: LeadSource;
  priority?: LeadPriority;
  buyerVerificationStatus?: BuyerVerificationStatus;
  actorId?: string;
}

export async function createLeadRecord(input: CreateLeadInput) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new Error("Listing not found.");
  }

  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        listingId: listing.id,
        buyerId: input.buyerId,
        sellerId: listing.sellerId,
        type: input.type,
        message: input.message,
        source: input.source ?? LeadSource.PUBLIC_LISTING,
        priority: input.priority ?? LeadPriority.NORMAL,
        buyerVerificationStatus:
          input.buyerVerificationStatus ?? BuyerVerificationStatus.UNVERIFIED,
        status: LeadStatus.NEW,
      },
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.id,
        actorId: input.actorId ?? input.buyerId,
        type: LeadActivityType.LEAD_CREATED,
        message: "Buyer enquiry submitted.",
        metadata: {
          type: input.type,
          source: input.source ?? LeadSource.PUBLIC_LISTING,
        },
      },
    });

    return lead;
  });
}

export interface TransitionLeadStatusInput {
  leadId: string;
  toStatus: LeadStatus;
  actorId: string;
  message?: string;
  closedReason?: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date | null;
  internalNotesAppend?: string;
}

export async function transitionLeadStatusRecord(input: TransitionLeadStatusInput) {
  const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
  if (!lead) throw new Error("Lead not found.");

  const fromStatus = lead.status as LeadStatus;
  const toStatus = input.toStatus;

  if (toStatus === LeadStatus.CLOSED && !input.closedReason?.trim()) {
    throw new Error("A closed reason is required when closing a lead.");
  }

  const { assertCanTransitionLeadStatus } = await import("@/lib/aviatonly/domain/lead-transitions");
  assertCanTransitionLeadStatus(fromStatus, toStatus);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.lead.update({
      where: { id: input.leadId },
      data: {
        status: toStatus,
        closedReason: toStatus === LeadStatus.CLOSED ? input.closedReason : lead.closedReason,
        lastContactedAt:
          input.lastContactedAt ??
          (toStatus === LeadStatus.CONTACTED ? new Date() : lead.lastContactedAt),
        nextFollowUpAt:
          input.nextFollowUpAt !== undefined ? input.nextFollowUpAt : lead.nextFollowUpAt,
        internalNotes: input.internalNotesAppend
          ? [lead.internalNotes, input.internalNotesAppend].filter(Boolean).join("\n\n")
          : lead.internalNotes,
      },
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.id,
        actorId: input.actorId,
        type: LeadActivityType.STATUS_CHANGED,
        message: input.message ?? `Status changed to ${toStatus}.`,
        metadata: { fromStatus, toStatus },
      },
    });

    return updated;
  });
}

export async function addLeadNoteRecord(leadId: string, actorId: string, note: string) {
  return prisma.$transaction(async (tx) => {
    const activity = await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type: LeadActivityType.NOTE_ADDED,
        message: note,
      },
    });

    const lead = await tx.lead.findUnique({ where: { id: leadId } });
    if (lead) {
      await tx.lead.update({
        where: { id: leadId },
        data: {
          internalNotes: [lead.internalNotes, note].filter(Boolean).join("\n\n"),
        },
      });
    }

    return activity;
  });
}

export async function assignLeadRecord(leadId: string, assigneeId: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.update({
      where: { id: leadId },
      data: { assignedToId: assigneeId },
    });

    await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type: LeadActivityType.ASSIGNED,
        message: "Lead assigned.",
        metadata: { assignedToId: assigneeId },
      },
    });

    return lead;
  });
}

export async function setLeadFollowUpRecord(
  leadId: string,
  actorId: string,
  nextFollowUpAt: Date | null,
) {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.update({
      where: { id: leadId },
      data: { nextFollowUpAt },
    });

    await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type: LeadActivityType.FOLLOW_UP_SET,
        message: nextFollowUpAt
          ? `Follow-up scheduled for ${nextFollowUpAt.toISOString()}.`
          : "Follow-up cleared.",
        metadata: { nextFollowUpAt: nextFollowUpAt?.toISOString() ?? null },
      },
    });

    return lead;
  });
}

export async function scheduleLeadViewingRecord(
  leadId: string,
  actorId: string,
  input?: { scheduledAt?: Date; note?: string },
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found.");

  const fromStatus = lead.status as LeadStatus;
  const toStatus = LeadStatus.VIEWING_REQUESTED;

  const { assertCanTransitionLeadStatus } = await import("@/lib/aviatonly/domain/lead-transitions");

  return prisma.$transaction(async (tx) => {
    if (fromStatus !== toStatus) {
      assertCanTransitionLeadStatus(fromStatus, toStatus);
      await tx.lead.update({
        where: { id: leadId },
        data: { status: toStatus },
      });
      await tx.leadActivity.create({
        data: {
          leadId,
          actorId,
          type: LeadActivityType.STATUS_CHANGED,
          message: "Viewing requested.",
          metadata: { fromStatus, toStatus },
        },
      });
    }

    await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type: LeadActivityType.VIEWING_SCHEDULED,
        message:
          input?.note?.trim() ||
          (input?.scheduledAt
            ? `Viewing scheduled for ${input.scheduledAt.toISOString()}.`
            : "Viewing scheduled with buyer."),
        metadata: { scheduledAt: input?.scheduledAt?.toISOString() ?? null },
      },
    });

    return tx.lead.findUnique({ where: { id: leadId } });
  });
}

export async function logLeadDocAccessRecord(
  leadId: string,
  actorId: string,
  granted: boolean,
  note?: string,
) {
  return prisma.$transaction(async (tx) => {
    await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type: granted
          ? LeadActivityType.DOC_ACCESS_GRANTED
          : LeadActivityType.DOC_ACCESS_DENIED,
        message:
          note?.trim() ||
          (granted
            ? "Document access granted to buyer."
            : "Document access denied."),
      },
    });

    return tx.lead.findUnique({ where: { id: leadId } });
  });
}

export type LeadResponseChannel = "EMAIL" | "CALL";

export async function logLeadBuyerResponseRecord(
  leadId: string,
  actorId: string,
  channel: LeadResponseChannel,
  message: string,
) {
  return prisma.$transaction(async (tx) => {
    const type =
      channel === "EMAIL" ? LeadActivityType.EMAIL_SENT : LeadActivityType.CALL_LOGGED;

    await tx.leadActivity.create({
      data: {
        leadId,
        actorId,
        type,
        message: message.trim(),
        metadata: { channel },
      },
    });

    const lead = await tx.lead.findUnique({ where: { id: leadId } });
    if (lead && lead.status === LeadStatus.NEW) {
      const { assertCanTransitionLeadStatus } = await import(
        "@/lib/aviatonly/domain/lead-transitions"
      );
      assertCanTransitionLeadStatus(LeadStatus.NEW, LeadStatus.CONTACTED);
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: LeadStatus.CONTACTED,
          lastContactedAt: new Date(),
        },
      });
      await tx.leadActivity.create({
        data: {
          leadId,
          actorId,
          type: LeadActivityType.STATUS_CHANGED,
          message: "Marked as contacted after buyer response.",
          metadata: { fromStatus: LeadStatus.NEW, toStatus: LeadStatus.CONTACTED },
        },
      });
    } else if (lead) {
      await tx.lead.update({
        where: { id: leadId },
        data: { lastContactedAt: new Date() },
      });
    }

    return tx.lead.findUnique({ where: { id: leadId } });
  });
}
