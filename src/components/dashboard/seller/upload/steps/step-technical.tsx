"use client";

import { Separator } from "@/components/ui/separator";
import { RHFDate, RHFNumber, RHFSelect, RHFText, RHFTextarea } from "../fields";
import { MAINTENANCE_STATUSES } from "../constants";

const SectionHeading = ({ title }: { title: string }) => (
  <div className="col-span-full">
    <h6 className="text-base font-semibold">{title}</h6>
  </div>
);

const StepTechnical = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionHeading title="Airframe" />
        <RHFNumber
          name="ttaf"
          label="Total time on airframe (TTAF)"
          placeholder="3250"
          suffix="hrs"
          step="0.1"
        />
        <RHFSelect
          name="maintenanceStatus"
          label="Maintenance status"
          placeholder="Select status"
          options={MAINTENANCE_STATUSES}
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionHeading title="Engine" />
        <RHFText name="engineMakeModel" label="Engine make / model" placeholder="Lycoming O-320-H2AD" />
        <RHFNumber name="engineHours" label="Engine hours" placeholder="1450" suffix="hrs" step="0.1" />
        <RHFNumber
          name="tso"
          label="Time since overhaul (TSO)"
          placeholder="650"
          suffix="hrs"
          step="0.1"
          description="Leave blank if not overhauled."
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionHeading title="Propeller" />
        <RHFText name="propellerMakeModel" label="Propeller make / model" placeholder="McCauley 1C160" />
        <RHFNumber name="propellerHours" label="Propeller hours" placeholder="650" suffix="hrs" step="0.1" />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <SectionHeading title="Avionics & condition" />
        <RHFTextarea
          name="avionics"
          label="Avionics suite"
          placeholder="Garmin GNS 430W, GTX 345 transponder, KAP 140 autopilot…"
          rows={3}
        />
        <RHFDate name="lastMpiDate" label="Last MPI date" />
        <RHFTextarea
          name="knownDefects"
          label="Known defects or damage history"
          placeholder="Be upfront about any damage history, deferred items, or known snags."
          rows={3}
        />
      </div>
    </div>
  );
};

export default StepTechnical;
