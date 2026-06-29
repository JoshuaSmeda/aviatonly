import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadActivityViewItem } from "@/lib/aviatonly/server/lead-workspace-types";

interface LeadActivityTimelineProps {
  items: LeadActivityViewItem[];
  emptyMessage?: string;
}

const LeadActivityTimeline = ({
  items,
  emptyMessage = "No activity recorded yet.",
}: LeadActivityTimelineProps) => {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ol className="flex flex-col">
      {items.map((event, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />
              {!isLast && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn("flex min-w-0 flex-col gap-0.5", !isLast && "pb-5")}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{event.label}</span>
                <span className="text-xs text-muted-foreground">{event.timeAgo}</span>
              </div>
              {event.actorName ? (
                <span className="text-xs text-muted-foreground">{event.actorName}</span>
              ) : null}
              {event.message ? (
                <span className="text-sm text-muted-foreground">{event.message}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default LeadActivityTimeline;
