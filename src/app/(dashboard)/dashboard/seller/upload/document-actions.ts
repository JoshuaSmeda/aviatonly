"use server";

import { z } from "zod";
import { DocumentStatus, ListingStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, hasAnyRole, SELLER_ROLES } from "@/lib/auth/roles";
import { computeCompleteness } from "@/lib/completeness";
import { type AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import {
  assertCanAccessGuidedDocument,
  deleteGuidedDocumentObject,
  findGuidedDocumentForSlot,
} from "@/lib/upload/guided-document-access";
import { getGuidedDocumentSlotLabel, isGuidedDocumentSlotKey } from "@/lib/upload/document-slot-keys";
import { persistAircraftDocumentUpload } from "@/lib/upload/persist-aircraft-document";
import { assertSellerOwnsListing } from "@/lib/upload/persist-aircraft-photo";
import { isR2UploadConfigured } from "@/lib/upload/r2-env";
import { getListingUploadPrefill, saveDraftListingFromIntake } from "./actions";
import type { EnsureListingForUploadResult, RemoveGuidedPhotoResult } from "./photo-actions";

export async function isGuidedDocumentUploadAvailable(): Promise<boolean> {
  return isR2UploadConfigured();
}

export async function ensureListingForDocumentUpload(
  values: AircraftFormValues,
  listingId?: string | null,
): Promise<EnsureListingForUploadResult> {
  const result = await saveDraftListingFromIntake(values, [], [], listingId);
  if (!result.ok) {
    return { ok: false, error: result.error, field: result.field };
  }
  return { ok: true, listingId: result.id, registration: result.registration };
}

export async function removeGuidedDocumentForSlot(
  listingId: string,
  documentType: string,
): Promise<RemoveGuidedPhotoResult> {
  const session = await requireAnyRole(SELLER_ROLES);

  if (!isGuidedDocumentSlotKey(documentType)) {
    return { ok: false, error: "Unknown guided document slot." };
  }

  try {
    await assertSellerOwnsListing(listingId, session.user.id);

    const document = await prisma.aircraftDocument.findFirst({
      where: { listingId, documentType },
      select: {
        id: true,
        storageKey: true,
        uploadedById: true,
        visibility: true,
        listing: { select: { sellerId: true, status: true } },
      },
    });

    if (!document) {
      return { ok: true };
    }

    await assertCanAccessGuidedDocument(document, session.user.id, session.user.roles);

    if (document.storageKey) {
      await deleteGuidedDocumentObject(document.storageKey);
    }

    await prisma.aircraftDocument.delete({ where: { id: document.id } });

    await prisma.listingEvent.create({
      data: {
        listingId,
        actorId: session.user.id,
        type: "DOCUMENT_REMOVED",
        message: getGuidedDocumentSlotLabel(documentType),
        metadata: { documentType, storageKey: document.storageKey },
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("removeGuidedDocumentForSlot failed", error);
    return { ok: false, error: "Could not remove this document. Please try again." };
  }
}

const registerLocalDocumentSchema = z.object({
  listingId: z.string().min(1),
  documentType: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
});

export async function registerLocalGuidedDocument(
  input: z.infer<typeof registerLocalDocumentSchema>,
): Promise<{ ok: true; documentId: string } | { ok: false; error: string }> {
  const session = await requireAnyRole(SELLER_ROLES);
  const parsed = registerLocalDocumentSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid document upload payload." };
  }

  try {
    const document = await persistAircraftDocumentUpload({
      listingId: parsed.data.listingId,
      documentType: parsed.data.documentType,
      uploadedById: session.user.id,
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
      storageKey: `local/${parsed.data.listingId}/${parsed.data.documentType}/${parsed.data.fileName}`,
    });

    return { ok: true, documentId: document.id };
  } catch (error) {
    console.error("registerLocalGuidedDocument failed", error);
    return { ok: false, error: "Could not save document metadata." };
  }
}

export async function getGuidedDocumentSlotAfterUpload(
  listingId: string,
  documentType: string,
): Promise<
  | {
      ok: true;
      documentId: string;
      fileName: string;
      sizeLabel: string;
      storageKey: string | null;
    }
  | { ok: false; error: string }
> {
  const session = await requireAnyRole(SELLER_ROLES);

  if (!isGuidedDocumentSlotKey(documentType)) {
    return { ok: false, error: "Unknown guided document slot." };
  }

  try {
    const document = await findGuidedDocumentForSlot(listingId, documentType);
    if (!document) {
      return { ok: false, error: "Document record not found yet." };
    }

    await assertCanAccessGuidedDocument(document, session.user.id, session.user.roles);

    return {
      ok: true,
      documentId: document.id,
      fileName: document.fileName,
      sizeLabel: document.sizeBytes ? `${Math.round(document.sizeBytes / 1024)} KB` : "On file",
      storageKey: document.storageKey,
    };
  } catch (error) {
    console.error("getGuidedDocumentSlotAfterUpload failed", error);
    return { ok: false, error: "Could not load uploaded document details." };
  }
}

export type GuidedDocumentPrefill = {
  name: string;
  sizeLabel: string;
  documentId?: string;
  storageKey?: string;
  status: "on-file";
};

export async function resolveGuidedDocumentsForListing(
  listingId: string,
): Promise<Record<string, GuidedDocumentPrefill>> {
  const session = await requireAnyRole(SELLER_ROLES);

  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    select: {
      documents: {
        select: {
          id: true,
          documentType: true,
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

  const result: Record<string, GuidedDocumentPrefill> = {};

  for (const document of listing.documents) {
    result[document.documentType] = {
      name: document.fileName,
      sizeLabel: document.sizeBytes ? `${Math.round(document.sizeBytes / 1024)} KB` : "On file",
      documentId: document.id,
      storageKey: document.storageKey ?? undefined,
      status: "on-file",
    };
  }

  return result;
}

export async function loadGuidedDocumentsForListing(
  listingId: string,
): Promise<Record<string, GuidedDocumentPrefill>> {
  const [uploads, documents] = await Promise.all([
    getListingUploadPrefill(listingId),
    resolveGuidedDocumentsForListing(listingId).catch(() => ({})),
  ]);

  if (Object.keys(documents).length > 0) {
    return documents;
  }

  return Object.fromEntries(
    Object.entries(uploads.documents).map(([slot, file]) => [
      slot,
      { ...file, status: "on-file" as const },
    ]),
  );
}

const WORKSPACE_DOCUMENT_ROLES = [...SELLER_ROLES, ...ADMIN_ROLES] as const;

export async function getWorkspaceDocumentDownloadPath(
  listingId: string,
  documentId: string,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const session = await requireAnyRole([...WORKSPACE_DOCUMENT_ROLES]);
  const isAdmin = hasAnyRole(session.user.roles, ADMIN_ROLES);

  const document = await prisma.aircraftDocument.findFirst({
    where: { id: documentId, listingId },
    select: {
      id: true,
      uploadedById: true,
      visibility: true,
      listing: { select: { sellerId: true, status: true } },
    },
  });

  if (!document) {
    return { ok: false, error: "Document not found." };
  }

  if (!isAdmin && document.listing.sellerId !== session.user.id) {
    return { ok: false, error: "You do not have access to this document." };
  }

  return { ok: true, path: `/api/listings/${listingId}/documents/${documentId}` };
}

export async function refreshListingCompletenessFromDocuments(listingId: string) {
  const session = await requireAnyRole(SELLER_ROLES);
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    include: {
      airframe: true,
      engines: true,
      propellers: true,
      avionics: true,
      maintenance: true,
      photos: true,
      documents: { where: { reviewStatus: { not: DocumentStatus.MISSING } } },
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
