import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActivityFeedItem } from "@/lib/aviatonly/mock/types";

interface ListingWorkspaceActivityTimelineProps {
  items: ActivityFeedItem[];
  showRegistration?: boolean;
}

const ListingWorkspaceActivityTimeline = ({
  items,
  showRegistration = true,
}: ListingWorkspaceActivityTimelineProps) => {
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
            <div className={cn("flex flex-col gap-0.5", !isLast && "pb-5")}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{event.type}</span>
                {showRegistration && <Badge variant="outline">{event.registration}</Badge>}
                <span className="text-xs text-muted-foreground">{event.timeAgo}</span>
              </div>
              <span className="text-sm text-muted-foreground">{event.message}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ListingWorkspaceActivityTimeline;
