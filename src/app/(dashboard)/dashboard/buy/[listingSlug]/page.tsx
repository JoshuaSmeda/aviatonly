import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AircraftAuctionBidHistory } from "@/components/buy/aircraft-auction-bid-history";
import { AircraftAuctionPanel } from "@/components/buy/aircraft-auction-panel";
import { AircraftDetailActions } from "@/components/buy/aircraft-detail-actions";
import { AircraftDetailBreadcrumb } from "@/components/buy/aircraft-detail-breadcrumb";
import { AircraftDetailSummary } from "@/components/buy/aircraft-detail-summary";
import { AircraftDocumentChecklist } from "@/components/buy/aircraft-document-checklist";
import { AircraftEnquiryPanel } from "@/components/buy/aircraft-enquiry-panel";
import { AircraftImageGallery } from "@/components/buy/aircraft-image-gallery";
import { AircraftLocationMap } from "@/components/buy/aircraft-location-map";
import { AircraftMarketEstimateCard } from "@/components/buy/aircraft-market-estimate";
import { AircraftTechnicalDetails } from "@/components/buy/aircraft-technical-details";
import { formatAircraftTitle } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { mapAuctionStatusToCardPhase } from "@/lib/aviatonly/marketplace/auction-card-utils";
import { getBuyMarketplaceListingDetail } from "@/lib/aviatonly/server/marketplace-catalog";

interface PageProps {
  params: Promise<{ listingSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listingSlug } = await params;
  const listing = await getBuyMarketplaceListingDetail(listingSlug);
  if (!listing) {
    return { title: "Aircraft not found | AVIATONLY" };
  }
  return {
    title: `${listing.registration} — ${formatAircraftTitle(listing)} | AVIATONLY`,
    description: `Aircraft listing for ${listing.registration} on AVIATONLY.`,
  };
}

export default async function DashboardBuyDetailPage({ params }: PageProps) {
  const { listingSlug } = await params;
  const listing = await getBuyMarketplaceListingDetail(listingSlug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AircraftDetailBreadcrumb listing={listing} />
          <AircraftDetailActions />
        </div>

        <AircraftImageGallery images={listing.images} registration={listing.registration} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <AircraftDetailSummary listing={listing} />
          <div className="lg:sticky lg:top-4 lg:self-start">
            {listing.auctionDetail ? (
              <AircraftAuctionPanel listing={listing} auctionDetail={listing.auctionDetail} />
            ) : (
              <AircraftEnquiryPanel listing={listing} />
            )}
          </div>
        </div>

        {listing.auctionDetail ? (
          <AircraftAuctionBidHistory
            auctionId={listing.auctionDetail.state.auctionId}
            currency={listing.currency}
            showBidHistory={listing.auctionDetail.state.showBidHistory}
            initialEntries={listing.auctionDetail.bidHistory}
            isLive={
              mapAuctionStatusToCardPhase(
                listing.auctionDetail.state.status,
                listing.auctionDetail.state.biddingOpen,
                listing.auctionDetail.state.closedAt,
              ) === "LIVE"
            }
          />
        ) : null}

        <AircraftTechnicalDetails listing={listing} />
        <AircraftDocumentChecklist documents={listing.documents} />

        <AircraftMarketEstimateCard estimate={listing.marketEstimate} listPrice={listing.price} />
        <AircraftLocationMap listing={listing} />
      </div>
    </div>
  );
}
