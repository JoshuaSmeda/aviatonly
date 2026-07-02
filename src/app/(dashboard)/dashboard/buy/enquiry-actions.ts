"use server";

import { revalidatePath } from "next/cache";
import {
  BuyerVerificationStatus,
  LeadMessageValidationError,
  LeadSource,
  LeadType,
} from "@/lib/aviatonly/domain";
import { createLeadWithInitialMessage } from "@/lib/aviatonly/server/lead-messages";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type SubmitListingEnquiryResult =
  | { ok: true; leadId: string; reusedExistingLead: boolean }
  | { ok: false; error: string };

function revalidateEnquiryPaths(leadId: string, listingId: string) {
  revalidatePath("/dashboard/seller/leads");
  revalidatePath("/dashboard/admin/leads");
  revalidatePath(`/dashboard/seller/leads/${leadId}`);
  revalidatePath(`/dashboard/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/listings/${listingId}`);
  revalidatePath("/dashboard/seller/messages");
  revalidatePath(`/dashboard/seller/messages/${leadId}`);
  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${leadId}`);
}

export async function submitListingEnquiryAction(input: {
  listingId: string;
  message: string;
  type?: LeadType;
}): Promise<SubmitListingEnquiryResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { ok: false, error: "Sign in to send a message to the listing contact." };
    }

    const listing = await prisma.aircraftListing.findUnique({
      where: { id: input.listingId },
      select: { id: true, sellerId: true },
    });

    if (!listing) {
      return { ok: false, error: "Listing not found." };
    }

    if (listing.sellerId === session.user.id) {
      return { ok: false, error: "You cannot send an enquiry on your own listing." };
    }

    const result = await createLeadWithInitialMessage({
      listingId: listing.id,
      buyerId: session.user.id,
      type: input.type ?? LeadType.GENERAL_ENQUIRY,
      body: input.message,
      source: LeadSource.PUBLIC_LISTING,
      buyerVerificationStatus: BuyerVerificationStatus.UNVERIFIED,
    });

    revalidateEnquiryPaths(result.lead.id, listing.id);

    return {
      ok: true,
      leadId: result.lead.id,
      reusedExistingLead: result.reusedExistingLead,
    };
  } catch (error) {
    if (error instanceof LeadMessageValidationError) {
      return { ok: false, error: error.message };
    }
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Something went wrong." };
  }
}
