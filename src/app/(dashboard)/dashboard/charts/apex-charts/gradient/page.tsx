import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ApexGradientChart from "@/components/dashboard/charts/apex-charts/gradientchart";
import CodePreview from "@/components/dashboard/shared/code-preview";

export const metadata: Metadata = {
  title: "Gradient Chart",
  description: "Interactive gradient chart demo with code preview.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Gradient",
  },
];

const GradientChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Gradient" items={BCrumb} />
      <CodePreview
        component={<ApexGradientChart />}
        filePath="/app/components/charts/apex-charts/gradientchart.tsx"
        title="Gradient Chart"
      />
    </>
  );
};

export default GradientChart;
