import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartPiedefault from "./code/piedefaultcode";

const ChartPieDefault = () => {
  return (
    <>
      <CodePreview
        component={<ChartPiedefault />}
        title="Default"
        filePath="/app/components/charts/shadcn/pie/code/piedefaultcode.tsx"
      />
    </>
  );
};

export default ChartPieDefault;
