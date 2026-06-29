"use client";

import { buildLeadTableRows, buildOfferTableRows } from "@/lib/aviatonly/mock";

import LeadsDataTable from "@/components/dashboard/leads/leads-data-table";
import OffersDataTable from "@/components/dashboard/offers/offers-data-table";

interface ListingLeadsOffersPanelProps {
  listingId: string;
}

const ListingLeadsOffersPanel = ({ listingId }: ListingLeadsOffersPanelProps) => {
  const leadRows = buildLeadTableRows({ listingId });
  const offerRows = buildOfferTableRows({ listingId });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h6 className="mb-3 text-sm font-semibold">Leads ({leadRows.length})</h6>
        <LeadsDataTable
          rows={leadRows}
          showListingColumns={false}
          showActions={false}
        />
      </div>

      <div>
        <h6 className="mb-3 text-sm font-semibold">Offers ({offerRows.length})</h6>
        <OffersDataTable
          rows={offerRows}
          showListingColumns={false}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default ListingLeadsOffersPanel;
