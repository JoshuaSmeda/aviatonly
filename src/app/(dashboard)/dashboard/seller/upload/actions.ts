"use server";

import {
  DocumentStatus,
  DocumentVisibility,
  EnginePosition,
  ListingStatus,
  PhotoStatus,
} from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import { computeCompleteness } from "@/lib/completeness";
import {
  aircraftSchema,
  type AircraftFormValues,
} from "@/components/dashboard/seller/upload/schema";
import { z } from "zod";
import { requireAnyRole } from "@/lib/auth/session";
import { SELLER_ROLES } from "@/lib/auth/roles";
import {
  buildIntakeFixContext,
  type IntakeFixContext,
} from "@/lib/aviatonly/domain/intake-fix-mode";

export interface UploadMeta {
  slot: string;
  fileName: string;
  storageKey?: string;
  photoId?: string;
}

export type SubmitListingResult =
  | { ok: true; id: string; registration: string; status: string }
  | { ok: false; error: string; field?: "registration" };

export type SaveDraftListingResult =
  | { ok: true; id: string; registration: string }
  | { ok: false; error: string; field?: keyof AircraftFormValues };

function buildChildFlags(v: AircraftFormValues) {
  return {
    hasEngine: Boolean(v.engineMakeModel) || v.engineHours != null || v.tso != null,
    hasPropeller: Boolean(v.propellerMakeModel) || v.propellerHours != null,
    hasAvionics: Boolean(v.avionicsEquipment?.length) || Boolean(v.avionics?.trim()),
    hasMaintenance: Boolean(v.maintenanceStatus) || v.lastMpiDate != null,
  };
}

function listingCoreFields(v: AircraftFormValues, sellerId: string, completenessScore: number, status: ListingStatus) {
  return {
    registration: v.registration.toUpperCase(),
    registrationType: v.registrationType,
    make: v.make,
    model: v.model,
    year: v.year,
    category: v.category,
    airfield: v.airfield?.trim() || "Pending",
    province: v.province?.trim() || "Pending",
    ownerName: v.ownerName || null,
    sellerRole: v.sellerRole || null,
    authorisedToSell: v.authorisedToSell ?? null,
    saleType: v.saleType,
    valuationEstimate: v.valuationEstimate ?? null,
    askingPrice: v.askingPrice ?? null,
    reservePrice: v.reservePrice ?? null,
    startingBid: v.startingBid ?? null,
    bidIncrement: v.bidIncrement ?? null,
    status,
    completenessScore,
    sellerId,
  };
}

