import {
  DocumentStatus,
  EnginePosition,
  FieldReviewStatus,
  ListingStatus,
  PhotoStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

export type SellerFixResult =
  | { ok: true; listingId: string; allFixesSubmitted: boolean }
  | { ok: false; error: string };

const SELLER_FIX_BLOCKED_STATUSES = new Set<ListingStatus>([
  ListingStatus.SOLD,
  ListingStatus.WITHDRAWN,
  ListingStatus.EXPIRED,
  ListingStatus.LIVE_FIXED_PRICE,
  ListingStatus.LIVE_AUCTION,
  ListingStatus.UNDER_OFFER,
  ListingStatus.UNDER_CONTRACT,
  ListingStatus.TRANSFER_PENDING,
]);

async function assertSellerCanFix(
  listingId: string,
  sellerId: string,
  source: { sourceType: "field" | "photo" | "document"; sourceKey: string },
) {
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId },
    select: { id: true, status: true, registration: true },
  });
  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  const status = listing.status as ListingStatus;
  if (SELLER_FIX_BLOCKED_STATUSES.has(status)) {
    throw new Error("This listing can no longer be updated.");
  }

  if (status === ListingStatus.NEEDS_CHANGES) {
    return listing;
  }

  const openTask = await prisma.listingReviewTask.findFirst({
    where: {
      listingId,
      releasedToSeller: true,
      status: ReviewTaskStatus.WAITING_ON_SELLER,
      sourceType: source.sourceType,
      sourceKey: source.sourceKey,
    },
    select: { id: true },
  });

  if (!openTask) {
    throw new Error("This listing is not waiting on seller changes.");
  }

  await prisma.aircraftListing.update({
    where: { id: listingId },
    data: { status: ListingStatus.NEEDS_CHANGES },
  });

  return listing;
}

async function markReviewItemFixed(input: {
  listingId: string;
  sourceType: "field" | "photo" | "document";
  sourceKey: string;
  sellerId: string;
}) {
  if (input.sourceType === "field") {
    await prisma.listingFieldReview.updateMany({
      where: { listingId: input.listingId, fieldKey: input.sourceKey },
      data: {
        status: FieldReviewStatus.PENDING,
        rejectionReason: null,
        rejectionPreset: null,
        reviewedAt: null,
        reviewedById: null,
      },
    });
  }

  await prisma.listingReviewTask.updateMany({
    where: {
      listingId: input.listingId,
      sourceType: input.sourceType,
      sourceKey: input.sourceKey,
      status: ReviewTaskStatus.WAITING_ON_SELLER,
    },
    data: {
      status: ReviewTaskStatus.WAITING_ON_ADMIN,
    },
  });
}

async function maybeSubmitSellerFixes(
  listingId: string,
  sellerId: string,
  registration: string,
): Promise<boolean> {
  const remaining = await prisma.listingReviewTask.count({
    where: {
      listingId,
      releasedToSeller: true,
      blockingPublication: true,
      status: ReviewTaskStatus.WAITING_ON_SELLER,
    },
  });

  if (remaining > 0) {
    return false;
  }

  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });
  if (!listing) {
    return false;
  }

  const status = listing.status as ListingStatus;
  if (status !== ListingStatus.NEEDS_CHANGES && status !== ListingStatus.DRAFT) {
    return false;
  }

  const fromStatus =
    status === ListingStatus.NEEDS_CHANGES
      ? ListingStatus.NEEDS_CHANGES
      : ListingStatus.DRAFT;

  await prisma.$transaction(async (tx) => {
    await tx.aircraftListing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.SUBMITTED,
        intakeReviewFinalizedAt: null,
      },
    });

    await tx.listingStatusHistory.create({
      data: {
        listingId,
        fromStatus,
        toStatus: ListingStatus.SUBMITTED,
        changedById: sellerId,
        reason: "Seller submitted fixes for AVIATONLY re-review.",
      },
    });

    await tx.listingEvent.create({
      data: {
        listingId,
        actorId: sellerId,
        type: "SELLER_SUBMITTED_LISTING",
        message: `${registration} fixes submitted — AVIATONLY will re-review only the updated items.`,
      },
    });
  });

  return true;
}

