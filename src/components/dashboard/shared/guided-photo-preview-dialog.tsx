"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface GuidedPhotoPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  instruction?: string;
  imageUrl?: string | null;
  fileName?: string;
  fileSize?: string;
  loading?: boolean;
}

const GuidedPhotoPreviewDialog = ({
  open,
  onOpenChange,
  title,
  instruction,
  imageUrl,
  fileName,
  fileSize,
  loading = false,
}: GuidedPhotoPreviewDialogProps) => {
  const meta = [fileName, fileSize].filter(Boolean).join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {instruction ? <DialogDescription>{instruction}</DialogDescription> : null}
        </DialogHeader>
        <div className="relative flex min-h-[min(50vh,320px)] items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-2">
          {loading || !imageUrl ? (
            <Spinner className="size-6" />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              width={1600}
              height={1200}
              unoptimized
              className="max-h-[min(70vh,720px)] w-auto max-w-full object-contain"
            />
          )}
        </div>
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
      </DialogContent>
    </Dialog>
  );
};

export default GuidedPhotoPreviewDialog;
