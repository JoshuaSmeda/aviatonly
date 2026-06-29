import { ListingStatus } from "@/lib/aviatonly/domain";
import {
  assertCanForwardListingStatus,
  assertCanRollbackListingStatus,
  assertCanTransitionListingStatus,
} from "@/lib/aviatonly/domain/listing-transitions";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

export interface TransitionListingStatusInput {
  listingId: string;
  toStatus: ListingStatus;
  actorId: string;
  reason?: string;
  eventType: string;
  eventMessage?: string;
}

type TransitionMode = "forward" | "rollback" | "standard";

async function transitionListingStatusRecordInternal(
  input: TransitionListingStatusInput,
  mode: TransitionMode,
) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, status: true, registration: true },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  const fromStatus = listing.status as ListingStatus;
  const toStatus = input.toStatus;

  if (mode === "forward") {
    assertCanForwardListingStatus(fromStatus, toStatus);
  } else if (mode === "rollback") {
    assertCanRollbackListingStatus(fromStatus, toStatus);
  } else {
    assertCanTransitionListingStatus(fromStatus, toStatus);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.aircraftListing.update({
      where: { id: input.listingId },
      data: { status: toStatus },
    });

    await tx.listingStatusHistory.create({
      data: {
        listingId: listing.id,
        fromStatus,
        toStatus,
        changedById: input.actorId,
        reason: input.reason ?? null,
      },
    });

    await tx.listingEvent.create({
      data: {
        listingId: listing.id,
        actorId: input.actorId,
        type: input.eventType,
        message:
          input.eventMessage ??
          `${listing.registration} moved to ${toStatus.replace(/_/g, " ").toLowerCase()}.`,
      },
    });

    return updated;
  });
}

export async function transitionListingStatusRecord(input: TransitionListingStatusInput) {
  return transitionListingStatusRecordInternal(input, "standard");
}

export async function transitionListingForwardRecord(input: TransitionListingStatusInput) {
  return transitionListingStatusRecordInternal(input, "forward");
}

export async function transitionListingRollbackRecord(input: TransitionListingStatusInput) {
  return transitionListingStatusRecordInternal(input, "rollback");
}
