"use server";

import { revalidatePath } from "next/cache";
import {
  LeadStatus,
  LeadType,
  LeadSource,
  LeadPriority,
  BuyerVerificationStatus,
} from "@/lib/aviatonly/domain";
import {
  assertCanManageLead,
  AuthorizationError,
  NotFoundError,
} from "@/lib/aviatonly/server/authorization";
import {
  addLeadNoteRecord,
  assignLeadRecord,
  createLeadRecord,
  logLeadDocAccessRecord,
  logLeadBuyerResponseRecord,
  scheduleLeadViewingRecord,
  setLeadFollowUpRecord,
  transitionLeadStatusRecord,
} from "@/lib/aviatonly/server/leads";
import { requireAuth, requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";

export type LeadActionResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

function toErrorResult(error: unknown): LeadActionResult {
  if (error instanceof AuthorizationError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

function revalidateLeadPaths(leadId: string, listingId: string) {
  revalidatePath("/dashboard/seller/leads");
  revalidatePath("/dashboard/admin/leads");
  revalidatePath(`/dashboard/seller/leads/${leadId}`);
  revalidatePath(`/dashboard/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/listings/${listingId}`);
}

async function getLeadForAction(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new NotFoundError("Lead not found.");
  return lead;
}

export async function createLeadAction(input: {
  listingId: string;
  type: LeadType;
  message: string;
  source?: LeadSource;
  priority?: LeadPriority;
}): Promise<LeadActionResult> {
  try {
    const session = await requireAuth();
    const lead = await createLeadRecord({
      listingId: input.listingId,
      buyerId: session.user.id,
      type: input.type,
      message: input.message.trim(),
      source: input.source,
      priority: input.priority,
      buyerVerificationStatus: BuyerVerificationStatus.UNVERIFIED,
      actorId: session.user.id,
    });

    revalidateLeadPaths(lead.id, lead.listingId);
    return { ok: true, leadId: lead.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function markLeadContactedAction(leadId: string): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await transitionLeadStatusRecord({
      leadId,
      toStatus: LeadStatus.CONTACTED,
      actorId: session.user.id,
      message: "Marked as contacted.",
      lastContactedAt: new Date(),
    });

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function qualifyLeadAction(leadId: string): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await transitionLeadStatusRecord({
      leadId,
      toStatus: LeadStatus.QUALIFIED,
      actorId: session.user.id,
      message: "Buyer qualified.",
    });

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function unqualifyLeadAction(
  leadId: string,
  reason: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await transitionLeadStatusRecord({
      leadId,
      toStatus: LeadStatus.UNQUALIFIED,
      actorId: session.user.id,
      message: reason.trim() || "Buyer unqualified.",
      internalNotesAppend: reason.trim() || undefined,
    });

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function closeLeadAction(
  leadId: string,
  closedReason: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await transitionLeadStatusRecord({
      leadId,
      toStatus: LeadStatus.CLOSED,
      actorId: session.user.id,
      closedReason: closedReason.trim(),
      message: `Lead closed: ${closedReason.trim()}`,
    });

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function addLeadNoteAction(leadId: string, note: string): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    await addLeadNoteRecord(leadId, session.user.id, note.trim());
    revalidateLeadPaths(leadId, lead.listingId);
    return { ok: true, leadId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function assignLeadAction(
  leadId: string,
  assigneeId: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole(ADMIN_ROLES);
    const lead = await getLeadForAction(leadId);

    const updated = await assignLeadRecord(leadId, assigneeId, session.user.id);
    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function setLeadFollowUpAction(
  leadId: string,
  nextFollowUpAt: string | null,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const date = nextFollowUpAt ? new Date(nextFollowUpAt) : null;
    const updated = await setLeadFollowUpRecord(leadId, session.user.id, date);
    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function transitionLeadStatusAction(input: {
  leadId: string;
  toStatus: LeadStatus;
  message?: string;
  closedReason?: string;
}): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(input.leadId);
    assertCanManageLead(lead, session);

    const updated = await transitionLeadStatusRecord({
      leadId: input.leadId,
      toStatus: input.toStatus,
      actorId: session.user.id,
      message: input.message,
      closedReason: input.closedReason,
    });

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function scheduleLeadViewingAction(
  leadId: string,
  note?: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await scheduleLeadViewingRecord(leadId, session.user.id, { note });
    if (!updated) throw new NotFoundError("Lead not found.");

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function grantLeadDocAccessAction(
  leadId: string,
  note?: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await logLeadDocAccessRecord(leadId, session.user.id, true, note);
    if (!updated) throw new NotFoundError("Lead not found.");

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function denyLeadDocAccessAction(
  leadId: string,
  note?: string,
): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(leadId);
    assertCanManageLead(lead, session);

    const updated = await logLeadDocAccessRecord(leadId, session.user.id, false, note);
    if (!updated) throw new NotFoundError("Lead not found.");

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function logLeadBuyerResponseAction(input: {
  leadId: string;
  channel: "EMAIL" | "CALL";
  message: string;
}): Promise<LeadActionResult> {
  try {
    const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
    const lead = await getLeadForAction(input.leadId);
    assertCanManageLead(lead, session);

    if (!input.message.trim()) {
      return { ok: false, error: "Enter what you told the buyer." };
    }

    const updated = await logLeadBuyerResponseRecord(
      input.leadId,
      session.user.id,
      input.channel,
      input.message,
    );
    if (!updated) throw new NotFoundError("Lead not found.");

    revalidateLeadPaths(updated.id, updated.listingId);
    return { ok: true, leadId: updated.id };
  } catch (error) {
    return toErrorResult(error);
  }
}