async function syncListingChildren(
  listingId: string,
  v: AircraftFormValues,
  photos: UploadMeta[],
  documents: UploadMeta[],
) {
  const { hasEngine, hasPropeller, hasAvionics, hasMaintenance } = buildChildFlags(v);

  await prisma.aircraftAirframe.upsert({
    where: { listingId },
    create: {
      listingId,
      totalTimeAirframe: v.ttaf ?? null,
      damageHistory: v.knownDefects || null,
    },
    update: {
      totalTimeAirframe: v.ttaf ?? null,
      damageHistory: v.knownDefects || null,
    },
  });

  await prisma.aircraftEngine.deleteMany({ where: { listingId } });
  if (hasEngine) {
    await prisma.aircraftEngine.create({
      data: {
        listingId,
        position: EnginePosition.SINGLE,
        model: v.engineMakeModel || null,
        engineHours: v.engineHours ?? null,
        timeSinceOverhaul: v.tso ?? null,
      },
    });
  }

  await prisma.aircraftPropeller.deleteMany({ where: { listingId } });
  if (hasPropeller) {
    await prisma.aircraftPropeller.create({
      data: {
        listingId,
        model: v.propellerMakeModel || null,
        propellerHours: v.propellerHours ?? null,
      },
    });
  }

  if (hasAvionics) {
    await prisma.aircraftAvionics.upsert({
      where: { listingId },
      create: {
        listingId,
        equipment: v.avionicsEquipment ?? [],
        summary: v.avionics || null,
      },
      update: {
        equipment: v.avionicsEquipment ?? [],
        summary: v.avionics || null,
      },
    });
  } else {
    await prisma.aircraftAvionics.deleteMany({ where: { listingId } });
  }

  if (hasMaintenance) {
    await prisma.aircraftMaintenance.upsert({
      where: { listingId },
      create: {
        listingId,
        status: v.maintenanceStatus || null,
        lastMpiDate: v.lastMpiDate ?? null,
      },
      update: {
        status: v.maintenanceStatus || null,
        lastMpiDate: v.lastMpiDate ?? null,
      },
    });
  } else {
    await prisma.aircraftMaintenance.deleteMany({ where: { listingId } });
  }

  if (photos.length) {
    for (const photo of photos) {
      const existing = await prisma.aircraftPhoto.findFirst({
        where: { listingId, slotKey: photo.slot },
        select: { id: true, storageKey: true },
      });

      if (existing?.storageKey && !existing.storageKey.startsWith("local/")) {
        continue;
      }

      if (existing) {
        await prisma.aircraftPhoto.update({
          where: { id: existing.id },
          data: {
            fileName: photo.fileName,
            storageKey: photo.storageKey ?? existing.storageKey,
            status: PhotoStatus.UPLOADED,
          },
        });
      } else {
        await prisma.aircraftPhoto.create({
          data: {
            listingId,
            slotKey: photo.slot,
            fileName: photo.fileName,
            storageKey: photo.storageKey ?? null,
            status: PhotoStatus.UPLOADED,
          },
        });
      }
    }
  }

  if (documents.length) {
    await prisma.aircraftDocument.deleteMany({ where: { listingId } });
    await prisma.aircraftDocument.createMany({
      data: documents.map((d) => ({
        listingId,
        documentType: d.slot,
        fileName: d.fileName,
        reviewStatus: DocumentStatus.UPLOADED,
        visibility: DocumentVisibility.PRIVATE_INTERNAL,
      })),
    });
  }
}

export async function getListingIntakePrefill(
  listingId: string,
): Promise<Partial<AircraftFormValues> | null> {
  const session = await requireAnyRole(SELLER_ROLES);
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    include: {
      airframe: true,
      engines: true,
      propellers: true,
      avionics: true,
      maintenance: true,
    },
  });

  if (!listing) return null;

  const engine = listing.engines[0];
  const propeller = listing.propellers[0];
  const engineMakeModel = engine?.model ?? "";

  return {
    registration: listing.registration,
    registrationType: listing.registrationType as AircraftFormValues["registrationType"],
    make: listing.make,
    model: listing.model,
    year: listing.year,
    category: listing.category,
    airfield: listing.airfield,
    province: listing.province,
    ownerName: listing.ownerName ?? "",
    sellerRole: listing.sellerRole ?? undefined,
    authorisedToSell: listing.authorisedToSell ?? false,
    saleType: listing.saleType as AircraftFormValues["saleType"],
    valuationEstimate: listing.valuationEstimate ?? undefined,
    askingPrice: listing.askingPrice ?? undefined,
    reservePrice: listing.reservePrice ?? undefined,
    startingBid: listing.startingBid ?? undefined,
    bidIncrement: listing.bidIncrement ?? undefined,
    ttaf: listing.airframe?.totalTimeAirframe ?? undefined,
    engineMakeModel,
    engineHours: engine?.engineHours ?? undefined,
    tso: engine?.timeSinceOverhaul ?? undefined,
    propellerMakeModel: propeller?.model ?? undefined,
    propellerHours: propeller?.propellerHours ?? undefined,
    avionicsEquipment: listing.avionics?.equipment ?? [],
    avionics: listing.avionics?.summary ?? "",
    maintenanceStatus: listing.maintenance?.status ?? undefined,
    lastMpiDate: listing.maintenance?.lastMpiDate ?? undefined,
    knownDefects: listing.maintenance?.notes ?? listing.airframe?.damageHistory ?? "",
  };
}

