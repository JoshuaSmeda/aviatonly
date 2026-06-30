import { ListingStatus } from "@/lib/aviatonly/domain";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { transitionListingStatusRecord } from "@/lib/aviatonly/server/listing-review";
import { prisma } from "@/lib/prisma";

const INSPECTION_SCHEDULE_STATUSES = new Set<ListingStatus>([
  ListingStatus.VALUATION_READY,
  ListingStatus.APPROVED_FOR_LISTING,
]);

export async function scheduleListingInspectionRecord(input: {
  listingId: string;
  actorId: string;
  provider: string;
  location: string;
  scheduledAt: string;
  notes?: string;
}) {
  const provider = input.provider.trim();
  const location = input.location.trim();
  const scheduledAt = new Date(input.scheduledAt);

  if (!provider || !location) {
    throw new Error("Enter the AMO / inspector name and location.");
  }
  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error("Enter a valid inspection date and time.");
  }

  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, status: true, registration: true },
  });
  if (!listing) throw new NotFoundError("Listing not found.");

  const status = listing.status as ListingStatus;
  if (!INSPECTION_SCHEDULE_STATUSES.has(status) && status !== ListingStatus.INSPECTION_PENDING) {
    throw new Error("Inspection can only be scheduled after valuation or before re-scheduling.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.aircraftListing.update({
      where: { id: input.listingId },
      data: {
        inspectionProvider: provider,
        inspectionLocation: location,
        inspectionScheduledAt: scheduledAt,
        inspectionNotes: input.notes?.trim() || null,
        inspectionCompletedAt: null,
        inspectionSummary: null,
        status: ListingStatus.INSPECTION_PENDING,
      },
    });

    if (status !== ListingStatus.INSPECTION_PENDING) {
      await tx.listingStatusHistory.create({
        data: {
          listingId: input.listingId,
          fromStatus: status,
          toStatus: ListingStatus.INSPECTION_PENDING,
          changedById: input.actorId,
          reason: "Independent inspection scheduled.",
        },
      });
    }

    await tx.listingEvent.create({
      data: {
        listingId: input.listingId,
        actorId: input.actorId,
        type: "INSPECTION_SCHEDULED",
        message: `${listing.registration} inspection scheduled with ${provider} at ${location}.`,
        metadata: {
          provider,
          location,
          scheduledAt: scheduledAt.toISOString(),
        },
      },
    });
  });
}

export async function recordListingInspectionOutcomeRecord(input: {
  listingId: string;
  actorId: string;
  passed: boolean;
  summary: string;
}) {
  const summary = input.summary.trim();
  if (!summary) {
    throw new Error("Enter a short inspection outcome summary.");
  }

  const listing = await prisma.aircraftListing.findUnique({
    where: { id: input.listingId },
    select: { id: true, status: true, registration: true },
  });
  if (!listing) throw new NotFoundError("Listing not found.");

  if ((listing.status as ListingStatus) !== ListingStatus.INSPECTION_PENDING) {
    throw new Error("Inspection outcome can only be recorded while inspection is pending.");
  }

  const toStatus = input.passed
    ? ListingStatus.INSPECTION_PASSED
    : ListingStatus.INSPECTION_FAILED;

  await prisma.$transaction(async (tx) => {
    await tx.aircraftListing.update({
      where: { id: input.listingId },
      data: {
        inspectionCompletedAt: new Date(),
        inspectionSummary: summary,
        status: toStatus,
      },
    });

    await tx.listingStatusHistory.create({
      data: {
        listingId: input.listingId,
        fromStatus: ListingStatus.INSPECTION_PENDING,
        toStatus,
        changedById: input.actorId,
        reason: input.passed ? "Inspection passed." : "Inspection failed.",
      },
    });

    await tx.listingEvent.create({
      data: {
        listingId: input.listingId,
        actorId: input.actorId,
        type: input.passed ? "INSPECTION_PASSED" : "INSPECTION_FAILED",
        message: `${listing.registration} inspection ${input.passed ? "passed" : "failed"}: ${summary}`,
      },
    });
  });

  if (input.passed) {
    await transitionListingStatusRecord({
      listingId: input.listingId,
      toStatus: ListingStatus.APPROVED_FOR_LISTING,
      actorId: input.actorId,
      reason: "Inspection passed — cleared for publication.",
      eventType: "ADMIN_APPROVED_FOR_LISTING",
      eventMessage: `${listing.registration} approved for publication after inspection.`,
    });
  } else {
    await transitionListingStatusRecord({
      listingId: input.listingId,
      toStatus: ListingStatus.NEEDS_CHANGES,
      actorId: input.actorId,
      reason: "Inspection failed — seller follow-up required.",
      eventType: "ADMIN_REQUESTED_CHANGES",
      eventMessage: `${listing.registration} needs follow-up after failed inspection.`,
    });
  }
}
