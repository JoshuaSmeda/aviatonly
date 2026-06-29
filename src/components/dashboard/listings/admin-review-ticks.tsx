"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import AdminRejectReasonDialog, {
  type RejectReasonResult,
} from "@/components/dashboard/listings/admin-reject-reason-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RowReviewState } from "@/lib/aviatonly/domain/listing-intake-review-utils";

interface AdminReviewTicksProps {
  label: string;
  reviewState: RowReviewState;
  canEdit: boolean;
  onApprove: () => Promise<{ ok: boolean; error?: string }>;
  onReject: (reason: RejectReasonResult) => Promise<{ ok: boolean; error?: string }>;
}

const AdminReviewTicks = ({
  label,
  reviewState,
  canEdit,
  onApprove,
  onReject,
}: AdminReviewTicksProps) => {
  const [isPending, startTransition] = useTransition();
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!canEdit) {
    return null;
  }

  const run = (action: () => Promise<{ ok: boolean; error?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error ?? "Could not save review.");
      }
    });
  };

  const isApproved = reviewState === "approved";
  const isRejected = reviewState === "rejected";

  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          disabled={isPending}
          aria-label={`Approve ${label}`}
          aria-pressed={isApproved}
          className={cn(
            isApproved &&
              "border-success bg-success text-success-foreground hover:bg-success/90 hover:text-success-foreground",
          )}
          onClick={() => run(onApprove)}
        >
          <Check data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={isRejected ? "destructive" : "outline"}
          disabled={isPending}
          aria-label={`Not approved: ${label}`}
          aria-pressed={isRejected}
          onClick={() => setRejectOpen(true)}
        >
          <X data-icon="inline-start" />
        </Button>
      </div>

      <AdminRejectReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Not approved: ${label}`}
        description="The seller will receive a review task with this reason after you finish checking all rows."
        isPending={isPending}
        onConfirm={(reason) => {
          setRejectOpen(false);
          run(() => onReject(reason));
        }}
      />
    </>
  );
};

export default AdminReviewTicks;
