import Congratulations from "@/components/dashboard/dashboards/ecommerce/congratulations";
import Customer from "@/components/dashboard/dashboards/ecommerce/customer-widget";
import LatestDeal from "@/components/dashboard/dashboards/ecommerce/latest-deal";
import LatestReview from "@/components/dashboard/dashboards/ecommerce/latest-review";
import Payments from "@/components/dashboard/dashboards/ecommerce/payments";
import ProductTable from "@/components/dashboard/dashboards/ecommerce/product-table";
import Products from "@/components/dashboard/dashboards/ecommerce/products";
import TotalSales from "@/components/dashboard/dashboards/crm-dashboard/total-sales";
import { Metadata } from "next";
import UpcomingSchedules from "@/components/dashboard/dashboards/ecommerce/upcoming-schedules";

export const metadata: Metadata = {
  title: "eCommerce Admin Dashboard",
  description: "eCommerce template page",
};

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="xl:col-span-6  col-span-12">
        <Congratulations />
      </div>
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <Customer />
      </div>
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <Products />
      </div>
      <div className="xl:col-span-6 col-span-12">
        <TotalSales />
      </div>
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <LatestDeal />
      </div>
      <div className="xl:col-span-3 md:col-span-6 col-span-12">
        <Payments />
      </div>
      <div className="xl:col-span-8 col-span-12">
        <ProductTable />
      </div>
      <div className="xl:col-span-4 col-span-12">
        <UpcomingSchedules />
      </div>
      <div className=" col-span-12">
        <LatestReview />
      </div>
    </div>
  );
};

export default page;
