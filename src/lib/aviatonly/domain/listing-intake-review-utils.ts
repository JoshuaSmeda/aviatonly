import { DocumentStatus, FieldReviewStatus, PhotoStatus } from "@/lib/aviatonly/domain";

export type RowReviewState = "pending" | "approved" | "rejected";

export function photoReviewState(status: PhotoStatus): RowReviewState {
  if (status === PhotoStatus.APPROVED) return "approved";
  if (status === PhotoStatus.REJECTED || status === PhotoStatus.NEEDS_REPLACEMENT) {
    return "rejected";
  }
  return "pending";
}

export function documentReviewState(status: DocumentStatus): RowReviewState {
  if (status === DocumentStatus.ACCEPTED) return "approved";
  if (
    status === DocumentStatus.REJECTED ||
    status === DocumentStatus.NEEDS_REPLACEMENT ||
    status === DocumentStatus.EXPIRED
  ) {
    return "rejected";
  }
  return "pending";
}

export function fieldReviewState(status: string): RowReviewState {
  if (status === FieldReviewStatus.APPROVED) return "approved";
  if (status === FieldReviewStatus.REJECTED) return "rejected";
  return "pending";
}

export function computeIntakeReviewProgressFromWorkspace(input: {
  fieldRowCount: number;
  fieldReviews: { fieldKey: string; status: string }[];
  fieldKeys: string[];
  photos: { status: PhotoStatus }[];
  documents: { reviewStatus: DocumentStatus }[];
}) {
  const fieldReviewMap = new Map(input.fieldReviews.map((f) => [f.fieldKey, f.status]));
  let reviewed = 0;

  for (const key of input.fieldKeys) {
    if (fieldReviewState(fieldReviewMap.get(key) ?? FieldReviewStatus.PENDING) !== "pending") {
      reviewed += 1;
    }
  }

  for (const photo of input.photos) {
    if (photoReviewState(photo.status) !== "pending") reviewed += 1;
  }

  for (const doc of input.documents) {
    if (documentReviewState(doc.reviewStatus) !== "pending") reviewed += 1;
  }

  const total = input.fieldKeys.length + input.photos.length + input.documents.length;

  return {
    total,
    reviewed,
    pending: total - reviewed,
    isComplete: total > 0 && reviewed === total,
  };
}
