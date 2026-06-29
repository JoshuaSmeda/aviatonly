"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  buildReviewTaskFixHref,
  getReviewTaskStatusMeta,
  ListingStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import type { MockListingReviewTask } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

interface ListingSellerReviewTasksPanelProps {
  workspace: ListingWorkspaceData;
}

const ListingSellerReviewTasksPanel = ({ workspace }: ListingSellerReviewTasksPanelProps) => {
  const { listing, openTasks } = workspace;
  const sellerTasks = openTasks.filter(
    (task) => task.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );

  if (sellerTasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>AVIATONLY requested changes</AlertTitle>
        <AlertDescription>
          Fix each item below, then resubmit from the intake wizard. You do not need to re-enter
          approved data — only update what failed review.
        </AlertDescription>
      </Alert>

      <ul className="flex flex-col gap-3">
        {sellerTasks.map((task) => (
          <SellerReviewTaskCard key={task.id} listingId={listing.id} task={task} />
        ))}
      </ul>

      {listing.status === ListingStatus.NEEDS_CHANGES ? (
        <p className="text-sm text-muted-foreground">
          Use Fix on each item in Aircraft Data, Media, or Documents — you only update what
          AVIATONLY flagged.
        </p>
      ) : null}
    </div>
  );
};

function SellerReviewTaskCard({
  listingId,
  task,
}: {
  listingId: string;
  task: MockListingReviewTask;
}) {
  const fixHref = buildReviewTaskFixHref(listingId, task);
  const statusMeta = getReviewTaskStatusMeta(task.status);

  return (
    <li className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <ClipboardList className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{task.title}</p>
            {task.description ? (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            ) : null}
            {task.dueDate ? (
              <p className="text-xs text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString("en-ZA")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {task.blockingPublication ? (
            <Badge variant="destructive">Blocks publication</Badge>
          ) : null}
          <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
          <Button size="sm" variant="outline" render={<Link href={fixHref} />}>
            Fix
          </Button>
        </div>
      </div>
    </li>
  );
}

export default ListingSellerReviewTasksPanel;
