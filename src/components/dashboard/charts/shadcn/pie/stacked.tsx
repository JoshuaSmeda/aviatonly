import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPiestacked from "./code/stackedcode";

const ChartPieStacked = () => {
  return (
    <>
      <CodePreview
        component={<ChartPiestacked />}
        title="Stacked"
        filePath="/app/components/charts/shadcn/pie/code/stackedcode.tsx"
      />
    </>
  );
};

export default ChartPieStacked;
