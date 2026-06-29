/**
 * Run after `npx prisma db push` if AircraftListing sellerId FK migration fails.
 *
 * This repairs orphaned listing seller references after the auth schema upgrade.
 * Execute against your Supabase/Postgres database using the session pooler URL.
 */
-- Ensure auth columns exist on User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "roles" TEXT[] NOT NULL DEFAULT ARRAY['SELLER']::TEXT[];

-- Backfill missing seller users referenced by listings
INSERT INTO "User" ("id", "email", "name", "emailVerified", "roles", "createdAt", "updatedAt")
SELECT DISTINCT l."sellerId",
       CONCAT('legacy-', l."sellerId", '@aviatonly.local'),
       'Legacy seller',
       false,
       ARRAY['SELLER']::TEXT[],
       NOW(),
       NOW()
FROM "AircraftListing" l
LEFT JOIN "User" u ON u."id" = l."sellerId"
WHERE u."id" IS NULL
ON CONFLICT ("email") DO NOTHING;
