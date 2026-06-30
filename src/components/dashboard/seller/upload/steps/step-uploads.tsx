"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useIntakeFixMode } from "@/components/dashboard/seller/intake/intake-fix-mode-context";
import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import GuidedPhotoUploadGrid from "../guided-photo-upload-grid";
import GuidedDocumentUploadGrid from "../guided-document-upload-grid";
import UploadSlot, { type UploadedFile } from "../upload-slot";
import type { UploadSlotDef } from "../constants";

interface StepUploadsProps {
  variant: "photo" | "document";
  slots: UploadSlotDef[];
  values: Record<string, UploadedFile>;
  onSelect: (slotId: string, file: File) => void;
  onRemove: (slotId: string) => void;
  onPhotoChange?: (slotId: string, value: UploadedFile | null) => void;
  onDocumentChange?: (slotId: string, value: UploadedFile | null) => void;
  listingId?: string | null;
  getFormValues?: () => AircraftFormValues;
  onListingIdChange?: (listingId: string) => void;
  alertTitle: string;
  alertDescription: string;
}

const StepUploads = ({
  variant,
  slots,
  values,
  onSelect,
  onRemove,
  onPhotoChange,
  onDocumentChange,
  listingId,
  getFormValues,
  onListingIdChange,
  alertTitle,
  alertDescription,
}: StepUploadsProps) => {
  const { active, isPhotoSlotEditable, isDocumentSlotEditable } = useIntakeFixMode();
  const completed = slots.filter((slot) => values[slot.id]).length;

  const isSlotDisabled = (slotId: string) => {
    if (!active) return false;
    return variant === "photo"
      ? !isPhotoSlotEditable(slotId)
      : !isDocumentSlotEditable(slotId);
  };

  const useGuidedPhotoUpload =
    variant === "photo" && onPhotoChange && getFormValues;

  const useGuidedDocumentUpload =
    variant === "document" && onDocumentChange && getFormValues;

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <Info />
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>{alertDescription}</AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {variant === "photo"
            ? "Each card is a required guided angle — upload from camera or file."
            : "Upload as many as you can — the more you provide, the faster verification goes."}
        </p>
        <Badge variant="secondary">
          {completed} / {slots.length} added
        </Badge>
      </div>

      {useGuidedPhotoUpload ? (
        <GuidedPhotoUploadGrid
          slots={slots}
          values={values}
          onChange={onPhotoChange}
          listingId={listingId ?? null}
          getFormValues={getFormValues}
          onListingIdChange={onListingIdChange}
          isSlotDisabled={isSlotDisabled}
        />
      ) : useGuidedDocumentUpload ? (
        <GuidedDocumentUploadGrid
          slots={slots}
          values={values}
          onChange={onDocumentChange}
          listingId={listingId ?? null}
          getFormValues={getFormValues}
          onListingIdChange={onListingIdChange}
          isSlotDisabled={isSlotDisabled}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => (
            <UploadSlot
              key={slot.id}
              slot={slot}
              variant={variant}
              value={values[slot.id]}
              onSelect={(file) => onSelect(slot.id, file)}
              onRemove={() => onRemove(slot.id)}
              disabled={isSlotDisabled(slot.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StepUploads;
