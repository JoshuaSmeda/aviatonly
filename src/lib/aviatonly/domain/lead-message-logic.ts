import { LeadStatus } from "./lead-status";

/** Lead statuses where a new message thread cannot be started or continued. */
export const TERMINAL_LEAD_MESSAGE_STATUSES: readonly LeadStatus[] = [
  LeadStatus.CLOSED,
  LeadStatus.UNQUALIFIED,
];

export function isReusableLeadStatus(status: LeadStatus): boolean {
  return !TERMINAL_LEAD_MESSAGE_STATUSES.includes(status);
}

export function canSendLeadMessage(status: LeadStatus): boolean {
  return isReusableLeadStatus(status);
}

export type LeadThreadParticipantRole = "buyer" | "seller";

export function resolveLeadThreadParticipantRole(
  lead: Pick<{ buyerId: string; sellerId: string }, "buyerId" | "sellerId">,
  userId: string,
): LeadThreadParticipantRole | null {
  if (lead.buyerId === userId) return "buyer";
  if (lead.sellerId === userId) return "seller";
  return null;
}

export function canUserPostLeadMessage(
  lead: Pick<{ buyerId: string; sellerId: string; status: LeadStatus }, "buyerId" | "sellerId" | "status">,
  userId: string,
  options: { isAdmin?: boolean } = {},
): boolean {
  if (!canSendLeadMessage(lead.status)) return false;
  if (options.isAdmin) return true;
  return resolveLeadThreadParticipantRole(lead, userId) !== null;
}
