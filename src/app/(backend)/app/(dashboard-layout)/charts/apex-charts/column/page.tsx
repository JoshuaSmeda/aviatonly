import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ApexColumnChart from "@/app/components/charts/apex-charts/columnchart";
import CodePreview from "@/app/components/shared/code-preview";

export const metadata: Metadata = {
  title: "Column Chart",
  description: "Interactive column chart demo with code preview.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Column",
  },
];

const ColumnChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Column" items={BCrumb} />
      <CodePreview
        component={<ApexColumnChart />}
        filePath="/app/components/charts/apex-charts/columnchart.tsx"
        title="Column Chart"
      />
    </>
  );
};

export default ColumnChart;
