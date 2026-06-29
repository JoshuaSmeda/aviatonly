import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import {
  PHOTO_SLOTS,
  DOCUMENT_SLOTS,
} from "@/components/dashboard/seller/upload/constants";

/**
 * Weighted listing completeness.
 *
 * Section weights (per the AVIATONLY data-model rules):
 * - Basic details:     20%
 * - Technical details: 25%
 * - Photos:            25%
 * - Documents:         20%
 * - Sale setup:        10%
 *
 * The score is advisory until a listing is fully persisted; it is recomputed
 * server-side whenever the listing changes.
 */
export interface CompletenessSection {
  key: "basic" | "technical" | "photos" | "documents" | "sale";
  label: string;
  weight: number;
  /** Points earned within this section, 0..weight. */
  earned: number;
  /** Human-readable missing required items in this section. */
  missing: string[];
}

export interface CompletenessResult {
  /** 0..100, rounded. */
  score: number;
  sections: CompletenessSection[];
  /** Flattened list of missing required items across all sections. */
  missing: string[];
}

export interface CompletenessInput {
  values: Partial<AircraftFormValues>;
  photoCount?: number;
  documentCount?: number;
}

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Proportional section score from a list of labelled required fields. */
function scoreFields(
  values: Partial<AircraftFormValues>,
  weight: number,
  fields: { key: keyof AircraftFormValues; label: string }[],
): { earned: number; missing: string[] } {
  const missing = fields.filter((f) => !isFilled(values[f.key])).map((f) => f.label);
  const filled = fields.length - missing.length;
  const earned = fields.length === 0 ? weight : (filled / fields.length) * weight;
  return { earned, missing };
}

/** Proportional section score from an uploaded count against a required total. */
function scoreCount(
  count: number,
  total: number,
  weight: number,
  missingLabel: (remaining: number) => string,
): { earned: number; missing: string[] } {
  const capped = Math.min(Math.max(count, 0), total);
  const earned = total === 0 ? weight : (capped / total) * weight;
  const remaining = total - capped;
  return { earned, missing: remaining > 0 ? [missingLabel(remaining)] : [] };
}

export function computeCompleteness({
  values,
  photoCount = 0,
  documentCount = 0,
}: CompletenessInput): CompletenessResult {
  const basic = scoreFields(values, 20, [
    { key: "registration", label: "Registration" },
    { key: "registrationType", label: "Registration type" },
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "year", label: "Year" },
    { key: "category", label: "Aircraft category" },
    { key: "airfield", label: "Base airfield" },
    { key: "province", label: "Province" },
  ]);

  const technical = scoreFields(values, 25, [
    { key: "ttaf", label: "Total time on airframe (TTAF)" },
    { key: "engineMakeModel", label: "Engine make/model" },
    { key: "engineHours", label: "Engine hours" },
    { key: "propellerHours", label: "Propeller hours" },
  ]);

  const photos = scoreCount(
    photoCount,
    PHOTO_SLOTS.length,
    25,
    (remaining) => `${remaining} guided photo${remaining === 1 ? "" : "s"}`,
  );

  const documents = scoreCount(
    documentCount,
    DOCUMENT_SLOTS.length,
    20,
    (remaining) => `${remaining} required document${remaining === 1 ? "" : "s"}`,
  );

  const priceKey = values.saleType === "AUCTION" ? "startingBid" : "askingPrice";
  const priceLabel = values.saleType === "AUCTION" ? "Starting bid" : "Asking price";
  const sale = scoreFields(values, 10, [
    { key: "saleType", label: "Sale type" },
    { key: priceKey, label: priceLabel },
  ]);

  const sections: CompletenessSection[] = [
    { key: "basic", label: "Basic details", weight: 20, ...basic },
    { key: "technical", label: "Technical details", weight: 25, ...technical },
    { key: "photos", label: "Photos", weight: 25, ...photos },
    { key: "documents", label: "Documents", weight: 20, ...documents },
    { key: "sale", label: "Sale setup", weight: 10, ...sale },
  ];

  const score = Math.round(sections.reduce((sum, s) => sum + s.earned, 0));
  const missing = sections.flatMap((s) => s.missing);

  return { score, sections, missing };
}
