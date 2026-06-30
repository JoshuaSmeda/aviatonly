import { ListingStatus, SaleType } from "@/lib/aviatonly/domain";
import { assertCanForwardListingStatus } from "@/lib/aviatonly/domain/listing-transitions";
import { buildListingSlug } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { transitionListingForwardRecord } from "@/lib/aviatonly/server/listing-review";
import { publishListingPhotosRecord } from "@/lib/upload/publish-listing-photos";
import { prisma } from "@/lib/prisma";

export interface PublishListingResult {
  listingId: string;
  registration: string;
  slug: string;
  status: ListingStatus;
  publishedPhotoCount: number;
}

function resolveLiveStatus(saleType: SaleType): ListingStatus {
  return saleType === SaleType.AUCTION
    ? ListingStatus.LIVE_AUCTION
    : ListingStatus.LIVE_FIXED_PRICE;
}

export async function publishListingRecord(
  listingId: string,
  actorId: string,
): Promise<PublishListingResult> {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      registration: true,
      make: true,
      model: true,
      status: true,
      saleType: true,
    },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  const fromStatus = listing.status as ListingStatus;
  const toStatus = resolveLiveStatus(listing.saleType as SaleType);

  assertCanForwardListingStatus(fromStatus, toStatus);

  await transitionListingForwardRecord({
    listingId,
    toStatus,
    actorId,
    reason: "Listing published to the public catalog.",
    eventType: "LISTING_PUBLISHED",
    eventMessage: `${listing.registration} is now live on AVIATONLY.`,
  });

  const { publishedCount } = await publishListingPhotosRecord(listingId);

  return {
    listingId: listing.id,
    registration: listing.registration,
    slug: buildListingSlug(listing.registration, listing.make, listing.model),
    status: toStatus,
    publishedPhotoCount: publishedCount,
  };
}
