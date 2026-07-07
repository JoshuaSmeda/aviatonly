import type { Auction } from "@prisma/client";
import { getPublicAuctionState } from "@/lib/aviatonly/domain/auction-logic";
import type { PublicAuctionState } from "@/lib/aviatonly/domain/auction-types";
import {
  mapAuctionToDomain,
  type AuctionWithListing,
} from "@/lib/aviatonly/server/auction/auction-mappers";
import type {
  AuctionViewerContext,
  MarketplaceAuctionSummary,
} from "./aircraft-marketplace-types";
import { mapPublicAuctionStateToCardSummary } from "./auction-card-utils";

type AuctionRecordInput = Pick<
  Auction,
  | "id"
  | "listingId"
  | "status"
  | "closeOutcome"
  | "startsAt"
  | "endsAt"
  | "effectiveEndsAt"
  | "closedAt"
  | "startingBid"
  | "bidIncrement"
  | "reservePrice"
  | "noReserveConfirmed"
  | "currency"
  | "currentHighBidAmount"
  | "bidCount"
  | "reserveMet"
  | "showReserveStatus"
  | "showReservePrice"
  | "showBidHistory"
  | "buyerPremiumBps"
  | "antiSnipeWindowMinutes"
  | "antiSnipeExtensionMinutes"
  | "maxExtensions"
  | "extensionCount"
  | "bidderDisplayMode"
  | "winningBidId"
  | "winnerId"
>;

export function mapAuctionRecordToPublicState(
  auction: AuctionRecordInput,
  sellerId: string,
  now: Date = new Date(),
): PublicAuctionState {
  const domain = mapAuctionToDomain({
    ...auction,
    listing: { sellerId },
  } as AuctionWithListing);
  return getPublicAuctionState(domain, { now });
}

export function mapAuctionRecordToCardSummary(
  auction: AuctionRecordInput,
  sellerId: string,
  options?: {
    now?: Date;
    viewer?: AuctionViewerContext;
  },
): MarketplaceAuctionSummary {
  const state = mapAuctionRecordToPublicState(auction, sellerId, options?.now);
  const summary = mapPublicAuctionStateToCardSummary(state);

  if (!options?.viewer) {
    return summary;
  }

  return {
    ...summary,
    viewerIsRegistered: options.viewer.isRegistered,
    viewerCanBid: options.viewer.canBid,
  };
}
