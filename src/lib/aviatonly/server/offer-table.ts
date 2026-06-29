import {
  buildOfferTableRows,
  type BuildOfferTableRowsOptions,
} from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "./seller-scope";
import { countOffersInDatabase, queryOfferTableRows } from "./offers";
import type { OfferTableRow } from "@/lib/aviatonly/mock/types";

export interface GetOfferTableRowsInput {
  options?: BuildOfferTableRowsOptions;
  scope?: SellerListingScope;
}

/** Reads offers from the database when seeded; falls back to mock data in dev. */
export async function getOfferTableRows(
  input: GetOfferTableRowsInput = {},
): Promise<OfferTableRow[]> {
  const { options = {}, scope } = input;
  const sellerScoped = scope
    ? { ...options, sellerId: scope.dbSellerId }
    : options;

  try {
    const count = await countOffersInDatabase();
    if (count === 0) {
      const mockOptions = scope
        ? { ...options, sellerId: scope.mockSellerId }
        : options;
      return buildOfferTableRows(mockOptions);
    }
    return queryOfferTableRows(sellerScoped);
  } catch {
    const mockOptions = scope
      ? { ...options, sellerId: scope.mockSellerId }
      : options;
    return buildOfferTableRows(mockOptions);
  }
}
