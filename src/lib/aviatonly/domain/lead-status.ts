import type { StatusMeta } from "./types";

/** Lead workflow statuses (future `Lead` model). */
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  UNQUALIFIED = "UNQUALIFIED",
  VIEWING_REQUESTED = "VIEWING_REQUESTED",
  OFFER_MADE = "OFFER_MADE",
  CLOSED = "CLOSED",
}

export enum LeadType {
  GENERAL_ENQUIRY = "GENERAL_ENQUIRY",
  VIEWING_REQUEST = "VIEWING_REQUEST",
  DOCUMENT_ACCESS = "DOCUMENT_ACCESS",
  DEMO_FLIGHT = "DEMO_FLIGHT",
  FINANCE_ENQUIRY = "FINANCE_ENQUIRY",
}

export const LEAD_STATUS_META: Record<LeadStatus, StatusMeta> = {
  [LeadStatus.NEW]: {
    label: "New",
    description: "Buyer enquiry received — not yet contacted.",
    badgeVariant: "default",
  },
  [LeadStatus.CONTACTED]: {
    label: "Contacted",
    description: "Seller or AVIATONLY has responded to the buyer.",
    badgeVariant: "outline",
  },
  [LeadStatus.QUALIFIED]: {
    label: "Qualified",
    description: "Buyer verified and showing serious purchase intent.",
    badgeVariant: "secondary",
  },
  [LeadStatus.UNQUALIFIED]: {
    label: "Unqualified",
    description: "Buyer did not meet verification or intent criteria.",
    badgeVariant: "destructive",
  },
  [LeadStatus.VIEWING_REQUESTED]: {
    label: "Viewing requested",
    description: "Buyer requested an on-site aircraft viewing.",
    badgeVariant: "secondary",
  },
  [LeadStatus.OFFER_MADE]: {
    label: "Offer made",
    description: "Lead progressed to a formal offer.",
    badgeVariant: "default",
  },
  [LeadStatus.CLOSED]: {
    label: "Closed",
    description: "Enquiry closed without proceeding.",
    badgeVariant: "secondary",
  },
};

export const LEAD_TYPE_META: Record<LeadType, { label: string; description: string }> = {
  [LeadType.GENERAL_ENQUIRY]: {
    label: "General enquiry",
    description: "General question about the aircraft or listing.",
  },
  [LeadType.VIEWING_REQUEST]: {
    label: "Viewing request",
    description: "Buyer requested to view the aircraft in person.",
  },
  [LeadType.DOCUMENT_ACCESS]: {
    label: "Document access",
    description: "Buyer requested access to private logbooks or documents.",
  },
  [LeadType.DEMO_FLIGHT]: {
    label: "Demo flight",
    description: "Buyer enquired about a demonstration flight.",
  },
  [LeadType.FINANCE_ENQUIRY]: {
    label: "Finance enquiry",
    description: "Buyer asked about finance or payment structure.",
  },
};

export const OPEN_LEAD_STATUSES: readonly LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.VIEWING_REQUESTED,
];

export function getLeadStatusMeta(status: LeadStatus): StatusMeta {
  return LEAD_STATUS_META[status];
}

export function getLeadTypeMeta(type: LeadType) {
  return LEAD_TYPE_META[type];
}

export function isOpenLeadStatus(status: LeadStatus): boolean {
  return OPEN_LEAD_STATUSES.includes(status);
}
