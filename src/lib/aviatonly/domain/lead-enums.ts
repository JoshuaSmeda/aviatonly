/** Where a lead originated. */
export enum LeadSource {
  PUBLIC_LISTING = "PUBLIC_LISTING",
  BROKER_REFERRAL = "BROKER_REFERRAL",
  AUCTION = "AUCTION",
  ADMIN = "ADMIN",
}

/** Seller/admin triage priority. */
export enum LeadPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

/** Buyer verification snapshot at lead creation time. */
export enum BuyerVerificationStatus {
  UNVERIFIED = "UNVERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
}

export const LEAD_SOURCE_META: Record<LeadSource, { label: string }> = {
  [LeadSource.PUBLIC_LISTING]: { label: "Public listing" },
  [LeadSource.BROKER_REFERRAL]: { label: "Broker referral" },
  [LeadSource.AUCTION]: { label: "Auction" },
  [LeadSource.ADMIN]: { label: "Admin" },
};

export const LEAD_PRIORITY_META: Record<LeadPriority, { label: string }> = {
  [LeadPriority.LOW]: { label: "Low" },
  [LeadPriority.NORMAL]: { label: "Normal" },
  [LeadPriority.HIGH]: { label: "High" },
};

export const BUYER_VERIFICATION_META: Record<
  BuyerVerificationStatus,
  { label: string; description: string }
> = {
  [BuyerVerificationStatus.UNVERIFIED]: {
    label: "Unverified",
    description: "Buyer identity not yet verified.",
  },
  [BuyerVerificationStatus.PENDING]: {
    label: "FICA pending",
    description: "Buyer verification in progress.",
  },
  [BuyerVerificationStatus.VERIFIED]: {
    label: "FICA cleared",
    description: "Buyer verification complete.",
  },
};
