import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPielegend from "./code/legendcode";

const ChartPieLegend = () => {
  return (
    <>
      <CodePreview
        component={<ChartPielegend />}
        title="Legend"
        filePath="/app/components/charts/shadcn/pie/code/legendcode.tsx"
      />
    </>
  );
};

export default ChartPieLegend;
