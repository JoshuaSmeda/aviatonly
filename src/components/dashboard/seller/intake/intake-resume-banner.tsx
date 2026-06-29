import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { listingTitle } from "@/lib/aviatonly/server/listing-mappers";
import { queryDraftListingsForSeller } from "@/lib/aviatonly/server/listings";
import { SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

const IntakeResumeBanner = async () => {
  const session = await requireAnyRole(SELLER_ROLES);
  const drafts = await queryDraftListingsForSeller(session.user.id);
  const listing = drafts[0];

  if (!listing) return null;

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
