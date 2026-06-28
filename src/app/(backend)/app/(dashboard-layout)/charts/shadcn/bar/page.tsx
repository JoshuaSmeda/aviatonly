import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ChartBarActive from "@/app/components/charts/shadcn/bar/active";
import ChartBarLabelCustom from "@/app/components/charts/shadcn/bar/customlabel";
import ChartBarDefault from "@/app/components/charts/shadcn/bar/default";
import ChartBarHorizontal from "@/app/components/charts/shadcn/bar/horizontal";
import ChartBarInteractive from "@/app/components/charts/shadcn/bar/interactive";
import ChartBarLabel from "@/app/components/charts/shadcn/bar/label";
import ChartBarMixed from "@/app/components/charts/shadcn/bar/mixed";
import ChartBarMultiple from "@/app/components/charts/shadcn/bar/multiple";
import ChartBarNegative from "@/app/components/charts/shadcn/bar/negative";
import ChartBarStacked from "@/app/components/charts/shadcn/bar/stackedlegend";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bar Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build interactive bar charts and column graphs with Shadcn UI components built with Tailwind React for dashboard statistical display.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Bar Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Bar Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Default */}
        <div className="col-span-12">
          <ChartBarDefault />
        </div>
        {/* Horizontal */}
        <div className="col-span-12">
          <ChartBarHorizontal />
        </div>
        {/* Multiple */}
        <div className="col-span-12">
          <ChartBarMultiple />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartBarStacked />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartBarLabel />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartBarLabelCustom />
        </div>
        {/* Mixed */}
        <div className="col-span-12">
          <ChartBarMixed />
        </div>
        {/* Active */}
        <div className="col-span-12">
          <ChartBarActive />
        </div>
        {/* Negative */}
        <div className="col-span-12">
          <ChartBarNegative />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartBarInteractive />
        </div>
      </div>
    </>
  );
};

export default page;
