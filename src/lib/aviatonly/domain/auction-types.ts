import type { BuyerVerificationStatus } from "./lead-enums";
import type { AuctionBidderDisplayMode, AuctionRegistrationStatus } from "./auction-enums";
import type { AuctionCloseOutcome, AuctionStatus } from "./auction-status";
import type { BidStatus } from "./bid-status";

/** Server clock — always inject `now` from the server/DB, never from the client. */
export type AuctionClock = {
  now: Date;
};

export type AuctionDomainRecord = {
  id: string;
  listingId: string;
  sellerId: string;
  status: AuctionStatus;
  closeOutcome: AuctionCloseOutcome | null;
  startsAt: Date;
  endsAt: Date;
  effectiveEndsAt: Date;
  startingBid: number;
  bidIncrement: number;
  reservePrice: number;
  noReserveConfirmed: boolean;
  currency: string;
  currentHighBidAmount: number | null;
  bidCount: number;
  reserveMet: boolean;
  showReserveStatus: boolean;
  showReservePrice: boolean;
  showBidHistory: boolean;
  buyerPremiumBps: number;
  antiSnipeWindowMinutes: number;
  antiSnipeExtensionMinutes: number;
  maxExtensions: number;
  extensionCount: number;
  bidderDisplayMode: AuctionBidderDisplayMode;
  winningBidId: string | null;
  winnerId: string | null;
  closedAt: Date | null;
};

export type AuctionBidderContext = {
  userId: string;
  roles: readonly string[];
  buyerBidBlockedAt: Date | null;
  verificationStatus: BuyerVerificationStatus;
};

export type AuctionRegistrationRecord = {
  status: AuctionRegistrationStatus;
  userId: string;
} | null;

export type BidForOutcome = {
  id: string;
  bidderId: string;
  amount: number;
  status: BidStatus;
  sequence: number;
  createdAt: Date;
};

export type DomainDecision = {
  allowed: boolean;
  reason?: string;
  code?: string;
};

export type PublicAuctionState = {
  auctionId: string;
  listingId: string;
  status: AuctionStatus;
  closeOutcome: AuctionCloseOutcome | null;
  startsAt: string;
  endsAt: string;
  effectiveEndsAt: string;
  closedAt: string | null;
  currency: string;
  startingBid: number;
  bidIncrement: number;
  currentHighBidAmount: number | null;
  bidCount: number;
  reserveMet: boolean | null;
  reservePrice: number | null;
  showReserveStatus: boolean;
  showBidHistory: boolean;
  buyerPremiumBps: number;
  extensionCount: number;
  noReserve: boolean;
  biddingOpen: boolean;
  minimumNextBid: number;
};

export type PrivateAdminAuctionState = PublicAuctionState & {
  reservePrice: number;
  noReserveConfirmed: boolean;
  showReservePrice: boolean;
  antiSnipeWindowMinutes: number;
  antiSnipeExtensionMinutes: number;
  maxExtensions: number;
  sellerId: string;
  winningBidId: string | null;
  winnerId: string | null;
};
