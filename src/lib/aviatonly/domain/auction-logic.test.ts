import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BuyerVerificationStatus } from "./lead-enums";
import { UserRole } from "./roles";
import {
  AuctionRegistrationStatus,
  BidRejectedReason,
} from "./auction-enums";
import {
  AuctionCloseOutcome,
  AuctionStatus,
} from "./auction-status";
import { BidStatus } from "./bid-status";
import {
  calculateExtendedEndTime,
  calculateMinimumNextBid,
  canCancelAuction,
  canPlaceBid,
  canRegisterForAuction,
  canStartAuction,
  determineAuctionCloseOutcome,
  determineWinningBid,
  getPrivateAdminAuctionState,
  getPublicAuctionState,
  hasReserveBeenMet,
  shouldExtendAuctionForAntiSniping,
} from "./auction-logic";
import type {
  AuctionBidderContext,
  AuctionDomainRecord,
  AuctionRegistrationRecord,
  BidForOutcome,
} from "./auction-types";
import { AuctionBidderDisplayMode } from "./auction-enums";

const BASE_TIME = new Date("2026-06-30T12:00:00.000Z");

function clock(at: string | Date = BASE_TIME) {
  return { now: typeof at === "string" ? new Date(at) : at };
}

function baseAuction(overrides: Partial<AuctionDomainRecord> = {}): AuctionDomainRecord {
  return {
    id: "auction-1",
    listingId: "listing-1",
    sellerId: "seller-1",
    status: AuctionStatus.LIVE,
    closeOutcome: null,
    startsAt: new Date("2026-06-30T08:00:00.000Z"),
    endsAt: new Date("2026-06-30T18:00:00.000Z"),
    effectiveEndsAt: new Date("2026-06-30T18:00:00.000Z"),
    startingBid: 1_000_000,
    bidIncrement: 25_000,
    reservePrice: 1_500_000,
    noReserveConfirmed: false,
    currency: "ZAR",
    currentHighBidAmount: 1_100_000,
    bidCount: 2,
    reserveMet: false,
    showReserveStatus: false,
    showReservePrice: false,
    showBidHistory: true,
    buyerPremiumBps: 500,
    antiSnipeWindowMinutes: 5,
    antiSnipeExtensionMinutes: 5,
    maxExtensions: 12,
    extensionCount: 0,
    bidderDisplayMode: AuctionBidderDisplayMode.PADDLE_NUMBER,
    winningBidId: null,
    winnerId: null,
    closedAt: null,
    ...overrides,
  };
}

function buyer(overrides: Partial<AuctionBidderContext> = {}): AuctionBidderContext {
  return {
    userId: "buyer-1",
    roles: [UserRole.BUYER],
    buyerBidBlockedAt: null,
    verificationStatus: BuyerVerificationStatus.VERIFIED,
    ...overrides,
  };
}

function approvedRegistration(userId = "buyer-1"): AuctionRegistrationRecord {
  return { userId, status: AuctionRegistrationStatus.APPROVED };
}

function bid(overrides: Partial<BidForOutcome> & Pick<BidForOutcome, "id" | "amount">): BidForOutcome {
  return {
    bidderId: "buyer-1",
    status: BidStatus.ACCEPTED,
    sequence: 1,
    createdAt: new Date("2026-06-30T10:00:00.000Z"),
    ...overrides,
  };
}

describe("calculateMinimumNextBid", () => {
  it("returns starting bid when no high bid exists", () => {
    assert.equal(calculateMinimumNextBid(1_000_000, 25_000, null), 1_000_000);
  });

  it("returns high bid plus increment", () => {
    assert.equal(calculateMinimumNextBid(1_000_000, 25_000, 1_100_000), 1_125_000);
  });
});

describe("hasReserveBeenMet", () => {
  it("is false when high bid is below reserve", () => {
    assert.equal(
      hasReserveBeenMet({
        reservePrice: 1_500_000,
        noReserveConfirmed: false,
        currentHighBidAmount: 1_400_000,
      }),
      false,
    );
  });

  it("is true when high bid meets reserve", () => {
    assert.equal(
      hasReserveBeenMet({
        reservePrice: 1_500_000,
        noReserveConfirmed: false,
        currentHighBidAmount: 1_500_000,
      }),
      true,
    );
  });

  it("is true for no-reserve auction with any bid", () => {
    assert.equal(
      hasReserveBeenMet({
        reservePrice: 1_500_000,
        noReserveConfirmed: true,
        currentHighBidAmount: 1_000_000,
      }),
      true,
    );
  });
});

