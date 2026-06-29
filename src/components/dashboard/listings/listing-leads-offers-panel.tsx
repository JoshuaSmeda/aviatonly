import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import { getOfferTableRows } from "@/lib/aviatonly/server/offer-table";
import ListingLeadsOffersPanelClient from "./listing-leads-offers-panel-client";

interface ListingLeadsOffersPanelProps {
  listingId: string;
}

const ListingLeadsOffersPanel = async ({ listingId }: ListingLeadsOffersPanelProps) => {
  const [leadRows, offerRows] = await Promise.all([
    getLeadTableRows({ options: { listingId } }),
    getOfferTableRows({ options: { listingId } }),
  ]);

  return (
    <ListingLeadsOffersPanelClient leadRows={leadRows} offerRows={offerRows} />
  );
};

export default ListingLeadsOffersPanel;
