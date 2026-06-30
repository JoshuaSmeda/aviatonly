import { DOCUMENT_SLOTS } from "@/components/dashboard/seller/upload/constants";

export const GUIDED_DOCUMENT_SLOT_KEYS = DOCUMENT_SLOTS.map((slot) => slot.id);

const SLOT_KEY_SET = new Set(GUIDED_DOCUMENT_SLOT_KEYS);

export function isGuidedDocumentSlotKey(slotKey: string): boolean {
  return SLOT_KEY_SET.has(slotKey);
}

export function getGuidedDocumentSlotLabel(slotKey: string): string {
  return DOCUMENT_SLOTS.find((slot) => slot.id === slotKey)?.label ?? slotKey.replace(/-/g, " ");
}

export function getGuidedDocumentSlotInstruction(slotKey: string): string {
  return DOCUMENT_SLOTS.find((slot) => slot.id === slotKey)?.instruction ?? "";
}
