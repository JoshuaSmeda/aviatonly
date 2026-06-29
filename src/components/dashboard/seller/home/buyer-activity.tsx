import { FileLock2, HandCoins, MessageSquare, type LucideIcon } from "lucide-react";
import CardBox from "@/components/dashboard/shared/CardBox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BuyerActivityType } from "@/lib/aviatonly/domain";
import { buildBuyerActivityFeed } from "@/lib/aviatonly/mock";

const TYPE_ICON: Record<BuyerActivityType, LucideIcon> = {
  [BuyerActivityType.ENQUIRY]: MessageSquare,
  [BuyerActivityType.DOC_REQUEST]: FileLock2,
  [BuyerActivityType.OFFER]: HandCoins,
};

const BuyerActivity = () => {
  const activity = buildBuyerActivityFeed();

  const enquiries = activity.filter((i) => i.type === BuyerActivityType.ENQUIRY).length;
  const docRequests = activity.filter((i) => i.type === BuyerActivityType.DOC_REQUEST).length;
  const offers = activity.filter((i) => i.type === BuyerActivityType.OFFER).length;

  return (
    <CardBox className="h-full">
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle>Buyer activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col rounded-lg bg-muted/40 p-3">
            <span className="text-xl font-semibold tabular-nums">{enquiries}</span>
            <span className="text-xs text-muted-foreground">Enquiries</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/40 p-3">
            <span className="text-xl font-semibold tabular-nums">{docRequests}</span>
            <span className="text-xs text-muted-foreground">Doc requests</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/40 p-3">
            <span className="text-xl font-semibold tabular-nums">{offers}</span>
            <span className="text-xs text-muted-foreground">Offers</span>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {activity.map((item) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.registration}</Badge>
                    <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.message}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </CardBox>
  );
};

export default BuyerActivity;
