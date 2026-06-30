import {
  DocumentStatus,
  FieldReviewStatus,
  ListingStatus,
  PhotoStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import { getGuidedPhotoSlotLabel } from "@/lib/upload/photo-slot-keys";
import { formatReviewTasksReleasedMessage } from "@/lib/aviatonly/domain/listing-event-tasks";
import { AIRCRAFT_DATA_FIELD_KEYS } from "@/lib/aviatonly/domain/listing-aircraft-data-rows";
import { resolveRejectionReason } from "@/lib/aviatonly/domain/intake-rejection-presets";
import {
  documentReviewState,
  fieldReviewState,
  photoReviewState,
  type RowReviewState,
} from "@/lib/aviatonly/domain/listing-intake-review-utils";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { transitionListingForwardRecord } from "@/lib/aviatonly/server/listing-review";
import { prisma } from "@/lib/prisma";

const PENDING_PHOTO_STATUSES: PhotoStatus[] = [
  PhotoStatus.EMPTY,
  PhotoStatus.UPLOADING,
  PhotoStatus.UPLOADED,
  PhotoStatus.PROCESSING,
  PhotoStatus.READY,
];

const PENDING_DOCUMENT_STATUSES: DocumentStatus[] = [
  DocumentStatus.MISSING,
  DocumentStatus.UPLOADED,
  DocumentStatus.UNDER_REVIEW,
];

export type { RowReviewState };

export interface IntakeReviewProgress {
  total: number;
  reviewed: number;
  approved: number;
  rejected: number;
  pending: number;
  isComplete: boolean;
  isFinalized: boolean;
  tasksReleased: boolean;
  canEdit: boolean;
  hasDraftTasks: boolean;
}

export type IntakeFinalizeResult =
  | { finalized: false; progress: IntakeReviewProgress }
  | { finalized: true; allApproved: true; progress: IntakeReviewProgress }
  | { finalized: true; allApproved: false; draftTaskCount: number; progress: IntakeReviewProgress };

export async function getIntakeReviewProgress(
  listingId: string,
): Promise<IntakeReviewProgress> {
  const [listing, fieldReviews, photos, documents] = await Promise.all([
    prisma.aircraftListing.findUnique({
      where: { id: listingId },
      select: {
        intakeReviewFinalizedAt: true,
        intakeReviewTasksReleasedAt: true,
        reviewTasks: {
          where: { releasedToSeller: false },
          select: { id: true },
        },
      },
    }),
    prisma.listingFieldReview.findMany({
      where: { listingId },
      select: { fieldKey: true, status: true },
    }),
    prisma.aircraftPhoto.findMany({
      where: { listingId },
      select: { status: true },
    }),
    prisma.aircraftDocument.findMany({
      where: { listingId },
      select: { reviewStatus: true },
    }),
  ]);

  if (!listing) {
    throw new NotFoundError("Listing not found.");
  }

  const fieldReviewMap = new Map(fieldReviews.map((r) => [r.fieldKey, r.status]));

  let reviewed = 0;
  let approved = 0;
  let rejected = 0;

  for (const key of AIRCRAFT_DATA_FIELD_KEYS) {
    const state = fieldReviewState(fieldReviewMap.get(key) ?? FieldReviewStatus.PENDING);
    if (state !== "pending") reviewed += 1;
    if (state === "approved") approved += 1;
    if (state === "rejected") rejected += 1;
  }

  for (const photo of photos) {
    const state = photoReviewState(photo.status as PhotoStatus);
    if (state !== "pending") reviewed += 1;
    if (state === "approved") approved += 1;
    if (state === "rejected") rejected += 1;
  }

  for (const doc of documents) {
    const state = documentReviewState(doc.reviewStatus as DocumentStatus);
    if (state !== "pending") reviewed += 1;
    if (state === "approved") approved += 1;
    if (state === "rejected") rejected += 1;
  }

  const total = AIRCRAFT_DATA_FIELD_KEYS.length + photos.length + documents.length;
  const tasksReleased = Boolean(listing.intakeReviewTasksReleasedAt);
  const isFinalized = Boolean(listing.intakeReviewFinalizedAt);

  return {
    total,
    reviewed,
    approved,
    rejected,
    pending: total - reviewed,
    isComplete: total > 0 && reviewed === total,
    isFinalized,
    tasksReleased,
    canEdit: !tasksReleased,
    hasDraftTasks: listing.reviewTasks.length > 0,
  };
}

async function ensureUnderReview(listingId: string, actorId: string) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: { status: true },
  });
  if (!listing) throw new NotFoundError("Listing not found.");

  if (listing.status === ListingStatus.SUBMITTED) {
    await transitionListingForwardRecord({
      listingId,
      toStatus: ListingStatus.UNDER_REVIEW,
      actorId,
      reason: "Admin started intake data review.",
      eventType: "ADMIN_STARTED_REVIEW",
      eventMessage: "AVIATONLY started reviewing submitted intake data.",
    });
  }
}

