import CodePreview from "@/app/components/shared/code-preview";
import ChartPieLabellist from "./code/labellistcode";

const ChartPieLabelList = () => {
  return (
    <>
      <CodePreview
        component={<ChartPieLabellist />}
        title="Label List"
        filePath="/app/components/charts/shadcn/pie/code/labellistcode.tsx"
      />
    </>
  );
};

export default ChartPieLabelList;
