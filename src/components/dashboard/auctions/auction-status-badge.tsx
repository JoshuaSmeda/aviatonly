import { Badge } from "@/components/ui/badge";
import { getAuctionStatusMeta, type AuctionStatus } from "@/lib/aviatonly/domain/auction-status";

interface AuctionStatusBadgeProps {
  status: AuctionStatus;
  className?: string;
}

const AuctionStatusBadge = ({ status, className }: AuctionStatusBadgeProps) => {
  const meta = getAuctionStatusMeta(status);
  return (
    <Badge variant={meta.badgeVariant} className={className} title={meta.description}>
      {meta.label}
    </Badge>
  );
};

export default AuctionStatusBadge;
