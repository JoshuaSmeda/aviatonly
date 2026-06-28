import CodePreview from "@/app/components/shared/code-preview";
import ChartRadardefault from "./code/defaultcode";

const ChartRadarDefault = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadardefault />}
        title="Default"
        filePath="/app/components/charts/shadcn/radar/code/defaultcode.tsx"
      />
    </>
  );
};

export default ChartRadarDefault;
