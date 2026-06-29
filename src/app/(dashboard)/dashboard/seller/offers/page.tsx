import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import OffersTable from "@/components/dashboard/offers/offers-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { buildOfferTableRows, DEMO_SELLER_ID } from "@/lib/aviatonly/mock";

export const metadata: Metadata = {
  title: "Offers | AVIATONLY",
};

const SellerOffersPage = () => {
  const activeCount = buildOfferTableRows({
    sellerId: DEMO_SELLER_ID,
    activeOnly: true,
  }).length;

  return (
    <>
      <BreadcrumbComp title="Offers" />
      <TitleCard>
        <p className="mb-4 text-sm text-muted-foreground">
          {activeCount} active offer{activeCount === 1 ? "" : "s"} awaiting your review across
          live listings.
        </p>
        <OffersTable options={{ sellerId: DEMO_SELLER_ID }} />
      </TitleCard>
    </>
  );
};

export default SellerOffersPage;
