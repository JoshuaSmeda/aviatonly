import { LeadStatus } from "./lead-status";

export class LeadTransitionError extends Error {
  constructor(
    public readonly from: LeadStatus,
    public readonly to: LeadStatus,
    message?: string,
  ) {
    super(message ?? `Cannot transition lead from ${from} to ${to}.`);
    this.name = "LeadTransitionError";
  }
}

const TERMINAL_STATUSES: readonly LeadStatus[] = [LeadStatus.CLOSED];

/** Allowed lead status transitions (server-enforced). */
const ALLOWED_TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  [LeadStatus.NEW]: [
    LeadStatus.CONTACTED,
    LeadStatus.VIEWING_REQUESTED,
    LeadStatus.QUALIFIED,
    LeadStatus.UNQUALIFIED,
    LeadStatus.CLOSED,
  ],
  [LeadStatus.CONTACTED]: [
    LeadStatus.QUALIFIED,
    LeadStatus.UNQUALIFIED,
    LeadStatus.VIEWING_REQUESTED,
    LeadStatus.OFFER_MADE,
    LeadStatus.CLOSED,
  ],
  [LeadStatus.QUALIFIED]: [
    LeadStatus.VIEWING_REQUESTED,
    LeadStatus.OFFER_MADE,
    LeadStatus.UNQUALIFIED,
    LeadStatus.CLOSED,
  ],
  [LeadStatus.UNQUALIFIED]: [LeadStatus.CLOSED],
  [LeadStatus.VIEWING_REQUESTED]: [
    LeadStatus.CONTACTED,
    LeadStatus.QUALIFIED,
    LeadStatus.OFFER_MADE,
    LeadStatus.CLOSED,
  ],
  [LeadStatus.OFFER_MADE]: [LeadStatus.CLOSED],
  [LeadStatus.CLOSED]: [],
};

export function canTransitionLeadStatus(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return true;
  if (TERMINAL_STATUSES.includes(from)) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertCanTransitionLeadStatus(from: LeadStatus, to: LeadStatus): void {
  if (!canTransitionLeadStatus(from, to)) {
    throw new LeadTransitionError(from, to);
  }
}

export function isTerminalLeadStatus(status: LeadStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
