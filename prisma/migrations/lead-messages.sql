-- AVIATONLY lead messaging (apply after prisma db push or migrate).
-- Run manually against your database if not using migrate dev.

ALTER TYPE "LeadActivityType" ADD VALUE IF NOT EXISTS 'MESSAGE_SENT';

ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "lastMessageAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sellerLastReadAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "buyerLastReadAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "LeadMessage" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "LeadMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LeadMessage_leadId_createdAt_idx"
  ON "LeadMessage"("leadId", "createdAt");

CREATE INDEX IF NOT EXISTS "LeadMessage_senderId_idx"
  ON "LeadMessage"("senderId");

ALTER TABLE "LeadMessage"
  DROP CONSTRAINT IF EXISTS "LeadMessage_leadId_fkey";

ALTER TABLE "LeadMessage"
  ADD CONSTRAINT "LeadMessage_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadMessage"
  DROP CONSTRAINT IF EXISTS "LeadMessage_senderId_fkey";

ALTER TABLE "LeadMessage"
  ADD CONSTRAINT "LeadMessage_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