export async function getIntakeFixContext(
  listingId: string,
  params: {
    fix?: string;
    fixPhoto?: string;
    fixDocument?: string;
  },
): Promise<IntakeFixContext | null> {
  const session = await requireAnyRole(SELLER_ROLES);
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    select: { id: true },
  });
  if (!listing) return null;

  if (params.fix) {
    return buildIntakeFixContext({ fix: params.fix });
  }

  if (params.fixPhoto) {
    const photo = await prisma.aircraftPhoto.findFirst({
      where: { id: params.fixPhoto, listingId },
      select: { slotKey: true },
    });
    if (!photo) return null;
    return buildIntakeFixContext({
      fixPhoto: params.fixPhoto,
      fixPhotoSlot: photo.slotKey,
    });
  }

  if (params.fixDocument) {
    const document = await prisma.aircraftDocument.findFirst({
      where: { id: params.fixDocument, listingId },
      select: { documentType: true },
    });
    if (!document) return null;
    return buildIntakeFixContext({
      fixDocument: params.fixDocument,
      fixDocumentSlot: document.documentType,
    });
  }

  return null;
}

export async function getListingUploadPrefill(listingId: string): Promise<{
  photos: Record<string, { name: string; sizeLabel: string; photoId?: string; storageKey?: string }>;
  documents: Record<string, { name: string; sizeLabel: string }>;
}> {
  const session = await requireAnyRole(SELLER_ROLES);
  const listing = await prisma.aircraftListing.findFirst({
    where: { id: listingId, sellerId: session.user.id },
    select: {
      photos: {
        select: {
          id: true,
          slotKey: true,
          fileName: true,
          sizeBytes: true,
          storageKey: true,
        },
      },
      documents: { select: { documentType: true, fileName: true } },
    },
  });

  if (!listing) {
    return { photos: {}, documents: {} };
  }

  const photos: Record<string, { name: string; sizeLabel: string; photoId?: string; storageKey?: string }> = {};
  for (const photo of listing.photos) {
    photos[photo.slotKey] = {
      name: photo.fileName,
      sizeLabel: photo.sizeBytes ? `${Math.round(photo.sizeBytes / 1024)} KB` : "On file",
      photoId: photo.id,
      storageKey: photo.storageKey ?? undefined,
    };
  }

  const documents: Record<string, { name: string; sizeLabel: string }> = {};
  for (const doc of listing.documents) {
    documents[doc.documentType] = { name: doc.fileName, sizeLabel: "On file" };
  }

  return { photos, documents };
}

