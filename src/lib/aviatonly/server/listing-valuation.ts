import { ListingStatus } from "@/lib/aviatonly/domain";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { transitionListingForwardRecord } from "@/lib/aviatonly/server/listing-review";
import { prisma } from "@/lib/prisma";

export async function setPlatformIndicativeValueRecord(input: {
  listingId: string;
  amount: number;
  actorId: string;
  notes?: string;
}) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Enter a valid indicative value in ZAR.");
  }

  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, status: true, registration: true },
  });
  if (!listing) throw new NotFoundError("Listing not found.");

  const status = listing.status as ListingStatus;
  if (status !== ListingStatus.VALUATION_READY && status !== ListingStatus.APPROVED_FOR_LISTING) {
    throw new Error("Platform valuation can only be set after intake review is complete.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.aircraftListing.update({
      where: { id: input.listingId },
      data: { platformIndicativeValue: Math.round(input.amount) },
    });

    await tx.listingEvent.create({
      data: {
        listingId: input.listingId,
        actorId: input.actorId,
        type: "VALUATION_ADDED",
        message: `AVIATONLY indicative estimate set at R ${Math.round(input.amount).toLocaleString("en-ZA")} for ${listing.registration}.`,
        metadata: input.notes ? { notes: input.notes } : undefined,
      },
    });
  });
}

export async function approveListingForPublicationRecord(input: {
  listingId: string;
  actorId: string;
}) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: {
      id: true,
      status: true,
      registration: true,
      platformIndicativeValue: true,
    },
  });
  if (!listing) throw new NotFoundError("Listing not found.");

  if ((listing.status as ListingStatus) !== ListingStatus.VALUATION_READY) {
    throw new Error("Only listings on the valuation step can be approved for publication.");
  }

  if (listing.platformIndicativeValue == null) {
    throw new Error("Set the AVIATONLY indicative estimate before approving for publication.");
  }

  await transitionListingForwardRecord({
    listingId: input.listingId,
    toStatus: ListingStatus.APPROVED_FOR_LISTING,
    actorId: input.actorId,
    reason: "Valuation confirmed and listing approved for publication.",
    eventType: "ADMIN_APPROVED_FOR_LISTING",
    eventMessage: `${listing.registration} approved for publication after valuation review.`,
  });
}
