"use server";

import { revalidatePath } from "next/cache";
import { OfferStatus } from "@/lib/aviatonly/domain";
import {
  assertCanManageOffer,
  AuthorizationError,
  NotFoundError,
} from "@/lib/aviatonly/server/authorization";
import {
  addOfferNoteRecord,
  createOfferRecord,
  transitionOfferStatusRecord,
} from "@/lib/aviatonly/server/offers";
import { requireAuth, requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";

export type OfferActionResult =
  | { ok: true; offerId: string }
  | { ok: false; error: string };

function toErrorResult(error: unknown): OfferActionResult {
  if (error instanceof AuthorizationError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

function revalidateOfferPaths(offerId: string, listingId: string) {
  revalidatePath("/dashboard/seller/offers");
  revalidatePath("/dashboard/admin/offers");
  revalidatePath(`/dashboard/seller/offers/${offerId}`);
  revalidatePath(`/dashboard/listings/${listingId}`);
}

async function getOfferForAction(offerId: string) {
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) throw new NotFoundError("Offer not found.");
  return offer;
}

export async function createOfferAction(input: {
  listingId: string;
  amount: number;
  message?: string;
  expiresAt?: string;
}): Promise<OfferActionResult> {
  try {
    const session = await requireAuth();
    const offer = await createOfferRecord({
      listingId: input.listingId,
      buyerId: session.user.id,
      amount: input.amount,
      message: input.message?.trim(),
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      actorId: session.user.id,
    });

    revalidateOfferPaths(offer.id, offer.listingId);
    return { ok: true, offerId: offer.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function markOfferUnderReviewAction(offerId: string): Promise<OfferActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const offer = await getOfferForAction(offerId);
    assertCanManageOffer(offer, session);

    const updated = await transitionOfferStatusRecord({
      offerId,
      toStatus: OfferStatus.UNDER_REVIEW,
      actorId: session.user.id,
      message: "Offer moved to under review.",
    });

    revalidateOfferPaths(updated.id, updated.listingId);
    return { ok: true, offerId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function counterOfferAction(input: {
  offerId: string;
  counterAmount: number;
  counterMessage?: string;
}): Promise<OfferActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const offer = await getOfferForAction(input.offerId);
    assertCanManageOffer(offer, session);

    const updated = await transitionOfferStatusRecord({
      offerId: input.offerId,
      toStatus: OfferStatus.SELLER_COUNTERED,
      actorId: session.user.id,
      counterAmount: input.counterAmount,
      counterMessage: input.counterMessage?.trim(),
      message: `Seller countered at ZAR ${input.counterAmount.toLocaleString("en-ZA")}.`,
    });

    revalidateOfferPaths(updated.id, updated.listingId);
    return { ok: true, offerId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function rejectOfferAction(
  offerId: string,
  rejectedReason: string,
): Promise<OfferActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const offer = await getOfferForAction(offerId);
    assertCanManageOffer(offer, session);

    const updated = await transitionOfferStatusRecord({
      offerId,
      toStatus: OfferStatus.REJECTED,
      actorId: session.user.id,
      rejectedReason: rejectedReason.trim(),
      message: `Offer rejected: ${rejectedReason.trim()}`,
    });

    revalidateOfferPaths(updated.id, updated.listingId);
    return { ok: true, offerId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function withdrawOfferAction(offerId: string): Promise<OfferActionResult> {
  try {
    const session = await requireAuth();
    const offer = await getOfferForAction(offerId);
    if (offer.buyerId !== session.user.id) {
      throw new AuthorizationError();
    }

    const updated = await transitionOfferStatusRecord({
      offerId,
      toStatus: OfferStatus.WITHDRAWN,
      actorId: session.user.id,
      message: "Buyer withdrew the offer.",
    });

    revalidateOfferPaths(updated.id, updated.listingId);
    return { ok: true, offerId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function addOfferNoteAction(
  offerId: string,
  note: string,
): Promise<OfferActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const offer = await getOfferForAction(offerId);
    assertCanManageOffer(offer, session);

    await addOfferNoteRecord(offerId, session.user.id, note.trim());
    revalidateOfferPaths(offerId, offer.listingId);
    return { ok: true, offerId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function transitionOfferStatusAction(input: {
  offerId: string;
  toStatus: OfferStatus;
  message?: string;
  rejectedReason?: string;
}): Promise<OfferActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const offer = await getOfferForAction(input.offerId);
    assertCanManageOffer(offer, session);

    const updated = await transitionOfferStatusRecord({
      offerId: input.offerId,
      toStatus: input.toStatus,
      actorId: session.user.id,
      message: input.message,
      rejectedReason: input.rejectedReason,
    });

    revalidateOfferPaths(updated.id, updated.listingId);
    return { ok: true, offerId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}
