"use client";

import Link from "next/link";
import { GripVertical, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  canTransitionLeadStatus,
  getLeadTypeMeta,
  LEAD_PRIORITY_META,
  LeadPriority,
  LeadStatus,
} from "@/lib/aviatonly/domain";
import { formatTimeAgo } from "@/lib/aviatonly/mock";
import type { LeadPipelineCard as LeadPipelineCardData } from "@/lib/aviatonly/server/leads";

const verificationLabel = (status: LeadPipelineCardData["buyerVerification"]) => {
  if (status === "VERIFIED") return "FICA cleared";
  if (status === "PENDING") return "Verification pending";
  return "Unverified";
};

interface LeadPipelineCardProps {
  lead: LeadPipelineCardData;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  onMarkContacted?: (leadId: string) => void;
  isPending?: boolean;
}

const LeadPipelineCard = ({
  lead,
  dragHandleProps,
  isDragging = false,
  onMarkContacted,
  isPending = false,
}: LeadPipelineCardProps) => {
  const preview = lead.lastMessagePreview ?? lead.message;
  const canMarkContacted =
    canTransitionLeadStatus(lead.status, LeadStatus.CONTACTED) &&
    lead.status !== LeadStatus.CONTACTED;

  return (
    <Card
      className={cn(
        "gap-0 py-0 shadow-sm transition-shadow",
        isDragging && "shadow-md ring-2 ring-primary/20",
        lead.followUpOverdue && "border-destructive/50",
      )}
    >
      <CardHeader className="flex flex-row items-start gap-2 border-b border-border px-3 py-2">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
          aria-label={`Drag ${lead.registration} lead`}
          {...dragHandleProps}
        >
          <GripVertical />
        </button>
        <div className="min-w-0 flex-1">
          <Link
            href={lead.detailHref}
            className="block font-semibold hover:underline"
          >
            {lead.registration}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{lead.aircraftTitle}</p>
        </div>
        {lead.unread ? <Badge variant="default">Unread</Badge> : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-3 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{lead.buyerName}</span>
          <Badge variant="outline">{verificationLabel(lead.buyerVerification)}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{getLeadTypeMeta(lead.type).label}</Badge>
          {lead.priority !== LeadPriority.NORMAL ? (
            <Badge variant={lead.priority === LeadPriority.HIGH ? "default" : "secondary"}>
              {LEAD_PRIORITY_META[lead.priority].label}
            </Badge>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground" title={preview}>
          {preview}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {lead.lastMessageAt ? (
            <span>Last message {formatTimeAgo(lead.lastMessageAt)}</span>
          ) : (
            <span>Received {formatTimeAgo(lead.createdAt)}</span>
          )}
          {lead.followUpOverdue ? (
            <Badge variant="destructive">Follow-up overdue</Badge>
          ) : lead.nextFollowUpAt ? (
            <span>Follow-up {formatTimeAgo(lead.nextFollowUpAt)}</span>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t border-border px-3 py-2">
        <Button size="sm" variant="outline" render={<Link href={lead.detailHref} />}>
          Open lead
        </Button>
        {lead.messagesHref ? (
          <Button
            size="sm"
            variant={lead.unread ? "default" : "outline"}
            render={<Link href={lead.messagesHref} />}
          >
            <MessageSquare data-icon="inline-start" />
            Messages
          </Button>
        ) : null}
        {canMarkContacted && onMarkContacted ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={isPending}
            onClick={() => onMarkContacted(lead.id)}
          >
            Mark contacted
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default LeadPipelineCard;
