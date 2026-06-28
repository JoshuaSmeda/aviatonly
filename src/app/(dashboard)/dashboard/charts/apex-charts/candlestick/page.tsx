import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import ApexCandleStick from "@/components/dashboard/charts/apex-charts/candlestickschart";
import CodePreview from "@/components/dashboard/shared/code-preview";

export const metadata: Metadata = {
  title: "Candlestick Chart",
  description: "Interactive candlestick chart demo with code preview.",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chart Apex Candlestick",
  },
];
const CandleStick = () => {
  return (
    <>
      <BreadcrumbComp title="Chart Apex Candlestick" items={BCrumb} />
      <CodePreview
        component={<ApexCandleStick />}
        filePath="/app/components/charts/apex-charts/candlestickschart.tsx"
        title="Candlestick Chart"
      />
    </>
  );
};

export default CandleStick;
