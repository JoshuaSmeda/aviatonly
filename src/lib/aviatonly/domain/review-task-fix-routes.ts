import type { MockListingReviewTask } from "@/lib/aviatonly/mock/types";
import {
  FIELD_KEY_TO_INTAKE_STEP,
  INTAKE_STEP_DOCUMENTS,
  INTAKE_STEP_PHOTOS,
} from "./intake-fix-mode";

export function buildReviewTaskFixHref(
  listingId: string,
  task: Pick<MockListingReviewTask, "sourceType" | "sourceKey" | "title">,
): string {
  const base = `/dashboard/seller/upload?listingId=${listingId}`;

  if (task.sourceType === "field" && task.sourceKey) {
    const step = FIELD_KEY_TO_INTAKE_STEP[task.sourceKey] ?? 1;
    return `${base}&step=${step}&fix=${encodeURIComponent(task.sourceKey)}`;
  }

  if (task.sourceType === "photo" && task.sourceKey) {
    return `${base}&step=${INTAKE_STEP_PHOTOS}&fixPhoto=${encodeURIComponent(task.sourceKey)}`;
  }

  if (task.sourceType === "document" && task.sourceKey) {
    return `${base}&step=${INTAKE_STEP_DOCUMENTS}&fixDocument=${encodeURIComponent(task.sourceKey)}`;
  }

  const lower = task.title.toLowerCase();
  if (lower.includes("photo") || lower.includes("cockpit") || lower.includes("prop")) {
    return `${base}&step=${INTAKE_STEP_PHOTOS}`;
  }
  if (lower.includes("document") || lower.includes("logbook") || lower.includes("stamp")) {
    return `${base}&step=${INTAKE_STEP_DOCUMENTS}`;
  }
  if (lower.includes("mpi") || lower.includes("maintenance")) {
    return `${base}&step=7&fix=last-mpi`;
  }

  return base;
}
