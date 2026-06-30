"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { adminReviewListingDocumentAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import ListingGuidedDocumentGrid from "@/components/dashboard/listings/listing-guided-document-grid";
import ListingIntakeReviewProgress from "@/components/dashboard/listings/listing-intake-review-progress";
import ListingStartIntakeReviewPanel from "@/components/dashboard/listings/listing-start-intake-review-panel";
import { Badge } from "@/components/ui/badge";
import { DOCUMENT_SLOTS } from "@/components/dashboard/seller/upload/constants";
import { DocumentStatus, ListingStatus, canAdminEditIntakeReview } from "@/lib/aviatonly/domain";
import type { MockAircraftDocument } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";

type DocumentOptimisticAction = {
  documentId: string;
  reviewStatus: DocumentStatus;
};

function applyDocumentOptimistic(
  current: MockAircraftDocument[],
  action: DocumentOptimisticAction,
): MockAircraftDocument[] {
  return current.map((doc) =>
    doc.id === action.documentId ? { ...doc, reviewStatus: action.reviewStatus } : doc,
  );
}

interface ListingDocumentsReviewTabProps {
  workspace: ListingWorkspaceData;
  canManageReview: boolean;
}

const ListingDocumentsReviewTab = ({
  workspace,
  canManageReview,
}: ListingDocumentsReviewTabProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { listing } = workspace;
  const [documents, applyOptimisticDocument] = useOptimistic(
    workspace.documents,
    applyDocumentOptimistic,
  );
  const canEdit = canAdminEditIntakeReview({
    canManageReview,
    listingStatus: listing.status,
    intakeReviewTasksReleasedAt: workspace.intakeReviewTasksReleasedAt,
  });
  const uploadedCount = documents.length;

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
        <ListingIntakeReviewProgress workspace={workspace} documents={documents} />
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Private document vault slots from intake. Downloads require authorization.
        </p>
        <Badge variant="secondary">
          {uploadedCount} / {DOCUMENT_SLOTS.length} uploaded
        </Badge>
      </div>

      <ListingGuidedDocumentGrid
        listingId={listing.id}
        documents={documents}
        canManageReview={canManageReview}
        canEditReview={canEdit}
        showSellerActions={!canManageReview}
        onApprove={async (documentId) => {
          applyOptimisticDocument({
            documentId,
            reviewStatus: DocumentStatus.ACCEPTED,
          });
          const result = await adminReviewListingDocumentAction({
            listingId: listing.id,
            documentId,
            approved: true,
          });
          afterReview(result);
          return result;
        }}
        onReject={async (documentId, reason) => {
          applyOptimisticDocument({
            documentId,
            reviewStatus: DocumentStatus.REJECTED,
          });
          const result = await adminReviewListingDocumentAction({
            listingId: listing.id,
            documentId,
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

export default ListingDocumentsReviewTab;
