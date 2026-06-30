"use client";

import { AlertTriangle, Check } from "lucide-react";
import ListingStatusBadge from "./listing-status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  getListingPhaseIndex,
  getListingProgressPercent,
  getListingStatusMeta,
  isAttentionStatus,
  isOffTrackStatus,
  LISTING_PHASES,
  ListingStatus,
} from "@/lib/aviatonly/domain";
import { cn } from "@/lib/utils";

interface ListingStatusProgressProps {
  status: ListingStatus;
  className?: string;
  /** Hide the milestone stepper and show only the header summary. */
  showSteps?: boolean;
}

const ListingStatusProgress = ({
  status,
  className,
  showSteps = true,
}: ListingStatusProgressProps) => {
  const meta = getListingStatusMeta(status);
  const offTrack = isOffTrackStatus(status);
  const attention = isAttentionStatus(status);
  const currentIndex = getListingPhaseIndex(status);
  const percent = getListingProgressPercent(status);
  const totalSteps = LISTING_PHASES.length;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <ListingStatusBadge status={status} />
          {!offTrack && (
            <span className="text-sm text-muted-foreground tabular-nums">
              Step {currentIndex + 1} of {totalSteps}
            </span>
          )}
        </div>
        {!offTrack && (
          <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
            {percent}% complete
          </span>
        )}
      </div>

      {offTrack ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          This listing left the active sale workflow and is no longer progressing.
        </div>
      ) : (
        showSteps && (
          <>
            <Separator className="my-5" />
            <ol
              className="grid gap-x-1 gap-y-3 sm:gap-x-2"
              style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
              aria-label="Listing workflow progress"
            >
            {LISTING_PHASES.map((phase, index) => {
              const isComplete = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isCurrentAttention = isCurrent && attention;
              const connectorReached = index <= currentIndex;

              const circleClassName = cn(
                "flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                isComplete && "border-primary bg-primary text-primary-foreground",
                isCurrent &&
                  !attention &&
                  "border-primary bg-background text-primary ring-2 ring-primary/20",
                isCurrentAttention && "border-destructive bg-background text-destructive",
                !isComplete &&
                  !isCurrent &&
                  "border-border bg-background text-muted-foreground",
              );

              const circleContent = isComplete ? (
                <Check />
              ) : isCurrentAttention ? (
                <AlertTriangle />
              ) : (
                index + 1
              );

              return (
                <li
                  key={phase.key}
                  className="relative flex min-w-0 flex-col items-center gap-1.5 text-center"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {index > 0 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute right-1/2 top-4 -z-10 h-0.5 w-full -translate-y-1/2 rounded-full",
                        connectorReached ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                  {isCurrent ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`${phase.label}: ${meta.description}`}
                            className={cn(circleClassName, "transition-colors")}
                          />
                        }
                      >
                        {circleContent}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-center">
                        {meta.description}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className={circleClassName} aria-hidden>
                      {circleContent}
                    </span>
                  )}
                  <span
                    className={cn(
                      "w-full truncate px-0.5 text-xs leading-tight",
                      isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {phase.label}
                  </span>
                </li>
              );
            })}
            </ol>
          </>
        )
      )}
    </div>
  );
};

export default ListingStatusProgress;
