/** Must stay in sync with `AuctionRegistrationStatus` in `prisma/schema.prisma`. */
export enum AuctionRegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  REVOKED = "REVOKED",
}

/** Must stay in sync with `BidRejectedReason` in `prisma/schema.prisma`. */
export enum BidRejectedReason {
  AUCTION_NOT_LIVE = "AUCTION_NOT_LIVE",
  AUCTION_ENDED = "AUCTION_ENDED",
  BELOW_MINIMUM = "BELOW_MINIMUM",
  NOT_REGISTERED = "NOT_REGISTERED",
  SELLER_CANNOT_BID = "SELLER_CANNOT_BID",
  COMPLIANCE_HOLD = "COMPLIANCE_HOLD",
  RATE_LIMITED = "RATE_LIMITED",
  DUPLICATE_IN_FLIGHT = "DUPLICATE_IN_FLIGHT",
  OTHER = "OTHER",
}

export enum AuctionBidderDisplayMode {
  ANONYMOUS = "ANONYMOUS",
  PADDLE_NUMBER = "PADDLE_NUMBER",
  VERIFIED_INITIALS = "VERIFIED_INITIALS",
}
