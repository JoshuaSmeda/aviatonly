import { buildOfferTableRows } from "@/lib/aviatonly/mock";
import type { BuildOfferTableRowsOptions } from "@/lib/aviatonly/mock";
import OffersDataTable from "./offers-data-table";

interface OffersTableProps {
  options?: BuildOfferTableRowsOptions;
  showSeller?: boolean;
  showListingColumns?: boolean;
  showActions?: boolean;
}

const OffersTable = ({
  options,
  showSeller = false,
  showListingColumns = true,
  showActions = true,
}: OffersTableProps) => {
  const rows = buildOfferTableRows(options);

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
