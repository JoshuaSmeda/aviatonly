
import React from "react";
import CampaignPerformance from "@/app/components/dashboards/analytics/campaign-perf";
import CurrentVisits from "@/app/components/dashboards/analytics/current-visits";
import KeyInsights from "@/app/components/dashboards/analytics/key-insights";
import ProductActionCards from "@/app/components/dashboards/analytics/product-action-cards";
import ReportBanner from "@/app/components/dashboards/analytics/report-banner";
import TrafficData from "@/app/components/dashboards/analytics/traffic-data";
import WebsiteVisits from "@/app/components/dashboards/analytics/website-visits";
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
