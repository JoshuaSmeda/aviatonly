/** Generic rejection reasons shown as selectable pills during admin intake review. */
export const INTAKE_REJECTION_PRESETS = [
  { id: "incorrect-data", label: "Incorrect or inconsistent data" },
  { id: "missing-info", label: "Missing required information" },
  { id: "logbook-mismatch", label: "Does not match logbook records" },
  { id: "photo-quality", label: "Photo quality insufficient" },
  { id: "wrong-angle", label: "Wrong angle or photo slot" },
  { id: "doc-illegible", label: "Document illegible or incomplete" },
  { id: "doc-expired", label: "Document expired or out of date" },
  { id: "other", label: "Other (add note below)" },
] as const;

export type IntakeRejectionPresetId = (typeof INTAKE_REJECTION_PRESETS)[number]["id"];

export function resolveRejectionReason(
  presetId: string | null | undefined,
  customReason: string | null | undefined,
): string {
  const preset = INTAKE_REJECTION_PRESETS.find((p) => p.id === presetId);
  const custom = customReason?.trim() ?? "";

  if (preset && preset.id !== "other") {
    return custom ? `${preset.label}: ${custom}` : preset.label;
  }

  return custom;
}
