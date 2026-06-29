import { buildLeadTableRows } from "@/lib/aviatonly/mock";
import type { BuildLeadTableRowsOptions } from "@/lib/aviatonly/mock";
import LeadsDataTable from "./leads-data-table";

interface LeadsTableProps {
  options?: BuildLeadTableRowsOptions;
  showSeller?: boolean;
  showListingColumns?: boolean;
  showActions?: boolean;
}

const LeadsTable = ({
  options,
  showSeller = false,
  showListingColumns = true,
  showActions = true,
}: LeadsTableProps) => {
  const rows = buildLeadTableRows(options);

  return (
    <LeadsDataTable
      rows={rows}
      showSeller={showSeller}
      showListingColumns={showListingColumns}
      showActions={showActions}
    />
  );
};

export default LeadsTable;
