"use client";

import Link from "next/link";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import ListingStartIntakeReviewPanel from "@/components/dashboard/listings/listing-start-intake-review-panel";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReviewQueueRow } from "@/lib/aviatonly/mock/types";

interface ReviewQueueTableProps {
  rows: ReviewQueueRow[];
}

const ReviewQueueTable = ({ rows }: ReviewQueueTableProps) => {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No aircraft waiting in the review queue.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Submitted</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Aircraft</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Completeness</TableHead>
          <TableHead>Docs</TableHead>
          <TableHead>Photos</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reviewer</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="text-muted-foreground">
              {new Date(row.submittedAt).toLocaleDateString("en-ZA")}
            </TableCell>
            <TableCell className="font-medium">{row.registration}</TableCell>
            <TableCell>{row.aircraftTitle}</TableCell>
            <TableCell>{row.sellerName}</TableCell>
            <TableCell>{row.completeness}%</TableCell>
            <TableCell>{row.missingDocs}</TableCell>
            <TableCell>{row.photoIssues}</TableCell>
            <TableCell>
              <ListingStatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.assignedReviewer ?? "Unassigned"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {row.canStartReview ? (
                  <ListingStartIntakeReviewPanel
                    listingId={row.id}
                    listingStatus={row.status}
                    intakeReviewTasksReleasedAt={null}
                    intakeReviewerName={null}
                    compact
                  />
                ) : null}
                <Button size="sm" variant="outline" render={<Link href={`/dashboard/listings/${row.id}`} />}>
                  Open
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReviewQueueTable;
