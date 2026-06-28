// import Intro from '@/app/(site)/ui-blocks/shared/Intro'
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ChartLineDotsCustom from "@/components/dashboard/charts/shadcn/line/customdots";
import ChartLineLabelCustom from "@/components/dashboard/charts/shadcn/line/customlabel";
import ChartLineDefault from "@/components/dashboard/charts/shadcn/line/default";
import ChartLineDots from "@/components/dashboard/charts/shadcn/line/dots";
import ChartLineDotsColors from "@/components/dashboard/charts/shadcn/line/dotscolors";
import ChartLineInteractive from "@/components/dashboard/charts/shadcn/line/interactive";
import ChartLineLabel from "@/components/dashboard/charts/shadcn/line/label";
import ChartLineLinear from "@/components/dashboard/charts/shadcn/line/linear";
import ChartLineMultiple from "@/components/dashboard/charts/shadcn/line/multiple";
import ChartLineStep from "@/components/dashboard/charts/shadcn/line/step";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Line Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create smooth line charts and trend graphs with Shadcn UI components built with Tailwind React for dashboard time-series visualization.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Line Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Line Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Default */}
        <div className="col-span-12 ">
          <ChartLineDefault />
        </div>
        {/* Linear */}
        <div className="col-span-12">
          <ChartLineLinear />
        </div>
        {/* Step */}
        <div className="col-span-12">
          <ChartLineStep />
        </div>
        {/* Multiple */}
        <div className="col-span-12">
          <ChartLineMultiple />
        </div>
        {/* Dots */}
        <div className="col-span-12">
          <ChartLineDots />
        </div>
        {/* Custom Dots */}
        <div className="col-span-12">
          <ChartLineDotsCustom />
        </div>
        {/* Dots Colors */}
        <div className="col-span-12">
          <ChartLineDotsColors />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartLineLabel />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartLineLabelCustom />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartLineInteractive />
        </div>
      </div>
    </>
  );
};

export default page;
