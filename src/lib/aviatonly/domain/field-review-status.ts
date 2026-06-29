import type { StatusMeta } from "./types";

/** Must stay in sync with `FieldReviewStatus` in `prisma/schema.prisma`. */
export enum FieldReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const FIELD_REVIEW_STATUS_META: Record<FieldReviewStatus, StatusMeta> = {
  [FieldReviewStatus.PENDING]: {
    label: "Not reviewed",
    description: "AVIATONLY has not reviewed this field yet.",
    badgeVariant: "outline",
  },
  [FieldReviewStatus.APPROVED]: {
    label: "Approved",
    description: "Field approved during intake review.",
    badgeVariant: "default",
  },
  [FieldReviewStatus.REJECTED]: {
    label: "Needs fixing",
    description: "Update this field to address AVIATONLY review feedback.",
    badgeVariant: "destructive",
  },
};

export function getFieldReviewStatusMeta(status: FieldReviewStatus | string): StatusMeta {
  return (
    FIELD_REVIEW_STATUS_META[status as FieldReviewStatus] ?? {
      label: status,
      description: "",
      badgeVariant: "outline",
    }
  );
}
