"use server";

import { revalidatePath } from "next/cache";
import {
  sellerFixListingDocumentRecord,
  sellerFixListingFieldRecord,
  sellerFixListingPhotoRecord,
} from "@/lib/aviatonly/server/seller-review-fix";
import { requireAnyRole } from "@/lib/auth/session";
import { SELLER_ROLES } from "@/lib/auth/roles";

export type SellerReviewFixActionResult =
  | { ok: true; listingId: string; allFixesSubmitted?: boolean }
  | { ok: false; error: string };

function revalidateListing(listingId: string) {
  revalidatePath(`/dashboard/listings/${listingId}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/seller/upload");
}

export async function sellerFixListingFieldAction(input: {
  listingId: string;
  fieldKey: string;
  value: string;
}): Promise<SellerReviewFixActionResult> {
  try {
    const session = await requireAnyRole(SELLER_ROLES);
    const result = await sellerFixListingFieldRecord({
      ...input,
      sellerId: session.user.id,
    });
    if (!result.ok) {
      return result;
    }
    revalidateListing(result.listingId);
    return {
      ok: true,
      listingId: result.listingId,
      allFixesSubmitted: result.allFixesSubmitted,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save your fix.",
    };
  }
}

export async function sellerFixListingPhotoAction(input: {
  listingId: string;
  photoId: string;
  fileName: string;
}): Promise<SellerReviewFixActionResult> {
  try {
    const session = await requireAnyRole(SELLER_ROLES);
    const result = await sellerFixListingPhotoRecord({
      ...input,
      sellerId: session.user.id,
    });
    if (!result.ok) {
      return result;
    }
    revalidateListing(result.listingId);
    return {
      ok: true,
      listingId: result.listingId,
      allFixesSubmitted: result.allFixesSubmitted,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save your photo fix.",
    };
  }
}

export async function sellerFixListingDocumentAction(input: {
  listingId: string;
  documentId: string;
  fileName: string;
}): Promise<SellerReviewFixActionResult> {
  try {
    const session = await requireAnyRole(SELLER_ROLES);
    const result = await sellerFixListingDocumentRecord({
      ...input,
      sellerId: session.user.id,
    });
    if (!result.ok) {
      return result;
    }
    revalidateListing(result.listingId);
    return {
      ok: true,
      listingId: result.listingId,
      allFixesSubmitted: result.allFixesSubmitted,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save your document fix.",
    };
  }
}
