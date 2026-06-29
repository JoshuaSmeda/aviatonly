import type { Prisma } from "@prisma/client";
import {
  OfferStatus,
  OfferActivityType,
} from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import type { OfferTableRow } from "@/lib/aviatonly/mock/types";
import { aircraftTitle } from "./leads";

const offerTableInclude = {
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
} satisfies Prisma.OfferInclude;

export interface QueryOfferTableRowsOptions {
  sellerId?: string;
  listingId?: string;
  activeOnly?: boolean;
}

export async function queryOfferTableRows(
  options: QueryOfferTableRowsOptions = {},
): Promise<OfferTableRow[]> {
  const { sellerId, listingId, activeOnly = false } = options;

  const where: Prisma.OfferWhereInput = {};

  if (sellerId) where.sellerId = sellerId;
  if (listingId) where.listingId = listingId;
  if (activeOnly) {
    where.status = {
      in: [OfferStatus.RECEIVED, OfferStatus.UNDER_REVIEW, OfferStatus.SELLER_COUNTERED],
    };
  }

  const offers = await prisma.offer.findMany({
    where,
    include: offerTableInclude,
    orderBy: { createdAt: "desc" },
  });

  return offers.map((offer) => ({
    id: offer.id,
    listingId: offer.listingId,
    registration: offer.listing.registration,
    aircraftTitle: aircraftTitle(offer.listing),
    sellerName: offer.seller.name ?? "Unknown seller",
    buyerName: offer.buyer.name ?? "Buyer",
    buyerEmail: offer.buyer.email,
    amount: offer.amount,
    status: offer.status as OfferStatus,
    message: offer.message,
    expiresAt: offer.expiresAt?.toISOString() ?? null,
    createdAt: offer.createdAt.toISOString(),
    listingHref: `/dashboard/listings/${offer.listingId}?tab=leads-offers`,
  }));
}

export async function countOffersInDatabase(): Promise<number> {
  return prisma.offer.count();
}

export interface CreateOfferInput {
  listingId: string;
  buyerId: string;
  amount: number;
  message?: string;
  expiresAt?: Date;
  actorId?: string;
}

export async function createOfferRecord(input: CreateOfferInput) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new Error("Listing not found.");
  }

  return prisma.$transaction(async (tx) => {
    const offer = await tx.offer.create({
      data: {
        listingId: listing.id,
        buyerId: input.buyerId,
        sellerId: listing.sellerId,
        amount: input.amount,
        message: input.message ?? null,
        expiresAt: input.expiresAt ?? null,
        status: OfferStatus.RECEIVED,
      },
    });

    await tx.offerActivity.create({
      data: {
        offerId: offer.id,
        actorId: input.actorId ?? input.buyerId,
        type: OfferActivityType.OFFER_CREATED,
        message: "Offer submitted by buyer.",
        metadata: { amount: input.amount },
      },
    });

    return offer;
  });
}

export interface TransitionOfferStatusInput {
  offerId: string;
  toStatus: OfferStatus;
  actorId: string;
  message?: string;
  rejectedReason?: string;
  counterAmount?: number;
  counterMessage?: string;
}

export async function transitionOfferStatusRecord(input: TransitionOfferStatusInput) {
  const offer = await prisma.offer.findUnique({ where: { id: input.offerId } });
  if (!offer) throw new Error("Offer not found.");

  const fromStatus = offer.status as OfferStatus;
  const toStatus = input.toStatus;

  if (toStatus === OfferStatus.REJECTED && !input.rejectedReason?.trim()) {
    throw new Error("A rejection reason is required.");
  }

  const { assertCanTransitionOfferStatus } = await import("@/lib/aviatonly/domain/offer-transitions");
  assertCanTransitionOfferStatus(fromStatus, toStatus);

  const activityType =
    toStatus === OfferStatus.SELLER_COUNTERED
      ? OfferActivityType.COUNTER_SENT
      : toStatus === OfferStatus.ACCEPTED
        ? OfferActivityType.OFFER_ACCEPTED
        : toStatus === OfferStatus.REJECTED
          ? OfferActivityType.OFFER_REJECTED
          : toStatus === OfferStatus.WITHDRAWN
            ? OfferActivityType.OFFER_WITHDRAWN
            : OfferActivityType.STATUS_CHANGED;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.offer.update({
      where: { id: input.offerId },
      data: {
        status: toStatus,
        rejectedAt: toStatus === OfferStatus.REJECTED ? new Date() : offer.rejectedAt,
        rejectedReason:
          toStatus === OfferStatus.REJECTED ? input.rejectedReason : offer.rejectedReason,
        acceptedAt: toStatus === OfferStatus.ACCEPTED ? new Date() : offer.acceptedAt,
        counterAmount:
          toStatus === OfferStatus.SELLER_COUNTERED ? input.counterAmount : offer.counterAmount,
        counterMessage:
          toStatus === OfferStatus.SELLER_COUNTERED ? input.counterMessage : offer.counterMessage,
        counteredAt: toStatus === OfferStatus.SELLER_COUNTERED ? new Date() : offer.counteredAt,
        counteredById:
          toStatus === OfferStatus.SELLER_COUNTERED ? input.actorId : offer.counteredById,
      },
    });

    await tx.offerActivity.create({
      data: {
        offerId: offer.id,
        actorId: input.actorId,
        type: activityType,
        message: input.message ?? `Offer status changed to ${toStatus}.`,
        metadata: {
          fromStatus,
          toStatus,
          rejectedReason: input.rejectedReason,
          counterAmount: input.counterAmount,
        },
      },
    });

    return updated;
  });
}

export async function addOfferNoteRecord(offerId: string, actorId: string, note: string) {
  return prisma.offerActivity.create({
    data: {
      offerId,
      actorId,
      type: OfferActivityType.NOTE_ADDED,
      message: note,
    },
  });
}
