import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import LeadsTable from "@/components/dashboard/leads/leads-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import { resolveSellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Leads | AVIATONLY",
};

const SellerLeadsPage = async () => {
  const session = await requireAuth();
  const scope = await resolveSellerListingScope(session);

  const openLeads = await getLeadTableRows({
    options: { includeClosed: false },
    scope,
  });
  const openCount = openLeads.length;

  return (
    <>
      <BreadcrumbComp title="Leads" />
      <TitleCard>
        <p className="mb-4 text-sm text-muted-foreground">
          {openCount > 0 ? (
            <>
              {openCount} open buyer enquir{openCount === 1 ? "y" : "ies"} across your aircraft
              listings. Open a lead to respond, qualify, and schedule follow-ups.
            </>
          ) : (
            <>
              No open buyer enquiries on your listings yet. Leads appear here when verified buyers
              enquire on aircraft you sell through your organisation.
            </>
          )}
        </p>
        <LeadsTable
          scope={scope}
          emptyDescription="No leads on your listings. When buyers enquire on your live aircraft, they will appear here."
        />
      </TitleCard>
    </>
  );
};

export default SellerLeadsPage;
