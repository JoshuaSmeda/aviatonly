import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPieDonutactive from "./code/donutactivecode";

const ChartPieDonutActive = () => {
  return (
    <>
      <CodePreview
        component={<ChartPieDonutactive />}
        title="Donut Active"
        filePath="/app/components/charts/shadcn/pie/code/DonutActiveCode.tsx"
      />
    </>
  );
};

export default ChartPieDonutActive;
