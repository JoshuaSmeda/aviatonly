-- Link intake drafts to sellers and listings (run once against your database).
-- Or use: npm run db:push

ALTER TABLE "ListingDraft" ADD COLUMN IF NOT EXISTS "sellerId" TEXT;
ALTER TABLE "ListingDraft" ADD COLUMN IF NOT EXISTS "listingId" TEXT;

-- Remove orphaned drafts from before seller scoping (optional).
DELETE FROM "ListingDraft" WHERE "sellerId" IS NULL;

ALTER TABLE "ListingDraft" ALTER COLUMN "sellerId" SET NOT NULL;

ALTER TABLE "ListingDraft"
  ADD CONSTRAINT "ListingDraft_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ListingDraft"
  ADD CONSTRAINT "ListingDraft_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "AircraftListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "ListingDraft_sellerId_updatedAt_idx" ON "ListingDraft"("sellerId", "updatedAt");
CREATE INDEX IF NOT EXISTS "ListingDraft_sellerId_listingId_idx" ON "ListingDraft"("sellerId", "listingId");
