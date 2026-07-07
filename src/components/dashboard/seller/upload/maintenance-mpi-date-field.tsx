"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { maintenanceStatusRequiresMpiDate } from "@/lib/aviatonly/domain/maintenance-status";
import { RHFDate } from "./fields";
import type { AircraftFormValues } from "./schema";

export function MaintenanceMpiDateField() {
  const { watch, setValue } = useFormContext<AircraftFormValues>();
  const maintenanceStatus = watch("maintenanceStatus");
  const mpiDateEnabled = maintenanceStatusRequiresMpiDate(maintenanceStatus);

  useEffect(() => {
    if (!mpiDateEnabled) {
      setValue("lastMpiDate", undefined, { shouldDirty: true });
    }
  }, [mpiDateEnabled, setValue]);

  return (
    <RHFDate
      name="lastMpiDate"
      label="Last MPI date"
      disabled={!mpiDateEnabled}
      description={
        mpiDateEnabled
          ? "Date of the most recent Mandatory Periodic Inspection."
          : "Not applicable for stored or non-flying aircraft."
      }
    />
  );
}
