import { Badge } from "@/components/ui/badge";
import { getListingStatusMeta, ListingStatus } from "@/lib/aviatonly/domain";

interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

const ListingStatusBadge = ({ status, className }: ListingStatusBadgeProps) => {
  const meta = getListingStatusMeta(status);
  return (
    <Badge variant={meta.badgeVariant} className={className} title={meta.description}>
      {meta.label}
    </Badge>
  );
};

export default ListingStatusBadge;
