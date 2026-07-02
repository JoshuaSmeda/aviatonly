import { getLeadTableRows } from "@/lib/aviatonly/server/lead-table";
import type { BuildLeadTableRowsOptions } from "@/lib/aviatonly/mock";
import type { SellerListingScope } from "@/lib/aviatonly/server/seller-scope";
import { getSession } from "@/lib/auth/session";
import LeadsDataTable from "./leads-data-table";

interface LeadsTableProps {
  options?: BuildLeadTableRowsOptions & {
    messagingViewerId?: string;
    messagesBasePath?: string;
  };
  scope?: SellerListingScope;
  showSeller?: boolean;
  showListingColumns?: boolean;
  showActions?: boolean;
  detailBasePath?: string;
  messagesBasePath?: string;
  enrichMessaging?: boolean;
  emptyDescription?: string;
}

const LeadsTable = async ({
  options,
  scope,
  showSeller = false,
  showListingColumns = true,
  showActions = true,
  detailBasePath = "/dashboard/seller/leads",
  messagesBasePath = "/dashboard/seller/messages",
  enrichMessaging = true,
  emptyDescription,
}: LeadsTableProps) => {
  const session = enrichMessaging ? await getSession() : null;
  const rows = await getLeadTableRows({
    options: {
      ...options,
      messagingViewerId:
        options?.messagingViewerId ?? (enrichMessaging ? session?.user.id : undefined),
      messagesBasePath: options?.messagesBasePath ?? messagesBasePath,
    },
    scope,
  });

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
