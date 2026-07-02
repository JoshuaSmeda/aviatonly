import type { Prisma } from "@prisma/client";
import {
  assertValidLeadMessageBody,
  BuyerVerificationStatus,
  LeadActivityType,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadType,
  canSendLeadMessage,
  resolveLeadThreadParticipantRole,
} from "@/lib/aviatonly/domain";
import { assertCanTransitionLeadStatus } from "@/lib/aviatonly/domain/lead-transitions";
import { AuthorizationError } from "@/lib/aviatonly/server/authorization";
import { aircraftTitle } from "@/lib/aviatonly/server/leads";
import { buildListingSlug } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { prisma } from "@/lib/prisma";

const TERMINAL_LEAD_STATUSES: LeadStatus[] = [LeadStatus.CLOSED, LeadStatus.UNQUALIFIED];

const threadListingSelect = {
  id: true,
  registration: true,
  make: true,
  model: true,
  year: true,
} satisfies Prisma.AircraftListingSelect;

const threadUserSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

export interface CreateLeadWithInitialMessageInput {
  listingId: string;
  buyerId: string;
  type: LeadType;
  body: string;
  source?: LeadSource;
  priority?: LeadPriority;
  buyerVerificationStatus?: BuyerVerificationStatus;
}

export interface LeadThreadRow {
  leadId: string;
  listingId: string;
  registration: string;
  aircraftTitle: string;
  counterpartName: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unread: boolean;
  status: LeadStatus;
}

export interface LeadMessageView {
  id: string;
  leadId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
  isOwnMessage: boolean;
}

export async function findOpenLeadForBuyerListing(buyerId: string, listingId: string) {
  return prisma.lead.findFirst({
    where: {
      buyerId,
      listingId,
      status: { notIn: TERMINAL_LEAD_STATUSES },
    },
    orderBy: { updatedAt: "desc" },
  });
}

async function createLeadMessageActivity(
  tx: Prisma.TransactionClient,
  input: {
    leadId: string;
    actorId: string;
    body: string;
    messageId: string;
  },
) {
  await tx.leadActivity.create({
    data: {
      leadId: input.leadId,
      actorId: input.actorId,
      type: LeadActivityType.MESSAGE_SENT,
      message: input.body,
      metadata: { messageId: input.messageId },
    },
  });
}

async function maybeMarkSellerContactedOnReply(
  tx: Prisma.TransactionClient,
  lead: { id: string; status: LeadStatus; sellerId: string },
  senderId: string,
) {
  if (senderId !== lead.sellerId || lead.status !== LeadStatus.NEW) {
    return;
  }

  assertCanTransitionLeadStatus(LeadStatus.NEW, LeadStatus.CONTACTED);

  await tx.lead.update({
    where: { id: lead.id },
    data: {
      status: LeadStatus.CONTACTED,
      lastContactedAt: new Date(),
    },
  });

  await tx.leadActivity.create({
    data: {
      leadId: lead.id,
      actorId: senderId,
      type: LeadActivityType.STATUS_CHANGED,
      message: "Marked as contacted after seller reply.",
      metadata: { fromStatus: LeadStatus.NEW, toStatus: LeadStatus.CONTACTED },
    },
  });
}

export async function createLeadWithInitialMessage(input: CreateLeadWithInitialMessageInput) {
  const body = assertValidLeadMessageBody(input.body);

  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new Error("Listing not found.");
  }

  const existingLead = await findOpenLeadForBuyerListing(input.buyerId, listing.id);
  if (existingLead) {
    const message = await appendLeadMessage(existingLead.id, input.buyerId, body, {
      isAdmin: false,
    });
    return { lead: existingLead, message, reusedExistingLead: true as const };
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        listingId: listing.id,
        buyerId: input.buyerId,
        sellerId: listing.sellerId,
        type: input.type,
        message: body,
        source: input.source ?? LeadSource.PUBLIC_LISTING,
        priority: input.priority ?? LeadPriority.NORMAL,
        buyerVerificationStatus:
          input.buyerVerificationStatus ?? BuyerVerificationStatus.UNVERIFIED,
        status: LeadStatus.NEW,
        lastMessageAt: now,
        buyerLastReadAt: now,
      },
    });

    const message = await tx.leadMessage.create({
      data: {
        leadId: lead.id,
        senderId: input.buyerId,
        body,
      },
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.id,
        actorId: input.buyerId,
        type: LeadActivityType.LEAD_CREATED,
        message: "Buyer enquiry submitted.",
        metadata: {
          type: input.type,
          source: input.source ?? LeadSource.PUBLIC_LISTING,
        },
      },
    });

    await createLeadMessageActivity(tx, {
      leadId: lead.id,
      actorId: input.buyerId,
      body,
      messageId: message.id,
    });

    return { lead, message, reusedExistingLead: false as const };
  });
}

export async function appendLeadMessage(
  leadId: string,
  senderId: string,
  rawBody: string,
  options: { isAdmin?: boolean } = {},
) {
  const body = assertValidLeadMessageBody(rawBody);

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      status: true,
    },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const status = lead.status as LeadStatus;

  if (!canSendLeadMessage(status)) {
    throw new Error("This conversation is closed and cannot accept new messages.");
  }

  const participantRole = resolveLeadThreadParticipantRole(lead, senderId);
  if (!options.isAdmin && !participantRole) {
    throw new AuthorizationError();
  }

  const now = new Date();
  const readWatermark =
    participantRole === "buyer"
      ? { buyerLastReadAt: now }
      : participantRole === "seller"
        ? { sellerLastReadAt: now }
        : {};

  return prisma.$transaction(async (tx) => {
    const message = await tx.leadMessage.create({
      data: {
        leadId: lead.id,
        senderId,
        body,
      },
    });

    await tx.lead.update({
      where: { id: lead.id },
      data: {
        lastMessageAt: now,
        lastContactedAt: participantRole === "seller" ? now : undefined,
        ...readWatermark,
      },
    });

    await createLeadMessageActivity(tx, {
      leadId: lead.id,
      actorId: senderId,
      body,
      messageId: message.id,
    });

    await maybeMarkSellerContactedOnReply(tx, { ...lead, status }, senderId);

    return message;
  });
}

