"use server";

import { prisma } from "@/lib/prisma";
import {
  aircraftSchema,
  type AircraftFormValues,
} from "@/components/dashboard/seller/upload/schema";

export interface UploadMeta {
  slot: string;
  fileName: string;
}

export type SubmitListingResult =
  | { ok: true; id: string; registration: string; status: string }
  | { ok: false; error: string; field?: "registration" };

// Placeholder until real auth is wired — every prototype submission is attached
// to a single demo seller so the foreign key is satisfied.
const DEMO_SELLER_EMAIL = "demo-seller@aviatonly.co.za";

export async function submitAircraftListing(
  values: AircraftFormValues,
  photos: UploadMeta[] = [],
  documents: UploadMeta[] = [],
): Promise<SubmitListingResult> {
  // Re-validate on the server — never trust the client.
  const parsed = aircraftSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Some fields are invalid. Please review and try again." };
  }
  const v = parsed.data;
  const registration = v.registration.toUpperCase();

  try {
    const seller = await prisma.user.upsert({
      where: { email: DEMO_SELLER_EMAIL },
      update: {},
      create: { email: DEMO_SELLER_EMAIL, name: "Demo Seller" },
    });

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

        ttaf: v.ttaf,
        engineMakeModel: v.engineMakeModel,
        engineHours: v.engineHours,
        tso: v.tso,
        propellerMakeModel: v.propellerMakeModel || null,
        propellerHours: v.propellerHours,
        avionics: v.avionics || null,
        maintenanceStatus: v.maintenanceStatus || null,
        lastMpiDate: v.lastMpiDate,
        knownDefects: v.knownDefects || null,

        saleType: v.saleType,
        valuationEstimate: v.valuationEstimate,
        askingPrice: v.askingPrice,
        reservePrice: v.reservePrice,
        startingBid: v.startingBid,
        bidIncrement: v.bidIncrement,

        // Submitting moves the listing out of DRAFT into the review queue.
        status: "SUBMITTED",
        sellerId: seller.id,

        photos: photos.length
          ? { createMany: { data: photos.map((p) => ({ slot: p.slot, fileName: p.fileName })) } }
          : undefined,
        documents: documents.length
          ? { createMany: { data: documents.map((d) => ({ slot: d.slot, fileName: d.fileName })) } }
          : undefined,
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