export async function saveDraftListingFromIntake(
  values: AircraftFormValues,
  photos: UploadMeta[] = [],
  documents: UploadMeta[] = [],
  listingId?: string | null,
): Promise<SaveDraftListingResult> {
  const session = await requireAnyRole(SELLER_ROLES);
  const sellerId = session.user.id;

  const identity = z
    .object({
      registration: z
        .string()
        .trim()
        .min(1)
        .regex(/^Z[SU]-[A-Z]{3}$/i, "Use SACAA format, e.g. ZS-ABC or ZU-XYZ."),
      registrationType: z.enum(["ZU", "ZS"]),
      make: z.string().trim().min(1),
      model: z.string().trim().min(1),
      year: z.number().int().min(1900),
      category: z.string().min(1),
    })
    .safeParse(values);

  if (!identity.success) {
    return {
      ok: false,
      error: "Enter registration, make, model, year, and category before saving to your listing workspace.",
      field: "registration",
    };
  }

  const data = values;
  const registration = data.registration.toUpperCase();
  const completeness = computeCompleteness({
    values: data,
    photoCount: photos.length,
    documentCount: documents.length,
  });

  const editableStatuses: ListingStatus[] = [ListingStatus.DRAFT, ListingStatus.NEEDS_CHANGES];

  try {
    let targetId = listingId ?? null;

    if (targetId) {
      const owned = await prisma.aircraftListing.findFirst({
        where: { id: targetId, sellerId },
        select: { id: true, status: true, registration: true },
      });
      if (!owned) {
        return { ok: false, error: "Listing not found or you don't have access." };
      }
      if (!editableStatuses.includes(owned.status as ListingStatus)) {
        return { ok: false, error: "This listing can no longer be edited in the intake wizard." };
      }
    }

    const byRegistration = await prisma.aircraftListing.findUnique({
      where: { registration },
      select: { id: true, sellerId: true, status: true },
    });

    if (byRegistration) {
      if (byRegistration.sellerId !== sellerId) {
        return {
          ok: false,
          error: `${registration} is already registered to another seller on AVIATONLY.`,
          field: "registration",
        };
      }
      if (!editableStatuses.includes(byRegistration.status as ListingStatus)) {
        return {
          ok: false,
          error: `${registration} is already in AVIATONLY review or live — open the listing workspace instead.`,
          field: "registration",
        };
      }
      targetId = byRegistration.id;
    }

    if (targetId) {
      const owned = await prisma.aircraftListing.findFirst({
        where: { id: targetId, sellerId },
        select: { id: true, status: true, registration: true },
      });
      const preserveStatus =
        owned?.status === ListingStatus.NEEDS_CHANGES
          ? ListingStatus.NEEDS_CHANGES
          : ListingStatus.DRAFT;

      await prisma.aircraftListing.update({
        where: { id: targetId },
        data: listingCoreFields(data, sellerId, completeness.score, preserveStatus),
      });
      await syncListingChildren(targetId, data, photos, documents);
      return { ok: true, id: targetId, registration };
    }

    const listing = await prisma.aircraftListing.create({
      data: {
        ...listingCoreFields(data, sellerId, completeness.score, ListingStatus.DRAFT),
        events: {
          create: {
            type: "INTAKE_DRAFT_SAVED",
            actorId: sellerId,
            message: `${registration} intake draft saved to listing workspace.`,
          },
        },
      },
      select: { id: true, registration: true },
    });

    await syncListingChildren(listing.id, data, photos, documents);

    return { ok: true, id: listing.id, registration: listing.registration };
  } catch (error) {
    console.error("saveDraftListingFromIntake failed", error);
    return { ok: false, error: "Could not save your listing draft. Please try again." };
  }
}

