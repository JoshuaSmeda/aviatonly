import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { DEAL_SELLER_MILESTONES, getDealStatusMeta } from "@/lib/aviatonly/domain";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatZar } from "@/lib/aviatonly/mock/format";
import { queryDealProgressSummaries } from "@/lib/aviatonly/server/seller-dashboard";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Deal & Escrow Tracker | AVIATONLY",
};

const EscrowTrackerPage = async () => {
  const session = await requireAnyRole([...SELLER_ROLES, ...ADMIN_ROLES]);
  const deals = await queryDealProgressSummaries(session.user.id);

  return (
    <>
      <BreadcrumbComp title="Deal & Escrow Tracker" />
      <TitleCard title="Deal & Escrow Tracker">
        {deals.length === 0 ? (
          <WorkflowPlaceholder
            icon={Handshake}
            title="No active deals"
            description="When an offer is accepted or an auction closes, the deal will appear here as a tracked milestone timeline from deposit through SACAA transfer and funds release."
          >
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              {DEAL_SELLER_MILESTONES.map((milestone, index) => (
                <span key={milestone} className="flex items-center gap-2">
                  <span className="rounded-full border border-border px-3 py-1">{milestone}</span>
                  {index < DEAL_SELLER_MILESTONES.length - 1 ? <span>→</span> : null}
                </span>
              ))}
            </div>
          </WorkflowPlaceholder>
        ) : (
          <div className="flex flex-col gap-6">
            {deals.map((deal) => {
              const statusMeta = getDealStatusMeta(deal.status);
              return (
                <div
                  key={deal.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">
                        {deal.registration} · {deal.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{deal.buyer}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-semibold tabular-nums">
                        {formatZar(deal.agreedPrice)}
                      </span>
                      <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Next: </span>
                    <span className="font-medium">{deal.nextAction}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/dashboard/listings/${deal.listingId}`} />}
                  >
                    Open listing workspace
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </TitleCard>
    </>
  );
};

export default EscrowTrackerPage;
