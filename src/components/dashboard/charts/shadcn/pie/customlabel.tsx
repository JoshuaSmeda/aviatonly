import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPieLabelcustom from "./code/piecustomlabelcode";

const ChartPieLabelCustom = () => {
  return (
    <>
      <CodePreview
        component={<ChartPieLabelcustom />}
        title="Custom Label"
        filePath="/app/components/charts/shadcn/pie/code/piecustomlabelcode.tsx"
      />
    </>
  );
};

export default ChartPieLabelCustom;
