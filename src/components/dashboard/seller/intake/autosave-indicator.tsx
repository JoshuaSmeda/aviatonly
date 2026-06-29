"use client";

import { Check, CloudUpload, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  lastSavedAt?: Date | null;
  onRetry?: () => void;
  className?: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const AutosaveIndicator = ({
  status,
  lastSavedAt,
  onRetry,
  className,
}: AutosaveIndicatorProps) => {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
      role="status"
      aria-live="polite"
    >
      {status === "idle" && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <CloudUpload className="size-4" />
          Draft autosaves as you go
        </span>
      )}

      {status === "saving" && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Spinner />
          Saving…
        </span>
      )}

      {status === "saved" && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Check className="size-4 text-primary" />
          Saved{lastSavedAt ? ` · ${formatTime(lastSavedAt)}` : ""}
        </span>
      )}

      {status === "error" && (
        <span className="flex items-center gap-2 text-destructive">
          <span className="flex items-center gap-1.5">
            <TriangleAlert className="size-4" />
            Could not save.
          </span>
          {onRetry && (
            <Button variant="ghost" size="xs" onClick={onRetry}>
              Retry
            </Button>
          )}
        </span>
      )}
    </div>
  );
};

export default AutosaveIndicator;
