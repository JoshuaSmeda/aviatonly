import {
  buildLeadTableRows,
  type BuildLeadTableRowsOptions,
} from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "./seller-scope";
import { countLeadsInDatabase, queryLeadTableRows } from "./leads";
import type { LeadTableRow } from "@/lib/aviatonly/mock/types";

export interface GetLeadTableRowsInput {
  options?: BuildLeadTableRowsOptions;
  scope?: SellerListingScope;
}

/** Reads leads from the database when seeded; falls back to mock data in dev. */
export async function getLeadTableRows(
  input: GetLeadTableRowsInput = {},
): Promise<LeadTableRow[]> {
  const { options = {}, scope } = input;
  const sellerScoped = scope
    ? { ...options, sellerId: scope.dbSellerId }
    : options;

  try {
    const count = await countLeadsInDatabase();
    if (count === 0) {
      const mockOptions = scope
        ? { ...options, sellerId: scope.mockSellerId }
        : options;
      return buildLeadTableRows(mockOptions);
    }
    return queryLeadTableRows(sellerScoped);
  } catch {
    const mockOptions = scope
      ? { ...options, sellerId: scope.mockSellerId }
      : options;
    return buildLeadTableRows(mockOptions);
  }
}
