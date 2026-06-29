/**
 * Seeds AVIATONLY demo data from the mock dataset into PostgreSQL.
 * Run: npm run db:seed
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

import {
  BuyerVerificationStatus,
  DealStatus,
  DocumentStatus,
  DocumentVisibility,
  LeadActivityType,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadType,
  OfferActivityType,
  OfferStatus,
  PhotoStatus,
  ReviewTaskStatus,
} from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { MOCK_LISTING_EVENTS } from "../src/lib/aviatonly/mock/activity";
import { MOCK_DEALS } from "../src/lib/aviatonly/mock/deals";
import { MOCK_DOCUMENTS } from "../src/lib/aviatonly/mock/documents";
import { MOCK_LEADS } from "../src/lib/aviatonly/mock/leads";
import {
  MOCK_AIRFRAMES,
  MOCK_AVIONICS,
  MOCK_ENGINES,
  MOCK_LISTINGS,
  MOCK_MAINTENANCE,
  MOCK_PROPELLERS,
} from "../src/lib/aviatonly/mock/listings";
import { MOCK_OFFERS } from "../src/lib/aviatonly/mock/offers";
import { MOCK_PHOTOS } from "../src/lib/aviatonly/mock/photos";
import { MOCK_REVIEW_TASKS } from "../src/lib/aviatonly/mock/review-tasks";
import { MOCK_FIELD_REVIEWS } from "../src/lib/aviatonly/mock/field-reviews";
import { MOCK_USERS } from "../src/lib/aviatonly/mock/users";

const prisma = new PrismaClient();

/** Shared password for all seeded demo accounts — local dev only. */
export const DEMO_USER_PASSWORD = "changeme";

async function ensureCredentialAccount(userId: string, password: string) {
  const hashed = await hashPassword(password);
  await prisma.account.deleteMany({
    where: { userId, providerId: "credential" },
  });
  await prisma.account.create({
    data: {
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashed,
    },
  });
}

function mapOptionalUserId(
  mockId: string | null | undefined,
  userIdByMockId: Map<string, string>,
): string | null {
  if (!mockId) return null;
  return userIdByMockId.get(mockId) ?? null;
}

