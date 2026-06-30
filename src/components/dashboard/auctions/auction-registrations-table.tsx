import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AuctionRegistrationView } from "@/lib/aviatonly/server/auction-workspace-types";

interface AuctionRegistrationsTableProps {
  registrations: AuctionRegistrationView[];
}

const AuctionRegistrationsTable = ({ registrations }: AuctionRegistrationsTableProps) => {
  if (registrations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No bidders registered yet. Buyers must register before placing bids.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paddle</TableHead>
          <TableHead>Bidder</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Verification</TableHead>
          <TableHead>Registered</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg) => (
          <TableRow key={reg.id}>
            <TableCell className="font-medium">
              {reg.paddleNumber != null ? `#${reg.paddleNumber}` : "—"}
            </TableCell>
            <TableCell>{reg.name}</TableCell>
            <TableCell className="text-muted-foreground">{reg.email}</TableCell>
            <TableCell>
              <Badge variant={reg.status === "APPROVED" ? "default" : "outline"}>
                {reg.statusLabel}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{reg.verificationStatus}</TableCell>
            <TableCell className="text-muted-foreground">{reg.timeAgo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuctionRegistrationsTable;
