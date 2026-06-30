"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, Check, Download, Eye, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import AsyncPhotoThumb from "@/components/dashboard/shared/async-photo-thumb";
import GuidedPhotoPreviewDialog from "@/components/dashboard/shared/guided-photo-preview-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { UploadSlotDef } from "./constants";

export type GuidedPhotoUploadStatus =
  | "empty"
  | "uploading"
  | "uploaded"
  | "on-file"
  | "error";

export interface UploadedFile {
  name: string;
  sizeLabel: string;
  previewUrl?: string;
  status?: GuidedPhotoUploadStatus;
  progress?: number;
  photoId?: string;
  documentId?: string;
  storageKey?: string;
  error?: string;
}

interface UploadSlotProps {
  slot: UploadSlotDef;
  variant: "photo" | "document";
  value?: UploadedFile;
  progress?: number;
  isUploading?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onOpenDocument?: () => void;
  disabled?: boolean;
}

const ACCEPT: Record<UploadSlotProps["variant"], string> = {
  photo: "image/jpeg,image/png,image/webp,image/heic,image/heif",
  document: "image/*,application/pdf",
};

function slotBadge(value?: UploadedFile, isUploading?: boolean) {
  if (isUploading || value?.status === "uploading") {
    return (
      <Badge variant="outline" className="shrink-0 gap-1">
        <Spinner className="size-3" />
        Uploading
      </Badge>
    );
  }

  if (value?.status === "error") {
    return (
      <Badge variant="destructive" className="shrink-0 gap-1">
        <AlertCircle className="size-3" />
        Failed
      </Badge>
    );
  }

  if (value) {
    return (
      <Badge variant="secondary" className="shrink-0 gap-1">
        <Check className="size-3" />
        Added
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="shrink-0">
      Required angle
    </Badge>
  );
}

const UploadSlot = ({
  slot,
  variant,
  value,
  progress,
  isUploading = false,
  onSelect,
  onRemove,
  onOpenDocument,
  disabled = false,
}: UploadSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [previewOpen, setPreviewOpen] = useState(false);
  const filled = Boolean(value);
  const showProgress = Boolean(isUploading && progress != null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 transition-colors",
        filled ? "border-primary/40 bg-primary/5" : "border-dashed border-border",
        value?.status === "error" && "border-destructive/40 bg-destructive/5",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-tight">{slot.label}</span>
          <span className="text-xs text-muted-foreground">{slot.instruction}</span>
        </div>
        {slotBadge(value, isUploading)}
      </div>

      {showProgress ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading to secure storage…</span>
            <span>{Math.round(progress ?? 0)}%</span>
          </div>
          <Progress value={progress ?? 0} />
        </div>
      ) : null}

      {filled && value ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-background p-2">
          {variant === "photo" && value.previewUrl ? (
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-md transition-opacity hover:opacity-80"
              aria-label={`Inspect ${slot.label}`}
              onClick={() => setPreviewOpen(true)}
            >
              <AsyncPhotoThumb src={value.previewUrl} alt={slot.label} />
            </button>
          ) : variant === "photo" && (value.status === "uploading" || isUploading) ? (
            <AsyncPhotoThumb alt={slot.label} pending />
          ) : (
            <div className="flex size-12 items-center justify-center rounded bg-muted text-muted-foreground">
              <FileText />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-xs text-muted-foreground">{value.sizeLabel}</p>
            {value.error ? (
              <p className="text-xs text-destructive">{value.error}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {variant === "photo" && value.previewUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Inspect photo"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye />
              </Button>
            ) : null}
            {variant === "document" && onOpenDocument ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open document"
                onClick={onOpenDocument}
              >
                <Download />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Replace file"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove file"
              disabled={isUploading}
              onClick={onRemove}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Spinner data-icon="inline-start" /> : <UploadCloud data-icon="inline-start" />}
          {variant === "photo" ? "Upload photo" : "Upload document"}
        </Button>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT[variant]}
        capture={variant === "photo" ? "environment" : undefined}
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {variant === "photo" && value?.previewUrl ? (
        <GuidedPhotoPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          title={slot.label}
          instruction={slot.instruction}
          imageUrl={value.previewUrl}
          fileName={value.name}
          fileSize={value.sizeLabel}
        />
      ) : null}
    </div>
  );
};

export default UploadSlot;
