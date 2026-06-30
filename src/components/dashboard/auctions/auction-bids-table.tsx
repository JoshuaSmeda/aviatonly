import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatZar } from "@/lib/aviatonly/mock/format";
import type { AuctionBidView } from "@/lib/aviatonly/server/auction-workspace-types";

interface AuctionBidsTableProps {
  bids: AuctionBidView[];
}

const AuctionBidsTable = ({ bids }: AuctionBidsTableProps) => {
  if (bids.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No bids recorded yet for this auction.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Bidder</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>When</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.map((bid) => (
          <TableRow key={bid.id}>
            <TableCell className="text-muted-foreground">{bid.sequence}</TableCell>
            <TableCell>{bid.bidderLabel}</TableCell>
            <TableCell className="font-medium">{formatZar(bid.amount)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  bid.status === "ACCEPTED" ||
                  bid.status === "WINNING_AT_CLOSE" ||
                  bid.status === "BINDING"
                    ? "default"
                    : bid.status === "REJECTED"
                      ? "destructive"
                      : "outline"
                }
              >
                {bid.statusLabel}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{bid.timeAgo}</TableCell>
            <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
              {bid.rejectedReason ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuctionBidsTable;
