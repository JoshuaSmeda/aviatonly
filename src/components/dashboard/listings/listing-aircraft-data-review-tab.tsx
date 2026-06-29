"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { adminReviewListingFieldAction } from "@/app/(dashboard)/dashboard/admin/listings/actions";
import AdminReviewTicks from "@/components/dashboard/listings/admin-review-ticks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildAircraftDataReviewRows,
  buildReviewTaskFixHref,
  FieldReviewStatus,
  getFieldReviewStatusMeta,
  ListingStatus,
} from "@/lib/aviatonly/domain";
import { fieldReviewState } from "@/lib/aviatonly/domain/listing-intake-review-utils";
import { listingLocation } from "@/lib/aviatonly/mock";
import type { MockListingFieldReview } from "@/lib/aviatonly/mock/types";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import { cn } from "@/lib/utils";
import ListingIntakeReviewProgress from "./listing-intake-review-progress";

const WIDE_FIELDS = new Set(["damage-history", "avionics", "maintenance-notes"]);

type FieldReviewOptimisticAction =
  | {
      type: "approve";
      fieldKey: string;
      label: string;
    }
  | {
      type: "reject";
      fieldKey: string;
      label: string;
      rejectionReason: string;
    };

function applyFieldReviewOptimistic(
  current: MockListingFieldReview[],
  action: FieldReviewOptimisticAction,
  listingId: string,
): MockListingFieldReview[] {
  const now = new Date().toISOString();
  const status =
    action.type === "approve" ? FieldReviewStatus.APPROVED : FieldReviewStatus.REJECTED;
  const existing = current.find((review) => review.fieldKey === action.fieldKey);

  if (existing) {
    return current.map((review) =>
      review.fieldKey === action.fieldKey
        ? {
            ...review,
            status,
            rejectionReason: action.type === "reject" ? action.rejectionReason : null,
            rejectionPreset: action.type === "reject" ? null : null,
            reviewedAt: now,
          }
        : review,
    );
  }

  return [
    ...current,
    {
      id: `optimistic-${action.fieldKey}`,
      listingId,
      fieldKey: action.fieldKey,
      label: action.label,
      status,
      rejectionReason: action.type === "reject" ? action.rejectionReason : null,
      rejectionPreset: null,
      reviewedById: null,
      reviewedAt: now,
    },
  ];
}

interface ListingAircraftDataReviewTabProps {
  workspace: ListingWorkspaceData;
  canManageReview: boolean;
}

