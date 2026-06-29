import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import OffersTable from "@/components/dashboard/offers/offers-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { getOfferTableRows } from "@/lib/aviatonly/server/offer-table";
import { resolveSellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Offers | AVIATONLY",
};

const SellerOffersPage = async () => {
  const session = await requireAuth();
  const scope = await resolveSellerListingScope(session);

  const activeOffers = await getOfferTableRows({
    options: { activeOnly: true },
    scope,
  });

  return (
    <>
      <BreadcrumbComp title="Offers" />
      <TitleCard>
        <p className="mb-4 text-sm text-muted-foreground">
          {activeOffers.length > 0
            ? `${activeOffers.length} active offer${activeOffers.length === 1 ? "" : "s"} on your listings.`
            : "No active offers on your listings yet."}
        </p>
        <OffersTable scope={scope} options={{ activeOnly: true }} />
      </TitleCard>
    </>
  );
};

export default SellerOffersPage;
