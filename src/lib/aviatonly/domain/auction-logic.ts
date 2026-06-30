import { BuyerVerificationStatus } from "./lead-enums";
import { UserRole } from "./roles";
import {
  AuctionRegistrationStatus,
  BidRejectedReason,
} from "./auction-enums";
import {
  AuctionCloseOutcome,
  AuctionStatus,
  CANCELLABLE_AUCTION_STATUSES,
  isBiddingOpenStatus,
} from "./auction-status";
import { isBidEligibleForWinner } from "./bid-status";
import type {
  AuctionBidderContext,
  AuctionClock,
  AuctionDomainRecord,
  AuctionRegistrationRecord,
  BidForOutcome,
  DomainDecision,
  PrivateAdminAuctionState,
  PublicAuctionState,
} from "./auction-types";

const ADMIN_BID_ROLES: readonly UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

const MS_PER_MINUTE = 60_000;

function deny(reason: string, code: string): DomainDecision {
  return { allowed: false, reason, code };
}

function allow(): DomainDecision {
  return { allowed: true };
}

function isAdminBidder(roles: readonly string[]): boolean {
  return ADMIN_BID_ROLES.some((role) => roles.includes(role));
}

function isSellerBidder(auction: AuctionDomainRecord, bidder: AuctionBidderContext): boolean {
  return bidder.userId === auction.sellerId;
}

function isBuyerBidBlocked(bidder: AuctionBidderContext, clock: AuctionClock): boolean {
  return bidder.buyerBidBlockedAt !== null && bidder.buyerBidBlockedAt <= clock.now;
}

function isAuctionCancelled(auction: AuctionDomainRecord): boolean {
  return auction.status === AuctionStatus.CANCELLED;
}

function isAuctionEnded(auction: AuctionDomainRecord, clock: AuctionClock): boolean {
  return clock.now >= auction.effectiveEndsAt;
}

function isAuctionNotYetStarted(
  auction: Pick<AuctionDomainRecord, "startsAt">,
  clock: AuctionClock,
): boolean {
  return clock.now < auction.startsAt;
}

function isWholeCurrencyAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0;
}

/**
 * Whether an auction may transition to LIVE and accept bids (server time).
 */
export function canStartAuction(
  auction: Pick<AuctionDomainRecord, "status" | "startsAt" | "endsAt">,
  clock: AuctionClock,
): DomainDecision {
  if (auction.status === AuctionStatus.CANCELLED) {
    return deny("Auction was cancelled.", "AUCTION_CANCELLED");
  }

  if (auction.status === AuctionStatus.CLOSED) {
    return deny("Auction has already closed.", "AUCTION_CLOSED");
  }

  if (auction.status === AuctionStatus.LIVE) {
    return deny("Auction is already live.", "AUCTION_ALREADY_LIVE");
  }

  if (auction.status === AuctionStatus.CLOSING) {
    return deny("Auction is closing.", "AUCTION_CLOSING");
  }

  if (auction.endsAt <= auction.startsAt) {
    return deny("Auction end time must be after start time.", "INVALID_SCHEDULE");
  }

  if (isAuctionNotYetStarted(auction, clock)) {
    return deny("Auction has not reached its start time.", "AUCTION_NOT_STARTED");
  }

  if (auction.status !== AuctionStatus.SCHEDULED) {
    return deny("Only scheduled auctions can be opened for bidding.", "INVALID_STATUS");
  }

  return allow();
}

/**
 * Minimum next bid in whole currency units (derived from server-known high bid only).
 */
export function calculateMinimumNextBid(
  startingBid: number,
  bidIncrement: number,
  currentHighBidAmount: number | null,
): number {
  if (!Number.isInteger(startingBid) || startingBid <= 0) {
    throw new Error("startingBid must be a positive whole number.");
  }
  if (!Number.isInteger(bidIncrement) || bidIncrement <= 0) {
    throw new Error("bidIncrement must be a positive whole number.");
  }

  if (currentHighBidAmount === null) {
    return startingBid;
  }

  return currentHighBidAmount + bidIncrement;
}

/**
 * Reserve met when high bid meets or exceeds reserve, or auction is explicitly no-reserve.
 */
export function hasReserveBeenMet(
  auction: Pick<
    AuctionDomainRecord,
    "reservePrice" | "noReserveConfirmed" | "currentHighBidAmount"
  >,
): boolean {
  if (auction.noReserveConfirmed) {
    return auction.currentHighBidAmount !== null;
  }

  if (auction.currentHighBidAmount === null) {
    return false;
  }

  return auction.currentHighBidAmount >= auction.reservePrice;
}

/**
 * Whether a bid placed at `clock.now` should trigger an anti-snipe extension.
 */