export async function submitAircraftListing(
  values: AircraftFormValues,
  photos: UploadMeta[] = [],
  documents: UploadMeta[] = [],
): Promise<SubmitListingResult> {
  const session = await requireAnyRole(SELLER_ROLES);
  const sellerId = session.user.id;

  // Re-validate on the server — never trust the client.
  const parsed = aircraftSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Some fields are invalid. Please review and try again." };
  }
  const v = parsed.data;
  const registration = v.registration.toUpperCase();

  const completeness = computeCompleteness({
    values: v,
    photoCount: photos.length,
    documentCount: documents.length,
  });

  const hasEngine = Boolean(v.engineMakeModel) || v.engineHours != null || v.tso != null;
  const hasPropeller = Boolean(v.propellerMakeModel) || v.propellerHours != null;
  const hasAvionics = Boolean(v.avionicsEquipment?.length) || Boolean(v.avionics?.trim());
  const hasMaintenance = Boolean(v.maintenanceStatus) || v.lastMpiDate != null;

  try {
    const existing = await prisma.aircraftListing.findUnique({
      where: { registration },
      select: { id: true, sellerId: true, status: true },
    });

    const editableStatuses: ListingStatus[] = [ListingStatus.DRAFT, ListingStatus.NEEDS_CHANGES];

    if (
      existing &&
      existing.sellerId === sellerId &&
      editableStatuses.includes(existing.status as ListingStatus)
    ) {
      await prisma.aircraftListing.update({
        where: { id: existing.id },
        data: listingCoreFields(v, sellerId, completeness.score, ListingStatus.SUBMITTED),
      });
      await syncListingChildren(existing.id, v, photos, documents);
      await prisma.listingStatusHistory.create({
        data: {
          listingId: existing.id,
          fromStatus: existing.status as ListingStatus,
          toStatus: ListingStatus.SUBMITTED,
          changedById: sellerId,
          reason: "Seller submitted aircraft for AVIATONLY review.",
        },
      });
      await prisma.listingEvent.create({
        data: {
          listingId: existing.id,
          type: "SELLER_SUBMITTED_LISTING",
          actorId: sellerId,
          message: `${registration} submitted for AVIATONLY review.`,
        },
      });

      return {
        ok: true,
        id: existing.id,
        registration,
        status: ListingStatus.SUBMITTED,
      };
    }

    if (existing) {
      return {
        ok: false,
        error: `${registration} is already listed on AVIATONLY.`,
        field: "registration",
      };
    }

    const listing = await prisma.aircraftListing.create({
      data: {
        registration,
        registrationType: v.registrationType,
        make: v.make,
        model: v.model,
        year: v.year,
        category: v.category,
        airfield: v.airfield,
        province: v.province,

        ownerName: v.ownerName || null,
        sellerRole: v.sellerRole || null,
        authorisedToSell: v.authorisedToSell ?? null,

        saleType: v.saleType,
        valuationEstimate: v.valuationEstimate,
        askingPrice: v.askingPrice,
        reservePrice: v.reservePrice,
        startingBid: v.startingBid,
        bidIncrement: v.bidIncrement,

        // Submitting moves the listing out of DRAFT into the review queue.
        status: ListingStatus.SUBMITTED,
        completenessScore: completeness.score,
        sellerId,

        airframe: {
          create: {
            totalTimeAirframe: v.ttaf ?? null,
            damageHistory: v.knownDefects || null,
          },
        },
        engines: hasEngine
          ? {
              create: [
                {
                  position: EnginePosition.SINGLE,
                  model: v.engineMakeModel || null,
                  engineHours: v.engineHours ?? null,
                  timeSinceOverhaul: v.tso ?? null,
                },
              ],
            }
          : undefined,
        propellers: hasPropeller
          ? {
              create: [
                {
                  model: v.propellerMakeModel || null,
                  propellerHours: v.propellerHours ?? null,
                },
              ],
            }
          : undefined,
        avionics: hasAvionics
          ? {
              create: {
                equipment: v.avionicsEquipment ?? [],
                summary: v.avionics || null,
              },
            }
          : undefined,
        maintenance: hasMaintenance
          ? {
              create: {
                status: v.maintenanceStatus || null,
                lastMpiDate: v.lastMpiDate ?? null,
              },
            }
          : undefined,

        photos: photos.length
          ? {
              createMany: {
                data: photos.map((p) => ({
                  slotKey: p.slot,
                  fileName: p.fileName,
                  status: PhotoStatus.UPLOADED,
                })),
              },
            }
          : undefined,
        documents: documents.length
          ? {
              createMany: {
                data: documents.map((d) => ({
                  documentType: d.slot,
                  fileName: d.fileName,
                  reviewStatus: DocumentStatus.UPLOADED,
                  visibility: DocumentVisibility.PRIVATE_INTERNAL,
                })),
              },
            }
          : undefined,

        // Record the DRAFT -> SUBMITTED transition and seed the activity timeline.
        statusHistory: {
          create: {
            fromStatus: ListingStatus.DRAFT,
            toStatus: ListingStatus.SUBMITTED,
            changedById: sellerId,
            reason: "Seller submitted aircraft for AVIATONLY review.",
          },
        },
        events: {
          create: {
            type: "SELLER_SUBMITTED_LISTING",
            actorId: sellerId,
            message: `${registration} submitted for AVIATONLY review.`,
          },
        },
      },
      select: { id: true, registration: true, status: true },
    });

    // Placeholder for the internal operations notification service (NotificationEvent).
    console.info("[AVIATONLY] Listing submitted for review", {
      id: listing.id,
      registration: listing.registration,
      photos: photos.length,
      documents: documents.length,
    });

    return {
      ok: true,
      id: listing.id,
      registration: listing.registration,
      status: listing.status,
    };
  } catch (error) {
    console.error("submitAircraftListing failed", error);
    return { ok: false, error: "Could not submit right now. Please try again." };
  }
}
