"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import {
  ensureListingForPhotoUpload,
  isGuidedPhotoUploadAvailable,
  refreshListingCompleteness,
  registerLocalGuidedPhoto,
  removeGuidedPhotoForSlot,
} from "@/app/(dashboard)/dashboard/seller/upload/photo-actions";
import { aircraftUpload } from "@/lib/upload/upload-client";
import UploadSlot, { type UploadedFile } from "./upload-slot";
import type { UploadSlotDef } from "./constants";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface GuidedPhotoUploadGridProps {
  slots: UploadSlotDef[];
  values: Record<string, UploadedFile>;
  onChange: (slotId: string, value: UploadedFile | null) => void;
  listingId: string | null;
  getFormValues: () => AircraftFormValues;
  onListingIdChange?: (listingId: string) => void;
  isSlotDisabled?: (slotId: string) => boolean;
}

const GuidedPhotoUploadGrid = ({
  slots,
  values,
  onChange,
  listingId,
  getFormValues,
  onListingIdChange,
  isSlotDisabled,
}: GuidedPhotoUploadGridProps) => {
  const [r2Enabled, setR2Enabled] = useState(false);
  const [ensuringListing, setEnsuringListing] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const activeSlotRef = useRef<string | null>(null);
  const listingIdRef = useRef<string | null>(listingId);

  useEffect(() => {
    listingIdRef.current = listingId;
  }, [listingId]);

  useEffect(() => {
    void isGuidedPhotoUploadAvailable().then(setR2Enabled);
  }, []);

  const { uploadFiles, files, isUploading } = aircraftUpload.guidedPhoto({
    onSuccess: async (results) => {
      const slotKey = activeSlotRef.current;
      const result = results[0];
      if (!slotKey || !result || result.status !== "success") return;

      onChange(slotKey, {
        name: result.name,
        sizeLabel: formatBytes(result.size),
        previewUrl: result.url,
        status: "uploaded",
        progress: 100,
        storageKey: result.key,
      });

      if (listingIdRef.current) {
        await refreshListingCompleteness(listingIdRef.current);
      }

      activeSlotRef.current = null;
      setActiveSlotId(null);
      toast.success("Photo uploaded");
    },
    onError: (error) => {
      const slotKey = activeSlotRef.current;
      if (slotKey) {
        onChange(slotKey, {
          ...values[slotKey],
          name: values[slotKey]?.name ?? "Upload failed",
          sizeLabel: values[slotKey]?.sizeLabel ?? "",
          status: "error",
          error: error.message,
        });
      }
      activeSlotRef.current = null;
      setActiveSlotId(null);
      toast.error(error.message || "Photo upload failed");
    },
  });

  const activeUpload = useMemo(() => {
    if (!activeSlotId) return null;
    return files.find((file) => file.status === "uploading" || file.status === "pending") ?? null;
  }, [activeSlotId, files]);

  const resolveListingId = useCallback(async () => {
    if (listingIdRef.current) return listingIdRef.current;

    setEnsuringListing(true);
    try {
      const result = await ensureListingForPhotoUpload(getFormValues(), listingIdRef.current);
      if (!result.ok) {
        toast.error(result.error);
        return null;
      }

      listingIdRef.current = result.listingId;
      onListingIdChange?.(result.listingId);
      return result.listingId;
    } finally {
      setEnsuringListing(false);
    }
  }, [getFormValues, onListingIdChange]);

  const handleSelect = useCallback(
    async (slotId: string, file: File) => {
      const previewUrl = URL.createObjectURL(file);
      onChange(slotId, {
        name: file.name,
        sizeLabel: formatBytes(file.size),
        previewUrl,
        status: "uploading",
        progress: 0,
      });

      const resolvedListingId = await resolveListingId();
      if (!resolvedListingId) {
        onChange(slotId, {
          name: file.name,
          sizeLabel: formatBytes(file.size),
          previewUrl,
          status: "error",
          error: "Save aircraft identity details before uploading photos.",
        });
        return;
      }

      activeSlotRef.current = slotId;
      setActiveSlotId(slotId);

      if (r2Enabled) {
        await uploadFiles([file], {
          listingId: resolvedListingId,
          slotKey: slotId,
        });
        return;
      }

      const registered = await registerLocalGuidedPhoto({
        listingId: resolvedListingId,
        slotKey: slotId,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      if (!registered.ok) {
        onChange(slotId, {
          name: file.name,
          sizeLabel: formatBytes(file.size),
          previewUrl,
          status: "error",
          error: registered.error,
        });
        toast.error(registered.error);
        return;
      }

      onChange(slotId, {
        name: file.name,
        sizeLabel: formatBytes(file.size),
        previewUrl,
        status: "uploaded",
        progress: 100,
        photoId: registered.photoId,
        storageKey: `local/${resolvedListingId}/${slotId}/${file.name}`,
      });
      await refreshListingCompleteness(resolvedListingId);
      toast.success("Photo saved locally — connect R2 to upload to cloud storage.");
    },
    [onChange, r2Enabled, resolveListingId, uploadFiles],
  );

  const handleRemove = useCallback(
    async (slotId: string) => {
      const previous = values[slotId];
      if (previous?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      onChange(slotId, null);

      if (listingIdRef.current) {
        const result = await removeGuidedPhotoForSlot(listingIdRef.current, slotId);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        await refreshListingCompleteness(listingIdRef.current);
      }
    },
    [onChange, values],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {slots.map((slot) => {
        const value = values[slot.id];
        const isActiveSlot = activeSlotId === slot.id;
        const progress =
          isActiveSlot && activeUpload
            ? activeUpload.progress
            : value?.progress;

        return (
          <UploadSlot
            key={slot.id}
            slot={slot}
            variant="photo"
            value={value}
            progress={progress}
            isUploading={(isUploading || ensuringListing) && isActiveSlot}
            onSelect={(file) => void handleSelect(slot.id, file)}
            onRemove={() => void handleRemove(slot.id)}
            disabled={isSlotDisabled?.(slot.id)}
          />
        );
      })}
    </div>
  );
};

export default GuidedPhotoUploadGrid;
