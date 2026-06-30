import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AircraftDescription } from "@/components/buy/aircraft-description";
import { AircraftDetailActions } from "@/components/buy/aircraft-detail-actions";
import { AircraftDetailBreadcrumb } from "@/components/buy/aircraft-detail-breadcrumb";
import { AircraftDetailSummary } from "@/components/buy/aircraft-detail-summary";
import { AircraftEnquiryPanel } from "@/components/buy/aircraft-enquiry-panel";
import { AircraftHighlights } from "@/components/buy/aircraft-highlights";
import { AircraftImageGallery } from "@/components/buy/aircraft-image-gallery";
import { AircraftLocationMap } from "@/components/buy/aircraft-location-map";
import { AircraftMarketEstimateCard } from "@/components/buy/aircraft-market-estimate";
import { AircraftTechnicalDetails } from "@/components/buy/aircraft-technical-details";
import { getMockListingBySlug } from "@/lib/aviatonly/marketplace/mock-aircraft-listings";
import { formatAircraftTitle } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";

interface PageProps {
  params: Promise<{ listingSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listingSlug } = await params;
  const listing = getMockListingBySlug(listingSlug);
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
  const listing = getMockListingBySlug(listingSlug);

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
            <AircraftEnquiryPanel listing={listing} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {listing.highlights.length > 0 ? (
            <AircraftHighlights highlights={listing.highlights} className="lg:col-span-1" />
          ) : null}
          <AircraftDescription
            description={listing.description}
            className={listing.highlights.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}
          />
        </div>

        <AircraftMarketEstimateCard estimate={listing.marketEstimate} listPrice={listing.price} />
        <AircraftTechnicalDetails technicalSpec={listing.technicalSpec} />
        <AircraftLocationMap listing={listing} />
      </div>
    </div>
  );
}
