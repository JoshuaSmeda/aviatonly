import type { BuildLeadTableRowsOptions } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "./seller-scope";
import { queryLeadTableRows } from "./leads";
import type { LeadTableRow } from "@/lib/aviatonly/mock/types";

export interface GetLeadTableRowsInput {
  options?: BuildLeadTableRowsOptions & {
    messagingViewerId?: string;
    messagesBasePath?: string;
  };
  scope?: SellerListingScope;
}

/** Reads leads from the database. */
export async function getLeadTableRows(
  input: GetLeadTableRowsInput = {},
): Promise<LeadTableRow[]> {
  const { options = {}, scope } = input;
  const sellerScoped = scope
    ? { ...options, sellerId: scope.dbSellerId }
    : options;

  return queryLeadTableRows(sellerScoped);
}
