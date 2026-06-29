"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import type { IntakeFixContext } from "@/lib/aviatonly/domain/intake-fix-mode";

interface IntakeFixModeContextValue {
  active: boolean;
  fix: IntakeFixContext | null;
  isFieldEditable: (name: keyof AircraftFormValues) => boolean;
  isPhotoSlotEditable: (slotId: string) => boolean;
  isDocumentSlotEditable: (slotId: string) => boolean;
  isStepNavigable: (stepIndex: number) => boolean;
}

const IntakeFixModeContext = createContext<IntakeFixModeContextValue>({
  active: false,
  fix: null,
  isFieldEditable: () => true,
  isPhotoSlotEditable: () => true,
  isDocumentSlotEditable: () => true,
  isStepNavigable: () => true,
});

export function IntakeFixModeProvider({
  fix,
  children,
}: {
  fix: IntakeFixContext | null;
  children: ReactNode;
}) {
  const value = useMemo<IntakeFixModeContextValue>(() => {
    if (!fix) {
      return {
        active: false,
        fix: null,
        isFieldEditable: () => true,
        isPhotoSlotEditable: () => true,
        isDocumentSlotEditable: () => true,
        isStepNavigable: () => true,
      };
    }

    const editableFields = new Set(fix.editableFields);
    const editablePhotoSlots = new Set(fix.editablePhotoSlots);
    const editableDocumentSlots = new Set(fix.editableDocumentSlots);

    return {
      active: true,
      fix,
      isFieldEditable: (name) => editableFields.has(name),
      isPhotoSlotEditable: (slotId) =>
        editablePhotoSlots.size === 0 ? false : editablePhotoSlots.has(slotId),
      isDocumentSlotEditable: (slotId) =>
        editableDocumentSlots.size === 0 ? false : editableDocumentSlots.has(slotId),
      isStepNavigable: (stepIndex) => stepIndex === fix.step,
    };
  }, [fix]);

  return <IntakeFixModeContext.Provider value={value}>{children}</IntakeFixModeContext.Provider>;
}

export function useIntakeFixMode() {
  return useContext(IntakeFixModeContext);
}

export function useIntakeFieldDisabled(name: keyof AircraftFormValues): boolean {
  const { active, isFieldEditable } = useIntakeFixMode();
  return active ? !isFieldEditable(name) : false;
}
