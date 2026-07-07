import { AuctionBidderDisplayMode } from "@/lib/aviatonly/domain/auction-enums";
import { BidStatus } from "@/lib/aviatonly/domain/bid-status";
import type { PublicAuctionBidHistoryEntry } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { formatTimeAgo } from "@/lib/aviatonly/mock/format";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

const PUBLIC_BID_STATUSES: BidStatus[] = [
  BidStatus.ACCEPTED,
  BidStatus.SUPERSEDED,
  BidStatus.WINNING_AT_CLOSE,
  BidStatus.BINDING,
];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatPublicBidderLabel(
  mode: AuctionBidderDisplayMode,
  options: {
    paddleNumber: number | null;
    bidderName: string | null;
    bidderId: string;
    viewerUserId: string | null;
  },
): string {
  if (options.viewerUserId && options.bidderId === options.viewerUserId) {
    return "You";
  }

  switch (mode) {
    case AuctionBidderDisplayMode.ANONYMOUS:
      return "Registered bidder";
    case AuctionBidderDisplayMode.PADDLE_NUMBER:
      return options.paddleNumber != null
        ? `Paddle #${options.paddleNumber}`
        : "Registered bidder";
    case AuctionBidderDisplayMode.VERIFIED_INITIALS:
      if (options.bidderName) {
        return initialsFromName(options.bidderName);
      }
      return options.paddleNumber != null
        ? `Paddle #${options.paddleNumber}`
        : "Registered bidder";
    default:
      return "Registered bidder";
  }
}

function mapBidStatusLabel(status: BidStatus): string {
  switch (status) {
    case BidStatus.ACCEPTED:
      return "Accepted";
    case BidStatus.SUPERSEDED:
      return "Outbid";
    case BidStatus.WINNING_AT_CLOSE:
      return "Winning at close";
    case BidStatus.BINDING:
      return "Binding";
    case BidStatus.REJECTED:
      return "Not accepted";
    default:
      return status;
  }
}

export async function getPublicAuctionBidHistoryRecord(
  auctionId: string,
  viewerUserId: string | null = null,
): Promise<PublicAuctionBidHistoryEntry[]> {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    select: {
      showBidHistory: true,
      bidderDisplayMode: true,
      currentHighBidId: true,
      registrations: {
        select: { userId: true, paddleNumber: true },
      },
    },
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  if (!auction.showBidHistory) {
    return [];
  }

  const paddleByUserId = new Map(
    auction.registrations
      .filter((registration) => registration.paddleNumber != null)
      .map((registration) => [registration.userId, registration.paddleNumber!]),
  );

  const bids = await prisma.bid.findMany({
    where: {
      auctionId,
      OR: [
        { status: { in: PUBLIC_BID_STATUSES } },
        ...(viewerUserId
          ? [{ status: BidStatus.REJECTED, bidderId: viewerUserId }]
          : []),
      ],
    },
    orderBy: [{ sequence: "desc" }],
    take: 50,
    select: {
      id: true,
      amount: true,
      status: true,
      sequence: true,
      createdAt: true,
      bidderId: true,
      paddleNumber: true,
      bidder: { select: { name: true } },
    },
  });

  return bids.map((bid) => {
    const paddleNumber = bid.paddleNumber ?? paddleByUserId.get(bid.bidderId) ?? null;
    const status = bid.status as BidStatus;

    return {
      id: bid.id,
      sequence: bid.sequence,
      amount: bid.amount,
      bidderLabel: formatPublicBidderLabel(
        auction.bidderDisplayMode as AuctionBidderDisplayMode,
        {
          paddleNumber,
          bidderName: bid.bidder.name,
          bidderId: bid.bidderId,
          viewerUserId,
        },
      ),
      createdAt: bid.createdAt.toISOString(),
      timeAgo: formatTimeAgo(bid.createdAt.toISOString()),
      status,
      statusLabel: mapBidStatusLabel(status),
      isViewerBid: viewerUserId === bid.bidderId,
      isHighBid: auction.currentHighBidId === bid.id,
    };
  });
}
