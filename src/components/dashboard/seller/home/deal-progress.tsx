import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import CardBox from "@/components/dashboard/shared/CardBox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDealStatusMeta } from "@/lib/aviatonly/domain";
import { buildDealProgressSummaries, formatZar } from "@/lib/aviatonly/mock";

const DealProgress = () => {
  const deals = buildDealProgressSummaries();

  return (
    <CardBox className="h-full">
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle>Deal progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {deals.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Handshake />
              </EmptyMedia>
              <EmptyTitle>No active deals</EmptyTitle>
              <EmptyDescription>
                Accepted offers and closing auctions will appear here as tracked deals.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          deals.map((deal) => {
            const statusMeta = getDealStatusMeta(deal.status);
            return (
              <div key={deal.id} className="flex flex-col gap-4 rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {deal.registration} · {deal.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{deal.buyer}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatZar(deal.agreedPrice)}
                  </span>
                </div>

                <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>

                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <span className="text-muted-foreground">Next: </span>
                  <span className="font-medium">{deal.nextAction}</span>
                </div>
              </div>
            );
          })
        )}

        <Button variant="outline" render={<Link href="/dashboard/escrow-tracker" />}>
          Open escrow tracker
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </CardBox>
  );
};

export default DealProgress;
