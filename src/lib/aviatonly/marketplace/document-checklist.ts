import { DOCUMENT_SLOTS } from "@/components/dashboard/seller/upload/constants";
import { DocumentStatus } from "@/lib/aviatonly/domain";
import type { AircraftDocumentSummary } from "./aircraft-marketplace-types";

export function buildDocumentChecklistFromRecords(
  records: Array<{ documentType: string; reviewStatus: string }>,
): AircraftDocumentSummary[] {
  const bySlot = new Map(records.map((record) => [record.documentType, record]));

  return DOCUMENT_SLOTS.map((slot) => {
    const document = bySlot.get(slot.id);
    const uploaded = Boolean(document && document.reviewStatus !== DocumentStatus.MISSING);
    const reviewed = document?.reviewStatus === DocumentStatus.ACCEPTED;

    return {
      slotKey: slot.id,
      label: slot.label,
      uploaded,
      reviewed,
    };
  });
}

export function buildDocumentChecklist(
  uploadedSlotKeys: string[],
  reviewedSlotKeys: string[] = uploadedSlotKeys,
): AircraftDocumentSummary[] {
  const uploaded = new Set(uploadedSlotKeys);
  const reviewed = new Set(reviewedSlotKeys);

  return DOCUMENT_SLOTS.map((slot) => ({
    slotKey: slot.id,
    label: slot.label,
    uploaded: uploaded.has(slot.id),
    reviewed: reviewed.has(slot.id),
  }));
}

export function countUploadedDocuments(documents: AircraftDocumentSummary[]): number {
  return documents.filter((document) => document.uploaded).length;
}
