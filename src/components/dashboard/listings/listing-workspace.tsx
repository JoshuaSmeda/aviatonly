"use client";

import { Suspense } from "react";
import CardBox from "@/components/dashboard/shared/CardBox";
import ListingStatusProgress from "@/components/dashboard/shared/listing-status-progress";
import { Spinner } from "@/components/ui/spinner";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";
import ListingWorkspaceHeader from "./listing-workspace-header";
import ListingWorkspaceTabs from "./listing-workspace-tabs";

interface ListingWorkspaceProps {
  listing: MockAircraftListing;
}

const ListingWorkspaceTabsFallback = () => (
  <div className="flex items-center justify-center py-16">
    <Spinner className="size-6" />
  </div>
);

const ListingWorkspace = ({ listing }: ListingWorkspaceProps) => {
  return (
    <>
      <ListingWorkspaceHeader listing={listing} />

      <CardBox className="mb-6 p-6">
        <h6 className="mb-4 text-sm font-semibold">Workflow progress</h6>
        <ListingStatusProgress status={listing.status} />
      </CardBox>

      <CardBox className="p-6">
        <Suspense fallback={<ListingWorkspaceTabsFallback />}>
          <ListingWorkspaceTabs listing={listing} />
        </Suspense>
      </CardBox>
    </>
  );
};

export default ListingWorkspace;
