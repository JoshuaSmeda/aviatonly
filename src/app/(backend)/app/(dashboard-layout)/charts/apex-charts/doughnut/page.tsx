import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ApexDoughnutChart from "@/app/components/charts/apex-charts/doughnutchart";
import ApexPieChart from "@/app/components/charts/apex-charts/piechart";
import CodePreview from "@/app/components/shared/code-preview";

export const metadata: Metadata = {
  title: "Doughnut & Pie Chart",
  description: "Interactive doughnut and pie chart demos with code previews.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Doughtnut & Pie",
  },
];

const DoughnutChart = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Doughtnut & Pie" items={BCrumb} />
      <div className="flex flex-col gap-6">
        {/* Doughnut Chart */}
        <div>
          <CodePreview
            component={<ApexDoughnutChart />}
            filePath="/app/components/charts/apex-charts/doughnutchart.tsx"
            title="Doughnut Chart"
          />
        </div>
        {/* Pie Chart */}
        <div>
          <CodePreview
            component={<ApexPieChart />}
            filePath="/app/components/charts/apex-charts/piechart.tsx"
            title="Pie Chart"
          />
        </div>
      </div>
    </>
  );
};

export default DoughnutChart;
