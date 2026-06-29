import { OfferStatus } from "./offer-status";

export class OfferTransitionError extends Error {
  constructor(
    public readonly from: OfferStatus,
    public readonly to: OfferStatus,
    message?: string,
  ) {
    super(message ?? `Cannot transition offer from ${from} to ${to}.`);
    this.name = "OfferTransitionError";
  }
}

const TERMINAL_STATUSES: readonly OfferStatus[] = [
  OfferStatus.ACCEPTED,
  OfferStatus.REJECTED,
  OfferStatus.EXPIRED,
  OfferStatus.WITHDRAWN,
];

/** Allowed offer status transitions (server-enforced). */
const ALLOWED_TRANSITIONS: Record<OfferStatus, readonly OfferStatus[]> = {
  [OfferStatus.RECEIVED]: [
    OfferStatus.UNDER_REVIEW,
    OfferStatus.SELLER_COUNTERED,
    OfferStatus.ACCEPTED,
    OfferStatus.REJECTED,
    OfferStatus.EXPIRED,
    OfferStatus.WITHDRAWN,
  ],
  [OfferStatus.UNDER_REVIEW]: [
    OfferStatus.SELLER_COUNTERED,
    OfferStatus.ACCEPTED,
    OfferStatus.REJECTED,
    OfferStatus.EXPIRED,
    OfferStatus.WITHDRAWN,
  ],
  [OfferStatus.SELLER_COUNTERED]: [
    OfferStatus.UNDER_REVIEW,
    OfferStatus.ACCEPTED,
    OfferStatus.REJECTED,
    OfferStatus.EXPIRED,
    OfferStatus.WITHDRAWN,
  ],
  [OfferStatus.ACCEPTED]: [],
  [OfferStatus.REJECTED]: [],
  [OfferStatus.EXPIRED]: [],
  [OfferStatus.WITHDRAWN]: [],
};

export function canTransitionOfferStatus(from: OfferStatus, to: OfferStatus): boolean {
  if (from === to) return true;
  if (TERMINAL_STATUSES.includes(from)) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertCanTransitionOfferStatus(from: OfferStatus, to: OfferStatus): void {
  if (!canTransitionOfferStatus(from, to)) {
    throw new OfferTransitionError(from, to);
  }
}

export function isTerminalOfferStatus(status: OfferStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
