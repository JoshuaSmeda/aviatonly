import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import type { BuildLeadTableRowsOptions } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import LeadsDataTable from "./leads-data-table";

interface LeadsTableProps {
  options?: BuildLeadTableRowsOptions;
  scope?: SellerListingScope;
  showSeller?: boolean;
  showListingColumns?: boolean;
  showActions?: boolean;
  detailBasePath?: string;
  emptyDescription?: string;
}

const LeadsTable = async ({
  options,
  scope,
  showSeller = false,
  showListingColumns = true,
  showActions = true,
  detailBasePath = "/dashboard/seller/leads",
  emptyDescription,
}: LeadsTableProps) => {
  const rows = await getLeadTableRows({ options, scope });

  return (
    <LeadsDataTable
      rows={rows}
      showSeller={showSeller}
      showListingColumns={showListingColumns}
      showActions={showActions}
      detailBasePath={detailBasePath}
      emptyDescription={emptyDescription}
    />
  );
};

export default LeadsTable;