const ListingAircraftDataReviewTab = ({
  workspace,
  canManageReview,
}: ListingAircraftDataReviewTabProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { listing, airframe, engines, propellers, avionics, maintenance } = workspace;
  const [fieldReviews, applyOptimisticFieldReview] = useOptimistic(
    workspace.fieldReviews,
    (current, action: FieldReviewOptimisticAction) =>
      applyFieldReviewOptimistic(current, action, listing.id),
  );
  const fieldMap = new Map(fieldReviews.map((r) => [r.fieldKey, r]));
  const canEdit = canManageReview && !workspace.intakeReviewTasksReleasedAt;

  const adminRows = buildAircraftDataReviewRows(workspace);
  const sellerReviewMode =
    !canManageReview &&
    (listing.status === ListingStatus.NEEDS_CHANGES ||
      workspace.fieldReviews.some((review) => review.status === FieldReviewStatus.REJECTED));
  const sellerFieldMap = new Map(workspace.fieldReviews.map((review) => [review.fieldKey, review]));

  const afterReview = (result: { ok: boolean; finalized?: boolean }) => {
    if (!result.ok || result.finalized) {
      startTransition(() => router.refresh());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {canManageReview ? (
        <ListingIntakeReviewProgress workspace={workspace} fieldReviews={fieldReviews} />
      ) : null}

      {canManageReview && workspace.intakeReviewTasksReleasedAt ? (
        <Alert>
          <AlertTitle>Review locked</AlertTitle>
          <AlertDescription>
            Tasks were sent to the seller. Further intake edits require a new submission cycle.
          </AlertDescription>
        </Alert>
      ) : null}

      <dl className="grid gap-4 text-sm md:grid-cols-2">
        {canManageReview
          ? adminRows.map((row) => {
              const state = fieldReviewState(
                fieldMap.get(row.fieldKey)?.status ?? FieldReviewStatus.PENDING,
              );

              return (
                <div
                  key={row.fieldKey}
                  id={`review-${row.fieldKey}`}
                  className={cn(
                    "flex items-start justify-between gap-3 scroll-mt-24",
                    WIDE_FIELDS.has(row.fieldKey) && "md:col-span-2",
                  )}
                >
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                  <AdminReviewTicks
                    label={row.label}
                    reviewState={state}
                    canEdit={canEdit}
                    onApprove={async () => {
                      applyOptimisticFieldReview({
                        type: "approve",
                        fieldKey: row.fieldKey,
                        label: row.label,
                      });
                      const result = await adminReviewListingFieldAction({
                        listingId: listing.id,
                        fieldKey: row.fieldKey,
                        label: row.label,
                        approved: true,
                      });
                      afterReview(result);
                      return result;
                    }}
                    onReject={async (reason) => {
                      applyOptimisticFieldReview({
                        type: "reject",
                        fieldKey: row.fieldKey,
                        label: row.label,
                        rejectionReason: reason.customReason ?? reason.presetId ?? "Needs changes",
                      });
                      const result = await adminReviewListingFieldAction({
                        listingId: listing.id,
                        fieldKey: row.fieldKey,
                        label: row.label,
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
            })
          : sellerReviewMode
            ? adminRows.map((row) => {
                const review = sellerFieldMap.get(row.fieldKey);
                const isRejected = review?.status === FieldReviewStatus.REJECTED;
                const rejectedMeta = getFieldReviewStatusMeta(FieldReviewStatus.REJECTED);
                const fixHref = buildReviewTaskFixHref(listing.id, {
                  sourceType: "field",
                  sourceKey: row.fieldKey,
                  title: row.label,
                });

                return (
                  <div
                    key={row.fieldKey}
                    id={`review-${row.fieldKey}`}
                    className={cn(
                      "flex flex-col gap-2 scroll-mt-24",
                      WIDE_FIELDS.has(row.fieldKey) && "md:col-span-2",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <dt className="flex flex-wrap items-center gap-2 text-muted-foreground">
                          {row.label}
                          {isRejected ? (
                            <Badge variant={rejectedMeta.badgeVariant}>{rejectedMeta.label}</Badge>
                          ) : null}
                        </dt>
                        <dd className="font-medium">{row.value}</dd>
                        {isRejected && review?.rejectionReason ? (
                          <p className="mt-1 text-sm text-muted-foreground">{review.rejectionReason}</p>
                        ) : null}
                      </div>
                      {isRejected ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          render={<Link href={fixHref} />}
                        >
                          Fix
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            : (
            <>
              <div>
                <dt className="text-muted-foreground">Registration</dt>
                <dd className="font-medium">{listing.registration}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Registration type</dt>
                <dd className="font-medium">{listing.registrationType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Make / model</dt>
                <dd className="font-medium">
                  {listing.make} {listing.model}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Year</dt>
                <dd className="font-medium">{listing.year}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{listing.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{listingLocation(listing)}</dd>
              </div>
              {airframe?.totalTimeAirframe != null && (
                <div>
                  <dt className="text-muted-foreground">TTAF</dt>
                  <dd className="font-medium">
                    {airframe.totalTimeAirframe.toLocaleString()} hrs
                  </dd>
                </div>
              )}
              {airframe?.damageHistory && (
                <div className="md:col-span-2">
                  <dt className="text-muted-foreground">Damage history</dt>
                  <dd className="font-medium">{airframe.damageHistory}</dd>
                </div>
              )}
              {engines[0] && (
                <div>
                  <dt className="text-muted-foreground">Engine</dt>
                  <dd className="font-medium">
                    {engines[0].manufacturer} {engines[0].model} · {engines[0].engineHours} hrs
                    {engines[0].timeSinceOverhaul != null &&
                      ` · TSO ${engines[0].timeSinceOverhaul} hrs`}
                  </dd>
                </div>
              )}
              {propellers[0] && (
                <div>
                  <dt className="text-muted-foreground">Propeller</dt>
                  <dd className="font-medium">
                    {propellers[0].manufacturer} {propellers[0].model}
                    {propellers[0].propellerHours != null &&
                      ` · ${propellers[0].propellerHours} hrs`}
                  </dd>
                </div>
              )}
              {avionics && (
                <div className="md:col-span-2">
                  <dt className="text-muted-foreground">Avionics</dt>
                  <dd className="font-medium">{avionics.equipment.join(", ")}</dd>
                </div>
              )}
              {maintenance && (
                <>
                  <div>
                    <dt className="text-muted-foreground">Maintenance status</dt>
                    <dd className="font-medium">{maintenance.status}</dd>
                  </div>
                  {maintenance.lastMpiDate && (
                    <div>
                      <dt className="text-muted-foreground">Last MPI</dt>
                      <dd className="font-medium">
                        {new Date(maintenance.lastMpiDate).toLocaleDateString("en-ZA")}
                      </dd>
                    </div>
                  )}
                  {maintenance.notes && (
                    <div className="md:col-span-2">
                      <dt className="text-muted-foreground">Maintenance notes</dt>
                      <dd className="font-medium">{maintenance.notes}</dd>
                    </div>
                  )}
                </>
              )}
            </>
          )}
      </dl>
    </div>
  );
};

export default ListingAircraftDataReviewTab;
