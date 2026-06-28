import CodePreview from "@/app/components/shared/code-preview";
import ChartRadialtext from "./code/radial-textcode";

const ChartRadialText = () => {
  return (
    <>
      <CodePreview
        component={<ChartRadialtext />}
        title="Text"
        filePath="/app/components/charts/shadcn/radial/code/radial-textcode.tsx"
      />
    </>
  );
};

export default ChartRadialText;
