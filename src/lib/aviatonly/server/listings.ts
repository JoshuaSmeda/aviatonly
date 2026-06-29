import type { Prisma } from "@prisma/client";
import { ListingStatus } from "@/lib/aviatonly/domain";
import { prisma } from "@/lib/prisma";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";
import { mapListingRecord } from "./listing-mappers";

const listingDetailInclude = {
  airframe: true,
  engines: true,
  propellers: true,
  avionics: true,
  maintenance: true,
  photos: { orderBy: { sortOrder: "asc" as const } },
  documents: true,
  reviewTasks: true,
  fieldReviews: true,
  events: { orderBy: { createdAt: "desc" as const } },
  deals: { orderBy: { createdAt: "desc" as const }, take: 1 },
  seller: { select: { id: true, name: true, email: true } },
} satisfies Prisma.AircraftListingInclude;

export type ListingWithDetails = Prisma.AircraftListingGetPayload<{
  include: typeof listingDetailInclude;
}>;

export async function countListingsInDatabase(): Promise<number> {
  return prisma.aircraftListing.count();
}

export async function queryListingById(id: string): Promise<ListingWithDetails | null> {
  return prisma.aircraftListing.findFirst({
    where: {
      OR: [{ id }, { registration: id.toUpperCase() }],
    },
    include: listingDetailInclude,
  });
}

export async function queryListingsForSeller(sellerId: string): Promise<MockAircraftListing[]> {
  const listings = await prisma.aircraftListing.findMany({
    where: { sellerId },
    orderBy: { updatedAt: "desc" },
  });
  return listings.map(mapListingRecord);
}

export async function queryDraftListingsForSeller(sellerId: string): Promise<MockAircraftListing[]> {
  const listings = await prisma.aircraftListing.findMany({
    where: { sellerId, status: ListingStatus.DRAFT },
    orderBy: { updatedAt: "desc" },
  });
  return listings.map(mapListingRecord);
}

export async function queryReviewQueueListings(): Promise<ListingWithDetails[]> {
  const statuses: ListingStatus[] = [
    ListingStatus.SUBMITTED,
    ListingStatus.UNDER_REVIEW,
    ListingStatus.NEEDS_CHANGES,
    ListingStatus.VALUATION_READY,
    ListingStatus.INSPECTION_PENDING,
  ];

  return prisma.aircraftListing.findMany({
    where: { status: { in: statuses } },
    include: listingDetailInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export { listingDetailInclude };
