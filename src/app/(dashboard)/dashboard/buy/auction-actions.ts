"use server";

import { revalidatePath } from "next/cache";
import {
  getPublicAuctionStateByListingIdRecord,
  getPublicAuctionStateRecord,
} from "@/lib/aviatonly/server/auction/auction-admin";
import { placeBidRecord } from "@/lib/aviatonly/server/auction/place-bid";
import { registerForAuctionRecord } from "@/lib/aviatonly/server/auction/register";
import {
  isWatchingAuctionRecord,
  unwatchAuctionRecord,
  watchAuctionRecord,
} from "@/lib/aviatonly/server/auction/watch";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type AuctionBuyerActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

function toErrorResult<T>(error: unknown): AuctionBuyerActionResult<T> {
  if (error instanceof NotFoundError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

async function revalidateForAuction(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    select: { listing: { select: { registration: true, slug: true } } },
  });
  if (auction?.listing.slug) {
    revalidatePath(`/dashboard/buy/${auction.listing.slug}`);
    revalidatePath("/dashboard/buy");
    revalidatePath(`/buy/${auction.listing.registration}`);
    revalidatePath("/buy");
  }
}

export async function registerForAuctionAction(
  auctionId: string,
): Promise<AuctionBuyerActionResult<{ registrationId: string; paddleNumber: number | null }>> {
  try {
    const session = await requireAuth();
    const result = await registerForAuctionRecord(auctionId, session.user.id);
    return {
      ok: true,
      data: {
        registrationId: result.registrationId,
        paddleNumber: result.paddleNumber,
      },
    };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function placeBidAction(
  auctionId: string,
  amount: number,
): Promise<
  AuctionBuyerActionResult<{
    accepted: boolean;
    auction: Awaited<ReturnType<typeof getPublicAuctionStateRecord>>;
    bidId?: string;
    reason?: string;
    code?: string;
  }>
> {
  try {
    const session = await requireAuth();
    const result = await placeBidRecord(auctionId, session.user.id, amount);
    await revalidateForAuction(auctionId);
    return {
      ok: true,
      data: {
        accepted: result.accepted,
        auction: result.auction,
        bidId: result.bidId,
        reason: result.reason,
        code: result.code,
      },
    };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function watchAuctionAction(
  auctionId: string,
): Promise<AuctionBuyerActionResult> {
  try {
    const session = await requireAuth();
    await watchAuctionRecord(session.user.id, auctionId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function unwatchAuctionAction(
  auctionId: string,
): Promise<AuctionBuyerActionResult> {
  try {
    const session = await requireAuth();
    await unwatchAuctionRecord(session.user.id, auctionId);
    return { ok: true, data: undefined };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function getPublicAuctionStateAction(auctionId: string) {
  try {
    const state = await getPublicAuctionStateRecord(auctionId);
    return { ok: true as const, data: state };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function getPublicAuctionStateByListingAction(listingId: string) {
  try {
    const state = await getPublicAuctionStateByListingIdRecord(listingId);
    return { ok: true as const, data: state };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function getAuctionWatchStatusAction(auctionId: string) {
  try {
    const session = await requireAuth();
    const watching = await isWatchingAuctionRecord(session.user.id, auctionId);
    return { ok: true as const, data: { watching } };
  } catch (error) {
    return toErrorResult(error);
  }
}
