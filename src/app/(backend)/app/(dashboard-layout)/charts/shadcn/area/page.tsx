import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ChartAreaAxes from "@/app/components/charts/shadcn/area/axes";
import ChartAreaDefault from "@/app/components/charts/shadcn/area/default";
import ChartAreaGradient from "@/app/components/charts/shadcn/area/gradient";
import ChartAreaIcons from "@/app/components/charts/shadcn/area/icons";
import ChartAreaInteractive from "@/app/components/charts/shadcn/area/interactive";
import ChartAreaLegend from "@/app/components/charts/shadcn/area/legend";
import ChartAreaLinear from "@/app/components/charts/shadcn/area/linear";
import ChartAreaStacked from "@/app/components/charts/shadcn/area/stacked";
import ChartAreaStackedExpand from "@/app/components/charts/shadcn/area/stacked-expanded";
import ChartAreaStep from "@/app/components/charts/shadcn/area/step";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create responsive area charts and filled line graphs with Shadcn UI components built with Tailwind React for dashboard data visualization.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Area Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Area Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* default */}
        <div className="col-span-12">
          <ChartAreaDefault />
        </div>
        {/* Linear */}
        <div className="col-span-12">
          <ChartAreaLinear />
        </div>
        {/* Step */}
        <div className="col-span-12">
          <ChartAreaStep />
        </div>
        {/* Legend */}
        <div className="col-span-12">
          <ChartAreaLegend />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartAreaStacked />
        </div>
        {/* Stacked expanded */}
        <div className="col-span-12">
          <ChartAreaStackedExpand />
        </div>
        {/* Icons */}
        <div className="col-span-12">
          <ChartAreaIcons />
        </div>
        {/* Gradient */}
        <div className="col-span-12">
          <ChartAreaGradient />
        </div>
        {/* Axes */}
        <div className="col-span-12">
          <ChartAreaAxes />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartAreaInteractive />
        </div>
      </div>
    </>
  );
};

export default page;
