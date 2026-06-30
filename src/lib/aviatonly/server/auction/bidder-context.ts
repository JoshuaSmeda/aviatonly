import { BuyerVerificationStatus } from "@/lib/aviatonly/domain/lead-enums";
import type { AuctionBidderContext } from "@/lib/aviatonly/domain/auction-types";
import { prisma } from "@/lib/prisma";

const VERIFICATION_RANK: Record<BuyerVerificationStatus, number> = {
  [BuyerVerificationStatus.UNVERIFIED]: 0,
  [BuyerVerificationStatus.PENDING]: 1,
  [BuyerVerificationStatus.VERIFIED]: 2,
};

export async function resolveBuyerVerificationStatus(
  userId: string,
): Promise<BuyerVerificationStatus> {
  const leads = await prisma.lead.findMany({
    where: { buyerId: userId },
    select: { buyerVerificationStatus: true },
  });

  if (leads.length === 0) {
    return BuyerVerificationStatus.UNVERIFIED;
  }

  let best = BuyerVerificationStatus.UNVERIFIED;
  for (const lead of leads) {
    const status = lead.buyerVerificationStatus as BuyerVerificationStatus;
    if (VERIFICATION_RANK[status] > VERIFICATION_RANK[best]) {
      best = status;
    }
  }
  return best;
}

export async function buildBidderContext(user: {
  id: string;
  roles: readonly string[];
  buyerBidBlockedAt: Date | null;
}): Promise<AuctionBidderContext> {
  const verificationStatus = await resolveBuyerVerificationStatus(user.id);
  return {
    userId: user.id,
    roles: user.roles,
    buyerBidBlockedAt: user.buyerBidBlockedAt,
    verificationStatus,
  };
}

export async function loadBidderUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      roles: true,
      buyerBidBlockedAt: true,
    },
  });
}
