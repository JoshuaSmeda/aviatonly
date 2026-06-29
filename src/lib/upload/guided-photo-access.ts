import { prisma } from "@/lib/prisma";
import {
  deleteR2Object,
  getR2PresignedDownloadUrl,
  isRemoteStorageKey,
} from "@/lib/upload/r2-storage";

export async function assertCanAccessGuidedPhoto(
  photo: {
    uploadedById: string | null;
    listing: { sellerId: string };
  },
  userId: string,
) {
  const isSeller = photo.listing.sellerId === userId;
  const isUploader = photo.uploadedById === userId;

  if (!isSeller && !isUploader) {
    throw new Error("You do not have access to this photo.");
  }
}

export async function getSignedPreviewForPhoto(photo: {
  id: string;
  storageKey: string | null;
}) {
  if (!isRemoteStorageKey(photo.storageKey)) {
    return null;
  }

  return getR2PresignedDownloadUrl(photo.storageKey, 3600);
}

export async function deleteGuidedPhotoObject(storageKey: string | null) {
  if (!isRemoteStorageKey(storageKey)) {
    return;
  }

  try {
    await deleteR2Object(storageKey);
  } catch (error) {
    console.error("deleteGuidedPhotoObject failed", storageKey, error);
    throw new Error("Could not delete the file from storage.");
  }
}

export async function findGuidedPhotoForSlot(listingId: string, slotKey: string) {
  return prisma.aircraftPhoto.findFirst({
    where: { listingId, slotKey },
    select: {
      id: true,
      slotKey: true,
      fileName: true,
      sizeBytes: true,
      storageKey: true,
      uploadedById: true,
      listing: { select: { sellerId: true } },
    },
  });
}
