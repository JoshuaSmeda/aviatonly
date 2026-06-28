"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ZAR } from "../constants";
import { PHOTO_SLOTS, DOCUMENT_SLOTS } from "../constants";
import type { AircraftFormValues } from "../schema";

interface StepReviewProps {
  photoCount: number;
  documentCount: number;
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex justify-between gap-4 border-b border-border py-2 last:border-b-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-right text-sm font-medium">{value || "—"}</span>
  </div>
);

const SummaryCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border p-4">
    <h6 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h6>
    <div className="flex flex-col">{children}</div>
  </div>
);

const StepReview = ({ photoCount, documentCount }: StepReviewProps) => {
  const { getValues } = useFormContext<AircraftFormValues>();
  const v = getValues();
  const fixed = v.saleType === "FIXED_PRICE";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SummaryCard title="Aircraft">
          <Row label="Registration" value={v.registration} />
          <Row label="Type" value={v.registrationType} />
          <Row label="Make / Model" value={`${v.make ?? ""} ${v.model ?? ""}`.trim()} />
          <Row label="Year" value={v.year} />
          <Row label="Category" value={v.category} />
          <Row label="Location" value={[v.airfield, v.province].filter(Boolean).join(", ")} />
        </SummaryCard>

        <SummaryCard title="Technical">
          <Row label="TTAF" value={v.ttaf != null ? `${v.ttaf} hrs` : undefined} />
          <Row label="Engine" value={v.engineMakeModel} />
          <Row label="Engine hours" value={v.engineHours != null ? `${v.engineHours} hrs` : undefined} />
          <Row label="TSO" value={v.tso != null ? `${v.tso} hrs` : undefined} />
          <Row label="Propeller" value={v.propellerMakeModel} />
          <Row label="Maintenance" value={v.maintenanceStatus} />
          <Row
            label="Last MPI"
            value={v.lastMpiDate ? format(v.lastMpiDate, "PPP") : undefined}
          />
        </SummaryCard>

        <SummaryCard title="Pricing">
          <Row label="Sale type" value={fixed ? "Fixed price" : "Timed auction"} />
          {fixed ? (
            <Row label="Asking price" value={v.askingPrice != null ? ZAR.format(v.askingPrice) : undefined} />
          ) : (
            <>
              <Row label="Starting bid" value={v.startingBid != null ? ZAR.format(v.startingBid) : undefined} />
              <Row label="Bid increment" value={v.bidIncrement != null ? ZAR.format(v.bidIncrement) : undefined} />
              <Row label="Reserve" value={v.reservePrice != null ? ZAR.format(v.reservePrice) : undefined} />
            </>
          )}
          <Row
            label="Your estimate"
            value={v.valuationEstimate != null ? ZAR.format(v.valuationEstimate) : undefined}
          />
        </SummaryCard>

        <SummaryCard title="Media & documents">
          <Row
            label="Guided photos"
            value={
              <Badge variant="secondary">
                {photoCount} / {PHOTO_SLOTS.length} added
              </Badge>
            }
          />
          <Row
            label="Documents"
            value={
              <Badge variant="secondary">
                {documentCount} / {DOCUMENT_SLOTS.length} added
              </Badge>
            }
          />
        </SummaryCard>
      </div>

      {v.knownDefects && (
        <SummaryCard title="Known defects / damage history">
          <p className="text-sm">{v.knownDefects}</p>
        </SummaryCard>
      )}
    </div>
  );
};

export default StepReview;
