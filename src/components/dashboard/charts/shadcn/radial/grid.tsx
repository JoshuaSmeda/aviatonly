import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadialgrid from "./code/radial-gridcode";

const ChartRadialGrid = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadialgrid />}
        title="Grid"
        filePath="/app/components/charts/shadcn/radial/code/radial-gridcode.tsx"
      />
    </>
  );
};

export default ChartRadialGrid;
