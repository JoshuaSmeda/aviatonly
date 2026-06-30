"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  cancelAuctionAction,
  closeAuctionAction,
  scheduleAuctionAction,
  startAuctionAction,
} from "@/app/(dashboard)/dashboard/admin/auctions/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AuctionStatus,
  CANCELLABLE_AUCTION_STATUSES,
} from "@/lib/aviatonly/domain/auction-status";
import type { PrivateAdminAuctionState } from "@/lib/aviatonly/domain/auction-types";

interface AuctionWorkflowActionsProps {
  auctionId: string;
  state: PrivateAdminAuctionState;
}

const AuctionWorkflowActions = ({ auctionId, state }: AuctionWorkflowActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelReason, setCancelReason] = useState("");

  const run = (action: () => Promise<{ ok: boolean; error?: string }>, success: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error ?? "Action failed.");
        return;
      }
      toast.success(success);
      router.refresh();
    });
  };

  const canSchedule = state.status === AuctionStatus.DRAFT;
  const canStart = state.status === AuctionStatus.SCHEDULED;
  const canCancel = CANCELLABLE_AUCTION_STATUSES.includes(state.status);
  const canClose =
    state.status === AuctionStatus.LIVE || state.status === AuctionStatus.CLOSING;
  const isTerminal =
    state.status === AuctionStatus.CLOSED || state.status === AuctionStatus.CANCELLED;

  if (isTerminal) {
    return (
      <p className="text-sm text-muted-foreground">
        This auction is {state.status === AuctionStatus.CLOSED ? "closed" : "cancelled"}. No
        workflow actions are available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {canSchedule ? (
        <Button
          disabled={isPending}
          onClick={() =>
            run(() => scheduleAuctionAction(auctionId), "Auction scheduled and listing marked live.")
          }
        >
          Schedule auction
        </Button>
      ) : null}

      {canStart ? (
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() => run(() => startAuctionAction(auctionId), "Bidding is now open.")}
        >
          Start bidding now
        </Button>
      ) : null}

      {canClose ? (
        <FieldGroup className="rounded-lg border border-border p-3">
          <Field>
            <FieldLabel>Manual close</FieldLabel>
            <FieldDescription>
              Force-close the auction immediately. Outcome is determined from current high bid and
              reserve rules.
            </FieldDescription>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() =>
                run(
                  () => closeAuctionAction(auctionId, { force: true }),
                  "Auction closed.",
                )
              }
            >
              Close auction now
            </Button>
          </Field>
        </FieldGroup>
      ) : null}

      {canCancel ? (
        <>
          <Separator />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cancel-reason">Cancel auction</FieldLabel>
              <FieldDescription>
                Cancels the auction and records an internal reason. Existing bids remain in the
                audit trail.
              </FieldDescription>
              <Textarea
                id="cancel-reason"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (required)…"
              />
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending || !cancelReason.trim()}
                onClick={() =>
                  run(
                    () => cancelAuctionAction(auctionId, cancelReason.trim()),
                    "Auction cancelled.",
                  )
                }
              >
                Cancel auction
              </Button>
            </Field>
          </FieldGroup>
        </>
      ) : null}
    </div>
  );
};

export default AuctionWorkflowActions;
