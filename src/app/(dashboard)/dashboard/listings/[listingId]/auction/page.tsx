import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ListingAuctionSetupPanel from "@/components/dashboard/auctions/listing-auction-setup-panel";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { ACTIVE_AUCTION_STATUSES } from "@/lib/aviatonly/domain/auction-status";
import { getListingAuctionSetup } from "@/lib/aviatonly/server/auction-workspace";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

interface ListingAuctionPageProps {
  params: Promise<{ listingId: string }>;
}

export async function generateMetadata({ params }: ListingAuctionPageProps): Promise<Metadata> {
  const { listingId } = await params;
  const setup = await getListingAuctionSetup(listingId);
  return {
    title: setup
      ? `Admin · ${setup.listing.registration} Auction Setup | AVIATONLY`
      : "Auction Setup | AVIATONLY Admin",
  };
}

const ListingAuctionPage = async ({ params }: ListingAuctionPageProps) => {
  await requireAnyRole(ADMIN_ROLES);
  const { listingId } = await params;
  const setup = await getListingAuctionSetup(listingId);

  if (!setup) {
    notFound();
  }

  if (
    setup.activeAuction &&
    ACTIVE_AUCTION_STATUSES.includes(setup.activeAuction.status)
  ) {
    redirect(setup.activeAuction.detailHref);
  }

  return (
    <>
      <BreadcrumbComp title={`Admin · ${setup.listing.registration} · Auction`} />
      <TitleCard title={`${setup.listing.registration} · Auction setup`}>
        <ListingAuctionSetupPanel setup={setup} />
      </TitleCard>
    </>
  );
};

export default ListingAuctionPage;
