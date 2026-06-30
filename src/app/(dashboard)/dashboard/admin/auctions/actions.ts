"use server";

import { revalidatePath } from "next/cache";
import {
  AuthorizationError,
  NotFoundError,
} from "@/lib/aviatonly/server/authorization";
import {
  cancelAuctionRecord,
  closeAuctionRecord,
  createAuctionDraftRecord,
  getAdminAuctionStateRecord,
  scheduleAuctionRecord,
  startAuctionRecord,
  updateAuctionSettingsRecord,
} from "@/lib/aviatonly/server/auction/auction-admin";
import { auctionIncludeListing } from "@/lib/aviatonly/server/auction/auction-mappers";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type AuctionAdminActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function toErrorResult<T>(error: unknown): AuctionAdminActionResult<T> {
  if (error instanceof AuthorizationError || error instanceof NotFoundError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

async function requireAdmin() {
  return requireAnyRole(ADMIN_ROLES);
}

function revalidateAuctionPaths(registration?: string) {
  revalidatePath("/dashboard/auctions");
  revalidatePath("/dashboard/admin/auctions");
  revalidatePath("/buy");
  if (registration) {
    revalidatePath(`/buy/${registration}`);
  }
}

export async function createAuctionDraftAction(
  listingId: string,
): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await createAuctionDraftRecord(listingId, session.user.id);
    revalidateAuctionPaths();
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateAuctionSettingsAction(input: {
  auctionId: string;
  startsAt?: string;
  endsAt?: string;
  startingBid?: number;
  bidIncrement?: number;
  reservePrice?: number;
  noReserveConfirmed?: boolean;
  showReserveStatus?: boolean;
  showReservePrice?: boolean;
  showBidHistory?: boolean;
  buyerPremiumBps?: number;
  currency?: string;
  antiSnipeWindowMinutes?: number;
  antiSnipeExtensionMinutes?: number;
  maxExtensions?: number;
}): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await updateAuctionSettingsRecord({
      auctionId: input.auctionId,
      actorId: session.user.id,
      startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
      endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
      startingBid: input.startingBid,
      bidIncrement: input.bidIncrement,
      reservePrice: input.reservePrice,
      noReserveConfirmed: input.noReserveConfirmed,
      showReserveStatus: input.showReserveStatus,
      showReservePrice: input.showReservePrice,
      showBidHistory: input.showBidHistory,
      buyerPremiumBps: input.buyerPremiumBps,
      currency: input.currency,
      antiSnipeWindowMinutes: input.antiSnipeWindowMinutes,
      antiSnipeExtensionMinutes: input.antiSnipeExtensionMinutes,
      maxExtensions: input.maxExtensions,
    });
    revalidateAuctionPaths(auction.listing.registration);
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function scheduleAuctionAction(
  auctionId: string,
): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await scheduleAuctionRecord(auctionId, session.user.id);
    revalidateAuctionPaths(auction.listing.registration);
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function startAuctionAction(
  auctionId: string,
): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await startAuctionRecord(auctionId, session.user.id);
    revalidateAuctionPaths(auction.listing.registration);
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function cancelAuctionAction(
  auctionId: string,
  reason: string,
): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await cancelAuctionRecord(auctionId, session.user.id, reason);
    revalidateAuctionPaths(auction.listing.registration);
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function closeAuctionAction(
  auctionId: string,
  options?: { force?: boolean },
): Promise<AuctionAdminActionResult<{ auctionId: string }>> {
  try {
    const session = await requireAdmin();
    const auction = await closeAuctionRecord(auctionId, session.user.id, options);
    const refreshed = await prisma.auction.findUnique({
      where: { id: auction.id },
      include: auctionIncludeListing,
    });
    revalidateAuctionPaths(refreshed?.listing.registration);
    return { ok: true, data: { auctionId: auction.id } };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function getAdminAuctionStateAction(auctionId: string) {
  try {
    await requireAdmin();
    const state = await getAdminAuctionStateRecord(auctionId);
    return { ok: true as const, data: state };
  } catch (error) {
    return toErrorResult(error);
  }
}
