import CodePreview from "@/app/components/shared/code-preview";
import ChartBarlabel from "./code/barlabelcode";

const ChartBarLabel = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarlabel />}
        title="Label"
        filePath="/app/components/charts/shadcn/bar/code/barlabelcode.tsx"
      />
    </>
  );
};

export default ChartBarLabel;