export async function queryLeadMessages(
  leadId: string,
  viewerId: string,
  options: { cursor?: string; take?: number; isAdmin?: boolean } = {},
): Promise<LeadMessageView[]> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, buyerId: true, sellerId: true },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const participantRole = resolveLeadThreadParticipantRole(lead, viewerId);
  if (!options.isAdmin && !participantRole) {
    throw new AuthorizationError();
  }

  const messages = await prisma.leadMessage.findMany({
    where: { leadId },
    include: {
      sender: { select: threadUserSelect },
    },
    orderBy: { createdAt: "asc" },
    take: options.take ?? 50,
    ...(options.cursor
      ? {
          cursor: { id: options.cursor },
          skip: 1,
        }
      : {}),
  });

  return messages.map((message) => ({
    id: message.id,
    leadId: message.leadId,
    senderId: message.senderId,
    senderName: message.sender.name ?? message.sender.email,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    isOwnMessage: message.senderId === viewerId,
  }));
}

function isThreadUnreadForViewer(
  lead: {
    buyerId: string;
    sellerId: string;
    lastMessageAt: Date | null;
    buyerLastReadAt: Date | null;
    sellerLastReadAt: Date | null;
    messages: { body: string }[];
  },
  viewerId: string,
): boolean {
  if (!lead.lastMessageAt) return false;

  const role = resolveLeadThreadParticipantRole(lead, viewerId);
  if (role === "buyer") {
    return !lead.buyerLastReadAt || lead.buyerLastReadAt < lead.lastMessageAt;
  }
  if (role === "seller") {
    return !lead.sellerLastReadAt || lead.sellerLastReadAt < lead.lastMessageAt;
  }

  return false;
}

export async function queryLeadThreadsForUser(
  userId: string,
  role: "buyer" | "seller",
): Promise<LeadThreadRow[]> {
  const where: Prisma.LeadWhereInput =
    role === "buyer" ? { buyerId: userId } : { sellerId: userId };

  const leads = await prisma.lead.findMany({
    where,
    include: {
      listing: { select: threadListingSelect },
      buyer: { select: threadUserSelect },
      seller: { select: threadUserSelect },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true },
      },
    },
    orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
  });

  return leads.map((lead) => {
    const counterpart = role === "buyer" ? lead.seller : lead.buyer;
    const lastPreview = lead.messages[0]?.body ?? lead.message;

    return {
      leadId: lead.id,
      listingId: lead.listingId,
      registration: lead.listing.registration,
      aircraftTitle: aircraftTitle(lead.listing),
      counterpartName: counterpart.name ?? counterpart.email,
      lastMessagePreview: lastPreview,
      lastMessageAt: lead.lastMessageAt?.toISOString() ?? null,
      unread: isThreadUnreadForViewer(lead, userId),
      status: lead.status as LeadStatus,
    };
  });
}

export async function markLeadThreadRead(leadId: string, viewerId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, buyerId: true, sellerId: true },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const role = resolveLeadThreadParticipantRole(lead, viewerId);
  if (!role) {
    throw new AuthorizationError();
  }

  const now = new Date();

  return prisma.lead.update({
    where: { id: leadId },
    data: role === "buyer" ? { buyerLastReadAt: now } : { sellerLastReadAt: now },
  });
}

export interface LeadThreadDetail {
  leadId: string;
  listingId: string;
  registration: string;
  aircraftTitle: string;
  counterpartName: string;
  counterpartRoleLabel: string;
  status: LeadStatus;
  canSendMessage: boolean;
  viewerRole: "buyer" | "seller";
  contextHref: string;
  contextLabel: string;
}

export async function getLeadThreadDetail(
  leadId: string,
  viewerId: string,
): Promise<LeadThreadDetail | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      listing: { select: threadListingSelect },
      buyer: { select: threadUserSelect },
      seller: { select: threadUserSelect },
    },
  });

  if (!lead) return null;

  const participantRole = resolveLeadThreadParticipantRole(lead, viewerId);
  if (!participantRole) {
    throw new AuthorizationError();
  }

  const counterpart = participantRole === "buyer" ? lead.seller : lead.buyer;
  const status = lead.status as LeadStatus;

  return {
    leadId: lead.id,
    listingId: lead.listingId,
    registration: lead.listing.registration,
    aircraftTitle: aircraftTitle(lead.listing),
    counterpartName: counterpart.name ?? counterpart.email,
    counterpartRoleLabel: participantRole === "buyer" ? "Listing contact" : "Buyer",
    status,
    canSendMessage: canSendLeadMessage(status),
    viewerRole: participantRole,
    contextHref:
      participantRole === "buyer"
        ? `/dashboard/buy/${buildListingSlug(lead.listing.registration, lead.listing.make, lead.listing.model)}`
        : `/dashboard/seller/leads/${lead.id}`,
    contextLabel:
      participantRole === "buyer" ? "View aircraft listing" : "Open lead workspace",
  };
}

export async function countUnreadLeadThreadsForUser(
  userId: string,
  role: "buyer" | "seller",
): Promise<number> {
  const threads = await queryLeadThreadsForUser(userId, role);
  return threads.filter((thread) => thread.unread).length;
}
