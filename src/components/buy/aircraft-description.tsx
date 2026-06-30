"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AircraftDescriptionProps {
  description: string;
  className?: string;
}

const detailCardClass =
  "overflow-hidden rounded-xl border border-border bg-card p-5 shadow-none lg:p-6";

const PREVIEW_LENGTH = 320;

export function AircraftDescription({ description, className }: AircraftDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > PREVIEW_LENGTH;
  const visibleText =
    expanded || !isLong ? description : `${description.slice(0, PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <div className={cn(detailCardClass, "flex h-full flex-col", className)}>
      <h2 className="mb-4 text-xl font-bold text-foreground">Description</h2>
      <p className="text-sm leading-7 text-muted-foreground">{visibleText}</p>
      {isLong ? (
        <Button
          type="button"
          variant="link"
          className="mt-4 h-auto justify-start p-0 text-sm font-bold text-foreground"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Read less" : "Read more"}
        </Button>
      ) : null}
    </div>
  );
}
