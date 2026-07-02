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
import { requireAnyRole } from "@/lib/auth/session";
import { hasAnyRole, SELLER_ROLES, ADMIN_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";

export type SellerMessageActionResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

function revalidateSellerMessagePaths(leadId: string, listingId: string) {
  revalidatePath("/dashboard/seller/messages");
  revalidatePath(`/dashboard/seller/messages/${leadId}`);
  revalidatePath(`/dashboard/seller/leads/${leadId}`);
  revalidatePath(`/dashboard/listings/${listingId}`);
}

function toErrorResult(error: unknown): SellerMessageActionResult {
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

export async function sendSellerLeadMessageAction(
  leadId: string,
  body: string,
): Promise<SellerMessageActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundError("Lead not found.");

    if (lead.sellerId !== session.user.id && !hasAnyRole(session.user.roles, ADMIN_ROLES)) {
      throw new AuthorizationError();
    }

    await appendLeadMessage(leadId, session.user.id, body);
    revalidateSellerMessagePaths(leadId, lead.listingId);
    return { ok: true, leadId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function markSellerThreadReadAction(leadId: string): Promise<SellerMessageActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundError("Lead not found.");

    if (lead.sellerId !== session.user.id && !hasAnyRole(session.user.roles, ADMIN_ROLES)) {
      throw new AuthorizationError();
    }

    await markLeadThreadRead(leadId, session.user.id);
    revalidatePath("/dashboard/seller/messages");
    revalidatePath(`/dashboard/seller/messages/${leadId}`);
    return { ok: true, leadId };
  } catch (error) {
    return toErrorResult(error);
  }
}
