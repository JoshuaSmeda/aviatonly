/**
 * Auction demo seed — disabled. Re-enable by restoring seed logic from git history.
 */
import type { PrismaClient } from "@prisma/client";

export async function seedAuctions(
  _prisma: PrismaClient,
  _userIdByMockId: Map<string, string>,
): Promise<void> {
  console.log("Auction seed skipped (demo data disabled).");
}
