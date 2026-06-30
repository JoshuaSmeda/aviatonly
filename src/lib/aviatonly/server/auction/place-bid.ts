import { AuctionRegistrationStatus as DomainAuctionRegistrationStatus } from "@/lib/aviatonly/domain/auction-enums";
import { AuctionStatus } from "@/lib/aviatonly/domain/auction-status";
import {
  AuctionEventType,
  BidRejectedReason,
  BidStatus,
} from "@prisma/client";
import {
  canPlaceBid,
  calculateExtendedEndTime,
  getPublicAuctionState,
  hasReserveBeenMet,
  shouldExtendAuctionForAntiSniping,
} from "@/lib/aviatonly/domain/auction-logic";
import type { PublicAuctionState } from "@/lib/aviatonly/domain/auction-types";
import { mapAuctionToDomain } from "@/lib/aviatonly/server/auction/auction-mappers";
import {
  getServerClock,
  lockAuctionRow,
} from "@/lib/aviatonly/server/auction/auction-db";
import {
  buildBidderContext,
  loadBidderUser,
} from "@/lib/aviatonly/server/auction/bidder-context";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

export interface PlaceBidResult {
  accepted: boolean;
  reason?: string;
  code?: string;
  auction: PublicAuctionState;
  bidId?: string;
}

const MAX_BID_RETRIES = 2;

function mapRejectedReason(code: string | undefined): BidRejectedReason {
  if (!code) return BidRejectedReason.OTHER;
  if (Object.values(BidRejectedReason).includes(code as BidRejectedReason)) {
    return code as BidRejectedReason;
  }
  return BidRejectedReason.OTHER;
}

async function placeBidOnce(
  auctionId: string,
  bidderId: string,
  amount: number,
): Promise<PlaceBidResult> {
  return prisma.$transaction(
    async (tx) => {
      const row = await lockAuctionRow(tx, auctionId);
      if (!row) {
        throw new NotFoundError("Auction not found.");
      }

      const now = await getServerClock(tx);
      const clock = { now };

      const user = await tx.user.findUnique({
        where: { id: bidderId },
        select: { id: true, roles: true, buyerBidBlockedAt: true },
      });
      if (!user) {
        throw new NotFoundError("User not found.");
      }

      const bidder = await buildBidderContext(user);

      const registration = await tx.auctionRegistration.findUnique({
        where: { auctionId_userId: { auctionId, userId: bidderId } },
        select: { userId: true, status: true, paddleNumber: true },
      });

      const domain = mapAuctionToDomain({
        ...row,
        listing: { sellerId: row.sellerId },
      });

      const decision = canPlaceBid(
        domain,
        bidder,
        registration
          ? {
              userId: registration.userId,
              status: registration.status as DomainAuctionRegistrationStatus,
            }
          : null,
        amount,
        clock,
      );

      const sequence = row.bidCount + 1;

      if (!decision.allowed) {
        const rejected = await tx.bid.create({
          data: {
            auctionId,
            bidderId,
            amount,
            status: BidStatus.REJECTED,
            rejectedReason: mapRejectedReason(decision.code),
            sequence,
            paddleNumber: registration?.paddleNumber ?? null,
          },
        });

        await tx.auctionEvent.create({
          data: {
            auctionId,
            type: AuctionEventType.BID_REJECTED,
            actorId: bidderId,
            message: decision.reason ?? "Bid rejected.",
            metadata: {
              bidId: rejected.id,
              amount,
              code: decision.code ?? null,
            },
          },
        });

        return {
          accepted: false,
          reason: decision.reason,
          code: decision.code,
          auction: getPublicAuctionState(domain, clock),
          bidId: rejected.id,
        };
      }

      const priorHighBidId = row.currentHighBidId;

      const bid = await tx.bid.create({
        data: {
          auctionId,
          bidderId,
          amount,
          status: BidStatus.ACCEPTED,
          sequence,
          paddleNumber: registration?.paddleNumber ?? null,
        },
      });

      if (priorHighBidId) {
        await tx.bid.update({
          where: { id: priorHighBidId },
          data: { status: BidStatus.SUPERSEDED },
        });
      }

      let effectiveEndsAt = row.effectiveEndsAt;
      let extensionCount = row.extensionCount;

      const domainLive = { ...domain, status: AuctionStatus.LIVE as typeof domain.status };
      if (shouldExtendAuctionForAntiSniping(domainLive, clock)) {
        effectiveEndsAt = calculateExtendedEndTime(
          row.effectiveEndsAt,
          row.antiSnipeExtensionMinutes,
          clock,
        );
        extensionCount += 1;

        await tx.auctionEvent.create({
          data: {
            auctionId,
            type: AuctionEventType.AUCTION_EXTENDED,
            actorId: bidderId,
            message: "Auction extended after late bid.",
            metadata: {
              priorEndsAt: row.effectiveEndsAt.toISOString(),
              newEndsAt: effectiveEndsAt.toISOString(),
              extensionCount,
            },
          },
        });
      }

      const reserveMet = hasReserveBeenMet({
        reservePrice: row.reservePrice,
        noReserveConfirmed: row.noReserveConfirmed,
        currentHighBidAmount: amount,
      });

      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentHighBidId: bid.id,
          currentHighBidAmount: amount,
          bidCount: row.bidCount + 1,
          reserveMet,
          effectiveEndsAt,
          extensionCount,
        },
      });

      await tx.auctionEvent.create({
        data: {
          auctionId,
          type: AuctionEventType.BID_PLACED,
          actorId: bidderId,
          message: `Bid accepted: R ${amount.toLocaleString("en-ZA")}`,
          metadata: { bidId: bid.id, amount, sequence },
        },
      });

      if (priorHighBidId) {
        const prior = await tx.bid.findUnique({
          where: { id: priorHighBidId },
          select: { bidderId: true },
        });
        if (prior && prior.bidderId !== bidderId) {
          await tx.auctionEvent.create({
            data: {
              auctionId,
              type: AuctionEventType.ADMIN_NOTE,
              actorId: prior.bidderId,
              message: "You have been outbid.",
              metadata: { outbidByBidId: bid.id, newAmount: amount, event: "BID_OUTBID" },
            },
          });
        }
      }

      const updatedDomain = {
        ...domain,
        status: AuctionStatus.LIVE,
        currentHighBidAmount: amount,
        bidCount: row.bidCount + 1,
        reserveMet,
        effectiveEndsAt,
        extensionCount,
      };

      return {
        accepted: true,
        auction: getPublicAuctionState(updatedDomain, clock),
        bidId: bid.id,
      };
    },
    { isolationLevel: "Serializable", maxWait: 5000, timeout: 15_000 },
  );
}

export async function placeBidRecord(
  auctionId: string,
  bidderId: string,
  amount: number,
): Promise<PlaceBidResult> {
  const user = await loadBidderUser(bidderId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_BID_RETRIES; attempt += 1) {
    try {
      return await placeBidOnce(auctionId, bidderId, amount);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("could not serialize") && !message.includes("P2034")) {
        throw error;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Bid could not be processed.");
}
