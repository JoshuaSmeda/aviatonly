import Link from "next/link";
import LeadStatusBadge from "@/components/dashboard/shared/lead-status-badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadStatus } from "@/lib/aviatonly/domain";

export interface LeadThreadHeaderData {
  registration: string;
  aircraftTitle: string;
  counterpartName: string;
  counterpartRoleLabel: string;
  status: LeadStatus;
  contextHref: string;
  contextLabel: string;
}

interface LeadThreadHeaderProps {
  thread: LeadThreadHeaderData;
}

export function LeadThreadHeader({ thread }: LeadThreadHeaderProps) {
  return (
    <CardHeader className="gap-3 border-b border-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs text-muted-foreground">{thread.counterpartRoleLabel}</p>
          <CardTitle className="text-base">{thread.counterpartName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {thread.registration} · {thread.aircraftTitle}
          </p>
        </div>
        <LeadStatusBadge status={thread.status} />
      </div>
      <Button variant="outline" size="sm" className="w-fit" render={<Link href={thread.contextHref} />}>
        {thread.contextLabel}
      </Button>
    </CardHeader>
  );
}
