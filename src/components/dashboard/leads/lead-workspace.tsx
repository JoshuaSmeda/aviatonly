import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadActivityTimeline from "@/components/dashboard/leads/lead-activity-timeline";
import LeadWorkspaceActions from "@/components/dashboard/leads/lead-workspace-actions";
import LeadStatusBadge from "@/components/dashboard/shared/lead-status-badge";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import {
  BUYER_VERIFICATION_META,
  getLeadTypeMeta,
  LEAD_PRIORITY_META,
  LEAD_SOURCE_META,
} from "@/lib/aviatonly/domain";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import type { LeadWorkspaceView } from "@/lib/aviatonly/server/lead-workspace-types";

interface LeadWorkspaceProps {
  lead: LeadWorkspaceView;
  canManage: boolean;
  backHref: string;
}

const LeadWorkspace = ({ lead, canManage, backHref }: LeadWorkspaceProps) => {
  const typeMeta = getLeadTypeMeta(lead.type);
  const verificationMeta = BUYER_VERIFICATION_META[lead.buyerVerification];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="flex flex-col gap-6 xl:col-span-8">
        <Card>
          <CardHeader className="gap-3 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">
                  {lead.buyer.name} · {lead.listing.registration}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{lead.listing.title}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <LeadStatusBadge status={lead.status} />
                <Badge variant="outline">{typeMeta.label}</Badge>
                <Badge variant="outline">{LEAD_PRIORITY_META[lead.priority].label} priority</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Received {formatTimeAgo(lead.createdAt)} · Source: {LEAD_SOURCE_META[lead.source].label}
              {lead.assignee ? ` · Assigned to ${lead.assignee.name}` : ""}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed">{lead.message}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Activity timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <LeadActivityTimeline items={lead.activities} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 xl:col-span-4">
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Buyer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4 text-sm">
            <p className="font-medium">{lead.buyer.name}</p>
            <p className="text-muted-foreground">{lead.buyer.email}</p>
            <Badge variant="outline" title={verificationMeta.description}>
              {verificationMeta.label}
            </Badge>
            {lead.priorEnquiries.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Prior enquiries
                </p>
                {lead.priorEnquiries.map((item) => (
                  <Link
                    key={item.id}
                    href={item.detailHref}
                    className="rounded-md border border-border p-2 text-xs hover:bg-muted/50"
                  >
                    <span className="font-medium">{item.registration}</span>
                    <span className="text-muted-foreground"> · {item.aircraftTitle}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Aircraft</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4 text-sm">
            <p className="font-medium">{lead.listing.registration}</p>
            <p className="text-muted-foreground">{lead.listing.title}</p>
            <p className="text-muted-foreground">{lead.listing.location}</p>
            <ListingStatusBadge status={lead.listing.status} />
            <Link
              href={lead.listing.href}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Open listing workspace
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <LeadWorkspaceActions lead={lead} canManage={canManage} />
          </CardContent>
        </Card>

        {canManage && lead.internalNotes ? (
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base">Internal notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {lead.internalNotes}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to leads queue
        </Link>
      </div>
    </div>
  );
};

export default LeadWorkspace;
