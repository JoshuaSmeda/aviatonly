"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { AircraftFormValues } from "@/components/dashboard/seller/upload/schema";
import {
  ensureListingForDocumentUpload,
  getGuidedDocumentSlotAfterUpload,
  isGuidedDocumentUploadAvailable,
  registerLocalGuidedDocument,
  removeGuidedDocumentForSlot,
} from "@/app/(dashboard)/dashboard/seller/upload/document-actions";
import { refreshListingCompleteness } from "@/app/(dashboard)/dashboard/seller/upload/photo-actions";
import { aircraftUpload } from "@/lib/upload/upload-client";
import UploadSlot, { type UploadedFile } from "./upload-slot";
import type { UploadSlotDef } from "./constants";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface GuidedDocumentUploadGridProps {
  slots: UploadSlotDef[];
  values: Record<string, UploadedFile>;
  onChange: (slotId: string, value: UploadedFile | null) => void;
  listingId: string | null;
  getFormValues: () => AircraftFormValues;
  onListingIdChange?: (listingId: string) => void;
  isSlotDisabled?: (slotId: string) => boolean;
}

const GuidedDocumentUploadGrid = ({
  slots,
  values,
  onChange,
  listingId,
  getFormValues,
  onListingIdChange,
  isSlotDisabled,
}: GuidedDocumentUploadGridProps) => {
  const [r2Enabled, setR2Enabled] = useState(false);
  const [ensuringListing, setEnsuringListing] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [slotProgress, setSlotProgress] = useState<Record<string, number>>({});
  const activeSlotRef = useRef<string | null>(null);
  const listingIdRef = useRef<string | null>(listingId);
  const onChangeRef = useRef(onChange);
  const valuesRef = useRef(values);
  const getFormValuesRef = useRef(getFormValues);
  const onListingIdChangeRef = useRef(onListingIdChange);

  onChangeRef.current = onChange;
  valuesRef.current = values;
  getFormValuesRef.current = getFormValues;
  onListingIdChangeRef.current = onListingIdChange;

  useEffect(() => {
    listingIdRef.current = listingId;
  }, [listingId]);

  useEffect(() => {
    void isGuidedDocumentUploadAvailable().then(setR2Enabled);
  }, []);

  const { uploadFiles, isUploading } = aircraftUpload.guidedDocument({
    onProgress: (progress) => {
      const slotKey = activeSlotRef.current;
      if (!slotKey) return;
      setSlotProgress((prev) => ({ ...prev, [slotKey]: progress }));
    },
    onSuccess: async (results) => {
      const slotKey = activeSlotRef.current;
      const result = results[0];
      if (!slotKey || !result || result.status !== "success") return;

      const listing = listingIdRef.current;

      let nextValue: UploadedFile = {
        name: result.name,
        sizeLabel: formatBytes(result.size),
        status: "uploaded",
        storageKey: result.key,
      };

      if (listing) {
        const details = await getGuidedDocumentSlotAfterUpload(listing, slotKey);
        if (details.ok) {
          nextValue = {
            ...nextValue,
            documentId: details.documentId,
            storageKey: details.storageKey ?? result.key,
            name: details.fileName,
            sizeLabel: details.sizeLabel,
          };
        }
      }

      onChangeRef.current(slotKey, nextValue);

      if (listing) {
        await refreshListingCompleteness(listing);
      }

      activeSlotRef.current = null;
      setActiveSlotId(null);
      setSlotProgress((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      toast.success("Document uploaded securely");
    },
    onError: (error) => {
      const slotKey = activeSlotRef.current;
      if (slotKey) {
        const current = valuesRef.current[slotKey];
        onChangeRef.current(slotKey, {
          name: current?.name ?? "Upload failed",
          sizeLabel: current?.sizeLabel ?? "",
          status: "error",
          error: error.message,
        });
      }
      activeSlotRef.current = null;
      setActiveSlotId(null);
      toast.error(error.message || "Document upload failed");
    },
  });

  const resolveListingId = useCallback(async () => {
    if (listingIdRef.current) return listingIdRef.current;

    setEnsuringListing(true);
    try {
      const result = await ensureListingForDocumentUpload(
        getFormValuesRef.current(),
        listingIdRef.current,
      );
      if (!result.ok) {
        toast.error(result.error);
        return null;
      }

      listingIdRef.current = result.listingId;
      onListingIdChangeRef.current?.(result.listingId);
      return result.listingId;
    } finally {
      setEnsuringListing(false);
    }
  }, []);

  const handleSelect = useCallback(
    async (slotId: string, file: File) => {
      setSlotProgress((prev) => ({ ...prev, [slotId]: 0 }));

      onChangeRef.current(slotId, {
        name: file.name,
        sizeLabel: formatBytes(file.size),
        status: "uploading",
      });

      const resolvedListingId = await resolveListingId();
      if (!resolvedListingId) {
        onChangeRef.current(slotId, {
          name: file.name,
          sizeLabel: formatBytes(file.size),
          status: "error",
          error: "Save aircraft identity details before uploading documents.",
        });
        return;
      }

      activeSlotRef.current = slotId;
      setActiveSlotId(slotId);

      if (r2Enabled) {
        await uploadFiles([file], {
          listingId: resolvedListingId,
          documentType: slotId,
        });
        return;
      }

      const registered = await registerLocalGuidedDocument({
        listingId: resolvedListingId,
        documentType: slotId,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      if (!registered.ok) {
        onChangeRef.current(slotId, {
          name: file.name,
          sizeLabel: formatBytes(file.size),
          status: "error",
          error: registered.error,
        });
        toast.error(registered.error);
        return;
      }

      onChangeRef.current(slotId, {
        name: file.name,
        sizeLabel: formatBytes(file.size),
        status: "uploaded",
        documentId: registered.documentId,
        storageKey: `local/${resolvedListingId}/${slotId}/${file.name}`,
      });
      setSlotProgress((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
      activeSlotRef.current = null;
      setActiveSlotId(null);
      await refreshListingCompleteness(resolvedListingId);
      toast.success("Document metadata saved locally — connect R2 for secure cloud storage.");
    },
    [r2Enabled, resolveListingId, uploadFiles],
  );

  const handleRemove = useCallback(async (slotId: string) => {
    onChangeRef.current(slotId, null);
    setSlotProgress((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });

    if (listingIdRef.current) {
      const result = await removeGuidedDocumentForSlot(listingIdRef.current, slotId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      await refreshListingCompleteness(listingIdRef.current);
    }
  }, []);

  const uploadingSlotId = useMemo(() => {
    if (!isUploading && !ensuringListing) return null;
    return activeSlotId;
  }, [activeSlotId, ensuringListing, isUploading]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {slots.map((slot) => {
        const value = values[slot.id];
        const isActiveSlot = uploadingSlotId === slot.id;

        return (
          <UploadSlot
            key={slot.id}
            slot={slot}
            variant="document"
            value={value}
            progress={isActiveSlot ? slotProgress[slot.id] ?? 0 : undefined}
            isUploading={isActiveSlot}
            onSelect={(file) => void handleSelect(slot.id, file)}
            onRemove={() => void handleRemove(slot.id)}
            disabled={isSlotDisabled?.(slot.id)}
          />
        );
      })}
    </div>
  );
};

export default GuidedDocumentUploadGrid;
