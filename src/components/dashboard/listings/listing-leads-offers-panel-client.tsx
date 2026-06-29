"use client";

import LeadsDataTable from "@/components/dashboard/leads/leads-data-table";
import OffersDataTable from "@/components/dashboard/offers/offers-data-table";
import type { LeadTableRow, OfferTableRow } from "@/lib/aviatonly/mock/types";

interface ListingLeadsOffersPanelClientProps {
  leadRows: LeadTableRow[];
  offerRows: OfferTableRow[];
}

const ListingLeadsOffersPanelClient = ({
  leadRows,
  offerRows,
}: ListingLeadsOffersPanelClientProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h6 className="mb-3 text-sm font-semibold">Leads ({leadRows.length})</h6>
        <LeadsDataTable
          rows={leadRows}
          showListingColumns={false}
          showActions
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

export default ListingLeadsOffersPanelClient;
