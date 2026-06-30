import { NextResponse } from "next/server";
import { isLiveStatus, ListingStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { getR2PresignedDownloadUrl, isRemoteStorageKey } from "@/lib/upload/r2-storage";

export const runtime = "nodejs";

interface RouteProps {
  params: Promise<{ photoId: string }>;
}

/** Public catalog redirect for live listing gallery photos. */
export async function GET(_request: Request, { params }: RouteProps) {
  const { photoId } = await params;

  const photo = await prisma.aircraftPhoto.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      storageKey: true,
      isPublicGalleryImage: true,
      listing: { select: { status: true } },
    },
  });

  if (
    !photo ||
    !photo.isPublicGalleryImage ||
    !isRemoteStorageKey(photo.storageKey) ||
    !isLiveStatus(photo.listing.status as ListingStatus)
  ) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const signedUrl = await getR2PresignedDownloadUrl(photo.storageKey, 3600);

  return NextResponse.redirect(signedUrl, {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
