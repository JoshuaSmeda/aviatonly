import type { AircraftMarketplaceDetail } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatHours,
  formatListingDate,
  formatPowerplant,
  getCategoryLabel,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { cn } from "@/lib/utils";

interface AircraftTechnicalDetailsProps {
  listing: Pick<
    AircraftMarketplaceDetail,
    "technicalSpec" | "seats" | "engineCount" | "maintenanceSummary" | "category"
  >;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card shadow-none";

type DetailItem = {
  label: string;
  value?: string | number | boolean | null;
};

function engineLabelPrefix(position: string, multipleEngines: boolean) {
  if (!multipleEngines) return "Engine";
  return `${position} engine`;
}

function buildTechnicalDetailItems({
  technicalSpec,
  seats,
  engineCount,
  maintenanceSummary,
  category,
}: AircraftTechnicalDetailsProps["listing"]): DetailItem[] {
  const items: DetailItem[] = [];
  const multipleEngines = technicalSpec.engines.length > 1;

  items.push(
    { label: "Aircraft category", value: getCategoryLabel(category) },
    { label: "Seats", value: seats },
    { label: "Engine count", value: engineCount },
    {
      label: "Total time airframe",
      value: formatHours(technicalSpec.airframe.totalTimeAirframe),
    },
    { label: "Year of manufacture", value: technicalSpec.airframe.yearOfManufacture },
    { label: "Airframe serial number", value: technicalSpec.airframe.serialNumber },
    { label: "Registration type", value: technicalSpec.airframe.registrationType },
    { label: "Damage history", value: technicalSpec.airframe.damageHistory },
    { label: "Accident history", value: technicalSpec.airframe.accidentHistory },
    { label: "Corrosion notes", value: technicalSpec.airframe.corrosionNotes },
    { label: "Paint condition", value: technicalSpec.airframe.paintCondition },
    { label: "Interior condition", value: technicalSpec.airframe.interiorCondition },
  );

  for (const engine of technicalSpec.engines) {
    const prefix = engineLabelPrefix(engine.position, multipleEngines);

    items.push(
      { label: `${prefix} make / model`, value: formatPowerplant(engine) },
      { label: `${prefix} serial number`, value: engine.serialNumber },
      { label: `${prefix} hours`, value: formatHours(engine.engineHours) },
      {
        label: `${prefix} time since overhaul`,
        value: formatHours(engine.timeSinceOverhaul),
      },
      { label: `${prefix} time since new`, value: formatHours(engine.timeSinceNew) },
      {
        label: `${prefix} overhaul date`,
        value: formatListingDate(engine.overhaulDate),
      },
      { label: `${prefix} known issues`, value: engine.knownIssues },
    );
  }

  if (technicalSpec.propeller) {
    items.push(
      {
        label: "Propeller make / model",
        value: formatPowerplant(technicalSpec.propeller),
      },
      { label: "Propeller serial number", value: technicalSpec.propeller.serialNumber },
      { label: "Propeller blade count", value: technicalSpec.propeller.bladeCount },
      { label: "Propeller type", value: technicalSpec.propeller.propellerType },
      {
        label: "Propeller hours",
        value: formatHours(technicalSpec.propeller.propellerHours),
      },
      {
        label: "Propeller time since overhaul",
        value: formatHours(technicalSpec.propeller.timeSinceOverhaul),
      },
      { label: "Propeller damage notes", value: technicalSpec.propeller.knownDamageNotes },
    );
  }

  items.push(
    { label: "Primary avionics suite", value: technicalSpec.avionics.primarySuite },
    { label: "COM radios", value: technicalSpec.avionics.comRadios },
    { label: "NAV radios", value: technicalSpec.avionics.navRadios },
    { label: "Transponder", value: technicalSpec.avionics.transponder },
    { label: "ADS-B", value: technicalSpec.avionics.adsB },
    { label: "GPS", value: technicalSpec.avionics.gps },
    { label: "Autopilot", value: technicalSpec.avionics.autopilot },
    { label: "EFIS / glass cockpit", value: technicalSpec.avionics.efis },
    { label: "Engine monitor", value: technicalSpec.avionics.engineMonitor },
    { label: "ELT", value: technicalSpec.avionics.elt },
    { label: "Intercom", value: technicalSpec.avionics.intercom },
    { label: "Other avionics", value: technicalSpec.avionics.otherEquipment },
    { label: "Maintenance status", value: maintenanceSummary },
    {
      label: "Last MPI date",
      value: formatListingDate(technicalSpec.maintenance.lastMpiDate),
    },
    {
      label: "Next MPI due date",
      value: formatListingDate(technicalSpec.maintenance.nextMpiDueDate),
    },
    {
      label: "MPI hours remaining",
      value: formatHours(technicalSpec.maintenance.mpiHoursRemaining),
    },
    {
      label: "Maintenance organisation",
      value: technicalSpec.maintenance.maintenanceOrganisation,
    },
    { label: "Logbooks complete", value: technicalSpec.maintenance.logbooksComplete },
    {
      label: "Airframe logs available",
      value: technicalSpec.maintenance.airframeLogsAvailable,
    },
    {
      label: "Engine logs available",
      value: technicalSpec.maintenance.engineLogsAvailable,
    },
    {
      label: "Propeller logs available",
      value: technicalSpec.maintenance.propellerLogsAvailable,
    },
    {
      label: "AD/SB compliance known",
      value: technicalSpec.maintenance.adSbComplianceKnown,
    },
    { label: "Currently airworthy", value: technicalSpec.maintenance.currentlyAirworthy },
    {
      label: "CoA / ATF expiry",
      value: formatListingDate(technicalSpec.maintenance.coaExpiry),
    },
    { label: "Known defects", value: technicalSpec.maintenance.knownDefects },
  );

  return items;
}

function DetailGrid({ items }: { items: DetailItem[] }) {
  const visible = items.filter((item) => item.value != null && item.value !== "");
  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">No data provided.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{item.label}</span>
          <span className="text-sm font-bold text-foreground">
            {typeof item.value === "boolean" ? (item.value ? "Yes" : "No") : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AircraftTechnicalDetails({ listing }: AircraftTechnicalDetailsProps) {
  const items = buildTechnicalDetailItems(listing);

  return (
    <section className={cn(detailCardClass, "p-5 lg:p-6")}>
      <h2 className="mb-6 text-xl font-bold text-foreground">Technical details</h2>
      <DetailGrid items={items} />
    </section>
  );
}
