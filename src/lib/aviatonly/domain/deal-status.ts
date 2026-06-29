import type { StatusMeta } from "./types";

/** Deal / escrow workflow statuses (future `Deal` model). */
export enum DealStatus {
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  DEPOSIT_PENDING = "DEPOSIT_PENDING",
  DEPOSIT_CONFIRMED = "DEPOSIT_CONFIRMED",
  CONTRACT_PENDING = "CONTRACT_PENDING",
  CONTRACT_SIGNED = "CONTRACT_SIGNED",
  INSPECTION_WINDOW = "INSPECTION_WINDOW",
  TRANSFER_DOCUMENTS_PENDING = "TRANSFER_DOCUMENTS_PENDING",
  SACAA_TRANSFER_PENDING = "SACAA_TRANSFER_PENDING",
  FUNDS_RELEASE_PENDING = "FUNDS_RELEASE_PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const DEAL_STATUS_META: Record<DealStatus, StatusMeta> = {
  [DealStatus.OFFER_ACCEPTED]: {
    label: "Offer accepted",
    description: "Offer accepted and deal room opened.",
    badgeVariant: "outline",
  },
  [DealStatus.DEPOSIT_PENDING]: {
    label: "Deposit pending",
    description: "Awaiting buyer deposit instructions or payment.",
    badgeVariant: "outline",
  },
  [DealStatus.DEPOSIT_CONFIRMED]: {
    label: "Deposit confirmed",
    description: "Buyer deposit received and verified.",
    badgeVariant: "default",
  },
  [DealStatus.CONTRACT_PENDING]: {
    label: "Contract pending",
    description: "Sale agreement issued and awaiting signatures.",
    badgeVariant: "outline",
  },
  [DealStatus.CONTRACT_SIGNED]: {
    label: "Contract signed",
    description: "Sale agreement signed by buyer and seller.",
    badgeVariant: "default",
  },
  [DealStatus.INSPECTION_WINDOW]: {
    label: "Inspection window",
    description: "Buyer inspection or verification window is active.",
    badgeVariant: "outline",
  },
  [DealStatus.TRANSFER_DOCUMENTS_PENDING]: {
    label: "Transfer documents pending",
    description: "CA 47-A4 and related transfer paperwork in progress.",
    badgeVariant: "outline",
  },
  [DealStatus.SACAA_TRANSFER_PENDING]: {
    label: "SACAA transfer pending",
    description: "Change-of-ownership lodged with SACAA.",
    badgeVariant: "outline",
  },
  [DealStatus.FUNDS_RELEASE_PENDING]: {
    label: "Funds release pending",
    description: "Transfer confirmed; funds release in progress.",
    badgeVariant: "outline",
  },
  [DealStatus.COMPLETED]: {
    label: "Sale complete",
    description: "Deal closed and funds disbursed.",
    badgeVariant: "default",
  },
  [DealStatus.CANCELLED]: {
    label: "Cancelled",
    description: "Deal cancelled before completion.",
    badgeVariant: "destructive",
  },
};

/** Seller-facing milestone labels for the deal tracker UI. */
export const DEAL_SELLER_MILESTONES = [
  "Buyer deposit pending",
  "Deposit verified",
  "Sale agreement issued",
  "Logbooks handed over",
  "Transfer documents signed",
  "SACAA transfer pending",
  "Funds release pending",
  "Sale complete",
] as const;

export const ACTIVE_DEAL_STATUSES: readonly DealStatus[] = [
  DealStatus.OFFER_ACCEPTED,
  DealStatus.DEPOSIT_PENDING,
  DealStatus.DEPOSIT_CONFIRMED,
  DealStatus.CONTRACT_PENDING,
  DealStatus.CONTRACT_SIGNED,
  DealStatus.INSPECTION_WINDOW,
  DealStatus.TRANSFER_DOCUMENTS_PENDING,
  DealStatus.SACAA_TRANSFER_PENDING,
  DealStatus.FUNDS_RELEASE_PENDING,
];

export function getDealStatusMeta(status: DealStatus): StatusMeta {
  return DEAL_STATUS_META[status];
}

export function isActiveDealStatus(status: DealStatus): boolean {
  return ACTIVE_DEAL_STATUSES.includes(status);
}

export function isTerminalDealStatus(status: DealStatus): boolean {
  return status === DealStatus.COMPLETED || status === DealStatus.CANCELLED;
}
