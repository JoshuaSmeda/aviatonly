import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import LeadsTable from "@/components/dashboard/leads/leads-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { buildLeadTableRows } from "@/lib/aviatonly/mock";

export const metadata: Metadata = {
  title: "Leads | AVIATONLY Admin",
};

const AdminLeadsPage = () => {
  const openCount = buildLeadTableRows({ includeClosed: false }).length;

  return (
    <>
      <BreadcrumbComp title="Leads" />
      <TitleCard title="Admin · Leads">
        <p className="mb-4 text-sm text-muted-foreground">
          {openCount} open buyer enquir{openCount === 1 ? "y" : "ies"} across all listings on the
          platform.
        </p>
        <LeadsTable showSeller />
      </TitleCard>
    </>
  );
};

export default AdminLeadsPage;
