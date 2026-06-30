import { redirect } from "next/navigation";
import {
  getMockListingBySlug,
  MOCK_AIRCRAFT_LISTINGS,
} from "@/lib/aviatonly/marketplace/mock-aircraft-listings";

interface PageProps {
  params: Promise<{ registration: string }>;
}

export default async function PublicBuyDetailRedirectPage({ params }: PageProps) {
  const { registration } = await params;
  const slug = registration.toLowerCase();
  const normalizedReg = slug.replace(/[^a-z0-9]/g, "");

  const listing =
    getMockListingBySlug(slug) ??
    MOCK_AIRCRAFT_LISTINGS.find(
      (item) =>
        item.registration.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedReg,
    );

  if (listing) {
    redirect(`/dashboard/buy/${listing.slug}`);
  }

  redirect("/dashboard/buy");
}
