import { ListingStatus } from "./listing-status";
import { ReviewTaskStatus } from "./review-task-status";

export const INTAKE_ADMIN_REVIEW_ASSIGNMENT = {
  sourceType: "intake",
  sourceKey: "admin-review",
  title: "Intake data review",
  assignedRole: "ADMIN",
} as const;

export function isIntakeAdminAssignmentTask(task: {
  assignedRole?: string | null;
  sourceType?: string | null;
  sourceKey?: string | null;
}): boolean {
  return (
    task.assignedRole === INTAKE_ADMIN_REVIEW_ASSIGNMENT.assignedRole &&
    task.sourceType === INTAKE_ADMIN_REVIEW_ASSIGNMENT.sourceType &&
    task.sourceKey === INTAKE_ADMIN_REVIEW_ASSIGNMENT.sourceKey
  );
}

export function findActiveIntakeReviewerId(
  tasks: Array<{
    assignedRole?: string | null;
    sourceType?: string | null;
    sourceKey?: string | null;
    status: string;
    assignedToId?: string | null;
  }>,
): string | null {
  const task = tasks.find(
    (item) =>
      isIntakeAdminAssignmentTask(item) && item.status === ReviewTaskStatus.IN_PROGRESS,
  );
  return task?.assignedToId ?? null;
}

export function canAdminEditIntakeReview(input: {
  canManageReview: boolean;
  listingStatus: ListingStatus;
  intakeReviewTasksReleasedAt: string | null;
}): boolean {
  return (
    input.canManageReview &&
    input.listingStatus === ListingStatus.UNDER_REVIEW &&
    !input.intakeReviewTasksReleasedAt
  );
}

export function adminNeedsToStartIntakeReview(input: {
  canManageReview: boolean;
  listingStatus: ListingStatus;
}): boolean {
  return input.canManageReview && input.listingStatus === ListingStatus.SUBMITTED;
}
