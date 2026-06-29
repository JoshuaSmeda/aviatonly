import type { StatusMeta } from "./types";

/** Must stay in sync with `PhotoStatus` in `prisma/schema.prisma`. */
export enum PhotoStatus {
  EMPTY = "EMPTY",
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  PROCESSING = "PROCESSING",
  READY = "READY",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEEDS_REPLACEMENT = "NEEDS_REPLACEMENT",
}

export const PHOTO_STATUS_META: Record<PhotoStatus, StatusMeta> = {
  [PhotoStatus.EMPTY]: {
    label: "Not uploaded",
    description: "This guided photo slot is still empty.",
    badgeVariant: "secondary",
  },
  [PhotoStatus.UPLOADING]: {
    label: "Uploading",
    description: "Photo upload is in progress.",
    badgeVariant: "outline",
  },
  [PhotoStatus.UPLOADED]: {
    label: "Uploaded",
    description: "Photo uploaded and awaiting processing or review.",
    badgeVariant: "outline",
  },
  [PhotoStatus.PROCESSING]: {
    label: "Processing",
    description: "Photo is being compressed and prepared for review.",
    badgeVariant: "outline",
  },
  [PhotoStatus.READY]: {
    label: "Ready for review",
    description: "Photo processed and ready for AVIATONLY review.",
    badgeVariant: "outline",
  },
  [PhotoStatus.APPROVED]: {
    label: "Approved",
    description: "Photo approved for the public listing gallery.",
    badgeVariant: "default",
  },
  [PhotoStatus.REJECTED]: {
    label: "Rejected",
    description: "Photo rejected and cannot be used on the listing.",
    badgeVariant: "destructive",
  },
  [PhotoStatus.NEEDS_REPLACEMENT]: {
    label: "Needs replacement",
    description: "Upload a clearer photo for this guided angle.",
    badgeVariant: "destructive",
  },
};

export const ATTENTION_PHOTO_STATUSES: readonly PhotoStatus[] = [
  PhotoStatus.REJECTED,
  PhotoStatus.NEEDS_REPLACEMENT,
];

export function getPhotoStatusMeta(status: PhotoStatus): StatusMeta {
  return PHOTO_STATUS_META[status];
}

export function isAttentionPhotoStatus(status: PhotoStatus): boolean {
  return ATTENTION_PHOTO_STATUSES.includes(status);
}
