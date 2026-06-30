import { isLiveStatus, ListingStatus, PhotoStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl } from "@/lib/upload/app-base-url";

function buildCatalogPhotoUrl(photoId: string) {
  return `${getAppBaseUrl()}/api/catalog/photos/${photoId}`;
}

/**
 * Marks approved guided photos as publicly catalogued for /buy.
 * Objects stay in private R2; the catalog route issues short-lived redirects after checks.
 */
export async function publishListingPhotosRecord(listingId: string) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, registration: true },
  });

  if (!listing) {
    throw new Error("Listing not found.");
  }

  if (!isLiveStatus(listing.status as ListingStatus)) {
    throw new Error("Listing must be live before photos can be published to the catalog.");
  }

  const photos = await prisma.aircraftPhoto.findMany({
    where: {
      listingId,
      status: PhotoStatus.APPROVED,
      storageKey: { not: null },
    },
    select: { id: true },
  });

  if (photos.length === 0) {
    return { publishedCount: 0 };
  }

  await prisma.$transaction(async (tx) => {
    for (const photo of photos) {
      await tx.aircraftPhoto.update({
        where: { id: photo.id },
        data: {
          isPublicGalleryImage: true,
          publicUrl: buildCatalogPhotoUrl(photo.id),
        },
      });
    }

    await tx.aircraftPhoto.updateMany({
      where: {
        listingId,
        status: { not: PhotoStatus.APPROVED },
      },
      data: {
        isPublicGalleryImage: false,
        publicUrl: null,
      },
    });
  });

  return { publishedCount: photos.length };
}

export async function unpublishListingPhotosRecord(listingId: string) {
  await prisma.aircraftPhoto.updateMany({
    where: { listingId },
    data: {
      isPublicGalleryImage: false,
      publicUrl: null,
    },
  });
}
