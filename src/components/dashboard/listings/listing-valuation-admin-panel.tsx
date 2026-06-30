"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  adminApproveListingForPublicationAction,
  adminSetPlatformValuationAction,
} from "@/app/(dashboard)/dashboard/admin/listings/actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ListingStatus, SALE_TYPE_LABELS, SaleType } from "@/lib/aviatonly/domain";
import { formatZar } from "@/lib/aviatonly/mock";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";

interface ListingValuationAdminPanelProps {
  listing: MockAircraftListing;
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

const ListingValuationAdminPanel = ({ listing }: ListingValuationAdminPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(
    listing.platformIndicativeValue != null ? String(listing.platformIndicativeValue) : "",
  );
  const [notes, setNotes] = useState("");

  const saleLabel = SALE_TYPE_LABELS[listing.saleType as SaleType] ?? listing.saleType;
  const sellerPrice = sellerListingPrice(listing);
  const canEditValuation = listing.status === ListingStatus.VALUATION_READY;
  const canApprove =
    listing.status === ListingStatus.VALUATION_READY && listing.platformIndicativeValue != null;

  const saveValuation = () => {
    const parsed = Number(amount.replace(/\s/g, ""));
    startTransition(async () => {
      const result = await adminSetPlatformValuationAction({
        listingId: listing.id,
        amount: parsed,
        notes: notes.trim() || undefined,
      });
      if (!result.ok) {
        toast.error(result.error ?? "Could not save valuation.");
        return;
      }
      toast.success("AVIATONLY indicative estimate saved.");
      router.refresh();
    });
  };

  const approveForPublication = () => {
    startTransition(async () => {
      const result = await adminApproveListingForPublicationAction(listing.id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not approve listing.");
        return;
      }
      toast.success("Listing approved for publication.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AVIATONLY indicative estimate</CardTitle>
            <CardDescription>
              Internal market benchmark after reviewed intake data. This is what the seller sees as
              the platform estimate — separate from their optional expected price.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {canEditValuation ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="platform-valuation">Indicative value (ZAR)</Label>
                  <Input
                    id="platform-valuation"
                    inputMode="numeric"
                    placeholder="1700000"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="valuation-notes">Internal notes (optional)</Label>
                  <Textarea
                    id="valuation-notes"
                    placeholder="Comparable sales, condition adjustments, market context…"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                  />
                </div>
                <Button disabled={isPending} onClick={saveValuation} className="w-fit">
                  {isPending ? <Spinner data-icon="inline-start" /> : null}
                  Save indicative estimate
                </Button>
              </>
            ) : listing.platformIndicativeValue != null ? (
              <p className="text-2xl font-semibold tabular-nums">
                {formatZar(listing.platformIndicativeValue)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete intake review to unlock valuation entry.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Seller pricing</CardTitle>
              <Badge variant="secondary">{saleLabel}</Badge>
            </div>
            <CardDescription>From intake — for comparison with your estimate.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {sellerPrice ? (
              <p>
                Listing price:{" "}
                <span className="font-medium tabular-nums text-foreground">{sellerPrice}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">No asking price or auction terms on file.</p>
            )}
            {listing.valuationEstimate != null ? (
              <p>
                Seller expected price:{" "}
                <span className="font-medium tabular-nums text-foreground">
                  {formatZar(listing.valuationEstimate)}
                </span>
              </p>
            ) : (
              <p className="text-muted-foreground">Seller did not provide an expected price.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {canApprove ? (
        <Alert>
          <AlertTitle>Ready to approve</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>
              Compare your indicative estimate with the seller&apos;s asking price or reserve. When
              aligned, approve for publication — the listing still won&apos;t be public until you
              publish from Overview.
            </p>
            <Button disabled={isPending} onClick={approveForPublication} className="w-fit">
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              Approve for publication
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {listing.status === ListingStatus.APPROVED_FOR_LISTING ? (
        <>
          <Separator />
          <Alert>
            <AlertTitle>Approved for publication</AlertTitle>
            <AlertDescription>
              Valuation step complete. Publish the listing from the Overview tab when ready.
            </AlertDescription>
          </Alert>
        </>
      ) : null}
    </div>
  );
};

export default ListingValuationAdminPanel;
