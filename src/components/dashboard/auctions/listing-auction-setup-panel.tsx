"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createAuctionDraftAction } from "@/app/(dashboard)/dashboard/admin/auctions/actions";
import AuctionStatusBadge from "@/components/dashboard/auctions/auction-status-badge";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVE_AUCTION_STATUSES } from "@/lib/aviatonly/domain/auction-status";
import { formatZar } from "@/lib/aviatonly/mock/format";
import type { ListingAuctionSetupView } from "@/lib/aviatonly/server/auction-workspace-types";
import { Gavel, Loader2 } from "lucide-react";

interface ListingAuctionSetupPanelProps {
  setup: ListingAuctionSetupView;
}

const ListingAuctionSetupPanel = ({ setup }: ListingAuctionSetupPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { listing, activeAuction, canCreate, createBlockReason } = setup;

  const hasActiveDraft =
    activeAuction != null &&
    ACTIVE_AUCTION_STATUSES.includes(activeAuction.status);

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createAuctionDraftAction(listing.id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not create auction.");
        return;
      }
      toast.success("Auction draft created.");
      router.push(`/dashboard/auctions/${result.data!.auctionId}`);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">
                {listing.registration} · {listing.title}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure a timed auction for this approved listing.
              </p>
            </div>
            <ListingStatusBadge status={listing.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Opening bid</p>
            <p className="font-semibold">
              {listing.startingBid != null ? formatZar(listing.startingBid) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Seller reserve (intake)
            </p>
            <p className="font-semibold">
              {listing.reservePrice != null ? formatZar(listing.reservePrice) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Increment</p>
            <p className="font-semibold">
              {listing.bidIncrement != null ? formatZar(listing.bidIncrement) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {activeAuction ? (
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Existing auction</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <AuctionStatusBadge status={activeAuction.status} />
              {hasActiveDraft ? (
                <span className="text-sm text-muted-foreground">
                  Continue configuring this auction before it goes live.
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Most recent auction for this listing.
                </span>
              )}
            </div>
            <Button
              className="w-fit gap-2"
              render={<Link href={activeAuction.detailHref} />}
            >
              <Gavel className="size-4" />
              Open auction workspace
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {canCreate ? (
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Create auction draft</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Creates a draft auction pre-filled from seller intake pricing. You can adjust times,
              reserve, increments, and anti-sniping before scheduling.
            </p>
            <Button className="w-fit gap-2" disabled={isPending} onClick={handleCreate}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Gavel className="size-4" />}
              Create auction draft
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              {createBlockReason ?? "An auction cannot be created for this listing right now."}
            </p>
          </CardContent>
        </Card>
      )}

      <Button variant="link" className="h-auto w-fit p-0" render={<Link href={listing.href} />}>
        Back to listing workspace
      </Button>
    </div>
  );
};

export default ListingAuctionSetupPanel;