export function shouldExtendAuctionForAntiSniping(
  auction: Pick<
    AuctionDomainRecord,
    | "status"
    | "effectiveEndsAt"
    | "antiSnipeWindowMinutes"
    | "extensionCount"
    | "maxExtensions"
  >,
  clock: AuctionClock,
): boolean {
  if (!isBiddingOpenStatus(auction.status)) {
    return false;
  }

  if (auction.extensionCount >= auction.maxExtensions) {
    return false;
  }

  const remainingMs = auction.effectiveEndsAt.getTime() - clock.now.getTime();
  if (remainingMs <= 0) {
    return false;
  }

  const windowMs = auction.antiSnipeWindowMinutes * MS_PER_MINUTE;
  return remainingMs <= windowMs;
}

/**
 * New effective end time after anti-snipe extension (server time).
 */
export function calculateExtendedEndTime(
  effectiveEndsAt: Date,
  antiSnipeExtensionMinutes: number,
  clock: AuctionClock,
): Date {
  const extensionMs = antiSnipeExtensionMinutes * MS_PER_MINUTE;
  const candidate = new Date(clock.now.getTime() + extensionMs);
  return effectiveEndsAt > candidate ? effectiveEndsAt : candidate;
}

/**
 * Highest eligible bid; tie-break by earliest `createdAt`, then lowest `sequence`.
 */
export function determineWinningBid(bids: readonly BidForOutcome[]): BidForOutcome | null {
  const eligible = bids.filter((bid) => isBidEligibleForWinner(bid.status));
  if (eligible.length === 0) {
    return null;
  }

  return [...eligible].sort((a, b) => {
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    const timeDiff = a.createdAt.getTime() - b.createdAt.getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return a.sequence - b.sequence;
  })[0];
}

/**
 * Close outcome from server-known bids and reserve (never client high bid).
 */
export function determineAuctionCloseOutcome(
  auction: Pick<AuctionDomainRecord, "reservePrice" | "noReserveConfirmed">,
  bids: readonly BidForOutcome[],
): AuctionCloseOutcome {
  const winningBid = determineWinningBid(bids);

  if (!winningBid) {
    return AuctionCloseOutcome.NO_BIDS;
  }

  if (auction.noReserveConfirmed) {
    return AuctionCloseOutcome.RESERVE_MET;
  }

  if (winningBid.amount >= auction.reservePrice) {
    return AuctionCloseOutcome.RESERVE_MET;
  }

  return AuctionCloseOutcome.RESERVE_NOT_MET;
}

export function canCancelAuction(
  auction: Pick<AuctionDomainRecord, "status">,
): DomainDecision {
  if (auction.status === AuctionStatus.CANCELLED) {
    return deny("Auction is already cancelled.", "AUCTION_ALREADY_CANCELLED");
  }

  if (auction.status === AuctionStatus.CLOSED) {
    return deny("Closed auctions cannot be cancelled.", "AUCTION_CLOSED");
  }

  if (auction.status === AuctionStatus.CLOSING) {
    return deny("Auction is closing and cannot be cancelled.", "AUCTION_CLOSING");
  }

  if (!CANCELLABLE_AUCTION_STATUSES.includes(auction.status)) {
    return deny("Auction cannot be cancelled in its current state.", "INVALID_STATUS");
  }

  return allow();
}

export function canRegisterForAuction(
  auction: AuctionDomainRecord,
  bidder: AuctionBidderContext,
  clock: AuctionClock,
): DomainDecision {
  if (isAuctionCancelled(auction)) {
    return deny("Auction was cancelled.", "AUCTION_CANCELLED");
  }

  if (auction.status === AuctionStatus.CLOSED || auction.status === AuctionStatus.CLOSING) {
    return deny("Auction is no longer open for registration.", "AUCTION_CLOSED");
  }

  if (auction.status === AuctionStatus.DRAFT) {
    return deny("Auction is not yet published.", "AUCTION_DRAFT");
  }

  if (isAuctionEnded(auction, clock)) {
    return deny("Auction has ended.", "AUCTION_ENDED");
  }

  if (isSellerBidder(auction, bidder)) {
    return deny("Sellers cannot register to bid on their own aircraft.", "SELLER_CANNOT_BID");
  }

  if (isAdminBidder(bidder.roles)) {
    return deny("Platform admins cannot register for public auctions.", "ADMIN_CANNOT_BID");
  }

  if (isBuyerBidBlocked(bidder, clock)) {
    return deny("Buyer is blocked from auction participation.", "COMPLIANCE_HOLD");
  }

  if (bidder.verificationStatus === BuyerVerificationStatus.UNVERIFIED) {
    return deny(
      "Complete buyer verification before registering to bid.",
      "VERIFICATION_REQUIRED",
    );
  }

  return allow();
}

