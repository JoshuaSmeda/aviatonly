import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPieinteractive from "./code/interactivecode";

const ChartPieInteractive = () => {
  return (
    <>
      <CodePreview
        component={<ChartPieinteractive />}
        title="Interactive"
        filePath="/app/components/charts/shadcn/pie/code/interactivecode.tsx"
      />
    </>
  );
};

export default ChartPieInteractive;
