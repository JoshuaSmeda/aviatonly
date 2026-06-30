import { buildAircraftDataReviewRows } from "./listing-aircraft-data-rows";
import {
  documentReviewState,
  fieldReviewState,
  photoReviewState,
} from "./listing-intake-review-utils";
import { FieldReviewStatus } from "./field-review-status";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { getGuidedPhotoSlotLabel } from "@/lib/upload/photo-slot-keys";

export type IntakeReviewSection = "aircraft-data" | "media" | "documents";

export interface PendingIntakeReviewItem {
  id: string;
  label: string;
  section: IntakeReviewSection;
  tab: IntakeReviewSection;
}

export function listPendingIntakeReviewItems(
  workspace: ListingWorkspaceData,
  overrides?: {
    fieldReviews?: ListingWorkspaceData["fieldReviews"];
    photos?: ListingWorkspaceData["photos"];
    documents?: ListingWorkspaceData["documents"];
  },
): PendingIntakeReviewItem[] {
  const fieldReviews = overrides?.fieldReviews ?? workspace.fieldReviews;
  const photos = overrides?.photos ?? workspace.photos;
  const documents = overrides?.documents ?? workspace.documents;

  const pending: PendingIntakeReviewItem[] = [];
  const fieldMap = new Map(fieldReviews.map((r) => [r.fieldKey, r.status]));

  for (const row of buildAircraftDataReviewRows(workspace)) {
    const state = fieldReviewState(fieldMap.get(row.fieldKey) ?? FieldReviewStatus.PENDING);
    if (state === "pending") {
      pending.push({
        id: row.fieldKey,
        label: row.label,
        section: "aircraft-data",
        tab: "aircraft-data",
      });
    }
  }

  for (const photo of photos) {
    if (photoReviewState(photo.status) === "pending") {
      pending.push({
        id: photo.id,
        label: getGuidedPhotoSlotLabel(photo.slotKey),
        section: "media",
        tab: "media",
      });
    }
  }

  for (const doc of documents) {
    if (documentReviewState(doc.reviewStatus) === "pending") {
      pending.push({
        id: doc.id,
        label: doc.documentType.replace(/-/g, " "),
        section: "documents",
        tab: "documents",
      });
    }
  }

  return pending;
}

const SECTION_LABELS: Record<IntakeReviewSection, string> = {
  "aircraft-data": "Aircraft data",
  media: "Media",
  documents: "Documents",
};

export function formatPendingIntakeReviewItem(item: PendingIntakeReviewItem): string {
  return `${SECTION_LABELS[item.section]} · ${item.label}`;
}
