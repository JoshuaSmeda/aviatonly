import type { AuthSession } from "@/lib/auth/session";

export interface SellerListingScope {
  /** Authenticated user id — used for Prisma queries. */
  dbSellerId: string;
  /** Mock layer seller id (matched by email when demo data is in use). */
  mockSellerId: string;
  email: string;
}

/**
 * Resolves seller scope for listing/lead/offer queries.
 * Mock data uses stable mock user ids; the DB uses the auth user id.
 */
export async function resolveSellerListingScope(
  session: AuthSession,
): Promise<SellerListingScope> {
  const { MOCK_USERS } = await import("@/lib/aviatonly/mock/users");
  const email = session.user.email;
  const mockUser = MOCK_USERS.find((user) => user.email === email);

  return {
    dbSellerId: session.user.id,
    mockSellerId: mockUser?.id ?? session.user.id,
    email,
  };
}
