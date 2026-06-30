"use server";

import { z } from "zod";
import { ListingStatus, PhotoStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, hasAnyRole, SELLER_ROLES } from "@/lib/auth/roles";
import { computeCompleteness } from "@/lib/completeness";
import {
  type AircraftFormValues,
} from "@/components/dashboard/seller/upload/schema";
import {
  assertCanAccessGuidedPhoto,
  deleteGuidedPhotoObject,
  findGuidedPhotoForSlot,
  getSignedPreviewForPhoto,
} from "@/lib/upload/guided-photo-access";
import { getGuidedPhotoSlotLabel, isGuidedPhotoSlotKey } from "@/lib/upload/photo-slot-keys";
import {
  assertSellerOwnsListing,
  persistAircraftPhotoUpload,
} from "@/lib/upload/persist-aircraft-photo";
import { isR2UploadConfigured } from "@/lib/upload/r2-env";
import { getListingUploadPrefill, saveDraftListingFromIntake, type SaveDraftListingResult } from "./actions";

export type EnsureListingForUploadResult =
  | { ok: true; listingId: string; registration: string }
  | { ok: false; error: string; field?: keyof AircraftFormValues };

export type RemoveGuidedPhotoResult =
  | { ok: true }
  | { ok: false; error: string };

export async function isGuidedPhotoUploadAvailable(): Promise<boolean> {
  return isR2UploadConfigured();
}

export async function ensureListingForPhotoUpload(
  values: AircraftFormValues,
  listingId?: string | null,
): Promise<EnsureListingForUploadResult> {
  const result = await saveDraftListingFromIntake(values, [], [], listingId);
  if (!result.ok) {
    return { ok: false, error: result.error, field: result.field };
  }
  return { ok: true, listingId: result.id, registration: result.registration };
}

export async function removeGuidedPhotoForSlot(
  listingId: string,
  slotKey: string,
): Promise<RemoveGuidedPhotoResult> {
  const session = await requireAnyRole(SELLER_ROLES);

  if (!isGuidedPhotoSlotKey(slotKey)) {
    return { ok: false, error: "Unknown guided photo slot." };
  }

  try {
    await assertSellerOwnsListing(listingId, session.user.id);

    const photo = await prisma.aircraftPhoto.findFirst({
      where: { listingId, slotKey },
      select: {
        id: true,
        storageKey: true,
        uploadedById: true,
        listing: { select: { sellerId: true } },
      },
    });

    if (!photo) {
      return { ok: true };
    }

    await assertCanAccessGuidedPhoto(photo, session.user.id);

    if (photo.storageKey) {
      await deleteGuidedPhotoObject(photo.storageKey);
    }

    await prisma.aircraftPhoto.delete({ where: { id: photo.id } });

    await prisma.listingEvent.create({
      data: {
        listingId,
        actorId: session.user.id,
        type: "PHOTO_REMOVED",
        message: getGuidedPhotoSlotLabel(slotKey),
        metadata: { slotKey, storageKey: photo.storageKey },
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("removeGuidedPhotoForSlot failed", error);
    return { ok: false, error: "Could not remove this photo. Please try again." };
  }
}

const registerLocalPhotoSchema = z.object({
  listingId: z.string().min(1),
  slotKey: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
});

/** Fallback when R2 is not configured — keeps slot metadata in the database only. */
export async function registerLocalGuidedPhoto(
  input: z.infer<typeof registerLocalPhotoSchema>,
): Promise<{ ok: true; photoId: string } | { ok: false; error: string }> {
  const session = await requireAnyRole(SELLER_ROLES);
  const parsed = registerLocalPhotoSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid photo upload payload." };
  }

  try {
    const photo = await persistAircraftPhotoUpload({
      listingId: parsed.data.listingId,
      slotKey: parsed.data.slotKey,
      uploadedById: session.user.id,
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
      storageKey: `local/${parsed.data.listingId}/${parsed.data.slotKey}/${parsed.data.fileName}`,
    });

    return { ok: true, photoId: photo.id };
  } catch (error) {
    console.error("registerLocalGuidedPhoto failed", error);
    return { ok: false, error: "Could not save photo metadata." };
  }
}

export async function getGuidedPhotoSlotAfterUpload(
  listingId: string,
  slotKey: string,
): Promise<
  | {
      ok: true;
      photoId: string;
      previewUrl: string | null;
      fileName: string;
      sizeLabel: string;
      storageKey: string | null;
    }
  | { ok: false; error: string }
> {
  const session = await requireAnyRole(SELLER_ROLES);

  if (!isGuidedPhotoSlotKey(slotKey)) {
    return { ok: false, error: "Unknown guided photo slot." };
  }

  try {
    const photo = await findGuidedPhotoForSlot(listingId, slotKey);
    if (!photo) {
      return { ok: false, error: "Photo record not found yet." };
    }

    await assertCanAccessGuidedPhoto(photo, session.user.id);

    const previewUrl = await getSignedPreviewForPhoto(photo);

    return {
      ok: true,
      photoId: photo.id,
      previewUrl,
      fileName: photo.fileName,
      sizeLabel: photo.sizeBytes ? `${Math.round(photo.sizeBytes / 1024)} KB` : "On file",
      storageKey: photo.storageKey,
    };
  } catch (error) {
    console.error("getGuidedPhotoSlotAfterUpload failed", error);
    return { ok: false, error: "Could not load uploaded photo details." };
  }
}

export async function resolveGuidedPhotoPreviews(listingId: string): Promise<
  Record<
    string,
    {
      name: string;
      sizeLabel: string;
      photoId: string;
      storageKey?: string;
      previewUrl?: string;
      status: "on-file";
    }
  >
> {
  const session = await requireAnyRole(SELLER_ROLES);

  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    select: {
      photos: {
        select: {
          id: true,
          slotKey: true,
          fileName: true,
          sizeBytes: true,
          storageKey: true,
        },
      },
    },
  });

  if (!listing) {
    return {};
  }

  const result: Record<
    string,
    {
      name: string;
      sizeLabel: string;
      photoId: string;
      storageKey?: string;
      previewUrl?: string;
      status: "on-file";
    }
  > = {};

  for (const photo of listing.photos) {
    const previewUrl = await getSignedPreviewForPhoto(photo);
    result[photo.slotKey] = {
      name: photo.fileName,
      sizeLabel: photo.sizeBytes ? `${Math.round(photo.sizeBytes / 1024)} KB` : "On file",
      photoId: photo.id,
      storageKey: photo.storageKey ?? undefined,
      previewUrl: previewUrl ?? undefined,
      status: "on-file",
    };
  }

  return result;
}

