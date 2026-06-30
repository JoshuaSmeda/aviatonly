import { AuctionStatus } from "@/lib/aviatonly/domain/auction-status";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import { prisma } from "@/lib/prisma";
import type { AuctionTableRow } from "./auction-workspace-types";

function aircraftTitle(year: number, make: string, model: string): string {
  return `${year} ${make} ${model}`;
}

export async function queryAuctionTableRows(
  options?: { status?: AuctionStatus },
): Promise<AuctionTableRow[]> {
  const auctions = await prisma.auction.findMany({
    where: options?.status ? { status: options.status } : undefined,
    orderBy: [{ status: "asc" }, { effectiveEndsAt: "desc" }],
    include: {
      listing: {
        select: {
          id: true,
          registration: true,
          make: true,
          model: true,
          year: true,
        },
      },
    },
  });

  return auctions.map((auction) => ({
    id: auction.id,
    listingId: auction.listingId,
    registration: auction.listing.registration,
    aircraftTitle: aircraftTitle(
      auction.listing.year,
      auction.listing.make,
      auction.listing.model,
    ),
    status: auction.status as AuctionStatus,
    startsAt: auction.startsAt.toISOString(),
    effectiveEndsAt: auction.effectiveEndsAt.toISOString(),
    currentHighBidAmount: auction.currentHighBidAmount,
    bidCount: auction.bidCount,
    reserveMet: auction.reserveMet,
    detailHref: `/dashboard/auctions/${auction.id}`,
    listingHref: `/dashboard/listings/${auction.listingId}`,
  }));
}

export async function countAuctionsByStatus(): Promise<Record<string, number>> {
  const groups = await prisma.auction.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  return Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
}
