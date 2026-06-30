/** Must stay in sync with `BidStatus` in `prisma/schema.prisma`. */
export enum BidStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  SUPERSEDED = "SUPERSEDED",
  WINNING_AT_CLOSE = "WINNING_AT_CLOSE",
  BINDING = "BINDING",
  DEFAULTED = "DEFAULTED",
  VOIDED = "VOIDED",
}

/** Bid statuses that count toward the high bid at auction close. */
export const BID_STATUSES_FOR_WINNER: readonly BidStatus[] = [
  BidStatus.ACCEPTED,
  BidStatus.WINNING_AT_CLOSE,
  BidStatus.BINDING,
];

export function isBidEligibleForWinner(status: BidStatus): boolean {
  return BID_STATUSES_FOR_WINNER.includes(status);
}
