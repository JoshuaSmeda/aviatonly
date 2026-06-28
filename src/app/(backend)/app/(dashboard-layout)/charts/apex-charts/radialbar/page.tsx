import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ApexRadialChart from "@/app/components/charts/apex-charts/radialbarchart";
import ApexRadarChart from "@/app/components/charts/apex-charts/radarchart";
import CodePreview from "@/app/components/shared/code-preview";

export const metadata: Metadata = {
  title: "Radial Chart",
  description: "demo",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Radialbar & Radar",
  },
];

const RadialChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Radialbar & Radar" items={BCrumb} />
      <div className="flex flex-col gap-6">
        {/* Radialbar Chart */}
        <div>
          <CodePreview
            component={<ApexRadialChart />}
            filePath="/app/components/charts/apex-charts/radialbarchart.tsx"
            title="Radialbar Chart"
          />
        </div>
        {/* Radar Chart */}
        <div>
          <CodePreview
            component={<ApexRadarChart />}
            filePath="/app/components/charts/apex-charts/radarchart.tsx"
            title="Radar Chart"
          />
        </div>
      </div>
    </>
  );
};

export default RadialChart;
