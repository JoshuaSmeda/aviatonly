import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import OffersTable from "@/components/dashboard/offers/offers-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { buildOfferTableRows } from "@/lib/aviatonly/mock";

export const metadata: Metadata = {
  title: "Offers | AVIATONLY Admin",
};

const AdminOffersPage = () => {
  const activeCount = buildOfferTableRows({ activeOnly: true }).length;

  return (
    <>
      <BreadcrumbComp title="Offers" />
      <TitleCard title="Admin · Offers">
        <p className="mb-4 text-sm text-muted-foreground">
          {activeCount} active offer{activeCount === 1 ? "" : "s"} across all listings requiring
          seller or AVIATONLY review.
        </p>
        <OffersTable showSeller />
      </TitleCard>
    </>
  );
};

export default AdminOffersPage;
