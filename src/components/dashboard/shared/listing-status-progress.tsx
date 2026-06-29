import { AlertTriangle, Check } from "lucide-react";
import ListingStatusBadge from "./listing-status-badge";
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
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ListingStatusBadge status={status} />
          {!offTrack && (
            <span className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {totalSteps}
            </span>
          )}
        </div>
        {!offTrack && (
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {percent}% complete
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{meta.description}</p>

      {offTrack ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          This listing left the active sale workflow and is no longer progressing.
        </div>
      ) : (
        showSteps && (
          <ol
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
          >
            {LISTING_PHASES.map((phase, index) => {
              const isComplete = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isCurrentAttention = isCurrent && attention;
              const connectorReached = index <= currentIndex;
              return (
                <li
                  key={phase.key}
                  className="relative flex flex-col items-center gap-2 text-center"
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
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                      isComplete && "border-primary bg-primary text-primary-foreground",
                      isCurrent &&
                      !attention &&
                      "border-primary bg-background text-primary ring-2 ring-primary/20",
                      isCurrentAttention && "border-destructive bg-background text-destructive",
                      !isComplete &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {isComplete ? (
                      <Check className="size-4" />
                    ) : isCurrentAttention ? (
                      <AlertTriangle className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-tight",
                      isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {phase.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )
      )}
    </div>
  );
};

export default ListingStatusProgress;
