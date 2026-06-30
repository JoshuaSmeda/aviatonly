import type { Prisma } from "@prisma/client";
import type { Auction } from "@prisma/client";

export type TransactionClient = Prisma.TransactionClient;

export type LockedAuctionRow = Auction & {
  sellerId: string;
  registration: string;
  listingStatus: string;
};

export async function getServerClock(tx: TransactionClient): Promise<Date> {
  const rows = await tx.$queryRaw<[{ now: Date }]>`SELECT NOW() AS now`;
  return rows[0].now;
}

export async function lockAuctionRow(
  tx: TransactionClient,
  auctionId: string,
): Promise<LockedAuctionRow | null> {
  const rows = await tx.$queryRaw<LockedAuctionRow[]>`
    SELECT
      a.*,
      l."sellerId" AS "sellerId",
      l.registration AS registration,
      l.status AS "listingStatus"
    FROM "Auction" a
    INNER JOIN "AircraftListing" l ON l.id = a."listingId"
    WHERE a.id = ${auctionId}
    FOR UPDATE OF a
  `;
  return rows[0] ?? null;
}

export function lockedRowToDomain(row: LockedAuctionRow) {
  return {
    id: row.id,
    listingId: row.listingId,
    sellerId: row.sellerId,
    status: row.status,
    closeOutcome: row.closeOutcome,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    effectiveEndsAt: row.effectiveEndsAt,
    startingBid: row.startingBid,
    bidIncrement: row.bidIncrement,
    reservePrice: row.reservePrice,
    noReserveConfirmed: row.noReserveConfirmed,
    currency: row.currency,
    currentHighBidAmount: row.currentHighBidAmount,
    currentHighBidId: row.currentHighBidId,
    bidCount: row.bidCount,
    reserveMet: row.reserveMet,
    showReserveStatus: row.showReserveStatus,
    showReservePrice: row.showReservePrice,
    showBidHistory: row.showBidHistory,
    buyerPremiumBps: row.buyerPremiumBps,
    antiSnipeWindowMinutes: row.antiSnipeWindowMinutes,
    antiSnipeExtensionMinutes: row.antiSnipeExtensionMinutes,
    maxExtensions: row.maxExtensions,
    extensionCount: row.extensionCount,
    bidderDisplayMode: row.bidderDisplayMode,
    winningBidId: row.winningBidId,
    winnerId: row.winnerId,
    closedAt: row.closedAt,
    registration: row.registration,
    listingStatus: row.listingStatus,
  };
}
