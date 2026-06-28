import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadarGridnone from "./code/gridnonecode";

const ChartRadarGridNone = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadarGridnone />}
        title="Grid None"
        filePath="/app/components/charts/shadcn/radar/code/gridnonecode.tsx"
      />
    </>
  );
};

export default ChartRadarGridNone;