async function clearUnreleasedDraftTasks(listingId: string) {
  await prisma.listingReviewTask.deleteMany({
    where: { listingId, releasedToSeller: false },
  });
  await prisma.aircraftListing.update({
    where: { id: listingId },
    data: { intakeReviewFinalizedAt: null },
  });
}

export async function reviewListingFieldRecord(input: {
  listingId: string;
  fieldKey: string;
  label: string;
  approved: boolean;
  actorId: string;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<IntakeFinalizeResult> {
  if (!input.approved) {
    const reason = resolveRejectionReason(input.rejectionPreset, input.rejectionReason);
    if (!reason) {
      throw new Error("A rejection reason or preset is required.");
    }
  }

  await ensureUnderReview(input.listingId, input.actorId);

  if (input.approved) {
    await prisma.listingFieldReview.upsert({
      where: {
        listingId_fieldKey: {
          listingId: input.listingId,
          fieldKey: input.fieldKey,
        },
      },
      create: {
        listingId: input.listingId,
        fieldKey: input.fieldKey,
        label: input.label,
        status: FieldReviewStatus.APPROVED,
        reviewedById: input.actorId,
        reviewedAt: new Date(),
      },
      update: {
        label: input.label,
        status: FieldReviewStatus.APPROVED,
        rejectionReason: null,
        rejectionPreset: null,
        reviewedById: input.actorId,
        reviewedAt: new Date(),
      },
    });
  } else {
    const reason = resolveRejectionReason(input.rejectionPreset, input.rejectionReason);
    await prisma.listingFieldReview.upsert({
      where: {
        listingId_fieldKey: {
          listingId: input.listingId,
          fieldKey: input.fieldKey,
        },
      },
      create: {
        listingId: input.listingId,
        fieldKey: input.fieldKey,
        label: input.label,
        status: FieldReviewStatus.REJECTED,
        rejectionReason: reason,
        rejectionPreset: input.rejectionPreset ?? null,
        reviewedById: input.actorId,
        reviewedAt: new Date(),
      },
      update: {
        label: input.label,
        status: FieldReviewStatus.REJECTED,
        rejectionReason: reason,
        rejectionPreset: input.rejectionPreset ?? null,
        reviewedById: input.actorId,
        reviewedAt: new Date(),
      },
    });
  }

  await clearUnreleasedDraftTasks(input.listingId);
  return tryFinalizeIntakeReview(input.listingId, input.actorId);
}

export async function reviewListingPhotoRecord(input: {
  photoId: string;
  listingId: string;
  approved: boolean;
  actorId: string;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<IntakeFinalizeResult> {
  const photo = await prisma.aircraftPhoto.findFirst({
    where: { id: input.photoId, listingId: input.listingId },
  });
  if (!photo) throw new NotFoundError("Photo not found.");

  if (!input.approved) {
    const reason = resolveRejectionReason(input.rejectionPreset, input.rejectionReason);
    if (!reason) throw new Error("A rejection reason or preset is required.");
  }

  await ensureUnderReview(input.listingId, input.actorId);

  await prisma.aircraftPhoto.update({
    where: { id: input.photoId },
    data: input.approved
      ? {
          status: PhotoStatus.APPROVED,
          rejectionReason: null,
          reviewedById: input.actorId,
          reviewedAt: new Date(),
        }
      : {
          status: PhotoStatus.REJECTED,
          rejectionReason: resolveRejectionReason(
            input.rejectionPreset,
            input.rejectionReason,
          ),
          reviewedById: input.actorId,
          reviewedAt: new Date(),
        },
  });

  await clearUnreleasedDraftTasks(input.listingId);
  return tryFinalizeIntakeReview(input.listingId, input.actorId);
}

export async function reviewListingDocumentRecord(input: {
  documentId: string;
  listingId: string;
  approved: boolean;
  actorId: string;
  rejectionPreset?: string;
  rejectionReason?: string;
}): Promise<IntakeFinalizeResult> {
  const doc = await prisma.aircraftDocument.findFirst({
    where: { id: input.documentId, listingId: input.listingId },
  });
  if (!doc) throw new NotFoundError("Document not found.");

  if (!input.approved) {
    const reason = resolveRejectionReason(input.rejectionPreset, input.rejectionReason);
    if (!reason) throw new Error("A rejection reason or preset is required.");
  }

  await ensureUnderReview(input.listingId, input.actorId);

  await prisma.aircraftDocument.update({
    where: { id: input.documentId },
    data: input.approved
      ? {
          reviewStatus: DocumentStatus.ACCEPTED,
          rejectionReason: null,
          reviewedById: input.actorId,
          reviewedAt: new Date(),
        }
      : {
          reviewStatus: DocumentStatus.REJECTED,
          rejectionReason: resolveRejectionReason(
            input.rejectionPreset,
            input.rejectionReason,
          ),
          reviewedById: input.actorId,
          reviewedAt: new Date(),
        },
  });

  await clearUnreleasedDraftTasks(input.listingId);
  return tryFinalizeIntakeReview(input.listingId, input.actorId);
}

interface RejectionItem {
  sourceType: "field" | "photo" | "document";
  sourceKey: string;
  title: string;
  description: string;
}

async function collectRejections(listingId: string): Promise<RejectionItem[]> {
  const [fieldReviews, photos, documents] = await Promise.all([
    prisma.listingFieldReview.findMany({
      where: { listingId, status: FieldReviewStatus.REJECTED },
      select: { fieldKey: true, label: true, rejectionReason: true },
    }),
    prisma.aircraftPhoto.findMany({
      where: {
        listingId,
        status: { in: [PhotoStatus.REJECTED, PhotoStatus.NEEDS_REPLACEMENT] },
      },
      select: { id: true, slotKey: true, rejectionReason: true },
    }),
    prisma.aircraftDocument.findMany({
      where: {
        listingId,
        reviewStatus: {
          in: [
            DocumentStatus.REJECTED,
            DocumentStatus.NEEDS_REPLACEMENT,
            DocumentStatus.EXPIRED,
          ],
        },
      },
      select: { id: true, documentType: true, rejectionReason: true },
    }),
  ]);

  const rejections: RejectionItem[] = [];

  for (const review of fieldReviews) {
    if (review.rejectionReason) {
      rejections.push({
        sourceType: "field",
        sourceKey: review.fieldKey,
        title: `Fix ${review.label.toLowerCase()}`,
        description: review.rejectionReason,
      });
    }
  }

  for (const photo of photos) {
    if (photo.rejectionReason) {
      rejections.push({
        sourceType: "photo",
        sourceKey: photo.id,
        title: `Replace photo: ${getGuidedPhotoSlotLabel(photo.slotKey)}`,
        description: photo.rejectionReason,
      });
    }
  }

  for (const doc of documents) {
    if (doc.rejectionReason) {
      rejections.push({
        sourceType: "document",
        sourceKey: doc.id,
        title: `Fix document: ${doc.documentType.replace(/-/g, " ")}`,
        description: doc.rejectionReason,
      });
    }
  }

  return rejections;
}

export async function tryFinalizeIntakeReview(
  listingId: string,
  actorId: string,
): Promise<IntakeFinalizeResult> {
  const progress = await getIntakeReviewProgress(listingId);
  if (!progress.isComplete || !progress.canEdit) {
    return { finalized: false, progress };
  }

  const rejections = await collectRejections(listingId);

  if (rejections.length === 0) {
    await prisma.aircraftListing.update({
      where: { id: listingId },
      data: { intakeReviewFinalizedAt: new Date() },
    });

    const listing = await prisma.aircraftListing.findUnique({
      where: { id: listingId },
      select: { status: true },
    });

    if (listing?.status === ListingStatus.UNDER_REVIEW) {
      await transitionListingForwardRecord({
        listingId,
        toStatus: ListingStatus.VALUATION_READY,
        actorId,
        reason: "All intake data approved.",
        eventType: "VALUATION_ADDED",
        eventMessage: "All intake rows approved — valuation step unlocked.",
      });
    }

    return {
      finalized: true,
      allApproved: true,
      progress: await getIntakeReviewProgress(listingId),
    };
  }

  await prisma.listingReviewTask.deleteMany({
    where: { listingId, releasedToSeller: false },
  });

  await prisma.listingReviewTask.createMany({
    data: rejections.map((item) => ({
      listingId,
      title: item.title,
      description: item.description,
      status: ReviewTaskStatus.OPEN,
      blockingPublication: true,
      releasedToSeller: false,
      sourceType: item.sourceType,
      sourceKey: item.sourceKey,
      createdById: actorId,
      assignedRole: "SELLER",
    })),
  });

  await prisma.aircraftListing.update({
    where: { id: listingId },
    data: { intakeReviewFinalizedAt: new Date() },
  });

  return {
    finalized: true,
    allApproved: false,
    draftTaskCount: rejections.length,
    progress: await getIntakeReviewProgress(listingId),
  };
}

export async function releaseIntakeReviewTasksRecord(listingId: string, actorId: string) {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    include: {
      reviewTasks: { where: { releasedToSeller: false } },
    },
  });

  if (!listing) throw new NotFoundError("Listing not found.");
  if (!listing.intakeReviewFinalizedAt) {
    throw new Error("Complete intake review on all rows before sending tasks to the seller.");
  }
  if (listing.reviewTasks.length === 0) {
    throw new Error("No draft review tasks to release.");
  }
  if (listing.intakeReviewTasksReleasedAt) {
    throw new Error("Review tasks were already sent to the seller.");
  }

  await prisma.$transaction(async (tx) => {
    const releasedTasks = listing.reviewTasks;

    const photoIds = releasedTasks
      .filter((task) => task.sourceType === "photo" && task.sourceKey)
      .map((task) => task.sourceKey as string);
    const documentIds = releasedTasks
      .filter((task) => task.sourceType === "document" && task.sourceKey)
      .map((task) => task.sourceKey as string);

    if (photoIds.length > 0) {
      await tx.aircraftPhoto.updateMany({
        where: {
          listingId,
          id: { in: photoIds },
          status: { in: [PhotoStatus.REJECTED, PhotoStatus.READY, PhotoStatus.APPROVED] },
        },
        data: { status: PhotoStatus.NEEDS_REPLACEMENT },
      });
    }

    if (documentIds.length > 0) {
      await tx.aircraftDocument.updateMany({
        where: {
          listingId,
          id: { in: documentIds },
          reviewStatus: {
            in: [
              DocumentStatus.REJECTED,
              DocumentStatus.UPLOADED,
              DocumentStatus.UNDER_REVIEW,
              DocumentStatus.ACCEPTED,
            ],
          },
        },
        data: { reviewStatus: DocumentStatus.NEEDS_REPLACEMENT },
      });
    }

    await tx.listingReviewTask.updateMany({
      where: { listingId, releasedToSeller: false },
      data: {
        releasedToSeller: true,
        status: ReviewTaskStatus.WAITING_ON_SELLER,
      },
    });

    await tx.aircraftListing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.NEEDS_CHANGES,
        intakeReviewTasksReleasedAt: new Date(),
      },
    });

    const taskSummaries = releasedTasks.map((task) => ({
      title: task.title,
      description: task.description,
    }));

    await tx.listingStatusHistory.create({
      data: {
        listingId,
        fromStatus: listing.status,
        toStatus: ListingStatus.NEEDS_CHANGES,
        changedById: actorId,
        reason: "Admin released intake review tasks to seller.",
      },
    });

    await tx.listingEvent.create({
      data: {
        listingId,
        actorId,
        type: "ADMIN_REQUESTED_CHANGES",
        message: formatReviewTasksReleasedMessage(taskSummaries),
        metadata: {
          tasks: taskSummaries,
          taskIds: releasedTasks.map((task) => task.id),
        },
      },
    });
  });

  return getIntakeReviewProgress(listingId);
}

export {
  photoReviewState,
  documentReviewState,
  fieldReviewState,
  PENDING_PHOTO_STATUSES,
  PENDING_DOCUMENT_STATUSES,
};
