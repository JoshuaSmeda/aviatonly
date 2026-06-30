import type { Metadata } from "next";
import { BuyMarketplace } from "@/components/buy/buy-marketplace";

export const metadata: Metadata = {
  title: "Browse Aircraft | AVIATONLY",
  description: "Browse curated fixed-price aircraft listings reviewed by AVIATONLY.",
};

export default function DashboardBuyPage() {
  return <BuyMarketplace />;
}
