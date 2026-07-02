import {
  buildLeadPipelineBoard,
  type PipelineBoard,
  type PipelineColumnGroup,
} from "@/lib/aviatonly/domain/lead-pipeline-logic";
import { buildLeadPipelineBoardFromMock } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "./seller-scope";
import {
  countLeadsInDatabase,
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

/** Reads pipeline data from the database when seeded; falls back to mock data in dev. */
export async function getLeadPipelineForSeller(input: {
  scope: SellerListingScope;
  options?: QueryLeadPipelineOptions;
}): Promise<LeadPipelineBoard> {
  const { scope, options = {} } = input;
  const {
    listingId,
    messagingViewerId,
    messagesBasePath = "/dashboard/seller/messages",
    detailBasePath = "/dashboard/seller/leads",
  } = options;

  try {
    const count = await countLeadsInDatabase();
    if (count === 0) {
      return buildLeadPipelineBoardFromMock({
        sellerId: scope.mockSellerId,
        listingId,
        messagesBasePath,
        detailBasePath,
      });
    }

    return queryLeadPipelineForSeller(scope, options);
  } catch {
    return buildLeadPipelineBoardFromMock({
      sellerId: scope.mockSellerId,
      listingId,
      messagesBasePath,
      detailBasePath,
    });
  }
}
