import { AuctionEventType, AuctionRegistrationStatus } from "@prisma/client";
import { ListingStatus, SaleType } from "@/lib/aviatonly/domain";
import { AuctionStatus, ACTIVE_AUCTION_STATUSES } from "@/lib/aviatonly/domain/auction-status";
import { BidStatus } from "@/lib/aviatonly/domain/bid-status";
import { getAdminAuctionStateRecord } from "@/lib/aviatonly/server/auction/auction-admin";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import { prisma } from "@/lib/prisma";
import { getAuctionEventLabel } from "./auction-event-labels";
import type {
  AuctionWorkspaceView,
  ListingAuctionSetupView,
} from "./auction-workspace-types";

const REGISTRATION_STATUS_LABELS: Record<AuctionRegistrationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  DENIED: "Denied",
  REVOKED: "Revoked",
};

const BID_STATUS_LABELS: Record<BidStatus, string> = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  SUPERSEDED: "Superseded",
  WINNING_AT_CLOSE: "Winning at close",
  BINDING: "Binding",
  DEFAULTED: "Defaulted",
  VOIDED: "Voided",
};

function listingLocation(airfield: string, province: string): string {
  return `${airfield} · ${province}`;
}

function aircraftTitle(year: number, make: string, model: string): string {
  return `${year} ${make} ${model}`;
}

export async function getAuctionWorkspace(
  auctionId: string,
): Promise<AuctionWorkspaceView | null> {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      listing: {
        select: {
          id: true,
          registration: true,
          make: true,
          model: true,
          year: true,
          status: true,
          airfield: true,
          province: true,
          seller: { select: { name: true } },
        },
      },
      registrations: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      bids: {
        orderBy: [{ sequence: "desc" }],
        take: 100,
        include: {
          bidder: { select: { name: true, email: true } },
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!auction) return null;

  const state = await getAdminAuctionStateRecord(auctionId);
  const paddleByUserId = new Map(
    auction.registrations
      .filter((r) => r.paddleNumber != null)
      .map((r) => [r.userId, r.paddleNumber!]),
  );

  return {
    auctionId: auction.id,
    state,
    listing: {
      id: auction.listing.id,
      registration: auction.listing.registration,
      title: aircraftTitle(
        auction.listing.year,
        auction.listing.make,
        auction.listing.model,
      ),
      location: listingLocation(auction.listing.airfield, auction.listing.province),
      status: auction.listing.status as ListingStatus,
      sellerName: auction.listing.seller.name ?? "Unknown seller",
      href: `/dashboard/listings/${auction.listing.id}`,
      publicHref: `/buy/${auction.listing.registration}`,
      setupHref: `/dashboard/listings/${auction.listing.id}/auction`,
    },
    cancelReason: auction.cancelReason,
    cancelledAt: auction.cancelledAt?.toISOString() ?? null,
    registrations: auction.registrations.map((reg) => ({
      id: reg.id,
      userId: reg.userId,
      name: reg.user.name ?? reg.user.email,
      email: reg.user.email,
      status: reg.status,
      statusLabel: REGISTRATION_STATUS_LABELS[reg.status],
      createdAt: reg.createdAt.toISOString(),
      timeAgo: formatTimeAgo(reg.createdAt.toISOString()),
      paddleNumber: reg.paddleNumber,
      verificationStatus: reg.verificationAtRegistration,
    })),
    bids: auction.bids.map((bid) => {
      const paddle = paddleByUserId.get(bid.bidderId);
      const bidderLabel =
        paddle != null
          ? `Paddle #${paddle}`
          : bid.bidder.name ?? bid.bidder.email ?? "Bidder";
      return {
        id: bid.id,
        amount: bid.amount,
        status: bid.status,
        statusLabel: BID_STATUS_LABELS[bid.status as BidStatus] ?? bid.status,
        bidderLabel,
        createdAt: bid.createdAt.toISOString(),
        timeAgo: formatTimeAgo(bid.createdAt.toISOString()),
        rejectedReason: bid.rejectedReason,
        sequence: bid.sequence,
      };
    }),
    events: auction.events.map((event) => ({
      id: event.id,
      type: event.type,
      label: getAuctionEventLabel(event.type as AuctionEventType),
      message: event.message ?? event.adminNote,
      actorName: null,
      createdAt: event.createdAt.toISOString(),
      timeAgo: formatTimeAgo(event.createdAt.toISOString()),
    })),
  };
}

export async function getListingAuctionSetup(
  listingId: string,
): Promise<ListingAuctionSetupView | null> {
  const listing = await prisma.aircraftListing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      registration: true,
      make: true,
      model: true,
      year: true,
      status: true,
      saleType: true,
      startingBid: true,
      reservePrice: true,
      bidIncrement: true,
    },
  });

  if (!listing) return null;

  const activeAuction = await prisma.auction.findFirst({
    where: {
      listingId,
      status: { in: [...ACTIVE_AUCTION_STATUSES] },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true },
  });

  const latestClosed = activeAuction
    ? null
    : await prisma.auction.findFirst({
        where: { listingId, status: AuctionStatus.CLOSED },
        orderBy: { closedAt: "desc" },
        select: { id: true, status: true },
      });

  const displayAuction = activeAuction ?? latestClosed;

  let canCreate = false;
  let createBlockReason: string | null = null;

  if (listing.saleType !== SaleType.AUCTION) {
    createBlockReason = "Listing sale type must be auction.";
  } else if (listing.status !== ListingStatus.APPROVED_FOR_LISTING) {
    createBlockReason = "Listing must be approved for listing before creating an auction.";
  } else if (activeAuction) {
    createBlockReason = "This listing already has an active auction.";
  } else if (!listing.startingBid || !listing.reservePrice || !listing.bidIncrement) {
    createBlockReason = "Listing is missing auction pricing from seller intake.";
  } else {
    canCreate = true;
  }

  return {
    listing: {
      id: listing.id,
      registration: listing.registration,
      title: aircraftTitle(listing.year, listing.make, listing.model),
      status: listing.status as ListingStatus,
      saleType: listing.saleType,
      startingBid: listing.startingBid,
      reservePrice: listing.reservePrice,
      bidIncrement: listing.bidIncrement,
      href: `/dashboard/listings/${listing.id}`,
    },
    activeAuction: displayAuction
      ? {
          id: displayAuction.id,
          status: displayAuction.status as AuctionStatus,
          detailHref: `/dashboard/auctions/${displayAuction.id}`,
        }
      : null,
    canCreate,
    createBlockReason,
  };
}
