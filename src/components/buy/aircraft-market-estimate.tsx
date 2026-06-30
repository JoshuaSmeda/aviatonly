import type { AircraftMarketEstimate } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { formatCurrency } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";

interface AircraftMarketEstimateProps {
  estimate: AircraftMarketEstimate;
  listPrice?: number;
}

function formatCompactCore(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted =
      millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2).replace(/\.?0+$/, "");
    return `${formatted}m`;
  }

  return `${Math.round(amount / 1000)}k`;
}

function formatCompactRange(
  min: number,
  max: number,
  currency: "ZAR" | "USD" | "EUR" = "ZAR",
): string {
  const symbol = currency === "ZAR" ? "R" : currency === "USD" ? "$" : "€";
  return `${symbol}${formatCompactCore(min)}-${formatCompactCore(max)}`;
}

function EstimateCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[160px] flex-1 rounded-xl border border-border bg-card px-5 py-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground">{value}</p>
    </div>
  );
}

export function AircraftMarketEstimateCard({ estimate, listPrice }: AircraftMarketEstimateProps) {
  const currency = estimate.currency ?? "ZAR";
  const midpoint =
    estimate.minValue != null && estimate.maxValue != null
      ? Math.round((estimate.minValue + estimate.maxValue) / 2)
      : null;
  const financeEstimate = listPrice != null ? Math.round(listPrice * 0.007) : null;

  if (!estimate.available || estimate.minValue == null || estimate.maxValue == null) {
    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center">
        <h2 className="ml-4 max-w-fit text-3xl font-bold leading-tight tracking-tight text-foreground">
          Estimated market value
        </h2>
        <p className="text-sm text-muted-foreground">
          Market estimate not available yet. AVIATONLY can provide a valuation once the aircraft
          has been reviewed.
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center">
      <h2 className="ml-4 max-w-fit text-3xl font-bold leading-tight tracking-tight text-foreground">
        Estimated market value
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <EstimateCard
          label="AVIATONLY estimate"
          value={midpoint != null ? formatCurrency(midpoint, currency) : "—"}
        />
        <EstimateCard
          label="Sales range"
          value={formatCompactRange(estimate.minValue, estimate.maxValue, currency)}
        />
        <EstimateCard
          label="Finance est."
          value={
            financeEstimate != null ? `${formatCurrency(financeEstimate, currency)}/mo` : "—"
          }
        />
      </div>
    </section>
  );
}
