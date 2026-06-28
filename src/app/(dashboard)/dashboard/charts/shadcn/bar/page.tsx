import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ChartBarActive from "@/components/dashboard/charts/shadcn/bar/active";
import ChartBarLabelCustom from "@/components/dashboard/charts/shadcn/bar/customlabel";
import ChartBarDefault from "@/components/dashboard/charts/shadcn/bar/default";
import ChartBarHorizontal from "@/components/dashboard/charts/shadcn/bar/horizontal";
import ChartBarInteractive from "@/components/dashboard/charts/shadcn/bar/interactive";
import ChartBarLabel from "@/components/dashboard/charts/shadcn/bar/label";
import ChartBarMixed from "@/components/dashboard/charts/shadcn/bar/mixed";
import ChartBarMultiple from "@/components/dashboard/charts/shadcn/bar/multiple";
import ChartBarNegative from "@/components/dashboard/charts/shadcn/bar/negative";
import ChartBarStacked from "@/components/dashboard/charts/shadcn/bar/stackedlegend";
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
