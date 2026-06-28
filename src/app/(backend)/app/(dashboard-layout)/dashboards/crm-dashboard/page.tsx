import { Metadata } from "next";
import EcommerceActionsCards from "@/app/components/dashboards/crm-dashboard/ecommerce-action";
import CampaignPerformance from "@/app/components/dashboards/crm-dashboard/campaign-performance";
import TopProjectsTable from "@/app/components/dashboards/analytics/top-projects-table";
import ActivityTimeline from "@/app/components/dashboards/crm-dashboard/activity-timeline";
import SalesOverviewChart from "@/app/components/dashboards/crm-dashboard/sales-overview";
import EarningReportChart from "@/app/components/dashboards/crm-dashboard/earning-report-chart";
import AnnualProfit from "@/app/components/dashboards/crm-dashboard/annual-profit";
import WeeklySales from "@/app/components/dashboards/crm-dashboard/weekly-sales";
export const metadata: Metadata = {
  title: "Modern Admin Dashboard",
  description: "Modern template page",
};

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <EcommerceActionsCards />
      </div>
      <div className="xl:col-span-8 col-span-12">
        <SalesOverviewChart/>
      </div>
      <div className="xl:col-span-4 md:col-span-6 col-span-12">
        <EarningReportChart />
      </div>
      <div className="xl:col-span-4 md:col-span-6  col-span-12">
        <AnnualProfit />
      </div>
      <div className="xl:col-span-4  md:col-span-6 col-span-12">
        <CampaignPerformance />
      </div>
      <div className="xl:col-span-4 md:col-span-6 col-span-12">
        <WeeklySales />
      </div>
      <div className="xl:col-span-8 col-span-12">
        <TopProjectsTable />
      </div>
      <div className="xl:col-span-4 col-span-12">
        <ActivityTimeline />
      </div>
    </div>
  );
};

export default page;