async function seedListingChildren(
  listingIdByMockId: Map<string, string>,
  userIdByMockId: Map<string, string>,
) {
  const dbListingIds = [...listingIdByMockId.values()];

  await prisma.listingEvent.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.listingReviewTask.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.listingFieldReview.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftPhoto.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftDocument.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftEngine.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftPropeller.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftAirframe.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftAvionics.deleteMany({ where: { listingId: { in: dbListingIds } } });
  await prisma.aircraftMaintenance.deleteMany({ where: { listingId: { in: dbListingIds } } });

  for (const airframe of MOCK_AIRFRAMES) {
    const listingId = listingIdByMockId.get(airframe.listingId);
    if (!listingId) continue;
    await prisma.aircraftAirframe.create({
      data: {
        listingId,
        serialNumber: airframe.serialNumber,
        totalTimeAirframe: airframe.totalTimeAirframe,
        damageHistory: airframe.damageHistory,
        notes: airframe.notes,
      },
    });
  }

  for (const engine of MOCK_ENGINES) {
    const listingId = listingIdByMockId.get(engine.listingId);
    if (!listingId) continue;
    await prisma.aircraftEngine.create({
      data: {
        listingId,
        position: engine.position,
        manufacturer: engine.manufacturer,
        model: engine.model,
        serialNumber: engine.serialNumber,
        horsepowerOrThrust: engine.horsepowerOrThrust,
        engineHours: engine.engineHours,
        timeSinceOverhaul: engine.timeSinceOverhaul,
        timeSinceNew: engine.timeSinceNew,
        overhaulDate: engine.overhaulDate ? new Date(engine.overhaulDate) : null,
        overhaulFacility: engine.overhaulFacility,
        calendarLifeRemaining: engine.calendarLifeRemaining,
        knownIssues: engine.knownIssues,
      },
    });
  }

  for (const propeller of MOCK_PROPELLERS) {
    const listingId = listingIdByMockId.get(propeller.listingId);
    if (!listingId) continue;
    await prisma.aircraftPropeller.create({
      data: {
        listingId,
        manufacturer: propeller.manufacturer,
        model: propeller.model,
        serialNumber: propeller.serialNumber,
        bladeCount: propeller.bladeCount,
        propellerType: propeller.propellerType,
        propellerHours: propeller.propellerHours,
        timeSinceOverhaul: propeller.timeSinceOverhaul,
        overhaulDate: propeller.overhaulDate ? new Date(propeller.overhaulDate) : null,
        knownDamageNotes: propeller.knownDamageNotes,
      },
    });
  }

  for (const avionics of MOCK_AVIONICS) {
    const listingId = listingIdByMockId.get(avionics.listingId);
    if (!listingId) continue;
    await prisma.aircraftAvionics.create({
      data: {
        listingId,
        equipment: avionics.equipment,
        summary: avionics.summary,
      },
    });
  }

  for (const maintenance of MOCK_MAINTENANCE) {
    const listingId = listingIdByMockId.get(maintenance.listingId);
    if (!listingId) continue;
    await prisma.aircraftMaintenance.create({
      data: {
        listingId,
        status: maintenance.status,
        lastMpiDate: maintenance.lastMpiDate ? new Date(maintenance.lastMpiDate) : null,
        nextMpiDue: maintenance.nextMpiDue ? new Date(maintenance.nextMpiDue) : null,
        notes: maintenance.notes,
      },
    });
  }

  const photoIdByMockId = new Map<string, string>();
  for (const photo of MOCK_PHOTOS) {
    const listingId = listingIdByMockId.get(photo.listingId);
    if (!listingId) continue;
    const created = await prisma.aircraftPhoto.create({
      data: {
        listingId,
        slotKey: photo.slotKey,
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        sizeBytes: photo.sizeBytes,
        storageKey: photo.storageKey,
        publicUrl: photo.publicUrl,
        status: photo.status as PhotoStatus,
        rejectionReason: photo.rejectionReason,
        uploadedById: mapOptionalUserId(photo.uploadedById, userIdByMockId),
        reviewedById: mapOptionalUserId(photo.reviewedById, userIdByMockId),
        uploadedAt: new Date(photo.uploadedAt),
        reviewedAt: photo.reviewedAt ? new Date(photo.reviewedAt) : null,
        sortOrder: photo.sortOrder,
        isPublicGalleryImage: photo.isPublicGalleryImage,
      },
    });
    photoIdByMockId.set(photo.id, created.id);
  }

  const documentIdByMockId = new Map<string, string>();
  for (const document of MOCK_DOCUMENTS) {
    const listingId = listingIdByMockId.get(document.listingId);
    if (!listingId) continue;
    const created = await prisma.aircraftDocument.create({
      data: {
        listingId,
        documentType: document.documentType,
        fileName: document.fileName,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes,
        storageKey: document.storageKey,
        reviewStatus: document.reviewStatus as DocumentStatus,
        visibility: document.visibility as DocumentVisibility,
        rejectionReason: document.rejectionReason,
        uploadedById: mapOptionalUserId(document.uploadedById, userIdByMockId),
        reviewedById: mapOptionalUserId(document.reviewedById, userIdByMockId),
        uploadedAt: new Date(document.uploadedAt),
        reviewedAt: document.reviewedAt ? new Date(document.reviewedAt) : null,
      },
    });
    documentIdByMockId.set(document.id, created.id);
  }

  for (const task of MOCK_REVIEW_TASKS) {
    const listingId = listingIdByMockId.get(task.listingId);
    if (!listingId) continue;

    let sourceKey = task.sourceKey;
    if (task.sourceType === "photo" && sourceKey) {
      sourceKey = photoIdByMockId.get(sourceKey) ?? sourceKey;
    }
    if (task.sourceType === "document" && sourceKey) {
      sourceKey = documentIdByMockId.get(sourceKey) ?? sourceKey;
    }

    await prisma.listingReviewTask.create({
      data: {
        listingId,
        title: task.title,
        description: task.description,
        assignedToId: mapOptionalUserId(task.assignedToId, userIdByMockId),
        assignedRole: task.assignedRole,
        status: task.status as ReviewTaskStatus,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        blockingPublication: task.blockingPublication,
        releasedToSeller: task.releasedToSeller,
        sourceType: task.sourceType,
        sourceKey,
        createdById: mapOptionalUserId(task.createdById, userIdByMockId),
        resolvedById: mapOptionalUserId(task.resolvedById, userIdByMockId),
        resolvedAt: task.resolvedAt ? new Date(task.resolvedAt) : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      },
    });
  }

  for (const review of MOCK_FIELD_REVIEWS) {
    const listingId = listingIdByMockId.get(review.listingId);
    if (!listingId) continue;
    await prisma.listingFieldReview.create({
      data: {
        listingId,
        fieldKey: review.fieldKey,
        label: review.label,
        status: review.status,
        rejectionReason: review.rejectionReason,
        rejectionPreset: review.rejectionPreset,
        reviewedById: mapOptionalUserId(review.reviewedById, userIdByMockId),
        reviewedAt: review.reviewedAt ? new Date(review.reviewedAt) : null,
      },
    });
  }

  for (const event of MOCK_LISTING_EVENTS) {
    const listingId = listingIdByMockId.get(event.listingId);
    if (!listingId) continue;
    await prisma.listingEvent.create({
      data: {
        listingId,
        actorId: mapOptionalUserId(event.actorId, userIdByMockId),
        type: event.type,
        message: event.message,
        metadata: (event.metadata as Prisma.InputJsonValue) ?? undefined,
        createdAt: new Date(event.createdAt),
      },
    });
  }
}

