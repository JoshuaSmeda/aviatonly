import CodePreview from "@/app/components/shared/code-preview";
import ChartRadarGridfill from "./code/gridfilledcode";

const ChartRadarGridFill = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarGridfill />}
        title="Grid Filled"
        filePath="/app/components/charts/shadcn/radar/code/gridfilledcode.tsx"
      />
    </>
  );
};

export default ChartRadarGridFill;
