import type { StatusMeta } from "./types";

/** Offer workflow statuses (future `Offer` model). */
export enum OfferStatus {
  RECEIVED = "RECEIVED",
  UNDER_REVIEW = "UNDER_REVIEW",
  SELLER_COUNTERED = "SELLER_COUNTERED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  WITHDRAWN = "WITHDRAWN",
}

export const OFFER_STATUS_META: Record<OfferStatus, StatusMeta> = {
  [OfferStatus.RECEIVED]: {
    label: "Received",
    description: "Offer received and awaiting review.",
    badgeVariant: "outline",
  },
  [OfferStatus.UNDER_REVIEW]: {
    label: "Under review",
    description: "AVIATONLY or the seller is reviewing this offer.",
    badgeVariant: "outline",
  },
  [OfferStatus.SELLER_COUNTERED]: {
    label: "Seller countered",
    description: "Seller sent a counter-offer to the buyer.",
    badgeVariant: "secondary",
  },
  [OfferStatus.ACCEPTED]: {
    label: "Accepted",
    description: "Offer accepted — deal progression can begin.",
    badgeVariant: "default",
  },
  [OfferStatus.REJECTED]: {
    label: "Rejected",
    description: "Offer rejected and will not proceed.",
    badgeVariant: "destructive",
  },
  [OfferStatus.EXPIRED]: {
    label: "Expired",
    description: "Offer expired before acceptance.",
    badgeVariant: "secondary",
  },
  [OfferStatus.WITHDRAWN]: {
    label: "Withdrawn",
    description: "Buyer withdrew this offer.",
    badgeVariant: "secondary",
  },
};

export const ACTIVE_OFFER_STATUSES: readonly OfferStatus[] = [
  OfferStatus.RECEIVED,
  OfferStatus.UNDER_REVIEW,
  OfferStatus.SELLER_COUNTERED,
];

export function getOfferStatusMeta(status: OfferStatus): StatusMeta {
  return OFFER_STATUS_META[status];
}

export function isActiveOfferStatus(status: OfferStatus): boolean {
  return ACTIVE_OFFER_STATUSES.includes(status);
}
