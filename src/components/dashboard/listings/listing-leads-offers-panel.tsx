import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import { getOfferTableRows } from "@/lib/aviatonly/server/offer-table";
import type { LeadTableRow, OfferTableRow } from "@/lib/aviatonly/mock/types";

export interface ListingLeadsOffersData {
  leadRows: LeadTableRow[];
  offerRows: OfferTableRow[];
}

export async function loadListingLeadsOffersData(
  listingId: string,
  messagingViewerId?: string,
): Promise<ListingLeadsOffersData> {
  const [leadRows, offerRows] = await Promise.all([
    getLeadTableRows({
      options: {
        listingId,
        messagingViewerId,
        messagesBasePath: "/dashboard/seller/messages",
      },
    }),
    getOfferTableRows({ options: { listingId } }),
  ]);

  return { leadRows, offerRows };
}
