"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { adminStartIntakeReviewAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ListingStatus } from "@/lib/aviatonly/domain";

interface ListingStartIntakeReviewPanelProps {
  listingId: string;
  listingStatus: ListingStatus;
  intakeReviewTasksReleasedAt: string | null;
  intakeReviewerName: string | null;
  compact?: boolean;
}

const ListingStartIntakeReviewPanel = ({
  listingId,
  listingStatus,
  intakeReviewTasksReleasedAt,
  intakeReviewerName,
  compact = false,
}: ListingStartIntakeReviewPanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (listingStatus !== ListingStatus.SUBMITTED) {
    return null;
  }

  const startReview = () => {
    startTransition(async () => {
      const result = await adminStartIntakeReviewAction(listingId);
      if (!result.ok) {
        toast.error(result.error ?? "Could not start review.");
        return;
      }
      toast.success("Intake review mode started — you are assigned as reviewer.");
      router.refresh();
    });
  };

  const description = intakeReviewTasksReleasedAt
    ? "The seller resubmitted fixes. Enter review mode to unlock intake rows and continue checking aircraft data, media, and documents."
    : "Enter review mode to start checking intake rows. Your name will be assigned as reviewer so other admins do not pick up the same listing.";

  if (compact) {
    return (
      <Button size="sm" disabled={isPending} onClick={startReview}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Start review
      </Button>
    );
  }

  return (
    <Alert>
      <AlertTitle>Review not started</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>{description}</p>
        {intakeReviewerName ? (
          <p className="text-xs text-muted-foreground">
            Currently assigned to {intakeReviewerName}.
          </p>
        ) : null}
        <div>
          <Button disabled={isPending} onClick={startReview}>
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Enter review mode
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ListingStartIntakeReviewPanel;
