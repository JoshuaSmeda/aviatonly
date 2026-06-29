import type {
  AircraftAirframe,
  AircraftAvionics,
  AircraftDocument,
  AircraftEngine,
  AircraftListing,
  AircraftMaintenance,
  AircraftPhoto,
  AircraftPropeller,
  Deal,
  ListingEvent,
  ListingReviewTask,
} from "@prisma/client";
import type {
  DealStatus,
  DocumentStatus,
  DocumentVisibility,
  EnginePosition,
  ListingStatus,
  PhotoStatus,
  PropellerType,
  ReviewTaskStatus,
  SaleType,
} from "@/lib/aviatonly/domain";
import type {
  MockAircraftAirframe,
  MockAircraftAvionics,
  MockAircraftDocument,
  MockAircraftEngine,
  MockAircraftListing,
  MockAircraftMaintenance,
  MockAircraftPhoto,
  MockAircraftPropeller,
  MockDeal,
  MockListingEvent,
  MockListingReviewTask,
} from "@/lib/aviatonly/mock/types";

function toIso(date: Date | null | undefined): string | null {
  return date ? date.toISOString() : null;
}

export function listingTitle(parts: { year: number; make: string; model: string }): string {
  return `${parts.year} ${parts.make} ${parts.model}`.trim();
}

export function listingLocation(listing: Pick<MockAircraftListing, "airfield" | "province">): string {
  return `${listing.airfield}, ${listing.province}`;
}

export function mapListingRecord(listing: AircraftListing): MockAircraftListing {
  return {
    id: listing.id,
    registration: listing.registration,
    registrationType: listing.registrationType as "ZS" | "ZU",
    make: listing.make,
    model: listing.model,
    year: listing.year,
    category: listing.category,
    airfield: listing.airfield,
    province: listing.province,
    ownerName: listing.ownerName,
    sellerRole: listing.sellerRole,
    authorisedToSell: listing.authorisedToSell,
    saleType: listing.saleType as SaleType,
    valuationEstimate: listing.valuationEstimate,
    askingPrice: listing.askingPrice,
    reservePrice: listing.reservePrice,
    startingBid: listing.startingBid,
    bidIncrement: listing.bidIncrement,
    status: listing.status as ListingStatus,
    completenessScore: listing.completenessScore,
    sellerId: listing.sellerId,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export function mapAirframeRecord(record: AircraftAirframe): MockAircraftAirframe {
  return {
    id: record.id,
    listingId: record.listingId,
    serialNumber: record.serialNumber,
    totalTimeAirframe: record.totalTimeAirframe,
    damageHistory: record.damageHistory,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapEngineRecord(record: AircraftEngine): MockAircraftEngine {
  return {
    id: record.id,
    listingId: record.listingId,
    position: record.position as EnginePosition,
    manufacturer: record.manufacturer,
    model: record.model,
    serialNumber: record.serialNumber,
    horsepowerOrThrust: record.horsepowerOrThrust,
    engineHours: record.engineHours,
    timeSinceOverhaul: record.timeSinceOverhaul,
    timeSinceNew: record.timeSinceNew,
    overhaulDate: toIso(record.overhaulDate),
    overhaulFacility: record.overhaulFacility,
    calendarLifeRemaining: record.calendarLifeRemaining,
    knownIssues: record.knownIssues,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapPropellerRecord(record: AircraftPropeller): MockAircraftPropeller {
  return {
    id: record.id,
    listingId: record.listingId,
    manufacturer: record.manufacturer,
    model: record.model,
    serialNumber: record.serialNumber,
    bladeCount: record.bladeCount,
    propellerType: record.propellerType as PropellerType | null,
    propellerHours: record.propellerHours,
    timeSinceOverhaul: record.timeSinceOverhaul,
    overhaulDate: toIso(record.overhaulDate),
    knownDamageNotes: record.knownDamageNotes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapAvionicsRecord(record: AircraftAvionics): MockAircraftAvionics {
  return {
    id: record.id,
    listingId: record.listingId,
    equipment: record.equipment,
    summary: record.summary,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapMaintenanceRecord(record: AircraftMaintenance): MockAircraftMaintenance {
  return {
    id: record.id,
    listingId: record.listingId,
    status: record.status,
    lastMpiDate: toIso(record.lastMpiDate),
    nextMpiDue: toIso(record.nextMpiDue),
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapPhotoRecord(record: AircraftPhoto): MockAircraftPhoto {
  return {
    id: record.id,
    listingId: record.listingId,
    slotKey: record.slotKey,
    fileName: record.fileName,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
    storageKey: record.storageKey,
    publicUrl: record.publicUrl,
    status: record.status as PhotoStatus,
    rejectionReason: record.rejectionReason,
    uploadedById: record.uploadedById,
    reviewedById: record.reviewedById,
    uploadedAt: record.uploadedAt.toISOString(),
    reviewedAt: toIso(record.reviewedAt),
    sortOrder: record.sortOrder,
    isPublicGalleryImage: record.isPublicGalleryImage,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapDocumentRecord(record: AircraftDocument): MockAircraftDocument {
  return {
    id: record.id,
    listingId: record.listingId,
    documentType: record.documentType,
    fileName: record.fileName,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
    storageKey: record.storageKey,
    reviewStatus: record.reviewStatus as DocumentStatus,
    visibility: record.visibility as DocumentVisibility,
    rejectionReason: record.rejectionReason,
    uploadedById: record.uploadedById,
    reviewedById: record.reviewedById,
    uploadedAt: record.uploadedAt.toISOString(),
    reviewedAt: toIso(record.reviewedAt),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapReviewTaskRecord(record: ListingReviewTask): MockListingReviewTask {
  return {
    id: record.id,
    listingId: record.listingId,
    title: record.title,
    description: record.description,
    assignedToId: record.assignedToId,
    assignedRole: record.assignedRole,
    status: record.status as ReviewTaskStatus,
    dueDate: toIso(record.dueDate),
    blockingPublication: record.blockingPublication,
    createdById: record.createdById,
    resolvedById: record.resolvedById,
    resolvedAt: toIso(record.resolvedAt),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapListingEventRecord(record: ListingEvent): MockListingEvent {
  return {
    id: record.id,
    listingId: record.listingId,
    actorId: record.actorId,
    type: record.type,
    message: record.message,
    metadata: (record.metadata as Record<string, unknown> | null) ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

export function mapDealRecord(deal: Deal): MockDeal {
  return {
    id: deal.id,
    listingId: deal.listingId,
    buyerId: deal.buyerId,
    sellerId: deal.sellerId,
    acceptedOfferId: deal.acceptedOfferId,
    agreedPrice: deal.agreedPrice,
    currency: deal.currency as "ZAR",
    depositAmount: deal.depositAmount,
    commissionAmount: deal.commissionAmount,
    vatAmount: deal.vatAmount,
    status: deal.status as DealStatus,
    nextAction: deal.nextAction ?? "",
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  };
}
