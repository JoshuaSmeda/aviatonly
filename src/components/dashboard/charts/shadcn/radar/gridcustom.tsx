import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadarGridcustom from "./code/gridcustomcode";

const ChartRadarGridCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarGridcustom />}
        title="Grid Custom"
        filePath="/app/components/charts/shadcn/radar/code/gridcustomcode.tsx"
      />
    </>
  );
};

export default ChartRadarGridCustom;
