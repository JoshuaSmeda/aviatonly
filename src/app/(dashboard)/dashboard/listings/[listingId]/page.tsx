import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ListingWorkspace from "@/components/dashboard/listings/listing-workspace";
import CardBox from "@/components/dashboard/shared/CardBox";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
import { Plane } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { assertCanAccessListing } from "@/lib/aviatonly/server/authorization";
import { getListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";
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
        <BreadcrumbComp title="Listing Workspace" />
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

  return (
    <>
      <BreadcrumbComp title="Listing Workspace" />
      <ListingWorkspace workspace={workspace} />
    </>
  );
};

export default ListingWorkspacePage;
