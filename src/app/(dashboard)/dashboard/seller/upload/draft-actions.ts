"use server";

import { Prisma } from "@prisma/client";
import { INTAKE_STEPS } from "@/lib/aviatonly/domain";
import { getListingIntakePrefill, getListingUploadPrefill } from "./actions";
import { loadGuidedPhotosForListing, type GuidedPhotoPrefill } from "./photo-actions";
import { SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export interface SaveDraftInput {
  draftId: string | null;
  data: Record<string, unknown>;
  step: number;
  listingId?: string | null;
}

export interface DraftPayload {
  data: Record<string, unknown>;
  step: number;
}

export interface IntakeWizardLoadedState {
  draftId: string | null;
  listingId: string | null;
  step: number;
  formData: Record<string, unknown> | null;
  photos: Record<string, GuidedPhotoPrefill>;
  documents: Record<string, { name: string; sizeLabel: string }>;
  updatedAt: string | null;
  source: "draft" | "listing" | "empty";
}

/** JSON-safe clone so values like Date are stored as ISO strings in the Json column. */
function toJson(data: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

function readListingIdFromData(data: Record<string, unknown>): string | null {
  return typeof data.listingId === "string" && data.listingId.length > 0 ? data.listingId : null;
}

async function loadListingUploads(listingId: string) {
  const [uploads, photos] = await Promise.all([
    getListingUploadPrefill(listingId),
    loadGuidedPhotosForListing(listingId).catch(() => ({})),
  ]);

  return { photos, documents: uploads.documents };
}

async function findSellerDraft(sellerId: string, listingId?: string | null) {
  if (listingId) {
    return prisma.listingDraft.findFirst({
      where: { sellerId, listingId },
      orderBy: { updatedAt: "desc" },
    });
  }

  return prisma.listingDraft.findFirst({
    where: { sellerId, listingId: null },
    orderBy: { updatedAt: "desc" },
  });
}

export async function saveDraft({
  draftId,
  data,
  step,
  listingId: linkedListingId,
}: SaveDraftInput): Promise<{ id: string }> {
  const session = await requireAnyRole(SELLER_ROLES);
  const sellerId = session.user.id;
  const json = toJson(data);
  const listingId = linkedListingId ?? readListingIdFromData(data);

  if (listingId) {
    const ownedListing = await prisma.aircraftListing.findFirst({
      where: { id: listingId, sellerId },
      select: { id: true },
    });
    if (!ownedListing) {
      throw new Error("Listing not found or you do not have access.");
    }
  }

  if (draftId) {
    const owned = await prisma.listingDraft.findFirst({
      where: { id: draftId, sellerId },
      select: { id: true },
    });

    if (owned) {
      const updated = await prisma.listingDraft.update({
        where: { id: owned.id },
        data: {
          data: json,
          step,
          listingId: listingId ?? null,
        },
        select: { id: true },
      });
      return { id: updated.id };
    }
  }

  if (listingId) {
    const existingForListing = await prisma.listingDraft.findFirst({
      where: { sellerId, listingId },
      select: { id: true },
    });

    if (existingForListing) {
      const updated = await prisma.listingDraft.update({
        where: { id: existingForListing.id },
        data: { data: json, step },
        select: { id: true },
      });
      return { id: updated.id };
    }
  } else {
    const existingOpen = await prisma.listingDraft.findFirst({
      where: { sellerId, listingId: null },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    if (existingOpen) {
      const updated = await prisma.listingDraft.update({
        where: { id: existingOpen.id },
        data: { data: json, step },
        select: { id: true },
      });
      return { id: updated.id };
    }
  }

  const created = await prisma.listingDraft.create({
    data: {
      sellerId,
      listingId: listingId ?? null,
      data: json,
      step,
    },
    select: { id: true },
  });

  return { id: created.id };
}

export async function loadDraft(draftId: string): Promise<DraftPayload | null> {
  const session = await requireAnyRole(SELLER_ROLES);

  const draft = await prisma.listingDraft.findFirst({
    where: { id: draftId, sellerId: session.user.id },
    select: { data: true, step: true },
  });

  if (!draft) return null;

  return {
    data: (draft.data as Record<string, unknown>) ?? {},
    step: draft.step,
  };
}

export async function deleteDraft(draftId: string): Promise<void> {
  const session = await requireAnyRole(SELLER_ROLES);

  try {
    await prisma.listingDraft.deleteMany({
      where: { id: draftId, sellerId: session.user.id },
    });
  } catch {
    // Already deleted — nothing to do.
  }
}

export async function loadIntakeWizardState(input: {
  listingId?: string | null;
  initialStep?: number;
  preferListing?: boolean;
}): Promise<IntakeWizardLoadedState> {
  const session = await requireAnyRole(SELLER_ROLES);
  const sellerId = session.user.id;
  const urlListingId = input.listingId ?? null;
  const empty: IntakeWizardLoadedState = {
    draftId: null,
    listingId: urlListingId,
    step: input.initialStep ?? 0,
    formData: null,
    photos: {},
    documents: {},
    updatedAt: null,
    source: "empty",
  };

  if (!input.preferListing) {
    const draft = await findSellerDraft(sellerId, urlListingId);

    if (draft) {
      const draftData = (draft.data as Record<string, unknown>) ?? {};
      const draftListingId =
        urlListingId ?? draft.listingId ?? readListingIdFromData(draftData);

      if (!urlListingId || draftListingId === urlListingId) {
        const uploads = draftListingId ? await loadListingUploads(draftListingId) : null;

        return {
          draftId: draft.id,
          listingId: draftListingId,
          step: Math.min(Math.max(draft.step, 0), INTAKE_STEPS.length - 1),
          formData: draftData,
          photos: uploads?.photos ?? {},
          documents: uploads?.documents ?? {},
          updatedAt: draft.updatedAt.toISOString(),
          source: "draft",
        };
      }
    }
  }

  if (!urlListingId) {
    return empty;
  }

  const prefill = await getListingIntakePrefill(urlListingId);
  if (!prefill) {
    return empty;
  }

  const uploads = await loadListingUploads(urlListingId);
  const targetStep =
    input.initialStep != null && input.initialStep >= 0 && input.initialStep < INTAKE_STEPS.length
      ? input.initialStep
      : 0;

  return {
    draftId: null,
    listingId: urlListingId,
    step: targetStep,
    formData: prefill as Record<string, unknown>,
    photos: uploads.photos,
    documents: uploads.documents,
    updatedAt: null,
    source: "listing",
  };
}
