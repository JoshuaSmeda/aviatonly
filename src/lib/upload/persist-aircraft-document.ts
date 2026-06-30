import { DocumentStatus, DocumentVisibility } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { deleteGuidedDocumentObject } from "@/lib/upload/guided-document-access";
import { getGuidedDocumentSlotLabel, isGuidedDocumentSlotKey } from "@/lib/upload/document-slot-keys";
import { assertSellerOwnsListing } from "@/lib/upload/persist-aircraft-photo";
import { isRemoteStorageKey } from "@/lib/upload/r2-storage";

export interface PersistAircraftDocumentInput {
  listingId: string;
  documentType: string;
  uploadedById: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  storageKey: string;
}

export async function persistAircraftDocumentUpload(input: PersistAircraftDocumentInput) {
  if (!isGuidedDocumentSlotKey(input.documentType)) {
    throw new Error("Invalid guided document slot.");
  }

  await assertSellerOwnsListing(input.listingId, input.uploadedById);

  const existing = await prisma.aircraftDocument.findFirst({
    where: {
      listingId: input.listingId,
      documentType: input.documentType,
    },
    select: { id: true, storageKey: true, fileName: true },
  });

  if (existing?.storageKey === input.storageKey) {
    return {
      id: existing.id,
      documentType: input.documentType,
      fileName: existing.fileName ?? input.fileName,
    };
  }

  if (
    existing?.storageKey &&
    isRemoteStorageKey(existing.storageKey) &&
    existing.storageKey !== input.storageKey
  ) {
    try {
      await deleteGuidedDocumentObject(existing.storageKey);
    } catch (error) {
      console.warn("Could not delete replaced document object from R2", error);
    }
  }

  const data = {
    fileName: input.fileName,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    storageKey: input.storageKey,
    reviewStatus: DocumentStatus.UPLOADED,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    uploadedById: input.uploadedById,
    uploadedAt: new Date(),
    rejectionReason: null,
    reviewedAt: null,
    reviewedById: null,
  };

  const document = existing
    ? await prisma.aircraftDocument.update({
        where: { id: existing.id },
        data,
        select: { id: true, documentType: true, fileName: true },
      })
    : await prisma.aircraftDocument.create({
        data: {
          listingId: input.listingId,
          documentType: input.documentType,
          ...data,
        },
        select: { id: true, documentType: true, fileName: true },
      });

  const slotLabel = getGuidedDocumentSlotLabel(input.documentType);
  const isReplacement = Boolean(existing);

  await prisma.listingEvent.create({
    data: {
      listingId: input.listingId,
      actorId: input.uploadedById,
      type: isReplacement ? "DOCUMENT_REPLACED" : "DOCUMENT_UPLOADED",
      message: slotLabel,
      metadata: {
        documentId: document.id,
        documentType: input.documentType,
        storageKey: input.storageKey,
      },
    },
  });

  return document;
}
