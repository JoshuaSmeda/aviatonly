import {
  AuctionEventType,
  AuctionRegistrationStatus,
  BidRejectedReason,
} from "@prisma/client";
import { ListingStatus } from "@/lib/aviatonly/domain";
import {
  AuctionCloseOutcome,
  AuctionStatus,
} from "@/lib/aviatonly/domain/auction-status";
import { BidStatus } from "@/lib/aviatonly/domain/bid-status";
import {
  canCancelAuction,
  canStartAuction,
  determineAuctionCloseOutcome,
  determineWinningBid,
  getPrivateAdminAuctionState,
  getPublicAuctionState,
  hasReserveBeenMet,
} from "@/lib/aviatonly/domain/auction-logic";
import type { BidForOutcome } from "@/lib/aviatonly/domain/auction-types";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import {
  auctionIncludeListing,
  mapAuctionToDomain,
  type AuctionWithListing,
} from "@/lib/aviatonly/server/auction/auction-mappers";
import {
  getServerClock,
  lockAuctionRow,
  lockedRowToDomain,
} from "@/lib/aviatonly/server/auction/auction-db";
import { transitionListingForwardRecord } from "@/lib/aviatonly/server/listing-review";
import {
  DEFAULT_PLATFORM_COMMISSION_RATE,
  SOUTH_AFRICA_VAT_RATE,
} from "@/components/dashboard/seller/upload/constants";
import { prisma } from "@/lib/prisma";

const ACTIVE_AUCTION_STATUSES = [
  AuctionStatus.DRAFT,
  AuctionStatus.SCHEDULED,
  AuctionStatus.LIVE,
  AuctionStatus.CLOSING,
] as const;

