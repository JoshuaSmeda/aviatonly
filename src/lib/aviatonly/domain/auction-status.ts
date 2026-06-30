import type { StatusMeta } from "./types";

/** Must stay in sync with `AuctionStatus` in `prisma/schema.prisma`. */
export enum AuctionStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

/** Must stay in sync with `AuctionCloseOutcome` in `prisma/schema.prisma`. */
export enum AuctionCloseOutcome {
  RESERVE_MET = "RESERVE_MET",
  RESERVE_NOT_MET = "RESERVE_NOT_MET",
  NO_BIDS = "NO_BIDS",
  CANCELLED = "CANCELLED",
  VOIDED = "VOIDED",
}

export const AUCTION_STATUS_META: Record<AuctionStatus, StatusMeta> = {
  [AuctionStatus.DRAFT]: {
    label: "Draft",
    description: "Auction configuration in progress.",
    badgeVariant: "outline",
  },
  [AuctionStatus.SCHEDULED]: {
    label: "Scheduled",
    description: "Auction times locked; bidding opens at start time.",
    badgeVariant: "outline",
  },
  [AuctionStatus.LIVE]: {
    label: "Live",
    description: "Accepting bids until the effective end time.",
    badgeVariant: "default",
  },
  [AuctionStatus.CLOSING]: {
    label: "Closing",
    description: "Finalizing auction outcome.",
    badgeVariant: "outline",
  },
  [AuctionStatus.CLOSED]: {
    label: "Closed",
    description: "Auction ended; outcome determined.",
    badgeVariant: "secondary",
  },
  [AuctionStatus.CANCELLED]: {
    label: "Cancelled",
    description: "Auction cancelled by AVIATONLY ops.",
    badgeVariant: "destructive",
  },
};

export const ACTIVE_AUCTION_STATUSES: readonly AuctionStatus[] = [
  AuctionStatus.DRAFT,
  AuctionStatus.SCHEDULED,
  AuctionStatus.LIVE,
  AuctionStatus.CLOSING,
];

export const BIDDING_OPEN_STATUSES: readonly AuctionStatus[] = [AuctionStatus.LIVE];

export const CANCELLABLE_AUCTION_STATUSES: readonly AuctionStatus[] = [
  AuctionStatus.DRAFT,
  AuctionStatus.SCHEDULED,
  AuctionStatus.LIVE,
];

export function getAuctionStatusMeta(status: AuctionStatus): StatusMeta {
  return AUCTION_STATUS_META[status];
}

export function isActiveAuctionStatus(status: AuctionStatus): boolean {
  return ACTIVE_AUCTION_STATUSES.includes(status);
}

export function isBiddingOpenStatus(status: AuctionStatus): boolean {
  return BIDDING_OPEN_STATUSES.includes(status);
}
