import type { StatusMeta } from "./types";

/** Platform user roles. A user may hold multiple roles. */
export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  BROKER = "BROKER",
  INSPECTOR = "INSPECTOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const USER_ROLE_META: Record<UserRole, { label: string; description: string }> = {
  [UserRole.BUYER]: {
    label: "Buyer",
    description: "Browse listings, make offers, and progress purchases.",
  },
  [UserRole.SELLER]: {
    label: "Seller",
    description: "Submit aircraft, manage listings, and respond to buyer activity.",
  },
  [UserRole.BROKER]: {
    label: "Broker",
    description: "List and manage aircraft on behalf of owners.",
  },
  [UserRole.INSPECTOR]: {
    label: "Inspector",
    description: "Conduct AMO or platform inspections and record findings.",
  },
  [UserRole.ADMIN]: {
    label: "Admin",
    description: "Review listings, valuations, inspections, and publication.",
  },
  [UserRole.SUPER_ADMIN]: {
    label: "Super Admin",
    description: "Full platform administration and configuration.",
  },
};

/** Seller role options captured during aircraft intake (ownership step). */
export const SELLER_ROLES = [
  "Registered owner",
  "Co-owner",
  "Authorised agent / broker",
  "Executor / estate",
] as const;

export type SellerRole = (typeof SELLER_ROLES)[number];

/** Buyer activity types shown on the seller dashboard. */
export enum BuyerActivityType {
  ENQUIRY = "ENQUIRY",
  DOC_REQUEST = "DOC_REQUEST",
  OFFER = "OFFER",
}

export const BUYER_ACTIVITY_TYPE_META: Record<
  BuyerActivityType,
  { label: string; description: string }
> = {
  [BuyerActivityType.ENQUIRY]: {
    label: "Enquiry",
    description: "Buyer sent a general enquiry about this aircraft.",
  },
  [BuyerActivityType.DOC_REQUEST]: {
    label: "Document request",
    description: "Buyer requested access to private documents.",
  },
  [BuyerActivityType.OFFER]: {
    label: "Offer",
    description: "Buyer submitted a purchase offer.",
  },
};

export function getUserRoleMeta(role: UserRole) {
  return USER_ROLE_META[role];
}

export function getBuyerActivityTypeMeta(type: BuyerActivityType) {
  return BUYER_ACTIVITY_TYPE_META[type];
}
