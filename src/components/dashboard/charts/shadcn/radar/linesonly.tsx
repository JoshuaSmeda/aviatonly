import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadarLinesonly from "./code/linesonlycode";

const ChartRadarLinesOnly = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarLinesonly />}
        title="Lines Only"
        filePath="/app/components/charts/shadcn/radar/code/linesonlycode.tsx"
      />
    </>
  );
};

export default ChartRadarLinesOnly;
