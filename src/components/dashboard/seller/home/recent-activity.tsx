import CardBox from "@/components/dashboard/shared/CardBox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActivityFeedItem } from "@/lib/aviatonly/mock/types";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activity: ActivityFeedItem[];
}

const RecentActivity = ({ activity }: RecentActivityProps) => {
  return (
    <CardBox className="h-full">
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {activity.map((event, index) => {
            const isLast = index === activity.length - 1;
            return (
              <li key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />
                  {!isLast && <span className="w-px flex-1 bg-border" />}
                </div>
                <div className={cn("flex flex-col gap-0.5", !isLast && "pb-5")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{event.type}</span>
                    <Badge variant="outline">{event.registration}</Badge>
                    <span className="text-xs text-muted-foreground">{event.timeAgo}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{event.message}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </CardBox>
  );
};

export default RecentActivity;
