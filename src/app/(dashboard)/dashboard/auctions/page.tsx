import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import AuctionsTable from "@/components/dashboard/auctions/auctions-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { countAuctionsByStatus } from "@/lib/aviatonly/server/auction-table";

export const metadata: Metadata = {
  title: "Auctions | AVIATONLY Admin",
};

const AuctionsPage = async () => {
  const counts = await countAuctionsByStatus();
  const liveCount = counts.LIVE ?? 0;
  const scheduledCount = counts.SCHEDULED ?? 0;
  const draftCount = counts.DRAFT ?? 0;

  return (
    <>
      <BreadcrumbComp title="Auctions" />
      <TitleCard title="Admin · Auctions">
        <p className="mb-4 text-sm text-muted-foreground">
          {liveCount} live · {scheduledCount} scheduled · {draftCount} draft
          {draftCount === 1 ? "" : "s"} awaiting configuration.
        </p>
        <AuctionsTable />
      </TitleCard>
    </>
  );
};

export default AuctionsPage;
