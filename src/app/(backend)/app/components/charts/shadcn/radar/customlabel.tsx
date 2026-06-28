import CodePreview from "@/app/components/shared/code-preview";
import ChartRadarLabelcustom from "./code/customlabelcode";

const ChartRadarLabelCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarLabelcustom />}
        title="Custom Label"
        filePath="/app/components/charts/shadcn/radar/code/customlabelcode.tsx"
      />
    </>
  );
};

export default ChartRadarLabelCustom;
