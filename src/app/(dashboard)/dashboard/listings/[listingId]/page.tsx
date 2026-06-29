import type { Metadata } from "next";
import ListingWorkspace from "@/components/dashboard/listings/listing-workspace";
import ListingWorkspacePageHeader from "@/components/dashboard/listings/listing-workspace-page-header";
import CardBox from "@/components/dashboard/shared/CardBox";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
import { Plane } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { assertCanAccessListing } from "@/lib/aviatonly/server/authorization";
import { getListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { ADMIN_ROLES, hasAnyRole, SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Listing Workspace | AVIATONLY",
};

interface PageProps {
  params: Promise<{ listingId: string }>;
}

const ListingWorkspacePage = async ({ params }: PageProps) => {
  const session = await requireAnyRole([...SELLER_ROLES, ...ADMIN_ROLES]);
  const { listingId } = await params;
  const workspace = await getListingWorkspaceData(listingId);

  if (!workspace) {
    return (
      <>
        <ListingWorkspacePageHeader
          backHref="/dashboard/listings"
          backLabel="My aircraft"
          eyebrow="Listing workspace"
          title="Listing not found"
        />
        <CardBox className="p-6">
          <WorkflowPlaceholder
            icon={Plane}
            title="Listing not found"
            description={`No aircraft workspace found for "${listingId}".`}
          >
            <Button render={<Link href="/dashboard/listings" />}>Back to My Aircraft</Button>
          </WorkflowPlaceholder>
        </CardBox>
      </>
    );
  }

  assertCanAccessListing({ sellerId: workspace.listing.sellerId }, session);

  const canManageReview = hasAnyRole(session.user.roles, ADMIN_ROLES);
  const { listing } = workspace;
  const aircraftTitle = `${listing.year} ${listing.make} ${listing.model}`;

  return (
    <>
      <ListingWorkspacePageHeader
        backHref={canManageReview ? "/dashboard/admin/review-queue" : "/dashboard/listings"}
        backLabel={canManageReview ? "Review queue" : "My aircraft"}
        eyebrow={canManageReview ? "Admin · Listing review" : "Listing workspace"}
        title={`${listing.registration} · ${aircraftTitle}`}
      />
      <ListingWorkspace workspace={workspace} canManageReview={canManageReview} />
    </>
  );
};

export default ListingWorkspacePage;
