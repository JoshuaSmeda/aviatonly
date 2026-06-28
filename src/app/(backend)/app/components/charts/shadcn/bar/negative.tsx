import CodePreview from "@/app/components/shared/code-preview";
import ChartBarnegative from "./code/barnegativecode";

const ChartBarNegative = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarnegative />}
        title="Negative"
        filePath="/app/components/charts/shadcn/bar/code/barnegativecode.tsx"
      />
    </>
  );
};

export default ChartBarNegative;
