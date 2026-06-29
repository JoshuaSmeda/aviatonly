import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import LeadsTable from "@/components/dashboard/leads/leads-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { buildLeadTableRows, DEMO_SELLER_ID } from "@/lib/aviatonly/mock";

export const metadata: Metadata = {
  title: "Leads | AVIATONLY",
};

const SellerLeadsPage = () => {
  const openCount = buildLeadTableRows({
    sellerId: DEMO_SELLER_ID,
    includeClosed: false,
  }).length;

  return (
    <>
      <BreadcrumbComp title="Leads" />
      <TitleCard>
        <p className="mb-4 text-sm text-muted-foreground">
          {openCount} open buyer enquir{openCount === 1 ? "y" : "ies"} across your aircraft
          listings. Track qualification, viewing requests, and document access.
        </p>
        <LeadsTable options={{ sellerId: DEMO_SELLER_ID }} />
      </TitleCard>
    </>
  );
};

export default SellerLeadsPage;
