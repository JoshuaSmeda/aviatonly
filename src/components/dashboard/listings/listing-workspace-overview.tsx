import Link from "next/link";
import { AlertTriangle, ArrowRight, ClipboardList, FileText, HandCoins, Images, Users } from "lucide-react";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  buildReviewTaskFixHref,
  deriveAdminListingNextStep,
  getListingStatusMeta,
  getReviewTaskStatusMeta,
  isLiveStatus,
  ListingStatus,
  ReviewTaskStatus,
} from "@/lib/aviatonly/domain";
import type { ListingWorkspaceOverview } from "@/lib/aviatonly/mock/types";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";
import { cn } from "@/lib/utils";
import ListingWorkspaceActivityTimeline from "./listing-workspace-activity-timeline";
import ListingPublishPanel from "./listing-publish-panel";

interface ListingWorkspaceOverviewProps {
  listing: MockAircraftListing;
  overview: ListingWorkspaceOverview;
  canManageReview?: boolean;
  approvedPhotoCount?: number;
}

const ListingWorkspaceOverviewTab = ({
  listing,
  overview,
  canManageReview = false,
  approvedPhotoCount = 0,
}: ListingWorkspaceOverviewProps) => {
  const statusMeta = getListingStatusMeta(listing.status);
  const blockingTasksForView = canManageReview
    ? overview.blockingTasks
    : overview.blockingTasks.filter(
        (task) => task.status === ReviewTaskStatus.WAITING_ON_SELLER,
      );
  const nextStep = canManageReview
    ? deriveAdminListingNextStep(listing.id, listing.status)
    : overview.nextStep;

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-lg border p-5",
          nextStep.actionRequired
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-muted/30",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "text-sm font-medium",
                nextStep.actionRequired ? "text-primary" : "text-muted-foreground",
              )}
            >
              {nextStep.sectionLabel}
            </p>
            <p className="text-base font-semibold">{nextStep.message}</p>
            {!nextStep.actionRequired ? (
              <p className="text-sm text-muted-foreground">No action needed from you right now.</p>
            ) : null}
          </div>
          {nextStep.actionRequired && nextStep.primaryCta ? (
            <Button className="shrink-0" render={<Link href={nextStep.primaryCta.href} />}>
              {nextStep.primaryCta.label}
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Current status</p>
          <div className="mt-2 flex items-center gap-2">
            <ListingStatusBadge status={listing.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{statusMeta.description}</p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completeness score</span>
            <span className="font-semibold tabular-nums">{listing.completenessScore}%</span>
          </div>
          <Progress value={listing.completenessScore} className="mt-3" />
          {overview.missingItems.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Missing: {overview.missingItems.join(" · ")}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Buyer interest</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {overview.leadCount} lead{overview.leadCount === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-2">
              <HandCoins className="size-4 text-muted-foreground" />
              {overview.offerCount} active offer{overview.offerCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Media & documents</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2">
              <Images className="size-4 text-muted-foreground" />
              {overview.photoCount} guided photo{overview.photoCount === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              {overview.documentCount} document slot{overview.documentCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {canManageReview &&
      (listing.status === ListingStatus.APPROVED_FOR_LISTING ||
        isLiveStatus(listing.status)) ? (
        <>
          <Separator />
          <ListingPublishPanel
            listing={listing}
            canManageReview={canManageReview}
            approvedPhotoCount={approvedPhotoCount}
          />
        </>
      ) : null}

      {blockingTasksForView.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive" />
            <h6 className="text-sm font-semibold">
              Blocking review tasks ({blockingTasksForView.length})
            </h6>
          </div>
          <ul className="flex flex-col gap-2">
            {blockingTasksForView.map((task) => (
              <li
                key={task.id}
                className="flex flex-col gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex gap-3">
                  <ClipboardList className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString("en-ZA")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {getReviewTaskStatusMeta(task.status).label}
                  </Badge>
                  {!canManageReview && task.status === ReviewTaskStatus.WAITING_ON_SELLER ? (
                    <Button
                      size="sm"
                      variant="outline"
                      render={<Link href={buildReviewTaskFixHref(listing.id, task)} />}
                    >
                      Fix
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator />

      <div>
        <h6 className="mb-4 text-sm font-semibold">Recent activity</h6>
        {overview.recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet for this listing.</p>
        ) : (
          <ListingWorkspaceActivityTimeline items={overview.recentActivity} showRegistration={false} />
        )}
      </div>
    </div>
  );
};

export default ListingWorkspaceOverviewTab;
