"use server";

import { revalidatePath } from "next/cache";
import {
  assertCanAccessListing,
  AuthorizationError,
  NotFoundError,
} from "@/lib/aviatonly/server/authorization";
import {
  getIntakeReviewProgress,
  releaseIntakeReviewTasksRecord,
  reviewListingDocumentRecord,
  reviewListingFieldRecord,
  reviewListingPhotoRecord,
  startIntakeReviewRecord,
} from "@/lib/aviatonly/server/listing-intake-review";
import {
  approveListingForPublicationRecord,
  setPlatformIndicativeValueRecord,
} from "@/lib/aviatonly/server/listing-valuation";
import {
  recordListingInspectionOutcomeRecord,
  scheduleListingInspectionRecord,
} from "@/lib/aviatonly/server/listing-inspection";
import { publishListingRecord } from "@/lib/aviatonly/server/publish-listing";
import { ListingStatus } from "@/lib/aviatonly/domain";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type ListingReviewActionResult =
  | { ok: true; listingId: string; finalized?: boolean }
  | { ok: false; error: string };

function toErrorResult(error: unknown): ListingReviewActionResult {
  if (error instanceof AuthorizationError || error instanceof NotFoundError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

function revalidateListingPaths(
  listingId: string,
  options?: { full?: boolean; slug?: string },
) {
  revalidatePath(`/dashboard/listings/${listingId}`);
  if (options?.slug) {
    revalidatePath(`/dashboard/buy/${options.slug}`);
    revalidatePath(`/buy/${options.slug}`);
  }
  revalidatePath("/dashboard/buy");
  revalidatePath("/buy");
  if (options?.full) {
    revalidatePath("/dashboard/admin/review-queue");
    revalidatePath("/dashboard/listings");
    revalidatePath("/dashboard");
  }
}

async function requireAdminListingAccess(listingId: string) {
  const session = await requireAnyRole(ADMIN_ROLES);
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { id: true, sellerId: true, status: true, intakeReviewTasksReleasedAt: true },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  if (listing.status !== ListingStatus.UNDER_REVIEW) {
    throw new Error("Enter review mode before editing intake rows.");
  }

  if (listing.intakeReviewTasksReleasedAt) {
    throw new Error("Review tasks were already sent to the seller. Edits are locked.");
  }

  assertCanAccessListing(listing, session);
  return { session, listing };
}

async function requireAdminListingReadAccess(listingId: string) {
  const session = await requireAnyRole(ADMIN_ROLES);
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  assertCanAccessListing(listing, session);
  return { session, listing };
}

export async function adminReviewListingFieldAction(input: {
  listingId: string;
  fieldKey: string;
  label: string;
  approved: boolean;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingAccess(input.listingId);
    const result = await reviewListingFieldRecord({ ...input, actorId: session.user.id });
    revalidateListingPaths(input.listingId, { full: result.finalized });
    return { ok: true, listingId: input.listingId, finalized: result.finalized };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminReviewListingPhotoAction(input: {
  listingId: string;
  photoId: string;
  approved: boolean;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingAccess(input.listingId);
    const result = await reviewListingPhotoRecord({ ...input, actorId: session.user.id });
    revalidateListingPaths(input.listingId, { full: result.finalized });
    return { ok: true, listingId: input.listingId, finalized: result.finalized };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminReviewListingDocumentAction(input: {
  listingId: string;
  documentId: string;
  approved: boolean;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingAccess(input.listingId);
    const result = await reviewListingDocumentRecord({ ...input, actorId: session.user.id });
    revalidateListingPaths(input.listingId, { full: result.finalized });
    return { ok: true, listingId: input.listingId, finalized: result.finalized };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminReleaseIntakeReviewTasksAction(
  listingId: string,
): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingAccess(listingId);
    await releaseIntakeReviewTasksRecord(listingId, session.user.id);
    revalidateListingPaths(listingId, { full: true });
    return { ok: true, listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminStartIntakeReviewAction(
  listingId: string,
): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingReadAccess(listingId);
    await startIntakeReviewRecord(listingId, session.user.id);
    revalidateListingPaths(listingId, { full: true });
    return { ok: true, listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminGetIntakeReviewProgressAction(listingId: string) {
  try {
    await requireAdminListingReadAccess(listingId);
    const progress = await getIntakeReviewProgress(listingId);
    return { ok: true as const, progress };
  } catch (error) {
    const result = toErrorResult(error);
    return { ok: false as const, error: result.ok ? "Something went wrong." : result.error };
  }
}

export async function adminSetPlatformValuationAction(input: {
  listingId: string;
  amount: number;
  notes?: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingReadAccess(input.listingId);
    await setPlatformIndicativeValueRecord({
      listingId: input.listingId,
      amount: input.amount,
      actorId: session.user.id,
      notes: input.notes,
    });
    revalidateListingPaths(input.listingId, { full: true });
    return { ok: true, listingId: input.listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminApproveListingForPublicationAction(
  listingId: string,
): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingReadAccess(listingId);
    await approveListingForPublicationRecord({
      listingId,
      actorId: session.user.id,
    });
    revalidateListingPaths(listingId, { full: true });
    return { ok: true, listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminScheduleListingInspectionAction(input: {
  listingId: string;
  provider: string;
  location: string;
  scheduledAt: string;
  notes?: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingReadAccess(input.listingId);
    await scheduleListingInspectionRecord({
      ...input,
      actorId: session.user.id,
    });
    revalidateListingPaths(input.listingId, { full: true });
    return { ok: true, listingId: input.listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function adminRecordInspectionOutcomeAction(input: {
  listingId: string;
  passed: boolean;
  summary: string;
}): Promise<ListingReviewActionResult> {
  try {
    const { session } = await requireAdminListingReadAccess(input.listingId);
    await recordListingInspectionOutcomeRecord({
      ...input,
      actorId: session.user.id,
    });
    revalidateListingPaths(input.listingId, { full: true });
    return { ok: true, listingId: input.listingId };
  } catch (error) {
    return toErrorResult(error);
  }
}

export type PublishListingActionResult =
  | { ok: true; listingId: string; registration: string; publishedPhotoCount: number }
  | { ok: false; error: string };

async function requireAdminListingPublishAccess(listingId: string) {
  const session = await requireAnyRole(ADMIN_ROLES);
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  assertCanAccessListing(listing, session);
  return { session, listing };
}

export async function adminPublishListingAction(
  listingId: string,
): Promise<PublishListingActionResult> {
  try {
    const { session } = await requireAdminListingPublishAccess(listingId);
    const result = await publishListingRecord(listingId, session.user.id);
    revalidateListingPaths(listingId, {
      full: true,
      slug: result.slug,
    });
    return {
      ok: true,
      listingId: result.listingId,
      registration: result.registration,
      publishedPhotoCount: result.publishedPhotoCount,
    };
  } catch (error) {
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      return { ok: false, error: error.message };
    }
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Something went wrong." };
  }
}
