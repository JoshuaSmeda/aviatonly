"use client";

import Link from "next/link";
import { buildAircraftDataReviewRows } from "@/lib/aviatonly/domain";
import { computeIntakeReviewProgressFromWorkspace } from "@/lib/aviatonly/domain/listing-intake-review-utils";
import {
  formatPendingIntakeReviewItem,
  listPendingIntakeReviewItems,
} from "@/lib/aviatonly/domain/listing-intake-review-items";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MockAircraftDocument, MockAircraftPhoto, MockListingFieldReview } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

interface ListingIntakeReviewProgressProps {
  workspace: ListingWorkspaceData;
  fieldReviews?: MockListingFieldReview[];
  photos?: MockAircraftPhoto[];
  documents?: MockAircraftDocument[];
}

const ListingIntakeReviewProgress = ({
  workspace,
  fieldReviews: fieldReviewsOverride,
  photos: photosOverride,
  documents: documentsOverride,
}: ListingIntakeReviewProgressProps) => {
  const fieldReviews = fieldReviewsOverride ?? workspace.fieldReviews;
  const photos = photosOverride ?? workspace.photos;
  const documents = documentsOverride ?? workspace.documents;
  const fieldRows = buildAircraftDataReviewRows(workspace);
  const progress = computeIntakeReviewProgressFromWorkspace({
    fieldRowCount: fieldRows.length,
    fieldReviews,
    fieldKeys: fieldRows.map((r) => r.fieldKey),
    photos,
    documents,
  });
  const pendingItems = listPendingIntakeReviewItems(workspace, {
    fieldReviews,
    photos,
    documents,
  });
  const listingBase = `/dashboard/listings/${workspace.listing.id}`;

  const percent = progress.total > 0 ? Math.round((progress.reviewed / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium">Intake review progress</span>
        <span className="tabular-nums text-muted-foreground">
          {progress.reviewed} / {progress.total} rows checked
        </span>
      </div>
      <Progress value={percent} />

      {pendingItems.length > 0 ? (
        <Alert>
          <AlertTitle>
            {pendingItems.length} row{pendingItems.length === 1 ? "" : "s"} still need review
          </AlertTitle>
          <AlertDescription>
            <ul className="mt-2 flex flex-col gap-1.5">
              {pendingItems.map((item) => (
                <li key={`${item.section}-${item.id}`}>
                  <Link
                    href={`${listingBase}?tab=${item.tab}#review-${item.id}`}
                    className="inline-flex flex-wrap items-center gap-2 hover:underline"
                  >
                    <Badge variant="outline">Not reviewed</Badge>
                    <span>{formatPendingIntakeReviewItem(item)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {progress.isComplete && !workspace.intakeReviewFinalizedAt ? (
        <Alert>
          <AlertTitle>All rows checked</AlertTitle>
          <AlertDescription>
            Saving your last review will generate draft tasks or advance the listing if everything
            is approved.
          </AlertDescription>
        </Alert>
      ) : null}

      {workspace.intakeReviewFinalizedAt && workspace.draftTasks.length > 0 ? (
        <Alert>
          <AlertTitle>Draft review tasks ready</AlertTitle>
          <AlertDescription>
            Open the Review Tasks tab to preview tasks before sending them to the seller.
          </AlertDescription>
        </Alert>
      ) : null}

      {workspace.intakeReviewFinalizedAt && workspace.draftTasks.length === 0 ? (
        <Alert>
          <AlertTitle>Intake approved</AlertTitle>
          <AlertDescription>
            All rows passed review. The listing has moved to the valuation step.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default ListingIntakeReviewProgress;
