import { Metadata } from "next";

import ApexAreaChart from "@/components/dashboard/charts/apex-charts/areachart";
import CodePreview from "@/components/dashboard/shared/code-preview";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Area Chart",
  description: "Interactive area chart demo with code preview.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Area",
  },
];

const AreaChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Area" items={BCrumb} />
      <CodePreview
        component={<ApexAreaChart />}
        filePath="/app/components/charts/apex-charts/areachart.tsx"
        title="Area Chart"
      />
    </>
  );
};

export default AreaChart;
