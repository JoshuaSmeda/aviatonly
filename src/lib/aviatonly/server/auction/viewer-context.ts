import { AuctionRegistrationStatus } from "@/lib/aviatonly/domain/auction-enums";
import {
  canPlaceBid,
  canRegisterForAuction,
  calculateMinimumNextBid,
} from "@/lib/aviatonly/domain/auction-logic";
import type { AuctionViewerContext } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { mapAuctionToDomain, auctionIncludeListing } from "@/lib/aviatonly/server/auction/auction-mappers";
import { buildBidderContext, loadBidderUser } from "@/lib/aviatonly/server/auction/bidder-context";
import { prisma } from "@/lib/prisma";

const unauthenticatedViewer: AuctionViewerContext = {
  isAuthenticated: false,
  registrationStatus: null,
  isRegistered: false,
  canRegister: false,
  canBid: false,
  isHighBidder: false,
};

export async function buildAuctionViewerContext(
  auctionId: string,
  userId: string | null,
): Promise<AuctionViewerContext> {
  if (!userId) {
    return unauthenticatedViewer;
  }

  const user = await loadBidderUser(userId);
  if (!user) {
    return unauthenticatedViewer;
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    return unauthenticatedViewer;
  }

  const domain = mapAuctionToDomain(auction);
  const bidder = await buildBidderContext(user);
  const clock = { now: new Date() };

  const registration = await prisma.auctionRegistration.findUnique({
    where: { auctionId_userId: { auctionId, userId } },
    select: { status: true, paddleNumber: true },
  });

  const registrationStatus = (registration?.status as AuctionRegistrationStatus | undefined) ?? null;
  const isRegistered = registrationStatus === AuctionRegistrationStatus.APPROVED;

  const registerDecision = canRegisterForAuction(domain, bidder, clock);
  const minimumNextBid = calculateMinimumNextBid(
    domain.startingBid,
    domain.bidIncrement,
    domain.currentHighBidAmount,
  );

  const placeBidDecision = canPlaceBid(
    domain,
    bidder,
    registration
      ? { userId, status: registration.status as AuctionRegistrationStatus }
      : null,
    minimumNextBid,
    clock,
  );

  const canRegister =
    !isRegistered &&
    registrationStatus !== AuctionRegistrationStatus.REVOKED &&
    registrationStatus !== AuctionRegistrationStatus.DENIED &&
    registerDecision.allowed;

  const isHighBidder =
    domain.currentHighBidderId !== null && domain.currentHighBidderId === userId;

  return {
    isAuthenticated: true,
    registrationStatus,
    isRegistered,
    canRegister,
    canBid: !isHighBidder && placeBidDecision.allowed,
    isHighBidder,
    registerBlockedReason:
      !isRegistered && !canRegister ? registerDecision.reason : undefined,
    bidBlockedReason:
      isHighBidder
        ? "You are already the highest bidder."
        : isRegistered && !placeBidDecision.allowed
          ? placeBidDecision.reason
          : undefined,
    verificationStatus: bidder.verificationStatus,
    paddleNumber: registration?.paddleNumber ?? null,
  };
}
