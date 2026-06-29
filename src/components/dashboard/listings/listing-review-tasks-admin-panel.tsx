"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { adminReleaseIntakeReviewTasksAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getReviewTaskStatusMeta } from "@/lib/aviatonly/domain";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

interface ListingReviewTasksAdminPanelProps {
  workspace: ListingWorkspaceData;
}

const ListingReviewTasksAdminPanel = ({ workspace }: ListingReviewTasksAdminPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { draftTasks, listing, intakeReviewTasksReleasedAt, intakeReviewFinalizedAt } = workspace;

  if (intakeReviewTasksReleasedAt) {
    return (
      <Alert>
        <AlertTitle>Tasks sent to seller</AlertTitle>
        <AlertDescription>
          Review tasks are visible to the seller on their listing workspace. The listing is in
          Needs changes until they resubmit.
        </AlertDescription>
      </Alert>
    );
  }

  if (!intakeReviewFinalizedAt) {
    return (
      <Alert>
        <AlertTitle>No tasks yet</AlertTitle>
        <AlertDescription>
          Check every row on Aircraft Data, Media, and Documents first. Draft tasks are created
          automatically when the last row is reviewed and any items failed.
        </AlertDescription>
      </Alert>
    );
  }

  if (draftTasks.length === 0) {
    return (
      <Alert>
        <AlertTitle>All intake rows approved</AlertTitle>
        <AlertDescription>
          No seller tasks were needed. The listing should be on the valuation step.
        </AlertDescription>
      </Alert>
    );
  }

  const sendToSeller = () => {
    startTransition(async () => {
      const result = await adminReleaseIntakeReviewTasksAction(listing.id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not send tasks.");
        return;
      }
      toast.success("Review tasks sent to seller.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Draft tasks — not visible to seller yet</AlertTitle>
        <AlertDescription>
          Review the tasks below. When you send them, the seller will see each item and can fix
          intake data before resubmitting.
        </AlertDescription>
      </Alert>

      <ul className="flex flex-col gap-3">
        {draftTasks.map((task) => (
          <li key={task.id} className="rounded-lg border border-border p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{task.title}</span>
              <Badge variant="outline">Draft</Badge>
            </div>
            {task.description ? (
              <p className="mt-2 text-muted-foreground">{task.description}</p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Will become: {getReviewTaskStatusMeta(task.status).label} after release
            </p>
          </li>
        ))}
      </ul>

      <Button disabled={isPending} onClick={sendToSeller}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Send tasks to seller
      </Button>
    </div>
  );
};

export default ListingReviewTasksAdminPanel;