describe("canStartAuction", () => {
  it("allows scheduled auction after start time", () => {
    const result = canStartAuction(
      {
        status: AuctionStatus.SCHEDULED,
        startsAt: new Date("2026-06-30T08:00:00.000Z"),
        endsAt: new Date("2026-06-30T18:00:00.000Z"),
      },
      clock(),
    );
    assert.equal(result.allowed, true);
  });

  it("denies before start time", () => {
    const result = canStartAuction(
      {
        status: AuctionStatus.SCHEDULED,
        startsAt: new Date("2026-06-30T14:00:00.000Z"),
        endsAt: new Date("2026-06-30T18:00:00.000Z"),
      },
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, "AUCTION_NOT_STARTED");
  });
});

describe("canPlaceBid", () => {
  it("allows valid bid from approved registrant", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer(),
      approvedRegistration(),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, true);
  });

  it("rejects bid below minimum increment", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer(),
      approvedRegistration(),
      1_100_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.BELOW_MINIMUM);
  });

  it("rejects seller bidding on own aircraft", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer({ userId: "seller-1" }),
      approvedRegistration("seller-1"),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.SELLER_CANNOT_BID);
  });

  it("rejects admin placing public bids", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer({ roles: [UserRole.ADMIN] }),
      approvedRegistration(),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
  });

  it("rejects bids before auction start", () => {
    const result = canPlaceBid(
      baseAuction({ startsAt: new Date("2026-06-30T14:00:00.000Z") }),
      buyer(),
      approvedRegistration(),
      1_125_000,
      clock("2026-06-30T12:00:00.000Z"),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.AUCTION_NOT_LIVE);
  });

  it("rejects bids after effective end", () => {
    const result = canPlaceBid(
      baseAuction({
        effectiveEndsAt: new Date("2026-06-30T11:00:00.000Z"),
      }),
      buyer(),
      approvedRegistration(),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.AUCTION_ENDED);
  });

  it("rejects bids on cancelled auctions", () => {
    const result = canPlaceBid(
      baseAuction({ status: AuctionStatus.CANCELLED }),
      buyer(),
      approvedRegistration(),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.AUCTION_NOT_LIVE);
  });

  it("rejects unregistered bidders", () => {
    const result = canPlaceBid(baseAuction(), buyer(), null, 1_125_000, clock());
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.NOT_REGISTERED);
  });

  it("rejects pending registration", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer(),
      { userId: "buyer-1", status: AuctionRegistrationStatus.PENDING },
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.NOT_REGISTERED);
  });

  it("rejects blocked buyers", () => {
    const result = canPlaceBid(
      baseAuction(),
      buyer({ buyerBidBlockedAt: new Date("2026-06-30T08:00:00.000Z") }),
      approvedRegistration(),
      1_125_000,
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, BidRejectedReason.COMPLIANCE_HOLD);
  });
});

describe("anti-sniping", () => {
  it("extends when bid is inside the snipe window", () => {
    const auction = baseAuction({
      effectiveEndsAt: new Date("2026-06-30T12:03:00.000Z"),
      antiSnipeWindowMinutes: 5,
      extensionCount: 0,
      maxExtensions: 12,
    });
    assert.equal(shouldExtendAuctionForAntiSniping(auction, clock()), true);
  });

  it("does not extend when max extensions reached", () => {
    const auction = baseAuction({
      effectiveEndsAt: new Date("2026-06-30T12:03:00.000Z"),
      extensionCount: 12,
    });
    assert.equal(shouldExtendAuctionForAntiSniping(auction, clock()), false);
  });

  it("calculates extended end from server now", () => {
    const effectiveEndsAt = new Date("2026-06-30T12:03:00.000Z");
    const extended = calculateExtendedEndTime(effectiveEndsAt, 5, clock());
    assert.equal(extended.toISOString(), "2026-06-30T12:05:00.000Z");
  });

  it("keeps later effective end when already extended beyond candidate", () => {
    const effectiveEndsAt = new Date("2026-06-30T12:10:00.000Z");
    const extended = calculateExtendedEndTime(effectiveEndsAt, 5, clock());
    assert.equal(extended.toISOString(), "2026-06-30T12:10:00.000Z");
  });
});

