import { MapPin, Plane } from "lucide-react";
import CardBox from "@/components/dashboard/shared/CardBox";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SALE_TYPE_LABELS } from "@/lib/aviatonly/domain";
import { listingLocation } from "@/lib/aviatonly/mock";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";

interface ListingWorkspaceHeaderProps {
  listing: MockAircraftListing;
}

const ListingWorkspaceHeader = ({ listing }: ListingWorkspaceHeaderProps) => {
  const aircraftLine = `${listing.year} ${listing.make} ${listing.model}`;

  return (
    <CardBox className="mb-6 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plane className="size-7" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-2xl font-semibold tracking-tight">{listing.registration}</h4>
              <Badge variant="outline">{listing.registrationType}</Badge>
              <ListingStatusBadge status={listing.status} />
            </div>
            <p className="text-base font-medium">{aircraftLine}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {listingLocation(listing)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{listing.category}</Badge>
              <Badge variant="outline">{SALE_TYPE_LABELS[listing.saleType]}</Badge>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-72">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Listing completeness</span>
            <span className="font-semibold tabular-nums">{listing.completenessScore}%</span>
          </div>
          <Progress value={listing.completenessScore} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            Structured intake data, guided photos, and document vault coverage.
          </p>
        </div>
      </div>
    </CardBox>
  );
};

export default ListingWorkspaceHeader;
