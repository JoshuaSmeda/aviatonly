import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartAreadefault from "./code/defaultcode";

const ChartAreaDefault = () => {
  return (
    <>
      <CodePreview
        component={<ChartAreadefault />}
        title="Default"
        filePath="/app/components/charts/shadcn/area/code/defaultcode.tsx"
      />
    </>
  );
};

export default ChartAreaDefault;
