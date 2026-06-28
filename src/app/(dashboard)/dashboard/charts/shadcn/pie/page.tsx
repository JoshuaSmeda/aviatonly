// import Intro from '@/app/(site)/ui-blocks/shared/Intro'
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ChartPieLabelCustom from "@/components/dashboard/charts/shadcn/pie/customlabel";
import ChartPieSimple from "@/components/dashboard/charts/shadcn/pie/default";
import ChartPieDonut from "@/components/dashboard/charts/shadcn/pie/donut";
import ChartPieDonutActive from "@/components/dashboard/charts/shadcn/pie/donutactive";
import ChartPieDonutText from "@/components/dashboard/charts/shadcn/pie/donutwithtext";
import ChartPieInteractive from "@/components/dashboard/charts/shadcn/pie/interactive";
import ChartPieLabel from "@/components/dashboard/charts/shadcn/pie/label";
import ChartPieLabelList from "@/components/dashboard/charts/shadcn/pie/labellist";
import ChartPieLegend from "@/components/dashboard/charts/shadcn/pie/legend";
import ChartPieSeparatorNone from "@/components/dashboard/charts/shadcn/pie/separatornone";
import ChartPieStacked from "@/components/dashboard/charts/shadcn/pie/stacked";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pie Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build circular pie charts and donut graphs with Shadcn UI components built with Tailwind React for dashboard proportional data representation.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Donughnut & Pie Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Donughnut & Pie Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartPieSimple />
        </div>
        {/* Separator None */}
        <div className="col-span-12">
          <ChartPieSeparatorNone />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartPieLabel />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartPieLabelCustom />
        </div>
        {/* Label List */}
        <div className="col-span-12">
          <ChartPieLabelList />
        </div>
        {/* Legend */}
        <div className="col-span-12">
          <ChartPieLegend />
        </div>
        {/* Donut */}
        <div className="col-span-12">
          <ChartPieDonut />
        </div>
        {/* Donut Active */}
        <div className="col-span-12">
          <ChartPieDonutActive />
        </div>
        {/* Donut With Text */}
        <div className="col-span-12">
          <ChartPieDonutText />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartPieStacked />
        </div>
        {/* Interactive */}
        <div className="col-span-12">
          <ChartPieInteractive />
        </div>
      </div>
    </>
  );
};

export default page;
