-- Pair BUYER and SELLER as default marketplace capabilities for existing users.
UPDATE "User"
SET roles = ARRAY(
  SELECT DISTINCT unnest(
    CASE
      WHEN roles && ARRAY['BUYER', 'SELLER', 'BROKER']::text[]
        THEN roles || ARRAY['BUYER', 'SELLER']::text[]
      ELSE roles
    END
  )
)
WHERE roles && ARRAY['BUYER', 'SELLER', 'BROKER']::text[];

ALTER TABLE "User" ALTER COLUMN roles SET DEFAULT ARRAY['BUYER', 'SELLER']::text[];
