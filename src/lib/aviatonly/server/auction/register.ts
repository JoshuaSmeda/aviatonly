import { AuctionEventType, AuctionRegistrationStatus } from "@prisma/client";
import { BuyerVerificationStatus } from "@/lib/aviatonly/domain/lead-enums";
import { canRegisterForAuction } from "@/lib/aviatonly/domain/auction-logic";
import { mapAuctionToDomain, auctionIncludeListing } from "@/lib/aviatonly/server/auction/auction-mappers";
import { buildBidderContext, loadBidderUser } from "@/lib/aviatonly/server/auction/bidder-context";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

export interface RegisterForAuctionResult {
  registrationId: string;
  status: AuctionRegistrationStatus;
  paddleNumber: number | null;
}

export async function registerForAuctionRecord(
  auctionId: string,
  userId: string,
  termsVersion = "2026-06-01",
): Promise<RegisterForAuctionResult> {
  const user = await loadBidderUser(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: auctionIncludeListing,
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  const bidder = await buildBidderContext(user);
  const domain = mapAuctionToDomain(auction);
  const now = new Date();

  const decision = canRegisterForAuction(domain, bidder, { now });
  if (!decision.allowed) {
    throw new Error(decision.reason ?? "Cannot register for this auction.");
  }

  const existing = await prisma.auctionRegistration.findUnique({
    where: { auctionId_userId: { auctionId, userId } },
  });

  if (existing) {
    if (existing.status === AuctionRegistrationStatus.REVOKED) {
      throw new Error("Your registration was revoked. Contact AVIATONLY ops.");
    }
    return {
      registrationId: existing.id,
      status: existing.status,
      paddleNumber: existing.paddleNumber,
    };
  }

  return prisma.$transaction(async (tx) => {
    const maxPaddle = await tx.auctionRegistration.aggregate({
      where: { auctionId },
      _max: { paddleNumber: true },
    });
    const paddleNumber = (maxPaddle._max.paddleNumber ?? 0) + 1;

    const registration = await tx.auctionRegistration.create({
      data: {
        auctionId,
        userId,
        status: AuctionRegistrationStatus.APPROVED,
        termsAcceptedAt: now,
        termsVersion,
        verificationAtRegistration:
          bidder.verificationStatus as BuyerVerificationStatus,
        paddleNumber,
        approvedAt: now,
      },
    });

    await tx.auctionEvent.create({
      data: {
        auctionId,
        type: AuctionEventType.ADMIN_NOTE,
        actorId: userId,
        message: "Buyer registered to bid.",
        metadata: { registrationId: registration.id, paddleNumber, event: "REGISTRATION_APPROVED" },
      },
    });

    return {
      registrationId: registration.id,
      status: registration.status,
      paddleNumber: registration.paddleNumber,
    };
  });
}
