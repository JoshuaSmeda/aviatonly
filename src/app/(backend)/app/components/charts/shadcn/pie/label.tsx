import CodePreview from "@/app/components/shared/code-preview";
import ChartPielabel from "./code/labelcode";

const ChartPieLabel = () => {
  return (
    <>
      <CodePreview
        component={<ChartPielabel />}
        title="Label"
        filePath="/app/components/charts/shadcn/pie/code/labelcode.tsx"
      />
    </>
  );
};

export default ChartPieLabel;
