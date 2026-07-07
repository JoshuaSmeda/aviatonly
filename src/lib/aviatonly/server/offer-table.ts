import type { BuildOfferTableRowsOptions } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "./seller-scope";
import { queryOfferTableRows } from "./offers";
import type { OfferTableRow } from "@/lib/aviatonly/mock/types";

export interface GetOfferTableRowsInput {
  options?: BuildOfferTableRowsOptions;
  scope?: SellerListingScope;
}

/** Reads offers from the database. */
export async function getOfferTableRows(
  input: GetOfferTableRowsInput = {},
): Promise<OfferTableRow[]> {
  const { options = {}, scope } = input;
  const sellerScoped = scope
    ? { ...options, sellerId: scope.dbSellerId }
    : options;

  return queryOfferTableRows(sellerScoped);
}
