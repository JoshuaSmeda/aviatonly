import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AircraftTechnicalSpec } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { cn } from "@/lib/utils";

interface AircraftTechnicalDetailsProps {
  technicalSpec: AircraftTechnicalSpec;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card shadow-none";

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value?: string | number | boolean | null }>;
}) {
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

export function AircraftTechnicalDetails({ technicalSpec }: AircraftTechnicalDetailsProps) {
  return (
    <section className={cn(detailCardClass, "p-5 lg:p-6")}>
      <h2 className="mb-6 text-xl font-bold text-foreground">Technical details</h2>
      <Tabs defaultValue="airframe">
        <TabsList className="mb-6 flex h-auto flex-wrap">
          <TabsTrigger value="airframe">Airframe</TabsTrigger>
          <TabsTrigger value="engine">Engine</TabsTrigger>
          <TabsTrigger value="propeller">Propeller</TabsTrigger>
          <TabsTrigger value="avionics">Avionics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="airframe">
          <DetailGrid
            items={[
              { label: "Total time airframe", value: technicalSpec.airframe.totalTimeAirframe },
              { label: "Year of manufacture", value: technicalSpec.airframe.yearOfManufacture },
              { label: "Serial number", value: technicalSpec.airframe.serialNumber },
              { label: "Category", value: technicalSpec.airframe.category },
              { label: "Registration type", value: technicalSpec.airframe.registrationType },
              { label: "Damage history", value: technicalSpec.airframe.damageHistory },
              { label: "Accident history", value: technicalSpec.airframe.accidentHistory },
              { label: "Paint condition", value: technicalSpec.airframe.paintCondition },
              { label: "Interior condition", value: technicalSpec.airframe.interiorCondition },
            ]}
          />
        </TabsContent>

        <TabsContent value="engine" className="flex flex-col gap-6">
          {technicalSpec.engines.map((engine, index) => (
            <div key={`${engine.position}-${index}`} className="flex flex-col gap-4">
              {index > 0 ? <Separator /> : null}
              <p className="text-sm font-medium">{engine.position} engine</p>
              <DetailGrid
                items={[
                  { label: "Manufacturer", value: engine.manufacturer },
                  { label: "Model", value: engine.model },
                  { label: "Serial number", value: engine.serialNumber },
                  { label: "Engine hours", value: engine.engineHours },
                  { label: "Time since overhaul", value: engine.timeSinceOverhaul },
                  { label: "Time since new", value: engine.timeSinceNew },
                  { label: "Overhaul date", value: engine.overhaulDate },
                  { label: "Known issues", value: engine.knownIssues },
                ]}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="propeller">
          <DetailGrid
            items={[
              { label: "Manufacturer", value: technicalSpec.propeller?.manufacturer },
              { label: "Model", value: technicalSpec.propeller?.model },
              { label: "Serial number", value: technicalSpec.propeller?.serialNumber },
              { label: "Blade count", value: technicalSpec.propeller?.bladeCount },
              { label: "Propeller type", value: technicalSpec.propeller?.propellerType },
              { label: "Propeller hours", value: technicalSpec.propeller?.propellerHours },
              { label: "Time since overhaul", value: technicalSpec.propeller?.timeSinceOverhaul },
              { label: "Known damage notes", value: technicalSpec.propeller?.knownDamageNotes },
            ]}
          />
        </TabsContent>

        <TabsContent value="avionics">
          <DetailGrid
            items={[
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
              { label: "Other equipment", value: technicalSpec.avionics.otherEquipment },
            ]}
          />
        </TabsContent>

        <TabsContent value="maintenance">
          <DetailGrid
            items={[
              { label: "Last MPI date", value: technicalSpec.maintenance.lastMpiDate },
              { label: "Next MPI due date", value: technicalSpec.maintenance.nextMpiDueDate },
              { label: "MPI hours remaining", value: technicalSpec.maintenance.mpiHoursRemaining },
              {
                label: "Maintenance organisation",
                value: technicalSpec.maintenance.maintenanceOrganisation,
              },
              { label: "Logbooks complete", value: technicalSpec.maintenance.logbooksComplete },
              {
                label: "Airframe logs available",
                value: technicalSpec.maintenance.airframeLogsAvailable,
              },
              { label: "Engine logs available", value: technicalSpec.maintenance.engineLogsAvailable },
              {
                label: "Propeller logs available",
                value: technicalSpec.maintenance.propellerLogsAvailable,
              },
              { label: "AD/SB compliance known", value: technicalSpec.maintenance.adSbComplianceKnown },
              { label: "Currently airworthy", value: technicalSpec.maintenance.currentlyAirworthy },
              { label: "CoA / ATF expiry", value: technicalSpec.maintenance.coaExpiry },
              { label: "Known defects", value: technicalSpec.maintenance.knownDefects },
            ]}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
