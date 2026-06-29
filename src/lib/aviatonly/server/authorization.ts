import type { AircraftListing, Lead, Offer } from "@prisma/client";
import type { AuthSession } from "@/lib/auth/session";
import { ADMIN_ROLES, SELLER_ROLES, hasAnyRole } from "@/lib/auth/roles";

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

function isAdmin(session: AuthSession): boolean {
  return hasAnyRole(session.user.roles, ADMIN_ROLES);
}

function isSellerOrBroker(session: AuthSession): boolean {
  return hasAnyRole(session.user.roles, [...SELLER_ROLES, "BROKER"]);
}

export function canAccessLead(lead: Pick<Lead, "buyerId" | "sellerId" | "assignedToId">, session: AuthSession): boolean {
  if (isAdmin(session)) return true;
  if (lead.buyerId === session.user.id) return true;
  if (lead.sellerId === session.user.id) return true;
  if (lead.assignedToId === session.user.id && isSellerOrBroker(session)) return true;
  return false;
}

export function canManageLead(lead: Pick<Lead, "sellerId" | "assignedToId">, session: AuthSession): boolean {
  if (isAdmin(session)) return true;
  if (lead.sellerId === session.user.id) return true;
  if (lead.assignedToId === session.user.id && isSellerOrBroker(session)) return true;
  return false;
}

export function assertCanAccessLead(
  lead: Pick<Lead, "buyerId" | "sellerId" | "assignedToId">,
  session: AuthSession,
): void {
  if (!canAccessLead(lead, session)) {
    throw new AuthorizationError();
  }
}

export function assertCanManageLead(
  lead: Pick<Lead, "sellerId" | "assignedToId">,
  session: AuthSession,
): void {
  if (!canManageLead(lead, session)) {
    throw new AuthorizationError();
  }
}

export function canAccessOffer(offer: Pick<Offer, "buyerId" | "sellerId">, session: AuthSession): boolean {
  if (isAdmin(session)) return true;
  if (offer.buyerId === session.user.id) return true;
  if (offer.sellerId === session.user.id) return true;
  return false;
}

export function canManageOffer(offer: Pick<Offer, "sellerId">, session: AuthSession): boolean {
  if (isAdmin(session)) return true;
  if (offer.sellerId === session.user.id) return true;
  return false;
}

export function assertCanAccessOffer(
  offer: Pick<Offer, "buyerId" | "sellerId">,
  session: AuthSession,
): void {
  if (!canAccessOffer(offer, session)) {
    throw new AuthorizationError();
  }
}

export function assertCanManageOffer(
  offer: Pick<Offer, "sellerId">,
  session: AuthSession,
): void {
  if (!canManageOffer(offer, session)) {
    throw new AuthorizationError();
  }
}

export function canAccessListing(
  listing: Pick<AircraftListing, "sellerId">,
  session: AuthSession,
): boolean {
  if (isAdmin(session)) return true;
  if (listing.sellerId === session.user.id) return true;
  return false;
}

export function assertCanAccessListing(
  listing: Pick<AircraftListing, "sellerId">,
  session: AuthSession,
): void {
  if (!canAccessListing(listing, session)) {
    throw new AuthorizationError();
  }
}
