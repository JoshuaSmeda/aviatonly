import CodePreview from "@/app/components/shared/code-preview";
import ChartPieDonuttext from "./code/donutwithtextcode";

const ChartPieDonutText = () => {
  return (
    <>
      <CodePreview
        component={<ChartPieDonuttext />}
        title="Donut With Text"
        filePath="/app/components/charts/shadcn/pie/code/donutwithtextcode.tsx"
      />
    </>
  );
};

export default ChartPieDonutText;
