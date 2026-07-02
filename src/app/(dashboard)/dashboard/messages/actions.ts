"use server";

import { revalidatePath } from "next/cache";
import { LeadMessageValidationError } from "@/lib/aviatonly/domain";
import {
  appendLeadMessage,
  markLeadThreadRead,
} from "@/lib/aviatonly/server/lead-messages";
import {
  AuthorizationError,
  NotFoundError,
} from "@/lib/aviatonly/server/authorization";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type BuyerMessageActionResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

function revalidateBuyerMessagePaths(leadId: string, listingId: string) {
  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${leadId}`);
  revalidatePath("/dashboard/seller/messages");
  revalidatePath(`/dashboard/seller/messages/${leadId}`);
  revalidatePath(`/dashboard/seller/leads/${leadId}`);
  revalidatePath(`/dashboard/listings/${listingId}`);
}

function toErrorResult(error: unknown): BuyerMessageActionResult {
  if (error instanceof AuthorizationError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof LeadMessageValidationError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

export async function sendBuyerLeadMessageAction(
  leadId: string,
  body: string,
): Promise<BuyerMessageActionResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { ok: false, error: "Sign in to send a message." };
    }
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundError("Lead not found.");

    if (lead.buyerId !== session.user.id) {
      throw new AuthorizationError();
    }

    await appendLeadMessage(leadId, session.user.id, body);
    revalidateBuyerMessagePaths(leadId, lead.listingId);
    return { ok: true, leadId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function markBuyerThreadReadAction(leadId: string): Promise<BuyerMessageActionResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { ok: false, error: "Sign in to send a message." };
    }
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundError("Lead not found.");

    if (lead.buyerId !== session.user.id) {
      throw new AuthorizationError();
    }

    await markLeadThreadRead(leadId, session.user.id);
    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${leadId}`);
    return { ok: true, leadId };
  } catch (error) {
    return toErrorResult(error);
  }
}
