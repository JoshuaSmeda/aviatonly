import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DEMO_DRAFT_LISTING_ID,
  getIntakePrefillFromListing,
  getMockListingById,
  listingTitle,
} from "@/lib/aviatonly/mock";

const IntakeResumeBanner = () => {
  const listing = getMockListingById(DEMO_DRAFT_LISTING_ID);
  const prefill = getIntakePrefillFromListing(DEMO_DRAFT_LISTING_ID);

  if (!listing || !prefill) return null;

  return (
    <Alert className="mb-6">
      <AlertTitle>Resume draft intake</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {listing.registration} · {listingTitle(listing)} is {listing.completenessScore}% complete.
          Continue where you left off or open the listing workspace.
        </span>
        <Button size="sm" variant="outline" render={<Link href={`/dashboard/listings/${listing.id}`} />}>
          Open workspace
          <ArrowRight data-icon="inline-end" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default IntakeResumeBanner;
