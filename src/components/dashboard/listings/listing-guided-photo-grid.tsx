"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resolveWorkspacePhotoPreviews } from "@/app/(dashboard)/dashboard/seller/upload/photo-actions";
import AdminReviewTicks from "@/components/dashboard/listings/admin-review-ticks";
import AsyncPhotoThumb from "@/components/dashboard/shared/async-photo-thumb";
import GuidedPhotoPreviewDialog from "@/components/dashboard/shared/guided-photo-preview-dialog";
import { PHOTO_SLOTS } from "@/components/dashboard/seller/upload/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildReviewTaskFixHref,
  getPhotoStatusMeta,
  isAttentionPhotoStatus,
  PhotoStatus,
} from "@/lib/aviatonly/domain";
import { photoReviewState } from "@/lib/aviatonly/domain/listing-intake-review-utils";
import type { MockAircraftPhoto } from "@/lib/aviatonly/mock/types";
import { getGuidedPhotoSlotLabel } from "@/lib/upload/photo-slot-keys";
import { cn } from "@/lib/utils";

function formatSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return "On file";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ListingGuidedPhotoGridProps {
  listingId: string;
  photos: MockAircraftPhoto[];
  canManageReview: boolean;
  canEditReview: boolean;
  showSellerActions: boolean;
  onApprove: (photoId: string) => Promise<{ ok: boolean; finalized?: boolean }>;
  onReject: (
    photoId: string,
    reason: { presetId: string; customReason?: string },
  ) => Promise<{ ok: boolean; finalized?: boolean }>;
}

const ListingGuidedPhotoGrid = ({
  listingId,
  photos,
  canManageReview,
  canEditReview,
  showSellerActions,
  onApprove,
  onReject,
}: ListingGuidedPhotoGridProps) => {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState(true);
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);

  const photosBySlot = new Map(photos.map((photo) => [photo.slotKey, photo]));

  useEffect(() => {
    let cancelled = false;

    void resolveWorkspacePhotoPreviews(listingId)
      .then((resolved) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const [slotKey, file] of Object.entries(resolved)) {
          if (file.previewUrl) next[slotKey] = file.previewUrl;
        }
        setPreviews(next);
      })
      .finally(() => {
        if (!cancelled) setLoadingPreviews(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listingId, photos]);

  const previewSlot = PHOTO_SLOTS.find((slot) => slot.id === previewSlotId);
  const previewPhoto = previewSlotId ? photosBySlot.get(previewSlotId) : undefined;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {PHOTO_SLOTS.map((slot) => {
        const photo = photosBySlot.get(slot.id);
        const label = getGuidedPhotoSlotLabel(slot.id);
        const previewUrl = previews[slot.id];
        const filled = Boolean(photo);

        return (
          <div
            key={slot.id}
            id={photo ? `review-${photo.id}` : undefined}
            className={cn(
              "scroll-mt-24 flex flex-col gap-3 rounded-lg border p-4 transition-colors",
              filled ? "border-primary/40 bg-primary/5" : "border-dashed border-border",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium leading-tight">{label}</span>
                <span className="text-xs text-muted-foreground">{slot.instruction}</span>
              </div>
              {photo ? (
                canManageReview ? (
                  <AdminReviewTicks
                    label={label}
                    reviewState={photoReviewState(photo.status)}
                    canEdit={canEditReview}
                    onApprove={async () => onApprove(photo.id)}
                    onReject={async (reason) => onReject(photo.id, reason)}
                  />
                ) : (
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant={getPhotoStatusMeta(photo.status).badgeVariant}>
                      {getPhotoStatusMeta(photo.status).label}
                    </Badge>
                    {showSellerActions && isAttentionPhotoStatus(photo.status) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            href={buildReviewTaskFixHref(listingId, {
                              sourceType: "photo",
                              sourceKey: photo.id,
                              title: label,
                            })}
                          />
                        }
                      >
                        Fix
                      </Button>
                    ) : null}
                  </div>
                )
              ) : (
                <Badge variant="outline" className="shrink-0">
                  Not uploaded
                </Badge>
              )}
            </div>

            {photo ? (
              <>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-2 text-left transition-colors hover:bg-muted/40"
                  onClick={() => setPreviewSlotId(slot.id)}
                >
                  <AsyncPhotoThumb
                    src={previewUrl}
                    alt={label}
                    pending={loadingPreviews && !previewUrl}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{photo.fileName}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(photo.sizeBytes)}</p>
                  </div>
                </button>
                {showSellerActions && photo.rejectionReason ? (
                  <p className="text-xs text-muted-foreground">{photo.rejectionReason}</p>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-16 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-3 py-4 text-xs text-muted-foreground">
                No photo for this angle yet
              </div>
            )}
          </div>
        );
      })}
      </div>

      <GuidedPhotoPreviewDialog
        open={previewSlotId != null}
        onOpenChange={(open) => {
          if (!open) setPreviewSlotId(null);
        }}
        title={previewSlot ? getGuidedPhotoSlotLabel(previewSlot.id) : "Photo preview"}
        instruction={previewSlot?.instruction}
        imageUrl={previewSlotId ? previews[previewSlotId] : null}
        fileName={previewPhoto?.fileName}
        fileSize={previewPhoto ? formatSize(previewPhoto.sizeBytes) : undefined}
        loading={loadingPreviews && previewSlotId != null && !previews[previewSlotId]}
      />
    </>
  );
};

export default ListingGuidedPhotoGrid;
