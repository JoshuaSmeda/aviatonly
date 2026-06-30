import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { prisma } from "@/lib/prisma";

export async function watchAuctionRecord(userId: string, auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    select: { id: true },
  });

  if (!auction) {
    throw new NotFoundError("Auction not found.");
  }

  return prisma.auctionWatch.upsert({
    where: { userId_auctionId: { userId, auctionId } },
    create: { userId, auctionId },
    update: {},
  });
}

export async function unwatchAuctionRecord(userId: string, auctionId: string) {
  await prisma.auctionWatch.deleteMany({
    where: { userId, auctionId },
  });
}

export async function isWatchingAuctionRecord(userId: string, auctionId: string) {
  const watch = await prisma.auctionWatch.findUnique({
    where: { userId_auctionId: { userId, auctionId } },
    select: { id: true },
  });
  return watch !== null;
}
