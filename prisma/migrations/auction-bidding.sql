-- AVIATONLY auction bidding constraints (apply after prisma db push).
-- Run manually against your database if not using migrate dev.

-- Deal must reference exactly one of offer or bid.
ALTER TABLE "Deal" ALTER COLUMN "acceptedOfferId" DROP NOT NULL;

ALTER TABLE "Deal" DROP CONSTRAINT IF EXISTS "deal_offer_or_bid_xor";
ALTER TABLE "Deal" ADD CONSTRAINT "deal_offer_or_bid_xor"
  CHECK (
    ("acceptedOfferId" IS NOT NULL AND "acceptedBidId" IS NULL)
    OR ("acceptedOfferId" IS NULL AND "acceptedBidId" IS NOT NULL)
  );

-- Only one active auction per listing at a time.
CREATE UNIQUE INDEX IF NOT EXISTS "Auction_one_active_per_listing"
ON "Auction" ("listingId")
WHERE "status" IN ('DRAFT', 'SCHEDULED', 'LIVE', 'CLOSING');

-- Scheduled end must be after start.
ALTER TABLE "Auction" DROP CONSTRAINT IF EXISTS "auction_ends_after_starts";
ALTER TABLE "Auction" ADD CONSTRAINT "auction_ends_after_starts"
  CHECK ("endsAt" > "startsAt");
