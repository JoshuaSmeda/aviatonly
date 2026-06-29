import type { StatusMeta } from "./types";

/** Must stay in sync with `ReviewTaskStatus` in `prisma/schema.prisma`. */
export enum ReviewTaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_ON_SELLER = "WAITING_ON_SELLER",
  WAITING_ON_ADMIN = "WAITING_ON_ADMIN",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export const REVIEW_TASK_STATUS_META: Record<ReviewTaskStatus, StatusMeta> = {
  [ReviewTaskStatus.OPEN]: {
    label: "Open",
    description: "Task created and not yet started.",
    badgeVariant: "outline",
  },
  [ReviewTaskStatus.IN_PROGRESS]: {
    label: "In progress",
    description: "Task is actively being worked on.",
    badgeVariant: "outline",
  },
  [ReviewTaskStatus.WAITING_ON_SELLER]: {
    label: "Waiting on seller",
    description: "AVIATONLY is waiting for the seller to complete this task.",
    badgeVariant: "secondary",
  },
  [ReviewTaskStatus.WAITING_ON_ADMIN]: {
    label: "Waiting on AVIATONLY",
    description: "Seller has completed their part; AVIATONLY action required.",
    badgeVariant: "outline",
  },
  [ReviewTaskStatus.DONE]: {
    label: "Done",
    description: "Task completed.",
    badgeVariant: "default",
  },
  [ReviewTaskStatus.CANCELLED]: {
    label: "Cancelled",
    description: "Task cancelled and no longer required.",
    badgeVariant: "secondary",
  },
};

export const OPEN_REVIEW_TASK_STATUSES: readonly ReviewTaskStatus[] = [
  ReviewTaskStatus.OPEN,
  ReviewTaskStatus.IN_PROGRESS,
  ReviewTaskStatus.WAITING_ON_SELLER,
  ReviewTaskStatus.WAITING_ON_ADMIN,
];

export function getReviewTaskStatusMeta(status: ReviewTaskStatus): StatusMeta {
  return REVIEW_TASK_STATUS_META[status];
}

export function isOpenReviewTaskStatus(status: ReviewTaskStatus): boolean {
  return OPEN_REVIEW_TASK_STATUSES.includes(status);
}
