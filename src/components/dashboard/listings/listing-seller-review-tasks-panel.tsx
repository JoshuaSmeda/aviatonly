"use client";

import Link from "next/link";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  buildReviewTaskFixHref,
  getReviewTaskStatusMeta,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import type { MockListingReviewTask } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

interface ListingSellerReviewTasksPanelProps {
  workspace: ListingWorkspaceData;
}

function ReviewTasksIdleState({ title = "Nothing to do here right now" }: { title?: string }) {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon">
          <ClipboardCheck />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

const ListingSellerReviewTasksPanel = ({ workspace }: ListingSellerReviewTasksPanelProps) => {
  const { listing, openTasks } = workspace;

  const sellerTasks = openTasks.filter(
    (task) => task.status === ReviewTaskStatus.WAITING_ON_SELLER,
  );

  if (sellerTasks.length > 0) {
    return (
      <ul className="flex flex-col gap-3">
        {sellerTasks.map((task) => (
          <SellerReviewTaskCard key={task.id} listingId={listing.id} task={task} />
        ))}
      </ul>
    );
  }

  return <ReviewTasksIdleState />;
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
    <li>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <ClipboardList className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">{task.title}</CardTitle>
                {task.description ? (
                  <CardDescription>{task.description}</CardDescription>
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
        </CardHeader>
      </Card>
    </li>
  );
}

export default ListingSellerReviewTasksPanel;
