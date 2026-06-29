/** Append-only offer activity event types. */
export enum OfferActivityType {
  NOTE_ADDED = "NOTE_ADDED",
  STATUS_CHANGED = "STATUS_CHANGED",
  COUNTER_SENT = "COUNTER_SENT",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  OFFER_REJECTED = "OFFER_REJECTED",
  OFFER_CREATED = "OFFER_CREATED",
  OFFER_WITHDRAWN = "OFFER_WITHDRAWN",
}

export const OFFER_ACTIVITY_TYPE_LABELS: Record<OfferActivityType, string> = {
  [OfferActivityType.NOTE_ADDED]: "Note added",
  [OfferActivityType.STATUS_CHANGED]: "Status changed",
  [OfferActivityType.COUNTER_SENT]: "Counter sent",
  [OfferActivityType.OFFER_ACCEPTED]: "Offer accepted",
  [OfferActivityType.OFFER_REJECTED]: "Offer rejected",
  [OfferActivityType.OFFER_CREATED]: "Offer created",
  [OfferActivityType.OFFER_WITHDRAWN]: "Offer withdrawn",
};
