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

export class LeadClosedReasonRequiredError extends Error {
  constructor() {
    super("A closed reason is required when closing a lead.");
    this.name = "LeadClosedReasonRequiredError";
  }
}

export interface ValidateLeadStatusTransitionInput {
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  closedReason?: string | null;
}

/** Server-side validation before persisting a lead status change. */
export function validateLeadStatusTransition(input: ValidateLeadStatusTransitionInput): void {
  if (
    input.toStatus === LeadStatus.CLOSED &&
    input.fromStatus !== LeadStatus.CLOSED &&
    !input.closedReason?.trim()
  ) {
    throw new LeadClosedReasonRequiredError();
  }

  if (input.fromStatus !== input.toStatus) {
    assertCanTransitionLeadStatus(input.fromStatus, input.toStatus);
  }
}

export function isTerminalLeadStatus(status: LeadStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
