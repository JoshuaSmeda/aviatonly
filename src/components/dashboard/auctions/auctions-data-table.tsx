import Link from "next/link";
import AuctionStatusBadge from "@/components/dashboard/auctions/auction-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatZar } from "@/lib/aviatonly/mock/format";
import type { AuctionTableRow } from "@/lib/aviatonly/server/auction-workspace-types";

interface AuctionsDataTableProps {
  rows: AuctionTableRow[];
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const AuctionsDataTable = ({ rows }: AuctionsDataTableProps) => {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No auctions configured yet. Create one from an approved auction listing.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Registration</TableHead>
          <TableHead>Aircraft</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Starts</TableHead>
          <TableHead>Ends</TableHead>
          <TableHead>High bid</TableHead>
          <TableHead>Bids</TableHead>
          <TableHead>Reserve</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.registration}</TableCell>
            <TableCell>{row.aircraftTitle}</TableCell>
            <TableCell>
              <AuctionStatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDateTime(row.startsAt)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDateTime(row.effectiveEndsAt)}
            </TableCell>
            <TableCell>
              {row.currentHighBidAmount != null ? formatZar(row.currentHighBidAmount) : "—"}
            </TableCell>
            <TableCell>{row.bidCount}</TableCell>
            <TableCell>
              {row.bidCount === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : row.reserveMet ? (
                <Badge variant="default">Met</Badge>
              ) : (
                <Badge variant="outline">Not met</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline" render={<Link href={row.detailHref} />}>
                Open
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuctionsDataTable;
