"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { adminReleaseIntakeReviewTasksAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Spinner } from "@/components/ui/spinner";
import { getReviewTaskStatusMeta } from "@/lib/aviatonly/domain";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

interface ListingReviewTasksAdminPanelProps {
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

const ListingReviewTasksAdminPanel = ({ workspace }: ListingReviewTasksAdminPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { draftTasks, listing, intakeReviewTasksReleasedAt, intakeReviewFinalizedAt } = workspace;

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

  if (intakeReviewTasksReleasedAt || !intakeReviewFinalizedAt || draftTasks.length === 0) {
    return <ReviewTasksIdleState />;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {draftTasks.map((task) => (
          <li key={task.id}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <Badge variant="outline">Draft</Badge>
                </div>
                {task.description ? (
                  <CardDescription>{task.description}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Will become: {getReviewTaskStatusMeta(task.status).label} after release
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <Button disabled={isPending} onClick={sendToSeller} className="w-fit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Send tasks to seller
      </Button>
    </div>
  );
};

export default ListingReviewTasksAdminPanel;
