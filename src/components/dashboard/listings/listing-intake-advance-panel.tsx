"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { adminAdvanceIntakeToValuationAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ListingStatus } from "@/lib/aviatonly/domain";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";

interface ListingIntakeAdvancePanelProps {
  listing: MockAircraftListing;
  intakeReviewFinalizedAt: string | null;
  readyToAdvance: boolean;
}

const ListingIntakeAdvancePanel = ({
  listing,
  intakeReviewFinalizedAt,
  readyToAdvance,
}: ListingIntakeAdvancePanelProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (
    listing.status !== ListingStatus.UNDER_REVIEW ||
    intakeReviewFinalizedAt ||
    !readyToAdvance
  ) {
    return null;
  }

  const proceedToValuation = () => {
    startTransition(async () => {
      const result = await adminAdvanceIntakeToValuationAction(listing.id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not advance listing.");
        return;
      }
      toast.success("Intake approved — valuation step unlocked.");
      router.refresh();
    });
  };

  return (
    <>
      <Alert className="border-primary/20 bg-primary/5">
        <AlertTitle>All intake rows approved</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <p>
            Every aircraft data, media, and document row passed review. Confirm when you are ready to
            move {listing.registration} to the valuation stage.
          </p>
          <Button className="w-fit" onClick={() => setConfirmOpen(true)} disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}
            Proceed to valuation
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proceed to valuation?</DialogTitle>
            <DialogDescription>
              This confirms intake review is complete for {listing.registration}. The listing will
              move to Valuation Ready and you can enter the AVIATONLY indicative estimate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isPending} onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                setConfirmOpen(false);
                proceedToValuation();
              }}
            >
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              Confirm and proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingIntakeAdvancePanel;
