"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import { Check, FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UploadSlotDef } from "./constants";

export interface UploadedFile {
  name: string;
  sizeLabel: string;
  previewUrl?: string;
}

interface UploadSlotProps {
  slot: UploadSlotDef;
  variant: "photo" | "document";
  value?: UploadedFile;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const ACCEPT: Record<UploadSlotProps["variant"], string> = {
  photo: "image/*",
  document: "image/*,application/pdf",
};

const UploadSlot = ({ slot, variant, value, onSelect, onRemove }: UploadSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const filled = Boolean(value);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 transition-colors",
        filled ? "border-primary/40 bg-primary/5" : "border-dashed border-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-tight">{slot.label}</span>
          <span className="text-xs text-muted-foreground">{slot.instruction}</span>
        </div>
        {filled ? (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Check className="size-3" /> Added
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0">
            Optional
          </Badge>
        )}
      </div>

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
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Replace file"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove file"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="size-4" />
          {variant === "photo" ? "Upload photo" : "Upload document"}
        </Button>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT[variant]}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
};

export default UploadSlot;