describe("determineWinningBid", () => {
  it("picks highest amount", () => {
    const winner = determineWinningBid([
      bid({ id: "b1", amount: 1_100_000, sequence: 1 }),
      bid({ id: "b2", amount: 1_250_000, sequence: 2, bidderId: "buyer-2" }),
    ]);
    assert.equal(winner?.id, "b2");
  });

  it("tie-breaks equal amounts by earliest createdAt", () => {
    const winner = determineWinningBid([
      bid({
        id: "b1",
        amount: 1_250_000,
        createdAt: new Date("2026-06-30T09:00:00.000Z"),
        sequence: 1,
      }),
      bid({
        id: "b2",
        amount: 1_250_000,
        createdAt: new Date("2026-06-30T10:00:00.000Z"),
        sequence: 2,
        bidderId: "buyer-2",
      }),
    ]);
    assert.equal(winner?.id, "b1");
  });

  it("ignores superseded bids", () => {
    const winner = determineWinningBid([
      bid({ id: "b1", amount: 1_300_000, status: BidStatus.SUPERSEDED }),
      bid({ id: "b2", amount: 1_200_000, sequence: 2 }),
    ]);
    assert.equal(winner?.id, "b2");
  });
});

describe("determineAuctionCloseOutcome", () => {
  it("returns NO_BIDS when empty", () => {
    assert.equal(
      determineAuctionCloseOutcome(baseAuction(), []),
      AuctionCloseOutcome.NO_BIDS,
    );
  });

  it("returns RESERVE_MET when high bid clears reserve", () => {
    const outcome = determineAuctionCloseOutcome(baseAuction(), [
      bid({ id: "b1", amount: 1_600_000 }),
    ]);
    assert.equal(outcome, AuctionCloseOutcome.RESERVE_MET);
  });

  it("returns RESERVE_NOT_MET when high bid is below reserve", () => {
    const outcome = determineAuctionCloseOutcome(baseAuction(), [
      bid({ id: "b1", amount: 1_200_000 }),
    ]);
    assert.equal(outcome, AuctionCloseOutcome.RESERVE_NOT_MET);
  });
});

describe("canCancelAuction", () => {
  it("allows live auction cancellation", () => {
    assert.equal(canCancelAuction({ status: AuctionStatus.LIVE }).allowed, true);
  });

  it("denies closed auction cancellation", () => {
    assert.equal(canCancelAuction({ status: AuctionStatus.CLOSED }).allowed, false);
  });
});

describe("canRegisterForAuction", () => {
  it("allows verified buyer on scheduled auction", () => {
    const result = canRegisterForAuction(
      baseAuction({ status: AuctionStatus.SCHEDULED }),
      buyer(),
      clock(),
    );
    assert.equal(result.allowed, true);
  });

  it("denies seller registration", () => {
    const result = canRegisterForAuction(
      baseAuction(),
      buyer({ userId: "seller-1" }),
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, "SELLER_CANNOT_BID");
  });

  it("denies admin registration", () => {
    const result = canRegisterForAuction(
      baseAuction(),
      buyer({ roles: [UserRole.SUPER_ADMIN] }),
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, "ADMIN_CANNOT_BID");
  });

  it("denies unverified buyers", () => {
    const result = canRegisterForAuction(
      baseAuction(),
      buyer({ verificationStatus: BuyerVerificationStatus.UNVERIFIED }),
      clock(),
    );
    assert.equal(result.allowed, false);
    assert.equal(result.code, "VERIFICATION_REQUIRED");
  });
});

describe("auction state projections", () => {
  it("public state hides reserve price by default", () => {
    const state = getPublicAuctionState(baseAuction(), clock());
    assert.equal(state.reservePrice, null);
    assert.equal(state.reserveMet, null);
    assert.equal(state.currentHighBidAmount, 1_100_000);
    assert.equal(state.minimumNextBid, 1_125_000);
  });

  it("public state exposes reserve status when configured", () => {
    const state = getPublicAuctionState(
      baseAuction({ showReserveStatus: true }),
      clock(),
    );
    assert.equal(state.reserveMet, false);
    assert.equal(state.reservePrice, null);
  });

  it("public state exposes reserve price only when explicitly enabled", () => {
    const state = getPublicAuctionState(
      baseAuction({ showReservePrice: true, showReserveStatus: true }),
      clock(),
    );
    assert.equal(state.reservePrice, 1_500_000);
  });

  it("admin state always includes reserve price", () => {
    const state = getPrivateAdminAuctionState(baseAuction(), clock());
    assert.equal(state.reservePrice, 1_500_000);
    assert.equal(state.reserveMet, false);
    assert.equal(state.sellerId, "seller-1");
  });
});
