import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";

/** Intake wizard step index (matches `INTAKE_STEPS`). */
export const FIELD_KEY_TO_INTAKE_STEP: Record<string, number> = {
  registration: 1,
  "registration-type": 1,
  make: 1,
  model: 1,
  year: 1,
  category: 1,
  location: 3,
  ttaf: 3,
  "damage-history": 3,
  engine: 4,
  propeller: 5,
  avionics: 6,
  "maintenance-status": 7,
  "last-mpi": 7,
  "maintenance-notes": 3,
};

/** Form fields that may be edited for each aircraft-data review field key. */
export const FIELD_KEY_TO_FORM_FIELDS: Record<string, (keyof AircraftFormValues)[]> = {
  registration: ["registration"],
  "registration-type": ["registrationType"],
  make: ["make"],
  model: ["model"],
  year: ["year"],
  category: ["category"],
  location: ["airfield", "province"],
  ttaf: ["ttaf"],
  "damage-history": ["knownDefects"],
  engine: ["engineMakeModel", "engineHours", "tso"],
  propeller: ["propellerMakeModel", "propellerHours"],
  avionics: ["avionicsEquipment", "avionics"],
  "maintenance-status": ["maintenanceStatus"],
  "last-mpi": ["lastMpiDate"],
  "maintenance-notes": ["knownDefects"],
};

export const INTAKE_STEP_PHOTOS = 8;
export const INTAKE_STEP_DOCUMENTS = 9;

export interface IntakeFixContext {
  type: "field" | "photo" | "document";
  step: number;
  fieldKey?: string;
  photoId?: string;
  photoSlot?: string;
  documentId?: string;
  documentSlot?: string;
  editableFields: (keyof AircraftFormValues)[];
  editablePhotoSlots: string[];
  editableDocumentSlots: string[];
}

export function buildIntakeFixContext(input: {
  fix?: string;
  fixPhoto?: string;
  fixPhotoSlot?: string;
  fixDocument?: string;
  fixDocumentSlot?: string;
}): IntakeFixContext | null {
  if (input.fix) {
    const step = FIELD_KEY_TO_INTAKE_STEP[input.fix] ?? 1;
    return {
      type: "field",
      step,
      fieldKey: input.fix,
      editableFields: FIELD_KEY_TO_FORM_FIELDS[input.fix] ?? [],
      editablePhotoSlots: [],
      editableDocumentSlots: [],
    };
  }

  if (input.fixPhoto) {
    return {
      type: "photo",
      step: INTAKE_STEP_PHOTOS,
      photoId: input.fixPhoto,
      photoSlot: input.fixPhotoSlot,
      editableFields: [],
      editablePhotoSlots: input.fixPhotoSlot ? [input.fixPhotoSlot] : [],
      editableDocumentSlots: [],
    };
  }

  if (input.fixDocument) {
    return {
      type: "document",
      step: INTAKE_STEP_DOCUMENTS,
      documentId: input.fixDocument,
      documentSlot: input.fixDocumentSlot,
      editableFields: [],
      editablePhotoSlots: [],
      editableDocumentSlots: input.fixDocumentSlot ? [input.fixDocumentSlot] : [],
    };
  }

  return null;
}

export function formatFieldFixValue(
  values: AircraftFormValues,
  fieldKey: string,
): string {
  switch (fieldKey) {
    case "last-mpi":
      return values.lastMpiDate ? values.lastMpiDate.toISOString().slice(0, 10) : "";
    case "maintenance-status":
      return values.maintenanceStatus ?? "";
    case "maintenance-notes":
    case "damage-history":
      return values.knownDefects ?? "";
    case "ttaf":
      return values.ttaf != null ? String(values.ttaf) : "";
    case "location":
      return `${values.airfield ?? ""}|${values.province ?? ""}`;
    case "registration":
      return values.registration;
    case "registration-type":
      return values.registrationType;
    case "make":
      return values.make;
    case "model":
      return values.model;
    case "year":
      return String(values.year);
    case "category":
      return values.category;
    case "avionics":
      return values.avionicsEquipment?.join(", ") ?? values.avionics ?? "";
    case "engine":
      return `${values.engineMakeModel ?? ""}|${values.engineHours ?? ""}|${values.tso ?? ""}`;
    case "propeller":
      return `${values.propellerMakeModel ?? ""}|${values.propellerHours ?? ""}`;
    default:
      return "";
  }
}
