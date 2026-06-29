import { Badge } from "@/components/ui/badge";
import { getLeadStatusMeta, LeadStatus } from "@/lib/aviatonly/domain";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const LeadStatusBadge = ({ status, className }: LeadStatusBadgeProps) => {
  const meta = getLeadStatusMeta(status);
  return (
    <Badge variant={meta.badgeVariant} className={className} title={meta.description}>
      {meta.label}
    </Badge>
  );
};

export default LeadStatusBadge;