const WORKSPACE_PHOTO_ROLES = [...SELLER_ROLES, ...ADMIN_ROLES] as const;

/** Signed previews for listing workspace (seller or admin). */
export async function resolveWorkspacePhotoPreviews(listingId: string): Promise<
  Record<string, { previewUrl?: string }>
> {
  const session = await requireAnyRole([...WORKSPACE_PHOTO_ROLES]);
  const isAdmin = hasAnyRole(session.user.roles, ADMIN_ROLES);

  const listing = await prisma.aircraftListing.findFirst({
    where: {
      id: listingId,
      ...(isAdmin ? {} : { sellerId: session.user.id }),
    },
    select: {
      photos: {
        select: {
          id: true,
          slotKey: true,
          storageKey: true,
        },
      },
    },
  });

  if (!listing) {
    return {};
  }

  const result: Record<string, { previewUrl?: string }> = {};

  for (const photo of listing.photos) {
    const previewUrl = await getSignedPreviewForPhoto(photo);
    result[photo.slotKey] = { previewUrl: previewUrl ?? undefined };
  }

  return result;
}

export type GuidedPhotoPrefill = {
  name: string;
  sizeLabel: string;
  photoId?: string;
  storageKey?: string;
  previewUrl?: string;
  status: "on-file";
};

/** Load guided photos from the database with signed preview URLs when available. */
export async function loadGuidedPhotosForListing(
  listingId: string,
): Promise<Record<string, GuidedPhotoPrefill>> {
  const [uploads, signedPhotos] = await Promise.all([
    getListingUploadPrefill(listingId),
    resolveGuidedPhotoPreviews(listingId).catch(() => ({})),
  ]);

  if (Object.keys(signedPhotos).length > 0) {
    return signedPhotos;
  }

  return Object.fromEntries(
    Object.entries(uploads.photos).map(([slot, file]) => [
      slot,
      { ...file, status: "on-file" as const },
    ]),
  );
}

export async function refreshListingCompleteness(listingId: string) {
  const session = await requireAnyRole(SELLER_ROLES);
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    include: {
      airframe: true,
      engines: true,
      propellers: true,
      avionics: true,
      maintenance: true,
      photos: { where: { status: { not: PhotoStatus.EMPTY } } },
      documents: true,
    },
  });

  if (!listing) return;

  const values = {
    registration: listing.registration,
    registrationType: listing.registrationType,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    category: listing.category,
    saleType: listing.saleType,
    askingPrice: listing.askingPrice ?? undefined,
    reservePrice: listing.reservePrice ?? undefined,
    valuationEstimate: listing.valuationEstimate ?? undefined,
    ttaf: listing.airframe?.totalTimeAirframe ?? undefined,
    engineMakeModel: listing.engines[0]?.model ?? undefined,
    engineHours: listing.engines[0]?.engineHours ?? undefined,
    tso: listing.engines[0]?.timeSinceOverhaul ?? undefined,
    propellerMakeModel: listing.propellers[0]?.model ?? undefined,
    propellerHours: listing.propellers[0]?.propellerHours ?? undefined,
    avionics: listing.avionics?.summary ?? undefined,
    maintenanceStatus: listing.maintenance?.status ?? undefined,
    lastMpiDate: listing.maintenance?.lastMpiDate ?? undefined,
  } as AircraftFormValues;

  const completeness = computeCompleteness({
    values,
    photoCount: listing.photos.length,
    documentCount: listing.documents.length,
  });

  const editableStatuses: ListingStatus[] = [ListingStatus.DRAFT, ListingStatus.NEEDS_CHANGES];
  if (!editableStatuses.includes(listing.status as ListingStatus)) return;

  await prisma.aircraftListing.update({
    where: { id: listingId },
    data: { completenessScore: completeness.score },
  });
}

export type { SaveDraftListingResult };