async function main() {
  console.log("Seeding AVIATONLY demo data…");

  const userIdByMockId = new Map<string, string>();
  for (const user of MOCK_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, roles: user.roles, emailVerified: true },
      create: {
        email: user.email,
        name: user.name,
        roles: user.roles,
        emailVerified: true,
      },
    });
    await ensureCredentialAccount(record.id, DEMO_USER_PASSWORD);
    userIdByMockId.set(user.id, record.id);
  }

  const listingIdByMockId = new Map<string, string>();
  for (const listing of MOCK_LISTINGS) {
    const sellerId = userIdByMockId.get(listing.sellerId);
    if (!sellerId) continue;

    const record = await prisma.aircraftListing.upsert({
      where: { registration: listing.registration },
      update: {
        status: listing.status,
        completenessScore: listing.completenessScore,
        askingPrice: listing.askingPrice,
        valuationEstimate: listing.valuationEstimate,
        reservePrice: listing.reservePrice,
        startingBid: listing.startingBid,
        bidIncrement: listing.bidIncrement,
        ownerName: listing.ownerName,
        sellerRole: listing.sellerRole,
        authorisedToSell: listing.authorisedToSell,
        saleType: listing.saleType,
        updatedAt: new Date(listing.updatedAt),
      },
      create: {
        registration: listing.registration,
        registrationType: listing.registrationType,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        category: listing.category,
        airfield: listing.airfield,
        province: listing.province,
        ownerName: listing.ownerName,
        sellerRole: listing.sellerRole,
        authorisedToSell: listing.authorisedToSell,
        saleType: listing.saleType,
        valuationEstimate: listing.valuationEstimate,
        askingPrice: listing.askingPrice,
        reservePrice: listing.reservePrice,
        startingBid: listing.startingBid,
        bidIncrement: listing.bidIncrement,
        status: listing.status,
        completenessScore: listing.completenessScore,
        sellerId,
        createdAt: new Date(listing.createdAt),
        updatedAt: new Date(listing.updatedAt),
      },
    });
    listingIdByMockId.set(listing.id, record.id);
  }

  await seedListingChildren(listingIdByMockId, userIdByMockId);

  await prisma.leadActivity.deleteMany();
  await prisma.offerActivity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.offer.deleteMany();

  const offerIdByMockId = new Map<string, string>();

  for (const offer of MOCK_OFFERS) {
    const listingId = listingIdByMockId.get(offer.listingId);
    const buyerId = userIdByMockId.get(offer.buyerId);
    const sellerId = userIdByMockId.get(offer.sellerId);
    if (!listingId || !buyerId || !sellerId) continue;

    const record = await prisma.offer.create({
      data: {
        listingId,
        buyerId,
        sellerId,
        amount: offer.amount,
        currency: offer.currency,
        message: offer.message,
        status: offer.status as OfferStatus,
        expiresAt: offer.expiresAt ? new Date(offer.expiresAt) : null,
        createdAt: new Date(offer.createdAt),
        updatedAt: new Date(offer.updatedAt),
        activities: {
          create: {
            type: OfferActivityType.OFFER_CREATED,
            actorId: buyerId,
            message: "Offer seeded from demo data.",
            metadata: { mockId: offer.id },
          },
        },
      },
    });
    offerIdByMockId.set(offer.id, record.id);
  }

  for (const lead of MOCK_LEADS) {
    const listingId = listingIdByMockId.get(lead.listingId);
    const buyerId = userIdByMockId.get(lead.buyerId);
    const sellerId = userIdByMockId.get(lead.sellerId);
    if (!listingId || !buyerId || !sellerId) continue;

    await prisma.lead.create({
      data: {
        listingId,
        buyerId,
        sellerId,
        type: lead.type as LeadType,
        status: lead.status as LeadStatus,
        source: LeadSource.PUBLIC_LISTING,
        priority: LeadPriority.NORMAL,
        message: lead.message,
        buyerVerificationStatus: lead.verificationStatus as BuyerVerificationStatus,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt),
        activities: {
          create: {
            type: LeadActivityType.LEAD_CREATED,
            actorId: buyerId,
            message: "Lead seeded from demo data.",
            metadata: { mockId: lead.id },
          },
        },
      },
    });
  }

  for (const deal of MOCK_DEALS) {
    const listingId = listingIdByMockId.get(deal.listingId);
    const buyerId = userIdByMockId.get(deal.buyerId);
    const sellerId = userIdByMockId.get(deal.sellerId);
    const acceptedOfferId = deal.acceptedOfferId
      ? offerIdByMockId.get(deal.acceptedOfferId)
      : undefined;

    if (!listingId || !buyerId || !sellerId || !acceptedOfferId) continue;

    await prisma.deal.create({
      data: {
        listingId,
        buyerId,
        sellerId,
        acceptedOfferId,
        agreedPrice: deal.agreedPrice,
        currency: deal.currency,
        depositAmount: deal.depositAmount,
        commissionAmount: deal.commissionAmount,
        vatAmount: deal.vatAmount,
        status: deal.status as DealStatus,
        nextAction: deal.nextAction,
        createdAt: new Date(deal.createdAt),
        updatedAt: new Date(deal.updatedAt),
      },
    });
  }

  const [listingCount, leadCount, offerCount, dealCount] = await Promise.all([
    prisma.aircraftListing.count(),
    prisma.lead.count(),
    prisma.offer.count(),
    prisma.deal.count(),
  ]);

  console.log(
    `Done. ${listingCount} listings, ${leadCount} leads, ${offerCount} offers, ${dealCount} deals.`,
  );
  console.log("\nDemo login (all seeded users share this password):");
  console.log(`  Password: ${DEMO_USER_PASSWORD}`);
  console.log("  Seller:   demo-seller@aviatonly.co.za");
  console.log("  Admin:    review@aviatonly.co.za");
  console.log("  Buyer:    marcus.t@example.co.za");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