export function canPlaceBid(
  auction: AuctionDomainRecord,
  bidder: AuctionBidderContext,
  registration: AuctionRegistrationRecord,
  proposedBidAmount: number,
  clock: AuctionClock,
): DomainDecision {
  if (!isWholeCurrencyAmount(proposedBidAmount)) {
    return deny("Bid amount must be a positive whole number.", BidRejectedReason.OTHER);
  }

  if (isAuctionCancelled(auction)) {
    return deny("Auction was cancelled.", BidRejectedReason.AUCTION_NOT_LIVE);
  }

  if (!isBiddingOpenStatus(auction.status)) {
    return deny("Auction is not live.", BidRejectedReason.AUCTION_NOT_LIVE);
  }

  if (isAuctionNotYetStarted(auction, clock)) {
    return deny("Bidding has not started yet.", BidRejectedReason.AUCTION_NOT_LIVE);
  }

  if (isAuctionEnded(auction, clock)) {
    return deny("Auction has ended.", BidRejectedReason.AUCTION_ENDED);
  }

  if (isSellerBidder(auction, bidder)) {
    return deny("Sellers cannot bid on their own aircraft.", BidRejectedReason.SELLER_CANNOT_BID);
  }

  if (isAdminBidder(bidder.roles)) {
    return deny("Platform admins cannot place public bids.", BidRejectedReason.OTHER);
  }

  if (isBuyerBidBlocked(bidder, clock)) {
    return deny("Buyer is blocked from bidding.", BidRejectedReason.COMPLIANCE_HOLD);
  }

  if (!registration || registration.userId !== bidder.userId) {
    return deny("Register to bid before placing a bid.", BidRejectedReason.NOT_REGISTERED);
  }

  if (registration.status !== AuctionRegistrationStatus.APPROVED) {
    return deny("Auction registration is not approved.", BidRejectedReason.NOT_REGISTERED);
  }

  const minimumNextBid = calculateMinimumNextBid(
    auction.startingBid,
    auction.bidIncrement,
    auction.currentHighBidAmount,
  );

  if (proposedBidAmount < minimumNextBid) {
    return deny(
      `Bid must be at least ${minimumNextBid}.`,
      BidRejectedReason.BELOW_MINIMUM,
    );
  }

  return allow();
}

function buildBasePublicFields(
  auction: AuctionDomainRecord,
  clock: AuctionClock,
): Omit<PublicAuctionState, "reserveMet" | "reservePrice"> {
  const minimumNextBid = calculateMinimumNextBid(
    auction.startingBid,
    auction.bidIncrement,
    auction.currentHighBidAmount,
  );

  return {
    auctionId: auction.id,
    listingId: auction.listingId,
    status: auction.status,
    closeOutcome: auction.closeOutcome,
    startsAt: auction.startsAt.toISOString(),
    endsAt: auction.endsAt.toISOString(),
    effectiveEndsAt: auction.effectiveEndsAt.toISOString(),
    closedAt: auction.closedAt?.toISOString() ?? null,
    currency: auction.currency,
    startingBid: auction.startingBid,
    bidIncrement: auction.bidIncrement,
    currentHighBidAmount: auction.currentHighBidAmount,
    bidCount: auction.bidCount,
    showReserveStatus: auction.showReserveStatus,
    showBidHistory: auction.showBidHistory,
    buyerPremiumBps: auction.buyerPremiumBps,
    extensionCount: auction.extensionCount,
    noReserve: auction.noReserveConfirmed,
    biddingOpen:
      isBiddingOpenStatus(auction.status) &&
      !isAuctionNotYetStarted(auction, clock) &&
      !isAuctionEnded(auction, clock),
    minimumNextBid,
  };
}

/**
 * Public-safe auction projection — never exposes reserve unless explicitly configured.
 */
export function getPublicAuctionState(
  auction: AuctionDomainRecord,
  clock: AuctionClock,
): PublicAuctionState {
  const base = buildBasePublicFields(auction, clock);
  const reserveMet = auction.showReserveStatus ? hasReserveBeenMet(auction) : null;

  return {
    ...base,
    reserveMet,
    reservePrice: auction.showReservePrice ? auction.reservePrice : null,
  };
}

/**
 * Full auction state for seller/admin views.
 */
export function getPrivateAdminAuctionState(
  auction: AuctionDomainRecord,
  clock: AuctionClock,
): PrivateAdminAuctionState {
  const publicState = getPublicAuctionState(auction, clock);

  return {
    ...publicState,
    reservePrice: auction.reservePrice,
    reserveMet: hasReserveBeenMet(auction),
    noReserveConfirmed: auction.noReserveConfirmed,
    showReservePrice: auction.showReservePrice,
    antiSnipeWindowMinutes: auction.antiSnipeWindowMinutes,
    antiSnipeExtensionMinutes: auction.antiSnipeExtensionMinutes,
    maxExtensions: auction.maxExtensions,
    sellerId: auction.sellerId,
    winningBidId: auction.winningBidId,
    winnerId: auction.winnerId,
  };
}
