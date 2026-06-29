"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import { AlertCircle, Check, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";
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
  disabled = false,
}: UploadSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const filled = Boolean(value);
  const showProgress = isUploading || value?.status === "uploading";

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
            <Image
              src={value.previewUrl}
              alt={slot.label}
              width={48}
              height={48}
              unoptimized
              className="size-12 rounded object-cover"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded bg-muted text-muted-foreground">
              <FileText className="size-5" />
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
    </div>
  );
};

export default UploadSlot;
