import type { AircraftMarketplaceDetail } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatLocation,
  getCategoryLabel,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";

interface AircraftDetailFactsProps {
  listing: AircraftMarketplaceDetail;
}

export function AircraftDetailFacts({ listing }: AircraftDetailFactsProps) {
  const engine = listing.technicalSpec.engines[0];

  const facts = [
    { label: "Aircraft category", value: getCategoryLabel(listing.category) },
    { label: "Registration type", value: listing.registrationType ?? "—" },
    {
      label: "Avionics suite",
      value: listing.avionicsSummary ?? listing.technicalSpec.avionics.primarySuite ?? "—",
    },
    {
      label: "Maintenance status",
      value:
        listing.maintenanceSummary ??
        listing.technicalSpec.maintenance.maintenanceOrganisation ??
        "—",
    },
    {
      label: "Powerplant",
      value:
        engine?.manufacturer && engine?.model
          ? `${engine.manufacturer} ${engine.model}`
          : "—",
    },
    {
      label: "Based at",
      value: formatLocation(listing),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{fact.label}</span>
          <span className="text-sm font-bold text-foreground">{fact.value}</span>
        </div>
      ))}
    </div>
  );
}
