import CodePreview from "@/app/components/shared/code-preview";
import ChartRadardots from "./code/dotscode";

const ChartRadarDots = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadardots />}
        title="Dots"
        filePath="/app/components/charts/shadcn/radar/code/dotscode.tsx"
      />
    </>
  );
};

export default ChartRadarDots;
