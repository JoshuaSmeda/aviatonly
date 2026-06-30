"use client";

import Link from "next/link";
import AdminReviewTicks from "@/components/dashboard/listings/admin-review-ticks";
import { useWorkspaceDocumentDownload } from "@/components/dashboard/shared/use-workspace-document-download";
import { DOCUMENT_SLOTS } from "@/components/dashboard/seller/upload/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildReviewTaskFixHref,
  getDocumentStatusMeta,
  isAttentionDocumentStatus,
} from "@/lib/aviatonly/domain";
import { documentReviewState } from "@/lib/aviatonly/domain/listing-intake-review-utils";
import type { MockAircraftDocument } from "@/lib/aviatonly/mock/types";
import { getGuidedDocumentSlotLabel } from "@/lib/upload/document-slot-keys";
import { cn } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

function formatSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return "On file";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ListingGuidedDocumentGridProps {
  listingId: string;
  documents: MockAircraftDocument[];
  canManageReview: boolean;
  canEditReview: boolean;
  showSellerActions: boolean;
  onApprove: (documentId: string) => Promise<{ ok: boolean; finalized?: boolean }>;
  onReject: (
    documentId: string,
    reason: { presetId: string; customReason?: string },
  ) => Promise<{ ok: boolean; finalized?: boolean }>;
}

const ListingGuidedDocumentGrid = ({
  listingId,
  documents,
  canManageReview,
  canEditReview,
  showSellerActions,
  onApprove,
  onReject,
}: ListingGuidedDocumentGridProps) => {
  const { openDocument } = useWorkspaceDocumentDownload(listingId);
  const documentsBySlot = new Map(documents.map((doc) => [doc.documentType, doc]));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {DOCUMENT_SLOTS.map((slot) => {
        const document = documentsBySlot.get(slot.id);
        const label = getGuidedDocumentSlotLabel(slot.id);
        const filled = Boolean(document);

        return (
          <div
            key={slot.id}
            id={document ? `review-${document.id}` : undefined}
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
              {document ? (
                canManageReview ? (
                  <AdminReviewTicks
                    label={label}
                    reviewState={documentReviewState(document.reviewStatus)}
                    canEdit={canEditReview}
                    onApprove={async () => onApprove(document.id)}
                    onReject={async (reason) => onReject(document.id, reason)}
                  />
                ) : (
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant={getDocumentStatusMeta(document.reviewStatus).badgeVariant}>
                      {getDocumentStatusMeta(document.reviewStatus).label}
                    </Badge>
                    {showSellerActions && isAttentionDocumentStatus(document.reviewStatus) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            href={buildReviewTaskFixHref(listingId, {
                              sourceType: "document",
                              sourceKey: document.id,
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

            {document ? (
              <>
                <div className="flex items-center gap-3 rounded-md border border-border bg-background p-2">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{document.fileName}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(document.sizeBytes)}</p>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Open ${document.fileName}`}
                    onClick={() => openDocument(document.id)}
                  >
                    <Download />
                  </Button>
                </div>
                {showSellerActions && document.rejectionReason ? (
                  <p className="text-xs text-muted-foreground">{document.rejectionReason}</p>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-16 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-3 py-4 text-xs text-muted-foreground">
                No document uploaded for this slot
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListingGuidedDocumentGrid;
