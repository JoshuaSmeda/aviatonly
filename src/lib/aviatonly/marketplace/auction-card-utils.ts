import type { PublicAuctionState } from "@/lib/aviatonly/domain/auction-types";
import { AuctionStatus } from "@/lib/aviatonly/domain/auction-status";
import type {
  AircraftMarketplaceListing,
  AuctionCardCtaKind,
  MarketplaceAuctionSummary,
  PublicAuctionCardPhase,
  PublicReserveCardStatus,
} from "./aircraft-marketplace-types";
import { formatCurrency, getListingDetailHref } from "./aircraft-marketplace-utils";

const PUBLIC_AUCTION_STATUS_LABELS: Record<PublicAuctionCardPhase, string> = {
  SCHEDULED: "Auction Scheduled",
  LIVE: "Auction Live",
  ENDED: "Auction Ended",
};

const RESERVE_STATUS_LABELS: Record<PublicReserveCardStatus, string> = {
  MET: "Reserve met",
  NOT_MET: "Reserve not met",
  HIDDEN: "Reserve status hidden",
};

const CTA_LABELS: Record<AuctionCardCtaKind, string> = {
  VIEW_AUCTION: "View auction",
  REGISTER_TO_BID: "Register to bid",
  PLACE_BID: "Place bid",
};

export function isAuctionMarketplaceListing(
  listing: AircraftMarketplaceListing,
): listing is AircraftMarketplaceListing & { auction: MarketplaceAuctionSummary } {
  return listing.saleType === "AUCTION" && listing.auction != null;
}

/** Maps domain public auction state to catalog card fields (no reserve price). */
export function mapPublicAuctionStateToCardSummary(
  state: PublicAuctionState,
): MarketplaceAuctionSummary {
  const phase = mapAuctionStatusToCardPhase(state.status, state.biddingOpen, state.closedAt);
  return {
    auctionId: state.auctionId,
    phase,
    openingBid: state.startingBid,
    currentBid: state.currentHighBidAmount,
    bidCount: state.bidCount,
    startsAt: state.startsAt,
    effectiveEndsAt: state.effectiveEndsAt,
    showReserveStatus: state.showReserveStatus,
    reserveMet: state.showReserveStatus ? state.reserveMet : null,
    biddingOpen: state.biddingOpen,
  };
}

export function mapAuctionStatusToCardPhase(
  status: AuctionStatus,
  biddingOpen?: boolean,
  closedAt?: string | null,
): PublicAuctionCardPhase {
  if (
    status === AuctionStatus.CLOSED ||
    status === AuctionStatus.CANCELLED ||
    closedAt != null
  ) {
    return "ENDED";
  }
  if (status === AuctionStatus.LIVE || status === AuctionStatus.CLOSING) {
    return biddingOpen === false ? "ENDED" : "LIVE";
  }
  if (status === AuctionStatus.SCHEDULED) {
    return "SCHEDULED";
  }
  return "SCHEDULED";
}

export function getPublicAuctionStatusLabel(phase: PublicAuctionCardPhase): string {
  return PUBLIC_AUCTION_STATUS_LABELS[phase];
}

export function getPublicReserveCardStatus(
  auction: MarketplaceAuctionSummary,
): PublicReserveCardStatus {
  if (!auction.showReserveStatus) {
    return "HIDDEN";
  }
  if (auction.reserveMet === true) {
    return "MET";
  }
  if (auction.reserveMet === false) {
    return "NOT_MET";
  }
  return "HIDDEN";
}

export function getPublicReserveStatusLabel(auction: MarketplaceAuctionSummary): string {
  return RESERVE_STATUS_LABELS[getPublicReserveCardStatus(auction)];
}

export function formatAuctionBidAmount(listing: AircraftMarketplaceListing): string {
  const auction = listing.auction;
  if (!auction) {
    return formatCurrency(listing.price ?? 0, listing.currency);
  }
  if (auction.currentBid != null && auction.currentBid > 0) {
    return formatCurrency(auction.currentBid, listing.currency);
  }
  return formatCurrency(auction.openingBid, listing.currency);
}

export function getAuctionBidAmountLabel(listing: AircraftMarketplaceListing): string {
  const auction = listing.auction;
  if (!auction) return "Price";
  if (auction.currentBid != null && auction.currentBid > 0) {
    return "Current bid";
  }
  return "Opening bid";
}

export function formatAuctionTimeRemaining(
  effectiveEndsAt: string,
  now: Date = new Date(),
): string | null {
  const remainingMs = new Date(effectiveEndsAt).getTime() - now.getTime();
  if (remainingMs <= 0) {
    return null;
  }

  const days = Math.floor(remainingMs / 86_400_000);
  const hours = Math.floor((remainingMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function formatAuctionStartTime(startsAt: string): string {
  return new Date(startsAt).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getAuctionCardCta(
  listing: AircraftMarketplaceListing & { auction: MarketplaceAuctionSummary },
): { kind: AuctionCardCtaKind; label: string; href: string } {
  const detailHref = getListingDetailHref(listing.slug);
  const { auction } = listing;

  if (auction.phase === "SCHEDULED" || auction.phase === "ENDED") {
    return {
      kind: "VIEW_AUCTION",
      label: CTA_LABELS.VIEW_AUCTION,
      href: detailHref,
    };
  }

  if (auction.viewerCanBid && auction.viewerIsRegistered) {
    return {
      kind: "PLACE_BID",
      label: CTA_LABELS.PLACE_BID,
      href: `${detailHref}?action=bid`,
    };
  }

  if (auction.biddingOpen !== false) {
    return {
      kind: "REGISTER_TO_BID",
      label: CTA_LABELS.REGISTER_TO_BID,
      href: `${detailHref}?action=register`,
    };
  }

  return {
    kind: "VIEW_AUCTION",
    label: CTA_LABELS.VIEW_AUCTION,
    href: detailHref,
  };
}

export function formatAuctionBidCount(count: number): string {
  return count === 1 ? "1 bid" : `${count} bids`;
}
