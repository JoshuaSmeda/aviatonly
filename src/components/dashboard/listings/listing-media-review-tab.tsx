"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { adminReviewListingPhotoAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import AdminReviewTicks from "@/components/dashboard/listings/admin-review-ticks";
import ListingIntakeReviewProgress from "@/components/dashboard/listings/listing-intake-review-progress";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
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
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { Images } from "lucide-react";

type PhotoOptimisticAction = {
  photoId: string;
  status: PhotoStatus;
};

function applyPhotoOptimistic(
  current: MockAircraftPhoto[],
  action: PhotoOptimisticAction,
): MockAircraftPhoto[] {
  return current.map((photo) =>
    photo.id === action.photoId ? { ...photo, status: action.status } : photo,
  );
}

interface ListingMediaReviewTabProps {
  workspace: ListingWorkspaceData;
  canManageReview: boolean;
}

const ListingMediaReviewTab = ({ workspace, canManageReview }: ListingMediaReviewTabProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { listing } = workspace;
  const [photos, applyOptimisticPhoto] = useOptimistic(workspace.photos, applyPhotoOptimistic);
  const canEdit = canManageReview && !workspace.intakeReviewTasksReleasedAt;

  const afterReview = (result: { ok: boolean; finalized?: boolean }) => {
    if (!result.ok || result.finalized) {
      startTransition(() => router.refresh());
    }
  };

  if (photos.length === 0) {
    return (
      <WorkflowPlaceholder
        icon={Images}
        title="No photos uploaded"
        description="Guided photo slots from intake will appear here with review status per angle."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {canManageReview ? (
        <ListingIntakeReviewProgress workspace={workspace} photos={photos} />
      ) : null}

      <ul className="flex flex-col gap-2">
        {photos.map((photo) => {
          const label = photo.slotKey.replace(/-/g, " ");
          const state = photoReviewState(photo.status);
          const needsFix = !canManageReview && isAttentionPhotoStatus(photo.status);
          const fixHref = buildReviewTaskFixHref(listing.id, {
            sourceType: "photo",
            sourceKey: photo.id,
            title: label,
          });

          return (
            <li
              key={photo.id}
              id={`review-${photo.id}`}
              className="scroll-mt-24 rounded-lg border border-border px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span>
                    {label} · {photo.fileName}
                  </span>
                  {needsFix && photo.rejectionReason ? (
                    <p className="mt-1 text-muted-foreground">{photo.rejectionReason}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {canManageReview ? (
                    <AdminReviewTicks
                      label={label}
                      reviewState={state}
                      canEdit={canEdit}
                      onApprove={async () => {
                        applyOptimisticPhoto({ photoId: photo.id, status: PhotoStatus.APPROVED });
                        const result = await adminReviewListingPhotoAction({
                          listingId: listing.id,
                          photoId: photo.id,
                          approved: true,
                        });
                        afterReview(result);
                        return result;
                      }}
                      onReject={async (reason) => {
                        applyOptimisticPhoto({ photoId: photo.id, status: PhotoStatus.REJECTED });
                        const result = await adminReviewListingPhotoAction({
                          listingId: listing.id,
                          photoId: photo.id,
                          approved: false,
                          rejectionPreset: reason.presetId,
                          rejectionReason: reason.customReason,
                        });
                        afterReview(result);
                        return result;
                      }}
                    />
                  ) : (
                    <>
                      <Badge variant={getPhotoStatusMeta(photo.status).badgeVariant}>
                        {getPhotoStatusMeta(photo.status).label}
                      </Badge>
                      {needsFix ? (
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={fixHref} />}
                        >
                          Fix
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListingMediaReviewTab;
