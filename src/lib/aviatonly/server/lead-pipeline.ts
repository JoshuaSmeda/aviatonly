import {
  buildLeadPipelineBoard,
  type PipelineBoard,
  type PipelineColumnGroup,
} from "@/lib/aviatonly/domain/lead-pipeline-logic";
import type { SellerListingScope } from "./seller-scope";
import {
  querySellerLeads,
  type LeadPipelineCard,
  type QuerySellerLeadsOptions,
} from "./leads";

export type { LeadPipelineCard };
export type LeadPipelineColumn = PipelineColumnGroup<LeadPipelineCard>;
export type LeadPipelineBoard = PipelineBoard<LeadPipelineCard>;

export interface QueryLeadPipelineOptions
  extends Omit<QuerySellerLeadsOptions, "pipelineOnly" | "includeClosed" | "sellerId"> {
  listingId?: string;
}

/** Groups active pipeline leads by status for the seller Kanban board. */
export async function queryLeadPipelineForSeller(
  scope: SellerListingScope,
  options: QueryLeadPipelineOptions = {},
): Promise<LeadPipelineBoard> {
  const {
    listingId,
    messagingViewerId = scope.dbSellerId,
    messagesBasePath = "/dashboard/seller/messages",
    detailBasePath = "/dashboard/seller/leads",
  } = options;

  const leads = await querySellerLeads({
    sellerId: scope.dbSellerId,
    listingId,
    pipelineOnly: true,
    messagingViewerId,
    messagesBasePath,
    detailBasePath,
  });

  return buildLeadPipelineBoard(leads);
}

/** Reads pipeline data from the database. */
export async function getLeadPipelineForSeller(input: {
  scope: SellerListingScope;
  options?: QueryLeadPipelineOptions;
}): Promise<LeadPipelineBoard> {
  const { scope, options = {} } = input;
  return queryLeadPipelineForSeller(scope, options);
}
