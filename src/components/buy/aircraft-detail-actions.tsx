"use client";

import { EyeOff, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AircraftDetailActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (typeof navigator !== "undefined" && navigator.share) {
            void navigator.share({ title: document.title, url: window.location.href });
          } else {
            void navigator.clipboard.writeText(window.location.href);
            toast.success("Listing link copied");
          }
        }}
      >
        <Share2 data-icon="inline-start" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.message("Listing hidden from your browse results")}
      >
        <EyeOff data-icon="inline-start" />
        Hide
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Save listing"
        onClick={() => toast.message("Saved to your aircraft shortlist")}
      >
        <Heart />
      </Button>
    </div>
  );
}
