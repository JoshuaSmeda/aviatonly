import Link from "next/link";
import { ArrowRight, HandCoins, MapPin, Plane, Users } from "lucide-react";
import CardBox from "@/components/dashboard/shared/CardBox";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { SellerAircraftSummary } from "@/lib/aviatonly/mock/types";

interface AircraftListingCardProps {
  aircraft: SellerAircraftSummary;
}

const AircraftListingCard = ({ aircraft }: AircraftListingCardProps) => {
  return (
    <CardBox className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Plane className="size-6" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-sm font-semibold">{aircraft.registration}</span>
            <span className="truncate text-sm text-muted-foreground">{aircraft.title}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {aircraft.location}
            </span>
          </div>
          <ListingStatusBadge status={aircraft.status} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completeness</span>
            <span className="font-medium tabular-nums">{aircraft.completeness}%</span>
          </div>
          <Progress value={aircraft.completeness} />
          {aircraft.missingItems.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Missing: {aircraft.missingItems.join(", ")}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-muted/40 p-3 text-sm">
          <span className="text-muted-foreground">Next action: </span>
          <span className="font-medium">{aircraft.nextAction}</span>
        </div>

        <Separator />

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {aircraft.leads} leads
            </span>
            <span className="flex items-center gap-1">
              <HandCoins className="size-4" />
              {aircraft.offers} offers
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/dashboard/listings/${aircraft.id}`} />}
          >
            Open workspace
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </CardBox>
  );
};

export default AircraftListingCard;
