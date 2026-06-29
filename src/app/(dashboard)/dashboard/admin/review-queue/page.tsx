import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ReviewQueueTable from "@/components/dashboard/admin/review-queue-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { buildReviewQueueRows } from "@/lib/aviatonly/mock";

export const metadata: Metadata = {
  title: "Review Queue | AVIATONLY Admin",
};

const ReviewQueuePage = () => {
  const queueCount = buildReviewQueueRows().length;

  return (
    <>
      <BreadcrumbComp title="Review Queue" />
      <TitleCard title="Admin · Review Queue">
        <p className="mb-4 text-sm text-muted-foreground">
          {queueCount} aircraft awaiting AVIATONLY review, valuation, or inspection scheduling.
        </p>
        <ReviewQueueTable />
      </TitleCard>
    </>
  );
};

export default ReviewQueuePage;
