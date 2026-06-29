"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { adminReviewListingDocumentAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import AdminReviewTicks from "@/components/dashboard/listings/admin-review-ticks";
import ListingIntakeReviewProgress from "@/components/dashboard/listings/listing-intake-review-progress";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildReviewTaskFixHref,
  DocumentStatus,
  getDocumentStatusMeta,
  isAttentionDocumentStatus,
} from "@/lib/aviatonly/domain";
import { documentReviewState } from "@/lib/aviatonly/domain/listing-intake-review-utils";
import type { MockAircraftDocument } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { FileText } from "lucide-react";

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
  const canEdit = canManageReview && !workspace.intakeReviewTasksReleasedAt;

  const afterReview = (result: { ok: boolean; finalized?: boolean }) => {
    if (!result.ok || result.finalized) {
      startTransition(() => router.refresh());
    }
  };

  if (documents.length === 0) {
    return (
      <WorkflowPlaceholder
        icon={FileText}
        title="No documents uploaded"
        description="Private document vault slots will appear here once uploaded during intake."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {canManageReview ? (
        <ListingIntakeReviewProgress workspace={workspace} documents={documents} />
      ) : null}

      <ul className="flex flex-col gap-2">
        {documents.map((doc) => {
          const label = doc.documentType.replace(/-/g, " ");
          const state = documentReviewState(doc.reviewStatus);
          const needsFix = !canManageReview && isAttentionDocumentStatus(doc.reviewStatus);
          const fixHref = buildReviewTaskFixHref(listing.id, {
            sourceType: "document",
            sourceKey: doc.id,
            title: label,
          });

          return (
            <li
              key={doc.id}
              id={`review-${doc.id}`}
              className="scroll-mt-24 rounded-lg border border-border px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span>
                    {label} · {doc.fileName}
                  </span>
                  {needsFix && doc.rejectionReason ? (
                    <p className="mt-1 text-muted-foreground">{doc.rejectionReason}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {canManageReview ? (
                    <AdminReviewTicks
                      label={label}
                      reviewState={state}
                      canEdit={canEdit}
                      onApprove={async () => {
                        applyOptimisticDocument({
                          documentId: doc.id,
                          reviewStatus: DocumentStatus.ACCEPTED,
                        });
                        const result = await adminReviewListingDocumentAction({
                          listingId: listing.id,
                          documentId: doc.id,
                          approved: true,
                        });
                        afterReview(result);
                        return result;
                      }}
                      onReject={async (reason) => {
                        applyOptimisticDocument({
                          documentId: doc.id,
                          reviewStatus: DocumentStatus.REJECTED,
                        });
                        const result = await adminReviewListingDocumentAction({
                          listingId: listing.id,
                          documentId: doc.id,
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
                      <Badge variant={getDocumentStatusMeta(doc.reviewStatus).badgeVariant}>
                        {getDocumentStatusMeta(doc.reviewStatus).label}
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

export default ListingDocumentsReviewTab;
