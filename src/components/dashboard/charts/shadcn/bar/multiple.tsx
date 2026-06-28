import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartBarmultiple from "./code/barmultiplecode";

const ChartBarMultiple = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarmultiple />}
        title="Multiple"
        filePath="/app/components/charts/shadcn/bar/code/barmultiplecode.tsx"
      />
    </>
  );
};

export default ChartBarMultiple;
