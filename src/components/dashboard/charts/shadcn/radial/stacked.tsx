import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartRadialstacked from "./code/radial-stackedcode";

const ChartRadialStacked = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadialstacked />}
        title="Stacked"
        filePath="/app/components/charts/shadcn/radial/code/radial-stackedcode.tsx"
      />
    </>
  );
};

export default ChartRadialStacked;
