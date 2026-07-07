import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import SellerLeadsWorkspace from "@/components/dashboard/leads/pipeline/seller-leads-workspace";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { getLeadPipelineForSeller } from "@/lib/aviatonly/server/lead-pipeline";
import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import { resolveSellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Leads | AVIATONLY",
};

interface SellerLeadsPageProps {
  searchParams: Promise<{ view?: string }>;
}

const SellerLeadsPage = async ({ searchParams }: SellerLeadsPageProps) => {
  const session = await requireAuth();
  const scope = await resolveSellerListingScope(session);
  const { view } = await searchParams;
  const initialView = view === "list" ? "list" : "board";

  const messagingOptions = {
    messagingViewerId: session.user.id,
    messagesBasePath: "/dashboard/seller/messages",
    detailBasePath: "/dashboard/seller/leads",
  };

  const [board, rows] = await Promise.all([
    getLeadPipelineForSeller({ scope, options: messagingOptions }),
    getLeadTableRows({
      scope,
      options: { includeClosed: false, ...messagingOptions },
    }),
  ]);

  return (
    <>
      <BreadcrumbComp title="My Leads" />
      <TitleCard>
        <div className="flex flex-col gap-4">
          {board.totalActive > 0 ? (
            <p className="text-sm text-muted-foreground">
              Work buyer enquiries by stage across your aircraft listings. Drag cards to update
              pipeline stage, or switch to list view for search-heavy workflows.
            </p>
          ) : null}
          <SellerLeadsWorkspace
            board={board}
            rows={rows}
            initialView={initialView}
          />
        </div>
      </TitleCard>
    </>
  );
};

export default SellerLeadsPage;
