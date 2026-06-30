"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminPublishListingAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isLiveStatus, ListingStatus, SALE_TYPE_LABELS, SaleType } from "@/lib/aviatonly/domain";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";
import { ExternalLink, Gavel, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ListingPublishPanelProps {
  listing: MockAircraftListing;
  canManageReview: boolean;
  approvedPhotoCount: number;
}

const ListingPublishPanel = ({
  listing,
  canManageReview,
  approvedPhotoCount,
}: ListingPublishPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [publishing, setPublishing] = useState(false);
  const isLive = isLiveStatus(listing.status);
  const isApproved = listing.status === ListingStatus.APPROVED_FOR_LISTING;
  const saleLabel = SALE_TYPE_LABELS[listing.saleType as SaleType] ?? listing.saleType;

  const handlePublish = () => {
    setPublishing(true);
    startTransition(async () => {
      const result = await adminPublishListingAction(listing.id);
      setPublishing(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        `${listing.registration} is live — ${result.publishedPhotoCount} approved photo${result.publishedPhotoCount === 1 ? "" : "s"} published to the catalog.`,
      );
      router.refresh();
    });
  };

  if (isLive) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            <h3 className="font-semibold">Listing is live</h3>
          </div>
          <Badge variant="default">{saleLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Approved gallery photos are publicly visible on the buy catalog. Documents remain private
          and are only accessible to authorized parties.
        </p>
        <Button
          variant="outline"
          className="w-fit gap-2"
          render={<Link href="/dashboard/buy" target="_blank" />}
        >
          <ExternalLink className="size-4" />
          View public listing
        </Button>
      </div>
    );
  }

  if (!canManageReview || !isApproved) {
    return (
      <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        This is a seller preview only. Your aircraft is not publicly visible until AVIATONLY
        approves and publishes the listing.
      </div>
    );
  }

  if (listing.saleType === SaleType.AUCTION) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Auction listing ready</h3>
          <Badge variant="secondary">{saleLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Auction listings go live after you configure times, reserve, and increments, then schedule
          the auction. Reserve pricing stays admin-only on public pages.
        </p>
        <Button
          className="w-fit gap-2"
          render={<Link href={`/dashboard/listings/${listing.id}/auction`} />}
        >
          <Gavel className="size-4" />
          Configure auction
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Ready to publish</h3>
        <Badge variant="secondary">{saleLabel}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Publishing moves this listing to{" "}
        <span className="font-medium text-foreground">live fixed price</span>
        . Approved guided photos ({approvedPhotoCount}) will be exposed on the public catalog via
        secure redirects. Documents stay private.
      </p>
      <Button
        type="button"
        className="w-fit gap-2"
        disabled={publishing || isPending || approvedPhotoCount === 0}
        onClick={handlePublish}
      >
        {publishing || isPending ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
        Publish to catalog
      </Button>
      {approvedPhotoCount === 0 ? (
        <p className="text-xs text-destructive">
          At least one approved photo is required before publishing.
        </p>
      ) : null}
    </div>
  );
};

export default ListingPublishPanel;
