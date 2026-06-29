import { DocumentStatus, DocumentVisibility } from "@/lib/aviatonly/domain";
import type { MockAircraftDocument } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-28T12:00:00.000Z";

export const MOCK_DOCUMENTS: MockAircraftDocument[] = [
  {
    id: "doc-zs-abc-cor",
    listingId: "zs-abc",
    documentType: "cor",
    fileName: "ZS-ABC-Certificate-of-Registration.pdf",
    mimeType: "application/pdf",
    sizeBytes: 420_000,
    storageKey: "listings/zs-abc/docs/cor.pdf",
    reviewStatus: DocumentStatus.ACCEPTED,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: null,
    uploadedById: DEMO_SELLER_ID,
    reviewedById: "user-admin-reviewer",
    uploadedAt: "2026-05-18T14:00:00.000Z",
    reviewedAt: "2026-05-20T10:00:00.000Z",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "doc-zs-abc-mpi",
    listingId: "zs-abc",
    documentType: "mpi-stamp",
    fileName: "ZS-ABC-MPI-stamp.pdf",
    mimeType: "application/pdf",
    sizeBytes: 180_000,
    storageKey: null,
    reviewStatus: DocumentStatus.MISSING,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: null,
    uploadedById: null,
    reviewedById: null,
    uploadedAt: T,
    reviewedAt: null,
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "doc-zs-abc-engine-log",
    listingId: "zs-abc",
    documentType: "engine-logbook",
    fileName: "ZS-ABC-engine-logbook-summary.pdf",
    mimeType: "application/pdf",
    sizeBytes: 890_000,
    storageKey: "listings/zs-abc/docs/engine-logbook.pdf",
    reviewStatus: DocumentStatus.NEEDS_REPLACEMENT,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: "Summary pages incomplete — include latest overhaul entry.",
    uploadedById: DEMO_SELLER_ID,
    reviewedById: "user-admin-reviewer",
    uploadedAt: "2026-05-18T14:05:00.000Z",
    reviewedAt: "2026-06-28T11:00:00.000Z",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "doc-zu-xyz-coa",
    listingId: "zu-xyz",
    documentType: "coa",
    fileName: "ZU-XYZ-Authority-to-Fly.pdf",
    mimeType: "application/pdf",
    sizeBytes: 510_000,
    storageKey: "listings/zu-xyz/docs/atf.pdf",
    reviewStatus: DocumentStatus.ACCEPTED,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: null,
    uploadedById: DEMO_SELLER_ID,
    reviewedById: "user-admin-reviewer",
    uploadedAt: "2026-04-12T09:00:00.000Z",
    reviewedAt: "2026-04-14T11:00:00.000Z",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "doc-zs-def-cor",
    listingId: "zs-def",
    documentType: "cor",
    fileName: "ZS-DEF-Certificate-of-Registration.pdf",
    mimeType: "application/pdf",
    sizeBytes: 445_000,
    storageKey: "listings/zs-def/docs/cor.pdf",
    reviewStatus: DocumentStatus.ACCEPTED,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: null,
    uploadedById: DEMO_SELLER_ID,
    reviewedById: "user-admin-reviewer",
    uploadedAt: "2026-03-18T10:00:00.000Z",
    reviewedAt: "2026-03-20T09:00:00.000Z",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "doc-zs-mno-cor",
    listingId: "zs-mno",
    documentType: "cor",
    fileName: "ZS-MNO-Certificate-of-Registration.pdf",
    mimeType: "application/pdf",
    sizeBytes: 430_000,
    storageKey: "listings/zs-mno/docs/cor.pdf",
    reviewStatus: DocumentStatus.UNDER_REVIEW,
    visibility: DocumentVisibility.PRIVATE_INTERNAL,
    rejectionReason: null,
    uploadedById: "user-seller-elaine",
    reviewedById: null,
    uploadedAt: "2026-06-26T08:00:00.000Z",
    reviewedAt: null,
    createdAt: T,
    updatedAt: T,
  },
];

export function getMockDocumentsForListing(listingId: string): MockAircraftDocument[] {
  return MOCK_DOCUMENTS.filter((d) => d.listingId === listingId);
}

export function countMissingDocumentsForListing(listingId: string): number {
  return MOCK_DOCUMENTS.filter(
    (d) =>
      d.listingId === listingId &&
      (d.reviewStatus === DocumentStatus.MISSING ||
        d.reviewStatus === DocumentStatus.NEEDS_REPLACEMENT ||
        d.reviewStatus === DocumentStatus.REJECTED),
  ).length;
}
