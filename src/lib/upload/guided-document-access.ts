import { ADMIN_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import {
  deleteR2Object,
  getR2PresignedDownloadUrl,
  isRemoteStorageKey,
} from "@/lib/upload/r2-storage";

const DOCUMENT_DOWNLOAD_TTL_SECONDS = 900;

export async function assertCanAccessGuidedDocument(
  document: {
    uploadedById: string | null;
    visibility: string;
    listing: { sellerId: string; status: string };
  },
  userId: string,
  userRoles: string[],
) {
  const isAdmin = hasAnyRole(userRoles as never, ADMIN_ROLES);
  const isSeller = document.listing.sellerId === userId;
  const isUploader = document.uploadedById === userId;

  if (isAdmin || isSeller || isUploader) {
    return;
  }

  throw new Error("You do not have access to this document.");
}

export async function getSignedDownloadForDocument(document: {
  id: string;
  storageKey: string | null;
}) {
  if (!isRemoteStorageKey(document.storageKey)) {
    return null;
  }

  return getR2PresignedDownloadUrl(document.storageKey, DOCUMENT_DOWNLOAD_TTL_SECONDS);
}

export async function deleteGuidedDocumentObject(storageKey: string | null) {
  if (!isRemoteStorageKey(storageKey)) {
    return;
  }

  try {
    await deleteR2Object(storageKey);
  } catch (error) {
    console.error("deleteGuidedDocumentObject failed", storageKey, error);
    throw new Error("Could not delete the file from storage.");
  }
}

export async function findGuidedDocumentForSlot(listingId: string, documentType: string) {
  return prisma.aircraftDocument.findFirst({
    where: { listingId, documentType },
    select: {
      id: true,
      documentType: true,
      fileName: true,
      sizeBytes: true,
      storageKey: true,
      mimeType: true,
      uploadedById: true,
      visibility: true,
      listing: { select: { sellerId: true, status: true } },
    },
  });
}
