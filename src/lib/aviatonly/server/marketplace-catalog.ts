import type { Prisma } from "@prisma/client";
import { AuctionStatus, ListingStatus, SaleType } from "@/lib/aviatonly/domain";
import type {
  AircraftCategory,
  AircraftContactInfo,
  AircraftListingImage,
  AircraftMarketplaceDetail,
  AircraftMarketplaceListing,
  AircraftSaleType,
  MarketplaceAuctionSummary,
  PublicAircraftStatus,
  RegistrationType,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { buildListingSlug } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { MOCK_AIRCRAFT_LISTINGS } from "@/lib/aviatonly/marketplace/mock-aircraft-listings";
import { prisma } from "@/lib/prisma";

const marketplaceCatalogInclude = {
  airframe: true,
  engines: { orderBy: { position: "asc" as const } },
  propellers: { orderBy: { createdAt: "asc" as const } },
  avionics: true,
  maintenance: true,
  photos: {
    where: { isPublicGalleryImage: true },
    orderBy: { sortOrder: "asc" as const },
  },
  seller: { select: { name: true, email: true } },
  auctions: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
} satisfies Prisma.AircraftListingInclude;

type MarketplaceCatalogRecord = Prisma.AircraftListingGetPayload<{
  include: typeof marketplaceCatalogInclude;
}>;

const LIVE_CATALOG_STATUSES: ListingStatus[] = [
  ListingStatus.LIVE_FIXED_PRICE,
  ListingStatus.LIVE_AUCTION,
];

function catalogPhotoUrl(photoId: string, publicUrl: string | null): string {
  return publicUrl ?? `/api/catalog/photos/${photoId}`;
}

function mapDbCategory(category: string): AircraftCategory {
  const value = category.toLowerCase();
  if (value.includes("single")) return "SINGLE_ENGINE_PISTON";
  if (value.includes("multi")) return "MULTI_ENGINE_PISTON";
  if (value.includes("turboprop")) return "TURBOPROP";
  if (value.includes("jet")) return "JET";
  if (value.includes("helicopter")) return "HELICOPTER";
  if (value.includes("light sport") || value.includes("lsa")) return "LIGHT_SPORT";
  if (value.includes("experimental") || value.includes("ntca")) return "EXPERIMENTAL_NTCA";
  if (value.includes("microlight")) return "MICROLIGHT";
  if (value.includes("glider") || value.includes("sailplane")) return "GLIDER";
  return "SINGLE_ENGINE_PISTON";
}

function mapSaleType(saleType: string): AircraftSaleType {
  return saleType === SaleType.AUCTION ? "AUCTION" : "FIXED_PRICE";
}

function mapPublicStatus(
  status: ListingStatus,
  listedAt: Date,
): PublicAircraftStatus {
  if (status === ListingStatus.LIVE_AUCTION) {
    return "AUCTION_LIVE";
  }

  const daysListed = (Date.now() - listedAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysListed <= 14 ? "NEW_LISTING" : "AVAILABLE";
}

function mapRegistrationType(value: string): RegistrationType {
  if (value === "ZU") return "ZU";
  if (value === "ZS") return "ZS";
  return "FOREIGN";
}

function mapListingImages(
  registration: string,
  photos: MarketplaceCatalogRecord["photos"],
): AircraftListingImage[] {
  if (photos.length === 0) {
    return [];
  }

  const primarySlot = "exterior_front_45";
  const hasPrimary = photos.some((photo) => photo.slotKey === primarySlot);
  let markedPrimary = false;

  return photos.map((photo) => {
    const isPrimary = hasPrimary
      ? photo.slotKey === primarySlot
      : !markedPrimary && (markedPrimary = true);

    return {
      id: photo.id,
      url: catalogPhotoUrl(photo.id, photo.publicUrl),
      alt: `${registration} ${photo.slotKey.replace(/_/g, " ")}`,
      slotKey: photo.slotKey,
      isPrimary,
    };
  });
}

function mapAuctionSummary(
  auction: MarketplaceCatalogRecord["auctions"][number],
): MarketplaceAuctionSummary {
  let phase: MarketplaceAuctionSummary["phase"] = "SCHEDULED";
  if (
    auction.status === AuctionStatus.CLOSED ||
    auction.status === AuctionStatus.CANCELLED ||
    auction.closedAt
  ) {
    phase = "ENDED";
  } else if (
    auction.status === AuctionStatus.LIVE ||
    auction.status === AuctionStatus.CLOSING
  ) {
    phase = "LIVE";
  }

  return {
    auctionId: auction.id,
    phase,
    openingBid: auction.startingBid,
    currentBid: auction.currentHighBidAmount,
    bidCount: auction.bidCount,
    startsAt: auction.startsAt.toISOString(),
    effectiveEndsAt: auction.effectiveEndsAt.toISOString(),
    showReserveStatus: auction.showReserveStatus,
    reserveMet: auction.showReserveStatus ? auction.reserveMet : null,
  };
}

function buildHighlights(record: MarketplaceCatalogRecord): string[] {
  const highlights: string[] = [];

  if (record.maintenance?.status) {
    highlights.push(record.maintenance.status);
  }
  if (record.maintenance?.lastMpiDate) {
    highlights.push("MPI on file");
  }
  if (record.avionics?.equipment?.some((item) => /ifr/i.test(item))) {
    highlights.push("IFR equipped");
  }
  if (record.airframe?.damageHistory?.toLowerCase().includes("no known")) {
    highlights.push("No known damage history");
  }

  return highlights.slice(0, 6);
}

function buildDescription(record: MarketplaceCatalogRecord): string {
  const notes = record.airframe?.notes?.trim();
  if (notes) {
    return notes;
  }

  return `${record.year} ${record.make} ${record.model} based at ${record.airfield}, ${record.province}. Reviewed and listed on AVIATONLY.`;
}

function buildContact(record: MarketplaceCatalogRecord): AircraftContactInfo {
  return {
    sellerType: "AVIATONLY",
    contactName: record.seller.name?.trim() || "AVIATONLY",
    email: record.seller.email ?? undefined,
  };
}

function mapLiveListingRecord(record: MarketplaceCatalogRecord): AircraftMarketplaceDetail {
  const status = record.status as ListingStatus;
  const saleType = mapSaleType(record.saleType);
  const slug = buildListingSlug(record.registration, record.make, record.model);
  const primaryEngine = record.engines[0];
  const primaryPropeller = record.propellers[0];
  const price =
    saleType === "FIXED_PRICE"
      ? (record.askingPrice ?? record.platformIndicativeValue ?? undefined)
      : undefined;

  const listing: AircraftMarketplaceDetail = {
    id: record.id,
    slug,
    registration: record.registration,
    year: record.year,
    make: record.make,
    model: record.model,
    category: mapDbCategory(record.category),
    saleType,
    publicStatus: mapPublicStatus(status, record.createdAt),
    price,
    currency: "ZAR",
    location: {
      airfield: record.airfield,
      province: record.province,
      country: "South Africa",
    },
    totalTimeAirframe: record.airframe?.totalTimeAirframe ?? undefined,
    engineTime: primaryEngine?.engineHours ?? undefined,
    engineTimeLabel: primaryEngine?.timeSinceOverhaul != null ? "TSO" : "TT",
    engineCount: record.engines.length || 1,
    registrationType: mapRegistrationType(record.registrationType),
    avionicsSummary: record.avionics?.equipment?.slice(0, 3).join(" · ") || undefined,
    maintenanceSummary: record.maintenance?.status ?? undefined,
    highlights: buildHighlights(record),
    images: mapListingImages(record.registration, record.photos),
    isVerified: true,
    listedAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    description: buildDescription(record),
    technicalSpec: {
      airframe: {
        totalTimeAirframe: record.airframe?.totalTimeAirframe ?? undefined,
        yearOfManufacture: record.year,
        serialNumber: record.airframe?.serialNumber ?? undefined,
        category: record.category,
        registrationType: record.registrationType,
        damageHistory: record.airframe?.damageHistory ?? undefined,
      },
      engines: record.engines.map((engine) => ({
        position: engine.position,
        manufacturer: engine.manufacturer ?? undefined,
        model: engine.model ?? undefined,
        serialNumber: engine.serialNumber ?? undefined,
        engineHours: engine.engineHours ?? undefined,
        timeSinceOverhaul: engine.timeSinceOverhaul ?? undefined,
        timeSinceNew: engine.timeSinceNew ?? undefined,
        overhaulDate: engine.overhaulDate?.toISOString() ?? undefined,
        knownIssues: engine.knownIssues ?? undefined,
      })),
      propeller: primaryPropeller
        ? {
            manufacturer: primaryPropeller.manufacturer ?? undefined,
            model: primaryPropeller.model ?? undefined,
            serialNumber: primaryPropeller.serialNumber ?? undefined,
            bladeCount: primaryPropeller.bladeCount ?? undefined,
            propellerType: primaryPropeller.propellerType ?? undefined,
            propellerHours: primaryPropeller.propellerHours ?? undefined,
            timeSinceOverhaul: primaryPropeller.timeSinceOverhaul ?? undefined,
            knownDamageNotes: primaryPropeller.knownDamageNotes ?? undefined,
          }
        : undefined,
      avionics: {
        otherEquipment: record.avionics?.equipment?.join(", ") ?? undefined,
        primarySuite: record.avionics?.summary ?? undefined,
      },
      maintenance: {
        lastMpiDate: record.maintenance?.lastMpiDate?.toISOString() ?? undefined,
        nextMpiDueDate: record.maintenance?.nextMpiDue?.toISOString() ?? undefined,
        knownDefects: record.maintenance?.notes ?? undefined,
      },
    },
    documents: [
      { label: "Logbooks & legal documents", status: "Available after enquiry" },
    ],
    verification: {
      documentsReviewed: true,
      photosVerified: record.photos.length > 0,
      inspectionAvailable: Boolean(record.inspectionCompletedAt),
      inspectionCompleted: Boolean(record.inspectionCompletedAt),
    },
    marketEstimate: {
      available: record.platformIndicativeValue != null,
      minValue: record.platformIndicativeValue ?? undefined,
      maxValue: record.platformIndicativeValue ?? undefined,
      currency: "ZAR",
      notes: "Indicative AVIATONLY market estimate.",
    },
    contact: buildContact(record),
  };

  if (saleType === "AUCTION" && record.auctions[0]) {
    listing.auction = mapAuctionSummary(record.auctions[0]);
  }

  return listing;
}

async function queryLiveCatalogRecords(): Promise<MarketplaceCatalogRecord[]> {
  return prisma.aircraftListing.findMany({
    where: { status: { in: LIVE_CATALOG_STATUSES } },
    include: marketplaceCatalogInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function queryLiveMarketplaceListings(): Promise<AircraftMarketplaceListing[]> {
  const records = await queryLiveCatalogRecords();
  return records.map(mapLiveListingRecord);
}

export async function queryMarketplaceListingDetail(
  slug: string,
): Promise<AircraftMarketplaceDetail | null> {
  const normalizedSlug = slug.toLowerCase();
  const records = await queryLiveCatalogRecords();

  const liveMatch = records.find(
    (record) => buildListingSlug(record.registration, record.make, record.model) === normalizedSlug,
  );
  if (liveMatch) {
    return mapLiveListingRecord(liveMatch);
  }

  const registrationCandidate = slug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const byRegistration = records.find(
    (record) => record.registration.replace(/[^A-Z0-9]/gi, "").toUpperCase() === registrationCandidate,
  );
  if (byRegistration) {
    return mapLiveListingRecord(byRegistration);
  }

  return null;
}

export async function getBuyMarketplaceListings(): Promise<AircraftMarketplaceListing[]> {
  const live = await queryLiveMarketplaceListings();
  const liveRegistrations = new Set(live.map((listing) => listing.registration.toUpperCase()));
  const mock = MOCK_AIRCRAFT_LISTINGS.filter(
    (listing) => !liveRegistrations.has(listing.registration.toUpperCase()),
  );

  return [...live, ...mock];
}

export async function getBuyMarketplaceListingDetail(
  slug: string,
): Promise<AircraftMarketplaceDetail | null> {
  const live = await queryMarketplaceListingDetail(slug);
  if (live) {
    return live;
  }

  const { getMockListingBySlug } = await import(
    "@/lib/aviatonly/marketplace/mock-aircraft-listings"
  );
  return getMockListingBySlug(slug) ?? null;
}
