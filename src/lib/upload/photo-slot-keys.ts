import { PHOTO_SLOTS } from "@/components/dashboard/seller/upload/constants";

export const GUIDED_PHOTO_SLOT_KEYS = PHOTO_SLOTS.map((slot) => slot.id);

const SLOT_KEY_SET = new Set(GUIDED_PHOTO_SLOT_KEYS);

export function isGuidedPhotoSlotKey(slotKey: string): boolean {
  return SLOT_KEY_SET.has(slotKey);
}

export function getGuidedPhotoSlotLabel(slotKey: string): string {
  return PHOTO_SLOTS.find((slot) => slot.id === slotKey)?.label ?? slotKey.replace(/-/g, " ");
}
