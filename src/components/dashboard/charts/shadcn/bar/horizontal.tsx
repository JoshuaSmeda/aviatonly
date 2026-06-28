import CodePreview from "@/components/dashboard/shared/code-preview";
import ChartBarhorizontal from "./code/barhorizontalcode";

const ChartBarHorizontal = () => {
  return (
    <>
      <CodePreview
        component={<ChartBarhorizontal />}
        title="Horizontal"
        filePath="/app/components/charts/shadcn/bar/code/barhorizontalcode.tsx"
      />
    </>
  );
};

export default ChartBarHorizontal;
