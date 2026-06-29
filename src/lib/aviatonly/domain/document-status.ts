import type { StatusMeta } from "./types";

/** Must stay in sync with `DocumentStatus` in `prisma/schema.prisma`. */
export enum DocumentStatus {
  MISSING = "MISSING",
  UPLOADED = "UPLOADED",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  NEEDS_REPLACEMENT = "NEEDS_REPLACEMENT",
}

/** Must stay in sync with `DocumentVisibility` in `prisma/schema.prisma`. */
export enum DocumentVisibility {
  PRIVATE_INTERNAL = "PRIVATE_INTERNAL",
  AVAILABLE_ON_REQUEST = "AVAILABLE_ON_REQUEST",
  SHARED_WITH_VERIFIED_BUYER = "SHARED_WITH_VERIFIED_BUYER",
  PUBLIC_SUMMARY_ONLY = "PUBLIC_SUMMARY_ONLY",
}

export const DOCUMENT_STATUS_META: Record<DocumentStatus, StatusMeta> = {
  [DocumentStatus.MISSING]: {
    label: "Missing",
    description: "Required document not yet uploaded.",
    badgeVariant: "secondary",
  },
  [DocumentStatus.UPLOADED]: {
    label: "Uploaded",
    description: "Document uploaded and awaiting review.",
    badgeVariant: "outline",
  },
  [DocumentStatus.UNDER_REVIEW]: {
    label: "Under review",
    description: "AVIATONLY is reviewing this document.",
    badgeVariant: "outline",
  },
  [DocumentStatus.ACCEPTED]: {
    label: "Accepted",
    description: "Document accepted for this listing.",
    badgeVariant: "default",
  },
  [DocumentStatus.REJECTED]: {
    label: "Rejected",
    description: "Document rejected — upload a replacement.",
    badgeVariant: "destructive",
  },
  [DocumentStatus.EXPIRED]: {
    label: "Expired",
    description: "Document is out of date and must be renewed.",
    badgeVariant: "destructive",
  },
  [DocumentStatus.NEEDS_REPLACEMENT]: {
    label: "Needs replacement",
    description: "Upload a clearer or more recent version of this document.",
    badgeVariant: "destructive",
  },
};

export const DOCUMENT_VISIBILITY_META: Record<
  DocumentVisibility,
  { label: string; description: string }
> = {
  [DocumentVisibility.PRIVATE_INTERNAL]: {
    label: "Private · internal only",
    description: "Visible to AVIATONLY staff only.",
  },
  [DocumentVisibility.AVAILABLE_ON_REQUEST]: {
    label: "Available on request",
    description: "Buyer can request access; seller or admin must approve.",
  },
  [DocumentVisibility.SHARED_WITH_VERIFIED_BUYER]: {
    label: "Shared with verified buyer",
    description: "Released to a verified buyer who has been granted access.",
  },
  [DocumentVisibility.PUBLIC_SUMMARY_ONLY]: {
    label: "Public summary only",
    description: "A non-sensitive summary may appear on the public listing.",
  },
};

export const ATTENTION_DOCUMENT_STATUSES: readonly DocumentStatus[] = [
  DocumentStatus.MISSING,
  DocumentStatus.REJECTED,
  DocumentStatus.EXPIRED,
  DocumentStatus.NEEDS_REPLACEMENT,
];

export function getDocumentStatusMeta(status: DocumentStatus): StatusMeta {
  return DOCUMENT_STATUS_META[status];
}

export function getDocumentVisibilityMeta(visibility: DocumentVisibility) {
  return DOCUMENT_VISIBILITY_META[visibility];
}

export function isAttentionDocumentStatus(status: DocumentStatus): boolean {
  return ATTENTION_DOCUMENT_STATUSES.includes(status);
}
