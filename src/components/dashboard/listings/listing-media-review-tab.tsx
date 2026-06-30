"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { adminReviewListingPhotoAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import ListingGuidedPhotoGrid from "@/components/dashboard/listings/listing-guided-photo-grid";
import ListingIntakeReviewProgress from "@/components/dashboard/listings/listing-intake-review-progress";
import ListingStartIntakeReviewPanel from "@/components/dashboard/listings/listing-start-intake-review-panel";
import { Badge } from "@/components/ui/badge";
import { PHOTO_SLOTS } from "@/components/dashboard/seller/upload/constants";
import { ListingStatus, PhotoStatus, canAdminEditIntakeReview } from "@/lib/aviatonly/domain";
import type { MockAircraftPhoto } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

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
  const canEdit = canAdminEditIntakeReview({
    canManageReview,
    listingStatus: listing.status,
    intakeReviewTasksReleasedAt: workspace.intakeReviewTasksReleasedAt,
  });
  const uploadedCount = photos.length;

  const afterReview = (result: { ok: boolean; finalized?: boolean }) => {
    if (!result.ok || result.finalized) {
      startTransition(() => router.refresh());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {canManageReview && listing.status === ListingStatus.SUBMITTED ? (
        <ListingStartIntakeReviewPanel
          listingId={listing.id}
          listingStatus={listing.status}
          intakeReviewTasksReleasedAt={workspace.intakeReviewTasksReleasedAt}
          intakeReviewerName={workspace.intakeReviewerName}
        />
      ) : null}

      {canManageReview ? (
        <ListingIntakeReviewProgress workspace={workspace} photos={photos} />
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Guided photo angles from intake.
        </p>
        <Badge variant="secondary">
          {uploadedCount} / {PHOTO_SLOTS.length} uploaded
        </Badge>
      </div>

      <ListingGuidedPhotoGrid
        listingId={listing.id}
        photos={photos}
        canManageReview={canManageReview}
        canEditReview={canEdit}
        showSellerActions={!canManageReview}
        onApprove={async (photoId) => {
          applyOptimisticPhoto({ photoId, status: PhotoStatus.APPROVED });
          const result = await adminReviewListingPhotoAction({
            listingId: listing.id,
            photoId,
            approved: true,
          });
          afterReview(result);
          return result;
        }}
        onReject={async (photoId, reason) => {
          applyOptimisticPhoto({ photoId, status: PhotoStatus.REJECTED });
          const result = await adminReviewListingPhotoAction({
            listingId: listing.id,
            photoId,
            approved: false,
            rejectionPreset: reason.presetId,
            rejectionReason: reason.customReason,
          });
          afterReview(result);
          return result;
        }}
      />
    </div>
  );
};

export default ListingMediaReviewTab;
