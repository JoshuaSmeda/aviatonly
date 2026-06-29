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
import { requireAnyRole } from "@/lib/auth/session";
import { SELLER_ROLES } from "@/lib/auth/roles";

export interface UploadMeta {
  slot: string;
  fileName: string;
}

export type SubmitListingResult =
  | { ok: true; id: string; registration: string; status: string }
  | { ok: false; error: string; field?: "registration" };

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
      select: { id: true },
    });
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
