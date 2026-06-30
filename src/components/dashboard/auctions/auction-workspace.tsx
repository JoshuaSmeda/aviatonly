import Link from "next/link";
import AuctionBidsTable from "@/components/dashboard/auctions/auction-bids-table";
import AuctionEventTimeline from "@/components/dashboard/auctions/auction-event-timeline";
import AuctionRegistrationsTable from "@/components/dashboard/auctions/auction-registrations-table";
import AuctionSettingsForm from "@/components/dashboard/auctions/auction-settings-form";
import AuctionStatusBadge from "@/components/dashboard/auctions/auction-status-badge";
import AuctionWorkflowActions from "@/components/dashboard/auctions/auction-workflow-actions";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatZar } from "@/lib/aviatonly/mock/format";
import type { AuctionWorkspaceView } from "@/lib/aviatonly/server/auction-workspace-types";

interface AuctionWorkspaceProps {
  workspace: AuctionWorkspaceView;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const AuctionWorkspace = ({ workspace }: AuctionWorkspaceProps) => {
  const { state, listing } = workspace;
  const highBidLabel =
    state.currentHighBidAmount != null
      ? formatZar(state.currentHighBidAmount)
      : "No bids yet";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="flex flex-col gap-6 xl:col-span-8">
        <Card>
          <CardHeader className="gap-3 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">
                  {listing.registration} · {listing.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AuctionStatusBadge status={state.status} />
                <ListingStatusBadge status={listing.status} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Seller: {listing.sellerName} · Opens {formatDateTime(state.startsAt)} · Ends{" "}
              {formatDateTime(state.effectiveEndsAt)}
              {state.extensionCount > 0
                ? ` · Extended ${state.extensionCount} time${state.extensionCount === 1 ? "" : "s"}`
                : ""}
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">High bid</p>
              <p className="text-lg font-semibold">{highBidLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bid count</p>
              <p className="text-lg font-semibold">{state.bidCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Next minimum bid
              </p>
              <p className="text-lg font-semibold">{formatZar(state.minimumNextBid)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bidding</p>
              <p className="text-lg font-semibold">{state.biddingOpen ? "Open" : "Closed"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Auction settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AuctionSettingsForm auctionId={workspace.auctionId} state={state} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Bid history</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AuctionBidsTable bids={workspace.bids} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Event history</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AuctionEventTimeline items={workspace.events} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 xl:col-span-4">
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Reserve status (admin only)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Reserve price</span>
              <span className="font-semibold">{formatZar(state.reservePrice)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Reserve met</span>
              {state.bidCount === 0 ? (
                <Badge variant="outline">No bids</Badge>
              ) : state.reserveMet ? (
                <Badge variant="default">Met</Badge>
              ) : (
                <Badge variant="destructive">Not met</Badge>
              )}
            </div>
            {state.closeOutcome ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Close outcome</span>
                <Badge variant="outline">{state.closeOutcome.replace(/_/g, " ")}</Badge>
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Reserve amount is never exposed on public buy pages unless ops explicitly enables
              show reserve price (disabled by default).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Registered bidders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AuctionRegistrationsTable registrations={workspace.registrations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Aircraft</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4 text-sm">
            <p className="font-medium">{listing.registration}</p>
            <p className="text-muted-foreground">{listing.title}</p>
            <Link href={listing.href} className="font-medium text-primary hover:underline">
              Open listing workspace
            </Link>
            <Link
              href={listing.setupHref}
              className="font-medium text-primary hover:underline"
            >
              Listing auction setup
            </Link>
            <Link
              href={listing.publicHref}
              className="font-medium text-primary hover:underline"
              target="_blank"
            >
              View public listing
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AuctionWorkflowActions auctionId={workspace.auctionId} state={state} />
            {workspace.cancelReason ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Cancelled: {workspace.cancelReason}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuctionWorkspace;
