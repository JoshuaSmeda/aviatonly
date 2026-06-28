// import Intro from '@/app/(site)/ui-blocks/shared/Intro'
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ChartRadarLabelCustom from "@/components/dashboard/charts/shadcn/radar/customlabel";
import ChartRadarDefault from "@/components/dashboard/charts/shadcn/radar/default";
import ChartRadarDots from "@/components/dashboard/charts/shadcn/radar/dots";
import ChartRadarGridCircle from "@/components/dashboard/charts/shadcn/radar/gridcircle";
import ChartRadarGridCircleFill from "@/components/dashboard/charts/shadcn/radar/gridcirclefilled";
import ChartRadarGridCircleNoLines from "@/components/dashboard/charts/shadcn/radar/gridcirclenolines";
import ChartRadarGridCustom from "@/components/dashboard/charts/shadcn/radar/gridcustom";
import ChartRadarGridFill from "@/components/dashboard/charts/shadcn/radar/gridfilled";
import ChartRadarGridNone from "@/components/dashboard/charts/shadcn/radar/gridnone";
import ChartRadarLegend from "@/components/dashboard/charts/shadcn/radar/legend";
import ChartRadarLinesOnly from "@/components/dashboard/charts/shadcn/radar/linesonly";
import ChartRadarMultiple from "@/components/dashboard/charts/shadcn/radar/multiple";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Radar Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Create radar charts and spider web graphs with Shadcn UI components built with Tailwind React for dashboard multi-dimensional comparison.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Radar Chart",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Radar Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* intro */}
        {/* <div className='col-span-12'>
          <Intro detail={intro} />
        </div> */}
        {/* Default */}
        <div className="col-span-12">
          <ChartRadarDefault />
        </div>
        {/* Dots */}
        <div className="col-span-12">
          <ChartRadarDots />
        </div>
        {/* Lines Only */}
        <div className="col-span-12">
          <ChartRadarLinesOnly />
        </div>
        {/* Custom Label */}
        <div className="col-span-12">
          <ChartRadarLabelCustom />
        </div>
        {/* Grid Custom */}
        <div className="col-span-12">
          <ChartRadarGridCustom />
        </div>
        {/* Grid None */}
        <div className="col-span-12">
          <ChartRadarGridNone />
        </div>
        {/* Grid Circle */}
        <div className="col-span-12">
          <ChartRadarGridCircle />
        </div>
        {/* Grid Circle - No lines */}
        <div className="col-span-12">
          <ChartRadarGridCircleNoLines />
        </div>
        {/* Grid Circle Filled */}
        <div className="col-span-12">
          <ChartRadarGridCircleFill />
        </div>
        {/* Grid Filled */}
        <div className="col-span-12">
          <ChartRadarGridFill />
        </div>
        {/* Multiple */}
        <div className="col-span-12">
          <ChartRadarMultiple />
        </div>
        {/* Legend */}
        <div className="col-span-12">
          <ChartRadarLegend />
        </div>
      </div>
    </>
  );
};

export default page;
