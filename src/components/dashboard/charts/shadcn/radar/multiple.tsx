import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadarmultiple from "./code/multiplecode";

const ChartRadarMultiple = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarmultiple />}
        title="Multiple"
        filePath="/app/components/charts/shadcn/radar/code/multiplecode.tsx"
      />
    </>
  );
};

export default ChartRadarMultiple;
