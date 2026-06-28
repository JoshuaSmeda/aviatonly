import { Metadata } from "next";
import RevenueUpdate from "@/components/dashboard/dashboards/analytics/revenue-update";
import MonthlyEarning from "@/components/dashboard/dashboards/analytics/monthly-earnings";
import YearlyBreakup from "@/components/dashboard/dashboards/analytics/yearly-breakup";
import { WeeklyStats } from "@/components/dashboard/dashboards/analytics/weekly-stats";
import SalesDownloads from "@/components/dashboard/dashboards/analytics/sales-downloads";
import RecentTransactions from "@/components/dashboard/dashboards/analytics/recent-transactions";
import TopProjectsTable from "@/components/dashboard/dashboards/analytics/top-projects-table";
import StatisticsBlock from "@/components/dashboard/dashboards/analytics/statistics";
import SalesByCountryWidget from "@/components/dashboard/dashboards/analytics/salesbycountrywidget";


export const metadata: Metadata = {
  title: "Analytics Admin Dashboard",
  description: "Analytics template page",
};

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <StatisticsBlock />
        </div>
        <div className="xl:col-span-8 col-span-12 ">
          <RevenueUpdate />
        </div>
        <div className="xl:col-span-4 col-span-12 flex flex-col gap-6">
          <MonthlyEarning />
          <YearlyBreakup />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <WeeklyStats />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <SalesDownloads />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <RecentTransactions />
        </div>
        <div className="xl:col-span-8 col-span-12">
          <TopProjectsTable />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <SalesByCountryWidget />
        </div>

      </div>
    </>
  );
};

export default page;
