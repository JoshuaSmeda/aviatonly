-- Better Auth organization plugin tables for AVIATONLY
-- Run in Supabase SQL editor, then: npx prisma db push && npx prisma generate

ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "activeOrganizationId" TEXT;

CREATE TABLE IF NOT EXISTS "Organization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logo" TEXT,
  "metadata" TEXT,
  "organizationType" TEXT DEFAULT 'SELLER',
  "province" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Organization_slug_key" ON "Organization"("slug");

CREATE TABLE IF NOT EXISTS "Member" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Member_organizationId_idx" ON "Member"("organizationId");
CREATE INDEX IF NOT EXISTS "Member_userId_idx" ON "Member"("userId");

CREATE TABLE IF NOT EXISTS "Invitation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "inviterId" TEXT NOT NULL,
  CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Invitation_organizationId_idx" ON "Invitation"("organizationId");
CREATE INDEX IF NOT EXISTS "Invitation_email_idx" ON "Invitation"("email");

ALTER TABLE "Member"
  ADD CONSTRAINT "Member_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Member"
  ADD CONSTRAINT "Member_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invitation"
  ADD CONSTRAINT "Invitation_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invitation"
  ADD CONSTRAINT "Invitation_userId_fkey"
  FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
