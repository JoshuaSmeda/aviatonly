import type { Metadata } from "next";
import { BuyMarketplace } from "@/components/buy/buy-marketplace";
import { getBuyMarketplaceListings } from "@/lib/aviatonly/server/marketplace-catalog";

export const metadata: Metadata = {
  title: "Browse Aircraft | AVIATONLY",
  description: "Browse curated fixed-price aircraft listings reviewed by AVIATONLY.",
};

export default async function DashboardBuyPage() {
  const listings = await getBuyMarketplaceListings();
  return <BuyMarketplace listings={listings} />;
}
