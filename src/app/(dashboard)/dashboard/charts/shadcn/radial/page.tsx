// import Intro from '@/app/(site)/ui-blocks/shared/Intro'
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ChartRadialSimple from "@/components/dashboard/charts/shadcn/radial/default";
import ChartRadialGrid from "@/components/dashboard/charts/shadcn/radial/grid";
import ChartRadialLabel from "@/components/dashboard/charts/shadcn/radial/label";
import ChartRadialShape from "@/components/dashboard/charts/shadcn/radial/shape";
import ChartRadialStacked from "@/components/dashboard/charts/shadcn/radial/stacked";
import ChartRadialText from "@/components/dashboard/charts/shadcn/radial/text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Radial Chart Component for Dashboards Built with Shadcn UI",
  description:
    "Build radial charts and circular progress graphs with Shadcn UI components built with Tailwind React for dashboard percentage visualization.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shadcn Radialbar",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Shadcn Radialbar Chart" items={BCrumb} />
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        {/* Default */}
        <div className="col-span-12">
          <ChartRadialSimple />
        </div>
        {/* Label */}
        <div className="col-span-12">
          <ChartRadialLabel />
        </div>
        {/* Grid */}
        <div className="col-span-12">
          <ChartRadialGrid />
        </div>
        {/* Text */}
        <div className="col-span-12">
          <ChartRadialText />
        </div>
        {/* Shape */}
        <div className="col-span-12">
          <ChartRadialShape />
        </div>
        {/* Stacked */}
        <div className="col-span-12">
          <ChartRadialStacked />
        </div>
      </div>
    </>
  );
};

export default page;
