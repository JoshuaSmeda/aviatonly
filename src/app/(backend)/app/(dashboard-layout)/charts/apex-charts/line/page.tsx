import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ApexLineChart from "@/app/components/charts/apex-charts/linechart";
import CodePreview from "@/app/components/shared/code-preview";

export const metadata: Metadata = {
  title: "Line Chart",
  description: "Interactive line chart demonstration with source code.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Line",
  },
];

const LineChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Line" items={BCrumb} />
      <CodePreview
        component={<ApexLineChart />}
        filePath="/app/components/charts/apex-charts/linechart.tsx"
        title="Line Chart"
      />
    </>
  );
};

export default LineChart;