function assertWholeZar(value: number, field: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive whole number (ZAR).`);
  }
}

async function assertNoActiveAuction(listingId: string, excludeAuctionId?: string) {
  const existing = await prisma.auction.findFirst({
    where: {
      listingId,
      status: { in: [...ACTIVE_AUCTION_STATUSES] },
      ...(excludeAuctionId ? { id: { not: excludeAuctionId } } : {}),
    },
    select: { id: true },
  });
  if (existing) {
    throw new Error("This listing already has an active auction.");
  }
}

export interface UpdateAuctionSettingsInput {
  auctionId: string;
  actorId: string;
  startsAt?: Date;
  endsAt?: Date;
  startingBid?: number;
  bidIncrement?: number;
  reservePrice?: number;
  noReserveConfirmed?: boolean;
  showReserveStatus?: boolean;
  showReservePrice?: boolean;
  showBidHistory?: boolean;
  buyerPremiumBps?: number;
  currency?: string;
  antiSnipeWindowMinutes?: number;
  antiSnipeExtensionMinutes?: number;
  maxExtensions?: number;
}

export async function createAuctionDraftRecord(listingId: string, actorId: string) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      saleType: true,
      status: true,
      startingBid: true,
      reservePrice: true,
      bidIncrement: true,
      registration: true,
    },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  if (listing.saleType !== "AUCTION") {
    throw new Error("Listing sale type must be AUCTION.");
  }

  if (listing.status !== ListingStatus.APPROVED_FOR_LISTING) {
    throw new Error("Listing must be approved for listing before creating an auction.");
  }

  await assertNoActiveAuction(listingId);

  const startingBid = listing.startingBid;
  const reservePrice = listing.reservePrice;
  const bidIncrement = listing.bidIncrement;

  if (!startingBid || !reservePrice || !bidIncrement) {
    throw new Error("Listing is missing auction pricing fields (starting bid, reserve, increment).");
  }

  assertWholeZar(startingBid, "startingBid");
  assertWholeZar(reservePrice, "reservePrice");
  assertWholeZar(bidIncrement, "bidIncrement");

  const placeholderStart = new Date();
  const placeholderEnd = new Date(placeholderStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  return prisma.$transaction(async (tx) => {
    const auction = await tx.auction.create({
      data: {
        listingId,
        status: AuctionStatus.DRAFT,
        startsAt: placeholderStart,
        endsAt: placeholderEnd,
        effectiveEndsAt: placeholderEnd,
        startingBid,
        bidIncrement,
        reservePrice,
        configuredById: actorId,
      },
      include: auctionIncludeListing,
    });

    await tx.auctionEvent.create({
      data: {
        auctionId: auction.id,
        type: AuctionEventType.AUCTION_CREATED,
        actorId,
        message: `Auction draft created for ${listing.registration}.`,
        metadata: { listingId, registration: listing.registration },
      },
    });

    return auction;
  });
}

export async function updateAuctionSettingsRecord(input: UpdateAuctionSettingsInput) {
  const auction = await prisma.auction.findUnique({
    where: { id: input.auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  if (auction.status !== AuctionStatus.DRAFT && auction.status !== AuctionStatus.SCHEDULED) {
    throw new Error("Auction settings can only be updated before going live.");
  }

  const startsAt = input.startsAt ?? auction.startsAt;
  const endsAt = input.endsAt ?? auction.endsAt;

  if (endsAt <= startsAt) {
    throw new Error("Auction end time must be after start time.");
  }

  if (input.startingBid !== undefined) assertWholeZar(input.startingBid, "startingBid");
  if (input.reservePrice !== undefined) assertWholeZar(input.reservePrice, "reservePrice");
  if (input.bidIncrement !== undefined) assertWholeZar(input.bidIncrement, "bidIncrement");
  if (input.buyerPremiumBps !== undefined && (input.buyerPremiumBps < 0 || input.buyerPremiumBps > 10_000)) {
    throw new Error("buyerPremiumBps must be between 0 and 10000.");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.auction.update({
      where: { id: input.auctionId },
      data: {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        effectiveEndsAt: input.endsAt ?? undefined,
        startingBid: input.startingBid,
        bidIncrement: input.bidIncrement,
        reservePrice: input.reservePrice,
        noReserveConfirmed: input.noReserveConfirmed,
        showReserveStatus: input.showReserveStatus,
        showReservePrice: input.showReservePrice,
        showBidHistory: input.showBidHistory,
        buyerPremiumBps: input.buyerPremiumBps,
        currency: input.currency,
        antiSnipeWindowMinutes: input.antiSnipeWindowMinutes,
        antiSnipeExtensionMinutes: input.antiSnipeExtensionMinutes,
        maxExtensions: input.maxExtensions,
        configuredById: input.actorId,
      },
      include: auctionIncludeListing,
    });

    await tx.auctionEvent.create({
      data: {
        auctionId: updated.id,
        type: AuctionEventType.AUCTION_CONFIGURED,
        actorId: input.actorId,
        message: "Auction settings updated.",
      },
    });

    return updated;
  });
}

export async function scheduleAuctionRecord(auctionId: string, actorId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  if (auction.status !== AuctionStatus.DRAFT) {
    throw new Error("Only draft auctions can be scheduled.");
  }

  if (auction.endsAt <= auction.startsAt) {
    throw new Error("Set valid start and end times before scheduling.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.auction.update({
      where: { id: auctionId },
      data: {
        status: AuctionStatus.SCHEDULED,
        effectiveEndsAt: auction.endsAt,
        configuredById: actorId,
      },
      include: auctionIncludeListing,
    });

    await tx.auctionEvent.create({
      data: {
        auctionId,
        type: AuctionEventType.AUCTION_SCHEDULED,
        actorId,
        message: `Auction scheduled for ${auction.listing.registration}.`,
        metadata: {
          startsAt: auction.startsAt.toISOString(),
          endsAt: auction.endsAt.toISOString(),
        },
      },
    });

    return result;
  });

  if (auction.listing.status !== ListingStatus.LIVE_AUCTION) {
    await transitionListingForwardRecord({
      listingId: auction.listingId,
      toStatus: ListingStatus.LIVE_AUCTION,
      actorId,
      reason: "Auction scheduled on AVIATONLY.",
      eventType: "AUCTION_SCHEDULED",
      eventMessage: `${auction.listing.registration} auction scheduled.`,
    });
  }

  return updated;
}

export async function startAuctionRecord(auctionId: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const row = await lockAuctionRow(tx, auctionId);
    if (!row) {
      throw new NotFoundError("Auction not found.");
    }

    const now = await getServerClock(tx);
    const domain = mapAuctionToDomain({
      ...row,
      listing: { sellerId: row.sellerId },
    });

    const decision = canStartAuction(domain, { now });
    if (!decision.allowed) {
      throw new Error(decision.reason ?? "Cannot start auction.");
    }

    const updated = await tx.auction.update({
      where: { id: auctionId },
      data: {
        status: AuctionStatus.LIVE,
        openedAt: now,
      },
      include: auctionIncludeListing,
    });

    await tx.auctionEvent.create({
      data: {
        auctionId,
        type: AuctionEventType.AUCTION_OPENED,
        actorId,
        message: `Auction is live for ${row.registration}.`,
      },
    });

    return updated;
  });
}

export async function cancelAuctionRecord(
  auctionId: string,
  actorId: string,
  reason: string,
) {
  if (!reason.trim()) {
    throw new Error("Cancellation reason is required.");
  }

  const { updated, listingId, registration, listingStatus } = await prisma.$transaction(async (tx) => {
    const row = await lockAuctionRow(tx, auctionId);
    if (!row) {
      throw new NotFoundError("Auction not found.");
    }

    const domain = mapAuctionToDomain({
      ...row,
      listing: { sellerId: row.sellerId },
    });

    const decision = canCancelAuction(domain);
    if (!decision.allowed) {
      throw new Error(decision.reason ?? "Cannot cancel auction.");
    }

    const now = await getServerClock(tx);

    const result = await tx.auction.update({
      where: { id: auctionId },
      data: {
        status: AuctionStatus.CANCELLED,
        closeOutcome: AuctionCloseOutcome.CANCELLED,
        cancelledById: actorId,
        cancelledAt: now,
        cancelReason: reason.trim(),
      },
      include: auctionIncludeListing,
    });

    await tx.auctionEvent.create({
      data: {
        auctionId,
        type: AuctionEventType.AUCTION_CANCELLED,
        actorId,
        message: "Auction cancelled.",
        adminNote: reason.trim(),
      },
    });

    return {
      updated: result,
      listingId: row.listingId,
      registration: row.registration,
      listingStatus: row.listingStatus,
    };
  });

  if (listingStatus === ListingStatus.LIVE_AUCTION) {
    await transitionListingForwardRecord({
      listingId,
      toStatus: ListingStatus.APPROVED_FOR_LISTING,
      actorId,
      reason: reason.trim(),
      eventType: "AUCTION_CANCELLED",
      eventMessage: `${registration} auction cancelled.`,
    });
  }

  return updated;
}

type FinalizeSideEffects = {
  listingId: string;
  registration: string;
  listingStatus: string;
  closeOutcome: AuctionCloseOutcome;
  winningBid: BidForOutcome | null;
  hammerPrice: number | null;
  buyerPremiumBps: number;
  sellerId: string;
  currency: string;
};

async function finalizeAuctionInTransaction(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  auctionId: string,
  actorId: string | null,
  options?: { force?: boolean },
): Promise<{ auction: Awaited<ReturnType<typeof prisma.auction.update>>; effects: FinalizeSideEffects | null }> {
  const row = await lockAuctionRow(tx, auctionId);
  if (!row) {
    throw new NotFoundError("Auction not found.");
  }

  const now = await getServerClock(tx);

  if (row.status === AuctionStatus.CLOSED) {
    const existing = await tx.auction.findUnique({
      where: { id: auctionId },
      include: auctionIncludeListing,
    });
    return { auction: existing!, effects: null };
  }

  if (row.status !== AuctionStatus.LIVE && row.status !== AuctionStatus.CLOSING) {
    throw new Error("Only live auctions can be closed.");
  }

  const dueByTime = now >= row.effectiveEndsAt;
  if (!options?.force && !dueByTime) {
    throw new Error("Auction has not reached its effective end time.");
  }

  await tx.auction.update({
    where: { id: auctionId },
    data: {
      status: AuctionStatus.CLOSING,
      closingStartedAt: row.closingStartedAt ?? now,
    },
  });

  const bids = await tx.bid.findMany({
    where: { auctionId },
    orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
  });

  const bidsForOutcome: BidForOutcome[] = bids.map((b) => ({
    id: b.id,
    bidderId: b.bidderId,
    amount: b.amount,
    status: b.status as BidStatus,
    sequence: b.sequence,
    createdAt: b.createdAt,
  }));

  const domainAuction = mapAuctionToDomain({
    ...row,
    listing: { sellerId: row.sellerId },
  });

  const winningBid = determineWinningBid(bidsForOutcome);
  const closeOutcome = determineAuctionCloseOutcome(domainAuction, bidsForOutcome);

  if (winningBid) {
    await tx.bid.updateMany({
      where: {
        auctionId,
        status: BidStatus.ACCEPTED,
        id: { not: winningBid.id },
      },
      data: { status: BidStatus.SUPERSEDED },
    });

    await tx.bid.update({
      where: { id: winningBid.id },
      data: { status: BidStatus.WINNING_AT_CLOSE },
    });
  }

  const reserveMet = winningBid
    ? hasReserveBeenMet({
        reservePrice: row.reservePrice,
        noReserveConfirmed: row.noReserveConfirmed,
        currentHighBidAmount: winningBid.amount,
      })
    : false;

  const updated = await tx.auction.update({
    where: { id: auctionId },
    data: {
      status: AuctionStatus.CLOSED,
      closeOutcome,
      closedAt: now,
      winningBidId: winningBid?.id ?? null,
      winnerId: winningBid?.bidderId ?? null,
      currentHighBidId: winningBid?.id ?? row.currentHighBidId,
      currentHighBidAmount: winningBid?.amount ?? row.currentHighBidAmount,
      reserveMet,
    },
    include: auctionIncludeListing,
  });

  await tx.auctionEvent.create({
    data: {
      auctionId,
      type: AuctionEventType.AUCTION_CLOSED,
      actorId,
      message: `Auction closed — ${closeOutcome.replace(/_/g, " ").toLowerCase()}.`,
      metadata: {
        closeOutcome,
        winningBidId: winningBid?.id ?? null,
        winningAmount: winningBid?.amount ?? null,
      },
    },
  });

  return {
    auction: updated,
    effects: {
      listingId: row.listingId,
      registration: row.registration,
      listingStatus: row.listingStatus,
      closeOutcome,
      winningBid,
      hammerPrice: winningBid?.amount ?? null,
      buyerPremiumBps: row.buyerPremiumBps,
      sellerId: row.sellerId,
      currency: row.currency,
    },
  };
}

async function applyFinalizeSideEffects(
  auctionId: string,
  actorId: string | null,
  effects: FinalizeSideEffects,
) {
  const { winningBid, closeOutcome, listingId, registration, listingStatus } = effects;

  if (closeOutcome === AuctionCloseOutcome.RESERVE_MET && winningBid && effects.hammerPrice) {
    const hammerPrice = effects.hammerPrice;
    const existingDeal = await prisma.deal.findFirst({ where: { auctionId } });
    if (!existingDeal) {
      const buyerPremiumAmount = Math.round((hammerPrice * effects.buyerPremiumBps) / 10_000);
      const commissionAmount = Math.round(hammerPrice * DEFAULT_PLATFORM_COMMISSION_RATE);
      const vatAmount = Math.round(commissionAmount * SOUTH_AFRICA_VAT_RATE);

      await prisma.deal.create({
        data: {
          listingId,
          buyerId: winningBid.bidderId,
          sellerId: effects.sellerId,
          source: "AUCTION",
          acceptedBidId: winningBid.id,
          auctionId,
          agreedPrice: hammerPrice,
          hammerPrice,
          buyerPremiumAmount,
          buyerPremiumBps: effects.buyerPremiumBps,
          commissionAmount,
          vatAmount,
          currency: effects.currency,
          nextAction: "AVIATONLY ops to confirm buyer verification and issue sale agreement.",
        },
      });
    }

    await transitionListingForwardRecord({
      listingId,
      toStatus: ListingStatus.UNDER_OFFER,
      actorId: actorId ?? "system",
      reason: "Auction closed with reserve met.",
      eventType: "AUCTION_CLOSED_RESERVE_MET",
      eventMessage: `${registration} auction won at R ${hammerPrice.toLocaleString("en-ZA")}.`,
    });
    return;
  }

  if (closeOutcome === AuctionCloseOutcome.RESERVE_NOT_MET && winningBid) {
    await prisma.lead.create({
      data: {
        listingId,
        buyerId: winningBid.bidderId,
        sellerId: effects.sellerId,
        type: "GENERAL_ENQUIRY",
        status: "NEW",
        source: "AUCTION",
        priority: "HIGH",
        message: `Highest bidder on ${registration} — reserve not met. AVIATONLY ops to follow up.`,
        buyerVerificationStatus: "VERIFIED",
        auctionId,
      },
    });

    if (listingStatus === ListingStatus.LIVE_AUCTION) {
      await transitionListingForwardRecord({
        listingId,
        toStatus: ListingStatus.APPROVED_FOR_LISTING,
        actorId: actorId ?? "system",
        reason: "Auction closed — reserve not met.",
        eventType: "AUCTION_CLOSED_RESERVE_NOT_MET",
        eventMessage: `${registration} auction ended below reserve.`,
      });
    }
    return;
  }

  if (closeOutcome === AuctionCloseOutcome.NO_BIDS && listingStatus === ListingStatus.LIVE_AUCTION) {
    await transitionListingForwardRecord({
      listingId,
      toStatus: ListingStatus.APPROVED_FOR_LISTING,
      actorId: actorId ?? "system",
      reason: "Auction closed with no bids.",
      eventType: "AUCTION_CLOSED_NO_BIDS",
      eventMessage: `${registration} auction ended with no bids.`,
    });
  }
}

export async function closeAuctionRecord(
  auctionId: string,
  actorId: string,
  options?: { force?: boolean },
): Promise<AuctionWithListing> {
  const { auction, effects } = await prisma.$transaction(
    async (tx) => finalizeAuctionInTransaction(tx, auctionId, actorId, options),
    { isolationLevel: "Serializable" },
  );

  if (effects) {
    await applyFinalizeSideEffects(auctionId, actorId, effects);
  }

  const withListing = await prisma.auction.findUnique({
    where: { id: auction.id },
    include: auctionIncludeListing,
  });

  return (withListing ?? auction) as AuctionWithListing;
}

export async function closeDueAuctionsRecord(): Promise<number> {
  const due = await prisma.auction.findMany({
    where: {
      status: AuctionStatus.LIVE,
      effectiveEndsAt: { lte: new Date() },
    },
    select: { id: true },
  });

  let closed = 0;
  for (const auction of due) {
    try {
      const { effects } = await prisma.$transaction(
        async (tx) => finalizeAuctionInTransaction(tx, auction.id, null),
        { isolationLevel: "Serializable" },
      );
      if (effects) {
        await applyFinalizeSideEffects(auction.id, null, effects);
      }
      closed += 1;
    } catch {
      // Another worker may have closed it.
    }
  }
  return closed;
}

export async function getPublicAuctionStateRecord(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  const domain = mapAuctionToDomain(auction);
  return getPublicAuctionState(domain, { now: new Date() });
}

export async function getPublicAuctionStateByListingIdRecord(listingId: string) {
  const auction = await prisma.auction.findFirst({
    where: {
      listingId,
      status: {
        in: [
          AuctionStatus.SCHEDULED,
          AuctionStatus.LIVE,
          AuctionStatus.CLOSED,
          AuctionStatus.CLOSING,
        ],
      },
    },
    orderBy: { createdAt: "desc" },
    include: auctionIncludeListing,
  });

  if (!auction) {
    return null;
  }

  const domain = mapAuctionToDomain(auction);
  return getPublicAuctionState(domain, { now: new Date() });
}

export async function getAdminAuctionStateRecord(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  const domain = mapAuctionToDomain(auction);
  return getPrivateAdminAuctionState(domain, { now: new Date() });
}
