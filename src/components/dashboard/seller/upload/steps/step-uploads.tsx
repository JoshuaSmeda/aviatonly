"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import UploadSlot, { type UploadedFile } from "../upload-slot";
import type { UploadSlotDef } from "../constants";

interface StepUploadsProps {
  variant: "photo" | "document";
  slots: UploadSlotDef[];
  values: Record<string, UploadedFile>;
  onSelect: (slotId: string, file: File) => void;
  onRemove: (slotId: string) => void;
  alertTitle: string;
  alertDescription: string;
}

const StepUploads = ({
  variant,
  slots,
  values,
  onSelect,
  onRemove,
  alertTitle,
  alertDescription,
}: StepUploadsProps) => {
  const completed = slots.filter((slot) => values[slot.id]).length;

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <Info />
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>{alertDescription}</AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Upload as many as you can — the more you provide, the faster verification goes.
        </p>
        <Badge variant="secondary">
          {completed} / {slots.length} added
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slots.map((slot) => (
          <UploadSlot
            key={slot.id}
            slot={slot}
            variant={variant}
            value={values[slot.id]}
            onSelect={(file) => onSelect(slot.id, file)}
            onRemove={() => onRemove(slot.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepUploads;
