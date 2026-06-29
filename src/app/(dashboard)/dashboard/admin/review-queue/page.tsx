import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ReviewQueueTable from "@/components/dashboard/admin/review-queue-table";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { queryReviewQueueRows } from "@/lib/aviatonly/server/seller-dashboard";

export const metadata: Metadata = {
  title: "Review Queue | AVIATONLY Admin",
};

const ReviewQueuePage = async () => {
  const rows = await queryReviewQueueRows();

  return (
    <>
      <BreadcrumbComp title="Review Queue" />
      <TitleCard title="Admin · Review Queue">
        <p className="mb-4 text-sm text-muted-foreground">
          {rows.length} aircraft awaiting AVIATONLY review, valuation, or inspection scheduling.
        </p>
        <ReviewQueueTable rows={rows} />
      </TitleCard>
    </>
  );
};

export default ReviewQueuePage;
