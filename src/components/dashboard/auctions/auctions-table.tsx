import { queryAuctionTableRows } from "@/lib/aviatonly/server/auction-table";
import AuctionsDataTable from "./auctions-data-table";

const AuctionsTable = async () => {
  const rows = await queryAuctionTableRows();
  return <AuctionsDataTable rows={rows} />;
};

export default AuctionsTable;
