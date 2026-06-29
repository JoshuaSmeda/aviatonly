import { listingLocation } from "@/lib/aviatonly/mock/listing-display";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

export const AIRCRAFT_DATA_FIELD_KEYS = [
  "registration",
  "registration-type",
  "make",
  "model",
  "year",
  "category",
  "location",
  "ttaf",
  "damage-history",
  "engine",
  "propeller",
  "avionics",
  "maintenance-status",
  "last-mpi",
  "maintenance-notes",
] as const;

export type AircraftDataFieldKey = (typeof AIRCRAFT_DATA_FIELD_KEYS)[number];

export interface AircraftDataReviewRow {
  fieldKey: string;
  label: string;
  value: string;
}

function displayValue(value: string | number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }
  return `${value}${suffix}`;
}

export function buildAircraftDataReviewRows(
  workspace: ListingWorkspaceData,
): AircraftDataReviewRow[] {
  const { listing, airframe, engines, propellers, avionics, maintenance } = workspace;

  const rows: AircraftDataReviewRow[] = [
    { fieldKey: "registration", label: "Registration", value: listing.registration },
    {
      fieldKey: "registration-type",
      label: "Registration type",
      value: listing.registrationType,
    },
    { fieldKey: "make", label: "Make", value: listing.make },
    { fieldKey: "model", label: "Model", value: listing.model },
    { fieldKey: "year", label: "Year", value: String(listing.year) },
    { fieldKey: "category", label: "Category", value: listing.category },
    { fieldKey: "location", label: "Location", value: listingLocation(listing) },
    {
      fieldKey: "ttaf",
      label: "TTAF",
      value:
        airframe?.totalTimeAirframe != null
          ? `${airframe.totalTimeAirframe.toLocaleString()} hrs`
          : "Not provided",
    },
    {
      fieldKey: "damage-history",
      label: "Damage history",
      value: displayValue(airframe?.damageHistory),
    },
    {
      fieldKey: "engine",
      label: "Engine",
      value: engines[0]
        ? `${engines[0].manufacturer} ${engines[0].model} · ${engines[0].engineHours} hrs${
            engines[0].timeSinceOverhaul != null
              ? ` · TSO ${engines[0].timeSinceOverhaul} hrs`
              : ""
          }`
        : "Not provided",
    },
    {
      fieldKey: "propeller",
      label: "Propeller",
      value: propellers[0]
        ? `${propellers[0].manufacturer} ${propellers[0].model}${
            propellers[0].propellerHours != null
              ? ` · ${propellers[0].propellerHours} hrs`
              : ""
          }`
        : "Not provided",
    },
    {
      fieldKey: "avionics",
      label: "Avionics",
      value: avionics?.equipment?.length
        ? avionics.equipment.join(", ")
        : "Not provided",
    },
    {
      fieldKey: "maintenance-status",
      label: "Maintenance status",
      value: displayValue(maintenance?.status),
    },
    {
      fieldKey: "last-mpi",
      label: "Last MPI",
      value: maintenance?.lastMpiDate
        ? new Date(maintenance.lastMpiDate).toLocaleDateString("en-ZA")
        : "Not provided",
    },
    {
      fieldKey: "maintenance-notes",
      label: "Maintenance notes",
      value: displayValue(maintenance?.notes),
    },
  ];

  return rows;
}
