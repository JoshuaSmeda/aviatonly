import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import AuctionWorkspace from "@/components/dashboard/auctions/auction-workspace";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { getAuctionWorkspace } from "@/lib/aviatonly/server/auction-workspace";

interface AuctionDetailPageProps {
  params: Promise<{ auctionId: string }>;
}

export async function generateMetadata({ params }: AuctionDetailPageProps): Promise<Metadata> {
  const { auctionId } = await params;
  const workspace = await getAuctionWorkspace(auctionId);
  return {
    title: workspace
      ? `Admin · ${workspace.listing.registration} Auction | AVIATONLY`
      : "Auction | AVIATONLY Admin",
  };
}

const AuctionDetailPage = async ({ params }: AuctionDetailPageProps) => {
  const { auctionId } = await params;
  const workspace = await getAuctionWorkspace(auctionId);

  if (!workspace) {
    notFound();
  }

  return (
    <>
      <BreadcrumbComp title={`Admin · ${workspace.listing.registration}`} />
      <TitleCard title={`${workspace.listing.registration} · Auction workspace`}>
        <p className="mb-4 text-sm text-muted-foreground">
          Configure, schedule, and monitor bidding for {workspace.listing.title}. Reserve pricing
          is admin-only and hidden from public buy pages.
        </p>
        <AuctionWorkspace workspace={workspace} />
      </TitleCard>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/dashboard/auctions" className="hover:underline">
          Back to auctions queue
        </Link>
      </p>
    </>
  );
};

export default AuctionDetailPage;
