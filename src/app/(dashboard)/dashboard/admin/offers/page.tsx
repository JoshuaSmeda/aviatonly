import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import OffersTable from "@/components/dashboard/offers/offers-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { getOfferTableRows } from "@/lib/aviatonly/server/offer-table";

export const metadata: Metadata = {
  title: "Offers | AVIATONLY Admin",
};

const AdminOffersPage = async () => {
  const activeOffers = await getOfferTableRows({ options: { activeOnly: true } });
  const activeCount = activeOffers.length;

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
