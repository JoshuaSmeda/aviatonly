import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadarlegend from "./code/legendcode";

const ChartRadarLegend = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarlegend />}
        title="Legend"
        filePath="/app/components/charts/shadcn/radar/code/legendcode.tsx"
      />
    </>
  );
};

export default ChartRadarLegend;
