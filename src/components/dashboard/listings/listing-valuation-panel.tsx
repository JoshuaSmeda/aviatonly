import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
  isValuationPhaseReached,
  ListingStatus,
  SALE_TYPE_LABELS,
  SaleType,
} from "@/lib/aviatonly/domain";
import { formatZar } from "@/lib/aviatonly/mock";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";

interface ListingValuationPanelProps {
  listing: MockAircraftListing;
  canManageReview?: boolean;
}

function sellerListingPrice(listing: MockAircraftListing): string | null {
  if (listing.saleType === SaleType.AUCTION) {
    const parts: string[] = [];
    if (listing.startingBid != null) {
      parts.push(`Starting bid ${formatZar(listing.startingBid)}`);
    }
    if (listing.reservePrice != null) {
      parts.push(`Reserve ${formatZar(listing.reservePrice)}`);
    }
    return parts.length > 0 ? parts.join(" · ") : null;
  }
  return listing.askingPrice != null ? formatZar(listing.askingPrice) : null;
}

function ValuationWaitingState() {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon">
          <Gauge />
        </EmptyMedia>
        <EmptyTitle>Indicative estimate in progress</EmptyTitle>
        <EmptyDescription>
          AVIATONLY benchmarks your reviewed aircraft against the South African market.
          The estimate helps you set a realistic asking price or auction reserve before
          going live.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ValuationReadyState({ listing }: { listing: MockAircraftListing }) {
  const saleLabel = SALE_TYPE_LABELS[listing.saleType as SaleType] ?? listing.saleType;
  const sellerPrice = sellerListingPrice(listing);
  const intakePricingHref = `/dashboard/seller/upload?listingId=${listing.id}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AVIATONLY indicative estimate</CardTitle>
            <CardDescription>
              Market benchmark from your reviewed aircraft data — indicative only, not a
              formal appraisal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {formatZar(listing.valuationEstimate!)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Your listing price</CardTitle>
              <Badge variant="secondary">{saleLabel}</Badge>
            </div>
            <CardDescription>As set during intake.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {sellerPrice ? (
              <p className="text-lg font-medium tabular-nums">{sellerPrice}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No asking price or auction reserve on file yet.
              </p>
            )}
            {listing.status === ListingStatus.VALUATION_READY ? (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                render={<Link href={intakePricingHref} />}
              >
                Review or update pricing
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTitle>Next step</AlertTitle>
        <AlertDescription>
          Compare the indicative estimate with your listing price. When you are aligned,
          AVIATONLY moves toward inspection and publication approval.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ValuationAdminState({ listing }: { listing: MockAircraftListing }) {
  const sellerPrice = sellerListingPrice(listing);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform indicative estimate</CardTitle>
        <CardDescription>
          Internal valuation used to guide seller pricing and publication approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {listing.valuationEstimate != null ? (
          <p className="text-2xl font-semibold tabular-nums">
            {formatZar(listing.valuationEstimate)}
          </p>
        ) : (
          <Empty className="border border-dashed py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Gauge />
              </EmptyMedia>
              <EmptyTitle>No estimate recorded</EmptyTitle>
              <EmptyDescription>
                Complete data review, then add the indicative value via the valuations
                queue.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {sellerPrice ? (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Seller pricing from intake:{" "}
              <span className="font-medium text-foreground">{sellerPrice}</span>
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

const ListingValuationPanel = ({
  listing,
  canManageReview = false,
}: ListingValuationPanelProps) => {
  const platformEstimateReady =
    isValuationPhaseReached(listing.status) && listing.valuationEstimate != null;

  if (canManageReview) {
    return <ValuationAdminState listing={listing} />;
  }

  if (!platformEstimateReady) {
    return <ValuationWaitingState />;
  }

  return <ValuationReadyState listing={listing} />;
};

export default ListingValuationPanel;
