/** Append-only lead activity event types. */
export enum LeadActivityType {
  NOTE_ADDED = "NOTE_ADDED",
  STATUS_CHANGED = "STATUS_CHANGED",
  ASSIGNED = "ASSIGNED",
  EMAIL_SENT = "EMAIL_SENT",
  CALL_LOGGED = "CALL_LOGGED",
  VIEWING_SCHEDULED = "VIEWING_SCHEDULED",
  DOC_ACCESS_GRANTED = "DOC_ACCESS_GRANTED",
  DOC_ACCESS_DENIED = "DOC_ACCESS_DENIED",
  COUNTER_SENT = "COUNTER_SENT",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  OFFER_REJECTED = "OFFER_REJECTED",
  FOLLOW_UP_SET = "FOLLOW_UP_SET",
  LEAD_CREATED = "LEAD_CREATED",
}

export const LEAD_ACTIVITY_TYPE_LABELS: Record<LeadActivityType, string> = {
  [LeadActivityType.NOTE_ADDED]: "Note added",
  [LeadActivityType.STATUS_CHANGED]: "Status changed",
  [LeadActivityType.ASSIGNED]: "Assigned",
  [LeadActivityType.EMAIL_SENT]: "Email sent",
  [LeadActivityType.CALL_LOGGED]: "Call logged",
  [LeadActivityType.VIEWING_SCHEDULED]: "Viewing scheduled",
  [LeadActivityType.DOC_ACCESS_GRANTED]: "Document access granted",
  [LeadActivityType.DOC_ACCESS_DENIED]: "Document access denied",
  [LeadActivityType.COUNTER_SENT]: "Counter sent",
  [LeadActivityType.OFFER_ACCEPTED]: "Offer accepted",
  [LeadActivityType.OFFER_REJECTED]: "Offer rejected",
  [LeadActivityType.FOLLOW_UP_SET]: "Follow-up set",
  [LeadActivityType.LEAD_CREATED]: "Lead created",
};
