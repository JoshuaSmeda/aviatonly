import { PhotoStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { isGuidedPhotoSlotKey } from "@/lib/upload/photo-slot-keys";

export interface PersistAircraftPhotoInput {
  listingId: string;
  slotKey: string;
  uploadedById: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  storageKey: string;
  publicUrl?: string | null;
}

export async function assertSellerOwnsListing(listingId: string, sellerId: string) {
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId },
    select: { id: true, registration: true },
  });

  if (!listing) {
    throw new Error("Listing not found or you do not have access.");
  }

  return listing;
}

export async function persistAircraftPhotoUpload(input: PersistAircraftPhotoInput) {
  if (!isGuidedPhotoSlotKey(input.slotKey)) {
    throw new Error("Invalid guided photo slot.");
  }

  await assertSellerOwnsListing(input.listingId, input.uploadedById);

  const existing = await prisma.aircraftPhoto.findFirst({
    where: {
      listingId: input.listingId,
      slotKey: input.slotKey,
    },
    select: { id: true },
  });

  const data = {
    fileName: input.fileName,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    storageKey: input.storageKey,
    publicUrl: input.publicUrl ?? null,
    status: PhotoStatus.UPLOADED,
    uploadedById: input.uploadedById,
    uploadedAt: new Date(),
    rejectionReason: null,
    reviewedAt: null,
    reviewedById: null,
  };

  const photo = existing
    ? await prisma.aircraftPhoto.update({
        where: { id: existing.id },
        data,
        select: { id: true, slotKey: true, fileName: true },
      })
    : await prisma.aircraftPhoto.create({
        data: {
          listingId: input.listingId,
          slotKey: input.slotKey,
          ...data,
        },
        select: { id: true, slotKey: true, fileName: true },
      });

  await prisma.listingEvent.create({
    data: {
      listingId: input.listingId,
      actorId: input.uploadedById,
      type: "PHOTO_UPLOADED",
      message: `Guided photo uploaded: ${input.slotKey.replace(/-/g, " ")}.`,
      metadata: {
        photoId: photo.id,
        slotKey: input.slotKey,
        storageKey: input.storageKey,
      },
    },
  });

  return photo;
}
