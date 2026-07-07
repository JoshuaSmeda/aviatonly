"use client";

import { useCallback, useEffect, useState } from "react";
import { Gavel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAuctionBidCount } from "@/lib/aviatonly/marketplace/auction-card-utils";
import type { PublicAuctionBidHistoryEntry } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { formatCurrency } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { cn } from "@/lib/utils";

interface AircraftAuctionBidHistoryProps {
  auctionId: string;
  currency: "ZAR" | "USD" | "EUR";
  showBidHistory: boolean;
  initialEntries: PublicAuctionBidHistoryEntry[];
  isLive?: boolean;
}

const detailCardClass =
  "overflow-hidden rounded-xl border border-border bg-card shadow-none";

function BidStatusBadges({ entry }: { entry: PublicAuctionBidHistoryEntry }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {entry.isHighBid ? <Badge>High bid</Badge> : null}
      {entry.isViewerBid ? <Badge variant="outline">Your bid</Badge> : null}
      {entry.status === "REJECTED" ? (
        <Badge variant="destructive">{entry.statusLabel}</Badge>
      ) : entry.status === "SUPERSEDED" ? (
        <Badge variant="secondary">{entry.statusLabel}</Badge>
      ) : !entry.isHighBid && !entry.isViewerBid ? (
        <Badge variant="outline">{entry.statusLabel}</Badge>
      ) : null}
    </div>
  );
}

export function AircraftAuctionBidHistory({
  auctionId,
  currency,
  showBidHistory,
  initialEntries,
  isLive = false,
}: AircraftAuctionBidHistoryProps) {
  const [entries, setEntries] = useState(initialEntries);

  const refreshBidHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`);
      if (!response.ok) return;
      const data = (await response.json()) as { bids: PublicAuctionBidHistoryEntry[] };
      setEntries(data.bids);
    } catch {
      // Polling is best-effort in MVP.
    }
  }, [auctionId]);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  useEffect(() => {
    if (!isLive) return undefined;
    const interval = window.setInterval(() => {
      void refreshBidHistory();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [isLive, refreshBidHistory]);

  if (!showBidHistory) {
    return null;
  }

  return (
    <section className={cn(detailCardClass, "p-5 lg:p-6")}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">Bid activity</h2>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0">
          {formatAuctionBidCount(entries.length)}
        </Badge>
      </div>

      {entries.length === 0 ? (
        <Empty className="border border-dashed border-border bg-muted/20 p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Gavel />
            </EmptyMedia>
            <EmptyTitle>No bids yet</EmptyTitle>
            <EmptyDescription>
              When bidders place accepted bids on this auction, they will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Bidder</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.id}
                className={cn(entry.isHighBid && "bg-muted/30")}
              >
                <TableCell className="text-muted-foreground">{entry.sequence}</TableCell>
                <TableCell className="font-medium">{entry.bidderLabel}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(entry.amount, currency)}
                </TableCell>
                <TableCell>
                  <BidStatusBadges entry={entry} />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {entry.timeAgo}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
