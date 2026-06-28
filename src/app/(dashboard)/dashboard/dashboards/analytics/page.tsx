
import React from "react";
import CampaignPerformance from "@/components/dashboard/dashboards/analytics/campaign-perf";
import CurrentVisits from "@/components/dashboard/dashboards/analytics/current-visits";
import KeyInsights from "@/components/dashboard/dashboards/analytics/key-insights";
import ProductActionCards from "@/components/dashboard/dashboards/analytics/product-action-cards";
import ReportBanner from "@/components/dashboard/dashboards/analytics/report-banner";
import TrafficData from "@/components/dashboard/dashboards/analytics/traffic-data";
import WebsiteVisits from "@/components/dashboard/dashboards/analytics/website-visits";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Analytics Admin Dashboard",
  description: "Analytics template page",
};

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="lg:col-span-8 col-span-12">
        <ReportBanner />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <KeyInsights />
      </div>
      <div className="lg:col-span-8 col-span-12">
        <WebsiteVisits />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <CurrentVisits />
      </div>
      <div className="col-span-12">
        <ProductActionCards />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <CampaignPerformance />
      </div>
      <div className="lg:col-span-8 col-span-12">
        <TrafficData />
      </div>
    </div>
  );
};

export default page;
