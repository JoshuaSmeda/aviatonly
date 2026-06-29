import { getOfferTableRows } from "@/lib/aviatonly/server/offer-table";
import type { BuildOfferTableRowsOptions } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import OffersDataTable from "./offers-data-table";

interface OffersTableProps {
  options?: BuildOfferTableRowsOptions;
  scope?: SellerListingScope;
  showSeller?: boolean;
  showListingColumns?: boolean;
  showActions?: boolean;
}

const OffersTable = async ({
  options,
  scope,
  showSeller = false,
  showListingColumns = true,
  showActions = true,
}: OffersTableProps) => {
  const rows = await getOfferTableRows({ options, scope });

  return (
    <OffersDataTable
      rows={rows}
      showSeller={showSeller}
      showListingColumns={showListingColumns}
      showActions={showActions}
    />
  );
};

export default OffersTable;
