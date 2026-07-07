/**
 * Seeds AVIATONLY demo users only — aircraft/listing/lead/offer/deal/auction seed data disabled.
 * Run: npm run db:seed
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { MOCK_USERS } from "../src/lib/aviatonly/mock/users";

const prisma = new PrismaClient();

/** Shared password for all seeded demo accounts — local dev only. */
export const DEMO_USER_PASSWORD = "test";

async function ensureCredentialAccount(userId: string, password: string) {
  const hashed = await hashPassword(password);
  await prisma.account.deleteMany({
    where: { userId, providerId: "credential" },
  });
  await prisma.account.create({
    data: {
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashed,
    },
  });
}

async function main() {
  console.log("Seeding AVIATONLY demo users only (aircraft seed data disabled)…");

  for (const user of MOCK_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, roles: user.roles, emailVerified: true },
      create: {
        email: user.email,
        name: user.name,
        roles: user.roles,
        emailVerified: true,
      },
    });
    await ensureCredentialAccount(record.id, DEMO_USER_PASSWORD);
  }

  const userCount = await prisma.user.count();
  const listingCount = await prisma.aircraftListing.count();

  console.log(`Done. ${userCount} users. ${listingCount} listings (unchanged).`);
  console.log("\nDemo login (all seeded users share this password):");
  console.log(`  Password: ${DEMO_USER_PASSWORD}`);
  console.log("  User:     user@aviatonly.co.za (seller + buyer)");
  console.log("  Admin:    admin@aviatonly.co.za");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
