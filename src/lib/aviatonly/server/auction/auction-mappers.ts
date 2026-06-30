import type { Auction, AircraftListing } from "@prisma/client";
import {
  AuctionBidderDisplayMode,
} from "@/lib/aviatonly/domain/auction-enums";
import { AuctionCloseOutcome, AuctionStatus } from "@/lib/aviatonly/domain/auction-status";
import type { AuctionDomainRecord } from "@/lib/aviatonly/domain/auction-types";

export type AuctionWithListing = Auction & {
  listing: Pick<AircraftListing, "sellerId">;
};

export function mapAuctionToDomain(auction: AuctionWithListing): AuctionDomainRecord {
  return {
    id: auction.id,
    listingId: auction.listingId,
    sellerId: auction.listing.sellerId,
    status: auction.status as AuctionStatus,
    closeOutcome: (auction.closeOutcome as AuctionCloseOutcome | null) ?? null,
    startsAt: auction.startsAt,
    endsAt: auction.endsAt,
    effectiveEndsAt: auction.effectiveEndsAt,
    startingBid: auction.startingBid,
    bidIncrement: auction.bidIncrement,
    reservePrice: auction.reservePrice,
    noReserveConfirmed: auction.noReserveConfirmed,
    currency: auction.currency,
    currentHighBidAmount: auction.currentHighBidAmount,
    bidCount: auction.bidCount,
    reserveMet: auction.reserveMet,
    showReserveStatus: auction.showReserveStatus,
    showReservePrice: auction.showReservePrice,
    showBidHistory: auction.showBidHistory,
    buyerPremiumBps: auction.buyerPremiumBps,
    antiSnipeWindowMinutes: auction.antiSnipeWindowMinutes,
    antiSnipeExtensionMinutes: auction.antiSnipeExtensionMinutes,
    maxExtensions: auction.maxExtensions,
    extensionCount: auction.extensionCount,
    bidderDisplayMode: auction.bidderDisplayMode as AuctionBidderDisplayMode,
    winningBidId: auction.winningBidId,
    winnerId: auction.winnerId,
    closedAt: auction.closedAt,
  };
}

export const auctionIncludeListing = {
  listing: { select: { sellerId: true, registration: true, status: true, saleType: true } },
} as const;
