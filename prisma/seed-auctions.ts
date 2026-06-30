/**
 * Seeds realistic AVIATONLY auction demo data.
 * Monetary values: whole ZAR (Int), matching Offer.amount convention.
 */
import {
  AuctionBidderDisplayMode,
  AuctionCloseOutcome,
  AuctionEventType,
  AuctionRegistrationStatus,
  AuctionStatus,
  BidStatus,
  BuyerVerificationStatus,
  DealSource,
  DealStatus,
  LeadSource,
  LeadStatus,
  LeadType,
  ListingStatus,
  SaleType,
} from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

const AUCTION_REGISTRATIONS = [
  "ZS-BON",
  "ZS-SKY",
  "ZS-MLB",
  "ZS-R44",
] as const;

function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function daysFromNow(days: number): Date {
  return hoursFromNow(days * 24);
}

function hoursAgo(hours: number): Date {
  return hoursFromNow(-hours);
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

export async function seedAuctions(
  prisma: PrismaClient,
  userIdByMockId: Map<string, string>,
): Promise<void> {
  const sellerId = userIdByMockId.get("user-seller-demo");
  const adminId = userIdByMockId.get("user-admin-reviewer");
  const marcusId = userIdByMockId.get("user-buyer-marcus");
  const sarahId = userIdByMockId.get("user-buyer-sarah");
  const peterId = userIdByMockId.get("user-buyer-peter");
  const jamesId = userIdByMockId.get("user-buyer-james");

  if (!sellerId || !adminId || !marcusId || !sarahId || !peterId || !jamesId) {
    console.warn("Skipping auction seed — required demo users not found.");
    return;
  }

  // Clear auction graph (order respects FKs).
  await prisma.auctionEvent.deleteMany();
  await prisma.auctionWatch.deleteMany();
  await prisma.deal.deleteMany({ where: { source: DealSource.AUCTION } });
  await prisma.lead.deleteMany({
    where: { source: LeadSource.AUCTION },
  });

  const auctionListings = await prisma.aircraftListing.findMany({
    where: { registration: { in: [...AUCTION_REGISTRATIONS] } },
    select: { id: true, registration: true },
  });

  if (auctionListings.length > 0) {
    const listingIds = auctionListings.map((l) => l.id);
    const auctions = await prisma.auction.findMany({
      where: { listingId: { in: listingIds } },
      select: { id: true },
    });
    const auctionIds = auctions.map((a) => a.id);

    if (auctionIds.length > 0) {
      await prisma.auction.updateMany({
        where: { id: { in: auctionIds } },
        data: {
          currentHighBidId: null,
          winningBidId: null,
          secondChanceBidId: null,
        },
      });
      await prisma.bid.deleteMany({ where: { auctionId: { in: auctionIds } } });
      await prisma.auctionRegistration.deleteMany({
        where: { auctionId: { in: auctionIds } },
      });
      await prisma.auction.deleteMany({ where: { id: { in: auctionIds } } });
    }
  }

  const auctionListingDefs = [
    {
      registration: "ZS-BON",
      make: "Beechcraft",
      model: "G36 Bonanza",
      year: 2014,
      category: "Single-Engine Piston",
      airfield: "FAOR — OR Tambo Intl",
      province: "Gauteng",
      status: ListingStatus.LIVE_AUCTION,
      startingBid: 3_500_000,
      reservePrice: 4_200_000,
      bidIncrement: 50_000,
      valuationEstimate: 4_500_000,
    },
    {
      registration: "ZS-SKY",
      make: "Cessna",
      model: "182T Skylane",
      year: 2008,
      category: "Single-Engine Piston",
      airfield: "FAGC — Grand Central",
      province: "Gauteng",
      status: ListingStatus.LIVE_AUCTION,
      startingBid: 1_850_000,
      reservePrice: 2_400_000,
      bidIncrement: 25_000,
      valuationEstimate: 2_350_000,
    },
    {
      registration: "ZS-MLB",
      make: "Piper",
      model: "PA-46-350P Malibu",
      year: 2012,
      category: "Single-Engine Piston",
      airfield: "FACT — Cape Town Intl",
      province: "Western Cape",
      status: ListingStatus.UNDER_OFFER,
      startingBid: 4_800_000,
      reservePrice: 5_500_000,
      bidIncrement: 100_000,
      valuationEstimate: 6_100_000,
    },
    {
      registration: "ZS-R44",
      make: "Robinson",
      model: "R44 Raven II",
      year: 2018,
      category: "Helicopter",
      airfield: "FALA — Lanseria",
      province: "Gauteng",
      status: ListingStatus.APPROVED_FOR_LISTING,
      startingBid: 2_800_000,
      reservePrice: 3_800_000,
      bidIncrement: 50_000,
      valuationEstimate: 3_600_000,
    },
  ] as const;

  const listingIdByReg = new Map<string, string>();

  for (const def of auctionListingDefs) {
    const listing = await prisma.aircraftListing.upsert({
      where: { registration: def.registration },
      update: {
        make: def.make,
        model: def.model,
        year: def.year,
        category: def.category,
        airfield: def.airfield,
        province: def.province,
        status: def.status,
        saleType: SaleType.AUCTION,
        startingBid: def.startingBid,
        reservePrice: def.reservePrice,
        bidIncrement: def.bidIncrement,
        valuationEstimate: def.valuationEstimate,
        askingPrice: null,
        completenessScore: 100,
        sellerId,
      },
      create: {
        registration: def.registration,
        registrationType: "ZS",
        make: def.make,
        model: def.model,
        year: def.year,
        category: def.category,
        airfield: def.airfield,
        province: def.province,
        ownerName: "Johan van der Merwe",
        sellerRole: "Registered owner",
        authorisedToSell: true,
        saleType: SaleType.AUCTION,
        startingBid: def.startingBid,
        reservePrice: def.reservePrice,
        bidIncrement: def.bidIncrement,
        valuationEstimate: def.valuationEstimate,
        status: def.status,
        completenessScore: 100,
        sellerId,
      },
    });
    listingIdByReg.set(def.registration, listing.id);
  }

  // --- 1. Scheduled auction: Beechcraft Bonanza ---
  const bonStarts = daysFromNow(3);
  const bonEnds = daysFromNow(7);
  const bonAuction = await prisma.auction.create({
    data: {
      listingId: listingIdByReg.get("ZS-BON")!,
      status: AuctionStatus.SCHEDULED,
      startsAt: bonStarts,
      endsAt: bonEnds,
      effectiveEndsAt: bonEnds,
      startingBid: 3_500_000,
      bidIncrement: 50_000,
      reservePrice: 4_200_000,
      showReserveStatus: false,
      showReservePrice: false,
      buyerPremiumBps: 500,
      configuredById: adminId,
      bidderDisplayMode: AuctionBidderDisplayMode.PADDLE_NUMBER,
      events: {
        create: {
          type: AuctionEventType.AUCTION_SCHEDULED,
          actorId: adminId,
          message: "ZS-BON Bonanza auction scheduled for AVIATONLY timed sale.",
          metadata: { registration: "ZS-BON" },
        },
      },
    },
  });

  await seedRegistrations(prisma, bonAuction.id, [
    { userId: marcusId, paddle: 1, verification: BuyerVerificationStatus.VERIFIED },
    { userId: sarahId, paddle: 2, verification: BuyerVerificationStatus.VERIFIED },
  ]);

  await prisma.auctionWatch.createMany({
    data: [
      { userId: marcusId, auctionId: bonAuction.id },
      { userId: peterId, auctionId: bonAuction.id },
    ],
  });

  // --- 2. Live auction: Cessna 182T with active bidding ---
  const skyStart = daysAgo(2);
  const skyEnd = daysFromNow(2);
  const skyAuction = await prisma.auction.create({
    data: {
      listingId: listingIdByReg.get("ZS-SKY")!,
      status: AuctionStatus.LIVE,
      startsAt: skyStart,
      endsAt: skyEnd,
      effectiveEndsAt: hoursFromNow(6),
      openedAt: skyStart,
      startingBid: 1_850_000,
      bidIncrement: 25_000,
      reservePrice: 2_400_000,
      showReserveStatus: true,
      reserveMet: false,
      buyerPremiumBps: 500,
      extensionCount: 1,
      configuredById: adminId,
      events: {
        create: [
          {
            type: AuctionEventType.AUCTION_OPENED,
            actorId: adminId,
            message: "ZS-SKY Skylane auction is live.",
          },
          {
            type: AuctionEventType.AUCTION_EXTENDED,
            actorId: null,
            message: "Auction extended by 5 minutes after late bid.",
            metadata: { extensionCount: 1 },
          },
        ],
      },
    },
  });

  await seedRegistrations(prisma, skyAuction.id, [
    { userId: marcusId, paddle: 1, verification: BuyerVerificationStatus.VERIFIED },
    { userId: sarahId, paddle: 2, verification: BuyerVerificationStatus.VERIFIED },
    { userId: peterId, paddle: 3, verification: BuyerVerificationStatus.VERIFIED },
    { userId: jamesId, paddle: 4, verification: BuyerVerificationStatus.PENDING },
  ]);

  const skyBids = await createBids(prisma, skyAuction.id, [
    { bidderId: marcusId, amount: 1_850_000, sequence: 1, paddle: 1, status: BidStatus.SUPERSEDED, hoursAgo: 36 },
    { bidderId: sarahId, amount: 1_900_000, sequence: 2, paddle: 2, status: BidStatus.SUPERSEDED, hoursAgo: 28 },
    { bidderId: peterId, amount: 1_975_000, sequence: 3, paddle: 3, status: BidStatus.SUPERSEDED, hoursAgo: 12 },
    { bidderId: marcusId, amount: 2_050_000, sequence: 4, paddle: 1, status: BidStatus.ACCEPTED, hoursAgo: 2 },
  ]);

  await prisma.auction.update({
    where: { id: skyAuction.id },
    data: {
      currentHighBidId: skyBids[3].id,
      currentHighBidAmount: 2_050_000,
      bidCount: 4,
      reserveMet: false,
    },
  });

  await prisma.auctionWatch.createMany({
    data: [
      { userId: jamesId, auctionId: skyAuction.id },
      { userId: sarahId, auctionId: skyAuction.id },
    ],
  });

  // --- 3. Ended auction, reserve met: Piper Malibu ---
  const mlbStart = daysAgo(10);
  const mlbEnd = daysAgo(5);
  const mlbAuction = await prisma.auction.create({
    data: {
      listingId: listingIdByReg.get("ZS-MLB")!,
      status: AuctionStatus.CLOSED,
      closeOutcome: AuctionCloseOutcome.RESERVE_MET,
      startsAt: mlbStart,
      endsAt: mlbEnd,
      effectiveEndsAt: mlbEnd,
      openedAt: mlbStart,
      closedAt: mlbEnd,
      startingBid: 4_800_000,
      bidIncrement: 100_000,
      reservePrice: 5_500_000,
      showReserveStatus: true,
      reserveMet: true,
      buyerPremiumBps: 500,
      winnerId: sarahId,
      winnerConfirmedAt: daysAgo(4),
      configuredById: adminId,
      events: {
        create: {
          type: AuctionEventType.AUCTION_CLOSED,
          actorId: adminId,
          message: "ZS-MLB Malibu auction closed — reserve met.",
          metadata: { closeOutcome: "RESERVE_MET" },
        },
      },
    },
  });

  await seedRegistrations(prisma, mlbAuction.id, [
    { userId: marcusId, paddle: 1, verification: BuyerVerificationStatus.VERIFIED },
    { userId: sarahId, paddle: 2, verification: BuyerVerificationStatus.VERIFIED },
    { userId: peterId, paddle: 3, verification: BuyerVerificationStatus.VERIFIED },
  ]);

  const mlbBids = await createBids(prisma, mlbAuction.id, [
    { bidderId: marcusId, amount: 5_200_000, sequence: 1, paddle: 1, status: BidStatus.SUPERSEDED, hoursAgo: 10 * 24 },
    { bidderId: peterId, amount: 5_400_000, sequence: 2, paddle: 3, status: BidStatus.SUPERSEDED, hoursAgo: 8 * 24 },
    { bidderId: sarahId, amount: 5_800_000, sequence: 3, paddle: 2, status: BidStatus.BINDING, hoursAgo: 5 * 24 },
  ]);

  await prisma.auction.update({
    where: { id: mlbAuction.id },
    data: {
      currentHighBidId: mlbBids[2].id,
      winningBidId: mlbBids[2].id,
      currentHighBidAmount: 5_800_000,
      bidCount: 3,
    },
  });

  const hammerPrice = 5_800_000;
  const buyerPremiumBps = 500;
  const buyerPremiumAmount = Math.round((hammerPrice * buyerPremiumBps) / 10_000);
  const commissionAmount = Math.round(hammerPrice * 0.025);
  const vatAmount = Math.round(commissionAmount * 0.15);

  await prisma.deal.create({
    data: {
      listingId: listingIdByReg.get("ZS-MLB")!,
      buyerId: sarahId,
      sellerId,
      source: DealSource.AUCTION,
      acceptedBidId: mlbBids[2].id,
      auctionId: mlbAuction.id,
      agreedPrice: hammerPrice,
      hammerPrice,
      buyerPremiumAmount,
      buyerPremiumBps,
      commissionAmount,
      vatAmount,
      currency: "ZAR",
      status: DealStatus.OFFER_ACCEPTED,
      nextAction: "AVIATONLY ops to confirm buyer FICA and issue sale agreement.",
    },
  });

  // --- 4. Ended auction, reserve not met: Robinson R44 ---
  const r44Start = daysAgo(8);
  const r44End = daysAgo(3);
  const r44Auction = await prisma.auction.create({
    data: {
      listingId: listingIdByReg.get("ZS-R44")!,
      status: AuctionStatus.CLOSED,
      closeOutcome: AuctionCloseOutcome.RESERVE_NOT_MET,
      startsAt: r44Start,
      endsAt: r44End,
      effectiveEndsAt: r44End,
      openedAt: r44Start,
      closedAt: r44End,
      startingBid: 2_800_000,
      bidIncrement: 50_000,
      reservePrice: 3_800_000,
      showReserveStatus: true,
      reserveMet: false,
      currentHighBidAmount: 3_200_000,
      bidCount: 4,
      buyerPremiumBps: 500,
      configuredById: adminId,
      events: {
        create: {
          type: AuctionEventType.AUCTION_CLOSED,
          actorId: adminId,
          message: "ZS-R44 R44 auction closed — reserve not met.",
          metadata: { closeOutcome: "RESERVE_NOT_MET", highBid: 3_200_000 },
        },
      },
    },
  });

  await seedRegistrations(prisma, r44Auction.id, [
    { userId: marcusId, paddle: 1, verification: BuyerVerificationStatus.VERIFIED },
    { userId: peterId, paddle: 2, verification: BuyerVerificationStatus.VERIFIED },
  ]);

  const r44Bids = await createBids(prisma, r44Auction.id, [
    { bidderId: marcusId, amount: 2_800_000, sequence: 1, paddle: 1, status: BidStatus.SUPERSEDED, hoursAgo: 7 * 24 },
    { bidderId: peterId, amount: 2_950_000, sequence: 2, paddle: 2, status: BidStatus.SUPERSEDED, hoursAgo: 6 * 24 },
    { bidderId: marcusId, amount: 3_100_000, sequence: 3, paddle: 1, status: BidStatus.SUPERSEDED, hoursAgo: 4 * 24 },
    { bidderId: peterId, amount: 3_200_000, sequence: 4, paddle: 2, status: BidStatus.WINNING_AT_CLOSE, hoursAgo: 3 * 24 },
  ]);

  await prisma.auction.update({
    where: { id: r44Auction.id },
    data: {
      currentHighBidId: r44Bids[3].id,
      winningBidId: r44Bids[3].id,
      winnerId: peterId,
    },
  });

  await prisma.lead.create({
    data: {
      listingId: listingIdByReg.get("ZS-R44")!,
      buyerId: peterId,
      sellerId,
      type: LeadType.GENERAL_ENQUIRY,
      status: LeadStatus.NEW,
      source: LeadSource.AUCTION,
      message:
        "Highest bidder on ZS-R44 R44 auction — reserve not met. AVIATONLY ops to discuss next steps with seller.",
      buyerVerificationStatus: BuyerVerificationStatus.VERIFIED,
      auctionId: r44Auction.id,
    },
  });

  await prisma.auctionWatch.create({
    data: { userId: marcusId, auctionId: r44Auction.id },
  });

  const auctionCount = await prisma.auction.count();
  const bidCount = await prisma.bid.count();
  const regCount = await prisma.auctionRegistration.count();
  const watchCount = await prisma.auctionWatch.count();

  console.log(
    `Auction seed: ${auctionCount} auctions, ${bidCount} bids, ${regCount} registrations, ${watchCount} watches.`,
  );
}

type RegInput = {
  userId: string;
  paddle: number;
  verification: BuyerVerificationStatus;
};

async function seedRegistrations(
  prisma: PrismaClient,
  auctionId: string,
  registrants: RegInput[],
) {
  for (const reg of registrants) {
    await prisma.auctionRegistration.create({
      data: {
        auctionId,
        userId: reg.userId,
        status: AuctionRegistrationStatus.APPROVED,
        termsAcceptedAt: daysAgo(7),
        termsVersion: "2026-06-01",
        verificationAtRegistration: reg.verification,
        paddleNumber: reg.paddle,
        approvedAt: daysAgo(7),
      },
    });
  }
}

type BidInput = {
  bidderId: string;
  amount: number;
  sequence: number;
  paddle: number;
  status: BidStatus;
  hoursAgo: number;
};

async function createBids(
  prisma: PrismaClient,
  auctionId: string,
  bids: BidInput[],
) {
  const created: { id: string }[] = [];
  for (const bid of bids) {
    const record = await prisma.bid.create({
      data: {
        auctionId,
        bidderId: bid.bidderId,
        amount: bid.amount,
        status: bid.status,
        sequence: bid.sequence,
        paddleNumber: bid.paddle,
        createdAt: hoursAgo(bid.hoursAgo),
      },
    });
    created.push(record);

    await prisma.auctionEvent.create({
      data: {
        auctionId,
        type: AuctionEventType.BID_PLACED,
        actorId: bid.bidderId,
        message: `Bid placed: R ${bid.amount.toLocaleString("en-ZA")}`,
        metadata: { bidId: record.id, amount: bid.amount, sequence: bid.sequence },
        createdAt: hoursAgo(bid.hoursAgo),
      },
    });
  }
  return created;
}
