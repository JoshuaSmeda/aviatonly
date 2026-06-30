import { redirect } from "next/navigation";
import { getBuyMarketplaceListingDetail } from "@/lib/aviatonly/server/marketplace-catalog";

interface PageProps {
  params: Promise<{ registration: string }>;
}

export default async function BuyDetailRedirectPage({ params }: PageProps) {
  const { registration } = await params;
  const listing = await getBuyMarketplaceListingDetail(registration.toLowerCase());

  if (listing) {
    redirect(`/dashboard/buy/${listing.slug}`);
  }

  redirect("/dashboard/buy");
}
