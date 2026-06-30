"use client";

import { Clock, Gauge, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AircraftDetailFacts } from "@/components/buy/aircraft-detail-facts";
import type { AircraftMarketplaceDetail } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatAircraftTitle,
  formatCurrency,
  formatLocation,
  formatPriceDisplay,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AircraftDetailSummaryProps {
  listing: AircraftMarketplaceDetail;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card shadow-none";

function getSaleBadgeLabel(listing: AircraftMarketplaceDetail) {
  switch (listing.saleType) {
    case "AUCTION":
      return "Auction aircraft";
    case "PRICE_ON_APPLICATION":
      return "Price on application";
    case "MAKE_OFFER":
      return "Make offer aircraft";
    default:
      return "Aircraft for sale";
  }
}

function QuickStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Gauge;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-[96px] flex-col items-center gap-2 rounded-lg border border-border px-4 py-3 text-center">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-xl font-bold leading-none text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function AircraftDetailSummary({ listing }: AircraftDetailSummaryProps) {
  const financeEstimate =
    listing.price && listing.saleType === "FIXED_PRICE"
      ? Math.round(listing.price * 0.007)
      : null;

  const stats = [
    {
      icon: Gauge,
      value: listing.totalTimeAirframe?.toLocaleString("en-ZA") ?? "—",
      label: "TTAF",
    },
    {
      icon: Clock,
      value: listing.engineTime?.toLocaleString("en-ZA") ?? "—",
      label: listing.engineTimeLabel ?? "Engine time",
    },
    {
      icon: Users,
      value: listing.seats?.toString() ?? "—",
      label: "Seats",
    },
  ];

  return (
    <div className={cn(detailCardClass)}>
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between lg:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Badge variant="secondary" className="w-fit font-normal">
            {getSaleBadgeLabel(listing)}
          </Badge>

          <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {formatPriceDisplay(listing)}
          </p>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground [&_svg]:size-[1em] [&_svg]:shrink-0">
            <MapPin />
            {formatLocation(listing)}
          </p>

          <p className="text-sm text-muted-foreground">
            {listing.registration} — {formatAircraftTitle(listing)}
          </p>

          {financeEstimate ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                Est. {formatCurrency(financeEstimate, listing.currency)}/mo
              </span>
              <Button size="sm" onClick={() => toast.message("Finance quote request recorded")}>
                Request finance quote
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.map((stat) => (
            <QuickStat key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-6">
        <div className="my-5 border-t border-border lg:my-6" />
      </div>

      <div className="px-5 pb-5 lg:px-6 lg:pb-6">
        <AircraftDetailFacts listing={listing} />
      </div>
    </div>
  );
}