export async function sellerFixListingFieldRecord(input: {
  listingId: string;
  fieldKey: string;
  value: string;
  sellerId: string;
}): Promise<SellerFixResult> {
  const listing = await assertSellerCanFix(input.listingId, input.sellerId, {
    sourceType: "field",
    sourceKey: input.fieldKey,
  });
  const value = input.value.trim();
  if (!value) {
    return { ok: false, error: "Enter a value before saving." };
  }

  switch (input.fieldKey) {
    case "last-mpi": {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return { ok: false, error: "Enter a valid MPI date." };
      }
      await prisma.aircraftMaintenance.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, lastMpiDate: date },
        update: { lastMpiDate: date },
      });
      break;
    }
    case "maintenance-status":
      await prisma.aircraftMaintenance.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, status: value },
        update: { status: value },
      });
      break;
    case "maintenance-notes":
      await prisma.aircraftMaintenance.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, notes: value },
        update: { notes: value },
      });
      break;
    case "damage-history":
      await prisma.aircraftAirframe.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, damageHistory: value },
        update: { damageHistory: value },
      });
      break;
    case "ttaf": {
      const hours = Number(value);
      if (!Number.isFinite(hours) || hours < 0) {
        return { ok: false, error: "Enter valid airframe hours." };
      }
      await prisma.aircraftAirframe.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, totalTimeAirframe: hours },
        update: { totalTimeAirframe: hours },
      });
      break;
    }
    case "location": {
      const [airfield, province] = value.split("|").map((part) => part.trim());
      if (!airfield || !province) {
        return { ok: false, error: "Enter both airfield and province." };
      }
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { airfield, province },
      });
      break;
    }
    case "registration":
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { registration: value.toUpperCase() },
      });
      break;
    case "registration-type":
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { registrationType: value.toUpperCase() as "ZS" | "ZU" },
      });
      break;
    case "make":
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { make: value },
      });
      break;
    case "model":
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { model: value },
      });
      break;
    case "year": {
      const year = Number.parseInt(value, 10);
      if (!Number.isFinite(year)) {
        return { ok: false, error: "Enter a valid year." };
      }
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { year },
      });
      break;
    }
    case "category":
      await prisma.aircraftListing.update({
        where: { id: input.listingId },
        data: { category: value },
      });
      break;
    case "avionics":
      await prisma.aircraftAvionics.upsert({
        where: { listingId: input.listingId },
        create: { listingId: input.listingId, equipment: value.split(",").map((s) => s.trim()).filter(Boolean) },
        update: { equipment: value.split(",").map((s) => s.trim()).filter(Boolean) },
      });
      break;
    case "engine": {
      const [makeModel = "", hoursStr = "", tsoStr = ""] = value
        .split("|")
        .map((part) => part.trim());
      if (!makeModel) {
        return { ok: false, error: "Enter engine make and model." };
      }
      const engineHours = hoursStr ? Number(hoursStr) : null;
      const tso = tsoStr ? Number(tsoStr) : null;
      if (engineHours != null && (!Number.isFinite(engineHours) || engineHours < 0)) {
        return { ok: false, error: "Enter valid engine hours." };
      }
      if (tso != null && (!Number.isFinite(tso) || tso < 0)) {
        return { ok: false, error: "Enter valid time since overhaul." };
      }
      await prisma.aircraftEngine.deleteMany({ where: { listingId: input.listingId } });
      await prisma.aircraftEngine.create({
        data: {
          listingId: input.listingId,
          position: EnginePosition.SINGLE,
          model: makeModel,
          engineHours,
          timeSinceOverhaul: tso,
        },
      });
      break;
    }
    case "propeller": {
      const [makeModel = "", hoursStr = ""] = value.split("|").map((part) => part.trim());
      if (!makeModel) {
        return { ok: false, error: "Enter propeller make and model." };
      }
      const propellerHours = hoursStr ? Number(hoursStr) : null;
      if (propellerHours != null && (!Number.isFinite(propellerHours) || propellerHours < 0)) {
        return { ok: false, error: "Enter valid propeller hours." };
      }
      await prisma.aircraftPropeller.deleteMany({ where: { listingId: input.listingId } });
      await prisma.aircraftPropeller.create({
        data: {
          listingId: input.listingId,
          model: makeModel,
          propellerHours,
        },
      });
      break;
    }
    default:
      return { ok: false, error: "This field cannot be fixed here yet." };
  }

  await markReviewItemFixed({
    listingId: input.listingId,
    sourceType: "field",
    sourceKey: input.fieldKey,
    sellerId: input.sellerId,
  });

  const allFixesSubmitted = await maybeSubmitSellerFixes(
    input.listingId,
    input.sellerId,
    listing.registration,
  );

  return { ok: true, listingId: input.listingId, allFixesSubmitted };
}

export async function sellerFixListingPhotoRecord(input: {
  listingId: string;
  photoId: string;
  fileName: string;
  sellerId: string;
}): Promise<SellerFixResult> {
  const listing = await assertSellerCanFix(input.listingId, input.sellerId, {
    sourceType: "photo",
    sourceKey: input.photoId,
  });
  const fileName = input.fileName.trim();
  if (!fileName) {
    return { ok: false, error: "Choose a replacement photo to upload." };
  }

  const photo = await prisma.aircraftPhoto.findFirst({
    where: { id: input.photoId, listingId: input.listingId },
  });
  if (!photo) {
    return { ok: false, error: "Photo not found." };
  }

  await prisma.aircraftPhoto.update({
    where: { id: input.photoId },
    data: {
      fileName,
      status: PhotoStatus.READY,
      rejectionReason: null,
      reviewedAt: null,
      reviewedById: null,
    },
  });

  await markReviewItemFixed({
    listingId: input.listingId,
    sourceType: "photo",
    sourceKey: input.photoId,
    sellerId: input.sellerId,
  });

  const allFixesSubmitted = await maybeSubmitSellerFixes(
    input.listingId,
    input.sellerId,
    listing.registration,
  );

  return { ok: true, listingId: input.listingId, allFixesSubmitted };
}

export async function sellerFixListingDocumentRecord(input: {
  listingId: string;
  documentId: string;
  fileName: string;
  sellerId: string;
}): Promise<SellerFixResult> {
  const listing = await assertSellerCanFix(input.listingId, input.sellerId, {
    sourceType: "document",
    sourceKey: input.documentId,
  });
  const fileName = input.fileName.trim();
  if (!fileName) {
    return { ok: false, error: "Choose a replacement document to upload." };
  }

  const document = await prisma.aircraftDocument.findFirst({
    where: { id: input.documentId, listingId: input.listingId },
  });
  if (!document) {
    return { ok: false, error: "Document not found." };
  }

  await prisma.aircraftDocument.update({
    where: { id: input.documentId },
    data: {
      fileName,
      reviewStatus: DocumentStatus.UPLOADED,
      rejectionReason: null,
      reviewedAt: null,
      reviewedById: null,
    },
  });

  await markReviewItemFixed({
    listingId: input.listingId,
    sourceType: "document",
    sourceKey: input.documentId,
    sellerId: input.sellerId,
  });

  const allFixesSubmitted = await maybeSubmitSellerFixes(
    input.listingId,
    input.sellerId,
    listing.registration,
  );

  return { ok: true, listingId: input.listingId, allFixesSubmitted };
}
